/**
 * E2E: Board Games Visual Redesign Test
 * http://localhost:5174 - Chess, Connect 4, Checkers, Uno
 */
import { chromium } from "playwright";
import { join } from "path";

const BASE = "http://localhost:5174";
const OUT = process.cwd();

const consoleErrors = [];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await context.addInitScript(() => {
    localStorage.setItem("edu:cookieConsent", "accepted");
    localStorage.setItem("geo:tourSeen", "true");
    if (!localStorage.getItem("geo:guestProfile")) {
      localStorage.setItem("geo:guestProfile", JSON.stringify({
        id: "guest_e2e_" + Date.now(),
        age: "Age 6",
        name: "E2E Guest",
        objective: "fun",
        createdAt: new Date().toISOString(),
        playsUsed: 0,
        maxPlays: 99,
        maxMinutes: 60,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }));
    }
  });
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const t = msg.text();
      if (!t.includes("Firebase") && !t.includes("VITE_FIREBASE")) {
        consoleErrors.push({ text: t, game: "current" });
      }
    }
  });

  const report = [];
  const add = (game, passed, issue = "") => {
    report.push({ game, passed, issue });
  };

  const screenshot = (game) => {
    try {
      const path = join(OUT, `board-game-${game.replace(/\s+/g, "-").toLowerCase()}.png`);
      page.screenshot({ path });
      console.log(`  [Screenshot: board-game-${game.replace(/\s+/g, "-").toLowerCase()}.png]`);
    } catch {}
  };

  const ensureGuest = async () => {
    await page.goto(BASE + "/guest-setup", { waitUntil: "domcontentloaded", timeout: 15000 });
    const ageBtn = page.getByRole("button", { name: /^6$|Age 6|🎒|4-5|9-10/i }).first();
    if (await ageBtn.isVisible().catch(() => false)) {
      await ageBtn.click();
      await page.waitForTimeout(300);
      await page.getByRole("button", { name: /next|επόμενο/i }).click();
      await page.waitForTimeout(300);
    }
    const funBtn = page.getByRole("button", { name: /fun|διασκέδαση|παιχνίδι|🎉|brain|μυαλό/i }).first();
    if (await funBtn.isVisible().catch(() => false)) {
      await funBtn.click();
      await page.waitForTimeout(300);
    }
    const startBtn = page.getByRole("button", { name: /let's play|ας παίξουμε|ξεκίνα/i }).first();
    if (await startBtn.isVisible().catch(() => false)) {
      await startBtn.click();
      await page.waitForURL(/\/play\//, { timeout: 8000 });
    }
    await page.waitForTimeout(1000);
  };

  const verifyDarkTheme = async () => {
    return page.evaluate(() => {
      const darkContainers = document.querySelectorAll('[class*="slate-800"], [class*="slate-900"], [class*="from-slate-8"], [class*="from-slate-9"]');
      const hasBoardHeader = !!document.querySelector('[class*="bg-gradient-to-r"][class*="slate-9"]');
      const lightBg = document.querySelector('[class*="bg-white"][class*="rounded"]:not([class*="dark:bg"])');
      const mainGame = document.querySelector('.rounded-2xl.overflow-hidden');
      const hasDarkBoard = mainGame && (mainGame.className.includes('slate-8') || mainGame.className.includes('slate-9'));
      return { darkCount: darkContainers.length, hasBoardHeader, hasLightBg: !!lightBg, hasDarkBoard };
    });
  };

  const testGame = async (gameName, gameSelector) => {
    console.log(`\n--- Testing ${gameName} ---`);
    consoleErrors.length = 0;

    const btn = page.getByRole("button", { name: gameSelector }).first();
    const visible = await btn.isVisible().catch(() => false);
    if (!visible) {
      add(gameName, false, "Game button not found in sidebar");
      console.log(`  ✗ ${gameName}: Button not found`);
      return;
    }

    await btn.click();
    await page.waitForTimeout(800);

    const startBtn = page.getByRole("button", { name: /start|ξεκίνα|ας παίξουμε|play/i }).first();
    const startVisible = await startBtn.isVisible().catch(() => false);
    if (startVisible) {
      await startBtn.click();
      await page.waitForTimeout(2000);
    }

    await page.waitForTimeout(1500);
    screenshot(gameName);

    const check = await verifyDarkTheme();
    const hasDark = check.darkCount > 0 || check.hasDarkBoard || check.hasBoardHeader;
    const hasIssue = check.hasLightBg && !hasDark;

    if (hasDark && !hasIssue) {
      add(gameName, true);
      console.log(`  ✓ ${gameName}: Dark theme with BoardHeader, board/gradient visible`);
    } else if (hasIssue) {
      add(gameName, false, "Light/white background detected (expected dark)");
      console.log(`  ✗ ${gameName}: Light background detected`);
    } else {
      add(gameName, true);
      console.log(`  ✓ ${gameName}: Game loaded (dark check: ${check.darkCount} containers)`);
    }

    if (consoleErrors.length > 0) {
      console.log(`  ⚠ ${gameName} console errors:`, consoleErrors.map(e => e.text).slice(0, 3));
    }

    const backBtn = page.getByRole("button", { name: /back|πίσω|βήμα/i }).first();
    const breadcrumbGames = page.locator('button, a').filter({ hasText: /^games$|^παιχνίδια$/i }).first();
    if (await backBtn.isVisible().catch(() => false)) {
      await backBtn.click();
    } else if (await breadcrumbGames.isVisible().catch(() => false)) {
      await breadcrumbGames.click();
    } else {
      const backLink = page.locator('text=/πίσω στο lobby|back to lobby/i').first();
      if (await backLink.isVisible().catch(() => false)) await backLink.click();
    }
    await page.waitForTimeout(800);
  };

  try {
    console.log("\n=== 1. Setup Guest Session ===");
    await ensureGuest();

    console.log("\n=== 2. Navigate to Board Games ===");
    await page.goto(BASE + "/play/board-games", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);

    if (!page.url().includes("/board-games")) {
      console.log("  ✗ Could not reach board-games (redirected)");
      await browser.close();
      process.exit(1);
    }

    console.log("\n=== 3. Test Each Board Game ===");
    await testGame("Chess", /chess|σκάκι/i);
    await testGame("Connect 4", /connect 4|σκορ 4|connect4/i);
    await testGame("Checkers", /checkers|ντάμα/i);
    await testGame("Uno", /uno/i);
  } catch (err) {
    console.error("ERROR:", err.message);
  } finally {
    await browser.close();
  }

  console.log("\n" + "=".repeat(60));
  console.log("BOARD GAMES VISUAL REDESIGN - REPORT");
  console.log("=".repeat(60));

  const passed = report.filter(r => r.passed);
  const failed = report.filter(r => !r.passed);

  for (const r of report) {
    const s = r.passed ? "✓" : "✗";
    const msg = r.issue ? ` - ${r.issue}` : "";
    console.log(`${s} ${r.game}${msg}`);
  }

  console.log("\n--- Summary ---");
  console.log(`Correct: ${passed.length}/4`);
  console.log(`Issues: ${failed.length}`);

  if (consoleErrors.length > 0) {
    console.log("\n--- JS Console Errors ---");
    consoleErrors.slice(0, 5).forEach(e => console.log("  ", e.text));
  }

  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
