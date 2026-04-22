// Mapping from route age-group param to exercise folder key
export const FUN_AGE_CONFIG = {
  "4-5": {
    folderKey: "4_5_1",
    title: { el: "Ηλικία 4-5: Συναρπαστικός ελεύθερος χρόνος", en: "Age 4-5: Fun Free Time" },
    gradient: "from-purple-50 via-pink-50 to-indigo-50",
    titleGradient: "from-purple-600 to-pink-600",
  },
  "6": {
    folderKey: "6_1",
    title: { el: "Ηλικία 6: Συναρπαστικός ελεύθερος χρόνος", en: "Age 6: Fun Free Time" },
    gradient: "from-purple-50 via-pink-50 to-indigo-50",
    titleGradient: "from-purple-600 to-pink-600",
  },
  "7-8": {
    folderKey: "7_8_1",
    title: { el: "Ηλικία 7-8: Συναρπαστικός ελεύθερος χρόνος", en: "Age 7-8: Fun Free Time" },
    gradient: "from-purple-50 via-pink-50 to-indigo-50",
    titleGradient: "from-purple-600 to-pink-600",
  },
  "9-10": {
    folderKey: "9_10_1",
    title: { el: "Ηλικία 9-10: Συναρπαστικός ελεύθερος χρόνος", en: "Age 9-10: Fun Free Time" },
    gradient: "from-purple-50 via-pink-50 to-indigo-50",
    titleGradient: "from-purple-600 to-pink-600",
  },
  "11-12": {
    folderKey: "11_12_1",
    title: { el: "Ηλικία 11-12: Συναρπαστικός ελεύθερος χρόνος", en: "Age 11-12: Fun Free Time" },
    gradient: "from-indigo-50 via-purple-50 to-violet-50",
    titleGradient: "from-indigo-600 to-violet-600",
  },
};

// All sidebar categories (used when no mode is specified, e.g. age 4-5)
export const SIDEBAR_CATEGORIES = [
  { id: "puzzleGames", icon: "🧩", title: { el: "Παζλ & Εικόνες", en: "Puzzles & Images" }, color: "from-blue-400 to-purple-500" },
  { id: "actionGames", icon: "🎯", title: { el: "Δράση & Αντίδραση", en: "Action & Reaction" }, color: "from-green-400 to-teal-500" },
  { id: "emotionalIntelligence", icon: "❤️", title: { el: "Συναισθηματική Νοημοσύνη", en: "Emotional Intelligence" }, color: "from-pink-400 to-red-500" },
  { id: "animalKnowledge", icon: "🐾", title: { el: "Ζώα & Φύση", en: "Animals & Nature" }, color: "from-green-400 to-emerald-500" },
  { id: "colorGames", icon: "🎨", title: { el: "Χρώματα & Σχήματα", en: "Colors & Shapes" }, color: "from-pink-400 to-rose-500" },
  { id: "mathGames", icon: "🔢", title: { el: "Μαθηματικά", en: "Mathematics" }, color: "from-blue-400 to-indigo-500" },
  { id: "musicGames", icon: "🎵", title: { el: "Μουσική & Ήχοι", en: "Music & Sounds" }, color: "from-yellow-400 to-orange-500" },
  { id: "memoryGames", icon: "🧠", title: { el: "Μνήμη & Σκέψη", en: "Memory & Thinking" }, color: "from-violet-400 to-fuchsia-500" },
];

// Fun-only sidebar categories
export const FUN_SIDEBAR_CATEGORIES = [
  { id: "puzzleGames", icon: "🧩", title: { el: "Παζλ & Εικόνες", en: "Puzzles & Images" }, color: "from-blue-400 to-purple-500" },
  { id: "actionGames", icon: "🎯", title: { el: "Δράση & Αντίδραση", en: "Action & Reaction" }, color: "from-green-400 to-teal-500" },
  { id: "emotionalIntelligence", icon: "❤️", title: { el: "Συναισθηματική Νοημοσύνη", en: "Emotional Intelligence" }, color: "from-pink-400 to-red-500" },
  { id: "animalKnowledge", icon: "🐾", title: { el: "Ζώα & Φύση", en: "Animals & Nature" }, color: "from-green-400 to-emerald-500" },
  { id: "colorGames", icon: "🎨", title: { el: "Χρώματα & Τέχνη", en: "Colors & Art" }, color: "from-pink-400 to-rose-500" },
  { id: "musicGames", icon: "🎵", title: { el: "Μουσική & Ήχοι", en: "Music & Sounds" }, color: "from-yellow-400 to-orange-500" },
];

// Logic-only sidebar categories
export const LOGIC_SIDEBAR_CATEGORIES = [
  { id: "memoryObservation", icon: "🧠", title: { el: "Μνήμη & Παρατήρηση", en: "Memory & Observation" }, color: "from-violet-400 to-fuchsia-500" },
  { id: "patternSpatial", icon: "🔄", title: { el: "Μοτίβα & Σχήματα", en: "Patterns & Shapes" }, color: "from-cyan-400 to-blue-500" },
  { id: "sortingLogic", icon: "📊", title: { el: "Ταξινόμηση & Λογική", en: "Sorting & Logic" }, color: "from-emerald-400 to-teal-500" },
  { id: "mathNumbers", icon: "🔢", title: { el: "Μαθηματικά", en: "Mathematics" }, color: "from-blue-400 to-indigo-500" },
  { id: "languageReading", icon: "🔤", title: { el: "Γλώσσα & Ανάγνωση", en: "Language & Reading" }, color: "from-orange-400 to-red-500" },
];

