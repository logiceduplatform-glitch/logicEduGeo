import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";
import { VoiceService } from "../../../services/VoiceService";

export default function WhatRemainsGame({ lang = "el", onComplete, difficulty = 3 }) {
  const { safeTimeout } = useSafeTimeout();
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const d = Math.max(1, Math.min(5, difficulty));
  const WRONG_DELAY = [2000, 1800, 1500, 1200, 1000][d - 1];
  const NEXT_DELAY = [3000, 2800, 2500, 2200, 2000][d - 1];
  const TARGET_ROUNDS = 10;

  const problemsData = {
    el: [
      { id: 1, expression: "45 + 28 = ?", answer: 73, options: [71, 73, 75], color: "#EF4444" },
      { id: 2, expression: "120 - 37 = ?", answer: 83, options: [77, 83, 87], color: "#10B981" },
      { id: 3, expression: "15 × 6 = ?", answer: 90, options: [75, 85, 90], color: "#3B82F6" },
      { id: 4, expression: "144 ÷ 12 = ?", answer: 12, options: [11, 12, 14], color: "#EAB308" },
      { id: 5, expression: "3/4 + 1/4 = ?", answer: "1", options: ["1/2", "1", "3/4"], color: "#EC4899" },
      { id: 6, expression: "250 - 175 = ?", answer: 75, options: [65, 75, 85], color: "#8B5CF6" },
      { id: 7, expression: "17 × 8 = ?", answer: 136, options: [126, 136, 146], color: "#F59E0B" },
      { id: 8, expression: "1000 ÷ 25 = ?", answer: 40, options: [35, 40, 45], color: "#14B8A6" },
      { id: 9, expression: "2/3 + 1/6 = ?", answer: "5/6", options: ["1/2", "5/6", "3/6"], color: "#06B6D4" },
      { id: 10, expression: "(-8) + 15 = ?", answer: 7, options: [7, -7, 23], color: "#A855F7" },
    ],
    en: [
      { id: 1, expression: "45 + 28 = ?", answer: 73, options: [71, 73, 75], color: "#EF4444" },
      { id: 2, expression: "120 - 37 = ?", answer: 83, options: [77, 83, 87], color: "#10B981" },
      { id: 3, expression: "15 × 6 = ?", answer: 90, options: [75, 85, 90], color: "#3B82F6" },
      { id: 4, expression: "144 ÷ 12 = ?", answer: 12, options: [11, 12, 14], color: "#EAB308" },
      { id: 5, expression: "3/4 + 1/4 = ?", answer: "1", options: ["1/2", "1", "3/4"], color: "#EC4899" },
      { id: 6, expression: "250 - 175 = ?", answer: 75, options: [65, 75, 85], color: "#8B5CF6" },
      { id: 7, expression: "17 × 8 = ?", answer: 136, options: [126, 136, 146], color: "#F59E0B" },
      { id: 8, expression: "1000 ÷ 25 = ?", answer: 40, options: [35, 40, 45], color: "#14B8A6" },
      { id: 9, expression: "2/3 + 1/6 = ?", answer: "5/6", options: ["1/2", "5/6", "3/6"], color: "#06B6D4" },
      { id: 10, expression: "(-8) + 15 = ?", answer: 7, options: [7, -7, 23], color: "#A855F7" },
    ]
  };

  const problems = problemsData[lang];
  const round = problems[currentRound];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🔢", "✅"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);
    safeTimeout(() => setCelebrationEmojis([]), 2000);
  };

  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = lang === 'el' ? `Λύσε: ${round.expression}` : `Solve: ${round.expression}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'el' ? 'el-GR' : 'en-US';
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      const voice = VoiceService.getVoice(lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const timer = safeTimeout(() => speakQuestion(), 500);
    return () => clearTimeout(timer);
  }, [currentRound]);

  const handleAnswerSelect = (answer) => {
    if (showAnswer) return;
    setSelectedAnswer(answer);
    setShowAnswer(true);

    const answerStr = String(answer);
    const correctStr = String(round.answer);
    const isCorrect = answerStr === correctStr;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});
      const newScore = score + 1;
      setScore(newScore);
      setScorePopup({ id: Date.now(), x: 50 });
      safeTimeout(() => setScorePopup(null), 1000);

      updateProgress({ title: "What Remains Game", score: newScore, total: TARGET_ROUNDS, index: currentRound + 1 });
      completeQuiz({ title: "What Remains Game", score: 1, total: 1 });

      safeTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
          setSelectedAnswer(null);
          setShowAnswer(false);
        } else {
          createCelebrationEmojis();
          setShowCelebration(true);
          safeTimeout(() => { if (onComplete) onComplete({ score: newScore, total: TARGET_ROUNDS }); }, NEXT_DELAY);
        }
      }, NEXT_DELAY);
    } else {
      wrongSoundRef.current?.play().catch(() => {});
      safeTimeout(() => { setSelectedAnswer(null); setShowAnswer(false); }, WRONG_DELAY);
    }
  };

  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 p-4 sm:p-8 rounded-xl overflow-hidden">
      {celebrationEmojis.map((item) => (
        <div key={item.id} className="absolute text-4xl animate-float-up pointer-events-none z-20" style={{ left: `${item.x}%`, top: "50%", animationDelay: `${item.delay}s` }}>
          {item.emoji}
        </div>
      ))}

      {scorePopup && (
        <div key={scorePopup.id} className="absolute text-4xl font-bold text-green-600 pointer-events-none z-50" style={{ left: `${scorePopup.x}%`, top: "40%", animation: "float-up 1s ease-out forwards" }}>
          +1 ⭐
        </div>
      )}

      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Μαθηματικές Πράξεις" : "Math Operations"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el" ? `Πράξη ${currentRound + 1}/${TARGET_ROUNDS}` : `Problem ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-teal-600">🧮 {score}</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="text-sm font-semibold text-slate-600">{progressPercent}%</span>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-8 shadow-xl border-4" style={{ borderColor: round.color }}>
          <div className="text-7xl mb-4">📐</div>
          <h2 className="text-2xl font-bold mb-2 text-slate-600">
            {lang === "el" ? "Λύσε την πράξη:" : "Solve the problem:"}
          </h2>
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-xl mb-4">
            <p className="text-5xl font-bold text-slate-800 font-mono">{round.expression}</p>
          </div>
          <button onClick={speakQuestion} className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg">
            🔊 {lang === "el" ? "Άκουσε" : "Listen"}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-center gap-6">
          {round.options.map((option) => {
            const optStr = String(option);
            const ansStr = String(round.answer);
            const selStr = String(selectedAnswer);
            const isSelected = selStr === optStr;
            const isCorrect = showAnswer && optStr === ansStr;
            const isWrong = showAnswer && isSelected && optStr !== ansStr;

            return (
              <button
                key={optStr}
                onClick={() => handleAnswerSelect(option)}
                disabled={showAnswer}
                className={`
                  relative w-32 h-28 rounded-2xl border-4 transition-all duration-300 transform
                  ${isCorrect ? "bg-green-100 border-green-500 scale-110" : ""}
                  ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                  ${!showAnswer ? "bg-white border-slate-300 hover:border-teal-400 hover:scale-110 cursor-pointer shadow-lg" : "cursor-not-allowed"}
                  ${showAnswer && !isSelected && optStr !== ansStr ? "opacity-50" : ""}
                `}
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-slate-800 font-mono">{optStr}</div>
                  {isCorrect && <div className="text-5xl animate-bounce absolute -top-4 -right-4">✅</div>}
                  {isWrong && <div className="text-5xl absolute -top-4 -right-4">❌</div>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showAnswer && (
        <div className="text-center animate-fadeIn">
          {String(selectedAnswer) === String(round.answer) ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el" ? `🎉 Σωστά! ${round.expression.replace("?", String(round.answer))}` : `🎉 Correct! ${round.expression.replace("?", String(round.answer))}`}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el" ? `Η σωστή απάντηση είναι ${round.answer}` : `The correct answer is ${round.answer}`}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/80 to-teal-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">📐🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Εξαιρετικά! Κατέκτησες τα μαθηματικά!" : "Excellent! You mastered the math!"}
            </h3>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float-up { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-200px) scale(1.5); opacity: 0; } }
        .animate-float-up { animation: float-up 2s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-in; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
