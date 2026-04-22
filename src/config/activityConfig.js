export const AGE_GROUP_CONFIG = {
  "4-5": {
    folderKey: "4_5",
    title: {
      el: "Ηλικία 4-5: Προετοιμασία για το Σχολείο",
      en: "Age 4-5: School Preparation",
    },
  },
  "6": {
    folderKey: "6",
    title: {
      el: "Ηλικία 6: Σχολείο Α' Δημοτικού",
      en: "Age 6: 1st Grade School",
    },
  },
  "7-8": {
    folderKey: "7_8",
    title: {
      el: "Ηλικία 7-8: Σχολείο Β'-Γ' Δημοτικού",
      en: "Age 7-8: 2nd-3rd Grade School",
    },
  },
  "9-10": {
    folderKey: "9_10",
    title: {
      el: "Ηλικία 9-10: Σχολείο Δ'-Ε' Δημοτικού",
      en: "Age 9-10: 4th-5th Grade School",
    },
  },
  "11-12": {
    folderKey: "11_12",
    title: {
      el: "Ηλικία 11-12: Σχολείο ΣΤ' Δημοτικού",
      en: "Age 11-12: 6th Grade School",
    },
  },
};

export const ACTIVITY_TO_COMPONENT = {
  // ─── Shared exercises (exercises_shared/) ───────────────────────
  letterSound: "LetterSound",
  letterMatch: "LetterMatch",
  storyChoices: "StoryChoices",
  findRhyme: "FindRhyme",
  breakWord: "BreakWord",
  countApples: "CountApples",
  colorSorter: "ColorSorter",
  sizeSequence: "SizeSequence",
  whichHasMore: "WhichHasMore",
  patternBuilder: "PatternBuilder",
  numberRecognition: "NumberRecognition",
  lineTracing: "LineTracing",
  connectDots: "ConnectDots",
  colorInBounds: "ColorInBounds",
  letterTracing: "LetterTracing",
  freeLetterWriting: "FreeLetterWriting",
  memoryCards: "MemoryCards",
  spotTheDifference: "SpotTheDifference",
  whatsMissing: "WhatsMissing",
  matchPairs: "MatchPairs",
  howDoTheyFeel: "HowDoTheyFeel",
  classroomRules: "ClassroomRules",
  emotionalStories: "EmotionalStories",
  followInstructions: "FollowInstructions",
  dailyRoutine: "DailyRoutine",
  introduceYourself: "IntroduceYourself",
  gettingDressed: "GettingDressed",
  handWashing: "HandWashing",
  classroomTidying: "ClassroomTidying",
  expressingNeeds: "ExpressingNeeds",
  tableSetting: "TableSetting",

  // ─── Age-specific components (exercises_*_1 folders) ────────────
  // Common across multiple age folders:
  completeSentence: "CompleteSentenceGame",
  findMissingNumber: "FindMissingNumberGame",
  patternRecognition: "PatternRecognitionGame",
  guessWhat: "GuessWhatGame",
  whatRemains: "WhatRemainsGame",
  doTheRightThing: "DoTheRightThingGame",
  helpYourFriend: "HelpYourFriendGame",
  howDoesItFeelAdv: "HowDoesItFeelGame",
  guessEmotionFromVoice: "GuessEmotionFromVoiceGame",
  whoWaitsInLine: "WhoWaitsInLineGame",
  combineTwoImages: "CombineTwoImagesGame",

  // exercises_6_1 unique:
  spellingGame: "SpellingGame",
  readingGame: "ReadingGame",
  timeClockGame: "TimeClockGame",
  moneyRecognition: "MoneyRecognitionGame",
  scienceExperiments: "ScienceExperimentsGame",
  simpleGeography: "SimpleGeographyGame",
  findMissingLetter: "FindTheMissingLetterGame",
  findTheSum: "FindTheSumGame",
  findTheSumPair: "FindTheSumPairGame",
  miniPuzzle: "MiniPuzzleGame",
  driveTheCar: "DriveTheCarGame",

  // exercises_7_8_1 unique:
  colorShapeGame: "ColorShapeGame",
  storyBuilderGame: "StoryBuilderGame",
  findTheWord: "FindTheWordGame",
  numberAdventure: "NumberAdventureGame",
  simpleLogicPuzzle: "SimpleLogicPuzzleGame",

  // exercises_11_12_1 unique:
  timelineGame: "TimelineGame",
  debugTheCode: "DebugTheCodeGame",
  equationBalancer: "EquationBalancerGame",
  analogiesGame: "AnalogiesGame",
  sequenceDecoder: "SequenceDecoderGame",
  codeBreaker: "CodeBreakerGame",
  geographyQuiz: "GeographyQuizGame",
  inventorQuiz: "InventorQuizGame",
  logicGridPuzzle: "LogicGridPuzzleGame",
  mathBattle: "MathBattleGame",
  musicRhythm: "MusicRhythmGame",
  mythologyQuiz: "MythologyQuizGame",
  percentageCalc: "PercentageCalcGame",
  scienceLab: "ScienceLabGame",
  spaceExplorer: "SpaceExplorerGame",
  wordBuilder: "WordBuilderGame",
};

// ─── Default categories (kept for backward compat) ────────────────