// Game ID → component file name + where to find it
// source: "puzzle" (puzzles/), "base" (exercises_2_3_1/), "age" (exercises_{folderKey}/)
export const GAME_ID_TO_COMPONENT = {
  tapPuzzle:              { component: "TapPuzzle",              source: "puzzle" },
  imagePuzzle:            { component: "PuzzleBoard",            source: "puzzle" },
  bubblePop:              { component: "BubblePop",              source: "base" },
  shapeMatch:             { component: "ShapeMatch",             source: "base" },
  colorMatch:             { component: "ColorMatch",             source: "base" },
  animalSounds:           { component: "AnimalSounds",           source: "base" },
  countAndLearn:          { component: "CountAndLearn",           source: "base" },
  musicalPiano:           { component: "MusicalPiano",           source: "base" },
  emotionsMatch:          { component: "EmotionsMatch",          source: "base" },
  foodSorting:            { component: "FoodSorting",            source: "base" },
  memoryMatch:            { component: "MemoryMatch",            source: "base" },
  alphabetMatch:          { component: "AlphabetMatch",          source: "base" },
  animalHabitats:         { component: "AnimalHabitats",         source: "base" },
  animalTracks:           { component: "AnimalTracks",           source: "base" },
  bodyParts:              { component: "BodyParts",              source: "base" },
  colorDrawing:           { component: "ColorDrawing",           source: "base" },
  vehicleSounds:          { component: "VehicleSounds",          source: "base" },
  syllableListening:      { component: "SyllableListening",      source: "age" },
  firstLetterGame:        { component: "FirstLetterGame",        source: "age" },
  hiddenLetterGame:       { component: "HiddenLetterGame",       source: "age" },
  rhymeListening:         { component: "RhymeListeningGame",     source: "age" },
  wakeUpLetterGame:       { component: "WakeUpLetterGame",       source: "age" },
  guessWhatGame:          { component: "GuessWhatGame",          source: "age" },
  similarSoundsGame:      { component: "SimilarSoundsGame",      source: "age" },
  completeSentenceGame:   { component: "CompleteSentenceGame",   source: "age" },
  findOddOneOutGame:      { component: "FindOddOneOutGame",      source: "age" },
  alphabetRoadGame:       { component: "AlphabetRoadGame",       source: "age" },
  whichIsLessGame:        { component: "WhichIsLessGame",        source: "age" },
  findMissingNumberGame:  { component: "FindMissingNumberGame",  source: "age" },
  whatRemainsGame:        { component: "WhatRemainsGame",        source: "age" },
  matchShapeObjectGame:   { component: "MatchShapeObjectGame",   source: "age" },
  flippedShapesGame:      { component: "FlippedShapesGame",      source: "age" },
  sortBySizeGame:         { component: "SortBySizeGame",         source: "age" },
  groupByCategoriesGame:  { component: "GroupByCategoriesGame",  source: "age" },
  robotRequestsGame:      { component: "RobotRequestsGame",      source: "age" },
  patternRecognitionGame: { component: "PatternRecognitionGame", source: "age" },
  brokenNumberGame:       { component: "BrokenNumberGame",       source: "age" },
  paintSameObjects:       { component: "PaintSameObjectsGame",   source: "age" },
  mazeGame:               { component: "MazeGame",               source: "age" },
  findHalfShape:          { component: "FindHalfShapeGame",      source: "age" },
  fixThePicture:          { component: "FixThePictureGame",      source: "age" },
  drawTheShadow:          { component: "DrawTheShadowGame",      source: "age" },
  createScene:            { component: "CreateSceneGame",        source: "age" },
  stickerCard:            { component: "StickerCardGame",        source: "age" },
  freezeMelt:             { component: "FreezeMeltGame",         source: "age" },
  completeSymmetry:       { component: "CompleteSymmetryGame",   source: "age" },
  whatWasInBetween:       { component: "WhatWasInBetweenGame",   source: "age" },
  flippedSoundCards:      { component: "FlippedSoundCardsGame",  source: "age" },
  movementSequence:       { component: "MovementSequenceGame",   source: "age" },
  guessFromPieces:        { component: "GuessFromPiecesGame",    source: "age" },
  quickTap:               { component: "QuickTapGame",           source: "age" },
  positionMemory:         { component: "PositionMemoryGame",     source: "age" },
  whichDisappeared:       { component: "WhichDisappearedGame",   source: "age" },
  whichMoved:             { component: "WhichMovedGame",         source: "age" },
  whatHeardFirst:         { component: "WhatHeardFirstGame",     source: "age" },
  combineTwoImages:       { component: "CombineTwoImagesGame",  source: "age" },
  howDoesItFeel:          { component: "HowDoesItFeelGame",      source: "age" },
  doTheRightThing:        { component: "DoTheRightThingGame",    source: "age" },
  whoWaitsInLine:         { component: "WhoWaitsInLineGame",     source: "age" },
  helpYourFriend:         { component: "HelpYourFriendGame",     source: "age" },
  guessEmotionFromVoice:  { component: "GuessEmotionFromVoiceGame", source: "age" },
  whatDoesItEat:          { component: "WhatDoesItEatGame",      source: "age" },
  nightOrDay:             { component: "NightOrDayGame",         source: "age" },
  sinkOrFloat:            { component: "SinkOrFloatGame",        source: "age" },
  sortBySeasons:          { component: "SortBySeasonsGame",      source: "age" },
  whatMovesWithWheels:    { component: "WhatMovesWithWheelsGame", source: "age" },
  // Age-6 only games
  miniPuzzleGame:              { component: "MiniPuzzleGame",              source: "age" },
  driveTheCarGame:             { component: "DriveTheCarGame",             source: "age" },
  readingGame:                 { component: "ReadingGame",                 source: "age" },
  spellingGame:                { component: "SpellingGame",                source: "age" },
  findTheMissingLetterGame:    { component: "FindTheMissingLetterGame",    source: "age" },
  findTheMissingLetterIGame:   { component: "FindTheMissingLetterIGame",   source: "age" },
  findTheMissingLetterIIGame:  { component: "FindTheMissingLetterIIGame",  source: "age" },
  timeClockGame:               { component: "TimeClockGame",               source: "age" },
  moneyRecognitionGame:        { component: "MoneyRecognitionGame",        source: "age" },
  simpleGeographyGame:         { component: "SimpleGeographyGame",         source: "age" },
  scienceExperimentsGame:      { component: "ScienceExperimentsGame",      source: "age" },
  findTheSumGame:              { component: "FindTheSumGame",              source: "age" },
  findTheSumPairGame:          { component: "FindTheSumPairGame",          source: "age" },
  mathBattleGame:              { component: "MathBattleGame",              source: "age" },
  wordBuilderGame:             { component: "WordBuilderGame",             source: "age" },
  logicGridPuzzleGame:         { component: "LogicGridPuzzleGame",         source: "age" },
  geographyQuizGame:           { component: "GeographyQuizGame",           source: "age" },
  scienceLabGame:              { component: "ScienceLabGame",              source: "age" },
  codeBreakerGame:             { component: "CodeBreakerGame",             source: "age" },
  numberAdventureGame:         { component: "NumberAdventureGame",         source: "age" },
  findTheWordGame:             { component: "FindTheWordGame",             source: "age" },
  simpleLogicPuzzleGame:       { component: "SimpleLogicPuzzleGame",       source: "age" },
  colorShapeGame:              { component: "ColorShapeGame",              source: "age" },
  storyBuilderGame:            { component: "StoryBuilderGame",            source: "age" },
  // New 11-12 games
  timelineGame:                { component: "TimelineGame",                source: "age" },
  spaceExplorerGame:           { component: "SpaceExplorerGame",           source: "age" },
  mythologyQuizGame:           { component: "MythologyQuizGame",           source: "age" },
  inventorQuizGame:            { component: "InventorQuizGame",            source: "age" },
  musicRhythmGame:             { component: "MusicRhythmGame",             source: "age" },
  equationBalancerGame:        { component: "EquationBalancerGame",        source: "age" },
  percentageCalcGame:          { component: "PercentageCalcGame",          source: "age" },
  analogiesGame:               { component: "AnalogiesGame",               source: "age" },
  sequenceDecoderGame:         { component: "SequenceDecoderGame",         source: "age" },
  debugTheCodeGame:            { component: "DebugTheCodeGame",            source: "age" },
};

