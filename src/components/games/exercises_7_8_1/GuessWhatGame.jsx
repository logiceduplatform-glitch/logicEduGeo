// src/components/games/exercises_7_8_1/GuessWhatGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";
import { VoiceService } from "../../../services/VoiceService";

export default function GuessWhatGame({ lang = "el", onComplete, difficulty = 3 }) {
  const { safeTimeout } = useSafeTimeout();
  const [currentRound, setCurrentRound] = useState(0);
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
  const WRONG_DELAY = [2000, 1800, 1500, 1200, 1000][d - 1];
  const NEXT_DELAY = [3000, 2800, 2500, 2200, 2000][d - 1];

  const TARGET_ROUNDS = 15;

  const riddlesData = {
    el: [
      { id: 1, description: "Δεν μπορείς να με κρατήσεις, φεύγω γρήγορα. Τι είμαι;", correct: "time", color: "#EAB308", options: [{ id: "time", name: "Χρόνος", emoji: "⏰" }, { id: "water", name: "Νερό", emoji: "💧" }, { id: "wind", name: "Αέρας", emoji: "🌬️" }] },
      { id: 2, description: "Όσο περισσότερο παίρνεις, τόσο μεγαλύτερο γίνεται", correct: "hole", color: "#F59E0B", options: [{ id: "hole", name: "Τρύπα", emoji: "🕳️" }, { id: "balloon", name: "Μπαλόνι", emoji: "🎈" }, { id: "box", name: "Κουτί", emoji: "📦" }] },
      { id: 3, description: "Έχω πόλεις αλλά κανένα σπίτι, δάση χωρίς δέντρα", correct: "map", color: "#F97316", options: [{ id: "map", name: "Χάρτης", emoji: "🗺️" }, { id: "globe", name: "Γήινος", emoji: "🌍" }, { id: "book", name: "Βιβλίο", emoji: "📖" }] },
      { id: 4, description: "Πηγαίνω πάντα μπροστά, δεν γυρνάω ποτέ πίσω", correct: "time", color: "#06B6D4", options: [{ id: "time", name: "Χρόνος", emoji: "⏰" }, { id: "car", name: "Αυτοκίνητο", emoji: "🚗" }, { id: "snail", name: "Σαλιγκάρι", emoji: "🐌" }] },
      { id: 5, description: "Μεγαλώνω χωρίς να τρώω", correct: "shadow", color: "#EF4444", options: [{ id: "shadow", name: "Σκιά", emoji: "🌑" }, { id: "plant", name: "Φυτό", emoji: "🌱" }, { id: "balloon", name: "Μπαλόνι", emoji: "🎈" }] },
      { id: 6, description: "Μπορώ να ταξιδέψω σε όλο τον κόσμο αλλά μένω στη γωνία μου", correct: "stamp", color: "#EC4899", options: [{ id: "stamp", name: "Γραμματόσημο", emoji: "📮" }, { id: "car", name: "Αυτοκίνητο", emoji: "🚗" }, { id: "plane", name: "Αεροπλάνο", emoji: "✈️" }] },
      { id: 7, description: "Όσο πιο πολύ στεγνώνω, τόσο πιο υγρή γίνομαι", correct: "towel", color: "#8B5CF6", options: [{ id: "towel", name: "Πετσέτα", emoji: "🧴" }, { id: "umbrella", name: "Ομπρέλα", emoji: "🌂" }, { id: "glove", name: "Γάντι", emoji: "🧤" }] },
      { id: 8, description: "Με κρατάς και χτενίζεσαι", correct: "comb", color: "#22C55E", options: [{ id: "comb", name: "Χτένα", emoji: "💇" }, { id: "brush", name: "Βούρτσα", emoji: "🖌️" }, { id: "mirror", name: "Καθρέφτης", emoji: "🪞" }] },
      { id: 9, description: "Δεν περπατώ αλλά πάω παντού", correct: "road", color: "#14B8A6", options: [{ id: "road", name: "Δρόμος", emoji: "🛣️" }, { id: "person", name: "Άνθρωπος", emoji: "🚶" }, { id: "bird", name: "Πουλί", emoji: "🐦" }] },
      { id: 10, description: "Μιλάω χωρίς στόμα, ακούω χωρίς αυτιά", correct: "telephone", color: "#A855F7", options: [{ id: "telephone", name: "Τηλέφωνο", emoji: "📞" }, { id: "tv", name: "Τηλεόραση", emoji: "📺" }, { id: "guitar", name: "Κιθάρα", emoji: "🎸" }] },
      { id: 11, description: "Ζω στη ζούγκλα, είμαι ο πιο ψηλός", correct: "giraffe", color: "#F59E0B", options: [{ id: "giraffe", name: "Καμηλοπάρδαλη", emoji: "🦒" }, { id: "elephant", name: "Ελέφαντας", emoji: "🐘" }, { id: "lion", name: "Λιοντάρι", emoji: "🦁" }] },
      { id: 12, description: "Έχω φύλλα αλλά δεν είμαι δέντρο", correct: "book", color: "#06B6D4", options: [{ id: "book", name: "Βιβλίο", emoji: "📖" }, { id: "tree", name: "Δέντρο", emoji: "🌳" }, { id: "painting", name: "Ζωγραφιά", emoji: "🎨" }] },
      { id: 13, description: "Γεννήθηκα μεγάλο, μεγαλώνοντας μικραίνω", correct: "candle", color: "#EAB308", options: [{ id: "candle", name: "Κερί", emoji: "🕯️" }, { id: "balloon", name: "Μπαλόνι", emoji: "🎈" }, { id: "plant", name: "Φυτό", emoji: "🌱" }] },
      { id: 14, description: "Τρέχω αλλά δεν έχω πόδια", correct: "river", color: "#3B82F6", options: [{ id: "river", name: "Ποτάμι", emoji: "🏞️" }, { id: "runner", name: "Δρομέας", emoji: "🏃" }, { id: "car", name: "Αυτοκίνητο", emoji: "🚗" }] },
      { id: 15, description: "Με γεμίζεις με γράμματα, με κλείνεις και με στέλνεις", correct: "envelope", color: "#EC4899", options: [{ id: "envelope", name: "Φάκελος", emoji: "✉️" }, { id: "box", name: "Κουτί", emoji: "📦" }, { id: "gift", name: "Δώρο", emoji: "🎁" }] }
    ],
    en: [
      { id: 1, description: "You cannot hold me, I leave quickly. What am I?", correct: "time", color: "#EAB308", options: [{ id: "time", name: "Time", emoji: "⏰" }, { id: "water", name: "Water", emoji: "💧" }, { id: "wind", name: "Wind", emoji: "🌬️" }] },
      { id: 2, description: "The more you take, the bigger I get", correct: "hole", color: "#F59E0B", options: [{ id: "hole", name: "Hole", emoji: "🕳️" }, { id: "balloon", name: "Balloon", emoji: "🎈" }, { id: "box", name: "Box", emoji: "📦" }] },
      { id: 3, description: "I have cities but no houses, forests but no trees", correct: "map", color: "#F97316", options: [{ id: "map", name: "Map", emoji: "🗺️" }, { id: "globe", name: "Globe", emoji: "🌍" }, { id: "book", name: "Book", emoji: "📖" }] },
      { id: 4, description: "I always go forward, I never go back", correct: "time", color: "#06B6D4", options: [{ id: "time", name: "Time", emoji: "⏰" }, { id: "car", name: "Car", emoji: "🚗" }, { id: "snail", name: "Snail", emoji: "🐌" }] },
      { id: 5, description: "I grow without eating", correct: "shadow", color: "#EF4444", options: [{ id: "shadow", name: "Shadow", emoji: "🌑" }, { id: "plant", name: "Plant", emoji: "🌱" }, { id: "balloon", name: "Balloon", emoji: "🎈" }] },
      { id: 6, description: "I can travel the world but stay in my corner", correct: "stamp", color: "#EC4899", options: [{ id: "stamp", name: "Stamp", emoji: "📮" }, { id: "car", name: "Car", emoji: "🚗" }, { id: "plane", name: "Plane", emoji: "✈️" }] },
      { id: 7, description: "The more I dry, the wetter I get", correct: "towel", color: "#8B5CF6", options: [{ id: "towel", name: "Towel", emoji: "🧴" }, { id: "umbrella", name: "Umbrella", emoji: "🌂" }, { id: "glove", name: "Glove", emoji: "🧤" }] },
      { id: 8, description: "You hold me and comb your hair", correct: "comb", color: "#22C55E", options: [{ id: "comb", name: "Comb", emoji: "💇" }, { id: "brush", name: "Brush", emoji: "🖌️" }, { id: "mirror", name: "Mirror", emoji: "🪞" }] },
      { id: 9, description: "I don't walk but I go everywhere", correct: "road", color: "#14B8A6", options: [{ id: "road", name: "Road", emoji: "🛣️" }, { id: "person", name: "Person", emoji: "🚶" }, { id: "bird", name: "Bird", emoji: "🐦" }] },
      { id: 10, description: "I speak without a mouth, I hear without ears", correct: "telephone", color: "#A855F7", options: [{ id: "telephone", name: "Telephone", emoji: "📞" }, { id: "tv", name: "TV", emoji: "📺" }, { id: "guitar", name: "Guitar", emoji: "🎸" }] },
      { id: 11, description: "I live in the jungle, I am the tallest", correct: "giraffe", color: "#F59E0B", options: [{ id: "giraffe", name: "Giraffe", emoji: "🦒" }, { id: "elephant", name: "Elephant", emoji: "🐘" }, { id: "lion", name: "Lion", emoji: "🦁" }] },
      { id: 12, description: "I have leaves but I am not a tree", correct: "book", color: "#06B6D4", options: [{ id: "book", name: "Book", emoji: "📖" }, { id: "tree", name: "Tree", emoji: "🌳" }, { id: "painting", name: "Painting", emoji: "🎨" }] },
      { id: 13, description: "I was born big, I shrink as I grow", correct: "candle", color: "#EAB308", options: [{ id: "candle", name: "Candle", emoji: "🕯️" }, { id: "balloon", name: "Balloon", emoji: "🎈" }, { id: "plant", name: "Plant", emoji: "🌱" }] },
      { id: 14, description: "I run but I have no legs", correct: "river", color: "#3B82F6", options: [{ id: "river", name: "River", emoji: "🏞️" }, { id: "runner", name: "Runner", emoji: "🏃" }, { id: "car", name: "Car", emoji: "🚗" }] },
      { id: 15, description: "You fill me with letters, close me and send me", correct: "envelope", color: "#EC4899", options: [{ id: "envelope", name: "Envelope", emoji: "✉️" }, { id: "box", name: "Box", emoji: "📦" }, { id: "gift", name: "Gift", emoji: "🎁" }] }
    ]
  };

  const riddles = riddlesData[lang];
  const round = riddles[currentRound];

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
      emoji: ["🎉", "⭐", "✨", "🌟", "🎯", "✅"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    safeTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const speakDescription = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(round.description);
      utterance.lang = lang === 'el' ? 'el-GR' : 'en-US';
      utterance.rate = 0.75;
      utterance.pitch = 1.1;
      const voice = VoiceService.getVoice(lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const timer = safeTimeout(() => {
      speakDescription();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentRound]);

  const handleAnswerSelect = (answerId) => {
    if (showAnswer) return;

    setSelectedAnswer(answerId);
    setShowAnswer(true);

    const isCorrect = answerId === round.correct;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      safeTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Guess What Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Guess What Game",
        score: 1,
        total: 1,
      });

      safeTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
          setSelectedAnswer(null);
          setShowAnswer(false);
        } else {
          createCelebrationEmojis();
          setShowCelebration(true);
          safeTimeout(() => {
            if (onComplete) {
              onComplete({ score: newScore, total: TARGET_ROUNDS });
            }
          }, NEXT_DELAY);
        }
      }, NEXT_DELAY);
    } else {
      wrongSoundRef.current?.play().catch(() => {});

      safeTimeout(() => {
        setSelectedAnswer(null);
        setShowAnswer(false);
      }, WRONG_DELAY);
    }
  };

  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Μάντεψε!" : "Guess What!"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Ερώτηση ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Question ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-amber-600">
            🎯 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-8 shadow-xl border-4" style={{ borderColor: round.color }}>
          <div className="text-9xl mb-4">🤔</div>
          <h2 className="text-3xl font-bold mb-4 text-slate-800">
            {lang === "el" ? "Άκου προσεκτικά!" : "Listen carefully!"}
          </h2>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-4">
            <p className="text-2xl font-bold text-slate-800 italic">
              "{round.description}"
            </p>
          </div>

          <button
            onClick={speakDescription}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-2xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg mb-4"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>

          <p className="text-xl text-slate-600 mt-4">
            {lang === "el" ? "Τι είμαι;" : "What am I?"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="grid grid-cols-3 gap-4">
          {round.options.map((option) => {
            const isSelected = selectedAnswer === option.id;
            const isCorrect = showAnswer && option.id === round.correct;
            const isWrong = showAnswer && isSelected && option.id !== round.correct;

            return (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(option.id)}
                disabled={showAnswer}
                className={`
                  relative p-6 rounded-2xl border-4 transition-all duration-300 transform
                  ${isCorrect ? "bg-green-100 border-green-500 scale-110" : ""}
                  ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                  ${!showAnswer ? "bg-white border-slate-300 hover:border-amber-400 hover:scale-105 cursor-pointer" : "cursor-not-allowed"}
                  ${showAnswer && !isSelected && option.id !== round.correct ? "opacity-50" : ""}
                `}
              >
                <div className="text-center">
                  <div className="text-7xl mb-3">{option.emoji}</div>
                  <p className="text-xl font-bold text-slate-800">{option.name}</p>

                  {isCorrect && (
                    <div className="text-6xl animate-bounce mt-3">
                      ✅
                    </div>
                  )}
                  {isWrong && (
                    <div className="text-6xl mt-3">
                      ❌
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showAnswer && (
        <div className="text-center animate-fadeIn">
          {selectedAnswer === round.correct ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el" ? "🎉 Σωστά! Μπράβο!" : "🎉 Correct! Well done!"}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el" ? "Σκέψου πάλι!" : "Think again!"}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-300/80 to-orange-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🎯🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Τα μάντεψες όλα!" : "Perfect! You guessed them all!"}
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
