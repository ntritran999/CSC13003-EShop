import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:5173';

interface CsvRow {
  'Data ID': string;
  'Quantity': string;
  'Item Name': string;
}

test.describe('FR-07 Shopping Cart Tests - Run by: 23127097', () => {

  test('TC-01 Verify shopping cart page has correct columns', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('button:has-text("Thêm vào giỏ")').first().click();
    await page.locator('a:has-text("Giỏ hàng")').click();

    const headerRow = page.locator('table thead tr');
    await expect(headerRow).toContainText('Sản phẩm');
    await expect(headerRow).toContainText('Đơn giá');
    await expect(headerRow).toContainText('Số lượng');
    await expect(headerRow).toContainText('Thành tiền');
    await expect(headerRow).toContainText('Thao tác');
    await expect(headerRow.getByText('+', { exact: true })).toBeVisible();
    await expect(headerRow.getByText('-', { exact: true })).toBeVisible();
  });

  test('TC-02 Verify shopping cart not add new row when adding the same product', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('button:has-text("Thêm vào giỏ")').first().click();
    await page.locator('button:has-text("Thêm vào giỏ")').first().click();
    await page.locator('a:has-text("Giỏ hàng")').click();

    const rows = page.locator('table tbody tr');
    await expect(rows).toHaveCount(1);
  });

  test('TC-03 Verify a back-to-home button exists on shopping cart page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('a:has-text("Giỏ hàng")').click();

    const backLink = page.locator('a:has-text("Tiếp tục mua sắm")');
    await expect(backLink).toBeVisible();
  });

  test('TC-04 Verify total amount has correct label', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('button:has-text("Thêm vào giỏ")').first().click();
    await page.locator('a:has-text("Giỏ hàng")').click();

    await expect(page.locator('body')).not.toContainText('Tổng tạm tính');
    const totalLabel = page.locator('text=Tổng cộng');
    await expect(totalLabel).toBeVisible();
  });

  test('TC-05 Verify empty cart has clear message', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('a:has-text("Giỏ hàng")').click();

    await expect(page.getByText('Giỏ hàng của bạn đang trống')).toBeVisible();
  });

});

// Data-driven test cases
const csvPath = path.join(__dirname, '../test-data/fr07.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const records: CsvRow[] = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
});

test.describe('FR-07 Shopping Cart Quantity Validation (Data-Driven) - Run by: 23127097', () => {

  for (const record of records) {
    const dataId = record['Data ID'];
    const quantity = record['Quantity'];

    test(`${dataId} Verify quantity input value: ${quantity}`, async ({ page }) => {
      await page.goto(BASE_URL);
      await page.locator('a:has-text("Xem chi tiết")').first().click();

      const quantityInput = page.locator('input[type="number"]');
      await quantityInput.fill(quantity);

      const addButton = page.locator('button:has-text("Thêm vào giỏ hàng")');
      await addButton.click();
      await addButton.click();

      await page.locator('a:has-text("Giỏ hàng")').click();

      const numericQuantity = Number(quantity);
      const isValid = Number.isInteger(numericQuantity) && numericQuantity > 0;

      if (isValid) {
        const rows = page.locator('table tbody tr');
        await expect(rows).toHaveCount(1);
        const quantityCell = rows.first().locator('td').nth(2);
        await expect(quantityCell).toHaveText(String(numericQuantity));
      } else {
        await expect(page.getByText('Giỏ hàng của bạn đang trống')).toBeVisible();
      }
    });
  }

});