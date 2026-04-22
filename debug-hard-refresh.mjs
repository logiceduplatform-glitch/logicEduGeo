/**
 * Debug: Hard refresh on My Games, wait, screenshot, check favorites vs displayed cards.
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

  const consoleLogs = [];
  page.on("console", (msg) => {
    const text = msg.text();
    consoleLogs.push(text);
    process.stdout.write(`[console] ${text}\n`);
  });

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
      JSON.stringify([
        "quiz_LogicMath",
        "quiz_NaturalWorld",
        "quiz_Adventures",
        "memoryCards",
        "simon",
      ])
    );
  });

  // Step 1: Navigate with cache bypass (hard refresh equivalent)
  console.log("Step 1: Navigating to my-games with cache bypass...");
  await page.goto(BASE + "/my-games", {
    waitUntil: "networkidle",
    timeout: 15000,
  });

  // Hard refresh (location.reload(true) - true is deprecated but still works)
  await page.evaluate(() => location.reload(true));

  // Step 2: Wait 3 seconds
  console.log("Step 2: Waiting 3 seconds...");
  await page.waitForTimeout(3000);

  // Step 3: Screenshot
  const screenshotPath = join(OUT, "my-games-hard-refresh.png");
  await page.screenshot({ path: screenshotPath });
  console.log("Step 3: Screenshot saved:", screenshotPath);

  // Step 4: Check favorites
  console.log("\nStep 4: Checking favorites...");
  await page.evaluate(() => {
    const favs = JSON.parse(localStorage.getItem("geo:progress:favorites"));
    console.log("Favorites:", JSON.stringify(favs));
    console.log("Favorites count:", favs?.length);
  });

  // Step 5: Count game cards
  console.log("\nStep 5: Counting game cards...");
  const step5Result = await page.evaluate(() => {
    const cards = document.querySelectorAll(".grid > div");
    const countText = document.querySelector("p.uppercase");
    return {
      cardsCount: cards.length,
      countText: countText?.textContent?.trim() || null,
    };
  });
  console.log("Cards in grid:", step5Result.cardsCount);
  console.log("Count text:", step5Result.countText);

  // Step 6: Report
  const favs = await page.evaluate(() => {
    try {
      return JSON.parse(localStorage.getItem("geo:progress:favorites")) || [];
    } catch {
      return [];
    }
  });

  console.log("\n--- Step 6: REPORT ---");
  console.log("Favorites stored:", favs.length);
  console.log("Favorites IDs:", JSON.stringify(favs));
  console.log("Game cards displayed:", step5Result.cardsCount);
  console.log("Count text shown:", step5Result.countText);
  console.log(
    "Match:",
    favs.length === step5Result.cardsCount ? "YES" : "NO (mismatch)"
  );

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