// ─── Game category definitions ──────────────────────────────────────────────

const PUZZLE_GAMES = [
  { id: "tapPuzzle", title: { el: "Tap Παζλ", en: "Tap Puzzle" }, icon: "🧩", description: { el: "Πάτα τα κομμάτια με τη σειρά", en: "Tap the pieces in order" }, color: "from-blue-400 to-purple-500" },
  { id: "imagePuzzle", title: { el: "Παζλ Εικόνων", en: "Image Puzzle" }, icon: "🖼️", description: { el: "Σύρε τα κομμάτια για να φτιάξεις την εικόνα", en: "Drag pieces to complete the image" }, color: "from-indigo-400 to-blue-500" },
];

const ACTION_GAMES = [
  { id: "bubblePop", title: { el: "Φούσκες που Σκάζουν", en: "Bubble Pop" }, icon: "🫧", description: { el: "Σκάσε όλες τις φούσκες!", en: "Pop all the bubbles!" }, color: "from-cyan-400 to-blue-500" },
  { id: "shapeMatch", title: { el: "Ταίριασμα Σχημάτων", en: "Shape Match" }, icon: "🔷", description: { el: "Βάλε τα σχήματα στις σωστές θέσεις", en: "Put shapes in the right places" }, color: "from-teal-400 to-green-500" },
  { id: "whatWasInBetween", title: { el: "Ποιό ήταν Ανάμεσα;", en: "What Was In Between?" }, icon: "🧠", description: { el: "Θυμήσου ποιο ήταν στη μέση", en: "Remember which was in the middle" }, color: "from-indigo-400 to-purple-500" },
  { id: "flippedSoundCards", title: { el: "Κάρτες Ήχου", en: "Sound Cards" }, icon: "🔊", description: { el: "Βρες τα ζευγάρια ήχων", en: "Find the sound pairs" }, color: "from-blue-400 to-purple-500" },
  { id: "movementSequence", title: { el: "Ακολουθία Κινήσεων", en: "Movement Sequence" }, icon: "🙌", description: { el: "Επανάλαβε τις κινήσεις", en: "Repeat the movements" }, color: "from-orange-400 to-green-500" },
  { id: "guessFromPieces", title: { el: "Μάντεψε από τα Κομμάτια", en: "Guess From Pieces" }, icon: "🔍", description: { el: "Μάντεψε από τα κομμάτια", en: "Guess from the pieces" }, color: "from-purple-400 to-pink-500" },
  { id: "quickTap", title: { el: "Γρήγορο Πάτημα", en: "Quick Tap" }, icon: "⚡", description: { el: "Πάτα γρήγορα το σωστό!", en: "Tap the right one fast!" }, color: "from-yellow-400 to-red-500" },
  { id: "positionMemory", title: { el: "Μνήμη Θέσης", en: "Position Memory" }, icon: "🧠", description: { el: "Θυμήσου πού κρύφτηκε", en: "Remember where it hid" }, color: "from-green-400 to-purple-500" },
  { id: "whichDisappeared", title: { el: "Ποιο Εξαφανίστηκε;", en: "Which Disappeared?" }, icon: "👀", description: { el: "Θυμήσου ποιο έλειπε", en: "Remember which is missing" }, color: "from-pink-400 to-purple-500" },
  { id: "whichMoved", title: { el: "Ποιο Μετακινήθηκε;", en: "Which One Moved?" }, icon: "🔄", description: { el: "Βρες ποιο άλλαξε θέση", en: "Find which changed position" }, color: "from-orange-400 to-green-500" },
  { id: "whatHeardFirst", title: { el: "Τι Άκουσες Πρώτο;", en: "What Did You Hear First?" }, icon: "👂", description: { el: "Θυμήσου τον πρώτο ήχο", en: "Remember the first sound" }, color: "from-blue-400 to-pink-500" },
  { id: "combineTwoImages", title: { el: "Συνδύασε 2 Εικόνες", en: "Combine 2 Images" }, icon: "🤔", description: { el: "Τι δημιουργούν μαζί;", en: "What do they create?" }, color: "from-green-400 to-orange-500" },
];

const EMOTIONAL_INTELLIGENCE = [
  { id: "howDoesItFeel", title: { el: "Πώς Νιώθει;", en: "How Does It Feel?" }, icon: "❤️", description: { el: "Βρες το σωστό συναίσθημα", en: "Find the right emotion" }, color: "from-pink-400 to-red-500" },
  { id: "doTheRightThing", title: { el: "Κάνε το Σωστό", en: "Do The Right Thing" }, icon: "🤝", description: { el: "Επίλεξε την ευγενική πράξη", en: "Choose the polite action" }, color: "from-green-400 to-blue-500" },
  { id: "whoWaitsInLine", title: { el: "Ποιος Περιμένει Σειρά;", en: "Who Waits In Line?" }, icon: "🙋", description: { el: "Βρες το υπομονετικό παιδί", en: "Find the patient child" }, color: "from-yellow-400 to-orange-500" },
  { id: "helpYourFriend", title: { el: "Βοήθησε τον Φίλο", en: "Help Your Friend" }, icon: "🤝", description: { el: "Διάλεξε τη σωστή βοήθεια", en: "Choose the right help" }, color: "from-cyan-400 to-blue-500" },
  { id: "guessEmotionFromVoice", title: { el: "Μάντεψε το Συναίσθημα", en: "Guess the Emotion" }, icon: "👂", description: { el: "Άκου τη φωνή και μάντεψε", en: "Listen to the voice and guess" }, color: "from-purple-400 to-pink-500" },
];

