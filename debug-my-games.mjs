/**
 * Debug My Games page: run user-provided JS and capture console output.
 */
import { chromium } from "playwright";
import { join } from "path";

const BASE = "http://localhost:5173";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const consoleLogs = [];
  page.on("console", (msg) => {
    const type = msg.type();
    const text = msg.text();
    consoleLogs.push({ type, text });
    process.stdout.write(`[console.${type}] ${text}\n`);
  });

  await context.addInitScript(() => {
    localStorage.setItem("geo:guestProfile", JSON.stringify({
      id: "guest_adult_" + Date.now(),
      age: "Adult",
      name: "Adult User",
      createdAt: new Date().toISOString(),
      playsUsed: 0,
      maxPlays: 99,
      maxMinutes: 60,
    }));
    localStorage.setItem("geo:progress:favorites", JSON.stringify([
      "quiz_LogicMath",
      "quiz_NaturalWorld",
      "quiz_Adventures",
      "memoryCards",
      "simon",
    ]));
  });

  console.log("Navigating to", BASE + "/my-games", "...");
  await page.goto(BASE + "/my-games", { waitUntil: "networkidle", timeout: 15000 });

  // Run the first debug block
  console.log("\n--- Running first debug block ---");
  await page.evaluate(() => {
    const allGameIds = document.querySelectorAll("[data-game-id]");
    console.log("Game cards with data-game-id:", allGameIds.length);
    const hasMemory = document.body.innerHTML.includes("memoryCards");
    console.log("Page HTML contains memoryCards:", hasMemory);
    const favs = JSON.parse(localStorage.getItem("geo:progress:favorites"));
    console.log("Favorites:", JSON.stringify(favs));
  });

  await page.waitForTimeout(300);

  // Run the import block (may fail in bundled app)
  console.log("\n--- Running import block ---");
  await page.evaluate(async () => {
    try {
      const m = await import("/src/config/adultGameConfig.js");
      console.log("ADULT_GAME_CATEGORIES categories:", m.ADULT_GAME_CATEGORIES?.length);
      console.log("Total adult games:", m.ADULT_GAME_CATEGORIES?.flatMap((c) => c.games)?.length);
      const allGameIds = m.ADULT_GAME_CATEGORIES?.flatMap((c) => c.games)?.map((g) => g.id);
      console.log("Adult game IDs:", JSON.stringify(allGameIds));
      console.log("memoryCards in adult games:", allGameIds?.includes("memoryCards"));
      console.log("simon in adult games:", allGameIds?.includes("simon"));
    } catch (e) {
      console.error("Import failed:", e?.message || e);
    }
  });

  await page.waitForTimeout(500);

  // Also try Vite's typical path for source modules
  console.log("\n--- Trying alternative import path ---");
  await page.evaluate(async () => {
    try {
      const m = await import("/@fs/home/gmemakis/Documents/geo/copilot_project/react_ui_with_icons/Geo_Platform_1/vite_react_tailwind_full_ui_home_page/src/config/adultGameConfig.js");
      console.log("(alt path) ADULT_GAME_CATEGORIES categories:", m.ADULT_GAME_CATEGORIES?.length);
      const allGameIds = m.ADULT_GAME_CATEGORIES?.flatMap((c) => c.games)?.map((g) => g.id);
      console.log("(alt path) memoryCards in adult games:", allGameIds?.includes("memoryCards"));
    } catch (e) {
      console.error("(alt path) Import failed:", e?.message || e);
    }
  });

  await page.waitForTimeout(300);

  console.log("\n--- ALL CONSOLE OUTPUT (collected) ---");
  consoleLogs.forEach(({ type, text }) => console.log(`[${type}] ${text}`));

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
