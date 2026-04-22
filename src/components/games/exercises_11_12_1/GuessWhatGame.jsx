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
  const TARGET_ROUNDS = 12;

  const riddlesData = {
    el: [
      {
        id: 1,
        description: "Είμαι αόρατο, δεν έχω χρώμα ούτε γεύση, αλλά χωρίς εμένα δεν μπορείς να ζήσεις",
        correct: "oxygen",
        color: "#3B82F6",
        options: [
          { id: "oxygen", name: "Οξυγόνο", emoji: "💨" },
          { id: "water", name: "Νερό", emoji: "💧" },
          { id: "light", name: "Φως", emoji: "💡" },
        ]
      },
      {
        id: 2,
        description: "Έχω πόλεις αλλά δεν ζει κανείς εκεί. Έχω βουνά αλλά δεν υπάρχει έδαφος. Έχω νερό αλλά δεν υπάρχει ψάρι",
        correct: "map",
        color: "#10B981",
        options: [
          { id: "map", name: "Χάρτης", emoji: "🗺️" },
          { id: "dream", name: "Όνειρο", emoji: "💭" },
          { id: "painting", name: "Πίνακας", emoji: "🖼️" },
        ]
      },
      {
        id: 3,
        description: "Κινούμαι χωρίς πόδια, μιλάω χωρίς στόμα, λέω ιστορίες χωρίς φωνή",
        correct: "book",
        color: "#8B5CF6",
        options: [
          { id: "book", name: "Βιβλίο", emoji: "📖" },
          { id: "river", name: "Ποτάμι", emoji: "🏞️" },
          { id: "wind", name: "Άνεμος", emoji: "🌬️" },
        ]
      },
      {
        id: 4,
        description: "Με τροφοδοτεί ο ήλιος, με χρησιμοποιεί η τεχνολογία, χωρίς εμένα δεν ανάβει τίποτα",
        correct: "electricity",
        color: "#EAB308",
        options: [
          { id: "electricity", name: "Ηλεκτρισμός", emoji: "⚡" },
          { id: "fire", name: "Φωτιά", emoji: "🔥" },
          { id: "gas", name: "Αέριο", emoji: "💨" },
        ]
      },
      {
        id: 5,
        description: "Γεννήθηκα στην αρχαία Ελλάδα, θεωρούμαι πατέρας της ιατρικής, ο όρκος μου ισχύει ακόμα",
        correct: "hippocrates",
        color: "#EF4444",
        options: [
          { id: "hippocrates", name: "Ιπποκράτης", emoji: "⚕️" },
          { id: "aristotle", name: "Αριστοτέλης", emoji: "📜" },
          { id: "socrates", name: "Σωκράτης", emoji: "🏛️" },
        ]
      },
      {
        id: 6,
        description: "Έχω κορυφή αλλά δεν είμαι βουνό. Έχω πλευρές αλλά δεν είμαι κουτί. Μπορώ να είμαι ισόπλευρο",
        correct: "triangle",
        color: "#EC4899",
        options: [
          { id: "triangle", name: "Τρίγωνο", emoji: "🔺" },
          { id: "pyramid", name: "Πυραμίδα", emoji: "🔺" },
          { id: "diamond", name: "Διαμάντι", emoji: "💎" },
        ]
      },
      {
        id: 7,
        description: "Αλλάζω μορφή αλλά παραμένω ίδιο. Γίνομαι πάγος, νερό, ή ατμός. Καλύπτω το 71% της Γης",
        correct: "water",
        color: "#06B6D4",
        options: [
          { id: "water", name: "Νερό", emoji: "💧" },
          { id: "air", name: "Αέρας", emoji: "🌬️" },
          { id: "earth", name: "Χώμα", emoji: "🌍" },
        ]
      },
      {
        id: 8,
        description: "Είμαι ο μεγαλύτερος πλανήτης του ηλιακού μας συστήματος. Έχω μια μεγάλη κόκκινη κηλίδα",
        correct: "jupiter",
        color: "#F97316",
        options: [
          { id: "jupiter", name: "Δίας", emoji: "🪐" },
          { id: "saturn", name: "Κρόνος", emoji: "🪐" },
          { id: "mars", name: "Άρης", emoji: "🔴" },
        ]
      },
      {
        id: 9,
        description: "Ο Νεύτωνας με ανακάλυψε όταν ένα μήλο έπεσε. Κρατάω τα πάντα στη θέση τους",
        correct: "gravity",
        color: "#A855F7",
        options: [
          { id: "gravity", name: "Βαρύτητα", emoji: "🍎" },
          { id: "magnetism", name: "Μαγνητισμός", emoji: "🧲" },
          { id: "friction", name: "Τριβή", emoji: "🤚" },
        ]
      },
      {
        id: 10,
        description: "Είμαι το μοναδικό μέταλλο που είναι υγρό σε θερμοκρασία δωματίου",
        correct: "mercury",
        color: "#9CA3AF",
        options: [
          { id: "mercury", name: "Υδράργυρος", emoji: "🌡️" },
          { id: "gold", name: "Χρυσός", emoji: "🥇" },
          { id: "silver", name: "Ασήμι", emoji: "🥈" },
        ]
      },
      {
        id: 11,
        description: "Ανακαλύφθηκα από τον Φλέμινγκ, σώζω εκατομμύρια ζωές από μολύνσεις",
        correct: "penicillin",
        color: "#22C55E",
        options: [
          { id: "penicillin", name: "Πενικιλίνη", emoji: "💊" },
          { id: "vaccine", name: "Εμβόλιο", emoji: "💉" },
          { id: "vitamin", name: "Βιταμίνη", emoji: "🧬" },
        ]
      },
      {
        id: 12,
        description: "Είμαι γλώσσα που δεν μιλιέται πια αλλά επηρέασα πολλές σύγχρονες γλώσσες. Η Ρωμαϊκή Αυτοκρατορία με χρησιμοποιούσε",
        correct: "latin",
        color: "#78350F",
        options: [
          { id: "latin", name: "Λατινικά", emoji: "🏛️" },
          { id: "greek", name: "Αρχαία Ελληνικά", emoji: "🇬🇷" },
          { id: "sanskrit", name: "Σανσκριτικά", emoji: "📜" },
        ]
      }
    ],
    en: [
      {
        id: 1,
        description: "I am invisible, have no color or taste, but you can't live without me",
        correct: "oxygen",
        color: "#3B82F6",
        options: [
          { id: "oxygen", name: "Oxygen", emoji: "💨" },
          { id: "water", name: "Water", emoji: "💧" },
          { id: "light", name: "Light", emoji: "💡" },
        ]
      },
      {
        id: 2,
        description: "I have cities but nobody lives there. I have mountains but no ground. I have water but no fish",
        correct: "map",
        color: "#10B981",
        options: [
          { id: "map", name: "Map", emoji: "🗺️" },
          { id: "dream", name: "Dream", emoji: "💭" },
          { id: "painting", name: "Painting", emoji: "🖼️" },
        ]
      },
      {
        id: 3,
        description: "I move without feet, speak without a mouth, tell stories without a voice",
        correct: "book",
        color: "#8B5CF6",
        options: [
          { id: "book", name: "Book", emoji: "📖" },
          { id: "river", name: "River", emoji: "🏞️" },
          { id: "wind", name: "Wind", emoji: "🌬️" },
        ]
      },
      {
        id: 4,
        description: "The sun fuels me, technology uses me, nothing turns on without me",
        correct: "electricity",
        color: "#EAB308",
        options: [
          { id: "electricity", name: "Electricity", emoji: "⚡" },
          { id: "fire", name: "Fire", emoji: "🔥" },
          { id: "gas", name: "Gas", emoji: "💨" },
        ]
      },
      {
        id: 5,
        description: "I was born in ancient Greece, considered the father of medicine, my oath still stands today",
        correct: "hippocrates",
        color: "#EF4444",
        options: [
          { id: "hippocrates", name: "Hippocrates", emoji: "⚕️" },
          { id: "aristotle", name: "Aristotle", emoji: "📜" },
          { id: "socrates", name: "Socrates", emoji: "🏛️" },
        ]
      },
      {
        id: 6,
        description: "I have a vertex but I'm not a mountain. I have sides but I'm not a box. I can be equilateral",
        correct: "triangle",
        color: "#EC4899",
        options: [
          { id: "triangle", name: "Triangle", emoji: "🔺" },
          { id: "pyramid", name: "Pyramid", emoji: "🔺" },
          { id: "diamond", name: "Diamond", emoji: "💎" },
        ]
      },
      {
        id: 7,
        description: "I change form but stay the same. I become ice, water, or steam. I cover 71% of Earth",
        correct: "water",
        color: "#06B6D4",
        options: [
          { id: "water", name: "Water", emoji: "💧" },
          { id: "air", name: "Air", emoji: "🌬️" },
          { id: "earth", name: "Earth", emoji: "🌍" },
        ]
      },
      {
        id: 8,
        description: "I am the largest planet in our solar system. I have a great red spot",
        correct: "jupiter",
        color: "#F97316",
        options: [
          { id: "jupiter", name: "Jupiter", emoji: "🪐" },
          { id: "saturn", name: "Saturn", emoji: "🪐" },
          { id: "mars", name: "Mars", emoji: "🔴" },
        ]
      },
      {
        id: 9,
        description: "Newton discovered me when an apple fell. I keep everything in place",
        correct: "gravity",
        color: "#A855F7",
        options: [
          { id: "gravity", name: "Gravity", emoji: "🍎" },
          { id: "magnetism", name: "Magnetism", emoji: "🧲" },
          { id: "friction", name: "Friction", emoji: "🤚" },
        ]
      },
      {
        id: 10,
        description: "I am the only metal that is liquid at room temperature",
        correct: "mercury",
        color: "#9CA3AF",
        options: [
          { id: "mercury", name: "Mercury", emoji: "🌡️" },
          { id: "gold", name: "Gold", emoji: "🥇" },
          { id: "silver", name: "Silver", emoji: "🥈" },
        ]
      },
      {
        id: 11,
        description: "Discovered by Fleming, I save millions of lives from infections",
        correct: "penicillin",
        color: "#22C55E",
        options: [
          { id: "penicillin", name: "Penicillin", emoji: "💊" },
          { id: "vaccine", name: "Vaccine", emoji: "💉" },
          { id: "vitamin", name: "Vitamin", emoji: "🧬" },
        ]
      },
      {
        id: 12,
        description: "I am a language no longer spoken but influenced many modern languages. The Roman Empire used me",
        correct: "latin",
        color: "#78350F",
        options: [
          { id: "latin", name: "Latin", emoji: "🏛️" },
          { id: "greek", name: "Ancient Greek", emoji: "🇬🇷" },
          { id: "sanskrit", name: "Sanskrit", emoji: "📜" },
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
    safeTimeout(() => setCelebrationEmojis([]), 2000);
  };

  const speakDescription = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(round.description);
      utterance.lang = lang === 'el' ? 'el-GR' : 'en-US';
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      const voice = VoiceService.getVoice(lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const timer = safeTimeout(() => speakDescription(), 500);
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

      updateProgress({ title: "Guess What Game", score: newScore, total: TARGET_ROUNDS, index: currentRound + 1 });
      completeQuiz({ title: "Guess What Game", score: 1, total: 1 });

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
    <div className="relative w-full min-h-screen bg-gradient-to-br from-violet-100 via-purple-100 to-fuchsia-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Μάντεψε! - Προχωρημένο" : "Guess What! - Advanced"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el" ? `Αίνιγμα ${currentRound + 1}/${TARGET_ROUNDS}` : `Riddle ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-purple-600">🎯 {score}</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-400 to-purple-500 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="text-sm font-semibold text-slate-600">{progressPercent}%</span>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-8 shadow-xl border-4" style={{ borderColor: round.color }}>
          <div className="text-8xl mb-4">🧩</div>
          <h2 className="text-2xl font-bold mb-2 text-slate-600">
            {lang === "el" ? "Σκέψου καλά!" : "Think carefully!"}
          </h2>
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-6 rounded-xl mb-4 max-w-xl">
            <p className="text-xl font-bold text-slate-800 italic leading-relaxed">"{round.description}"</p>
          </div>
          <button onClick={speakDescription} className="px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg mb-4">
            🔊 {lang === "el" ? "Άκουσε" : "Listen"}
          </button>
          <p className="text-xl text-slate-600 mt-2">
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
                  ${!showAnswer ? "bg-white border-slate-300 hover:border-purple-400 hover:scale-105 cursor-pointer" : "cursor-not-allowed"}
                  ${showAnswer && !isSelected && option.id !== round.correct ? "opacity-50" : ""}
                `}
              >
                <div className="text-center">
                  <div className="text-6xl mb-3">{option.emoji}</div>
                  <p className="text-lg font-bold text-slate-800">{option.name}</p>
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
                {lang === "el" ? "🎉 Σωστά! Είσαι πολύ έξυπνος!" : "🎉 Correct! You're very smart!"}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-2xl font-bold text-red-700">
                {lang === "el" ? "Σκέψου πάλι!" : "Think again!"}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-violet-300/80 to-purple-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🧩🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Εξαιρετικά! Έλυσες όλα τα αινίγματα!" : "Excellent! You solved all riddles!"}
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
