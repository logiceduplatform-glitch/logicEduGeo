// src/components/games/exercises_11_12_1/DoTheRightThingGame.jsx
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

  const TARGET_ROUNDS = 12;

  const roundsData = {
    el: [
      {
        id: 1,
        scenario: {
          emoji: "💬📱",
          description: "Βλέπεις συμμαθητή να γίνεται θύμα κυβερνοεκφοβισμού σε ομαδικό chat.",
          context: "Στο internet"
        },
        correctAnswer: "report",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "report", emoji: "🛡️", label: "Το αναφέρεις σε έμπειρο ενήλικα", isPolite: true },
          { id: "ignore", emoji: "🚶", label: "Το αγνοείς", isPolite: false },
          { id: "join", emoji: "😏", label: "Συμμετέχεις στα σχόλια", isPolite: false },
          { id: "laugh", emoji: "😆", label: "Γελάς με το αστείο", isPolite: false }
        ]
      },
      {
        id: 2,
        scenario: {
          emoji: "👛💰",
          description: "Βρίσκεις πορτοφόλι με λεφτά στις εγκαταστάσεις του σχολείου.",
          context: "Στο σχολείο"
        },
        correctAnswer: "return",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "return", emoji: "📤", label: "Το επιστρέφεις στη γραμματεία", isPolite: true },
          { id: "keep", emoji: "🤐", label: "Το κρατάς", isPolite: false },
          { id: "share", emoji: "🤑", label: "Τα μοιράζεσαι με φίλους", isPolite: false },
          { id: "hide", emoji: "🙈", label: "Το κρύβεις", isPolite: false }
        ]
      },
      {
        id: 3,
        scenario: {
          emoji: "⏰🚪",
          description: "Φίλος σε ζητά να πεις ψέματα για να του καλύψεις που κάνει κοπάνα.",
          context: "Στο σχολείο"
        },
        correctAnswer: "refuse",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "refuse", emoji: "🙅", label: "Αρνείσαι ευγενικά και εξηγείς γιατί", isPolite: true },
          { id: "agree", emoji: "😶", label: "Συμφωνείς να τον καλύψεις", isPolite: false },
          { id: "yell", emoji: "😠", label: "Φωνάζεις και τον ρήτρεψεις", isPolite: false },
          { id: "ignore", emoji: "😐", label: "Δεν λες τίποτα", isPolite: false }
        ]
      },
      {
        id: 4,
        scenario: {
          emoji: "📝👀",
          description: "Παρατηρείς συμμαθητή να κάνει αντικαταβολή στην εξέταση.",
          context: "Στην εξέταση"
        },
        correctAnswer: "tell",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "tell", emoji: "👩‍🏫", label: "Ενημερώνεις ήσυχα τον καθηγητή", isPolite: true },
          { id: "ignore", emoji: "🙈", label: "Το αγνοείς", isPolite: false },
          { id: "copy", emoji: "📋", label: "Και εσύ κάνεις το ίδιο", isPolite: false },
          { id: "expose", emoji: "📢", label: "Φωνάζεις μπροστά σε όλους", isPolite: false }
        ]
      },
      {
        id: 5,
        scenario: {
          emoji: "🚬🎉",
          description: "Σε προσφέρει κάποιος τσιγάρο σε πάρτι.",
          context: "Στο πάρτι"
        },
        correctAnswer: "decline",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "decline", emoji: "🙅", label: "Ευγενικά αρνηθείς", isPolite: true },
          { id: "accept", emoji: "😶", label: "Το δέχεσαι", isPolite: false },
          { id: "mock", emoji: "😏", label: "Τους κοροϊδεύεις", isPolite: false },
          { id: "yell", emoji: "😤", label: "Φωνάζεις και φεύγεις θυμωμένος", isPolite: false }
        ]
      },
      {
        id: 6,
        scenario: {
          emoji: "📸🔒",
          description: "Φίλος μοιράζεται ιδιωτική φωτογραφία κάποιου χωρίς τη συγκατάθεσή του.",
          context: "Στο κινητό"
        },
        correctAnswer: "confront",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "confront", emoji: "🛑", label: "Του λες ότι είναι λάθος και να τη διαγράψει", isPolite: true },
          { id: "share", emoji: "📤", label: "Την προωθείς και εσύ", isPolite: false },
          { id: "ignore", emoji: "😐", label: "Δεν κάνεις τίποτα", isPolite: false },
          { id: "laugh", emoji: "😆", label: "Γελάς και την κοιτάς", isPolite: false }
        ]
      },
      {
        id: 7,
        scenario: {
          emoji: "🗑️🌲",
          description: "Βλέπεις κάποιον να πετάει σκουπίδια σε περιοχή φύσης.",
          context: "Στη φύση"
        },
        correctAnswer: "act",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "act", emoji: "♻️", label: "Τα μαζεύεις και του εξηγείς για το περιβάλλον", isPolite: true },
          { id: "ignore", emoji: "🚶", label: "Περπατάς και αγνοείς", isPolite: false },
          { id: "yell", emoji: "😠", label: "Φωνάζεις και τον βρίζεις", isPolite: false },
          { id: "join", emoji: "😏", label: "Και εσύ πετάς σκουπίδια", isPolite: false }
        ]
      },
      {
        id: 8,
        scenario: {
          emoji: "👋😔",
          description: "Ομάδα φίλων αποκλείει νέο μαθητή από την παρέα τους.",
          context: "Στην αυλή"
        },
        correctAnswer: "include",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "include", emoji: "🤝", label: "Καλείς τον νέο μαθητή να έρθει στην παρέα σου", isPolite: true },
          { id: "ignore", emoji: "😐", label: "Τον αγνοείς και συνεχίζεις", isPolite: false },
          { id: "mock", emoji: "😏", label: "Τον κοροϊδεύεις μαζί με τους άλλους", isPolite: false },
          { id: "watch", emoji: "👀", label: "Απλά παρακολουθείς", isPolite: false }
        ]
      },
      {
        id: 9,
        scenario: {
          emoji: "🛒💰",
          description: "Κατά λάθος σου έδωσαν παραπάνω ρέστα από μαγαζί.",
          context: "Στο μαγαζί"
        },
        correctAnswer: "return",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "return", emoji: "💵", label: "Επιστρέφεις τα έξτρα λεφτά", isPolite: true },
          { id: "keep", emoji: "🤫", label: "Τα κρατάς", isPolite: false },
          { id: "spend", emoji: "🛍️", label: "Τα ξοδεύεις αμέσως", isPolite: false },
          { id: "hide", emoji: "🙈", label: "Κάνεις ότι δεν κατάλαβες", isPolite: false }
        ]
      },
      {
        id: 10,
        scenario: {
          emoji: "🏠🤥",
          description: "Φίλος σε ζητά να πεις ψέματα στους γονείς του.",
          context: "Στο σπίτι φίλου"
        },
        correctAnswer: "honest",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "honest", emoji: "💬", label: "Του προτείνεις να πει την αλήθεια ο ίδιος", isPolite: true },
          { id: "lie", emoji: "😶", label: "Λες το ψέμα που ζητάει", isPolite: false },
          { id: "yell", emoji: "😤", label: "Φωνάζεις και φεύγεις", isPolite: false },
          { id: "ignore", emoji: "🙄", label: "Αλλάζεις θέμα", isPolite: false }
        ]
      },
      {
        id: 11,
        scenario: {
          emoji: "😤😬",
          description: "Κάποιος λέει ρατσιστικό αστείο στην παρέα σου.",
          context: "Στην παρέα"
        },
        correctAnswer: "speak",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "speak", emoji: "🗣️", label: "Μιλάς ότι δεν είναι αποδεκτό", isPolite: true },
          { id: "laugh", emoji: "😶", label: "Γελάς μαζί τους", isPolite: false },
          { id: "ignore", emoji: "🙄", label: "Δεν λες τίποτα", isPolite: false },
          { id: "repeat", emoji: "📢", label: "Το επαναλαμβάνεις σε άλλους", isPolite: false }
        ]
      },
      {
        id: 12,
        scenario: {
          emoji: "📋🔑",
          description: "Βρίσκεις τις απαντήσεις για το διαγώνισμα της αύριο.",
          context: "Στο σχολείο"
        },
        correctAnswer: "ignore",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "ignore", emoji: "📚", label: "Δεν τις χρησιμοποιείς και μελετάς κανονικά", isPolite: true },
          { id: "use", emoji: "📋", label: "Τις χρησιμοποιείς", isPolite: false },
          { id: "share", emoji: "📤", label: "Τις μοιράζεσαι με φίλους", isPolite: false },
          { id: "sell", emoji: "💰", label: "Τις πουλάς", isPolite: false }
        ]
      }
    ],
    en: [
      {
        id: 1,
        scenario: {
          emoji: "💬📱",
          description: "You see a classmate being cyberbullied in a group chat.",
          context: "Online"
        },
        correctAnswer: "report",
        question: "What is the right thing to do?",
        options: [
          { id: "report", emoji: "🛡️", label: "Report it to a trusted adult", isPolite: true },
          { id: "ignore", emoji: "🚶", label: "Ignore it", isPolite: false },
          { id: "join", emoji: "😏", label: "Join in the comments", isPolite: false },
          { id: "laugh", emoji: "😆", label: "Laugh at the joke", isPolite: false }
        ]
      },
      {
        id: 2,
        scenario: {
          emoji: "👛💰",
          description: "You find a wallet with money on the school grounds.",
          context: "At school"
        },
        correctAnswer: "return",
        question: "What is the right thing to do?",
        options: [
          { id: "return", emoji: "📤", label: "Return it to the office", isPolite: true },
          { id: "keep", emoji: "🤐", label: "Keep it", isPolite: false },
          { id: "share", emoji: "🤑", label: "Share it with friends", isPolite: false },
          { id: "hide", emoji: "🙈", label: "Hide it", isPolite: false }
        ]
      },
      {
        id: 3,
        scenario: {
          emoji: "⏰🚪",
          description: "A friend asks you to cover for them while they skip class.",
          context: "At school"
        },
        correctAnswer: "refuse",
        question: "What is the right thing to do?",
        options: [
          { id: "refuse", emoji: "🙅", label: "Refuse politely and explain why", isPolite: true },
          { id: "agree", emoji: "😶", label: "Agree to cover for them", isPolite: false },
          { id: "yell", emoji: "😠", label: "Yell at them and reject them", isPolite: false },
          { id: "ignore", emoji: "😐", label: "Say nothing", isPolite: false }
        ]
      },
      {
        id: 4,
        scenario: {
          emoji: "📝👀",
          description: "You notice a classmate cheating on an exam.",
          context: "During the exam"
        },
        correctAnswer: "tell",
        question: "What is the right thing to do?",
        options: [
          { id: "tell", emoji: "👩‍🏫", label: "Quietly inform the teacher", isPolite: true },
          { id: "ignore", emoji: "🙈", label: "Ignore it", isPolite: false },
          { id: "copy", emoji: "📋", label: "Copy them", isPolite: false },
          { id: "expose", emoji: "📢", label: "Shout it out to everyone", isPolite: false }
        ]
      },
      {
        id: 5,
        scenario: {
          emoji: "🚬🎉",
          description: "Someone offers you a cigarette at a party.",
          context: "At the party"
        },
        correctAnswer: "decline",
        question: "What is the right thing to do?",
        options: [
          { id: "decline", emoji: "🙅", label: "Politely say no", isPolite: true },
          { id: "accept", emoji: "😶", label: "Accept it", isPolite: false },
          { id: "mock", emoji: "😏", label: "Make fun of them", isPolite: false },
          { id: "yell", emoji: "😤", label: "Yell and walk away angrily", isPolite: false }
        ]
      },
      {
        id: 6,
        scenario: {
          emoji: "📸🔒",
          description: "A friend shares someone's private photo without consent.",
          context: "On the phone"
        },
        correctAnswer: "confront",
        question: "What is the right thing to do?",
        options: [
          { id: "confront", emoji: "🛑", label: "Tell them it's wrong and to delete it", isPolite: true },
          { id: "share", emoji: "📤", label: "Forward it yourself", isPolite: false },
          { id: "ignore", emoji: "😐", label: "Do nothing", isPolite: false },
          { id: "laugh", emoji: "😆", label: "Laugh and look at it", isPolite: false }
        ]
      },
      {
        id: 7,
        scenario: {
          emoji: "🗑️🌲",
          description: "You see someone littering in a nature area.",
          context: "In nature"
        },
        correctAnswer: "act",
        question: "What is the right thing to do?",
        options: [
          { id: "act", emoji: "♻️", label: "Pick it up and tell them about the environment", isPolite: true },
          { id: "ignore", emoji: "🚶", label: "Walk by and ignore", isPolite: false },
          { id: "yell", emoji: "😠", label: "Yell and curse at them", isPolite: false },
          { id: "join", emoji: "😏", label: "Litter yourself too", isPolite: false }
        ]
      },
      {
        id: 8,
        scenario: {
          emoji: "👋😔",
          description: "A group of friends is excluding a new student.",
          context: "In the yard"
        },
        correctAnswer: "include",
        question: "What is the right thing to do?",
        options: [
          { id: "include", emoji: "🤝", label: "Invite the new student to join", isPolite: true },
          { id: "ignore", emoji: "😐", label: "Ignore them and move on", isPolite: false },
          { id: "mock", emoji: "😏", label: "Make fun of them with the others", isPolite: false },
          { id: "watch", emoji: "👀", label: "Just watch", isPolite: false }
        ]
      },
      {
        id: 9,
        scenario: {
          emoji: "🛒💰",
          description: "You accidentally receive extra change from a shop.",
          context: "At the shop"
        },
        correctAnswer: "return",
        question: "What is the right thing to do?",
        options: [
          { id: "return", emoji: "💵", label: "Give back the extra money", isPolite: true },
          { id: "keep", emoji: "🤫", label: "Keep it", isPolite: false },
          { id: "spend", emoji: "🛍️", label: "Spend it right away", isPolite: false },
          { id: "hide", emoji: "🙈", label: "Pretend you didn't notice", isPolite: false }
        ]
      },
      {
        id: 10,
        scenario: {
          emoji: "🏠🤥",
          description: "A friend asks you to lie to their parents.",
          context: "At friend's house"
        },
        correctAnswer: "honest",
        question: "What is the right thing to do?",
        options: [
          { id: "honest", emoji: "💬", label: "Suggest they tell the truth themselves", isPolite: true },
          { id: "lie", emoji: "😶", label: "Tell the lie they asked for", isPolite: false },
          { id: "yell", emoji: "😤", label: "Yell and leave", isPolite: false },
          { id: "ignore", emoji: "🙄", label: "Change the subject", isPolite: false }
        ]
      },
      {
        id: 11,
        scenario: {
          emoji: "😤😬",
          description: "Someone makes a racist joke in your friend group.",
          context: "With friends"
        },
        correctAnswer: "speak",
        question: "What is the right thing to do?",
        options: [
          { id: "speak", emoji: "🗣️", label: "Speak up that it's not acceptable", isPolite: true },
          { id: "laugh", emoji: "😶", label: "Laugh along", isPolite: false },
          { id: "ignore", emoji: "🙄", label: "Say nothing", isPolite: false },
          { id: "repeat", emoji: "📢", label: "Repeat it to others", isPolite: false }
        ]
      },
      {
        id: 12,
        scenario: {
          emoji: "📋🔑",
          description: "You find an answer key for tomorrow's test.",
          context: "At school"
        },
        correctAnswer: "ignore",
        question: "What is the right thing to do?",
        options: [
          { id: "ignore", emoji: "📚", label: "Don't use it and study properly", isPolite: true },
          { id: "use", emoji: "📋", label: "Use it", isPolite: false },
          { id: "share", emoji: "📤", label: "Share it with friends", isPolite: false },
          { id: "sell", emoji: "💰", label: "Sell it", isPolite: false }
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
