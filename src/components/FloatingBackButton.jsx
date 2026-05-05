import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { FeatureFlagService } from "../services/FeatureFlagService";

/**
 * Floating "← Πίσω / Αρχική" pill that appears on every page **except**:
 *   - The home page itself (`/`)
 *   - Auth/onboarding flows (don't want to confuse users mid-signup)
 *   - Game pages (GameShell already has its own back link)
 *   - Admin dashboard (has its own "→ Site" button)
 *   - Pages that already render their own back/home control (auto-detected
 *     via DOM scan so we don't get duplicate "Πίσω" buttons).
 *
 * Uses smart navigation: history.back() if available, else navigates to "/".
 *
 * Positioned top-left of the viewport, just below the navbar (top-20).
 * Hidden on mobile (< sm) to save space — the navbar logo is the back affordance there.
 */

const HIDDEN_PATH_PREFIXES = [
  "/auth",
  "/onboarding",
  "/admin",
  "/games/",        // GameShell handles its own back
  "/play/",         // Quiz pages have their own UI
  "/quiz/",
  "/kid-login",
  "/guest-setup",
];

// Regex used to detect an existing "back" button rendered by a page itself.
// We're intentionally permissive: any visible link/button whose text starts
// with ←/⬅️/«/back/πίσω counts. The check runs after route changes.
const BACK_TEXT_RE = /^\s*(←|⬅️?|«|back\b|πίσω|αρχική|home)/i;

function pageHasOwnBackControl() {
  if (typeof document === "undefined") return false;
  // Search inside <main> first to avoid matching navbar/footer "Home" links.
  const root = document.querySelector("main") || document.body;
  const candidates = root.querySelectorAll("a, button");
  for (const el of candidates) {
    // Skip our own floating button (we tag it with data-floating-back).
    if (el.dataset && el.dataset.floatingBack === "true") continue;
    // Only consider visible elements above the fold-ish (cheap viewport check).
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    if (rect.top > 600) continue; // Likely far below the header area
    const text = (el.textContent || "").trim();
    if (!text || text.length > 40) continue;
    if (BACK_TEXT_RE.test(text)) return true;
  }
  return false;
}

export default function FloatingBackButton() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const navigate = useNavigate();
  const location = useLocation();
  const [hidden, setHidden] = useState(false);

  // Re-check after each route change. We give the page a tick to render so
  // its own back button (if any) is in the DOM by the time we look.
  useEffect(() => {
    setHidden(false);
    const check = () => setHidden(pageHasOwnBackControl());
    const t1 = window.setTimeout(check, 80);
    const t2 = window.setTimeout(check, 400); // catch lazy-loaded chunks
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
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
      className="hidden sm:inline-flex fixed top-20 left-4 z-30 items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-800/90 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg hover:scale-105 hover:text-purple-600 dark:hover:text-purple-400 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
    >
      <span aria-hidden>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