export const CATEGORIES = [
  {
    id: "languageDev",
    title: { el: "Γλωσσική Ανάπτυξη & Προ-Ανάγνωση", en: "Language Development & Pre-Reading" },
    icon: "📚",
    color: "from-blue-400 to-purple-500",
    description: {
      el: "🎯 Αναγνωρίζουν βασικά γράμματα (κυρίως κεφαλαία). Εντοπίζουν αρχικό ήχο (π.χ. /α/ όπως «αυγό»). Διαχωρίζουν λέξεις σε απλές συλλαβές. Ακούν και κατανοούν μια απλή ιστορία. Εμπλουτίζουν λεξιλόγιο.",
      en: "🎯 Recognize basic letters (mainly capitals). Identify initial sounds (e.g. /a/ as in 'apple'). Break words into simple syllables. Listen and understand a simple story. Enrich vocabulary.",
    },
  },
  {
    id: "mathSkills",
    title: { el: "Μαθηματικά - Προμαθηματικές Δεξιότητες", en: "Mathematics - Pre-Math Skills" },
    icon: "🔢",
    color: "from-green-400 to-teal-500",
    description: {
      el: "🎯 Μετράνε μέχρι το 10 ή 20. Κατανοούν ποσότητες («περισσότερα–λιγότερα»). Ταξινομούν αντικείμενα με βάση χρώμα, μέγεθος, σχήμα. Αναγνωρίζουν βασικά σχήματα (κύκλος, τετράγωνο, τρίγωνο, ορθογώνιο). Ολοκληρώνουν μοτίβα (Α–Β–Α–Β).",
      en: "🎯 Count up to 10 or 20. Understand quantities ('more-less'). Sort objects by color, size, shape. Recognize basic shapes (circle, square, triangle, rectangle). Complete patterns (A–B–A–B).",
    },
  },
  {
    id: "fineMotor",
    title: { el: "Λεπτή Κινητικότητα - Προγραφή", en: "Fine Motor Skills - Pre-Writing" },
    icon: "✏️",
    color: "from-red-400 to-pink-500",
    description: {
      el: "🎯 Ελέγχουν καλύτερα τα δάχτυλα και το χέρι. Μπορούν να κρατούν σωστά το μολύβι. Μαθαίνουν να ακολουθούν γραμμές και σχήματα.",
      en: "🎯 Better control of fingers and hand. Can hold pencil correctly. Learn to follow lines and shapes.",
    },
  },
  {
    id: "cognitiveSkills",
    title: { el: "Γνωστικές Δεξιότητες - Λογική Σκέψη", en: "Cognitive Skills - Logical Thinking" },
    icon: "🧠",
    color: "from-violet-400 to-fuchsia-500",
    description: {
      el: "🎯 Αναπτύσσουν μνήμη, παρατηρητικότητα και λογική. Λύνουν απλά προβλήματα. Κατανοούν σχέσεις αντικειμένων.",
      en: "🎯 Develop memory, observation and logic. Solve simple problems. Understand object relationships.",
    },
  },
  {
    id: "socialEmotional",
    title: { el: "Κοινωνικο-Συναισθηματικές Δεξιότητες", en: "Social-Emotional Skills" },
    icon: "❤️",
    color: "from-pink-400 to-rose-500",
    description: {
      el: "🎯 Αναγνωρίζουν και ονομάζουν συναισθήματα. Μαθαίνουν κανόνες συμπεριφοράς στο σχολείο. Ασκούν δεξιότητες συνεργασίας. Λύνουν μικρές συγκρούσεις.",
      en: "🎯 Recognize and name emotions. Learn school behavior rules. Practice cooperation skills. Resolve small conflicts.",
    },
  },
  {
    id: "communicationDaily",
    title: { el: "Δεξιότητες Επικοινωνίας & Καθημερινή Λειτουργικότητα", en: "Communication Skills & Daily Functionality" },
    icon: "🗣️",
    color: "from-teal-400 to-cyan-500",
    description: {
      el: "🎯 Ακούν και ακολουθούν οδηγίες 1–2 βημάτων. Μαθαίνουν τρόπους να εκφράζουν ανάγκες. Γνωρίζουν καθημερινές ρουτίνες (έναρξη σχολείου, τακτοποίηση, πλύσιμο χεριών).",
      en: "🎯 Listen and follow 1-2 step instructions. Learn ways to express needs. Know daily routines (school start, tidying up, hand washing).",
    },
  },
  {
    id: "selfCare",
    title: { el: "Αυτοεξυπηρέτηση", en: "Self-Care" },
    icon: "🤲",
    color: "from-emerald-400 to-lime-500",
    description: {
      el: "🎯 Μικρή αυτονομία σε απλές καθημερινές πράξεις.",
      en: "🎯 Small autonomy in simple daily tasks.",
    },
  },
];