const ANIMAL_KNOWLEDGE = [
  { id: "whatDoesItEat", title: { el: "Τι Τρώει;", en: "What Does It Eat?" }, icon: "🍽️", description: { el: "Αντιστοίχισε ζώο με τροφή", en: "Match animal with food" }, color: "from-green-400 to-emerald-500" },
  { id: "nightOrDay", title: { el: "Νύχτα ή Μέρα;", en: "Night or Day?" }, icon: "🌓", description: { el: "Μάντεψε την ώρα της ημέρας", en: "Guess the time of day" }, color: "from-blue-400 to-purple-500" },
  { id: "sinkOrFloat", title: { el: "Βουλιάζει ή Επιπλέει;", en: "Sink or Float?" }, icon: "💧", description: { el: "Τι συμβαίνει στο νερό;", en: "What happens in water?" }, color: "from-cyan-400 to-blue-500" },
  { id: "sortBySeasons", title: { el: "Ταξινόμησε σε Εποχές", en: "Sort by Seasons" }, icon: "🌈", description: { el: "Χειμώνας ή Καλοκαίρι;", en: "Winter or Summer?" }, color: "from-orange-400 to-blue-400" },
  { id: "whatMovesWithWheels", title: { el: "Ποιο Μετακινείται με Ρόδες;", en: "What Moves with Wheels?" }, icon: "⚙️", description: { el: "Βρες τα μεταφορικά μέσα", en: "Find the vehicles" }, color: "from-slate-400 to-zinc-500" },
  { id: "animalSounds", title: { el: "Ήχοι Ζώων", en: "Animal Sounds" }, icon: "🐶", description: { el: "Βρες ποιο ζώο κάνει αυτό τον ήχο", en: "Find which animal makes this sound" }, color: "from-emerald-400 to-lime-500" },
  { id: "animalHabitats", title: { el: "Σπίτια Ζώων", en: "Animal Habitats" }, icon: "🏡", description: { el: "Βάλε κάθε ζώο στο σπίτι του", en: "Put each animal in its home" }, color: "from-green-400 to-emerald-500" },
  { id: "animalTracks", title: { el: "Ίχνη Ζώων", en: "Animal Tracks" }, icon: "🐾", description: { el: "Ταίριαξε το ζώο με τα ίχνη του", en: "Match the animal with its tracks" }, color: "from-lime-400 to-green-500" },
];

const COLOR_GAMES = [
  { id: "colorMatch", title: { el: "Ταίριασμα Χρωμάτων", en: "Color Match" }, icon: "🎨", description: { el: "Βρες το σωστό χρώμα", en: "Find the right color" }, color: "from-pink-400 to-rose-500" },
  { id: "colorDrawing", title: { el: "Ζωγραφική με Χρώματα", en: "Color Drawing" }, icon: "🖍️", description: { el: "Ζωγράφισε με όμορφα χρώματα", en: "Draw with beautiful colors" }, color: "from-purple-400 to-pink-500" },
  { id: "paintSameObjects", title: { el: "Βάψε ό,τι είναι Ίδιο", en: "Paint What's the Same" }, icon: "🖌️", description: { el: "Βάψε όλα τα ίδια αντικείμενα", en: "Paint all the same objects" }, color: "from-orange-400 to-pink-500" },
  { id: "mazeGame", title: { el: "Πέρασε το Λαβύρινθο", en: "Pass the Maze" }, icon: "🎯", description: { el: "Σύρε τη μπάλα στο τερματισμό", en: "Drag the ball to the finish" }, color: "from-blue-400 to-purple-500" },
  { id: "findHalfShape", title: { el: "Βρες το Μισό Σχήμα", en: "Find the Half Shape" }, icon: "🔷", description: { el: "Βρες το σωστό δεξί μισό", en: "Find the correct right half" }, color: "from-teal-400 to-cyan-500" },
  { id: "fixThePicture", title: { el: "Επιδιόρθωσε την Εικόνα", en: "Fix the Picture" }, icon: "🔧", description: { el: "Βρες και διόρθωσε το λάθος κομμάτι", en: "Find and fix the wrong piece" }, color: "from-amber-400 to-orange-500" },
  { id: "drawTheShadow", title: { el: "Ζωγράφισε τη Σκιά", en: "Draw the Shadow" }, icon: "🎨", description: { el: "Ζωγράφισε τη σκιά με swipe", en: "Draw the shadow with swipe" }, color: "from-indigo-400 to-purple-500" },
  { id: "createScene", title: { el: "Δημιούργησε Σκηνή", en: "Create a Scene" }, icon: "🎭", description: { el: "Σύρε αντικείμενα για να φτιάξεις σκηνή", en: "Drag items to create a scene" }, color: "from-green-400 to-blue-500" },
  { id: "stickerCard", title: { el: "Καρτέλα Stickers", en: "Sticker Card" }, icon: "🎯", description: { el: "Βάλε τα stickers στις σωστές θέσεις", en: "Place stickers in the right spots" }, color: "from-purple-400 to-pink-500" },
  { id: "freezeMelt", title: { el: "Πάγωσε-Λιώσε", en: "Freeze-Melt" }, icon: "🔥", description: { el: "Λιώσε τα παγωμένα ζώα με τη φωτιά", en: "Melt the frozen animals with fire" }, color: "from-cyan-400 to-orange-500" },
  { id: "completeSymmetry", title: { el: "Συμπλήρωσε το Συμμετρικό", en: "Complete the Symmetry" }, icon: "🪞", description: { el: "Ζωγράφισε το δεξί μισό", en: "Draw the right half" }, color: "from-purple-400 to-pink-500" },
];

const MUSIC_GAMES = [
  { id: "musicalPiano", title: { el: "Μουσικό Πιάνο", en: "Musical Piano" }, icon: "🎹", description: { el: "Παίξε μουσική στο πιάνο", en: "Play music on the piano" }, color: "from-yellow-400 to-orange-500" },
  { id: "vehicleSounds", title: { el: "Ήχοι Οχημάτων", en: "Vehicle Sounds" }, icon: "🚗", description: { el: "Άκουσε και βρες το όχημα", en: "Listen and find the vehicle" }, color: "from-amber-400 to-yellow-500" },
];

