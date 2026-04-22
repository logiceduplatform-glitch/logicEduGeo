/**
 * E2E: Check NEW board game sizes after redesign
 * http://localhost:5174 - viewport 1280x800
 */
import { chromium } from "playwright";
import { join } from "path";

const BASE = "http://localhost:5174";
const VIEWPORT = { width: 1280, height: 800 };
const OUT = process.cwd();

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: VIEWPORT });
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
  const results = [];

  try {
    // 1. Setup guest
    await page.goto(BASE + "/guest-setup", { waitUntil: "domcontentloaded", timeout: 15000 });
    const ageBtn = page.getByRole("button", { name: /^6$|Age 6|🎒/ }).first();
    if (await ageBtn.isVisible().catch(() => false)) {
      await ageBtn.click();
      await page.waitForTimeout(300);
      await page.getByRole("button", { name: /next|επόμενο/i }).click();
      await page.waitForTimeout(300);
    }
    const funBtn = page.getByRole("button", { name: /fun|διασκέδαση|παιχνίδι|🎉/i }).first();
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

    // 2. Go to board games
    await page.goto(BASE + "/play/board-games", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);

    const testGame = async (gameId, gameLabel) => {
      const btn = page.getByRole("button", { name: new RegExp(gameLabel, "i") }).first();
      if (!(await btn.isVisible().catch(() => false))) {
        const sidebar = page.locator(`aside button, nav button`).filter({ hasText: new RegExp(gameLabel, "i") }).first();
        await sidebar.click();
      } else {
        await btn.click();
      }
      await page.waitForTimeout(800);

      const startBtnGame = page.getByRole("button", { name: /start|ξεκίνα/i }).first();
      if (await startBtnGame.isVisible().catch(() => false)) {
        await startBtnGame.click();
        await page.waitForTimeout(2500);
      }

      const measure = await page.evaluate((vw) => {
        const gameEl = document.querySelector("[class*='max-w-']")?.closest("div[class*='rounded-2xl']") ||
          document.querySelector("div.bg-gradient-to-b.from-slate-800");
        const sidebar = document.querySelector("aside");
        const main = document.querySelector("main");
        let w = 0, h = 0, maxWidthClass = "";
        if (gameEl) {
          const rect = gameEl.getBoundingClientRect();
          w = rect.width;
          h = rect.height;
          const cls = gameEl.className;
          const m = cls.match(/max-w-(md|lg|xl|2xl|3xl)/);
          if (m) maxWidthClass = m[0];
        }
        const pctWidth = vw > 0 ? Math.round((w / vw) * 100) : 0;
        return { w, h, pctWidth, maxWidthClass, viewportW: vw };
      }, VIEWPORT.width);

      await page.screenshot({
        path: join(OUT, `board-new-${gameId}.png`),
        fullPage: true,
      });
      console.log(`  [Screenshot: board-new-${gameId}.png]`);

      results.push({
        game: gameLabel,
        width: measure.w,
        height: measure.h,
        pctWidth: measure.pctWidth,
        maxWidthClass: measure.maxWidthClass,
      });

      const backBtn = page.getByRole("button", { name: /back|lobby|πίσω/i }).first();
      if (await backBtn.isVisible().catch(() => false)) {
        await backBtn.click();
        await page.waitForTimeout(500);
      }
      const breadcrumb = page.locator('button, a').filter({ hasText: /παιχνίδια|games/i }).first();
      if (await breadcrumb.isVisible().catch(() => false)) {
        await breadcrumb.click();
        await page.waitForTimeout(500);
      }
    };

    console.log("\n--- Chess ---");
    await testGame("chess", "chess|σκάκι");
    await page.waitForTimeout(500);

    console.log("\n--- Connect 4 ---");
    await testGame("connect4", "connect 4|σκορ 4");
    await page.waitForTimeout(500);

    console.log("\n--- Monopoly ---");
    await testGame("monopoly", "monopoly");
    await page.waitForTimeout(500);

    console.log("\n--- Uno ---");
    await testGame("uno", "uno");
    await page.waitForTimeout(500);

  } finally {
    await browser.close();
  }

  // Report
  console.log("\n" + "=".repeat(60));
  console.log("BOARD GAMES NEW SIZES - 1280x800 viewport");
  console.log("=".repeat(60));

  const before = { chess: "25-35%", connect4: "25-35%", monopoly: "30-40%", uno: "30-40%" };

  for (const r of results) {
    const pct = r.pctWidth || Math.round((r.width / VIEWPORT.width) * 100);
    const beforePct = before[r.game.toLowerCase().replace(" ", "")] || "25-40%";
    console.log(`\n${r.game}:`);
    console.log(`  • Screen width used: ~${pct}%`);
    console.log(`  • Before: ${beforePct}`);
    console.log(`  • Measured: ${Math.round(r.width)}x${Math.round(r.height)}px`);
    console.log(`  • Max-width class: ${r.maxWidthClass || "N/A"}`);
  }

  console.log("\n--- Summary ---");
  const chessR = results.find(r => /chess/i.test(r.game));
  const c4R = results.find(r => /connect/i.test(r.game));
  const monoR = results.find(r => /monopoly/i.test(r.game));
  const unoR = results.find(r => /uno/i.test(r.game));

  if (chessR) console.log(`Chess: ~${chessR.pctWidth || Math.round((chessR.width/1280)*100)}% (before: 25-35%)`);
  if (c4R) console.log(`Connect 4: ~${c4R.pctWidth || Math.round((c4R.width/1280)*100)}% (before: 25-35%)`);
  if (monoR) console.log(`Monopoly: ~${monoR.pctWidth || Math.round((monoR.width/1280)*100)}% (before: 30-40%)`);
  if (unoR) console.log(`Uno: ~${unoR.pctWidth || Math.round((unoR.width/1280)*100)}% (before: 30-40%)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
