// Curated Curriculum Packs: pre-made bundles of lessons + quizzes + worksheets
// teachers can deploy with one click. Each pack defines:
//   - meta (title, description, age, subject, difficulty, duration)
//   - lessons: list of lesson topics
//   - quizzes: list of quiz topics
//   - worksheets: list of worksheet types
//   - games: list of game IDs to include (links into existing platform games)
// Teachers click "Deploy" → a classroom is created with all this content.

export const CURRICULUM_PACKS = [
  {
    id: "math_grade1",
    title: { el: "🧮 Μαθηματικά Α' Δημοτικού", en: "🧮 Math Grade 1" },
    description: {
      el: "Πλήρες πακέτο για την πρώτη χρονιά: αριθμοί, πρόσθεση, αφαίρεση, σχήματα.",
      en: "Complete first-grade pack: numbers, addition, subtraction, shapes.",
    },
    subject: "math",
    age: "6-8",
    difficulty: "easy",
    duration: { el: "4 εβδομάδες", en: "4 weeks" },
    color: "from-blue-500 to-cyan-500",
    icon: "🔢",
    lessons: [
      { title: { el: "Αριθμοί 1-10", en: "Numbers 1-10" }, theory: { el: "Μάθε να μετράς από 1 έως 10.", en: "Learn to count from 1 to 10." } },
      { title: { el: "Αριθμοί 11-20", en: "Numbers 11-20" }, theory: { el: "Συνεχίζουμε με αριθμούς 11-20.", en: "Continue with numbers 11-20." } },
      { title: { el: "Πρόσθεση μέχρι 10", en: "Addition up to 10" }, theory: { el: "Πώς προσθέτουμε αριθμούς.", en: "How to add numbers." } },
      { title: { el: "Αφαίρεση μέχρι 10", en: "Subtraction up to 10" }, theory: { el: "Πώς αφαιρούμε αριθμούς.", en: "How to subtract numbers." } },
      { title: { el: "Σχήματα", en: "Shapes" }, theory: { el: "Κύκλοι, τετράγωνα, τρίγωνα.", en: "Circles, squares, triangles." } },
    ],
    quizzes: [
      { title: { el: "Quiz: Αριθμοί 1-10", en: "Quiz: Numbers 1-10" }, count: 10 },
      { title: { el: "Quiz: Πρόσθεση", en: "Quiz: Addition" }, count: 10 },
      { title: { el: "Quiz: Σχήματα", en: "Quiz: Shapes" }, count: 8 },
    ],
    worksheets: ["math_basic", "addition", "shapes"],
    games: ["counting", "addition-game", "shape-sorter"],
  },

  {
    id: "greek_easter",
    title: { el: "🐣 Πασχαλινό Πακέτο", en: "🐣 Greek Easter Pack" },
    description: {
      el: "Έθιμα, παραμύθια και παιχνίδια για το Πάσχα στα Ελληνικά.",
      en: "Traditions, stories and games for Greek Easter.",
    },
    subject: "culture",
    age: "6-12",
    difficulty: "medium",
    duration: { el: "1 εβδομάδα", en: "1 week" },
    color: "from-rose-500 to-pink-500",
    icon: "🥚",
    seasonal: "spring",
    lessons: [
      { title: { el: "Έθιμα του Πάσχα", en: "Easter traditions" }, theory: { el: "Τι κάνουμε στο Πάσχα στην Ελλάδα.", en: "What we do for Greek Easter." } },
      { title: { el: "Πασχαλινά αυγά", en: "Easter eggs" }, theory: { el: "Πώς βάφουμε τα αυγά.", en: "How we color eggs." } },
      { title: { el: "Λαμπάδες", en: "Easter candles" }, theory: { el: "Σύμβολα του Πάσχα.", en: "Symbols of Easter." } },
    ],
    quizzes: [
      { title: { el: "Quiz: Πασχαλινά Έθιμα", en: "Quiz: Easter Traditions" }, count: 10 },
    ],
    worksheets: ["el_vocabulary", "el_alphabet"],
    games: ["egg-hunt", "memory-eggs"],
  },

  {
    id: "language_alphabet",
    title: { el: "📖 Ελληνικό Αλφάβητο", en: "📖 Greek Alphabet" },
    description: {
      el: "Όλα τα γράμματα, ήχοι και πρώτες λέξεις. Ιδανικό για προνηπιαγωγείο.",
      en: "All letters, sounds and first words. Perfect for kindergarten.",
    },
    subject: "language_el",
    age: "4-6",
    difficulty: "easy",
    duration: { el: "3 εβδομάδες", en: "3 weeks" },
    color: "from-amber-500 to-orange-500",
    icon: "Α",
    lessons: [
      { title: { el: "Φωνήεντα", en: "Vowels" }, theory: { el: "Α, Ε, Η, Ι, Ο, Υ, Ω", en: "Α, Ε, Η, Ι, Ο, Υ, Ω" } },
      { title: { el: "Σύμφωνα", en: "Consonants" }, theory: { el: "Όλα τα σύμφωνα.", en: "All consonants." } },
      { title: { el: "Πρώτες συλλαβές", en: "First syllables" }, theory: { el: "ΜΑ, ΠΑ, ΛΑ...", en: "ΜΑ, ΠΑ, ΛΑ..." } },
    ],
    quizzes: [
      { title: { el: "Quiz: Φωνήεντα", en: "Quiz: Vowels" }, count: 7 },
      { title: { el: "Quiz: Γράμματα", en: "Quiz: Letters" }, count: 12 },
    ],
    worksheets: ["el_alphabet", "el_spelling"],
    games: ["alphabet-match", "letter-tracing"],
  },

  {
    id: "science_space",
    title: { el: "🚀 Διάστημα & Πλανήτες", en: "🚀 Space & Planets" },
    description: {
      el: "Ταξίδι στο διάστημα: ηλιακό σύστημα, αστέρια, αστροναύτες.",
      en: "Space adventure: solar system, stars, astronauts.",
    },
    subject: "science",
    age: "9-12",
    difficulty: "medium",
    duration: { el: "2 εβδομάδες", en: "2 weeks" },
    color: "from-violet-500 to-purple-600",
    icon: "🌌",
    lessons: [
      { title: { el: "Το Ηλιακό μας Σύστημα", en: "Our Solar System" }, theory: { el: "8 πλανήτες γύρω από τον Ήλιο.", en: "8 planets around the Sun." } },
      { title: { el: "Η Σελήνη", en: "The Moon" }, theory: { el: "Πώς λάμπει η Σελήνη;", en: "How the Moon shines." } },
      { title: { el: "Αστέρια & Γαλαξίες", en: "Stars & Galaxies" }, theory: { el: "Δισεκατομμύρια αστέρια!", en: "Billions of stars!" } },
      { title: { el: "Αστροναύτες", en: "Astronauts" }, theory: { el: "Πώς ζουν στο διάστημα.", en: "Life in space." } },
    ],
    quizzes: [
      { title: { el: "Quiz: Πλανήτες", en: "Quiz: Planets" }, count: 10 },
      { title: { el: "Quiz: Διάστημα", en: "Quiz: Space" }, count: 8 },
    ],
    worksheets: ["science", "vocabulary"],
    games: ["space-adventure", "planet-match"],
  },

  {
    id: "english_starter",
    title: { el: "🇬🇧 Αγγλικά για Αρχάριους", en: "🇬🇧 English Starter" },
    description: {
      el: "Πρώτες λέξεις & φράσεις στα Αγγλικά: χρώματα, αριθμοί, καθημερινές φράσεις.",
      en: "First English words & phrases: colors, numbers, daily phrases.",
    },
    subject: "language_en",
    age: "6-10",
    difficulty: "easy",
    duration: { el: "4 εβδομάδες", en: "4 weeks" },
    color: "from-emerald-500 to-teal-500",
    icon: "🅰️",
    lessons: [
      { title: { el: "Χρώματα", en: "Colors" }, theory: { el: "Red, blue, green...", en: "Red, blue, green..." } },
      { title: { el: "Αριθμοί 1-20", en: "Numbers 1-20" }, theory: { el: "One, two, three...", en: "One, two, three..." } },
      { title: { el: "Χαιρετισμοί", en: "Greetings" }, theory: { el: "Hello, goodbye, thanks...", en: "Hello, goodbye, thanks..." } },
      { title: { el: "Οικογένεια", en: "Family" }, theory: { el: "Mother, father, brother...", en: "Mother, father, brother..." } },
    ],
    quizzes: [
      { title: { el: "Quiz: Λέξεις", en: "Quiz: Words" }, count: 12 },
      { title: { el: "Quiz: Χρώματα", en: "Quiz: Colors" }, count: 8 },
    ],
    worksheets: ["en_alphabet", "en_vocabulary"],
    games: ["color-match", "word-spelling"],
  },

  {
    id: "olympics_pack",
    title: { el: "🏅 Ολυμπιακοί Αγώνες", en: "🏅 Olympics Pack" },
    description: {
      el: "Ιστορία, αθλήματα, ιδανικά. Ιδανικό σε χρονιά Ολυμπιακών.",
      en: "History, sports, ideals. Perfect for Olympic years.",
    },
    subject: "history",
    age: "9-15",
    difficulty: "medium",
    duration: { el: "2 εβδομάδες", en: "2 weeks" },
    color: "from-yellow-500 to-amber-500",
    icon: "🥇",
    seasonal: "summer",
    lessons: [
      { title: { el: "Αρχαίοι Ολυμπιακοί", en: "Ancient Olympics" }, theory: { el: "Ιστορία από την αρχαία Ελλάδα.", en: "History from ancient Greece." } },
      { title: { el: "Σύγχρονοι Ολυμπιακοί", en: "Modern Olympics" }, theory: { el: "Από το 1896 μέχρι σήμερα.", en: "From 1896 to today." } },
      { title: { el: "Αθλήματα", en: "Sports" }, theory: { el: "Πόσα αθλήματα υπάρχουν;", en: "How many sports are there?" } },
      { title: { el: "Σύμβολα", en: "Symbols" }, theory: { el: "Κρίκοι, φλόγα, μετάλλια.", en: "Rings, torch, medals." } },
    ],
    quizzes: [
      { title: { el: "Quiz: Ολυμπιακοί", en: "Quiz: Olympics" }, count: 10 },
    ],
    worksheets: ["history", "vocabulary"],
    games: ["sport-match"],
  },

  {
    id: "logic_puzzles",
    title: { el: "🧠 Λογική & Γρίφοι", en: "🧠 Logic & Puzzles" },
    description: {
      el: "Παιχνίδια λογικής που γυμνάζουν τον νου των μαθητών.",
      en: "Logic games that exercise students' minds.",
    },
    subject: "logic",
    age: "8-15",
    difficulty: "hard",
    duration: { el: "Συνεχόμενο", en: "Ongoing" },
    color: "from-slate-700 to-slate-500",
    icon: "🧩",
    lessons: [
      { title: { el: "Μνήμη", en: "Memory" }, theory: { el: "Πώς να βελτιώσεις τη μνήμη.", en: "How to improve memory." } },
      { title: { el: "Λογική σκέψη", en: "Logical thinking" }, theory: { el: "Συμπεράσματα και υποθέσεις.", en: "Inferences and hypotheses." } },
      { title: { el: "Γρίφοι", en: "Riddles" }, theory: { el: "Λύνουμε γρίφους βήμα-βήμα.", en: "Solving riddles step by step." } },
    ],
    quizzes: [
      { title: { el: "Quiz: Λογική", en: "Quiz: Logic" }, count: 10 },
    ],
    worksheets: ["el_word_problems", "logic"],
    games: ["sudoku", "memory-game", "pattern-match"],
  },

  {
    id: "social_skills",
    title: { el: "💬 Κοινωνικές Δεξιότητες", en: "💬 Social Skills" },
    description: {
      el: "Συναισθήματα, κανόνες, ευγένεια, εκφοβισμός — μάθημα ζωής.",
      en: "Feelings, rules, kindness, anti-bullying — life lessons.",
    },
    subject: "social",
    age: "5-10",
    difficulty: "easy",
    duration: { el: "Συνεχόμενο", en: "Ongoing" },
    color: "from-pink-500 to-rose-400",
    icon: "💖",
    lessons: [
      { title: { el: "Συναισθήματα", en: "Emotions" }, theory: { el: "Αναγνωρίζω τα συναισθήματά μου.", en: "Recognizing my feelings." } },
      { title: { el: "Φιλία", en: "Friendship" }, theory: { el: "Πώς να είμαι καλός φίλος.", en: "How to be a good friend." } },
      { title: { el: "Κατά του εκφοβισμού", en: "Anti-bullying" }, theory: { el: "Όχι στον εκφοβισμό.", en: "Say no to bullying." } },
    ],
    quizzes: [
      { title: { el: "Quiz: Συναισθήματα", en: "Quiz: Emotions" }, count: 8 },
    ],
    worksheets: ["social"],
    games: ["emotion-match", "kindness-quest"],
  },
];

