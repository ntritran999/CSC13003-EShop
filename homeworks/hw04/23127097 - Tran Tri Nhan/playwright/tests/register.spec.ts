import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5173/register';
const CSV_FILE = '../test-data/fr01.csv';

interface TestRow {
  'Data ID': string;
  'Full name': string;
  Email: string;
  Password: string;
}

const csvContent = fs.readFileSync(path.resolve(__dirname, CSV_FILE), 'utf-8');
const rows: TestRow[] = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
});

const WEAK_PASSWORD_MSG =
  'Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT.';
const REGISTER_FAIL_MSG = 'Đăng ký thất bại.';

// Maps Data ID (DT01..DT11) to the corresponding test case's expected outcome
type Outcome = 'success' | 'nativeOrFail' | 'fail' | 'nativeOrWeak' | 'weak';

const outcomeById: Record<string, Outcome> = {
  DT01: 'success',
  DT02: 'nativeOrFail',
  DT03: 'nativeOrFail',
  DT04: 'fail',
  DT05: 'fail',
  DT06: 'nativeOrWeak',
  DT07: 'weak',
  DT08: 'weak',
  DT09: 'weak',
  DT10: 'weak',
  DT11: 'weak',
};

test.describe('Register Page - Data Driven Tests. Run by: 23127097', () => {
  for (const row of rows) {
    const dataId = row['Data ID'];
    const fullName = row['Full name'];
    const email = row['Email'];
    const password = row['Password'];
    const outcome = outcomeById[dataId];

    test(`${dataId} - Register with given data`, async ({ page }) => {
      await page.goto(BASE_URL);

      const nameInput = page.locator('input[type="text"]').first();
      const emailInput = page.locator('input[type="text"]').nth(1);
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');

      if (fullName) await nameInput.fill(fullName);
      if (email) await emailInput.fill(email);
      if (password) await passwordInput.fill(password);

      await submitButton.click();

      if (outcome === 'success') {
        await expect(page).toHaveURL(/\/login$/);
      } else if (outcome === 'nativeOrFail') {
        const isInvalid = await nameInput.evaluate((el: HTMLInputElement) => !el.checkValidity())
          .catch(() => false);
        const emailInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.checkValidity())
          .catch(() => false);
        if (!fullName || !email) {
          expect(isInvalid || emailInvalid).toBeTruthy();
        } else {
          await expect(page.locator('div.bg-red-100')).toContainText(REGISTER_FAIL_MSG);
        }
      } else if (outcome === 'fail') {
        await expect(page.locator('div.bg-red-100')).toContainText(REGISTER_FAIL_MSG);
      } else if (outcome === 'nativeOrWeak') {
        const passwordInvalid = await passwordInput.evaluate(
          (el: HTMLInputElement) => !el.checkValidity()
        ).catch(() => false);
        if (!password) {
          expect(passwordInvalid).toBeTruthy();
        } else {
          await expect(page.locator('div.bg-red-100')).toHaveText(WEAK_PASSWORD_MSG);
        }
      } else if (outcome === 'weak') {
        await expect(page.locator('div.bg-red-100')).toHaveText(WEAK_PASSWORD_MSG);
      }
    });
  }
});

test.describe('Register Page - Normal Tests. Run by: 23127097', () => {
  test('TC-12 - Verify confirm password field exists', async ({ page }) => {
    await page.goto(BASE_URL);

    const confirmPasswordLabel = page.locator('label', { hasText: 'Xác nhận mật khẩu' });
    await expect(confirmPasswordLabel).toBeVisible();
  });
});