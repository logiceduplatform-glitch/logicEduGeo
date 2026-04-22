import React, { useContext } from "react";
import { LanguageContext } from "../../../../i18n/LanguageContext";

export default function GameOverModal({ winner, playerNames, stats, onPlayAgain, onChangeGame }) {
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";

  const isDraw = winner === "draw";
  const emoji = isDraw ? "🤝" : winner === 1 ? "🏆" : "🤖";
  const title = isDraw
    ? (isEl ? "Ισοπαλία!" : "It's a draw!")
    : (isEl ? `${playerNames?.[winner] || (winner === 1 ? "Παίκτης 1" : "Παίκτης 2")} κερδίζει!` : `${playerNames?.[winner] || (winner === 1 ? "Player 1" : "Player 2")} wins!`);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl shadow-2xl shadow-black/50 text-center max-w-sm w-full p-8 border border-white/10 animate-[fadeIn_0.3s_ease-out]">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/10 blur-2xl" />
          </div>
          <div className="relative text-7xl mb-4 drop-shadow-lg">{emoji}</div>
        </div>
        <h2 className="text-2xl font-extrabold text-white mb-1 tracking-tight">{title}</h2>
        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-violet-400 to-transparent mx-auto mb-4" />

        {stats && (
          <div className="grid grid-cols-2 gap-2.5 my-5">
            {Object.entries(stats).map(([key, val]) => (
              <div key={key} className="p-3 rounded-xl bg-white/5 border border-white/5 text-center backdrop-blur-sm">
                <span className="text-lg font-extrabold text-white block">{val}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">{key}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          {onChangeGame && (
            <button
              onClick={onChangeGame}
              className="flex-1 px-5 py-3 rounded-xl border border-white/10 text-slate-300 font-semibold hover:bg-white/5 hover:text-white transition-all"
            >
              {isEl ? "Αλλαγή" : "Change"}
            </button>
          )}
          <button
            onClick={onPlayAgain}
            className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-900/50 transition-all active:scale-95"
          >
            {isEl ? "Ξανά" : "Again"}
          </button>
        </div>
      </div>
    </div>
  );
}
