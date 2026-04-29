import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../../i18n/LanguageContext";
import { AdminService } from "../../services/AdminService";

const T = {
  el: {
    title: "🛡️ Moderation",
    reports: "🚩 Reports",
    leaderboard: "🌍 Leaderboard Cleanup",
    noReports: "Δεν υπάρχουν reports",
    resolve: "✓ Επίλυση",
    dismiss: "Απόρριψη",
    delete: "🗑️ Διαγραφή",
    refresh: "🔄 Ανανέωση",
    score: "Score",
    user: "Χρήστης",
    category: "Κατηγορία",
    status: "Status",
    actions: "Ενέργειες",
    confirmDelete: "Διαγραφή entry;",
    statusOpen: "Ανοικτό",
    showStatus: "Εμφάνιση",
    open: "Ανοικτά",
    resolved: "Επιλυμένα",
    dismissed: "Απορριφθέντα",
  },
  en: {
    title: "🛡️ Moderation",
    reports: "🚩 Reports",
    leaderboard: "🌍 Leaderboard Cleanup",
    noReports: "No reports",
    resolve: "✓ Resolve",
    dismiss: "Dismiss",
    delete: "🗑️ Delete",
    refresh: "🔄 Refresh",
    score: "Score",
    user: "User",
    category: "Category",
    status: "Status",
    actions: "Actions",
    confirmDelete: "Delete entry?",
    statusOpen: "Open",
    showStatus: "Show",
    open: "Open",
    resolved: "Resolved",
    dismissed: "Dismissed",
  },
};

export default function AdminModeration() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;

  const [reports, setReports] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [reportStatus, setReportStatus] = useState("open");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [r, lb] = await Promise.all([
      AdminService.listReports(reportStatus),
      AdminService.listLeaderboardEntries(50),
    ]);
    setReports(r);
    setLeaderboard(lb);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [reportStatus]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{l.title}</h2>
        <button onClick={load} className="text-sm font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50">{l.refresh}</button>
      </div>

      {/* Reports */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
        <header className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2 flex-wrap">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">{l.reports}</h3>
          <div className="flex gap-1">
            {["open", "resolved", "dismissed"].map((s) => (
              <button key={s} onClick={() => setReportStatus(s)} className={`text-xs font-bold px-2.5 py-1 rounded-md ${reportStatus === s ? "bg-purple-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>{l[s]}</button>
            ))}
          </div>
        </header>
        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">...</div>
        ) : reports.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">{l.noReports}</div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            {reports.map((r) => (
              <li key={r.id} className="px-5 py-3 flex items-start gap-3 flex-wrap">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">🚩</div>
                <div className="flex-1 min-w-[200px]">
                  <p className="font-bold text-slate-800 dark:text-slate-100">{r.reason || r.type || "Report"}</p>
                  <p className="text-xs text-slate-500">Target: <span className="font-mono">{r.targetId || r.targetUid || "—"}</span></p>
                  {r.message && <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{r.message}</p>}
                </div>
                {reportStatus === "open" && (
                  <div className="flex gap-1">
                    <button onClick={async () => { await AdminService.resolveReport(r.id, "resolved"); load(); }} className="text-[11px] font-bold px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300">{l.resolve}</button>
                    <button onClick={async () => { await AdminService.resolveReport(r.id, "dismissed"); load(); }} className="text-[11px] font-bold px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300">{l.dismiss}</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Leaderboard cleanup */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <header className="px-5 py-3 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">{l.leaderboard}</h3>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-left">
              <tr>
                <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">{l.user}</th>
                <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">{l.category}</th>
                <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">{l.score}</th>
                <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">{l.actions}</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-500">—</td></tr>
              ) : leaderboard.map((e) => (
                <tr key={e.id} className="border-t border-slate-100 dark:border-slate-700">
                  <td className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-200">{e.name || "—"}</td>
                  <td className="px-4 py-2 text-xs text-slate-500 font-mono">{e.category}</td>
                  <td className="px-4 py-2 font-bold text-purple-600">{e.score}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={async () => { if (window.confirm(l.confirmDelete)) { await AdminService.deleteLeaderboardEntry(e.id); load(); } }}
                      className="text-[11px] font-bold px-2 py-1 rounded-md bg-rose-50 dark:bg-rose-900/30 border border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300 hover:bg-rose-100"
                    >
                      {l.delete}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
