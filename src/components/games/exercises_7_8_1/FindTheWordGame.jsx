import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";
import { VoiceService } from "../../../services/VoiceService";

const ROUNDS_DATA = {
  el: [
    { image: "🐱", correct: "Γάτα", options: ["Γάτα", "Σκύλος", "Ψάρι", "Πουλί"] },
    { image: "🌳", correct: "Δέντρο", options: ["Λουλούδι", "Δέντρο", "Βουνό", "Σπίτι"] },
    { image: "☀️", correct: "Ήλιος", options: ["Φεγγάρι", "Αστέρι", "Ήλιος", "Σύννεφο"] },
    { image: "📖", correct: "Βιβλίο", options: ["Τετράδιο", "Βιβλίο", "Εφημερίδα", "Γράμμα"] },
    { image: "🚗", correct: "Αυτοκίνητο", options: ["Αυτοκίνητο", "Ποδήλατο", "Λεωφορείο", "Τρένο"] },
    { image: "🏠", correct: "Σπίτι", options: ["Σχολείο", "Σπίτι", "Κάστρο", "Εκκλησία"] },
    { image: "🌊", correct: "Θάλασσα", options: ["Ποτάμι", "Λίμνη", "Θάλασσα", "Βροχή"] },
    { image: "🐶", correct: "Σκύλος", options: ["Γάτα", "Λύκος", "Σκύλος", "Αρκούδα"] },
    { image: "🌺", correct: "Λουλούδι", options: ["Δέντρο", "Λουλούδι", "Φύλλο", "Χόρτο"] },
    { image: "🎒", correct: "Τσάντα", options: ["Καπέλο", "Τσάντα", "Παπούτσι", "Ρολόι"] },
    { image: "🍎", correct: "Μήλο", options: ["Πορτοκάλι", "Μπανάνα", "Μήλο", "Αχλάδι"] },
    { image: "✈️", correct: "Αεροπλάνο", options: ["Αεροπλάνο", "Ελικόπτερο", "Πύραυλος", "Πλοίο"] },
    { image: "⭐", correct: "Αστέρι", options: ["Ήλιος", "Φεγγάρι", "Αστέρι", "Κομήτης"] },
    { image: "🐟", correct: "Ψάρι", options: ["Δελφίνι", "Ψάρι", "Φάλαινα", "Χταπόδι"] },
    { image: "🎵", correct: "Μουσική", options: ["Θόρυβος", "Μουσική", "Φωνή", "Ήχος"] },
  ],
  en: [
    { image: "🐱", correct: "Cat", options: ["Cat", "Dog", "Fish", "Bird"] },
    { image: "🌳", correct: "Tree", options: ["Flower", "Tree", "Mountain", "House"] },
    { image: "☀️", correct: "Sun", options: ["Moon", "Star", "Sun", "Cloud"] },
    { image: "📖", correct: "Book", options: ["Notebook", "Book", "Paper", "Letter"] },
    { image: "🚗", correct: "Car", options: ["Car", "Bicycle", "Bus", "Train"] },
    { image: "🏠", correct: "House", options: ["School", "House", "Castle", "Church"] },
    { image: "🌊", correct: "Sea", options: ["River", "Lake", "Sea", "Rain"] },
    { image: "🐶", correct: "Dog", options: ["Cat", "Wolf", "Dog", "Bear"] },
    { image: "🌺", correct: "Flower", options: ["Tree", "Flower", "Leaf", "Grass"] },
    { image: "🎒", correct: "Bag", options: ["Hat", "Bag", "Shoe", "Watch"] },
    { image: "🍎", correct: "Apple", options: ["Orange", "Banana", "Apple", "Pear"] },
    { image: "✈️", correct: "Airplane", options: ["Airplane", "Helicopter", "Rocket", "Ship"] },
    { image: "⭐", correct: "Star", options: ["Sun", "Moon", "Star", "Comet"] },
    { image: "🐟", correct: "Fish", options: ["Dolphin", "Fish", "Whale", "Octopus"] },
    { image: "🎵", correct: "Music", options: ["Noise", "Music", "Voice", "Sound"] },
  ],
};