const MEMORY_GAMES = [
  { id: "memoryMatch", title: { el: "Μνήμη", en: "Memory Match" }, icon: "🧠", description: { el: "Βρες τα ίδια ζευγάρια", en: "Find matching pairs" }, color: "from-violet-400 to-fuchsia-500" },
  { id: "alphabetMatch", title: { el: "Αλφάβητο", en: "Alphabet Match" }, icon: "🔤", description: { el: "Ταίριαξε γράμματα με εικόνες", en: "Match letters with images" }, color: "from-purple-400 to-violet-500" },
  { id: "countAndLearn", title: { el: "Μέτρησε και Μάθε", en: "Count and Learn" }, icon: "🔢", description: { el: "Μέτρα τα αντικείμενα", en: "Count the objects" }, color: "from-indigo-400 to-purple-500" },
  { id: "syllableListening", title: { el: "Άκου τη Συλλαβή", en: "Syllable Listening" }, icon: "👂", description: { el: "Άκουσε και διάλεξε τη σωστή συλλαβή", en: "Listen and choose the correct syllable" }, color: "from-blue-400 to-indigo-500" },
  { id: "firstLetterGame", title: { el: "Πρώτο Γράμμα", en: "First Letter Game" }, icon: "🔤", description: { el: "Βρες το πρώτο γράμμα της λέξης", en: "Find the first letter of the word" }, color: "from-red-400 to-orange-500" },
  { id: "hiddenLetterGame", title: { el: "Κρυφό Γράμμα", en: "Hidden Letter Game" }, icon: "🔍", description: { el: "Βρες το κρυφό γράμμα σε κάθε λέξη", en: "Find the hidden letter in each word" }, color: "from-pink-400 to-red-500" },
  { id: "rhymeListening", title: { el: "Άκουσε τη Ρίμα", en: "Rhyme Listening" }, icon: "🎤", description: { el: "Άκουσε και διάλεξε τη σωστή ρίμα", en: "Listen and choose the correct rhyme" }, color: "from-red-400 to-pink-500" },
  { id: "wakeUpLetterGame", title: { el: "Ξύπνα το Γράμμα", en: "Wake Up Letter Game" }, icon: "🌅", description: { el: "Βρες το γράμμα που λείπει", en: "Find the missing letter" }, color: "from-orange-400 to-red-500" },
  { id: "guessWhatGame", title: { el: "Μάντεψε Τι Είναι", en: "Guess What Game" }, icon: "❓", description: { el: "Μάντεψε το αντικείμενο από την περιγραφή", en: "Guess the object from the description" }, color: "from-teal-400 to-green-500" },
  { id: "similarSoundsGame", title: { el: "Παρόμοιοι Ήχοι", en: "Similar Sounds" }, icon: "🎵", description: { el: "Βρες λέξεις με παρόμοιο ήχο", en: "Find words with similar sounds" }, color: "from-pink-400 to-fuchsia-500" },
  { id: "completeSentenceGame", title: { el: "Ολοκλήρωσε τη Φράση", en: "Complete the Sentence" }, icon: "💭", description: { el: "Ολοκλήρωσε τη φράση με τη σωστή λέξη", en: "Complete the sentence with the right word" }, color: "from-cyan-400 to-indigo-500" },
  { id: "findOddOneOutGame", title: { el: "Βρες το Διαφορετικό", en: "Find the Odd One Out" }, icon: "🔍", description: { el: "Ποιο δεν ταιριάζει στην κατηγορία;", en: "Which one doesn't belong in the category?" }, color: "from-orange-400 to-amber-500" },
  { id: "alphabetRoadGame", title: { el: "Αλφαβητόδρομος", en: "Alphabet Road" }, icon: "🚗", description: { el: "Οδήγησε στα σωστά γράμματα", en: "Drive to the correct letters" }, color: "from-blue-400 to-indigo-500" },
];

const MATH_GAMES = [
  { id: "whichIsLessGame", title: { el: "Ποιο είναι Λιγότερο", en: "Which Is Less" }, icon: "🔢", description: { el: "Σύγκρινε δύο ομάδες αντικειμένων", en: "Compare two groups of objects" }, color: "from-emerald-400 to-teal-500" },
  { id: "findMissingNumberGame", title: { el: "Βρες τον Αριθμό που Λείπει", en: "Find Missing Number" }, icon: "❓", description: { el: "Συμπλήρωσε την ακολουθία αριθμών", en: "Complete the number sequence" }, color: "from-purple-400 to-indigo-500" },
  { id: "whatRemainsGame", title: { el: "Τι Έμεινε", en: "What Remains" }, icon: "➖", description: { el: "Αφαίρεσε και μέτρησε τι έμεινε", en: "Subtract and count what remains" }, color: "from-orange-400 to-amber-500" },
  { id: "matchShapeObjectGame", title: { el: "Ταίριαξε Σχήμα-Αντικείμενο", en: "Match Shape-Object" }, icon: "🔷", description: { el: "Βρες ποιο σχήμα μοιάζει με το αντικείμενο", en: "Find which shape looks like the object" }, color: "from-cyan-400 to-teal-500" },
  { id: "flippedShapesGame", title: { el: "Σωστός Προσανατολισμός", en: "Correct Orientation" }, icon: "🔄", description: { el: "Βρες το σχήμα με σωστό προσανατολισμό", en: "Find the shape with correct orientation" }, color: "from-violet-400 to-fuchsia-500" },
  { id: "sortBySizeGame", title: { el: "Ταξινόμηση Μεγέθους", en: "Sort by Size" }, icon: "📏", description: { el: "Ταξινόμησε από μικρό σε μεγάλο", en: "Sort from smallest to largest" }, color: "from-amber-400 to-orange-500" },
  { id: "groupByCategoriesGame", title: { el: "Χώρισε σε Ομάδες", en: "Group by Categories" }, icon: "🗂️", description: { el: "Βάλε τα αντικείμενα στα σωστά καλάθια", en: "Put objects in the correct baskets" }, color: "from-green-400 to-teal-500" },
  { id: "robotRequestsGame", title: { el: "Αιτήματα Ρομπότ", en: "Robot Requests" }, icon: "🤖", description: { el: "Δώσε στο ρομπότ όσα ζητάει", en: "Give the robot what it asks for" }, color: "from-indigo-400 to-purple-500" },
  { id: "patternRecognitionGame", title: { el: "Αναγνώριση Μοτίβου", en: "Pattern Recognition" }, icon: "🔄", description: { el: "Διάλεξε τη σωστή συνέχεια του μοτίβου", en: "Choose the correct pattern continuation" }, color: "from-rose-400 to-fuchsia-500" },
  { id: "brokenNumberGame", title: { el: "Ανακατεμένος Αριθμός", en: "Broken Number" }, icon: "🔢", description: { el: "Συνέθεσε τον αριθμό από τα κομμάτια", en: "Assemble the number from pieces" }, color: "from-cyan-400 to-indigo-500" },
];

// Extra games only for age 6
const AGE_6_EXTRA_PUZZLE = [
  { id: "miniPuzzleGame", title: { el: "Mini Παζλ", en: "Mini Puzzle" }, icon: "🧩", description: { el: "Σύρε τα κομμάτια στις σωστές θέσεις", en: "Drag pieces to the correct spots" }, color: "from-purple-400 to-pink-500" },
];

