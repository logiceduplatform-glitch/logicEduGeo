// src/components/quiz/MatchLettersGame.jsx
import React, { useState } from "react";

export default function MatchLettersGame() {
  const pairs = [
    { letter: "Α", image: "🍎", label: "μήλο" },
    { letter: "Β", image: "🐝", label: "μέλισσα" },
    { letter: "Γ", image: "🐈", label: "γάτα" },
  ];

  const [matches, setMatches] = useState({});
  const [completed, setCompleted] = useState(false);

  const handleDrop = (e, letter) => {
    const img = e.dataTransfer.getData("image");
    setMatches((prev) => {
      const next = { ...prev, [letter]: img };
      if (Object.keys(next).length === pairs.length) {
        const allCorrect = pairs.every((p) => next[p.letter] === p.image);
        setCompleted(allCorrect);
      }
      return next;
    });
  };

  return (
    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 text-center">
        Ταίριαξε το γράμμα με τη σωστή εικόνα
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Στήλη γραμμάτων */}
        <div className="flex flex-col gap-3">
          {pairs.map((p) => (
            <div
              key={p.letter}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, p.letter)}
              className={`flex items-center justify-center border-2 rounded-lg h-16 text-2xl font-bold transition ${
                matches[p.letter]
                  ? matches[p.letter] === p.image
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-rose-400 bg-rose-50 text-rose-700"
                  : "border-slate-300 bg-slate-50 text-slate-700"
              }`}
            >
              {p.letter}
            </div>
          ))}
        </div>

        {/* Στήλη εικόνων */}
        <div className="flex flex-col gap-3">
          {pairs.map((p) => (
            <div
              key={p.image}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("image", p.image)}
              className="flex items-center justify-center h-16 border-2 border-slate-300 rounded-lg bg-slate-50 text-3xl cursor-grab active:cursor-grabbing hover:bg-slate-100 transition"
              title={p.label}
            >
              {p.image}
            </div>
          ))}
        </div>
      </div>

      {completed && (
        <div className="mt-6 text-center text-emerald-600 font-semibold text-lg">
          🎉 Μπράβο! Ταίριαξες σωστά όλα τα γράμματα!
        </div>
      )}
    </div>
  );
}
