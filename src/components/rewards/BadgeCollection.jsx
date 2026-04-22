import React from "react";
import { ACHIEVEMENTS } from "../../config/achievements";

export default function BadgeCollection({ unlockedIds = [], lang = "el" }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {ACHIEVEMENTS.map((a) => {
        const isUnlocked = unlockedIds.includes(a.id);
        return (
          <div
            key={a.id}
            className={`relative rounded-2xl p-4 text-center transition-all duration-300 ${
              isUnlocked
                ? "bg-white shadow-lg border-2 border-purple-200 hover:shadow-xl hover:scale-105"
                : "bg-slate-50 border border-slate-200 opacity-50 grayscale"
            }`}
          >
            <div className={`text-4xl mb-2 ${isUnlocked ? "" : "opacity-30"}`}>
              {isUnlocked ? a.icon : "🔒"}
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              {a.title[lang]}
            </h3>
            <p className="text-xs text-slate-500">
              {a.description[lang]}
            </p>
            {isUnlocked && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
