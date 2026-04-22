import React, { useState, useEffect } from "react";
import { useQuizProgress } from "../../hooks/useQuizProgress";

export default function FunDragDropAnimals({ title, lang = "en", data = [], onNext }) {
  const [shuffledItems, setShuffledItems] = useState([]);
  const [placedItems, setPlacedItems] = useState({});
  const [poppedItem, setPoppedItem] = useState(null);
  const [score, setScore] = useState(0);

  const { updateProgress, completeQuiz } = useQuizProgress();

  const successSound = new Audio("/sounds/pop.mp3");

  const displayTitle = typeof title === "string" ? title : (title?.[lang] || title?.en || "Quiz");

  useEffect(() => {
    setShuffledItems([...data].sort(() => Math.random() - 0.5));
    setPlacedItems({});
    setScore(0);
  }, [data]);

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    const dragged = shuffledItems.find((i) => i.id === draggedId);
    const target = shuffledItems.find((i) => i.id === targetId);
    if (!dragged || !target) return;

    const correct = dragged.to[lang] === target.to[lang];

    if (correct && !placedItems[draggedId]) {
      setPlacedItems((prev) => ({ ...prev, [draggedId]: true }));

      setScore((prev) => {
        const newScore = prev + 1;
        const currentIndex = Object.keys(placedItems).length + 1;
        updateProgress({
          title: displayTitle,
          score: newScore,
          total: shuffledItems.length,
          index: currentIndex
        });
        return newScore;
      });

      setPoppedItem(draggedId);
      successSound.play().catch(() => {});
      setTimeout(() => setPoppedItem(null), 500);
    }
  };

  const allPlaced = shuffledItems.every((item) => placedItems[item.id]);

  useEffect(() => {
    if (allPlaced && shuffledItems.length > 0) {
      completeQuiz({
        title: displayTitle,
        score,
        total: shuffledItems.length
      });

      if (onNext) {
        onNext(score);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPlaced]);

  const progress = shuffledItems.length > 0
    ? Math.round((score / shuffledItems.length) * 100)
    : 0;

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">{displayTitle}</h2>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          {lang === "el" ? "Σκορ" : "Score"}: {score}/{shuffledItems.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded mb-4 overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Draggables */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {shuffledItems.map((item) =>
          !placedItems[item.id] ? (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              className={`text-4xl p-4 border rounded-lg text-center cursor-move select-none bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition ${
                poppedItem === item.id ? "animate-pop" : ""
              }`}
            >
              {item.from[lang]}
            </div>
          ) : null
        )}
      </div>

      {/* Drop targets */}
      <div className="grid grid-cols-3 gap-4">
        {shuffledItems.map((item) => (
          <div
            key={item.id + "-target"}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, item.id)}
            className={`text-4xl p-4 border-2 rounded-lg h-20 flex items-center justify-center transition-all duration-300 ${
              placedItems[item.id]
                ? "bg-emerald-200 dark:bg-emerald-800/50 border-emerald-500 scale-110 animate-pop"
                : "bg-slate-50 dark:bg-slate-900/50 border-dashed border-slate-300 dark:border-slate-600 opacity-60"
            }`}
          >
            {placedItems[item.id] ? item.to[lang] : (
              <span className="opacity-30">{item.to[lang]}</span>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pop { 0% { transform: scale(1); } 50% { transform: scale(1.4); } 100% { transform: scale(1); } }
        .animate-pop { animation: pop 0.5s ease-out; }
      `}</style>
    </div>
  );
}
