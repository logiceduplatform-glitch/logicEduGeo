import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { FeatureFlagService } from "../services/FeatureFlagService";

/**
 * Smart "back" button that adapts to context:
 *  - If `to` is provided, navigates there directly.
 *  - Else if browser history has entries from this session, calls navigate(-1).
 *  - Else falls back to navigating to "/" (home).
 *
 * Variants:
 *  - "default": text + arrow on a subtle background. Best inside content area.
 *  - "minimal": just an arrow icon, no background. Best for tight headers.
 *  - "pill":    bold gradient pill. Best for landing pages where you want the
 *               navigation to feel like a primary CTA.
 *
 * The flag `globalBackButton` lets admins hide it everywhere if they prefer
 * the Navbar-only navigation model.
 */
export default function BackButton({
  to,
  label,
  variant = "default",
  className = "",
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";

  if (!FeatureFlagService.isEnabled("globalBackButton")) return null;

  const text = label || (isEl ? "Πίσω" : "Back");

  const onClick = () => {
    if (to) {
      navigate(to);
      return;
    }
    // window.history.length > 1 means we have a previous entry to go back to.
    // Note: this is browser history, not React Router history. It's a heuristic.
    if (window.history.length > 1 && location.key !== "default") {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const variants = {
    default:
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-purple-600 dark:hover:text-purple-400 transition-all shadow-sm hover:shadow",
    minimal:
      "inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors",
    pill:
      "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:scale-105 transition-all",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={text}
      className={`${variants[variant] || variants.default} ${className}`}
    >
      <span aria-hidden>←</span>
      <span>{text}</span>
    </button>
  );
}