const KEY_DEPLOYED = "geo:deployed-packs";

export const CurriculumPackService = {
  getAll() { return CURRICULUM_PACKS; },
  get(id) { return CURRICULUM_PACKS.find((p) => p.id === id) || null; },

  getDeployed() {
    try { return JSON.parse(localStorage.getItem(KEY_DEPLOYED) || "[]"); } catch { return []; }
  },

  /** "Deploy" a pack: persist into the teacher's local list (and emit event for analytics). */
  deploy(packId, opts = {}) {
    const list = this.getDeployed();
    if (list.find((d) => d.packId === packId)) return list;
    const item = { packId, deployedAt: Date.now(), classroomCode: opts.classroomCode || null };
    list.unshift(item);
    try { localStorage.setItem(KEY_DEPLOYED, JSON.stringify(list)); } catch {}
    try { window.dispatchEvent(new CustomEvent("geo:pack-deployed", { detail: item })); } catch {}
    return list;
  },

  undeploy(packId) {
    const list = this.getDeployed().filter((d) => d.packId !== packId);
    try { localStorage.setItem(KEY_DEPLOYED, JSON.stringify(list)); } catch {}
    return list;
  },

  filter({ subject, age, difficulty, search, seasonal } = {}) {
    return CURRICULUM_PACKS.filter((p) => {
      if (subject && p.subject !== subject) return false;
      if (age && p.age !== age) return false;
      if (difficulty && p.difficulty !== difficulty) return false;
      if (seasonal && p.seasonal !== seasonal) return false;
      if (search) {
        const t = search.toLowerCase();
        const title = (p.title.el + " " + p.title.en).toLowerCase();
        const desc = (p.description.el + " " + p.description.en).toLowerCase();
        if (!title.includes(t) && !desc.includes(t)) return false;
      }
      return true;
    });
  },
};
