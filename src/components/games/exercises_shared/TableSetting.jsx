// src/components/games/exercises_4_5/TableSetting.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function TableSetting({ lang = "el", onComplete }) {
  const [currentMeal, setCurrentMeal] = useState(0);
  const [placedItems, setPlacedItems] = useState({});
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

  const TARGET_MEALS = 4; // 4 γεύματα

  const mealsData = {
    el: [
      {
        id: 1,
        title: "Πρωινό",
        emoji: "☕",
        color: "#F59E0B",
        places: [
          { id: "plate", emoji: "🍽️", name: "Πιάτο", x: "50%", y: "50%", accepts: ["plate"] },
          { id: "cup", emoji: "☕", name: "Κούπα", x: "75%", y: "30%", accepts: ["cup"] },
          { id: "spoon", emoji: "🥄", name: "Κουτάλι", x: "70%", y: "55%", accepts: ["spoon"] },
          { id: "napkin", emoji: "🧻", name: "Χαρτοπετσέτα", x: "25%", y: "55%", accepts: ["napkin"] },
        ],
        items: [
          { id: "plate", emoji: "🍽️", name: "Πιάτο", category: "plate" },
          { id: "cup", emoji: "☕", name: "Κούπα", category: "cup" },
          { id: "spoon", emoji: "🥄", name: "Κουτάλι", category: "spoon" },
          { id: "napkin", emoji: "🧻", name: "Χαρτοπετσέτα", category: "napkin" },
        ]
      },
      {
        id: 2,
        title: "Μεσημεριανό",
        emoji: "🍝",
        color: "#EF4444",
        places: [
          { id: "plate", emoji: "🍽️", name: "Πιάτο", x: "50%", y: "50%", accepts: ["plate"] },
          { id: "fork", emoji: "🍴", name: "Πιρούνι", x: "30%", y: "55%", accepts: ["fork"] },
          { id: "knife", emoji: "🔪", name: "Μαχαίρι", x: "70%", y: "55%", accepts: ["knife"] },
          { id: "glass", emoji: "🥤", name: "Ποτήρι", x: "75%", y: "30%", accepts: ["glass"] },
          { id: "napkin", emoji: "🧻", name: "Χαρτοπετσέτα", x: "25%", y: "30%", accepts: ["napkin"] },
        ],
        items: [
          { id: "plate", emoji: "🍽️", name: "Πιάτο", category: "plate" },
          { id: "fork", emoji: "🍴", name: "Πιρούνι", category: "fork" },
          { id: "knife", emoji: "🔪", name: "Μαχαίρι", category: "knife" },
          { id: "glass", emoji: "🥤", name: "Ποτήρι", category: "glass" },
          { id: "napkin", emoji: "🧻", name: "Χαρτοπετσέτα", category: "napkin" },
        ]
      },
      {
        id: 3,
        title: "Βραδινό",
        emoji: "🍲",
        color: "#8B5CF6",
        places: [
          { id: "plate", emoji: "🍽️", name: "Πιάτο", x: "50%", y: "50%", accepts: ["plate"] },
          { id: "fork", emoji: "🍴", name: "Πιρούνι", x: "30%", y: "55%", accepts: ["fork"] },
          { id: "knife", emoji: "🔪", name: "Μαχαίρι", x: "70%", y: "55%", accepts: ["knife"] },
          { id: "spoon", emoji: "🥄", name: "Κουτάλι", x: "75%", y: "60%", accepts: ["spoon"] },
          { id: "glass", emoji: "🥤", name: "Ποτήρι", x: "75%", y: "30%", accepts: ["glass"] },
          { id: "napkin", emoji: "🧻", name: "Χαρτοπετσέτα", x: "25%", y: "30%", accepts: ["napkin"] },
        ],
        items: [
          { id: "plate", emoji: "🍽️", name: "Πιάτο", category: "plate" },
          { id: "fork", emoji: "🍴", name: "Πιρούνι", category: "fork" },
          { id: "knife", emoji: "🔪", name: "Μαχαίρι", category: "knife" },
          { id: "spoon", emoji: "🥄", name: "Κουτάλι", category: "spoon" },
          { id: "glass", emoji: "🥤", name: "Ποτήρι", category: "glass" },
          { id: "napkin", emoji: "🧻", name: "Χαρτοπετσέτα", category: "napkin" },
        ]
      },
      {
        id: 4,
        title: "Σνακ",
        emoji: "🧁",
        color: "#EC4899",
        places: [
          { id: "plate", emoji: "🍽️", name: "Πιατάκι", x: "50%", y: "50%", accepts: ["plate"] },
          { id: "glass", emoji: "🥤", name: "Ποτήρι", x: "70%", y: "35%", accepts: ["glass"] },
          { id: "napkin", emoji: "🧻", name: "Χαρτοπετσέτα", x: "30%", y: "55%", accepts: ["napkin"] },
        ],
        items: [
          { id: "plate", emoji: "🍽️", name: "Πιατάκι", category: "plate" },
          { id: "glass", emoji: "🥤", name: "Ποτήρι", category: "glass" },
          { id: "napkin", emoji: "🧻", name: "Χαρτοπετσέτα", category: "napkin" },
        ]
      }
    ],
    en: [
      {
        id: 1,
        title: "Breakfast",
        emoji: "☕",
        color: "#F59E0B",
        places: [
          { id: "plate", emoji: "🍽️", name: "Plate", x: "50%", y: "50%", accepts: ["plate"] },
          { id: "cup", emoji: "☕", name: "Cup", x: "75%", y: "30%", accepts: ["cup"] },
          { id: "spoon", emoji: "🥄", name: "Spoon", x: "70%", y: "55%", accepts: ["spoon"] },
          { id: "napkin", emoji: "🧻", name: "Napkin", x: "25%", y: "55%", accepts: ["napkin"] },
        ],
        items: [
          { id: "plate", emoji: "🍽️", name: "Plate", category: "plate" },
          { id: "cup", emoji: "☕", name: "Cup", category: "cup" },
          { id: "spoon", emoji: "🥄", name: "Spoon", category: "spoon" },
          { id: "napkin", emoji: "🧻", name: "Napkin", category: "napkin" },
        ]
      },
      {
        id: 2,
        title: "Lunch",
        emoji: "🍝",
        color: "#EF4444",
        places: [
          { id: "plate", emoji: "🍽️", name: "Plate", x: "50%", y: "50%", accepts: ["plate"] },
          { id: "fork", emoji: "🍴", name: "Fork", x: "30%", y: "55%", accepts: ["fork"] },
          { id: "knife", emoji: "🔪", name: "Knife", x: "70%", y: "55%", accepts: ["knife"] },
          { id: "glass", emoji: "🥤", name: "Glass", x: "75%", y: "30%", accepts: ["glass"] },
          { id: "napkin", emoji: "🧻", name: "Napkin", x: "25%", y: "30%", accepts: ["napkin"] },
        ],
        items: [
          { id: "plate", emoji: "🍽️", name: "Plate", category: "plate" },
          { id: "fork", emoji: "🍴", name: "Fork", category: "fork" },
          { id: "knife", emoji: "🔪", name: "Knife", category: "knife" },
          { id: "glass", emoji: "🥤", name: "Glass", category: "glass" },
          { id: "napkin", emoji: "🧻", name: "Napkin", category: "napkin" },
        ]
      },
      {
        id: 3,
        title: "Dinner",
        emoji: "🍲",
        color: "#8B5CF6",
        places: [
          { id: "plate", emoji: "🍽️", name: "Plate", x: "50%", y: "50%", accepts: ["plate"] },
          { id: "fork", emoji: "🍴", name: "Fork", x: "30%", y: "55%", accepts: ["fork"] },
          { id: "knife", emoji: "🔪", name: "Knife", x: "70%", y: "55%", accepts: ["knife"] },
          { id: "spoon", emoji: "🥄", name: "Spoon", x: "75%", y: "60%", accepts: ["spoon"] },
          { id: "glass", emoji: "🥤", name: "Glass", x: "75%", y: "30%", accepts: ["glass"] },
          { id: "napkin", emoji: "🧻", name: "Napkin", x: "25%", y: "30%", accepts: ["napkin"] },
        ],
        items: [
          { id: "plate", emoji: "🍽️", name: "Plate", category: "plate" },
          { id: "fork", emoji: "🍴", name: "Fork", category: "fork" },
          { id: "knife", emoji: "🔪", name: "Knife", category: "knife" },
          { id: "spoon", emoji: "🥄", name: "Spoon", category: "spoon" },
          { id: "glass", emoji: "🥤", name: "Glass", category: "glass" },
          { id: "napkin", emoji: "🧻", name: "Napkin", category: "napkin" },
        ]
      },
      {
        id: 4,
        title: "Snack",
        emoji: "🧁",
        color: "#EC4899",
        places: [
          { id: "plate", emoji: "🍽️", name: "Small Plate", x: "50%", y: "50%", accepts: ["plate"] },
          { id: "glass", emoji: "🥤", name: "Glass", x: "70%", y: "35%", accepts: ["glass"] },
          { id: "napkin", emoji: "🧻", name: "Napkin", x: "30%", y: "55%", accepts: ["napkin"] },
        ],
        items: [
          { id: "plate", emoji: "🍽️", name: "Small Plate", category: "plate" },
          { id: "glass", emoji: "🥤", name: "Glass", category: "glass" },
          { id: "napkin", emoji: "🧻", name: "Napkin", category: "napkin" },
        ]
      }
    ]
  };

  const meals = mealsData[lang];
  const meal = meals[currentMeal];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    const shuffled = [...meal.items].sort(() => Math.random() - 0.5);
    setAvailableItems(shuffled);
    setPlacedItems({});
    setShowFeedback(false);
  }, [currentMeal]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🍽️", "✅"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("itemId", item.id);
    e.dataTransfer.setData("itemCategory", item.category);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropToPlace = (e, placeId) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("itemId");
    const itemCategory = e.dataTransfer.getData("itemCategory");
    const item = availableItems.find(i => i.id === itemId);
    const place = meal.places.find(p => p.id === placeId);

    if (item && place && place.accepts.includes(itemCategory) && !placedItems[placeId]) {
      setPlacedItems(prev => ({ ...prev, [placeId]: item }));
      setAvailableItems(availableItems.filter(i => i.id !== itemId));
      correctSoundRef.current?.play().catch(() => {});
    } else if (placedItems[placeId]) {
      wrongSoundRef.current?.play().catch(() => {});
    }
  };

  const handleDropToAvailable = (e) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("itemId");

    let foundItem = null;
    let foundPlaceId = null;

    Object.keys(placedItems).forEach(placeId => {
      if (placedItems[placeId]?.id === itemId) {
        foundItem = placedItems[placeId];
        foundPlaceId = placeId;
      }
    });

    if (foundItem && foundPlaceId) {
      setPlacedItems(prev => {
        const newPlaced = { ...prev };
        delete newPlaced[foundPlaceId];
        return newPlaced;
      });
      setAvailableItems([...availableItems, foundItem]);
    }
  };

  const handleCheck = () => {
    const allPlaced = Object.keys(placedItems).length === meal.places.length;

    setIsCorrect(allPlaced);
    setShowFeedback(true);

    if (allPlaced) {
      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Table Setting",
        score: newScore,
        total: TARGET_MEALS,
        index: currentMeal + 1,
      });

      completeQuiz({
        title: "Table Setting",
        score: 1,
        total: 1,
      });

      setTimeout(() => {
        if (currentMeal + 1 < TARGET_MEALS) {
          setCurrentMeal(prev => prev + 1);
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

  const progressPercent = Math.round(((currentMeal + 1) / TARGET_MEALS) * 100);
  const settingProgress = Math.round((Object.keys(placedItems).length / meal.places.length) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-amber-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Στρώσιμο Τραπεζιού" : "Table Setting"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Γεύμα ${currentMeal + 1}/${TARGET_MEALS}: ${meal.title}`
                : `Meal ${currentMeal + 1}/${TARGET_MEALS}: ${meal.title}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            🍽️ {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-amber-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-8 shadow-xl border-4" style={{ borderColor: meal.color }}>
          <div className="text-9xl mb-4">{meal.emoji}</div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: meal.color }}>
            {meal.title}
          </h2>
          <p className="text-xl text-slate-600">
            {lang === "el" ? "Στρώσε το τραπέζι σωστά!" : "Set the table properly!"}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mb-8">
        {/* Table Area */}
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-slate-200 mb-8 relative min-h-[500px]">
          <h4 className="text-2xl font-bold text-slate-700 mb-6 text-center">
            {lang === "el" ? "Τραπέζι" : "Table"}
          </h4>

          {/* Table visualization */}
          <div className="relative w-full h-[400px] bg-gradient-to-br from-amber-200 to-orange-200 rounded-3xl border-8 border-amber-800 shadow-2xl">
            {meal.places.map((place) => {
              const item = placedItems[place.id];
              return (
                <div
                  key={place.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropToPlace(e, place.id)}
                  className="absolute"
                  style={{
                    left: place.x,
                    top: place.y,
                    transform: "translate(-50%, -50%)"
                  }}
                >
                  <div className={`
                    w-24 h-24 rounded-2xl border-4 border-dashed flex items-center justify-center transition-all duration-300
                    ${item ? "bg-green-100 border-green-400" : "bg-blue-50 border-blue-300 hover:border-orange-400"}
                  `}>
                    {item ? (
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        className="text-6xl cursor-move hover:scale-110 transition-transform"
                      >
                        {item.emoji}
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-4xl text-slate-300 mb-1">{place.emoji}</div>
                        <p className="text-xs text-slate-500">{place.name}</p>
                      </div>
                    )}
                  </div>
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
                    width: `${settingProgress}%`,
                    backgroundColor: meal.color
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-600">
                {Object.keys(placedItems).length} / {meal.places.length}
              </span>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleCheck}
                disabled={Object.keys(placedItems).length !== meal.places.length || showFeedback}
                className={`
                  px-8 py-4 rounded-full text-xl font-bold shadow-lg transition-all duration-300 transform
                  ${Object.keys(placedItems).length === meal.places.length && !showFeedback
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:scale-105 cursor-pointer"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                  }
                `}
              >
                ✓ {lang === "el" ? "Έλεγχος" : "Check"}
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
            {lang === "el" ? "Διαθέσιμα Αντικείμενα" : "Available Items"}
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 min-h-[120px]">
            {availableItems.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                className="p-4 rounded-2xl border-4 border-slate-300 bg-white hover:border-orange-400 hover:scale-105 transition-all duration-300 cursor-move"
              >
                <div className="text-center">
                  <div className="text-6xl mb-2">{item.emoji}</div>
                  <p className="text-sm font-bold text-slate-800">{item.name}</p>
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
                {lang === "el" ? "🎉 Τέλεια! Στρωμένο το τραπέζι!" : "🎉 Perfect! Table is set!"}
              </p>
            </div>
          ) : (
            <div className="bg-orange-100 rounded-2xl p-6 inline-block border-4 border-orange-400">
              <p className="text-3xl font-bold text-orange-700">
                {lang === "el" ? "Στρώσε όλα τα αντικείμενα!" : "Set all the items!"}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-300/80 to-amber-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🍽️🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Μπράβο! Ξέρεις να στρώνεις το τραπέζι!" : "Great! You know how to set the table!"}
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

