import React, { useContext, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { LanguageContext } from "../../i18n/LanguageContext";
import Navbar from "../Navbar";
import SEO from "../SEO";
import useGameRewards from "../../hooks/useGameRewards";

/**
 * Shared chrome for the new mini-games. Keeps each game file focused on its
 * mechanics and centralises analytics, first-play coin bonus, SEO/OG and a
 * consistent header. Each game gets a derived `gameId` from the route so we
 * don't need to wire it manually.
 */
export default function GameShell({
  title,
  description,
  emoji,
  canonical,
  back = "/games/all",
  children,
  toolbar = null,
  category = "game",
}) {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const loc = useLocation();
  const gameId = useMemo(() => (loc.pathname.split("/").pop() || "game").toLowerCase(), [loc.pathname]);

  // Side-effect only: registers game_start, first-play coin bonus etc.
  useGameRewards(gameId, category);

  // Friendlier OG meta for socials (description already passed to SEO).
  const ogTitle = title ? `${title} · Kibloo` : "Kibloo";

  useEffect(() => {
    const upd = (selector, attr, value) => {
      let m = document.head.querySelector(selector);
      if (!m) {
        m = document.createElement("meta");
        const [k, v] = selector.replace(/[[\]"]/g, "").split("=");
        m.setAttribute(k, v); document.head.appendChild(m);
      }
      m.setAttribute(attr, value);
    };
    if (title) upd('meta[property="og:title"]', "content", ogTitle);
    if (description) upd('meta[property="og:description"]', "content", description);
    upd('meta[property="og:type"]', "content", "website");
    upd('meta[name="twitter:card"]', "content", "summary_large_image");
    if (title) upd('meta[name="twitter:title"]', "content", ogTitle);
    if (description) upd('meta[name="twitter:description"]', "content", description);
  }, [ogTitle, description, title]);

  return (
    <>
      <Navbar />
      <SEO title={title} description={description} canonical={canonical} />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 py-6">
        <div className="max-w-3xl mx-auto px-3">
          <div className="flex items-center justify-between mb-4 gap-2">
            <Link
              to={back}
              className="inline-flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              ← {isEl ? "Πίσω" : "Back"}
            </Link>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span aria-hidden>{emoji}</span>
              <span>{title}</span>
            </h1>
            <div className="w-16">{toolbar}</div>
          </div>
          {description && (
            <p className="text-center text-sm text-slate-600 dark:text-slate-400 mb-4">{description}</p>
          )}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
            {children}
          </div>
        </div>
      </main>
    </>
  );
}
