// src/components/games/exercises_4_5/SizeSequence.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function SizeSequence({ lang = "el", onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [slots, setSlots] = useState([null, null, null, null]);
  const [availableItems, setAvailableItems] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const dropSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_ROUNDS = 6; // 6 γύρους

  const roundsData = {
    el: [
      {
        id: 1,
        theme: "Μπάλες",
        items: [
          { id: 1, emoji: "🔴", size: 1, label: "Μικρή", scale: "text-4xl" },
          { id: 2, emoji: "🟠", size: 2, label: "Μεσαία", scale: "text-5xl" },
          { id: 3, emoji: "🟡", size: 3, label: "Μεγάλη", scale: "text-6xl" },
          { id: 4, emoji: "🟢", size: 4, label: "Τεράστια", scale: "text-7xl" },
        ]
      },
      {
        id: 2,
        theme: "Αστέρια",
        items: [
          { id: 1, emoji: "⭐", size: 1, label: "Μικρό", scale: "text-4xl" },
          { id: 2, emoji: "⭐", size: 2, label: "Μεσαίο", scale: "text-5xl" },
          { id: 3, emoji: "⭐", size: 3, label: "Μεγάλο", scale: "text-6xl" },
          { id: 4, emoji: "⭐", size: 4, label: "Τεράστιο", scale: "text-7xl" },
        ]
      },
      {
        id: 3,
        theme: "Δέντρα",
        items: [
          { id: 1, emoji: "🌱", size: 1, label: "Φυτράκι", scale: "text-4xl" },
          { id: 2, emoji: "🌿", size: 2, label: "Θάμνος", scale: "text-5xl" },
          { id: 3, emoji: "🌳", size: 3, label: "Δέντρο", scale: "text-6xl" },
          { id: 4, emoji: "🌲", size: 4, label: "Μεγάλο Δέντρο", scale: "text-7xl" },
        ]
      },
      {
        id: 4,
        theme: "Ζώα",
        items: [
          { id: 1, emoji: "🐜", size: 1, label: "Μυρμήγκι", scale: "text-3xl" },
          { id: 2, emoji: "🐱", size: 2, label: "Γάτα", scale: "text-5xl" },
          { id: 3, emoji: "🐕", size: 3, label: "Σκύλος", scale: "text-6xl" },
          { id: 4, emoji: "🐘", size: 4, label: "Ελέφαντας", scale: "text-8xl" },
        ]
      },
      {
        id: 5,
        theme: "Καρδιές",
        items: [
          { id: 1, emoji: "💙", size: 1, label: "Μικρή", scale: "text-4xl" },
          { id: 2, emoji: "💚", size: 2, label: "Μεσαία", scale: "text-5xl" },
          { id: 3, emoji: "💛", size: 3, label: "Μεγάλη", scale: "text-6xl" },
          { id: 4, emoji: "❤️", size: 4, label: "Τεράστια", scale: "text-7xl" },
        ]
      },
      {
        id: 6,
        theme: "Φρούτα",
        items: [
          { id: 1, emoji: "🍒", size: 1, label: "Κεράσι", scale: "text-4xl" },
          { id: 2, emoji: "🍎", size: 2, label: "Μήλο", scale: "text-5xl" },
          { id: 3, emoji: "🍊", size: 3, label: "Πορτοκάλι", scale: "text-6xl" },
          { id: 4, emoji: "🍉", size: 4, label: "Καρπούζι", scale: "text-7xl" },
        ]
      }
    ],
    en: [
      {
        id: 1,
        theme: "Balls",
        items: [
          { id: 1, emoji: "🔴", size: 1, label: "Small", scale: "text-4xl" },
          { id: 2, emoji: "🟠", size: 2, label: "Medium", scale: "text-5xl" },
          { id: 3, emoji: "🟡", size: 3, label: "Large", scale: "text-6xl" },
          { id: 4, emoji: "🟢", size: 4, label: "Huge", scale: "text-7xl" },
        ]
      },
      {
        id: 2,
        theme: "Stars",
        items: [
          { id: 1, emoji: "⭐", size: 1, label: "Small", scale: "text-4xl" },
          { id: 2, emoji: "⭐", size: 2, label: "Medium", scale: "text-5xl" },
          { id: 3, emoji: "⭐", size: 3, label: "Large", scale: "text-6xl" },
          { id: 4, emoji: "⭐", size: 4, label: "Huge", scale: "text-7xl" },
        ]
      },
      {
        id: 3,
        theme: "Trees",
        items: [
          { id: 1, emoji: "🌱", size: 1, label: "Sprout", scale: "text-4xl" },
          { id: 2, emoji: "🌿", size: 2, label: "Bush", scale: "text-5xl" },
          { id: 3, emoji: "🌳", size: 3, label: "Tree", scale: "text-6xl" },
          { id: 4, emoji: "🌲", size: 4, label: "Big Tree", scale: "text-7xl" },
        ]
      },
      {
        id: 4,
        theme: "Animals",
        items: [
          { id: 1, emoji: "🐜", size: 1, label: "Ant", scale: "text-3xl" },
          { id: 2, emoji: "🐱", size: 2, label: "Cat", scale: "text-5xl" },
          { id: 3, emoji: "🐕", size: 3, label: "Dog", scale: "text-6xl" },
          { id: 4, emoji: "🐘", size: 4, label: "Elephant", scale: "text-8xl" },
        ]
      },
      {
        id: 5,
        theme: "Hearts",
        items: [
          { id: 1, emoji: "💙", size: 1, label: "Small", scale: "text-4xl" },
          { id: 2, emoji: "💚", size: 2, label: "Medium", scale: "text-5xl" },
          { id: 3, emoji: "💛", size: 3, label: "Large", scale: "text-6xl" },
          { id: 4, emoji: "❤️", size: 4, label: "Huge", scale: "text-7xl" },
        ]
      },
      {
        id: 6,
        theme: "Fruits",
        items: [
          { id: 1, emoji: "🍒", size: 1, label: "Cherry", scale: "text-4xl" },
          { id: 2, emoji: "🍎", size: 2, label: "Apple", scale: "text-5xl" },
          { id: 3, emoji: "🍊", size: 3, label: "Orange", scale: "text-6xl" },
          { id: 4, emoji: "🍉", size: 4, label: "Watermelon", scale: "text-7xl" },
        ]
      }
    ]
  };

  const rounds = roundsData[lang];
  const round = rounds[currentRound];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    dropSoundRef.current = new Audio("/sounds/pop.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
    dropSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    // Shuffle items when round changes
    const shuffled = [...round.items].sort(() => Math.random() - 0.5);
    setAvailableItems(shuffled);
    setSlots([null, null, null, null]);
    setFeedback(null);
    setIsChecking(false);
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "📏", "🔢"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleDragStart = (e, item, fromSlot = null) => {
    setDraggedItem({ item, fromSlot });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropOnSlot = (e, slotIndex) => {
    e.preventDefault();
    if (!draggedItem || isChecking) return;

    const { item, fromSlot } = draggedItem;

    // Παίζουμε τον ήχο drop
    dropSoundRef.current?.play().catch(() => {});

    // Αν υπάρχει ήδη κάτι στο slot, το επιστρέφουμε στα available
    if (slots[slotIndex]) {
      setAvailableItems(prev => [...prev, slots[slotIndex]]);
    }

    // Τοποθετούμε το item στο slot
    const newSlots = [...slots];
    newSlots[slotIndex] = item;
    setSlots(newSlots);

    // Αν ήρθε από άλλο slot, το αδειάζουμε
    if (fromSlot !== null) {
      newSlots[fromSlot] = null;
      setSlots(newSlots);
    } else {
      // Αν ήρθε από available, το αφαιρούμε
      setAvailableItems(prev => prev.filter(i => i.id !== item.id));
    }

    setDraggedItem(null);
  };

  const handleDropBackToAvailable = (e) => {
    e.preventDefault();
    if (!draggedItem || isChecking) return;

    const { item, fromSlot } = draggedItem;

    if (fromSlot !== null) {
      // Επιστροφή από slot
      const newSlots = [...slots];
      newSlots[fromSlot] = null;
      setSlots(newSlots);
      setAvailableItems(prev => [...prev, item]);
    }

    setDraggedItem(null);
  };

  const checkSequence = () => {
    if (slots.some(slot => slot === null)) return;

    setIsChecking(true);
    const isCorrect = slots.every((item, index) => item.size === index + 1);

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});
      setFeedback("correct");

      const newScore = score + 1;
      setScore(newScore);

      // Show +1 score popup
      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      // Ενημέρωση progress
      updateProgress({
        title: "Size Sequence",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Size Sequence",
        score: 1,
        total: 1,
      });

      // Πήγαινε στον επόμενο γύρο
      setTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
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
    } else {
      wrongSoundRef.current?.play().catch(() => {});
      setFeedback("wrong");
      setTimeout(() => {
        setFeedback(null);
        setIsChecking(false);
      }, 1500);
    }
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);
  const allPlaced = slots.every(slot => slot !== null);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Σειροθέτηση Μεγεθών" : "Size Sequence"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Γύρος ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Round ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-cyan-600">
            📏 {score}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-teal-500 transition-all duration-500 ease-out"
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
            ? "📏 Βάλε τα από το μικρότερο στο μεγαλύτερο!"
            : "📏 Put them from smallest to largest!"}
        </p>
      </div>

      {/* Game Area */}
      <div className="max-w-5xl mx-auto">
        {/* Sequence Slots */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-2xl font-bold text-cyan-700">
              {lang === "el" ? "Μικρότερο" : "Smallest"}
            </span>
            <span className="text-xl">→</span>
            <span className="text-2xl font-bold text-teal-700">
              {lang === "el" ? "Μεγαλύτερο" : "Largest"}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {slots.map((slot, index) => (
              <div
                key={index}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnSlot(e, index)}
                className={`
                  relative min-h-40 rounded-2xl border-4 border-dashed transition-all duration-300
                  ${slot ? "bg-white border-cyan-400" : "bg-cyan-50 border-cyan-300 hover:border-cyan-500"}
                  ${feedback === "correct" ? "border-green-500 bg-green-50" : ""}
                  ${feedback === "wrong" ? "animate-shake border-red-500 bg-red-50" : ""}
                `}
              >
                {slot ? (
                  <div
                    draggable={!isChecking}
                    onDragStart={(e) => handleDragStart(e, slot, index)}
                    className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
                  >
                    <div className={slot.scale}>
                      {slot.emoji}
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-6xl text-cyan-300">
                    {index + 1}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Check Button */}
        {allPlaced && !isChecking && (
          <div className="text-center mb-8 animate-fadeIn">
            <button
              onClick={checkSequence}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xl font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              {lang === "el" ? "✓ Έλεγχος" : "✓ Check"}
            </button>
          </div>
        )}

        {/* Feedback Message */}
        {feedback && (
          <div className="text-center mb-8 animate-fadeIn">
            {feedback === "correct" ? (
              <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
                <p className="text-3xl font-bold text-green-700">
                  {lang === "el" ? "🎉 Σωστά! Τέλεια σειρά!" : "🎉 Correct! Perfect sequence!"}
                </p>
              </div>
            ) : (
              <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
                <p className="text-3xl font-bold text-red-700">
                  {lang === "el" ? "Δοκίμασε ξανά!" : "Try again!"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Available Items */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDropBackToAvailable}
          className="min-h-32"
        >
          <h4 className="text-xl font-bold text-center mb-4 text-slate-700">
            {lang === "el" ? `${round.theme}` : `${round.theme}`}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {availableItems.map((item) => (
              <div
                key={item.id}
                draggable={!isChecking}
                onDragStart={(e) => handleDragStart(e, item)}
                className="p-6 rounded-2xl border-4 bg-white border-slate-300 hover:border-cyan-400 hover:scale-105 cursor-grab active:cursor-grabbing text-center transition-all duration-300"
              >
                <div className={`${item.scale} mb-2`}>
                  {item.emoji}
                </div>
                <div className="text-sm font-semibold text-slate-700">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/80 to-teal-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">📏🏆</div>
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

