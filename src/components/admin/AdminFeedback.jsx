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
    title: "💬 Feedback χρηστών",
    refresh: "🔄 Ανανέωση",
    none: "Δεν υπάρχουν σχόλια ακόμη.",
    avgScore: "Μέσος όρος",
    total: "Σύνολο",
    distribution: "Κατανομή",
    filterAll: "Όλα",
    filterWithComment: "Με σχόλιο",
    page: "Σελίδα",
    role: "Ρόλος",
    when: "Πότε",
    delete: "Διαγραφή",
    confirmDelete: "Σίγουρα διαγραφή;",
    loading: "Φόρτωση...",
    emoji: ["😞", "😐", "🙂", "😍", "🤩"],
  },
  en: {
    title: "💬 User feedback",
    refresh: "🔄 Refresh",
    none: "No feedback yet.",
    avgScore: "Avg score",
    total: "Total",
    distribution: "Distribution",
    filterAll: "All",
    filterWithComment: "With comment",
    page: "Page",
    role: "Role",
    when: "When",
    delete: "Delete",
    confirmDelete: "Delete this feedback?",
    loading: "Loading...",
    emoji: ["😞", "😐", "🙂", "😍", "🤩"],
  },
};

function fmtTime(ts) {
  if (!ts) return "—";
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString();
  } catch {
    return "—";
  }
}

export default function AdminFeedback() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withCommentOnly, setWithCommentOnly] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "feedback"), orderBy("createdAt", "desc"), limit(200));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(data);
    } catch (e) {
      console.warn("Failed to load feedback", e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!withCommentOnly) return items;
    return items.filter((i) => i.comment && i.comment.trim().length > 0);
  }, [items, withCommentOnly]);

  const stats = useMemo(() => {
    if (items.length === 0) return { avg: 0, total: 0, dist: [0, 0, 0, 0, 0] };
    const dist = [0, 0, 0, 0, 0];
    let sum = 0;
    items.forEach((i) => {
      const s = Number(i.score) || 0;
      if (s >= 1 && s <= 5) {
        dist[s - 1]++;
        sum += s;
      }
    });
    return { avg: (sum / items.length).toFixed(2), total: items.length, dist };
  }, [items]);

  const handleDelete = async (id) => {
    if (!window.confirm(l.confirmDelete)) return;
    try {
      await deleteDoc(doc(db, "feedback", id));
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      console.warn("Delete failed", e);
    }
  };

  const maxDist = Math.max(1, ...stats.dist);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{l.title}</h2>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1">
            <input
              type="checkbox"
              checked={withCommentOnly}
              onChange={(e) => setWithCommentOnly(e.target.checked)}
            />
            {l.filterWithComment}
          </label>
          <button
            type="button"
            onClick={load}
            className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-semibold"
          >
            {l.refresh}
          </button>
        </div>
      </div>

      {/* Stats panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">{l.avgScore}</div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{stats.avg}</div>
          <div className="text-xs text-slate-500 mt-1">/ 5</div>
        </div>
        <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">{l.total}</div>
          <div className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{stats.total}</div>
        </div>
        <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">{l.distribution}</div>
          <div className="flex items-end gap-1 h-12">
            {stats.dist.map((n, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end" title={`${l.emoji[i]} ${n}`}>
                <div
                  className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t"
                  style={{ height: `${(n / maxDist) * 100}%`, minHeight: n > 0 ? 4 : 0 }}
                />
                <div className="text-[10px] mt-0.5">{l.emoji[i]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8 text-slate-500">{l.loading}</div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-8 text-slate-500 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          {l.none}
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-3xl" aria-label={`${item.score}/5`}>{l.emoji[Math.max(0, Math.min(4, (item.score || 1) - 1))]}</span>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  <div className="font-bold text-slate-700 dark:text-slate-300">{item.score}/5</div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                {item.comment ? (
                  <p className="text-sm text-slate-800 dark:text-slate-100 whitespace-pre-wrap break-words">{item.comment}</p>
                ) : (
                  <p className="text-xs italic text-slate-400">— ({lang === "el" ? "χωρίς σχόλιο" : "no comment"})</p>
                )}
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex flex-wrap gap-3">
                  <span>📄 {item.page || "—"}</span>
                  <span>👤 {item.role || "—"}</span>
                  <span>🌐 {item.lang || "—"}</span>
                  <span>📅 {fmtTime(item.createdAt)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                title={l.delete}
                aria-label={l.delete}
                className="text-rose-500 hover:text-rose-600 text-sm px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-900/20 flex-shrink-0"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
