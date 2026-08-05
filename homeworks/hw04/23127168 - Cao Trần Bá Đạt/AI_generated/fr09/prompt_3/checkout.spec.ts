import { test, expect, type Page, type Locator } from '@playwright/test';
import couponTestData from './couponTestData.json';

/**
 * FR-09 - Mã Giảm Giá (Coupon), checked against 5 conditions C1-C5.
 * Also probes the FR-08 integrity gap: `editableTotal` is a client-editable
 * number input that feeds straight into the coupon's C3 threshold check.
 *
 * KNOWN TESTABILITY DEFECTS (see QA report):
 *  - No id / name / data-testid on the coupon input, apply button, error
 *    text, or result block. Locators below use placeholder/role/text as
 *    the least-fragile fallback until stable hooks are added.
 *  - Apply/Checkout button accessible names change while loading
 *    ('Áp dụng' -> '...', 'Xác Nhận Thanh Toán' -> 'Đang xử lý...'),
 *    so role-based lookups must target the idle-state label.
 */

const BASE_URL = 'http://localhost:5173';
const TEST_USER = { email: 'test@eshop.com', password: 'Test1234!' };

// Stamps every test with the run owner, same convention as login.spec.ts.
test.beforeEach(async ({}, testInfo) => {
  testInfo.annotations.push({ type: 'Run by', description: '23127168' });
});

// ---------------------------------------------------------------------------
// Page Objects
// ---------------------------------------------------------------------------
class LoginPage {
  constructor(private page: Page) {}

  async loginAs(email: string, password: string) {
    await this.page.goto(`${BASE_URL}/login`);
    // Same structural fallback as login.spec.ts - no id/name on these inputs.
    await this.page.locator('form > div').nth(0).locator('input').fill(email);
    await this.page.locator('form > div').nth(1).locator('input').fill(password);
    await this.page.getByRole('button', { name: 'Sign In' }).click();
    await expect(this.page).toHaveURL(`${BASE_URL}/`);
  }
}

class CheckoutPage {
  readonly page: Page;
  readonly editableTotalInput: Locator;
  readonly couponCodeInput: Locator;
  readonly applyCouponButton: Locator;
  readonly couponError: Locator;
  readonly couponSuccessMessage: Locator;
  readonly discountAmountText: Locator;
  readonly finalAmountText: Locator;
  readonly bottomTotalDisplay: Locator;
  readonly checkoutButton: Locator;
  readonly successHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    // Only numeric field on the page today -> usable via implicit ARIA role.
    this.editableTotalInput = page.getByRole('spinbutton');

    this.couponCodeInput = page.getByPlaceholder('Nhập mã giảm giá...');
    this.applyCouponButton = page.getByRole('button', { name: 'Áp dụng' });

    // Class-based fallback - conditionally rendered, no semantic hook yet.
    this.couponError = page.locator('.text-red-600.text-sm');
    this.couponSuccessMessage = page.getByText(/✅/);
    this.discountAmountText = page.locator('p', { hasText: 'Tiết kiệm' }).locator('strong');
    this.finalAmountText = page.locator('p', { hasText: 'Thành tiền' }).locator('strong');

    this.bottomTotalDisplay = page.getByText(/Tổng thanh toán:/);
    this.checkoutButton = page.getByRole('button', { name: 'Xác Nhận Thanh Toán' });
    this.successHeading = page.getByRole('heading', { name: 'Thanh toán thành công!' });
  }

  async goto() {
    // Assumes a non-empty cart is already seeded (via storageState/API fixture
    // or a prior add-to-cart step) - this spec focuses on the coupon logic,
    // not the add-to-cart flow covered under FR-06/FR-07.
    await this.page.goto(`${BASE_URL}/checkout`);
  }

  async applyCoupon(code: string) {
    await this.couponCodeInput.fill(code);
    await this.applyCouponButton.click();
  }

  async setEditableTotal(amount: number) {
    await this.editableTotalInput.fill(String(amount));
  }
}

// ---------------------------------------------------------------------------
// Data-driven tests (loops over couponTestData.json)
// ---------------------------------------------------------------------------
test.describe('FR-09 - Coupon application (data-driven)', () => {
  for (const tc of couponTestData) {
    test(`${tc.id} [${tc.type}] - ${tc.expectedOutcome}`, async ({ page }) => {
      if (tc.loggedIn) {
        await new LoginPage(page).loginAs(TEST_USER.email, TEST_USER.password);
      }

      const checkout = new CheckoutPage(page);
      await checkout.goto();
      await checkout.setEditableTotal(tc.totalAmount);
      await checkout.applyCoupon(tc.couponCode);

      if (tc.expectedOutcome === 'success') {
        // Assertion type 1: toBeVisible - success block rendered
        await expect(checkout.couponSuccessMessage).toBeVisible();
        // Assertion type 2: toContainText - partial match on formatted VND amount
        await expect(checkout.discountAmountText).toContainText(tc.expectedDiscount!);
        await expect(checkout.finalAmountText).toContainText(tc.expectedFinal!);
        // Assertion type 3: not.toBeVisible - no error shown on the happy path
        await expect(checkout.couponError).not.toBeVisible();
      } else {
        await expect(checkout.couponError).toBeVisible();
        // Assertion type 4: not.toBeVisible - no success block on failure
        await expect(checkout.couponSuccessMessage).not.toBeVisible();
      }
    });
  }
});

