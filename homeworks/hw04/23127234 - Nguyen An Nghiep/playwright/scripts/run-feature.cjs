const path = require("node:path");
const { spawnSync } = require("node:child_process");

const feature = process.argv[2];
const browser = process.argv[3];
const featureSpecs = {
  fr03: "tests/fr03.password-reset.spec.ts",
  fr10: "tests/fr10.order-state.spec.ts",
  fr15: "tests/fr15.product-crud.spec.ts",
};
const supportedBrowsers = new Set(["chromium", "firefox", "webkit"]);

if (!featureSpecs[feature] || !supportedBrowsers.has(browser)) {
  console.error(
    "Usage: node scripts/run-feature.cjs <fr03|fr10|fr15> <chromium|firefox|webkit>",
  );
  process.exit(2);
}

const workspace = path.resolve(__dirname, "..");
const playwrightCli = require.resolve("@playwright/test/cli", {
  paths: [workspace],
});

const result = spawnSync(
  process.execPath,
  [playwrightCli, "test", featureSpecs[feature], "--project", browser],
  {
    cwd: workspace,
    env: {
      ...process.env,
      FEATURE_ID: feature,
      RUN_BROWSER: browser,
      PLAYWRIGHT_HTML_REPORT: path.join(
        workspace,
        "test-report",
        feature,
        browser,
      ),
    },
    stdio: "inherit",
    shell: false,
  },
);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