const AGE_6_EXTRA_ACTION = [
  { id: "driveTheCarGame", title: { el: "Οδήγησε το Αυτοκινητάκι", en: "Drive the Car" }, icon: "🚗", description: { el: "Οδήγησε μέσα από τον λαβύρινθο", en: "Drive through the maze" }, color: "from-green-400 to-cyan-500" },
];

const AGE_6_EXTRA_MEMORY = [
  { id: "readingGame", title: { el: "Κατανόηση Ανάγνωσης", en: "Reading Comprehension" }, icon: "📖", description: { el: "Διάβασε και απάντησε ερωτήσεις", en: "Read and answer questions" }, color: "from-green-400 to-teal-500" },
];

const AGE_6_EXTRA_MATH = [
  { id: "spellingGame", title: { el: "Ορθογραφία", en: "Spelling" }, icon: "📝", description: { el: "Γράψε τη σωστή λέξη", en: "Spell the correct word" }, color: "from-yellow-400 to-orange-500" },
  { id: "findTheMissingLetterGame", title: { el: "Βρες το Γράμμα που Λείπει", en: "Find the Missing Letter" }, icon: "🔤", description: { el: "Συμπλήρωσε τη λέξη", en: "Complete the word" }, color: "from-pink-400 to-purple-500" },
  { id: "findTheMissingLetterIGame", title: { el: "Βρες το Γράμμα I, H, Y", en: "Find the Letter with Accent" }, icon: "🔤", description: { el: "Συμπλήρωσε τη λέξη με το σωστό Ι, Η, Υ", en: "Find the Letter with Accent" }, color: "from-purple-400 to-indigo-500" },
  { id: "findTheMissingLetterIIGame", title: { el: "Βρες το Γράμμα ι, η, υ", en: "Find the Letter i, h, y" }, icon: "🔤", description: { el: "Συμπλήρωσε τη λέξη με το σωστό ι, η, υ", en: "Find the Letter i, h, y" }, color: "from-purple-400 to-indigo-500" },
  { id: "timeClockGame", title: { el: "Μάθε την Ώρα", en: "Learn the Time" }, icon: "⏰", description: { el: "Διάβασε το ρολόι", en: "Read the clock" }, color: "from-blue-400 to-cyan-500" },
  { id: "moneyRecognitionGame", title: { el: "Νομίσματα", en: "Money Recognition" }, icon: "💰", description: { el: "Αναγνώρισε τα χρήματα", en: "Recognize money" }, color: "from-yellow-400 to-amber-500" },
  { id: "simpleGeographyGame", title: { el: "Γεωγραφία", en: "Geography" }, icon: "🌍", description: { el: "Μάθε για τον κόσμο", en: "Learn about the world" }, color: "from-green-400 to-teal-500" },
  { id: "scienceExperimentsGame", title: { el: "Επιστήμη", en: "Science" }, icon: "🔬", description: { el: "Μικρά πειράματα επιστήμης", en: "Simple science experiments" }, color: "from-purple-400 to-indigo-500" },
  { id: "findTheSumGame", title: { el: "Βρες το Σωστό Άθροισμα", en: "Find the Right Sum" }, icon: "➕", description: { el: "Βρες το αποτέλεσμα της πρόσθεσης", en: "Find the addition result" }, color: "from-yellow-400 to-orange-500" },
  { id: "findTheSumPairGame", title: { el: "Βρες το Σωστό Άθροισμα Ζευγαριών", en: "Find the Right Pair" }, icon: "➕", description: { el: "Βρες το αποτέλεσμα της πρόσθεσης ζευγαριών", en: "Find the addition result" }, color: "from-yellow-400 to-orange-500" },
];

// Logic games for 7-8
const LOGIC_78_EXTRA_GAMES = [
  { id: "numberAdventureGame", title: { el: "Περιπέτεια Αριθμών", en: "Number Adventure" }, icon: "🗺️", description: { el: "Λύσε πράξεις για να προχωρήσεις", en: "Solve math to advance" }, color: "from-blue-400 to-purple-500" },
  { id: "findTheWordGame", title: { el: "Βρες τη Λέξη", en: "Find the Word" }, icon: "🔤", description: { el: "Βρες τη σωστή λέξη από την εικόνα", en: "Find the right word from the picture" }, color: "from-green-400 to-teal-500" },
  { id: "simpleLogicPuzzleGame", title: { el: "Απλό Λογικό Γρίφο", en: "Simple Logic Puzzle" }, icon: "🧩", description: { el: "Βρες τον θησαυρό με λογική", en: "Find the treasure with logic" }, color: "from-purple-400 to-pink-500" },
  { id: "colorShapeGame", title: { el: "Χρώματα & Σχήματα", en: "Colors & Shapes" }, icon: "🎨", description: { el: "Ταίριαξε χρώματα και σχήματα", en: "Match colors and shapes" }, color: "from-pink-400 to-orange-500" },
  { id: "storyBuilderGame", title: { el: "Μικρή Ιστορία", en: "Story Builder" }, icon: "📖", description: { el: "Συμπλήρωσε τα κενά στην ιστορία", en: "Fill in the blanks in the story" }, color: "from-amber-400 to-orange-500" },
];

// New 11-12 specific games
const NEW_1112_GAMES = [
  { id: "timelineGame", title: { el: "Χρονολόγιο", en: "Timeline" }, icon: "📅", description: { el: "Βάλε γεγονότα σε χρονολογική σειρά", en: "Put events in chronological order" }, color: "from-amber-400 to-orange-500" },
  { id: "spaceExplorerGame", title: { el: "Εξερεύνηση Διαστήματος", en: "Space Explorer" }, icon: "🚀", description: { el: "Μάθε για τους πλανήτες", en: "Learn about the planets" }, color: "from-indigo-400 to-purple-500" },
  { id: "mythologyQuizGame", title: { el: "Μυθολογία", en: "Mythology Quiz" }, icon: "⚡", description: { el: "Γνώσεις ελληνικής μυθολογίας", en: "Greek mythology knowledge" }, color: "from-yellow-400 to-amber-500" },
  { id: "inventorQuizGame", title: { el: "Εφευρέτες & Εφευρέσεις", en: "Inventors Quiz" }, icon: "💡", description: { el: "Ταίριαξε εφευρέτες με εφευρέσεις", en: "Match inventors with inventions" }, color: "from-teal-400 to-green-500" },
  { id: "musicRhythmGame", title: { el: "Ρυθμός Μουσικής", en: "Music Rhythm" }, icon: "🥁", description: { el: "Ακολούθησε τον ρυθμό", en: "Follow the rhythm" }, color: "from-pink-400 to-rose-500" },
  { id: "equationBalancerGame", title: { el: "Ισορρόπησε την Εξίσωση", en: "Equation Balancer" }, icon: "⚖️", description: { el: "Κάνε τις δύο πλευρές ίσες", en: "Make both sides equal" }, color: "from-blue-400 to-cyan-500" },
  { id: "percentageCalcGame", title: { el: "Ποσοστά", en: "Percentage Calc" }, icon: "📊", description: { el: "Υπολόγισε τα ποσοστά", en: "Calculate percentages" }, color: "from-emerald-400 to-teal-500" },
  { id: "analogiesGame", title: { el: "Αναλογίες", en: "Analogies" }, icon: "🔗", description: { el: "Α προς Β όπως Γ προς ...;", en: "A is to B as C is to ...?" }, color: "from-violet-400 to-purple-500" },
  { id: "sequenceDecoderGame", title: { el: "Αποκωδικοποιητής Ακολουθιών", en: "Sequence Decoder" }, icon: "🔑", description: { el: "Βρες τον κανόνα της ακολουθίας", en: "Find the sequence rule" }, color: "from-cyan-400 to-blue-500" },
  { id: "debugTheCodeGame", title: { el: "Διόρθωσε τον Κώδικα", en: "Debug the Code" }, icon: "🐛", description: { el: "Βρες το λάθος στον κώδικα", en: "Find the bug in the code" }, color: "from-green-400 to-emerald-500" },
];

