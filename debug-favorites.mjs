/**
 * Debug script: navigate to My Games, read favorites from localStorage, take screenshot.
 * Run: node debug-favorites.mjs
 */
import { chromium } from 'playwright';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const BASE = 'http://localhost:5173';
const MY_GAMES = '/my-games';
const SCREENSHOT_PATH = join(process.cwd(), 'my-games-debug-screenshot.png');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  // Set guest profile so PlayGate allows access to /my-games (otherwise redirects to /)
  await context.addInitScript(() => {
    const guestProfile = {
      id: 'guest_debug_' + Date.now(),
      age: '9-10',
      name: 'Debug User',
      createdAt: new Date().toISOString(),
      playsUsed: 0,
      maxPlays: 99,
      maxMinutes: 60,
    };
    localStorage.setItem('geo:guestProfile', JSON.stringify(guestProfile));
  });

  console.log('1. Navigating to', BASE + MY_GAMES, '...');
  await page.goto(BASE + MY_GAMES, { waitUntil: 'networkidle', timeout: 15000 });

  console.log('2. Reading favorites from localStorage...');
  const favoritesRaw = await page.evaluate(() => {
    return localStorage.getItem('geo:progress:favorites');
  });

  let favorites = null;
  if (favoritesRaw != null) {
    try {
      favorites = JSON.parse(favoritesRaw);
    } catch (e) {
      console.log('   Raw value (parse failed):', favoritesRaw);
    }
  }

  console.log('\n--- FAVORITES STORED ---');
  if (favorites == null) {
    console.log('   Value is null or key not found');
  } else if (!Array.isArray(favorites)) {
    console.log('   Type:', typeof favorites);
    console.log('   Value:', JSON.stringify(favorites, null, 2));
  } else {
    console.log('   IDs stored as favorites:', favorites);
    console.log('   Count:', favorites.length);
  }
  console.log('------------------------\n');

  console.log('3. Taking screenshot...');
  await page.screenshot({ path: SCREENSHOT_PATH, fullPage: false });
  console.log('   Saved to:', SCREENSHOT_PATH);

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