export default function FindTheWordGame({ lang = "el", onComplete, difficulty = 3 }) {
  const { safeTimeout } = useSafeTimeout();
  const isEl = lang === "el";
  const rounds = ROUNDS_DATA[isEl ? "el" : "en"];

  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const correctRef = useRef(null);
  const wrongRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const d = Math.max(1, Math.min(5, difficulty));
  const NEXT_DELAY = [3000, 2800, 2500, 2200, 2000][d - 1];
  const TARGET_ROUNDS = rounds.length;
  const current = rounds[round];

  useEffect(() => {
    correctRef.current = new Audio("/sounds/correct.mp3");
    wrongRef.current = new Audio("/sounds/wrong.mp3");
  }, []);

  useEffect(() => {
    const text = isEl ? `Τι δείχνει αυτή η εικόνα;` : `What does this picture show?`;
    VoiceService.speak(text, lang);
  }, [round]);

  const handleAnswer = (opt) => {
    if (showResult) return;
    const correct = opt === current.correct;
    setSelected(opt);
    setShowResult(true);

    if (correct) {
      correctRef.current?.play();
      setScore(prev => prev + 1);
      VoiceService.speak(isEl ? `Σωστά! ${current.correct}` : `Correct! ${current.correct}`, lang);
    } else {
      wrongRef.current?.play();
    }

    updateProgress({ title: "findTheWordGame", score: score + (correct ? 1 : 0), total: TARGET_ROUNDS, index: round + 1 });

    safeTimeout(() => {
      if (round + 1 >= TARGET_ROUNDS) {
        setShowCelebration(true);
        const final = score + (correct ? 1 : 0);
        completeQuiz({ title: "findTheWordGame", score: final, total: TARGET_ROUNDS });
        safeTimeout(() => onComplete?.({ score: final, total: TARGET_ROUNDS }), 2500);
      } else {
        setRound(prev => prev + 1);
        setSelected(null);
        setShowResult(false);
      }
    }, NEXT_DELAY);
  };

  if (showCelebration) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 animate-[fadeIn_0.5s]">
        <span className="text-7xl">📚</span>
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          {isEl ? "Μπράβο!" : "Well done!"}
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {isEl ? `Σκόρ: ${score}/${TARGET_ROUNDS}` : `Score: ${score}/${TARGET_ROUNDS}`}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
            {isEl ? "Βρες τη Λέξη" : "Find the Word"} 🔤
          </span>
          <span className="text-sm font-bold text-slate-500">{round + 1}/{TARGET_ROUNDS}</span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all" style={{ width: `${((round + 1) / TARGET_ROUNDS) * 100}%` }} />
        </div>

        {/* Image */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 text-center mb-4">
          <span className="text-8xl block mb-3">{current.image}</span>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isEl ? "Τι δείχνει αυτή η εικόνα;" : "What does this picture show?"}
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          {current.options.map(opt => {
            const isCorrect = opt === current.correct;
            const isSel = selected === opt;
            return (
              <button key={opt} onClick={() => handleAnswer(opt)}
                disabled={showResult}
                className={[
                  "px-4 py-4 rounded-xl text-base font-bold transition-all border-2",
                  showResult && isCorrect ? "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400 text-emerald-700 dark:text-emerald-300 scale-105"
                    : showResult && isSel && !isCorrect ? "bg-red-100 dark:bg-red-900/40 border-red-400 text-red-700 dark:text-red-300"
                    : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-blue-400 hover:shadow-md",
                ].join(" ")}>
                {opt}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center mt-4 text-sm font-semibold">
          <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700">⭐ {score}</span>
        </div>
      </div>

      <style>{`@keyframes fadeIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }`}</style>
    </div>
  );
}
