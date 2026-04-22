// src/components/games/exercises_4_5/DailyRoutine.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function DailyRoutine({ lang = "el", onComplete }) {
  const [currentRoutine, setCurrentRoutine] = useState(0);
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

  const TARGET_ROUTINES = 5; // 5 ρουτίνες

  const routinesData = {
    el: [
      {
        id: 1,
        title: "Πρωινή Ρουτίνα",
        emoji: "🌅",
        color: "#F59E0B",
        correctOrder: [1, 2, 3, 4],
        activities: [
          { id: 1, emoji: "😴", name: "Ξυπνάω", time: "07:00" },
          { id: 2, emoji: "🚿", name: "Πλένομαι", time: "07:15" },
          { id: 3, emoji: "🥞", name: "Πρωινό", time: "07:30" },
          { id: 4, emoji: "🎒", name: "Πάω Σχολείο", time: "08:00" },
        ]
      },
      {
        id: 2,
        title: "Σχολική Ημέρα",
        emoji: "🏫",
        color: "#3B82F6",
        correctOrder: [1, 2, 3, 4],
        activities: [
          { id: 1, emoji: "📚", name: "Μάθημα", time: "09:00" },
          { id: 2, emoji: "🍎", name: "Διάλειμμα", time: "10:30" },
          { id: 3, emoji: "🎨", name: "Τέχνη", time: "11:00" },
          { id: 4, emoji: "🏠", name: "Σπίτι", time: "13:00" },
        ]
      },
      {
        id: 3,
        title: "Απογευματινή Ρουτίνα",
        emoji: "☀️",
        color: "#10B981",
        correctOrder: [1, 2, 3, 4],
        activities: [
          { id: 1, emoji: "🍝", name: "Μεσημεριανό", time: "14:00" },
          { id: 2, emoji: "📖", name: "Διάβασμα", time: "15:00" },
          { id: 3, emoji: "⚽", name: "Παιχνίδι", time: "16:00" },
          { id: 4, emoji: "🧹", name: "Τακτοποίηση", time: "17:00" },
        ]
      },
      {
        id: 4,
        title: "Βραδινή Ρουτίνα",
        emoji: "🌙",
        color: "#8B5CF6",
        correctOrder: [1, 2, 3, 4],
        activities: [
          { id: 1, emoji: "🍲", name: "Βραδινό", time: "19:00" },
          { id: 2, emoji: "🛁", name: "Μπάνιο", time: "20:00" },
          { id: 3, emoji: "📚", name: "Παραμύθι", time: "20:30" },
          { id: 4, emoji: "😴", name: "Ύπνος", time: "21:00" },
        ]
      },
      {
        id: 5,
        title: "Πλύσιμο Χεριών",
        emoji: "🧼",
        color: "#EC4899",
        correctOrder: [1, 2, 3, 4],
        activities: [
          { id: 1, emoji: "💧", name: "Ανοίγω Βρύση", time: "" },
          { id: 2, emoji: "🧼", name: "Σαπούνι", time: "" },
          { id: 3, emoji: "🤲", name: "Τρίβω", time: "" },
          { id: 4, emoji: "🧻", name: "Σκουπίζω", time: "" },
        ]
      }
    ],
    en: [
      {
        id: 1,
        title: "Morning Routine",
        emoji: "🌅",
        color: "#F59E0B",
        correctOrder: [1, 2, 3, 4],
        activities: [
          { id: 1, emoji: "😴", name: "Wake Up", time: "07:00" },
          { id: 2, emoji: "🚿", name: "Wash", time: "07:15" },
          { id: 3, emoji: "🥞", name: "Breakfast", time: "07:30" },
          { id: 4, emoji: "🎒", name: "Go to School", time: "08:00" },
        ]
      },
      {
        id: 2,
        title: "School Day",
        emoji: "🏫",
        color: "#3B82F6",
        correctOrder: [1, 2, 3, 4],
        activities: [
          { id: 1, emoji: "📚", name: "Class", time: "09:00" },
          { id: 2, emoji: "🍎", name: "Break", time: "10:30" },
          { id: 3, emoji: "🎨", name: "Art", time: "11:00" },
          { id: 4, emoji: "🏠", name: "Home", time: "13:00" },
        ]
      },
      {
        id: 3,
        title: "Afternoon Routine",
        emoji: "☀️",
        color: "#10B981",
        correctOrder: [1, 2, 3, 4],
        activities: [
          { id: 1, emoji: "🍝", name: "Lunch", time: "14:00" },
          { id: 2, emoji: "📖", name: "Study", time: "15:00" },
          { id: 3, emoji: "⚽", name: "Play", time: "16:00" },
          { id: 4, emoji: "🧹", name: "Tidy Up", time: "17:00" },
        ]
      },
      {
        id: 4,
        title: "Evening Routine",
        emoji: "🌙",
        color: "#8B5CF6",
        correctOrder: [1, 2, 3, 4],
        activities: [
          { id: 1, emoji: "🍲", name: "Dinner", time: "19:00" },
          { id: 2, emoji: "🛁", name: "Bath", time: "20:00" },
          { id: 3, emoji: "📚", name: "Story", time: "20:30" },
          { id: 4, emoji: "😴", name: "Sleep", time: "21:00" },
        ]
      },
      {
        id: 5,
        title: "Hand Washing",
        emoji: "🧼",
        color: "#EC4899",
        correctOrder: [1, 2, 3, 4],
        activities: [
          { id: 1, emoji: "💧", name: "Turn on Tap", time: "" },
          { id: 2, emoji: "🧼", name: "Soap", time: "" },
          { id: 3, emoji: "🤲", name: "Rub", time: "" },
          { id: 4, emoji: "🧻", name: "Dry", time: "" },
        ]
      }
    ]
  };

  const routines = routinesData[lang];
  const routine = routines[currentRoutine];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    // Shuffle activities when routine changes
    const shuffled = [...routine.activities].sort(() => Math.random() - 0.5);
    setAvailableItems(shuffled);
    setSequence([]);
    setShowFeedback(false);
  }, [currentRoutine]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "⏰", "✅"][Math.floor(Math.random() * 6)],
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
    const correct = JSON.stringify(userOrder) === JSON.stringify(routine.correctOrder);

    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Daily Routine",
        score: newScore,
        total: TARGET_ROUTINES,
        index: currentRoutine + 1,
      });

      completeQuiz({
        title: "Daily Routine",
        score: 1,
        total: 1,
      });

      setTimeout(() => {
        if (currentRoutine + 1 < TARGET_ROUTINES) {
          setCurrentRoutine(prev => prev + 1);
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
    setAvailableItems([...routine.activities].sort(() => Math.random() - 0.5));
    setSequence([]);
    setShowFeedback(false);
  };

  const progressPercent = Math.round(((currentRoutine + 1) / TARGET_ROUTINES) * 100);
  const sequenceProgress = Math.round((sequence.filter(s => s).length / routine.activities.length) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-purple-100 via-violet-100 to-indigo-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Η Ρουτίνα της Ημέρας" : "Daily Routine"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Ρουτίνα ${currentRoutine + 1}/${TARGET_ROUTINES}: ${routine.title}`
                : `Routine ${currentRoutine + 1}/${TARGET_ROUTINES}: ${routine.title}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            ⏰ {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-indigo-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4" style={{ borderColor: routine.color }}>
          <div className="text-8xl mb-3">{routine.emoji}</div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: routine.color }}>
            {routine.title}
          </h2>
          <p className="text-xl text-slate-600">
            {lang === "el" ? "Σύρε τις δραστηριότητες στη σωστή σειρά!" : "Drag the activities in the correct order!"}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mb-8">
        {/* Sequence Area */}
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-slate-200 mb-8">
          <h4 className="text-2xl font-bold text-slate-700 mb-6 text-center">
            {lang === "el" ? "Σειρά Δραστηριοτήτων" : "Activity Sequence"}
          </h4>
          <div className="grid grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((position) => {
              const item = sequence[position];
              return (
                <div
                  key={position}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropToSequence(e, position)}
                  className={`
                    relative p-6 rounded-2xl border-4 border-dashed min-h-[180px] flex flex-col items-center justify-center transition-all duration-300
                    ${item ? "bg-green-50 border-green-400" : "bg-blue-50 border-blue-300"}
                    ${showFeedback && isCorrect && item ? "bg-green-100 border-green-500" : ""}
                    ${showFeedback && !isCorrect && item ? "bg-red-100 border-red-500 animate-shake" : ""}
                  `}
                >
                  <div className="absolute -top-4 left-4 bg-white rounded-full px-4 py-2 border-2 border-slate-300">
                    <span className="text-xl font-bold text-slate-700">{position + 1}</span>
                  </div>
                  {item ? (
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      className="text-center cursor-move"
                    >
                      <div className="text-6xl mb-2">{item.emoji}</div>
                      <p className="text-lg font-bold text-slate-800">{item.name}</p>
                      {item.time && <p className="text-sm text-slate-600">{item.time}</p>}
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
                    backgroundColor: routine.color
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-600">
                {sequence.filter(s => s).length} / {routine.activities.length}
              </span>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleCheck}
                disabled={sequence.filter(s => s).length !== routine.activities.length || showFeedback}
                className={`
                  px-8 py-4 rounded-full text-xl font-bold shadow-lg transition-all duration-300 transform
                  ${sequence.filter(s => s).length === routine.activities.length && !showFeedback
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
            {lang === "el" ? "Διαθέσιμες Δραστηριότητες" : "Available Activities"}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {availableItems.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                className="p-6 rounded-2xl border-4 border-slate-300 bg-white hover:border-purple-400 hover:scale-105 transition-all duration-300 cursor-move"
              >
                <div className="text-center">
                  <div className="text-6xl mb-2">{item.emoji}</div>
                  <p className="text-lg font-bold text-slate-800">{item.name}</p>
                  {item.time && <p className="text-sm text-slate-600">{item.time}</p>}
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
                {lang === "el" ? "🎉 Τέλεια! Σωστή σειρά!" : "🎉 Perfect! Correct order!"}
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
        <div className="absolute inset-0 bg-gradient-to-br from-purple-300/80 to-indigo-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">⏰🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Μπράβο! Ξέρεις τις ρουτίνες σου!" : "Great! You know your routines!"}
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