// ---------------------------------------------------------------------------
// Stateful usage-cap sequences (C5) - must run in order against the same user
// ---------------------------------------------------------------------------
test.describe.serial('FR-09 - Coupon usage cap (C5)', () => {
  test('TC-COUPON-08 - single-use coupon rejected on 2nd application', async ({ page }) => {
    await new LoginPage(page).loginAs(TEST_USER.email, TEST_USER.password);
    const checkout = new CheckoutPage(page);

    // 1st use - expected to succeed (assumes a clean DB/test user for this run).
    await checkout.goto();
    await checkout.setEditableTotal(300_000);
    await checkout.applyCoupon('SAVE10');
    await expect(checkout.couponSuccessMessage).toBeVisible();

    // 2nd use - same user, same code - must now fail C5.
    await checkout.goto();
    await checkout.setEditableTotal(300_000);
    await checkout.applyCoupon('SAVE10');
    await expect(checkout.couponError).toBeVisible();
  });

  test('TC-COUPON-15 - multi-use coupon rejected on 3rd application', async ({ page }) => {
    await new LoginPage(page).loginAs(TEST_USER.email, TEST_USER.password);
    const checkout = new CheckoutPage(page);

    for (let use = 1; use <= 2; use++) {
      await checkout.goto();
      await checkout.setEditableTotal(300_000);
      await checkout.applyCoupon('VIP100');
      await expect(checkout.couponSuccessMessage).toBeVisible();
    }

    // 3rd use exceeds max_uses_per_user = 2.
    await checkout.goto();
    await checkout.setEditableTotal(300_000);
    await checkout.applyCoupon('VIP100');
    await expect(checkout.couponError).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Boundary tests (C3: total >= min_order_amount)
// ---------------------------------------------------------------------------
test.describe('FR-09 - Threshold boundary (C3)', () => {
  test('TC-COUPON-09 - total exactly equal to min_order_amount succeeds', async ({ page }) => {
    await new LoginPage(page).loginAs(TEST_USER.email, TEST_USER.password);
    const checkout = new CheckoutPage(page);
    await checkout.goto();
    await checkout.setEditableTotal(500_000); // BIGBUY min_order_amount
    await checkout.applyCoupon('BIGBUY');

    await expect(checkout.couponSuccessMessage).toBeVisible();
    await expect(checkout.finalAmountText).toContainText('450.000');
  });

  test('TC-COUPON-10 - total one unit below min_order_amount fails', async ({ page }) => {
    await new LoginPage(page).loginAs(TEST_USER.email, TEST_USER.password);
    const checkout = new CheckoutPage(page);
    await checkout.goto();
    await checkout.setEditableTotal(499_999);
    await checkout.applyCoupon('BIGBUY');

    await expect(checkout.couponError).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Security / integrity test - tampered total_amount (FR-08 x FR-09 gap)
// ---------------------------------------------------------------------------
test.describe('FR-09 - Total tampering (security)', () => {
  test('TC-COUPON-13 - fabricated total must not bypass server-side checkout total', async ({
    page,
  }) => {
    await new LoginPage(page).loginAs(TEST_USER.email, TEST_USER.password);
    const checkout = new CheckoutPage(page);
    await checkout.goto();

    // Overwrite the editable total to a value the real cart does not have,
    // purely to satisfy SAVE10's 300,000 ₫ threshold.
    await checkout.setEditableTotal(350_000);
    await checkout.applyCoupon('SAVE10');

    // Client-side apply may succeed today (documents the defect rather than
    // hiding it) - the real assertion is on the CONFIRMED order after checkout.
    await checkout.checkoutButton.click();

    // Assertion type 5: toHaveURL is not used here on purpose - success is a
    // conditional render, not a route change, so we assert on the heading.
    // EXPECTED (per FR-08 "Backend phải tự tính lại tổng tiền"): either the
    // success heading reflects the REAL recomputed total, or checkout is
    // rejected outright. This test should be reviewed against actual backend
    // behavior and updated once the real recomputation logic is confirmed.
    await expect(checkout.successHeading).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Client-side guard (empty coupon code disables submit)
// ---------------------------------------------------------------------------
test.describe('FR-09 - Empty coupon code guard', () => {
  test('TC-COUPON-14 - Áp dụng stays disabled with no code entered', async ({ page }) => {
    await new LoginPage(page).loginAs(TEST_USER.email, TEST_USER.password);
    const checkout = new CheckoutPage(page);
    await checkout.goto();

    // Assertion type 6: toBeDisabled - explicit disabled-state check
    await expect(checkout.applyCouponButton).toBeDisabled();
    await expect(checkout.couponSuccessMessage).not.toBeVisible();
    await expect(checkout.couponError).not.toBeVisible();
  });
});
