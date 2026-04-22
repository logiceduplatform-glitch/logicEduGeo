import React from "react";

const LEVELS = [
  { label: { el: "Αρχάριος", en: "Beginner" }, color: "from-emerald-400 to-emerald-600", text: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-900/30", border: "border-emerald-200 dark:border-emerald-800" },
  { label: { el: "Εύκολο", en: "Easy" },       color: "from-sky-400 to-sky-600",         text: "text-sky-700 dark:text-sky-300",         bg: "bg-sky-50 dark:bg-sky-900/30",         border: "border-sky-200 dark:border-sky-800" },
  { label: { el: "Μέτριο", en: "Medium" },     color: "from-amber-400 to-amber-600",     text: "text-amber-700 dark:text-amber-300",     bg: "bg-amber-50 dark:bg-amber-900/30",     border: "border-amber-200 dark:border-amber-800" },
  { label: { el: "Δύσκολο", en: "Hard" },      color: "from-orange-400 to-red-500",      text: "text-red-700 dark:text-red-300",         bg: "bg-red-50 dark:bg-red-900/30",         border: "border-red-200 dark:border-red-800" },
  { label: { el: "Ειδικός", en: "Expert" },    color: "from-purple-500 to-pink-600",     text: "text-purple-700 dark:text-purple-300",   bg: "bg-purple-50 dark:bg-purple-900/30",   border: "border-purple-200 dark:border-purple-800" },
];

export default function DifficultyBadge({ level, lang = "el", size = "sm" }) {
  const idx = Math.max(0, Math.min(4, (level || 1) - 1));
  const config = LEVELS[idx];
  const isEl = lang === "el";

  const dots = Array.from({ length: 5 }, (_, i) => i < level);

  if (size === "sm") {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold ${config.bg} ${config.border} border ${config.text}`}>
        <div className="flex gap-0.5">
          {dots.map((filled, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${filled ? `bg-gradient-to-br ${config.color}` : "bg-slate-200 dark:bg-slate-600"}`}
            />
          ))}
        </div>
        <span>{config.label[isEl ? "el" : "en"]}</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold ${config.bg} ${config.border} border ${config.text}`}>
      <div className="flex gap-1">
        {dots.map((filled, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${filled ? `bg-gradient-to-br ${config.color}` : "bg-slate-200 dark:bg-slate-600"}`}
          />
        ))}
      </div>
      <span>{config.label[isEl ? "el" : "en"]}</span>
    </div>
  );
}
