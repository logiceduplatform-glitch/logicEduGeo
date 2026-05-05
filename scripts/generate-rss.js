#!/usr/bin/env node
/**
 * Build-time RSS feed generator.
 *
 * Reads ARTICLES from BlogPage.jsx and emits public/rss.xml with the latest
 * 20 posts in both Greek and English. Runs automatically as part of `npm run
 * build` (via the prebuild script in package.json).
 *
 * Re-run after adding articles:    node scripts/generate-rss.js
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const SITE_URL = "https://kibloo.app";
const BRAND = "Kibloo";

function readArticles() {
  // Naive but reliable: parse the export array from BlogPage.jsx by splitting
  // on `slug:` markers. We only need slug + titles + intros for the RSS feed,
  // which keeps this script free of a JSX runtime.
  const src = fs.readFileSync(path.join(ROOT, "src/pages/BlogPage.jsx"), "utf8");
  const blocks = src.split(/\{\s*\n\s*slug:\s*"/).slice(1);
  return blocks.map((b) => {
    const slug = b.slice(0, b.indexOf('"'));
    const titleEl = (b.match(/title:\s*\{[^}]*el:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/m) || [])[1] || slug;
    const titleEn = (b.match(/title:\s*\{[^}]*en:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/m) || [])[1] || slug;
    const introEl = (b.match(/intro:\s*\{[^}]*el:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/m) || [])[1] || "";
    const introEn = (b.match(/intro:\s*\{[^}]*en:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/m) || [])[1] || "";
    return { slug, titleEl, titleEn, introEl, introEn };
  });
}

function escapeXml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildItem(article, lang) {
  const title  = lang === "el" ? article.titleEl : article.titleEn;
  const intro  = lang === "el" ? article.introEl : article.introEn;
  const url    = `${SITE_URL}/blog/${article.slug}${lang === "el" ? "?lang=el" : "?lang=en"}`;
  const guid   = `${url}#${lang}`;
  return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${url}</link>
      <guid isPermaLink="false">${guid}</guid>
      <description>${escapeXml(intro)}</description>
      <language>${lang}</language>
    </item>`;
}

function build() {
  const articles = readArticles();
  const lastBuild = new Date().toUTCString();

  const items = [];
  for (const a of articles) {
    items.push(buildItem(a, "en"));
    items.push(buildItem(a, "el"));
  }

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${BRAND} · Blog</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Tips for parents, teachers and curious kids — from the Kibloo team.</description>
    <language>en</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items.join("\n")}
  </channel>
</rss>
`;

  const outPath = path.join(ROOT, "public", "rss.xml");
  fs.writeFileSync(outPath, rss, "utf8");
  console.log(`✔ Generated ${outPath} with ${articles.length} articles (${articles.length * 2} bilingual items)`);
}

build();
