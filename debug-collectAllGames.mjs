/**
 * Debug collectAllGames: run user-provided JS and capture console output.
 */
import { chromium } from "playwright";

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

  console.log("\n--- Running FULL collectAllGames debug script ---");
  await page.evaluate(() => {
    Promise.all([
      import("/src/config/adultGameConfig.js"),
      import("/src/config/funGameConfig.js"),
      import("/src/components/games/board/BoardGamesSidebar.jsx"),
      import("/src/config/activityConfig.js")
    ]).then(([adultMod, funMod, boardMod, actMod]) => {
      const results = [];
      const seen = new Set();
      const add = (game) => {
        if (seen.has(game.id)) return;
        seen.add(game.id);
        results.push(game);
      };

      // 1. Fun games - ALL age groups
      const ALL_AGE_GROUPS = ["4-5", "6", "7-8", "9-10", "11-12"];
      for (const ag of ALL_AGE_GROUPS) {
        for (const mode of ["fun", "logic"]) {
          try {
            const cats = funMod.getGameCategories(ag, mode);
            if (cats) {
              for (const [catId, games] of Object.entries(cats)) {
                for (const g of games) {
                  add({ ...g, source: "fun", ageGroup: ag, mode, categoryId: catId });
                }
              }
            }
          } catch (e) {}
        }
      }
      console.log("After fun games:", results.length, "Has memoryCards:", seen.has("memoryCards"), "Has simon:", seen.has("simon"));

      // 2. Adult games
      for (const cat of adultMod.ADULT_GAME_CATEGORIES) {
        for (const g of cat.games || []) {
          add({ id: g.id, title: g.title, source: "adult", categoryId: cat.id });
        }
      }
      console.log("After adult games:", results.length, "Has memoryCards:", seen.has("memoryCards"), "Has simon:", seen.has("simon"));

      // 3. Quiz cats
      const QUIZ_CATS = [
        { id: "LogicMath" }, { id: "NaturalWorld" }, { id: "Adventures" },
        { id: "BrainTeasers" }, { id: "Edutainment" }, { id: "History" },
        { id: "Language" }, { id: "Space" }, { id: "Politics" },
        { id: "Health" }, { id: "Art" }
      ];
      for (const q of QUIZ_CATS) {
        add({ id: "quiz_" + q.id, source: "adult", categoryId: "brainTraining" });
      }
      console.log("After quiz cats:", results.length);

      // 4. Board games
      const BOARD_GAMES = boardMod.GAMES;
      console.log("BOARD_GAMES count:", BOARD_GAMES?.length);
      for (const g of BOARD_GAMES || []) {
        add({ id: g.id, title: g.label, source: "board" });
      }
      console.log("After board games:", results.length);

      // 5. Activities
      const ACTIVITIES = actMod.ACTIVITIES;
      console.log("ACTIVITIES keys:", Object.keys(ACTIVITIES || {}));
      if (ACTIVITIES) {
        for (const [catId, acts] of Object.entries(ACTIVITIES)) {
          for (const a of acts) {
            add({ id: a.id, title: a.title, source: "activity", categoryId: catId });
          }
        }
      }
      console.log("After activities:", results.length);

      // Final check
      const favs = JSON.parse(localStorage.getItem("geo:progress:favorites"));
      console.log("FINAL - Total games:", results.length);
      favs.forEach((id) => {
        const found = results.find((g) => g.id === id);
        console.log("  Favorite", id, ":", found ? "FOUND (source: " + found.source + ")" : "NOT FOUND");
      });
    }).catch((e) => console.error("Import failed:", e));
  });

  await page.waitForTimeout(2000);

  console.log("\n--- ALL CONSOLE OUTPUT ---");
  consoleLogs.forEach(({ type, text }) => console.log(`[${type}] ${text}`));

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
