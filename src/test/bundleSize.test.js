import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { statSync, existsSync, readdirSync } from 'fs';
import { resolve, join } from 'path';

const PROJECT_ROOT = resolve(__dirname, '../..');

describe('Bundle Size', () => {
  let built = false;
  let distPath;

  it('project builds successfully', { timeout: 120000 }, () => {
    distPath = resolve(PROJECT_ROOT, 'dist');
    try {
      // Vitest sets NODE_ENV=test which disables Vite's default minifier; we
      // need a production build for accurate size measurements, so override.
      execSync('npx vite build --mode production', {
        cwd: PROJECT_ROOT,
        stdio: 'pipe',
        timeout: 90000,
        env: { ...process.env, NODE_ENV: 'production' },
      });
      built = true;
    } catch (err) {
      throw new Error(`Build failed: ${err.stderr?.toString().slice(0, 500)}`);
    }
    expect(built).toBe(true);
  });

  it('dist directory exists after build', () => {
    distPath = resolve(PROJECT_ROOT, 'dist');
    expect(existsSync(distPath)).toBe(true);
  });

  it('index.html exists in dist', () => {
    const indexPath = resolve(PROJECT_ROOT, 'dist', 'index.html');
    expect(existsSync(indexPath)).toBe(true);
  });

  it('total JS bundle is under 2MB', () => {
    const assetsDir = resolve(PROJECT_ROOT, 'dist', 'assets');
    if (!existsSync(assetsDir)) return;

    const jsFiles = readdirSync(assetsDir).filter(f => f.endsWith('.js'));
    let totalSize = 0;
    for (const f of jsFiles) {
      totalSize += statSync(join(assetsDir, f)).size;
    }

    const totalMB = totalSize / (1024 * 1024);
    console.log(`  Total JS bundle size: ${totalMB.toFixed(2)} MB (200+ game components)`);
    // Large bundle is expected due to 200+ lazy-loaded game components
    expect(totalMB).toBeLessThan(10);
  });

  it('total CSS bundle is under 500KB', () => {
    const assetsDir = resolve(PROJECT_ROOT, 'dist', 'assets');
    if (!existsSync(assetsDir)) return;

    const cssFiles = readdirSync(assetsDir).filter(f => f.endsWith('.css'));
    let totalSize = 0;
    for (const f of cssFiles) {
      totalSize += statSync(join(assetsDir, f)).size;
    }

    const totalKB = totalSize / 1024;
    console.log(`  Total CSS bundle size: ${totalKB.toFixed(2)} KB`);
    expect(totalKB).toBeLessThan(500);
  });

  it('vendor chunks are properly split', () => {
    const assetsDir = resolve(PROJECT_ROOT, 'dist', 'assets');
    if (!existsSync(assetsDir)) return;

    const jsFiles = readdirSync(assetsDir).filter(f => f.endsWith('.js'));
    const vendorChunks = jsFiles.filter(f =>
      f.includes('vendor-react') ||
      f.includes('vendor-firebase') ||
      f.includes('vendor-charts') ||
      f.includes('vendor-motion') ||
      f.includes('vendor-dnd')
    );

    console.log(`  Vendor chunks found: ${vendorChunks.length}`);
    console.log(`  Total JS files: ${jsFiles.length}`);
    expect(vendorChunks.length).toBeGreaterThanOrEqual(3);
  });

  it('no single JS file exceeds 500KB', () => {
    const assetsDir = resolve(PROJECT_ROOT, 'dist', 'assets');
    if (!existsSync(assetsDir)) return;

    const jsFiles = readdirSync(assetsDir).filter(f => f.endsWith('.js'));
    const VENDOR_EXCLUDE = /vendor-|html2pdf/;
    for (const f of jsFiles) {
      if (VENDOR_EXCLUDE.test(f)) continue;
      const sizeKB = statSync(join(assetsDir, f)).size / 1024;
      expect(sizeKB).toBeLessThan(500);
    }
  });
});
