// src/components/games/WhichMovedGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function WhichMovedGame({ lang = "el", difficulty = 3, onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [showingOriginal, setShowingOriginal] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const d = Math.max(1, Math.min(5, difficulty));
  const REVEAL_TIME = [4000, 3500, 3000, 2500, 2000][d - 1];
  const WRONG_DELAY = [2000, 1800, 1500, 1200, 1000][d - 1];
  const NEXT_DELAY = [3000, 2800, 2500, 2200, 2000][d - 1];

  const TARGET_ROUNDS = 10;

  const roundsData = {
    el: [
      {
        id: 1,
        items: [
          { id: "apple", emoji: "🍎", label: "Μήλο", originalPos: 0, newPos: 0 },
          { id: "banana", emoji: "🍌", label: "Μπανάνα", originalPos: 1, newPos: 2 },
          { id: "orange", emoji: "🍊", label: "Πορτοκάλι", originalPos: 2, newPos: 1 },
          { id: "grape", emoji: "🍇", label: "Σταφύλι", originalPos: 3, newPos: 3 }
        ],
        movedId: "banana",
        description: "Ποιο μετακινήθηκε;"
      },
      {
        id: 2,
        items: [
          { id: "dog", emoji: "🐶", label: "Σκύλος", originalPos: 0, newPos: 2 },
          { id: "cat", emoji: "🐱", label: "Γάτα", originalPos: 1, newPos: 1 },
          { id: "rabbit", emoji: "🐰", label: "Λαγός", originalPos: 2, newPos: 0 },
          { id: "bear", emoji: "🐻", label: "Αρκούδα", originalPos: 3, newPos: 3 }
        ],
        movedId: "dog",
        description: "Ποιο μετακινήθηκε;"
      },
      {
        id: 3,
        items: [
          { id: "car", emoji: "🚗", label: "Αυτοκίνητο", originalPos: 0, newPos: 0 },
          { id: "bus", emoji: "🚌", label: "Λεωφορείο", originalPos: 1, newPos: 1 },
          { id: "train", emoji: "🚆", label: "Τρένο", originalPos: 2, newPos: 3 },
          { id: "plane", emoji: "✈️", label: "Αεροπλάνο", originalPos: 3, newPos: 2 }
        ],
        movedId: "train",
        description: "Ποιο μετακινήθηκε;"
      },
      {
        id: 4,
        items: [
          { id: "star", emoji: "⭐", label: "Αστέρι", originalPos: 0, newPos: 1 },
          { id: "moon", emoji: "🌙", label: "Φεγγάρι", originalPos: 1, newPos: 0 },
          { id: "sun", emoji: "☀️", label: "Ήλιος", originalPos: 2, newPos: 2 },
          { id: "cloud", emoji: "☁️", label: "Σύννεφο", originalPos: 3, newPos: 3 }
        ],
        movedId: "star",
        description: "Ποιο μετακινήθηκε;"
      },
      {
        id: 5,
        items: [
          { id: "flower", emoji: "🌸", label: "Λουλούδι", originalPos: 0, newPos: 0 },
          { id: "tree", emoji: "🌲", label: "Δέντρο", originalPos: 1, newPos: 3 },
          { id: "cactus", emoji: "🌵", label: "Κάκτος", originalPos: 2, newPos: 2 },
          { id: "sunflower", emoji: "🌻", label: "Ηλιοτρόπιο", originalPos: 3, newPos: 1 }
        ],
        movedId: "tree",
        description: "Ποιο μετακινήθηκε;"
      },
      {
        id: 6,
        items: [
          { id: "pizza", emoji: "🍕", label: "Πίτσα", originalPos: 0, newPos: 3 },
          { id: "burger", emoji: "🍔", label: "Μπέργκερ", originalPos: 1, newPos: 1 },
          { id: "hotdog", emoji: "🌭", label: "Χοτ Ντογκ", originalPos: 2, newPos: 2 },
          { id: "cake", emoji: "🍰", label: "Τούρτα", originalPos: 3, newPos: 0 }
        ],
        movedId: "pizza",
        description: "Ποιο μετακινήθηκε;"
      },
      {
        id: 7,
        items: [
          { id: "ball", emoji: "⚽", label: "Μπάλα", originalPos: 0, newPos: 0 },
          { id: "basketball", emoji: "🏀", label: "Μπάσκετ", originalPos: 1, newPos: 2 },
          { id: "tennis", emoji: "🎾", label: "Τένις", originalPos: 2, newPos: 1 },
          { id: "baseball", emoji: "⚾", label: "Μπέιζμπολ", originalPos: 3, newPos: 3 }
        ],
        movedId: "basketball",
        description: "Ποιο μετακινήθηκε;"
      },
      {
        id: 8,
        items: [
          { id: "heart", emoji: "❤️", label: "Καρδιά", originalPos: 0, newPos: 2 },
          { id: "diamond", emoji: "💎", label: "Διαμάντι", originalPos: 1, newPos: 1 },
          { id: "crown", emoji: "👑", label: "Κορώνα", originalPos: 2, newPos: 0 },
          { id: "star2", emoji: "🌟", label: "Αστέρι", originalPos: 3, newPos: 3 }
        ],
        movedId: "heart",
        description: "Ποιο μετακινήθηκε;"
      },
      {
        id: 9,
        items: [
          { id: "butterfly", emoji: "🦋", label: "Πεταλούδα", originalPos: 0, newPos: 0 },
          { id: "bee", emoji: "🐝", label: "Μέλισσα", originalPos: 1, newPos: 1 },
          { id: "ladybug", emoji: "🐞", label: "Πασχαλίτσα", originalPos: 2, newPos: 3 },
          { id: "ant", emoji: "🐜", label: "Μυρμήγκι", originalPos: 3, newPos: 2 }
        ],
        movedId: "ladybug",
        description: "Ποιο μετακινήθηκε;"
      },
      {
        id: 10,
        items: [
          { id: "house", emoji: "🏠", label: "Σπίτι", originalPos: 0, newPos: 1 },
          { id: "school", emoji: "🏫", label: "Σχολείο", originalPos: 1, newPos: 0 },
          { id: "hospital", emoji: "🏥", label: "Νοσοκομείο", originalPos: 2, newPos: 2 },
          { id: "castle", emoji: "🏰", label: "Κάστρο", originalPos: 3, newPos: 3 }
        ],
        movedId: "house",
        description: "Ποιο μετακινήθηκε;"
      }
    ],
    en: [
      {
        id: 1,
        items: [
          { id: "apple", emoji: "🍎", label: "Apple", originalPos: 0, newPos: 0 },
          { id: "banana", emoji: "🍌", label: "Banana", originalPos: 1, newPos: 2 },
          { id: "orange", emoji: "🍊", label: "Orange", originalPos: 2, newPos: 1 },
          { id: "grape", emoji: "🍇", label: "Grape", originalPos: 3, newPos: 3 }
        ],
        movedId: "banana",
        description: "Which one moved?"
      },
      {
        id: 2,
        items: [
          { id: "dog", emoji: "🐶", label: "Dog", originalPos: 0, newPos: 2 },
          { id: "cat", emoji: "🐱", label: "Cat", originalPos: 1, newPos: 1 },
          { id: "rabbit", emoji: "🐰", label: "Rabbit", originalPos: 2, newPos: 0 },
          { id: "bear", emoji: "🐻", label: "Bear", originalPos: 3, newPos: 3 }
        ],
        movedId: "dog",
        description: "Which one moved?"
      },
      {
        id: 3,
        items: [
          { id: "car", emoji: "🚗", label: "Car", originalPos: 0, newPos: 0 },
          { id: "bus", emoji: "🚌", label: "Bus", originalPos: 1, newPos: 1 },
          { id: "train", emoji: "🚆", label: "Train", originalPos: 2, newPos: 3 },
          { id: "plane", emoji: "✈️", label: "Plane", originalPos: 3, newPos: 2 }
        ],
        movedId: "train",
        description: "Which one moved?"
      },
      {
        id: 4,
        items: [
          { id: "star", emoji: "⭐", label: "Star", originalPos: 0, newPos: 1 },
          { id: "moon", emoji: "🌙", label: "Moon", originalPos: 1, newPos: 0 },
          { id: "sun", emoji: "☀️", label: "Sun", originalPos: 2, newPos: 2 },
          { id: "cloud", emoji: "☁️", label: "Cloud", originalPos: 3, newPos: 3 }
        ],
        movedId: "star",
        description: "Which one moved?"
      },
      {
        id: 5,
        items: [
          { id: "flower", emoji: "🌸", label: "Flower", originalPos: 0, newPos: 0 },
          { id: "tree", emoji: "🌲", label: "Tree", originalPos: 1, newPos: 3 },
          { id: "cactus", emoji: "🌵", label: "Cactus", originalPos: 2, newPos: 2 },
          { id: "sunflower", emoji: "🌻", label: "Sunflower", originalPos: 3, newPos: 1 }
        ],
        movedId: "tree",
        description: "Which one moved?"
      },
      {
        id: 6,
        items: [
          { id: "pizza", emoji: "🍕", label: "Pizza", originalPos: 0, newPos: 3 },
          { id: "burger", emoji: "🍔", label: "Burger", originalPos: 1, newPos: 1 },
          { id: "hotdog", emoji: "🌭", label: "Hot Dog", originalPos: 2, newPos: 2 },
          { id: "cake", emoji: "🍰", label: "Cake", originalPos: 3, newPos: 0 }
        ],
        movedId: "pizza",
        description: "Which one moved?"
      },
      {
        id: 7,
        items: [
          { id: "ball", emoji: "⚽", label: "Ball", originalPos: 0, newPos: 0 },
          { id: "basketball", emoji: "🏀", label: "Basketball", originalPos: 1, newPos: 2 },
          { id: "tennis", emoji: "🎾", label: "Tennis", originalPos: 2, newPos: 1 },
          { id: "baseball", emoji: "⚾", label: "Baseball", originalPos: 3, newPos: 3 }
        ],
        movedId: "basketball",
        description: "Which one moved?"
      },
      {
        id: 8,
        items: [
          { id: "heart", emoji: "❤️", label: "Heart", originalPos: 0, newPos: 2 },
          { id: "diamond", emoji: "💎", label: "Diamond", originalPos: 1, newPos: 1 },
          { id: "crown", emoji: "👑", label: "Crown", originalPos: 2, newPos: 0 },
          { id: "star2", emoji: "🌟", label: "Star", originalPos: 3, newPos: 3 }
        ],
        movedId: "heart",
        description: "Which one moved?"
      },
      {
        id: 9,
        items: [
          { id: "butterfly", emoji: "🦋", label: "Butterfly", originalPos: 0, newPos: 0 },
          { id: "bee", emoji: "🐝", label: "Bee", originalPos: 1, newPos: 1 },
          { id: "ladybug", emoji: "🐞", label: "Ladybug", originalPos: 2, newPos: 3 },
          { id: "ant", emoji: "🐜", label: "Ant", originalPos: 3, newPos: 2 }
        ],
        movedId: "ladybug",
        description: "Which one moved?"
      },
      {
        id: 10,
        items: [
          { id: "house", emoji: "🏠", label: "House", originalPos: 0, newPos: 1 },
          { id: "school", emoji: "🏫", label: "School", originalPos: 1, newPos: 0 },
          { id: "hospital", emoji: "🏥", label: "Hospital", originalPos: 2, newPos: 2 },
          { id: "castle", emoji: "🏰", label: "Castle", originalPos: 3, newPos: 3 }
        ],
        movedId: "house",
        description: "Which one moved?"
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
    setShowingOriginal(true);
    setSelectedAnswer(null);
    setShowAnswer(false);

    // Show original positions for REVEAL_TIME, then show new positions
    const moveTimer = setTimeout(() => {
      setShowingOriginal(false);
    }, REVEAL_TIME);

    return () => clearTimeout(moveTimer);
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "🧠"][Math.floor(Math.random() * 6)],
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

      const text = lang === 'el'
        ? 'Κοίτα τα αντικείμενα και θυμήσου ποιο μετακινήθηκε'
        : 'Look at the objects and remember which one moved';

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

  const handleAnswerSelect = (itemId) => {
    if (showAnswer || showingOriginal) return;

    setSelectedAnswer(itemId);
    setShowAnswer(true);

    const isCorrect = itemId === round.movedId;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Which Moved Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Which Moved Game",
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
        setSelectedAnswer(null);
        setShowAnswer(false);
      }, WRONG_DELAY);
    }
  };

  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);
  const movedItem = round.items.find(item => item.id === round.movedId);

  // Sort items by position for display
  const sortedItemsOriginal = [...round.items].sort((a, b) => a.originalPos - b.originalPos);
  const sortedItemsNew = [...round.items].sort((a, b) => a.newPos - b.newPos);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-green-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Ποιο Μετακινήθηκε;" : "Which One Moved?"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            🧠 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-green-500 transition-all duration-500 ease-out"
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
          <div className="text-7xl mb-3">👀</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">
            {showingOriginal
              ? (lang === "el" ? "Κοίτα τις θέσεις!" : "Look at the positions!")
              : round.description
            }
          </h2>

          <button
            onClick={speakQuestion}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-green-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-orange-400">
          <p className="text-2xl font-bold text-center text-slate-800 mb-6">
            {showingOriginal
              ? (lang === "el" ? "Θυμήσου τις θέσεις:" : "Remember the positions:")
              : (lang === "el" ? "Κάτι άλλαξε! Τι;" : "Something changed! What?")}
          </p>

          {/* Show items in grid */}
          <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto mb-8">
            {(showingOriginal ? sortedItemsOriginal : sortedItemsNew).map((item, index) => {
              const hasMoved = item.originalPos !== item.newPos;
              const isTheMovedOne = item.id === round.movedId;

              return (
                <div
                  key={`${item.id}-${index}`}
                  className={`
                    relative rounded-3xl p-8 border-4 flex flex-col items-center justify-center shadow-lg transition-all duration-500
                    ${showingOriginal
                      ? 'bg-gradient-to-br from-orange-100 to-yellow-100 border-orange-300 animate-bounce'
                      : (isTheMovedOne && !showAnswer
                        ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-400 animate-pulse'
                        : 'bg-gradient-to-br from-orange-100 to-yellow-100 border-orange-300')}
                  `}
                  style={{ animationDelay: showingOriginal ? `${index * 0.2}s` : '0s' }}
                >
                  <div className="text-8xl mb-3">{item.emoji}</div>
                  <p className="text-xl font-bold text-slate-700">{item.label}</p>

                  {/* Position indicator */}
                  <div className="absolute top-2 right-2 bg-slate-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {showingOriginal ? item.originalPos + 1 : item.newPos + 1}
                  </div>
                </div>
              );
            })}
          </div>

          {showingOriginal ? (
            <div className="text-center">
              <div className="inline-block bg-yellow-100 rounded-2xl p-4 border-4 border-yellow-400">
                <p className="text-xl font-bold text-yellow-700 animate-pulse">
                  {lang === "el" ? "Θυμήσου τις θέσεις!" : "Remember the positions!"}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Answer options */}
              {!showAnswer && (
                <>
                  <p className="text-xl font-bold text-center text-slate-700 mb-4">
                    {lang === "el" ? "Ποιο μετακινήθηκε;" : "Which one moved?"}
                  </p>

                  <div className="flex justify-center gap-4">
                    {round.items.map((item) => {
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleAnswerSelect(item.id)}
                          className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-100 to-green-100 hover:from-blue-200 hover:to-green-200 border-4 border-blue-300 hover:border-blue-500 transition-all duration-200 transform hover:scale-110 shadow-lg flex flex-col items-center justify-center cursor-pointer"
                        >
                          <div className="text-6xl mb-1">{item.emoji}</div>
                          <p className="text-sm font-bold text-slate-700">{item.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {showAnswer && selectedAnswer === round.movedId && (
        <div className="text-center animate-fadeIn">
          <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
            <div className="text-7xl mb-3">{movedItem.emoji}</div>
            <p className="text-3xl font-bold text-green-700">
              {lang === "el"
                ? `🎉 Σωστά! Το ${movedItem.label} μετακινήθηκε!`
                : `🎉 Correct! The ${movedItem.label} moved!`}
            </p>
            <p className="text-lg text-green-600 mt-2">
              {lang === "el"
                ? `Από θέση ${movedItem.originalPos + 1} → ${movedItem.newPos + 1}`
                : `From position ${movedItem.originalPos + 1} → ${movedItem.newPos + 1}`}
            </p>
          </div>
        </div>
      )}

      {showAnswer && selectedAnswer !== round.movedId && (
        <div className="text-center animate-fadeIn">
          <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
            <p className="text-3xl font-bold text-red-700">
              {lang === "el"
                ? `Προσπάθησε ξανά!`
                : `Try again!`}
            </p>
          </div>
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-300/80 to-green-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🧠🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Έχεις εξαιρετική μνήμη!" : "Perfect! You have excellent memory!"}
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

