// src/components/games/exercises_4_5/ExpressingNeeds.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function ExpressingNeeds({ lang = "el", onComplete }) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedExpression, setSelectedExpression] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_SCENARIOS = 8; // 8 σενάρια

  const scenariosData = {
    el: [
      {
        id: 1,
        situation: "Είναι μεσημέρι και η κοιλιά σου κάνει γκρρρ!",
        emoji: "😋",
        color: "#F59E0B",
        correctNeed: "hungry",
        options: [
          { id: "hungry", emoji: "🍽️", text: "Πεινάω", phrase: "Μπορώ να φάω κάτι παρακαλώ;" },
          { id: "thirsty", emoji: "💧", text: "Διψάω", phrase: "Θέλω νερό παρακαλώ" },
          { id: "tired", emoji: "😴", text: "Κουράστηκα", phrase: "Θέλω να ξεκουραστώ" },
        ]
      },
      {
        id: 2,
        situation: "Έπαιξες πολλή ώρα στην αυλή και το στόμα σου είναι στεγνό",
        emoji: "💧",
        color: "#06B6D4",
        correctNeed: "thirsty",
        options: [
          { id: "hungry", emoji: "🍽️", text: "Πεινάω", phrase: "Μπορώ να φάω;" },
          { id: "thirsty", emoji: "💧", text: "Διψάω", phrase: "Μπορώ να πιω νερό παρακαλώ;" },
          { id: "hot", emoji: "🥵", text: "Ζεσταίνομαι", phrase: "Έχω ζέστη" },
        ]
      },
      {
        id: 3,
        situation: "Είναι βράδυ, έπαιξες όλη μέρα και τα μάτια σου κλείνουν",
        emoji: "😴",
        color: "#8B5CF6",
        correctNeed: "tired",
        options: [
          { id: "bored", emoji: "😐", text: "Βαριέμαι", phrase: "Βαριέμαι" },
          { id: "tired", emoji: "😴", text: "Κουράστηκα", phrase: "Είμαι κουρασμένος/η, θέλω να ξεκουραστώ" },
          { id: "sleepy", emoji: "🌙", text: "Νυστάζω", phrase: "Θέλω να κοιμηθώ" },
        ]
      },
      {
        id: 4,
        situation: "Έφαγες πολλά γλυκά και νιώθεις άσχημα την κοιλιά σου",
        emoji: "🤢",
        color: "#EF4444",
        correctNeed: "sick",
        options: [
          { id: "sick", emoji: "🤒", text: "Αισθάνομαι άσχημα", phrase: "Δεν αισθάνομαι καλά" },
          { id: "full", emoji: "😋", text: "Χόρτασα", phrase: "Είμαι χορτάτος/η" },
          { id: "scared", emoji: "😨", text: "Φοβάμαι", phrase: "Φοβάμαι" },
        ]
      },
      {
        id: 5,
        situation: "Είσαι στο σχολείο και χρειάζεσαι να πας στην τουαλέτα",
        emoji: "🚽",
        color: "#10B981",
        correctNeed: "bathroom",
        options: [
          { id: "bathroom", emoji: "🚽", text: "Χρειάζομαι τουαλέτα", phrase: "Μπορώ να πάω στην τουαλέτα παρακαλώ;" },
          { id: "tired", emoji: "😴", text: "Κουράστηκα", phrase: "Είμαι κουρασμένος/η" },
          { id: "bored", emoji: "😐", text: "Βαριέμαι", phrase: "Βαριέμαι" },
        ]
      },
      {
        id: 6,
        situation: "Φοράς το μπουφάν σου και νιώθεις πολύ ζέστη",
        emoji: "🥵",
        color: "#F97316",
        correctNeed: "hot",
        options: [
          { id: "cold", emoji: "🥶", text: "Κρυώνω", phrase: "Έχω κρύο" },
          { id: "hot", emoji: "🥵", text: "Ζεσταίνομαι", phrase: "Έχω ζέστη" },
          { id: "uncomfortable", emoji: "😣", text: "Νιώθω άβολα", phrase: "Αισθάνομαι άβολα" },
        ]
      },
      {
        id: 7,
        situation: "Ο φίλος σου σε πείραξε και νιώθεις στενοχωρημένος/η",
        emoji: "😢",
        color: "#EC4899",
        correctNeed: "sad",
        options: [
          { id: "sad", emoji: "😢", text: "Είμαι λυπημένος/η", phrase: "Αισθάνομαι λυπημένος/η" },
          { id: "angry", emoji: "😠", text: "Είμαι θυμωμένος/η", phrase: "Είμαι θυμωμένος/η" },
          { id: "scared", emoji: "😨", text: "Φοβάμαι", phrase: "Φοβάμαι" },
        ]
      },
      {
        id: 8,
        situation: "Κάνει κρύο και δεν φοράς ζακέτα",
        emoji: "🥶",
        color: "#3B82F6",
        correctNeed: "cold",
        options: [
          { id: "cold", emoji: "🥶", text: "Κρυώνω", phrase: "Έχω κρύο, μπορώ να φορέσω κάτι;" },
          { id: "hot", emoji: "🥵", text: "Ζεσταίνομαι", phrase: "Έχω ζέστη" },
          { id: "fine", emoji: "😊", text: "Είμαι καλά", phrase: "Είμαι μια χαρά" },
        ]
      }
    ],
    en: [
      {
        id: 1,
        situation: "It's noon and your tummy is grumbling!",
        emoji: "😋",
        color: "#F59E0B",
        correctNeed: "hungry",
        options: [
          { id: "hungry", emoji: "🍽️", text: "I'm hungry", phrase: "Can I have something to eat please?" },
          { id: "thirsty", emoji: "💧", text: "I'm thirsty", phrase: "I want water please" },
          { id: "tired", emoji: "😴", text: "I'm tired", phrase: "I want to rest" },
        ]
      },
      {
        id: 2,
        situation: "You played for a long time in the yard and your mouth is dry",
        emoji: "💧",
        color: "#06B6D4",
        correctNeed: "thirsty",
        options: [
          { id: "hungry", emoji: "🍽️", text: "I'm hungry", phrase: "Can I eat?" },
          { id: "thirsty", emoji: "💧", text: "I'm thirsty", phrase: "Can I have water please?" },
          { id: "hot", emoji: "🥵", text: "I'm hot", phrase: "I'm hot" },
        ]
      },
      {
        id: 3,
        situation: "It's evening, you played all day and your eyes are closing",
        emoji: "😴",
        color: "#8B5CF6",
        correctNeed: "tired",
        options: [
          { id: "bored", emoji: "😐", text: "I'm bored", phrase: "I'm bored" },
          { id: "tired", emoji: "😴", text: "I'm tired", phrase: "I'm tired, I want to rest" },
          { id: "sleepy", emoji: "🌙", text: "I'm sleepy", phrase: "I want to sleep" },
        ]
      },
      {
        id: 4,
        situation: "You ate too many sweets and your tummy feels bad",
        emoji: "🤢",
        color: "#EF4444",
        correctNeed: "sick",
        options: [
          { id: "sick", emoji: "🤒", text: "I feel bad", phrase: "I don't feel well" },
          { id: "full", emoji: "😋", text: "I'm full", phrase: "I'm full" },
          { id: "scared", emoji: "😨", text: "I'm scared", phrase: "I'm scared" },
        ]
      },
      {
        id: 5,
        situation: "You're at school and need to use the bathroom",
        emoji: "🚽",
        color: "#10B981",
        correctNeed: "bathroom",
        options: [
          { id: "bathroom", emoji: "🚽", text: "I need bathroom", phrase: "Can I go to the bathroom please?" },
          { id: "tired", emoji: "😴", text: "I'm tired", phrase: "I'm tired" },
          { id: "bored", emoji: "😐", text: "I'm bored", phrase: "I'm bored" },
        ]
      },
      {
        id: 6,
        situation: "You're wearing your jacket and feeling very hot",
        emoji: "🥵",
        color: "#F97316",
        correctNeed: "hot",
        options: [
          { id: "cold", emoji: "🥶", text: "I'm cold", phrase: "I'm cold" },
          { id: "hot", emoji: "🥵", text: "I'm hot", phrase: "I'm hot" },
          { id: "uncomfortable", emoji: "😣", text: "I feel uncomfortable", phrase: "I feel uncomfortable" },
        ]
      },
      {
        id: 7,
        situation: "Your friend teased you and you feel upset",
        emoji: "😢",
        color: "#EC4899",
        correctNeed: "sad",
        options: [
          { id: "sad", emoji: "😢", text: "I'm sad", phrase: "I feel sad" },
          { id: "angry", emoji: "😠", text: "I'm angry", phrase: "I'm angry" },
          { id: "scared", emoji: "😨", text: "I'm scared", phrase: "I'm scared" },
        ]
      },
      {
        id: 8,
        situation: "It's cold and you're not wearing a jacket",
        emoji: "🥶",
        color: "#3B82F6",
        correctNeed: "cold",
        options: [
          { id: "cold", emoji: "🥶", text: "I'm cold", phrase: "I'm cold, can I wear something?" },
          { id: "hot", emoji: "🥵", text: "I'm hot", phrase: "I'm hot" },
          { id: "fine", emoji: "😊", text: "I'm fine", phrase: "I'm fine" },
        ]
      }
    ]
  };

  const scenarios = scenariosData[lang];
  const scenario = scenarios[currentScenario];

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
      emoji: ["🎉", "⭐", "✨", "🌟", "💬", "✅"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleExpressionSelect = (expression) => {
    if (showAnswer) return;

    setSelectedExpression(expression);
    setShowAnswer(true);

    const isCorrect = expression.id === scenario.correctNeed;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Expressing Needs",
        score: newScore,
        total: TARGET_SCENARIOS,
        index: currentScenario + 1,
      });

      completeQuiz({
        title: "Expressing Needs",
        score: 1,
        total: 1,
      });

      setTimeout(() => {
        if (currentScenario + 1 < TARGET_SCENARIOS) {
          setCurrentScenario(prev => prev + 1);
          setSelectedExpression(null);
          setShowAnswer(false);
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
      wrongSoundRef.current?.play().catch(() => {});

      setTimeout(() => {
        setSelectedExpression(null);
        setShowAnswer(false);
      }, 1500);
    }
  };

  const progressPercent = Math.round(((currentScenario + 1) / TARGET_SCENARIOS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Εκφρασμός Αναγκών" : "Expressing Needs"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Σενάριο ${currentScenario + 1}/${TARGET_SCENARIOS}`
                : `Scenario ${currentScenario + 1}/${TARGET_SCENARIOS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            💬 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-8 shadow-xl border-4" style={{ borderColor: scenario.color }}>
          <div className="text-9xl mb-4">{scenario.emoji}</div>
          <h2 className="text-2xl font-bold mb-4 text-slate-800">
            {scenario.situation}
          </h2>
          <p className="text-xl text-slate-600">
            {lang === "el" ? "Τι θα πεις;" : "What will you say?"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="grid grid-cols-1 gap-4">
          {scenario.options.map((expression) => {
            const isSelected = selectedExpression && selectedExpression.id === expression.id;
            const isCorrect = showAnswer && expression.id === scenario.correctNeed;
            const isWrong = showAnswer && isSelected && expression.id !== scenario.correctNeed;

            return (
              <button
                key={expression.id}
                onClick={() => handleExpressionSelect(expression)}
                disabled={showAnswer}
                className={`
                  relative p-6 rounded-2xl border-4 transition-all duration-300 transform
                  ${isCorrect ? "bg-green-100 border-green-500 scale-105" : ""}
                  ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                  ${!showAnswer ? "bg-white border-slate-300 hover:border-purple-400 hover:scale-102 cursor-pointer" : "cursor-not-allowed"}
                  ${showAnswer && !isSelected && expression.id !== scenario.correctNeed ? "opacity-50" : ""}
                `}
              >
                <div className="flex items-center gap-6">
                  <div className="text-7xl flex-shrink-0">{expression.emoji}</div>
                  <div className="text-left flex-1">
                    <p className="text-2xl font-bold text-slate-800 mb-2">{expression.text}</p>
                    <p className="text-lg text-slate-600 italic">"{expression.phrase}"</p>
                  </div>

                  {isCorrect && (
                    <div className="text-6xl flex-shrink-0 animate-bounce">
                      ✅
                    </div>
                  )}
                  {isWrong && (
                    <div className="text-6xl flex-shrink-0">
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
          {selectedExpression && selectedExpression.id === scenario.correctNeed ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el" ? "🎉 Σωστά! Έτσι εκφράζεις τις ανάγκες σου!" : "🎉 Correct! That's how you express your needs!"}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el" ? "Σκέψου πάλι! Τι χρειάζεσαι;" : "Think again! What do you need?"}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-pink-300/80 to-purple-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">💬🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Μπράβο! Ξέρεις να εκφράζεις τις ανάγκες σου!" : "Great! You know how to express your needs!"}
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

