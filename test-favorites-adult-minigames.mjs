/**
 * Continue adult favorites flow: add 2 mini-games to existing 3 quiz favorites.
 * Prerequisite: 3 quiz categories already favorited (quiz_LogicMath, quiz_NaturalWorld, quiz_Adventures)
 * Steps: Navigate to brain -> Scroll to mini-games -> Star Memory Cards + Simon Game -> My Games -> Screenshot
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
    // Pre-populate: guest profile + 3 quiz favorites (continuation from previous session)
    await context.addInitScript(() => {
      localStorage.setItem(
        "geo:guestProfile",
        JSON.stringify({
          id: "guest_adult_" + Date.now(),
          age: "Adult",
          name: "Adult User",
          createdAt: new Date().toISOString(),
          playsUsed: 0,
          maxPlays: 99,
          maxMinutes: 60,
        })
      );
      localStorage.setItem(
        "geo:progress:favorites",
        JSON.stringify(["quiz_LogicMath", "quiz_NaturalWorld", "quiz_Adventures"])
      );
    });

    // Step 1: Navigate to Brain Training
    log("Step 1: Navigating to /play/adult-games/brain...");
    await page.goto(BASE + "/play/adult-games/brain", {
      waitUntil: "networkidle",
      timeout: 15000,
    });

    // Step 2: Scroll down to mini-games section (below Quiz categories)
    log("Step 2: Scrolling to mini-games section...");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(500);

    // Step 3: Find mini-game cards by title and click their star buttons
    // Memory Cards: el "Memory Cards" or "Βρες τα ζευγάρια"; Simon Game: "Simon Game" or "Επανάλαβε τη σειρά"
    const memoryCard = page.locator('button').filter({ has: page.locator('h3:has-text("Memory Cards"), h3:has-text("Βρες τα ζευγάρια")') }).first();
    const simonCard = page.locator('button').filter({ has: page.locator('h3:has-text("Simon Game"), h3:has-text("Επανάλαβε")') }).first();

    const memoryStar = memoryCard.locator('[title="Favorite"], [title="Αγαπημένο"]');
    const simonStar = simonCard.locator('[title="Favorite"], [title="Αγαπημένο"]');

    log("Step 3a: Clicking star on Memory Cards...");
    await memoryStar.click();
    await page.waitForTimeout(300);

    log("Step 3b: Clicking star on Simon Game...");
    await simonStar.click();
    await page.waitForTimeout(300);

    // Step 4: Check localStorage favorites
    const favs = await page.evaluate(() => {
      try {
        return JSON.parse(localStorage.getItem("geo:progress:favorites")) || [];
      } catch {
        return null;
      }
    });
    log("Step 4: localStorage favorites = " + JSON.stringify(favs));

    // Step 5: Navigate to My Games
    log("Step 5: Navigating to /my-games...");
    await page.goto(BASE + "/my-games", { waitUntil: "networkidle", timeout: 10000 });

    // Step 6: Screenshot
    await page.screenshot({ path: join(OUT, "adult-fav-5-all-favorites.png") });
    log("Step 6: Screenshot saved: adult-fav-5-all-favorites.png");

    // Step 7: Report
    const gridCount = await page.evaluate(() => {
      return document.querySelectorAll('[class*="grid"] > div').length;
    });
    const favTabCount = await page.locator('button:has-text("Αγαπημένα"), button:has-text("Favorites")').filter({ hasText: /\d/ }).textContent().catch(() => "");
    const emptyMsg = await page.getByText(/no favorites yet|κανένα αγαπημένο/i).count();

    log("Step 7: Grid cards shown = " + gridCount);
    log("Step 7: Favorites tab badge = " + favTabCount);
    log("Step 7: Empty msg visible = " + (emptyMsg > 0));
    log("Step 7: All 5 favorites expected = " + (favs && favs.length === 5));
  } catch (err) {
    log("ERROR: " + err.message);
  } finally {
    await browser.close();
  }

  console.log("\n--- REPORT ---");
  report.forEach((r) => console.log(r));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
