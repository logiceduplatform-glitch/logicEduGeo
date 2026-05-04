import React, { useContext, useEffect, useMemo, useState } from "react";
import { LanguageContext } from "../../i18n/LanguageContext";
import { db } from "../../auth/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";

const T = {
  el: {
    title: "📧 Email Queue",
    refresh: "🔄 Ανανέωση",
    none: "Δεν υπάρχουν emails στην ουρά.",
    pending: "Σε εκκρεμότητα",
    sent: "Εστάλη",
    failed: "Απέτυχε",
    skipped: "Παραλείφθηκε",
    type: "Τύπος",
    status: "Κατάσταση",
    createdAt: "Δημιουργήθηκε",
    user: "Χρήστης",
    types: {
      trial_ending: "⏰ Λήγει η δοκιμή",
      receipt: "📄 Απόδειξη",
      payment_failed: "⚠️ Αποτυχία πληρωμής",
      welcome: "🌸 Καλώς ήρθες",
    },
  },
  en: {
    title: "📧 Email Queue",
    refresh: "🔄 Refresh",
    none: "No emails in queue.",
    pending: "Pending",
    sent: "Sent",
    failed: "Failed",
    skipped: "Skipped",
    type: "Type",
    status: "Status",
    createdAt: "Created",
    user: "User",
    types: {
      trial_ending: "⏰ Trial ending",
      receipt: "📄 Receipt",
      payment_failed: "⚠️ Payment failed",
      welcome: "🌸 Welcome",
    },
  },
};

const STATUS_COLORS = {
  pending: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
  sent:    "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
  failed:  "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300",
  skipped: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
};

function formatTime(ts) {
  try {
    if (ts?.toDate) return ts.toDate().toLocaleString();
    if (ts) return new Date(ts).toLocaleString();
  } catch { /* noop */ }
  return "—";
}

export default function AdminEmailQueue() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "emailQueue"),
        orderBy("createdAt", "desc"),
        limit(200),
      );
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.warn("[AdminEmailQueue] load failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const stats = useMemo(() => {
    const out = { pending: 0, sent: 0, failed: 0, skipped: 0 };
    for (const it of items) {
      out[it.status] = (out[it.status] || 0) + 1;
    }
    return out;
  }, [items]);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((it) => it.status === filter);
  }, [items, filter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {l.title}
        </h2>
        <button
          onClick={load}
          className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700"
        >
          {l.refresh}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {["pending", "sent", "failed", "skipped"].map((k) => (
          <button
            key={k}
            onClick={() => setFilter(filter === k ? "all" : k)}
            className={`p-3 rounded-xl border-2 text-left transition-all ${
              filter === k
                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300"
            }`}
          >
            <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
              {stats[k] || 0}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {l[k]}
            </div>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-slate-500">…</div>
      ) : !filtered.length ? (
        <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          {l.none}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">{l.type}</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">{l.status}</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">{l.user}</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">{l.createdAt}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((it) => (
                <tr key={it.id} className="border-t border-slate-100 dark:border-slate-700">
                  <td className="px-4 py-2">{l.types[it.type] || it.type}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[it.status] || ""}`}>
                      {l[it.status] || it.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 font-mono text-xs text-slate-500">{(it.uid || "").slice(0, 12)}…</td>
                  <td className="px-4 py-2 text-xs text-slate-500">{formatTime(it.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
