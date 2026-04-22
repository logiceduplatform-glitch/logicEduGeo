import React from "react";
import { LanguageContext } from "../../i18n/LanguageContext";
import DifficultyBadge from "../DifficultyBadge";

export default function GameCard({ game, onPlay, difficulty }) {
  const { lang } = React.useContext(LanguageContext);

  return (
    <div
      className="relative group bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/40 overflow-hidden transform hover:-translate-y-2 transition-all duration-300 border-4 border-transparent hover:shadow-2xl"
    >
      <div
        className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${game.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
      />
      <div className="relative p-6 flex flex-col h-full">
        <div className="flex-shrink-0 mb-4 flex items-start justify-between">
          <div className="text-6xl">{game.icon}</div>
          {difficulty != null && <DifficultyBadge level={difficulty} lang={lang} />}
        </div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          {game.title[lang]}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 flex-grow">
          {game.description[lang]}
        </p>
        <button
          onClick={() => onPlay(game.id)}
          className={`w-full mt-auto text-white font-bold py-3 px-4 rounded-lg bg-gradient-to-r ${game.color} shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300`}
        >
          {lang === "el" ? "Παίξε Τώρα" : "Play Now"}
        </button>
      </div>
    </div>
  );
}
