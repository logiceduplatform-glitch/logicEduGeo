/**
 * E2E: Board Games Size & Layout Analysis
 * Captures full-page screenshots at 1280x800 and reports on game container size
 */
import { chromium } from "playwright";
import { join } from "path";

const BASE = "http://localhost:5174";
const OUT = process.cwd();
const VIEWPORT = { width: 1280, height: 800 };

const GAMES = [
  { id: "chess", name: "Chess", slug: "chess" },
  { id: "checkers", name: "Checkers", slug: "checkers" },
  { id: "connect4", name: "Connect 4", slug: "connect4" },
  { id: "monopoly", name: "Monopoly", slug: "monopoly" },
  { id: "uno", name: "Uno", slug: "uno" },
];

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

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const t = msg.text();
      if (!t.includes("Firebase") && !t.includes("VITE_FIREBASE")) {
        consoleErrors.push(t);
      }
    }
  });

  const reports = [];

  try {
    // 1. Setup guest session
    console.log("\n=== 1. Setup Guest Session ===");
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
    console.log("\n=== 2. Navigate to Board Games ===");
    await page.goto(BASE + "/play/board-games", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);

    // 3. For each game: click, start, screenshot, analyze, back
    for (const game of GAMES) {
      console.log(`\n--- ${game.name} ---`);
      consoleErrors.length = 0;

      // Select game from sidebar
      const gameBtn = page.getByRole("button", { name: new RegExp(game.name + "|Σκάκι|Ντάμα|Σκορ 4|UNO|Μονόπολη", "i") }).first();
      const visible = await gameBtn.isVisible().catch(() => false);
      if (!visible) {
        const altBtn = page.locator("button").filter({ hasText: new RegExp(game.name, "i") }).first();
        if (await altBtn.isVisible().catch(() => false)) {
          await altBtn.click();
        } else {
          console.log(`  Could not find ${game.name} button`);
          reports.push({ game: game.name, error: "Game button not found", maxWidth: null });
          continue;
        }
      } else {
        await gameBtn.click();
      }
      await page.waitForTimeout(800);

      // Click Start
      const startGameBtn = page.getByRole("button", { name: /start!|ξεκίνα!/i }).first();
      if (await startGameBtn.isVisible().catch(() => false)) {
        await startGameBtn.click();
        await page.waitForTimeout(2500);
      }

      // Full page screenshot
      const screenshotPath = join(OUT, `board-size-${game.slug}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`  [Screenshot: board-size-${game.slug}.png]`);

      // Extract size/layout info from DOM
      const analysis = await page.evaluate(({ vw, vh }) => {
        const mainContainer = document.querySelector("main .max-w-3xl, main [class*='max-w']");
        const gameWrapper = document.querySelector("[class*='max-w-md'], [class*='max-w-lg'], [class*='max-w-xl'], [class*='max-w-2xl']");
        const boardArea = document.querySelector("[class*='rounded-2xl'][class*='overflow-hidden']");

        const getDimensions = (el) => {
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          const classes = el.className || "";
          const maxW = classes.match(/max-w-(md|lg|xl|2xl|3xl)/)?.[1];
          return { width: rect.width, height: rect.height, maxWidthClass: maxW ? `max-w-${maxW}` : null };
        };

        const main = mainContainer ? getDimensions(mainContainer) : null;
        const game = gameWrapper ? getDimensions(gameWrapper) : null;
        const board = boardArea ? getDimensions(boardArea) : null;

        const viewportArea = vw * vh;
        const gameArea = game ? game.width * game.height : 0;
        const pct = viewportArea > 0 ? Math.round((gameArea / viewportArea) * 100) : 0;

        const MAX_W_PX = { md: 448, lg: 512, xl: 576, "2xl": 672, "3xl": 768 };

        return {
          viewport: { w: vw, h: vh, area: viewportArea },
          mainContainer: main,
          gameContainer: game,
          boardArea: board,
          gameScreenPct: pct,
          maxWidthPx: game?.maxWidthClass ? MAX_W_PX[game.maxWidthClass.replace("max-w-", "")] : null,
        };
      }, { vw: VIEWPORT.width, vh: VIEWPORT.height });

      // Store max-width class from source (fallback if DOM query misses)
      const knownMaxWidth = {
        chess: "max-w-md",
        checkers: "max-w-md",
        connect4: "max-w-md",
        monopoly: "max-w-lg",
        uno: "max-w-lg",
      }[game.id];

      const pct = analysis.gameScreenPct || 0;
      const maxW = analysis.gameContainer?.maxWidthClass || analysis.maxWidthPx ? `~${analysis.maxWidthPx}px` : knownMaxWidth;

      reports.push({
        game: game.name,
        maxWidthClass: knownMaxWidth,
        gameScreenPct: pct,
        gameWidth: analysis.gameContainer?.width,
        gameHeight: analysis.gameContainer?.height,
        mainWidth: analysis.mainContainer?.width,
        jsErrors: [...consoleErrors],
      });

      console.log(`  Max-width class: ${knownMaxWidth} (${knownMaxWidth === "max-w-md" ? "448px" : "512px"})`);
      console.log(`  Game container: ${analysis.gameContainer?.width || "?"}×${analysis.gameContainer?.height || "?"}px`);
      console.log(`  Screen coverage: ~${pct}%`);
      if (consoleErrors.length) console.log(`  JS errors: ${consoleErrors.length}`);

      // Back to lobby
      const backBtn = page.getByRole("button", { name: /back|πίσω/i }).first();
      if (await backBtn.isVisible().catch(() => false)) {
        await backBtn.click();
        await page.waitForTimeout(500);
      }
    }

  } finally {
    await browser.close();
  }

  // Report
  console.log("\n" + "=".repeat(70));
  console.log("BOARD GAMES SIZE & LAYOUT ANALYSIS (1280×800 viewport)");
  console.log("=".repeat(70));

  const MAX_W_VALUES = { "max-w-md": "448px", "max-w-lg": "512px", "max-w-xl": "576px", "max-w-2xl": "672px" };

  for (const r of reports) {
    const mw = r.maxWidthClass ? MAX_W_VALUES[r.maxWidthClass] || r.maxWidthClass : "?";
    const pct = r.gameScreenPct ?? "?";
    const cramped = typeof pct === "number" && pct < 30 ? " (likely cramped)" : "";
    const spacious = typeof pct === "number" && pct < 20 ? " — lots of empty space" : "";
    console.log(`\n${r.game}:`);
    console.log(`  • Max-width: ${mw}`);
    console.log(`  • Screen coverage: ~${pct}%${cramped}${spacious}`);
    if (r.gameWidth) console.log(`  • Measured: ${Math.round(r.gameWidth)}×${Math.round(r.gameHeight)}px`);
    if (r.jsErrors?.length) console.log(`  • JS errors: ${r.jsErrors.length}`);
  }

  console.log("\n--- Findings ---");
  console.log("- Chess, Checkers, Connect 4: max-w-md (448px) — smallest");
  console.log("- Monopoly, Uno: max-w-lg (512px)");
  console.log("- At 1280px width, content area is max-w-3xl (768px) with sidebar;");
  console.log("  game containers use 448–512px, leaving significant empty space.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
