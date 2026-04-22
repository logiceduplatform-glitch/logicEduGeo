// src/components/games/exercises_6_1/HelpYourFriendGame.jsx - Age 6 (first grade) override
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

  const TARGET_ROUNDS = 15;

  const roundsData = {
    el: [
      { id: 1, situation: { emoji: "😢📖", friend: "👦", description: "Ο φίλος σου δεν μπορεί να διαβάσει μια λέξη.", context: "Στην τάξη" }, correctAnswer: "help1", question: "Πώς μπορείς να τον βοηθήσεις;", options: [{ id: "help1", emoji: "📖", action: "Την διαβάζετε μαζί με υπομονή", isCorrect: true }, { id: "help2", emoji: "😏", action: "Του λες ότι είναι εύκολη", isCorrect: false }, { id: "help3", emoji: "🙄", action: "Τον αγνοείς", isCorrect: false }] },
      { id: 2, situation: { emoji: "😰🧮", friend: "👧", description: "Η φίλη σου δεν καταλαβαίνει την πρόσθεση.", context: "Στα μαθηματικά" }, correctAnswer: "help2", question: "Πώς μπορείς να την βοηθήσεις;", options: [{ id: "help1", emoji: "🙄", action: "Της λες ότι φταίει αυτή", isCorrect: false }, { id: "help2", emoji: "🔢", action: "Της δείχνεις με αντικείμενα", isCorrect: true }, { id: "help3", emoji: "📱", action: "Της δίνεις τις απαντήσεις", isCorrect: false }] },
      { id: 3, situation: { emoji: "🤕🏃", friend: "👦", description: "Ο φίλος σου έπεσε στο γυμναστήριο.", context: "Στο γυμναστήριο" }, correctAnswer: "help1", question: "Πώς μπορείς να τον βοηθήσεις;", options: [{ id: "help1", emoji: "🏥", action: "Τον βοηθάς να πάει στο νοσοκομείο/σε νοσηλεύτρια", isCorrect: true }, { id: "help2", emoji: "😆", action: "Γελάς", isCorrect: false }, { id: "help3", emoji: "🏃", action: "Συνεχίζεις να τρέχεις", isCorrect: false }] },
      { id: 4, situation: { emoji: "😔👫", friend: "👧", description: "Η φίλη σου δεν τη διάλεξαν στην ομάδα.", context: "Στην αυλή" }, correctAnswer: "help2", question: "Πώς μπορείς να την βοηθήσεις;", options: [{ id: "help1", emoji: "😒", action: "Δεν κάνεις τίποτα", isCorrect: false }, { id: "help2", emoji: "🤝", action: "Την συμπεριλαμβάνεις στην ομάδα σου", isCorrect: true }, { id: "help3", emoji: "😏", action: "Της λες ότι δεν πειράζει", isCorrect: false }] },
      { id: 5, situation: { emoji: "😢🎨", friend: "👦", description: "Το τέχνη project του φίλου σου καταστράφηκε.", context: "Στην τάξη τέχνης" }, correctAnswer: "help1", question: "Πώς μπορείς να τον βοηθήσεις;", options: [{ id: "help1", emoji: "🖌️", action: "Τον βοηθάς να ξεκινήσει από την αρχή", isCorrect: true }, { id: "help2", emoji: "😆", action: "Γελάς με το ατύχημα", isCorrect: false }, { id: "help3", emoji: "🙄", action: "Του λες ότι δεν ήταν καλό", isCorrect: false }] },
      { id: 6, situation: { emoji: "😰📝", friend: "👧", description: "Η φίλη σου ξέχασε τις εργασίες της.", context: "Στο σχολείο" }, correctAnswer: "help2", question: "Πώς μπορείς να την βοηθήσεις;", options: [{ id: "help1", emoji: "😒", action: "Της λες ότι φταίει αυτή", isCorrect: false }, { id: "help2", emoji: "🤝", action: "Τη βοηθάς να εξηγήσει στη δασκάλα", isCorrect: true }, { id: "help3", emoji: "🙄", action: "Την αγνοείς", isCorrect: false }] },
      { id: 7, situation: { emoji: "😭🏠", friend: "👦", description: "Ο φίλος σου νοσταλγεί τη μαμά του.", context: "Στο σχολείο" }, correctAnswer: "help1", question: "Πώς μπορείς να τον βοηθήσεις;", options: [{ id: "help1", emoji: "🤗", action: "Τον παρηγορείς και μένεις κοντά του", isCorrect: true }, { id: "help2", emoji: "😒", action: "Του λες να μην κλαίει", isCorrect: false }, { id: "help3", emoji: "🏃", action: "Πας να παίξεις αλλού", isCorrect: false }] },
      { id: 8, situation: { emoji: "😔🍽️", friend: "👧", description: "Η φίλη σου έριξε το μεσημεριανό της.", context: "Στην καντίνα" }, correctAnswer: "help2", question: "Πώς μπορείς να την βοηθήσεις;", options: [{ id: "help1", emoji: "😋", action: "Τρως το δικό σου μπροστά της", isCorrect: false }, { id: "help2", emoji: "🤝", action: "Τη βοηθάς να καθαρίσει και μοιράζεσαι", isCorrect: true }, { id: "help3", emoji: "😐", action: "Την αγνοείς", isCorrect: false }] },
      { id: 9, situation: { emoji: "😢👟", friend: "👦", description: "Το κορδόνι του φίλου σου χάλασε.", context: "Στην αυλή" }, correctAnswer: "help1", question: "Πώς μπορείς να τον βοηθήσεις;", options: [{ id: "help1", emoji: "👟", action: "Τον βοηθάς να το φτιάξεις ή να βρεις κολλητική ταινία", isCorrect: true }, { id: "help2", emoji: "😆", action: "Γελάς", isCorrect: false }, { id: "help3", emoji: "🏃", action: "Συνεχίζεις να παίζεις", isCorrect: false }] },
      { id: 10, situation: { emoji: "😰🎭", friend: "👧", description: "Η φίλη σου αγχώνεται για το θεατρικό.", context: "Στην αίθουσα" }, correctAnswer: "help2", question: "Πώς μπορείς να την βοηθήσεις;", options: [{ id: "help1", emoji: "😒", action: "Της λες ότι είναι εύκολο", isCorrect: false }, { id: "help2", emoji: "📜", action: "Κάνετε πρόβα τις ατάκες μαζί", isCorrect: true }, { id: "help3", emoji: "🙄", action: "Την αγνοείς", isCorrect: false }] },
      { id: 11, situation: { emoji: "😔📚", friend: "👦", description: "Ο φίλος σου δεν βρίσκει το βιβλίο του.", context: "Στη βιβλιοθήκη" }, correctAnswer: "help1", question: "Πώς μπορείς να τον βοηθήσεις;", options: [{ id: "help1", emoji: "🔍", action: "Τον βοηθάς να το ψάξει", isCorrect: true }, { id: "help2", emoji: "😒", action: "Του λες ότι είναι απρόσεκτος", isCorrect: false }, { id: "help3", emoji: "🙄", action: "Δεν κάνεις τίποτα", isCorrect: false }] },
      { id: 12, situation: { emoji: "😢🖍️", friend: "👧", description: "Η φίλη σου έσπασε το αγαπημένο της κραγιόνι.", context: "Στην τάξη" }, correctAnswer: "help2", question: "Πώς μπορείς να την βοηθήσεις;", options: [{ id: "help1", emoji: "🙄", action: "Της λες ότι δεν πειράζει", isCorrect: false }, { id: "help2", emoji: "🤲", action: "Μοιράζεσαι το δικό σου και την παρηγορείς", isCorrect: true }, { id: "help3", emoji: "😐", action: "Την αγνοείς", isCorrect: false }] },
      { id: 13, situation: { emoji: "😰🏊", friend: "👦", description: "Ο φίλος σου φοβάται να κολυμπήσει.", context: "Στο κολυμβητήριο" }, correctAnswer: "help1", question: "Πώς μπορείς να τον βοηθήσεις;", options: [{ id: "help1", emoji: "💪", action: "Τον ενθαρρύνεις ευγενικά", isCorrect: true }, { id: "help2", emoji: "😆", action: "Γελάς που φοβάται", isCorrect: false }, { id: "help3", emoji: "🏃", action: "Πας μόνος σου να κολυμπήσεις", isCorrect: false }] },
      { id: 14, situation: { emoji: "😔🧩", friend: "👧", description: "Η φίλη σου δεν μπορεί να τελειώσει το παζλ.", context: "Στο ελεύθερο παιχνίδι" }, correctAnswer: "help2", question: "Πώς μπορείς να την βοηθήσεις;", options: [{ id: "help1", emoji: "😒", action: "Της λες ότι είναι εύκολο", isCorrect: false }, { id: "help2", emoji: "🧩", action: "Δουλεύετε μαζί πάνω σε αυτό", isCorrect: true }, { id: "help3", emoji: "🙄", action: "Την αγνοείς", isCorrect: false }] },
      { id: 15, situation: { emoji: "😢🎒", friend: "👦", description: "Το φερμουάρ του σχολικού σάκου του φίλου σου κόλλησε.", context: "Στο σχολείο" }, correctAnswer: "help1", question: "Πώς μπορείς να τον βοηθήσεις;", options: [{ id: "help1", emoji: "🔧", action: "Τον βοηθάς να το φτιάξει", isCorrect: true }, { id: "help2", emoji: "😆", action: "Γελάς", isCorrect: false }, { id: "help3", emoji: "🚶", action: "Φεύγεις", isCorrect: false }] }
    ],
    en: [
      { id: 1, situation: { emoji: "😢📖", friend: "👦", description: "Friend can't read a word.", context: "In the classroom" }, correctAnswer: "help1", question: "How can you help them?", options: [{ id: "help1", emoji: "📖", action: "Read it together patiently", isCorrect: true }, { id: "help2", emoji: "😏", action: "Tell them it's easy", isCorrect: false }, { id: "help3", emoji: "🙄", action: "Ignore them", isCorrect: false }] },
      { id: 2, situation: { emoji: "😰🧮", friend: "👧", description: "Friend doesn't understand addition.", context: "In math class" }, correctAnswer: "help2", question: "How can you help them?", options: [{ id: "help1", emoji: "🙄", action: "Tell them it's their fault", isCorrect: false }, { id: "help2", emoji: "🔢", action: "Show them with objects", isCorrect: true }, { id: "help3", emoji: "📱", action: "Give them the answers", isCorrect: false }] },
      { id: 3, situation: { emoji: "🤕🏃", friend: "👦", description: "Friend tripped during PE.", context: "In the gym" }, correctAnswer: "help1", question: "How can you help them?", options: [{ id: "help1", emoji: "🏥", action: "Help them to the nurse", isCorrect: true }, { id: "help2", emoji: "😆", action: "Laugh", isCorrect: false }, { id: "help3", emoji: "🏃", action: "Keep running", isCorrect: false }] },
      { id: 4, situation: { emoji: "😔👫", friend: "👧", description: "Friend wasn't picked for the team.", context: "In the yard" }, correctAnswer: "help2", question: "How can you help them?", options: [{ id: "help1", emoji: "😒", action: "Do nothing", isCorrect: false }, { id: "help2", emoji: "🤝", action: "Include them in your team", isCorrect: true }, { id: "help3", emoji: "😏", action: "Tell them it doesn't matter", isCorrect: false }] },
      { id: 5, situation: { emoji: "😢🎨", friend: "👦", description: "Friend's art project got ruined.", context: "In art class" }, correctAnswer: "help1", question: "How can you help them?", options: [{ id: "help1", emoji: "🖌️", action: "Help them start over", isCorrect: true }, { id: "help2", emoji: "😆", action: "Laugh at the accident", isCorrect: false }, { id: "help3", emoji: "🙄", action: "Tell them it wasn't good", isCorrect: false }] },
      { id: 6, situation: { emoji: "😰📝", friend: "👧", description: "Friend forgot their homework.", context: "At school" }, correctAnswer: "help2", question: "How can you help them?", options: [{ id: "help1", emoji: "😒", action: "Tell them it's their fault", isCorrect: false }, { id: "help2", emoji: "🤝", action: "Help explain to the teacher", isCorrect: true }, { id: "help3", emoji: "🙄", action: "Ignore them", isCorrect: false }] },
      { id: 7, situation: { emoji: "😭🏠", friend: "👦", description: "Friend misses their mom.", context: "At school" }, correctAnswer: "help1", question: "How can you help them?", options: [{ id: "help1", emoji: "🤗", action: "Comfort them and stay close", isCorrect: true }, { id: "help2", emoji: "😒", action: "Tell them not to cry", isCorrect: false }, { id: "help3", emoji: "🏃", action: "Go play elsewhere", isCorrect: false }] },
      { id: 8, situation: { emoji: "😔🍽️", friend: "👧", description: "Friend spilled their lunch.", context: "In the cafeteria" }, correctAnswer: "help2", question: "How can you help them?", options: [{ id: "help1", emoji: "😋", action: "Eat your food in front of them", isCorrect: false }, { id: "help2", emoji: "🤝", action: "Help clean up and share", isCorrect: true }, { id: "help3", emoji: "😐", action: "Ignore them", isCorrect: false }] },
      { id: 9, situation: { emoji: "😢👟", friend: "👦", description: "Friend's shoelace broke.", context: "In the yard" }, correctAnswer: "help1", question: "How can you help them?", options: [{ id: "help1", emoji: "👟", action: "Help fix it or get tape", isCorrect: true }, { id: "help2", emoji: "😆", action: "Laugh", isCorrect: false }, { id: "help3", emoji: "🏃", action: "Keep playing", isCorrect: false }] },
      { id: 10, situation: { emoji: "😰🎭", friend: "👧", description: "Friend is nervous about the school play.", context: "In the auditorium" }, correctAnswer: "help2", question: "How can you help them?", options: [{ id: "help1", emoji: "😒", action: "Tell them it's easy", isCorrect: false }, { id: "help2", emoji: "📜", action: "Practice lines together", isCorrect: true }, { id: "help3", emoji: "🙄", action: "Ignore them", isCorrect: false }] },
      { id: 11, situation: { emoji: "😔📚", friend: "👦", description: "Friend can't find their book.", context: "In the library" }, correctAnswer: "help1", question: "How can you help them?", options: [{ id: "help1", emoji: "🔍", action: "Help search for it", isCorrect: true }, { id: "help2", emoji: "😒", action: "Tell them they're careless", isCorrect: false }, { id: "help3", emoji: "🙄", action: "Do nothing", isCorrect: false }] },
      { id: 12, situation: { emoji: "😢🖍️", friend: "👧", description: "Friend broke their favorite crayon.", context: "In the classroom" }, correctAnswer: "help2", question: "How can you help them?", options: [{ id: "help1", emoji: "🙄", action: "Tell them it doesn't matter", isCorrect: false }, { id: "help2", emoji: "🤲", action: "Share yours and comfort them", isCorrect: true }, { id: "help3", emoji: "😐", action: "Ignore them", isCorrect: false }] },
      { id: 13, situation: { emoji: "😰🏊", friend: "👦", description: "Friend is scared to swim.", context: "At the pool" }, correctAnswer: "help1", question: "How can you help them?", options: [{ id: "help1", emoji: "💪", action: "Encourage them gently", isCorrect: true }, { id: "help2", emoji: "😆", action: "Laugh at their fear", isCorrect: false }, { id: "help3", emoji: "🏃", action: "Go swim by yourself", isCorrect: false }] },
      { id: 14, situation: { emoji: "😔🧩", friend: "👧", description: "Friend can't finish the puzzle.", context: "During free play" }, correctAnswer: "help2", question: "How can you help them?", options: [{ id: "help1", emoji: "😒", action: "Tell them it's easy", isCorrect: false }, { id: "help2", emoji: "🧩", action: "Work on it together", isCorrect: true }, { id: "help3", emoji: "🙄", action: "Ignore them", isCorrect: false }] },
      { id: 15, situation: { emoji: "😢🎒", friend: "👦", description: "Friend's backpack zipper is stuck.", context: "At school" }, correctAnswer: "help1", question: "How can you help them?", options: [{ id: "help1", emoji: "🔧", action: "Help them fix it", isCorrect: true }, { id: "help2", emoji: "😆", action: "Laugh", isCorrect: false }, { id: "help3", emoji: "🚶", action: "Walk away", isCorrect: false }] }
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
