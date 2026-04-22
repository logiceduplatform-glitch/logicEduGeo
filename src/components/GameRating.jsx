import React, { useState, useContext } from "react";
import { LanguageContext } from "../i18n/LanguageContext";

export default function GameRating({ gameId, onRate }) {
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";

  const [rating, setRating] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("geo:ratings") || "{}");
      return saved[gameId] || null;
    } catch { return null; }
  });

  const handleRate = (value) => {
    setRating(value);
    try {
      const saved = JSON.parse(localStorage.getItem("geo:ratings") || "{}");
      saved[gameId] = value;
      localStorage.setItem("geo:ratings", JSON.stringify(saved));
    } catch {}
    onRate?.(value);
  };

  if (rating !== null) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className={rating === "up" ? "text-emerald-500" : "text-red-500"}>
          {rating === "up" ? "👍" : "👎"}
        </span>
        <span className="text-slate-500 dark:text-slate-400">
          {isEl ? "Ευχαριστούμε!" : "Thanks!"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
        {isEl ? "Σου άρεσε;" : "Did you like it?"}
      </span>
      <div className="flex gap-1.5">
        <button
          onClick={() => handleRate("up")}
          className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 flex items-center justify-center text-lg transition-all hover:scale-110"
          aria-label={isEl ? "Μου άρεσε" : "Liked it"}
        >
          👍
        </button>
        <button
          onClick={() => handleRate("down")}
          className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 flex items-center justify-center text-lg transition-all hover:scale-110"
          aria-label={isEl ? "Δεν μου άρεσε" : "Didn't like it"}
        >
          👎
        </button>
      </div>
    </div>
  );
}
