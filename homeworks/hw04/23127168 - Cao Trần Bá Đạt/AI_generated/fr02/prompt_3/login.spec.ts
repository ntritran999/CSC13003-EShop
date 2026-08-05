import { test, expect, type Page, type Locator } from '@playwright/test';
import testData from './loginTestData.json';

/**
 * FR-02 - Đăng nhập & Khóa tài khoản (Login & Account Lockout)
 *
 * KNOWN TESTABILITY DEFECTS (see QA report):
 *  - Email/password <input> elements have no id / name / data-testid, and
 *    <label> is not linked via htmlFor. Locators below fall back to
 *    structural position until devs add stable hooks (data-testid preferred).
 *  - Password field is currently type="text" instead of type="password".
 *  - Email field is currently type="text" instead of type="email".
 * These are asserted directly in the "Known defects" block at the bottom
 * so the suite documents them instead of silently working around them.
 */

const BASE_URL = 'http://localhost:5173';

// Stamps every test with the run owner. Playwright's native HTML report
// renders annotations as a labeled chip on each test's result card
// ("Run by: 23127168"), independent of the Allure environment.properties
// stamp written in global-setup.ts.
test.beforeEach(async ({}, testInfo) => {
  testInfo.annotations.push({ type: 'Run by', description: '23127168' });
});

// ---------------------------------------------------------------------------
// Page Object
// ---------------------------------------------------------------------------
class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Fragile-by-necessity: no id/name/data-testid exist yet (see header note).
    this.emailInput = page.locator('form > div').nth(0).locator('input');
    this.passwordInput = page.locator('form > div').nth(1).locator('input');

    // Stable: native <button>, accessible name works today.
    this.submitButton = page.getByRole('button', { name: 'Sign In' });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Quên mật khẩu?' });
    this.registerLink = page.getByRole('link', { name: 'Đăng ký ngay' });

    // Medium fragility: styling class, not a semantic hook. Prefer
    // data-testid="login-error" once available.
    this.errorMessage = page.locator('.bg-red-100');
  }

  async goto() {
    await this.page.goto(`${BASE_URL}/login`);
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

// ---------------------------------------------------------------------------
// Data-driven tests (loops over loginTestData.json)
// ---------------------------------------------------------------------------
test.describe('FR-02 - Login (data-driven)', () => {
  for (const tc of testData) {
    test(`${tc.id} [${tc.type}] - ${tc.expectedOutcome}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(tc.email, tc.password);

      if (tc.expectedOutcome === 'success') {
        // Assertion type 1: toHaveURL - confirms redirect to homepage after auth
        await expect(page).toHaveURL(`${BASE_URL}/`);
        // Assertion type 2: not.toBeVisible - no error banner on the happy path
        await expect(loginPage.errorMessage).not.toBeVisible();
      } else {
        // Assertion type 3: toBeVisible - error banner rendered
        await expect(loginPage.errorMessage).toBeVisible();
        // Assertion type 4: toHaveText - exact, generic copy (no cause leaked)
        await expect(loginPage.errorMessage).toHaveText(
          'Đăng nhập thất bại. Vui lòng kiểm tra lại.'
        );
        // Confirms user was NOT navigated away on failure
        await expect(page).toHaveURL(`${BASE_URL}/login`);
      }
    });
  }
});

// ---------------------------------------------------------------------------
// Sequential lockout scenario (TC-LOGIN-03 -> 06 -> 07)
// State (fail counter) persists per account on the backend, so these must
// run in order against the same test user.
// ---------------------------------------------------------------------------
test.describe.serial('FR-02 - Account lockout sequence', () => {
  const email = 'test@eshop.com';
  const correctPassword = 'Test1234!';

  test('TC-LOGIN-03/04/05 - 3 consecutive failures lock the account', async ({ page }) => {
    const loginPage = new LoginPage(page);

    for (let attempt = 1; attempt <= 3; attempt++) {
      await loginPage.goto();
      await loginPage.login(email, `WrongPass${attempt}!`);
      await expect(loginPage.errorMessage).toBeVisible();
    }

    // After the 3rd failure the account should be locked; message stays
    // generic per spec ("không để lộ chi tiết nguyên nhân").
    await expect(loginPage.errorMessage).toHaveText(
      'Đăng nhập thất bại. Vui lòng kiểm tra lại.'
    );
  });

  test('TC-LOGIN-06 - correct password still rejected while locked', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(email, correctPassword);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });

  test('TC-LOGIN-07 - login succeeds once the 30s lock window expires', async ({ page }) => {
    test.slow(); // this test intentionally waits ~30s
    await page.waitForTimeout(31_000);

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(email, correctPassword);

    await expect(page).toHaveURL(`${BASE_URL}/`);
    await expect(loginPage.errorMessage).not.toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Client-side validation (TC-LOGIN-09 / TC-LOGIN-10)
// ---------------------------------------------------------------------------
test.describe('FR-02 - Required field validation', () => {
  test('TC-LOGIN-09 - empty email blocks submission (HTML5 required)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.passwordInput.fill('Test1234!');
    await loginPage.submitButton.click();

    const isValid = await loginPage.emailInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    );
    expect(isValid).toBe(false);
    await expect(page).toHaveURL(`${BASE_URL}/login`); // no navigation occurred
  });

  test('TC-LOGIN-10 - empty password blocks submission (HTML5 required)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.emailInput.fill('test@eshop.com');
    await loginPage.submitButton.click();

    const isValid = await loginPage.passwordInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    );
    expect(isValid).toBe(false);
    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });
});

// ---------------------------------------------------------------------------
// Known defects - documented as tests so regressions/fixes surface in CI
// ---------------------------------------------------------------------------
test.describe('FR-02 - Known defect verification (expected to fail until fixed)', () => {
  test('DEFECT - password field should be type="password"', async ({ page }) => {
    test.fail(); // remove this line once the field is fixed
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('DEFECT - email field should be type="email"', async ({ page }) => {
    test.fail(); // remove this line once the field is fixed
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.emailInput).toHaveAttribute('type', 'email');
  });
});