export const ACTIVITIES = {
  languageDev: [
    { id: "letterSound", title: { el: "Ποιο γράμμα ακούς;", en: "What letter do you hear?" }, icon: "🔤", description: { el: "Άκουσε το γράμμα και διάλεξε τις σωστές εικόνες", en: "Hear the letter and choose the right images" }, color: "from-blue-400 to-purple-500" },
    { id: "letterMatch", title: { el: "Ταίριαξε Γράμμα - Λέξη", en: "Match Letter - Word" }, icon: "🎯", description: { el: "Σύρε την εικόνα στο σωστό γράμμα", en: "Drag the image to the correct letter" }, color: "from-green-400 to-blue-500" },
    { id: "storyChoices", title: { el: "Ιστορίες με Επιλογές", en: "Stories with Choices" }, icon: "📖", description: { el: "Διάβασε την ιστορία και απάντησε τις ερωτήσεις", en: "Read the story and answer the questions" }, color: "from-yellow-400 to-orange-500" },
    { id: "findRhyme", title: { el: "Βρες τη Ρίμα", en: "Find the Rhyme" }, icon: "🎵", description: { el: "Βρες ποια λέξη κάνει ρίμα με την εικόνα", en: "Find which word rhymes with the image" }, color: "from-pink-400 to-purple-500" },
    { id: "breakWord", title: { el: "Σπασ' τη Λέξη", en: "Break the Word" }, icon: "👏", description: { el: "Πάτα τις συλλαβές με τη σειρά", en: "Tap the syllables in order" }, color: "from-cyan-400 to-teal-500" },
  ],
  mathSkills: [
    { id: "countApples", title: { el: "Μέτρα τα Αντικείμενα", en: "Count the Objects" }, icon: "🔢", description: { el: "Πάτα τα αντικείμενα και άκουσε τον αριθμό", en: "Tap the objects and hear the number" }, color: "from-green-400 to-teal-500" },
    { id: "colorSorter", title: { el: "Ταξινομητής Χρωμάτων", en: "Color Sorter" }, icon: "🎨", description: { el: "Σύρε τα αντικείμενα στον σωστό κουβά", en: "Drag objects to the correct bucket" }, color: "from-purple-400 to-pink-500" },
    { id: "sizeSequence", title: { el: "Σειροθέτηση Μεγεθών", en: "Size Sequence" }, icon: "📏", description: { el: "Βάλε από το μικρότερο στο μεγαλύτερο", en: "Put from smallest to largest" }, color: "from-cyan-400 to-teal-500" },
    { id: "whichHasMore", title: { el: "Ποιο έχει Περισσότερα;", en: "Which Has More?" }, icon: "🔢", description: { el: "Σύγκρινε δύο ομάδες αντικειμένων", en: "Compare two groups of objects" }, color: "from-orange-400 to-green-500" },
    { id: "patternBuilder", title: { el: "Φτιάξε το Μοτίβο", en: "Build the Pattern" }, icon: "🔄", description: { el: "Συνέχισε την ακολουθία", en: "Continue the sequence" }, color: "from-purple-400 to-blue-500" },
    { id: "numberRecognition", title: { el: "Αναγνώριση Αριθμών", en: "Number Recognition" }, icon: "🔢", description: { el: "Μέτρησε και βρες τον σωστό αριθμό", en: "Count and find the correct number" }, color: "from-pink-400 to-orange-500" },
  ],
  fineMotor: [
    { id: "lineTracing", title: { el: "Ιχνογράφηση Γραμμών", en: "Line Tracing" }, icon: "✏️", description: { el: "Ακολούθησε τις γραμμές με το δάχτυλο", en: "Follow the lines with your finger" }, color: "from-red-400 to-pink-500" },
    { id: "connectDots", title: { el: "Σύνδεση Κουκκίδων", en: "Connect the Dots" }, icon: "🎨", description: { el: "Σύνδεσε τις κουκίδες για να φτιάξεις εικόνα", en: "Connect the dots to make an image" }, color: "from-blue-400 to-purple-500" },
    { id: "colorInBounds", title: { el: "Χρωμάτισε μέσα στα Όρια", en: "Color Within Bounds" }, icon: "🖍️", description: { el: "Χρωμάτισε χωρίς να βγεις έξω από τις γραμμές", en: "Color without going outside the lines" }, color: "from-yellow-400 to-orange-500" },
    { id: "letterTracing", title: { el: "Γράμματα με Ιχνηλάτηση", en: "Letter Tracing" }, icon: "📝", description: { el: "Γράψε γράμματα συνδέοντας τις κουκίδες", en: "Write letters by connecting the dots" }, color: "from-indigo-400 to-purple-500" },
    { id: "freeLetterWriting", title: { el: "Ελεύθερη Γραφή Γραμμάτων", en: "Free Letter Writing" }, icon: "✍️", description: { el: "Γράψε γράμματα ελεύθερα χωρίς κουκκίδες", en: "Write letters freely without dots" }, color: "from-rose-400 to-purple-500" },
  ],
  cognitiveSkills: [
    { id: "memoryCards", title: { el: "Κάρτες Μνήμης", en: "Memory Cards" }, icon: "🧠", description: { el: "Βρες τα ζευγάρια ζώων, γραμμάτων και σχημάτων", en: "Find pairs of animals, letters and shapes" }, color: "from-violet-400 to-fuchsia-500" },
    { id: "spotTheDifference", title: { el: "Βρες τις Διαφορές", en: "Spot the Differences" }, icon: "🔍", description: { el: "Βρες τις 5 διαφορές σε κάθε εικόνα", en: "Find the 5 differences in each image" }, color: "from-cyan-400 to-blue-500" },
    { id: "whatsMissing", title: { el: "Τι Λείπει;", en: "What's Missing?" }, icon: "❓", description: { el: "Θυμήσου τα αντικείμενα και βρες τι έλειψε", en: "Remember the items and find what's missing" }, color: "from-purple-400 to-pink-500" },
    { id: "matchPairs", title: { el: "Αντιστοίχιση Ζευγαριών", en: "Match Pairs" }, icon: "🎯", description: { el: "Ταίριαξε τα λογικά ζευγάρια", en: "Match the logical pairs" }, color: "from-indigo-400 to-cyan-500" },
  ],
  socialEmotional: [
    { id: "howDoTheyFeel", title: { el: "Πώς Νιώθει;", en: "How Do They Feel?" }, icon: "😊", description: { el: "Αναγνώρισε το συναίσθημα από την κατάσταση", en: "Recognize the emotion from the situation" }, color: "from-pink-400 to-rose-500" },
    { id: "classroomRules", title: { el: "Κανόνες Τάξης", en: "Classroom Rules" }, icon: "👍", description: { el: "Μάθε τη σωστή συμπεριφορά στο σχολείο", en: "Learn the right behavior at school" }, color: "from-blue-400 to-indigo-500" },
    { id: "emotionalStories", title: { el: "Ιστορίες Συναισθημάτων", en: "Emotional Stories" }, icon: "📖", description: { el: "Διάβασε ιστορίες και επίλεξε τη σωστή αντίδραση", en: "Read stories and choose the right reaction" }, color: "from-amber-400 to-orange-500" },
  ],
  communicationDaily: [
    { id: "followInstructions", title: { el: "Ακολούθησε τις Οδηγίες", en: "Follow Instructions" }, icon: "👂", description: { el: "Άκουσε και ακολούθησε οδηγίες 1-2 βημάτων", en: "Listen and follow 1-2 step instructions" }, color: "from-teal-400 to-cyan-500" },
    { id: "dailyRoutine", title: { el: "Η Ρουτίνα της Ημέρας", en: "Daily Routine" }, icon: "⏰", description: { el: "Τοποθέτησε τις δραστηριότητες στη σωστή σειρά", en: "Put activities in the correct order" }, color: "from-purple-400 to-indigo-500" },
    { id: "introduceYourself", title: { el: "Παρουσίασε τον Εαυτό σου", en: "Introduce Yourself" }, icon: "👤", description: { el: "Επίλεξε τι σου αρέσει και τι όχι", en: "Choose what you like and don't like" }, color: "from-orange-400 to-amber-500" },
  ],
  selfCare: [
    { id: "gettingDressed", title: { el: "Ντύσιμο", en: "Getting Dressed" }, icon: "👕", description: { el: "Μάθε να ντύνεσαι μόνος σου", en: "Learn to dress yourself" }, color: "from-green-400 to-teal-500" },
    { id: "handWashing", title: { el: "Πλύσιμο Χεριών", en: "Hand Washing" }, icon: "🧼", description: { el: "Μάθε να πλένεις τα χέρια σου σωστά", en: "Learn to wash your hands properly" }, color: "from-blue-400 to-cyan-500" },
    { id: "classroomTidying", title: { el: "Τακτοποίηση Τάξης", en: "Classroom Tidying" }, icon: "🧹", description: { el: "Μάθε να κρατάς την τάξη σου τακτοποιημένη", en: "Learn to keep your classroom tidy" }, color: "from-yellow-400 to-orange-500" },
    { id: "expressingNeeds", title: { el: "Εκφρασμός Αναγκών", en: "Expressing Needs" }, icon: "💬", description: { el: "Μάθε να εκφράζεις τις ανάγκες σου", en: "Learn to express your needs" }, color: "from-pink-400 to-purple-500" },
    { id: "tableSetting", title: { el: "Στρώσιμο Τραπεζιού", en: "Table Setting" }, icon: "🍽️", description: { el: "Μάθε να στρώνεις το τραπέζι", en: "Learn to set the table" }, color: "from-orange-400 to-amber-500" },
  ],
};

