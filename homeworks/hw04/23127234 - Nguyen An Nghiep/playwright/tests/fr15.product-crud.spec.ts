import {
  expect,
  test,
  type APIRequestContext,
  type Locator,
  type Page,
  type Request,
} from "@playwright/test";
import { parse } from "csv-parse/sync";
import fs from "node:fs";
import path from "node:path";

const API_URL = process.env.API_BASE_URL ?? "http://localhost:3000";
const ADMIN_URL = process.env.ADMIN_BASE_URL ?? "http://localhost:5174";
const ADMIN_EMAIL = "admin@eshop.com";
const ADMIN_PASSWORD = "Admin123!";
const USER_EMAIL = "test@eshop.com";
const USER_PASSWORD = "Test1234!";

interface Product {
  id: number;
  name: string;
  price: number | string;
  category_id: number | string;
}

interface Fr15Row {
  "Test ID": string;
  Action:
    | "create"
    | "missing-category"
    | "invalid-category"
    | "view"
    | "update-isolation"
    | "cancel-edit"
    | "delete"
    | "unauth-create"
    | "user-update"
    | "user-delete";
  Name: string;
  "Name Length": string;
  Price: string;
  Category: string;
  Expected: string;
}

const rows: Fr15Row[] = parse(
  fs.readFileSync(path.resolve(__dirname, "../test-data/fr15.csv"), "utf8"),
  { columns: true, skip_empty_lines: true, trim: true },
);

