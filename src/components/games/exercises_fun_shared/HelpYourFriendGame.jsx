// src/components/games/HelpYourFriendGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";

export default function HelpYourFriendGame({ lang = "el", difficulty = 3, onComplete }) {
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

  const TARGET_ROUNDS = 10;

  const roundsData = {
    el: [
      {
        id: 1,
        situation: {
          emoji: "😢📚",
          friend: "👧",
          description: "Η φίλη σου δυσκολεύεται με την άσκηση μαθηματικών.",
          context: "Στην τάξη"
        },
        correctAnswer: "help1",
        question: "Πώς μπορείς να τη βοηθήσεις;",
        options: [
          { id: "help1", emoji: "🤝", action: "Της εξηγείς με υπομονή", isCorrect: true },
          { id: "help2", emoji: "😏", action: "Της λες ότι είναι εύκολο", isCorrect: false },
          { id: "help3", emoji: "📱", action: "Της δίνεις τις απαντήσεις", isCorrect: false }
        ]
      },
      {
        id: 2,
        situation: {
          emoji: "😭🧸",
          friend: "👦",
          description: "Ο φίλος σου έχασε το αγαπημένο του παιχνίδι.",
          context: "Στην παιδική χαρά"
        },
        correctAnswer: "help2",
        question: "Πώς μπορείς να τον βοηθήσεις;",
        options: [
          { id: "help1", emoji: "🙄", action: "Του λες να μην κλαίει", isCorrect: false },
          { id: "help2", emoji: "🤗", action: "Του κρατάς συντροφιά και τον παρηγορείς", isCorrect: true },
          { id: "help3", emoji: "😐", action: "Τον αγνοείς", isCorrect: false }
        ]
      },
      {
        id: 3,
        situation: {
          emoji: "🤕💔",
          friend: "👧",
          description: "Η φίλη σου έπεσε και χτύπησε το γόνατό της.",
          context: "Στην αυλή"
        },
        correctAnswer: "help1",
        question: "Πώς μπορείς να τη βοηθήσεις;",
        options: [
          { id: "help1", emoji: "🏥", action: "Φωνάζεις έναν μεγάλο για βοήθεια", isCorrect: true },
          { id: "help2", emoji: "😆", action: "Γελάς μαζί της", isCorrect: false },
          { id: "help3", emoji: "🏃", action: "Συνεχίζεις να παίζεις", isCorrect: false }
        ]
      },
      {
        id: 4,
        situation: {
          emoji: "😰🎒",
          friend: "👦",
          description: "Ο φίλος σου κουβαλάει μια πολύ βαριά τσάντα.",
          context: "Στο διάδρομο"
        },
        correctAnswer: "help2",
        question: "Πώς μπορείς να τον βοηθήσεις;",
        options: [
          { id: "help1", emoji: "😒", action: "Του λες να την κουβαλήσει μόνος του", isCorrect: false },
          { id: "help2", emoji: "💪", action: "Προσφέρεσαι να την κουβαλήσετε μαζί", isCorrect: true },
          { id: "help3", emoji: "🚶", action: "Φεύγεις γρήγορα", isCorrect: false }
        ]
      },
      {
        id: 5,
        situation: {
          emoji: "😔🎂",
          friend: "👧",
          description: "Η φίλη σου είναι λυπημένη γιατί ξέχασαν τα γενέθλιά της.",
          context: "Στο σχολείο"
        },
        correctAnswer: "help3",
        question: "Πώς μπορείς να τη βοηθήσεις;",
        options: [
          { id: "help1", emoji: "🤷", action: "Της λες ότι δεν πειράζει", isCorrect: false },
          { id: "help2", emoji: "😐", action: "Δεν κάνεις τίποτα", isCorrect: false },
          { id: "help3", emoji: "🎁", action: "Της φτιάχνεις μια κάρτα ή ένα σχέδιο", isCorrect: true }
        ]
      },
      {
        id: 6,
        situation: {
          emoji: "😰🚪",
          friend: "👦",
          description: "Ο φίλος σου δεν μπορεί να ανοίξει την πόρτα της τάξης.",
          context: "Στο διάδρομο"
        },
        correctAnswer: "help1",
        question: "Πώς μπορείς να τον βοηθήσεις;",
        options: [
          { id: "help1", emoji: "🤝", action: "Τον βοηθάς να ανοίξει την πόρτα", isCorrect: true },
          { id: "help2", emoji: "😆", action: "Γελάς που δεν μπορεί", isCorrect: false },
          { id: "help3", emoji: "🏃", action: "Μπαίνεις πρώτος εσύ", isCorrect: false }
        ]
      },
      {
        id: 7,
        situation: {
          emoji: "😢🖍️",
          friend: "👧",
          description: "Η φίλη σου δεν έχει μολύβια για τη ζωγραφική.",
          context: "Στην τάξη"
        },
        correctAnswer: "help2",
        question: "Πώς μπορείς να τη βοηθήσεις;",
        options: [
          { id: "help1", emoji: "🙅", action: "Κρατάς τα δικά σου μολύβια", isCorrect: false },
          { id: "help2", emoji: "🎨", action: "Μοιράζεσαι τα μολύβια σου μαζί της", isCorrect: true },
          { id: "help3", emoji: "😒", action: "Της λες να ζητήσει από άλλον", isCorrect: false }
        ]
      },
      {
        id: 8,
        situation: {
          emoji: "😰🍎",
          friend: "👦",
          description: "Ο φίλος σου δεν έχει φαγητό για το διάλειμμα.",
          context: "Στην αυλή"
        },
        correctAnswer: "help3",
        question: "Πώς μπορείς να τον βοηθήσεις;",
        options: [
          { id: "help1", emoji: "😋", action: "Τρως το φαγητό σου μπροστά του", isCorrect: false },
          { id: "help2", emoji: "😐", action: "Τον αγνοείς", isCorrect: false },
          { id: "help3", emoji: "🤝", action: "Μοιράζεσαι το φαγητό σου μαζί του", isCorrect: true }
        ]
      },
      {
        id: 9,
        situation: {
          emoji: "😨🐶",
          friend: "👧",
          description: "Η φίλη σου φοβάται έναν σκύλο που πλησιάζει.",
          context: "Στο πάρκο"
        },
        correctAnswer: "help1",
        question: "Πώς μπορείς να τη βοηθήσεις;",
        options: [
          { id: "help1", emoji: "🤗", action: "Στέκεσαι δίπλα της και την καθησυχάζεις", isCorrect: true },
          { id: "help2", emoji: "😆", action: "Γελάς που φοβάται", isCorrect: false },
          { id: "help3", emoji: "🏃", action: "Τρέχεις μακριά", isCorrect: false }
        ]
      },
      {
        id: 10,
        situation: {
          emoji: "😔🎮",
          friend: "👦",
          description: "Ο φίλος σου δεν ξέρει πώς να παίξει το νέο παιχνίδι.",
          context: "Στο σπίτι"
        },
        correctAnswer: "help2",
        question: "Πώς μπορείς να τον βοηθήσεις;",
        options: [
          { id: "help1", emoji: "😎", action: "Παίζεις εσύ και του δείχνεις πόσο καλός είσαι", isCorrect: false },
          { id: "help2", emoji: "🤝", action: "Του δείχνεις με υπομονή πώς παίζεται", isCorrect: true },
          { id: "help3", emoji: "🙄", action: "Του λες ότι είναι πολύ εύκολο", isCorrect: false }
        ]
      }
    ],
    en: [
      {
        id: 1,
        situation: {
          emoji: "😢📚",
          friend: "👧",
          description: "Your friend is struggling with her math homework.",
          context: "In the classroom"
        },
        correctAnswer: "help1",
        question: "How can you help her?",
        options: [
          { id: "help1", emoji: "🤝", action: "You explain it to her patiently", isCorrect: true },
          { id: "help2", emoji: "😏", action: "You tell her it's easy", isCorrect: false },
          { id: "help3", emoji: "📱", action: "You give her the answers", isCorrect: false }
        ]
      },
      {
        id: 2,
        situation: {
          emoji: "😭🧸",
          friend: "👦",
          description: "Your friend lost his favorite toy.",
          context: "At the playground"
        },
        correctAnswer: "help2",
        question: "How can you help him?",
        options: [
          { id: "help1", emoji: "🙄", action: "You tell him not to cry", isCorrect: false },
          { id: "help2", emoji: "🤗", action: "You stay with him and comfort him", isCorrect: true },
          { id: "help3", emoji: "😐", action: "You ignore him", isCorrect: false }
        ]
      },
      {
        id: 3,
        situation: {
          emoji: "🤕💔",
          friend: "👧",
          description: "Your friend fell down and hurt her knee.",
          context: "In the yard"
        },
        correctAnswer: "help1",
        question: "How can you help her?",
        options: [
          { id: "help1", emoji: "🏥", action: "You call an adult for help", isCorrect: true },
          { id: "help2", emoji: "😆", action: "You laugh at her", isCorrect: false },
          { id: "help3", emoji: "🏃", action: "You keep playing", isCorrect: false }
        ]
      },
      {
        id: 4,
        situation: {
          emoji: "😰🎒",
          friend: "👦",
          description: "Your friend is carrying a very heavy bag.",
          context: "In the hallway"
        },
        correctAnswer: "help2",
        question: "How can you help him?",
        options: [
          { id: "help1", emoji: "😒", action: "You tell him to carry it himself", isCorrect: false },
          { id: "help2", emoji: "💪", action: "You offer to carry it together", isCorrect: true },
          { id: "help3", emoji: "🚶", action: "You walk away quickly", isCorrect: false }
        ]
      },
      {
        id: 5,
        situation: {
          emoji: "😔🎂",
          friend: "👧",
          description: "Your friend is sad because they forgot her birthday.",
          context: "At school"
        },
        correctAnswer: "help3",
        question: "How can you help her?",
        options: [
          { id: "help1", emoji: "🤷", action: "You tell her it doesn't matter", isCorrect: false },
          { id: "help2", emoji: "😐", action: "You do nothing", isCorrect: false },
          { id: "help3", emoji: "🎁", action: "You make her a card or drawing", isCorrect: true }
        ]
      },
      {
        id: 6,
        situation: {
          emoji: "😰🚪",
          friend: "👦",
          description: "Your friend can't open the classroom door.",
          context: "In the hallway"
        },
        correctAnswer: "help1",
        question: "How can you help him?",
        options: [
          { id: "help1", emoji: "🤝", action: "You help him open the door", isCorrect: true },
          { id: "help2", emoji: "😆", action: "You laugh that he can't do it", isCorrect: false },
          { id: "help3", emoji: "🏃", action: "You enter first", isCorrect: false }
        ]
      },
      {
        id: 7,
        situation: {
          emoji: "😢🖍️",
          friend: "👧",
          description: "Your friend doesn't have pencils for art class.",
          context: "In the classroom"
        },
        correctAnswer: "help2",
        question: "How can you help her?",
        options: [
          { id: "help1", emoji: "🙅", action: "You keep your pencils", isCorrect: false },
          { id: "help2", emoji: "🎨", action: "You share your pencils with her", isCorrect: true },
          { id: "help3", emoji: "😒", action: "You tell her to ask someone else", isCorrect: false }
        ]
      },
      {
        id: 8,
        situation: {
          emoji: "😰🍎",
          friend: "👦",
          description: "Your friend doesn't have food for break time.",
          context: "In the yard"
        },
        correctAnswer: "help3",
        question: "How can you help him?",
        options: [
          { id: "help1", emoji: "😋", action: "You eat your food in front of him", isCorrect: false },
          { id: "help2", emoji: "😐", action: "You ignore him", isCorrect: false },
          { id: "help3", emoji: "🤝", action: "You share your food with him", isCorrect: true }
        ]
      },
      {
        id: 9,
        situation: {
          emoji: "😨🐶",
          friend: "👧",
          description: "Your friend is scared of a dog that's approaching.",
          context: "At the park"
        },
        correctAnswer: "help1",
        question: "How can you help her?",
        options: [
          { id: "help1", emoji: "🤗", action: "You stand next to her and calm her down", isCorrect: true },
          { id: "help2", emoji: "😆", action: "You laugh at her fear", isCorrect: false },
          { id: "help3", emoji: "🏃", action: "You run away", isCorrect: false }
        ]
      },
      {
        id: 10,
        situation: {
          emoji: "😔🎮",
          friend: "👦",
          description: "Your friend doesn't know how to play the new game.",
          context: "At home"
        },
        correctAnswer: "help2",
        question: "How can you help him?",
        options: [
          { id: "help1", emoji: "😎", action: "You play and show off how good you are", isCorrect: false },
          { id: "help2", emoji: "🤝", action: "You patiently show him how to play", isCorrect: true },
          { id: "help3", emoji: "🙄", action: "You tell him it's too easy", isCorrect: false }
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

  useEffect(() => {
    setSelectedAnswer(null);
    setShowAnswer(false);
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "🤝"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    safeTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
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
      safeTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Help Your Friend Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Help Your Friend Game",
        score: 1,
        total: 1,
      });

      safeTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
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
  const correctOption = round.options.find(opt => opt.id === round.correctAnswer);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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

      {/* Header */}
      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Βοήθησε τον Φίλο" : "Help Your Friend"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-cyan-600">
            🤝 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-teal-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-cyan-400">
          <div className="text-7xl mb-3">🤝</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">
            {round.question}
          </h2>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-cyan-400">
          {/* Situation Display */}
          <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-3xl p-10 border-4 border-cyan-400 mb-8 shadow-lg">
            <div className="flex flex-col items-center justify-center gap-6">
              {/* Context Badge */}
              <div className="bg-cyan-500 text-white px-6 py-2 rounded-full font-bold text-lg">
                {round.situation.context}
              </div>

              {/* Friend and Situation */}
              <div className="flex items-center gap-6">
                <div className="text-9xl">{round.situation.friend}</div>
                <div className="text-8xl">{round.situation.emoji}</div>
              </div>

              {/* Description */}
              <div className="bg-white/90 rounded-2xl p-6 border-4 border-cyan-300 max-w-2xl">
                <p className="text-2xl font-bold text-center text-slate-800">
                  {round.situation.description}
                </p>
              </div>
            </div>
          </div>

          {/* Help Options */}
          {!showAnswer && (
            <>
              <p className="text-2xl font-bold text-center text-slate-700 mb-6">
                {round.question}
              </p>

              <div className="grid grid-cols-1 gap-4 max-w-3xl mx-auto">
                {round.options.map((option) => {
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswerSelect(option.id)}
                      className="p-6 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 hover:from-cyan-200 hover:to-blue-200 border-4 border-cyan-300 hover:border-cyan-500 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-6 cursor-pointer text-left"
                    >
                      <div className="text-7xl flex-shrink-0">{option.emoji}</div>
                      <p className="text-xl font-bold text-slate-700 flex-1">{option.action}</p>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Show Answer */}
          {showAnswer && selectedAnswer === round.correctAnswer && (
            <div className="text-center animate-fadeIn">
              <div className="inline-block bg-green-100 rounded-3xl p-8 border-4 border-green-400">
                <div className="flex items-center justify-center gap-6 mb-4">
                  <div className="text-8xl">{correctOption.emoji}</div>
                  <div className="text-8xl">{round.situation.friend}</div>
                  <div className="text-8xl">✅</div>
                </div>
                <p className="text-3xl font-bold text-green-700 mb-4">
                  {lang === "el"
                    ? `🎉 Μπράβο! Αυτή είναι η καλύτερη βοήθεια!`
                    : `🎉 Well done! This is the best help!`}
                </p>
                <p className="text-xl text-green-600">
                  {correctOption.action}
                </p>
              </div>
            </div>
          )}

          {showAnswer && selectedAnswer !== round.correctAnswer && (
            <div className="text-center animate-fadeIn">
              <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
                <p className="text-3xl font-bold text-red-700">
                  {lang === "el"
                    ? `Σκέψου ξανά! Πώς θα ήθελες εσύ να σε βοηθήσουν;`
                    : `Think again! How would you want to be helped?`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/80 to-blue-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🤝🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Είσαι πολύ καλός φίλος!" : "Perfect! You're a great friend!"}
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