// School prep games (11-12)
const SCHOOL_PREP_GAMES = [
  { id: "mathBattleGame", title: { el: "Μαθηματική Μονομαχία", en: "Math Battle" }, icon: "⚔️", description: { el: "Πολέμα τέρατα με μαθηματικά", en: "Fight monsters with math" }, color: "from-red-400 to-orange-500" },
  { id: "wordBuilderGame", title: { el: "Κατασκευή Λέξεων", en: "Word Builder" }, icon: "📝", description: { el: "Φτιάξε λέξεις από γράμματα", en: "Build words from letters" }, color: "from-blue-400 to-cyan-500" },
  { id: "logicGridPuzzleGame", title: { el: "Λογικό Γρίφο", en: "Logic Grid Puzzle" }, icon: "🧩", description: { el: "Ποιος κάθεται πού;", en: "Who sits where?" }, color: "from-purple-400 to-indigo-500" },
  { id: "geographyQuizGame", title: { el: "Γεωγραφικό Quiz", en: "Geography Quiz" }, icon: "🌍", description: { el: "Βρες χώρες και πρωτεύουσες", en: "Find countries and capitals" }, color: "from-green-400 to-teal-500" },
  { id: "scienceLabGame", title: { el: "Εργαστήριο Επιστήμης", en: "Science Lab" }, icon: "🔬", description: { el: "Κάνε πειράματα επιλέγοντας σωστά", en: "Do experiments by choosing correctly" }, color: "from-cyan-400 to-blue-500" },
  { id: "codeBreakerGame", title: { el: "Κρυπτογράφος", en: "Code Breaker" }, icon: "🔐", description: { el: "Αποκωδικοποίησε μυστικά μηνύματα", en: "Decode secret messages" }, color: "from-amber-400 to-orange-500" },
];

// Master lookup: every game definition indexed by ID
const ALL_GAMES_MAP = {};
[PUZZLE_GAMES, ACTION_GAMES, EMOTIONAL_INTELLIGENCE, ANIMAL_KNOWLEDGE,
 COLOR_GAMES, MUSIC_GAMES, MEMORY_GAMES, MATH_GAMES,
 AGE_6_EXTRA_PUZZLE, AGE_6_EXTRA_ACTION, AGE_6_EXTRA_MEMORY, AGE_6_EXTRA_MATH,
 LOGIC_78_EXTRA_GAMES, NEW_1112_GAMES, SCHOOL_PREP_GAMES,
].forEach(arr => arr.forEach(g => { ALL_GAMES_MAP[g.id] = g; }));

// ── Game IDs per mode ──────────────────────────────────────────────────────

const FUN_CATEGORY_IDS = {
  puzzleGames:            ["tapPuzzle", "imagePuzzle"],
  actionGames:            ["bubblePop", "shapeMatch", "quickTap", "movementSequence"],
  emotionalIntelligence:  ["howDoesItFeel", "doTheRightThing", "whoWaitsInLine", "helpYourFriend", "guessEmotionFromVoice"],
  animalKnowledge:        ["whatDoesItEat", "nightOrDay", "sortBySeasons", "whatMovesWithWheels", "animalSounds", "animalHabitats", "animalTracks"],
  colorGames:             ["colorMatch", "colorDrawing", "createScene", "stickerCard", "freezeMelt", "drawTheShadow"],
  musicGames:             ["musicalPiano", "vehicleSounds", "flippedSoundCards", "whatHeardFirst"],
};

const FUN_AGE6_EXTRAS = {
  puzzleGames: ["miniPuzzleGame"],
  actionGames: ["driveTheCarGame"],
};

const LOGIC_CATEGORY_IDS = {
  memoryObservation: ["memoryMatch", "positionMemory", "whichDisappeared", "whichMoved", "whatWasInBetween", "combineTwoImages", "guessFromPieces"],
  patternSpatial:    ["patternRecognitionGame", "flippedShapesGame", "completeSymmetry", "findHalfShape", "matchShapeObjectGame", "fixThePicture", "mazeGame", "paintSameObjects", "colorShapeGame"],
  sortingLogic:      ["sortBySizeGame", "groupByCategoriesGame", "findOddOneOutGame", "sinkOrFloat", "robotRequestsGame", "simpleLogicPuzzleGame"],
  mathNumbers:       ["whichIsLessGame", "findMissingNumberGame", "whatRemainsGame", "countAndLearn", "brokenNumberGame", "numberAdventureGame"],
  languageReading:   ["alphabetMatch", "syllableListening", "firstLetterGame", "hiddenLetterGame", "rhymeListening", "wakeUpLetterGame", "guessWhatGame", "similarSoundsGame", "completeSentenceGame", "alphabetRoadGame", "findTheWordGame", "storyBuilderGame"],
};

const LOGIC_AGE6_EXTRAS = {
  mathNumbers:     ["findTheSumGame", "findTheSumPairGame", "timeClockGame", "moneyRecognitionGame"],
  languageReading: ["readingGame", "spellingGame", "findTheMissingLetterGame", "findTheMissingLetterIGame", "findTheMissingLetterIIGame", "simpleGeographyGame", "scienceExperimentsGame"],
};

// ── Age 11-12 specific category IDs (filtered for pre-teens) ──────────────

