/**
 * Debug: favorites from 4-5 Logic page not showing on My Games.
 */
import { chromium } from "playwright";
import { join } from "path";

const BASE = "http://localhost:5173";
const OUT = process.cwd();

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const consoleLogs = [];
  page.on("console", (msg) => {
    const text = msg.text();
    consoleLogs.push(text);
    process.stdout.write(`[console] ${text}\n`);
  });

  try {
    console.log("Step 1: Clearing localStorage...");
    await page.goto(BASE, { waitUntil: "networkidle", timeout: 15000 });
    await page.evaluate(() => localStorage.clear());

    console.log("Step 2: On homepage");
    await page.goto(BASE, { waitUntil: "networkidle", timeout: 10000 });

    console.log("Step 3: Try as guest -> 4-5 -> any objective -> proceed");
    await page.getByRole("button", { name: /try as guest|δοκίμασε ως επισκέπτη/i }).first().click();
    await page.waitForURL(/guest-setup/, { timeout: 5000 });
    await page.getByRole("button", { name: /4-5|🧒/i }).first().click();
    await page.getByRole("button", { name: /next|επόμενο/i }).click();
    // Select Logic objective to match 4-5-logic
    await page.getByRole("button", { name: /logic|λογική|🧩/i }).first().click();
    await page.getByRole("button", { name: /let's play|ας παίξουμε/i }).click();
    await page.waitForURL(/\/play\/4-5/, { timeout: 8000 });

    console.log("Step 4: Navigate to 4-5-logic...");
    await page.goto(BASE + "/play/4-5-logic", { waitUntil: "networkidle", timeout: 10000 });
    await page.waitForTimeout(1500);

    console.log("Step 5: Screenshot of 4-5 logic games...");
    await page.screenshot({ path: join(OUT, "debug-4-5-logic-games.png") });

    console.log("Step 6: Starring 2 games...");
    const starBtns = page.locator('[title="Favorite"], [title="Αγαπημένο"]');
    const count = await starBtns.count();
    console.log("  Star buttons found:", count);

    const starredNames = [];
    let clicked = 0;
    for (let i = 0; i < count && clicked < 2; i++) {
      const btn = starBtns.nth(i);
      const txt = await btn.textContent().catch(() => "");
      if (txt && txt.includes("☆")) {
        const card = btn.locator("xpath=ancestor::button[1] | ancestor::div[contains(@class,'rounded')][1]").first();
        const name = await card.locator("h3").first().textContent().catch(() => `game-${i}`);
        starredNames.push(name?.trim() || `game-${i}`);
        await btn.scrollIntoViewIfNeeded();
        await btn.click();
        clicked++;
        await page.waitForTimeout(500);
      }
    }
    console.log("  Starred games:", starredNames);

    console.log("Step 7: Checking localStorage...");
    await page.evaluate(() => {
      const favs = JSON.parse(localStorage.getItem("geo:progress:favorites"));
      console.log("Favorites:", JSON.stringify(favs));
    });
    await page.waitForTimeout(300);

    console.log("Step 8: Running funGameConfig debug...");
    await page.evaluate(() => {
      import("/src/config/funGameConfig.js").then((mod) => {
        const favs = JSON.parse(localStorage.getItem("geo:progress:favorites"));
        console.log("Favorites:", JSON.stringify(favs));

        const ALL_AGE_GROUPS = ["4-5", "6", "7-8", "9-10", "11-12"];
        const allIds = new Set();

        for (const ag of ALL_AGE_GROUPS) {
          for (const mode of ["fun", "logic"]) {
            try {
              const cats = mod.getGameCategories(ag, mode);
              if (cats) {
                for (const [catId, games] of Object.entries(cats)) {
                  for (const g of games) {
                    allIds.add(g.id);
                  }
                }
              }
            } catch (e) {
              console.log("Error for", ag, mode, ":", e.message);
            }
          }
        }

        console.log("Total unique fun/logic game IDs:", allIds.size);

        favs?.forEach((id) => {
          console.log("  Favorite", id, ":", allIds.has(id) ? "FOUND" : "NOT FOUND");
        });
      });
    });
    await page.waitForTimeout(2000);

    console.log("Step 9: Navigate to my-games...");
    await page.goto(BASE + "/my-games", { waitUntil: "networkidle", timeout: 10000 });

    console.log("Step 10: Hard refresh...");
    await page.evaluate(() => location.reload(true));
    await page.waitForTimeout(3000);

    console.log("Step 11: Screenshot My Games...");
    await page.screenshot({ path: join(OUT, "debug-4-5-logic-my-games.png") });

    console.log("Step 12: Check what's displayed...");
    await page.evaluate(() => {
      const favs = JSON.parse(localStorage.getItem("geo:progress:favorites"));
      console.log("Stored favorites:", JSON.stringify(favs));
      const cards = document.querySelectorAll(".grid > div");
      console.log("Displayed cards:", cards.length);
      const countText = document.querySelector("p.uppercase");
      console.log("Count text:", countText?.textContent);
    });
    await page.waitForTimeout(500);

    console.log("\n--- ALL CONSOLE OUTPUT ---");
    consoleLogs.forEach((t) => console.log(t));
  } catch (err) {
    console.error("ERROR:", err.message);
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
