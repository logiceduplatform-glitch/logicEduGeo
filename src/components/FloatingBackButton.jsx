import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { FeatureFlagService } from "../services/FeatureFlagService";

/**
 * Floating "← Πίσω / Αρχική" pill that appears on every page **except**:
 *   - The home page itself (`/`)
 *   - Auth/onboarding flows (don't want to confuse users mid-signup)
 *   - Game/Quiz pages (have their own back link via GameShell)
 *   - Admin dashboard (has its own "→ Site" button)
 *   - Pages that already render their own back/home control (auto-detected
 *     via DOM scan + MutationObserver so we don't get duplicate buttons).
 *
 * Uses smart navigation: history.back() if available, else "/".
 *
 * Positioned BOTTOM-LEFT (the only free corner: ScrollToTop is bottom-right,
 * FeedbackWidget + SupportBubble live near bottom-right too). Putting it at
 * the bottom guarantees it never overlaps page titles or hero text.
 *
 * Hidden on mobile (< sm). The Navbar logo is the back affordance there.
 */

const HIDDEN_PATH_PREFIXES = [
  "/auth",
  "/onboarding",
  "/admin",
  "/games/",
  "/play/",
  "/quiz/",
  "/kid-login",
  "/guest-setup",
];

// Match common back/home button text. Permissive but bounded by length.
const BACK_TEXT_RE = /(^|\s)(←|⬅️?|«|‹|back\b|πίσω|αρχική|επιστροφή|home)\b/i;
const STARTS_WITH_ARROW_RE = /^\s*(←|⬅️?|«|‹)/;

function pageHasOwnBackControl() {
  if (typeof document === "undefined") return false;
  const root = document.querySelector("main") || document.body;
  if (!root) return false;
  const candidates = root.querySelectorAll("a, button");
  for (const el of candidates) {
    if (el.dataset && el.dataset.floatingBack === "true") continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    // Be generous: many pages have a "Back" CTA further down the page too,
    // but to avoid false positives we only consider elements within the
    // first viewport of the page (≈ 900px from top).
    if (rect.top < 0 || rect.top > 900) continue;
    const text = (el.textContent || "").trim();
    if (!text || text.length > 50) continue;
    if (STARTS_WITH_ARROW_RE.test(text) || BACK_TEXT_RE.test(text)) return true;
    // aria-label fallback for icon-only buttons.
    const aria = (el.getAttribute("aria-label") || "").trim();
    if (aria && (STARTS_WITH_ARROW_RE.test(aria) || BACK_TEXT_RE.test(aria))) return true;
  }
  return false;
}

export default function FloatingBackButton() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const navigate = useNavigate();
  const location = useLocation();
  const [hidden, setHidden] = useState(true); // start hidden, reveal after detection

  useEffect(() => {
    let cancelled = false;
    setHidden(true);
    const recheck = () => {
      if (cancelled) return;
      setHidden(pageHasOwnBackControl());
    };
    // Multiple passes to catch initial render + lazy-loaded content.
    const timers = [
      window.setTimeout(recheck, 50),
      window.setTimeout(recheck, 250),
      window.setTimeout(recheck, 800),
    ];
    // Watch for late DOM changes (e.g. data fetched after mount).
    const main = document.querySelector("main") || document.body;
    const observer = main && typeof MutationObserver !== "undefined"
      ? new MutationObserver(() => recheck())
      : null;
    if (observer && main) {
      observer.observe(main, { childList: true, subtree: true });
    }
    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
      if (observer) observer.disconnect();
    };
  }, [location.pathname]);

  if (!FeatureFlagService.isEnabled("globalBackButton")) return null;

  const path = location.pathname;
  if (path === "/" || path === "") return null;
  if (HIDDEN_PATH_PREFIXES.some((p) => path.startsWith(p))) return null;
  if (hidden) return null;

  const canGoBack = window.history.length > 1 && location.key !== "default";

  const onClick = () => {
    if (canGoBack) navigate(-1);
    else navigate("/");
  };

  const label = canGoBack
    ? (isEl ? "Πίσω" : "Back")
    : (isEl ? "Αρχική" : "Home");
  const icon = canGoBack ? "←" : "🏠";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      data-floating-back="true"
      className="hidden sm:inline-flex fixed bottom-6 left-6 z-30 items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 bg-white/95 dark:bg-slate-800/95 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl hover:scale-105 hover:text-purple-600 dark:hover:text-purple-400 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
    >
      <span aria-hidden className="text-sm">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
