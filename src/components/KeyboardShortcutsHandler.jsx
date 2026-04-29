import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";

// Global keyboard shortcuts handler. Renders the help overlay when ? is pressed.
export default function KeyboardShortcutsHandler() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const themeCtx = useTheme() || {};
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // ignore typing in inputs
      const tag = (e.target?.tagName || "").toLowerCase();
      const isEditable = e.target?.isContentEditable;
      if (tag === "input" || tag === "textarea" || tag === "select" || isEditable) return;

      // ? toggles help (Shift+/)
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setHelpOpen((o) => !o);
        return;
      }
      if (e.key === "Escape" && helpOpen) {
        setHelpOpen(false);
        return;
      }

      // Plain letter shortcuts (no modifiers)
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key.toLowerCase()) {
        case "h": navigate("/"); break;
        case "p": navigate("/profile"); break;
        case "a": navigate("/achievements"); break;
        case "s": navigate("/shop"); break;
        case "d": navigate("/daily"); break;
        case "m": navigate("/adventure"); break;
        case "l": navigate("/leaderboard"); break;
        case "e": navigate("/events"); break;
        case "g": navigate("/play"); break;
        case "t":
          if (themeCtx.toggle) themeCtx.toggle();
          break;
        default:
          return;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate, themeCtx, helpOpen]);

  return helpOpen ? (
    <KeyboardShortcutsOverlay onClose={() => setHelpOpen(false)} lang={lang} />
  ) : null;
}

const T = {
  el: {
    title: "⌨️ Συντομεύσεις Πληκτρολογίου",
    desc: "Πάτα ένα γράμμα για γρήγορη πλοήγηση",
    close: "Κλείσιμο",
    cmdK: "Άνοιγμα Αναζήτησης",
    questionMark: "Άνοιγμα/Κλείσιμο αυτού του βοηθήματος",
    h: "Αρχική",
    p: "Προφίλ",
    a: "Επιτυχίες",
    s: "Κατάστημα",
    d: "Daily Challenge",
    m: "Adventure Map",
    l: "Leaderboard",
    e: "Events",
    g: "Παίξε (Games)",
    t: "Εναλλαγή Theme",
    esc: "Κλείσιμο popups",
    nav: "Πλοήγηση",
    actions: "Ενέργειες",
  },
  en: {
    title: "⌨️ Keyboard Shortcuts",
    desc: "Press a letter for quick navigation",
    close: "Close",
    cmdK: "Open Search",
    questionMark: "Toggle this help",
    h: "Home",
    p: "Profile",
    a: "Achievements",
    s: "Shop",
    d: "Daily Challenge",
    m: "Adventure Map",
    l: "Leaderboard",
    e: "Events",
    g: "Play (Games)",
    t: "Toggle Theme",
    esc: "Close popups",
    nav: "Navigation",
    actions: "Actions",
  },
};

function KeyboardShortcutsOverlay({ onClose, lang }) {
  const l = T[lang] || T.en;
  const navItems = [
    { key: "H", label: l.h },
    { key: "P", label: l.p },
    { key: "A", label: l.a },
    { key: "S", label: l.s },
    { key: "D", label: l.d },
    { key: "M", label: l.m },
    { key: "L", label: l.l },
    { key: "E", label: l.e },
    { key: "G", label: l.g },
  ];

  const actions = [
    { key: "T", label: l.t },
    { key: "⌘K", label: l.cmdK },
    { key: "?", label: l.questionMark },
    { key: "ESC", label: l.esc },
  ];

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="kbd-shortcuts-title"
        className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <h3 id="kbd-shortcuts-title" className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-slate-100 truncate">{l.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{l.desc}</p>
          </div>
          <button
            onClick={onClose}
            aria-label={l.close}
            className="shrink-0 w-9 h-9 flex items-center justify-center text-2xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg leading-none focus:outline-none focus:ring-2 focus:ring-purple-400"
          >×</button>
        </header>

        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 overflow-y-auto">
          <div>
            <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-3">{l.nav}</p>
            <ul className="space-y-2">
              {navItems.map(item => <ShortcutRow key={item.key} k={item.key} label={item.label} />)}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-3">{l.actions}</p>
            <ul className="space-y-2">
              {actions.map(item => <ShortcutRow key={item.key} k={item.key} label={item.label} />)}
            </ul>
          </div>
        </div>

        <footer className="px-6 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 text-center shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400">
            {l.close}
          </button>
        </footer>
      </div>
    </div>
  );
}

function ShortcutRow({ k, label }) {
  return (
    <li className="flex items-center justify-between gap-2">
      <span className="text-sm text-slate-700 dark:text-slate-200">{label}</span>
      <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-xs font-bold text-slate-700 dark:text-slate-200 min-w-[40px] text-center">{k}</kbd>
    </li>
  );
}
