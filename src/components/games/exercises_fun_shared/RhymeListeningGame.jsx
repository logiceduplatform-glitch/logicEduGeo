// src/components/games/RhymeListeningGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function RhymeListeningGame({ lang = "el", onComplete }) {
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

  const TARGET_ROUNDS = 12; // 12 ζευγάρια λέξεων

  const rhymesData = {
    el: [
      {
        id: 1,
        word1: "γάτα",
        word2: "πατάτα",
        emoji1: "🐱",
        emoji2: "🥔",
        isRhyme: true,
        color: "#EF4444"
      },
      {
        id: 2,
        word1: "σκύλος",
        word2: "ψωμί",
        emoji1: "🐶",
        emoji2: "🍞",
        isRhyme: false,
        color: "#3B82F6"
      },
      {
        id: 3,
        word1: "παπούτσι",
        word2: "τσουλούφι",
        emoji1: "👟",
        emoji2: "💇",
        isRhyme: true,
        color: "#10B981"
      },
      {
        id: 4,
        word1: "φίλος",
        word2: "μήλο",
        emoji1: "👦",
        emoji2: "🍎",
        isRhyme: false,
        color: "#F59E0B"
      },
      {
        id: 5,
        word1: "καρδιά",
        word2: "αγκαλιά",
        emoji1: "❤️",
        emoji2: "🤗",
        isRhyme: true,
        color: "#EC4899"
      },
      {
        id: 6,
        word1: "λουλούδι",
        word2: "αυτοκίνητο",
        emoji1: "🌸",
        emoji2: "🚗",
        isRhyme: false,
        color: "#8B5CF6"
      },
      {
        id: 7,
        word1: "χέρι",
        word2: "αέρι",
        emoji1: "🖐️",
        emoji2: "💨",
        isRhyme: true,
        color: "#06B6D4"
      },
      {
        id: 8,
        word1: "βιβλίο",
        word2: "καρέκλα",
        emoji1: "📚",
        emoji2: "🪑",
        isRhyme: false,
        color: "#A855F7"
      },
      {
        id: 9,
        word1: "φεγγάρι",
        word2: "αστέρι",
        emoji1: "🌙",
        emoji2: "⭐",
        isRhyme: true,
        color: "#EAB308"
      },
      {
        id: 10,
        word1: "ψάρι",
        word2: "σπίτι",
        emoji1: "🐟",
        emoji2: "🏠",
        isRhyme: false,
        color: "#22C55E"
      },
      {
        id: 11,
        word1: "κουτί",
        word2: "καλοκαιράκι",
        emoji1: "📦",
        emoji2: "☀️",
        isRhyme: true,
        color: "#F97316"
      },
      {
        id: 12,
        word1: "μπάλα",
        word2: "δέντρο",
        emoji1: "⚽",
        emoji2: "🌳",
        isRhyme: false,
        color: "#14B8A6"
      }
    ],
    en: [
      {
        id: 1,
        word1: "cat",
        word2: "hat",
        emoji1: "🐱",
        emoji2: "🎩",
        isRhyme: true,
        color: "#EF4444"
      },
      {
        id: 2,
        word1: "dog",
        word2: "book",
        emoji1: "🐶",
        emoji2: "📚",
        isRhyme: false,
        color: "#3B82F6"
      },
      {
        id: 3,
        word1: "sun",
        word2: "fun",
        emoji1: "☀️",
        emoji2: "🎉",
        isRhyme: true,
        color: "#10B981"
      },
      {
        id: 4,
        word1: "tree",
        word2: "ball",
        emoji1: "🌳",
        emoji2: "⚽",
        isRhyme: false,
        color: "#F59E0B"
      },
      {
        id: 5,
        word1: "car",
        word2: "star",
        emoji1: "🚗",
        emoji2: "⭐",
        isRhyme: true,
        color: "#EC4899"
      },
      {
        id: 6,
        word1: "house",
        word2: "fish",
        emoji1: "🏠",
        emoji2: "🐟",
        isRhyme: false,
        color: "#8B5CF6"
      },
      {
        id: 7,
        word1: "moon",
        word2: "spoon",
        emoji1: "🌙",
        emoji2: "🥄",
        isRhyme: true,
        color: "#06B6D4"
      },
      {
        id: 8,
        word1: "chair",
        word2: "apple",
        emoji1: "🪑",
        emoji2: "🍎",
        isRhyme: false,
        color: "#A855F7"
      },
      {
        id: 9,
        word1: "bee",
        word2: "tree",
        emoji1: "🐝",
        emoji2: "🌳",
        isRhyme: true,
        color: "#EAB308"
      },
      {
        id: 10,
        word1: "shoe",
        word2: "bed",
        emoji1: "👟",
        emoji2: "🛏️",
        isRhyme: false,
        color: "#22C55E"
      },
      {
        id: 11,
        word1: "rain",
        word2: "train",
        emoji1: "🌧️",
        emoji2: "🚂",
        isRhyme: true,
        color: "#F97316"
      },
      {
        id: 12,
        word1: "hand",
        word2: "flower",
        emoji1: "🖐️",
        emoji2: "🌸",
        isRhyme: false,
        color: "#14B8A6"
      }
    ]
  };

  const rhymes = rhymesData[lang];
  const round = rhymes[currentRound];

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
      emoji: ["🎉", "⭐", "✨", "🌟", "🎵", "✅"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const speakWords = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      // First word
      const utterance1 = new SpeechSynthesisUtterance(round.word1);
      utterance1.lang = lang === 'el' ? 'el-GR' : 'en-US';
      utterance1.rate = 0.7;
      utterance1.pitch = 1.1;

      utterance1.onend = () => {
        // Pause between words
        setTimeout(() => {
          // Second word
          const utterance2 = new SpeechSynthesisUtterance(round.word2);
          utterance2.lang = lang === 'el' ? 'el-GR' : 'en-US';
          utterance2.rate = 0.7;
          utterance2.pitch = 1.1;
          const voice2 = VoiceService.getVoice(lang);
          if (voice2) utterance2.voice = voice2;
          window.speechSynthesis.speak(utterance2);
        }, 500);
      };

      const voice1 = VoiceService.getVoice(lang);
      if (voice1) utterance1.voice = voice1;
      window.speechSynthesis.speak(utterance1);
    }
  };

  useEffect(() => {
    // Speak words automatically when round changes
    const timer = setTimeout(() => {
      speakWords();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentRound]);

  const handleAnswerSelect = (answer) => {
    if (showAnswer) return;

    setSelectedAnswer(answer);
    setShowAnswer(true);

    const isCorrect = answer === round.isRhyme;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Rhyme Listening Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Rhyme Listening Game",
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
              onComplete();
            }
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
    <div className="relative w-full min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Βρες τη Ρίμα" : "Find the Rhyme"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Ζευγάρι ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Pair ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            🎵 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-500 ease-out"
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
            {lang === "el" ? "Άκου τις δύο λέξεις!" : "Listen to the two words!"}
          </h2>

          {/* Words Display */}
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-8xl mb-2">{round.emoji1}</div>
              <p className="text-2xl font-bold text-slate-800">{round.word1}</p>
            </div>

            <div className="text-6xl text-slate-400">+</div>

            <div className="text-center">
              <div className="text-8xl mb-2">{round.emoji2}</div>
              <p className="text-2xl font-bold text-slate-800">{round.word2}</p>
            </div>
          </div>

          <button
            onClick={speakWords}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg mb-4"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>

          <p className="text-xl text-slate-600 mt-4">
            {lang === "el" ? "Κάνουν ρίμα;" : "Do they rhyme?"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="grid grid-cols-2 gap-6">
          {/* Yes Button */}
          <button
            onClick={() => handleAnswerSelect(true)}
            disabled={showAnswer}
            className={`
              relative p-8 rounded-3xl border-4 transition-all duration-300 transform
              ${showAnswer && selectedAnswer === true && round.isRhyme ? "bg-green-100 border-green-500 scale-110" : ""}
              ${showAnswer && selectedAnswer === true && !round.isRhyme ? "bg-red-100 border-red-500 animate-shake" : ""}
              ${!showAnswer ? "bg-white border-slate-300 hover:border-green-400 hover:scale-105 cursor-pointer" : "cursor-not-allowed"}
              ${showAnswer && selectedAnswer !== true && round.isRhyme ? "border-green-500" : ""}
              ${showAnswer && selectedAnswer !== true ? "opacity-50" : ""}
            `}
          >
            <div className="text-center">
              <div className="text-8xl mb-4">✓</div>
              <p className="text-3xl font-bold text-slate-800">
                {lang === "el" ? "ΝΑΙ" : "YES"}
              </p>
              <p className="text-lg text-slate-600 mt-2">
                {lang === "el" ? "Κάνουν ρίμα" : "They rhyme"}
              </p>

              {showAnswer && selectedAnswer === true && round.isRhyme && (
                <div className="text-7xl animate-bounce mt-4">
                  ✅
                </div>
              )}
              {showAnswer && selectedAnswer === true && !round.isRhyme && (
                <div className="text-7xl mt-4">
                  ❌
                </div>
              )}
            </div>
          </button>

          {/* No Button */}
          <button
            onClick={() => handleAnswerSelect(false)}
            disabled={showAnswer}
            className={`
              relative p-8 rounded-3xl border-4 transition-all duration-300 transform
              ${showAnswer && selectedAnswer === false && !round.isRhyme ? "bg-green-100 border-green-500 scale-110" : ""}
              ${showAnswer && selectedAnswer === false && round.isRhyme ? "bg-red-100 border-red-500 animate-shake" : ""}
              ${!showAnswer ? "bg-white border-slate-300 hover:border-red-400 hover:scale-105 cursor-pointer" : "cursor-not-allowed"}
              ${showAnswer && selectedAnswer !== false && !round.isRhyme ? "border-green-500" : ""}
              ${showAnswer && selectedAnswer !== false ? "opacity-50" : ""}
            `}
          >
            <div className="text-center">
              <div className="text-8xl mb-4">✗</div>
              <p className="text-3xl font-bold text-slate-800">
                {lang === "el" ? "ΟΧΙ" : "NO"}
              </p>
              <p className="text-lg text-slate-600 mt-2">
                {lang === "el" ? "Δεν κάνουν ρίμα" : "They don't rhyme"}
              </p>

              {showAnswer && selectedAnswer === false && !round.isRhyme && (
                <div className="text-7xl animate-bounce mt-4">
                  ✅
                </div>
              )}
              {showAnswer && selectedAnswer === false && round.isRhyme && (
                <div className="text-7xl mt-4">
                  ❌
                </div>
              )}
            </div>
          </button>
        </div>
      </div>

      {showAnswer && (
        <div className="text-center animate-fadeIn">
          {(selectedAnswer === true && round.isRhyme) || (selectedAnswer === false && !round.isRhyme) ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el" ? "🎉 Σωστά! Μπράβο!" : "🎉 Correct! Well done!"}
              </p>
              {round.isRhyme && (
                <p className="text-xl text-green-600 mt-2">
                  {lang === "el"
                    ? `"${round.word1}" και "${round.word2}" κάνουν ρίμα!`
                    : `"${round.word1}" and "${round.word2}" rhyme!`}
                </p>
              )}
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el" ? "Σκέψου πάλι!" : "Think again!"}
              </p>
              <p className="text-xl text-red-600 mt-2">
                {round.isRhyme
                  ? (lang === "el" ? "Αυτές οι λέξεις κάνουν ρίμα!" : "These words do rhyme!")
                  : (lang === "el" ? "Αυτές οι λέξεις δεν κάνουν ρίμα!" : "These words don't rhyme!")}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-300/80 to-pink-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🎵🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις να βρίσκεις τις ρίμες!" : "Perfect! You know how to find rhymes!"}
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

