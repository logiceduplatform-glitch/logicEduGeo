/**
 * Full favorites flow E2E test.
 * Steps: Home -> Guest -> Games -> Star 2-3 games -> Check localStorage -> My Games -> Screenshot
 */
import { chromium } from "playwright";
import { join } from "path";

const BASE = "http://localhost:5173";
const OUT = process.cwd();

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  const report = [];
  const log = (msg) => {
    report.push(msg);
    console.log(msg);
  };

  try {
    // Step 1: Navigate to home
    log("Step 1: Navigating to " + BASE + " ...");
    await page.goto(BASE, { waitUntil: "networkidle", timeout: 15000 });

    // Step 2: Screenshot initial state
    await page.screenshot({ path: join(OUT, "fav-flow-1-home.png") });
    log("Step 2: Screenshot saved: fav-flow-1-home.png");

    // Step 3: Click "Try as guest" (Greek or English) - use first() since there may be 2 buttons
    const guestBtn = page.getByRole("button", { name: /try as guest|δοκίμασε ως επισκέπτη/i }).first();
    await guestBtn.click();
    await page.waitForURL(/guest-setup|guest_setup/, { timeout: 5000 }).catch(() => {});

    // Guest setup: choose Age 9-10
    log("Step 3: Guest setup - selecting Age 9-10...");
    await page.getByRole("button", { name: /9-10|🔬/ }).first().click();
    await page.getByRole("button", { name: /next|επόμενο/i }).click();

    // Choose objective: Fun
    await page.getByRole("button", { name: /fun|διασκέδαση|🎉/i }).first().click();
    await page.getByRole("button", { name: /let's play|ας παίξουμε/i }).click();

    await page.waitForURL(/\/play\//, { timeout: 8000 });
    log("Step 4: Arrived at games page: " + page.url());

    // Wait for game grid to load
    await page.waitForSelector('.grid', { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(1000);

    // Debug: screenshot games page before starring
    await page.screenshot({ path: join(OUT, "fav-flow-games-before.png") });

    // Step 5: Find and click star (☆) on 2-3 game cards
    // Wait for game grid to be visible
    await page.waitForSelector('button:has([title="Favorite"]), button:has([title="Αγαπημένο"])', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(500);

    // Star button: div[role=button] with title Favorite/Αγαπημένο, inside each game card
    const starButtons = page.locator('div[role="button"][title="Favorite"], div[role="button"][title="Αγαπημένο"]');
    const count = await starButtons.count();
    log("Step 5a: Found " + count + " star buttons");

    const gamesStarred = [];
    const toClick = Math.min(3, Math.max(1, count));

    for (let i = 0; i < toClick; i++) {
      const btn = starButtons.nth(i);
      const card = btn.locator("xpath=ancestor::button[1]");
      const title = await card.locator("h3").first().textContent().catch(() => "");
      await btn.click();
      gamesStarred.push((title && title.trim()) || `game-${i + 1}`);
      await page.waitForTimeout(300);
    }

    log("Step 5: Starred " + gamesStarred.length + " games: " + JSON.stringify(gamesStarred));

    // Step 6: Check localStorage
    const favs = await page.evaluate(() => {
      try {
        return JSON.parse(localStorage.getItem("geo:progress:favorites")) || [];
      } catch {
        return null;
      }
    });
    log("Step 6: localStorage geo:progress:favorites = " + JSON.stringify(favs));

    // Step 7: Navigate to My Games
    log("Step 7: Navigating to /my-games...");
    await page.goto(BASE + "/my-games", { waitUntil: "networkidle", timeout: 10000 });

    // Step 8: Screenshot My Games page
    await page.screenshot({ path: join(OUT, "fav-flow-2-my-games.png") });
    log("Step 8: Screenshot saved: fav-flow-2-my-games.png");

    // What does My Games show?
    const favTabContent = await page.locator('[data-testid="favorites-tab"], .grid').first();
    const emptyMsg = await page.getByText(/no favorites yet|κανένα αγαπημένο/i).count();
    const gameCards = await page.locator('[class*="rounded-2xl"]').filter({ has: page.locator("h3") }).count();

    log("Step 9: My Games page - empty msg visible: " + (emptyMsg > 0) + ", game cards: " + gameCards);
  } catch (err) {
    log("ERROR: " + err.message);
  } finally {
    await browser.close();
  }

  // Final report
  console.log("\n--- REPORT ---");
  report.forEach((r) => console.log(r));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
