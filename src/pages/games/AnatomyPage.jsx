import React, { useContext, useMemo, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const PARTS = [
  { id: "head",     el: "Κεφάλι",    en: "Head",    x: 50, y: 8 },
  { id: "eye",      el: "Μάτι",      en: "Eye",     x: 47, y: 9 },
  { id: "nose",     el: "Μύτη",      en: "Nose",    x: 50, y: 11 },
  { id: "mouth",    el: "Στόμα",     en: "Mouth",   x: 50, y: 14 },
  { id: "neck",     el: "Λαιμός",    en: "Neck",    x: 50, y: 18 },
  { id: "shoulder", el: "Ώμος",      en: "Shoulder",x: 35, y: 22 },
  { id: "chest",    el: "Στήθος",    en: "Chest",   x: 50, y: 28 },
  { id: "arm",      el: "Μπράτσο",   en: "Arm",     x: 28, y: 35 },
  { id: "hand",     el: "Χέρι",      en: "Hand",    x: 22, y: 50 },
  { id: "stomach",  el: "Στομάχι",   en: "Stomach", x: 50, y: 42 },
  { id: "leg",      el: "Πόδι",      en: "Leg",     x: 42, y: 70 },
  { id: "knee",     el: "Γόνατο",    en: "Knee",    x: 42, y: 80 },
  { id: "foot",     el: "Πατούσα",   en: "Foot",    x: 42, y: 95 },
];

export default function AnatomyPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const order = useMemo(() => PARTS.slice().sort(() => Math.random() - 0.5), []);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const target = order[idx];
  const done = idx >= order.length;

  const choose = (id) => {
    if (id === target.id) { setScore((s) => s + 1); setIdx((i) => i + 1); }
    else setWrong((w) => w + 1);
  };

  return (
    <GameShell title={isEl ? "Μέρη του Σώματος" : "Body Parts"} description={isEl ? "Πάτα το σωστό μέρος" : "Tap the right part"} emoji="🫀" canonical="/games/anatomy" back="/games">
      <div className="text-center">
        <div className="flex justify-center gap-3 text-sm mb-2">
          <span>✅ <b>{score}</b></span>
          <span>❌ <b>{wrong}</b></span>
          <span>🧠 {idx + 1}/{order.length}</span>
        </div>
        {!done && (
          <div className="text-xl font-bold mb-3">
            {isEl ? "Βρες:" : "Find:"} <span className="text-pink-600">{isEl ? target.el : target.en}</span>
          </div>
        )}
        {done && (
          <div className="text-2xl font-extrabold text-emerald-600 mb-4">
            🎉 {isEl ? "Τέλος! Σκορ:" : "Done! Score:"} {score}/{order.length}
          </div>
        )}
        <div className="relative bg-pink-50 dark:bg-pink-900/20 rounded-xl mx-auto" style={{ width: 220, height: 380 }}>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[140px]">🧍</div>
          {PARTS.map((p) => (
            <button
              key={p.id}
              onClick={() => choose(p.id)}
              disabled={done}
              title={isEl ? p.el : p.en}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-pink-500/70 hover:bg-pink-600 active:scale-90 border-2 border-white"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            />
          ))}
        </div>
      </div>
    </GameShell>
  );
}
