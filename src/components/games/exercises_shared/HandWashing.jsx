// src/components/games/exercises_4_5/HandWashing.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function HandWashing({ lang = "el", onComplete }) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [availableSteps, setAvailableSteps] = useState([]);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_SCENARIOS = 3; // 3 σενάρια πλυσίματος

  const scenariosData = {
    el: [
      {
        id: 1,
        title: "Βασικό Πλύσιμο Χεριών",
        emoji: "🧼",
        color: "#06B6D4",
        correctOrder: [1, 2, 3, 4, 5, 6],
        steps: [
          { id: 1, emoji: "💧", name: "Ανοίγω τη βρύση", description: "Βάζω νερό" },
          { id: 2, emoji: "🤲", name: "Βρέχω τα χέρια", description: "Με χλιαρό νερό" },
          { id: 3, emoji: "🧼", name: "Βάζω σαπούνι", description: "Στις παλάμες" },
          { id: 4, emoji: "👏", name: "Τρίβω καλά", description: "20 δευτερόλεπτα" },
          { id: 5, emoji: "💦", name: "Ξεπλένω", description: "Με καθαρό νερό" },
          { id: 6, emoji: "🧻", name: "Σκουπίζω", description: "Με πετσέτα" },
        ]
      },
      {
        id: 2,
        title: "Πλύσιμο Πριν το Φαγητό",
        emoji: "🍽️",
        color: "#10B981",
        correctOrder: [1, 2, 3, 4, 5],
        steps: [
          { id: 1, emoji: "💧", name: "Ανοίγω νερό", description: "Χλιαρό νερό" },
          { id: 2, emoji: "🧼", name: "Σαπουνίζω", description: "Παντού στα χέρια" },
          { id: 3, emoji: "🤲", name: "Τρίβω μεταξύ δαχτύλων", description: "Και τα νύχια" },
          { id: 4, emoji: "💦", name: "Ξεβγάζω καλά", description: "Όλο το σαπούνι" },
          { id: 5, emoji: "🧻", name: "Στεγνώνω", description: "Καθαρή πετσέτα" },
        ]
      },
      {
        id: 3,
        title: "Πλύσιμο Μετά την Τουαλέτα",
        emoji: "🚽",
        color: "#8B5CF6",
        correctOrder: [1, 2, 3, 4, 5, 6, 7],
        steps: [
          { id: 1, emoji: "🚽", name: "Τραβάω το καζανάκι", description: "Πρώτα!" },
          { id: 2, emoji: "💧", name: "Ανοίγω βρύση", description: "Ζεστό νερό" },
          { id: 3, emoji: "🤲", name: "Βρέχω χέρια", description: "Καλά" },
          { id: 4, emoji: "🧼", name: "Πολύ σαπούνι", description: "Παντού" },
          { id: 5, emoji: "👏", name: "Τρίβω 30 δευτερόλεπτα", description: "Παντού!" },
          { id: 6, emoji: "💦", name: "Ξεπλένω πολύ καλά", description: "Όλο το σαπούνι" },
          { id: 7, emoji: "🧻", name: "Σκουπίζω καλά", description: "Στεγνά χέρια" },
        ]
      }
    ],
    en: [
      {
        id: 1,
        title: "Basic Hand Washing",
        emoji: "🧼",
        color: "#06B6D4",
        correctOrder: [1, 2, 3, 4, 5, 6],
        steps: [
          { id: 1, emoji: "💧", name: "Turn on tap", description: "Get water" },
          { id: 2, emoji: "🤲", name: "Wet hands", description: "With warm water" },
          { id: 3, emoji: "🧼", name: "Apply soap", description: "On palms" },
          { id: 4, emoji: "👏", name: "Rub well", description: "20 seconds" },
          { id: 5, emoji: "💦", name: "Rinse", description: "With clean water" },
          { id: 6, emoji: "🧻", name: "Dry", description: "With towel" },
        ]
      },
      {
        id: 2,
        title: "Washing Before Eating",
        emoji: "🍽️",
        color: "#10B981",
        correctOrder: [1, 2, 3, 4, 5],
        steps: [
          { id: 1, emoji: "💧", name: "Turn on water", description: "Warm water" },
          { id: 2, emoji: "🧼", name: "Soap up", description: "All over hands" },
          { id: 3, emoji: "🤲", name: "Rub between fingers", description: "And nails" },
          { id: 4, emoji: "💦", name: "Rinse well", description: "All soap off" },
          { id: 5, emoji: "🧻", name: "Dry", description: "Clean towel" },
        ]
      },
      {
        id: 3,
        title: "Washing After Bathroom",
        emoji: "🚽",
        color: "#8B5CF6",
        correctOrder: [1, 2, 3, 4, 5, 6, 7],
        steps: [
          { id: 1, emoji: "🚽", name: "Flush toilet", description: "First!" },
          { id: 2, emoji: "💧", name: "Turn on tap", description: "Hot water" },
          { id: 3, emoji: "🤲", name: "Wet hands", description: "Well" },
          { id: 4, emoji: "🧼", name: "Lots of soap", description: "Everywhere" },
          { id: 5, emoji: "👏", name: "Rub 30 seconds", description: "Everywhere!" },
          { id: 6, emoji: "💦", name: "Rinse very well", description: "All soap" },
          { id: 7, emoji: "🧻", name: "Dry well", description: "Dry hands" },
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
    const shuffled = [...scenario.steps].sort(() => Math.random() - 0.5);
    setAvailableSteps(shuffled);
    setSequence([]);
    setShowFeedback(false);
  }, [currentScenario]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🧼", "✅"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleDragStart = (e, step) => {
    e.dataTransfer.setData("stepId", step.id.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropToSequence = (e, position) => {
    e.preventDefault();
    const stepId = parseInt(e.dataTransfer.getData("stepId"));
    const step = availableSteps.find(s => s.id === stepId);

    if (step && !sequence.find(s => s.id === stepId)) {
      const newSequence = [...sequence];
      newSequence[position] = step;
      setSequence(newSequence);
      setAvailableSteps(availableSteps.filter(s => s.id !== stepId));
    }
  };

  const handleDropToAvailable = (e) => {
    e.preventDefault();
    const stepId = parseInt(e.dataTransfer.getData("stepId"));
    const step = sequence.find(s => s && s.id === stepId);

    if (step) {
      setSequence(sequence.map(s => s && s.id === stepId ? null : s));
      setAvailableSteps([...availableSteps, step]);
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
        title: "Hand Washing",
        score: newScore,
        total: TARGET_SCENARIOS,
        index: currentScenario + 1,
      });

      completeQuiz({
        title: "Hand Washing",
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
    setAvailableSteps([...scenario.steps].sort(() => Math.random() - 0.5));
    setSequence([]);
    setShowFeedback(false);
  };

  const progressPercent = Math.round(((currentScenario + 1) / TARGET_SCENARIOS) * 100);
  const sequenceProgress = Math.round((sequence.filter(s => s).length / scenario.steps.length) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-teal-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Πλύσιμο Χεριών" : "Hand Washing"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Σενάριο ${currentScenario + 1}/${TARGET_SCENARIOS}: ${scenario.title}`
                : `Scenario ${currentScenario + 1}/${TARGET_SCENARIOS}: ${scenario.title}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-cyan-600">
            🧼 {score}
          </div>
        </div>

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

      <div className="text-center mb-8">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-8 shadow-xl border-4" style={{ borderColor: scenario.color }}>
          <div className="text-9xl mb-4">{scenario.emoji}</div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: scenario.color }}>
            {scenario.title}
          </h2>
          <p className="text-xl text-slate-600">
            {lang === "el" ? "Σύρε τα βήματα στη σωστή σειρά!" : "Drag the steps in the correct order!"}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mb-8">
        {/* Sequence Area */}
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-slate-200 mb-8">
          <h4 className="text-2xl font-bold text-slate-700 mb-6 text-center">
            {lang === "el" ? "Σειρά Βημάτων" : "Steps Sequence"}
          </h4>
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(150px, 1fr))` }}>
            {scenario.steps.map((_, index) => {
              const step = sequence[index];
              return (
                <div
                  key={index}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropToSequence(e, index)}
                  className={`
                    relative p-4 rounded-2xl border-4 border-dashed min-h-[180px] flex flex-col items-center justify-center transition-all duration-300
                    ${step ? "bg-green-50 border-green-400" : "bg-blue-50 border-blue-300"}
                    ${showFeedback && isCorrect && step ? "bg-green-100 border-green-500" : ""}
                    ${showFeedback && !isCorrect && step ? "bg-red-100 border-red-500 animate-shake" : ""}
                  `}
                >
                  <div className="absolute -top-3 -left-3 bg-white rounded-full w-10 h-10 flex items-center justify-center border-2 border-slate-300 shadow-md">
                    <span className="text-lg font-bold text-slate-700">{index + 1}</span>
                  </div>
                  {step ? (
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, step)}
                      className="text-center cursor-move"
                    >
                      <div className="text-6xl mb-2">{step.emoji}</div>
                      <p className="text-sm font-bold text-slate-800">{step.name}</p>
                      <p className="text-xs text-slate-600 mt-1">{step.description}</p>
                    </div>
                  ) : (
                    <div className="text-5xl text-slate-300">?</div>
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
                {sequence.filter(s => s).length} / {scenario.steps.length}
              </span>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleCheck}
                disabled={sequence.filter(s => s).length !== scenario.steps.length || showFeedback}
                className={`
                  px-8 py-4 rounded-full text-xl font-bold shadow-lg transition-all duration-300 transform
                  ${sequence.filter(s => s).length === scenario.steps.length && !showFeedback
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

        {/* Available Steps */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDropToAvailable}
          className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-slate-200"
        >
          <h4 className="text-2xl font-bold text-slate-700 mb-6 text-center">
            {lang === "el" ? "Διαθέσιμα Βήματα" : "Available Steps"}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {availableSteps.map((step) => (
              <div
                key={step.id}
                draggable
                onDragStart={(e) => handleDragStart(e, step)}
                className="p-4 rounded-2xl border-4 border-slate-300 bg-white hover:border-cyan-400 hover:scale-105 transition-all duration-300 cursor-move"
              >
                <div className="text-center">
                  <div className="text-6xl mb-2">{step.emoji}</div>
                  <p className="text-sm font-bold text-slate-800">{step.name}</p>
                  <p className="text-xs text-slate-600 mt-1">{step.description}</p>
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
                {lang === "el" ? "🎉 Τέλεια! Καθαρά χέρια!" : "🎉 Perfect! Clean hands!"}
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
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/80 to-teal-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🧼🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Μπράβο! Ξέρεις να πλένεις τα χέρια σου σωστά!" : "Great! You know how to wash your hands properly!"}
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

