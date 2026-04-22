// src/components/games/exercises_9_10_1/WhoWaitsInLineGame.jsx
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
      { id: 1, scenario: { description: "Συζήτηση ομαδικής εργασίας - ένα παιδί ακούει όλες τις ιδέες.", context: "Στην ομαδική εργασία" }, correctAnswer: "child2", question: "Ποιο παιδί δείχνει ωριμότητα;", children: [{ id: "child1", emoji: "😤", behavior: "Μιλάει χωρίς να αφήσει τους άλλους", isPatient: false }, { id: "child2", emoji: "😊", behavior: "Ακούει όλες τις ιδέες", isPatient: true }, { id: "child3", emoji: "😠", behavior: "Διακόπτει συνεχώς", isPatient: false }, { id: "child4", emoji: "😒", behavior: "Κοιτάει το κινητό αντί να ακούει", isPatient: false }] },
      { id: 2, scenario: { description: "Δημόσια συζήτηση στην τάξη - ένα παιδί περιμένει τη σειρά του να μιλήσει.", context: "Στην τάξη" }, correctAnswer: "child3", question: "Ποιο παιδί δείχνει ωριμότητα;", children: [{ id: "child1", emoji: "😤", behavior: "Φωνάζει για να ακουστεί", isPatient: false }, { id: "child2", emoji: "😡", behavior: "Διακόπτει τους άλλους", isPatient: false }, { id: "child3", emoji: "😌", behavior: "Περιμένει τη σειρά του να μιλήσει", isPatient: true }, { id: "child4", emoji: "🙄", behavior: "Σηκώνει το χέρι χωρίς να περιμένει απάντηση", isPatient: false }] },
      { id: 3, scenario: { description: "Σχολικές εκλογές - ένα παιδί δέχεται τα αποτελέσματα με χάρη.", context: "Στο σχολείο" }, correctAnswer: "child1", question: "Ποιο παιδί δείχνει ωριμότητα;", children: [{ id: "child1", emoji: "😊", behavior: "Δέχεται τα αποτελέσματα με χάρη", isPatient: true }, { id: "child2", emoji: "😤", behavior: "Παραπονιέται ότι ήταν άδικο", isPatient: false }, { id: "child3", emoji: "😠", behavior: "Θυμώνει με τους ψηφοφόρους", isPatient: false }, { id: "child4", emoji: "😒", behavior: "Αγνοεί την ήττα του", isPatient: false }] },
      { id: 4, scenario: { description: "Δοκιμασία για ομαδικό άθλημα - ένα παιδί υποστηρίζει τους άλλους ανεξαρτήτως αποτελέσματος.", context: "Στη δοκιμασία" }, correctAnswer: "child4", question: "Ποιο παιδί δείχνει ωριμότητα;", children: [{ id: "child1", emoji: "😤", behavior: "Κατακρίνει όσους δεν πήραν", isPatient: false }, { id: "child2", emoji: "😎", behavior: "Καυχιέται για τον εαυτό του", isPatient: false }, { id: "child3", emoji: "😒", behavior: "Γελάει με τα λάθη άλλων", isPatient: false }, { id: "child4", emoji: "🤝", behavior: "Υποστηρίζει όλους ανεξαρτήτως αποτελέσματος", isPatient: true }] },
      { id: 5, scenario: { description: "Συνεργάτες στο εργαστήριο - ένα παιδί μοιράζεται τον εξοπλισμό δίκαια.", context: "Στο εργαστήριο" }, correctAnswer: "child2", question: "Ποιο παιδί δείχνει ωριμότητα;", children: [{ id: "child1", emoji: "😤", behavior: "Αρπάζει όλο τον εξοπλισμό", isPatient: false }, { id: "child2", emoji: "😊", behavior: "Μοιράζεται τον εξοπλισμό δίκαια", isPatient: true }, { id: "child3", emoji: "😠", behavior: "Δεν δίνει τίποτα στον συνεργάτη", isPatient: false }, { id: "child4", emoji: "🙄", behavior: "Παραπονιέται αν δεν παίρνει πρώτο", isPatient: false }] },
      { id: 6, scenario: { description: "Εκλογή αντιπροσώπων τάξης - ένα παιδί προσφέρεται χωρίς να καυχιέται.", context: "Στην τάξη" }, correctAnswer: "child3", question: "Ποιο παιδί δείχνει ωριμότητα;", children: [{ id: "child1", emoji: "😎", behavior: "Καυχιέται γιατί θα ψηφίσουν σε αυτόν", isPatient: false }, { id: "child2", emoji: "😤", behavior: "Πιέζει τους άλλους να τον ψηφίσουν", isPatient: false }, { id: "child3", emoji: "😌", behavior: "Προσφέρεται χωρίς να καυχιέται", isPatient: true }, { id: "child4", emoji: "😒", behavior: "Λέει κακά για τους ανταγωνιστές", isPatient: false }] },
      { id: 7, scenario: { description: "Σειρά στο μεσημεριανό - ένα παιδί αφήνει νεότερο μαθητή να περάσει πρώτο.", context: "Στην καντίνα" }, correctAnswer: "child1", question: "Ποιο παιδί δείχνει ωριμότητα;", children: [{ id: "child1", emoji: "🤲", behavior: "Αφήνει νεότερο μαθητή να περάσει πρώτο", isPatient: true }, { id: "child2", emoji: "😤", behavior: "Σπρώχνει για να περάσει πρώτο", isPatient: false }, { id: "child3", emoji: "😠", behavior: "Λέει «Εγώ πρώτα!»", isPatient: false }, { id: "child4", emoji: "😒", behavior: "Παραπονιέται για την ουρά", isPatient: false }] },
      { id: 8, scenario: { description: "Χρόνος στον υπολογιστή - ένα παιδί αποσυνδέεται έγκαιρα.", context: "Στο εργαστήριο" }, correctAnswer: "child4", question: "Ποιο παιδί δείχνει ωριμότητα;", children: [{ id: "child1", emoji: "😤", behavior: "Παραβλέπει το χρόνο και συνεχίζει", isPatient: false }, { id: "child2", emoji: "😠", behavior: "Τσακώνεται όταν του λένε να τελειώσει", isPatient: false }, { id: "child3", emoji: "🙄", behavior: "Κάνει ότι δεν ακούει", isPatient: false }, { id: "child4", emoji: "😊", behavior: "Αποσυνδέεται έγκαιρα", isPatient: true }] },
      { id: 9, scenario: { description: "Ζώνη ησυχίας στη βιβλιοθήκη - ένα παιδί σέβεται τη σιωπή.", context: "Στη βιβλιοθήκη" }, correctAnswer: "child2", question: "Ποιο παιδί δείχνει ωριμότητα;", children: [{ id: "child1", emoji: "🗣️", behavior: "Μιλά δυνατά με φίλο", isPatient: false }, { id: "child2", emoji: "🤫", behavior: "Σέβεται τη σιωπή", isPatient: true }, { id: "child3", emoji: "😤", behavior: "Γελάει δυνατά", isPatient: false }, { id: "child4", emoji: "📱", behavior: "Βλέπει βίντεο με ήχο", isPatient: false }] },
      { id: 10, scenario: { description: "Εγγραφή σε δραστηριότητες - ένα παιδί περιμένει χωρίς να παραπονιέται.", context: "Στις δραστηριότητες" }, correctAnswer: "child3", question: "Ποιο παιδί δείχνει ωριμότητα;", children: [{ id: "child1", emoji: "😤", behavior: "Παραπονιέται δυνατά για την αναμονή", isPatient: false }, { id: "child2", emoji: "😠", behavior: "Σπρώχνει τους μπροστινά", isPatient: false }, { id: "child3", emoji: "😌", behavior: "Περιμένει χωρίς να παραπονιέται", isPatient: true }, { id: "child4", emoji: "🙄", behavior: "Ρωτάει «Πότε θα τελειώσει;»", isPatient: false }] },
      { id: 11, scenario: { description: "Λήψη βαθμών τεστ - ένα παιδί δεν καυχιέται για τον βαθμό του.", context: "Στην τάξη" }, correctAnswer: "child1", question: "Ποιο παιδί δείχνει ωριμότητα;", children: [{ id: "child1", emoji: "😊", behavior: "Δεν καυχιέται για τον βαθμό του", isPatient: true }, { id: "child2", emoji: "😎", behavior: "Φωνάζει «Πήρα 10!»", isPatient: false }, { id: "child3", emoji: "😏", behavior: "Κοροϊδεύει όσους πήραν χαμηλό βαθμό", isPatient: false }, { id: "child4", emoji: "🙄", behavior: "Κάνει ότι δεν τον νοιάζει ενώ το λέει παντού", isPatient: false }] },
      { id: 12, scenario: { description: "Χρήση κοινού εξοπλισμού στα εικαστικά - ένα παιδί τα επιστρέφει σωστά.", context: "Στα εικαστικά" }, correctAnswer: "child4", question: "Ποιο παιδί δείχνει ωριμότητα;", children: [{ id: "child1", emoji: "😤", behavior: "Αφήνει τον εξοπλισμό απλωμένο", isPatient: false }, { id: "child2", emoji: "😒", behavior: "Περνάει δίχως να καθαρίσει", isPatient: false }, { id: "child3", emoji: "🙄", behavior: "Λέει «Δεν είναι δική μου ευθύνη»", isPatient: false }, { id: "child4", emoji: "😊", behavior: "Τα επιστρέφει σωστά", isPatient: true }] },
      { id: 13, scenario: { description: "Επιλογή ομάδων για γυμναστική - ένα παιδί δεν αφήνει κανέναν έξω.", context: "Στη γυμναστική" }, correctAnswer: "child2", question: "Ποιο παιδί δείχνει ωριμότητα;", children: [{ id: "child1", emoji: "😤", behavior: "Επιλέγει μόνο τους «καλούς»", isPatient: false }, { id: "child2", emoji: "🤝", behavior: "Δεν αφήνει κανέναν έξω", isPatient: true }, { id: "child3", emoji: "😒", behavior: "Είναι ο τελευταίος που επιλέγεται και παραπονιέται", isPatient: false }, { id: "child4", emoji: "😠", behavior: "Αρνείται να παίξει αν δεν επιλεγεί πρώτο", isPatient: false }] },
      { id: 14, scenario: { description: "Αναμονή για παραλαβή από γονέα - ένα παιδί περιμένει ήρεμα.", context: "Στην έξοδο" }, correctAnswer: "child3", question: "Ποιο παιδί δείχνει ωριμότητα;", children: [{ id: "child1", emoji: "😤", behavior: "Παραπονιέται δυνατά ότι αργεί", isPatient: false }, { id: "child2", emoji: "😠", behavior: "Τηλεφωνεί ξανά και ξανά", isPatient: false }, { id: "child3", emoji: "😌", behavior: "Περιμένει ήρεμα", isPatient: true }, { id: "child4", emoji: "🏃", behavior: "Περπατά μακριά χωρίς να ειδοποιήσει", isPatient: false }] },
      { id: 15, scenario: { description: "Έδρα στο λεωφορείο εκδρομής - ένα παιδί προσφέρει θέση παράθυρου σε φίλο.", context: "Στο λεωφορείο" }, correctAnswer: "child1", question: "Ποιο παιδί δείχνει ωριμότητα;", children: [{ id: "child1", emoji: "😊", behavior: "Προσφέρει θέση παράθυρου σε φίλο", isPatient: true }, { id: "child2", emoji: "😤", behavior: "Τρέχει να πάρει τη καλύτερη θέση", isPatient: false }, { id: "child3", emoji: "😒", behavior: "Λέει «Εγώ την ήθελα!»", isPatient: false }, { id: "child4", emoji: "😠", behavior: "Τσακώνεται με φίλο για τη θέση", isPatient: false }] }
    ],
    en: [
      { id: 1, scenario: { description: "Group project discussion - one listens to all ideas.", context: "In the group work" }, correctAnswer: "child2", question: "Which child shows maturity?", children: [{ id: "child1", emoji: "😤", behavior: "Talks without letting others speak", isPatient: false }, { id: "child2", emoji: "😊", behavior: "Listens to all ideas", isPatient: true }, { id: "child3", emoji: "😠", behavior: "Interrupts constantly", isPatient: false }, { id: "child4", emoji: "😒", behavior: "Looks at phone instead of listening", isPatient: false }] },
      { id: 2, scenario: { description: "Debate in class - one waits their turn to speak.", context: "In the classroom" }, correctAnswer: "child3", question: "Which child shows maturity?", children: [{ id: "child1", emoji: "😤", behavior: "Shouts to be heard", isPatient: false }, { id: "child2", emoji: "😡", behavior: "Interrupts others", isPatient: false }, { id: "child3", emoji: "😌", behavior: "Waits their turn to speak", isPatient: true }, { id: "child4", emoji: "🙄", behavior: "Raises hand without waiting for response", isPatient: false }] },
      { id: 3, scenario: { description: "School election - one accepts results gracefully.", context: "At school" }, correctAnswer: "child1", question: "Which child shows maturity?", children: [{ id: "child1", emoji: "😊", behavior: "Accepts results gracefully", isPatient: true }, { id: "child2", emoji: "😤", behavior: "Complains it was unfair", isPatient: false }, { id: "child3", emoji: "😠", behavior: "Gets angry at voters", isPatient: false }, { id: "child4", emoji: "😒", behavior: "Ignores their loss", isPatient: false }] },
      { id: 4, scenario: { description: "Team sport tryouts - one supports others regardless of outcome.", context: "At the tryout" }, correctAnswer: "child4", question: "Which child shows maturity?", children: [{ id: "child1", emoji: "😤", behavior: "Criticizes those who didn't make it", isPatient: false }, { id: "child2", emoji: "😎", behavior: "Brags about themselves", isPatient: false }, { id: "child3", emoji: "😒", behavior: "Laughs at others' mistakes", isPatient: false }, { id: "child4", emoji: "🤝", behavior: "Supports others regardless of outcome", isPatient: true }] },
      { id: 5, scenario: { description: "Science lab partners - one shares equipment fairly.", context: "In the lab" }, correctAnswer: "child2", question: "Which child shows maturity?", children: [{ id: "child1", emoji: "😤", behavior: "Grabs all the equipment", isPatient: false }, { id: "child2", emoji: "😊", behavior: "Shares equipment fairly", isPatient: true }, { id: "child3", emoji: "😠", behavior: "Won't give anything to partner", isPatient: false }, { id: "child4", emoji: "🙄", behavior: "Complains if not first", isPatient: false }] },
      { id: 6, scenario: { description: "Choosing class representatives - one volunteers without bragging.", context: "In the classroom" }, correctAnswer: "child3", question: "Which child shows maturity?", children: [{ id: "child1", emoji: "😎", behavior: "Brags that they'll get votes", isPatient: false }, { id: "child2", emoji: "😤", behavior: "Pressures others to vote for them", isPatient: false }, { id: "child3", emoji: "😌", behavior: "Volunteers without bragging", isPatient: true }, { id: "child4", emoji: "😒", behavior: "Says bad things about competitors", isPatient: false }] },
      { id: 7, scenario: { description: "School lunch line - one lets a younger student go first.", context: "In the cafeteria" }, correctAnswer: "child1", question: "Which child shows maturity?", children: [{ id: "child1", emoji: "🤲", behavior: "Lets a younger student go first", isPatient: true }, { id: "child2", emoji: "😤", behavior: "Pushes to get first", isPatient: false }, { id: "child3", emoji: "😠", behavior: "Says 'Me first!'", isPatient: false }, { id: "child4", emoji: "😒", behavior: "Complains about the line", isPatient: false }] },
      { id: 8, scenario: { description: "Computer lab time limit - one logs off on time.", context: "In the lab" }, correctAnswer: "child4", question: "Which child shows maturity?", children: [{ id: "child1", emoji: "😤", behavior: "Ignores the timer and keeps going", isPatient: false }, { id: "child2", emoji: "😠", behavior: "Argues when told to finish", isPatient: false }, { id: "child3", emoji: "🙄", behavior: "Acts like they don't hear", isPatient: false }, { id: "child4", emoji: "😊", behavior: "Logs off on time", isPatient: true }] },
      { id: 9, scenario: { description: "Library quiet zone - one respects the silence.", context: "In the library" }, correctAnswer: "child2", question: "Which child shows maturity?", children: [{ id: "child1", emoji: "🗣️", behavior: "Talks loudly with a friend", isPatient: false }, { id: "child2", emoji: "🤫", behavior: "Respects the silence", isPatient: true }, { id: "child3", emoji: "😤", behavior: "Laughs loudly", isPatient: false }, { id: "child4", emoji: "📱", behavior: "Watches videos with sound", isPatient: false }] },
      { id: 10, scenario: { description: "After-school activity signup - one waits without complaining.", context: "At activities" }, correctAnswer: "child3", question: "Which child shows maturity?", children: [{ id: "child1", emoji: "😤", behavior: "Complains loudly about the wait", isPatient: false }, { id: "child2", emoji: "😠", behavior: "Pushes those ahead", isPatient: false }, { id: "child3", emoji: "😌", behavior: "Waits without complaining", isPatient: true }, { id: "child4", emoji: "🙄", behavior: "Asks 'When will this end?'", isPatient: false }] },
      { id: 11, scenario: { description: "Getting test results back - one doesn't brag about their score.", context: "In the classroom" }, correctAnswer: "child1", question: "Which child shows maturity?", children: [{ id: "child1", emoji: "😊", behavior: "Doesn't brag about their score", isPatient: true }, { id: "child2", emoji: "😎", behavior: "Yells 'I got 10!'", isPatient: false }, { id: "child3", emoji: "😏", behavior: "Mocks those with low scores", isPatient: false }, { id: "child4", emoji: "🙄", behavior: "Acts like they don't care but tells everyone", isPatient: false }] },
      { id: 12, scenario: { description: "Using shared art supplies - one returns them properly.", context: "In art class" }, correctAnswer: "child4", question: "Which child shows maturity?", children: [{ id: "child1", emoji: "😤", behavior: "Leaves supplies scattered", isPatient: false }, { id: "child2", emoji: "😒", behavior: "Leaves without cleaning", isPatient: false }, { id: "child3", emoji: "🙄", behavior: "Says 'Not my job'", isPatient: false }, { id: "child4", emoji: "😊", behavior: "Returns them properly", isPatient: true }] },
      { id: 13, scenario: { description: "Choosing teams for PE - one doesn't leave anyone out.", context: "In PE" }, correctAnswer: "child2", question: "Which child shows maturity?", children: [{ id: "child1", emoji: "😤", behavior: "Picks only the 'good' ones", isPatient: false }, { id: "child2", emoji: "🤝", behavior: "Doesn't leave anyone out", isPatient: true }, { id: "child3", emoji: "😒", behavior: "Is picked last and complains", isPatient: false }, { id: "child4", emoji: "😠", behavior: "Refuses to play if not picked first", isPatient: false }] },
      { id: 14, scenario: { description: "Waiting for parent pickup - one waits calmly.", context: "At the exit" }, correctAnswer: "child3", question: "Which child shows maturity?", children: [{ id: "child1", emoji: "😤", behavior: "Complains loudly that they're late", isPatient: false }, { id: "child2", emoji: "😠", behavior: "Calls again and again", isPatient: false }, { id: "child3", emoji: "😌", behavior: "Waits calmly", isPatient: true }, { id: "child4", emoji: "🏃", behavior: "Walks away without telling", isPatient: false }] },
      { id: 15, scenario: { description: "Field trip bus seating - one offers window seat to a friend.", context: "On the bus" }, correctAnswer: "child1", question: "Which child shows maturity?", children: [{ id: "child1", emoji: "😊", behavior: "Offers window seat to a friend", isPatient: true }, { id: "child2", emoji: "😤", behavior: "Runs to get the best seat", isPatient: false }, { id: "child3", emoji: "😒", behavior: "Says 'I wanted it!'", isPatient: false }, { id: "child4", emoji: "😠", behavior: "Fights with friend over the seat", isPatient: false }] }
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
                    ? `🎉 Μπράβο! Αυτό το παιδί δείχνει ωριμότητα!`
                    : `🎉 Well done! This child shows maturity!`}
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
                    ? `Σκέψου ξανά! Ποιο παιδί δείχνει ωριμότητα;`
                    : `Think again! Which child shows maturity?`}
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
              {lang === "el" ? "Τέλεια! Ξέρεις να δείχνεις ωριμότητα!" : "Perfect! You know how to show maturity!"}
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
