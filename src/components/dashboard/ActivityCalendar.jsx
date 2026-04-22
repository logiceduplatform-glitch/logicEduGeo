import React from "react";

export default function ActivityCalendar({ dailyStats, lang = "el" }) {
  const today = new Date();
  const cells = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const stat = dailyStats.find((s) => s.date === ds);
    const gamesPlayed = stat?.gamesPlayed || 0;

    let intensity = "bg-slate-100";
    if (gamesPlayed >= 10) intensity = "bg-emerald-600";
    else if (gamesPlayed >= 5) intensity = "bg-emerald-500";
    else if (gamesPlayed >= 3) intensity = "bg-emerald-400";
    else if (gamesPlayed >= 1) intensity = "bg-emerald-300";

    cells.push(
      <div
        key={ds}
        className={`w-5 h-5 rounded-sm ${intensity} transition-colors`}
        title={`${ds}: ${gamesPlayed} ${lang === "el" ? "παιχνίδια" : "games"}`}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1">
        {cells}
      </div>
      <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
        <span>{lang === "el" ? "Λιγότερα" : "Less"}</span>
        <div className="w-3 h-3 rounded-sm bg-slate-100" />
        <div className="w-3 h-3 rounded-sm bg-emerald-300" />
        <div className="w-3 h-3 rounded-sm bg-emerald-400" />
        <div className="w-3 h-3 rounded-sm bg-emerald-500" />
        <div className="w-3 h-3 rounded-sm bg-emerald-600" />
        <span>{lang === "el" ? "Περισσότερα" : "More"}</span>
      </div>
    </div>
  );
}
