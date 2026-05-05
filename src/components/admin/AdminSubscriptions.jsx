import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../../i18n/LanguageContext";
import { AdminService } from "../../services/AdminService";

const T = {
  el: {
    title: "💎 Subscriptions",
    premiumUsers: "Premium Χρήστες",
    refresh: "🔄 Ανανέωση",
    none: "Δεν υπάρχουν premium χρήστες",
    expires: "Λήγει",
    grantedAt: "Δόθηκε",
    revoke: "↩️ Αφαίρεση",
    quickGrant: "Γρήγορη παροχή Premium",
    quickGrantDesc: "Ψάξε χρήστη στο tab Χρήστες και δώσε premium 30 ημερών.",
    confirmRevoke: "Επιβεβαίωση αφαίρεσης premium;",
    expired: "Έληξε",
    daysLeft: "{n} μέρες",
  },
  en: {
    title: "💎 Subscriptions",
    premiumUsers: "Premium users",
    refresh: "🔄 Refresh",
    none: "No premium users",
    expires: "Expires",
    grantedAt: "Granted",
    revoke: "↩️ Revoke",
    quickGrant: "Quick Premium Grant",
    quickGrantDesc: "Search a user in Users tab and grant 30-day premium.",
    confirmRevoke: "Confirm revoke premium?",
    expired: "Expired",
    daysLeft: "{n} days",
  },
};

export default function AdminSubscriptions() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const all = await AdminService.listUsers({ limit: 500 });
    setUsers(all.filter((u) => u.premium));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const revoke = async (uid) => {
    if (!window.confirm(l.confirmRevoke)) return;
    await AdminService.revokePremium(uid);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{l.title}</h2>
        <button onClick={load} className="text-sm font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50">{l.refresh}</button>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-4"><strong>{l.quickGrant}:</strong> {l.quickGrantDesc}</p>

      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <header className="px-5 py-3 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">{l.premiumUsers} ({users.length})</h3>
        </header>
        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">...</div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">{l.none}</div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            {users.map((u) => {
              const exp = u.premiumExpiresAt;
              const days = exp ? Math.max(0, Math.round((exp - Date.now()) / (24 * 3600 * 1000))) : null;
              const expired = exp && exp < Date.now();
              return (
                <li key={u.id} className="px-5 py-3 flex items-center gap-3 flex-wrap">
                  {u.photoURL ? (
                    <img src={u.photoURL} alt="" loading="lazy" decoding="async" className="w-9 h-9 rounded-full" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold">{(u.displayName || u.email || "?")[0]?.toUpperCase()}</div>
                  )}
                  <div className="flex-1 min-w-[200px]">
                    <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{u.displayName || u.email}</p>
                    <p className="text-xs text-slate-500 truncate font-mono">{u.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400">💎 Premium</p>
                    {days !== null && (
                      <p className={`text-xs ${expired ? "text-rose-500" : "text-slate-500"}`}>
                        {l.expires}: {expired ? l.expired : l.daysLeft.replace("{n}", days)}
                      </p>
                    )}
                  </div>
                  <button onClick={() => revoke(u.id)} className="text-[11px] font-bold px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300">
                    {l.revoke}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
