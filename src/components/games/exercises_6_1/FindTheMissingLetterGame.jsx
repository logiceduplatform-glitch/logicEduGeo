// src/components/games/exercises_6_1/FindTheMissingLetterGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
export default function FindTheMissingLetterGame({ lang = "el", onComplete }) {
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
    const wordsData = {
      el: [
        { word: "ΓΑΤΑ", missing: "Τ", position: 2, display: "ΓΑ_Α", emoji: "🐱" },
        { word: "ΣΚΥΛΟΣ", missing: "Υ", position: 3, display: "ΣΚ_ΛΟΣ", emoji: "🐶" },
        { word: "ΜΗΛΟ", missing: "Λ", position: 2, display: "ΜΗ_Ο", emoji: "🍎" },
        { word: "ΨΑΡΙ", missing: "Ρ", position: 3, display: "ΨΑ_Ι", emoji: "🐟" },
        { word: "ΣΠΙΤΙ", missing: "Ι", position: 3, display: "ΣΠ_ΤΙ", emoji: "🏠" },
        { word: "ΗΛΙΟΣ", missing: "Ι", position: 2, display: "ΗΛ_ΟΣ", emoji: "☀️" },
        { word: "ΛΟΥΛΟΥΔΙ", missing: "Ο", position: 4, display: "ΛΟΥΛ_ΥΔΙ", emoji: "🌸" },
        { word: "ΜΠΑΛΑ", missing: "Α", position: 3, display: "ΜΠ_ΛΑ", emoji: "⚽" },
        { word: "ΔΕΝΤΡΟ", missing: "Ν", position: 2, display: "ΔΕ_ΤΡΟ", emoji: "🌳" },
        { word: "ΒΙΒΛΙΟ", missing: "Β", position: 2, display: "ΒΙ_ΛΙΟ", emoji: "📚" },
        { word: "ΠΑΠΟΥΤΣΙ", missing: "Π", position: 2, display: "ΠΑ_ΟΥΤΣΙ", emoji: "👟" },
        { word: "ΚΑΡΔΙΑ", missing: "Ρ", position: 2, display: "ΚΑ_ΔΙΑ", emoji: "❤️" }
      ],
      en: [
        { word: "CAT", missing: "A", position: 1, display: "C_T", emoji: "🐱" },
        { word: "DOG", missing: "O", position: 1, display: "D_G", emoji: "🐶" },
        { word: "APPLE", missing: "P", position: 2, display: "AP_LE", emoji: "🍎" },
        { word: "FISH", missing: "I", position: 1, display: "F_SH", emoji: "🐟" },
        { word: "HOUSE", missing: "U", position: 2, display: "HO_SE", emoji: "🏠" },
        { word: "SUN", missing: "U", position: 1, display: "S_N", emoji: "☀️" },
        { word: "FLOWER", missing: "O", position: 2, display: "FL_WER", emoji: "🌸" },
        { word: "BALL", missing: "L", position: 2, display: "BA_L", emoji: "⚽" },
        { word: "TREE", missing: "E", position: 2, display: "TR_E", emoji: "🌳" },
        { word: "BOOK", missing: "O", position: 2, display: "BO_K", emoji: "📚" },
        { word: "SHOE", missing: "O", position: 2, display: "SH_E", emoji: "👟" },
        { word: "HEART", missing: "A", position: 2, display: "HE_RT", emoji: "❤️" }
      ]
    };
    const words = wordsData[lang];
    const alphabet = lang === "el" 
      ? "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ"
      : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return words.map((wordData) => {
      const wrongLetters = new Set();
      while (wrongLetters.size < 2) {
        const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        if (randomLetter !== wordData.missing && !wrongLetters.has(randomLetter)) {
          wrongLetters.add(randomLetter);
        }
      }
      return {
        ...wordData,
        options: [wordData.missing, ...Array.from(wrongLetters)].sort(() => Math.random() - 0.5)
      };
    });
  };
  const [problems, setProblems] = useState([]);
  const currentProblem = problems[currentRound];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  // Regenerate problems when language changes
  useEffect(() => {
    setProblems(generateProblems());
    // Don't reset round/score - continue from where you were
  }, [lang]);

  useEffect(() => {
    setSelectedAnswer(null);
    setShowAnswer(false);
  }, [currentRound]);
  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "📝", "✅", "🏆"][Math.floor(Math.random() * 7)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);
    setTimeout(() => setCelebrationEmojis([]), 2000);
  };
  const handleAnswerSelect = (answer) => {
    if (showAnswer) return;
    setSelectedAnswer(answer);
    setShowAnswer(true);
    const isCorrect = answer === currentProblem.missing;
    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});
      const newScore = score + 1;
      setScore(newScore);
      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);
      updateProgress({
        title: "Find Missing Letter Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });
      setTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
        } else {
          createCelebrationEmojis();
          setShowCelebration(true);
          completeQuiz({
            title: "Find Missing Letter Game",
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

  // Safety check
  if (!currentProblem) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
        <div className="text-2xl text-slate-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Βρες το Γράμμα που Λείπει" : "Find the Missing Letter"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Λέξη ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Word ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            📝 {score}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>
      {/* Game Area */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-purple-400">
          {/* Word Display with Emoji */}
          <div className="text-center mb-8">
            <div className="text-8xl mb-4">{currentProblem.emoji}</div>
            <p className="text-2xl font-bold text-slate-700 mb-6">
              {lang === "el" ? "Ποιο γράμμα λείπει;" : "Which letter is missing?"}
            </p>
            <div className="flex justify-center mb-6">
              <div className="inline-block bg-gradient-to-r from-pink-100 to-purple-100 rounded-3xl p-12 border-4 border-purple-300 shadow-lg">
                <div className="text-8xl font-bold text-slate-800 tracking-wider">
                  {(showAnswer && selectedAnswer === currentProblem.missing
                    ? currentProblem.word
                    : currentProblem.display
                  ).split('').map((char, idx) => (
                    <span
                      key={idx}
                      className={char === '_' ? 'text-purple-600 animate-pulse' : showAnswer && selectedAnswer === currentProblem.missing && char === currentProblem.missing ? 'text-green-600' : ''}
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xl text-slate-600 mt-4">
              {lang === "el" 
                ? `Η λέξη είναι: ${currentProblem.word}` 
                : `The word is: ${currentProblem.word}`}
            </p>
          </div>
          {/* Answer Options */}
          {!showAnswer && (
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              {currentProblem.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option)}
                  className="p-8 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 border-4 border-purple-300 hover:border-purple-500 transition-all duration-200 transform hover:scale-105 shadow-lg text-6xl font-bold text-slate-800"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
          {/* Show Answer - Correct */}
          {showAnswer && selectedAnswer === currentProblem.missing && (
            <div className="text-center animate-fadeIn">
              <div className="inline-block bg-green-100 rounded-3xl p-8 border-4 border-green-400">
                <div className="text-8xl mb-4">✅</div>
                <p className="text-3xl font-bold text-green-700">
                  {lang === "el"
                    ? `🎉 Μπράβο! Η λέξη είναι ${currentProblem.word}`
                    : `🎉 Great! The word is ${currentProblem.word}`}
                </p>
                <p className="text-xl text-green-600 mt-2">
                  {currentProblem.emoji}
                </p>
              </div>
            </div>
          )}
          {/* Show Answer - Wrong */}
          {showAnswer && selectedAnswer !== currentProblem.missing && (
            <div className="text-center animate-fadeIn">
              <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
                <div className="text-6xl mb-2">❌</div>
                <p className="text-3xl font-bold text-red-700">
                  {lang === "el"
                    ? `Προσπάθησε ξανά!`
                    : `Try again!`}
                </p>
                <p className="text-xl text-red-600 mt-2">
                  {lang === "el"
                    ? `Σκέψου ποιο γράμμα λείπει στη λέξη!`
                    : `Think which letter is missing in the word!`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-pink-300/80 to-purple-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">📝🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις πολύ καλά τα γράμματα!" : "Perfect! You know your letters very well!"}
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
