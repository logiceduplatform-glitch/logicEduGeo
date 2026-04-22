/**
 * E2E BATCH 2: Play Pages & Game Interactions on http://localhost:5174
 * Ensures guest session first, then tests all play routes.
 */
import { chromium } from "playwright";
import { join } from "path";

const BASE = "http://localhost:5174";
const OUT = process.cwd();

const ROUTES = [
  { id: "1-play", url: "/play", name: "Main play/quiz page" },
  { id: "2-2-3-school", url: "/play/2-3-school", name: "Age 2-3 school" },
  { id: "3-2-3-fun", url: "/play/2-3-fun", name: "Age 2-3 fun" },
  { id: "4-4-5-fun", url: "/play/4-5-fun", name: "Age 4-5 fun" },
  { id: "5-4-5-logic", url: "/play/4-5-logic", name: "Age 4-5 logic" },
  { id: "6-6-fun", url: "/play/6-fun", name: "Age 6 fun" },
  { id: "7-6-logic", url: "/play/6-logic", name: "Age 6 logic" },
  { id: "8-7-8-fun", url: "/play/7-8-fun", name: "Age 7-8 fun" },
  { id: "9-9-10-fun", url: "/play/9-10-fun", name: "Age 9-10 fun" },
  { id: "10-11-12-fun", url: "/play/11-12-fun", name: "Age 11-12 fun" },
  { id: "11-board-games", url: "/play/board-games", name: "Board games" },
  { id: "12-adult-games", url: "/play/adult-games", name: "Adult games" },
];

