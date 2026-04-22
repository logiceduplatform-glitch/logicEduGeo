/**
 * Test favorites flow for child age 4-5.
 * Steps: Clear storage -> Guest (4-5) -> Games page -> Star 2 games -> My Games -> Debug
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
    const type = msg.type();
    const text = msg.text();
    consoleLogs.push({ type, text });
    process.stdout.write(`[console.${type}] ${text}\n`);
  });

  const report = [];
  const log = (msg) => {
    report.push(msg);
    console.log(msg);
  };

  try {
    // Step 1: Clear localStorage
    log("Step 1: Clearing localStorage...");
    await page.goto(BASE, { waitUntil: "networkidle", timeout: 15000 });
    await page.evaluate(() => localStorage.clear());

    // Step 2: Already on home
    log("Step 2: On homepage");

    // Step 3: Click "Try as guest"
    log("Step 3: Clicking Try as guest...");
    await page.getByRole("button", { name: /try as guest|δοκίμασε ως επισκέπτη/i }).first().click();
    await page.waitForURL(/guest-setup/, { timeout: 5000 });

    // Step 4: Select age 4-5
    log("Step 4: Selecting age 4-5...");
    await page.getByRole("button", { name: /4-5|🧒/i }).first().click();
    await page.getByRole("button", { name: /next|επόμενο/i }).click();

    // Step 5: Complete guest setup - select Fun objective
    log("Step 5: Selecting Fun objective and proceeding...");
    await page.getByRole("button", { name: /fun|διασκέδαση|🎉/i }).first().click();
    await page.getByRole("button", { name: /let's play|ας παίξουμε/i }).click();

    await page.waitForURL(/\/play\//, { timeout: 8000 });
    log("Step 6: Landed at: " + page.url());

    // Step 6b: Ensure we're on 4-5 fun (e.g. /play/4-5-fun)
    const url = page.url();
    if (!url.includes("4-5")) {
      log("Step 6b: Navigating to 4-5 fun...");
      await page.goto(BASE + "/play/4-5-fun", { waitUntil: "networkidle", timeout: 10000 });
    }

    await page.waitForTimeout(1000);

    // Step 7: Find and click star on 2 game cards
    log("Step 7: Finding and clicking stars on 2 games...");
    const starButtons = page.locator('[title="Favorite"], [title="Αγαπημένο"]');
    const count = await starButtons.count();
    log("  Found " + count + " star buttons");

    let clicked = 0;
    for (let i = 0; i < count && clicked < 2; i++) {
      const btn = starButtons.nth(i);
      const txt = await btn.textContent().catch(() => "");
      if (txt && txt.includes("☆")) {
        await btn.scrollIntoViewIfNeeded();
        await btn.click();
        clicked++;
        log("  Starred game " + clicked);
        await page.waitForTimeout(200);
      }
    }

    // Step 8: Check localStorage
    log("Step 8: Checking favorites and guest age...");
    const step8 = await page.evaluate(() => {
      const favs = JSON.parse(localStorage.getItem("geo:progress:favorites")) || [];
      const guest = JSON.parse(localStorage.getItem("geo:guestProfile")) || null;
      return { favs, guestAge: guest?.age };
    });
    log("  Favorites: " + JSON.stringify(step8.favs));
    log("  Guest age: " + step8.guestAge);

    // Step 9: Navigate to My Games
    log("Step 9: Navigating to /my-games...");
    await page.goto(BASE + "/my-games", { waitUntil: "networkidle", timeout: 10000 });

    await page.waitForTimeout(500);

    // Step 10: Screenshot
    await page.screenshot({ path: join(OUT, "fav-4-5-my-games.png") });
    log("Step 10: Screenshot saved: fav-4-5-my-games.png");

    // Step 11: Run debug import
    log("Step 11: Running funGameConfig debug...");
    await page.evaluate(() => {
      import("/src/config/funGameConfig.js").then((mod) => {
        const cats45fun = mod.getGameCategories("4-5", "fun");
        const cats45logic = mod.getGameCategories("4-5", "logic");

        const funGameIds = cats45fun ? Object.values(cats45fun).flat().map((g) => g.id) : [];
        const logicGameIds = cats45logic ? Object.values(cats45logic).flat().map((g) => g.id) : [];

        const favs = JSON.parse(localStorage.getItem("geo:progress:favorites")) || [];
        console.log("4-5 fun game IDs count:", funGameIds.length);
        console.log("4-5 logic game IDs count:", logicGameIds.length);
        console.log("Favorites:", JSON.stringify(favs));

        favs?.forEach((id) => {
          const inFun = funGameIds.includes(id);
          const inLogic = logicGameIds.includes(id);
          console.log("  ", id, "-> fun:", inFun, "logic:", inLogic);
        });
      });
    });

    await page.waitForTimeout(1000);

    // Step 12: Count visible cards
    log("Step 12: Counting visible cards...");
    const step12 = await page.evaluate(() => {
      const cards = document.querySelectorAll(".grid > div");
      const countText = document.querySelector("p.uppercase");
      return {
        cardsCount: cards.length,
        countText: countText?.textContent || "",
      };
    });
    log("  Visible cards: " + step12.cardsCount);
    log("  Count text: " + step12.countText);

    console.log("\n--- REPORT ---");
    report.forEach((r) => console.log(r));
    console.log("\n--- CONSOLE OUTPUT ---");
    consoleLogs.filter((l) => l.text && !l.text.includes("[vite]") && !l.text.includes("React DevTools") && !l.text.includes("Firebase")).forEach(({ text }) => console.log(text));
  } catch (err) {
    log("ERROR: " + err.message);
    console.log("\n--- REPORT ---");
    report.forEach((r) => console.log(r));
    console.log("\n--- CONSOLE OUTPUT ---");
    consoleLogs.forEach(({ text }) => console.log(text));
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
