import React, { useContext, useEffect, useMemo, useState } from "react";
import { LanguageContext } from "../../i18n/LanguageContext";
import { AdminService } from "../../services/AdminService";

const T = {
  el: {
    title: "📋 Activity Logs",
    refresh: "🔄 Ανανέωση",
    none: "Δεν υπάρχουν logs",
    when: "Πότε",
    action: "Ενέργεια",
    payload: "Λεπτομέρειες",
    filter: "Φίλτρο",
    all: "Όλα",
    showing: "Εμφάνιση {n} καταχωρήσεων",
  },
  en: {
    title: "📋 Activity Logs",
    refresh: "🔄 Refresh",
    none: "No logs",
    when: "When",
    action: "Action",
    payload: "Details",
    filter: "Filter",
    all: "All",
    showing: "Showing {n} entries",
  },
};

const ACTION_ICONS = {
  "admin.add": "➕",
  "admin.remove": "➖",
  "user.role.change": "👤",
  "user.ban": "🚫",
  "user.unban": "✅",
  "user.teacherVerify": "✓",
  "flag.toggle": "🎛️",
  "premium.grant": "💎",
  "premium.revoke": "↩️",
  "leaderboard.delete": "🗑️",
  "report.resolve": "🛡️",
  "announcement.create": "📢",
  "announcement.update": "✏️",
  "announcement.delete": "🗑️",
  "maintenance.toggle": "🚧",
};

export default function AdminLogs() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const load = async () => {
    setLoading(true);
    setLogs(await AdminService.listLogs(300));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const actions = useMemo(() => {
    const set = new Set(logs.map((l) => l.action));
    return Array.from(set).sort();
  }, [logs]);

  const filtered = useMemo(() => {
    if (!filter) return logs;
    return logs.filter((l) => l.action === filter);
  }, [logs, filter]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{l.title}</h2>
        <button onClick={load} className="text-sm font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50">{l.refresh}</button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <label className="text-xs font-bold text-slate-600 dark:text-slate-300">{l.filter}:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-1.5 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <option value="">{l.all}</option>
          {actions.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <span className="text-xs text-slate-500">{l.showing.replace("{n}", filtered.length)}</span>
      </div>

      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">{l.none}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-left">
                <tr>
                  <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap">{l.when}</th>
                  <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">{l.action}</th>
                  <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">{l.payload}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => (
                  <tr key={log.id} className="border-t border-slate-100 dark:border-slate-700">
                    <td className="px-4 py-2 text-xs text-slate-500 tabular-nums whitespace-nowrap">{fmtTs(log.createdAt)}</td>
                    <td className="px-4 py-2">
                      <span className="font-bold text-slate-800 dark:text-slate-100 inline-flex items-center gap-1.5">
                        <span aria-hidden>{ACTION_ICONS[log.action] || "•"}</span>
                        <code className="text-xs font-mono">{log.action}</code>
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <code className="text-[11px] font-mono text-slate-600 dark:text-slate-400 break-all">
                        {JSON.stringify(log.payload || {})}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function fmtTs(ts) {
  if (!ts) return "—";
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString();
  } catch {
    return "—";
  }
}
