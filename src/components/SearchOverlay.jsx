import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { searchGames } from "../config/searchIndex";
import { AnalyticsService } from "../services/AnalyticsService";

const T = {
  el: {
    placeholder: "Αναζήτηση παιχνιδιών, σελίδων...",
    noResults: "Δεν βρέθηκαν αποτελέσματα",
    hint: "Πληκτρολόγησε τουλάχιστον 2 χαρακτήρες",
    close: "Κλείσιμο",
  },
  en: {
    placeholder: "Search games, pages...",
    noResults: "No results found",
    hint: "Type at least 2 characters",
    close: "Close",
  },
};

const SECTION_LABELS = {
  adult: { el: "Ενήλικες", en: "Adults" },
  board: { el: "Επιτραπέζια", en: "Board Games" },
  quiz: { el: "Quiz", en: "Quiz" },
  page: { el: "Σελίδα", en: "Page" },
};

function getSectionLabel(section, lang) {
  if (SECTION_LABELS[section]) return SECTION_LABELS[section][lang] || SECTION_LABELS[section].en;
  if (section.startsWith("age-")) {
    const parts = section.replace("age-", "").split("-");
    const age = parts.slice(0, -1).join("-");
    return (lang === "el" ? "Ηλικία " : "Age ") + age;
  }
  return section;
}

export default function SearchOverlay({ open, onClose }) {
  const { lang } = useContext(LanguageContext);
  const l = T[lang] || T.en;
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const modalRef = useRef(null);
  const openerRef = useRef(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement;
      setQuery("");
      setResults([]);
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else if (openerRef.current) {
      openerRef.current.focus();
      openerRef.current = null;
    }
  }, [open]);

  useEffect(() => {
    const r = searchGames(query, lang);
    setResults(r);
    setActiveIdx(0);
  }, [query, lang]);

  const handleSelect = useCallback(
    (item) => {
      AnalyticsService.search(query, results.length);
      onClose();
      navigate(item.route);
    },
    [navigate, onClose, query, results.length]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && results[activeIdx]) {
        handleSelect(results[activeIdx]);
      } else if (e.key === "Tab") {
        const focusable = modalRef.current?.querySelectorAll('input, button, [tabindex]:not([tabindex="-1"])');
        if (focusable && focusable.length) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [results, activeIdx, onClose, handleSelect]
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={l.placeholder}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={l.placeholder}
            className="flex-1 bg-transparent text-slate-800 dark:text-white text-base outline-none placeholder-slate-400"
            autoComplete="off"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 text-[10px] text-slate-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {query.length < 2 ? (
            <div className="px-5 py-8 text-center text-sm text-slate-400">
              {l.hint}
            </div>
          ) : results.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <span className="text-4xl block mb-3" aria-hidden="true">🔍</span>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">{l.noResults}</p>
              <p className="text-xs text-slate-400">{lang === "el" ? "Δοκίμασε διαφορετικούς όρους αναζήτησης" : "Try different search terms"}</p>
            </div>
          ) : (
            <ul className="py-2">
              {results.map((item, i) => (
                <li key={`${item.section}-${item.id}`}>
                  <button
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setActiveIdx(i)}
                    className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${
                      i === activeIdx
                        ? "bg-purple-50 dark:bg-purple-900/30"
                        : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <span className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-lg shrink-0">
                      {item.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-slate-800 dark:text-white truncate">
                        {item.title?.[lang] || item.title?.en || item.id}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {item.category?.[lang] || item.category?.en}
                        {item.desc && ` — ${item.desc[lang] || item.desc.en}`}
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full shrink-0">
                      {getSectionLabel(item.section, lang)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-5 py-2.5 border-t border-slate-200 dark:border-slate-700 flex items-center gap-4 text-[10px] text-slate-400">
          {results.length > 0 && (
            <>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 font-mono">↑↓</kbd>
                {lang === "el" ? "πλοήγηση" : "navigate"}
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 font-mono">↵</kbd>
                {lang === "el" ? "επιλογή" : "select"}
              </span>
            </>
          )}
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 font-mono">esc</kbd>
            {lang === "el" ? "κλείσιμο" : "close"}
          </span>
        </div>
      </div>
    </div>
  );
}
