import React from "react";

const STREAK_MILESTONES = [
  { days: 3,  icon: "🔥", reward: { el: "3 μέρες σερί!", en: "3 day streak!" } },
  { days: 7,  icon: "🌟", reward: { el: "1 εβδομάδα σερί!", en: "1 week streak!" } },
  { days: 14, icon: "💪", reward: { el: "2 εβδομάδες σερί!", en: "2 week streak!" } },
  { days: 30, icon: "👑", reward: { el: "1 μήνας σερί!", en: "1 month streak!" } },
  { days: 60, icon: "💎", reward: { el: "2 μήνες σερί!", en: "2 month streak!" } },
  { days: 100, icon: "🏆", reward: { el: "100 μέρες σερί!", en: "100 day streak!" } },
];

const DAY_LABELS = {
  el: ["Δε", "Τρ", "Τε", "Πέ", "Πα", "Σά", "Κυ"],
  en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
};

export default function StreakCalendar({ streak, dailyStats, lang = "el" }) {
  const isEl = lang === "el";
  const { current, best } = streak || { current: 0, best: 0 };

  const today = new Date();
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const stat = dailyStats?.find((s) => s.date === ds);
    const played = stat?.gamesPlayed > 0;
    const isToday = i === 0;
    const dayOfWeek = d.getDay() === 0 ? 6 : d.getDay() - 1;
    days.push({ ds, played, isToday, dayLabel: DAY_LABELS[isEl ? "el" : "en"][dayOfWeek], dayNum: d.getDate() });
  }

  const nextMilestone = STREAK_MILESTONES.find((m) => m.days > current);
  const lastReached = [...STREAK_MILESTONES].reverse().find((m) => m.days <= current);
  const progressToNext = nextMilestone
    ? Math.min(1, current / nextMilestone.days)
    : 1;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-5">
      {/* Streak header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-2xl shadow-md">
            🔥
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-white">
              {current} <span className="text-sm font-medium text-slate-400 dark:text-slate-500">{isEl ? "μέρες" : "days"}</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEl ? "Καλύτερο:" : "Best:"} {best} {isEl ? "μέρες" : "days"}
            </p>
          </div>
        </div>
        {lastReached && (
          <div className="text-right">
            <span className="text-2xl">{lastReached.icon}</span>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
              {lastReached.reward[isEl ? "el" : "en"]}
            </p>
          </div>
        )}
      </div>

      {/* 14-day calendar strip */}
      <div className="grid grid-cols-7 gap-1.5 mb-4">
        {days.map(({ ds, played, isToday, dayLabel, dayNum }) => (
          <div key={ds} className="text-center">
            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium mb-1">{dayLabel}</p>
            <div
              className={[
                "w-8 h-8 mx-auto rounded-lg flex items-center justify-center text-xs font-bold transition-all",
                played
                  ? "bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-sm"
                  : isToday
                    ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 ring-2 ring-orange-300 dark:ring-orange-600"
                    : "bg-slate-50 dark:bg-slate-700/50 text-slate-300 dark:text-slate-600",
              ].join(" ")}
              title={`${ds}: ${played ? "✓" : "—"}`}
            >
              {played ? "🔥" : dayNum}
            </div>
          </div>
        ))}
      </div>

      {/* Progress to next milestone */}
      {nextMilestone && (
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              {isEl ? "Επόμενο:" : "Next:"} {nextMilestone.icon} {nextMilestone.reward[isEl ? "el" : "en"]}
            </span>
            <span className="text-slate-400 dark:text-slate-500 font-semibold">
              {current}/{nextMilestone.days}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-500"
              style={{ width: `${progressToNext * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Milestone badges */}
      <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
        {STREAK_MILESTONES.map((m) => {
          const reached = current >= m.days;
          return (
            <div
              key={m.days}
              className={`flex flex-col items-center gap-0.5 ${reached ? "" : "opacity-30 grayscale"}`}
              title={m.reward[isEl ? "el" : "en"]}
            >
              <span className="text-lg">{m.icon}</span>
              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">{m.days}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
