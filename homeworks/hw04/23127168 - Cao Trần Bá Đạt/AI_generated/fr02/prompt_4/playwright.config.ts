import { defineConfig, devices } from '@playwright/test';

/**
 * Root Playwright config for the EShop FR-02 suite.
 * Runs every test in login.spec.ts against 3 browser engines and
 * publishes both a Playwright HTML report and an Allure report,
 * each tagged with "Run by: 23127168" (see global-setup.ts and the
 * per-test annotation in login.spec.ts).
 */
export default defineConfig({
  testDir: './',
  testMatch: '**/*.spec.ts',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,

  // Runs once before the whole suite - stamps the run metadata for Allure.
  globalSetup: require.resolve('./global-setup.ts'),

  reporter: [
    ['list'],
    // Native Playwright HTML report
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    // Allure report (requires allure-playwright + allure-commandline, see package.json)
    ['allure-playwright', { resultsDir: 'allure-results' }],
  ],

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
