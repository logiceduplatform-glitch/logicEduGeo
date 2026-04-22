/**
 * Check homepage: load, screenshot, capture console errors.
 */
import { chromium } from "playwright";
import { join } from "path";

const BASE = "http://localhost:5173";
const OUT = process.cwd();

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const consoleEntries = [];
  page.on("console", (msg) => {
    const type = msg.type();
    const text = msg.text();
    const location = msg.location();
    consoleEntries.push({ type, text, location });
    process.stdout.write(`[console.${type}] ${text}\n`);
    if (location?.url) process.stdout.write(`  at ${location.url}:${location.lineNumber}:${location.columnNumber}\n`);
  });

  page.on("pageerror", (err) => {
    consoleEntries.push({ type: "pageerror", text: err.message, stack: err.stack });
    process.stdout.write(`[PAGE ERROR] ${err.message}\n`);
    process.stdout.write(err.stack || "(no stack)\n");
  });

  try {
    console.log("Navigating to", BASE, "...");
    await page.goto(BASE, { waitUntil: "networkidle", timeout: 15000 });

    await page.waitForTimeout(2000);

    console.log("\n--- Taking screenshot ---");
    await page.screenshot({ path: join(OUT, "homepage-check.png") });
    console.log("Screenshot saved: homepage-check.png");

    const pageInfo = await page.evaluate(() => {
      const bodyText = document.body?.innerText?.slice(0, 500) || "";
      const hasContent = document.body?.innerText?.length > 50;
      const title = document.title;
      return { title, hasContent, bodyPreview: bodyText.slice(0, 300) };
    });

    console.log("\n--- Page Info ---");
    console.log("Title:", pageInfo.title);
    console.log("Has substantial content:", pageInfo.hasContent);
    console.log("Body preview:", pageInfo.bodyPreview.slice(0, 200) + "...");

    const errors = consoleEntries.filter((e) => e.type === "error" || e.type === "pageerror");
    const warnings = consoleEntries.filter((e) => e.type === "warning");

    console.log("\n--- CONSOLE ERRORS ---");
    if (errors.length === 0) {
      console.log("(No console errors)");
    } else {
      errors.forEach((e, i) => {
        console.log(`\n--- Error ${i + 1} ---`);
        console.log("Message:", e.text);
        if (e.stack) console.log("Stack:", e.stack);
        if (e.location) console.log("Location:", e.location);
      });
    }

    console.log("\n--- CONSOLE WARNINGS ---");
    if (warnings.length === 0) {
      console.log("(No warnings)");
    } else {
      warnings.forEach((w, i) => {
        console.log(`Warning ${i + 1}:`, w.text);
      });
    }

    console.log("\n--- ALL CONSOLE ENTRIES (for reference) ---");
    consoleEntries.forEach((e) => {
      console.log(`[${e.type}]`, e.text?.slice(0, 150));
    });
  } catch (err) {
    console.error("Navigation or check failed:", err.message);
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
