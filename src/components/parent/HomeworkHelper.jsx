import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LanguageContext } from "../../i18n/LanguageContext";
import { AuthContext } from "../../auth/AuthContext";
import { db } from "../../auth/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const T = {
  el: {
    title: "Βοηθός Εργασιών",
    subtitle: "Δες τις εργασίες των παιδιών και τις προθεσμίες τους",
    upcoming: "Επερχόμενες",
    submitted: "Παραδομένες",
    expired: "Έληξαν",
    none: "Δεν υπάρχουν εργασίες αυτή τη στιγμή",
    deadline: "Προθεσμία",
    today: "Σήμερα!",
    tomorrow: "Αύριο",
    daysLeft: "ημέρες",
    daysAgo: "πριν λίγες μέρες",
    classroom: "Τάξη",
    title_h: "Τίτλος",
    open: "▶ Άνοιγμα",
    submit: "Παράδωση",
    completed: "✓ Ολοκληρώθηκε",
    overdue: "⚠️ Εκπρόθεσμα",
    noClassrooms: "Το παιδί δεν έχει εγγραφεί σε καμία τάξη",
    needAuth: "Συνδέσου για να δεις εργασίες",
    refresh: "🔄 Ανανέωση",
    childInfo: "Παιδί",
  },
  en: {
    title: "Homework Helper",
    subtitle: "View your kids' assignments and deadlines",
    upcoming: "Upcoming",
    submitted: "Submitted",
    expired: "Overdue",
    none: "No assignments right now",
    deadline: "Deadline",
    today: "Today!",
    tomorrow: "Tomorrow",
    daysLeft: "days left",
    daysAgo: "days ago",
    classroom: "Class",
    title_h: "Title",
    open: "▶ Open",
    submit: "Submit",
    completed: "✓ Completed",
    overdue: "⚠️ Overdue",
    noClassrooms: "Child hasn't joined any classroom",
    needAuth: "Sign in to see assignments",
    refresh: "🔄 Refresh",
    childInfo: "Child",
  },
};

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.round((target - now) / (1000 * 60 * 60 * 24));
}

function formatDeadline(dateStr, l) {
  const days = daysUntil(dateStr);
  if (days === null) return "—";
  if (days === 0) return l.today;
  if (days === 1) return l.tomorrow;
  if (days < 0) return `${Math.abs(days)} ${l.daysAgo}`;
  return `${days} ${l.daysLeft}`;
}

export default function HomeworkHelper({ children = [] }) {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const { user } = useContext(AuthContext);
  const l = T[lang] || T.en;

  const [homework, setHomework] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming"); // upcoming | submitted | expired

  const loadAll = async () => {
    if (!db || !user) { setLoading(false); return; }
    setLoading(true);
    try {
      const memQ = query(collection(db, "classroomMembers"), where("studentUid", "==", user.uid));
      const memSnap = await getDocs(memQ);
      const codes = [];
      memSnap.forEach(d => { const data = d.data(); if (data.classroomCode) codes.push(data.classroomCode); });

      if (codes.length === 0) { setHomework([]); setLoading(false); return; }

      const uniqueCodes = [...new Set(codes)].slice(0, 30);
      const hwQ = query(collection(db, "classroomHomework"), where("classroomCode", "in", uniqueCodes));
      const hwSnap = await getDocs(hwQ);
      const hws = [];
      hwSnap.forEach(d => hws.push({ id: d.id, ...d.data() }));
      setHomework(hws);

      const subQ = query(collection(db, "homeworkSubmissions"), where("studentUid", "==", user.uid));
      const subSnap = await getDocs(subQ);
      const subs = [];
      subSnap.forEach(d => subs.push({ id: d.id, ...d.data() }));
      setSubmissions(subs);
    } catch (e) {
      console.warn("[HomeworkHelper] load failed", e);
    }
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, [user]); // eslint-disable-line

  const isSubmitted = (hwId) => submissions.some(s => s.homeworkId === hwId);

  const upcoming = homework.filter(h => {
    if (isSubmitted(h.id)) return false;
    const days = daysUntil(h.deadline);
    return days === null || days >= 0;
  }).sort((a, b) => (a.deadline || "").localeCompare(b.deadline || ""));

  const submitted = homework.filter(h => isSubmitted(h.id));
  const expired = homework.filter(h => {
    if (isSubmitted(h.id)) return false;
    const days = daysUntil(h.deadline);
    return days !== null && days < 0;
  });

  if (!user) {
    return <div className="text-center py-10 bg-slate-50 dark:bg-slate-800 rounded-2xl"><span className="text-4xl">🔐</span><p className="mt-3 text-sm text-slate-500">{l.needAuth}</p></div>;
  }

  const list = filter === "submitted" ? submitted : filter === "expired" ? expired : upcoming;

  return (
    <div className="space-y-4">
      <div className="text-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-5 border border-emerald-200 dark:border-emerald-800">
        <span className="inline-block text-3xl mb-1">📚📋</span>
        <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">{l.title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{l.subtitle}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <FilterBtn active={filter === "upcoming"} onClick={() => setFilter("upcoming")} count={upcoming.length} label={`📅 ${l.upcoming}`} />
        <FilterBtn active={filter === "submitted"} onClick={() => setFilter("submitted")} count={submitted.length} label={`✓ ${l.submitted}`} />
        <FilterBtn active={filter === "expired"} onClick={() => setFilter("expired")} count={expired.length} label={`⚠️ ${l.expired}`} />
      </div>

      {loading ? (
        <div className="text-center py-10"><span className="text-3xl animate-pulse">📚</span></div>
      ) : list.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 dark:bg-slate-800 rounded-2xl">
          <span className="text-4xl">{filter === "submitted" ? "🎉" : "📭"}</span>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{l.none}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map(h => {
            const days = daysUntil(h.deadline);
            const urgent = days !== null && days <= 1 && days >= 0 && filter === "upcoming";
            const overdue = filter === "expired";
            const submittedOK = filter === "submitted";
            return (
              <div key={h.id} className={`bg-white dark:bg-slate-800 rounded-xl p-4 border ${urgent ? "border-amber-300 dark:border-amber-800 ring-2 ring-amber-200 dark:ring-amber-900/30" : overdue ? "border-red-200 dark:border-red-900" : submittedOK ? "border-emerald-200 dark:border-emerald-900" : "border-slate-100 dark:border-slate-700"}`}>
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">📋 {h.title}</h4>
                    {h.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{h.description}</p>}
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px]">
                      <span className="text-slate-400">🏫 {h.classroomName || h.classroomCode}</span>
                      {h.deadline && (
                        <span className={`font-bold ${urgent ? "text-amber-600" : overdue ? "text-red-600" : submittedOK ? "text-emerald-600" : "text-slate-500"}`}>
                          ⏰ {l.deadline}: {formatDeadline(h.deadline, l)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {submittedOK ? (
                      <span className="text-xs px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg font-bold">{l.completed}</span>
                    ) : overdue ? (
                      <span className="text-xs px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg font-bold">{l.overdue}</span>
                    ) : h.relatedQuizCode ? (
                      <Link to={`/classroom/${h.classroomCode}`} className="text-xs px-3 py-1.5 bg-blue-500 text-white rounded-lg font-bold whitespace-nowrap">{l.open}</Link>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button onClick={loadAll} className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold">
        {l.refresh}
      </button>
    </div>
  );
}

function FilterBtn({ active, onClick, count, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition ${active ? "bg-emerald-500 text-white shadow-sm" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}
    >
      {label} ({count})
    </button>
  );
}
