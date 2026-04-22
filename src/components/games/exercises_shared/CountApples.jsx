// src/components/games/exercises_4_5/CountApples.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function CountApples({ lang = "el", onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [tappedItems, setTappedItems] = useState([]);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const [roundComplete, setRoundComplete] = useState(false);
  const tapSoundRef = useRef(null);
  const correctSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_ROUNDS = 8; // 8 γύρους

  const roundsData = {
    el: [
      {
        id: 1,
        count: 3,
        emoji: "🍎",
        label: "μήλα",
        color: "bg-red-100"
      },
      {
        id: 2,
        count: 5,
        emoji: "🍌",
        label: "μπανάνες",
        color: "bg-yellow-100"
      },
      {
        id: 3,
        count: 4,
        emoji: "🍊",
        label: "πορτοκάλια",
        color: "bg-orange-100"
      },
      {
        id: 4,
        count: 6,
        emoji: "🍇",
        label: "σταφύλια",
        color: "bg-purple-100"
      },
      {
        id: 5,
        count: 2,
        emoji: "🍓",
        label: "φράουλες",
        color: "bg-pink-100"
      },
      {
        id: 6,
        count: 7,
        emoji: "🥕",
        label: "καρότα",
        color: "bg-orange-100"
      },
      {
        id: 7,
        count: 8,
        emoji: "🍒",
        label: "κεράσια",
        color: "bg-red-100"
      },
      {
        id: 8,
        count: 10,
        emoji: "⭐",
        label: "αστέρια",
        color: "bg-yellow-100"
      }
    ],
    en: [
      {
        id: 1,
        count: 3,
        emoji: "🍎",
        label: "apples",
        color: "bg-red-100"
      },
      {
        id: 2,
        count: 5,
        emoji: "🍌",
        label: "bananas",
        color: "bg-yellow-100"
      },
      {
        id: 3,
        count: 4,
        emoji: "🍊",
        label: "oranges",
        color: "bg-orange-100"
      },
      {
        id: 4,
        count: 6,
        emoji: "🍇",
        label: "grapes",
        color: "bg-purple-100"
      },
      {
        id: 5,
        count: 2,
        emoji: "🍓",
        label: "strawberries",
        color: "bg-pink-100"
      },
      {
        id: 6,
        count: 7,
        emoji: "🥕",
        label: "carrots",
        color: "bg-orange-100"
      },
      {
        id: 7,
        count: 8,
        emoji: "🍒",
        label: "cherries",
        color: "bg-red-100"
      },
      {
        id: 8,
        count: 10,
        emoji: "⭐",
        label: "stars",
        color: "bg-yellow-100"
      }
    ]
  };

  const rounds = roundsData[lang];
  const round = rounds[currentRound];

  useEffect(() => {
    tapSoundRef.current = new Audio("/sounds/pop.mp3");
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    tapSoundRef.current.preload = "auto";
    correctSoundRef.current.preload = "auto";
  }, []);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🔢", "👏"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const greekNumbers = {
    1: "ένα",
    2: "δύο",
    3: "τρία",
    4: "τέσσερα",
    5: "πέντε",
    6: "έξι",
    7: "επτά",
    8: "οκτώ",
    9: "εννέα",
    10: "δέκα"
  };

  const speakNumber = (number) => {
    window.speechSynthesis.cancel();
    const textToSpeak = lang === "el" ? greekNumbers[number] : number.toString();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang === "el" ? "el-GR" : "en-US";
    utterance.rate = lang === "el" ? 0.6 : 0.75;
    utterance.pitch = 1.2;
    const voice = VoiceService.getVoice(lang);
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };

  const handleItemTap = (index) => {
    if (tappedItems.includes(index) || roundComplete) return;

    tapSoundRef.current?.play().catch(() => {});

    const newTapped = [...tappedItems, index];
    setTappedItems(newTapped);

    // Άκουσε τον αριθμό που μετρήσαμε
    speakNumber(newTapped.length);

    // Έλεγχος αν τελείωσε το μέτρημα
    if (newTapped.length === round.count) {
      correctSoundRef.current?.play().catch(() => {});
      setRoundComplete(true);

      const newScore = score + 1;
      setScore(newScore);

      // Show +1 score popup
      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      // Ενημέρωση progress
      updateProgress({
        title: "Count Apples",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Count Apples",
        score: 1,
        total: 1,
      });

      // Πήγαινε στον επόμενο γύρο
      setTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
          setTappedItems([]);
          setRoundComplete(false);
        } else {
          // Τελείωσαν όλοι οι γύροι
          createCelebrationEmojis();
          setShowCelebration(true);
          setTimeout(() => {
            if (onComplete) {
              onComplete();
            }
          }, 2500);
        }
      }, 2000);
    }
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-green-100 via-teal-100 to-cyan-100 p-4 sm:p-8 rounded-xl overflow-hidden">
      {/* Celebration Emojis */}
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

      {/* Score Popup */}
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

      {/* Score Bar */}
      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Μέτρα τα Αντικείμενα" : "Count the Objects"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Γύρος ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Round ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-green-600">
            🔢 {score}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-teal-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mb-8">
        <p className="text-xl text-slate-700 font-semibold bg-white/80 backdrop-blur rounded-xl p-4 inline-block shadow-lg">
          {lang === "el"
            ? `👆 Πάτα τα ${round.label} και μέτρησέ τα!`
            : `👆 Tap the ${round.label} and count them!`}
        </p>
      </div>

      {/* Counter Display */}
      <div className="text-center mb-8">
        <div className="inline-block bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8 border-4 border-green-300">
          <div className="text-9xl font-bold text-green-600 mb-2">
            {tappedItems.length}
          </div>
          <p className="text-2xl font-bold text-slate-700">
            / {round.count}
          </p>
        </div>
      </div>

      {/* Items Grid */}
      <div className="max-w-4xl mx-auto">
        <div className={`grid gap-4 ${
          round.count <= 4 ? 'grid-cols-2' :
          round.count <= 6 ? 'grid-cols-3' :
          round.count <= 9 ? 'grid-cols-3' : 'grid-cols-4'
        }`}>
          {Array.from({ length: round.count }, (_, index) => {
            const isTapped = tappedItems.includes(index);

            return (
              <button
                key={index}
                onClick={() => handleItemTap(index)}
                disabled={isTapped || roundComplete}
                className={`
                  relative p-8 rounded-2xl border-4 transition-all duration-300 transform
                  ${isTapped ? `${round.color} border-green-500 scale-90 opacity-70` : ""}
                  ${!isTapped && !roundComplete ? "bg-white border-slate-300 hover:border-green-400 hover:scale-110 cursor-pointer animate-bounce" : ""}
                  ${roundComplete && !isTapped ? "opacity-50" : ""}
                `}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="text-7xl">{round.emoji}</div>
                {isTapped && (
                  <div className="absolute -top-3 -right-3 text-4xl animate-bounce bg-white rounded-full p-1">
                    ✅
                  </div>
                )}
                {isTapped && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl font-bold text-green-600 opacity-50">
                    {tappedItems.indexOf(index) + 1}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Completion Message */}
      {roundComplete && (
        <div className="mt-8 text-center animate-fadeIn">
          <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-3xl p-8 inline-block border-4 border-green-400 shadow-2xl">
            <div className="text-6xl mb-4">{round.emoji}</div>
            <h2 className="text-5xl font-bold text-green-700 mb-4">
              {round.count}
            </h2>
            <p className="text-2xl font-bold text-green-600">
              {lang === "el"
                ? `🎉 Μπράβο! Μέτρησες ${round.count} ${round.label}!`
                : `🎉 Great! You counted ${round.count} ${round.label}!`}
            </p>
          </div>
        </div>
      )}

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-300/80 to-teal-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🔢🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια!" : "Perfect!"}
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

