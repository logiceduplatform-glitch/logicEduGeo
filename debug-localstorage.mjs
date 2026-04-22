/**
 * Debug script: inspect localStorage keys (fav-related and geo:).
 * Run: node debug-localstorage.mjs
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  console.log('Navigating to', BASE + '/ ...');
  await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 15000 });

  const result = await page.evaluate(() => {
    const allKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      allKeys.push(key);
    }
    const favKeys = allKeys.filter(k => k.toLowerCase().includes('fav'));
    const geoKeys = allKeys.filter(k => k.startsWith('geo:'));

    const favValues = {};
    favKeys.forEach(k => { favValues[k] = localStorage.getItem(k); });

    return { allKeys, favKeys, geoKeys, favValues };
  });

  console.log('\n--- 1. Fav keys (case insensitive) ---');
  console.log(JSON.stringify(result.favKeys));

  console.log('\n--- 2. All geo: keys ---');
  console.log(JSON.stringify(result.geoKeys));

  console.log('\n--- 3. Values for fav keys ---');
  for (const [k, v] of Object.entries(result.favValues)) {
    console.log(k, '=', v);
  }

  console.log('\n--- All localStorage keys (for reference) ---');
  console.log(JSON.stringify(result.allKeys));

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
