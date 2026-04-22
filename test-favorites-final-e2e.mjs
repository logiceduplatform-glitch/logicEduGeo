/**
 * Final E2E favorites test: 4-5 guest stars 2 kids + 1 adult game, then My Games.
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

    console.log("Step 3: Try as guest -> 4-5 -> Fun -> proceed");
    await page.getByRole("button", { name: /try as guest|δοκίμασε ως επισκέπτη/i }).first().click();
    await page.waitForURL(/guest-setup/, { timeout: 5000 });
    await page.getByRole("button", { name: /4-5|🧒/i }).first().click();
    await page.getByRole("button", { name: /next|επόμενο/i }).click();
    await page.getByRole("button", { name: /fun|διασκέδαση|🎉/i }).first().click();
    await page.getByRole("button", { name: /let's play|ας παίξουμε/i }).click();
    await page.waitForURL(/\/play\/4-5/, { timeout: 8000 });

    console.log("Step 4: Starring 2 games on 4-5 fun page...");
    await page.waitForTimeout(1000);
    const starBtns = page.locator('[title="Favorite"], [title="Αγαπημένο"]');
    const count = await starBtns.count();
    let clicked4_5 = 0;
    for (let i = 0; i < count && clicked4_5 < 2; i++) {
      const btn = starBtns.nth(i);
      const txt = await btn.textContent().catch(() => "");
      if (txt && txt.includes("☆")) {
        await btn.scrollIntoViewIfNeeded();
        await btn.click();
        clicked4_5++;
        await page.waitForTimeout(500);
      }
    }
    await page.waitForTimeout(800); // extra wait for localStorage write
    const afterKids = await page.evaluate(() => JSON.parse(localStorage.getItem("geo:progress:favorites")) || []);
    console.log("  After 4-5 stars, favorites:", JSON.stringify(afterKids));

    console.log("Step 5: Navigate to adult games brain...");
    await page.goto(BASE + "/play/adult-games/brain", { waitUntil: "networkidle", timeout: 10000 });

    console.log("Step 6: Star 1 adult mini-game...");
    await page.waitForTimeout(1000);
    const memoryCard = page.locator('button:has(h3:text("Memory Cards")), button:has(h3:text("Βρες τα ζευγάρια"))').first();
    const memCount = await memoryCard.count();
    if (memCount > 0) {
      const starBtn = memoryCard.locator('[title="Favorite"], [title="Αγαπημένο"]').first();
      await starBtn.click();
    } else {
      const allStars = page.locator('[title="Favorite"], [title="Αγαπημένο"]');
      const n = await allStars.count();
      const gameIdx = 11;
      if (n > gameIdx) {
        await allStars.nth(gameIdx).click();
      }
    }
    await page.waitForTimeout(300);

    console.log("Step 7: Checking localStorage...");
    const step7 = await page.evaluate(() => {
      const favs = JSON.parse(localStorage.getItem("geo:progress:favorites"));
      const age = JSON.parse(localStorage.getItem("geo:guestProfile"))?.age;
      return { favs: favs || [], age };
    });
    console.log("  Favorites:", JSON.stringify(step7.favs));
    console.log("  Guest age:", step7.age);

    console.log("Step 8: Navigate to my-games with hard refresh...");
    await page.goto(BASE + "/my-games", { waitUntil: "networkidle", timeout: 10000 });
    await page.evaluate(() => location.reload(true));
    await page.waitForTimeout(3000);

    console.log("Step 9: Screenshot...");
    await page.screenshot({ path: join(OUT, "fav-final-e2e.png") });

    console.log("Step 10: Count stored vs displayed...");
    const step10 = await page.evaluate(() => {
      const favs = JSON.parse(localStorage.getItem("geo:progress:favorites")) || [];
      const cards = document.querySelectorAll(".grid > div");
      const countEl = document.querySelector("p.uppercase");
      return {
        storedCount: favs.length,
        displayedCount: cards.length,
        countText: countEl?.textContent?.trim() || "",
      };
    });

    console.log("\n--- REPORT ---");
    console.log("Favorites stored:", step10.storedCount);
    console.log("Favorites displayed:", step10.displayedCount);
    console.log("Count text:", step10.countText);
    console.log("Match:", step10.storedCount === step10.displayedCount ? "YES" : "NO");
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
