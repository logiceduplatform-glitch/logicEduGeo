// src/components/games/exercises_7_8/BreakWord.jsx - Upgraded for age 8: Complex syllables
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
export default function BreakWord({ lang = "el", onComplete }) {
  const [currentWord, setCurrentWord] = useState(0);
  const [tappedSyllables, setTappedSyllables] = useState([]);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const completeRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();
  const TARGET_WORDS = 10; // Increased for age 8
  const wordsData = {
    el: [
      {
        id: 1,
        word: "ΠΟΔΟΣΦΑΙΡΙΣΤΗΣ",
        syllables: ["ΠΟ", "ΔΟ", "ΣΦΑΙ", "ΡΙ", "ΣΤΗΣ"],
        emoji: "⚽",
        meaning: "Ποδοσφαιριστής"
      },
      {
        id: 2,
        word: "ΒΙΒΛΙΟΘΗΚΗ",
        syllables: ["ΒΙ", "ΒΛΙ", "Ο", "ΘΗ", "ΚΗ"],
        emoji: "📚",
        meaning: "Βιβλιοθήκη"
      },
      {
        id: 3,
        word: "ΚΑΘΗΓΗΤΡΙΑ",
        syllables: ["ΚΑ", "ΘΗ", "ΓΗ", "ΤΡΙ", "Α"],
        emoji: "👩‍🏫",
        meaning: "Καθηγήτρια"
      },
      {
        id: 4,
        word: "ΑΥΤΟΚΙΝΗΤΟ",
        syllables: ["ΑΥ", "ΤΟ", "ΚΙ", "ΝΗ", "ΤΟ"],
        emoji: "🚗",
        meaning: "Αυτοκίνητο"
      },
      {
        id: 5,
        word: "ΤΗΛΕΟΡΑΣΗ",
        syllables: ["ΤΗ", "ΛΕ", "Ο", "ΡΑ", "ΣΗ"],
        emoji: "📺",
        meaning: "Τηλεόραση"
      },
      {
        id: 6,
        word: "ΚΑΛΟΚΑΙΡΙ",
        syllables: ["ΚΑ", "ΛΟ", "ΚΑΙ", "ΡΙ"],
        emoji: "☀️",
        meaning: "Καλοκαίρι"
      },
      {
        id: 7,
        word: "ΑΝΕΜΟΠΟΡΤΑ",
        syllables: ["Α", "ΝΕ", "ΜΟ", "ΠΟΡ", "ΤΑ"],
        emoji: "🌪️",
        meaning: "Ανεμοπόρτα"
      },
      {
        id: 8,
        word: "ΠΑΓΩΤΑΤΖΗΣ",
        syllables: ["ΠΑ", "ΓΩ", "ΤΑ", "ΤΖΗΣ"],
        emoji: "🍦",
        meaning: "Παγωτατζής"
      },
      {
        id: 9,
        word: "ΕΣΤΙΑΤΟΡΙΟ",
        syllables: ["Ε", "ΣΤΙ", "Α", "ΤΟ", "ΡΙ", "Ο"],
        emoji: "🍽️",
        meaning: "Εστιατόριο"
      },
      {
        id: 10,
        word: "ΝΟΣΟΚΟΜΕΙΟ",
        syllables: ["ΝΟ", "ΣΟ", "ΚΟ", "ΜΕΙ", "Ο"],
        emoji: "🏥",
        meaning: "Νοσοκομείο"
      }
    ],
    en: [
      {
        id: 1,
        word: "HELICOPTER",
        syllables: ["HEL", "I", "COP", "TER"],
        emoji: "🚁",
        meaning: "Helicopter"
      },
      {
        id: 2,
        word: "UNIVERSITY",
        syllables: ["U", "NI", "VER", "SI", "TY"],
        emoji: "🎓",
        meaning: "University"
      },
      {
        id: 3,
        word: "BASKETBALL",
        syllables: ["BAS", "KET", "BALL"],
        emoji: "🏀",
        meaning: "Basketball"
      },
      {
        id: 4,
        word: "COMPUTER",
        syllables: ["COM", "PU", "TER"],
        emoji: "💻",
        meaning: "Computer"
      },
      {
        id: 5,
        word: "TELEVISION",
        syllables: ["TEL", "E", "VI", "SION"],
        emoji: "📺",
        meaning: "Television"
      },
      {
        id: 6,
        word: "RESTAURANT",
        syllables: ["RES", "TAU", "RANT"],
        emoji: "🍽️",
        meaning: "Restaurant"
      },
      {
        id: 7,
        word: "DINOSAUR",
        syllables: ["DI", "NO", "SAUR"],
        emoji: "🦕",
        meaning: "Dinosaur"
      },
      {
        id: 8,
        word: "BEAUTIFUL",
        syllables: ["BEAU", "TI", "FUL"],
        emoji: "✨",
        meaning: "Beautiful"
      },
      {
        id: 9,
        word: "MOTORCYCLE",
        syllables: ["MO", "TOR", "CY", "CLE"],
        emoji: "🏍️",
        meaning: "Motorcycle"
      },
      {
        id: 10,
        word: "FANTASTIC",
        syllables: ["FAN", "TAS", "TIC"],
        emoji: "🌟",
        meaning: "Fantastic"
      }
    ]
  };
  const words = wordsData[lang];
  const currentWordData = words[currentWord];
  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/pop.mp3");
    completeRef.current = new Audio("/sounds/correct.mp3");
    correctSoundRef.current.preload = "auto";
    completeRef.current.preload = "auto";
  }, []);
  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "📝", "✏️", "📚", "🎯"][Math.floor(Math.random() * 8)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);
    setTimeout(() => setCelebrationEmojis([]), 2000);
  };
  const showScorePopup = (points) => {
    setScorePopup({ points, id: Date.now() });
    setTimeout(() => setScorePopup(null), 1500);
  };
  const handleSyllableTap = (index) => {
    if (tappedSyllables.includes(index)) return;
    correctSoundRef.current?.play().catch(() => {});
    const newTapped = [...tappedSyllables, index];
    setTappedSyllables(newTapped);
    if (newTapped.length === currentWordData.syllables.length) {
      completeRef.current?.play().catch(() => {});
      const newScore = score + currentWordData.syllables.length;
      setScore(newScore);
      showScorePopup(currentWordData.syllables.length);
      createCelebrationEmojis();
      updateProgress({ title: "Break Word", score: newScore, total: TARGET_WORDS, index: currentWord + 1 });
      setTimeout(() => {
        if (currentWord + 1 < TARGET_WORDS) {
          setCurrentWord(currentWord + 1);
          setTappedSyllables([]);
        } else {
          setShowCelebration(true);
          setTimeout(() => {
            completeQuiz({
              title: lang === "el" ? "Συλλαβές" : "Syllables",
              score: newScore,
              total: words.reduce((sum, w) => sum + w.syllables.length, 0),
            });
            onComplete?.();
          }, 2000);
        }
      }, 1500);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-6 relative overflow-hidden">
      {celebrationEmojis.map((emoji) => (
        <div
          key={emoji.id}
          className="absolute text-4xl animate-bounce pointer-events-none z-10"
          style={{
            left: `${emoji.x}%`,
            top: "10%",
            animationDelay: `${emoji.delay}s`,
            animationDuration: "1s",
          }}
        >
          {emoji.emoji}
        </div>
      ))}
      {scorePopup && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce">
          <div className="bg-yellow-400 text-white px-8 py-4 rounded-full text-4xl font-bold shadow-2xl border-4 border-yellow-500 flex items-center gap-2">
            <span>⭐</span>
            <span>+{scorePopup.points}</span>
            <span>⭐</span>
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
              <span className="text-4xl">✂️</span>
              {lang === "el" ? "Χώρισε τις Συλλαβές" : "Break into Syllables"}
            </h2>
            <div className="text-2xl font-bold text-purple-600">
              {currentWord + 1} / {TARGET_WORDS}
            </div>
          </div>
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-4 mb-4">
            <div className="text-sm text-purple-700 font-semibold mb-1">
              {lang === "el" ? "Πρόοδος" : "Progress"}
            </div>
            <div className="h-3 bg-white/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500 rounded-full"
                style={{ width: `${((currentWord + 1) / TARGET_WORDS) * 100}%` }}
              />
            </div>
            <div className="text-right text-purple-700 font-bold mt-1">
              {tappedSyllables.length} / {currentWordData?.syllables.length} {lang === "el" ? "συλλαβές" : "syllables"}
            </div>
          </div>
        </div>
        {!showCelebration ? (
          <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-10">
            <div className="text-center mb-8">
              <div className="text-8xl mb-6">{currentWordData?.emoji}</div>
              <h3 className="text-4xl font-bold text-gray-800 mb-2">
                {currentWordData?.meaning}
              </h3>
              <p className="text-xl text-gray-600 mb-6">
                {lang === "el" ? "Χτύπα κάθε συλλαβή" : "Tap each syllable"}
              </p>
              <div className="flex justify-center items-center gap-2 flex-wrap mb-8">
                {currentWordData?.syllables.map((syllable, index) => (
                  <button
                    key={index}
                    onClick={() => handleSyllableTap(index)}
                    disabled={tappedSyllables.includes(index)}
                    className={`px-8 py-6 rounded-2xl text-3xl font-bold transition-all transform ${
                      tappedSyllables.includes(index)
                        ? "bg-green-500 text-white scale-110 shadow-2xl"
                        : "bg-gradient-to-br from-pink-400 to-purple-400 text-white hover:scale-105 hover:shadow-xl"
                    }`}
                  >
                    {syllable}
                  </button>
                ))}
              </div>
              <div className="text-lg text-gray-500">
                {lang === "el" 
                  ? `${currentWordData?.syllables.length} συλλαβές συνολικά` 
                  : `${currentWordData?.syllables.length} syllables total`}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl shadow-2xl p-12 text-center text-white animate-bounce">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-5xl font-bold mb-4">
              {lang === "el" ? "Συγχαρητήρια!" : "Congratulations!"}
            </h2>
            <p className="text-3xl mb-4">
              {lang === "el" ? `Βαθμολογία: ${score}` : `Score: ${score}`}
            </p>
            <p className="text-2xl">
              {lang === "el" ? "Είσαι εξπέρ στις συλλαβές!" : "You're a syllable expert!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
