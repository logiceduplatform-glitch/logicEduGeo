import React, { useContext, useMemo, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const REGIONS = [
  { id: "attica",      el: "Αττική",            en: "Attica",            x: 52, y: 60 },
  { id: "central",     el: "Στερεά Ελλάδα",     en: "Central Greece",    x: 48, y: 55 },
  { id: "peloponnese", el: "Πελοπόννησος",      en: "Peloponnese",       x: 42, y: 70 },
  { id: "thessaly",    el: "Θεσσαλία",          en: "Thessaly",          x: 47, y: 42 },
  { id: "epirus",      el: "Ήπειρος",           en: "Epirus",            x: 35, y: 38 },
  { id: "macedonia",   el: "Μακεδονία",         en: "Macedonia",         x: 52, y: 25 },
  { id: "thrace",      el: "Θράκη",             en: "Thrace",            x: 70, y: 22 },
  { id: "crete",       el: "Κρήτη",             en: "Crete",             x: 55, y: 92 },
  { id: "aegean-n",    el: "Β. Αιγαίο",         en: "North Aegean",      x: 78, y: 45 },
  { id: "aegean-s",    el: "Ν. Αιγαίο",         en: "South Aegean",      x: 75, y: 75 },
  { id: "ionian",      el: "Ιόνιοι Νήσοι",      en: "Ionian Islands",    x: 25, y: 55 },
];

export default function MapOfGreecePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [order] = useState(() => REGIONS.slice().sort(() => Math.random() - 0.5));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const target = order[idx];

  const choose = (id) => {
    if (!target) return;
    if (id === target.id) {
      setScore((s) => s + 1);
      setIdx((i) => i + 1);
    } else {
      setWrong((w) => w + 1);
    }
  };

  const done = idx >= order.length;

  return (
    <GameShell title={isEl ? "Χάρτης Ελλάδας" : "Map of Greece"} description={isEl ? "Πάτα τη σωστή περιφέρεια" : "Tap the correct region"} emoji="🇬🇷" canonical="/games/map-greece" back="/games">
      <div className="text-center">
        <div className="flex justify-center gap-3 text-sm mb-3">
          <span>✅ <b>{score}</b></span>
          <span>❌ <b>{wrong}</b></span>
          <span>📍 {idx + 1}/{order.length}</span>
        </div>
        {!done && (
          <div className="text-xl font-bold mb-3">
            {isEl ? "Βρες:" : "Find:"} <span className="text-blue-600">{isEl ? target.el : target.en}</span>
          </div>
        )}
        {done && (
          <div className="text-2xl font-extrabold text-emerald-600 mb-4">
            🎉 {isEl ? "Τέλος! Σκορ:" : "Done! Score:"} {score}/{order.length}
          </div>
        )}
        <div className="relative bg-blue-100 dark:bg-blue-900/30 rounded-xl mx-auto" style={{ width: 320, height: 360 }}>
          {REGIONS.map((r) => {
            const isHit = r.id === target?.id;
            return (
              <button
                key={r.id}
                onClick={() => choose(r.id)}
                disabled={done}
                title={isEl ? r.el : r.en}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-amber-400 hover:bg-amber-500 active:scale-90 border-2 border-white shadow text-xs font-bold"
                style={{ left: `${r.x}%`, top: `${r.y}%` }}
              >
                {done && (isEl ? r.el.split(" ")[0] : r.en.split(" ")[0]).slice(0, 3)}
                {!done && isHit && "?"}
              </button>
            );
          })}
        </div>
        {done && (
          <button onClick={() => window.location.reload()} className="mt-4 px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg">
            {isEl ? "Ξανά" : "Play again"}
          </button>
        )}
      </div>
    </GameShell>
  );
}
