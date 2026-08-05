import { test, expect } from "@playwright/test";
import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:5174";
const ADMIN_EMAIL = "admin@eshop.com";
const ADMIN_PASSWORD = "Admin123!";

interface CategoryTestData {
  "Data ID": string;
  "Category Name": string;
}

const csvPath = path.join(__dirname, "../test-data/fr14.csv");
const csvContent = fs.readFileSync(csvPath, "utf-8");
const testData: CategoryTestData[] = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
});

async function loginAsAdmin(page: import("@playwright/test").Page) {
  await page.goto(BASE_URL);
  await page.getByPlaceholder("Email").fill(ADMIN_EMAIL);
  await page.getByPlaceholder("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Login" }).click();
}

async function goToCategories(page: import("@playwright/test").Page) {
  await page.locator("li", { hasText: "Danh mục" }).click();
}

test.describe("Category Management - Run by: 23127097", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await goToCategories(page);
  });

  test("TC-01 Verify admin can view categories", async ({ page }) => {
    const rows = page.locator("table tbody tr");
    await expect(rows.first()).toBeVisible();
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);
    await expect(rows.first().locator("button", { hasText: "Xóa" })).toBeVisible();
  });

  test("TC-02 Verify admin can delete a category", async ({ page }) => {
    const rows = page.locator("table tbody tr");
    const initialCount = await rows.count();
    const firstRowText = await rows.first().locator("td").nth(1).textContent();

    page.once("dialog", (dialog) => dialog.accept());
    await rows.first().locator("button", { hasText: "Xóa" }).click();

    await expect(rows).toHaveCount(initialCount - 1);
    if (firstRowText !== null) {
      await expect(rows.first().locator("td").nth(1)).not.toHaveText(firstRowText);
    }
  });

  test("TC-03 Verify delete button has a confirmation dialog", async ({ page }) => {
    let dialogAppeared = false;
    page.once("dialog", async (dialog) => {
      dialogAppeared = true;
      await dialog.dismiss();
    });

    const rows = page.locator("table tbody tr");
    await rows.first().locator("button", { hasText: "Xóa" }).click();
    await page.waitForTimeout(500);

    expect(dialogAppeared).toBeTruthy();
  });
});

test.describe("Category Management Data-Driven - Run by: 23127097", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await goToCategories(page);
  });

  for (const row of testData) {
    const dataId = row["Data ID"];
    const categoryName = row["Category Name"];

    test(`${dataId} - Category creation validation with input "${categoryName}"`, async ({ page }) => {
      const rows = page.locator("table tbody tr");
      const initialCount = await rows.count();

      await page.locator('input[placeholder="Tên danh mục mới"]').fill(categoryName);
      await page.locator("button", { hasText: "Thêm mới" }).click();
      await page.waitForTimeout(500);

      switch (dataId) {
        case "DT01": // TC-04: valid category name
        case "DT02": // TC-05: Vietnamese name
        case "DT03": // TC-06: numbers and symbols
        case "DT04": // TC-07: special characters
          await expect(rows).toHaveCount(initialCount + 1);
          await expect(page.locator("table tbody")).toContainText(categoryName);
          break;

        case "DT05": // TC-08: empty name rejected
        case "DT06": // TC-09: whitespace name rejected
        case "DT07": // TC-10: duplicate name rejected
          await expect(rows).toHaveCount(initialCount);
          break;

        case "DT08": { // TC-11: long name truncated with ellipsis
          await expect(rows).toHaveCount(initialCount + 1);
          const newCell = rows.last().locator("td").nth(1);
          const overflowStyle = await newCell.evaluate(
            (el) => getComputedStyle(el).textOverflow,
          );
          expect(overflowStyle).toBe("ellipsis");
          break;
        }

        case "DT09": { // TC-12: sanitize category name, rendered as text not HTML
          await expect(rows).toHaveCount(initialCount + 1);
          const newCell = rows.last().locator("td").nth(1);
          await expect(newCell).toHaveText(categoryName);
          const childElementCount = await newCell.evaluate(
            (el) => el.children.length,
          );
          expect(childElementCount).toBe(0);
          break;
        }
      }
    });
  }
});