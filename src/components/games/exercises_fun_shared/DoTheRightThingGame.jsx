// src/components/games/DoTheRightThingGame.jsx
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

  const TARGET_ROUNDS = 10;

  const roundsData = {
    el: [
      {
        id: 1,
        scenario: {
          emoji: "🧒👵",
          description: "Βλέπεις μια γιαγιά να προσπαθεί να σηκώσει μια βαριά τσάντα.",
          context: "Στο σούπερ μάρκετ"
        },
        correctAnswer: "help",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "help", emoji: "🤝", label: "Την βοηθάς να κουβαλήσει την τσάντα", isPolite: true },
          { id: "ignore", emoji: "🚶", label: "Την αγνοείς και φεύγεις", isPolite: false },
          { id: "laugh", emoji: "😆", label: "Γελάς με την κατάσταση", isPolite: false },
          { id: "watch", emoji: "👀", label: "Απλά την κοιτάς", isPolite: false }
        ]
      },
      {
        id: 2,
        scenario: {
          emoji: "🧸❌",
          description: "Ο φίλος σου σου ζητάει το παιχνίδι που παίζεις εσύ.",
          context: "Στην παιδική χαρά"
        },
        correctAnswer: "share",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "share", emoji: "🤗", label: "Μοιράζεσαι και παίζετε μαζί", isPolite: true },
          { id: "refuse", emoji: "🙅", label: "Λες όχι και το κρατάς", isPolite: false },
          { id: "throw", emoji: "🎯", label: "Το πετάς μακριά", isPolite: false },
          { id: "hide", emoji: "🙈", label: "Το κρύβεις πίσω σου", isPolite: false }
        ]
      },
      {
        id: 3,
        scenario: {
          emoji: "🚪👨",
          description: "Μπαίνεις στο σπίτι και βλέπεις τον μπαμπά σου.",
          context: "Στο σπίτι"
        },
        correctAnswer: "greet",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "greet", emoji: "👋", label: "Τον χαιρετάς και του λες γεια", isPolite: true },
          { id: "silent", emoji: "😶", label: "Δεν λες τίποτα και πας στο δωμάτιο", isPolite: false },
          { id: "yell", emoji: "😤", label: "Φωνάζεις να σου φέρει κάτι", isPolite: false },
          { id: "complain", emoji: "😒", label: "Παραπονιέσαι αμέσως", isPolite: false }
        ]
      },
      {
        id: 4,
        scenario: {
          emoji: "🍽️😋",
          description: "Η μαμά έφτιαξε φαγητό που δεν σου αρέσει πολύ.",
          context: "Στο τραπέζι"
        },
        correctAnswer: "thankful",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "thankful", emoji: "😊", label: "Την ευχαριστείς και δοκιμάζεις λίγο", isPolite: true },
          { id: "refuse", emoji: "😠", label: "Αρνείσαι να φας", isPolite: false },
          { id: "complain", emoji: "😣", label: "Παραπονιέσαι δυνατά", isPolite: false },
          { id: "push", emoji: "🙅", label: "Σπρώχνεις το πιάτο", isPolite: false }
        ]
      },
      {
        id: 5,
        scenario: {
          emoji: "💥🏺",
          description: "Έσπασες κατά λάθος ένα βάζο της μαμάς.",
          context: "Στο σπίτι"
        },
        correctAnswer: "honest",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "honest", emoji: "😔", label: "Λες την αλήθεια και ζητάς συγγνώμη", isPolite: true },
          { id: "hide", emoji: "🤐", label: "Το κρύβεις και δεν λες τίποτα", isPolite: false },
          { id: "blame", emoji: "👉", label: "Κατηγορείς κάποιον άλλον", isPolite: false },
          { id: "lie", emoji: "🤥", label: "Λες ψέματα", isPolite: false }
        ]
      },
      {
        id: 6,
        scenario: {
          emoji: "🎂🎈",
          description: "Σε κάλεσαν σε ένα πάρτι γενεθλίων.",
          context: "Στο πάρτι"
        },
        correctAnswer: "thankyou",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "thankyou", emoji: "🙏", label: "Ευχαριστείς για την πρόσκληση", isPolite: true },
          { id: "demand", emoji: "😤", label: "Απαιτείς δώρο", isPolite: false },
          { id: "ignore", emoji: "😐", label: "Δεν λες τίποτα", isPolite: false },
          { id: "complain", emoji: "😒", label: "Παραπονιέσαι για το φαγητό", isPolite: false }
        ]
      },
      {
        id: 7,
        scenario: {
          emoji: "📚👧",
          description: "Ένα παιδί στην τάξη δεν καταλαβαίνει την άσκηση.",
          context: "Στο σχολείο"
        },
        correctAnswer: "help",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "help", emoji: "🤝", label: "Το βοηθάς να καταλάβει", isPolite: true },
          { id: "mock", emoji: "😏", label: "Το κοροϊδεύεις", isPolite: false },
          { id: "ignore", emoji: "🙄", label: "Το αγνοείς", isPolite: false },
          { id: "show", emoji: "😎", label: "Καυχιέσαι ότι εσύ ξέρεις", isPolite: false }
        ]
      },
      {
        id: 8,
        scenario: {
          emoji: "🚌💺",
          description: "Μπαίνεις στο λεωφορείο και βλέπεις έναν ηλικιωμένο όρθιο.",
          context: "Στο λεωφορείο"
        },
        correctAnswer: "seat",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "seat", emoji: "💺", label: "Του δίνεις τη θέση σου", isPolite: true },
          { id: "pretend", emoji: "😴", label: "Κάνεις ότι κοιμάσαι", isPolite: false },
          { id: "ignore", emoji: "📱", label: "Κοιτάς το κινητό και αγνοείς", isPolite: false },
          { id: "stay", emoji: "🪑", label: "Μένεις καθιστός χωρίς να νοιάζεσαι", isPolite: false }
        ]
      },
      {
        id: 9,
        scenario: {
          emoji: "🎮👦",
          description: "Χτύπησες κατά λάθος έναν συμμαθητή σου παίζοντας.",
          context: "Στην παιδική χαρά"
        },
        correctAnswer: "apologize",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "apologize", emoji: "😔", label: "Ζητάς συγγνώμη αμέσως", isPolite: true },
          { id: "laugh", emoji: "😆", label: "Γελάς", isPolite: false },
          { id: "blame", emoji: "🤷", label: "Λες ότι φταίει αυτός", isPolite: false },
          { id: "run", emoji: "🏃", label: "Τρέχεις μακριά", isPolite: false }
        ]
      },
      {
        id: 10,
        scenario: {
          emoji: "🗑️🌳",
          description: "Τελείωσες το χυμό σου και κρατάς το μπουκάλι.",
          context: "Στο πάρκο"
        },
        correctAnswer: "recycle",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "recycle", emoji: "♻️", label: "Το πετάς στον κάδο ανακύκλωσης", isPolite: true },
          { id: "throw", emoji: "🎯", label: "Το πετάς στο γρασίδι", isPolite: false },
          { id: "leave", emoji: "🚪", label: "Το αφήνεις εκεί", isPolite: false },
          { id: "hide", emoji: "🌳", label: "Το κρύβεις πίσω από δέντρο", isPolite: false }
        ]
      }
    ],
    en: [
      {
        id: 1,
        scenario: {
          emoji: "🧒👵",
          description: "You see an old lady trying to carry a heavy bag.",
          context: "At the supermarket"
        },
        correctAnswer: "help",
        question: "What is the right thing to do?",
        options: [
          { id: "help", emoji: "🤝", label: "Help her carry the bag", isPolite: true },
          { id: "ignore", emoji: "🚶", label: "Ignore her and leave", isPolite: false },
          { id: "laugh", emoji: "😆", label: "Laugh at the situation", isPolite: false },
          { id: "watch", emoji: "👀", label: "Just watch her", isPolite: false }
        ]
      },
      {
        id: 2,
        scenario: {
          emoji: "🧸❌",
          description: "Your friend asks for the toy you're playing with.",
          context: "At the playground"
        },
        correctAnswer: "share",
        question: "What is the right thing to do?",
        options: [
          { id: "share", emoji: "🤗", label: "Share and play together", isPolite: true },
          { id: "refuse", emoji: "🙅", label: "Say no and keep it", isPolite: false },
          { id: "throw", emoji: "🎯", label: "Throw it away", isPolite: false },
          { id: "hide", emoji: "🙈", label: "Hide it behind you", isPolite: false }
        ]
      },
      {
        id: 3,
        scenario: {
          emoji: "🚪👨",
          description: "You enter the house and see your dad.",
          context: "At home"
        },
        correctAnswer: "greet",
        question: "What is the right thing to do?",
        options: [
          { id: "greet", emoji: "👋", label: "Greet him and say hello", isPolite: true },
          { id: "silent", emoji: "😶", label: "Don't say anything and go to your room", isPolite: false },
          { id: "yell", emoji: "😤", label: "Yell for him to bring you something", isPolite: false },
          { id: "complain", emoji: "😒", label: "Complain immediately", isPolite: false }
        ]
      },
      {
        id: 4,
        scenario: {
          emoji: "🍽️😋",
          description: "Mom made food you don't really like.",
          context: "At the table"
        },
        correctAnswer: "thankful",
        question: "What is the right thing to do?",
        options: [
          { id: "thankful", emoji: "😊", label: "Thank her and try a little", isPolite: true },
          { id: "refuse", emoji: "😠", label: "Refuse to eat", isPolite: false },
          { id: "complain", emoji: "😣", label: "Complain loudly", isPolite: false },
          { id: "push", emoji: "🙅", label: "Push the plate away", isPolite: false }
        ]
      },
      {
        id: 5,
        scenario: {
          emoji: "💥🏺",
          description: "You accidentally broke mom's vase.",
          context: "At home"
        },
        correctAnswer: "honest",
        question: "What is the right thing to do?",
        options: [
          { id: "honest", emoji: "😔", label: "Tell the truth and apologize", isPolite: true },
          { id: "hide", emoji: "🤐", label: "Hide it and say nothing", isPolite: false },
          { id: "blame", emoji: "👉", label: "Blame someone else", isPolite: false },
          { id: "lie", emoji: "🤥", label: "Tell a lie", isPolite: false }
        ]
      },
      {
        id: 6,
        scenario: {
          emoji: "🎂🎈",
          description: "You were invited to a birthday party.",
          context: "At the party"
        },
        correctAnswer: "thankyou",
        question: "What is the right thing to do?",
        options: [
          { id: "thankyou", emoji: "🙏", label: "Thank them for the invitation", isPolite: true },
          { id: "demand", emoji: "😤", label: "Demand a gift", isPolite: false },
          { id: "ignore", emoji: "😐", label: "Say nothing", isPolite: false },
          { id: "complain", emoji: "😒", label: "Complain about the food", isPolite: false }
        ]
      },
      {
        id: 7,
        scenario: {
          emoji: "📚👧",
          description: "A child in class doesn't understand the exercise.",
          context: "At school"
        },
        correctAnswer: "help",
        question: "What is the right thing to do?",
        options: [
          { id: "help", emoji: "🤝", label: "Help them understand", isPolite: true },
          { id: "mock", emoji: "😏", label: "Make fun of them", isPolite: false },
          { id: "ignore", emoji: "🙄", label: "Ignore them", isPolite: false },
          { id: "show", emoji: "😎", label: "Brag that you know", isPolite: false }
        ]
      },
      {
        id: 8,
        scenario: {
          emoji: "🚌💺",
          description: "You get on the bus and see an elderly person standing.",
          context: "On the bus"
        },
        correctAnswer: "seat",
        question: "What is the right thing to do?",
        options: [
          { id: "seat", emoji: "💺", label: "Give them your seat", isPolite: true },
          { id: "pretend", emoji: "😴", label: "Pretend to sleep", isPolite: false },
          { id: "ignore", emoji: "📱", label: "Look at your phone and ignore", isPolite: false },
          { id: "stay", emoji: "🪑", label: "Stay seated without caring", isPolite: false }
        ]
      },
      {
        id: 9,
        scenario: {
          emoji: "🎮👦",
          description: "You accidentally hit a classmate while playing.",
          context: "At the playground"
        },
        correctAnswer: "apologize",
        question: "What is the right thing to do?",
        options: [
          { id: "apologize", emoji: "😔", label: "Apologize immediately", isPolite: true },
          { id: "laugh", emoji: "😆", label: "Laugh", isPolite: false },
          { id: "blame", emoji: "🤷", label: "Say it's their fault", isPolite: false },
          { id: "run", emoji: "🏃", label: "Run away", isPolite: false }
        ]
      },
      {
        id: 10,
        scenario: {
          emoji: "🗑️🌳",
          description: "You finished your juice and are holding the bottle.",
          context: "At the park"
        },
        correctAnswer: "recycle",
        question: "What is the right thing to do?",
        options: [
          { id: "recycle", emoji: "♻️", label: "Throw it in the recycling bin", isPolite: true },
          { id: "throw", emoji: "🎯", label: "Throw it on the grass", isPolite: false },
          { id: "leave", emoji: "🚪", label: "Leave it there", isPolite: false },
          { id: "hide", emoji: "🌳", label: "Hide it behind a tree", isPolite: false }
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

