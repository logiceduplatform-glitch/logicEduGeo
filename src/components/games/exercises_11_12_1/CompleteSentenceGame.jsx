import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";
import { VoiceService } from "../../../services/VoiceService";

export default function CompleteSentenceGame({ lang = "el", onComplete, difficulty = 3 }) {
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
  const TARGET_ROUNDS = 12;

  const sentencesData = {
    el: [
      {
        id: 1,
        sentence: "Ο μαθητής που διαβάζει συστηματικά, ____ καλύτερα στις εξετάσεις.",
        correct: "αποδίδει",
        color: "#3B82F6",
        options: [
          { id: "performs", word: "αποδίδει", emoji: "📚" },
          { id: "plays", word: "παίζει", emoji: "🎮" },
          { id: "sleeps", word: "κοιμάται", emoji: "😴" },
        ]
      },
      {
        id: 2,
        sentence: "Η ____ είναι η μητέρα της εφεύρεσης.",
        correct: "ανάγκη",
        color: "#10B981",
        options: [
          { id: "need", word: "ανάγκη", emoji: "💡" },
          { id: "laziness", word: "τεμπελιά", emoji: "🦥" },
          { id: "luck", word: "τύχη", emoji: "🍀" },
        ]
      },
      {
        id: 3,
        sentence: "Τα δελφίνια είναι ____ και όχι ψάρια.",
        correct: "θηλαστικά",
        color: "#06B6D4",
        options: [
          { id: "mammals", word: "θηλαστικά", emoji: "🐬" },
          { id: "reptiles", word: "ερπετά", emoji: "🦎" },
          { id: "birds", word: "πουλιά", emoji: "🐦" },
        ]
      },
      {
        id: 4,
        sentence: "Η Γη ____ γύρω από τον Ήλιο σε 365 μέρες.",
        correct: "περιστρέφεται",
        color: "#EAB308",
        options: [
          { id: "revolves", word: "περιστρέφεται", emoji: "🌍" },
          { id: "stops", word: "σταματάει", emoji: "🛑" },
          { id: "falls", word: "πέφτει", emoji: "⬇️" },
        ]
      },
      {
        id: 5,
        sentence: "Όποιος σπέρνει ανέμους, ____ θύελλες.",
        correct: "θερίζει",
        color: "#EF4444",
        options: [
          { id: "reaps", word: "θερίζει", emoji: "🌪️" },
          { id: "plants", word: "φυτεύει", emoji: "🌱" },
          { id: "collects", word: "μαζεύει", emoji: "🧺" },
        ]
      },
      {
        id: 6,
        sentence: "Η φωτοσύνθεση γίνεται στα ____ των φυτών.",
        correct: "φύλλα",
        color: "#22C55E",
        options: [
          { id: "leaves", word: "φύλλα", emoji: "🍃" },
          { id: "roots", word: "ρίζες", emoji: "🌿" },
          { id: "flowers", word: "λουλούδια", emoji: "🌸" },
        ]
      },
      {
        id: 7,
        sentence: "Η δημοκρατία γεννήθηκε στην αρχαία ____.",
        correct: "Αθήνα",
        color: "#8B5CF6",
        options: [
          { id: "athens", word: "Αθήνα", emoji: "🏛️" },
          { id: "rome", word: "Ρώμη", emoji: "⛪" },
          { id: "sparta", word: "Σπάρτη", emoji: "⚔️" },
        ]
      },
      {
        id: 8,
        sentence: "Το νερό βράζει στους ____ βαθμούς Κελσίου.",
        correct: "100",
        color: "#F97316",
        options: [
          { id: "100", word: "100", emoji: "🌡️" },
          { id: "50", word: "50", emoji: "💧" },
          { id: "200", word: "200", emoji: "🔥" },
        ]
      },
      {
        id: 9,
        sentence: "Ένα τρίγωνο έχει εσωτερικές γωνίες που αθροίζουν ____.",
        correct: "180°",
        color: "#EC4899",
        options: [
          { id: "180", word: "180°", emoji: "📐" },
          { id: "360", word: "360°", emoji: "⭕" },
          { id: "90", word: "90°", emoji: "📏" },
        ]
      },
      {
        id: 10,
        sentence: "Η ____ είναι η δύναμη που μας κρατάει στη Γη.",
        correct: "βαρύτητα",
        color: "#14B8A6",
        options: [
          { id: "gravity", word: "βαρύτητα", emoji: "🍎" },
          { id: "electricity", word: "ηλεκτρισμός", emoji: "⚡" },
          { id: "magnetism", word: "μαγνητισμός", emoji: "🧲" },
        ]
      },
      {
        id: 11,
        sentence: "Ο Μέγας Αλέξανδρος ήταν βασιλιάς της ____.",
        correct: "Μακεδονίας",
        color: "#A855F7",
        options: [
          { id: "macedonia", word: "Μακεδονίας", emoji: "👑" },
          { id: "persia", word: "Περσίας", emoji: "🏰" },
          { id: "egypt", word: "Αιγύπτου", emoji: "🏺" },
        ]
      },
      {
        id: 12,
        sentence: "Η ταχύτητα του φωτός είναι περίπου 300.000 ____ ανά δευτερόλεπτο.",
        correct: "χιλιόμετρα",
        color: "#F59E0B",
        options: [
          { id: "km", word: "χιλιόμετρα", emoji: "💡" },
          { id: "meters", word: "μέτρα", emoji: "📏" },
          { id: "miles", word: "μίλια", emoji: "🛣️" },
        ]
      }
    ],
    en: [
      {
        id: 1,
        sentence: "A student who studies systematically ____ better on exams.",
        correct: "performs",
        color: "#3B82F6",
        options: [
          { id: "performs", word: "performs", emoji: "📚" },
          { id: "plays", word: "plays", emoji: "🎮" },
          { id: "sleeps", word: "sleeps", emoji: "😴" },
        ]
      },
      {
        id: 2,
        sentence: "____ is the mother of invention.",
        correct: "Necessity",
        color: "#10B981",
        options: [
          { id: "need", word: "Necessity", emoji: "💡" },
          { id: "laziness", word: "Laziness", emoji: "🦥" },
          { id: "luck", word: "Luck", emoji: "🍀" },
        ]
      },
      {
        id: 3,
        sentence: "Dolphins are ____, not fish.",
        correct: "mammals",
        color: "#06B6D4",
        options: [
          { id: "mammals", word: "mammals", emoji: "🐬" },
          { id: "reptiles", word: "reptiles", emoji: "🦎" },
          { id: "birds", word: "birds", emoji: "🐦" },
        ]
      },
      {
        id: 4,
        sentence: "Earth ____ around the Sun in 365 days.",
        correct: "revolves",
        color: "#EAB308",
        options: [
          { id: "revolves", word: "revolves", emoji: "🌍" },
          { id: "stops", word: "stops", emoji: "🛑" },
          { id: "falls", word: "falls", emoji: "⬇️" },
        ]
      },
      {
        id: 5,
        sentence: "He who sows the wind, ____ the storm.",
        correct: "reaps",
        color: "#EF4444",
        options: [
          { id: "reaps", word: "reaps", emoji: "🌪️" },
          { id: "plants", word: "plants", emoji: "🌱" },
          { id: "collects", word: "collects", emoji: "🧺" },
        ]
      },
      {
        id: 6,
        sentence: "Photosynthesis takes place in the ____ of plants.",
        correct: "leaves",
        color: "#22C55E",
        options: [
          { id: "leaves", word: "leaves", emoji: "🍃" },
          { id: "roots", word: "roots", emoji: "🌿" },
          { id: "flowers", word: "flowers", emoji: "🌸" },
        ]
      },
      {
        id: 7,
        sentence: "Democracy was born in ancient ____.",
        correct: "Athens",
        color: "#8B5CF6",
        options: [
          { id: "athens", word: "Athens", emoji: "🏛️" },
          { id: "rome", word: "Rome", emoji: "⛪" },
          { id: "sparta", word: "Sparta", emoji: "⚔️" },
        ]
      },
      {
        id: 8,
        sentence: "Water boils at ____ degrees Celsius.",
        correct: "100",
        color: "#F97316",
        options: [
          { id: "100", word: "100", emoji: "🌡️" },
          { id: "50", word: "50", emoji: "💧" },
          { id: "200", word: "200", emoji: "🔥" },
        ]
      },
      {
        id: 9,
        sentence: "A triangle's interior angles sum to ____.",
        correct: "180°",
        color: "#EC4899",
        options: [
          { id: "180", word: "180°", emoji: "📐" },
          { id: "360", word: "360°", emoji: "⭕" },
          { id: "90", word: "90°", emoji: "📏" },
        ]
      },
      {
        id: 10,
        sentence: "____ is the force that keeps us on Earth.",
        correct: "Gravity",
        color: "#14B8A6",
        options: [
          { id: "gravity", word: "Gravity", emoji: "🍎" },
          { id: "electricity", word: "Electricity", emoji: "⚡" },
          { id: "magnetism", word: "Magnetism", emoji: "🧲" },
        ]
      },
      {
        id: 11,
        sentence: "Alexander the Great was king of ____.",
        correct: "Macedonia",
        color: "#A855F7",
        options: [
          { id: "macedonia", word: "Macedonia", emoji: "👑" },
          { id: "persia", word: "Persia", emoji: "🏰" },
          { id: "egypt", word: "Egypt", emoji: "🏺" },
        ]
      },
      {
        id: 12,
        sentence: "The speed of light is approximately 300,000 ____ per second.",
        correct: "kilometers",
        color: "#F59E0B",
        options: [
          { id: "km", word: "kilometers", emoji: "💡" },
          { id: "meters", word: "meters", emoji: "📏" },
          { id: "miles", word: "miles", emoji: "🛣️" },
        ]
      }
    ]
  };

  const sentences = sentencesData[lang];
  const round = sentences[currentRound];

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
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "📝"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);
    safeTimeout(() => setCelebrationEmojis([]), 2000);
  };

  const speakSentence = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = round.sentence.replace("____", "...");
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'el' ? 'el-GR' : 'en-US';
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      const voice = VoiceService.getVoice(lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const timer = safeTimeout(() => speakSentence(), 500);
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

      updateProgress({ title: "Complete Sentence Game", score: newScore, total: TARGET_ROUNDS, index: currentRound + 1 });
      completeQuiz({ title: "Complete Sentence Game", score: 1, total: 1 });

      safeTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
          setSelectedAnswer(null);
          setShowAnswer(false);
        } else {
          createCelebrationEmojis();
          setShowCelebration(true);
          safeTimeout(() => { if (onComplete) onComplete({ score: newScore, total: TARGET_ROUNDS }); }, NEXT_DELAY);
        }
      }, NEXT_DELAY);
    } else {
      wrongSoundRef.current?.play().catch(() => {});
      safeTimeout(() => { setSelectedAnswer(null); setShowAnswer(false); }, WRONG_DELAY);
    }
  };

  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100 p-4 sm:p-8 rounded-xl overflow-hidden">
      {celebrationEmojis.map((item) => (
        <div key={item.id} className="absolute text-4xl animate-float-up pointer-events-none z-20" style={{ left: `${item.x}%`, top: "50%", animationDelay: `${item.delay}s` }}>
          {item.emoji}
        </div>
      ))}

      {scorePopup && (
        <div key={scorePopup.id} className="absolute text-4xl font-bold text-green-600 pointer-events-none z-50" style={{ left: `${scorePopup.x}%`, top: "40%", animation: "float-up 1s ease-out forwards" }}>
          +1 ⭐
        </div>
      )}

      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Συμπλήρωσε τη Φράση - Προχωρημένο" : "Complete the Sentence - Advanced"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el" ? `Φράση ${currentRound + 1}/${TARGET_ROUNDS}` : `Sentence ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-blue-600">📝 {score}</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="text-sm font-semibold text-slate-600">{progressPercent}%</span>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-8 shadow-xl border-4" style={{ borderColor: round.color }}>
          <div className="text-8xl mb-4">🎓</div>
          <h2 className="text-2xl font-bold mb-2 text-slate-600">
            {lang === "el" ? "Συμπλήρωσε:" : "Complete:"}
          </h2>
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-xl mb-4">
            <p className="text-2xl font-bold text-slate-800 leading-relaxed">{round.sentence}</p>
          </div>
          <button onClick={speakSentence} className="px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg">
            🔊 {lang === "el" ? "Άκουσε" : "Listen"}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="grid grid-cols-3 gap-4">
          {round.options.map((option) => {
            const isSelected = selectedAnswer === option.word;
            const isCorrect = showAnswer && option.word === round.correct;
            const isWrong = showAnswer && isSelected && option.word !== round.correct;

            return (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(option.word)}
                disabled={showAnswer}
                className={`
                  relative p-6 rounded-2xl border-4 transition-all duration-300 transform
                  ${isCorrect ? "bg-green-100 border-green-500 scale-110" : ""}
                  ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                  ${!showAnswer ? "bg-white border-slate-300 hover:border-blue-400 hover:scale-105 cursor-pointer" : "cursor-not-allowed"}
                  ${showAnswer && !isSelected && option.word !== round.correct ? "opacity-50" : ""}
                `}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3">{option.emoji}</div>
                  <p className="text-xl font-bold text-slate-800">{option.word}</p>
                  {isCorrect && <div className="text-5xl animate-bounce mt-2">✅</div>}
                  {isWrong && <div className="text-5xl mt-2">❌</div>}
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
              <p className="text-2xl font-bold text-green-700">
                {lang === "el" ? `🎉 Σωστά! "${round.sentence.replace("____", round.correct)}"` : `🎉 Correct! "${round.sentence.replace("____", round.correct)}"`}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-2xl font-bold text-red-700">
                {lang === "el" ? `Η σωστή ήταν: ${round.correct}` : `The correct one was: ${round.correct}`}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-sky-300/80 to-blue-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🎓🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Εξαιρετικά! Η γλώσσα σου είναι άψογη!" : "Excellent! Your language skills are perfect!"}
            </h3>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float-up { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-200px) scale(1.5); opacity: 0; } }
        .animate-float-up { animation: float-up 2s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-in; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
