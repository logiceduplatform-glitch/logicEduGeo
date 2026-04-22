// src/components/games/exercises_9_10_1/GuessWhatGame.jsx
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
      {
        id: 1,
        description: "Έχω κεφάλι αλλά δεν σκέφτομαι, ουρά αλλά δεν τρέχω",
        correct: "coin",
        color: "#EAB308",
        options: [
          { id: "coin", name: "Κέρμα", emoji: "🪙" },
          { id: "snake", name: "Φίδι", emoji: "🐍" },
          { id: "key", name: "Κλειδί", emoji: "🔑" },
        ]
      },
      {
        id: 2,
        description: "Τρώω τα πάντα αλλά αν μου δώσεις νερό, πεθαίνω",
        correct: "fire",
        color: "#EF4444",
        options: [
          { id: "fire", name: "Φωτιά", emoji: "🔥" },
          { id: "water", name: "Νερό", emoji: "💧" },
          { id: "tornado", name: "Ανεμοστρόβιλος", emoji: "🌪️" },
        ]
      },
      {
        id: 3,
        description: "Είμαι γεμάτο τρύπες αλλά κρατάω νερό",
        correct: "sponge",
        color: "#06B6D4",
        options: [
          { id: "sponge", name: "Σφουγγάρι", emoji: "🧽" },
          { id: "bucket", name: "Κάδος", emoji: "🪣" },
          { id: "bottle", name: "Μπουκάλι", emoji: "🧴" },
        ]
      },
      {
        id: 4,
        description: "Πηγαίνω πάντα μαζί σου αλλά δεν μπορείς να με πιάσεις",
        correct: "shadow",
        color: "#6B7280",
        options: [
          { id: "shadow", name: "Σκιά", emoji: "🌑" },
          { id: "wind", name: "Αέρας", emoji: "💨" },
          { id: "rainbow", name: "Ουράνιο τόξο", emoji: "🌈" },
        ]
      },
      {
        id: 5,
        description: "Γίνομαι μικρότερος κάθε φορά που με χρησιμοποιείς",
        correct: "eraser",
        color: "#A855F7",
        options: [
          { id: "eraser", name: "Γόμα", emoji: "✏️" },
          { id: "pencil", name: "Μολύβι", emoji: "✏️" },
          { id: "ruler", name: "Χάρακας", emoji: "📏" },
        ]
      },
      {
        id: 6,
        description: "Έχω πολλά κλειδιά αλλά δεν ανοίγω καμία πόρτα",
        correct: "piano",
        color: "#8B5CF6",
        options: [
          { id: "piano", name: "Πιάνο", emoji: "🎹" },
          { id: "key", name: "Κλειδί", emoji: "🔑" },
          { id: "door", name: "Πόρτα", emoji: "🚪" },
        ]
      },
      {
        id: 7,
        description: "Μπορείς να μου μιλήσεις αλλά δεν θα σου απαντήσω ποτέ ψέματα",
        correct: "mirror",
        color: "#3B82F6",
        options: [
          { id: "mirror", name: "Καθρέφτης", emoji: "🪞" },
          { id: "phone", name: "Κινητό", emoji: "📱" },
          { id: "tv", name: "Τηλεόραση", emoji: "📺" },
        ]
      },
      {
        id: 8,
        description: "Πέφτω αλλά δεν τρώω ποτέ ξύλο",
        correct: "rain",
        color: "#06B6D4",
        options: [
          { id: "rain", name: "Βροχή", emoji: "🌧️" },
          { id: "leaf", name: "Φύλλο", emoji: "🍂" },
          { id: "balloon", name: "Μπαλόνι", emoji: "🎈" },
        ]
      },
      {
        id: 9,
        description: "Ζω μέσα σε κέλυφος αλλά δεν είμαι ζώο",
        correct: "nut",
        color: "#F59E0B",
        options: [
          { id: "nut", name: "Καρύδι", emoji: "🥜" },
          { id: "snail", name: "Σαλιγκάρι", emoji: "🐌" },
          { id: "turtle", name: "Χελώνα", emoji: "🐢" },
        ]
      },
      {
        id: 10,
        description: "Βλέπω χωρίς μάτια",
        correct: "camera",
        color: "#EC4899",
        options: [
          { id: "camera", name: "Φωτογραφική μηχανή", emoji: "📷" },
          { id: "magnifier", name: "Φακός", emoji: "🔍" },
          { id: "flashlight", name: "Φακός", emoji: "🔦" },
        ]
      },
      {
        id: 11,
        description: "Ταξιδεύω γύρω από τον κόσμο αλλά μένω στη γωνία μου",
        correct: "stamp",
        color: "#10B981",
        options: [
          { id: "stamp", name: "Γραμματόσημο", emoji: "📮" },
          { id: "suitcase", name: "βαλίτσα", emoji: "🧳" },
          { id: "plane", name: "Αεροπλάνο", emoji: "✈️" },
        ]
      },
      {
        id: 12,
        description: "Γεννιέμαι ψηλά, πεθαίνω χαμηλά",
        correct: "snowflake",
        color: "#93C5FD",
        options: [
          { id: "snowflake", name: "Χιονονιφάδα", emoji: "❄️" },
          { id: "rain", name: "Βροχή", emoji: "🌧️" },
          { id: "balloon", name: "Μπαλόνι", emoji: "🎈" },
        ]
      },
      {
        id: 13,
        description: "Μεγαλώνω χωρίς ζωή, δεν αναπνέω αλλά κρυώνω",
        correct: "ice",
        color: "#06B6D4",
        options: [
          { id: "ice", name: "Πάγος", emoji: "🧊" },
          { id: "plant", name: "Φυτό", emoji: "🌱" },
          { id: "fire", name: "Φωτιά", emoji: "🔥" },
        ]
      },
      {
        id: 14,
        description: "Έχω γλώσσα αλλά δεν μπορώ να μιλήσω",
        correct: "shoe",
        color: "#78350F",
        options: [
          { id: "shoe", name: "Παπούτσι", emoji: "👟" },
          { id: "bell", name: "Καμπάνα", emoji: "🔔" },
          { id: "phone", name: "Τηλέφωνο", emoji: "📱" },
        ]
      },
      {
        id: 15,
        description: "Γεμίζω ένα δωμάτιο χωρίς να πιάνω χώρο",
        correct: "light",
        color: "#FBBF24",
        options: [
          { id: "light", name: "Φως", emoji: "💡" },
          { id: "water", name: "Νερό", emoji: "💧" },
          { id: "music", name: "Μουσική", emoji: "🎵" },
        ]
      }
    ],
    en: [
      {
        id: 1,
        description: "I have a head but I don't think, a tail but I don't run",
        correct: "coin",
        color: "#EAB308",
        options: [
          { id: "coin", name: "Coin", emoji: "🪙" },
          { id: "snake", name: "Snake", emoji: "🐍" },
          { id: "key", name: "Key", emoji: "🔑" },
        ]
      },
      {
        id: 2,
        description: "I eat everything but if you give me water, I die",
        correct: "fire",
        color: "#EF4444",
        options: [
          { id: "fire", name: "Fire", emoji: "🔥" },
          { id: "water", name: "Water", emoji: "💧" },
          { id: "tornado", name: "Tornado", emoji: "🌪️" },
        ]
      },
      {
        id: 3,
        description: "I am full of holes but I hold water",
        correct: "sponge",
        color: "#06B6D4",
        options: [
          { id: "sponge", name: "Sponge", emoji: "🧽" },
          { id: "bucket", name: "Bucket", emoji: "🪣" },
          { id: "bottle", name: "Bottle", emoji: "🧴" },
        ]
      },
      {
        id: 4,
        description: "I always follow you but you can never catch me",
        correct: "shadow",
        color: "#6B7280",
        options: [
          { id: "shadow", name: "Shadow", emoji: "🌑" },
          { id: "wind", name: "Wind", emoji: "💨" },
          { id: "rainbow", name: "Rainbow", emoji: "🌈" },
        ]
      },
      {
        id: 5,
        description: "I get smaller every time you use me",
        correct: "eraser",
        color: "#A855F7",
        options: [
          { id: "eraser", name: "Eraser", emoji: "✏️" },
          { id: "pencil", name: "Pencil", emoji: "✏️" },
          { id: "ruler", name: "Ruler", emoji: "📏" },
        ]
      },
      {
        id: 6,
        description: "I have many keys but open no doors",
        correct: "piano",
        color: "#8B5CF6",
        options: [
          { id: "piano", name: "Piano", emoji: "🎹" },
          { id: "key", name: "Key", emoji: "🔑" },
          { id: "door", name: "Door", emoji: "🚪" },
        ]
      },
      {
        id: 7,
        description: "You can talk to me but I will never lie to you",
        correct: "mirror",
        color: "#3B82F6",
        options: [
          { id: "mirror", name: "Mirror", emoji: "🪞" },
          { id: "phone", name: "Phone", emoji: "📱" },
          { id: "tv", name: "TV", emoji: "📺" },
        ]
      },
      {
        id: 8,
        description: "I fall but I never get hurt",
        correct: "rain",
        color: "#06B6D4",
        options: [
          { id: "rain", name: "Rain", emoji: "🌧️" },
          { id: "leaf", name: "Leaf", emoji: "🍂" },
          { id: "balloon", name: "Balloon", emoji: "🎈" },
        ]
      },
      {
        id: 9,
        description: "I live inside a shell but I am not an animal",
        correct: "nut",
        color: "#F59E0B",
        options: [
          { id: "nut", name: "Nut", emoji: "🥜" },
          { id: "snail", name: "Snail", emoji: "🐌" },
          { id: "turtle", name: "Turtle", emoji: "🐢" },
        ]
      },
      {
        id: 10,
        description: "I see without eyes",
        correct: "camera",
        color: "#EC4899",
        options: [
          { id: "camera", name: "Camera", emoji: "📷" },
          { id: "magnifier", name: "Magnifier", emoji: "🔍" },
          { id: "flashlight", name: "Flashlight", emoji: "🔦" },
        ]
      },
      {
        id: 11,
        description: "I travel around the world but stay in my corner",
        correct: "stamp",
        color: "#10B981",
        options: [
          { id: "stamp", name: "Stamp", emoji: "📮" },
          { id: "suitcase", name: "Suitcase", emoji: "🧳" },
          { id: "plane", name: "Plane", emoji: "✈️" },
        ]
      },
      {
        id: 12,
        description: "I am born high, I die low",
        correct: "snowflake",
        color: "#93C5FD",
        options: [
          { id: "snowflake", name: "Snowflake", emoji: "❄️" },
          { id: "rain", name: "Rain", emoji: "🌧️" },
          { id: "balloon", name: "Balloon", emoji: "🎈" },
        ]
      },
      {
        id: 13,
        description: "I grow without life, I don't breathe but I get cold",
        correct: "ice",
        color: "#06B6D4",
        options: [
          { id: "ice", name: "Ice", emoji: "🧊" },
          { id: "plant", name: "Plant", emoji: "🌱" },
          { id: "fire", name: "Fire", emoji: "🔥" },
        ]
      },
      {
        id: 14,
        description: "I have a tongue but I cannot speak",
        correct: "shoe",
        color: "#78350F",
        options: [
          { id: "shoe", name: "Shoe", emoji: "👟" },
          { id: "bell", name: "Bell", emoji: "🔔" },
          { id: "phone", name: "Phone", emoji: "📱" },
        ]
      },
      {
        id: 15,
        description: "I fill a room without taking up space",
        correct: "light",
        color: "#FBBF24",
        options: [
          { id: "light", name: "Light", emoji: "💡" },
          { id: "water", name: "Water", emoji: "💧" },
          { id: "music", name: "Music", emoji: "🎵" },
        ]
      }
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