// ═══════════════════════════════════════════════════════════════════
//  AGE-DIFFERENTIATED CATEGORIES & ACTIVITIES
// ═══════════════════════════════════════════════════════════════════

const CAT_LANGUAGE_YOUNG = {
  id: "languageDev",
  title: { el: "Γλωσσική Ανάπτυξη & Προ-Ανάγνωση", en: "Language Development & Pre-Reading" },
  icon: "📚", color: "from-blue-400 to-purple-500",
  description: { el: "Γράμματα, ήχοι, ρίμες, ιστορίες", en: "Letters, sounds, rhymes, stories" },
};

const CAT_MATH_YOUNG = {
  id: "mathSkills",
  title: { el: "Μαθηματικά - Προμαθηματικές Δεξιότητες", en: "Mathematics - Pre-Math Skills" },
  icon: "🔢", color: "from-green-400 to-teal-500",
  description: { el: "Αρίθμηση, μοτίβα, σχήματα, σύγκριση", en: "Counting, patterns, shapes, comparison" },
};

const CAT_FINE_MOTOR = {
  id: "fineMotor",
  title: { el: "Λεπτή Κινητικότητα - Προγραφή", en: "Fine Motor Skills - Pre-Writing" },
  icon: "✏️", color: "from-red-400 to-pink-500",
  description: { el: "Γραμμές, κουκκίδες, γράμματα", en: "Lines, dots, letters" },
};

const CAT_COGNITIVE_YOUNG = {
  id: "cognitiveSkills",
  title: { el: "Γνωστικές Δεξιότητες", en: "Cognitive Skills" },
  icon: "🧠", color: "from-violet-400 to-fuchsia-500",
  description: { el: "Μνήμη, παρατηρητικότητα, λογική", en: "Memory, observation, logic" },
};

const CAT_SOCIAL = {
  id: "socialEmotional",
  title: { el: "Κοινωνικο-Συναισθηματικά", en: "Social-Emotional" },
  icon: "❤️", color: "from-pink-400 to-rose-500",
  description: { el: "Συναισθήματα, κανόνες, συνεργασία", en: "Emotions, rules, cooperation" },
};

const CAT_COMM = {
  id: "communicationDaily",
  title: { el: "Επικοινωνία & Καθημερινότητα", en: "Communication & Daily Skills" },
  icon: "🗣️", color: "from-teal-400 to-cyan-500",
  description: { el: "Οδηγίες, ρουτίνα, έκφραση αναγκών", en: "Instructions, routines, expressing needs" },
};

const CAT_SELF_CARE = {
  id: "selfCare",
  title: { el: "Αυτοεξυπηρέτηση", en: "Self-Care" },
  icon: "🤲", color: "from-emerald-400 to-lime-500",
  description: { el: "Αυτονομία σε καθημερινές πράξεις", en: "Autonomy in daily tasks" },
};

// ─── Activity definitions for reused components ───────────────────

