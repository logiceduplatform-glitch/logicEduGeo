// src/components/games/exercises_4_5/GettingDressed.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function GettingDressed({ lang = "el", onComplete }) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_SCENARIOS = 5; // 5 σενάρια ντυσίματος

  const scenariosData = {
    el: [
      {
        id: 1,
        title: "Βασικό Ντύσιμο",
        emoji: "👕",
        color: "#3B82F6",
        correctOrder: [1, 2, 3],
        items: [
          { id: 1, emoji: "👖", name: "Παντελόνι", layer: 1 },
          { id: 2, emoji: "👕", name: "Μπλούζα", layer: 2 },
          { id: 3, emoji: "🧥", name: "Μπουφάν", layer: 3 },
        ]
      },
      {
        id: 2,
        title: "Χειμωνιάτικο Ντύσιμο",
        emoji: "🧣",
        color: "#06B6D4",
        correctOrder: [1, 2, 3, 4],
        items: [
          { id: 1, emoji: "👖", name: "Παντελόνι", layer: 1 },
          { id: 2, emoji: "👕", name: "Μπλούζα", layer: 2 },
          { id: 3, emoji: "🧥", name: "Μπουφάν", layer: 3 },
          { id: 4, emoji: "🧣", name: "Κασκόλ", layer: 4 },
        ]
      },
      {
        id: 3,
        title: "Καλοκαιρινό Ντύσιμο",
        emoji: "👕",
        color: "#F59E0B",
        correctOrder: [1, 2, 3],
        items: [
          { id: 1, emoji: "🩳", name: "Σορτς", layer: 1 },
          { id: 2, emoji: "👕", name: "Μπλουζάκι", layer: 2 },
          { id: 3, emoji: "🧢", name: "Καπέλο", layer: 3 },
        ]
      },
      {
        id: 4,
        title: "Ντύσιμο για Σχολείο",
        emoji: "🎒",
        color: "#10B981",
        correctOrder: [1, 2, 3, 4, 5],
        items: [
          { id: 1, emoji: "🩲", name: "Εσώρουχο", layer: 1 },
          { id: 2, emoji: "👖", name: "Παντελόνι", layer: 2 },
          { id: 3, emoji: "👕", name: "Μπλούζα", layer: 3 },
          { id: 4, emoji: "👟", name: "Παπούτσια", layer: 4 },
          { id: 5, emoji: "🎒", name: "Τσάντα", layer: 5 },
        ]
      },
      {
        id: 5,
        title: "Ντύσιμο με Αξεσουάρ",
        emoji: "🧤",
        color: "#8B5CF6",
        correctOrder: [1, 2, 3, 4],
        items: [
          { id: 1, emoji: "👖", name: "Παντελόνι", layer: 1 },
          { id: 2, emoji: "👕", name: "Μπλούζα", layer: 2 },
          { id: 3, emoji: "🧥", name: "Ζακέτα", layer: 3 },
          { id: 4, emoji: "🧤", name: "Γάντια", layer: 4 },
        ]
      }
    ],
    en: [
      {
        id: 1,
        title: "Basic Dressing",
        emoji: "👕",
        color: "#3B82F6",
        correctOrder: [1, 2, 3],
        items: [
          { id: 1, emoji: "👖", name: "Pants", layer: 1 },
          { id: 2, emoji: "👕", name: "Shirt", layer: 2 },
          { id: 3, emoji: "🧥", name: "Jacket", layer: 3 },
        ]
      },
      {
        id: 2,
        title: "Winter Dressing",
        emoji: "🧣",
        color: "#06B6D4",
        correctOrder: [1, 2, 3, 4],
        items: [
          { id: 1, emoji: "👖", name: "Pants", layer: 1 },
          { id: 2, emoji: "👕", name: "Shirt", layer: 2 },
          { id: 3, emoji: "🧥", name: "Jacket", layer: 3 },
          { id: 4, emoji: "🧣", name: "Scarf", layer: 4 },
        ]
      },
      {
        id: 3,
        title: "Summer Dressing",
        emoji: "👕",
        color: "#F59E0B",
        correctOrder: [1, 2, 3],
        items: [
          { id: 1, emoji: "🩳", name: "Shorts", layer: 1 },
          { id: 2, emoji: "👕", name: "T-shirt", layer: 2 },
          { id: 3, emoji: "🧢", name: "Cap", layer: 3 },
        ]
      },
      {
        id: 4,
        title: "Dressing for School",
        emoji: "🎒",
        color: "#10B981",
        correctOrder: [1, 2, 3, 4, 5],
        items: [
          { id: 1, emoji: "🩲", name: "Underwear", layer: 1 },
          { id: 2, emoji: "👖", name: "Pants", layer: 2 },
          { id: 3, emoji: "👕", name: "Shirt", layer: 3 },
          { id: 4, emoji: "👟", name: "Shoes", layer: 4 },
          { id: 5, emoji: "🎒", name: "Backpack", layer: 5 },
        ]
      },
      {
        id: 5,
        title: "Dressing with Accessories",
        emoji: "🧤",
        color: "#8B5CF6",
        correctOrder: [1, 2, 3, 4],
        items: [
          { id: 1, emoji: "👖", name: "Pants", layer: 1 },
          { id: 2, emoji: "👕", name: "Shirt", layer: 2 },
          { id: 3, emoji: "🧥", name: "Cardigan", layer: 3 },
          { id: 4, emoji: "🧤", name: "Gloves", layer: 4 },
        ]
      }
    ]
  };

  const scenarios = scenariosData[lang];
  const scenario = scenarios[currentScenario];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    const shuffled = [...scenario.items].sort(() => Math.random() - 0.5);
    setAvailableItems(shuffled);
    setSequence([]);
    setShowFeedback(false);
  }, [currentScenario]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "👕", "✅"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("itemId", item.id.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropToSequence = (e, position) => {
    e.preventDefault();
    const itemId = parseInt(e.dataTransfer.getData("itemId"));
    const item = availableItems.find(a => a.id === itemId);

    if (item && !sequence.find(s => s.id === itemId)) {
      const newSequence = [...sequence];
      newSequence[position] = item;
      setSequence(newSequence);
      setAvailableItems(availableItems.filter(a => a.id !== itemId));
    }
  };

  const handleDropToAvailable = (e) => {
    e.preventDefault();
    const itemId = parseInt(e.dataTransfer.getData("itemId"));
    const item = sequence.find(s => s && s.id === itemId);

    if (item) {
      setSequence(sequence.map(s => s && s.id === itemId ? null : s));
      setAvailableItems([...availableItems, item]);
    }
  };

  const handleCheck = () => {
    const userOrder = sequence.filter(s => s !== null && s !== undefined).map(s => s.id);
    const correct = JSON.stringify(userOrder) === JSON.stringify(scenario.correctOrder);

    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Getting Dressed",
        score: newScore,
        total: TARGET_SCENARIOS,
        index: currentScenario + 1,
      });

      completeQuiz({
        title: "Getting Dressed",
        score: 1,
        total: 1,
      });

      setTimeout(() => {
        if (currentScenario + 1 < TARGET_SCENARIOS) {
          setCurrentScenario(prev => prev + 1);
        } else {
          createCelebrationEmojis();
          setShowCelebration(true);
          setTimeout(() => {
            if (onComplete) {
              onComplete();
            }
          }, 2500);
        }
      }, 2500);
    } else {
      wrongSoundRef.current?.play().catch(() => {});
      setTimeout(() => {
        setShowFeedback(false);
      }, 1500);
    }
  };

  const handleReset = () => {
    setAvailableItems([...scenario.items].sort(() => Math.random() - 0.5));
    setSequence([]);
    setShowFeedback(false);
  };

  const progressPercent = Math.round(((currentScenario + 1) / TARGET_SCENARIOS) * 100);
  const sequenceProgress = Math.round((sequence.filter(s => s).length / scenario.items.length) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-emerald-100 via-lime-100 to-green-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Ντύσιμο σε Σωστή Σειρά" : "Getting Dressed in Order"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Σενάριο ${currentScenario + 1}/${TARGET_SCENARIOS}: ${scenario.title}`
                : `Scenario ${currentScenario + 1}/${TARGET_SCENARIOS}: ${scenario.title}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            👕 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-lime-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-8 shadow-xl border-4" style={{ borderColor: scenario.color }}>
          <div className="text-9xl mb-4">{scenario.emoji}</div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: scenario.color }}>
            {scenario.title}
          </h2>
          <p className="text-xl text-slate-600">
            {lang === "el" ? "Σύρε τα ρούχα στη σωστή σειρά που τα φοράμε!" : "Drag clothes in the correct order we wear them!"}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mb-8">
        {/* Sequence Area */}
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-slate-200 mb-8">
          <h4 className="text-2xl font-bold text-slate-700 mb-6 text-center">
            {lang === "el" ? "Σειρά Ντυσίματος" : "Dressing Sequence"}
          </h4>
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${scenario.items.length}, 1fr)` }}>
            {scenario.items.map((_, index) => {
              const item = sequence[index];
              return (
                <div
                  key={index}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropToSequence(e, index)}
                  className={`
                    relative p-6 rounded-2xl border-4 border-dashed min-h-[200px] flex flex-col items-center justify-center transition-all duration-300
                    ${item ? "bg-green-50 border-green-400" : "bg-blue-50 border-blue-300"}
                    ${showFeedback && isCorrect && item ? "bg-green-100 border-green-500" : ""}
                    ${showFeedback && !isCorrect && item ? "bg-red-100 border-red-500 animate-shake" : ""}
                  `}
                >
                  <div className="absolute -top-4 left-4 bg-white rounded-full px-4 py-2 border-2 border-slate-300">
                    <span className="text-xl font-bold text-slate-700">{index + 1}</span>
                  </div>
                  {item ? (
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      className="text-center cursor-move"
                    >
                      <div className="text-8xl mb-2">{item.emoji}</div>
                      <p className="text-lg font-bold text-slate-800">{item.name}</p>
                    </div>
                  ) : (
                    <div className="text-6xl text-slate-300">?</div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300 ease-out"
                  style={{
                    width: `${sequenceProgress}%`,
                    backgroundColor: scenario.color
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-600">
                {sequence.filter(s => s).length} / {scenario.items.length}
              </span>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleCheck}
                disabled={sequence.filter(s => s).length !== scenario.items.length || showFeedback}
                className={`
                  px-8 py-4 rounded-full text-xl font-bold shadow-lg transition-all duration-300 transform
                  ${sequence.filter(s => s).length === scenario.items.length && !showFeedback
                    ? "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:scale-105 cursor-pointer"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                  }
                `}
              >
                ✓ {lang === "el" ? "Έλεγχος" : "Check"}
              </button>

              <button
                onClick={handleReset}
                disabled={showFeedback && isCorrect}
                className="px-8 py-4 bg-slate-500 text-white text-xl font-bold rounded-full hover:bg-slate-600 transition-colors shadow-lg"
              >
                🔄 {lang === "el" ? "Επανεκκίνηση" : "Reset"}
              </button>
            </div>
          </div>
        </div>

        {/* Available Items */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDropToAvailable}
          className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-slate-200"
        >
          <h4 className="text-2xl font-bold text-slate-700 mb-6 text-center">
            {lang === "el" ? "Διαθέσιμα Ρούχα" : "Available Clothes"}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {availableItems.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                className="p-6 rounded-2xl border-4 border-slate-300 bg-white hover:border-emerald-400 hover:scale-105 transition-all duration-300 cursor-move"
              >
                <div className="text-center">
                  <div className="text-7xl mb-2">{item.emoji}</div>
                  <p className="text-lg font-bold text-slate-800">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showFeedback && (
        <div className="text-center animate-fadeIn">
          {isCorrect ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el" ? "🎉 Τέλεια! Σωστή σειρά ντυσίματος!" : "🎉 Perfect! Correct dressing order!"}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el" ? "Δοκίμασε ξανά! Σκέψου τη σειρά." : "Try again! Think about the order."}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/80 to-lime-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">👕🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Μπράβο! Ξέρεις να ντύνεσαι μόνος σου!" : "Great! You know how to dress yourself!"}
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

