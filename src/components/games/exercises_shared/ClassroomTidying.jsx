// src/components/games/exercises_4_5/ClassroomTidying.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function ClassroomTidying({ lang = "el", onComplete }) {
  const [currentRoom, setCurrentRoom] = useState(0);
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

  const TARGET_ROOMS = 4; // 4 χώροι

  const roomsData = {
    el: [
      {
        id: 1,
        title: "Τακτοποίηση Τάξης",
        emoji: "🎒",
        color: "#3B82F6",
        places: [
          { id: "bookshelf", emoji: "📚", name: "Βιβλιοθήκη", accepts: ["book", "notebook"] },
          { id: "toybox", emoji: "🧸", name: "Κουτί Παιχνιδιών", accepts: ["toy", "ball"] },
          { id: "artcorner", emoji: "🎨", name: "Γωνιά Τέχνης", accepts: ["crayon", "paint"] },
          { id: "backpack", emoji: "🎒", name: "Τσάντα", accepts: ["pencil", "eraser"] },
        ],
        items: [
          { id: "book", emoji: "📖", name: "Βιβλίο", category: "book" },
          { id: "toy", emoji: "🧸", name: "Αρκουδάκι", category: "toy" },
          { id: "crayon", emoji: "🖍️", name: "Κραγιόνι", category: "crayon" },
          { id: "pencil", emoji: "✏️", name: "Μολύβι", category: "pencil" },
          { id: "ball", emoji: "⚽", name: "Μπάλα", category: "ball" },
          { id: "notebook", emoji: "📓", name: "Τετράδιο", category: "notebook" },
        ]
      },
      {
        id: 2,
        title: "Οργάνωση Γραφείου",
        emoji: "🗂️",
        color: "#10B981",
        places: [
          { id: "desk", emoji: "🗂️", name: "Γραφείο", accepts: ["pen", "paper"] },
          { id: "drawer", emoji: "📦", name: "Συρτάρι", accepts: ["scissors", "glue"] },
          { id: "shelf", emoji: "📚", name: "Ράφι", accepts: ["book", "folder"] },
          { id: "bin", emoji: "🗑️", name: "Κάδος", accepts: ["trash", "waste"] },
        ],
        items: [
          { id: "pen", emoji: "🖊️", name: "Στυλό", category: "pen" },
          { id: "scissors", emoji: "✂️", name: "Ψαλίδι", category: "scissors" },
          { id: "book", emoji: "📕", name: "Βιβλίο", category: "book" },
          { id: "trash", emoji: "🗞️", name: "Σκουπίδι", category: "trash" },
          { id: "paper", emoji: "📄", name: "Χαρτί", category: "paper" },
          { id: "glue", emoji: "📎", name: "Κόλλα", category: "glue" },
        ]
      },
      {
        id: 3,
        title: "Τακτοποίηση Παιδικού Δωματίου",
        emoji: "🛏️",
        color: "#F59E0B",
        places: [
          { id: "bed", emoji: "🛏️", name: "Κρεβάτι", accepts: ["pillow", "blanket"] },
          { id: "closet", emoji: "👔", name: "Ντουλάπα", accepts: ["shirt", "pants"] },
          { id: "toybox", emoji: "🧸", name: "Κουτί Παιχνιδιών", accepts: ["toy", "doll"] },
          { id: "bookshelf", emoji: "📚", name: "Βιβλιοθήκη", accepts: ["book", "magazine"] },
        ],
        items: [
          { id: "pillow", emoji: "🛏️", name: "Μαξιλάρι", category: "pillow" },
          { id: "shirt", emoji: "👕", name: "Μπλούζα", category: "shirt" },
          { id: "toy", emoji: "🚗", name: "Αυτοκινητάκι", category: "toy" },
          { id: "book", emoji: "📚", name: "Βιβλίο", category: "book" },
          { id: "doll", emoji: "🪆", name: "Κούκλα", category: "doll" },
          { id: "pants", emoji: "👖", name: "Παντελόνι", category: "pants" },
        ]
      },
      {
        id: 4,
        title: "Μετά το Παιχνίδι",
        emoji: "🧹",
        color: "#8B5CF6",
        places: [
          { id: "toyshelf", emoji: "🧸", name: "Ράφι Παιχνιδιών", accepts: ["car", "blocks"] },
          { id: "artbin", emoji: "🎨", name: "Κουτί Τέχνης", accepts: ["marker", "brush"] },
          { id: "bookcase", emoji: "📚", name: "Βιβλιοθήκη", accepts: ["storybook", "comic"] },
          { id: "floor", emoji: "🧹", name: "Σκουπίζω", accepts: ["wrapper", "paper"] },
        ],
        items: [
          { id: "car", emoji: "🚗", name: "Αυτοκινητάκι", category: "car" },
          { id: "marker", emoji: "🖍️", name: "Μαρκαδόρος", category: "marker" },
          { id: "storybook", emoji: "📖", name: "Παραμύθι", category: "storybook" },
          { id: "wrapper", emoji: "📄", name: "Χαρτάκι", category: "wrapper" },
          { id: "blocks", emoji: "🧱", name: "Τουβλάκια", category: "blocks" },
          { id: "brush", emoji: "🖌️", name: "Πινέλο", category: "brush" },
        ]
      }
    ],
    en: [
      {
        id: 1,
        title: "Classroom Tidying",
        emoji: "🎒",
        color: "#3B82F6",
        places: [
          { id: "bookshelf", emoji: "📚", name: "Bookshelf", accepts: ["book", "notebook"] },
          { id: "toybox", emoji: "🧸", name: "Toy Box", accepts: ["toy", "ball"] },
          { id: "artcorner", emoji: "🎨", name: "Art Corner", accepts: ["crayon", "paint"] },
          { id: "backpack", emoji: "🎒", name: "Backpack", accepts: ["pencil", "eraser"] },
        ],
        items: [
          { id: "book", emoji: "📖", name: "Book", category: "book" },
          { id: "toy", emoji: "🧸", name: "Teddy Bear", category: "toy" },
          { id: "crayon", emoji: "🖍️", name: "Crayon", category: "crayon" },
          { id: "pencil", emoji: "✏️", name: "Pencil", category: "pencil" },
          { id: "ball", emoji: "⚽", name: "Ball", category: "ball" },
          { id: "notebook", emoji: "📓", name: "Notebook", category: "notebook" },
        ]
      },
      {
        id: 2,
        title: "Desk Organization",
        emoji: "🗂️",
        color: "#10B981",
        places: [
          { id: "desk", emoji: "🗂️", name: "Desk", accepts: ["pen", "paper"] },
          { id: "drawer", emoji: "📦", name: "Drawer", accepts: ["scissors", "glue"] },
          { id: "shelf", emoji: "📚", name: "Shelf", accepts: ["book", "folder"] },
          { id: "bin", emoji: "🗑️", name: "Bin", accepts: ["trash", "waste"] },
        ],
        items: [
          { id: "pen", emoji: "🖊️", name: "Pen", category: "pen" },
          { id: "scissors", emoji: "✂️", name: "Scissors", category: "scissors" },
          { id: "book", emoji: "📕", name: "Book", category: "book" },
          { id: "trash", emoji: "🗞️", name: "Trash", category: "trash" },
          { id: "paper", emoji: "📄", name: "Paper", category: "paper" },
          { id: "glue", emoji: "📎", name: "Glue", category: "glue" },
        ]
      },
      {
        id: 3,
        title: "Bedroom Tidying",
        emoji: "🛏️",
        color: "#F59E0B",
        places: [
          { id: "bed", emoji: "🛏️", name: "Bed", accepts: ["pillow", "blanket"] },
          { id: "closet", emoji: "👔", name: "Closet", accepts: ["shirt", "pants"] },
          { id: "toybox", emoji: "🧸", name: "Toy Box", accepts: ["toy", "doll"] },
          { id: "bookshelf", emoji: "📚", name: "Bookshelf", accepts: ["book", "magazine"] },
        ],
        items: [
          { id: "pillow", emoji: "🛏️", name: "Pillow", category: "pillow" },
          { id: "shirt", emoji: "👕", name: "Shirt", category: "shirt" },
          { id: "toy", emoji: "🚗", name: "Toy Car", category: "toy" },
          { id: "book", emoji: "📚", name: "Book", category: "book" },
          { id: "doll", emoji: "🪆", name: "Doll", category: "doll" },
          { id: "pants", emoji: "👖", name: "Pants", category: "pants" },
        ]
      },
      {
        id: 4,
        title: "After Playtime",
        emoji: "🧹",
        color: "#8B5CF6",
        places: [
          { id: "toyshelf", emoji: "🧸", name: "Toy Shelf", accepts: ["car", "blocks"] },
          { id: "artbin", emoji: "🎨", name: "Art Box", accepts: ["marker", "brush"] },
          { id: "bookcase", emoji: "📚", name: "Bookcase", accepts: ["storybook", "comic"] },
          { id: "floor", emoji: "🧹", name: "Clean Up", accepts: ["wrapper", "paper"] },
        ],
        items: [
          { id: "car", emoji: "🚗", name: "Toy Car", category: "car" },
          { id: "marker", emoji: "🖍️", name: "Marker", category: "marker" },
          { id: "storybook", emoji: "📖", name: "Storybook", category: "storybook" },
          { id: "wrapper", emoji: "📄", name: "Wrapper", category: "wrapper" },
          { id: "blocks", emoji: "🧱", name: "Blocks", category: "blocks" },
          { id: "brush", emoji: "🖌️", name: "Brush", category: "brush" },
        ]
      }
    ]
  };

  const rooms = roomsData[lang];
  const room = rooms[currentRoom];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    const shuffled = [...room.items].sort(() => Math.random() - 0.5);
    setAvailableItems(shuffled);
    setPlacedItems({});
    setShowFeedback(false);
  }, [currentRoom]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🧹", "✅"][Math.floor(Math.random() * 6)],
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
    const place = room.places.find(p => p.id === placeId);

    if (item && place && place.accepts.includes(itemCategory)) {
      // Correct placement
      setPlacedItems(prev => ({ ...prev, [placeId]: [...(prev[placeId] || []), item] }));
      setAvailableItems(availableItems.filter(i => i.id !== itemId));
      correctSoundRef.current?.play().catch(() => {});
    } else {
      // Wrong placement
      wrongSoundRef.current?.play().catch(() => {});
    }
  };

  const handleDropToAvailable = (e) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("itemId");

    // Find item in placedItems
    let foundItem = null;
    let foundPlaceId = null;

    Object.keys(placedItems).forEach(placeId => {
      const item = placedItems[placeId]?.find(i => i.id === itemId);
      if (item) {
        foundItem = item;
        foundPlaceId = placeId;
      }
    });

    if (foundItem && foundPlaceId) {
      setPlacedItems(prev => ({
        ...prev,
        [foundPlaceId]: prev[foundPlaceId].filter(i => i.id !== itemId)
      }));
      setAvailableItems([...availableItems, foundItem]);
    }
  };

  const handleCheck = () => {
    // Check if all items are placed
    const totalPlaced = Object.values(placedItems).reduce((sum, items) => sum + items.length, 0);
    const allPlaced = totalPlaced === room.items.length;

    setIsCorrect(allPlaced);
    setShowFeedback(true);

    if (allPlaced) {
      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Classroom Tidying",
        score: newScore,
        total: TARGET_ROOMS,
        index: currentRoom + 1,
      });

      completeQuiz({
        title: "Classroom Tidying",
        score: 1,
        total: 1,
      });

      setTimeout(() => {
        if (currentRoom + 1 < TARGET_ROOMS) {
          setCurrentRoom(prev => prev + 1);
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
      setTimeout(() => {
        setShowFeedback(false);
      }, 1500);
    }
  };

  const progressPercent = Math.round(((currentRoom + 1) / TARGET_ROOMS) * 100);
  const totalPlaced = Object.values(placedItems).reduce((sum, items) => sum + items.length, 0);
  const tidyingProgress = Math.round((totalPlaced / room.items.length) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-lime-100 via-green-100 to-emerald-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Τακτοποίηση Αντικειμένων" : "Tidying Objects"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Χώρος ${currentRoom + 1}/${TARGET_ROOMS}: ${room.title}`
                : `Room ${currentRoom + 1}/${TARGET_ROOMS}: ${room.title}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            🧹 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-lime-400 to-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-8 shadow-xl border-4" style={{ borderColor: room.color }}>
          <div className="text-9xl mb-4">{room.emoji}</div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: room.color }}>
            {room.title}
          </h2>
          <p className="text-xl text-slate-600">
            {lang === "el" ? "Σύρε κάθε αντικείμενο στο σωστό του μέρος!" : "Drag each object to its proper place!"}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mb-8">
        {/* Places */}
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-slate-200 mb-8">
          <h4 className="text-2xl font-bold text-slate-700 mb-6 text-center">
            {lang === "el" ? "Χώροι" : "Places"}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {room.places.map((place) => {
              const itemsInPlace = placedItems[place.id] || [];
              return (
                <div
                  key={place.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropToPlace(e, place.id)}
                  className="relative p-6 rounded-2xl border-4 border-dashed border-slate-300 bg-blue-50 min-h-[200px] hover:border-emerald-400 transition-colors"
                >
                  <div className="text-center mb-4">
                    <div className="text-7xl mb-2">{place.emoji}</div>
                    <p className="text-lg font-bold text-slate-800">{place.name}</p>
                  </div>

                  {/* Items in this place */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {itemsInPlace.map((item) => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        className="text-4xl cursor-move bg-white rounded-lg p-2 shadow-md hover:scale-110 transition-transform"
                      >
                        {item.emoji}
                      </div>
                    ))}
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
                    width: `${tidyingProgress}%`,
                    backgroundColor: room.color
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-600">
                {totalPlaced} / {room.items.length}
              </span>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleCheck}
                disabled={totalPlaced !== room.items.length || showFeedback}
                className={`
                  px-8 py-4 rounded-full text-xl font-bold shadow-lg transition-all duration-300 transform
                  ${totalPlaced === room.items.length && !showFeedback
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
            {lang === "el" ? "Αντικείμενα προς Τακτοποίηση" : "Items to Tidy Up"}
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 min-h-[120px]">
            {availableItems.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                className="p-4 rounded-2xl border-4 border-slate-300 bg-white hover:border-lime-400 hover:scale-105 transition-all duration-300 cursor-move"
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
                {lang === "el" ? "🎉 Τέλεια! Όλα στη θέση τους!" : "🎉 Perfect! Everything in its place!"}
              </p>
            </div>
          ) : (
            <div className="bg-orange-100 rounded-2xl p-6 inline-block border-4 border-orange-400">
              <p className="text-3xl font-bold text-orange-700">
                {lang === "el" ? "Τακτοποίησε όλα τα αντικείμενα!" : "Tidy up all the items!"}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-lime-300/80 to-emerald-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🧹🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Μπράβο! Ξέρεις να τακτοποιείς!" : "Great! You know how to tidy up!"}
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

