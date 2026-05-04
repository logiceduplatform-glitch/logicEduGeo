import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { SRSService } from "../services/SRSService";

const T = {
  el: {
    title: "🧠 Επανάληψη μνήμης",
    desc: "Παράπες ξανά τις ερωτήσεις που πρόσφατα δυσκολεύτηκες — η επιστήμη λέει ότι αυτό σταθεροποιεί τη γνώση!",
    total: "Σύνολο",
    due: "Σήμερα για επανάληψη",
    mature: "Σταθεροποιημένα",
    learning: "Σε εξέλιξη",
    maturity: "Ωριμότητα",
    review: "Επανάλαβε τώρα",
    none: "Δεν υπάρχουν κάρτες ακόμη — παίξε λίγα παιχνίδια!",
    allCaughtUp: "Είσαι ενημερωμένος! 🎉 Καμία επανάληψη σήμερα.",
  },
  en: {
    title: "🧠 Memory review",
    desc: "Replay items you recently struggled with — science says this locks knowledge in!",
    total: "Total",
    due: "Due today",
    mature: "Mature",
    learning: "Learning",
    maturity: "Maturity",
    review: "Review now",
    none: "No cards yet — play a few games!",
    allCaughtUp: "All caught up! 🎉 Nothing due today.",
  },
};

export default function SRSDashboard() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const [stats, setStats] = useState(() => SRSService.getStats());

  useEffect(() => {
    const refresh = () => setStats(SRSService.getStats());
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">{l.title}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{l.desc}</p>
        </div>
        <div className="text-3xl">🧠</div>
      </div>

      {stats.total === 0 ? (
        <div className="text-center py-6 text-sm text-slate-500">{l.none}</div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-2 mb-3">
            <div className="bg-slate-50 dark:bg-slate-900/40 rounded-lg p-2 text-center">
              <div className="text-[10px] uppercase text-slate-500">{l.total}</div>
              <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{stats.total}</div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-2 text-center">
              <div className="text-[10px] uppercase text-amber-600 dark:text-amber-400">{l.due}</div>
              <div className="text-xl font-bold text-amber-700 dark:text-amber-300">{stats.due}</div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-lg p-2 text-center">
              <div className="text-[10px] uppercase text-emerald-600 dark:text-emerald-400">{l.mature}</div>
              <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{stats.mature}</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-2 text-center">
              <div className="text-[10px] uppercase text-blue-600 dark:text-blue-400">{l.learning}</div>
              <div className="text-xl font-bold text-blue-700 dark:text-blue-300">{stats.learning}</div>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600 dark:text-slate-400">{l.maturity}</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">{stats.maturityRate || 0}%</span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                style={{ width: `${stats.maturityRate || 0}%` }}
              />
            </div>
          </div>

          {stats.due > 0 ? (
            <Link
              to="/play"
              className="block w-full text-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg hover:from-amber-600 hover:to-orange-600 active:scale-95 transition-all"
            >
              {l.review} ({stats.due})
            </Link>
          ) : (
            <div className="text-center text-sm text-emerald-700 dark:text-emerald-300 font-semibold py-2">{l.allCaughtUp}</div>
          )}
        </>
      )}
    </div>
  );
}