const ACT = {
  completeSentence:     { id: "completeSentence",     title: { el: "Συμπλήρωσε την Πρόταση", en: "Complete the Sentence" },     icon: "📝", description: { el: "Διάλεξε τη λέξη που ταιριάζει στην πρόταση", en: "Choose the word that fits the sentence" }, color: "from-blue-400 to-indigo-500" },
  findMissingNumber:    { id: "findMissingNumber",    title: { el: "Βρες τον Αριθμό", en: "Find the Missing Number" },          icon: "🔢", description: { el: "Βρες ποιος αριθμός λείπει από τη σειρά", en: "Find which number is missing" }, color: "from-green-400 to-emerald-500" },
  patternRecognition:   { id: "patternRecognition",   title: { el: "Αναγνώριση Μοτίβου", en: "Pattern Recognition" },           icon: "🔄", description: { el: "Βρες τι ακολουθεί στο μοτίβο", en: "Find what comes next in the pattern" }, color: "from-purple-400 to-violet-500" },
  guessWhat:            { id: "guessWhat",            title: { el: "Μάντεψε τι Είναι", en: "Guess What It Is" },                icon: "🤔", description: { el: "Δες τη μερική εικόνα και μάντεψε", en: "See the partial image and guess" }, color: "from-amber-400 to-yellow-500" },
  whatRemains:          { id: "whatRemains",          title: { el: "Τι Απομένει;", en: "What Remains?" },                        icon: "🧩", description: { el: "Βρες τι μένει μετά τη λογική αφαίρεση", en: "Find what remains after logical subtraction" }, color: "from-teal-400 to-green-500" },
  doTheRightThing:      { id: "doTheRightThing",      title: { el: "Κάνε το Σωστό", en: "Do the Right Thing" },                 icon: "👍", description: { el: "Επίλεξε τη σωστή ηθική αντίδραση", en: "Choose the right moral response" }, color: "from-blue-400 to-cyan-500" },
  helpYourFriend:       { id: "helpYourFriend",       title: { el: "Βοήθησε τον Φίλο σου", en: "Help Your Friend" },            icon: "🤝", description: { el: "Τι θα έκανες για να βοηθήσεις;", en: "What would you do to help?" }, color: "from-pink-400 to-rose-500" },
  howDoesItFeelAdv:     { id: "howDoesItFeelAdv",     title: { el: "Τι Νιώθεις;", en: "How Does It Feel?" },                    icon: "💭", description: { el: "Αναγνώρισε τα συναισθήματα στην ιστορία", en: "Recognize emotions in the story" }, color: "from-rose-400 to-pink-500" },
  guessEmotionFromVoice:{ id: "guessEmotionFromVoice",title: { el: "Μάντεψε το Συναίσθημα", en: "Guess the Emotion" },          icon: "🎭", description: { el: "Ακούσε και αναγνώρισε το συναίσθημα", en: "Listen and recognize the emotion" }, color: "from-violet-400 to-purple-500" },
  whoWaitsInLine:       { id: "whoWaitsInLine",       title: { el: "Ποιος Περιμένει;", en: "Who Waits in Line?" },               icon: "🚶", description: { el: "Μάθε για τη σειρά και τους κανόνες", en: "Learn about order and rules" }, color: "from-indigo-400 to-blue-500" },
  combineTwoImages:     { id: "combineTwoImages",     title: { el: "Συνδύασε τις Εικόνες", en: "Combine Two Images" },          icon: "🖼️", description: { el: "Ένωσε τις εικόνες σε μια ιστορία", en: "Connect images into a story" }, color: "from-orange-400 to-red-500" },

  spellingGame:         { id: "spellingGame",         title: { el: "Ορθογραφία", en: "Spelling" },                               icon: "📝", description: { el: "Γράψε σωστά τη λέξη", en: "Spell the word correctly" }, color: "from-blue-400 to-purple-500" },
  readingGame:          { id: "readingGame",          title: { el: "Ανάγνωση", en: "Reading" },                                  icon: "📖", description: { el: "Διάβασε και απάντησε", en: "Read and answer" }, color: "from-green-400 to-teal-500" },
  timeClockGame:        { id: "timeClockGame",        title: { el: "Τι Ώρα Είναι;", en: "What Time Is It?" },                    icon: "🕐", description: { el: "Μάθε να διαβάζεις το ρολόι", en: "Learn to read the clock" }, color: "from-cyan-400 to-blue-500" },
  moneyRecognition:     { id: "moneyRecognition",     title: { el: "Αναγνώριση Χρημάτων", en: "Money Recognition" },             icon: "💰", description: { el: "Μάθε τα κέρματα και τα χαρτονομίσματα", en: "Learn coins and bills" }, color: "from-yellow-400 to-amber-500" },
  scienceExperiments:   { id: "scienceExperiments",   title: { el: "Πειράματα", en: "Science Experiments" },                     icon: "🔬", description: { el: "Απλά επιστημονικά πειράματα", en: "Simple science experiments" }, color: "from-emerald-400 to-green-500" },
  simpleGeography:      { id: "simpleGeography",      title: { el: "Γεωγραφία", en: "Geography" },                               icon: "🌍", description: { el: "Μάθε για χώρες και ηπείρους", en: "Learn about countries and continents" }, color: "from-blue-400 to-cyan-500" },
  findMissingLetter:    { id: "findMissingLetter",    title: { el: "Βρες το Γράμμα", en: "Find the Missing Letter" },            icon: "🔤", description: { el: "Ποιο γράμμα λείπει από τη λέξη;", en: "Which letter is missing?" }, color: "from-purple-400 to-pink-500" },
  findTheSum:           { id: "findTheSum",           title: { el: "Βρες το Άθροισμα", en: "Find the Sum" },                     icon: "➕", description: { el: "Πρόσθεσε και βρες το σωστό αποτέλεσμα", en: "Add and find the correct result" }, color: "from-green-400 to-lime-500" },
  findTheSumPair:       { id: "findTheSumPair",       title: { el: "Ζευγάρια Αθροίσματος", en: "Sum Pairs" },                   icon: "🔢", description: { el: "Βρες ποια ζευγάρια κάνουν το ίδιο άθροισμα", en: "Find which pairs make the same sum" }, color: "from-teal-400 to-emerald-500" },
  miniPuzzle:           { id: "miniPuzzle",           title: { el: "Μίνι Πάζλ", en: "Mini Puzzle" },                             icon: "🧩", description: { el: "Λύσε τα μικρά παζλ", en: "Solve the mini puzzles" }, color: "from-violet-400 to-indigo-500" },
  driveTheCar:          { id: "driveTheCar",          title: { el: "Οδήγησε το Αυτοκίνητο", en: "Drive the Car" },               icon: "🚗", description: { el: "Ακολούθησε τις οδηγίες πλοήγησης", en: "Follow the navigation instructions" }, color: "from-red-400 to-orange-500" },

  colorShapeGame:       { id: "colorShapeGame",       title: { el: "Χρώματα & Σχήματα", en: "Colors & Shapes" },                icon: "🎨", description: { el: "Αναγνώρισε χρώματα και σχήματα", en: "Recognize colors and shapes" }, color: "from-pink-400 to-purple-500" },
  storyBuilderGame:     { id: "storyBuilderGame",     title: { el: "Φτιάξε μια Ιστορία", en: "Build a Story" },                 icon: "📕", description: { el: "Δημιούργησε τη δική σου ιστορία", en: "Create your own story" }, color: "from-amber-400 to-orange-500" },
  findTheWord:          { id: "findTheWord",          title: { el: "Βρες τη Λέξη", en: "Find the Word" },                        icon: "🔎", description: { el: "Βρες τη σωστή λέξη στο κείμενο", en: "Find the correct word in the text" }, color: "from-blue-400 to-indigo-500" },
  numberAdventure:      { id: "numberAdventure",      title: { el: "Αριθμητική Περιπέτεια", en: "Number Adventure" },            icon: "🎲", description: { el: "Λύσε αριθμητικά προβλήματα", en: "Solve number problems" }, color: "from-green-400 to-teal-500" },
  simpleLogicPuzzle:    { id: "simpleLogicPuzzle",    title: { el: "Λογικό Παζλ", en: "Logic Puzzle" },                          icon: "🧩", description: { el: "Λύσε απλά λογικά παζλ", en: "Solve simple logic puzzles" }, color: "from-violet-400 to-fuchsia-500" },

  timelineGame:         { id: "timelineGame",         title: { el: "Χρονολόγιο", en: "Timeline" },                               icon: "📅", description: { el: "Τοποθέτησε γεγονότα στη σωστή χρονολογική σειρά", en: "Place events in correct chronological order" }, color: "from-amber-400 to-orange-500" },
  debugTheCode:         { id: "debugTheCode",         title: { el: "Διόρθωσε τον Κώδικα", en: "Debug the Code" },               icon: "🐛", description: { el: "Βρες και διόρθωσε τα λάθη στον κώδικα", en: "Find and fix code errors" }, color: "from-green-400 to-emerald-500" },
  equationBalancer:     { id: "equationBalancer",     title: { el: "Εξισώσεις", en: "Equation Balancer" },                       icon: "⚖️", description: { el: "Ισορρόπησε τη μαθηματική εξίσωση", en: "Balance the math equation" }, color: "from-blue-400 to-cyan-500" },
  analogiesGame:        { id: "analogiesGame",        title: { el: "Αναλογίες", en: "Analogies" },                               icon: "🔗", description: { el: "Βρες τη σωστή αναλογία", en: "Find the correct analogy" }, color: "from-purple-400 to-violet-500" },
  sequenceDecoder:      { id: "sequenceDecoder",      title: { el: "Αποκωδικοποίηση Σειράς", en: "Sequence Decoder" },          icon: "🔐", description: { el: "Αποκωδικοποίησε τη μυστική σειρά", en: "Decode the secret sequence" }, color: "from-indigo-400 to-purple-500" },
  codeBreaker:          { id: "codeBreaker",          title: { el: "Σπάσε τον Κώδικα", en: "Code Breaker" },                    icon: "🔓", description: { el: "Λύσε τον κρυπτογράφο", en: "Solve the cipher" }, color: "from-red-400 to-pink-500" },
  geographyQuiz:        { id: "geographyQuiz",        title: { el: "Κουίζ Γεωγραφίας", en: "Geography Quiz" },                  icon: "🌍", description: { el: "Δοκίμασε τις γνώσεις σου στη γεωγραφία", en: "Test your geography knowledge" }, color: "from-blue-400 to-teal-500" },
  inventorQuiz:         { id: "inventorQuiz",         title: { el: "Κουίζ Εφευρετών", en: "Inventor Quiz" },                    icon: "💡", description: { el: "Ποιος εφηύρε τι;", en: "Who invented what?" }, color: "from-yellow-400 to-amber-500" },
  logicGridPuzzle:      { id: "logicGridPuzzle",      title: { el: "Λογικό Πλέγμα", en: "Logic Grid Puzzle" },                  icon: "📊", description: { el: "Λύσε το παζλ λογικού πλέγματος", en: "Solve the logic grid puzzle" }, color: "from-slate-400 to-gray-500" },
  mathBattle:           { id: "mathBattle",           title: { el: "Μαθηματική Μάχη", en: "Math Battle" },                      icon: "⚡", description: { el: "Λύσε πράξεις σε χρόνο-ρεκόρ!", en: "Solve operations in record time!" }, color: "from-red-400 to-orange-500" },
  musicRhythm:          { id: "musicRhythm",          title: { el: "Μουσικός Ρυθμός", en: "Music Rhythm" },                     icon: "🎵", description: { el: "Ακολούθησε τον ρυθμό", en: "Follow the rhythm" }, color: "from-pink-400 to-purple-500" },
  mythologyQuiz:        { id: "mythologyQuiz",        title: { el: "Κουίζ Μυθολογίας", en: "Mythology Quiz" },                  icon: "🏛️", description: { el: "Δοκίμασε τις γνώσεις σου στη μυθολογία", en: "Test your mythology knowledge" }, color: "from-amber-400 to-yellow-500" },
  percentageCalc:       { id: "percentageCalc",       title: { el: "Ποσοστά & Κλάσματα", en: "Percentages & Fractions" },       icon: "📐", description: { el: "Υπολόγισε ποσοστά και κλάσματα", en: "Calculate percentages and fractions" }, color: "from-green-400 to-lime-500" },
  scienceLab:           { id: "scienceLab",           title: { el: "Εργαστήριο Φυσικής", en: "Science Lab" },                   icon: "🧪", description: { el: "Πειράματα φυσικής και χημείας", en: "Physics and chemistry experiments" }, color: "from-emerald-400 to-teal-500" },
  spaceExplorer:        { id: "spaceExplorer",        title: { el: "Εξερεύνηση Διαστήματος", en: "Space Explorer" },            icon: "🚀", description: { el: "Μάθε για τους πλανήτες και το διάστημα", en: "Learn about planets and space" }, color: "from-indigo-400 to-blue-500" },
  wordBuilder:          { id: "wordBuilder",          title: { el: "Χτίσε τη Λέξη", en: "Build the Word" },                     icon: "🏗️", description: { el: "Συνδύασε γράμματα για να φτιάξεις λέξεις", en: "Combine letters to build words" }, color: "from-orange-400 to-red-500" },
};

