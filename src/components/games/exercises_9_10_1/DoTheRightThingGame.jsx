// src/components/games/exercises_9_10_1/DoTheRightThingGame.jsx
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
      { id: 1, scenario: { emoji: "💻📱", description: "Ένας συμμαθητής γίνεται cyberbullied σε ένα chat.", context: "Online" }, correctAnswer: "report", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "report", emoji: "📢", label: "Το αναφέρεις και υποστηρίζεις το θύμα", isPolite: true }, { id: "ignore", emoji: "😶", label: "Το αγνοείς", isPolite: false }, { id: "laugh", emoji: "😆", label: "Γελάς μαζί τους", isPolite: false }, { id: "share", emoji: "📤", label: "Το κοινοποιείς", isPolite: false }] },
      { id: 2, scenario: { emoji: "📝👀", description: "Κατά λάθος βλέπεις τις απαντήσεις του τεστ στο γραμμείο της δασκάλας.", context: "Στην τάξη" }, correctAnswer: "lookaway", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "lookaway", emoji: "👀❌", label: "Ξανακοιτάς και δεν τις χρησιμοποιείς", isPolite: true }, { id: "cheat", emoji: "📋", label: "Τις γράφεις και τις χρησιμοποιείς", isPolite: false }, { id: "tell", emoji: "📢", label: "Πες στους άλλους", isPolite: false }, { id: "copy", emoji: "📝", label: "Τις φωτογραφίζεις", isPolite: false }] },
      { id: 3, scenario: { emoji: "🏃⚽", description: "Ένα μέλος της ομάδας έκανε λάθος που κόστισε το παιχνίδι.", context: "Στο γήπεδο" }, correctAnswer: "encourage", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "encourage", emoji: "🤝", label: "Τον ενθαρρύνεις αντί να τον κατηγορείς", isPolite: true }, { id: "blame", emoji: "😠", label: "Τον κατηγορείς", isPolite: false }, { id: "ignore", emoji: "🙄", label: "Τον αγνοείς", isPolite: false }, { id: "mock", emoji: "😏", label: "Τον κοροϊδεύεις", isPolite: false }] },
      { id: 4, scenario: { emoji: "🎒💰", description: "Βρίσκεις λεφτά που έπεσαν από την τσάντα συμμαθητή.", context: "Στην τάξη" }, correctAnswer: "return", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "return", emoji: "🤲", label: "Τα επιστρέφεις σε εκείνον", isPolite: true }, { id: "keep", emoji: "💰", label: "Τα κρατάς", isPolite: false }, { id: "share", emoji: "🍬", label: "Τα μοιράζεσαι με φίλους", isPolite: false }, { id: "hide", emoji: "🙈", label: "Τα κρύβεις", isPolite: false }] },
      { id: 5, scenario: { emoji: "👫🚬", description: "Μεγαλύτερο παιδί σου προτείνει να δοκιμάσεις κάτι απαγορευμένο.", context: "Στο πάρκο" }, correctAnswer: "refuse", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "refuse", emoji: "🙅", label: "Λες σταθερά όχι", isPolite: true }, { id: "try", emoji: "🤷", label: "Δοκιμάζεις", isPolite: false }, { id: "maybe", emoji: "😐", label: "Λες «ίσως»", isPolite: false }, { id: "follow", emoji: "👣", label: "Ακολουθείς", isPolite: false }] },
      { id: 6, scenario: { emoji: "📱🤳", description: "Ένας φίλος σου στέλνει ιδιωτική φωτογραφία άλλου μαθητή.", context: "Στο κινητό" }, correctAnswer: "delete", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "delete", emoji: "🗑️", label: "Την διαγράφεις και του λες ότι είναι λάθος", isPolite: true }, { id: "forward", emoji: "📤", label: "Την προωθείς", isPolite: false }, { id: "keep", emoji: "📱", label: "Την κρατάς", isPolite: false }, { id: "share", emoji: "👥", label: "Τη δείχνεις σε άλλους", isPolite: false }] },
      { id: 7, scenario: { emoji: "🌳🏗️", description: "Βλέπεις κάποιον να βανδαλίζει σχολική περιουσία.", context: "Στο σχολείο" }, correctAnswer: "report", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "report", emoji: "📢", label: "Το αναφέρεις σε δάσκαλο", isPolite: true }, { id: "join", emoji: "✍️", label: "Βοηθάς", isPolite: false }, { id: "ignore", emoji: "🚶", label: "Περπατάς παραπέρα", isPolite: false }, { id: "film", emoji: "📹", label: "Την τραβάς βίντεο χωρίς να πεις", isPolite: false }] },
      { id: 8, scenario: { emoji: "👫💔", description: "Δύο φίλοι τσακώνονται και και οι δύο θέλουν την πλευρά σου.", context: "Στην αυλή" }, correctAnswer: "neutral", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "neutral", emoji: "⚖️", label: "Μένεις ουδέτερος και βοηθάς να συμβιβαστούν", isPolite: true }, { id: "pick", emoji: "👆", label: "Επιλέγεις μία πλευρά", isPolite: false }, { id: "leave", emoji: "🏃", label: "Φεύγεις", isPolite: false }, { id: "gossip", emoji: "🗣️", label: "Το λες σε άλλους", isPolite: false }] },
      { id: 9, scenario: { emoji: "📊📉", description: "Ξέρεις ότι ένας φίλος είπε ψέμα στους γονείς για τον βαθμό του.", context: "Στο σπίτι φίλου" }, correctAnswer: "honest", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "honest", emoji: "💬", label: "Τον ενθαρρύνεις με ευγένεια να πει την αλήθεια", isPolite: true }, { id: "expose", emoji: "📢", label: "Τον μαρτυράς", isPolite: false }, { id: "ignore", emoji: "😶", label: "Δεν λες τίποτα", isPolite: false }, { id: "lie", emoji: "🤥", label: "Λες και εσύ ψέματα", isPolite: false }] },
      { id: 10, scenario: { emoji: "🎮⏰", description: "Υποσχέθηκες να βοηθήσεις σε project αλλά θέλεις να παίξεις παιχνίδια.", context: "Στο σπίτι" }, correctAnswer: "promise", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "promise", emoji: "🤝", label: "Κρατάς την υπόσχεσή σου", isPolite: true }, { id: "play", emoji: "🎮", label: "Παίζεις παιχνίδια", isPolite: false }, { id: "cancel", emoji: "❌", label: "Ακυρώνεις τελευταία στιγμή", isPolite: false }, { id: "delay", emoji: "⏰", label: "Τελειώνεις σε άλλη μέρα χωρίς να πεις", isPolite: false }] },
      { id: 11, scenario: { emoji: "🧪🏫", description: "Ο συνεργάτης σου έκανε όλη τη δουλειά αλλά θα πάρουν και οι δύο βαθμό.", context: "Στο εργαστήριο" }, correctAnswer: "acknowledge", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "acknowledge", emoji: "🙏", label: "Αναγνωρίζεις τη συνεισφορά του", isPolite: true }, { id: "claim", emoji: "😎", label: "Παρουσιάζεσαι ότι έκανες και εσύ πολύ", isPolite: false }, { id: "silent", emoji: "🤐", label: "Δεν λες τίποτα", isPolite: false }, { id: "downplay", emoji: "🙄", label: "Λες ότι ήταν εύκολο", isPolite: false }] },
      { id: 12, scenario: { emoji: "👫😢", description: "Κάποιος διαδίδει φήμες για συμμαθητή.", context: "Στο σχολείο" }, correctAnswer: "defend", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "defend", emoji: "🛡️", label: "Αρνείσαι να συμμετέχεις και τον υπερασπίζεσαι", isPolite: true }, { id: "spread", emoji: "🗣️", label: "Προωθείς τις φήμες", isPolite: false }, { id: "listen", emoji: "👂", label: "Απλά ακούς", isPolite: false }, { id: "laugh", emoji: "😆", label: "Γελάς", isPolite: false }] },
      { id: 13, scenario: { emoji: "📱🎵", description: "Κατέβασες παράνομα μουσική όπως κάνουν και οι φίλοι σου.", context: "Online" }, correctAnswer: "legal", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "legal", emoji: "♻️", label: "Τη διαγράφεις και χρησιμοποιείς νόμιμες εναλλακτικές", isPolite: true }, { id: "keep", emoji: "🎵", label: "Την κρατάς", isPolite: false }, { id: "share", emoji: "📤", label: "Τη μοιράζεσαι με φίλους", isPolite: false }, { id: "ignore", emoji: "🤷", label: "Δεν κάνεις τίποτα", isPolite: false }] },
      { id: 14, scenario: { emoji: "🏆🤝", description: "Κέρδισες αλλά ο αντίπαλος λέει ότι υπήρξε φάουλ.", context: "Στον αγώνα" }, correctAnswer: "rematch", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "rematch", emoji: "🤝", label: "Δέχεσαι επανάληψη αγώνα δίκαια", isPolite: true }, { id: "argue", emoji: "😤", label: "Τσακώνεσαι", isPolite: false }, { id: "mock", emoji: "😏", label: "Τον κοροϊδεύεις", isPolite: false }, { id: "leave", emoji: "🚪", label: "Φεύγεις θυμωμένος", isPolite: false }] },
      { id: 15, scenario: { emoji: "🌍♻️", description: "Η οικογένειά σου δεν ανακυκλώνει αλλά έμαθες ότι είναι σημαντικό.", context: "Στο σπίτι" }, correctAnswer: "suggest", question: "Τι είναι το σωστό να κάνεις;", options: [{ id: "suggest", emoji: "💡", label: "Προτείνεις ευγενικά να αρχίσουν ανακύκλωση", isPolite: true }, { id: "demand", emoji: "😠", label: "Απαιτείς απότομα", isPolite: false }, { id: "nothing", emoji: "😶", label: "Δεν λες τίποτα", isPolite: false }, { id: "complain", emoji: "😒", label: "Παραπονιέσαι συνεχώς", isPolite: false }] }
    ],
    en: [
      { id: 1, scenario: { emoji: "💻📱", description: "A classmate is being cyberbullied in a chat.", context: "Online" }, correctAnswer: "report", question: "What is the right thing to do?", options: [{ id: "report", emoji: "📢", label: "Report it and support the victim", isPolite: true }, { id: "ignore", emoji: "😶", label: "Ignore it", isPolite: false }, { id: "laugh", emoji: "😆", label: "Laugh along", isPolite: false }, { id: "share", emoji: "📤", label: "Share it", isPolite: false }] },
      { id: 2, scenario: { emoji: "📝👀", description: "You accidentally see the test answers on the teacher's desk.", context: "In the classroom" }, correctAnswer: "lookaway", question: "What is the right thing to do?", options: [{ id: "lookaway", emoji: "👀❌", label: "Look away and not use them", isPolite: true }, { id: "cheat", emoji: "📋", label: "Write them down and use them", isPolite: false }, { id: "tell", emoji: "📢", label: "Tell others", isPolite: false }, { id: "copy", emoji: "📝", label: "Take a photo", isPolite: false }] },
      { id: 3, scenario: { emoji: "🏃⚽", description: "A teammate made a mistake that cost the game.", context: "On the field" }, correctAnswer: "encourage", question: "What is the right thing to do?", options: [{ id: "encourage", emoji: "🤝", label: "Encourage them instead of blaming", isPolite: true }, { id: "blame", emoji: "😠", label: "Blame them", isPolite: false }, { id: "ignore", emoji: "🙄", label: "Ignore them", isPolite: false }, { id: "mock", emoji: "😏", label: "Make fun of them", isPolite: false }] },
      { id: 4, scenario: { emoji: "🎒💰", description: "You find money that fell from a classmate's bag.", context: "In the classroom" }, correctAnswer: "return", question: "What is the right thing to do?", options: [{ id: "return", emoji: "🤲", label: "Return it to them", isPolite: true }, { id: "keep", emoji: "💰", label: "Keep it", isPolite: false }, { id: "share", emoji: "🍬", label: "Share with friends", isPolite: false }, { id: "hide", emoji: "🙈", label: "Hide it", isPolite: false }] },
      { id: 5, scenario: { emoji: "👫🚬", description: "An older kid offers you to try something forbidden.", context: "At the park" }, correctAnswer: "refuse", question: "What is the right thing to do?", options: [{ id: "refuse", emoji: "🙅", label: "Firmly say no", isPolite: true }, { id: "try", emoji: "🤷", label: "Try it", isPolite: false }, { id: "maybe", emoji: "😐", label: "Say maybe", isPolite: false }, { id: "follow", emoji: "👣", label: "Go along", isPolite: false }] },
      { id: 6, scenario: { emoji: "📱🤳", description: "A friend sends you a private photo of another student.", context: "On the phone" }, correctAnswer: "delete", question: "What is the right thing to do?", options: [{ id: "delete", emoji: "🗑️", label: "Delete it and tell them it's wrong", isPolite: true }, { id: "forward", emoji: "📤", label: "Forward it", isPolite: false }, { id: "keep", emoji: "📱", label: "Keep it", isPolite: false }, { id: "share", emoji: "👥", label: "Show others", isPolite: false }] },
      { id: 7, scenario: { emoji: "🌳🏗️", description: "You see someone vandalizing school property.", context: "At school" }, correctAnswer: "report", question: "What is the right thing to do?", options: [{ id: "report", emoji: "📢", label: "Report it to a teacher", isPolite: true }, { id: "join", emoji: "✍️", label: "Join in", isPolite: false }, { id: "ignore", emoji: "🚶", label: "Walk away", isPolite: false }, { id: "film", emoji: "📹", label: "Film it without telling", isPolite: false }] },
      { id: 8, scenario: { emoji: "👫💔", description: "Two friends are fighting and both want you on their side.", context: "In the yard" }, correctAnswer: "neutral", question: "What is the right thing to do?", options: [{ id: "neutral", emoji: "⚖️", label: "Stay neutral and help them reconcile", isPolite: true }, { id: "pick", emoji: "👆", label: "Pick a side", isPolite: false }, { id: "leave", emoji: "🏃", label: "Leave", isPolite: false }, { id: "gossip", emoji: "🗣️", label: "Tell others", isPolite: false }] },
      { id: 9, scenario: { emoji: "📊📉", description: "You know a friend lied about their grade to parents.", context: "At friend's house" }, correctAnswer: "honest", question: "What is the right thing to do?", options: [{ id: "honest", emoji: "💬", label: "Gently encourage them to be honest", isPolite: true }, { id: "expose", emoji: "📢", label: "Tell their parents", isPolite: false }, { id: "ignore", emoji: "😶", label: "Say nothing", isPolite: false }, { id: "lie", emoji: "🤥", label: "Lie too", isPolite: false }] },
      { id: 10, scenario: { emoji: "🎮⏰", description: "You promised to help with a project but want to play games.", context: "At home" }, correctAnswer: "promise", question: "What is the right thing to do?", options: [{ id: "promise", emoji: "🤝", label: "Keep your promise", isPolite: true }, { id: "play", emoji: "🎮", label: "Play games", isPolite: false }, { id: "cancel", emoji: "❌", label: "Cancel last minute", isPolite: false }, { id: "delay", emoji: "⏰", label: "Do it another day without telling", isPolite: false }] },
      { id: 11, scenario: { emoji: "🧪🏫", description: "Your lab partner did all the work but you'll both get credit.", context: "In the lab" }, correctAnswer: "acknowledge", question: "What is the right thing to do?", options: [{ id: "acknowledge", emoji: "🙏", label: "Acknowledge their contribution", isPolite: true }, { id: "claim", emoji: "😎", label: "Act like you did a lot too", isPolite: false }, { id: "silent", emoji: "🤐", label: "Say nothing", isPolite: false }, { id: "downplay", emoji: "🙄", label: "Say it was easy", isPolite: false }] },
      { id: 12, scenario: { emoji: "👫😢", description: "Someone is spreading rumors about a classmate.", context: "At school" }, correctAnswer: "defend", question: "What is the right thing to do?", options: [{ id: "defend", emoji: "🛡️", label: "Refuse to participate and defend them", isPolite: true }, { id: "spread", emoji: "🗣️", label: "Spread the rumors", isPolite: false }, { id: "listen", emoji: "👂", label: "Just listen", isPolite: false }, { id: "laugh", emoji: "😆", label: "Laugh", isPolite: false }] },
      { id: 13, scenario: { emoji: "📱🎵", description: "You downloaded music illegally like your friends do.", context: "Online" }, correctAnswer: "legal", question: "What is the right thing to do?", options: [{ id: "legal", emoji: "♻️", label: "Delete it and use legal alternatives", isPolite: true }, { id: "keep", emoji: "🎵", label: "Keep it", isPolite: false }, { id: "share", emoji: "📤", label: "Share with friends", isPolite: false }, { id: "ignore", emoji: "🤷", label: "Do nothing", isPolite: false }] },
      { id: 14, scenario: { emoji: "🏆🤝", description: "You won but your opponent claims foul play.", context: "At the match" }, correctAnswer: "rematch", question: "What is the right thing to do?", options: [{ id: "rematch", emoji: "🤝", label: "Accept a rematch fairly", isPolite: true }, { id: "argue", emoji: "😤", label: "Argue", isPolite: false }, { id: "mock", emoji: "😏", label: "Mock them", isPolite: false }, { id: "leave", emoji: "🚪", label: "Storm off", isPolite: false }] },
      { id: 15, scenario: { emoji: "🌍♻️", description: "Your family doesn't recycle but you learned it's important.", context: "At home" }, correctAnswer: "suggest", question: "What is the right thing to do?", options: [{ id: "suggest", emoji: "💡", label: "Politely suggest starting to recycle", isPolite: true }, { id: "demand", emoji: "😠", label: "Demand harshly", isPolite: false }, { id: "nothing", emoji: "😶", label: "Say nothing", isPolite: false }, { id: "complain", emoji: "😒", label: "Complain constantly", isPolite: false }] }
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
