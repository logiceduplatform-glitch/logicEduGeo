// src/components/games/exercises_6_1/WhoWaitsInLineGame.jsx - Age 6 (first grade) override
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";

export default function WhoWaitsInLineGame({ lang = "el", difficulty = 3, onComplete }) {
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
      { id: 1, scenario: { description: "Παιδιά περιμένουν να χρησιμοποιήσουν τον υπολογιστή.", context: "Στο εργαστήριο" }, correctAnswer: "child2", question: "Ποιο παιδί περιμένει υπομονετικά;", children: [{ id: "child1", emoji: "😤", behavior: "Σπρώχνει τα άλλα παιδιά", isPatient: false }, { id: "child2", emoji: "😊", behavior: "Στέκεται ήρεμα στη σειρά", isPatient: true }, { id: "child3", emoji: "😠", behavior: "Φωνάζει 'Εγώ πρώτα!'", isPatient: false }, { id: "child4", emoji: "🏃", behavior: "Προσπαθεί να περάσει μπροστά", isPatient: false }] },
      { id: 2, scenario: { description: "Παιδιά περιμένουν τη σειρά τους να διαβάσουν δυνατά.", context: "Στην τάξη" }, correctAnswer: "child3", question: "Ποιο παιδί περιμένει υπομονετικά;", children: [{ id: "child1", emoji: "😤", behavior: "Χτυπάει το θρανίο", isPatient: false }, { id: "child2", emoji: "😡", behavior: "Λέει 'Πότε θα έρθει η σειρά μου;'", isPatient: false }, { id: "child3", emoji: "😌", behavior: "Κάθεται και περιμένει", isPatient: true }, { id: "child4", emoji: "😒", behavior: "Κλαίει και παραπονιέται", isPatient: false }] },
      { id: 3, scenario: { description: "Παιδιά περιμένουν για υλικά τέχνης.", context: "Στην τάξη τέχνης" }, correctAnswer: "child1", question: "Ποιο παιδί περιμένει υπομονετικά;", children: [{ id: "child1", emoji: "😊", behavior: "Στέκεται ήσυχα στη σειρά", isPatient: true }, { id: "child2", emoji: "😤", behavior: "Σπρώχνει για να πάει μπροστά", isPatient: false }, { id: "child3", emoji: "😫", behavior: "Φωνάζει 'Θέλω τώρα!'", isPatient: false }, { id: "child4", emoji: "🙄", behavior: "Αρπάζει τα υλικά", isPatient: false }] },
      { id: 4, scenario: { description: "Παιδιά περιμένουν να παίξουν στις κούνιες στο διάλειμμα.", context: "Στην αυλή" }, correctAnswer: "child4", question: "Ποιο παιδί περιμένει υπομονετικά;", children: [{ id: "child1", emoji: "😠", behavior: "Τραβάει το παιδί από την κούνια", isPatient: false }, { id: "child2", emoji: "😤", behavior: "Λέει 'Είναι η σειρά μου!'", isPatient: false }, { id: "child3", emoji: "😒", behavior: "Παραπονιέται δυνατά", isPatient: false }, { id: "child4", emoji: "😌", behavior: "Περιμένει ήρεμα τη σειρά του", isPatient: true }] },
      { id: 5, scenario: { description: "Παιδιά περιμένουν να δανειστούν βιβλίο.", context: "Στη βιβλιοθήκη" }, correctAnswer: "child2", question: "Ποιο παιδί περιμένει υπομονετικά;", children: [{ id: "child1", emoji: "🏃", behavior: "Τρέχει να προλάβει", isPatient: false }, { id: "child2", emoji: "😊", behavior: "Στέκεται στη θέση του", isPatient: true }, { id: "child3", emoji: "😫", behavior: "Περιφέρεται ανήσυχα", isPatient: false }, { id: "child4", emoji: "😤", behavior: "Σπρώχνει την πόρτα", isPatient: false }] },
      { id: 6, scenario: { description: "Παιδιά περιμένουν στη γραμμή για το σχολικό λεωφορείο.", context: "Στο λεωφορείο" }, correctAnswer: "child3", question: "Ποιο παιδί περιμένει υπομονετικά;", children: [{ id: "child1", emoji: "😠", behavior: "Φωνάζει 'Γρήγορα!'", isPatient: false }, { id: "child2", emoji: "😤", behavior: "Προσπαθεί να περάσει μπροστά", isPatient: false }, { id: "child3", emoji: "😌", behavior: "Περιμένει με υπομονή", isPatient: true }, { id: "child4", emoji: "😒", behavior: "Κλαίει για την αναμονή", isPatient: false }] },
      { id: 7, scenario: { description: "Παιδιά περιμένουν να δείξουν το project τους στη δασκάλα.", context: "Στην τάξη" }, correctAnswer: "child1", question: "Ποιο παιδί περιμένει υπομονετικά;", children: [{ id: "child1", emoji: "😊", behavior: "Περιμένει τη σειρά του", isPatient: true }, { id: "child2", emoji: "😤", behavior: "Σπρώχνει για να περάσει πρώτος", isPatient: false }, { id: "child3", emoji: "😠", behavior: "Φωνάζει στον δάσκαλο", isPatient: false }, { id: "child4", emoji: "🏃", behavior: "Τρέχει να προλάβει", isPatient: false }] },
      { id: 8, scenario: { description: "Παιδιά περιμένουν τη σειρά τους σε παιχνίδι επιτραπέζιο.", context: "Στο σχολείο" }, correctAnswer: "child4", question: "Ποιο παιδί περιμένει υπομονετικά;", children: [{ id: "child1", emoji: "😤", behavior: "Αρπάζει τα πιόνια", isPatient: false }, { id: "child2", emoji: "😠", behavior: "Λέει 'Είναι δική μου η σειρά!'", isPatient: false }, { id: "child3", emoji: "😒", behavior: "Παραπονιέται στη δασκάλα", isPatient: false }, { id: "child4", emoji: "😌", behavior: "Περιμένει υπομονετικά", isPatient: true }] },
      { id: 9, scenario: { description: "Παιδιά περιμένουν για το νεροβρύσι.", context: "Στο διάδρομο" }, correctAnswer: "child2", question: "Ποιο παιδί περιμένει υπομονετικά;", children: [{ id: "child1", emoji: "😤", behavior: "Σπρώχνει τα άλλα παιδιά", isPatient: false }, { id: "child2", emoji: "😊", behavior: "Στέκεται ήρεμα στη σειρά", isPatient: true }, { id: "child3", emoji: "😫", behavior: "Φωνάζει 'Διψάω!'", isPatient: false }, { id: "child4", emoji: "😠", behavior: "Τραβάει τα άλλα παιδιά", isPatient: false }] },
      { id: 10, scenario: { description: "Παιδιά περιμένουν να ανέβουν στο λεωφορείο της εκδρομής.", context: "Στην εκδρομή" }, correctAnswer: "child3", question: "Ποιο παιδί περιμένει υπομονετικά;", children: [{ id: "child1", emoji: "😤", behavior: "Τρέχει προς την πόρτα", isPatient: false }, { id: "child2", emoji: "😡", behavior: "Φωνάζει 'Θέλω να μπω!'", isPatient: false }, { id: "child3", emoji: "😌", behavior: "Περιμένει με υπομονή", isPatient: true }, { id: "child4", emoji: "🙄", behavior: "Παραπονιέται δυνατά", isPatient: false }] },
      { id: 11, scenario: { description: "Παιδιά περιμένουν να πάρουν το σχολικό τους μεσημεριανό.", context: "Στην καντίνα" }, correctAnswer: "child1", question: "Ποιο παιδί περιμένει υπομονετικά;", children: [{ id: "child1", emoji: "😊", behavior: "Στέκεται ήσυχα στη σειρά", isPatient: true }, { id: "child2", emoji: "😤", behavior: "Σπρώχνει για να πάει μπροστά", isPatient: false }, { id: "child3", emoji: "😫", behavior: "Φωνάζει 'Πεινάω πολύ!'", isPatient: false }, { id: "child4", emoji: "😒", behavior: "Κάνει ότι δεν υπάρχει σειρά", isPatient: false }] },
      { id: 12, scenario: { description: "Παιδιά περιμένουν να παρουσιάσουν την εργασία τους.", context: "Στην τάξη" }, correctAnswer: "child4", question: "Ποιο παιδί περιμένει υπομονετικά;", children: [{ id: "child1", emoji: "😠", behavior: "Σπρώχνει τα άλλα", isPatient: false }, { id: "child2", emoji: "😤", behavior: "Λέει 'Εγώ πρώτα!'", isPatient: false }, { id: "child3", emoji: "😒", behavior: "Παραπονιέται για την αργοπορία", isPatient: false }, { id: "child4", emoji: "😌", behavior: "Περιμένει ήρεμα τη σειρά του", isPatient: true }] },
      { id: 13, scenario: { description: "Παιδιά περιμένουν το σχολικό κουδούνι.", context: "Στην τάξη" }, correctAnswer: "child2", question: "Ποιο παιδί περιμένει υπομονετικά;", children: [{ id: "child1", emoji: "🏃", behavior: "Τρέχει προς την πόρτα", isPatient: false }, { id: "child2", emoji: "😊", behavior: "Κάθεται ήρεμα", isPatient: true }, { id: "child3", emoji: "😫", behavior: "Κλαίει που καθυστερεί", isPatient: false }, { id: "child4", emoji: "😤", behavior: "Χτυπάει το θρανίο", isPatient: false }] },
      { id: 14, scenario: { description: "Παιδιά περιμένουν να διαλέξουν βιβλίο για ανάγνωση.", context: "Στη γωνιά ανάγνωσης" }, correctAnswer: "child3", question: "Ποιο παιδί περιμένει υπομονετικά;", children: [{ id: "child1", emoji: "😠", behavior: "Αρπάζει βιβλίο από άλλο παιδί", isPatient: false }, { id: "child2", emoji: "😤", behavior: "Φωνάζει στον δάσκαλο", isPatient: false }, { id: "child3", emoji: "😌", behavior: "Περιμένει με υπομονή", isPatient: true }, { id: "child4", emoji: "🙄", behavior: "Παραπονιέται δυνατά", isPatient: false }] },
      { id: 15, scenario: { description: "Παιδιά περιμένουν τον δάσκαλο γυμναστικής.", context: "Στο γυμναστήριο" }, correctAnswer: "child1", question: "Ποιο παιδί περιμένει υπομονετικά;", children: [{ id: "child1", emoji: "😊", behavior: "Στέκεται ήρεμα στη σειρά", isPatient: true }, { id: "child2", emoji: "😤", behavior: "Τρέχει γύρω-γύρω", isPatient: false }, { id: "child3", emoji: "😠", behavior: "Φωνάζει 'Πού είναι;'", isPatient: false }, { id: "child4", emoji: "😒", behavior: "Κάθεται και παραπονιέται", isPatient: false }] }
    ],
    en: [
      { id: 1, scenario: { description: "Waiting to use the computer.", context: "In the computer lab" }, correctAnswer: "child2", question: "Which child is waiting patiently?", children: [{ id: "child1", emoji: "😤", behavior: "Pushing other children", isPatient: false }, { id: "child2", emoji: "😊", behavior: "Standing calmly in line", isPatient: true }, { id: "child3", emoji: "😠", behavior: "Yelling 'Me first!'", isPatient: false }, { id: "child4", emoji: "🏃", behavior: "Trying to cut in line", isPatient: false }] },
      { id: 2, scenario: { description: "Waiting for their turn to read aloud.", context: "In the classroom" }, correctAnswer: "child3", question: "Which child is waiting patiently?", children: [{ id: "child1", emoji: "😤", behavior: "Banging on the desk", isPatient: false }, { id: "child2", emoji: "😡", behavior: "Saying 'When is it my turn?'", isPatient: false }, { id: "child3", emoji: "😌", behavior: "Sitting and waiting", isPatient: true }, { id: "child4", emoji: "😒", behavior: "Crying and complaining", isPatient: false }] },
      { id: 3, scenario: { description: "Waiting for art supplies.", context: "In art class" }, correctAnswer: "child1", question: "Which child is waiting patiently?", children: [{ id: "child1", emoji: "😊", behavior: "Standing quietly in line", isPatient: true }, { id: "child2", emoji: "😤", behavior: "Pushing to get ahead", isPatient: false }, { id: "child3", emoji: "😫", behavior: "Yelling 'I want it now!'", isPatient: false }, { id: "child4", emoji: "🙄", behavior: "Grabbing supplies", isPatient: false }] },
      { id: 4, scenario: { description: "Waiting to play on the swings at recess.", context: "In the yard" }, correctAnswer: "child4", question: "Which child is waiting patiently?", children: [{ id: "child1", emoji: "😠", behavior: "Pulling the child off the swing", isPatient: false }, { id: "child2", emoji: "😤", behavior: "Saying 'It's my turn!'", isPatient: false }, { id: "child3", emoji: "😒", behavior: "Complaining loudly", isPatient: false }, { id: "child4", emoji: "😌", behavior: "Waiting calmly for their turn", isPatient: true }] },
      { id: 5, scenario: { description: "Waiting to borrow a library book.", context: "In the library" }, correctAnswer: "child2", question: "Which child is waiting patiently?", children: [{ id: "child1", emoji: "🏃", behavior: "Running to cut ahead", isPatient: false }, { id: "child2", emoji: "😊", behavior: "Standing in their place", isPatient: true }, { id: "child3", emoji: "😫", behavior: "Fidgeting restlessly", isPatient: false }, { id: "child4", emoji: "😤", behavior: "Pushing the door", isPatient: false }] },
      { id: 6, scenario: { description: "Waiting in line for the school bus.", context: "At the bus" }, correctAnswer: "child3", question: "Which child is waiting patiently?", children: [{ id: "child1", emoji: "😠", behavior: "Yelling 'Hurry up!'", isPatient: false }, { id: "child2", emoji: "😤", behavior: "Trying to cut in line", isPatient: false }, { id: "child3", emoji: "😌", behavior: "Waiting patiently", isPatient: true }, { id: "child4", emoji: "😒", behavior: "Crying about the wait", isPatient: false }] },
      { id: 7, scenario: { description: "Waiting to show their project to the teacher.", context: "In the classroom" }, correctAnswer: "child1", question: "Which child is waiting patiently?", children: [{ id: "child1", emoji: "😊", behavior: "Waiting for their turn", isPatient: true }, { id: "child2", emoji: "😤", behavior: "Pushing to go first", isPatient: false }, { id: "child3", emoji: "😠", behavior: "Yelling at the teacher", isPatient: false }, { id: "child4", emoji: "🏃", behavior: "Running to get ahead", isPatient: false }] },
      { id: 8, scenario: { description: "Waiting for their turn in a board game.", context: "At school" }, correctAnswer: "child4", question: "Which child is waiting patiently?", children: [{ id: "child1", emoji: "😤", behavior: "Grabbing the pieces", isPatient: false }, { id: "child2", emoji: "😠", behavior: "Saying 'It's my turn!'", isPatient: false }, { id: "child3", emoji: "😒", behavior: "Complaining to the teacher", isPatient: false }, { id: "child4", emoji: "😌", behavior: "Waiting patiently", isPatient: true }] },
      { id: 9, scenario: { description: "Waiting to use the drinking fountain.", context: "In the hallway" }, correctAnswer: "child2", question: "Which child is waiting patiently?", children: [{ id: "child1", emoji: "😤", behavior: "Pushing other children", isPatient: false }, { id: "child2", emoji: "😊", behavior: "Standing calmly in line", isPatient: true }, { id: "child3", emoji: "😫", behavior: "Yelling 'I'm thirsty!'", isPatient: false }, { id: "child4", emoji: "😠", behavior: "Pulling other children", isPatient: false }] },
      { id: 10, scenario: { description: "Waiting to go on the field trip bus.", context: "On the field trip" }, correctAnswer: "child3", question: "Which child is waiting patiently?", children: [{ id: "child1", emoji: "😤", behavior: "Running to the door", isPatient: false }, { id: "child2", emoji: "😡", behavior: "Yelling 'I want to get on!'", isPatient: false }, { id: "child3", emoji: "😌", behavior: "Waiting patiently", isPatient: true }, { id: "child4", emoji: "🙄", behavior: "Complaining loudly", isPatient: false }] },
      { id: 11, scenario: { description: "Waiting to get their school lunch.", context: "In the cafeteria" }, correctAnswer: "child1", question: "Which child is waiting patiently?", children: [{ id: "child1", emoji: "😊", behavior: "Standing quietly in line", isPatient: true }, { id: "child2", emoji: "😤", behavior: "Pushing to get ahead", isPatient: false }, { id: "child3", emoji: "😫", behavior: "Yelling 'I'm so hungry!'", isPatient: false }, { id: "child4", emoji: "😒", behavior: "Pretending there's no line", isPatient: false }] },
      { id: 12, scenario: { description: "Waiting to present their homework.", context: "In the classroom" }, correctAnswer: "child4", question: "Which child is waiting patiently?", children: [{ id: "child1", emoji: "😠", behavior: "Pushing others", isPatient: false }, { id: "child2", emoji: "😤", behavior: "Saying 'Me first!'", isPatient: false }, { id: "child3", emoji: "😒", behavior: "Complaining about the wait", isPatient: false }, { id: "child4", emoji: "😌", behavior: "Waiting calmly for their turn", isPatient: true }] },
      { id: 13, scenario: { description: "Waiting for the school bell.", context: "In the classroom" }, correctAnswer: "child2", question: "Which child is waiting patiently?", children: [{ id: "child1", emoji: "🏃", behavior: "Running to the door", isPatient: false }, { id: "child2", emoji: "😊", behavior: "Sitting calmly", isPatient: true }, { id: "child3", emoji: "😫", behavior: "Crying about the delay", isPatient: false }, { id: "child4", emoji: "😤", behavior: "Banging on the desk", isPatient: false }] },
      { id: 14, scenario: { description: "Waiting to pick a book for reading time.", context: "In the reading corner" }, correctAnswer: "child3", question: "Which child is waiting patiently?", children: [{ id: "child1", emoji: "😠", behavior: "Grabbing a book from another child", isPatient: false }, { id: "child2", emoji: "😤", behavior: "Yelling at the teacher", isPatient: false }, { id: "child3", emoji: "😌", behavior: "Waiting patiently", isPatient: true }, { id: "child4", emoji: "🙄", behavior: "Complaining loudly", isPatient: false }] },
      { id: 15, scenario: { description: "Waiting for the PE teacher.", context: "In the gym" }, correctAnswer: "child1", question: "Which child is waiting patiently?", children: [{ id: "child1", emoji: "😊", behavior: "Standing calmly in line", isPatient: true }, { id: "child2", emoji: "😤", behavior: "Running around", isPatient: false }, { id: "child3", emoji: "😠", behavior: "Yelling 'Where are they?'", isPatient: false }, { id: "child4", emoji: "😒", behavior: "Sitting and complaining", isPatient: false }] }
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
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "😊"][Math.floor(Math.random() * 6)],
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
        title: "Who Waits In Line Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Who Waits In Line Game",
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
  const correctChild = round.children.find(child => child.id === round.correctAnswer);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Ποιος Περιμένει Σειρά;" : "Who Waits In Line?"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            😊 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-red-500 transition-all duration-500 ease-out"
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
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-orange-400">
          <div className="text-7xl mb-3">🙋</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">
            {round.question}
          </h2>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-orange-400">
          {/* Scenario Display */}
          <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-3xl p-10 border-4 border-orange-400 mb-8 shadow-lg">
            <div className="flex flex-col items-center justify-center gap-6">
              {/* Context Badge */}
              <div className="bg-orange-500 text-white px-6 py-2 rounded-full font-bold text-lg">
                {round.scenario.context}
              </div>

              {/* Description */}
              <div className="bg-white/90 rounded-2xl p-6 border-4 border-orange-300 max-w-2xl">
                <p className="text-2xl font-bold text-center text-slate-800">
                  {round.scenario.description}
                </p>
              </div>
            </div>
          </div>

          {/* Children Options */}
          {!showAnswer && (
            <>
              <p className="text-2xl font-bold text-center text-slate-700 mb-6">
                {round.question}
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
                {round.children.map((child, index) => {
                  return (
                    <button
                      key={child.id}
                      onClick={() => handleAnswerSelect(child.id)}
                      className="p-6 rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-100 hover:from-yellow-200 hover:to-orange-200 border-4 border-yellow-300 hover:border-yellow-500 transition-all duration-200 transform hover:scale-105 shadow-lg flex flex-col items-center cursor-pointer"
                    >
                      <div className="text-8xl mb-4">{child.emoji}</div>
                      <div className="bg-orange-500 text-white px-4 py-1 rounded-full font-bold text-sm mb-2">
                        {lang === "el" ? `Παιδί ${index + 1}` : `Child ${index + 1}`}
                      </div>
                      <p className="text-lg font-bold text-slate-700 text-center">
                        {child.behavior}
                      </p>
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
                  <div className="text-9xl">{correctChild.emoji}</div>
                  <div className="text-8xl">✅</div>
                </div>
                <p className="text-3xl font-bold text-green-700 mb-4">
                  {lang === "el"
                    ? `🎉 Μπράβο! Αυτό το παιδί περιμένει υπομονετικά!`
                    : `🎉 Well done! This child is waiting patiently!`}
                </p>
                <p className="text-xl text-green-600">
                  {correctChild.behavior}
                </p>
              </div>
            </div>
          )}

          {showAnswer && selectedAnswer !== round.correctAnswer && (
            <div className="text-center animate-fadeIn">
              <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
                <p className="text-3xl font-bold text-red-700">
                  {lang === "el"
                    ? `Σκέψου ξανά! Ποιο παιδί είναι υπομονετικό;`
                    : `Think again! Which child is patient?`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/80 to-orange-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">😊🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις να περιμένεις υπομονετικά!" : "Perfect! You know how to wait patiently!"}
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
