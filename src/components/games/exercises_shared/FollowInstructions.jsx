// src/components/games/exercises_4_5/FollowInstructions.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function FollowInstructions({ lang = "el", onComplete }) {
  const [currentTask, setCurrentTask] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_TASKS = 6; // 6 εργασίες

  const tasksData = {
    el: [
      {
        id: 1,
        instruction: "Βάλε το κόκκινο μήλο στο καλάθι και μετά πάτα το πράσινο κουμπί",
        emoji: "🍎",
        color: "#EF4444",
        steps: [
          {
            id: 1,
            type: "drag",
            instruction: "Βάλε το κόκκινο μήλο στο καλάθι",
            item: { emoji: "🍎", name: "Κόκκινο Μήλο", color: "red" },
            target: { emoji: "🧺", name: "Καλάθι" }
          },
          {
            id: 2,
            type: "click",
            instruction: "Πάτα το πράσινο κουμπί",
            button: { emoji: "🟢", name: "Πράσινο Κουμπί", color: "green" }
          }
        ]
      },
      {
        id: 2,
        instruction: "Πάρε το μπλε βιβλίο και βάλ' το στο ράφι",
        emoji: "📘",
        color: "#3B82F6",
        steps: [
          {
            id: 1,
            type: "drag",
            instruction: "Πάρε το μπλε βιβλίο",
            item: { emoji: "📘", name: "Μπλε Βιβλίο", color: "blue" },
            target: { emoji: "📚", name: "Ράφι" }
          }
        ]
      },
      {
        id: 3,
        instruction: "Πάτα το κόκκινο κουμπί και μετά βάλε το αστέρι στο κουτί",
        emoji: "⭐",
        color: "#F59E0B",
        steps: [
          {
            id: 1,
            type: "click",
            instruction: "Πάτα το κόκκινο κουμπί",
            button: { emoji: "🔴", name: "Κόκκινο Κουμπί", color: "red" }
          },
          {
            id: 2,
            type: "drag",
            instruction: "Βάλε το αστέρι στο κουτί",
            item: { emoji: "⭐", name: "Αστέρι", color: "yellow" },
            target: { emoji: "📦", name: "Κουτί" }
          }
        ]
      },
      {
        id: 4,
        instruction: "Βάλε την μπάλα στο καλάθι",
        emoji: "⚽",
        color: "#10B981",
        steps: [
          {
            id: 1,
            type: "drag",
            instruction: "Βάλε την μπάλα στο καλάθι",
            item: { emoji: "⚽", name: "Μπάλα", color: "white" },
            target: { emoji: "🧺", name: "Καλάθι" }
          }
        ]
      },
      {
        id: 5,
        instruction: "Πάτα το κίτρινο κουμπί και μετά το μπλε",
        emoji: "🔘",
        color: "#8B5CF6",
        steps: [
          {
            id: 1,
            type: "click",
            instruction: "Πάτα το κίτρινο κουμπί",
            button: { emoji: "🟡", name: "Κίτρινο Κουμπί", color: "yellow" }
          },
          {
            id: 2,
            type: "click",
            instruction: "Πάτα το μπλε κουμπί",
            button: { emoji: "🔵", name: "Μπλε Κουμπί", color: "blue" }
          }
        ]
      },
      {
        id: 6,
        instruction: "Βάλε το λουλούδι στο βάζο και πάτα το ροζ κουμπί",
        emoji: "🌸",
        color: "#EC4899",
        steps: [
          {
            id: 1,
            type: "drag",
            instruction: "Βάλε το λουλούδι στο βάζο",
            item: { emoji: "🌸", name: "Λουλούδι", color: "pink" },
            target: { emoji: "🏺", name: "Βάζο" }
          },
          {
            id: 2,
            type: "click",
            instruction: "Πάτα το ροζ κουμπί",
            button: { emoji: "🩷", name: "Ροζ Κουμπί", color: "pink" }
          }
        ]
      }
    ],
    en: [
      {
        id: 1,
        instruction: "Put the red apple in the basket and then press the green button",
        emoji: "🍎",
        color: "#EF4444",
        steps: [
          {
            id: 1,
            type: "drag",
            instruction: "Put the red apple in the basket",
            item: { emoji: "🍎", name: "Red Apple", color: "red" },
            target: { emoji: "🧺", name: "Basket" }
          },
          {
            id: 2,
            type: "click",
            instruction: "Press the green button",
            button: { emoji: "🟢", name: "Green Button", color: "green" }
          }
        ]
      },
      {
        id: 2,
        instruction: "Take the blue book and put it on the shelf",
        emoji: "📘",
        color: "#3B82F6",
        steps: [
          {
            id: 1,
            type: "drag",
            instruction: "Take the blue book",
            item: { emoji: "📘", name: "Blue Book", color: "blue" },
            target: { emoji: "📚", name: "Shelf" }
          }
        ]
      },
      {
        id: 3,
        instruction: "Press the red button and then put the star in the box",
        emoji: "⭐",
        color: "#F59E0B",
        steps: [
          {
            id: 1,
            type: "click",
            instruction: "Press the red button",
            button: { emoji: "🔴", name: "Red Button", color: "red" }
          },
          {
            id: 2,
            type: "drag",
            instruction: "Put the star in the box",
            item: { emoji: "⭐", name: "Star", color: "yellow" },
            target: { emoji: "📦", name: "Box" }
          }
        ]
      },
      {
        id: 4,
        instruction: "Put the ball in the basket",
        emoji: "⚽",
        color: "#10B981",
        steps: [
          {
            id: 1,
            type: "drag",
            instruction: "Put the ball in the basket",
            item: { emoji: "⚽", name: "Ball", color: "white" },
            target: { emoji: "🧺", name: "Basket" }
          }
        ]
      },
      {
        id: 5,
        instruction: "Press the yellow button and then the blue one",
        emoji: "🔘",
        color: "#8B5CF6",
        steps: [
          {
            id: 1,
            type: "click",
            instruction: "Press the yellow button",
            button: { emoji: "🟡", name: "Yellow Button", color: "yellow" }
          },
          {
            id: 2,
            type: "click",
            instruction: "Press the blue button",
            button: { emoji: "🔵", name: "Blue Button", color: "blue" }
          }
        ]
      },
      {
        id: 6,
        instruction: "Put the flower in the vase and press the pink button",
        emoji: "🌸",
        color: "#EC4899",
        steps: [
          {
            id: 1,
            type: "drag",
            instruction: "Put the flower in the vase",
            item: { emoji: "🌸", name: "Flower", color: "pink" },
            target: { emoji: "🏺", name: "Vase" }
          },
          {
            id: 2,
            type: "click",
            instruction: "Press the pink button",
            button: { emoji: "🩷", name: "Pink Button", color: "pink" }
          }
        ]
      }
    ]
  };

  const tasks = tasksData[lang];
  const task = tasks[currentTask];
  const currentStep = task.steps[completedSteps.length];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    setCompletedSteps([]);
    setShowInstructions(true);
  }, [currentTask]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "👂", "✅"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleStepComplete = () => {
    correctSoundRef.current?.play().catch(() => {});

    const newCompleted = [...completedSteps, currentStep.id];
    setCompletedSteps(newCompleted);

    if (newCompleted.length === task.steps.length) {
      // Task complete!
      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Follow Instructions",
        score: newScore,
        total: TARGET_TASKS,
        index: currentTask + 1,
      });

      completeQuiz({
        title: "Follow Instructions",
        score: 1,
        total: 1,
      });

      setTimeout(() => {
        if (currentTask + 1 < TARGET_TASKS) {
          setCurrentTask(prev => prev + 1);
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
    }
  };

  const handleDragStart = (e) => {
    if (currentStep && currentStep.type === "drag") {
      setDraggedItem(currentStep.item);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedItem && currentStep && currentStep.type === "drag") {
      handleStepComplete();
      setDraggedItem(null);
    }
  };

  const handleButtonClick = () => {
    if (currentStep && currentStep.type === "click") {
      handleStepComplete();
    }
  };

  const progressPercent = Math.round(((currentTask + 1) / TARGET_TASKS) * 100);
  const taskProgress = Math.round((completedSteps.length / task.steps.length) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-teal-100 via-cyan-100 to-blue-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Ακολούθησε τις Οδηγίες" : "Follow the Instructions"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Εργασία ${currentTask + 1}/${TARGET_TASKS}`
                : `Task ${currentTask + 1}/${TARGET_TASKS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-teal-600">
            👂 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      {showInstructions && (
        <div className="text-center mb-8">
          <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-8 shadow-xl border-4" style={{ borderColor: task.color }}>
            <div className="text-9xl mb-4">👂</div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: task.color }}>
              {task.instruction}
            </h2>
            <button
              onClick={() => setShowInstructions(false)}
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
            >
              {lang === "el" ? "Κατάλαβα! Ας Ξεκινήσουμε" : "Got it! Let's Start"}
            </button>
          </div>
        </div>
      )}

      {!showInstructions && (
        <>
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
              <h4 className="text-xl font-bold text-slate-800 mb-3">
                {lang === "el" ? "Τρέχον Βήμα:" : "Current Step:"}
              </h4>
              {currentStep && (
                <p className="text-2xl font-bold text-center" style={{ color: task.color }}>
                  {currentStep.instruction}
                </p>
              )}
              <div className="mt-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300 ease-out"
                      style={{
                        width: `${taskProgress}%`,
                        backgroundColor: task.color
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-600">
                    {completedSteps.length} / {task.steps.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 gap-8">
              {/* Left side - Items/Buttons */}
              <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-slate-200">
                <h4 className="text-xl font-bold text-slate-700 mb-6 text-center">
                  {lang === "el" ? "Αντικείμενα" : "Items"}
                </h4>
                <div className="space-y-6">
                  {task.steps.map((step) => {
                    const isCompleted = completedSteps.includes(step.id);
                    const isCurrent = currentStep && currentStep.id === step.id;

                    if (step.type === "drag") {
                      return (
                        <div
                          key={step.id}
                          draggable={isCurrent && !isCompleted}
                          onDragStart={handleDragStart}
                          className={`
                            p-6 rounded-2xl border-4 transition-all duration-300 cursor-move
                            ${isCompleted ? "bg-green-100 border-green-500 opacity-50" : ""}
                            ${isCurrent && !isCompleted ? "bg-yellow-50 border-yellow-400 animate-pulse" : ""}
                            ${!isCurrent && !isCompleted ? "bg-slate-100 border-slate-300 opacity-50" : ""}
                          `}
                        >
                          <div className="flex items-center justify-center gap-4">
                            <div className="text-7xl">{step.item.emoji}</div>
                            <p className="text-xl font-bold text-slate-800">{step.item.name}</p>
                          </div>
                        </div>
                      );
                    } else if (step.type === "click") {
                      return (
                        <button
                          key={step.id}
                          onClick={handleButtonClick}
                          disabled={!isCurrent || isCompleted}
                          className={`
                            w-full p-6 rounded-2xl border-4 transition-all duration-300 transform
                            ${isCompleted ? "bg-green-100 border-green-500 opacity-50" : ""}
                            ${isCurrent && !isCompleted ? "bg-yellow-50 border-yellow-400 hover:scale-105 cursor-pointer animate-pulse" : ""}
                            ${!isCurrent && !isCompleted ? "bg-slate-100 border-slate-300 opacity-50 cursor-not-allowed" : ""}
                          `}
                        >
                          <div className="flex items-center justify-center gap-4">
                            <div className="text-7xl">{step.button.emoji}</div>
                            <p className="text-xl font-bold text-slate-800">{step.button.name}</p>
                          </div>
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>

              {/* Right side - Targets */}
              <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-slate-200">
                <h4 className="text-xl font-bold text-slate-700 mb-6 text-center">
                  {lang === "el" ? "Στόχοι" : "Targets"}
                </h4>
                <div className="space-y-6">
                  {task.steps
                    .filter(step => step.type === "drag")
                    .map((step) => {
                      const isCompleted = completedSteps.includes(step.id);
                      const isCurrent = currentStep && currentStep.id === step.id;

                      return (
                        <div
                          key={step.id}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          className={`
                            p-6 rounded-2xl border-4 border-dashed transition-all duration-300 min-h-[120px] flex items-center justify-center
                            ${isCompleted ? "bg-green-100 border-green-500" : ""}
                            ${isCurrent && !isCompleted ? "bg-blue-50 border-blue-400 animate-pulse" : ""}
                            ${!isCurrent && !isCompleted ? "bg-slate-50 border-slate-300" : ""}
                          `}
                        >
                          <div className="text-center">
                            <div className="text-7xl mb-2">{step.target.emoji}</div>
                            <p className="text-xl font-bold text-slate-800">{step.target.name}</p>
                            {isCompleted && (
                              <div className="text-6xl mt-2">✅</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-teal-300/80 to-cyan-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">👂🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ακολουθείς τις οδηγίες υπέροχα!" : "Perfect! You follow instructions wonderfully!"}
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

