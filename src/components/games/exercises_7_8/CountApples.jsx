// src/components/games/exercises_7_8/CountApples.jsx - Upgraded for age 8: Addition & Subtraction
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
export default function CountApples({ lang = "el", onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();
  const TARGET_QUESTIONS = 10;
  const questionsData = {
    el: [
      {
        id: 1,
        question: "5 + 3 = ?",
        emoji: "🍎",
        options: [7, 8, 9],
        correct: 8
      },
      {
        id: 2,
        question: "12 - 7 = ?",
        emoji: "🍊",
        options: [4, 5, 6],
        correct: 5
      },
      {
        id: 3,
        question: "9 + 6 = ?",
        emoji: "🍌",
        options: [14, 15, 16],
        correct: 15
      },
      {
        id: 4,
        question: "18 - 9 = ?",
        emoji: "🍇",
        options: [8, 9, 10],
        correct: 9
      },
      {
        id: 5,
        question: "7 + 8 = ?",
        emoji: "🍓",
        options: [14, 15, 16],
        correct: 15
      },
      {
        id: 6,
        question: "20 - 12 = ?",
        emoji: "🍉",
        options: [7, 8, 9],
        correct: 8
      },
      {
        id: 7,
        question: "6 + 9 = ?",
        emoji: "🥝",
        options: [14, 15, 16],
        correct: 15
      },
      {
        id: 8,
        question: "17 - 8 = ?",
        emoji: "🍑",
        options: [8, 9, 10],
        correct: 9
      },
      {
        id: 9,
        question: "13 + 5 = ?",
        emoji: "🍒",
        options: [17, 18, 19],
        correct: 18
      },
      {
        id: 10,
        question: "19 - 11 = ?",
        emoji: "🫐",
        options: [7, 8, 9],
        correct: 8
      },
    ],
    en: [
      {
        id: 1,
        question: "5 + 3 = ?",
        emoji: "🍎",
        options: [7, 8, 9],
        correct: 8
      },
      {
        id: 2,
        question: "12 - 7 = ?",
        emoji: "🍊",
        options: [4, 5, 6],
        correct: 5
      },
      {
        id: 3,
        question: "9 + 6 = ?",
        emoji: "🍌",
        options: [14, 15, 16],
        correct: 15
      },
      {
        id: 4,
        question: "18 - 9 = ?",
        emoji: "🍇",
        options: [8, 9, 10],
        correct: 9
      },
      {
        id: 5,
        question: "7 + 8 = ?",
        emoji: "🍓",
        options: [14, 15, 16],
        correct: 15
      },
      {
        id: 6,
        question: "20 - 12 = ?",
        emoji: "🍉",
        options: [7, 8, 9],
        correct: 8
      },
      {
        id: 7,
        question: "6 + 9 = ?",
        emoji: "🥝",
        options: [14, 15, 16],
        correct: 15
      },
      {
        id: 8,
        question: "17 - 8 = ?",
        emoji: "🍑",
        options: [8, 9, 10],
        correct: 9
      },
      {
        id: 9,
        question: "13 + 5 = ?",
        emoji: "🍒",
        options: [17, 18, 19],
        correct: 18
      },
      {
        id: 10,
        question: "19 - 11 = ?",
        emoji: "🫐",
        options: [7, 8, 9],
        correct: 8
      },
    ]
  };
  const questions = questionsData[lang];
  const currentQ = questions[currentQuestion];
  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);
  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🔢", "➕", "➖", "🧮"][Math.floor(Math.random() * 8)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);
    setTimeout(() => setCelebrationEmojis([]), 2000);
  };
  const showScorePopup = (points) => {
    setScorePopup({ points, id: Date.now() });
    setTimeout(() => setScorePopup(null), 1500);
  };
  const handleAnswer = (answer) => {
    if (feedback || selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    if (answer === currentQ.correct) {
      correctSoundRef.current?.play().catch(() => {});
      setFeedback("correct");
      const newScore = score + 1;
      setScore(newScore);
      showScorePopup(1);
      createCelebrationEmojis();
      updateProgress({ title: "Count Apples", score: newScore, total: TARGET_QUESTIONS, index: currentQuestion + 1 });
      setTimeout(() => {
        if (currentQuestion + 1 < TARGET_QUESTIONS) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setFeedback(null);
        } else {
          setShowCelebration(true);
          setTimeout(() => {
            completeQuiz({
              title: lang === "el" ? "Μαθηματικά" : "Mathematics",
              score: newScore,
              total: TARGET_QUESTIONS,
            });
            onComplete?.();
          }, 2000);
        }
      }, 1500);
    } else {
      wrongSoundRef.current?.play().catch(() => {});
      setFeedback("wrong");
      setTimeout(() => {
        setSelectedAnswer(null);
        setFeedback(null);
      }, 1500);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-teal-50 to-blue-100 p-6 relative overflow-hidden">
      {celebrationEmojis.map((emoji) => (
        <div
          key={emoji.id}
          className="absolute text-4xl animate-bounce pointer-events-none z-10"
          style={{
            left: `${emoji.x}%`,
            top: "10%",
            animationDelay: `${emoji.delay}s`,
            animationDuration: "1s",
          }}
        >
          {emoji.emoji}
        </div>
      ))}
      {scorePopup && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce">
          <div className="bg-yellow-400 text-white px-8 py-4 rounded-full text-4xl font-bold shadow-2xl border-4 border-yellow-500 flex items-center gap-2">
            <span>⭐</span>
            <span>+{scorePopup.points}</span>
            <span>⭐</span>
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-3">
              <span className="text-4xl">🧮</span>
              {lang === "el" ? "Πρόσθεση & Αφαίρεση" : "Addition & Subtraction"}
            </h2>
            <div className="text-2xl font-bold text-teal-600">
              {currentQuestion + 1} / {TARGET_QUESTIONS}
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-xl p-4 mb-4">
            <div className="text-sm text-green-700 font-semibold mb-1">
              {lang === "el" ? "Πρόοδος" : "Progress"}
            </div>
            <div className="h-3 bg-white/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-teal-500 transition-all duration-500 rounded-full"
                style={{ width: `${((currentQuestion + 1) / TARGET_QUESTIONS) * 100}%` }}
              />
            </div>
            <div className="text-right text-green-700 font-bold mt-1">
              {score} / {TARGET_QUESTIONS}
            </div>
          </div>
        </div>
        {!showCelebration ? (
          <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-10">
            <div className="text-center mb-8">
              <div className="text-8xl mb-4">{currentQ?.emoji}</div>
              <h3 className="text-5xl font-bold text-gray-800 mb-8">
                {currentQ?.question}
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {currentQ?.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={feedback || selectedAnswer !== null}
                  className={`p-8 rounded-2xl text-5xl font-bold transition-all transform hover:scale-105 ${
                    selectedAnswer === option
                      ? feedback === "correct"
                        ? "bg-green-500 text-white scale-105 shadow-2xl"
                        : "bg-red-500 text-white"
                      : "bg-gradient-to-br from-green-400 to-teal-400 text-white hover:shadow-xl"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl shadow-2xl p-12 text-center text-white animate-bounce">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-5xl font-bold mb-4">
              {lang === "el" ? "Συγχαρητήρια!" : "Congratulations!"}
            </h2>
            <p className="text-3xl mb-4">
              {lang === "el" ? `Βαθμολογία: ${score}/${TARGET_QUESTIONS}` : `Score: ${score}/${TARGET_QUESTIONS}`}
            </p>
            <p className="text-2xl">
              {lang === "el" ? "Είσαι μάστορας στα μαθηματικά!" : "You're a math master!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
