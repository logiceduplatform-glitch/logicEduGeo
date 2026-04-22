/**
 * Adult favorites flow E2E test.
 * Steps: Clear storage -> Home -> Guest (Adult) -> Adult games -> Star items -> My Games -> Report
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
    // Step 1: Clear localStorage - navigate first, then clear
    log("Step 1: Navigating and clearing localStorage...");
    await page.goto(BASE, { waitUntil: "networkidle", timeout: 15000 });
    await page.evaluate(() => localStorage.clear());

    // Step 2: Ensure we're on home (already there)
    log("Step 2: On homepage");

    // Step 3: Click "Try as guest"
    log("Step 3: Clicking Try as guest...");
    await page.getByRole("button", { name: /try as guest|δοκίμασε ως επισκέπτη/i }).first().click();
    await page.waitForURL(/guest-setup/, { timeout: 5000 });

    // Step 4: Select ADULT age group
    log("Step 4: Selecting Adult age group...");
    await page.getByRole("button", { name: /adult|ενήλικες|🧠/i }).first().click();
    await page.getByRole("button", { name: /next|επόμενο/i }).click();

    // Step 5: Complete guest setup - select Brain Training objective
    log("Step 5: Selecting Brain Training objective...");
    await page.getByRole("button", { name: /brain|εξάσκηση|μυαλ|🧠/i }).first().click();
    await page.getByRole("button", { name: /let's play|ας παίξουμε/i }).click();

    await page.waitForURL(/\/play\/adult-games/, { timeout: 8000 });
    log("Step 6: Arrived at Adult games page: " + page.url());

    // Step 6: Screenshot Adult games page (already on Brain category from guest setup)
    await page.waitForTimeout(1000); // let content render
    await page.screenshot({ path: join(OUT, "adult-fav-1-categories.png") });
    log("Step 6: Screenshot saved: adult-fav-1-categories.png");

    // Step 7: If we see category cards, click Brain Training; else we're already in-brain
    const brainCard = page.getByRole("button", { name: /brain training|εξάσκηση μυαλού/i }).first();
    if (await brainCard.isVisible().catch(() => false)) {
      log("Step 7: Clicking Brain Training category card...");
      await brainCard.click();
      await page.waitForTimeout(1000);
    } else {
      log("Step 7: Already in Brain Training category");
    }

    // Step 8: Find and click star (☆) on 2-3 items (quiz categories or games)
    const starButtons = page.locator('[title="Favorite"], [title="Αγαπημένο"]');
    const count = await starButtons.count();
    log("Step 8a: Found " + count + " star buttons");

    const gamesStarred = [];
    for (let i = 0; i < Math.min(3, count); i++) {
      const btn = starButtons.nth(i);
      const text = await btn.textContent().catch(() => "");
      if (text.includes("☆") || !text.includes("★")) {
        await btn.click();
        gamesStarred.push("item-" + (i + 1));
        await page.waitForTimeout(200);
      }
    }
    log("Step 8: Starred " + gamesStarred.length + " items");

    // Step 9: Screenshot after starring
    await page.screenshot({ path: join(OUT, "adult-fav-2-after-star.png") });
    log("Step 9: Screenshot saved: adult-fav-2-after-star.png");

    // Step 10: Check localStorage favorites
    const favs = await page.evaluate(() => {
      try {
        return JSON.parse(localStorage.getItem("geo:progress:favorites")) || [];
      } catch {
        return null;
      }
    });
    log("Step 10: localStorage favorites = " + JSON.stringify(favs));

    // Step 11: Navigate to My Games
    log("Step 11: Navigating to /my-games...");
    await page.goto(BASE + "/my-games", { waitUntil: "networkidle", timeout: 10000 });

    // Step 12: Screenshot My Games page
    await page.screenshot({ path: join(OUT, "adult-fav-3-my-games.png") });
    log("Step 12: Screenshot saved: adult-fav-3-my-games.png");

    // Step 13: Report data
    const guestProfile = await page.evaluate(() => {
      try {
        return JSON.parse(localStorage.getItem("geo:guestProfile")) || null;
      } catch {
        return null;
      }
    });
    const guestAge = guestProfile?.age ?? "N/A";
    log("Step 13a: Guest profile age = " + guestAge);

    const gridCount = await page.evaluate(() => {
      const els = document.querySelectorAll('[class*="grid"] > div');
      return els.length;
    });
    log("Step 13b: Grid children count = " + gridCount);

    const emptyMsg = await page.getByText(/no favorites yet|κανένα αγαπημένο/i).count();
    const showsFavorites = emptyMsg === 0;
    log("Step 13c: My Games shows favorited games = " + showsFavorites);
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
