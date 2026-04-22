// src/components/games/RobotRequestsGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function RobotRequestsGame({ lang = "el", onComplete, difficulty = 3 }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [availableItems, setAvailableItems] = useState([]);
  const [givenItems, setGivenItems] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
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

  const TARGET_ROUNDS = 10; // 10 αιτήματα

  const roundsData = {
    el: [
      {
        id: 1,
        request: "Δώσε μου 3 μπάλες",
        emoji: "⚽",
        itemName: "μπάλες",
        requestedCount: 3,
        availableCount: 6,
        color: "#EF4444"
      },
      {
        id: 2,
        request: "Δώσε μου 4 αστέρια",
        emoji: "⭐",
        itemName: "αστέρια",
        requestedCount: 4,
        availableCount: 7,
        color: "#EAB308"
      },
      {
        id: 3,
        request: "Δώσε μου 2 καρδιές",
        emoji: "❤️",
        itemName: "καρδιές",
        requestedCount: 2,
        availableCount: 5,
        color: "#EC4899"
      },
      {
        id: 4,
        request: "Δώσε μου 5 λουλούδια",
        emoji: "🌸",
        itemName: "λουλούδια",
        requestedCount: 5,
        availableCount: 8,
        color: "#A855F7"
      },
      {
        id: 5,
        request: "Δώσε μου 3 μήλα",
        emoji: "🍎",
        itemName: "μήλα",
        requestedCount: 3,
        availableCount: 6,
        color: "#EF4444"
      },
      {
        id: 6,
        request: "Δώσε μου 4 αυτοκίνητα",
        emoji: "🚗",
        itemName: "αυτοκίνητα",
        requestedCount: 4,
        availableCount: 7,
        color: "#3B82F6"
      },
      {
        id: 7,
        request: "Δώσε μου 2 δέντρα",
        emoji: "🌲",
        itemName: "δέντρα",
        requestedCount: 2,
        availableCount: 5,
        color: "#22C55E"
      },
      {
        id: 8,
        request: "Δώσε μου 5 μπαλόνια",
        emoji: "🎈",
        itemName: "μπαλόνια",
        requestedCount: 5,
        availableCount: 8,
        color: "#06B6D4"
      },
      {
        id: 9,
        request: "Δώσε μου 3 βιβλία",
        emoji: "📚",
        itemName: "βιβλία",
        requestedCount: 3,
        availableCount: 6,
        color: "#8B5CF6"
      },
      {
        id: 10,
        request: "Δώσε μου 4 κύκλους",
        emoji: "🔵",
        itemName: "κύκλους",
        requestedCount: 4,
        availableCount: 7,
        color: "#3B82F6"
      }
    ],
    en: [
      {
        id: 1,
        request: "Give me 3 balls",
        emoji: "⚽",
        itemName: "balls",
        requestedCount: 3,
        availableCount: 6,
        color: "#EF4444"
      },
      {
        id: 2,
        request: "Give me 4 stars",
        emoji: "⭐",
        itemName: "stars",
        requestedCount: 4,
        availableCount: 7,
        color: "#EAB308"
      },
      {
        id: 3,
        request: "Give me 2 hearts",
        emoji: "❤️",
        itemName: "hearts",
        requestedCount: 2,
        availableCount: 5,
        color: "#EC4899"
      },
      {
        id: 4,
        request: "Give me 5 flowers",
        emoji: "🌸",
        itemName: "flowers",
        requestedCount: 5,
        availableCount: 8,
        color: "#A855F7"
      },
      {
        id: 5,
        request: "Give me 3 apples",
        emoji: "🍎",
        itemName: "apples",
        requestedCount: 3,
        availableCount: 6,
        color: "#EF4444"
      },
      {
        id: 6,
        request: "Give me 4 cars",
        emoji: "🚗",
        itemName: "cars",
        requestedCount: 4,
        availableCount: 7,
        color: "#3B82F6"
      },
      {
        id: 7,
        request: "Give me 2 trees",
        emoji: "🌲",
        itemName: "trees",
        requestedCount: 2,
        availableCount: 5,
        color: "#22C55E"
      },
      {
        id: 8,
        request: "Give me 5 balloons",
        emoji: "🎈",
        itemName: "balloons",
        requestedCount: 5,
        availableCount: 8,
        color: "#06B6D4"
      },
      {
        id: 9,
        request: "Give me 3 books",
        emoji: "📚",
        itemName: "books",
        requestedCount: 3,
        availableCount: 6,
        color: "#8B5CF6"
      },
      {
        id: 10,
        request: "Give me 4 circles",
        emoji: "🔵",
        itemName: "circles",
        requestedCount: 4,
        availableCount: 7,
        color: "#3B82F6"
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
    // Initialize items when round changes
    const items = Array.from({ length: round.availableCount }, (_, i) => ({
      id: i + 1,
      emoji: round.emoji
    }));
    setAvailableItems(items);
    setGivenItems([]);
    setShowAnswer(false);
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🤖", "✅"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const speakRequest = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(round.request);
      utterance.lang = lang === 'el' ? 'el-GR' : 'en-US';
      utterance.rate = 0.75;
      utterance.pitch = 1.1;
      const voice = VoiceService.getVoice(lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    // Speak request automatically when round changes
    const timer = setTimeout(() => {
      speakRequest();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentRound]);

  const handleDragStart = (item, source) => {
    setDraggedItem({ item, source });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropToRobot = () => {
    if (!draggedItem) return;
    if (draggedItem.source === 'given') return; // Already given

    const { item } = draggedItem;

    // Remove from available
    setAvailableItems(prev => prev.filter(i => i.id !== item.id));

    // Add to given
    setGivenItems(prev => [...prev, item]);

    setDraggedItem(null);
  };

  const handleDropToAvailable = () => {
    if (!draggedItem) return;
    if (draggedItem.source === 'available') return; // Already there

    const { item } = draggedItem;

    // Remove from given
    setGivenItems(prev => prev.filter(i => i.id !== item.id));

    // Add back to available
    setAvailableItems(prev => [...prev, item]);

    setDraggedItem(null);
  };

  const handleCheckAnswer = () => {
    const isCorrect = givenItems.length === round.requestedCount;

    setShowAnswer(true);

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Robot Requests Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Robot Requests Game",
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
              onComplete({ score: newScore, total: TARGET_ROUNDS });
            }
          }, NEXT_DELAY);
        }
      }, NEXT_DELAY);
    } else {
      wrongSoundRef.current?.play().catch(() => {});

      setTimeout(() => {
        setShowAnswer(false);
      }, WRONG_DELAY);
    }
  };

  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Αιτήματα Ρομπότ" : "Robot Requests"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Αίτημα ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Request ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            🤖 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Robot Request */}
      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4" style={{ borderColor: round.color }}>
          <div className="text-9xl mb-3 animate-bounce">🤖</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">
            {round.request}
          </h2>

          <button
            onClick={speakRequest}
            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-lg font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>
        </div>
      </div>

      {/* Robot's Box - Drop Zone */}
      <div className="max-w-4xl mx-auto mb-6">
        <div
          onDragOver={handleDragOver}
          onDrop={handleDropToRobot}
          className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 min-h-[200px]"
          style={{ borderColor: round.color }}
        >
          <div className="text-center mb-4">
            <p className="text-2xl font-bold text-slate-800 mb-2">
              {lang === "el" ? "Το κουτί του ρομπότ" : "Robot's Box"}
            </p>
            <p className="text-xl text-slate-600">
              {lang === "el"
                ? `${givenItems.length} / ${round.requestedCount} ${round.itemName}`
                : `${givenItems.length} / ${round.requestedCount} ${round.itemName}`}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 min-h-[100px]">
            {givenItems.map((item) => (
              <div
                key={item.id}
                draggable={!showAnswer}
                onDragStart={() => handleDragStart(item, 'given')}
                className={`
                  text-6xl transition-all duration-300
                  ${!showAnswer ? 'cursor-move hover:scale-110' : 'cursor-not-allowed'}
                  ${draggedItem?.item.id === item.id ? 'opacity-50' : 'opacity-100'}
                `}
              >
                {item.emoji}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Available Items Area */}
      <div className="max-w-6xl mx-auto mb-6">
        <div
          onDragOver={handleDragOver}
          onDrop={handleDropToAvailable}
          className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-slate-300 min-h-[150px]"
        >
          <p className="text-center text-xl font-bold text-slate-700 mb-4">
            {lang === "el" ? "Διαθέσιμα Αντικείμενα" : "Available Items"}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {availableItems.map((item) => (
              <div
                key={item.id}
                draggable={!showAnswer}
                onDragStart={() => handleDragStart(item, 'available')}
                className={`
                  text-6xl transition-all duration-300
                  ${!showAnswer ? 'cursor-move hover:scale-110' : 'cursor-not-allowed opacity-70'}
                  ${draggedItem?.item.id === item.id ? 'opacity-50' : 'opacity-100'}
                `}
              >
                {item.emoji}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Check Button */}
      {!showAnswer && (
        <div className="text-center mb-8">
          <button
            onClick={handleCheckAnswer}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-2xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            ✓ {lang === "el" ? "Έλεγχος" : "Check"}
          </button>
        </div>
      )}

      {showAnswer && (
        <div className="text-center animate-fadeIn">
          {givenItems.length === round.requestedCount ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el"
                  ? `🎉 Τέλεια! Έδωσες ${round.requestedCount} ${round.itemName} στο ρομπότ!`
                  : `🎉 Perfect! You gave ${round.requestedCount} ${round.itemName} to the robot!`}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el"
                  ? `Το ρομπότ ήθελε ${round.requestedCount} ${round.itemName}. Προσπάθησε ξανά!`
                  : `The robot wanted ${round.requestedCount} ${round.itemName}. Try again!`}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-300/80 to-purple-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🤖🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Βοήθησες το ρομπότ σε όλα τα αιτήματα!" : "Perfect! You helped the robot with all requests!"}
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

