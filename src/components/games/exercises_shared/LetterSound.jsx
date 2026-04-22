// src/components/games/exercises_4_5/LetterSound.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function LetterSound({ lang = "el", onComplete }) {
  const [currentLetter, setCurrentLetter] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_LETTERS = 5; // 5 γράμματα

  const lettersData = {
    el: [
      {
        id: 1,
        letter: "Μ",
        sound: "/μ/",
        images: [
          { id: "m1", emoji: "🍎", label: "Μήλο", correct: true },
          { id: "m2", emoji: "🐱", label: "Γάτα", correct: false },
          { id: "m3", emoji: "🐝", label: "Μέλισσα", correct: true },
          { id: "m4", emoji: "🐕", label: "Σκύλος", correct: false },
          { id: "m5", emoji: "👃", label: "Μύτη", correct: true },
          { id: "m6", emoji: "⚽", label: "Μπάλα", correct: true },
        ]
      },
      {
        id: 2,
        letter: "Π",
        sound: "/π/",
        images: [
          { id: "p1", emoji: "🦆", label: "Πάπια", correct: true },
          { id: "p2", emoji: "🌳", label: "Δέντρο", correct: false },
          { id: "p3", emoji: "🐦", label: "Πουλί", correct: true },
          { id: "p4", emoji: "🐟", label: "Ψάρι", correct: false },
          { id: "p5", emoji: "🍊", label: "Πορτοκάλι", correct: true },
          { id: "p6", emoji: "🚪", label: "Πόρτα", correct: true },
        ]
      },
      {
        id: 3,
        letter: "Κ",
        sound: "/κ/",
        images: [
          { id: "k1", emoji: "🦢", label: "Κύκνος", correct: true },
          { id: "k2", emoji: "🐘", label: "Ελέφαντας", correct: false },
          { id: "k3", emoji: "🎃", label: "Κολοκύθα", correct: true },
          { id: "k4", emoji: "🌸", label: "Λουλούδι", correct: false },
          { id: "k5", emoji: "🔔", label: "Κουδούνι", correct: true },
          { id: "k6", emoji: "🪑", label: "Καρέκλα", correct: true },
        ]
      },
      {
        id: 4,
        letter: "Σ",
        sound: "/σ/",
        images: [
          { id: "s1", emoji: "🐕", label: "Σκύλος", correct: true },
          { id: "s2", emoji: "🐱", label: "Γάτα", correct: false },
          { id: "s3", emoji: "⭐", label: "Αστέρι", correct: false },
          { id: "s4", emoji: "🏠", label: "Σπίτι", correct: true },
          { id: "s5", emoji: "🍇", label: "Σταφύλι", correct: true },
          { id: "s6", emoji: "🌙", label: "Σελήνη", correct: true },
        ]
      },
      {
        id: 5,
        letter: "Τ",
        sound: "/τ/",
        images: [
          { id: "t1", emoji: "🧀", label: "Τυρί", correct: true },
          { id: "t2", emoji: "🍎", label: "Μήλο", correct: false },
          { id: "t3", emoji: "🚂", label: "Τρένο", correct: true },
          { id: "t4", emoji: "🐝", label: "Μέλισσα", correct: false },
          { id: "t5", emoji: "🎾", label: "Τένις", correct: true },
          { id: "t6", emoji: "📞", label: "Τηλέφωνο", correct: true },
        ]
      }
    ],
    en: [
      {
        id: 1,
        letter: "A",
        sound: "/æ/",
        images: [
          { id: "a1", emoji: "🍎", label: "Apple", correct: true },
          { id: "a2", emoji: "🐱", label: "Cat", correct: false },
          { id: "a3", emoji: "✈️", label: "Airplane", correct: true },
          { id: "a4", emoji: "🐕", label: "Dog", correct: false },
          { id: "a5", emoji: "🦍", label: "Ape", correct: true },
          { id: "a6", emoji: "🐜", label: "Ant", correct: true },
        ]
      },
      {
        id: 2,
        letter: "B",
        sound: "/b/",
        images: [
          { id: "b1", emoji: "⚽", label: "Ball", correct: true },
          { id: "b2", emoji: "🌳", label: "Tree", correct: false },
          { id: "b3", emoji: "🐝", label: "Bee", correct: true },
          { id: "b4", emoji: "🐟", label: "Fish", correct: false },
          { id: "b5", emoji: "🐦", label: "Bird", correct: true },
          { id: "b6", emoji: "🚌", label: "Bus", correct: true },
        ]
      },
      {
        id: 3,
        letter: "C",
        sound: "/k/",
        images: [
          { id: "c1", emoji: "🐱", label: "Cat", correct: true },
          { id: "c2", emoji: "🐘", label: "Elephant", correct: false },
          { id: "c3", emoji: "🚗", label: "Car", correct: true },
          { id: "c4", emoji: "🌸", label: "Flower", correct: false },
          { id: "c5", emoji: "🍰", label: "Cake", correct: true },
          { id: "c6", emoji: "🐄", label: "Cow", correct: true },
        ]
      },
      {
        id: 4,
        letter: "D",
        sound: "/d/",
        images: [
          { id: "d1", emoji: "🐕", label: "Dog", correct: true },
          { id: "d2", emoji: "🐱", label: "Cat", correct: false },
          { id: "d3", emoji: "🦆", label: "Duck", correct: true },
          { id: "d4", emoji: "⭐", label: "Star", correct: false },
          { id: "d5", emoji: "🚪", label: "Door", correct: true },
          { id: "d6", emoji: "🦕", label: "Dinosaur", correct: true },
        ]
      },
      {
        id: 5,
        letter: "S",
        sound: "/s/",
        images: [
          { id: "s1", emoji: "☀️", label: "Sun", correct: true },
          { id: "s2", emoji: "🍎", label: "Apple", correct: false },
          { id: "s3", emoji: "⭐", label: "Star", correct: true },
          { id: "s4", emoji: "🐝", label: "Bee", correct: false },
          { id: "s5", emoji: "🐍", label: "Snake", correct: true },
          { id: "s6", emoji: "⚽", label: "Soccer", correct: true },
        ]
      }
    ]
  };

  const letters = lettersData[lang];

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

  const playLetterSound = () => {
    const utterance = new SpeechSynthesisUtterance(letters[currentLetter].sound);
    utterance.lang = lang === "el" ? "el-GR" : "en-US";
    utterance.rate = 0.7;
    utterance.pitch = 1.2;
    const voice = VoiceService.getVoice(lang);
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (letters[currentLetter]) {
      setTimeout(() => playLetterSound(), 500);
    }
  }, [currentLetter]);

  const handleImageSelect = (image) => {
    if (feedback || selectedImages.includes(image.id)) return;

    const newSelected = [...selectedImages, image.id];
    setSelectedImages(newSelected);

    if (image.correct) {
      correctSoundRef.current?.play().catch(() => {});
      setFeedback("correct");

      const newScore = score + 1;
      setScore(newScore);

      // Show +1 score popup
      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      // Ενημέρωση progress
      updateProgress({
        title: "Letter Sound",
        score: newScore,
        total: TARGET_LETTERS * 4, // 4 σωστές εικόνες ανά γράμμα
        index: newScore,
      });

      completeQuiz({
        title: "Letter Sound",
        score: 1,
        total: 1,
      });
    } else {
      wrongSoundRef.current?.play().catch(() => {});
      setFeedback("wrong");
    }

    // Έλεγχος αν τελείωσαν όλες οι σωστές εικόνες
    const correctImages = letters[currentLetter].images.filter(img => img.correct);
    const selectedCorrectCount = newSelected.filter(id =>
      correctImages.some(img => img.id === id)
    ).length;

    if (selectedCorrectCount === correctImages.length) {
      setTimeout(() => {
        if (currentLetter + 1 < TARGET_LETTERS) {
          setCurrentLetter(prev => prev + 1);
          setSelectedImages([]);
          setFeedback(null);
        } else {
          // Τελείωσαν όλα τα γράμματα
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
  };

  const letter = letters[currentLetter];
  const progressPercent = Math.round((currentLetter / TARGET_LETTERS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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

      {/* Score Bar - Enhanced */}
      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Ποιο γράμμα ακούς;" : "What letter do you hear?"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Γράμμα ${currentLetter + 1}/${TARGET_LETTERS}`
                : `Letter ${currentLetter + 1}/${TARGET_LETTERS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            🎯 {score}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Letter Display & Sound Button */}
      <div className="text-center mb-8">
        <div className="inline-block bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8 mb-4">
          <div className="text-9xl font-bold text-blue-600 mb-4">
            {letter.letter}
          </div>
          <button
            onClick={playLetterSound}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            🔊 {lang === "el" ? "Άκουσε το γράμμα" : "Hear the letter"}
          </button>
        </div>
        <p className="text-xl text-slate-700 font-semibold">
          {lang === "el"
            ? `Διάλεξε τις εικόνες που αρχίζουν από ${letter.letter}!`
            : `Choose images that start with ${letter.letter}!`}
        </p>
      </div>

      {/* Images Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-4">
        {letter.images.map((image) => {
          const isSelected = selectedImages.includes(image.id);
          const isCorrect = image.correct && isSelected;
          const isWrong = !image.correct && isSelected;

          return (
            <button
              key={image.id}
              onClick={() => handleImageSelect(image)}
              disabled={isSelected}
              className={`
                relative p-6 rounded-2xl border-4 transition-all duration-300 transform
                ${isCorrect ? "bg-green-100 border-green-500 scale-105" : ""}
                ${isWrong ? "bg-red-100 border-red-500 opacity-50" : ""}
                ${!isSelected ? "bg-white border-slate-300 hover:border-blue-400 hover:scale-105 cursor-pointer" : "cursor-not-allowed"}
              `}
            >
              <div className="text-7xl mb-3">{image.emoji}</div>
              <div className="text-lg font-semibold text-slate-700">
                {image.label}
              </div>
              {isCorrect && (
                <div className="absolute top-2 right-2 text-4xl animate-bounce">
                  ✅
                </div>
              )}
              {isWrong && (
                <div className="absolute top-2 right-2 text-4xl">
                  ❌
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300/80 to-purple-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
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
      `}</style>
    </div>
  );
}


