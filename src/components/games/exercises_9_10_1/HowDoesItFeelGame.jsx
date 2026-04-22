// src/components/games/exercises_9_10_1/HowDoesItFeelGame.jsx
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
      { id: 1, scene: { emoji: "📊💯", description: "Μελέτησε πολύ και πήρε παντελή βαθμολογία.", character: "👦" }, correctAnswer: "accomplished", question: "Πώς νιώθει;", options: [{ id: "accomplished", emoji: "😎", label: "Υπερήφανο/Accomplished" }, { id: "sad", emoji: "😢", label: "Λυπημένο/Sad" }, { id: "scared", emoji: "😨", label: "Φοβισμένο/Scared" }, { id: "bored", emoji: "😑", label: "Βαρεμένο/Bored" }] },
      { id: 2, scene: { emoji: "👫🔀", description: "Ο καλύτερος φίλος μετακόμισε σε άλλη πόλη.", character: "👧" }, correctAnswer: "heartbroken", question: "Πώς νιώθει;", options: [{ id: "heartbroken", emoji: "💔", label: "Συντετριμμένο/Heartbroken" }, { id: "happy", emoji: "😊", label: "Χαρούμενο/Happy" }, { id: "excited", emoji: "🤩", label: "Ενθουσιασμένο/Excited" }, { id: "proud", emoji: "😎", label: "Περήφανο/Proud" }] },
      { id: 3, scene: { emoji: "🏅🥈", description: "Ήρθε δεύτερος στον διαγωνισμό αντί για πρώτο.", character: "👦" }, correctAnswer: "bittersweet", question: "Πώς νιώθει;", options: [{ id: "bittersweet", emoji: "😐", label: "Μεικτά Συναισθήματα/Mixed feelings" }, { id: "happy", emoji: "😊", label: "Χαρούμενο/Happy" }, { id: "angry", emoji: "😠", label: "Θυμωμένο/Angry" }, { id: "sleepy", emoji: "😴", label: "Νυσταγμένο/Sleepy" }] },
      { id: 4, scene: { emoji: "📱👫", description: "Οι φίλοι γράφουν σε ομαδικό chat χωρίς εκείνον.", character: "👧" }, correctAnswer: "excluded", question: "Πώς νιώθει;", options: [{ id: "excluded", emoji: "😔", label: "Αποκλεισμένο/Excluded" }, { id: "happy", emoji: "😊", label: "Χαρούμενο/Happy" }, { id: "proud", emoji: "😎", label: "Περήφανο/Proud" }, { id: "excited", emoji: "🤩", label: "Ενθουσιασμένο/Excited" }] },
      { id: 5, scene: { emoji: "🎭🎤", description: "Βασικός ρόλος στο σχολικό θεατρικό.", character: "👦" }, correctAnswer: "anxious-excited", question: "Πώς νιώθει;", options: [{ id: "anxious-excited", emoji: "😰", label: "Αγχωμένο-Ενθουσιασμένο/Anxious-Excited" }, { id: "sad", emoji: "😢", label: "Λυπημένο/Sad" }, { id: "angry", emoji: "😠", label: "Θυμωμένο/Angry" }, { id: "sleepy", emoji: "😴", label: "Νυσταγμένο/Sleepy" }] },
      { id: 6, scene: { emoji: "📝❌", description: "Έκανε απρόσεκτο λάθος σε εύκολη ερώτηση.", character: "👧" }, correctAnswer: "frustrated", question: "Πώς νιώθει;", options: [{ id: "frustrated", emoji: "😤", label: "Εκνευρισμένο με τον εαυτό/Frustrated" }, { id: "happy", emoji: "😊", label: "Χαρούμενο/Happy" }, { id: "scared", emoji: "😨", label: "Φοβισμένο/Scared" }, { id: "sleepy", emoji: "😴", label: "Νυσταγμένο/Sleepy" }] },
      { id: 7, scene: { emoji: "🧑‍🔬🏆", description: "Το επιστημονικό του project κέρδισε στο fair.", character: "👦" }, correctAnswer: "validated", question: "Πώς νιώθει;", options: [{ id: "validated", emoji: "🤩", label: "Δικαιωμένο/Validated" }, { id: "sad", emoji: "😢", label: "Λυπημένο/Sad" }, { id: "angry", emoji: "😠", label: "Θυμωμένο/Angry" }, { id: "bored", emoji: "😑", label: "Βαρεμένο/Bored" }] },
      { id: 8, scene: { emoji: "👫🤫", description: "Άκουσε ότι οι φίλοι μιλούσαν πίσω από την πλάτη του.", character: "👧" }, correctAnswer: "betrayed", question: "Πώς νιώθει;", options: [{ id: "betrayed", emoji: "😞", label: "Προδομένο/Betrayed" }, { id: "happy", emoji: "😊", label: "Χαρούμενο/Happy" }, { id: "excited", emoji: "🤩", label: "Ενθουσιασμένο/Excited" }, { id: "proud", emoji: "😎", label: "Περήφανο/Proud" }] },
      { id: 9, scene: { emoji: "📖🌟", description: "Διάβασε ένα βιβλίο που άλλαξε τον τρόπο που βλέπει τον κόσμο.", character: "👦" }, correctAnswer: "inspired", question: "Πώς νιώθει;", options: [{ id: "inspired", emoji: "✨", label: "Εμπνευσμένο/Inspired" }, { id: "sad", emoji: "😢", label: "Λυπημένο/Sad" }, { id: "angry", emoji: "😠", label: "Θυμωμένο/Angry" }, { id: "sleepy", emoji: "😴", label: "Νυσταγμένο/Sleepy" }] },
      { id: 10, scene: { emoji: "🏃‍♂️⏱️", description: "Έκανε νέο προσωπικό ρεκόρ στο τρέξιμο.", character: "👧" }, correctAnswer: "empowered", question: "Πώς νιώθει;", options: [{ id: "empowered", emoji: "💪", label: "Δυνατό/Empowered" }, { id: "sad", emoji: "😢", label: "Λυπημένο/Sad" }, { id: "scared", emoji: "😨", label: "Φοβισμένο/Scared" }, { id: "bored", emoji: "😑", label: "Βαρεμένο/Bored" }] },
      { id: 11, scene: { emoji: "😢🐕", description: "Το κατοικίδιό του είναι πολύ άρρωστο.", character: "👦" }, correctAnswer: "worried", question: "Πώς νιώθει;", options: [{ id: "worried", emoji: "😟", label: "Ανήσυχο/Worried" }, { id: "happy", emoji: "😊", label: "Χαρούμενο/Happy" }, { id: "proud", emoji: "😎", label: "Περήφανο/Proud" }, { id: "excited", emoji: "🤩", label: "Ενθουσιασμένο/Excited" }] },
      { id: 12, scene: { emoji: "🎨📋", description: "Η δημιουργική ιδέα του απορρίφθηκε από την ομάδα.", character: "👧" }, correctAnswer: "undervalued", question: "Πώς νιώθει;", options: [{ id: "undervalued", emoji: "😞", label: "Υποτιμημένο/Undervalued" }, { id: "happy", emoji: "😊", label: "Χαρούμενο/Happy" }, { id: "excited", emoji: "🤩", label: "Ενθουσιασμένο/Excited" }, { id: "sleepy", emoji: "😴", label: "Νυσταγμένο/Sleepy" }] },
      { id: 13, scene: { emoji: "👨‍👩‍👧", description: "Οι γονείς τσακώνονται πολύ τελευταία.", character: "👦" }, correctAnswer: "anxious", question: "Πώς νιώθει;", options: [{ id: "anxious", emoji: "😰", label: "Αγχωμένο/Anxious" }, { id: "happy", emoji: "😊", label: "Χαρούμενο/Happy" }, { id: "proud", emoji: "😎", label: "Περήφανο/Proud" }, { id: "excited", emoji: "🤩", label: "Ενθουσιασμένο/Excited" }] },
      { id: 14, scene: { emoji: "🎵🎹", description: "Κατέκτησε δύσκολο κομμάτι πιάνο μετά από εβδομάδες εξάσκησης.", character: "👧" }, correctAnswer: "satisfied", question: "Πώς νιώθει;", options: [{ id: "satisfied", emoji: "😌", label: "Ικανοποιημένο/Satisfied" }, { id: "angry", emoji: "😠", label: "Θυμωμένο/Angry" }, { id: "scared", emoji: "😨", label: "Φοβισμένο/Scared" }, { id: "bored", emoji: "😑", label: "Βαρεμένο/Bored" }] },
      { id: 15, scene: { emoji: "🌍📺", description: "Έμαθε για την κλιματική αλλαγή στο σχολείο.", character: "👦" }, correctAnswer: "concerned", question: "Πώς νιώθει;", options: [{ id: "concerned", emoji: "😟", label: "Ανησυχημένο/Concerned" }, { id: "happy", emoji: "😊", label: "Χαρούμενο/Happy" }, { id: "proud", emoji: "😎", label: "Περήφανο/Proud" }, { id: "excited", emoji: "🤩", label: "Ενθουσιασμένο/Excited" }] }
    ],
    en: [
      { id: 1, scene: { emoji: "📊💯", description: "Studied hard and got a perfect score.", character: "👦" }, correctAnswer: "accomplished", question: "How does it feel?", options: [{ id: "accomplished", emoji: "😎", label: "Accomplished" }, { id: "sad", emoji: "😢", label: "Sad" }, { id: "scared", emoji: "😨", label: "Scared" }, { id: "bored", emoji: "😑", label: "Bored" }] },
      { id: 2, scene: { emoji: "👫🔀", description: "Best friend moved to another city.", character: "👧" }, correctAnswer: "heartbroken", question: "How does it feel?", options: [{ id: "heartbroken", emoji: "💔", label: "Heartbroken" }, { id: "happy", emoji: "😊", label: "Happy" }, { id: "excited", emoji: "🤩", label: "Excited" }, { id: "proud", emoji: "😎", label: "Proud" }] },
      { id: 3, scene: { emoji: "🏅🥈", description: "Came second in the competition instead of first.", character: "👦" }, correctAnswer: "bittersweet", question: "How does it feel?", options: [{ id: "bittersweet", emoji: "😐", label: "Mixed feelings" }, { id: "happy", emoji: "😊", label: "Happy" }, { id: "angry", emoji: "😠", label: "Angry" }, { id: "sleepy", emoji: "😴", label: "Sleepy" }] },
      { id: 4, scene: { emoji: "📱👫", description: "Friends are texting in a group chat without them.", character: "👧" }, correctAnswer: "excluded", question: "How does it feel?", options: [{ id: "excluded", emoji: "😔", label: "Excluded" }, { id: "happy", emoji: "😊", label: "Happy" }, { id: "proud", emoji: "😎", label: "Proud" }, { id: "excited", emoji: "🤩", label: "Excited" }] },
      { id: 5, scene: { emoji: "🎭🎤", description: "Lead role in the school play.", character: "👦" }, correctAnswer: "anxious-excited", question: "How does it feel?", options: [{ id: "anxious-excited", emoji: "😰", label: "Anxious-Excited" }, { id: "sad", emoji: "😢", label: "Sad" }, { id: "angry", emoji: "😠", label: "Angry" }, { id: "sleepy", emoji: "😴", label: "Sleepy" }] },
      { id: 6, scene: { emoji: "📝❌", description: "Made a careless mistake on an easy question.", character: "👧" }, correctAnswer: "frustrated", question: "How does it feel?", options: [{ id: "frustrated", emoji: "😤", label: "Frustrated" }, { id: "happy", emoji: "😊", label: "Happy" }, { id: "scared", emoji: "😨", label: "Scared" }, { id: "sleepy", emoji: "😴", label: "Sleepy" }] },
      { id: 7, scene: { emoji: "🧑‍🔬🏆", description: "Their science project won at the fair.", character: "👦" }, correctAnswer: "validated", question: "How does it feel?", options: [{ id: "validated", emoji: "🤩", label: "Validated" }, { id: "sad", emoji: "😢", label: "Sad" }, { id: "angry", emoji: "😠", label: "Angry" }, { id: "bored", emoji: "😑", label: "Bored" }] },
      { id: 8, scene: { emoji: "👫🤫", description: "Found out friends were talking behind their back.", character: "👧" }, correctAnswer: "betrayed", question: "How does it feel?", options: [{ id: "betrayed", emoji: "😞", label: "Betrayed" }, { id: "happy", emoji: "😊", label: "Happy" }, { id: "excited", emoji: "🤩", label: "Excited" }, { id: "proud", emoji: "😎", label: "Proud" }] },
      { id: 9, scene: { emoji: "📖🌟", description: "Read a book that changed how they see the world.", character: "👦" }, correctAnswer: "inspired", question: "How does it feel?", options: [{ id: "inspired", emoji: "✨", label: "Inspired" }, { id: "sad", emoji: "😢", label: "Sad" }, { id: "angry", emoji: "😠", label: "Angry" }, { id: "sleepy", emoji: "😴", label: "Sleepy" }] },
      { id: 10, scene: { emoji: "🏃‍♂️⏱️", description: "Set a new personal best in running.", character: "👧" }, correctAnswer: "empowered", question: "How does it feel?", options: [{ id: "empowered", emoji: "💪", label: "Empowered" }, { id: "sad", emoji: "😢", label: "Sad" }, { id: "scared", emoji: "😨", label: "Scared" }, { id: "bored", emoji: "😑", label: "Bored" }] },
      { id: 11, scene: { emoji: "😢🐕", description: "Their pet is very sick.", character: "👦" }, correctAnswer: "worried", question: "How does it feel?", options: [{ id: "worried", emoji: "😟", label: "Worried" }, { id: "happy", emoji: "😊", label: "Happy" }, { id: "proud", emoji: "😎", label: "Proud" }, { id: "excited", emoji: "🤩", label: "Excited" }] },
      { id: 12, scene: { emoji: "🎨📋", description: "Their creative idea was rejected by the group.", character: "👧" }, correctAnswer: "undervalued", question: "How does it feel?", options: [{ id: "undervalued", emoji: "😞", label: "Undervalued" }, { id: "happy", emoji: "😊", label: "Happy" }, { id: "excited", emoji: "🤩", label: "Excited" }, { id: "sleepy", emoji: "😴", label: "Sleepy" }] },
      { id: 13, scene: { emoji: "👨‍👩‍👧", description: "Parents are arguing a lot lately.", character: "👦" }, correctAnswer: "anxious", question: "How does it feel?", options: [{ id: "anxious", emoji: "😰", label: "Anxious" }, { id: "happy", emoji: "😊", label: "Happy" }, { id: "proud", emoji: "😎", label: "Proud" }, { id: "excited", emoji: "🤩", label: "Excited" }] },
      { id: 14, scene: { emoji: "🎵🎹", description: "Mastered a difficult piano piece after weeks of practice.", character: "👧" }, correctAnswer: "satisfied", question: "How does it feel?", options: [{ id: "satisfied", emoji: "😌", label: "Satisfied" }, { id: "angry", emoji: "😠", label: "Angry" }, { id: "scared", emoji: "😨", label: "Scared" }, { id: "bored", emoji: "😑", label: "Bored" }] },
      { id: 15, scene: { emoji: "🌍📺", description: "Learned about climate change at school.", character: "👦" }, correctAnswer: "concerned", question: "How does it feel?", options: [{ id: "concerned", emoji: "😟", label: "Concerned" }, { id: "happy", emoji: "😊", label: "Happy" }, { id: "proud", emoji: "😎", label: "Proud" }, { id: "excited", emoji: "🤩", label: "Excited" }] }
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
