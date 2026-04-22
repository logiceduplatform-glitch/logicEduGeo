import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function CombineTwoImagesGame({ lang = "el", onComplete }) {
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

  const TARGET_ROUNDS = 10;

  const roundsData = {
    el: [
      {
        id: 1,
        image1: { emoji: "⚡", label: "Ηλεκτρισμός" },
        image2: { emoji: "🧲", label: "Μαγνήτης" },
        correctAnswer: "electromagnet",
        description: "Τι δημιουργούν μαζί;",
        options: [
          { id: "electromagnet", emoji: "🔌🧲", label: "Ηλεκτρομαγνήτης" },
          { id: "battery", emoji: "🔋", label: "Μπαταρία" },
          { id: "light", emoji: "💡", label: "Φως" },
          { id: "heat", emoji: "🔥", label: "Θερμότητα" },
        ],
      },
      {
        id: 2,
        image1: { emoji: "🌋", label: "Ηφαίστειο" },
        image2: { emoji: "🌊", label: "Ωκεανός" },
        correctAnswer: "island",
        description: "Τι μπορούν να δημιουργήσουν;",
        options: [
          { id: "island", emoji: "🏝️", label: "Νησί" },
          { id: "desert", emoji: "🏜️", label: "Έρημος" },
          { id: "glacier", emoji: "🧊", label: "Παγετώνας" },
          { id: "cave", emoji: "🕳️", label: "Σπήλαιο" },
        ],
      },
      {
        id: 3,
        image1: { emoji: "🔬", label: "Μικροσκόπιο" },
        image2: { emoji: "🦠", label: "Βακτήρια" },
        correctAnswer: "microbiology",
        description: "Τι τομέα αντιπροσωπεύουν;",
        options: [
          { id: "microbiology", emoji: "🧬", label: "Μικροβιολογία" },
          { id: "astronomy", emoji: "🔭", label: "Αστρονομία" },
          { id: "geology", emoji: "🪨", label: "Γεωλογία" },
          { id: "chemistry", emoji: "⚗️", label: "Χημεία" },
        ],
      },
      {
        id: 4,
        image1: { emoji: "💧", label: "Νερό" },
        image2: { emoji: "☀️", label: "Ήλιος" },
        correctAnswer: "rainbow",
        description: "Τι δημιουργούν μαζί;",
        options: [
          { id: "rainbow", emoji: "🌈", label: "Ουράνιο Τόξο" },
          { id: "ice", emoji: "🧊", label: "Πάγος" },
          { id: "steam", emoji: "♨️", label: "Ατμός" },
          { id: "cloud", emoji: "☁️", label: "Σύννεφο" },
        ],
      },
      {
        id: 5,
        image1: { emoji: "🎭", label: "Θέατρο" },
        image2: { emoji: "🏛️", label: "Αρχαία Ελλάδα" },
        correctAnswer: "tragedy",
        description: "Τι δημιούργησαν μαζί;",
        options: [
          { id: "tragedy", emoji: "🎭", label: "Τραγωδία" },
          { id: "olympics", emoji: "🏅", label: "Ολυμπιακοί" },
          { id: "democracy", emoji: "🗳️", label: "Δημοκρατία" },
          { id: "philosophy", emoji: "📜", label: "Φιλοσοφία" },
        ],
      },
      {
        id: 6,
        image1: { emoji: "🧪", label: "Χημικά" },
        image2: { emoji: "🔥", label: "Θερμότητα" },
        correctAnswer: "reaction",
        description: "Τι συμβαίνει;",
        options: [
          { id: "reaction", emoji: "💥", label: "Χημική Αντίδραση" },
          { id: "freezing", emoji: "❄️", label: "Πάγωμα" },
          { id: "evaporation", emoji: "💨", label: "Εξάτμιση" },
          { id: "erosion", emoji: "🏔️", label: "Διάβρωση" },
        ],
      },
      {
        id: 7,
        image1: { emoji: "🌍", label: "Γη" },
        image2: { emoji: "🌙", label: "Σελήνη" },
        correctAnswer: "tides",
        description: "Τι φαινόμενο προκαλεί η αλληλεπίδρασή τους;",
        options: [
          { id: "tides", emoji: "🌊", label: "Παλίρροιες" },
          { id: "earthquakes", emoji: "🌋", label: "Σεισμοί" },
          { id: "auroras", emoji: "🌌", label: "Σέλας" },
          { id: "wind", emoji: "💨", label: "Άνεμος" },
        ],
      },
      {
        id: 8,
        image1: { emoji: "📐", label: "Γεωμετρία" },
        image2: { emoji: "🏗️", label: "Κατασκευή" },
        correctAnswer: "architecture",
        description: "Τι δημιουργούν μαζί;",
        options: [
          { id: "architecture", emoji: "🏛️", label: "Αρχιτεκτονική" },
          { id: "painting", emoji: "🎨", label: "Ζωγραφική" },
          { id: "music", emoji: "🎵", label: "Μουσική" },
          { id: "literature", emoji: "📚", label: "Λογοτεχνία" },
        ],
      },
      {
        id: 9,
        image1: { emoji: "🧠", label: "Εγκέφαλος" },
        image2: { emoji: "💻", label: "Υπολογιστής" },
        correctAnswer: "ai",
        description: "Τι τεχνολογία εμπνέεται;",
        options: [
          { id: "ai", emoji: "🤖", label: "Τεχνητή Νοημοσύνη" },
          { id: "internet", emoji: "🌐", label: "Ίντερνετ" },
          { id: "blockchain", emoji: "⛓️", label: "Blockchain" },
          { id: "vr", emoji: "🥽", label: "Εικονική Πραγματικότητα" },
        ],
      },
      {
        id: 10,
        image1: { emoji: "🎵", label: "Μουσική" },
        image2: { emoji: "📊", label: "Μαθηματικά" },
        correctAnswer: "harmony",
        description: "Τι τα συνδέει;",
        options: [
          { id: "harmony", emoji: "🎶", label: "Αρμονία" },
          { id: "color", emoji: "🎨", label: "Χρώμα" },
          { id: "gravity", emoji: "⬇️", label: "Βαρύτητα" },
          { id: "speed", emoji: "💨", label: "Ταχύτητα" },
        ],
      },
    ],
    en: [
      {
        id: 1,
        image1: { emoji: "⚡", label: "Electricity" },
        image2: { emoji: "🧲", label: "Magnet" },
        correctAnswer: "electromagnet",
        description: "What do they create together?",
        options: [
          { id: "electromagnet", emoji: "🔌🧲", label: "Electromagnet" },
          { id: "battery", emoji: "🔋", label: "Battery" },
          { id: "light", emoji: "💡", label: "Light" },
          { id: "heat", emoji: "🔥", label: "Heat" },
        ],
      },
      {
        id: 2,
        image1: { emoji: "🌋", label: "Volcano" },
        image2: { emoji: "🌊", label: "Ocean" },
        correctAnswer: "island",
        description: "What can they create?",
        options: [
          { id: "island", emoji: "🏝️", label: "Island" },
          { id: "desert", emoji: "🏜️", label: "Desert" },
          { id: "glacier", emoji: "🧊", label: "Glacier" },
          { id: "cave", emoji: "🕳️", label: "Cave" },
        ],
      },
      {
        id: 3,
        image1: { emoji: "🔬", label: "Microscope" },
        image2: { emoji: "🦠", label: "Bacteria" },
        correctAnswer: "microbiology",
        description: "What field do they represent?",
        options: [
          { id: "microbiology", emoji: "🧬", label: "Microbiology" },
          { id: "astronomy", emoji: "🔭", label: "Astronomy" },
          { id: "geology", emoji: "🪨", label: "Geology" },
          { id: "chemistry", emoji: "⚗️", label: "Chemistry" },
        ],
      },
      {
        id: 4,
        image1: { emoji: "💧", label: "Water" },
        image2: { emoji: "☀️", label: "Sun" },
        correctAnswer: "rainbow",
        description: "What do they create together?",
        options: [
          { id: "rainbow", emoji: "🌈", label: "Rainbow" },
          { id: "ice", emoji: "🧊", label: "Ice" },
          { id: "steam", emoji: "♨️", label: "Steam" },
          { id: "cloud", emoji: "☁️", label: "Cloud" },
        ],
      },
      {
        id: 5,
        image1: { emoji: "🎭", label: "Theatre" },
        image2: { emoji: "🏛️", label: "Ancient Greece" },
        correctAnswer: "tragedy",
        description: "What did they create together?",
        options: [
          { id: "tragedy", emoji: "🎭", label: "Tragedy" },
          { id: "olympics", emoji: "🏅", label: "Olympics" },
          { id: "democracy", emoji: "🗳️", label: "Democracy" },
          { id: "philosophy", emoji: "📜", label: "Philosophy" },
        ],
      },
      {
        id: 6,
        image1: { emoji: "🧪", label: "Chemicals" },
        image2: { emoji: "🔥", label: "Heat" },
        correctAnswer: "reaction",
        description: "What happens?",
        options: [
          { id: "reaction", emoji: "💥", label: "Chemical Reaction" },
          { id: "freezing", emoji: "❄️", label: "Freezing" },
          { id: "evaporation", emoji: "💨", label: "Evaporation" },
          { id: "erosion", emoji: "🏔️", label: "Erosion" },
        ],
      },
      {
        id: 7,
        image1: { emoji: "🌍", label: "Earth" },
        image2: { emoji: "🌙", label: "Moon" },
        correctAnswer: "tides",
        description: "What phenomenon does their interaction cause?",
        options: [
          { id: "tides", emoji: "🌊", label: "Tides" },
          { id: "earthquakes", emoji: "🌋", label: "Earthquakes" },
          { id: "auroras", emoji: "🌌", label: "Auroras" },
          { id: "wind", emoji: "💨", label: "Wind" },
        ],
      },
      {
        id: 8,
        image1: { emoji: "📐", label: "Geometry" },
        image2: { emoji: "🏗️", label: "Construction" },
        correctAnswer: "architecture",
        description: "What do they create together?",
        options: [
          { id: "architecture", emoji: "🏛️", label: "Architecture" },
          { id: "painting", emoji: "🎨", label: "Painting" },
          { id: "music", emoji: "🎵", label: "Music" },
          { id: "literature", emoji: "📚", label: "Literature" },
        ],
      },
      {
        id: 9,
        image1: { emoji: "🧠", label: "Brain" },
        image2: { emoji: "💻", label: "Computer" },
        correctAnswer: "ai",
        description: "What technology does this inspire?",
        options: [
          { id: "ai", emoji: "🤖", label: "Artificial Intelligence" },
          { id: "internet", emoji: "🌐", label: "Internet" },
          { id: "blockchain", emoji: "⛓️", label: "Blockchain" },
          { id: "vr", emoji: "🥽", label: "Virtual Reality" },
        ],
      },
      {
        id: 10,
        image1: { emoji: "🎵", label: "Music" },
        image2: { emoji: "📊", label: "Mathematics" },
        correctAnswer: "harmony",
        description: "What connects them?",
        options: [
          { id: "harmony", emoji: "🎶", label: "Harmony" },
          { id: "color", emoji: "🎨", label: "Color" },
          { id: "gravity", emoji: "⬇️", label: "Gravity" },
          { id: "speed", emoji: "💨", label: "Speed" },
        ],
      },
    ],
  };

  const rounds = roundsData[lang];
  const round = rounds[currentRound];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    setSelectedAnswer(null);
    setShowAnswer(false);
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "🧠"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);
    setTimeout(() => setCelebrationEmojis([]), 2000);
  };

  const handleAnswerSelect = (answerId) => {
    if (showAnswer) return;

    setSelectedAnswer(answerId);
    setShowAnswer(true);

    const isCorrect = answerId === round.correctAnswer;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});
      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({ title: "Combine Images", score: newScore, total: TARGET_ROUNDS, index: currentRound + 1 });

      setTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound((prev) => prev + 1);
        } else {
          createCelebrationEmojis();
          setShowCelebration(true);

          completeQuiz({
            title: lang === "el" ? "Συνδύασε Εικόνες" : "Combine Images",
            score: newScore,
            total: TARGET_ROUNDS,
          });

          setTimeout(() => {
            if (onComplete) onComplete();
          }, 2500);
        }
      }, 2500);
    } else {
      wrongSoundRef.current?.play().catch(() => {});
      setTimeout(() => {
        setSelectedAnswer(null);
        setShowAnswer(false);
      }, 1500);
    }
  };

  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);
  const correctOption = round.options.find((opt) => opt.id === round.correctAnswer);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-green-100 via-yellow-100 to-orange-100 p-4 sm:p-8 rounded-xl overflow-hidden">
      {celebrationEmojis.map((item) => (
        <div
          key={item.id}
          className="absolute text-4xl animate-float-up pointer-events-none z-20"
          style={{ left: `${item.x}%`, top: "50%", animationDelay: `${item.delay}s` }}
        >
          {item.emoji}
        </div>
      ))}

      {scorePopup && (
        <div
          key={scorePopup.id}
          className="absolute text-4xl font-bold text-green-600 pointer-events-none z-50"
          style={{ left: `${scorePopup.x}%`, top: "40%", animation: "float-up 1s ease-out forwards" }}
        >
          +1 ⭐⭐
        </div>
      )}

      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Συνδύασε 2 Έννοιες" : "Combine 2 Concepts"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-green-600">🧠 {score}</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-orange-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">{progressPercent}%</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-green-400">
          <div className="text-7xl mb-3">🤔</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">{round.description}</h2>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-green-400">
          <div className="flex justify-center items-center gap-8 mb-8 flex-wrap">
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl p-8 border-4 border-blue-400 flex flex-col items-center justify-center shadow-lg w-56 h-56">
              <div className="text-9xl mb-3">{round.image1.emoji}</div>
              <p className="text-xl font-bold text-slate-700">{round.image1.label}</p>
            </div>

            <div className="text-8xl font-bold text-green-600 animate-pulse">+</div>

            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 border-4 border-purple-400 flex flex-col items-center justify-center shadow-lg w-56 h-56">
              <div className="text-9xl mb-3">{round.image2.emoji}</div>
              <p className="text-xl font-bold text-slate-700">{round.image2.label}</p>
            </div>

            <div className="text-8xl font-bold text-orange-600 animate-pulse">=</div>

            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl p-8 border-4 border-dashed border-yellow-400 flex items-center justify-center shadow-lg w-56 h-56">
              <div className="text-9xl animate-bounce">❓</div>
            </div>
          </div>

          {!showAnswer && (
            <>
              <p className="text-2xl font-bold text-center text-slate-700 mb-6">
                {lang === "el" ? "Τι δημιουργούν μαζί;" : "What do they create together?"}
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                {round.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    className="p-6 rounded-2xl bg-gradient-to-br from-green-100 to-yellow-100 hover:from-green-200 hover:to-yellow-200 border-4 border-green-300 hover:border-green-500 transition-all duration-200 transform hover:scale-105 shadow-lg flex flex-col items-center justify-center cursor-pointer"
                  >
                    <div className="text-7xl mb-3">{option.emoji}</div>
                    <p className="text-lg font-bold text-slate-700">{option.label}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {showAnswer && selectedAnswer === round.correctAnswer && (
            <div className="text-center animate-fadeIn">
              <div className="inline-block bg-green-100 rounded-3xl p-8 border-4 border-green-400">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-6xl">{round.image1.emoji}</div>
                  <div className="text-4xl text-green-600">+</div>
                  <div className="text-6xl">{round.image2.emoji}</div>
                  <div className="text-4xl text-green-600">=</div>
                  <div className="text-8xl">{correctOption.emoji}</div>
                </div>
                <p className="text-3xl font-bold text-green-700">
                  {lang === "el"
                    ? `🎉 Σωστά! ${correctOption.label}!`
                    : `🎉 Correct! ${correctOption.label}!`}
                </p>
              </div>
            </div>
          )}

          {showAnswer && selectedAnswer !== round.correctAnswer && (
            <div className="text-center animate-fadeIn">
              <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
                <p className="text-3xl font-bold text-red-700">
                  {lang === "el" ? "Προσπάθησε ξανά!" : "Try again!"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-300/80 to-orange-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🧠🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el"
                ? "Τέλεια! Σκέφτεσαι σαν επιστήμονας!"
                : "Perfect! You think like a scientist!"}
            </h3>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-200px) scale(1.5); opacity: 0; }
        }
        .animate-float-up { animation: float-up 2s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-in; }
      `}</style>
    </div>
  );
}
