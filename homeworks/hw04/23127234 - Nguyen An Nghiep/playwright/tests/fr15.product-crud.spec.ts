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
const ADMIN_URL = process.env.ADMIN_BASE_URL ?? "http://localhost:5174";
const ADMIN_EMAIL = "admin@eshop.com";
const ADMIN_PASSWORD = "Admin123!";

interface Product {
  id: number;
  name: string;
  price: number | string;
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
    | "delete";
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
  await page.locator("li").nth(2).click();
  await expect(page.locator("form").filter({ hasText: /sản phẩm/i })).toBeVisible();
}

async function reloadProducts(page: Page): Promise<void> {
  await page.reload();
  await expect(page.getByText("EShop Admin")).toBeVisible();
  await page.locator("li").nth(2).click();
}

async function products(request: APIRequestContext): Promise<Product[]> {
  const response = await request.get(`${API_URL}/api/products`);
  expect(response.status()).toBe(200);
  return response.json();
}

async function createProductApi(
  request: APIRequestContext,
  name: string,
  price = 100000,
): Promise<number> {
  const response = await request.post(`${API_URL}/api/products`, {
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
  id: number,
): Promise<void> {
  await request.delete(`${API_URL}/api/products/${id}`);
}

async function cleanupByName(
  request: APIRequestContext,
  name: string,
): Promise<void> {
  if (!name) return;
  const matches = (await products(request)).filter(
    (product) => product.name === name,
  );
  for (const product of matches) await deleteProductApi(request, product.id);
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
      await loginAndOpenProducts(page);

      if (row.Action === "missing-category") {
        const category = page.locator("form select");
        await expect(category.locator('option[value=""]')).toHaveCount(1);
        await expect(category).toHaveAttribute("required", "");
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
          if (name) await form.getByPlaceholder(/tên sản phẩm/i).fill(name);
          const priceInput = form.getByPlaceholder(/giá tiền/i);
          if (row.Price === "abc") {
            await priceInput.pressSequentially("abc");
          } else {
            await priceInput.fill(row.Price);
          }

          const responsePromise = page
            .waitForResponse(
              (response) =>
                response.url().endsWith("/api/products") &&
                response.request().method() === "POST",
              { timeout: 1500 },
            )
            .catch(() => null);
          await form.getByRole("button", { name: /lưu sản phẩm/i }).click();
          const response = await responsePromise;
          const matches = (await products(request)).filter(
            (product) => product.name === name,
          );

          if (row.Expected === "created") {
            expect(response?.status()).toBe(200);
            expect(matches.length).toBeGreaterThan(0);
            await expect(rowByName(page, name)).toBeVisible();
            await expect(rowByName(page, name)).toContainText(name);
          } else {
            expect(matches).toHaveLength(0);
          }
        } finally {
          await cleanupByName(request, name);
        }
        return;
      }

      const productId = await createProductApi(request, name);
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
          await targetRow.getByRole("button").first().click();
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
          await targetRow.getByRole("button").first().click();
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
        await targetRow.getByRole("button").nth(1).click();
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        await expect(rowByName(page, name)).toHaveCount(0);
        const remaining = (await products(request)).filter(
          (product) => product.id === productId,
        );
        expect(remaining).toHaveLength(0);
      } finally {
        await deleteProductApi(request, productId);
      }
    });
  }
});
