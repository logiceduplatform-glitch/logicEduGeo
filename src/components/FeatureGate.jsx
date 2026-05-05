import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { FeatureFlagService } from "../services/FeatureFlagService";
import Navbar from "./Navbar";

const T = {
  el: {
    title: "🚧 Προσωρινά μη διαθέσιμο",
    msg: "Αυτή η λειτουργία είναι προσωρινά απενεργοποιημένη. Δοκίμασε ξανά αργότερα.",
    back: "← Επιστροφή",
  },
  en: {
    title: "🚧 Temporarily unavailable",
    msg: "This feature is currently disabled. Please try again later.",
    back: "← Back",
  },
};

/**
 * Wrap a route or component to gate it on a feature flag.
 *
 *   <FeatureGate flag="battleRoyale">...</FeatureGate>
 *   <FeatureGate flags={["classicGames_master","classicGames_quickWins"]}>...</FeatureGate>
 *
 * Props:
 *   flag:  string                    – single flag id (legacy API)
 *   flags: string | string[]         – flag id(s); ALL must be enabled
 *   children: ReactNode
 *   fallback: ReactNode | null       – optional custom fallback (skips default UI)
 *   hideNav: boolean                 – do not render Navbar in fallback
 */
export default function FeatureGate({ flag, flags, children, fallback = null, hideNav = false }) {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;

  // Build the list of required flags from either prop.
  const list = []
    .concat(flag ? [flag] : [])
    .concat(Array.isArray(flags) ? flags : flags ? [flags] : []);

  // No flags supplied → render as-is.
  if (list.length === 0) return children;

  const allOn = list.every((id) => FeatureFlagService.isEnabled(id));
  if (allOn) return children;

  if (fallback) return fallback;

  return (
    <>
      {!hideNav && <Navbar />}
      <div className="min-h-[70vh] flex items-center justify-center px-4 pt-24 pb-10">
        <div className="max-w-md text-center bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-700">
          <div className="text-6xl mb-3">🚧</div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">{l.title}</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-5 text-sm">{l.msg}</p>
          <Link to="/" className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm">{l.back}</Link>
        </div>
      </div>
    </>
  );
}

/**
 * Helper hook for simple checks in JSX:
 *   const enabled = useFlag("battleRoyale")
 */
export function useFlag(id) {
  return FeatureFlagService.isEnabled(id);
}
