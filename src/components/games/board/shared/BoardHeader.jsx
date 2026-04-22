import React, { useContext } from "react";
import { LanguageContext } from "../../../../i18n/LanguageContext";

export default function BoardHeader({ title, turn, playerNames, scores, status }) {
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";

  return (
    <div className="relative px-5 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-white/5 rounded-t-2xl overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15),transparent_70%)]" />
      <div className="relative flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-base font-extrabold text-white tracking-wide drop-shadow-sm">{title}</h3>

        <div className="flex items-center gap-2.5">
          {scores && (
            <div className="flex items-center gap-0 rounded-full bg-white/10 backdrop-blur-sm px-1 py-0.5 border border-white/10">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300">
                {playerNames?.[1] || (isEl ? "Π1" : "P1")} {scores[1] ?? 0}
              </span>
              <span className="text-white/20 text-[10px] mx-0.5">vs</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300">
                {playerNames?.[2] || (isEl ? "Π2" : "P2")} {scores[2] ?? 0}
              </span>
            </div>
          )}

          {status && (
            <span className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-400/20 backdrop-blur-sm">
              {status}
            </span>
          )}

          {turn && !status && (
            <span className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/20 backdrop-blur-sm animate-pulse">
              {isEl ? "Σειρά:" : "Turn:"} {playerNames?.[turn] || (turn === 1 ? (isEl ? "Παίκτης 1" : "Player 1") : (isEl ? "Παίκτης 2" : "Player 2"))}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
