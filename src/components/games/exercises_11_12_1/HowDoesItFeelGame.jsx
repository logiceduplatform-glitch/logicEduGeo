// src/components/games/exercises_11_12_1/HowDoesItFeelGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";

export default function HowDoesItFeelGame({ lang = "el", difficulty = 3, onComplete }) {
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

  const roundsData = {
    el: [
      {
        id: 1,
        scene: {
          emoji: "📝😤",
          description: "Ένα μαθητή πήρε χαμηλό βαθμό σε διαγώνισμα που μελέτησε πολύ.",
          character: "👧"
        },
        correctAnswer: "frustrated",
        question: "Πώς νιώθει;",
        options: [
          { id: "frustrated", emoji: "😤", label: "Απογοητευμένος" },
          { id: "happy", emoji: "😊", label: "Χαρούμενος" },
          { id: "tired", emoji: "😴", label: "Κουρασμένος" },
          { id: "angry", emoji: "😠", label: "Θυμωμένος" }
        ]
      },
      {
        id: 2,
        scene: {
          emoji: "💬😔",
          description: "Κάποιος διαδίδει φήμες για αυτόν στο σχολείο.",
          character: "👦"
        },
        correctAnswer: "betrayed",
        question: "Πώς νιώθει;",
        options: [
          { id: "betrayed", emoji: "😔", label: "Προδομένος" },
          { id: "happy", emoji: "😊", label: "Χαρούμενος" },
          { id: "sleepy", emoji: "😴", label: "Νυσταγμένος" },
          { id: "excited", emoji: "🤩", label: "Ενθουσιασμένος" }
        ]
      },
      {
        id: 3,
        scene: {
          emoji: "👫😒",
          description: "Ο καλύτερος φίλος του αρχίζει να κάνει παρέα με άλλον.",
          character: "👧"
        },
        correctAnswer: "jealous",
        question: "Πώς νιώθει;",
        options: [
          { id: "jealous", emoji: "😒", label: "Ζηλιάρης" },
          { id: "happy", emoji: "😊", label: "Χαρούμενος" },
          { id: "scared", emoji: "😨", label: "Φοβισμένος" },
          { id: "angry", emoji: "😠", label: "Θυμωμένος" }
        ]
      },
      {
        id: 4,
        scene: {
          emoji: "🎤😰",
          description: "Πρέπει να παρουσιάσει έργο μπροστά σε όλη την τάξη.",
          character: "👦"
        },
        correctAnswer: "anxious",
        question: "Πώς νιώθει;",
        options: [
          { id: "anxious", emoji: "😰", label: "Αγχωμένος" },
          { id: "happy", emoji: "😊", label: "Χαρούμενος" },
          { id: "sad", emoji: "😢", label: "Λυπημένος" },
          { id: "angry", emoji: "😠", label: "Θυμωμένος" }
        ]
      },
      {
        id: 5,
        scene: {
          emoji: "😅💬",
          description: "Έκανε κατά λάθος πλάκα που πλήγωσε τα συναισθήματα κάποιου.",
          character: "👧"
        },
        correctAnswer: "guilty",
        question: "Πώς νιώθει;",
        options: [
          { id: "guilty", emoji: "😣", label: "Ένοχος" },
          { id: "happy", emoji: "😊", label: "Χαρούμενος" },
          { id: "proud", emoji: "😎", label: "Περήφανος" },
          { id: "sleepy", emoji: "😴", label: "Νυσταγμένος" }
        ]
      },
      {
        id: 6,
        scene: {
          emoji: "🏀😎",
          description: "Μπήκε στην ομάδα μπάσκετ του σχολείου.",
          character: "👦"
        },
        correctAnswer: "proud",
        question: "Πώς νιώθει;",
        options: [
          { id: "proud", emoji: "😎", label: "Περήφανος" },
          { id: "sad", emoji: "😢", label: "Λυπημένος" },
          { id: "scared", emoji: "😨", label: "Φοβισμένος" },
          { id: "bored", emoji: "😒", label: "Βαρεμένος" }
        ]
      },
      {
        id: 7,
        scene: {
          emoji: "👀😞",
          description: "Είδε συμμαθητή να παρενοχλείται αλλά δεν παρενέβη.",
          character: "👧"
        },
        correctAnswer: "ashamed",
        question: "Πώς νιώθει;",
        options: [
          { id: "ashamed", emoji: "😞", label: "Ντροπιασμένος" },
          { id: "happy", emoji: "😊", label: "Χαρούμενος" },
          { id: "excited", emoji: "🤩", label: "Ενθουσιασμένος" },
          { id: "sleepy", emoji: "😴", label: "Νυσταγμένος" }
        ]
      },
      {
        id: 8,
        scene: {
          emoji: "📦🏠",
          description: "Οι γονείς του του είπαν ότι μετακομίζουν σε νέα πόλη.",
          character: "👦"
        },
        correctAnswer: "overwhelmed",
        question: "Πώς νιώθει;",
        options: [
          { id: "overwhelmed", emoji: "😵", label: "Συγκλονισμένος" },
          { id: "happy", emoji: "😊", label: "Χαρούμενος" },
          { id: "proud", emoji: "😎", label: "Περήφανος" },
          { id: "angry", emoji: "😠", label: "Θυμωμένος" }
        ]
      },
      {
        id: 9,
        scene: {
          emoji: "🏥😟",
          description: "Ένας στενός συγγενής είναι στο νοσοκομείο.",
          character: "👧"
        },
        correctAnswer: "worried",
        question: "Πώς νιώθει;",
        options: [
          { id: "worried", emoji: "😟", label: "Ανήσυχος" },
          { id: "excited", emoji: "🤩", label: "Ενθουσιασμένος" },
          { id: "angry", emoji: "😠", label: "Θυμωμένος" },
          { id: "sleepy", emoji: "😴", label: "Νυσταγμένος" }
        ]
      },
      {
        id: 10,
        scene: {
          emoji: "🔬🥳",
          description: "Κέρδισε διαγωνισμό επιστημών του σχολείου.",
          character: "👦"
        },
        correctAnswer: "elated",
        question: "Πώς νιώθει;",
        options: [
          { id: "elated", emoji: "🥳", label: "Ενθουσιασμένος" },
          { id: "sad", emoji: "😢", label: "Λυπημένος" },
          { id: "scared", emoji: "😨", label: "Φοβισμένος" },
          { id: "bored", emoji: "😒", label: "Βαρεμένος" }
        ]
      },
      {
        id: 11,
        scene: {
          emoji: "📋😬",
          description: "Συνειδητοποιεί ότι αντέγραψε εργασία και μπορεί να πιαστεί.",
          character: "👧"
        },
        correctAnswer: "nervous",
        question: "Πώς νιώθει;",
        options: [
          { id: "nervous", emoji: "😬", label: "Νευρικός" },
          { id: "happy", emoji: "😊", label: "Χαρούμενος" },
          { id: "proud", emoji: "😎", label: "Περήφανος" },
          { id: "sleepy", emoji: "😴", label: "Νυσταγμένος" }
        ]
      },
      {
        id: 12,
        scene: {
          emoji: "👩‍🏫🥹",
          description: "Βλέπει την παλιά δασκάλα του νηπιαγωγείου και θυμάται την παιδική ηλικία.",
          character: "👦"
        },
        correctAnswer: "nostalgic",
        question: "Πώς νιώθει;",
        options: [
          { id: "nostalgic", emoji: "🥹", label: "Νοσταλγικός" },
          { id: "angry", emoji: "😠", label: "Θυμωμένος" },
          { id: "scared", emoji: "😨", label: "Φοβισμένος" },
          { id: "bored", emoji: "😒", label: "Βαρεμένος" }
        ]
      }
    ],
    en: [
      {
        id: 1,
        scene: {
          emoji: "📝😤",
          description: "A student gets a low grade on a test they studied hard for.",
          character: "👧"
        },
        correctAnswer: "frustrated",
        question: "How does it feel?",
        options: [
          { id: "frustrated", emoji: "😤", label: "Frustrated" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "tired", emoji: "😴", label: "Tired" },
          { id: "angry", emoji: "😠", label: "Angry" }
        ]
      },
      {
        id: 2,
        scene: {
          emoji: "💬😔",
          description: "Someone spreads a rumor about them at school.",
          character: "👦"
        },
        correctAnswer: "betrayed",
        question: "How does it feel?",
        options: [
          { id: "betrayed", emoji: "😔", label: "Betrayed" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "sleepy", emoji: "😴", label: "Sleepy" },
          { id: "excited", emoji: "🤩", label: "Excited" }
        ]
      },
      {
        id: 3,
        scene: {
          emoji: "👫😒",
          description: "Their best friend starts hanging out with someone else.",
          character: "👧"
        },
        correctAnswer: "jealous",
        question: "How does it feel?",
        options: [
          { id: "jealous", emoji: "😒", label: "Jealous" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "scared", emoji: "😨", label: "Scared" },
          { id: "angry", emoji: "😠", label: "Angry" }
        ]
      },
      {
        id: 4,
        scene: {
          emoji: "🎤😰",
          description: "They have to present a project in front of the whole class.",
          character: "👦"
        },
        correctAnswer: "anxious",
        question: "How does it feel?",
        options: [
          { id: "anxious", emoji: "😰", label: "Anxious" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "sad", emoji: "😢", label: "Sad" },
          { id: "angry", emoji: "😠", label: "Angry" }
        ]
      },
      {
        id: 5,
        scene: {
          emoji: "😅💬",
          description: "They accidentally hurt someone's feelings with a joke.",
          character: "👧"
        },
        correctAnswer: "guilty",
        question: "How does it feel?",
        options: [
          { id: "guilty", emoji: "😣", label: "Guilty" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "proud", emoji: "😎", label: "Proud" },
          { id: "sleepy", emoji: "😴", label: "Sleepy" }
        ]
      },
      {
        id: 6,
        scene: {
          emoji: "🏀😎",
          description: "They made the school basketball team.",
          character: "👦"
        },
        correctAnswer: "proud",
        question: "How does it feel?",
        options: [
          { id: "proud", emoji: "😎", label: "Proud" },
          { id: "sad", emoji: "😢", label: "Sad" },
          { id: "scared", emoji: "😨", label: "Scared" },
          { id: "bored", emoji: "😒", label: "Bored" }
        ]
      },
      {
        id: 7,
        scene: {
          emoji: "👀😞",
          description: "They see a classmate being bullied but don't intervene.",
          character: "👧"
        },
        correctAnswer: "ashamed",
        question: "How does it feel?",
        options: [
          { id: "ashamed", emoji: "😞", label: "Ashamed" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "excited", emoji: "🤩", label: "Excited" },
          { id: "sleepy", emoji: "😴", label: "Sleepy" }
        ]
      },
      {
        id: 8,
        scene: {
          emoji: "📦🏠",
          description: "Their parents tell them they're moving to a new city.",
          character: "👦"
        },
        correctAnswer: "overwhelmed",
        question: "How does it feel?",
        options: [
          { id: "overwhelmed", emoji: "😵", label: "Overwhelmed" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "proud", emoji: "😎", label: "Proud" },
          { id: "angry", emoji: "😠", label: "Angry" }
        ]
      },
      {
        id: 9,
        scene: {
          emoji: "🏥😟",
          description: "A close relative is in the hospital.",
          character: "👧"
        },
        correctAnswer: "worried",
        question: "How does it feel?",
        options: [
          { id: "worried", emoji: "😟", label: "Worried" },
          { id: "excited", emoji: "🤩", label: "Excited" },
          { id: "angry", emoji: "😠", label: "Angry" },
          { id: "sleepy", emoji: "😴", label: "Sleepy" }
        ]
      },
      {
        id: 10,
        scene: {
          emoji: "🔬🥳",
          description: "They win a school science competition.",
          character: "👦"
        },
        correctAnswer: "elated",
        question: "How does it feel?",
        options: [
          { id: "elated", emoji: "🥳", label: "Elated" },
          { id: "sad", emoji: "😢", label: "Sad" },
          { id: "scared", emoji: "😨", label: "Scared" },
          { id: "bored", emoji: "😒", label: "Bored" }
        ]
      },
      {
        id: 11,
        scene: {
          emoji: "📋😬",
          description: "They realize they copied homework and might get caught.",
          character: "👧"
        },
        correctAnswer: "nervous",
        question: "How does it feel?",
        options: [
          { id: "nervous", emoji: "😬", label: "Nervous" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "proud", emoji: "😎", label: "Proud" },
          { id: "sleepy", emoji: "😴", label: "Sleepy" }
        ]
      },
      {
        id: 12,
        scene: {
          emoji: "👩‍🏫🥹",
          description: "They see their old kindergarten teacher and remember childhood.",
          character: "👦"
        },
        correctAnswer: "nostalgic",
        question: "How does it feel?",
        options: [
          { id: "nostalgic", emoji: "🥹", label: "Nostalgic" },
          { id: "angry", emoji: "😠", label: "Angry" },
          { id: "scared", emoji: "😨", label: "Scared" },
          { id: "bored", emoji: "😒", label: "Bored" }
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
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "❤️"][Math.floor(Math.random() * 6)],
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
        title: "How Does It Feel Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "How Does It Feel Game",
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

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);
  const correctOption = round.options.find(opt => opt.id === round.correctAnswer);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-red-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Πώς Νιώθει;" : "How Does It Feel?"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-pink-600">
            ❤️ {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-red-500 transition-all duration-500 ease-out"
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
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-pink-400">
          <div className="text-7xl mb-3">❤️</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">
            {round.question}
          </h2>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-pink-400">
          {/* Scene Display */}
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-10 border-4 border-purple-400 mb-8 shadow-lg">
            <div className="flex flex-col items-center justify-center gap-6">
              {/* Character */}
              <div className="text-9xl animate-bounce">
                {round.scene.character}
              </div>

              {/* Scene Icons */}
              <div className="text-8xl">
                {round.scene.emoji}
              </div>

              {/* Description */}
              <div className="bg-white/90 rounded-2xl p-6 border-4 border-purple-300 max-w-2xl">
                <p className="text-2xl font-bold text-center text-slate-800">
                  {round.scene.description}
                </p>
              </div>
            </div>
          </div>

          {/* Answer Options */}
          {!showAnswer && (
            <>
              <p className="text-2xl font-bold text-center text-slate-700 mb-6">
                {round.question}
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                {round.options.map((option) => {
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswerSelect(option.id)}
                      className="p-6 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 hover:from-pink-200 hover:to-rose-200 border-4 border-pink-300 hover:border-pink-500 transition-all duration-200 transform hover:scale-105 shadow-lg flex flex-col items-center justify-center cursor-pointer"
                    >
                      <div className="text-8xl mb-3">{option.emoji}</div>
                      <p className="text-xl font-bold text-slate-700">{option.label}</p>
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
                  <div className="text-8xl">{round.scene.character}</div>
                  <div className="text-8xl">{correctOption.emoji}</div>
                </div>
                <p className="text-3xl font-bold text-green-700">
                  {lang === "el"
                    ? `🎉 Σωστά! Νιώθει ${correctOption.label}!`
                    : `🎉 Correct! They feel ${correctOption.label}!`}
                </p>
              </div>
            </div>
          )}

          {showAnswer && selectedAnswer !== round.correctAnswer && (
            <div className="text-center animate-fadeIn">
              <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
                <p className="text-3xl font-bold text-red-700">
                  {lang === "el"
                    ? `Προσπάθησε ξανά!`
                    : `Try again!`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-pink-300/80 to-red-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">❤️🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Καταλαβαίνεις τα συναισθήματα!" : "Perfect! You understand emotions!"}
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
