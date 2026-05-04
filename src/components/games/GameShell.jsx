import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { LanguageContext } from "../../i18n/LanguageContext";
import Navbar from "../Navbar";
import SEO from "../SEO";

/**
 * Shared chrome for the new "Quick Wins" games. Keeps each game file
 * focused on its mechanics and gives us a single place to add things
 * like badges, share buttons, or analytics later.
 */
export default function GameShell({
  title,
  description,
  emoji,
  canonical,
  back = "/play",
  children,
  toolbar = null,
}) {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";

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
