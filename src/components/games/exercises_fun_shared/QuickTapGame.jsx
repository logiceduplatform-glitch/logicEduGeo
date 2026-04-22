// src/components/games/QuickTapGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function QuickTapGame({ lang = "el", difficulty = 3, onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const [blinkingItems, setBlinkingItems] = useState([]);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const d = Math.max(1, Math.min(5, difficulty));
  const BLINK_INTERVAL = [500, 400, 300, 220, 150][d - 1];
  const START_DELAY = [1500, 1200, 1000, 800, 600][d - 1];
  const NEXT_ROUND_DELAY = [3000, 2800, 2500, 2200, 2000][d - 1];
  const TARGET_ROUNDS = 10;

  const roundsData = {
    el: [
      {
        id: 1,
        targetId: "apple",
        targetName: "Μήλο",
        items: [
          { id: "apple", emoji: "🍎", label: "Μήλο" },
          { id: "banana", emoji: "🍌", label: "Μπανάνα" },
          { id: "orange", emoji: "🍊", label: "Πορτοκάλι" }
        ],
        question: "Πάτα το Μήλο!"
      },
      {
        id: 2,
        targetId: "cat",
        targetName: "Γάτα",
        items: [
          { id: "dog", emoji: "🐶", label: "Σκύλος" },
          { id: "cat", emoji: "🐱", label: "Γάτα" },
          { id: "rabbit", emoji: "🐰", label: "Λαγός" }
        ],
        question: "Πάτα τη Γάτα!"
      },
      {
        id: 3,
        targetId: "car",
        targetName: "Αυτοκίνητο",
        items: [
          { id: "car", emoji: "🚗", label: "Αυτοκίνητο" },
          { id: "bus", emoji: "🚌", label: "Λεωφορείο" },
          { id: "train", emoji: "🚆", label: "Τρένο" }
        ],
        question: "Πάτα το Αυτοκίνητο!"
      },
      {
        id: 4,
        targetId: "star",
        targetName: "Αστέρι",
        items: [
          { id: "star", emoji: "⭐", label: "Αστέρι" },
          { id: "moon", emoji: "🌙", label: "Φεγγάρι" },
          { id: "sun", emoji: "☀️", label: "Ήλιος" }
        ],
        question: "Πάτα το Αστέρι!"
      },
      {
        id: 5,
        targetId: "pizza",
        targetName: "Πίτσα",
        items: [
          { id: "pizza", emoji: "🍕", label: "Πίτσα" },
          { id: "burger", emoji: "🍔", label: "Μπέργκερ" },
          { id: "hotdog", emoji: "🌭", label: "Χοτ Ντογκ" }
        ],
        question: "Πάτα την Πίτσα!"
      },
      {
        id: 6,
        targetId: "butterfly",
        targetName: "Πεταλούδα",
        items: [
          { id: "butterfly", emoji: "🦋", label: "Πεταλούδα" },
          { id: "bee", emoji: "🐝", label: "Μέλισσα" },
          { id: "ladybug", emoji: "🐞", label: "Πασχαλίτσα" }
        ],
        question: "Πάτα την Πεταλούδα!"
      },
      {
        id: 7,
        targetId: "house",
        targetName: "Σπίτι",
        items: [
          { id: "house", emoji: "🏠", label: "Σπίτι" },
          { id: "school", emoji: "🏫", label: "Σχολείο" },
          { id: "hospital", emoji: "🏥", label: "Νοσοκομείο" }
        ],
        question: "Πάτα το Σπίτι!"
      },
      {
        id: 8,
        targetId: "ball",
        targetName: "Μπάλα",
        items: [
          { id: "ball", emoji: "⚽", label: "Μπάλα" },
          { id: "basketball", emoji: "🏀", label: "Μπάσκετ" },
          { id: "tennis", emoji: "🎾", label: "Τένις" }
        ],
        question: "Πάτα την Μπάλα!"
      },
      {
        id: 9,
        targetId: "flower",
        targetName: "Λουλούδι",
        items: [
          { id: "flower", emoji: "🌸", label: "Λουλούδι" },
          { id: "tree", emoji: "🌲", label: "Δέντρο" },
          { id: "cactus", emoji: "🌵", label: "Κάκτος" }
        ],
        question: "Πάτα το Λουλούδι!"
      },
      {
        id: 10,
        targetId: "heart",
        targetName: "Καρδιά",
        items: [
          { id: "heart", emoji: "❤️", label: "Καρδιά" },
          { id: "diamond", emoji: "💎", label: "Διαμάντι" },
          { id: "crown", emoji: "👑", label: "Κορώνα" }
        ],
        question: "Πάτα την Καρδιά!"
      }
    ],
    en: [
      {
        id: 1,
        targetId: "apple",
        targetName: "Apple",
        items: [
          { id: "apple", emoji: "🍎", label: "Apple" },
          { id: "banana", emoji: "🍌", label: "Banana" },
          { id: "orange", emoji: "🍊", label: "Orange" }
        ],
        question: "Tap the Apple!"
      },
      {
        id: 2,
        targetId: "cat",
        targetName: "Cat",
        items: [
          { id: "dog", emoji: "🐶", label: "Dog" },
          { id: "cat", emoji: "🐱", label: "Cat" },
          { id: "rabbit", emoji: "🐰", label: "Rabbit" }
        ],
        question: "Tap the Cat!"
      },
      {
        id: 3,
        targetId: "car",
        targetName: "Car",
        items: [
          { id: "car", emoji: "🚗", label: "Car" },
          { id: "bus", emoji: "🚌", label: "Bus" },
          { id: "train", emoji: "🚆", label: "Train" }
        ],
        question: "Tap the Car!"
      },
      {
        id: 4,
        targetId: "star",
        targetName: "Star",
        items: [
          { id: "star", emoji: "⭐", label: "Star" },
          { id: "moon", emoji: "🌙", label: "Moon" },
          { id: "sun", emoji: "☀️", label: "Sun" }
        ],
        question: "Tap the Star!"
      },
      {
        id: 5,
        targetId: "pizza",
        targetName: "Pizza",
        items: [
          { id: "pizza", emoji: "🍕", label: "Pizza" },
          { id: "burger", emoji: "🍔", label: "Burger" },
          { id: "hotdog", emoji: "🌭", label: "Hot Dog" }
        ],
        question: "Tap the Pizza!"
      },
      {
        id: 6,
        targetId: "butterfly",
        targetName: "Butterfly",
        items: [
          { id: "butterfly", emoji: "🦋", label: "Butterfly" },
          { id: "bee", emoji: "🐝", label: "Bee" },
          { id: "ladybug", emoji: "🐞", label: "Ladybug" }
        ],
        question: "Tap the Butterfly!"
      },
      {
        id: 7,
        targetId: "house",
        targetName: "House",
        items: [
          { id: "house", emoji: "🏠", label: "House" },
          { id: "school", emoji: "🏫", label: "School" },
          { id: "hospital", emoji: "🏥", label: "Hospital" }
        ],
        question: "Tap the House!"
      },
      {
        id: 8,
        targetId: "ball",
        targetName: "Ball",
        items: [
          { id: "ball", emoji: "⚽", label: "Ball" },
          { id: "basketball", emoji: "🏀", label: "Basketball" },
          { id: "tennis", emoji: "🎾", label: "Tennis" }
        ],
        question: "Tap the Ball!"
      },
      {
        id: 9,
        targetId: "flower",
        targetName: "Flower",
        items: [
          { id: "flower", emoji: "🌸", label: "Flower" },
          { id: "tree", emoji: "🌲", label: "Tree" },
          { id: "cactus", emoji: "🌵", label: "Cactus" }
        ],
        question: "Tap the Flower!"
      },
      {
        id: 10,
        targetId: "heart",
        targetName: "Heart",
        items: [
          { id: "heart", emoji: "❤️", label: "Heart" },
          { id: "diamond", emoji: "💎", label: "Diamond" },
          { id: "crown", emoji: "👑", label: "Crown" }
        ],
        question: "Tap the Heart!"
      }
    ]
  };

  const rounds = roundsData[lang];
  const round = rounds[currentRound];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    setShowAnswer(false);
    setIsPlaying(false);
    setBlinkingItems([]);

    // Start blinking after a short delay
    const startTimer = setTimeout(() => {
      setIsPlaying(true);
      startBlinking();
    }, START_DELAY);

    return () => clearTimeout(startTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRound]);

  const blinkIntervalRef = useRef(null);

  const startBlinking = () => {
    // Clear any existing interval
    if (blinkIntervalRef.current) {
      clearInterval(blinkIntervalRef.current);
    }

    // Continue blinking indefinitely until correct answer
    blinkIntervalRef.current = setInterval(() => {
      setBlinkingItems(prev => {
        if (prev.length === 0) {
          return round.items.map(item => item.id);
        } else {
          return [];
        }
      });
    }, BLINK_INTERVAL);
  };

  // Cleanup interval on unmount or round change
  useEffect(() => {
    return () => {
      if (blinkIntervalRef.current) {
        clearInterval(blinkIntervalRef.current);
      }
    };
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "⚡"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const text = round.question;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'el' ? 'el-GR' : 'en-US';
      utterance.rate = 0.75;
      utterance.pitch = 1.1;
      const voice = VoiceService.getVoice(lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      speakQuestion();
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRound, lang]);

  const handleItemClick = (itemId) => {
    if (showAnswer || !isPlaying) return;

    const isCorrect = itemId === round.targetId;

    if (isCorrect) {
      // Stop blinking interval
      if (blinkIntervalRef.current) {
        clearInterval(blinkIntervalRef.current);
        blinkIntervalRef.current = null;
      }

      // Keep all items visible
      setBlinkingItems(round.items.map(item => item.id));

      // Show answer
      setShowAnswer(true);
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Quick Tap Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Quick Tap Game",
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
            if (onComplete) {
              onComplete({ score: score + 1, total: TARGET_ROUNDS });
            }
          }, 2500);
        }
      }, NEXT_ROUND_DELAY);
    } else {
      // For wrong answer: just play sound, keep blinking, DON'T set showAnswer
      wrongSoundRef.current?.play().catch(() => {});

      // Show brief red flash on wrong item but keep game playable
      const wrongItem = document.querySelector(`[data-item-id="${itemId}"]`);
      if (wrongItem) {
        wrongItem.classList.add('wrong-flash');
        setTimeout(() => {
          wrongItem.classList.remove('wrong-flash');
        }, 500);
      }
    }
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Γρήγορο Πάτημα" : "Quick Tap"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            ⚡ {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-red-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-orange-400">
          <div className="text-7xl mb-3">⚡</div>
          <h2 className="text-4xl font-bold mb-3 text-slate-800 animate-pulse">
            {round.question}
          </h2>

          <button
            onClick={speakQuestion}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center items-center gap-8">
          {round.items.map((item) => {
            const isBlinking = blinkingItems.includes(item.id);
            const isCorrect = showAnswer && item.id === round.targetId;

            return (
              <button
                key={item.id}
                data-item-id={item.id}
                onClick={() => handleItemClick(item.id)}
                disabled={showAnswer || !isPlaying}
                className={`
                  relative w-48 h-48 rounded-3xl transition-all duration-300 transform
                  ${isCorrect ? 'bg-green-100 border-green-500 scale-110' : ''}
                  ${!showAnswer && isBlinking ? 'bg-gradient-to-br from-yellow-200 to-orange-200 border-orange-400 shadow-2xl scale-110' : ''}
                  ${!showAnswer && !isBlinking ? 'bg-white/50 border-slate-300 scale-90 opacity-30' : ''}
                  ${!showAnswer && isPlaying ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}
                  border-4 flex flex-col items-center justify-center shadow-lg
                `}
              >
                <div className={`text-8xl mb-2 transition-all duration-300 ${isBlinking ? 'animate-bounce' : ''}`}>
                  {item.emoji}
                </div>
                <p className="text-xl font-bold text-slate-700">{item.label}</p>

                {isCorrect && (
                  <div className="absolute -top-4 -right-4 text-6xl animate-bounce">
                    ✅
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {!isPlaying && !showAnswer && (
          <div className="text-center mt-8">
            <p className="text-2xl font-bold text-orange-600 animate-pulse">
              {lang === "el" ? "Περίμενε..." : "Wait..."}
            </p>
          </div>
        )}
      </div>

      {showAnswer && round.items.find(i => i.id === round.targetId) && (
        <div className="text-center mt-8 animate-fadeIn">
          <div className={`rounded-2xl p-6 inline-block border-4 ${
            round.items.find(i => i.id === round.targetId)
              ? 'bg-green-100 border-green-400'
              : 'bg-red-100 border-red-400'
          }`}>
            <p className="text-3xl font-bold text-green-700">
              {lang === "el"
                ? `🎉 Τέλεια! Πάτησες το ${round.targetName}!`
                : `🎉 Perfect! You tapped the ${round.targetName}!`}
            </p>
          </div>
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/80 to-orange-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">⚡🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Είσαι πολύ γρήγορος!" : "Perfect! You're very fast!"}
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
        @keyframes wrongFlash {
          0%, 100% { background-color: transparent; }
          50% { background-color: rgba(239, 68, 68, 0.5); border-color: rgb(239, 68, 68); }
        }
        .wrong-flash {
          animation: wrongFlash 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

