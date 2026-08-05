import fs from 'fs';
import path from 'path';

/**
 * Runs once before the suite. Writes allure-results/environment.properties
 * so the Allure "Environment" widget on the report landing page shows
 * "Run by: 23127168" alongside the run date and covered features.
 *
 * Properties-file syntax requires escaping the space in the key with a
 * backslash, otherwise Allure would only read "Run" as the key.
 *
 * NOTE: playwright.config.ts uses testMatch: '**\/*.spec.ts', so this
 * single global setup now stamps the environment for every spec file in
 * the project (login.spec.ts AND checkout.spec.ts), not just FR-02.
 */
export default async function globalSetup() {
  const resultsDir = path.join(__dirname, 'allure-results');
  fs.mkdirSync(resultsDir, { recursive: true });

  const lines = [
    'Run\\ by=23127168',
    `Run\\ date=${new Date().toISOString()}`,
    'Features=FR-02 Login & Account Lockout, FR-09 Coupon',
    'Browsers=Chromium, Firefox, WebKit',
  ];

  fs.writeFileSync(path.join(resultsDir, 'environment.properties'), lines.join('\n') + '\n');
}
