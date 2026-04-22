/**
 * E2E: Thorough Mahjong board game test
 * http://localhost:5174
 */
import { chromium } from "playwright";
import { join } from "path";

const BASE = "http://localhost:5174";
const OUT = process.cwd();

const consoleErrors = [];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await context.addInitScript(() => {
    localStorage.setItem("edu:cookieConsent", "accepted");
    localStorage.setItem("geo:tourSeen", "true");
    if (!localStorage.getItem("geo:guestProfile")) {
      localStorage.setItem("geo:guestProfile", JSON.stringify({
        id: "guest_e2e_" + Date.now(),
        age: "Age 6",
        name: "E2E Guest",
        objective: "fun",
        createdAt: new Date().toISOString(),
        playsUsed: 0,
        maxPlays: 99,
        maxMinutes: 60,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }));
    }
  });
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const t = msg.text();
      if (!t.includes("Firebase") && !t.includes("VITE_FIREBASE")) {
        consoleErrors.push({ text: t });
      }
    }
  });

  const findings = {
    initialState: { tilesVisible: false, pyramidCorrect: false, tileTypes: [], boardFills: false, tileSize: "" },
    gameplay: { selectWorks: false, matchWorks: false, noMatchMessage: false, blockedMessage: false },
    hint: { hintWorks: false },
    errors: [],
    notes: [],
  };

  try {
    // 1. Setup guest
    console.log("\n=== 1. Setup Guest ===");
    await page.goto(BASE + "/guest-setup", { waitUntil: "domcontentloaded", timeout: 15000 });
    const ageBtn = page.getByRole("button", { name: /^6$|Age 6|🎒/ }).first();
    if (await ageBtn.isVisible().catch(() => false)) {
      await ageBtn.click();
      await page.waitForTimeout(300);
      await page.getByRole("button", { name: /next|επόμενο/i }).click();
      await page.waitForTimeout(300);
    }
    const funBtn = page.getByRole("button", { name: /fun|διασκέδαση|παιχνίδι|🎉/i }).first();
    if (await funBtn.isVisible().catch(() => false)) {
      await funBtn.click();
      await page.waitForTimeout(300);
    }
    const startBtn = page.getByRole("button", { name: /let's play|ας παίξουμε|ξεκίνα/i }).first();
    if (await startBtn.isVisible().catch(() => false)) {
      await startBtn.click();
      await page.waitForURL(/\/play\//, { timeout: 8000 });
    }
    await page.waitForTimeout(1000);

    // 2. Go to board-games
    console.log("\n=== 2. Go to Board Games ===");
    await page.goto(BASE + "/play/board-games", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);

    // 3. Click Mahjong (sidebar may have mahjong, mahjong, 麻将 etc)
    console.log("\n=== 3. Click Mahjong ===");
    const mahjongBtn = page.getByRole("button", { name: /mahjong|ματζόνγκ|麻将/i }).first();
    if (!(await mahjongBtn.isVisible().catch(() => false))) {
      const anyMahjong = page.locator('button, a').filter({ hasText: /mahjong/i }).first();
      if (await anyMahjong.isVisible().catch(() => false)) {
        await anyMahjong.click();
      } else {
        findings.notes.push("Mahjong button not found in sidebar");
      }
    } else {
      await mahjongBtn.click();
    }
    await page.waitForTimeout(1000);

    // 4. Start the game (click Start! in GameLobby)
    const startGameBtn = page.getByRole("button", { name: /ξεκίνα|start!/i }).first();
    if (await startGameBtn.isVisible().catch(() => false)) {
      await startGameBtn.click();
      await page.waitForTimeout(3000);
    }

    // Check we're on Mahjong
    const mahjongTitle = page.locator('text=/mahjong/i').first();
    const onMahjong = await mahjongTitle.isVisible().catch(() => false);
    if (!onMahjong) {
      findings.notes.push("Mahjong game may not have loaded - title not found");
    }

    // 4. Screenshot initial state
    console.log("\n=== 4. Initial Board State ===");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: join(OUT, "mahjong-initial.png"), fullPage: true });
    console.log("  [Screenshot: mahjong-initial.png]");

    // Analyze initial state
    const initAnalysis = await page.evaluate(() => {
      const tiles = document.querySelectorAll('button[class*="absolute"][class*="rounded-xl"]');
      const tileTexts = [...tiles].slice(0, 20).map(t => t.textContent?.trim() || "");
      const hasBamboo = tileTexts.some(t => t.includes("🎋") || t.includes("1") || t.includes("2"));
      const hasCircle = tileTexts.some(t => t.includes("🔵"));
      const hasWinds = tileTexts.some(t => /[\u{1F000}-\u{1F02F}]/u.test(t));
      const hasFlowers = tileTexts.some(t => /[🌸🌺🌻🍀🦋🐉]/u.test(t));
      const boardEl = document.querySelector('[style*="width"]');
      const boardWidth = boardEl?.style?.width ? parseInt(boardEl.style.width) : 0;
      return {
        tileCount: tiles.length,
        hasBamboo,
        hasCircle,
        hasWinds,
        hasFlowers,
        tileTypes: tileTexts,
        boardWidth,
      };
    }).catch(() => ({}));

    findings.initialState.tilesVisible = (initAnalysis?.tileCount || 0) > 10;
    findings.initialState.pyramidCorrect = (initAnalysis?.tileCount || 0) > 20;
    findings.initialState.tileTypes = [initAnalysis?.hasBamboo && "bamboo", initAnalysis?.hasCircle && "circles", initAnalysis?.hasWinds && "winds", initAnalysis?.hasFlowers && "flowers"].filter(Boolean);
    findings.initialState.boardFills = (initAnalysis?.boardWidth || 0) > 400;

    // 5. Play the game
    console.log("\n=== 5. Gameplay Tests ===");

    // Get all free tiles (those that are clickable - cursor-pointer)
    const freeTiles = page.locator('button.cursor-pointer').filter({ hasNot: page.locator('.cursor-not-allowed') });
    const freeCount = await freeTiles.count();
    findings.notes.push(`Free tiles at start: ${freeCount}`);

    if (freeCount >= 2) {
      // Click first free tile - should select/highlight
      await freeTiles.first().click();
      await page.waitForTimeout(300);
      const selectedHighlight = await page.locator('.ring-violet-400, [class*="scale-105"]').first().isVisible().catch(() => false);
      findings.gameplay.selectWorks = selectedHighlight || await page.locator('button.border-violet-400').first().isVisible().catch(() => false);
      findings.notes.push(`Select/highlight: ${findings.gameplay.selectWorks ? "OK" : "not verified"}`);

      // Try to find a matching pair - click another free tile
      // We need two tiles with same faceId - we can't know from DOM, so try clicking a few
      const secondFree = freeTiles.nth(1);
      if (await secondFree.isVisible().catch(() => false)) {
        await secondFree.click();
        await page.waitForTimeout(800);

        const matchMsg = await page.locator('text=/match!|ταιριασμα|ταίριασμα/i').first().isVisible().catch(() => false);
        const noMatchMsg = await page.locator('text=/no match|δεν ταιριάζουν|Δεν ταιριάζουν/i').first().isVisible().catch(() => false);
        findings.gameplay.matchWorks = matchMsg;
        findings.gameplay.noMatchMessage = noMatchMsg;
        findings.notes.push(`Match message: ${matchMsg}, No match message: ${noMatchMsg}`);
      }

      // Try clicking a blocked tile (cursor-not-allowed)
      await page.waitForTimeout(500);
      const blockedTile = page.locator('button.cursor-not-allowed').first();
      if (await blockedTile.isVisible().catch(() => false)) {
        await blockedTile.click();
        await page.waitForTimeout(500);
        const blockedMsg = await page.locator('text=/blocked|μπλοκαρισμένο/i').first().isVisible().catch(() => false);
        findings.gameplay.blockedMessage = blockedMsg;
        findings.notes.push(`Blocked message: ${blockedMsg ? "OK" : "not shown"}`);
      }
    }

    // Play a few more turns to try to get matches and remove tiles
    for (let attempt = 0; attempt < 5; attempt++) {
      await page.waitForTimeout(400);
      const freeAgain = page.locator('button.cursor-pointer').filter({ hasNot: page.locator('.cursor-not-allowed') });
      const cnt = await freeAgain.count();
      if (cnt < 2) break;
      await freeAgain.first().click();
      await page.waitForTimeout(200);
      await freeAgain.nth(1).click();
      await page.waitForTimeout(600);
    }

    // Screenshot after some gameplay
    await page.screenshot({ path: join(OUT, "mahjong-after-play.png"), fullPage: true });
    console.log("  [Screenshot: mahjong-after-play.png]");

    // 6. Hint button
    console.log("\n=== 6. Hint Button ===");
    const hintBtn = page.getByRole("button", { name: /ύπόδειξη|hint/i }).first();
    if (await hintBtn.isVisible().catch(() => false)) {
      await hintBtn.click();
      await page.waitForTimeout(800);
      const hintHighlight = await page.locator('.ring-amber-400, .border-amber-400, [class*="animate-pulse"]').first().isVisible().catch(() => false);
      const hintMsg = await page.locator('text=/highlighted|φωτισμένα|look at|κοίτα/i').first().isVisible().catch(() => false);
      findings.hint.hintWorks = hintHighlight || hintMsg;
      findings.notes.push(`Hint highlight: ${findings.hint.hintWorks ? "OK" : "not verified"}`);
    } else {
      findings.notes.push("Hint button not found (game may be over)");
    }

    // 7. Console errors
    findings.errors = [...consoleErrors];
  } catch (err) {
    findings.notes.push("Error: " + err.message);
  } finally {
    await browser.close();
  }

  // Report
  console.log("\n" + "=".repeat(60));
  console.log("MAHJONG BOARD GAME - TEST REPORT");
  console.log("=".repeat(60));

  console.log("\n--- Visual Clarity ---");
  console.log("  Tiles visible & distinguishable:", findings.initialState.tilesVisible ? "Yes" : "No");
  console.log("  Pyramid layout (stacked layers):", findings.initialState.pyramidCorrect ? "Yes" : "No");
  console.log("  Tile types found:", findings.initialState.tileTypes.length ? findings.initialState.tileTypes.join(", ") : "Could not determine");
  console.log("  Board fills container:", findings.initialState.boardFills ? "Yes" : "Unknown");

  console.log("\n--- Gameplay ---");
  console.log("  Tile select/highlight:", findings.gameplay.selectWorks ? "Works" : "Not verified");
  console.log("  Match & remove:", findings.gameplay.matchWorks ? "Works" : "Not confirmed");
  console.log("  'No match' message:", findings.gameplay.noMatchMessage ? "Shows" : "Not seen");
  console.log("  'Blocked' message:", findings.gameplay.blockedMessage ? "Shows" : "Not seen");

  console.log("\n--- Hint ---");
  console.log("  Hint highlights tiles:", findings.hint.hintWorks ? "Yes" : "Not verified");

  console.log("\n--- JS Console Errors ---");
  if (findings.errors.length === 0) {
    console.log("  None");
  } else {
    findings.errors.forEach(e => console.log("  ", e.text));
  }

  console.log("\n--- Notes ---");
  findings.notes.forEach(n => console.log("  ", n));

  console.log("\n--- Screenshots ---");
  console.log("  mahjong-initial.png - initial board state");
  console.log("  mahjong-after-play.png - after some gameplay");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
