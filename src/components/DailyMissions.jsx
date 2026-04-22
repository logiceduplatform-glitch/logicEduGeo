import React, { useState, useContext, useCallback } from "react";
import { LanguageContext } from "../i18n/LanguageContext";
import { MissionsService } from "../services/MissionsService";
import { CoinService } from "../services/CoinService";

export default function DailyMissions() {
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const [missions, setMissions] = useState(() => MissionsService.getMissions());
  const [claimedAnim, setClaimedAnim] = useState(null);

  const handleClaim = useCallback((id) => {
    const reward = MissionsService.claimReward(id);
    if (reward > 0) {
      CoinService.earn(reward);
      setClaimedAnim(id);
      setTimeout(() => setClaimedAnim(null), 1200);
      setMissions(MissionsService.getMissions());
    }
  }, []);

  const completedCount = missions.filter(m => m.completed).length;
  const allClaimed = missions.every(m => m.claimed || !m.completed);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {isEl ? "Ημερήσιες Αποστολές" : "Daily Missions"}
          </h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
          {completedCount}/{missions.length}
        </span>
      </div>

      <div className="space-y-3">
        {missions.map((m) => {
          const pct = Math.min((m.progress / m.target) * 100, 100);
          const title = m.title?.[lang] || m.title?.en || m.id;
          const desc = m.desc?.[lang] || m.desc?.en || "";

          return (
            <div
              key={m.id}
              className={`relative rounded-xl border p-3 sm:p-4 transition-all ${
                m.completed
                  ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/20"
                  : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0 mt-0.5" aria-hidden="true">{m.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`font-semibold text-sm ${m.completed ? "text-emerald-700 dark:text-emerald-400" : "text-slate-800 dark:text-slate-100"}`}>
                      {title}
                    </p>
                    {m.completed && !m.claimed && (
                      <button
                        onClick={() => handleClaim(m.id)}
                        className="shrink-0 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold hover:scale-105 active:scale-95 transition-transform shadow-md"
                      >
                        🪙 +{m.reward}
                      </button>
                    )}
                    {m.claimed && (
                      <span className={`text-xs font-bold text-emerald-500 ${claimedAnim === m.id ? "animate-bounce" : ""}`}>
                        {isEl ? "Εισπράχθηκε ✓" : "Claimed ✓"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${m.completed ? "bg-emerald-500" : "bg-purple-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
                      {m.progress}/{m.target}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {allClaimed && completedCount === missions.length && (
        <div className="mt-4 text-center">
          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            🌟 {isEl ? "Ολοκλήρωσες όλες τις αποστολές!" : "All missions completed!"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isEl ? "Νέες αποστολές αύριο!" : "New missions tomorrow!"}
          </p>
        </div>
      )}
    </div>
  );
}