async function ensureGuestSession(page) {
  const hasGuest = await page.evaluate(() => {
    try {
      const p = localStorage.getItem("geo:guestProfile");
      return !!p && JSON.parse(p);
    } catch {
      return false;
    }
  });
  if (hasGuest) return;
  await page.goto(BASE + "/guest-setup", { waitUntil: "domcontentloaded", timeout: 15000 });
  const guestBtn = page.getByRole("button", {
    name: /συνέχεια ως επισκέπτη|continue as guest|δοκίμασε ως επισκέπτη|try as guest/i,
  }).first();
  if (await guestBtn.isVisible().catch(() => false)) {
    await guestBtn.click();
    await page.waitForTimeout(400);
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
  const startBtn = page.getByRole("button", { name: /let's play|ας παίξουμε|ξεκίνα/i }).first();
  if (await startBtn.isVisible().catch(() => false)) {
    await startBtn.click();
    await page.waitForURL(/\/play\//, { timeout: 6000 }).catch(() => {});
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      if (!text.includes("Firebase") && !text.includes("VITE_")) {
        consoleErrors.push({ text, url: msg.location()?.url || "" });
      }
    }
  });

  const results = [];

  try {
    console.log("Ensuring guest session...");
    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 15000 });
    await ensureGuestSession(page);
    await page.waitForTimeout(500);

    for (const route of ROUTES) {
      consoleErrors.length = 0;
      try {
        console.log(`\n--- ${route.id}: ${route.name} (${BASE}${route.url}) ---`);
        const resp = await page.goto(BASE + route.url, {
          waitUntil: "domcontentloaded",
          timeout: 15000,
        });
        const status = resp?.status() ?? 0;
        if (status >= 400) {
          results.push({
            id: route.id,
            name: route.name,
            url: route.url,
            passed: false,
            error: `HTTP ${status}`,
            hasContent: false,
            jsErrors: 0,
          });
          await page.screenshot({ path: join(OUT, `e2e-batch2-error-${route.id}.png`) });
          console.log(`  ✗ HTTP ${status} - screenshot saved`);
          continue;
        }

        await page.waitForTimeout(2000);

        const pageInfo = await page.evaluate(() => {
          const body = document.body?.innerText || "";
          const hasCards = !!document.querySelector(
            "[class*='grid'], [class*='card'], button[class*='rounded'], .game-card, h2, h3"
          );
          const len = body.length;
          const hasSubstantial = len > 200 && !body.includes("Φόρτωση") && !body.includes("Loading...");
          return { bodyLen: len, hasCards, hasSubstantial };
        });

        const blankOrError =
          pageInfo.bodyLen < 150 ||
          (pageInfo.bodyLen < 400 && !pageInfo.hasCards);

        const jsErrs = consoleErrors.filter(
          (e) => !e.text?.includes("Firebase") && !e.text?.includes("VITE_")
        ).length;

        const passed = !blankOrError && jsErrs === 0;
        results.push({
          id: route.id,
          name: route.name,
          url: route.url,
          passed,
          error: blankOrError ? "Page blank or minimal content" : jsErrs ? `JS errors: ${jsErrs}` : null,
          hasContent: !blankOrError,
          jsErrors: jsErrs,
        });

        if (!passed) {
          await page.screenshot({ path: join(OUT, `e2e-batch2-error-${route.id}.png`) });
          console.log(`  ✗ ${passed ? "" : "Content/error - "}screenshot saved`);
          if (jsErrs > 0) {
            consoleErrors.forEach((e) => console.log(`    JS: ${e.text}`));
          }
        } else {
          console.log(`  ✓ Loaded OK, content visible`);
        }
      } catch (err) {
        results.push({
          id: route.id,
          name: route.name,
          url: route.url,
          passed: false,
          error: err.message,
          hasContent: false,
          jsErrors: 0,
        });
        try {
          await page.screenshot({ path: join(OUT, `e2e-batch2-error-${route.id}.png`) });
        } catch {}
        console.log(`  ✗ ${err.message}`);
      }
    }

    console.log("\n--- Interaction 13: Board games - click Uno or Chess ---");
    try {
      await page.goto(BASE + "/play/board-games", { waitUntil: "domcontentloaded", timeout: 15000 });
      await page.waitForTimeout(2000);
      const boardBtn = page.getByRole("button", {
        name: /uno|chess|σκάκι|τράπουλα/i,
      }).first();
      if (await boardBtn.isVisible().catch(() => false)) {
        await boardBtn.click();
        await page.waitForTimeout(3000);
        const after = await page.evaluate(() => document.body?.innerText?.length || 0);
        const ok = after > 300;
        results.push({
          id: "13-board-click",
          name: "Board game click (Uno/Chess)",
          url: "/play/board-games",
          passed: ok,
          error: ok ? null : "Game may not have loaded",
          hasContent: ok,
          jsErrors: 0,
        });
        console.log(ok ? "  ✓ Game loaded" : "  ✗ Game may not have loaded");
        if (!ok) {
          await page.screenshot({ path: join(OUT, "e2e-batch2-error-13-board-click.png") });
        }
      } else {
        results.push({
          id: "13-board-click",
          name: "Board game click",
          url: "/play/board-games",
          passed: false,
          error: "Board game button not found",
          hasContent: false,
          jsErrors: 0,
        });
        console.log("  ✗ Board game button not found");
      }
    } catch (e) {
      results.push({
        id: "13-board-click",
        name: "Board game click",
        url: "/play/board-games",
        passed: false,
        error: e.message,
        hasContent: false,
        jsErrors: 0,
      });
      console.log(`  ✗ ${e.message}`);
    }

    console.log("\n--- Interaction 14: Adult games - click category ---");
    try {
      await page.goto(BASE + "/play/adult-games", { waitUntil: "domcontentloaded", timeout: 15000 });
      await page.waitForTimeout(2000);
      const catBtn = page.getByRole("button", {
        name: /brain training|εξάσκηση μυαλού|fun|διασκέδαση|logic|λογική|🧠|🎉|🧩/i,
      }).first();
      if (await catBtn.isVisible().catch(() => false)) {
        await catBtn.click();
        await page.waitForTimeout(2000);
        await page.waitForURL(/\/play\/adult-games\//, { timeout: 3000 }).catch(() => {});
        const url = page.url();
        const hasCategory = url.includes("/brain") || url.includes("/fun") || url.includes("/logic");
        const bodyLen = await page.evaluate(() => document.body?.innerText?.length || 0);
        const ok = hasCategory || bodyLen > 500;
        results.push({
          id: "14-adult-category",
          name: "Adult games category click",
          url: "/play/adult-games",
          passed: ok,
          error: ok ? null : "Category may not have loaded",
          hasContent: ok,
          jsErrors: 0,
        });
        console.log(ok ? "  ✓ Category loaded" : "  ✗ Category may not have loaded");
        if (!ok) {
          await page.screenshot({ path: join(OUT, "e2e-batch2-error-14-adult-category.png") });
        }
      } else {
        results.push({
          id: "14-adult-category",
          name: "Adult games category click",
          url: "/play/adult-games",
          passed: false,
          error: "Category button not found",
          hasContent: false,
          jsErrors: 0,
        });
        console.log("  ✗ Category button not found");
      }
    } catch (e) {
      results.push({
        id: "14-adult-category",
        name: "Adult games category click",
        url: "/play/adult-games",
        passed: false,
        error: e.message,
        hasContent: false,
        jsErrors: 0,
      });
      console.log(`  ✗ ${e.message}`);
    }
  } finally {
    await browser.close();
  }

  console.log("\n" + "=".repeat(60));
  console.log("E2E BATCH 2 RESULTS");
  console.log("=".repeat(60));

  for (const r of results) {
    const status = r.passed ? "✓ PASS" : "✗ FAIL";
    const detail = r.error ? ` - ${r.error}` : "";
    console.log(`${status} ${r.id} ${r.name}${detail}`);
  }

  const failed = results.filter((r) => !r.passed);
  const passed = results.filter((r) => r.passed);
  console.log("\n--- Summary ---");
  console.log(`Passed: ${passed.length}/${results.length}`);
  console.log(`Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log("\n--- Failed Tests (screenshots saved) ---");
    for (const f of failed) {
      console.log(`  ${f.id}: ${f.error}`);
    }
  }

  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
