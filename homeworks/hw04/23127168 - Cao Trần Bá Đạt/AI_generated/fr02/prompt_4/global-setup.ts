import fs from 'fs';
import path from 'path';

/**
 * Runs once before the suite. Writes allure-results/environment.properties
 * so the Allure "Environment" widget on the report landing page shows
 * "Run by: 23127168" alongside the run date and target browsers.
 *
 * Properties-file syntax requires escaping the space in the key with a
 * backslash, otherwise Allure would only read "Run" as the key.
 */
export default async function globalSetup() {
  const resultsDir = path.join(__dirname, 'allure-results');
  fs.mkdirSync(resultsDir, { recursive: true });

  const lines = [
    'Run\\ by=23127168',
    `Run\\ date=${new Date().toISOString()}`,
    'Feature=FR-02 Login & Account Lockout',
    'Browsers=Chromium, Firefox, WebKit',
  ];

  fs.writeFileSync(path.join(resultsDir, 'environment.properties'), lines.join('\n') + '\n');
}
