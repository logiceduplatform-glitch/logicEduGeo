// src/components/games/exercises_4_5_1/HowDoesItFeelGame.jsx (age 4-5)
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
          emoji: "🎂🎈",
          description: "Το παιδί έχει γενέθλια με φίλους!",
          character: "👦"
        },
        correctAnswer: "happy",
        question: "Πώς νιώθει;",
        options: [
          { id: "happy", emoji: "😊", label: "Χαρούμενο" },
          { id: "sad", emoji: "😢", label: "Λυπημένο" },
          { id: "angry", emoji: "😠", label: "Θυμωμένο" },
          { id: "scared", emoji: "😨", label: "Φοβισμένο" }
        ]
      },
      {
        id: 2,
        scene: {
          emoji: "🧸💔",
          description: "Το αγαπημένο του αρκουδάκι ξεφτιλίστηκε.",
          character: "👧"
        },
        correctAnswer: "sad",
        question: "Πώς νιώθει;",
        options: [
          { id: "sad", emoji: "😢", label: "Λυπημένο" },
          { id: "happy", emoji: "😊", label: "Χαρούμενο" },
          { id: "excited", emoji: "🤩", label: "Ενθουσιασμένο" },
          { id: "calm", emoji: "😌", label: "Ήρεμο" }
        ]
      },
      {
        id: 3,
        scene: {
          emoji: "👻🌙",
          description: "Ακούει δυνατό κεραυνό τη νύχτα.",
          character: "👦"
        },
        correctAnswer: "scared",
        question: "Πώς νιώθει;",
        options: [
          { id: "scared", emoji: "😨", label: "Φοβισμένο" },
          { id: "happy", emoji: "😊", label: "Χαρούμενο" },
          { id: "angry", emoji: "😠", label: "Θυμωμένο" },
          { id: "proud", emoji: "😎", label: "Περήφανο" }
        ]
      },
      {
        id: 4,
        scene: {
          emoji: "❌🎮",
          description: "Κάποιος πήρε το παιχνίδι του χωρίς να ρωτήσει.",
          character: "👧"
        },
        correctAnswer: "angry",
        question: "Πώς νιώθει;",
        options: [
          { id: "angry", emoji: "😠", label: "Θυμωμένο" },
          { id: "happy", emoji: "😊", label: "Χαρούμενο" },
          { id: "sleepy", emoji: "😴", label: "Νυσταγμένο" },
          { id: "surprised", emoji: "😲", label: "Έκπληκτο" }
        ]
      },
      {
        id: 5,
        scene: {
          emoji: "🎁✨",
          description: "Πήρε νέο ποδήλατο σαν δώρο!",
          character: "👦"
        },
        correctAnswer: "excited",
        question: "Πώς νιώθει;",
        options: [
          { id: "excited", emoji: "🤩", label: "Ενθουσιασμένο" },
          { id: "sad", emoji: "😢", label: "Λυπημένο" },
          { id: "angry", emoji: "😠", label: "Θυμωμένο" },
          { id: "tired", emoji: "😫", label: "Κουρασμένο" }
        ]
      },
      {
        id: 6,
        scene: {
          emoji: "🤕💊",
          description: "Χτύπησε το κεφάλι του και πονάει.",
          character: "👧"
        },
        correctAnswer: "hurt",
        question: "Πώς νιώθει;",
        options: [
          { id: "hurt", emoji: "😣", label: "Πονεμένο" },
          { id: "happy", emoji: "😊", label: "Χαρούμενο" },
          { id: "excited", emoji: "🤩", label: "Ενθουσιασμένο" },
          { id: "calm", emoji: "😌", label: "Ήρεμο" }
        ]
      },
      {
        id: 7,
        scene: {
          emoji: "🏆⭐",
          description: "Ζωγράφισε την πιο ωραία εικόνα στην τάξη!",
          character: "👦"
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
        id: 8,
        scene: {
          emoji: "😴🛏️",
          description: "Έπαιξε όλη μέρα και τώρα αισθάνεται πολύ κουρασμένο.",
          character: "👧"
        },
        correctAnswer: "sleepy",
        question: "Πώς νιώθει;",
        options: [
          { id: "sleepy", emoji: "😴", label: "Νυσταγμένο" },
          { id: "excited", emoji: "🤩", label: "Ενθουσιασμένο" },
          { id: "angry", emoji: "😠", label: "Θυμωμένο" },
          { id: "surprised", emoji: "😲", label: "Έκπληκτο" }
        ]
      },
      {
        id: 9,
        scene: {
          emoji: "🎪🎉",
          description: "Ο μπαμπάς ήρθε σπίτι με έκπληξη!",
          character: "👦"
        },
        correctAnswer: "surprised",
        question: "Πώς νιώθει;",
        options: [
          { id: "surprised", emoji: "😲", label: "Έκπληκτο" },
          { id: "sad", emoji: "😢", label: "Λυπημένο" },
          { id: "sleepy", emoji: "😴", label: "Νυσταγμένο" },
          { id: "bored", emoji: "😑", label: "Βαρεμένο" }
        ]
      },
      {
        id: 10,
        scene: {
          emoji: "❤️🤗",
          description: "Η μαμά του έδωσε ένα μεγάλο ζεστό αγκάλιασμα!",
          character: "👧"
        },
        correctAnswer: "loved",
        question: "Πώς νιώθει;",
        options: [
          { id: "loved", emoji: "🥰", label: "Αγαπημένο" },
          { id: "angry", emoji: "😠", label: "Θυμωμένο" },
          { id: "scared", emoji: "😨", label: "Φοβισμένο" },
          { id: "bored", emoji: "😑", label: "Βαρεμένο" }
        ]
      },
      {
        id: 11,
        scene: {
          emoji: "🐕🌳",
          description: "Πάει στο πάρκο με το κουτάβι του!",
          character: "👦"
        },
        correctAnswer: "happy",
        question: "Πώς νιώθει;",
        options: [
          { id: "happy", emoji: "😊", label: "Χαρούμενο" },
          { id: "sad", emoji: "😢", label: "Λυπημένο" },
          { id: "angry", emoji: "😠", label: "Θυμωμένο" },
          { id: "scared", emoji: "😨", label: "Φοβισμένο" }
        ]
      },
      {
        id: 12,
        scene: {
          emoji: "🍬❌",
          description: "Η μαμά είπε όχι σε περισσότερα γλυκά.",
          character: "👧"
        },
        correctAnswer: "sad",
        question: "Πώς νιώθει;",
        options: [
          { id: "sad", emoji: "😢", label: "Λυπημένο" },
          { id: "happy", emoji: "😊", label: "Χαρούμενο" },
          { id: "excited", emoji: "🤩", label: "Ενθουσιασμένο" },
          { id: "proud", emoji: "😎", label: "Περήφανο" }
        ]
      },
      {
        id: 13,
        scene: {
          emoji: "🎨🖌️",
          description: "Ζωγράφισε ένα όμορφο λουλούδι!",
          character: "👦"
        },
        correctAnswer: "proud",
        question: "Πώς νιώθει;",
        options: [
          { id: "proud", emoji: "😎", label: "Περήφανο" },
          { id: "sad", emoji: "😢", label: "Λυπημένο" },
          { id: "scared", emoji: "😨", label: "Φοβισμένο" },
          { id: "angry", emoji: "😠", label: "Θυμωμένο" }
        ]
      },
      {
        id: 14,
        scene: {
          emoji: "👫🤝",
          description: "Ένα νέο παιδί θέλει να παίξει μαζί του!",
          character: "👧"
        },
        correctAnswer: "happy",
        question: "Πώς νιώθει;",
        options: [
          { id: "happy", emoji: "😊", label: "Χαρούμενο" },
          { id: "angry", emoji: "😠", label: "Θυμωμένο" },
          { id: "scared", emoji: "😨", label: "Φοβισμένο" },
          { id: "sleepy", emoji: "😴", label: "Νυσταγμένο" }
        ]
      },
      {
        id: 15,
        scene: {
          emoji: "🌧️🏠",
          description: "Βρέχει και δεν μπορεί να πάει έξω.",
          character: "👦"
        },
        correctAnswer: "sad",
        question: "Πώς νιώθει;",
        options: [
          { id: "sad", emoji: "😢", label: "Λυπημένο" },
          { id: "excited", emoji: "🤩", label: "Ενθουσιασμένο" },
          { id: "proud", emoji: "😎", label: "Περήφανο" },
          { id: "surprised", emoji: "😲", label: "Έκπληκτο" }
        ]
      }
    ],
    en: [
      {
        id: 1,
        scene: {
          emoji: "🎂🎈",
          description: "The child has a birthday party with friends!",
          character: "👦"
        },
        correctAnswer: "happy",
        question: "How does it feel?",
        options: [
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "sad", emoji: "😢", label: "Sad" },
          { id: "angry", emoji: "😠", label: "Angry" },
          { id: "scared", emoji: "😨", label: "Scared" }
        ]
      },
      {
        id: 2,
        scene: {
          emoji: "🧸💔",
          description: "Their favorite teddy bear got torn.",
          character: "👧"
        },
        correctAnswer: "sad",
        question: "How does it feel?",
        options: [
          { id: "sad", emoji: "😢", label: "Sad" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "excited", emoji: "🤩", label: "Excited" },
          { id: "calm", emoji: "😌", label: "Calm" }
        ]
      },
      {
        id: 3,
        scene: {
          emoji: "👻🌙",
          description: "They hear a loud thunder at night.",
          character: "👦"
        },
        correctAnswer: "scared",
        question: "How does it feel?",
        options: [
          { id: "scared", emoji: "😨", label: "Scared" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "angry", emoji: "😠", label: "Angry" },
          { id: "proud", emoji: "😎", label: "Proud" }
        ]
      },
      {
        id: 4,
        scene: {
          emoji: "❌🎮",
          description: "Someone took their toy without asking.",
          character: "👧"
        },
        correctAnswer: "angry",
        question: "How does it feel?",
        options: [
          { id: "angry", emoji: "😠", label: "Angry" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "sleepy", emoji: "😴", label: "Sleepy" },
          { id: "surprised", emoji: "😲", label: "Surprised" }
        ]
      },
      {
        id: 5,
        scene: {
          emoji: "🎁✨",
          description: "They get a new bicycle as a gift!",
          character: "👦"
        },
        correctAnswer: "excited",
        question: "How does it feel?",
        options: [
          { id: "excited", emoji: "🤩", label: "Excited" },
          { id: "sad", emoji: "😢", label: "Sad" },
          { id: "angry", emoji: "😠", label: "Angry" },
          { id: "tired", emoji: "😫", label: "Tired" }
        ]
      },
      {
        id: 6,
        scene: {
          emoji: "🤕💊",
          description: "They bumped their head and it hurts.",
          character: "👧"
        },
        correctAnswer: "hurt",
        question: "How does it feel?",
        options: [
          { id: "hurt", emoji: "😣", label: "Hurt" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "excited", emoji: "🤩", label: "Excited" },
          { id: "calm", emoji: "😌", label: "Calm" }
        ]
      },
      {
        id: 7,
        scene: {
          emoji: "🏆⭐",
          description: "They drew the best picture in class!",
          character: "👦"
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
        id: 8,
        scene: {
          emoji: "😴🛏️",
          description: "They played all day and now feel very tired.",
          character: "👧"
        },
        correctAnswer: "sleepy",
        question: "How does it feel?",
        options: [
          { id: "sleepy", emoji: "😴", label: "Sleepy" },
          { id: "excited", emoji: "🤩", label: "Excited" },
          { id: "angry", emoji: "😠", label: "Angry" },
          { id: "surprised", emoji: "😲", label: "Surprised" }
        ]
      },
      {
        id: 9,
        scene: {
          emoji: "🎪🎉",
          description: "Daddy comes home with a surprise!",
          character: "👦"
        },
        correctAnswer: "surprised",
        question: "How does it feel?",
        options: [
          { id: "surprised", emoji: "😲", label: "Surprised" },
          { id: "sad", emoji: "😢", label: "Sad" },
          { id: "sleepy", emoji: "😴", label: "Sleepy" },
          { id: "bored", emoji: "😑", label: "Bored" }
        ]
      },
      {
        id: 10,
        scene: {
          emoji: "❤️🤗",
          description: "Mommy gives them a big warm hug!",
          character: "👧"
        },
        correctAnswer: "loved",
        question: "How does it feel?",
        options: [
          { id: "loved", emoji: "🥰", label: "Loved" },
          { id: "angry", emoji: "😠", label: "Angry" },
          { id: "scared", emoji: "😨", label: "Scared" },
          { id: "bored", emoji: "😑", label: "Bored" }
        ]
      },
      {
        id: 11,
        scene: {
          emoji: "🐕🌳",
          description: "They're going to the park with their puppy!",
          character: "👦"
        },
        correctAnswer: "happy",
        question: "How does it feel?",
        options: [
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "sad", emoji: "😢", label: "Sad" },
          { id: "angry", emoji: "😠", label: "Angry" },
          { id: "scared", emoji: "😨", label: "Scared" }
        ]
      },
      {
        id: 12,
        scene: {
          emoji: "🍬❌",
          description: "Mommy said no more candy.",
          character: "👧"
        },
        correctAnswer: "sad",
        question: "How does it feel?",
        options: [
          { id: "sad", emoji: "😢", label: "Sad" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "excited", emoji: "🤩", label: "Excited" },
          { id: "proud", emoji: "😎", label: "Proud" }
        ]
      },
      {
        id: 13,
        scene: {
          emoji: "🎨🖌️",
          description: "They painted a beautiful flower!",
          character: "👦"
        },
        correctAnswer: "proud",
        question: "How does it feel?",
        options: [
          { id: "proud", emoji: "😎", label: "Proud" },
          { id: "sad", emoji: "😢", label: "Sad" },
          { id: "scared", emoji: "😨", label: "Scared" },
          { id: "angry", emoji: "😠", label: "Angry" }
        ]
      },
      {
        id: 14,
        scene: {
          emoji: "👫🤝",
          description: "A new friend wants to play with them!",
          character: "👧"
        },
        correctAnswer: "happy",
        question: "How does it feel?",
        options: [
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "angry", emoji: "😠", label: "Angry" },
          { id: "scared", emoji: "😨", label: "Scared" },
          { id: "sleepy", emoji: "😴", label: "Sleepy" }
        ]
      },
      {
        id: 15,
        scene: {
          emoji: "🌧️🏠",
          description: "It's raining and they can't go outside.",
          character: "👦"
        },
        correctAnswer: "sad",
        question: "How does it feel?",
        options: [
          { id: "sad", emoji: "😢", label: "Sad" },
          { id: "excited", emoji: "🤩", label: "Excited" },
          { id: "proud", emoji: "😎", label: "Proud" },
          { id: "surprised", emoji: "😲", label: "Surprised" }
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
