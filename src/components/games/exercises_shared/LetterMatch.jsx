// src/components/games/exercises_4_5/LetterMatch.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function LetterMatch({ lang = "el", onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [draggedItem, setDraggedItem] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_ROUNDS = 5; // 5 γύρους

  const roundsData = {
    el: [
      {
        id: 1,
        letters: [
          { id: "l1", letter: "Μ", correct: ["img1", "img2"] },
          { id: "l2", letter: "Π", correct: ["img3"] },
          { id: "l3", letter: "Κ", correct: ["img4"] },
        ],
        images: [
          { id: "img1", emoji: "🍎", label: "Μήλο", startsWith: "Μ" },
          { id: "img2", emoji: "🐝", label: "Μέλισσα", startsWith: "Μ" },
          { id: "img3", emoji: "🦆", label: "Πάπια", startsWith: "Π" },
          { id: "img4", emoji: "🪑", label: "Καρέκλα", startsWith: "Κ" },
        ]
      },
      {
        id: 2,
        letters: [
          { id: "l1", letter: "Σ", correct: ["img1", "img2"] },
          { id: "l2", letter: "Τ", correct: ["img3"] },
          { id: "l3", letter: "Γ", correct: ["img4"] },
        ],
        images: [
          { id: "img1", emoji: "🐕", label: "Σκύλος", startsWith: "Σ" },
          { id: "img2", emoji: "🏠", label: "Σπίτι", startsWith: "Σ" },
          { id: "img3", emoji: "🚂", label: "Τρένο", startsWith: "Τ" },
          { id: "img4", emoji: "🐱", label: "Γάτα", startsWith: "Γ" },
        ]
      },
      {
        id: 3,
        letters: [
          { id: "l1", letter: "Α", correct: ["img1"] },
          { id: "l2", letter: "Β", correct: ["img2", "img3"] },
          { id: "l3", letter: "Δ", correct: ["img4"] },
        ],
        images: [
          { id: "img1", emoji: "⭐", label: "Αστέρι", startsWith: "Α" },
          { id: "img2", emoji: "📚", label: "Βιβλίο", startsWith: "Β" },
          { id: "img3", emoji: "🐸", label: "Βάτραχος", startsWith: "Β" },
          { id: "img4", emoji: "🌳", label: "Δέντρο", startsWith: "Δ" },
        ]
      },
      {
        id: 4,
        letters: [
          { id: "l1", letter: "Λ", correct: ["img1", "img2"] },
          { id: "l2", letter: "Ν", correct: ["img3"] },
          { id: "l3", letter: "Ρ", correct: ["img4"] },
        ],
        images: [
          { id: "img1", emoji: "🦁", label: "Λιοντάρι", startsWith: "Λ" },
          { id: "img2", emoji: "🌸", label: "Λουλούδι", startsWith: "Λ" },
          { id: "img3", emoji: "💧", label: "Νερό", startsWith: "Ν" },
          { id: "img4", emoji: "👕", label: "Ρούχο", startsWith: "Ρ" },
        ]
      },
      {
        id: 5,
        letters: [
          { id: "l1", letter: "Ψ", correct: ["img1"] },
          { id: "l2", letter: "Ω", correct: ["img2"] },
          { id: "l3", letter: "Φ", correct: ["img3", "img4"] },
        ],
        images: [
          { id: "img1", emoji: "🐟", label: "Ψάρι", startsWith: "Ψ" },
          { id: "img2", emoji: "🕐", label: "Ώρα", startsWith: "Ω" },
          { id: "img3", emoji: "🌙", label: "Φεγγάρι", startsWith: "Φ" },
          { id: "img4", emoji: "🐍", label: "Φίδι", startsWith: "Φ" },
        ]
      }
    ],
    en: [
      {
        id: 1,
        letters: [
          { id: "l1", letter: "A", correct: ["img1", "img2"] },
          { id: "l2", letter: "B", correct: ["img3"] },
          { id: "l3", letter: "C", correct: ["img4"] },
        ],
        images: [
          { id: "img1", emoji: "🍎", label: "Apple", startsWith: "A" },
          { id: "img2", emoji: "🐜", label: "Ant", startsWith: "A" },
          { id: "img3", emoji: "⚽", label: "Ball", startsWith: "B" },
          { id: "img4", emoji: "🐱", label: "Cat", startsWith: "C" },
        ]
      },
      {
        id: 2,
        letters: [
          { id: "l1", letter: "D", correct: ["img1", "img2"] },
          { id: "l2", letter: "E", correct: ["img3"] },
          { id: "l3", letter: "F", correct: ["img4"] },
        ],
        images: [
          { id: "img1", emoji: "🐕", label: "Dog", startsWith: "D" },
          { id: "img2", emoji: "🦆", label: "Duck", startsWith: "D" },
          { id: "img3", emoji: "🐘", label: "Elephant", startsWith: "E" },
          { id: "img4", emoji: "🐟", label: "Fish", startsWith: "F" },
        ]
      },
      {
        id: 3,
        letters: [
          { id: "l1", letter: "G", correct: ["img1"] },
          { id: "l2", letter: "H", correct: ["img2", "img3"] },
          { id: "l3", letter: "I", correct: ["img4"] },
        ],
        images: [
          { id: "img1", emoji: "🍇", label: "Grapes", startsWith: "G" },
          { id: "img2", emoji: "🏠", label: "House", startsWith: "H" },
          { id: "img3", emoji: "❤️", label: "Heart", startsWith: "H" },
          { id: "img4", emoji: "🍦", label: "Ice cream", startsWith: "I" },
        ]
      },
      {
        id: 4,
        letters: [
          { id: "l1", letter: "L", correct: ["img1", "img2"] },
          { id: "l2", letter: "M", correct: ["img3"] },
          { id: "l3", letter: "N", correct: ["img4"] },
        ],
        images: [
          { id: "img1", emoji: "🦁", label: "Lion", startsWith: "L" },
          { id: "img2", emoji: "🍋", label: "Lemon", startsWith: "L" },
          { id: "img3", emoji: "🐵", label: "Monkey", startsWith: "M" },
          { id: "img4", emoji: "👃", label: "Nose", startsWith: "N" },
        ]
      },
      {
        id: 5,
        letters: [
          { id: "l1", letter: "P", correct: ["img1"] },
          { id: "l2", letter: "S", correct: ["img2", "img3"] },
          { id: "l3", letter: "T", correct: ["img4"] },
        ],
        images: [
          { id: "img1", emoji: "🐧", label: "Penguin", startsWith: "P" },
          { id: "img2", emoji: "☀️", label: "Sun", startsWith: "S" },
          { id: "img3", emoji: "⭐", label: "Star", startsWith: "S" },
          { id: "img4", emoji: "🚂", label: "Train", startsWith: "T" },
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
      emoji: ["🎉", "⭐", "✨", "🌟", "📚", "🔤"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleDragStart = (e, image) => {
    setDraggedItem(image);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, letter) => {
    e.preventDefault();

    if (!draggedItem || matchedPairs.includes(draggedItem.id)) return;

    const isCorrect = letter.correct.includes(draggedItem.id);

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});
      setFeedback({ type: "correct", letterId: letter.id, imageId: draggedItem.id });

      const newMatched = [...matchedPairs, draggedItem.id];
      setMatchedPairs(newMatched);

      const newScore = score + 1;
      setScore(newScore);

      // Show +1 score popup
      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      // Ενημέρωση progress
      updateProgress({
        title: "Letter Match",
        score: newScore,
        total: TARGET_ROUNDS * 4, // 4 εικόνες ανά γύρο
        index: newScore,
      });

      completeQuiz({
        title: "Letter Match",
        score: 1,
        total: 1,
      });

      // Έλεγχος αν τελείωσε ο γύρος
      if (newMatched.length === round.images.length) {
        setTimeout(() => {
          if (currentRound + 1 < TARGET_ROUNDS) {
            setCurrentRound(prev => prev + 1);
            setMatchedPairs([]);
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
      setFeedback({ type: "wrong", letterId: letter.id });
      setTimeout(() => setFeedback(null), 1000);
    }

    setDraggedItem(null);
  };

  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Ταίριαξε Γράμμα - Λέξη" : "Match Letter - Word"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Γύρος ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Round ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-green-600">
            🎯 {score}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500 ease-out"
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
            ? "🖐️ Σύρε την εικόνα στο σωστό γράμμα!"
            : "🖐️ Drag the image to the correct letter!"}
        </p>
      </div>

      {/* Game Area */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Letters Drop Zones */}
        <div className="space-y-4">
          <h4 className="text-xl font-bold text-slate-700 text-center mb-4">
            {lang === "el" ? "Γράμματα" : "Letters"}
          </h4>
          {round.letters.map((letter) => {
            const isDropTarget = feedback?.letterId === letter.id;
            const hasMatches = matchedPairs.some(id => letter.correct.includes(id));

            return (
              <div
                key={letter.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, letter)}
                className={`
                  relative min-h-32 p-6 rounded-2xl border-4 border-dashed transition-all duration-300
                  ${isDropTarget && feedback.type === "correct" ? "bg-green-100 border-green-500 scale-105" : ""}
                  ${isDropTarget && feedback.type === "wrong" ? "bg-red-100 border-red-500 animate-shake" : ""}
                  ${!isDropTarget ? "bg-white border-slate-300 hover:border-blue-400" : ""}
                `}
              >
                <div className="text-center">
                  <div className="text-7xl font-bold text-blue-600 mb-2">
                    {letter.letter}
                  </div>

                  {/* Matched images */}
                  <div className="flex flex-wrap gap-2 justify-center mt-3">
                    {round.images
                      .filter(img => letter.correct.includes(img.id) && matchedPairs.includes(img.id))
                      .map(img => (
                        <div key={img.id} className="bg-green-100 rounded-lg p-2 flex flex-col items-center">
                          <div className="text-3xl">{img.emoji}</div>
                          <div className="text-xs font-semibold text-green-700">{img.label}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Draggable Images */}
        <div className="space-y-4">
          <h4 className="text-xl font-bold text-slate-700 text-center mb-4">
            {lang === "el" ? "Εικόνες" : "Images"}
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {round.images.map((image) => {
              const isMatched = matchedPairs.includes(image.id);

              return (
                <div
                  key={image.id}
                  draggable={!isMatched}
                  onDragStart={(e) => handleDragStart(e, image)}
                  className={`
                    p-6 rounded-2xl border-4 text-center transition-all duration-300
                    ${isMatched ? "bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed" : "bg-white border-slate-300 hover:border-blue-400 hover:scale-105 cursor-grab active:cursor-grabbing"}
                  `}
                >
                  <div className="text-6xl mb-2">{image.emoji}</div>
                  <div className="text-lg font-semibold text-slate-700">
                    {image.label}
                  </div>
                  {isMatched && (
                    <div className="text-3xl mt-2">✅</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-300/80 to-blue-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🎓🏆</div>
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

