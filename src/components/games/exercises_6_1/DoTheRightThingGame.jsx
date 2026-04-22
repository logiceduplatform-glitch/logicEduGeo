// src/components/games/exercises_6_1/DoTheRightThingGame.jsx - Age 6 (first grade) override
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";

export default function DoTheRightThingGame({ lang = "el", difficulty = 3, onComplete }) {
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
      { id: 1, scenario: { emoji: "📚👧", description: "Νέος συμμαθητής κάθεται μόνος στο διάλειμμα.", context: "Στο σχολείο" }, correctAnswer: "invite", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "invite", emoji: "🤗", label: "Τον καλείς να καθίσει μαζί σου", isPolite: true }, { id: "ignore", emoji: "🙄", label: "Τον αγνοείς", isPolite: false }, { id: "laugh", emoji: "😆", label: "Γελάς μαζί των άλλων", isPolite: false }, { id: "walk", emoji: "🚶", label: "Φεύγεις γρήγορα", isPolite: false }] },
      { id: 2, scenario: { emoji: "✏️💔", description: "Βρήκες ένα μολύβι που δεν είναι δικό σου.", context: "Στην τάξη" }, correctAnswer: "teacher", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "teacher", emoji: "👩‍🏫", label: "Το δίνεις στη δασκάλα", isPolite: true }, { id: "keep", emoji: "✏️", label: "Το κρατάς για εσένα", isPolite: false }, { id: "throw", emoji: "🗑️", label: "Το πετάς", isPolite: false }, { id: "hide", emoji: "🙈", label: "Το κρύβεις", isPolite: false }] },
      { id: 3, scenario: { emoji: "🧹📚", description: "Η δασκάλα ζητάει βοήθεια για να καθαρίσει η τάξη.", context: "Στην τάξη" }, correctAnswer: "help", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "help", emoji: "🤝", label: "Βοηθάς με προθυμία", isPolite: true }, { id: "refuse", emoji: "🙅", label: "Λες όχι", isPolite: false }, { id: "complain", emoji: "😒", label: "Παραπονιέσαι", isPolite: false }, { id: "run", emoji: "🏃", label: "Φεύγεις έξω", isPolite: false }] },
      { id: 4, scenario: { emoji: "🍎👫", description: "Ο φίλος σου ξέχασε το σνακ του.", context: "Στο διάλειμμα" }, correctAnswer: "share", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "share", emoji: "🤲", label: "Μοιράζεσαι το δικό σου", isPolite: true }, { id: "ignore", emoji: "😐", label: "Τον αγνοείς", isPolite: false }, { id: "eat", emoji: "🍎", label: "Τρως μπροστά του", isPolite: false }, { id: "mock", emoji: "😏", label: "Τον κοροϊδεύεις", isPolite: false }] },
      { id: 5, scenario: { emoji: "📝❌", description: "Αντιγράφεις από την κόπια του φίλου σου στην εξέταση.", context: "Στην τάξη" }, correctAnswer: "truth", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "truth", emoji: "😔", label: "Λες την αλήθεια στη δασκάλα", isPolite: true }, { id: "hide", emoji: "🤐", label: "Δεν λες τίποτα", isPolite: false }, { id: "blame", emoji: "👉", label: "Κατηγορείς τον φίλο σου", isPolite: false }, { id: "lie", emoji: "🤥", label: "Λες ψέματα", isPolite: false }] },
      { id: 6, scenario: { emoji: "🎮⏰", description: "Είναι ώρα για εργασίες αλλά θέλεις να παίξεις.", context: "Στο σπίτι" }, correctAnswer: "homework", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "homework", emoji: "📚", label: "Κάνεις πρώτα τις εργασίες", isPolite: true }, { id: "play", emoji: "🎮", label: "Παίζεις κρυφά", isPolite: false }, { id: "lie", emoji: "🤥", label: "Λες ότι τελείωσες", isPolite: false }, { id: "cry", emoji: "😢", label: "Κλαις και παραπονιέσαι", isPolite: false }] },
      { id: 7, scenario: { emoji: "📖👂", description: "Η δασκάλα διαβάζει μια ιστορία.", context: "Στην τάξη" }, correctAnswer: "listen", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "listen", emoji: "👂", label: "Ακούς ήσυχα", isPolite: true }, { id: "talk", emoji: "💬", label: "Μιλάς με τον διπλανό σου", isPolite: false }, { id: "play", emoji: "🎮", label: "Παίζεις με κάτι", isPolite: false }, { id: "stand", emoji: "🚶", label: "Σηκώνεσαι και περπατάς", isPolite: false }] },
      { id: 8, scenario: { emoji: "🚶🧓", description: "Ένας ηλικιωμένος χρειάζεται βοήθεια να περάσει το δρόμο.", context: "Στο δρόμο" }, correctAnswer: "help", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "help", emoji: "🤝", label: "Τον βοηθάς", isPolite: true }, { id: "ignore", emoji: "🙄", label: "Τον αγνοείς", isPolite: false }, { id: "laugh", emoji: "😆", label: "Γελάς", isPolite: false }, { id: "run", emoji: "🏃", label: "Τρέχεις μπροστά", isPolite: false }] },
      { id: 9, scenario: { emoji: "💔😢", description: "Έσχισες κατά λάθος το σχέδιο ενός συμμαθητή.", context: "Στην τάξη" }, correctAnswer: "apologize", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "apologize", emoji: "😔", label: "Ζητάς συγγνώμη και προσφέρεσαι να το διορθώσεις", isPolite: true }, { id: "hide", emoji: "🙈", label: "Κρύβεις το σχέδιο", isPolite: false }, { id: "blame", emoji: "👉", label: "Λες ότι φταίει αυτός", isPolite: false }, { id: "run", emoji: "🏃", label: "Φεύγεις", isPolite: false }] },
      { id: 10, scenario: { emoji: "🎂🎁", description: "Δεν σε κάλεσαν σε ένα πάρτι γενεθλίων.", context: "Στο σχολείο" }, correctAnswer: "kind", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "kind", emoji: "😊", label: "Είσαι ευγενικός ούτως ή άλλως", isPolite: true }, { id: "angry", emoji: "😠", label: "Θυμώνεις μαζί τους", isPolite: false }, { id: "ignore", emoji: "😤", label: "Τους αγνοείς πλέον", isPolite: false }, { id: "mock", emoji: "😏", label: "Τους κοροϊδεύεις", isPolite: false }] },
      { id: 11, scenario: { emoji: "📱🚫", description: "Ο φίλος σου θέλει να χρησιμοποιήσει το κινητό στην τάξη.", context: "Στην τάξη" }, correctAnswer: "tell", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "tell", emoji: "📵", label: "Του λες ότι δεν επιτρέπεται", isPolite: true }, { id: "join", emoji: "📱", label: "Κοιτάς κι εσύ", isPolite: false }, { id: "ignore", emoji: "😐", label: "Δεν κάνεις τίποτα", isPolite: false }, { id: "snatch", emoji: "🙌", label: "Του το παίρνεις", isPolite: false }] },
      { id: 12, scenario: { emoji: "🌳🗑️", description: "Βλέπεις σκουπιά στην αυλή του σχολείου.", context: "Στην αυλή" }, correctAnswer: "pickup", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "pickup", emoji: "♻️", label: "Τα μαζεύεις", isPolite: true }, { id: "ignore", emoji: "🙄", label: "Τα αγνοείς", isPolite: false }, { id: "kick", emoji: "⚽", label: "Τα κλωτσάς", isPolite: false }, { id: "mock", emoji: "😒", label: "Παραπονιέσαι αλλά δεν κάνεις τίποτα", isPolite: false }] },
      { id: 13, scenario: { emoji: "👫💪", description: "Ένας συμμαθητής δυσκολεύεται με τη σακούλα του.", context: "Στο διάδρομο" }, correctAnswer: "help", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "help", emoji: "💪", label: "Τον βοηθάς να την κουβαλήσει", isPolite: true }, { id: "laugh", emoji: "😆", label: "Γελάς", isPolite: false }, { id: "ignore", emoji: "🚶", label: "Περπατάς μπροστά", isPolite: false }, { id: "mock", emoji: "😏", label: "Τον κοροϊδεύεις", isPolite: false }] },
      { id: 14, scenario: { emoji: "🏃🤕", description: "Κάποιος έπεσε στο διάλειμμα.", context: "Στην αυλή" }, correctAnswer: "help", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "help", emoji: "🤝", label: "Τον βοηθάς να σηκωθεί και φέρνεις δασκάλα", isPolite: true }, { id: "laugh", emoji: "😆", label: "Γελάς", isPolite: false }, { id: "ignore", emoji: "🏃", label: "Συνεχίζεις να παίζεις", isPolite: false }, { id: "point", emoji: "👉", label: "Τον δείχνεις σε άλλους", isPolite: false }] },
      { id: 15, scenario: { emoji: "📚🤫", description: "Ώρα για βιβλιοθήκη.", context: "Στη βιβλιοθήκη" }, correctAnswer: "quiet", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "quiet", emoji: "🤫", label: "Είσαι ήσυχος και σεβαστικός", isPolite: true }, { id: "run", emoji: "🏃", label: "Τρέχεις και φωνάζεις", isPolite: false }, { id: "play", emoji: "🎮", label: "Παίζεις δυνατά", isPolite: false }, { id: "talk", emoji: "📢", label: "Μιλάς δυνατά", isPolite: false }] }
    ],
    en: [
      { id: 1, scenario: { emoji: "📚👧", description: "New classmate sitting alone at lunch.", context: "At school" }, correctAnswer: "invite", question: "What is the right thing to do?", options: [{ id: "invite", emoji: "🤗", label: "Invite them to sit with you", isPolite: true }, { id: "ignore", emoji: "🙄", label: "Ignore them", isPolite: false }, { id: "laugh", emoji: "😆", label: "Laugh with the others", isPolite: false }, { id: "walk", emoji: "🚶", label: "Walk away quickly", isPolite: false }] },
      { id: 2, scenario: { emoji: "✏️💔", description: "Found a pencil that's not yours.", context: "In the classroom" }, correctAnswer: "teacher", question: "What is the right thing to do?", options: [{ id: "teacher", emoji: "👩‍🏫", label: "Give it to the teacher", isPolite: true }, { id: "keep", emoji: "✏️", label: "Keep it for yourself", isPolite: false }, { id: "throw", emoji: "🗑️", label: "Throw it away", isPolite: false }, { id: "hide", emoji: "🙈", label: "Hide it", isPolite: false }] },
      { id: 3, scenario: { emoji: "🧹📚", description: "Teacher asks everyone to help clean up.", context: "In the classroom" }, correctAnswer: "help", question: "What is the right thing to do?", options: [{ id: "help", emoji: "🤝", label: "Help willingly", isPolite: true }, { id: "refuse", emoji: "🙅", label: "Say no", isPolite: false }, { id: "complain", emoji: "😒", label: "Complain", isPolite: false }, { id: "run", emoji: "🏃", label: "Run outside", isPolite: false }] },
      { id: 4, scenario: { emoji: "🍎👫", description: "Friend forgot their snack.", context: "At recess" }, correctAnswer: "share", question: "What is the right thing to do?", options: [{ id: "share", emoji: "🤲", label: "Share yours", isPolite: true }, { id: "ignore", emoji: "😐", label: "Ignore them", isPolite: false }, { id: "eat", emoji: "🍎", label: "Eat in front of them", isPolite: false }, { id: "mock", emoji: "😏", label: "Make fun of them", isPolite: false }] },
      { id: 5, scenario: { emoji: "📝❌", description: "You copied from your friend's test.", context: "In the classroom" }, correctAnswer: "truth", question: "What is the right thing to do?", options: [{ id: "truth", emoji: "😔", label: "Tell the teacher the truth", isPolite: true }, { id: "hide", emoji: "🤐", label: "Say nothing", isPolite: false }, { id: "blame", emoji: "👉", label: "Blame your friend", isPolite: false }, { id: "lie", emoji: "🤥", label: "Tell a lie", isPolite: false }] },
      { id: 6, scenario: { emoji: "🎮⏰", description: "Time to do homework but you want to play.", context: "At home" }, correctAnswer: "homework", question: "What is the right thing to do?", options: [{ id: "homework", emoji: "📚", label: "Do homework first", isPolite: true }, { id: "play", emoji: "🎮", label: "Play in secret", isPolite: false }, { id: "lie", emoji: "🤥", label: "Say you're done", isPolite: false }, { id: "cry", emoji: "😢", label: "Cry and complain", isPolite: false }] },
      { id: 7, scenario: { emoji: "📖👂", description: "Teacher is reading a story.", context: "In the classroom" }, correctAnswer: "listen", question: "What is the right thing to do?", options: [{ id: "listen", emoji: "👂", label: "Listen quietly", isPolite: true }, { id: "talk", emoji: "💬", label: "Talk to your neighbor", isPolite: false }, { id: "play", emoji: "🎮", label: "Play with something", isPolite: false }, { id: "stand", emoji: "🚶", label: "Stand up and walk around", isPolite: false }] },
      { id: 8, scenario: { emoji: "🚶🧓", description: "Elderly person needs help crossing the street.", context: "On the street" }, correctAnswer: "help", question: "What is the right thing to do?", options: [{ id: "help", emoji: "🤝", label: "Help them", isPolite: true }, { id: "ignore", emoji: "🙄", label: "Ignore them", isPolite: false }, { id: "laugh", emoji: "😆", label: "Laugh", isPolite: false }, { id: "run", emoji: "🏃", label: "Run ahead", isPolite: false }] },
      { id: 9, scenario: { emoji: "💔😢", description: "You accidentally tore a classmate's drawing.", context: "In the classroom" }, correctAnswer: "apologize", question: "What is the right thing to do?", options: [{ id: "apologize", emoji: "😔", label: "Apologize and offer to help fix it", isPolite: true }, { id: "hide", emoji: "🙈", label: "Hide the drawing", isPolite: false }, { id: "blame", emoji: "👉", label: "Say it's their fault", isPolite: false }, { id: "run", emoji: "🏃", label: "Run away", isPolite: false }] },
      { id: 10, scenario: { emoji: "🎂🎁", description: "You weren't invited to a birthday party.", context: "At school" }, correctAnswer: "kind", question: "What is the right thing to do?", options: [{ id: "kind", emoji: "😊", label: "Be kind anyway", isPolite: true }, { id: "angry", emoji: "😠", label: "Get angry at them", isPolite: false }, { id: "ignore", emoji: "😤", label: "Ignore them from now on", isPolite: false }, { id: "mock", emoji: "😏", label: "Make fun of them", isPolite: false }] },
      { id: 11, scenario: { emoji: "📱🚫", description: "Friend wants to use phone during class.", context: "In the classroom" }, correctAnswer: "tell", question: "What is the right thing to do?", options: [{ id: "tell", emoji: "📵", label: "Tell them it's not allowed", isPolite: true }, { id: "join", emoji: "📱", label: "Look at it too", isPolite: false }, { id: "ignore", emoji: "😐", label: "Do nothing", isPolite: false }, { id: "snatch", emoji: "🙌", label: "Take it from them", isPolite: false }] },
      { id: 12, scenario: { emoji: "🌳🗑️", description: "You see trash on the school playground.", context: "In the yard" }, correctAnswer: "pickup", question: "What is the right thing to do?", options: [{ id: "pickup", emoji: "♻️", label: "Pick it up", isPolite: true }, { id: "ignore", emoji: "🙄", label: "Ignore it", isPolite: false }, { id: "kick", emoji: "⚽", label: "Kick it", isPolite: false }, { id: "mock", emoji: "😒", label: "Complain but do nothing", isPolite: false }] },
      { id: 13, scenario: { emoji: "👫💪", description: "A classmate is struggling with their backpack.", context: "In the hallway" }, correctAnswer: "help", question: "What is the right thing to do?", options: [{ id: "help", emoji: "💪", label: "Help carry it", isPolite: true }, { id: "laugh", emoji: "😆", label: "Laugh", isPolite: false }, { id: "ignore", emoji: "🚶", label: "Walk ahead", isPolite: false }, { id: "mock", emoji: "😏", label: "Make fun of them", isPolite: false }] },
      { id: 14, scenario: { emoji: "🏃🤕", description: "Someone falls during recess.", context: "In the yard" }, correctAnswer: "help", question: "What is the right thing to do?", options: [{ id: "help", emoji: "🤝", label: "Help them up and get a teacher", isPolite: true }, { id: "laugh", emoji: "😆", label: "Laugh", isPolite: false }, { id: "ignore", emoji: "🏃", label: "Keep playing", isPolite: false }, { id: "point", emoji: "👉", label: "Point at them to others", isPolite: false }] },
      { id: 15, scenario: { emoji: "📚🤫", description: "Library time.", context: "In the library" }, correctAnswer: "quiet", question: "What is the right thing to do?", options: [{ id: "quiet", emoji: "🤫", label: "Be quiet and respectful", isPolite: true }, { id: "run", emoji: "🏃", label: "Run and shout", isPolite: false }, { id: "play", emoji: "🎮", label: "Play loudly", isPolite: false }, { id: "talk", emoji: "📢", label: "Talk loudly", isPolite: false }] }
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
        title: "Do The Right Thing Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Do The Right Thing Game",
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
    <div className="relative w-full min-h-screen bg-gradient-to-br from-green-100 via-teal-100 to-blue-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Κάνε το Σωστό" : "Do The Right Thing"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-green-600">
            🤝 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500 ease-out"
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
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-green-400">
          <div className="text-7xl mb-3">🤝</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">
            {round.question}
          </h2>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-green-400">
          {/* Scenario Display */}
          <div className="bg-gradient-to-br from-blue-100 to-teal-100 rounded-3xl p-10 border-4 border-blue-400 mb-8 shadow-lg">
            <div className="flex flex-col items-center justify-center gap-6">
              {/* Context Badge */}
              <div className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold text-lg">
                {round.scenario.context}
              </div>

              {/* Scenario Icons */}
              <div className="text-9xl">
                {round.scenario.emoji}
              </div>

              {/* Description */}
              <div className="bg-white/90 rounded-2xl p-6 border-4 border-blue-300 max-w-2xl">
                <p className="text-2xl font-bold text-center text-slate-800">
                  {round.scenario.description}
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

              <div className="grid grid-cols-1 gap-4 max-w-3xl mx-auto">
                {round.options.map((option) => {
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswerSelect(option.id)}
                      className="p-6 rounded-2xl bg-gradient-to-br from-green-100 to-teal-100 hover:from-green-200 hover:to-teal-200 border-4 border-green-300 hover:border-green-500 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-6 cursor-pointer text-left"
                    >
                      <div className="text-7xl flex-shrink-0">{option.emoji}</div>
                      <p className="text-xl font-bold text-slate-700 flex-1">{option.label}</p>
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
                  <div className="text-8xl">✅</div>
                </div>
                <p className="text-3xl font-bold text-green-700 mb-4">
                  {lang === "el"
                    ? `🎉 Μπράβο! Έκανες το σωστό!`
                    : `🎉 Well done! You did the right thing!`}
                </p>
                <p className="text-xl text-green-600">
                  {correctOption.label}
                </p>
              </div>
            </div>
          )}

          {showAnswer && selectedAnswer !== round.correctAnswer && (
            <div className="text-center animate-fadeIn">
              <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
                <p className="text-3xl font-bold text-red-700">
                  {lang === "el"
                    ? `Σκέψου ξανά! Τι θα ήταν πιο ευγενικό;`
                    : `Think again! What would be more polite?`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-300/80 to-blue-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🤝🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις πάντα το σωστό!" : "Perfect! You always know the right thing!"}
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
