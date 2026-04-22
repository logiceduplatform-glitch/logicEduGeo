// src/components/games/exercises_6_1/GuessWhatGame.jsx - Age 6 override
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";
import useSafeTimeout from "../../../hooks/useSafeTimeout";

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
      { id: 1, description: "Είμαι στρογγυλή, με κλωτσάνε και πηδάω", correct: "ball", color: "#EAB308", options: [{ id: "ball", name: "Μπάλα", emoji: "⚽" }, { id: "balloon", name: "Μπαλόνι", emoji: "🎈" }, { id: "apple", name: "Μήλο", emoji: "🍎" }] },
      { id: 2, description: "Με ανοίγεις, διαβάζεις ιστορίες μέσα μου", correct: "book", color: "#F59E0B", options: [{ id: "book", name: "Βιβλίο", emoji: "📖" }, { id: "phone", name: "Τηλέφωνο", emoji: "📱" }, { id: "guitar", name: "Κιθάρα", emoji: "🎸" }] },
      { id: 3, description: "Έχω δείκτες και δείχνω την ώρα", correct: "clock", color: "#F97316", options: [{ id: "clock", name: "Ρολόι", emoji: "⏰" }, { id: "phone", name: "Τηλέφωνο", emoji: "📱" }, { id: "umbrella", name: "Ομπρέλα", emoji: "☂️" }] },
      { id: 4, description: "Πετάω στον ουρανό αλλά δεν είμαι πουλί", correct: "airplane", color: "#06B6D4", options: [{ id: "airplane", name: "Αεροπλάνο", emoji: "✈️" }, { id: "bird", name: "Πουλί", emoji: "🐦" }, { id: "cloud", name: "Σύννεφο", emoji: "☁️" }] },
      { id: 5, description: "Έχω σελίδες, γράφεις μέσα μου στο σχολείο", correct: "notebook", color: "#EF4444", options: [{ id: "notebook", name: "Σημειωματάριο", emoji: "📓" }, { id: "phone", name: "Τηλέφωνο", emoji: "📱" }, { id: "magnet", name: "Μαγνήτης", emoji: "🧲" }] },
      { id: 6, description: "Είμαι ψηλός, έχω κορμό και φύλλα", correct: "tree", color: "#22C55E", options: [{ id: "tree", name: "Δέντρο", emoji: "🌳" }, { id: "house", name: "Σπίτι", emoji: "🏠" }, { id: "mountain", name: "Βουνό", emoji: "🏔️" }] },
      { id: 7, description: "Με φοράνε στο κεφάλι όταν βρέχει", correct: "umbrella", color: "#EC4899", options: [{ id: "umbrella", name: "Ομπρέλα", emoji: "☂️" }, { id: "hat", name: "Καπέλο", emoji: "🎩" }, { id: "shoe", name: "Παπούτσι", emoji: "👟" }] },
      { id: 8, description: "Ζω στη ζούγκλα και είμαι ο βασιλιάς των ζώων", correct: "lion", color: "#78350F", options: [{ id: "lion", name: "Λιοντάρι", emoji: "🦁" }, { id: "dog", name: "Σκύλος", emoji: "🐶" }, { id: "cat", name: "Γάτα", emoji: "🐱" }] },
      { id: 9, description: "Μπαίνεις μέσα μου και ταξιδεύεις στη θάλασσα", correct: "ship", color: "#A855F7", options: [{ id: "ship", name: "Πλοίο", emoji: "🚢" }, { id: "car", name: "Αυτοκίνητο", emoji: "🚗" }, { id: "airplane", name: "Αεροπλάνο", emoji: "✈️" }] },
      { id: 10, description: "Λάμπω τη νύχτα στον ουρανό, είμαι πολλά", correct: "stars", color: "#22C55E", options: [{ id: "stars", name: "Αστέρια", emoji: "⭐" }, { id: "moon", name: "Φεγγάρι", emoji: "🌙" }, { id: "sun", name: "Ήλιος", emoji: "☀️" }] },
      { id: 11, description: "Έχω ρόδες και πετάλια, κάνεις ποδήλατο", correct: "bicycle", color: "#9CA3AF", options: [{ id: "bicycle", name: "Ποδήλατο", emoji: "🚲" }, { id: "car", name: "Αυτοκίνητο", emoji: "🚗" }, { id: "scooter", name: "Πατίνι", emoji: "🛴" }] },
      { id: 12, description: "Είμαι κρύο, λιώνω στον ήλιο, πέφτω το χειμώνα", correct: "snow", color: "#06B6D4", options: [{ id: "snow", name: "Χιόνι", emoji: "❄️" }, { id: "rain", name: "Βροχή", emoji: "🌧️" }, { id: "sun", name: "Ήλιος", emoji: "☀️" }] },
      { id: 13, description: "Με κρατάς και γράφεις, έχω γόμα στην πίσω πλευρά", correct: "pencil", color: "#3B82F6", options: [{ id: "pencil", name: "Μολύβι", emoji: "✏️" }, { id: "phone", name: "Τηλέφωνο", emoji: "📱" }, { id: "key", name: "Κλειδί", emoji: "🔑" }] },
      { id: 14, description: "Ζω στο νερό, έχω κέλυφος και περπατάω αργά", correct: "turtle", color: "#14B8A6", options: [{ id: "turtle", name: "Χελώνα", emoji: "🐢" }, { id: "fish", name: "Ψάρι", emoji: "🐟" }, { id: "octopus", name: "Χταπόδι", emoji: "🐙" }] },
      { id: 15, description: "Κόβω χαρτί, είμαι αιχμηρή", correct: "scissors", color: "#8B5CF6", options: [{ id: "scissors", name: "Ψαλίδι", emoji: "✂️" }, { id: "crayon", name: "Κραγιόνι", emoji: "🖍️" }, { id: "ruler", name: "Χάρακας", emoji: "📏" }] }
    ],
    en: [
      { id: 1, description: "I am round, they kick me and I bounce", correct: "ball", color: "#EAB308", options: [{ id: "ball", name: "Ball", emoji: "⚽" }, { id: "balloon", name: "Balloon", emoji: "🎈" }, { id: "apple", name: "Apple", emoji: "🍎" }] },
      { id: 2, description: "You open me and read stories inside", correct: "book", color: "#F59E0B", options: [{ id: "book", name: "Book", emoji: "📖" }, { id: "phone", name: "Phone", emoji: "📱" }, { id: "guitar", name: "Guitar", emoji: "🎸" }] },
      { id: 3, description: "I have hands and I show the time", correct: "clock", color: "#F97316", options: [{ id: "clock", name: "Clock", emoji: "⏰" }, { id: "phone", name: "Phone", emoji: "📱" }, { id: "umbrella", name: "Umbrella", emoji: "☂️" }] },
      { id: 4, description: "I fly in the sky but I am not a bird", correct: "airplane", color: "#06B6D4", options: [{ id: "airplane", name: "Airplane", emoji: "✈️" }, { id: "bird", name: "Bird", emoji: "🐦" }, { id: "cloud", name: "Cloud", emoji: "☁️" }] },
      { id: 5, description: "I have pages, you write in me at school", correct: "notebook", color: "#EF4444", options: [{ id: "notebook", name: "Notebook", emoji: "📓" }, { id: "phone", name: "Phone", emoji: "📱" }, { id: "magnet", name: "Magnet", emoji: "🧲" }] },
      { id: 6, description: "I am tall, I have a trunk and leaves", correct: "tree", color: "#22C55E", options: [{ id: "tree", name: "Tree", emoji: "🌳" }, { id: "house", name: "House", emoji: "🏠" }, { id: "mountain", name: "Mountain", emoji: "🏔️" }] },
      { id: 7, description: "They wear me on their head when it rains", correct: "umbrella", color: "#EC4899", options: [{ id: "umbrella", name: "Umbrella", emoji: "☂️" }, { id: "hat", name: "Hat", emoji: "🎩" }, { id: "shoe", name: "Shoe", emoji: "👟" }] },
      { id: 8, description: "I live in the jungle and I am king of the animals", correct: "lion", color: "#78350F", options: [{ id: "lion", name: "Lion", emoji: "🦁" }, { id: "dog", name: "Dog", emoji: "🐶" }, { id: "cat", name: "Cat", emoji: "🐱" }] },
      { id: 9, description: "You get inside me and travel on the sea", correct: "ship", color: "#A855F7", options: [{ id: "ship", name: "Ship", emoji: "🚢" }, { id: "car", name: "Car", emoji: "🚗" }, { id: "airplane", name: "Airplane", emoji: "✈️" }] },
      { id: 10, description: "I shine in the sky at night, I am many", correct: "stars", color: "#22C55E", options: [{ id: "stars", name: "Stars", emoji: "⭐" }, { id: "moon", name: "Moon", emoji: "🌙" }, { id: "sun", name: "Sun", emoji: "☀️" }] },
      { id: 11, description: "I have wheels and pedals, you ride a bike", correct: "bicycle", color: "#9CA3AF", options: [{ id: "bicycle", name: "Bicycle", emoji: "🚲" }, { id: "car", name: "Car", emoji: "🚗" }, { id: "scooter", name: "Scooter", emoji: "🛴" }] },
      { id: 12, description: "I am cold, I melt in the sun, I fall in winter", correct: "snow", color: "#06B6D4", options: [{ id: "snow", name: "Snow", emoji: "❄️" }, { id: "rain", name: "Rain", emoji: "🌧️" }, { id: "sun", name: "Sun", emoji: "☀️" }] },
      { id: 13, description: "You hold me and write, I have an eraser on my back", correct: "pencil", color: "#3B82F6", options: [{ id: "pencil", name: "Pencil", emoji: "✏️" }, { id: "phone", name: "Phone", emoji: "📱" }, { id: "key", name: "Key", emoji: "🔑" }] },
      { id: 14, description: "I live in water, I have a shell and I walk slowly", correct: "turtle", color: "#14B8A6", options: [{ id: "turtle", name: "Turtle", emoji: "🐢" }, { id: "fish", name: "Fish", emoji: "🐟" }, { id: "octopus", name: "Octopus", emoji: "🐙" }] },
      { id: 15, description: "I cut paper, I am sharp", correct: "scissors", color: "#8B5CF6", options: [{ id: "scissors", name: "Scissors", emoji: "✂️" }, { id: "crayon", name: "Crayon", emoji: "🖍️" }, { id: "ruler", name: "Ruler", emoji: "📏" }] }
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