// ─── Age-specific categories ──────────────────────────────────────

export const AGE_CATEGORIES = {
  "4-5": CATEGORIES,

  "6": [
    { ...CAT_LANGUAGE_YOUNG, id: "langReading", title: { el: "Γλώσσα & Ανάγνωση", en: "Language & Reading" } },
    { ...CAT_MATH_YOUNG, id: "mathNumbers", title: { el: "Μαθηματικά & Αριθμοί", en: "Math & Numbers" } },
    CAT_FINE_MOTOR,
    { ...CAT_COGNITIVE_YOUNG, id: "thinkingLogic", title: { el: "Σκέψη & Λογική", en: "Thinking & Logic" } },
    CAT_SOCIAL,
    { ...CAT_COMM, id: "commSkills", title: { el: "Επικοινωνία", en: "Communication" } },
  ],

  "7-8": [
    { id: "langReading", title: { el: "Γλώσσα & Ανάγνωση", en: "Language & Reading" }, icon: "📚", color: "from-blue-400 to-purple-500", description: { el: "Ανάγνωση, ιστορίες, λεξιλόγιο", en: "Reading, stories, vocabulary" } },
    { id: "mathNumbers", title: { el: "Μαθηματικά", en: "Mathematics" }, icon: "🔢", color: "from-green-400 to-teal-500", description: { el: "Πράξεις, αριθμοί, μοτίβα", en: "Operations, numbers, patterns" } },
    { id: "thinkingLogic", title: { el: "Σκέψη & Λογική", en: "Thinking & Logic" }, icon: "🧠", color: "from-violet-400 to-fuchsia-500", description: { el: "Παζλ, μνήμη, κριτική σκέψη", en: "Puzzles, memory, critical thinking" } },
    { id: "socialSkills", title: { el: "Κοινωνικές Δεξιότητες", en: "Social Skills" }, icon: "❤️", color: "from-pink-400 to-rose-500", description: { el: "Συναισθήματα, συνεργασία", en: "Emotions, cooperation" } },
  ],

  "9-10": [
    { id: "advLanguage", title: { el: "Γλώσσα & Κατανόηση", en: "Language & Comprehension" }, icon: "📖", color: "from-blue-400 to-indigo-500", description: { el: "Ανάγνωση, ορθογραφία, κατανόηση κειμένου", en: "Reading, spelling, text comprehension" } },
    { id: "advMath", title: { el: "Μαθηματικά & Πρόβλημα", en: "Math & Problem Solving" }, icon: "🔢", color: "from-green-400 to-emerald-500", description: { el: "Πράξεις, προβλήματα, μοτίβα", en: "Operations, problems, patterns" } },
    { id: "scienceGeo", title: { el: "Φυσικές Επιστήμες & Γεωγραφία", en: "Science & Geography" }, icon: "🌍", color: "from-teal-400 to-cyan-500", description: { el: "Πειράματα, φύση, χώρες", en: "Experiments, nature, countries" } },
    { id: "criticalThinking", title: { el: "Κριτική Σκέψη", en: "Critical Thinking" }, icon: "🧠", color: "from-violet-400 to-fuchsia-500", description: { el: "Λογική, παρατηρητικότητα, αφαίρεση", en: "Logic, observation, deduction" } },
    { id: "socialEmotional9", title: { el: "Κοινωνικο-Συναισθηματικά", en: "Social & Emotional" }, icon: "❤️", color: "from-pink-400 to-rose-500", description: { el: "Συναισθήματα, ηθική, βοήθεια", en: "Emotions, ethics, helping" } },
  ],

  "11-12": [
    { id: "langLiterature", title: { el: "Γλώσσα & Λογοτεχνία", en: "Language & Literature" }, icon: "📖", color: "from-blue-400 to-indigo-500", description: { el: "Αναλογίες, λεξιλόγιο, κατανόηση", en: "Analogies, vocabulary, comprehension" } },
    { id: "advMath12", title: { el: "Μαθηματικά", en: "Mathematics" }, icon: "📐", color: "from-green-400 to-emerald-500", description: { el: "Εξισώσεις, ποσοστά, αριθμητική", en: "Equations, percentages, arithmetic" } },
    { id: "scienceTech", title: { el: "Επιστήμη & Τεχνολογία", en: "Science & Technology" }, icon: "🔬", color: "from-teal-400 to-cyan-500", description: { el: "Φυσική, χημεία, κώδικας, διάστημα", en: "Physics, chemistry, code, space" } },
    { id: "logicProblem", title: { el: "Λογική & Αποκωδικοποίηση", en: "Logic & Problem Solving" }, icon: "🧠", color: "from-violet-400 to-fuchsia-500", description: { el: "Παζλ, κρυπτογράφηση, αποκωδικοποίηση", en: "Puzzles, ciphers, decoding" } },
    { id: "historyCulture", title: { el: "Ιστορία & Πολιτισμός", en: "History & Culture" }, icon: "🏛️", color: "from-amber-400 to-orange-500", description: { el: "Χρονολόγιο, μυθολογία, εφευρέτες", en: "Timeline, mythology, inventors" } },
    { id: "socialSkills12", title: { el: "Κοινωνικές Δεξιότητες", en: "Social Skills" }, icon: "❤️", color: "from-pink-400 to-rose-500", description: { el: "Ηθικά διλήμματα, συναισθήματα, συνεργασία", en: "Moral dilemmas, emotions, cooperation" } },
  ],
};

