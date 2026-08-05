import { test, expect, type Page, type Locator } from '@playwright/test';
import adminCouponTestData from '../test-data/adminCouponTestData.json';
import { execSync } from 'child_process';

/**
 * FR-17 - Quản lý Mã Giảm Giá (Admin Coupon CRUD).
 * Admin can Add/View/Delete coupons. Required fields per spec: code (unique),
 * type (percent/fixed), discount_value (dương), expired_at,
 * min_order_amount (>= 0), max_uses_per_user (>= 1).
 *
 * KNOWN TESTABILITY / SPEC DEFECTS (see QA report):
 *  - No id / name / data-testid, and no <label> at all on any field in this
 *    form - only placeholders. Locators below fall back to placeholder/role
 *    text scoped to the coupon <form>, which is the least-fragile option
 *    available today.
 *  - discount_value has no min="0" constraint and min_order_amount has no
 *    `required`/min constraint at all, so zero/negative values reach the
 *    backend unblocked by the client - tests below assert the SPEC-correct
 *    (backend-enforced) outcome, not whatever the current implementation
 *    happens to do.
 *  - Errors on this form use a native `alert()`, not an inline element, so
 *    they must be caught via page.on('dialog') rather than a locator
 *    assertion. This is itself worth flagging against FR-22's "error must
 *    appear above the submit button" requirement - a blocking native alert
 *    doesn't satisfy that intent either.
 */

const ADMIN_BASE_URL = 'http://localhost:5174';
const API_URL = 'http://localhost:3000/api';
const ADMIN_USER = { email: 'admin@eshop.com', password: 'Admin123!' };
const REGULAR_USER = { email: 'test@eshop.com', password: 'Test1234!' };

// Stamps every test with the run owner, same convention as checkout.spec.ts,
// and resets the DB before each test so coupon codes/rows start from a known,
// clean state (sample coupons SAVE10/BIGBUY/VIP100/EXPIRED re-seeded).
test.beforeEach(async ({ }, testInfo) => {
  testInfo.annotations.push({ type: 'Run by', description: '23127168' });
  try {
    const backendPath = '../../../../backend';

    execSync('node database.js', {
      cwd: backendPath,
      stdio: 'ignore',
      shell: process.platform === 'win32' ? 'powershell.exe' : '/bin/sh',
    });
  } catch (error) {
    console.error('Error on reset DB:', error);
  }
});

// ---------------------------------------------------------------------------
// Page Objects
// ---------------------------------------------------------------------------
class AdminLoginPage {
  constructor(private page: Page) {}

  async loginAs(email: string, password: string) {
    await this.page.goto(ADMIN_BASE_URL);
    // Admin login form has no wrapping <div> per field (unlike the customer
    // Login.jsx), and no id/name - fall back to input order within the form.
    await this.page.locator('form input').nth(0).fill(email);
    await this.page.locator('form input[type="password"]').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
    // No route change on login (single-page conditional render, no router
    // here) - assert on the sidebar heading instead of toHaveURL.
    await expect(this.page.getByRole('heading', { name: 'EShop Admin' })).toBeVisible();
  }
}

class AdminCouponPage {
  readonly page: Page;
  readonly couponsTab: Locator;
  readonly form: Locator;
  readonly codeInput: Locator;
  readonly typeSelect: Locator;
  readonly discountValueInput: Locator;
  readonly minOrderAmountInput: Locator;
  readonly expiredAtInput: Locator;
  readonly maxUsesInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.couponsTab = page.getByRole('listitem').filter({ hasText: 'Mã Giảm Giá' });

    this.codeInput = page.getByPlaceholder('Mã coupon (VD: SAVE10)');
    // Scope everything else to the same <form> as codeInput so this page
    // object can't accidentally match a same-shaped field on another tab.
    this.form = page.locator('form').filter({ has: this.codeInput });

