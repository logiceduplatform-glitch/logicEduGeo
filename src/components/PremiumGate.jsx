import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { LanguageContext } from "../i18n/LanguageContext";
import { useSubscription } from "../contexts/SubscriptionContext";
import { PremiumContentService } from "../services/PremiumContentService";
import { FeatureFlagService } from "../services/FeatureFlagService";

const T = {
  el: {
    title: "💎 Διαθέσιμο μόνο για Premium",
    subtitle: "Αυτό το περιεχόμενο είναι μέρος της Premium συνδρομής.",
    cta: "⭐ Αναβάθμιση σε Premium",
    back: "← Επιστροφή",
    perks: "Με Premium αποκτάς:",
    perk1: "Πρόσβαση σε όλα τα παιχνίδια",
    perk2: "Λεπτομερή στατιστικά & αναφορές",
    perk3: "Πιστοποιητικά & rewards",
    perk4: "Καμία διαφήμιση",
    trial: "🎁 7 ημέρες δωρεάν δοκιμή",
  },
  en: {
    title: "💎 Premium content",
    subtitle: "This content is part of the Premium subscription.",
    cta: "⭐ Upgrade to Premium",
    back: "← Back",
    perks: "With Premium you get:",
    perk1: "Access to all games",
    perk2: "Detailed stats & reports",
    perk3: "Certificates & rewards",
    perk4: "No ads",
    trial: "🎁 7-day free trial",
  },
};

/**
 * Wrap a route to gate it on premium subscription IF the item is marked as premium-only.
 *
 * Logic:
 * - If subscriptions disabled (subs_enabled OFF) → always allowed
 * - If item NOT in premium list → allowed
 * - If item IS premium-only AND user is not premium → show upgrade screen
 *
 *   <PremiumGate id="games_age_4_5_school"><MyGame /></PremiumGate>
 */
export default function PremiumGate({ id, children, hideNav = false }) {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const { isPremium } = useSubscription() || {};
  const l = T[lang] || T.en;

  // If the whole subs system is off, don't gate.
  if (!FeatureFlagService.isEnabled("subs_enabled")) return children;

  // If item is not premium-only, allow.
  if (!PremiumContentService.isPremiumOnly(id)) return children;

  // If user is premium, allow.
  if (isPremium) return children;

  return (
    <>
      {!hideNav && <Navbar />}
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-amber-200 dark:border-amber-800/50 text-center">
          <div className="text-6xl mb-3">💎</div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{l.title}</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm">{l.subtitle}</p>

          <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 text-left">
            <p className="text-xs font-extrabold uppercase text-amber-700 dark:text-amber-300 mb-2 tracking-wider">{l.perks}</p>
            <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-200">
              <li className="flex items-start gap-2"><span className="text-emerald-500 shrink-0">✓</span><span>{l.perk1}</span></li>
              <li className="flex items-start gap-2"><span className="text-emerald-500 shrink-0">✓</span><span>{l.perk2}</span></li>
              <li className="flex items-start gap-2"><span className="text-emerald-500 shrink-0">✓</span><span>{l.perk3}</span></li>
              <li className="flex items-start gap-2"><span className="text-emerald-500 shrink-0">✓</span><span>{l.perk4}</span></li>
            </ul>
          </div>

          {FeatureFlagService.isEnabled("subs_trial") && (
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-4">{l.trial}</p>
          )}

          <div className="mt-5 flex flex-col gap-2">
            <Link
              to="/subscription"
              className="block w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg hover:shadow-xl transition"
            >
              {l.cta}
            </Link>
            <Link
              to="/"
              className="block w-full py-2.5 rounded-2xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition text-sm"
            >
              {l.back}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Lightweight hook for in-component checks.
 *   const isLocked = useIsLocked("feature_battleRoyale");
 */
export function useIsLocked(id) {
  const { isPremium } = useSubscription() || {};
  if (!FeatureFlagService.isEnabled("subs_enabled")) return false;
  if (!PremiumContentService.isPremiumOnly(id)) return false;
  if (isPremium) return false;
  return true;
}
