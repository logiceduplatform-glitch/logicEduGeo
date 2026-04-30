// Branching narrative adventures (visual-novel style with educational choices).
// Each adventure has a tree of nodes; choices may require correct answers to unlock paths.
// Endings differ based on choices made → replay value.

export const NARRATIVE_ADVENTURES = [
  {
    id: "lost_temple",
    title: { el: "🏛️ Ο Χαμένος Ναός", en: "🏛️ The Lost Temple" },
    description: {
      el: "Είσαι αρχαιολόγος και ψάχνεις τον κρυμμένο θησαυρό σε έναν αρχαίο ελληνικό ναό. Οι αποφάσεις σου καθορίζουν τη μοίρα σου!",
      en: "You're an archaeologist seeking treasure in an ancient Greek temple. Your choices decide your fate!",
    },
    age: "9-12",
    subject: "history",
    minutes: 12,
    nodes: {
      start: {
        scene: "🌅",
        text: { el: "Φτάνεις σε έναν τεράστιο ναό. Ένας πέτρινος φύλακας στέκεται στην είσοδο. Σε ρωτάει: «Σε ποιον θεό είναι αφιερωμένος ο Παρθενώνας;»", en: "You arrive at a huge temple. A stone guardian asks: 'Which goddess is the Parthenon dedicated to?'" },
        type: "quiz",
        question: { el: "Σε ποια θεά;", en: "Which goddess?" },
        options: [
          { el: "Αφροδίτη", en: "Aphrodite" },
          { el: "Αθηνά", en: "Athena" },
          { el: "Ήρα", en: "Hera" },
          { el: "Άρτεμις", en: "Artemis" },
        ],
        correct: 1,
        onCorrect: { next: "hall", reward: 10 },
        onWrong: { next: "blocked" },
      },
      blocked: {
        scene: "🚫",
        text: { el: "Λάθος! Ο φύλακας δεν σε αφήνει. Δοκίμασε ξανά!", en: "Wrong! The guardian blocks you. Try again!" },
        type: "info",
        choices: [{ label: { el: "Ξαναπροσπάθησε", en: "Try again" }, next: "start" }],
      },
      hall: {
        scene: "🏛️",
        text: { el: "Μπαίνεις σε μια τεράστια αίθουσα. Δύο πόρτες: η αριστερή λάμπει χρυσή, η δεξιά είναι σκοτεινή.", en: "You enter a huge hall. Left door glows golden; right door is dark." },
        type: "choice",
        choices: [
          { label: { el: "Πέρνα τη χρυσή πόρτα", en: "Take the golden door" }, next: "trap_or_treasure", flag: "chose_gold" },
          { label: { el: "Πέρνα τη σκοτεινή πόρτα", en: "Take the dark door" }, next: "library" },
        ],
      },
      trap_or_treasure: {
        scene: "💰",
        text: { el: "Βλέπεις χρυσά νομίσματα! Αλλά ένας γρίφος είναι σκαλισμένος στον τοίχο.", en: "You see gold coins! But a riddle is carved on the wall." },
        type: "quiz",
        question: { el: "Πόσο κάνει 7 × 8;", en: "What is 7 × 8?" },
        options: [{ el: "54", en: "54" }, { el: "56", en: "56" }, { el: "64", en: "64" }, { el: "48", en: "48" }],
        correct: 1,
        onCorrect: { next: "treasure_room", reward: 20 },
        onWrong: { next: "trap_room" },
      },
      trap_room: {
        scene: "🕳️",
        text: { el: "Λάθος! Πέφτεις σε ένα παγίδα-υπόγειο! Αλλά βρίσκεις μια αρχαία πάπυρο...", en: "Wrong! You fall into a trap pit! But you find an ancient scroll..." },
        type: "quiz",
        question: { el: "Ποιος έγραψε την Ιλιάδα;", en: "Who wrote the Iliad?" },
        options: [{ el: "Σωκράτης", en: "Socrates" }, { el: "Αριστοτέλης", en: "Aristotle" }, { el: "Όμηρος", en: "Homer" }, { el: "Πλάτωνας", en: "Plato" }],
        correct: 2,
        onCorrect: { next: "secret_path", reward: 15 },
        onWrong: { next: "ending_lost" },
      },
      library: {
        scene: "📚",
        text: { el: "Μπαίνεις στη βιβλιοθήκη του ναού. Χιλιάδες παπύροι! Ένας σοφός σε ρωτάει για να σου δείξει τον δρόμο.", en: "You enter the temple library. A wise scholar asks you a question." },
        type: "quiz",
        question: { el: "Ποια χρονιά τέλειωσαν οι Ολυμπιακοί Αγώνες της Αθήνας 2004;", en: "What year did Athens 2004 Olympics end?" },
        options: [{ el: "2004", en: "2004" }, { el: "2003", en: "2003" }, { el: "2005", en: "2005" }, { el: "2008", en: "2008" }],
        correct: 0,
        onCorrect: { next: "secret_path", reward: 15, flag: "wise_path" },
        onWrong: { next: "library", retry: true },
      },
      secret_path: {
        scene: "✨",
        text: { el: "Ένας μυστικός διάδρομος ανοίγει! Φτάνεις σε ένα δωμάτιο με τρεις θησαυρούς.", en: "A secret passage opens! You reach a room with three treasures." },
        type: "choice",
        choices: [
          { label: { el: "Πάρε το χρυσό στέμμα", en: "Take the golden crown" }, next: "ending_king" },
          { label: { el: "Πάρε το αρχαίο βιβλίο γνώσης", en: "Take the ancient book of knowledge" }, next: "ending_wise" },
          { label: { el: "Πάρε τον μαγικό λύχνο", en: "Take the magic lamp" }, next: "ending_hero" },
        ],
      },
      treasure_room: {
        scene: "👑",
        text: { el: "Βρίσκεις τον μεγαλύτερο θησαυρό! Αλλά ένας γέρος εμφανίζεται...", en: "You find the greatest treasure! But an old man appears..." },
        type: "quiz",
        question: { el: "Ποια ήταν η πρωτεύουσα της Αρχαίας Σπάρτης;", en: "Capital of Ancient Sparta?" },
        options: [{ el: "Σπάρτη", en: "Sparta" }, { el: "Αθήνα", en: "Athens" }, { el: "Θήβα", en: "Thebes" }, { el: "Κόρινθος", en: "Corinth" }],
        correct: 0,
        onCorrect: { next: "ending_hero", reward: 25 },
        onWrong: { next: "ending_lost" },
      },
      ending_king: {
        scene: "👑",
        ending: "king",
        text: { el: "Διαλέγεις το στέμμα. Θα γίνεις πλούσιος αλλά μόνος. Συμβατικό τέλος.", en: "You chose the crown. You'll be rich but alone. Standard ending." },
        rewards: { coins: 30, xp: 20 },
      },
      ending_wise: {
        scene: "📜",
        ending: "wise",
        text: { el: "Διαλέγεις τη γνώση! Γίνεσαι ο πιο σοφός αρχαιολόγος! ΤΟ ΚΑΛΥΤΕΡΟ ΤΕΛΟΣ!", en: "You chose knowledge! You become the wisest archaeologist! BEST ENDING!" },
        rewards: { coins: 100, xp: 50 },
        bestEnding: true,
      },
      ending_hero: {
        scene: "🦸",
        ending: "hero",
        text: { el: "Σώζεις τον ναό από τους κλέφτες! Γίνεσαι ήρωας!", en: "You save the temple from thieves! You become a hero!" },
        rewards: { coins: 60, xp: 35 },
      },
      ending_lost: {
        scene: "😢",
        ending: "lost",
        text: { el: "Χάνεσαι στον ναό... Δοκίμασε ξανά!", en: "You get lost in the temple... Try again!" },
        rewards: { coins: 5, xp: 5 },
        bad: true,
      },
    },
  },

  {
    id: "space_mission",
    title: { el: "🚀 Διαστημική Αποστολή", en: "🚀 Space Mission" },
    description: {
      el: "Είσαι αστροναύτης σε αποστολή να σώσεις τη Γη. Λύσε γρίφους και πάρε τις σωστές αποφάσεις!",
      en: "You're an astronaut on a mission to save Earth. Solve puzzles and make the right choices!",
    },
    age: "9-12",
    subject: "science",
    minutes: 10,
    nodes: {
      start: {
        scene: "🌍",
        text: { el: "Παίρνεις σήμα κινδύνου από τον Άρη. Πρέπει να ξεκινήσεις αμέσως!", en: "You receive a distress signal from Mars. You must launch now!" },
        type: "quiz",
        question: { el: "Πόσοι πλανήτες υπάρχουν στο Ηλιακό μας Σύστημα;", en: "How many planets in our Solar System?" },
        options: [{ el: "7", en: "7" }, { el: "8", en: "8" }, { el: "9", en: "9" }, { el: "10", en: "10" }],
        correct: 1,
        onCorrect: { next: "launch", reward: 10 },
        onWrong: { next: "study", retry: true },
      },
      study: {
        scene: "📚",
        text: { el: "Πρέπει να μελετήσεις πρώτα. Ξαναπροσπάθησε!", en: "You need to study first. Try again!" },
        type: "info",
        choices: [{ label: { el: "Ξανά", en: "Retry" }, next: "start" }],
      },
      launch: {
        scene: "🚀",
        text: { el: "Απογειώνεσαι! Στον δρόμο, βλέπεις έναν αστεροειδή.", en: "You launch! On the way, you spot an asteroid." },
        type: "choice",
        choices: [
          { label: { el: "Παράκαμψη (ασφαλές)", en: "Avoid (safe)" }, next: "mars" },
          { label: { el: "Συγκεντρώσε δείγματα (ριψοκίνδυνο)", en: "Collect samples (risky)" }, next: "asteroid_quiz" },
        ],
      },
      asteroid_quiz: {
        scene: "☄️",
        text: { el: "Συγκεντρώνεις δείγματα. Ένα κομμάτι μοιάζει διαφορετικό...", en: "You collect samples. One piece looks different..." },
        type: "quiz",
        question: { el: "Ποιο είναι το ελαφρύτερο στοιχείο;", en: "Lightest element?" },
        options: [{ el: "Άζωτο", en: "Nitrogen" }, { el: "Υδρογόνο", en: "Hydrogen" }, { el: "Οξυγόνο", en: "Oxygen" }, { el: "Ήλιο", en: "Helium" }],
        correct: 1,
        onCorrect: { next: "mars", reward: 20, flag: "rare_sample" },
        onWrong: { next: "ending_crash" },
      },
      mars: {
        scene: "🔴",
        text: { el: "Φτάνεις στον Άρη. Ένας ξένος σταθμός! Ποιον τρόπο επικοινωνίας θα διαλέξεις;", en: "You reach Mars. An alien station! What communication will you choose?" },
        type: "choice",
        choices: [
          { label: { el: "Σήμα φωτός", en: "Light signal" }, next: "alien_friend" },
          { label: { el: "Επίθεση", en: "Attack" }, next: "ending_war" },
          { label: { el: "Φύγε", en: "Leave" }, next: "ending_safe" },
        ],
      },
      alien_friend: {
        scene: "👽",
        text: { el: "Οι εξωγήινοι είναι φίλοι! Σε ζητούν να λύσεις έναν τελευταίο γρίφο για να σώσεις τον γαλαξία.", en: "The aliens are friendly! They ask you to solve one final riddle to save the galaxy." },
        type: "quiz",
        question: { el: "Πόσοι μήνες έχουν 30 ημέρες;", en: "How many months have 30 days?" },
        options: [{ el: "4", en: "4" }, { el: "5", en: "5" }, { el: "11 (όλοι εκτός Φεβρουαρίου)", en: "11 (all except Feb)" }, { el: "12", en: "12" }],
        correct: 2,
        onCorrect: { next: "ending_hero", reward: 30 },
        onWrong: { next: "ending_safe" },
      },
      ending_hero: {
        scene: "🏆",
        ending: "hero",
        text: { el: "Σώζεις τον γαλαξία! ΝΙΚΗΤΗΣ!", en: "You save the galaxy! WINNER!" },
        rewards: { coins: 120, xp: 60 },
        bestEnding: true,
      },
      ending_safe: {
        scene: "🌍",
        ending: "safe",
        text: { el: "Επιστρέφεις στη Γη ασφαλής. Καλή δουλειά!", en: "You return safely to Earth. Good job!" },
        rewards: { coins: 40, xp: 25 },
      },
      ending_war: {
        scene: "💥",
        ending: "war",
        text: { el: "Ξεκινάς πόλεμο! Κακή απόφαση... ξανά;", en: "You started a war! Bad choice... again?" },
        rewards: { coins: 10, xp: 5 },
        bad: true,
      },
      ending_crash: {
        scene: "💥",
        ending: "crash",
        text: { el: "Το διαστημόπλοιο συντρίβεται. Δοκίμασε ξανά!", en: "Your spacecraft crashes. Try again!" },
        rewards: { coins: 5, xp: 5 },
        bad: true,
      },
    },
  },

  {
    id: "math_kingdom",
    title: { el: "🧮 Βασίλειο των Μαθηματικών", en: "🧮 Math Kingdom" },
    description: {
      el: "Σώσε τη βασίλισσα των αριθμών λύνοντας μαθηματικές προκλήσεις!",
      en: "Save the queen of numbers by solving math challenges!",
    },
    age: "6-8",
    subject: "math",
    minutes: 8,
    nodes: {
      start: {
        scene: "🏰",
        text: { el: "Φτάνεις στο βασίλειο. Ο φύλακας ζητά μαθηματικά.", en: "You arrive at the kingdom. Guard asks math." },
        type: "quiz",
        question: { el: "5 + 7 = ?", en: "5 + 7 = ?" },
        options: [{ el: "10", en: "10" }, { el: "11", en: "11" }, { el: "12", en: "12" }, { el: "13", en: "13" }],
        correct: 2,
        onCorrect: { next: "garden", reward: 10 },
        onWrong: { next: "start", retry: true },
      },
      garden: {
        scene: "🌳",
        text: { el: "Στον κήπο! Διάλεξε μονοπάτι.", en: "In the garden! Pick a path." },
        type: "choice",
        choices: [
          { label: { el: "Κρυστάλλινη πύλη", en: "Crystal gate" }, next: "crystal_q" },
          { label: { el: "Δάσος της σκιάς", en: "Shadow forest" }, next: "shadow_q" },
        ],
      },
      crystal_q: {
        scene: "💎",
        text: { el: "10 κρύσταλλοι, βγάζεις 4. Πόσοι μένουν;", en: "10 crystals, take 4. How many left?" },
        type: "quiz",
        question: { el: "10 - 4 = ?", en: "10 - 4 = ?" },
        options: [{ el: "4", en: "4" }, { el: "5", en: "5" }, { el: "6", en: "6" }, { el: "7", en: "7" }],
        correct: 2,
        onCorrect: { next: "queen", reward: 15 },
        onWrong: { next: "ending_lost" },
      },
      shadow_q: {
        scene: "🌑",
        text: { el: "Σκοτάδι! 3 × 4 = ;", en: "Darkness! 3 × 4 = ?" },
        type: "quiz",
        question: { el: "3 × 4 = ?", en: "3 × 4 = ?" },
        options: [{ el: "10", en: "10" }, { el: "11", en: "11" }, { el: "12", en: "12" }, { el: "14", en: "14" }],
        correct: 2,
        onCorrect: { next: "queen", reward: 20 },
        onWrong: { next: "ending_lost" },
      },
      queen: {
        scene: "👸",
        text: { el: "Φτάνεις στη βασίλισσα! Τελευταία πρόκληση: 8 + 5 = ;", en: "You reach the queen! Final: 8 + 5 = ?" },
        type: "quiz",
        question: { el: "8 + 5 = ?", en: "8 + 5 = ?" },
        options: [{ el: "12", en: "12" }, { el: "13", en: "13" }, { el: "14", en: "14" }, { el: "15", en: "15" }],
        correct: 1,
        onCorrect: { next: "ending_hero", reward: 30 },
        onWrong: { next: "ending_lost" },
      },
      ending_hero: {
        scene: "👑",
        ending: "hero",
        text: { el: "ΣΩΖΕΙΣ ΤΗ ΒΑΣΙΛΙΣΣΑ! Τέλειο τέλος!", en: "YOU SAVED THE QUEEN! Best ending!" },
        rewards: { coins: 80, xp: 40 },
        bestEnding: true,
      },
      ending_lost: {
        scene: "😢",
        ending: "lost",
        text: { el: "Χάνεσαι στο βασίλειο. Δοκίμασε ξανά!", en: "Lost in the kingdom. Try again!" },
        rewards: { coins: 10, xp: 8 },
        bad: true,
      },
    },
  },
];

const KEY = "geo:narrative:";

export const NarrativeService = {
  /** Save player's progress (current node + flags + visited nodes). */
  saveProgress(adventureId, state) {
    try { localStorage.setItem(KEY + adventureId, JSON.stringify(state)); } catch {}
  },

  loadProgress(adventureId) {
    try {
      const s = localStorage.getItem(KEY + adventureId);
      if (s) return JSON.parse(s);
    } catch {}
    return { currentNode: "start", flags: {}, visited: [], totalRewards: 0, completed: false, ending: null };
  },

  resetProgress(adventureId) {
    try { localStorage.removeItem(KEY + adventureId); } catch {}
  },

  getAdventure(id) {
    return NARRATIVE_ADVENTURES.find((a) => a.id === id) || null;
  },

  getAllProgress() {
    const result = {};
    for (const a of NARRATIVE_ADVENTURES) {
      result[a.id] = this.loadProgress(a.id);
    }
    return result;
  },
};
