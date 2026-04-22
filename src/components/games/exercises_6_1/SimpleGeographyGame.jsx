// src/components/games/exercises_6_1/SimpleGeographyGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function SimpleGeographyGame({ lang = "el", onComplete }) {
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

  const TARGET_ROUNDS = 10;

  const geographyData = {
    el: [
      { question: "Ποια είναι η πρωτεύουσα της Ελλάδας;", correct: "Αθήνα", flag: "🇬🇷", options: ["Αθήνα", "Θεσσαλονίκη", "Πάτρα", "Ηράκλειο"] },
      { question: "Σε ποια ήπειρο ζούμε;", correct: "Ευρώπη", flag: "🌍", options: ["Ευρώπη", "Ασία", "Αφρική", "Αμερική"] },
      { question: "Ποια είναι η πρωτεύουσα της Γαλλίας;", correct: "Παρίσι", flag: "🇫🇷", options: ["Παρίσι", "Λονδίνο", "Ρώμη", "Βερολίνο"] },
      { question: "Ποια χώρα έχει αυτή τη σημαία 🇮🇹;", correct: "Ιταλία", flag: "🇮🇹", options: ["Ιταλία", "Ισπανία", "Γερμανία", "Γαλλία"] },
      { question: "Ποιος ωκεανός είναι ο μεγαλύτερος;", correct: "Ειρηνικός", flag: "🌊", options: ["Ειρηνικός", "Ατλαντικός", "Ινδικός", "Αρκτικός"] },
      { question: "Ποια είναι η πρωτεύουσα της Ιταλίας;", correct: "Ρώμη", flag: "🇮🇹", options: ["Ρώμη", "Μιλάνο", "Βενετία", "Φλωρεντία"] },
      { question: "Σε ποια χώρα βρίσκεται ο Πύργος του Άιφελ;", correct: "Γαλλία", flag: "🗼", options: ["Γαλλία", "Ιταλία", "Ισπανία", "Αγγλία"] },
      { question: "Ποια ήπειρος είναι η μεγαλύτερη;", correct: "Ασία", flag: "🌏", options: ["Ασία", "Αφρική", "Ευρώπη", "Αμερική"] },
      { question: "Ποια είναι η πρωτεύουσα της Ισπανίας;", correct: "Μαδρίτη", flag: "🇪🇸", options: ["Μαδρίτη", "Βαρκελώνη", "Σεβίλλη", "Βαλένθια"] },
      { question: "Πού βρίσκονται οι Πυραμίδες;", correct: "Αίγυπτος", flag: "🏜️", options: ["Αίγυπτος", "Ελλάδα", "Ιταλία", "Μεξικό"] }
    ],
    en: [
      { question: "What is the capital of Greece?", correct: "Athens", flag: "🇬🇷", options: ["Athens", "Thessaloniki", "Patras", "Heraklion"] },
      { question: "Which continent do we live in?", correct: "Europe", flag: "🌍", options: ["Europe", "Asia", "Africa", "America"] },
      { question: "What is the capital of France?", correct: "Paris", flag: "🇫🇷", options: ["Paris", "London", "Rome", "Berlin"] },
      { question: "Which country has this flag 🇮🇹?", correct: "Italy", flag: "🇮🇹", options: ["Italy", "Spain", "Germany", "France"] },
      { question: "Which ocean is the largest?", correct: "Pacific", flag: "🌊", options: ["Pacific", "Atlantic", "Indian", "Arctic"] },
      { question: "What is the capital of Italy?", correct: "Rome", flag: "🇮🇹", options: ["Rome", "Milan", "Venice", "Florence"] },
      { question: "In which country is the Eiffel Tower?", correct: "France", flag: "🗼", options: ["France", "Italy", "Spain", "England"] },
      { question: "Which continent is the largest?", correct: "Asia", flag: "🌏", options: ["Asia", "Africa", "Europe", "America"] },
      { question: "What is the capital of Spain?", correct: "Madrid", flag: "🇪🇸", options: ["Madrid", "Barcelona", "Seville", "Valencia"] },
      { question: "Where are the Pyramids located?", correct: "Egypt", flag: "🏜️", options: ["Egypt", "Greece", "Italy", "Mexico"] }
    ]
  };

  const questions = geographyData[lang];
  const currentQuestion = questions[currentRound];

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
      emoji: ["🎉", "⭐", "✨", "🌍", "🗺️", "🌏", "🏆"][Math.floor(Math.random() * 7)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);
    setTimeout(() => setCelebrationEmojis([]), 2000);
  };

  const handleAnswerSelect = (answer) => {
    if (showAnswer) return;

    setSelectedAnswer(answer);
    setShowAnswer(true);

    const isCorrect = answer === currentQuestion.correct;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});
      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Geography Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Geography Game",
        score: 1,
        total: 1,
      });

      setTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
        } else {
          createCelebrationEmojis();
          setShowCelebration(true);
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

  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-100 via-green-100 to-teal-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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

      {/* Header */}
      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Γεωγραφία" : "Geography"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Ερώτηση ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Question ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            🌍 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-green-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-blue-400">
          {/* Question Display */}
          <div className="text-center mb-8">
            <div className="text-9xl mb-6 animate-bounce">{currentQuestion.flag}</div>
            <p className="text-3xl font-bold text-slate-800 mb-4">
              {currentQuestion.question}
            </p>
          </div>

          {/* Answer Options */}
          {!showAnswer && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option)}
                  className="p-6 rounded-2xl bg-gradient-to-br from-blue-100 to-green-100 hover:from-blue-200 hover:to-green-200 border-4 border-blue-300 hover:border-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg text-2xl font-bold text-slate-800"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Show Answer */}
          {showAnswer && selectedAnswer === currentQuestion.correct && (
            <div className="text-center animate-fadeIn">
              <div className="inline-block bg-green-100 rounded-3xl p-8 border-4 border-green-400">
                <div className="text-8xl mb-4">✅</div>
                <p className="text-3xl font-bold text-green-700">
                  {lang === "el"
                    ? `🎉 Σωστά! ${currentQuestion.correct}`
                    : `🎉 Correct! ${currentQuestion.correct}`}
                </p>
              </div>
            </div>
          )}

          {showAnswer && selectedAnswer !== currentQuestion.correct && (
            <div className="text-center animate-fadeIn">
              <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
                <p className="text-3xl font-bold text-red-700">
                  {lang === "el"
                    ? `Προσπάθησε ξανά! Σκέψου καλά!`
                    : `Try again! Think carefully!`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300/80 to-green-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🌍🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις γεωγραφία!" : "Perfect! You know geography!"}
            </h3>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-200px) scale(1.5); opacity: 0; }
        }
        .animate-float-up {
          animation: float-up 2s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in;
        }
      `}</style>
    </div>
  );
}

