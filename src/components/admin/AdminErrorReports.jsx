import React, { useContext, useEffect, useMemo, useState } from "react";
import { LanguageContext } from "../../i18n/LanguageContext";
import { db } from "../../auth/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

const T = {
  el: {
    title: "🐞 Error Reports",
    refresh: "🔄 Ανανέωση",
    clear: "🗑️ Καθαρισμός",
    none: "Δεν υπάρχουν αναφορές σφαλμάτων.",
    when: "Πότε",
    message: "Σφάλμα",
    user: "Χρήστης",
    page: "Σελίδα",
    showing: "Εμφάνιση {n} καταχωρήσεων",
    grouped: "Ομαδοποίηση κατά μήνυμα",
    detail: "Λεπτομέρειες",
    occurrences: "{n} εμφανίσεις",
    confirmClear: "Σίγουρα θες να διαγράψεις τις τελευταίες {n} αναφορές;",
  },
  en: {
    title: "🐞 Error Reports",
    refresh: "🔄 Refresh",
    clear: "🗑️ Clear",
    none: "No error reports.",
    when: "When",
    message: "Error",
    user: "User",
    page: "Page",
    showing: "Showing {n} entries",
    grouped: "Group by message",
    detail: "Details",
    occurrences: "{n} occurrences",
    confirmClear: "Delete the latest {n} reports?",
  },
};

function formatTime(ts) {
  try {
    if (ts && ts.toDate) return ts.toDate().toLocaleString();
    if (ts) return new Date(ts).toLocaleString();
  } catch {
    /* noop */
  }
  return "—";
}

export default function AdminErrorReports() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grouped, setGrouped] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "errorReports"),
        orderBy("serverTime", "desc"),
        limit(200),
      );
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.warn("[AdminErrorReports] load failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const groups = useMemo(() => {
    if (!grouped) {
      return items.map((it) => ({
        message: it.message,
        latest: it,
        count: 1,
        items: [it],
      }));
    }
    const map = new Map();
    for (const it of items) {
      const key = it.message || "(no message)";
      if (!map.has(key)) map.set(key, { message: key, latest: it, count: 0, items: [] });
      const g = map.get(key);
      g.count += 1;
      g.items.push(it);
      if (!g.latest.serverTime || (it.serverTime && it.serverTime > g.latest.serverTime)) {
        g.latest = it;
      }
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [items, grouped]);

  const handleClear = async () => {
    if (!items.length) return;
    if (!confirm(l.confirmClear.replace("{n}", String(items.length)))) return;
    try {
      await Promise.allSettled(
        items.slice(0, 100).map((it) => deleteDoc(doc(db, "errorReports", it.id))),
      );
      await load();
    } catch (e) {
      console.warn("[AdminErrorReports] clear failed", e);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {l.title}
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={grouped}
              onChange={(e) => setGrouped(e.target.checked)}
            />
            {l.grouped}
          </label>
          <button
            onClick={load}
            className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700"
          >
            {l.refresh}
          </button>
          <button
            onClick={handleClear}
            disabled={!items.length}
            className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 disabled:opacity-40"
          >
            {l.clear}
          </button>
        </div>
      </div>

      <div className="text-xs text-slate-500 dark:text-slate-400">
        {l.showing.replace("{n}", String(items.length))}
      </div>

      {loading ? (
        <div className="text-sm text-slate-500">…</div>
      ) : !items.length ? (
        <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          {l.none}
        </div>
      ) : (
        <div className="space-y-2">
          {groups.map((g, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <button
                className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                onClick={() => setExpanded(expanded === idx ? null : idx)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm text-rose-600 dark:text-rose-400 truncate">
                      {g.message}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap gap-3">
                      <span>📅 {formatTime(g.latest.serverTime || g.latest.timestamp)}</span>
                      <span>👤 {g.latest.role || "—"}</span>
                      <span>📄 {g.latest.pathname || g.latest.url || "—"}</span>
                    </div>
                  </div>
                  {grouped && (
                    <div className="text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-bold">
                      {l.occurrences.replace("{n}", String(g.count))}
                    </div>
                  )}
                </div>
              </button>
              {expanded === idx && (
                <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                  <pre className="text-[11px] font-mono text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-pre-wrap break-words">
                    {JSON.stringify(g.latest, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
