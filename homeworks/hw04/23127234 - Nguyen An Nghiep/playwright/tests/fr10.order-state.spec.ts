import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from "@playwright/test";
import { parse } from "csv-parse/sync";
import fs from "node:fs";
import path from "node:path";

const API_URL = process.env.API_BASE_URL ?? "http://localhost:3000";
const WEB_URL = process.env.CUSTOMER_BASE_URL ?? "http://localhost:5173";
const ADMIN_URL = process.env.ADMIN_BASE_URL ?? "http://localhost:5174";
const ADMIN_EMAIL = "admin@eshop.com";
const ADMIN_PASSWORD = "Admin123!";
const USER_EMAIL = "test@eshop.com";
const USER_PASSWORD = "Test1234!";

interface Fr10Row {
  "Test ID": string;
  Actor: "admin" | "user" | "unauthenticated";
  "Start State": "pending" | "confirmed" | "shipping" | "delivered" | "canceled";
  Action: string;
  Channel: "admin-ui" | "user-ui" | "api";
  "Expected Status": string;
  "Expected HTTP": string;
}

const rows: Fr10Row[] = parse(
  fs.readFileSync(path.resolve(__dirname, "../test-data/fr10.csv"), "utf8"),
  { columns: true, skip_empty_lines: true, trim: true },
);

async function loginApi(
  request: APIRequestContext,
  email: string,
  password: string,
): Promise<string> {
  const response = await request.post(`${API_URL}/api/login`, {
    data: { email, password },
  });
  expect(response.status()).toBe(200);
  return (await response.json()).token;
}

async function updateStatus(
  request: APIRequestContext,
  adminToken: string,
  orderId: number,
  status: string,
) {
  return request.put(`${API_URL}/api/admin/orders/${orderId}/status`, {
    headers: { Authorization: `Bearer ${adminToken}` },
    data: { status },
  });
}

async function createOrder(
  request: APIRequestContext,
  userToken: string,
  testId: string,
  browser: string,
): Promise<number> {
  const response = await request.post(`${API_URL}/api/checkout`, {
    headers: { Authorization: `Bearer ${userToken}` },
    data: {
      total_amount: 23127234,
      shipping_address: `HW04 ${testId} ${browser}`,
    },
  });
  expect(response.status()).toBe(200);
  return (await response.json()).orderId;
}

async function prepareState(
  request: APIRequestContext,
  adminToken: string,
  orderId: number,
  state: Fr10Row["Start State"],
): Promise<void> {
  const transitions: Record<Fr10Row["Start State"], string[]> = {
    pending: [],
    confirmed: ["confirmed"],
    shipping: ["confirmed", "shipping"],
    delivered: ["confirmed", "shipping", "delivered"],
    canceled: ["canceled"],
  };

  for (const target of transitions[state]) {
    const response = await updateStatus(request, adminToken, orderId, target);
    expect(response.status()).toBe(200);
  }
}

async function readStatus(
  request: APIRequestContext,
  orderId: number,
): Promise<string> {
  const response = await request.get(`${API_URL}/api/orders/${orderId}`);
  expect(response.status()).toBe(200);
  return (await response.json()).status;
}

