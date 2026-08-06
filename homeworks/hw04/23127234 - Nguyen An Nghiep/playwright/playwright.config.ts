import { defineConfig, devices, type Project } from "@playwright/test";
import path from "node:path";

const STUDENT_ID = "23127234";
const FEATURE_ID = (process.env.FEATURE_ID ?? "fr03").toLowerCase();
const RUN_BROWSER = (process.env.RUN_BROWSER ?? "all").toLowerCase();
const CONFIG_VALIDATION_MODE = process.env.PW_CONFIG_VALIDATE === "1";
const ISO_TIMESTAMP = new Date().toISOString();
const FILE_SAFE_TIMESTAMP = ISO_TIMESTAMP.replace(/[:.]/g, "-");

const customerBaseUrl =
  process.env.CUSTOMER_BASE_URL ?? "http://localhost:5173";
const adminBaseUrl = process.env.ADMIN_BASE_URL ?? "http://localhost:5174";
const apiBaseUrl = process.env.API_BASE_URL ?? "http://localhost:3000";

const browserProjects: Project[] = [
  {
    name: "chromium",
    use: { ...devices["Desktop Chrome"] },
  },
  {
    name: "firefox",
    use: { ...devices["Desktop Firefox"] },
  },
  {
    name: "webkit",
    use: { ...devices["Desktop Safari"] },
  },
];

const allowedBrowsers = new Set(browserProjects.map(({ name }) => name));
if (RUN_BROWSER !== "all" && !allowedBrowsers.has(RUN_BROWSER)) {
  throw new Error(
    `Unsupported RUN_BROWSER "${RUN_BROWSER}". Use chromium, firefox, webkit, or all.`,
  );
}

const selectedProjects =
  RUN_BROWSER === "all"
    ? browserProjects
    : browserProjects.filter(({ name }) => name === RUN_BROWSER);

const reportBrowserSegment =
  RUN_BROWSER === "all" ? `all-${FILE_SAFE_TIMESTAMP}` : RUN_BROWSER;
const htmlReportFolder =
  process.env.PLAYWRIGHT_HTML_REPORT ??
  path.resolve(
    __dirname,
    "test-report",
    FEATURE_ID,
    reportBrowserSegment,
  );

const reporters = CONFIG_VALIDATION_MODE
  ? ([['line']] as const)
  : ([
      ["line"],
      [
        "html",
        {
          open: "never",
          outputFolder: htmlReportFolder,
          title: `Run by: ${STUDENT_ID} | ${FEATURE_ID.toUpperCase()} | ${RUN_BROWSER} | ${ISO_TIMESTAMP}`,
        },
      ],
    ] as const);

export default defineConfig({
  testDir: "./tests",
  outputDir: path.resolve(
    __dirname,
    "test-results",
    FEATURE_ID,
    reportBrowserSegment,
  ),
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  reporter: reporters,
  metadata: {
    runBy: STUDENT_ID,
    studentId: STUDENT_ID,
    featureId: FEATURE_ID,
    browser: RUN_BROWSER,
    timestamp: ISO_TIMESTAMP,
    customerBaseUrl,
    adminBaseUrl,
    apiBaseUrl,
  },
  use: {
    baseURL: customerBaseUrl,
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
    headless: true,
  },
  projects: selectedProjects,
});
