import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../../i18n/LanguageContext";
import { db } from "../../auth/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const T = {
  el: {
    title: "🔔 Push Notifications",
    composeTitle: "Νέα καμπάνια",
    titleField: "Τίτλος",
    bodyField: "Μήνυμα",
    urlField: "URL προορισμού",
    audienceField: "Κοινό",
    audiences: {
      all: "Όλοι (με push)",
      premium: "Premium χρήστες",
      trial: "Σε δοκιμή",
      inactive7d: "Ανενεργοί 7+ ημέρες",
    },
    send: "Αποστολή",
    sending: "Αποστολή…",
    history: "Πρόσφατες καμπάνιες",
    none: "Δεν υπάρχουν καμπάνιες ακόμη.",
    sent: "Εστάλη",
    pending: "Εκκρεμεί",
    processing: "Σε εξέλιξη",
    failed: "Απέτυχε",
    confirm: "Σίγουρα να σταλεί η ειδοποίηση σε αυτό το κοινό;",
  },
  en: {
    title: "🔔 Push Notifications",
    composeTitle: "New campaign",
    titleField: "Title",
    bodyField: "Body",
    urlField: "Destination URL",
    audienceField: "Audience",
    audiences: {
      all: "All (with push)",
      premium: "Premium users",
      trial: "On trial",
      inactive7d: "Inactive 7+ days",
    },
    send: "Send",
    sending: "Sending…",
    history: "Recent campaigns",
    none: "No campaigns yet.",
    sent: "Sent",
    pending: "Pending",
    processing: "Processing",
    failed: "Failed",
    confirm: "Send notification to this audience?",
  },
};

const STATUS_COLORS = {
  pending:    "bg-amber-100 dark:bg-amber-900/40 text-amber-700",
  processing: "bg-blue-100 dark:bg-blue-900/40 text-blue-700",
  completed:  "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700",
  failed:     "bg-rose-100 dark:bg-rose-900/40 text-rose-700",
};

function formatTime(ts) {
  try {
    if (ts?.toDate) return ts.toDate().toLocaleString();
    if (ts) return new Date(ts).toLocaleString();
  } catch { /* noop */ }
  return "—";
}

export default function AdminPush() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    title: "",
    body: "",
    url: "/",
    audience: "all",
  });

  const load = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "pushCampaigns"),
        orderBy("createdAt", "desc"),
        limit(50),
      );
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.warn("[AdminPush] load failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (!confirm(l.confirm)) return;
    setSending(true);
    try {
      await addDoc(collection(db, "pushCampaigns"), {
        title: form.title.trim(),
        body: form.body.trim(),
        url: form.url.trim() || "/",
        audience: form.audience,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setForm({ title: "", body: "", url: "/", audience: "all" });
      setTimeout(load, 1000);
    } catch (e) {
      console.error("[AdminPush] send failed", e);
      alert("Send failed: " + e.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        {l.title}
      </h2>

      {/* Compose form */}
      <form
        onSubmit={handleSend}
        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-3"
      >
        <h3 className="font-bold text-slate-700 dark:text-slate-200">{l.composeTitle}</h3>
        <input
          type="text"
          placeholder={l.titleField}
          value={form.title}
          maxLength={50}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
        />
        <textarea
          placeholder={l.bodyField}
          value={form.body}
          maxLength={150}
          rows={2}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
        />
        <input
          type="text"
          placeholder={l.urlField}
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
        />
        <div className="flex flex-wrap gap-2">
          {Object.entries(l.audiences).map(([key, label]) => (
            <button
              type="button"
              key={key}
              onClick={() => setForm({ ...form, audience: key })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                form.audience === key
                  ? "bg-purple-600 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="submit"
          disabled={sending || !form.title.trim()}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all"
        >
          {sending ? l.sending : l.send}
        </button>
      </form>

      {/* History */}
      <div>
        <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-3">{l.history}</h3>
        {loading ? (
          <div className="text-sm text-slate-500">…</div>
        ) : !items.length ? (
          <div className="p-6 text-center text-slate-500 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            {l.none}
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((c) => (
              <div
                key={c.id}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
              >
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{c.title}</div>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[c.status] || ""}`}>
                    {c.status}
                  </span>
                </div>
                {c.body && <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{c.body}</p>}
                <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>👥 {c.audience}</span>
                  {typeof c.recipients === "number" && <span>📨 {c.recipients} sent</span>}
                  {typeof c.successCount === "number" && <span>✅ {c.successCount}</span>}
                  {typeof c.failureCount === "number" && c.failureCount > 0 && <span>❌ {c.failureCount}</span>}
                  <span>🕐 {formatTime(c.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
