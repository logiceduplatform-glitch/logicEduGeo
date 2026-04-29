import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import { LanguageContext } from "../../i18n/LanguageContext";
import { AdminService } from "../../services/AdminService";

const T = {
  el: {
    title: "🔒 Πρόσβαση μόνο για διαχειριστές",
    subtitle: "Δεν έχεις δικαιώματα admin για αυτή τη σελίδα.",
    home: "← Επιστροφή στην αρχική",
    checking: "Έλεγχος δικαιωμάτων...",
    youAre: "Είσαι συνδεδεμένος ως",
  },
  en: {
    title: "🔒 Admin access required",
    subtitle: "You do not have admin permissions for this page.",
    home: "← Back home",
    checking: "Checking permissions...",
    youAre: "You are signed in as",
  },
};

export default function AdminGate({ children }) {
  const { user } = useContext(AuthContext) || {};
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const [state, setState] = useState("checking"); // checking | allowed | denied

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) {
        setState("denied");
        return;
      }
      const ok = await AdminService.isAdmin(user);
      if (!cancelled) setState(ok ? "allowed" : "denied");
    })();
    return () => { cancelled = true; };
  }, [user]);

  if (state === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-spin">⏳</div>
          <p className="text-slate-600 dark:text-slate-300 font-semibold">{l.checking}</p>
        </div>
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 px-4">
        <div className="max-w-md text-center bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-100 dark:border-slate-700">
          <div className="text-7xl mb-4">🔒</div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">{l.title}</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">{l.subtitle}</p>
          {user?.email && (
            <p className="text-xs text-slate-500 mb-4">{l.youAre}: <span className="font-mono font-bold">{user.email}</span></p>
          )}
          <Link to="/" className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">{l.home}</Link>
        </div>
      </div>
    );
  }

  return children;
}
