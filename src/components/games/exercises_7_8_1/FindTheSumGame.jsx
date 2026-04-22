import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function FindTheSumGame({ lang = "el", onComplete }) {
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

  const TARGET_ROUNDS = 12;

  const generateProblems = () => {
    const problems = [];
    const ops = ["+", "-", "+", "+", "-", "+", "+", "-", "+", "+", "-", "+"];
    for (let i = 0; i < TARGET_ROUNDS; i++) {
      const op = ops[i];
      let num1, num2, correctAnswer;

      if (op === "+") {
        num1 = Math.floor(Math.random() * 40) + 10;
        num2 = Math.floor(Math.random() * 30) + 5;
        correctAnswer = num1 + num2;
      } else {
        num1 = Math.floor(Math.random() * 40) + 20;
        num2 = Math.floor(Math.random() * (num1 - 5)) + 1;
        correctAnswer = num1 - num2;
      }

      const wrongAnswers = new Set();
      while (wrongAnswers.size < 2) {
        const offset = Math.floor(Math.random() * 8) - 4;
        const wrong = correctAnswer + (offset === 0 ? 1 : offset);
        if (wrong !== correctAnswer && wrong > 0) {
          wrongAnswers.add(wrong);
        }
      }

      problems.push({
        num1,
        num2,
        op,
        correctAnswer,
        options: [correctAnswer, ...Array.from(wrongAnswers)].sort(() => Math.random() - 0.5),
      });
    }
    return problems;
  };

  const [problems] = useState(generateProblems);
  const currentProblem = problems[currentRound];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    setSelectedAnswer(null);
    setShowAnswer(false);
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "💯", "➕", "🏆"][Math.floor(Math.random() * 7)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);
    setTimeout(() => setCelebrationEmojis([]), 2000);
  };

  const handleAnswerSelect = (answer) => {
    if (showAnswer) return;

    setSelectedAnswer(answer);
    setShowAnswer(true);

    const isCorrect = answer === currentProblem.correctAnswer;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});
      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Find the Sum Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      setTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound((prev) => prev + 1);
        } else {
          createCelebrationEmojis();
          setShowCelebration(true);

          completeQuiz({
            title: "Find the Sum Game",
            score: newScore,
            total: TARGET_ROUNDS,
          });

          setTimeout(() => {
            if (onComplete) onComplete();
          }, 2500);
        }
      }, 2000);
    } else {
      wrongSoundRef.current?.play().catch(() => {});
      setTimeout(() => {
        setSelectedAnswer(null);
        setShowAnswer(false);
      }, 1500);
    }
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 p-4 sm:p-8 rounded-xl overflow-hidden">
      {celebrationEmojis.map((item) => (
        <div
          key={item.id}
          className="absolute text-4xl animate-float-up pointer-events-none z-20"
          style={{ left: `${item.x}%`, top: "50%", animationDelay: `${item.delay}s` }}
        >
          {item.emoji}
        </div>
      ))}

      {scorePopup && (
        <div
          key={scorePopup.id}
          className="absolute text-4xl font-bold text-green-600 pointer-events-none z-50"
          style={{ left: `${scorePopup.x}%`, top: "40%", animation: "float-up 1s ease-out forwards" }}
        >
          +1 ⭐⭐
        </div>
      )}

      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Βρες το Σωστό Αποτέλεσμα" : "Find the Right Answer"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Πρόβλημα ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Problem ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-orange-600">➕ {score}</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">{progressPercent}%</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-orange-400">
          <div className="text-center mb-8">
            <p className="text-2xl font-bold text-slate-700 mb-6">
              {lang === "el" ? "Πόσο κάνει:" : "What is:"}
            </p>
            <div className="flex justify-center mb-6">
              <div className="inline-block bg-gradient-to-r from-yellow-100 to-orange-100 rounded-3xl p-12 border-4 border-orange-300 shadow-lg">
                <div className="flex items-center justify-center gap-8 text-8xl font-bold text-slate-800">
                  <span className="text-blue-600">{currentProblem.num1}</span>
                  <span className="text-6xl text-orange-600">{currentProblem.op}</span>
                  <span className="text-purple-600">{currentProblem.num2}</span>
                  <span className="text-6xl text-orange-600">=</span>
                  <span
                    className={`text-7xl font-bold ${
                      showAnswer && selectedAnswer === currentProblem.correctAnswer
                        ? "text-green-600 animate-bounce"
                        : "text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600"
                    }`}
                  >
                    {showAnswer && selectedAnswer === currentProblem.correctAnswer
                      ? currentProblem.correctAnswer
                      : "?"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {!showAnswer && (
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              {currentProblem.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option)}
                  className="p-8 rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-100 hover:from-yellow-200 hover:to-orange-200 border-4 border-orange-300 hover:border-orange-500 transition-all duration-200 transform hover:scale-105 shadow-lg text-5xl font-bold text-slate-800"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {showAnswer && selectedAnswer === currentProblem.correctAnswer && (
            <div className="text-center animate-fadeIn">
              <div className="inline-block bg-green-100 rounded-3xl p-8 border-4 border-green-400">
                <div className="text-8xl mb-4">✅</div>
                <p className="text-3xl font-bold text-green-700">
                  {lang === "el"
                    ? `🎉 Μπράβο! ${currentProblem.num1} ${currentProblem.op} ${currentProblem.num2} = ${currentProblem.correctAnswer}`
                    : `🎉 Great! ${currentProblem.num1} ${currentProblem.op} ${currentProblem.num2} = ${currentProblem.correctAnswer}`}
                </p>
              </div>
            </div>
          )}

          {showAnswer && selectedAnswer !== currentProblem.correctAnswer && (
            <div className="text-center animate-fadeIn">
              <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
                <div className="text-6xl mb-2">❌</div>
                <p className="text-3xl font-bold text-red-700">
                  {lang === "el" ? "Προσπάθησε ξανά!" : "Try again!"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/80 to-orange-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">➕🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Είσαι μαθηματικός αστέρας!" : "Perfect! You're a math star!"}
            </h3>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-200px) scale(1.5); opacity: 0; }
        }
        .animate-float-up { animation: float-up 2s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-in; }
      `}</style>
    </div>
  );
}