    this.typeSelect = this.form.locator('select');
    // Placeholder text is dynamic ("Giá trị %..." vs "Số tiền...") depending
    // on the selected type - regex is the only viable text-based match.
    this.discountValueInput = this.form.getByPlaceholder(/Giá trị %|Số tiền/);
    this.minOrderAmountInput = this.form.getByPlaceholder('Đơn tối thiểu (₫)');
    this.expiredAtInput = this.form.locator('input[type="date"]');
    this.maxUsesInput = this.form.getByPlaceholder('Số lần dùng tối đa/người');
    this.submitButton = this.form.getByRole('button', { name: 'Tạo mã' });
  }

  async open() {
    await this.couponsTab.click();
    await expect(this.form).toBeVisible();
  }

  async fillForm(data: {
    code: string;
    couponType: 'percent' | 'fixed';
    discountValue: number;
    minOrderAmount: number;
    expiredAt: string;
    maxUsesPerUser: number;
  }) {
    await this.codeInput.fill(data.code);
    await this.typeSelect.selectOption(data.couponType);
    await this.discountValueInput.fill(String(data.discountValue));
    await this.minOrderAmountInput.fill(String(data.minOrderAmount));
    await this.expiredAtInput.fill(data.expiredAt);
    await this.maxUsesInput.fill(String(data.maxUsesPerUser));
  }

  /** Submits the form and captures the native alert() this UI uses for errors. */
  async submitExpectingError(): Promise<string> {
    const dialogPromise = this.page.waitForEvent('dialog');
    await this.submitButton.click();
    const dialog = await dialogPromise;
    const message = dialog.message();
    await dialog.accept();
    return message;
  }

  async submitExpectingSuccess() {
    await this.submitButton.click();
  }

  rowFor(code: string): Locator {
    return this.page.getByRole('row', { name: new RegExp(code) });
  }

  deleteButtonFor(code: string): Locator {
    return this.rowFor(code).getByRole('button', { name: 'Xóa' });
  }
}

// ---------------------------------------------------------------------------
// Data-driven tests (loops over adminCouponTestData.json)
// ---------------------------------------------------------------------------
test.describe('FR-17 - Coupon creation (data-driven)', () => {
  for (const tc of adminCouponTestData) {
    test(`${tc.id} [${tc.type}] - ${tc.expectedOutcome}`, async ({ page }) => {
      await new AdminLoginPage(page).loginAs(ADMIN_USER.email, ADMIN_USER.password);
      const couponPage = new AdminCouponPage(page);
      await couponPage.open();

      await couponPage.fillForm({
        code: tc.code,
        couponType: tc.couponType as 'percent' | 'fixed',
        discountValue: tc.discountValue,
        minOrderAmount: tc.minOrderAmount,
        expiredAt: tc.expiredAt,
        maxUsesPerUser: tc.maxUsesPerUser,
      });

      if (tc.expectedOutcome === 'success') {
        await couponPage.submitExpectingSuccess();
        // Assertion type 1: toBeVisible - the new row rendered in the table
        await expect(couponPage.rowFor(tc.code)).toBeVisible();
        // Assertion type 2: toContainText - row reflects the submitted values
        await expect(couponPage.rowFor(tc.code)).toContainText(
          tc.couponType === 'percent' ? `${tc.discountValue}%` : String(tc.discountValue)
        );
      } else {
        // Assertion type 3: toContain (string) - the alert() message signals failure
        const message = await couponPage.submitExpectingError();
        expect(message).toContain('Lỗi');
        // Assertion type 4: not.toBeVisible - no row was created for a rejected submission
        // (skipped for the duplicate-code case, where a row for that code already exists
        // from the DB seed - see the dedicated duplicate-code test below instead)
        if (tc.id !== 'TC-COUPON-ADM-04') {
          await expect(couponPage.rowFor(tc.code)).not.toBeVisible();
        }
      }
    });
  }
});

// ---------------------------------------------------------------------------
// Duplicate code - isolated so the row-count assertion is unambiguous
// ---------------------------------------------------------------------------
test.describe('FR-17 - Duplicate coupon code', () => {
  test('TC-COUPON-ADM-04 - creating a coupon with an existing code is rejected', async ({
    page,
  }) => {
    await new AdminLoginPage(page).loginAs(ADMIN_USER.email, ADMIN_USER.password);
    const couponPage = new AdminCouponPage(page);
    await couponPage.open();

    // SAVE10 exists from the DB seed (re-applied by the beforeEach reset).
    const rowCountBefore = await page.getByRole('row', { name: /SAVE10/ }).count();

    await couponPage.fillForm({
      code: 'SAVE10',
      couponType: 'percent',
      discountValue: 15,
      minOrderAmount: 100000,
      expiredAt: '2099-12-31',
      maxUsesPerUser: 1,
    });
    const message = await couponPage.submitExpectingError();

    expect(message).toContain('Lỗi');
    // Row count for SAVE10 must stay exactly 1 - no duplicate row added.
    await expect(page.getByRole('row', { name: /SAVE10/ })).toHaveCount(rowCountBefore);
  });
});