async function loginAndOpenProducts(page: Page): Promise<void> {
  await page.goto(ADMIN_URL);
  await page.getByPlaceholder("Email").fill(ADMIN_EMAIL);
  await page.getByPlaceholder("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByText("EShop Admin")).toBeVisible();
  await page.getByText("Sản phẩm", { exact: true }).click();
  await expect(page.locator("form").filter({ hasText: /sản phẩm/i })).toBeVisible();
}

async function reloadProducts(page: Page): Promise<void> {
  await page.reload();
  await expect(page.getByText("EShop Admin")).toBeVisible();
  await page.getByText("Sản phẩm", { exact: true }).click();
}

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

async function products(request: APIRequestContext): Promise<Product[]> {
  const response = await request.get(`${API_URL}/api/products`);
  expect(response.status()).toBe(200);
  return response.json();
}

async function createProductApi(
  request: APIRequestContext,
  adminToken: string,
  name: string,
  price = 100000,
): Promise<number> {
  const response = await request.post(`${API_URL}/api/products`, {
    headers: { Authorization: `Bearer ${adminToken}` },
    data: {
      name,
      price,
      description: "HW04 Playwright data",
      imageUrl: "https://placehold.co/100",
      category_id: 1,
    },
  });
  expect(response.status()).toBe(200);
  return (await response.json()).id;
}

async function deleteProductApi(
  request: APIRequestContext,
  adminToken: string,
  id: number,
): Promise<void> {
  const response = await request.delete(`${API_URL}/api/products/${id}`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  expect(response.status()).toBe(200);
}

async function cleanupByName(
  request: APIRequestContext,
  adminToken: string,
  name: string,
): Promise<void> {
  if (!name) return;
  const matches = (await products(request)).filter(
    (product) => product.name === name,
  );
  for (const product of matches) {
    await deleteProductApi(request, adminToken, product.id);
  }
  const remaining = (await products(request)).filter(
    (product) => product.name === name,
  );
  expect(remaining).toHaveLength(0);
}

async function selectCsvCategory(
  form: Locator,
  categoryStrategy: string,
): Promise<number> {
  if (categoryStrategy !== "first") {
    throw new Error(`Unsupported create category strategy: ${categoryStrategy}`);
  }
  const category = form.locator("select");
  const firstValue = await category
    .locator('option:not([value=""])')
    .first()
    .getAttribute("value");
  expect(firstValue).not.toBeNull();
  await category.selectOption(firstValue!);
  return Number(firstValue);
}

function productName(row: Fr15Row, browser: string): string {
  const length = row["Name Length"] ? Number(row["Name Length"]) : undefined;
  if (length === 0) return "";
  if (length !== undefined) {
    const prefix = `${row["Test ID"]}-${browser}-`;
    return (prefix + "x".repeat(length)).slice(0, length);
  }
  return `${row.Name}-${row["Test ID"]}-${browser}`;
}

function rowByName(page: Page, name: string) {
  return page.locator("table tbody tr").filter({
    has: page.getByRole("cell", { name, exact: true }),
  });
}

test.describe("FR-15 Product CRUD - Run by: 23127234", () => {
  for (const row of rows) {
    test(`${row["Test ID"]} - ${row.Action} - ${row.Expected}`, async ({
      page,
      request,
    }, testInfo) => {
      const name = productName(row, testInfo.project.name);
      const adminToken = await loginApi(request, ADMIN_EMAIL, ADMIN_PASSWORD);
      await cleanupByName(request, adminToken, name);
      if (name) {
        await cleanupByName(request, adminToken, `${name}-updated`);
        await cleanupByName(request, adminToken, `${name}-user-update`);
      }

      if (row.Action === "unauth-create") {
        try {
          const response = await request.post(`${API_URL}/api/products`, {
            data: {
              name,
              price: Number(row.Price),
              description: "HW04 unauthenticated authorization check",
              imageUrl: "https://placehold.co/100",
              category_id: 1,
            },
          });
          expect.soft(response.status()).toBe(401);
          const matches = (await products(request)).filter(
            (product) => product.name === name,
          );
          expect(matches).toHaveLength(0);
        } finally {
          await cleanupByName(request, adminToken, name);
        }
        return;
      }

      if (row.Action === "user-update" || row.Action === "user-delete") {
        const userToken = await loginApi(request, USER_EMAIL, USER_PASSWORD);
        const productId = await createProductApi(
          request,
          adminToken,
          name,
          Number(row.Price),
        );
        try {
          if (row.Action === "user-update") {
            const response = await request.put(
              `${API_URL}/api/products/${productId}`,
              {
                headers: { Authorization: `Bearer ${userToken}` },
                data: {
                  name: `${name}-user-update`,
                  price: Number(row.Price),
                  description: "Unauthorized regular-user update",
                  imageUrl: "https://placehold.co/100",
                  category_id: 1,
                },
              },
            );
            expect.soft(response.status()).toBe(403);
            const stored = (await products(request)).filter(
              (product) => product.id === productId,
            );
            expect(stored).toHaveLength(1);
            expect(stored[0].name).toBe(name);
          } else {
            const response = await request.delete(
              `${API_URL}/api/products/${productId}`,
              {
                headers: { Authorization: `Bearer ${userToken}` },
              },
            );
            expect.soft(response.status()).toBe(403);
            const stored = (await products(request)).filter(
              (product) => product.id === productId,
            );
            expect(stored).toHaveLength(1);
          }
        } finally {
          await deleteProductApi(request, adminToken, productId);
        }
        return;
      }

      await loginAndOpenProducts(page);

      if (row.Action === "missing-category") {
        const category = page.locator("form select");
        await expect.soft(category.locator('option[value=""]')).toHaveCount(1);
        await expect.soft(category).toHaveAttribute("required", "");
        return;
      }

      if (row.Action === "invalid-category") {
        const category = page.locator("form select");
        await expect(category.locator('option[value="99999"]')).toHaveCount(0);
        await expect(category).not.toHaveValue("99999");
        return;
      }

      if (row.Action === "create") {
        try {
          const form = page.locator("form").filter({ hasText: /sản phẩm/i });
          const nameInput = form.getByPlaceholder(/tên sản phẩm/i);
          if (name) await nameInput.fill(name);
          const priceInput = form.getByPlaceholder(/giá tiền/i);
          if (row.Price === "abc") {
            await priceInput.pressSequentially("abc");
          } else {
            await priceInput.fill(row.Price);
          }
          const expectedCategoryId = await selectCsvCategory(form, row.Category);
          const submitButton = form.getByRole("button", {
            name: /lưu sản phẩm/i,
          });
          const formIsValid = await form.evaluate(
            (element: HTMLFormElement) => element.checkValidity(),
          );

          if (row.Expected === "created") {
            expect(formIsValid).toBe(true);
            const [response] = await Promise.all([
              page.waitForResponse(
                (candidate) =>
                  candidate.url().endsWith("/api/products") &&
                  candidate.request().method() === "POST",
              ),
              submitButton.click(),
            ]);
            expect(response.status()).toBe(200);
          } else if (formIsValid) {
            const [response] = await Promise.all([
              page.waitForResponse(
                (candidate) =>
                  candidate.url().endsWith("/api/products") &&
                  candidate.request().method() === "POST",
              ),
              submitButton.click(),
            ]);
            expect.soft(response.status()).toBeGreaterThanOrEqual(400);
            expect.soft(response.status()).toBeLessThan(500);
          } else {
            let postCount = 0;
            const countProductPost = (candidate: Request) => {
              if (
                candidate.url().endsWith("/api/products") &&
                candidate.method() === "POST"
              ) {
                postCount += 1;
              }
            };
            page.on("request", countProductPost);
            await submitButton.click();
            page.off("request", countProductPost);
            expect(postCount).toBe(0);
          }

          const matches = (await products(request)).filter(
            (product) => product.name === name,
          );

          if (row.Expected === "created") {
            expect(matches).toHaveLength(1);
            expect(Number(matches[0].price)).toBe(Number(row.Price));
            expect(Number(matches[0].category_id)).toBe(expectedCategoryId);
            await expect(rowByName(page, name)).toBeVisible();
            await expect(rowByName(page, name)).toContainText(name);
            await expect(rowByName(page, name)).toContainText(row.Price);
            await expect(nameInput).toHaveValue("");
            await expect(priceInput).toHaveValue("");
          } else {
            expect(matches).toHaveLength(0);
          }
        } finally {
          await cleanupByName(request, adminToken, name);
        }
        return;
      }

      const productId = await createProductApi(request, adminToken, name);
      try {
        await reloadProducts(page);
        const targetRow = rowByName(page, name);

        if (row.Action === "view") {
          await expect(targetRow).toBeVisible();
          await expect(targetRow).toContainText(name);
          await expect(targetRow).toContainText("100000");
          return;
        }

        if (row.Action === "update-isolation") {
          await targetRow
            .getByRole("button", { name: "Sửa", exact: true })
            .click();
          const updatedName = `${name}-updated`;
          const form = page.locator("form").filter({ hasText: /sản phẩm/i });
          await form.getByPlaceholder(/tên sản phẩm/i).fill(updatedName);
          const dialogPromise = page
            .waitForEvent("dialog")
            .then((dialog) => dialog.accept());
          await form.getByRole("button", { name: /lưu sản phẩm/i }).click();
          await dialogPromise;

          await expect(rowByName(page, updatedName)).toHaveCount(1);
          await expect(page.locator("table tbody")).toContainText(
            "iPhone 15 Pro Max",
          );
          const stored = (await products(request)).filter(
            (product) => product.name === updatedName,
          );
          expect(stored).toHaveLength(1);
          return;
        }

        if (row.Action === "cancel-edit") {
          await targetRow
            .getByRole("button", { name: "Sửa", exact: true })
            .click();
          const form = page.locator("form").filter({ hasText: /sản phẩm/i });
          await form
            .getByPlaceholder(/tên sản phẩm/i)
            .fill(`${name}-should-not-save`);
          await form.getByRole("button", { name: /hủy sửa/i }).click();
          await expect(form.getByPlaceholder(/tên sản phẩm/i)).toHaveValue("");
          await expect(targetRow).toContainText(name);
          return;
        }

        const responsePromise = page.waitForResponse(
          (response) =>
            response.url().endsWith(`/api/products/${productId}`) &&
            response.request().method() === "DELETE",
        );
        await targetRow
          .getByRole("button", { name: "Xóa", exact: true })
          .click();
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        await expect(rowByName(page, name)).toHaveCount(0);
        const remaining = (await products(request)).filter(
          (product) => product.id === productId,
        );
        expect(remaining).toHaveLength(0);
      } finally {
        await deleteProductApi(request, adminToken, productId);
      }
    });
  }
});
