import React, { useEffect, useState } from "react";
import { FeatureFlagService } from "../services/FeatureFlagService";

/**
 * Floating "back to top" button. Appears after the user scrolls > 600px.
 * Smooth-scrolls to top, respects `prefers-reduced-motion`.
 */
export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!FeatureFlagService.isEnabled("scrollToTopButton")) return;

    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!FeatureFlagService.isEnabled("scrollToTopButton")) return null;
  if (!visible) return null;

  const scrollToTop = () => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Επιστροφή στην κορυφή"
      className="fixed bottom-6 left-6 z-40 w-11 h-11 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 animate-fade-in"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}
