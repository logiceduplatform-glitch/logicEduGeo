import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../../i18n/LanguageContext";
import { AdminService } from "../../services/AdminService";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "../../auth/firebase";

const T = {
  el: {
    title: "📊 Επισκόπηση",
    users: "Χρήστες",
    classrooms: "Τάξεις",
    leaderboard: "Leaderboard entries",
    reports: "Ανοιχτά reports",
    admins: "Admins",
    recentSignups: "Πρόσφατες εγγραφές",
    noData: "Δεν υπάρχουν δεδομένα",
    loading: "Φόρτωση...",
    refresh: "🔄 Ανανέωση",
    teacher: "Δάσκαλος",
    parent: "Γονέας",
    student: "Μαθητής",
  },
  en: {
    title: "📊 Overview",
    users: "Users",
    classrooms: "Classrooms",
    leaderboard: "Leaderboard entries",
    reports: "Open reports",
    admins: "Admins",
    recentSignups: "Recent signups",
    noData: "No data",
    loading: "Loading...",
    refresh: "🔄 Refresh",
    teacher: "Teacher",
    parent: "Parent",
    student: "Student",
  },
};

export default function AdminOverview() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const [counts, setCounts] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [c, r] = await Promise.all([
      AdminService.getCounts(),
      loadRecentSignups(),
    ]);
    setCounts(c);
    setRecent(r);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const cards = counts ? [
    { label: l.users,       value: counts.users,        icon: "👥", color: "from-blue-500 to-cyan-500" },
    { label: l.classrooms,  value: counts.classrooms,   icon: "🏫", color: "from-emerald-500 to-teal-500" },
    { label: l.leaderboard, value: counts.leaderboard,  icon: "🌍", color: "from-purple-500 to-pink-500" },
    { label: l.reports,     value: counts.reports,      icon: "🚩", color: "from-rose-500 to-red-500" },
    { label: l.admins,      value: counts.admins,       icon: "🛡️", color: "from-amber-500 to-orange-500" },
  ] : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{l.title}</h2>
        <button onClick={load} disabled={loading} className="text-sm font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 disabled:opacity-50">
          {l.refresh}
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {(loading || !counts) ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-2xl p-5 bg-slate-200 dark:bg-slate-700 animate-pulse h-28" />
          ))
        ) : (
          cards.map((c) => (
            <div key={c.label} className={`rounded-2xl p-5 text-white bg-gradient-to-br ${c.color} shadow-md`}>
              <div className="text-3xl">{c.icon}</div>
              <div className="mt-2 text-3xl font-extrabold tabular-nums">{c.value}</div>
              <div className="text-xs font-bold uppercase opacity-90 tracking-wider mt-1">{c.label}</div>
            </div>
          ))
        )}
      </div>

      {/* Recent signups */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <header className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">{l.recentSignups}</h3>
        </header>
        {recent.length === 0 ? (
          <p className="text-center py-8 text-sm text-slate-500">{l.noData}</p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            {recent.map((u) => (
              <li key={u.id} className="px-5 py-3 flex items-center gap-3">
                {u.photoURL ? (
                  <img src={u.photoURL} alt="" loading="lazy" decoding="async" className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">{(u.displayName || u.email || "?")[0]?.toUpperCase()}</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{u.displayName || (u.email || "").split("@")[0]}</p>
                  <p className="text-xs text-slate-500 truncate">{u.email}</p>
                </div>
                {u.role && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">{l[u.role] || u.role}</span>}
                <span className="text-[11px] text-slate-400 tabular-nums">{fmtDate(u.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

async function loadRecentSignups() {
  try {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(20));
    const snap = await getDocs(q);
    const list = [];
    snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
    return list;
  } catch (e) {
    return [];
  }
}

function fmtDate(ts) {
  if (!ts) return "";
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString();
  } catch {
    return "";
  }
}
