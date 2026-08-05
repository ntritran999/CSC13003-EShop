import fs from 'fs';
import path from 'path';

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
