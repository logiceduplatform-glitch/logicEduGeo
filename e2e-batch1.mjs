/**
 * E2E BATCH 1: Public Pages & Guest Setup on http://localhost:5174
 */
import { chromium } from "playwright";
import { join } from "path";

const BASE = "http://localhost:5174";
const OUT = process.cwd();

const TESTS = [
  {
    id: "1-home",
    url: "/",
    name: "Home page",
    checks: ["navbar", "logo"],
    screenshotOnError: true,
  },
  {
    id: "2-about",
    url: "/about",
    name: "About page",
    screenshotOnError: true,
  },
  {
    id: "3-faq",
    url: "/faq",
    name: "FAQ page",
    screenshotOnError: true,
  },
  {
    id: "4-privacy",
    url: "/privacy",
    name: "Privacy page",
    screenshotOnError: true,
  },
  {
    id: "5-terms",
    url: "/terms",
    name: "Terms page",
    screenshotOnError: true,
  },
  {
    id: "6-contact",
    url: "/contact",
    name: "Contact page",
    screenshotOnError: true,
  },
  {
    id: "7-leaderboard",
    url: "/leaderboard",
    name: "Leaderboard page",
    screenshotOnError: true,
  },
  {
    id: "8-guest-setup",
    url: "/guest-setup",
    name: "Guest setup",
    action: async (page) => {
      const guestBtn = page.getByRole("button", {
        name: /συνέχεια ως επισκέπτη|continue as guest|δοκίμασε ως επισκέπτη|try as guest/i,
      }).first();
      if (await guestBtn.isVisible().catch(() => false)) {
        await guestBtn.click();
        await page.waitForTimeout(500);
      }
      const ageBtn = page.getByRole("button", { name: /4-5|9-10|🧒|🔬/i }).first();
      if (await ageBtn.isVisible().catch(() => false)) {
        await ageBtn.click();
        await page.getByRole("button", { name: /next|επόμενο/i }).click();
      }
      const objBtn = page.getByRole("button", { name: /fun|διασκέδαση|logic|λογική|🧩|🎉/i }).first();
      if (await objBtn.isVisible().catch(() => false)) {
        await objBtn.click();
      }
      const startBtn = page.getByRole("button", {
        name: /let's play|ας παίξουμε|ξεκίνα/i,
      }).first();
      if (await startBtn.isVisible().catch(() => false)) {
        await startBtn.click();
        await page.waitForURL(/\/play\//, { timeout: 5000 }).catch(() => {});
      }
    },
    screenshotOnError: true,
  },
  {
    id: "9-weekly-report",
    url: "/weekly-report",
    name: "Weekly report",
    screenshotOnError: true,
  },
  {
    id: "10-content-editor",
    url: "/content-editor",
    name: "Content editor",
    screenshotOnError: true,
  },
  {
    id: "11-ai-tutor",
    url: "/ai-tutor",
    name: "AI tutor (GeoBot chat)",
    screenshotOnError: true,
  },
  {
    id: "12-online-multiplayer",
    url: "/online-multiplayer",
    name: "Online multiplayer (Coming Soon)",
    screenshotOnError: true,
  },
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const errors = [];
  const consoleErrors = [];

  page.on("console", (msg) => {
    const type = msg.type();
    if (type === "error") {
      const text = msg.text();
      const loc = msg.location();
      consoleErrors.push({
        text,
        url: loc?.url || "",
        line: loc?.lineNumber,
        col: loc?.columnNumber,
      });
    }
  });

  const results = [];
  let pageErrors = [];

  for (const test of TESTS) {
    pageErrors = [];
    consoleErrors.length = 0;

    try {
      console.log(`\n--- Test ${test.id}: ${test.name} (${BASE}${test.url}) ---`);
      const response = await page.goto(BASE + test.url, {
        waitUntil: "domcontentloaded",
        timeout: 15000,
      });

      const status = response?.status() ?? 0;
      if (status >= 400) {
        results.push({
          id: test.id,
          name: test.name,
          url: test.url,
          passed: false,
          error: `HTTP ${status}`,
        });
        if (test.screenshotOnError) {
          await page.screenshot({
            path: join(OUT, `e2e-error-${test.id}.png`),
          });
          console.log(`  Screenshot: e2e-error-${test.id}.png`);
        }
        continue;
      }

      await page.waitForTimeout(1500);

      if (test.action) {
        try {
          await test.action(page);
        } catch (e) {
          results.push({
            id: test.id,
            name: test.name,
            url: test.url,
            passed: false,
            error: `Action failed: ${e.message}`,
          });
          if (test.screenshotOnError) {
            await page.screenshot({
              path: join(OUT, `e2e-error-${test.id}.png`),
            });
            console.log(`  Screenshot: e2e-error-${test.id}.png`);
          }
          continue;
        }
      }

      if (test.checks?.includes("navbar")) {
        const nav = await page.locator("nav, [role='navigation'], header").first();
        if (!(await nav.isVisible().catch(() => false))) {
          pageErrors.push("Navbar not visible");
        }
      }
      if (test.checks?.includes("logo")) {
        const logo = await page.locator('text="Educational Platform"').first();
        if (!(await logo.isVisible().catch(() => false))) {
          pageErrors.push("Logo (Educational Platform) not visible");
        }
      }

      const hasJsErrors = consoleErrors.length > 0;
      if (hasJsErrors) {
        pageErrors.push(...consoleErrors.map((e) => `JS: ${e.text}`));
      }

      const passed = pageErrors.length === 0;
      results.push({
        id: test.id,
        name: test.name,
        url: test.url,
        passed,
        error: pageErrors.length ? pageErrors.join("; ") : null,
        jsErrors: consoleErrors.length,
      });

      if (!passed && test.screenshotOnError) {
        await page.screenshot({
          path: join(OUT, `e2e-error-${test.id}.png`),
        });
        console.log(`  Screenshot: e2e-error-${test.id}.png`);
      }
    } catch (err) {
      results.push({
        id: test.id,
        name: test.name,
        url: test.url,
        passed: false,
        error: err.message,
      });
      console.log(`  FAILED: ${err.message}`);
      if (test.screenshotOnError) {
        try {
          await page.screenshot({
            path: join(OUT, `e2e-error-${test.id}.png`),
          });
          console.log(`  Screenshot: e2e-error-${test.id}.png`);
        } catch {}
      }
    }
  }

  await browser.close();

  console.log("\n" + "=".repeat(60));
  console.log("E2E BATCH 1 RESULTS");
  console.log("=".repeat(60));

  const failed = results.filter((r) => !r.passed);
  const passed = results.filter((r) => r.passed);

  for (const r of results) {
    const status = r.passed ? "✓ PASS" : "✗ FAIL";
    const detail = r.error ? ` - ${r.error}` : "";
    console.log(`${status} ${r.id} ${r.name}${detail}`);
  }

  console.log("\n--- Summary ---");
  console.log(`Passed: ${passed.length}/${results.length}`);
  console.log(`Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log("\n--- Failed Tests Detail ---");
    for (const f of failed) {
      console.log(`\n${f.id} ${f.name}:`);
      console.log(`  URL: ${BASE}${f.url}`);
      console.log(`  Error: ${f.error}`);
      if (f.jsErrors) console.log(`  JS errors: ${f.jsErrors}`);
    }
  }

  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
