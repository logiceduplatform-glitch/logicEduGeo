// src/components/games/exercises_4_5/IntroduceYourself.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function IntroduceYourself({ lang = "el", onComplete }) {
  const [currentCategory, setCurrentCategory] = useState(0);
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_CATEGORIES = 5; // 5 κατηγορίες

  const categoriesData = {
    el: [
      {
        id: 1,
        title: "Φαγητά",
        emoji: "🍽️",
        color: "#F59E0B",
        question: "Τι φαγητά σου αρέσουν;",
        items: [
          { id: 1, emoji: "🍕", name: "Πίτσα" },
          { id: 2, emoji: "🍔", name: "Μπέργκερ" },
          { id: 3, emoji: "🥦", name: "Μπρόκολο" },
          { id: 4, emoji: "🍦", name: "Παγωτό" },
          { id: 5, emoji: "🥕", name: "Καρότο" },
          { id: 6, emoji: "🍰", name: "Τούρτα" },
        ]
      },
      {
        id: 2,
        title: "Δραστηριότητες",
        emoji: "⚽",
        color: "#10B981",
        question: "Τι σου αρέσει να κάνεις;",
        items: [
          { id: 1, emoji: "⚽", name: "Ποδόσφαιρο" },
          { id: 2, emoji: "🎨", name: "Ζωγραφική" },
          { id: 3, emoji: "📚", name: "Διάβασμα" },
          { id: 4, emoji: "🎮", name: "Παιχνίδια" },
          { id: 5, emoji: "🎵", name: "Μουσική" },
          { id: 6, emoji: "🏃", name: "Τρέξιμο" },
        ]
      },
      {
        id: 3,
        title: "Ζώα",
        emoji: "🐶",
        color: "#3B82F6",
        question: "Ποια ζώα σου αρέσουν;",
        items: [
          { id: 1, emoji: "🐶", name: "Σκύλος" },
          { id: 2, emoji: "🐱", name: "Γάτα" },
          { id: 3, emoji: "🐰", name: "Κουνέλι" },
          { id: 4, emoji: "🐻", name: "Αρκούδα" },
          { id: 5, emoji: "🐠", name: "Ψάρι" },
          { id: 6, emoji: "🦜", name: "Παπαγάλος" },
        ]
      },
      {
        id: 4,
        title: "Χρώματα",
        emoji: "🎨",
        color: "#EC4899",
        question: "Ποια χρώματα σου αρέσουν;",
        items: [
          { id: 1, emoji: "🔴", name: "Κόκκινο" },
          { id: 2, emoji: "🔵", name: "Μπλε" },
          { id: 3, emoji: "🟡", name: "Κίτρινο" },
          { id: 4, emoji: "🟢", name: "Πράσινο" },
          { id: 5, emoji: "🟣", name: "Μωβ" },
          { id: 6, emoji: "🟠", name: "Πορτοκαλί" },
        ]
      },
      {
        id: 5,
        title: "Καιρός",
        emoji: "🌤️",
        color: "#06B6D4",
        question: "Τι καιρό προτιμάς;",
        items: [
          { id: 1, emoji: "☀️", name: "Ηλιόλουστο" },
          { id: 2, emoji: "🌧️", name: "Βροχή" },
          { id: 3, emoji: "❄️", name: "Χιόνι" },
          { id: 4, emoji: "🌈", name: "Ουράνιο Τόξο" },
          { id: 5, emoji: "⛈️", name: "Καταιγίδα" },
          { id: 6, emoji: "🌤️", name: "Συννεφιά" },
        ]
      }
    ],
    en: [
      {
        id: 1,
        title: "Foods",
        emoji: "🍽️",
        color: "#F59E0B",
        question: "What foods do you like?",
        items: [
          { id: 1, emoji: "🍕", name: "Pizza" },
          { id: 2, emoji: "🍔", name: "Burger" },
          { id: 3, emoji: "🥦", name: "Broccoli" },
          { id: 4, emoji: "🍦", name: "Ice Cream" },
          { id: 5, emoji: "🥕", name: "Carrot" },
          { id: 6, emoji: "🍰", name: "Cake" },
        ]
      },
      {
        id: 2,
        title: "Activities",
        emoji: "⚽",
        color: "#10B981",
        question: "What do you like to do?",
        items: [
          { id: 1, emoji: "⚽", name: "Soccer" },
          { id: 2, emoji: "🎨", name: "Painting" },
          { id: 3, emoji: "📚", name: "Reading" },
          { id: 4, emoji: "🎮", name: "Gaming" },
          { id: 5, emoji: "🎵", name: "Music" },
          { id: 6, emoji: "🏃", name: "Running" },
        ]
      },
      {
        id: 3,
        title: "Animals",
        emoji: "🐶",
        color: "#3B82F6",
        question: "Which animals do you like?",
        items: [
          { id: 1, emoji: "🐶", name: "Dog" },
          { id: 2, emoji: "🐱", name: "Cat" },
          { id: 3, emoji: "🐰", name: "Rabbit" },
          { id: 4, emoji: "🐻", name: "Bear" },
          { id: 5, emoji: "🐠", name: "Fish" },
          { id: 6, emoji: "🦜", name: "Parrot" },
        ]
      },
      {
        id: 4,
        title: "Colors",
        emoji: "🎨",
        color: "#EC4899",
        question: "Which colors do you like?",
        items: [
          { id: 1, emoji: "🔴", name: "Red" },
          { id: 2, emoji: "🔵", name: "Blue" },
          { id: 3, emoji: "🟡", name: "Yellow" },
          { id: 4, emoji: "🟢", name: "Green" },
          { id: 5, emoji: "🟣", name: "Purple" },
          { id: 6, emoji: "🟠", name: "Orange" },
        ]
      },
      {
        id: 5,
        title: "Weather",
        emoji: "🌤️",
        color: "#06B6D4",
        question: "What weather do you prefer?",
        items: [
          { id: 1, emoji: "☀️", name: "Sunny" },
          { id: 2, emoji: "🌧️", name: "Rainy" },
          { id: 3, emoji: "❄️", name: "Snowy" },
          { id: 4, emoji: "🌈", name: "Rainbow" },
          { id: 5, emoji: "⛈️", name: "Stormy" },
          { id: 6, emoji: "🌤️", name: "Cloudy" },
        ]
      }
    ]
  };

  const categories = categoriesData[lang];
  const category = categories[currentCategory];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    correctSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    setLikes([]);
    setDislikes([]);
  }, [currentCategory]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "👤", "💬"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleItemClick = (item, type) => {
    if (type === "like") {
      if (likes.includes(item.id)) {
        setLikes(likes.filter(id => id !== item.id));
      } else {
        setLikes([...likes, item.id]);
        if (dislikes.includes(item.id)) {
          setDislikes(dislikes.filter(id => id !== item.id));
        }
      }
    } else {
      if (dislikes.includes(item.id)) {
        setDislikes(dislikes.filter(id => id !== item.id));
      } else {
        setDislikes([...dislikes, item.id]);
        if (likes.includes(item.id)) {
          setLikes(likes.filter(id => id !== item.id));
        }
      }
    }
  };

  const handleContinue = () => {
    if (likes.length > 0 || dislikes.length > 0) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Introduce Yourself",
        score: newScore,
        total: TARGET_CATEGORIES,
        index: currentCategory + 1,
      });

      completeQuiz({
        title: "Introduce Yourself",
        score: 1,
        total: 1,
      });

      setTimeout(() => {
        if (currentCategory + 1 < TARGET_CATEGORIES) {
          setCurrentCategory(prev => prev + 1);
        } else {
          createCelebrationEmojis();
          setShowCelebration(true);
          setTimeout(() => {
            if (onComplete) {
              onComplete();
            }
          }, 2500);
        }
      }, 1500);
    }
  };

  const progressPercent = Math.round(((currentCategory + 1) / TARGET_CATEGORIES) * 100);

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
              {lang === "el" ? "Παρουσίασε τον Εαυτό σου" : "Introduce Yourself"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Κατηγορία ${currentCategory + 1}/${TARGET_CATEGORIES}: ${category.title}`
                : `Category ${currentCategory + 1}/${TARGET_CATEGORIES}: ${category.title}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            👤 {score}
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
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-8 shadow-xl border-4" style={{ borderColor: category.color }}>
          <div className="text-9xl mb-4">{category.emoji}</div>
          <h2 className="text-3xl font-bold mb-4" style={{ color: category.color }}>
            {category.question}
          </h2>
          <p className="text-xl text-slate-600">
            {lang === "el" ? "Επίλεξε τι σου αρέσει (👍) και τι όχι (👎)" : "Choose what you like (👍) and what you don't (👎)"}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {category.items.map((item) => {
            const isLiked = likes.includes(item.id);
            const isDisliked = dislikes.includes(item.id);

            return (
              <div
                key={item.id}
                className="relative bg-white/90 backdrop-blur rounded-3xl p-6 shadow-xl border-4 border-slate-200"
              >
                <div className="text-center mb-4">
                  <div className="text-8xl mb-3">{item.emoji}</div>
                  <p className="text-xl font-bold text-slate-800">{item.name}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleItemClick(item, "like")}
                    className={`
                      flex-1 py-3 rounded-xl text-3xl font-bold transition-all duration-300 transform
                      ${isLiked
                        ? "bg-green-500 text-white scale-110 shadow-lg"
                        : "bg-slate-200 text-slate-400 hover:bg-green-100 hover:text-green-500"
                      }
                    `}
                  >
                    👍
                  </button>

                  <button
                    onClick={() => handleItemClick(item, "dislike")}
                    className={`
                      flex-1 py-3 rounded-xl text-3xl font-bold transition-all duration-300 transform
                      ${isDisliked
                        ? "bg-red-500 text-white scale-110 shadow-lg"
                        : "bg-slate-200 text-slate-400 hover:bg-red-100 hover:text-red-500"
                      }
                    `}
                  >
                    👎
                  </button>
                </div>

                {isLiked && (
                  <div className="absolute -top-3 -right-3 text-5xl animate-bounce bg-white rounded-full p-2">
                    ❤️
                  </div>
                )}
                {isDisliked && (
                  <div className="absolute -top-3 -right-3 text-5xl animate-bounce bg-white rounded-full p-2">
                    💔
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleContinue}
            disabled={likes.length === 0 && dislikes.length === 0}
            className={`
              px-12 py-5 rounded-full text-2xl font-bold shadow-lg transition-all duration-300 transform
              ${likes.length > 0 || dislikes.length > 0
                ? "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:scale-105 cursor-pointer"
                : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }
            `}
          >
            {lang === "el" ? "Συνέχεια ➜" : "Continue ➜"}
          </button>
        </div>

        {(likes.length > 0 || dislikes.length > 0) && (
          <div className="mt-8 bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl">
            <h4 className="text-2xl font-bold text-slate-700 mb-4 text-center">
              {lang === "el" ? "Οι επιλογές μου:" : "My choices:"}
            </h4>
            <div className="grid grid-cols-2 gap-6">
              {likes.length > 0 && (
                <div className="bg-green-50 rounded-xl p-4 border-2 border-green-300">
                  <p className="text-xl font-bold text-green-700 mb-3 flex items-center justify-center gap-2">
                    👍 {lang === "el" ? "Μου αρέσουν:" : "I like:"}
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {likes.map(id => {
                      const item = category.items.find(i => i.id === id);
                      return (
                        <div key={id} className="text-4xl">
                          {item.emoji}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {dislikes.length > 0 && (
                <div className="bg-red-50 rounded-xl p-4 border-2 border-red-300">
                  <p className="text-xl font-bold text-red-700 mb-3 flex items-center justify-center gap-2">
                    👎 {lang === "el" ? "Δεν μου αρέσουν:" : "I don't like:"}
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {dislikes.map(id => {
                      const item = category.items.find(i => i.id === id);
                      return (
                        <div key={id} className="text-4xl">
                          {item.emoji}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-300/80 to-amber-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">👤🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Σε γνώρισα καλύτερα!" : "Perfect! I got to know you better!"}
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

