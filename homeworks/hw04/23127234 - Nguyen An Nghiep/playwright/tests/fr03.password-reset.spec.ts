import { expect, test, type Page } from "@playwright/test";
import { parse } from "csv-parse/sync";
import fs from "node:fs";
import path from "node:path";

const WEB_URL = process.env.CUSTOMER_BASE_URL ?? "http://localhost:5173";
const SHARED_EMAIL = "test@eshop.com";

interface Fr03Row {
  "Test ID": string;
  Mode: "request" | "inspect-otp" | "inspect-confirm" | "reset";
  Email: string;
  OTP: string;
  "Password Strategy": "none" | "literal" | "strong-length";
  Password: string;
  Length: string;
  Requirement: string;
  Expected:
    | "success"
    | "unregistered"
    | "otp-six-digits"
    | "otp-rejected"
    | "password-rejected"
    | "confirm-field";
}

const csvPath = path.resolve(__dirname, "../test-data/fr03.csv");
const rows: Fr03Row[] = parse(fs.readFileSync(csvPath, "utf8"), {
  columns: true,
  skip_empty_lines: true,
  trim: true,
});

function passwordFor(row: Fr03Row): string {
  if (row["Password Strategy"] === "literal") return row.Password;
  if (row["Password Strategy"] === "strong-length") {
    const length = Number(row.Length);
    return "Aa1!" + "b".repeat(length - 4);
  }
  return "";
}

async function openForgotPassword(page: Page): Promise<void> {
  await page.goto(`${WEB_URL}/forgot-password`);
  await expect(page.locator("form")).toBeVisible();
}

async function requestOtp(page: Page, email: string): Promise<string> {
  await openForgotPassword(page);
  await page.locator('form input[type="text"]').fill(email);
  await page.locator('form button[type="submit"]').click();

  const message = page.locator(".bg-green-100");
  await expect(message).toBeVisible();
  const text = (await message.textContent()) ?? "";
  return text.match(/\d+/)?.[0] ?? "";
}

async function clickAndAcceptDialog(
  page: Page,
  action: () => Promise<void>,
): Promise<string> {
  const dialogPromise = page.waitForEvent("dialog").then(async (dialog) => {
    const message = dialog.message();
    await dialog.accept();
    return message;
  });
  await action();
  return dialogPromise;
}

test.describe("FR-03 Forgot/Reset Password - Run by: 23127234", () => {
  for (const row of rows) {
    test(`${row["Test ID"]} - ${row.Expected}`, async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: "requirement",
        description: row.Requirement,
      });
      const email = row.Email === "shared" ? SHARED_EMAIL : row.Email;

      if (row.Mode === "request") {
        await openForgotPassword(page);
        await page.locator('form input[type="text"]').fill(email);
        const message = await clickAndAcceptDialog(page, () =>
          page.locator('form button[type="submit"]').click(),
        );

        expect(message).toContain("User not found");
        await expect(page.locator('form input[type="text"]')).toBeVisible();
        return;
      }

      const displayedOtp = await requestOtp(page, email);

      if (row.Mode === "inspect-otp") {
        expect(displayedOtp).toMatch(/^\d{6}$/);
        await expect(page.locator(".bg-green-100")).toContainText(displayedOtp);
        return;
      }

      if (row.Mode === "inspect-confirm") {
        const passwordInputs = page.locator('form input[type="password"]');
        await expect(passwordInputs).toHaveCount(2);
        await expect(passwordInputs.nth(1)).toHaveAttribute("type", "password");
        return;
      }

      const otp = row.OTP === "displayed" ? displayedOtp : row.OTP;
      await page.locator('form input[type="text"]').fill(otp);
      await page
        .locator('form input[type="password"]')
        .fill(passwordFor(row));

      const message = await clickAndAcceptDialog(page, () =>
        page.locator('form button[type="submit"]').click(),
      );

      if (row.Expected === "success") {
        expect(message).toMatch(/thành công|thÃ nh cÃ´ng/i);
        await expect(page).toHaveURL(/\/login$/);
      } else if (row.Expected === "otp-rejected") {
        expect(message).toMatch(/OTP|token/i);
        await expect(page).toHaveURL(/\/forgot-password$/);
      } else if (row.Expected === "password-rejected") {
        // The current SUT exposes only one generic weak-password dialog and
        // no rule code. This assertion proves rejection, while the CSV
        // Requirement annotation records the specific rule under test.
        testInfo.annotations.push({
          type: "oracle-limitation",
          description:
            "The SUT provides a generic weak-password message, so the UI cannot identify which password rule caused rejection.",
        });
        expect(message).toMatch(/yếu|yáº¿u|weak/i);
        await expect(page).toHaveURL(/\/forgot-password$/);
      }
    });
  }
});
