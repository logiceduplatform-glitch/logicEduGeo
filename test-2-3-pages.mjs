import { chromium } from "playwright";
import fs from "fs";

fs.mkdirSync("/tmp/geo-2-3-test", { recursive: true });
const dir = "/tmp/geo-2-3-test";
const consoleErrors = [];

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(err.message));

  // Setup: Create guest session
  await page.goto("http://localhost:5173/guest-setup", { waitUntil: "networkidle", timeout: 15000 });
  await page.waitForTimeout(800);
  await page.locator('button').filter({ hasText: /4[\s\-–]5|Ηλικία 4/i }).first().click();
  await page.waitForTimeout(300);
  await page.locator('button').filter({ hasText: /Next|Επόμενο/ }).click();
  await page.waitForTimeout(600);
  await page.locator('button').filter({ hasText: /Fun|Διασκέδαση/i }).first().click();
  await page.waitForTimeout(400);
  await page.locator('button').filter({ hasText: /Let's play|Ας παίξουμε/ }).click();
  await page.waitForURL(/\/play\//, { timeout: 8000 });
  await page.waitForTimeout(1000);

  const results = [];

  // === /play/2-3-school ===
  await page.goto("http://localhost:5173/play/2-3-school", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${dir}/01-2-3-school-initial.png` });
  results.push("2-3-school initial: screenshot saved");

  // Click first game card in main grid - "Κουίζ Σχημάτων" / Shapes Quiz
  const firstCard = page.locator('main').getByRole('button', { name: /Κουίζ Σχημάτων|Shapes Quiz/ }).first();
  if ((await firstCard.count()) > 0) {
    await firstCard.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${dir}/02-2-3-school-after-click.png` });
    const hasError = await page.locator('text=/error|crash|something went wrong|κάτι πήγε στραβά/i').count() > 0;
    const hasErrorBoundary = await page.locator('[class*="ErrorBoundary"], [data-testid="error"]').count() > 0;
    const bodyText = await page.locator('body').innerText();
    results.push(`2-3-school after click: error visible=${hasError}, errorBoundary=${hasErrorBoundary}`);
    if (hasError || bodyText.includes("Error") || bodyText.includes("Σφάλμα")) {
      results.push(`2-3-school body snippet: ${bodyText.slice(0, 500)}`);
    }
  } else {
    results.push("2-3-school: No game card found in main grid");
  }

  // === /play/2-3-fun ===
  await page.goto("http://localhost:5173/play/2-3-fun", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${dir}/03-2-3-fun-initial.png` });
  results.push("2-3-fun initial: screenshot saved");

  // First game in 2-3-fun is "Tap Παζλ" / Tap Puzzle
  const firstCardFun = page.locator('main').getByRole('button', { name: /Tap Παζλ|Tap Puzzle/ }).first();
  if ((await firstCardFun.count()) > 0) {
    await firstCardFun.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${dir}/04-2-3-fun-after-click.png` });
    const hasError = await page.locator('text=/error|crash|something went wrong|κάτι πήγε στραβά/i').count() > 0;
    const bodyText = await page.locator('body').innerText();
    results.push(`2-3-fun after click: error visible=${hasError}`);
    if (hasError || bodyText.includes("Error") || bodyText.includes("Σφάλμα")) {
      results.push(`2-3-fun body snippet: ${bodyText.slice(0, 500)}`);
    }
  } else {
    results.push("2-3-fun: No game card found in main grid");
  }

  results.push(`Console errors: ${consoleErrors.length}`);
  consoleErrors.forEach((e, i) => results.push(`  [${i}] ${e}`));

  await browser.close();
  return results;
}

run().then((r) => {
  console.log(r.join("\n"));
}).catch((err) => {
  console.error("Test failed:", err.message);
  process.exit(1);
});
