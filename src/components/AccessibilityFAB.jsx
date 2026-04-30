import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { AccessibilityService } from "../services/AccessibilityService";
import { FeatureFlagService } from "../services/FeatureFlagService";

const T = {
  el: {
    open: "Προσβασιμότητα",
    dyslexia: "Δυσλεξία",
    largeText: "Μεγάλο κείμενο",
    highContrast: "Υψηλή αντίθεση",
    reducedMotion: "Λιγότερη κίνηση",
    underlineLinks: "Υπογράμμιση",
    sign: "Νοηματική",
    settings: "Όλες οι ρυθμίσεις...",
    reset: "Επαναφορά",
    title: "♿ Γρήγορη πρόσβαση",
  },
  en: {
    open: "Accessibility",
    dyslexia: "Dyslexia",
    largeText: "Large text",
    highContrast: "High contrast",
    reducedMotion: "Reduced motion",
    underlineLinks: "Underline links",
    sign: "Sign language",
    settings: "All settings...",
    reset: "Reset",
    title: "♿ Quick access",
  },
};

export default function AccessibilityFAB() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState(() => AccessibilityService.getPrefs());

  useEffect(() => AccessibilityService.subscribe(setPrefs), []);

  if (!FeatureFlagService.isEnabled("a11yFAB")) return null;

  const toggle = (k) => AccessibilityService.update({ [k]: !prefs[k] });

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={l.open}
        aria-expanded={open}
        title={l.open}
        className="fixed bottom-4 left-4 z-[900] w-12 h-12 rounded-full bg-violet-600 hover:bg-violet-700 text-white shadow-lg flex items-center justify-center text-2xl focus:outline-none focus:ring-4 focus:ring-violet-300"
      >
        ♿
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[899]" onClick={() => setOpen(false)} aria-hidden />
          <div
            role="dialog"
            aria-label={l.title}
            className="fixed bottom-20 left-4 z-[901] w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-3 space-y-1"
          >
            <p className="px-2 pt-1 pb-2 font-bold text-slate-800 dark:text-white text-sm border-b border-slate-200 dark:border-slate-700">{l.title}</p>

            <QuickToggle label={l.dyslexia} icon="🔤" active={prefs.dyslexia} onClick={() => toggle("dyslexia")} />
            <QuickToggle label={l.largeText} icon="🔍" active={prefs.largeText} onClick={() => toggle("largeText")} />
            <QuickToggle label={l.highContrast} icon="🌓" active={prefs.highContrast} onClick={() => toggle("highContrast")} />
            <QuickToggle label={l.reducedMotion} icon="🛑" active={prefs.reducedMotion} onClick={() => toggle("reducedMotion")} />
            <QuickToggle label={l.underlineLinks} icon="📑" active={prefs.underlineLinks} onClick={() => toggle("underlineLinks")} />
            <QuickToggle label={l.sign} icon="🤟" active={prefs.signLanguage} onClick={() => toggle("signLanguage")} />

            <div className="pt-2 mt-1 border-t border-slate-200 dark:border-slate-700 flex gap-2">
              <button
                onClick={() => { setOpen(false); navigate("/accessibility"); }}
                className="flex-1 text-xs font-bold py-2 px-3 rounded-lg bg-violet-600 text-white hover:bg-violet-700"
              >
                {l.settings}
              </button>
              <button
                onClick={() => AccessibilityService.reset()}
                className="text-xs font-bold py-2 px-3 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600"
                title={l.reset}
              >
                🔄
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function QuickToggle({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={!!active}
      className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
        active
          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
          : "hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200"
      }`}
    >
      <span className="flex items-center gap-2">
        <span aria-hidden>{icon}</span>
        <span>{label}</span>
      </span>
      <span className={`relative inline-flex h-5 w-9 rounded-full ${active ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`}>
        <span className={`absolute top-0.5 left-0.5 h-4 w-4 bg-white rounded-full shadow transition ${active ? "translate-x-4" : ""}`} />
      </span>
    </button>
  );
}
