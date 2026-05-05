import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../i18n/LanguageContext";
import { FeatureFlagService } from "../services/FeatureFlagService";
import { SupportWidgetService } from "../services/SupportWidgetService";

/**
 * Floating "Help" bubble — always visible bottom-right.
 *
 * Behaviour:
 *   - If a 3rd-party support widget (Crisp/Tawk) is loaded, this component
 *     stays out of the way (the provider's own bubble takes over).
 *   - Otherwise it shows a simple panel with email + FAQ links.
 *   - Hidden on /admin pages (admins don't need to support themselves).
 */

const T = {
  el: {
    aria: "Βοήθεια",
    title: "Πώς μπορούμε να βοηθήσουμε;",
    sub: "Συνήθως απαντάμε σε λιγότερο από 24 ώρες.",
    email: "Στείλε μας email",
    faq: "Συχνές ερωτήσεις",
    chat: "Ξεκίνα chat",
    close: "Κλείσιμο",
  },
  en: {
    aria: "Help",
    title: "How can we help?",
    sub: "We usually reply in less than 24 hours.",
    email: "Email us",
    faq: "FAQ",
    chat: "Start a chat",
    close: "Close",
  },
};

export default function SupportBubble() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang === "el" ? "el" : "en"];

  const [open, setOpen] = useState(false);
  const [providerActive, setProviderActive] = useState(false);

  useEffect(() => {
    // If a chat provider is configured, hand over the bubble to it and hide ours.
    const ok = SupportWidgetService.init();
    setProviderActive(ok);
  }, []);

  // Hide on admin / auth pages
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  if (path.startsWith("/admin") || path.startsWith("/auth")) return null;

  // If a real chat widget is active, don't show our own bubble.
  if (providerActive) return null;

  if (!FeatureFlagService.isEnabled("supportBubble")) return null;

  return (
    <>
      {open && (
        <div
          className="fixed bottom-24 right-6 z-40 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in"
          role="dialog"
          aria-label={l.title}
        >
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 px-4 py-3 text-white">
            <div className="font-bold">{l.title}</div>
            <div className="text-xs opacity-90 mt-0.5">{l.sub}</div>
          </div>
          <div className="p-3 space-y-2">
            <a
              href="mailto:support@kibloo.app"
              className="block px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 font-semibold text-sm"
            >
              ✉️ {l.email}
            </a>
            <a
              href="/help"
              className="block px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 font-semibold text-sm"
            >
              📖 {l.faq}
            </a>
            <a
              href="/contact"
              className="block px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 font-semibold text-sm"
            >
              💬 Contact form
            </a>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={l.aria}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-2xl shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all"
      >
        {open ? "✕" : "💬"}
      </button>
    </>
  );
}