async function loginAdminUi(page: Page): Promise<void> {
  await page.goto(ADMIN_URL);
  await page.getByPlaceholder("Email").fill(ADMIN_EMAIL);
  await page.getByPlaceholder("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByText("EShop Admin")).toBeVisible();
  await page.locator("li").nth(4).click();
}

async function loginUserUi(page: Page): Promise<void> {
  await page.goto(`${WEB_URL}/login`);
  const textInputs = page.locator('input[type="text"]');
  await textInputs.first().fill(USER_EMAIL);
  await textInputs.nth(1).fill(USER_PASSWORD);
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(`${WEB_URL}/`);
  await page.goto(`${WEB_URL}/profile`);
}

function adminTargetFor(action: string): string {
  const targetByAction: Record<string, string> = {
    "force-shipping": "shipping",
    "force-pending": "pending",
    "force-canceled": "canceled",
    "force-delivered": "delivered",
    confirm: "confirmed",
  };
  return targetByAction[action];
}

test.describe("FR-10 Order State Machine - Run by: 23127234", () => {
  for (const row of rows) {
    test(`${row["Test ID"]} - ${row["Start State"]} -> ${row.Action}`, async ({
      page,
      request,
    }, testInfo) => {
      const adminToken = await loginApi(request, ADMIN_EMAIL, ADMIN_PASSWORD);
      const userToken = await loginApi(request, USER_EMAIL, USER_PASSWORD);
      const orderId = await createOrder(
        request,
        userToken,
        row["Test ID"],
        testInfo.project.name,
      );
      await prepareState(
        request,
        adminToken,
        orderId,
        row["Start State"],
      );

      const expectedStatus = row["Expected Status"].trim();
      const expectedHttp = Number(row["Expected HTTP"]);

      if (row.Channel === "api") {
        const token = row.Actor === "unauthenticated" ? undefined : adminToken;
        const response = await request.put(
          `${API_URL}/api/admin/orders/${orderId}/status`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            data: { status: adminTargetFor(row.Action) },
          },
        );

        expect(response.status()).toBe(expectedHttp);
        expect(await readStatus(request, orderId)).toBe(expectedStatus);
        return;
      }

      if (row.Channel === "admin-ui") {
        await loginAdminUi(page);
        const orderRow = page
          .locator("table tbody tr")
          .filter({
            has: page.getByRole("cell", {
              name: `#${orderId}`,
              exact: true,
            }),
          });
        await expect(orderRow).toBeVisible();
        const buttons = orderRow.locator("button");

        if (row.Action === "cancel" && row["Start State"] === "shipping") {
          expect.soft(await buttons.count()).toBe(2);
          expect(await readStatus(request, orderId)).toBe(expectedStatus);
          return;
        }

        if (row.Action === "force-delivered") {
          const count = await buttons.count();
          expect.soft(count).toBe(0);
          if (count > 0) {
            const responsePromise = page.waitForResponse(
              (response) =>
                response.url().includes(`/api/admin/orders/${orderId}/status`) &&
                response.request().method() === "PUT",
            );
            await buttons.first().click();
            const response = await responsePromise;
            expect.soft(response.status()).toBe(expectedHttp);
          }
          expect(await readStatus(request, orderId)).toBe(expectedStatus);
          return;
        }

        const buttonIndex =
          row.Action === "cancel" &&
          (row["Start State"] === "pending" ||
            row["Start State"] === "confirmed")
            ? 1
            : 0;
        await expect(buttons.nth(buttonIndex)).toBeVisible();
        const responsePromise = page.waitForResponse(
          (response) =>
            response.url().includes(`/api/admin/orders/${orderId}/status`) &&
            response.request().method() === "PUT",
        );
        await buttons.nth(buttonIndex).click();
        const response = await responsePromise;
        expect(response.status()).toBe(expectedHttp);
        await expect
          .poll(() => readStatus(request, orderId))
          .toBe(expectedStatus);
        await expect(orderRow.locator("td").nth(4)).toContainText(
          {
            confirmed: "Đã xác nhận",
            shipping: "Đang giao",
            delivered: "Đã giao",
            canceled: "Đã hủy",
          }[expectedStatus] ?? expectedStatus,
        );
        return;
      }

      await loginUserUi(page);
      const orderRow = page
        .locator("table tbody tr")
        .filter({
          has: page.getByRole("cell", {
            name: `#${orderId}`,
            exact: true,
          }),
        });
      await expect(orderRow).toBeVisible();
      const cancelButton = orderRow.locator("button");

      if (row["Start State"] === "shipping") {
        const count = await cancelButton.count();
        expect.soft(count).toBe(0);
        if (count > 0) {
          const dialogPromise = page
            .waitForEvent("dialog")
            .then((dialog) => dialog.accept());
          const responsePromise = page.waitForResponse(
            (response) =>
              response.url().includes(`/api/orders/${orderId}/cancel`) &&
              response.request().method() === "PUT",
          );
          await cancelButton.click();
          const response = await responsePromise;
          await dialogPromise;
          expect.soft(response.status()).toBe(expectedHttp);
        }
        expect(await readStatus(request, orderId)).toBe(expectedStatus);
        return;
      }

      await expect(cancelButton).toHaveCount(1);
      const dialogPromise = page
        .waitForEvent("dialog")
        .then((dialog) => dialog.accept());
      const responsePromise = page.waitForResponse(
        (response) =>
          response.url().includes(`/api/orders/${orderId}/cancel`) &&
          response.request().method() === "PUT",
      );
      await cancelButton.click();
      const response = await responsePromise;
      await dialogPromise;
      expect(response.status()).toBe(expectedHttp);
      await expect.poll(() => readStatus(request, orderId)).toBe(expectedStatus);
    });
  }
});