// ─── Age-specific activities per category ─────────────────────────

export const AGE_ACTIVITIES = {
  // ═══ 4-5: Keep all original activities ══════════════════════════
  "4-5": ACTIVITIES,

  // ═══ 6: Original + exercises_6_1 additions ══════════════════════
  "6": {
    langReading: [
      ACTIVITIES.languageDev[0], // letterSound
      ACTIVITIES.languageDev[1], // letterMatch
      ACTIVITIES.languageDev[2], // storyChoices
      ACTIVITIES.languageDev[3], // findRhyme
      ACTIVITIES.languageDev[4], // breakWord
      ACT.spellingGame,
      ACT.readingGame,
      ACT.findMissingLetter,
      ACT.completeSentence,
    ],
    mathNumbers: [
      ACTIVITIES.mathSkills[0], // countApples
      ACTIVITIES.mathSkills[3], // whichHasMore
      ACTIVITIES.mathSkills[4], // patternBuilder
      ACTIVITIES.mathSkills[5], // numberRecognition
      ACT.findTheSum,
      ACT.findTheSumPair,
      ACT.findMissingNumber,
      ACT.timeClockGame,
      ACT.moneyRecognition,
    ],
    fineMotor: [
      ACTIVITIES.fineMotor[0], // lineTracing
      ACTIVITIES.fineMotor[1], // connectDots
      ACTIVITIES.fineMotor[3], // letterTracing
      ACTIVITIES.fineMotor[4], // freeLetterWriting
    ],
    thinkingLogic: [
      ACTIVITIES.cognitiveSkills[0], // memoryCards
      ACTIVITIES.cognitiveSkills[1], // spotTheDifference
      ACTIVITIES.cognitiveSkills[2], // whatsMissing
      ACTIVITIES.cognitiveSkills[3], // matchPairs
      ACT.patternRecognition,
      ACT.guessWhat,
      ACT.miniPuzzle,
      ACT.combineTwoImages,
    ],
    socialEmotional: [
      ACTIVITIES.socialEmotional[0], // howDoTheyFeel
      ACTIVITIES.socialEmotional[1], // classroomRules
      ACTIVITIES.socialEmotional[2], // emotionalStories
      ACT.doTheRightThing,
      ACT.helpYourFriend,
    ],
    commSkills: [
      ACTIVITIES.communicationDaily[0], // followInstructions
      ACTIVITIES.communicationDaily[1], // dailyRoutine
      ACT.driveTheCar,
      ACT.scienceExperiments,
      ACT.simpleGeography,
    ],
  },

  // ═══ 7-8: Advanced, no fine motor / self care ═══════════════════
  "7-8": {
    langReading: [
      ACTIVITIES.languageDev[0], // letterSound (override from exercises_7_8/)
      ACTIVITIES.languageDev[2], // storyChoices
      ACTIVITIES.languageDev[3], // findRhyme
      ACTIVITIES.languageDev[4], // breakWord (override from exercises_7_8/)
      ACT.completeSentence,
      ACT.findTheWord,
      ACT.storyBuilderGame,
    ],
    mathNumbers: [
      ACTIVITIES.mathSkills[0], // countApples (override from exercises_7_8/)
      ACTIVITIES.mathSkills[4], // patternBuilder
      ACTIVITIES.mathSkills[5], // numberRecognition (override from exercises_7_8/)
      ACT.findMissingNumber,
      ACT.numberAdventure,
      ACT.findTheSum,
      ACT.patternRecognition,
    ],
    thinkingLogic: [
      ACTIVITIES.cognitiveSkills[0], // memoryCards (override from exercises_7_8/)
      ACTIVITIES.cognitiveSkills[1], // spotTheDifference
      ACTIVITIES.cognitiveSkills[2], // whatsMissing
      ACTIVITIES.cognitiveSkills[3], // matchPairs
      ACT.simpleLogicPuzzle,
      ACT.guessWhat,
      ACT.whatRemains,
      ACT.colorShapeGame,
      ACT.combineTwoImages,
    ],
    socialSkills: [
      ACTIVITIES.socialEmotional[0], // howDoTheyFeel
      ACTIVITIES.socialEmotional[2], // emotionalStories
      ACT.doTheRightThing,
      ACT.helpYourFriend,
      ACT.howDoesItFeelAdv,
      ACT.guessEmotionFromVoice,
      ACT.whoWaitsInLine,
    ],
  },

  // ═══ 9-10: Mostly advanced components ═══════════════════════════
  "9-10": {
    advLanguage: [
      ACTIVITIES.languageDev[2], // storyChoices
      ACT.completeSentence,
      ACT.spellingGame,
      ACT.readingGame,
      ACT.findTheWord,
    ],
    advMath: [
      ACT.findMissingNumber,
      ACT.patternRecognition,
      ACT.findTheSum,
      ACT.findTheSumPair,
      ACT.numberAdventure,
    ],
    scienceGeo: [
      ACT.scienceExperiments,
      ACT.simpleGeography,
      ACT.timeClockGame,
      ACT.moneyRecognition,
    ],
    criticalThinking: [
      ACTIVITIES.cognitiveSkills[0], // memoryCards
      ACTIVITIES.cognitiveSkills[3], // matchPairs
      ACT.guessWhat,
      ACT.whatRemains,
      ACT.simpleLogicPuzzle,
      ACT.combineTwoImages,
      ACT.patternRecognition,
    ],
    socialEmotional9: [
      ACT.doTheRightThing,
      ACT.helpYourFriend,
      ACT.howDoesItFeelAdv,
      ACT.guessEmotionFromVoice,
      ACT.whoWaitsInLine,
    ],
  },

  // ═══ 11-12: Advanced / new components ═══════════════════════════
  "11-12": {
    langLiterature: [
      ACT.analogiesGame,
      ACT.wordBuilder,
      ACT.completeSentence,
      ACT.storyBuilderGame,
    ],
    advMath12: [
      ACT.equationBalancer,
      ACT.percentageCalc,
      ACT.mathBattle,
      ACT.findMissingNumber,
      ACT.sequenceDecoder,
    ],
    scienceTech: [
      ACT.scienceLab,
      ACT.spaceExplorer,
      ACT.debugTheCode,
      ACT.musicRhythm,
    ],
    logicProblem: [
      ACT.logicGridPuzzle,
      ACT.codeBreaker,
      ACT.patternRecognition,
      ACT.guessWhat,
      ACT.whatRemains,
    ],
    historyCulture: [
      ACT.timelineGame,
      ACT.mythologyQuiz,
      ACT.inventorQuiz,
      ACT.geographyQuiz,
    ],
    socialSkills12: [
      ACT.doTheRightThing,
      ACT.helpYourFriend,
      ACT.howDoesItFeelAdv,
      ACT.guessEmotionFromVoice,
      ACT.whoWaitsInLine,
    ],
  },
};

export function getCategoriesForAge(ageGroup) {
  return AGE_CATEGORIES[ageGroup] || CATEGORIES;
}

export function getActivitiesForAge(ageGroup) {
  return AGE_ACTIVITIES[ageGroup] || ACTIVITIES;
}
