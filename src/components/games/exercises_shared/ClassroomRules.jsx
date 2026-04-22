// src/components/games/exercises_4_5/ClassroomRules.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function ClassroomRules({ lang = "el", onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedBehavior, setSelectedBehavior] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_ROUNDS = 8; // 8 καταστάσεις

  const roundsData = {
    el: [
      {
        id: 1,
        situation: "Θέλεις να μιλήσεις στην τάξη",
        emoji: "✋",
        color: "#3B82F6",
        correctBehavior: "raise",
        options: [
          { id: "raise", emoji: "✋", text: "Σηκώνω το χέρι μου" },
          { id: "shout", emoji: "📢", text: "Φωνάζω δυνατά" },
          { id: "interrupt", emoji: "🗣️", text: "Διακόπτω τον δάσκαλο" },
        ]
      },
      {
        id: 2,
        situation: "Άλλα παιδιά παίζουν με ένα παιχνίδι που θέλεις",
        emoji: "🎲",
        color: "#10B981",
        correctBehavior: "wait",
        options: [
          { id: "wait", emoji: "⏰", text: "Περιμένω τη σειρά μου" },
          { id: "grab", emoji: "🤚", text: "Παίρνω το παιχνίδι" },
          { id: "push", emoji: "😠", text: "Σπρώχνω τα άλλα παιδιά" },
        ]
      },
      {
        id: 3,
        situation: "Ο δάσκαλος μιλάει στην τάξη",
        emoji: "👨‍🏫",
        color: "#F59E0B",
        correctBehavior: "listen",
        options: [
          { id: "listen", emoji: "👂", text: "Ακούω με προσοχή" },
          { id: "talk", emoji: "💬", text: "Μιλάω με τον διπλανό μου" },
          { id: "play", emoji: "🎮", text: "Παίζω με το μολύβι μου" },
        ]
      },
      {
        id: 4,
        situation: "Ένα παιδί έπεσε και πονάει",
        emoji: "🤕",
        color: "#EF4444",
        correctBehavior: "help",
        options: [
          { id: "help", emoji: "🤝", text: "Τον βοηθάω και λέω στον δάσκαλο" },
          { id: "laugh", emoji: "😆", text: "Γελάω" },
          { id: "ignore", emoji: "🚶", text: "Τον αγνοώ και φεύγω" },
        ]
      },
      {
        id: 5,
        situation: "Τελείωσες την εργασία σου",
        emoji: "📝",
        color: "#8B5CF6",
        correctBehavior: "quiet",
        options: [
          { id: "quiet", emoji: "📚", text: "Κάθομαι ήσυχα ή διαβάζω" },
          { id: "run", emoji: "🏃", text: "Τρέχω στην τάξη" },
          { id: "disturb", emoji: "😜", text: "Ενοχλώ τους άλλους" },
        ]
      },
      {
        id: 6,
        situation: "Θέλεις να δανειστείς μια γόμα",
        emoji: "🧽",
        color: "#EC4899",
        correctBehavior: "ask",
        options: [
          { id: "ask", emoji: "🙏", text: "Ζητάω ευγενικά" },
          { id: "take", emoji: "✊", text: "Την παίρνω χωρίς να ρωτήσω" },
          { id: "demand", emoji: "😤", text: "Απαιτώ να μου τη δώσουν" },
        ]
      },
      {
        id: 7,
        situation: "Κάποιος σε ενοχλεί στην τάξη",
        emoji: "😕",
        color: "#06B6D4",
        correctBehavior: "tell",
        options: [
          { id: "tell", emoji: "👨‍🏫", text: "Το λέω στον δάσκαλο" },
          { id: "hit", emoji: "👊", text: "Τον χτυπάω" },
          { id: "yell", emoji: "😡", text: "Φωνάζω και θυμώνω" },
        ]
      },
      {
        id: 8,
        situation: "Μπαίνεις στην τάξη το πρωί",
        emoji: "🌅",
        color: "#F97316",
        correctBehavior: "greet",
        options: [
          { id: "greet", emoji: "👋", text: "Χαιρετάω τον δάσκαλο και τους συμμαθητές" },
          { id: "silent", emoji: "🤐", text: "Μπαίνω χωρίς να πω τίποτα" },
          { id: "loud", emoji: "📣", text: "Μπαίνω φωνάζοντας" },
        ]
      }
    ],
    en: [
      {
        id: 1,
        situation: "You want to speak in class",
        emoji: "✋",
        color: "#3B82F6",
        correctBehavior: "raise",
        options: [
          { id: "raise", emoji: "✋", text: "I raise my hand" },
          { id: "shout", emoji: "📢", text: "I shout loudly" },
          { id: "interrupt", emoji: "🗣️", text: "I interrupt the teacher" },
        ]
      },
      {
        id: 2,
        situation: "Other kids are playing with a toy you want",
        emoji: "🎲",
        color: "#10B981",
        correctBehavior: "wait",
        options: [
          { id: "wait", emoji: "⏰", text: "I wait my turn" },
          { id: "grab", emoji: "🤚", text: "I grab the toy" },
          { id: "push", emoji: "😠", text: "I push the other kids" },
        ]
      },
      {
        id: 3,
        situation: "The teacher is speaking in class",
        emoji: "👨‍🏫",
        color: "#F59E0B",
        correctBehavior: "listen",
        options: [
          { id: "listen", emoji: "👂", text: "I listen carefully" },
          { id: "talk", emoji: "💬", text: "I talk to my neighbor" },
          { id: "play", emoji: "🎮", text: "I play with my pencil" },
        ]
      },
      {
        id: 4,
        situation: "A child fell and is hurt",
        emoji: "🤕",
        color: "#EF4444",
        correctBehavior: "help",
        options: [
          { id: "help", emoji: "🤝", text: "I help and tell the teacher" },
          { id: "laugh", emoji: "😆", text: "I laugh" },
          { id: "ignore", emoji: "🚶", text: "I ignore and walk away" },
        ]
      },
      {
        id: 5,
        situation: "You finished your work",
        emoji: "📝",
        color: "#8B5CF6",
        correctBehavior: "quiet",
        options: [
          { id: "quiet", emoji: "📚", text: "I sit quietly or read" },
          { id: "run", emoji: "🏃", text: "I run in class" },
          { id: "disturb", emoji: "😜", text: "I disturb others" },
        ]
      },
      {
        id: 6,
        situation: "You want to borrow an eraser",
        emoji: "🧽",
        color: "#EC4899",
        correctBehavior: "ask",
        options: [
          { id: "ask", emoji: "🙏", text: "I ask politely" },
          { id: "take", emoji: "✊", text: "I take it without asking" },
          { id: "demand", emoji: "😤", text: "I demand they give it" },
        ]
      },
      {
        id: 7,
        situation: "Someone is bothering you in class",
        emoji: "😕",
        color: "#06B6D4",
        correctBehavior: "tell",
        options: [
          { id: "tell", emoji: "👨‍🏫", text: "I tell the teacher" },
          { id: "hit", emoji: "👊", text: "I hit them" },
          { id: "yell", emoji: "😡", text: "I yell and get angry" },
        ]
      },
      {
        id: 8,
        situation: "You enter the classroom in the morning",
        emoji: "🌅",
        color: "#F97316",
        correctBehavior: "greet",
        options: [
          { id: "greet", emoji: "👋", text: "I greet the teacher and classmates" },
          { id: "silent", emoji: "🤐", text: "I enter without saying anything" },
          { id: "loud", emoji: "📣", text: "I enter shouting" },
        ]
      }
    ]
  };

  const rounds = roundsData[lang];
  const round = rounds[currentRound];

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
      emoji: ["🎉", "⭐", "✨", "🌟", "👍", "✅"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleBehaviorSelect = (behavior) => {
    if (showAnswer) return;

    setSelectedBehavior(behavior);
    setShowAnswer(true);

    const isCorrect = behavior.id === round.correctBehavior;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Classroom Rules",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Classroom Rules",
        score: 1,
        total: 1,
      });

      setTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
          setSelectedBehavior(null);
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
        setSelectedBehavior(null);
        setShowAnswer(false);
      }, 1500);
    }
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Κανόνες Τάξης" : "Classroom Rules"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Κατάσταση ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Situation ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            👍 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-500 ease-out"
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
          <div className="text-9xl mb-4">{round.emoji}</div>
          <h2 className="text-2xl font-bold mb-4 text-slate-800">
            {round.situation}
          </h2>
          <p className="text-xl text-slate-600">
            {lang === "el" ? "Τι είναι το σωστό;" : "What is the right thing to do?"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="grid grid-cols-1 gap-4">
          {round.options.map((behavior) => {
            const isSelected = selectedBehavior && selectedBehavior.id === behavior.id;
            const isCorrect = showAnswer && behavior.id === round.correctBehavior;
            const isWrong = showAnswer && isSelected && behavior.id !== round.correctBehavior;

            return (
              <button
                key={behavior.id}
                onClick={() => handleBehaviorSelect(behavior)}
                disabled={showAnswer}
                className={`
                  relative p-6 rounded-2xl border-4 transition-all duration-300 transform
                  ${isCorrect ? "bg-green-100 border-green-500 scale-105" : ""}
                  ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                  ${!showAnswer ? "bg-white border-slate-300 hover:border-blue-400 hover:scale-102 cursor-pointer" : "cursor-not-allowed"}
                  ${showAnswer && !isSelected && behavior.id !== round.correctBehavior ? "opacity-50" : ""}
                `}
              >
                <div className="flex items-center gap-6">
                  <div className="text-7xl flex-shrink-0">{behavior.emoji}</div>
                  <p className="text-xl font-bold text-slate-800 text-left flex-1">{behavior.text}</p>

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
          {selectedBehavior && selectedBehavior.id === round.correctBehavior ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el" ? "🎉 Σωστά! Αυτή είναι η σωστή συμπεριφορά!" : "🎉 Correct! That's the right behavior!"}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el" ? "Σκέψου πάλι! Υπάρχει καλύτερη επιλογή." : "Think again! There's a better choice."}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300/80 to-indigo-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">👍🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Μπράβο! Ξέρεις τους κανόνες!" : "Great! You know the rules!"}
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

