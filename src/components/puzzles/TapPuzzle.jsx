import React, { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../../i18n/LanguageContext";
import defaultPuzzles from "./data/puzzles.json";

export default function TapPuzzle({ puzzles, lang = "el", onComplete }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState([]);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [allPuzzlesCompleted, setAllPuzzlesCompleted] = useState(false);

  const safePuzzles = puzzles && puzzles.length > 0 ? puzzles : defaultPuzzles;
  const puzzle = safePuzzles[current];

  // Get title based on language
  const getTitle = (titleObj) => {
    if (typeof titleObj === "string") return titleObj;
    return titleObj[lang] || titleObj.el || titleObj.en || "Puzzle";
  };

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🧩", "⭐", "✨", "🌟", "🎉", "🎊"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  useEffect(() => {
    setSelected([]);
    setCompleted(false);
  }, [current]);

  useEffect(() => {
    if (puzzle && selected.length === puzzle.pieces.length) {
      setCompleted(true);

      // Αν είναι το τελευταίο παζλ, δείξε celebration και μετά το modal
      if (current + 1 >= safePuzzles.length) {
        createCelebrationEmojis();
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          }
          // ΔΕΝ κάνουμε setAllPuzzlesCompleted(true) - αφήνουμε το animation ορατό
        }, 2500);
      } else {
        // Αυτόματη μετάβαση στο επόμενο παζλ μετά από 1.5 δευτερόλεπτα
        setTimeout(() => {
          setCurrent(prev => prev + 1);
          setSelected([]);
          setCompleted(false);
        }, 1500);
      }
    }
  }, [selected, puzzle, current, safePuzzles.length, onComplete]);

  function handleTap(piece) {
    if (!selected.includes(piece.id) && !completed) {
      setSelected(prev => [...prev, piece.id]);

      // Show +1 score popup
      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      // Play success sound
      const audio = new Audio("/sounds/pop.mp3");
      audio.play().catch(() => {});
    }
  }

  if (!puzzle) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-slate-800">
          {lang === "el" ? "Συγχαρητήρια!" : "Congratulations!"}
        </h2>
        <p className="text-slate-600 mt-2">
          {lang === "el"
            ? "Ολοκληρώσατε όλα τα παζλ!"
            : "You completed all puzzles!"}
        </p>
      </div>
    );
  }

  const progressPercent = Math.round((selected.length / puzzle.pieces.length) * 100);

  return (
    <div className="bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 rounded-xl shadow-lg p-8 relative overflow-hidden">
      {/* Celebration Emojis */}
      {celebrationEmojis.map((item) => (
        <div
          key={item.id}
          className="absolute text-4xl animate-float-up pointer-events-none z-20"
          style={{
            left: `${item.x}%`,
            top: "50%",
            animationDelay: `${item.delay}s`,
          }}
        >
          {item.emoji}
        </div>
      ))}

      {/* Score Popup */}
      {scorePopup && (
        <div
          key={scorePopup.id}
          className="absolute text-4xl font-bold text-green-600 pointer-events-none z-50"
          style={{
            left: `${scorePopup.x}%`,
            top: "40%",
            animation: "float-up 1s ease-out forwards",
          }}
        >
          +1 ⭐⭐
        </div>
      )}

      {/* Puzzle Counter */}
      <div className="text-center mb-4">
        <span className="inline-block px-4 py-2 bg-white/80 backdrop-blur text-emerald-700 rounded-full text-sm font-semibold shadow">
          {lang === "el" ? "Παζλ" : "Puzzle"} {current + 1}/{safePuzzles.length}
        </span>
      </div>

      {/* Enhanced Progress Bar Header */}
      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold text-slate-800">{getTitle(puzzle.title)}</h2>
          <div className="text-2xl font-bold text-emerald-600">
            🧩 {selected.length}/{puzzle.pieces.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Puzzle Grid */}
      <div className="grid grid-cols-2 gap-4">
        {puzzle.pieces.map((piece, index) => {
          const isSelected = selected.includes(piece.id);
          const selectionOrder = selected.indexOf(piece.id) + 1;

          return (
            <button
              key={piece.id}
              className={`
                relative p-8 text-5xl text-center rounded-xl border-2
                transition-all duration-300 transform
                ${isSelected
                  ? "bg-emerald-100 border-emerald-500 scale-105"
                  : "bg-white border-slate-300 hover:border-blue-400 hover:scale-105"
                }
                ${!isSelected && !completed ? "cursor-pointer" : "cursor-default"}
              `}
              onClick={() => handleTap(piece)}
              disabled={completed}
            >
              {piece.label}
              {isSelected && (
                <span className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {selectionOrder}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Celebration Overlay - Shows only when last puzzle is completed */}
      {completed && current + 1 >= safePuzzles.length && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/80 to-teal-400/80 flex items-center justify-center rounded-xl z-10 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🧩🏆</div>
            <h3 className="text-4xl font-bold text-white mb-2">
              {lang === "el" ? "Τέλεια!" : "Perfect!"}
            </h3>
            <p className="text-2xl text-white">
              {getTitle(puzzle.title)}!
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in;
        }
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-200px) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
