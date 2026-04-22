// src/components/games/exercises_7_8_1/HowDoesItFeelGame.jsx
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

  const TARGET_ROUNDS = 15;

  const roundsData = {
    el: [
      {
        id: 1,
        scene: {
          emoji: "📊📉",
          description: "Πήρε χαμηλότερο βαθμό από ό,τι περίμενε σε ένα τεστ.",
          character: "👦"
        },
        correctAnswer: "disappointed",
        question: "Πώς νιώθει;",
        options: [
          { id: "disappointed", emoji: "😞", label: "Απογοητευμένο" },
          { id: "happy", emoji: "😊", label: "Χαρούμενο" },
          { id: "sleepy", emoji: "😴", label: "Νυσταγμένο" },
          { id: "angry", emoji: "😠", label: "Θυμωμένο" }
        ]
      },
      {
        id: 2,
        scene: {
          emoji: "🏅⚽",
          description: "Η ομάδα τους κέρδισε το σχολικό τουρνουά.",
          character: "👧"
        },
        correctAnswer: "proud",
        question: "Πώς νιώθει;",
        options: [
          { id: "proud", emoji: "😎", label: "Περήφανο" },
          { id: "sad", emoji: "😢", label: "Λυπημένο" },
          { id: "scared", emoji: "😨", label: "Φοβισμένο" },
          { id: "bored", emoji: "😑", label: "Βαρεμένο" }
        ]
      },
      {
        id: 3,
        scene: {
          emoji: "👫💔",
          description: "Ο καλύτερος φίλος του παίζει με κάποιον άλλον.",
          character: "👦"
        },
        correctAnswer: "jealous",
        question: "Πώς νιώθει;",
        options: [
          { id: "jealous", emoji: "😒", label: "Ζηλιάρικο" },
          { id: "happy", emoji: "😊", label: "Χαρούμενο" },
          { id: "sleepy", emoji: "😴", label: "Νυσταγμένο" },
          { id: "excited", emoji: "🤩", label: "Ενθουσιασμένο" }
        ]
      },
      {
        id: 4,
        scene: {
          emoji: "📝🎭",
          description: "Η δασκάλα τον διάλεξε να διαβάσει την έκθεσή του δυνατά.",
          character: "👧"
        },
        correctAnswer: "nervous",
        question: "Πώς νιώθει;",
        options: [
          { id: "nervous", emoji: "😰", label: "Αγχωμένο" },
          { id: "happy", emoji: "😊", label: "Χαρούμενο" },
          { id: "angry", emoji: "😠", label: "Θυμωμένο" },
          { id: "sleepy", emoji: "😴", label: "Νυσταγμένο" }
        ]
      },
      {
        id: 5,
        scene: {
          emoji: "🎨🏆",
          description: "Η ζωγραφιά του κέρδισε την πρώτη θέση σε διαγωνισμό τέχνης.",
          character: "👦"
        },
        correctAnswer: "thrilled",
        question: "Πώς νιώθει;",
        options: [
          { id: "thrilled", emoji: "🤩", label: "Ενθουσιασμένο" },
          { id: "sad", emoji: "😢", label: "Λυπημένο" },
          { id: "scared", emoji: "😨", label: "Φοβισμένο" },
          { id: "bored", emoji: "😑", label: "Βαρεμένο" }
        ]
      },
      {
        id: 6,
        scene: {
          emoji: "😔🚫",
          description: "Δεν τον κάλεσαν στο πάρτι ενός συμμαθητή.",
          character: "👧"
        },
        correctAnswer: "hurt",
        question: "Πώς νιώθει;",
        options: [
          { id: "hurt", emoji: "😣", label: "Πληγωμένο" },
          { id: "happy", emoji: "😊", label: "Χαρούμενο" },
          { id: "excited", emoji: "🤩", label: "Ενθουσιασμένο" },
          { id: "proud", emoji: "😎", label: "Περήφανο" }
        ]
      },
      {
        id: 7,
        scene: {
          emoji: "🔬🧪",
          description: "Ανακάλυψε κάτι ωραίο σε ένα επιστημονικό πείραμα.",
          character: "👦"
        },
        correctAnswer: "curious",
        question: "Πώς νιώθει;",
        options: [
          { id: "curious", emoji: "🤔", label: "Περίεργο" },
          { id: "sad", emoji: "😢", label: "Λυπημένο" },
          { id: "angry", emoji: "😠", label: "Θυμωμένο" },
          { id: "sleepy", emoji: "😴", label: "Νυσταγμένο" }
        ]
      },
      {
        id: 8,
        scene: {
          emoji: "📖❌",
          description: "Δεν καταλαβαίνει ένα δύσκολο κεφάλαιο στο βιβλίο.",
          character: "👧"
        },
        correctAnswer: "frustrated",
        question: "Πώς νιώθει;",
        options: [
          { id: "frustrated", emoji: "😤", label: "Απογοητευμένο" },
          { id: "happy", emoji: "😊", label: "Χαρούμενο" },
          { id: "excited", emoji: "🤩", label: "Ενθουσιασμένο" },
          { id: "calm", emoji: "😌", label: "Ήρεμο" }
        ]
      },
      {
        id: 9,
        scene: {
          emoji: "🎤👀",
          description: "Πρέπει να μιλήσει μπροστά σε όλο το σχολείο.",
          character: "👦"
        },
        correctAnswer: "terrified",
        question: "Πώς νιώθει;",
        options: [
          { id: "terrified", emoji: "😱", label: "Τρομαγμένο" },
          { id: "happy", emoji: "😊", label: "Χαρούμενο" },
          { id: "proud", emoji: "😎", label: "Περήφανο" },
          { id: "bored", emoji: "😑", label: "Βαρεμένο" }
        ]
      },
      {
        id: 10,
        scene: {
          emoji: "🏊🎖️",
          description: "Έμαθε να κολυμπάει μόνος του.",
          character: "👧"
        },
        correctAnswer: "accomplished",
        question: "Πώς νιώθει;",
        options: [
          { id: "accomplished", emoji: "😎", label: "Περήφανο" },
          { id: "sad", emoji: "😢", label: "Λυπημένο" },
          { id: "scared", emoji: "😨", label: "Φοβισμένο" },
          { id: "angry", emoji: "😠", label: "Θυμωμένο" }
        ]
      },
      {
        id: 11,
        scene: {
          emoji: "🧪💥",
          description: "Έσπασε κατά λάθος σχολικό υλικό.",
          character: "👦"
        },
        correctAnswer: "guilty",
        question: "Πώς νιώθει;",
        options: [
          { id: "guilty", emoji: "😣", label: "Ένοχο" },
          { id: "happy", emoji: "😊", label: "Χαρούμενο" },
          { id: "excited", emoji: "🤩", label: "Ενθουσιασμένο" },
          { id: "sleepy", emoji: "😴", label: "Νυσταγμένο" }
        ]
      },
      {
        id: 12,
        scene: {
          emoji: "📚✅",
          description: "Τέλειωσε ένα δύσκολο έργο.",
          character: "👧"
        },
        correctAnswer: "relieved",
        question: "Πώς νιώθει;",
        options: [
          { id: "relieved", emoji: "😮‍💨", label: "Ανακουφισμένο" },
          { id: "angry", emoji: "😠", label: "Θυμωμένο" },
          { id: "scared", emoji: "😨", label: "Φοβισμένο" },
          { id: "bored", emoji: "😑", label: "Βαρεμένο" }
        ]
      },
      {
        id: 13,
        scene: {
          emoji: "🌧️⛺",
          description: "Η σχολική εκδρομή ακυρώθηκε λόγω βροχής.",
          character: "👦"
        },
        correctAnswer: "disappointed",
        question: "Πώς νιώθει;",
        options: [
          { id: "disappointed", emoji: "😞", label: "Απογοητευμένο" },
          { id: "happy", emoji: "😊", label: "Χαρούμενο" },
          { id: "proud", emoji: "😎", label: "Περήφανο" },
          { id: "excited", emoji: "🤩", label: "Ενθουσιασμένο" }
        ]
      },
      {
        id: 14,
        scene: {
          emoji: "👫🤝",
          description: "Ένας νέος μαθητής ήρθε και θέλει να γίνει φίλος.",
          character: "👧"
        },
        correctAnswer: "welcoming",
        question: "Πώς νιώθει;",
        options: [
          { id: "welcoming", emoji: "😊", label: "Χαρούμενο" },
          { id: "angry", emoji: "😠", label: "Θυμωμένο" },
          { id: "scared", emoji: "😨", label: "Φοβισμένο" },
          { id: "sleepy", emoji: "😴", label: "Νυσταγμένο" }
        ]
      },
      {
        id: 15,
        scene: {
          emoji: "🎵🏫",
          description: "Θα τραγουδήσει στο σχολικό εορτασμό.",
          character: "👦"
        },
        correctAnswer: "excited",
        question: "Πώς νιώθει;",
        options: [
          { id: "excited", emoji: "🤩", label: "Ενθουσιασμένο" },
          { id: "sad", emoji: "😢", label: "Λυπημένο" },
          { id: "angry", emoji: "😠", label: "Θυμωμένο" },
          { id: "bored", emoji: "😑", label: "Βαρεμένο" }
        ]
      }
    ],
    en: [
      {
        id: 1,
        scene: {
          emoji: "📊📉",
          description: "Got a lower grade than expected on a test.",
          character: "👦"
        },
        correctAnswer: "disappointed",
        question: "How does it feel?",
        options: [
          { id: "disappointed", emoji: "😞", label: "Disappointed" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "sleepy", emoji: "😴", label: "Sleepy" },
          { id: "angry", emoji: "😠", label: "Angry" }
        ]
      },
      {
        id: 2,
        scene: {
          emoji: "🏅⚽",
          description: "Their team won the school tournament.",
          character: "👧"
        },
        correctAnswer: "proud",
        question: "How does it feel?",
        options: [
          { id: "proud", emoji: "😎", label: "Proud" },
          { id: "sad", emoji: "😢", label: "Sad" },
          { id: "scared", emoji: "😨", label: "Scared" },
          { id: "bored", emoji: "😑", label: "Bored" }
        ]
      },
      {
        id: 3,
        scene: {
          emoji: "👫💔",
          description: "Their best friend is playing with someone else.",
          character: "👦"
        },
        correctAnswer: "jealous",
        question: "How does it feel?",
        options: [
          { id: "jealous", emoji: "😒", label: "Jealous" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "sleepy", emoji: "😴", label: "Sleepy" },
          { id: "excited", emoji: "🤩", label: "Excited" }
        ]
      },
      {
        id: 4,
        scene: {
          emoji: "📝🎭",
          description: "Teacher chose them to read their essay out loud.",
          character: "👧"
        },
        correctAnswer: "nervous",
        question: "How does it feel?",
        options: [
          { id: "nervous", emoji: "😰", label: "Nervous" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "angry", emoji: "😠", label: "Angry" },
          { id: "sleepy", emoji: "😴", label: "Sleepy" }
        ]
      },
      {
        id: 5,
        scene: {
          emoji: "🎨🏆",
          description: "Their painting won first place in the art contest.",
          character: "👦"
        },
        correctAnswer: "thrilled",
        question: "How does it feel?",
        options: [
          { id: "thrilled", emoji: "🤩", label: "Thrilled" },
          { id: "sad", emoji: "😢", label: "Sad" },
          { id: "scared", emoji: "😨", label: "Scared" },
          { id: "bored", emoji: "😑", label: "Bored" }
        ]
      },
      {
        id: 6,
        scene: {
          emoji: "😔🚫",
          description: "They weren't invited to a classmate's party.",
          character: "👧"
        },
        correctAnswer: "hurt",
        question: "How does it feel?",
        options: [
          { id: "hurt", emoji: "😣", label: "Hurt" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "excited", emoji: "🤩", label: "Excited" },
          { id: "proud", emoji: "😎", label: "Proud" }
        ]
      },
      {
        id: 7,
        scene: {
          emoji: "🔬🧪",
          description: "They discovered something cool in a science experiment.",
          character: "👦"
        },
        correctAnswer: "curious",
        question: "How does it feel?",
        options: [
          { id: "curious", emoji: "🤔", label: "Curious" },
          { id: "sad", emoji: "😢", label: "Sad" },
          { id: "angry", emoji: "😠", label: "Angry" },
          { id: "sleepy", emoji: "😴", label: "Sleepy" }
        ]
      },
      {
        id: 8,
        scene: {
          emoji: "📖❌",
          description: "They can't understand a hard chapter in a book.",
          character: "👧"
        },
        correctAnswer: "frustrated",
        question: "How does it feel?",
        options: [
          { id: "frustrated", emoji: "😤", label: "Frustrated" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "excited", emoji: "🤩", label: "Excited" },
          { id: "calm", emoji: "😌", label: "Calm" }
        ]
      },
      {
        id: 9,
        scene: {
          emoji: "🎤👀",
          description: "They have to speak in front of the whole school.",
          character: "👦"
        },
        correctAnswer: "terrified",
        question: "How does it feel?",
        options: [
          { id: "terrified", emoji: "😱", label: "Terrified" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "proud", emoji: "😎", label: "Proud" },
          { id: "bored", emoji: "😑", label: "Bored" }
        ]
      },
      {
        id: 10,
        scene: {
          emoji: "🏊🎖️",
          description: "They learned to swim by themselves.",
          character: "👧"
        },
        correctAnswer: "accomplished",
        question: "How does it feel?",
        options: [
          { id: "accomplished", emoji: "😎", label: "Accomplished" },
          { id: "sad", emoji: "😢", label: "Sad" },
          { id: "scared", emoji: "😨", label: "Scared" },
          { id: "angry", emoji: "😠", label: "Angry" }
        ]
      },
      {
        id: 11,
        scene: {
          emoji: "🧪💥",
          description: "They accidentally broke a school supply.",
          character: "👦"
        },
        correctAnswer: "guilty",
        question: "How does it feel?",
        options: [
          { id: "guilty", emoji: "😣", label: "Guilty" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "excited", emoji: "🤩", label: "Excited" },
          { id: "sleepy", emoji: "😴", label: "Sleepy" }
        ]
      },
      {
        id: 12,
        scene: {
          emoji: "📚✅",
          description: "They finished a difficult project.",
          character: "👧"
        },
        correctAnswer: "relieved",
        question: "How does it feel?",
        options: [
          { id: "relieved", emoji: "😮‍💨", label: "Relieved" },
          { id: "angry", emoji: "😠", label: "Angry" },
          { id: "scared", emoji: "😨", label: "Scared" },
          { id: "bored", emoji: "😑", label: "Bored" }
        ]
      },
      {
        id: 13,
        scene: {
          emoji: "🌧️⛺",
          description: "School trip got canceled due to rain.",
          character: "👦"
        },
        correctAnswer: "disappointed",
        question: "How does it feel?",
        options: [
          { id: "disappointed", emoji: "😞", label: "Disappointed" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "proud", emoji: "😎", label: "Proud" },
          { id: "excited", emoji: "🤩", label: "Excited" }
        ]
      },
      {
        id: 14,
        scene: {
          emoji: "👫🤝",
          description: "A new student joined and wants to be friends.",
          character: "👧"
        },
        correctAnswer: "welcoming",
        question: "How does it feel?",
        options: [
          { id: "welcoming", emoji: "😊", label: "Happy" },
          { id: "angry", emoji: "😠", label: "Angry" },
          { id: "scared", emoji: "😨", label: "Scared" },
          { id: "sleepy", emoji: "😴", label: "Sleepy" }
        ]
      },
      {
        id: 15,
        scene: {
          emoji: "🎵🏫",
          description: "Performing a song at the school celebration.",
          character: "👦"
        },
        correctAnswer: "excited",
        question: "How does it feel?",
        options: [
          { id: "excited", emoji: "🤩", label: "Excited" },
          { id: "sad", emoji: "😢", label: "Sad" },
          { id: "angry", emoji: "😠", label: "Angry" },
          { id: "bored", emoji: "😑", label: "Bored" }
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
