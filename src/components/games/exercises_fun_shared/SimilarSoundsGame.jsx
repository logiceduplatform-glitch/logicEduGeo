// src/components/games/SimilarSoundsGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function SimilarSoundsGame({ lang = "el", onComplete, difficulty = 3 }) {
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

  const TARGET_ROUNDS = 10; // 10 λέξεις

  const wordsData = {
    el: [
      {
        id: 1,
        word: "λεπτό",
        correct: "δέντρο",
        color: "#10B981",
        options: [
          { id: "tree", word: "δέντρο", emoji: "🌳" },
          { id: "house", word: "σπίτι", emoji: "🏠" },
          { id: "car", word: "αυτοκίνητο", emoji: "🚗" },
        ]
      },
      {
        id: 2,
        word: "γάτα",
        correct: "πατάτα",
        color: "#F59E0B",
        options: [
          { id: "potato", word: "πατάτα", emoji: "🥔" },
          { id: "dog", word: "σκύλος", emoji: "🐶" },
          { id: "fish", word: "ψάρι", emoji: "🐟" },
        ]
      },
      {
        id: 3,
        word: "χέρι",
        correct: "αέρι",
        color: "#06B6D4",
        options: [
          { id: "air", word: "αέρι", emoji: "💨" },
          { id: "foot", word: "πόδι", emoji: "🦶" },
          { id: "head", word: "κεφάλι", emoji: "👤" },
        ]
      },
      {
        id: 4,
        word: "μύτη",
        correct: "πίτα",
        color: "#EF4444",
        options: [
          { id: "pie", word: "πίτα", emoji: "🥧" },
          { id: "eye", word: "μάτι", emoji: "👁️" },
          { id: "ear", word: "αυτί", emoji: "👂" },
        ]
      },
      {
        id: 5,
        word: "φεγγάρι",
        correct: "αστέρι",
        color: "#8B5CF6",
        options: [
          { id: "star", word: "αστέρι", emoji: "⭐" },
          { id: "sun", word: "ήλιος", emoji: "☀️" },
          { id: "cloud", word: "σύννεφο", emoji: "☁️" },
        ]
      },
      {
        id: 6,
        word: "παπούτσι",
        correct: "τσουλούφι",
        color: "#EC4899",
        options: [
          { id: "hair", word: "τσουλούφι", emoji: "💇" },
          { id: "shirt", word: "μπλούζα", emoji: "👕" },
          { id: "pants", word: "παντελόνι", emoji: "👖" },
        ]
      },
      {
        id: 7,
        word: "μήλο",
        correct: "ψωμί",
        color: "#EF4444",
        options: [
          { id: "bread", word: "ψωμί", emoji: "🍞" },
          { id: "orange", word: "πορτοκάλι", emoji: "🍊" },
          { id: "banana", word: "μπανάνα", emoji: "🍌" },
        ]
      },
      {
        id: 8,
        word: "καρδιά",
        correct: "αγκαλιά",
        color: "#EC4899",
        options: [
          { id: "hug", word: "αγκαλιά", emoji: "🤗" },
          { id: "hand", word: "χέρι", emoji: "🖐️" },
          { id: "smile", word: "χαμόγελο", emoji: "😊" },
        ]
      },
      {
        id: 9,
        word: "κουτί",
        correct: "σπίτι",
        color: "#F59E0B",
        options: [
          { id: "house", word: "σπίτι", emoji: "🏠" },
          { id: "bag", word: "τσάντα", emoji: "👜" },
          { id: "bottle", word: "μπουκάλι", emoji: "🍼" },
        ]
      },
      {
        id: 10,
        word: "μπάλα",
        correct: "τσάντα",
        color: "#3B82F6",
        options: [
          { id: "bag", word: "τσάντα", emoji: "👜" },
          { id: "toy", word: "παιχνίδι", emoji: "🧸" },
          { id: "book", word: "βιβλίο", emoji: "📚" },
        ]
      }
    ],
    en: [
      {
        id: 1,
        word: "cat",
        correct: "hat",
        color: "#F59E0B",
        options: [
          { id: "hat", word: "hat", emoji: "🎩" },
          { id: "dog", word: "dog", emoji: "🐶" },
          { id: "fish", word: "fish", emoji: "🐟" },
        ]
      },
      {
        id: 2,
        word: "sun",
        correct: "fun",
        color: "#EAB308",
        options: [
          { id: "fun", word: "fun", emoji: "🎉" },
          { id: "moon", word: "moon", emoji: "🌙" },
          { id: "star", word: "star", emoji: "⭐" },
        ]
      },
      {
        id: 3,
        word: "car",
        correct: "star",
        color: "#8B5CF6",
        options: [
          { id: "star", word: "star", emoji: "⭐" },
          { id: "house", word: "house", emoji: "🏠" },
          { id: "tree", word: "tree", emoji: "🌳" },
        ]
      },
      {
        id: 4,
        word: "moon",
        correct: "spoon",
        color: "#06B6D4",
        options: [
          { id: "spoon", word: "spoon", emoji: "🥄" },
          { id: "fork", word: "fork", emoji: "🍴" },
          { id: "plate", word: "plate", emoji: "🍽️" },
        ]
      },
      {
        id: 5,
        word: "bee",
        correct: "tree",
        color: "#10B981",
        options: [
          { id: "tree", word: "tree", emoji: "🌳" },
          { id: "flower", word: "flower", emoji: "🌸" },
          { id: "butterfly", word: "butterfly", emoji: "🦋" },
        ]
      },
      {
        id: 6,
        word: "rain",
        correct: "train",
        color: "#3B82F6",
        options: [
          { id: "train", word: "train", emoji: "🚂" },
          { id: "cloud", word: "cloud", emoji: "☁️" },
          { id: "umbrella", word: "umbrella", emoji: "☂️" },
        ]
      },
      {
        id: 7,
        word: "ball",
        correct: "wall",
        color: "#EF4444",
        options: [
          { id: "wall", word: "wall", emoji: "🧱" },
          { id: "toy", word: "toy", emoji: "🧸" },
          { id: "box", word: "box", emoji: "📦" },
        ]
      },
      {
        id: 8,
        word: "boat",
        correct: "coat",
        color: "#A855F7",
        options: [
          { id: "coat", word: "coat", emoji: "🧥" },
          { id: "ship", word: "ship", emoji: "⛵" },
          { id: "water", word: "water", emoji: "💧" },
        ]
      },
      {
        id: 9,
        word: "fox",
        correct: "box",
        color: "#F97316",
        options: [
          { id: "box", word: "box", emoji: "📦" },
          { id: "dog", word: "dog", emoji: "🐶" },
          { id: "cat", word: "cat", emoji: "🐱" },
        ]
      },
      {
        id: 10,
        word: "night",
        correct: "light",
        color: "#EAB308",
        options: [
          { id: "light", word: "light", emoji: "💡" },
          { id: "dark", word: "dark", emoji: "🌑" },
          { id: "sleep", word: "sleep", emoji: "😴" },
        ]
      }
    ]
  };

  const words = wordsData[lang];
  const round = words[currentRound];

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
      emoji: ["🎉", "⭐", "✨", "🌟", "🔤", "✅"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const speakWord = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(round.word);
      utterance.lang = lang === 'el' ? 'el-GR' : 'en-US';
      utterance.rate = 0.7;
      utterance.pitch = 1.1;
      const voice = VoiceService.getVoice(lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    // Speak word automatically when round changes
    const timer = setTimeout(() => {
      speakWord();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentRound]);

  const handleAnswerSelect = (answerId) => {
    if (showAnswer) return;

    setSelectedAnswer(answerId);
    setShowAnswer(true);

    const isCorrect = answerId === round.correct;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Similar Sounds Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Similar Sounds Game",
        score: 1,
        total: 1,
      });

      setTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
          setSelectedAnswer(null);
          setShowAnswer(false);
        } else {
          createCelebrationEmojis();
          setShowCelebration(true);
          setTimeout(() => {
            if (onComplete) {
              onComplete({ score: newScore, total: TARGET_ROUNDS });
            }
          }, NEXT_DELAY);
        }
      }, NEXT_DELAY);
    } else {
      wrongSoundRef.current?.play().catch(() => {});

      setTimeout(() => {
        setSelectedAnswer(null);
        setShowAnswer(false);
      }, WRONG_DELAY);
    }
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-fuchsia-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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

      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Παρόμοιοι Ήχοι" : "Similar Sounds"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Λέξη ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Word ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-pink-600">
            🎵 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-fuchsia-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-8 shadow-xl border-4" style={{ borderColor: round.color }}>
          <div className="text-9xl mb-4">👂</div>
          <h2 className="text-3xl font-bold mb-4 text-slate-800">
            {lang === "el" ? "Άκου τη λέξη!" : "Listen to the word!"}
          </h2>

          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-xl mb-4">
            <p className="text-5xl font-bold text-slate-800">
              {round.word}
            </p>
          </div>

          <button
            onClick={speakWord}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white text-2xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg mb-4"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>

          <p className="text-xl text-slate-600 mt-4">
            {lang === "el" ? "Βρες τη λέξη με παρόμοιο ήχο!" : "Find the word with similar sound!"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="grid grid-cols-3 gap-4">
          {round.options.map((option) => {
            const isSelected = selectedAnswer === option.word;
            const isCorrect = showAnswer && option.word === round.correct;
            const isWrong = showAnswer && isSelected && option.word !== round.correct;

            return (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(option.word)}
                disabled={showAnswer}
                className={`
                  relative p-6 rounded-2xl border-4 transition-all duration-300 transform
                  ${isCorrect ? "bg-green-100 border-green-500 scale-110" : ""}
                  ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                  ${!showAnswer ? "bg-white border-slate-300 hover:border-pink-400 hover:scale-105 cursor-pointer" : "cursor-not-allowed"}
                  ${showAnswer && !isSelected && option.word !== round.correct ? "opacity-50" : ""}
                `}
              >
                <div className="text-center">
                  <div className="text-7xl mb-3">{option.emoji}</div>
                  <p className="text-2xl font-bold text-slate-800">{option.word}</p>

                  {isCorrect && (
                    <div className="text-6xl animate-bounce mt-3">
                      ✅
                    </div>
                  )}
                  {isWrong && (
                    <div className="text-6xl mt-3">
                      ❌
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showAnswer && (
        <div className="text-center animate-fadeIn">
          {selectedAnswer === round.correct ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el"
                  ? `🎉 Μπράβο! "${round.word}" και "${round.correct}" ηχούν παρόμοια!`
                  : `🎉 Great! "${round.word}" and "${round.correct}" sound similar!`}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el"
                  ? `Η σωστή ήταν: ${round.correct}`
                  : `The correct one was: ${round.correct}`}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-pink-300/80 to-fuchsia-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🎵🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Βρήκες όλους τους παρόμοιους ήχους!" : "Perfect! You found all the similar sounds!"}
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
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}