// ---------------------------------------------------------------------------
// Required-field / HTML5 validation (client-side guards)
// ---------------------------------------------------------------------------
test.describe('FR-17 - Required field validation', () => {
  test('TC-COUPON-ADM-05 - empty code blocks submission', async ({ page }) => {
    await new AdminLoginPage(page).loginAs(ADMIN_USER.email, ADMIN_USER.password);
    const couponPage = new AdminCouponPage(page);
    await couponPage.open();

    await couponPage.discountValueInput.fill('10');
    await couponPage.minOrderAmountInput.fill('100000');
    await couponPage.expiredAtInput.fill('2099-12-31');
    await couponPage.maxUsesInput.fill('1');
    await couponPage.submitButton.click();

    const isValid = await couponPage.codeInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBe(false);
  });

  test('TC-COUPON-ADM-07 - empty expiry date blocks submission', async ({ page }) => {
    await new AdminLoginPage(page).loginAs(ADMIN_USER.email, ADMIN_USER.password);
    const couponPage = new AdminCouponPage(page);
    await couponPage.open();

    await couponPage.codeInput.fill('TESTCODE2');
    await couponPage.discountValueInput.fill('10');
    await couponPage.submitButton.click();

    const isValid = await couponPage.expiredAtInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    );
    expect(isValid).toBe(false);
  });

  test('TC-COUPON-ADM-12 - max uses per user below 1 is blocked by min constraint', async ({
    page,
  }) => {
    await new AdminLoginPage(page).loginAs(ADMIN_USER.email, ADMIN_USER.password);
    const couponPage = new AdminCouponPage(page);
    await couponPage.open();

    await couponPage.fillForm({
      code: 'ZEROUSES',
      couponType: 'percent',
      discountValue: 10,
      minOrderAmount: 100000,
      expiredAt: '2099-12-31',
      maxUsesPerUser: 0,
    });
    await couponPage.submitButton.click();

    const isValid = await couponPage.maxUsesInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    );
    expect(isValid).toBe(false);
    await expect(couponPage.rowFor('ZEROUSES')).not.toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Delete flow
// ---------------------------------------------------------------------------
test.describe('FR-17 - Delete coupon', () => {
  test('TC-COUPON-ADM-03 - deleting a coupon removes its row', async ({ page }) => {
    await new AdminLoginPage(page).loginAs(ADMIN_USER.email, ADMIN_USER.password);
    const couponPage = new AdminCouponPage(page);
    await couponPage.open();

    await couponPage.fillForm({
      code: 'DELETEME',
      couponType: 'percent',
      discountValue: 5,
      minOrderAmount: 50000,
      expiredAt: '2099-12-31',
      maxUsesPerUser: 1,
    });
    await couponPage.submitExpectingSuccess();
    await expect(couponPage.rowFor('DELETEME')).toBeVisible();

    await couponPage.deleteButtonFor('DELETEME').click();
    await expect(couponPage.rowFor('DELETEME')).not.toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Client-side normalization (code auto-uppercased as typed)
// ---------------------------------------------------------------------------
test.describe('FR-17 - Coupon code normalization', () => {
  test('TC-COUPON-ADM-15 - lowercase input is uppercased live', async ({ page }) => {
    await new AdminLoginPage(page).loginAs(ADMIN_USER.email, ADMIN_USER.password);
    const couponPage = new AdminCouponPage(page);
    await couponPage.open();

    await couponPage.codeInput.fill('flashsale');
    await expect(couponPage.codeInput).toHaveValue('FLASHSALE');
  });
});

// ---------------------------------------------------------------------------
// API-level RBAC check (FR-12 / SEC-03) - not reachable through the UI alone
// ---------------------------------------------------------------------------
test.describe('FR-17 - Non-admin API access (security)', () => {
  test('TC-COUPON-ADM-14 - regular user token is rejected by the coupon creation API', async ({
    request,
  }) => {
    const loginRes = await request.post(`${API_URL}/login`, {
      data: { email: REGULAR_USER.email, password: REGULAR_USER.password },
    });
    expect(loginRes.ok()).toBeTruthy();
    const { token } = await loginRes.json();

    const createRes = await request.post(`${API_URL}/admin/coupons`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        code: 'APIHACK',
        type: 'percent',
        discount_value: 10,
        min_order_amount: 100000,
        expired_at: '2099-12-31',
        max_uses_per_user: 1,
      },
    });

    expect([401, 403]).toContain(createRes.status());
  });
});
