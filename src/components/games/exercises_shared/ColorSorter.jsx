// src/components/games/exercises_4_5/ColorSorter.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function ColorSorter({ lang = "el", onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [sortedItems, setSortedItems] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_ROUNDS = 6; // 6 γύρους

  const roundsData = {
    el: [
      {
        id: 1,
        buckets: [
          { id: "red", color: "bg-red-400", label: "Κόκκινο", textColor: "text-red-700" },
          { id: "blue", color: "bg-blue-400", label: "Μπλε", textColor: "text-blue-700" },
        ],
        items: [
          { id: 1, emoji: "🍎", label: "Μήλο", color: "red" },
          { id: 2, emoji: "🔵", label: "Μπάλα", color: "blue" },
          { id: 3, emoji: "🍓", label: "Φράουλα", color: "red" },
          { id: 4, emoji: "🐟", label: "Ψάρι", color: "blue" },
        ]
      },
      {
        id: 2,
        buckets: [
          { id: "yellow", color: "bg-yellow-400", label: "Κίτρινο", textColor: "text-yellow-700" },
          { id: "green", color: "bg-green-400", label: "Πράσινο", textColor: "text-green-700" },
        ],
        items: [
          { id: 1, emoji: "🍌", label: "Μπανάνα", color: "yellow" },
          { id: 2, emoji: "🌳", label: "Δέντρο", color: "green" },
          { id: 3, emoji: "⭐", label: "Αστέρι", color: "yellow" },
          { id: 4, emoji: "🐸", label: "Βάτραχος", color: "green" },
        ]
      },
      {
        id: 3,
        buckets: [
          { id: "orange", color: "bg-orange-400", label: "Πορτοκαλί", textColor: "text-orange-700" },
          { id: "purple", color: "bg-purple-400", label: "Μωβ", textColor: "text-purple-700" },
        ],
        items: [
          { id: 1, emoji: "🍊", label: "Πορτοκάλι", color: "orange" },
          { id: 2, emoji: "🍇", label: "Σταφύλι", color: "purple" },
          { id: 3, emoji: "🥕", label: "Καρότο", color: "orange" },
          { id: 4, emoji: "🍆", label: "Μελιτζάνα", color: "purple" },
        ]
      },
      {
        id: 4,
        buckets: [
          { id: "red", color: "bg-red-400", label: "Κόκκινο", textColor: "text-red-700" },
          { id: "yellow", color: "bg-yellow-400", label: "Κίτρινο", textColor: "text-yellow-700" },
          { id: "green", color: "bg-green-400", label: "Πράσινο", textColor: "text-green-700" },
        ],
        items: [
          { id: 1, emoji: "🍎", label: "Μήλο", color: "red" },
          { id: 2, emoji: "🍌", label: "Μπανάνα", color: "yellow" },
          { id: 3, emoji: "🌳", label: "Δέντρο", color: "green" },
          { id: 4, emoji: "🍒", label: "Κεράσι", color: "red" },
          { id: 5, emoji: "🌻", label: "Λουλούδι", color: "yellow" },
          { id: 6, emoji: "🥒", label: "Αγγούρι", color: "green" },
        ]
      },
      {
        id: 5,
        buckets: [
          { id: "pink", color: "bg-pink-400", label: "Ροζ", textColor: "text-pink-700" },
          { id: "brown", color: "bg-amber-600", label: "Καφέ", textColor: "text-amber-900" },
        ],
        items: [
          { id: 1, emoji: "🌸", label: "Λουλούδι", color: "pink" },
          { id: 2, emoji: "🐻", label: "Αρκούδα", color: "brown" },
          { id: 3, emoji: "🎀", label: "Φιόγκος", color: "pink" },
          { id: 4, emoji: "🍫", label: "Σοκολάτα", color: "brown" },
        ]
      },
      {
        id: 6,
        buckets: [
          { id: "blue", color: "bg-blue-400", label: "Μπλε", textColor: "text-blue-700" },
          { id: "orange", color: "bg-orange-400", label: "Πορτοκαλί", textColor: "text-orange-700" },
          { id: "purple", color: "bg-purple-400", label: "Μωβ", textColor: "text-purple-700" },
        ],
        items: [
          { id: 1, emoji: "🌊", label: "Θάλασσα", color: "blue" },
          { id: 2, emoji: "🍊", label: "Πορτοκάλι", color: "orange" },
          { id: 3, emoji: "🍇", label: "Σταφύλι", color: "purple" },
          { id: 4, emoji: "🐟", label: "Ψάρι", color: "blue" },
          { id: 5, emoji: "🎃", label: "Κολοκύθα", color: "orange" },
          { id: 6, emoji: "🦄", label: "Μονόκερος", color: "purple" },
        ]
      }
    ],
    en: [
      {
        id: 1,
        buckets: [
          { id: "red", color: "bg-red-400", label: "Red", textColor: "text-red-700" },
          { id: "blue", color: "bg-blue-400", label: "Blue", textColor: "text-blue-700" },
        ],
        items: [
          { id: 1, emoji: "🍎", label: "Apple", color: "red" },
          { id: 2, emoji: "🔵", label: "Ball", color: "blue" },
          { id: 3, emoji: "🍓", label: "Strawberry", color: "red" },
          { id: 4, emoji: "🐟", label: "Fish", color: "blue" },
        ]
      },
      {
        id: 2,
        buckets: [
          { id: "yellow", color: "bg-yellow-400", label: "Yellow", textColor: "text-yellow-700" },
          { id: "green", color: "bg-green-400", label: "Green", textColor: "text-green-700" },
        ],
        items: [
          { id: 1, emoji: "🍌", label: "Banana", color: "yellow" },
          { id: 2, emoji: "🌳", label: "Tree", color: "green" },
          { id: 3, emoji: "⭐", label: "Star", color: "yellow" },
          { id: 4, emoji: "🐸", label: "Frog", color: "green" },
        ]
      },
      {
        id: 3,
        buckets: [
          { id: "orange", color: "bg-orange-400", label: "Orange", textColor: "text-orange-700" },
          { id: "purple", color: "bg-purple-400", label: "Purple", textColor: "text-purple-700" },
        ],
        items: [
          { id: 1, emoji: "🍊", label: "Orange", color: "orange" },
          { id: 2, emoji: "🍇", label: "Grapes", color: "purple" },
          { id: 3, emoji: "🥕", label: "Carrot", color: "orange" },
          { id: 4, emoji: "🍆", label: "Eggplant", color: "purple" },
        ]
      },
      {
        id: 4,
        buckets: [
          { id: "red", color: "bg-red-400", label: "Red", textColor: "text-red-700" },
          { id: "yellow", color: "bg-yellow-400", label: "Yellow", textColor: "text-yellow-700" },
          { id: "green", color: "bg-green-400", label: "Green", textColor: "text-green-700" },
        ],
        items: [
          { id: 1, emoji: "🍎", label: "Apple", color: "red" },
          { id: 2, emoji: "🍌", label: "Banana", color: "yellow" },
          { id: 3, emoji: "🌳", label: "Tree", color: "green" },
          { id: 4, emoji: "🍒", label: "Cherry", color: "red" },
          { id: 5, emoji: "🌻", label: "Flower", color: "yellow" },
          { id: 6, emoji: "🥒", label: "Cucumber", color: "green" },
        ]
      },
      {
        id: 5,
        buckets: [
          { id: "pink", color: "bg-pink-400", label: "Pink", textColor: "text-pink-700" },
          { id: "brown", color: "bg-amber-600", label: "Brown", textColor: "text-amber-900" },
        ],
        items: [
          { id: 1, emoji: "🌸", label: "Flower", color: "pink" },
          { id: 2, emoji: "🐻", label: "Bear", color: "brown" },
          { id: 3, emoji: "🎀", label: "Ribbon", color: "pink" },
          { id: 4, emoji: "🍫", label: "Chocolate", color: "brown" },
        ]
      },
      {
        id: 6,
        buckets: [
          { id: "blue", color: "bg-blue-400", label: "Blue", textColor: "text-blue-700" },
          { id: "orange", color: "bg-orange-400", label: "Orange", textColor: "text-orange-700" },
          { id: "purple", color: "bg-purple-400", label: "Purple", textColor: "text-purple-700" },
        ],
        items: [
          { id: 1, emoji: "🌊", label: "Ocean", color: "blue" },
          { id: 2, emoji: "🍊", label: "Orange", color: "orange" },
          { id: 3, emoji: "🍇", label: "Grapes", color: "purple" },
          { id: 4, emoji: "🐟", label: "Fish", color: "blue" },
          { id: 5, emoji: "🎃", label: "Pumpkin", color: "orange" },
          { id: 6, emoji: "🦄", label: "Unicorn", color: "purple" },
        ]
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

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🎨", "🌈"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, bucket) => {
    e.preventDefault();

    if (!draggedItem || sortedItems.includes(draggedItem.id)) return;

    const isCorrect = draggedItem.color === bucket.id;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});
      setFeedback({ type: "correct", bucketId: bucket.id });

      const newSorted = [...sortedItems, draggedItem.id];
      setSortedItems(newSorted);

      const newScore = score + 1;
      setScore(newScore);

      // Show +1 score popup
      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      // Ενημέρωση progress
      updateProgress({
        title: "Color Sorter",
        score: newScore,
        total: rounds.reduce((sum, r) => sum + r.items.length, 0),
        index: newScore,
      });

      completeQuiz({
        title: "Color Sorter",
        score: 1,
        total: 1,
      });

      // Έλεγχος αν τελείωσε ο γύρος
      if (newSorted.length === round.items.length) {
        setTimeout(() => {
          if (currentRound + 1 < TARGET_ROUNDS) {
            setCurrentRound(prev => prev + 1);
            setSortedItems([]);
            setFeedback(null);
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
        }, 1500);
      } else {
        setTimeout(() => setFeedback(null), 1000);
      }
    } else {
      wrongSoundRef.current?.play().catch(() => {});
      setFeedback({ type: "wrong", bucketId: bucket.id });
      setTimeout(() => setFeedback(null), 1000);
    }

    setDraggedItem(null);
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Ταξινομητής Χρωμάτων" : "Color Sorter"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Γύρος ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Round ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            🎨 {score}
          </div>
        </div>

        {/* Progress Bar */}
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

      {/* Instructions */}
      <div className="text-center mb-8">
        <p className="text-xl text-slate-700 font-semibold bg-white/80 backdrop-blur rounded-xl p-4 inline-block shadow-lg">
          {lang === "el"
            ? "🎨 Σύρε τα αντικείμενα στον σωστό κουβά!"
            : "🎨 Drag the objects to the correct bucket!"}
        </p>
      </div>

      {/* Game Area */}
      <div className="max-w-5xl mx-auto">
        {/* Buckets */}
        <div className={`grid ${round.buckets.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-6 mb-8`}>
          {round.buckets.map((bucket) => {
            const hasFeedback = feedback?.bucketId === bucket.id;
            const isCorrect = hasFeedback && feedback.type === "correct";
            const isWrong = hasFeedback && feedback.type === "wrong";

            return (
              <div
                key={bucket.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, bucket)}
                className={`
                  relative min-h-48 rounded-3xl border-4 border-dashed transition-all duration-300
                  ${isCorrect ? "scale-105 border-green-500" : ""}
                  ${isWrong ? "animate-shake border-red-500" : ""}
                  ${!hasFeedback ? `${bucket.color} border-slate-400 hover:border-slate-600` : ""}
                `}
              >
                <div className="p-6">
                  <h3 className={`text-3xl font-bold text-center mb-4 ${bucket.textColor}`}>
                    {bucket.label}
                  </h3>

                  {/* Sorted items in bucket */}
                  <div className="flex flex-wrap gap-2 justify-center min-h-[100px]">
                    {round.items
                      .filter(item => item.color === bucket.id && sortedItems.includes(item.id))
                      .map(item => (
                        <div
                          key={item.id}
                          className="bg-white rounded-xl p-3 shadow-md"
                        >
                          <div className="text-4xl">{item.emoji}</div>
                        </div>
                      ))}
                  </div>
                </div>

                {isCorrect && (
                  <div className="absolute -top-4 -right-4 text-5xl animate-bounce">
                    ✅
                  </div>
                )}
                {isWrong && (
                  <div className="absolute -top-4 -right-4 text-5xl">
                    ❌
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Draggable Items */}
        <div>
          <h4 className="text-xl font-bold text-center mb-4 text-slate-700">
            {lang === "el" ? "Αντικείμενα" : "Objects"}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {round.items.map((item) => {
              const isSorted = sortedItems.includes(item.id);

              return (
                <div
                  key={item.id}
                  draggable={!isSorted}
                  onDragStart={(e) => handleDragStart(e, item)}
                  className={`
                    p-6 rounded-2xl border-4 text-center transition-all duration-300
                    ${isSorted ? "bg-gray-100 border-gray-300 opacity-30 cursor-not-allowed" : "bg-white border-slate-300 hover:border-purple-400 hover:scale-105 cursor-grab active:cursor-grabbing"}
                  `}
                >
                  <div className="text-6xl mb-2">{item.emoji}</div>
                  <div className="text-sm font-semibold text-slate-700">
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-300/80 to-pink-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🎨🏆</div>
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

