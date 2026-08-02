import { test, expect, type Page, type Locator } from '@playwright/test';
import testData from '../test-data/loginTestData.json';

/**
 * FR-02 - Login and Account Lockout
 */

const BASE_URL = 'http://localhost:5173';
const VALID_EMAIL = 'test@eshop.com';
const VALID_PASSWORD = 'Test1234!';

const RUN_BY = process.env.RUN_BY || '23127168';

test.beforeAll(async () => {
  test.setTimeout(200_000);

  console.log('\n==================================================');
  console.log('[Browser Cooldown] Starting to clean up Backend before testing a new browser...');
  console.log('==================================================\n');

  await new Promise((resolve) => setTimeout(resolve, 150_000));
});

test.beforeEach(async ({ }, testInfo) => {
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

    this.emailInput = page.locator('form > div').nth(0).locator('input');
    this.passwordInput = page.locator('form > div').nth(1).locator('input');

    this.submitButton = page.getByRole('button', { name: 'Sign In' });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Quên mật khẩu?' });
    this.registerLink = page.getByRole('link', { name: 'Đăng ký ngay' });

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

async function resetFailCounterSilent(page: Page) {
  try {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(VALID_EMAIL, VALID_PASSWORD);
  } catch (e) {
  }
}

// ---------------------------------------------------------------------------
// 1. Data-driven tests (Dựa trên loginTestData.json)
// ---------------------------------------------------------------------------
test.describe('FR-02 - Login (data-driven)', () => {
  test.afterEach(async ({ page }) => {
    await resetFailCounterSilent(page);
  });
  for (const tc of testData) {
    test(`${tc.id} [${tc.type}] - ${tc.expectedOutcome}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(tc.email, tc.password);

      if (tc.expectedOutcome === 'success') {
        await expect(page).toHaveURL(`${BASE_URL}/`);
        await expect(loginPage.errorMessage).not.toBeVisible();
      } else {
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText(
          'Đăng nhập thất bại. Vui lòng kiểm tra lại.'
        );
        await expect(page).toHaveURL(`${BASE_URL}/login`);
      }
    });
  }
});

// ---------------------------------------------------------------------------
// 2. Client-side validation & Edge Cases (TC-LOGIN-09, 10, 11, 14, 15)
// ---------------------------------------------------------------------------
test.describe('FR-02 - Required field & Edge validation', () => {
  test.afterEach(async ({ page }) => {
    await resetFailCounterSilent(page);
  });
  test('TC-LOGIN-09 - empty email blocks submission (HTML5 required)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.passwordInput.fill('Test1234!');
    await loginPage.submitButton.click();

    const isValid = await loginPage.emailInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    );
    expect(isValid).toBe(false);
    await expect(page).toHaveURL(`${BASE_URL}/login`);
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

  test('TC-LOGIN-11 - invalid email format (missing @)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('test.eshop.com', 'Test1234!');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });

  test('TC-LOGIN-14 - password with leading/trailing whitespace', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('test@eshop.com', ' Test1234! ');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });

  test('TC-LOGIN-15 - extremely long string in email field', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const longEmail = 'a'.repeat(500) + '@eshop.com';
    await loginPage.login(longEmail, 'Test1234!');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });
});

// ---------------------------------------------------------------------------
// 3. Known defects (Documented & Verified)
// ---------------------------------------------------------------------------
test.describe('FR-02 - Known defect verification (expected to fail until fixed)', () => {
  test.afterEach(async ({ page }) => {
    await resetFailCounterSilent(page);
  });
  test('DEFECT - password field should be type="password"', async ({ page }) => {
    test.fail();
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('DEFECT - email field should be type="email"', async ({ page }) => {
    test.fail();
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.emailInput).toHaveAttribute('type', 'email');
  });
});

// ---------------------------------------------------------------------------
// 4. Sequential lockout scenario (TC-LOGIN-03 -> 06 -> 07)
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
    test.slow();
    await page.waitForTimeout(31_000);

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(email, correctPassword);

    await expect(page).toHaveURL(`${BASE_URL}/`);
    await expect(loginPage.errorMessage).not.toBeVisible();
  });
});