const FUN_1112_CATEGORY_IDS = {
  puzzleGames:           ["tapPuzzle", "imagePuzzle", "guessFromPieces", "combineTwoImages"],
  actionThinking:        ["quickTap", "movementSequence", "positionMemory", "whichDisappeared", "whichMoved", "flippedSoundCards", "whatHeardFirst", "whatWasInBetween"],
  emotionalIntelligence: ["howDoesItFeel", "doTheRightThing", "whoWaitsInLine", "helpYourFriend", "guessEmotionFromVoice"],
  creative:              ["createScene", "colorDrawing", "stickerCard", "drawTheShadow", "completeSymmetry", "fixThePicture", "freezeMelt", "paintSameObjects"],
  scienceNature:         ["nightOrDay", "sinkOrFloat", "sortBySeasons", "timelineGame", "spaceExplorerGame", "mythologyQuizGame", "inventorQuizGame"],
  musicSounds:           ["musicalPiano", "vehicleSounds", "musicRhythmGame"],
};

const LOGIC_1112_CATEGORY_IDS = {
  memoryObservation: ["memoryMatch", "positionMemory", "whichDisappeared", "whichMoved", "whatWasInBetween", "combineTwoImages", "guessFromPieces"],
  patternSpatial:    ["patternRecognitionGame", "mazeGame", "findOddOneOutGame", "completeSymmetry", "findHalfShape", "matchShapeObjectGame", "flippedShapesGame", "paintSameObjects"],
  advancedMath:      ["findMissingNumberGame", "whatRemainsGame", "brokenNumberGame", "sortBySizeGame", "robotRequestsGame", "groupByCategoriesGame", "equationBalancerGame", "percentageCalcGame"],
  advancedLanguage:  ["completeSentenceGame", "guessWhatGame", "similarSoundsGame", "hiddenLetterGame", "firstLetterGame", "findTheWordGame", "storyBuilderGame", "analogiesGame"],
  schoolPrep:        ["mathBattleGame", "wordBuilderGame", "logicGridPuzzleGame", "geographyQuizGame", "scienceLabGame", "codeBreakerGame"],
  logicChallenge:    ["simpleLogicPuzzleGame", "numberAdventureGame", "colorShapeGame", "alphabetRoadGame", "sequenceDecoderGame", "debugTheCodeGame"],
};

export const FUN_1112_SIDEBAR_CATEGORIES = [
  { id: "puzzleGames", icon: "🧩", title: { el: "Παζλ", en: "Puzzles" }, color: "from-blue-400 to-purple-500" },
  { id: "actionThinking", icon: "⚡", title: { el: "Αντίδραση & Σκέψη", en: "Reaction & Thinking" }, color: "from-green-400 to-teal-500" },
  { id: "emotionalIntelligence", icon: "❤️", title: { el: "Συναισθηματική Νοημοσύνη", en: "Emotional Intelligence" }, color: "from-pink-400 to-red-500" },
  { id: "creative", icon: "🎨", title: { el: "Δημιουργικότητα", en: "Creativity" }, color: "from-amber-400 to-orange-500" },
  { id: "scienceNature", icon: "🔬", title: { el: "Επιστήμη & Φύση", en: "Science & Nature" }, color: "from-emerald-400 to-teal-500" },
  { id: "musicSounds", icon: "🎵", title: { el: "Μουσική & Ήχοι", en: "Music & Sounds" }, color: "from-yellow-400 to-orange-500" },
];

export const LOGIC_1112_SIDEBAR_CATEGORIES = [
  { id: "memoryObservation", icon: "🧠", title: { el: "Μνήμη & Παρατήρηση", en: "Memory & Observation" }, color: "from-violet-400 to-fuchsia-500" },
  { id: "patternSpatial", icon: "🔄", title: { el: "Μοτίβα & Χώρος", en: "Patterns & Space" }, color: "from-cyan-400 to-blue-500" },
  { id: "advancedMath", icon: "🔢", title: { el: "Προχωρημένα Μαθηματικά", en: "Advanced Math" }, color: "from-blue-400 to-indigo-500" },
  { id: "advancedLanguage", icon: "📖", title: { el: "Γλώσσα & Κατανόηση", en: "Language & Comprehension" }, color: "from-orange-400 to-red-500" },
  { id: "schoolPrep", icon: "🏫", title: { el: "Προετοιμασία Σχολείου", en: "School Preparation" }, color: "from-emerald-400 to-teal-500" },
  { id: "logicChallenge", icon: "🧩", title: { el: "Λογικές Προκλήσεις", en: "Logic Challenges" }, color: "from-rose-400 to-pink-500" },
];

function resolveIds(categoryIds, extras, ageGroup) {
  const result = {};
  for (const [catId, ids] of Object.entries(categoryIds)) {
    const games = ids.map(id => ALL_GAMES_MAP[id]).filter(Boolean);
    const extraIds = (ageGroup === "6" && extras[catId]) || [];
    games.push(...extraIds.map(id => ALL_GAMES_MAP[id]).filter(Boolean));
    result[catId] = games;
  }
  return result;
}

export function getGameCategories(ageGroup, mode) {
  if (ageGroup === "11-12") {
    if (mode === "fun") return resolveIds(FUN_1112_CATEGORY_IDS, {}, ageGroup);
    if (mode === "logic") return resolveIds(LOGIC_1112_CATEGORY_IDS, {}, ageGroup);
  }
  if (mode === "fun") return resolveIds(FUN_CATEGORY_IDS, FUN_AGE6_EXTRAS, ageGroup);
  if (mode === "logic") return resolveIds(LOGIC_CATEGORY_IDS, LOGIC_AGE6_EXTRAS, ageGroup);

  // Default: all categories (backward compatible for age 4-5)
  const base = {
    puzzleGames: [...PUZZLE_GAMES],
    actionGames: [...ACTION_GAMES],
    emotionalIntelligence: [...EMOTIONAL_INTELLIGENCE],
    animalKnowledge: [...ANIMAL_KNOWLEDGE],
    colorGames: [...COLOR_GAMES],
    musicGames: [...MUSIC_GAMES],
    memoryGames: [...MEMORY_GAMES],
    mathGames: [...MATH_GAMES],
  };

  if (ageGroup === "6") {
    base.puzzleGames.push(...AGE_6_EXTRA_PUZZLE);
    base.actionGames.push(...AGE_6_EXTRA_ACTION);
    base.memoryGames.push(...AGE_6_EXTRA_MEMORY);
    base.mathGames = [...AGE_6_EXTRA_MATH, ...base.mathGames];
  }

  return base;
}
