/**
 * Verify 4-5 Logic favorites fix.
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

    console.log("Step 3: Try as guest -> 4-5 -> Logic -> proceed");
    await page.getByRole("button", { name: /try as guest|δοκίμασε ως επισκέπτη/i }).first().click();
    await page.waitForURL(/guest-setup/, { timeout: 5000 });
    await page.getByRole("button", { name: /4-5|🧒/i }).first().click();
    await page.getByRole("button", { name: /next|επόμενο/i }).click();
    await page.getByRole("button", { name: /logic|λογική|🧩/i }).first().click();
    await page.getByRole("button", { name: /let's play|ας παίξουμε/i }).click();
    await page.waitForURL(/\/play\/4-5/, { timeout: 8000 });

    console.log("Step 4: Navigate to 4-5-logic...");
    await page.goto(BASE + "/play/4-5-logic", { waitUntil: "networkidle", timeout: 10000 });
    await page.waitForTimeout(1500);

    console.log("Step 5: Starring 3 games (including patternRecognition if visible)...");
    const starBtns = page.locator('[title="Favorite"], [title="Αγαπημένο"]');
    const count = await starBtns.count();
    let clicked = 0;
    for (let i = 0; i < count && clicked < 3; i++) {
      const btn = starBtns.nth(i);
      const txt = await btn.textContent().catch(() => "");
      if (txt && txt.includes("☆")) {
        await btn.scrollIntoViewIfNeeded();
        await btn.click();
        clicked++;
        await page.waitForTimeout(400);
      }
    }
    console.log("  Starred", clicked, "games");

    console.log("Step 6: Check favorites...");
    await page.evaluate(() => {
      const favs = JSON.parse(localStorage.getItem("geo:progress:favorites"));
      console.log("Favorites:", JSON.stringify(favs));
    });
    await page.waitForTimeout(300);

    console.log("Step 7: Navigate to my-games and hard refresh...");
    await page.goto(BASE + "/my-games", { waitUntil: "networkidle", timeout: 10000 });
    await page.evaluate(() => location.reload(true));
    await page.waitForTimeout(3000);

    console.log("Step 8: Screenshot...");
    await page.screenshot({ path: join(OUT, "verify-4-5-logic-fix.png") });

    console.log("Step 9: Check display...");
    await page.evaluate(() => {
      const favs = JSON.parse(localStorage.getItem("geo:progress:favorites"));
      console.log("Stored:", favs?.length, JSON.stringify(favs));
      const cards = document.querySelectorAll(".grid > div");
      console.log("Displayed:", cards.length);
    });
    await page.waitForTimeout(500);

    const step9 = await page.evaluate(() => {
      const favs = JSON.parse(localStorage.getItem("geo:progress:favorites")) || [];
      const cards = document.querySelectorAll(".grid > div");
      return { stored: favs.length, displayed: cards.length };
    });

    console.log("\n--- Step 10: REPORT ---");
    console.log("Stored favorites:", step9.stored);
    console.log("Displayed cards:", step9.displayed);
    console.log("ALL favorites displayed correctly:", step9.stored === step9.displayed ? "YES" : "NO");
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
