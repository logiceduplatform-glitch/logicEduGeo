import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { searchIndex } from "../config/searchIndex";

const T = {
  el: {
    placeholder: "Αναζήτηση παιχνιδιών, σελίδων, λειτουργιών...",
    hint: "Πάτα Cmd+K (ή Ctrl+K) από οπουδήποτε για άνοιγμα",
    recent: "Πρόσφατα",
    suggested: "Προτεινόμενα",
    noResults: "Καμία αντιστοιχία. Δοκίμασε άλλη λέξη.",
    enter: "Enter για άνοιγμα",
    arrows: "↑↓ για περιήγηση",
    esc: "ESC για κλείσιμο",
    pages: "Σελίδες",
    games: "Παιχνίδια",
    teacher: "Δάσκαλος",
    parent: "Γονέας",
    topics: "Θέματα",
  },
  en: {
    placeholder: "Search games, pages, features...",
    hint: "Press Cmd+K (or Ctrl+K) anywhere to open",
    recent: "Recent",
    suggested: "Suggested",
    noResults: "No matches. Try another word.",
    enter: "Enter to open",
    arrows: "↑↓ to navigate",
    esc: "ESC to close",
    pages: "Pages",
    games: "Games",
    teacher: "Teacher",
    parent: "Parent",
    topics: "Topics",
  },
};

const SUGGESTED_IDS = ["daily", "adventure", "pet", "battle", "achievements", "shop"];

export default function GlobalSearch() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const navigate = useNavigate();
  const l = T[lang] || T.en;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem("geo:searchRecent") || "[]"); } catch { return []; }
  });
  const inputRef = useRef(null);

  const results = searchIndex(query, lang, 12);
  const suggested = SUGGESTED_IDS
    .map(id => searchIndex(id, lang, 1)[0])
    .filter(Boolean);

  const close = useCallback(() => { setOpen(false); setQuery(""); setActiveIdx(0); }, []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape" && open) {
        close();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, close]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const list = query ? results : (recent.length > 0 ? recent : suggested);

  const handleSelect = (item) => {
    if (!item) return;
    const newRecent = [item, ...recent.filter(r => r.id !== item.id)].slice(0, 5);
    setRecent(newRecent);
    try { localStorage.setItem("geo:searchRecent", JSON.stringify(newRecent)); } catch {}
    close();
    navigate(item.path);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, list.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    if (e.key === "Enter") { e.preventDefault(); handleSelect(list[activeIdx]); }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        title={l.hint}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 5.65 5.65a7.5 7.5 0 0 0 11 11z" /></svg>
        <span>{lang === "el" ? "Αναζήτηση" : "Search"}</span>
        <kbd className="ml-2 px-1.5 py-0.5 text-[10px] bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded">⌘K</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 pt-[10vh]" onClick={close}>
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 5.65 5.65a7.5 7.5 0 0 0 11 11z" /></svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIdx(0); }}
            onKeyDown={handleKeyDown}
            placeholder={l.placeholder}
            className="flex-1 bg-transparent outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm"
          />
          <kbd className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded border border-slate-300 dark:border-slate-600">ESC</kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {!query && recent.length > 0 && (
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{l.recent}</div>
          )}
          {!query && recent.length === 0 && (
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{l.suggested}</div>
          )}

          {list.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">{l.noResults}</div>
          ) : (
            list.map((item, i) => (
              <button
                key={item.id + "_" + i}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setActiveIdx(i)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition ${activeIdx === i ? "bg-purple-50 dark:bg-purple-900/30" : "hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}
              >
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className={`font-semibold text-sm ${activeIdx === i ? "text-purple-700 dark:text-purple-300" : "text-slate-800 dark:text-slate-100"}`}>
                    {lang === "el" ? item.title.el : item.title.en}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">{item.path}</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 capitalize">{l[item.category] || item.category}</span>
              </button>
            ))
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-[10px] text-slate-400">
          <span>{l.arrows}</span>
          <span>{l.enter}</span>
          <span>{l.esc}</span>
        </div>
      </div>
    </div>
  );
}
