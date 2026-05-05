// Static search index - pages, games, lessons, key features
// Each entry: { id, title:{el,en}, desc:{el,en}, icon, path, category, keywords }

export const SEARCH_INDEX = [
  // Main pages
  { id: "home",          icon: "🏠", path: "/",                  category: "page",  title: { el: "Αρχική",                en: "Home" },                keywords: ["home", "αρχική", "main"] },
  { id: "profile",       icon: "👤", path: "/profile",           category: "page",  title: { el: "Προφίλ",                en: "Profile" },             keywords: ["profile", "προφίλ", "settings"] },
  { id: "achievements",  icon: "🏆", path: "/achievements",      category: "page",  title: { el: "Επιτυχίες",             en: "Achievements" },        keywords: ["badges", "ταυτότητες"] },
  { id: "shop",          icon: "🛍️", path: "/shop",              category: "page",  title: { el: "Κατάστημα",             en: "Shop" },                keywords: ["shop", "κατάστημα", "buy", "coins"] },
  { id: "leaderboard",   icon: "📊", path: "/leaderboard",       category: "page",  title: { el: "Πίνακας Κατάταξης",     en: "Leaderboard" },         keywords: ["ranking", "κατάταξη", "top"] },
  { id: "blog",          icon: "📝", path: "/blog",              category: "page",  title: { el: "Blog",                  en: "Blog" },                keywords: ["blog", "articles"] },
  { id: "subscription",  icon: "💎", path: "/subscription",      category: "page",  title: { el: "Συνδρομή",              en: "Subscription" },        keywords: ["premium", "συνδρομή", "subscribe"] },
  { id: "weekly-report", icon: "📋", path: "/weekly-report",     category: "page",  title: { el: "Εβδ. Αναφορά",         en: "Weekly Report" },       keywords: ["weekly", "report", "αναφορά"] },
  { id: "curriculum",    icon: "🗺️", path: "/curriculum",        category: "page",  title: { el: "Πρόγραμμα Σπουδών",     en: "Curriculum" },          keywords: ["curriculum", "πρόγραμμα"] },
  { id: "for-teachers",  icon: "👨‍🏫", path: "/for-teachers",     category: "page",  title: { el: "Για Δασκάλους",         en: "For Teachers" },        keywords: ["teacher", "δάσκαλος", "school"] },
  { id: "for-parents",   icon: "👪", path: "/for-parents",       category: "page",  title: { el: "Για Γονείς",            en: "For Parents" },         keywords: ["parent", "γονέας", "family"] },
  { id: "contact",       icon: "📞", path: "/contact",           category: "page",  title: { el: "Επικοινωνία",           en: "Contact" },             keywords: ["contact", "support", "help"] },
  { id: "faq",           icon: "❓", path: "/faq",               category: "page",  title: { el: "Συχνές Ερωτήσεις",      en: "FAQ" },                 keywords: ["faq", "help", "questions"] },

  // Student features
  { id: "daily",         icon: "🎯", path: "/daily",             category: "game",  title: { el: "Ημερήσια Πρόκληση",      en: "Daily Challenge" },     keywords: ["daily", "challenge", "πρόκληση"] },
  { id: "adventure",     icon: "🗺️", path: "/adventure",         category: "game",  title: { el: "Χάρτης Περιπέτειας",     en: "Adventure Map" },       keywords: ["adventure", "map", "stations"] },
  { id: "battle",        icon: "⚔️", path: "/battle",            category: "game",  title: { el: "Battle Royale",          en: "Battle Royale" },       keywords: ["battle", "royale", "fight"] },
  { id: "pet",           icon: "🐉", path: "/pet",               category: "game",  title: { el: "Το Κατοικίδιό μου",      en: "My Pet" },              keywords: ["pet", "tamagotchi", "κατοικίδιο"] },
  { id: "story",         icon: "📖", path: "/story",             category: "game",  title: { el: "Ιστορίες",                en: "Story Mode" },          keywords: ["story", "ιστορία", "interactive"] },
  { id: "cards",         icon: "🃏", path: "/cards",             category: "game",  title: { el: "Συλλογή Καρτών",          en: "Card Collection" },     keywords: ["cards", "collect", "καρτές"] },
  { id: "challenge",     icon: "👫", path: "/challenge",         category: "game",  title: { el: "Πρόκληση Φίλου",          en: "Challenge a Friend" },  keywords: ["friend", "challenge"] },
  { id: "live-quiz",     icon: "🎮", path: "/live-quiz",         category: "game",  title: { el: "Live Quiz",                en: "Live Quiz" },          keywords: ["live", "quiz", "kahoot"] },
  { id: "avatar",        icon: "🎭", path: "/avatar",            category: "game",  title: { el: "Avatar Builder",          en: "Avatar Builder" },      keywords: ["avatar", "customize", "look"] },
  { id: "online-multi",  icon: "🌐", path: "/online-multiplayer", category: "game",  title: { el: "Online Πολλαπλών",       en: "Online Multiplayer" },  keywords: ["online", "multiplayer", "play"] },
  { id: "ai-tutor",      icon: "🤖", path: "/ai-tutor",          category: "game",  title: { el: "AI Καθηγητής",            en: "AI Tutor" },            keywords: ["ai", "tutor", "help"] },

  // Game categories
  { id: "board-games",   icon: "♟️", path: "/play/board-games",  category: "game",  title: { el: "Επιτραπέζια Παιχνίδια",  en: "Board Games" },         keywords: ["board", "chess", "checkers", "go"] },
  { id: "adult-games",   icon: "🧠", path: "/play/adult-games",  category: "game",  title: { el: "Παιχνίδια Ενηλίκων",     en: "Adult Games" },         keywords: ["adult", "ενήλικες", "logic"] },
  { id: "age-2-3",       icon: "👶", path: "/play/2-3-school",   category: "game",  title: { el: "Ηλικία 2-3",              en: "Age 2-3" },             keywords: ["2-3", "toddler", "νήπιο"] },
  { id: "age-4-5",       icon: "🧒", path: "/play/4-5",          category: "game",  title: { el: "Ηλικία 4-5",              en: "Age 4-5" },             keywords: ["4-5", "preschool", "νηπιαγωγείο"] },
  { id: "age-6",         icon: "👦", path: "/play/6",            category: "game",  title: { el: "Ηλικία 6",                en: "Age 6" },               keywords: ["6", "first grade"] },
  { id: "age-7-8",       icon: "👨", path: "/play/7-8",          category: "game",  title: { el: "Ηλικία 7-8",              en: "Age 7-8" },             keywords: ["7-8", "elementary"] },
  { id: "age-9-10",      icon: "👩", path: "/play/9-10",         category: "game",  title: { el: "Ηλικία 9-10",             en: "Age 9-10" },            keywords: ["9-10", "elementary"] },
  { id: "age-11-12",     icon: "🎓", path: "/play/11-12-school", category: "game",  title: { el: "Ηλικία 11-12",            en: "Age 11-12" },           keywords: ["11-12", "tween"] },

  // Teacher features
  { id: "teacher",       icon: "📚", path: "/teacher-dashboard", category: "teacher", title: { el: "Πίνακας Δασκάλου",      en: "Teacher Dashboard" },   keywords: ["teacher", "δάσκαλος", "dashboard"] },
  { id: "worksheets",    icon: "📄", path: "/worksheets",        category: "teacher", title: { el: "Φύλλα Εργασίας",         en: "Printable Worksheets" }, keywords: ["worksheet", "print", "ασκήσεις"] },
  { id: "join-class",    icon: "🏫", path: "/join",              category: "teacher", title: { el: "Είσοδος σε Τάξη",        en: "Join Classroom" },      keywords: ["classroom", "join", "code"] },
  { id: "my-classroom",  icon: "🏛️", path: "/my-classroom",      category: "teacher", title: { el: "Η Τάξη μου",             en: "My Classroom" },        keywords: ["my classroom", "τάξη"] },

  // Parent features
  { id: "parent-dash",   icon: "📊", path: "/parent-dashboard",  category: "parent", title: { el: "Πίνακας Γονέα",          en: "Parent Dashboard" },    keywords: ["parent", "γονέας", "dashboard"] },
  { id: "family",        icon: "👨‍👩‍👧", path: "/family-challenge",   category: "parent", title: { el: "Οικογενειακή Πρόκληση",  en: "Family Challenge" },    keywords: ["family", "οικογένεια", "challenge"] },

  // Topics (search keywords for content categories)
  { id: "math",          icon: "🧮", path: "/play/adult-games",  category: "topic", title: { el: "Μαθηματικά",            en: "Math" },                keywords: ["math", "μαθηματικά", "addition", "subtraction", "multiplication", "fractions", "πρόσθεση", "αφαίρεση"] },
  { id: "science",       icon: "🔬", path: "/play/9-10",         category: "topic", title: { el: "Επιστήμη",              en: "Science" },             keywords: ["science", "επιστήμη", "biology", "chemistry"] },
  { id: "geography",     icon: "🌍", path: "/play/9-10",         category: "topic", title: { el: "Γεωγραφία",             en: "Geography" },           keywords: ["geography", "γεωγραφία", "country", "capital"] },
  { id: "history",       icon: "📜", path: "/play/11-12-school", category: "topic", title: { el: "Ιστορία",               en: "History" },             keywords: ["history", "ιστορία", "ancient"] },
  { id: "language",      icon: "📖", path: "/play/7-8",          category: "topic", title: { el: "Γλώσσα",                en: "Language" },            keywords: ["language", "γλώσσα", "grammar", "spelling"] },
  { id: "puzzles",       icon: "🧩", path: "/play/adult-games",  category: "topic", title: { el: "Παζλ & Γρίφοι",        en: "Puzzles" },             keywords: ["puzzle", "puzzles", "παζλ", "γρίφοι", "brain teasers", "logic"] },

  // Individual board games (use ?game= query so deep-link opens the right game)
  { id: "chess",         icon: "♟️", path: "/play/board-games?game=chess",         category: "board", title: { el: "Σκάκι",            en: "Chess" },           keywords: ["chess", "σκάκι"] },
  { id: "checkers",      icon: "🔴", path: "/play/board-games?game=checkers",      category: "board", title: { el: "Ντάμα",             en: "Checkers" },        keywords: ["checkers", "ντάμα", "draughts"] },
  { id: "tic-tac-toe",   icon: "❌", path: "/play/board-games?game=tic-tac-toe",   category: "board", title: { el: "Τρίλιζα",          en: "Tic-Tac-Toe" },     keywords: ["tic", "tac", "toe", "τρίλιζα"] },
  { id: "memory-board",  icon: "🃏", path: "/play/board-games?game=memory",        category: "board", title: { el: "Μνήμη",             en: "Memory Match" },    keywords: ["memory", "μνήμη", "match", "ταίριασμα"] },
  { id: "connect4",      icon: "🟡", path: "/play/board-games?game=connect4",      category: "board", title: { el: "Σκορ-4",           en: "Connect 4" },       keywords: ["connect", "four", "σκορ"] },

  // Individual adult games
  { id: "sudoku",        icon: "🔢", path: "/play/adult-games?game=sudoku",        category: "adult", title: { el: "Σουντόκου",         en: "Sudoku" },          keywords: ["sudoku", "σουντόκου", "numbers"] },
  { id: "crossword",     icon: "🔡", path: "/play/adult-games?game=crossword",     category: "adult", title: { el: "Σταυρόλεξο",        en: "Crossword" },       keywords: ["crossword", "σταυρόλεξο"] },
  { id: "word-search",   icon: "🔤", path: "/play/adult-games?game=word-search",   category: "adult", title: { el: "Κρυπτόλεξο",        en: "Word Search" },     keywords: ["word", "search", "κρυπτόλεξο"] },
  { id: "minesweeper",   icon: "💣", path: "/play/adult-games?game=minesweeper",   category: "adult", title: { el: "Ναρκαλιευτής",      en: "Minesweeper" },     keywords: ["mines", "ναρκαλιευτής"] },
  { id: "memory-adult",  icon: "🧠", path: "/play/adult-games?game=memory",        category: "adult", title: { el: "Μνήμη Ενηλίκων",   en: "Memory Adults" },   keywords: ["memory", "μνήμη", "adult"] },

  // Quick Wins (new arcade-style classics)
  { id: "qw-showcase",   icon: "🎮", path: "/games",                               category: "game",  title: { el: "Νέα Παιχνίδια",     en: "New Games" },        keywords: ["new", "νέα", "arcade", "classics"] },
  { id: "qw-wordle",     icon: "🟩", path: "/games/wordle",                        category: "game",  title: { el: "Wordle",            en: "Wordle" },           keywords: ["wordle", "λέξη", "5 letters"] },
  { id: "qw-2048",       icon: "🔢", path: "/games/2048",                          category: "game",  title: { el: "2048",              en: "2048" },             keywords: ["2048", "merge", "tiles"] },
  { id: "qw-snake",      icon: "🐍", path: "/games/snake",                         category: "game",  title: { el: "Snake",             en: "Snake" },            keywords: ["snake", "φίδι"] },
  { id: "qw-tetris",     icon: "🟦", path: "/games/tetris",                        category: "game",  title: { el: "Tetris",            en: "Tetris" },           keywords: ["tetris", "blocks"] },
  { id: "qw-ttt",        icon: "❌", path: "/games/tic-tac-toe",                   category: "game",  title: { el: "Τρίλιζα Online",    en: "Tic-Tac-Toe Online"}, keywords: ["tic-tac-toe", "τρίλιζα", "xo", "online"] },
  { id: "qw-24",         icon: "🎯", path: "/games/24",                            category: "game",  title: { el: "24 Game",           en: "24 Game" },          keywords: ["24", "math", "puzzle"] },
  { id: "qw-wsearch",    icon: "🔍", path: "/games/word-search",                   category: "game",  title: { el: "Κρυπτόλεξο (νέο)", en: "Word Search (new)"}, keywords: ["word", "search", "κρυπτόλεξο"] },
  { id: "qw-whack",      icon: "🐹", path: "/games/whack",                         category: "game",  title: { el: "Whack-a-Mole",      en: "Whack-a-Mole" },     keywords: ["whack", "mole", "reflex"] },
  { id: "qw-dots",       icon: "✏️", path: "/games/connect-dots",                  category: "game",  title: { el: "Ένωσε τις Τελείες", en: "Connect the Dots" }, keywords: ["dots", "connect", "draw"] },
  { id: "qw-draw",       icon: "🎨", path: "/games/drawing",                       category: "game",  title: { el: "Καμβάς",            en: "Drawing Pad" },      keywords: ["draw", "paint", "canvas", "ζωγραφική"] },

  // Educational Games
  { id: "edu-show",      icon: "🎓", path: "/games/educational",                   category: "game",  title: { el: "Εκπαιδευτικά Παιχνίδια", en: "Educational Games" }, keywords: ["educational", "learn", "εκπαιδευτικά"] },
  { id: "edu-spell",     icon: "🐝", path: "/games/spelling-bee",                  category: "game",  title: { el: "Spelling Bee",      en: "Spelling Bee" },     keywords: ["spelling", "voice", "ορθογραφία"] },
  { id: "edu-time",      icon: "🕐", path: "/games/tell-time",                     category: "game",  title: { el: "Πες την Ώρα",       en: "Tell the Time" },    keywords: ["clock", "time", "ώρα", "ρολόι"] },
  { id: "edu-money",     icon: "💶", path: "/games/money",                         category: "game",  title: { el: "Μέτρα Χρήματα",     en: "Money Counter" },    keywords: ["money", "coins", "χρήματα"] },
  { id: "edu-times",     icon: "✖️", path: "/games/times-tables",                  category: "game",  title: { el: "Αγώνας Προπαίδειας", en: "Times Tables Race" }, keywords: ["multiplication", "tables", "προπαίδεια"] },
  { id: "edu-map",       icon: "🇬🇷", path: "/games/map-greece",                    category: "game",  title: { el: "Χάρτης Ελλάδας",    en: "Map of Greece" },    keywords: ["map", "greece", "regions", "χάρτης"] },
  { id: "edu-periodic",  icon: "🧪", path: "/games/periodic",                      category: "game",  title: { el: "Περιοδικός Πίνακας", en: "Periodic Table" },   keywords: ["chemistry", "elements", "χημεία"] },
  { id: "edu-anatomy",   icon: "🫀", path: "/games/anatomy",                       category: "game",  title: { el: "Σώμα Ανθρώπου",     en: "Body Parts" },       keywords: ["anatomy", "body", "σώμα", "ανατομία"] },
  { id: "edu-math",      icon: "⚡", path: "/games/math-sprint",                   category: "game",  title: { el: "Math Sprint",       en: "Math Sprint" },      keywords: ["math", "speed", "μαθηματικά"] },
  { id: "edu-verbs",     icon: "📖", path: "/games/verbs",                         category: "game",  title: { el: "Κλίση Ρημάτων",    en: "Verb Conjugation" }, keywords: ["verb", "grammar", "ρήμα", "γραμματική"] },
  { id: "edu-pquiz",     icon: "⚛️", path: "/games/periodic-quiz",                 category: "game",  title: { el: "Quiz Στοιχείων",    en: "Periodic Quiz" },    keywords: ["chemistry", "quiz", "elements"] },
  { id: "edu-cap",       icon: "🌍", path: "/games/capitals",                      category: "game",  title: { el: "Πρωτεύουσες",       en: "Capitals" },         keywords: ["capitals", "geography", "γεωγραφία"] },
  { id: "edu-history",   icon: "⏳", path: "/games/history-timeline",              category: "game",  title: { el: "Χρονογραμμή",       en: "History Timeline" }, keywords: ["history", "timeline", "ιστορία"] },
  { id: "edu-code",      icon: "🤖", path: "/games/code-puzzles",                  category: "game",  title: { el: "Παζλ Κώδικα",      en: "Code Puzzles" },     keywords: ["code", "programming", "robot"] },
  { id: "edu-logic",     icon: "🔌", path: "/games/logic-gates",                   category: "game",  title: { el: "Λογικές Πύλες",    en: "Logic Gates" },      keywords: ["logic", "AND", "OR", "XOR"] },
  { id: "edu-frac",      icon: "🍕", path: "/games/fraction-pizza",                category: "game",  title: { el: "Πίτσα Κλασμάτων",  en: "Fraction Pizza" },   keywords: ["fractions", "pizza", "κλάσματα"] },
  { id: "edu-music",     icon: "🎵", path: "/games/music-notes",                   category: "game",  title: { el: "Μουσικές Νότες",   en: "Music Notes" },      keywords: ["music", "notes", "μουσική"] },

  // Creative & Wow Games
  { id: "cr-show",       icon: "🎨", path: "/games/creative",                      category: "game",  title: { el: "Δημιουργικά Παιχνίδια", en: "Creative Games" }, keywords: ["creative", "wow", "δημιουργικά"] },
  { id: "cr-story",      icon: "📖", path: "/games/story-builder",                 category: "game",  title: { el: "Φτιάξε Ιστορία",   en: "Story Builder" },     keywords: ["story", "build", "ιστορία"] },
  { id: "cr-comic",      icon: "💬", path: "/games/comic-maker",                   category: "game",  title: { el: "Comic Maker",       en: "Comic Maker" },       keywords: ["comic", "panels", "κόμικ"] },
  { id: "cr-composer",   icon: "🎼", path: "/games/music-composer",                category: "game",  title: { el: "Συνθέτης Μουσικής", en: "Music Composer" },   keywords: ["music", "compose", "σύνθεση"] },
  { id: "cr-patterns",   icon: "🎨", path: "/games/patterns",                      category: "game",  title: { el: "Σχέδια & Μοτίβα",  en: "Pattern Designer" },  keywords: ["pattern", "symmetry", "μοτίβα"] },
  { id: "cr-pixel",      icon: "🟦", path: "/games/pixel-art",                     category: "game",  title: { el: "Pixel Art",         en: "Pixel Art" },         keywords: ["pixel", "art", "8bit"] },
  { id: "cr-madlibs",    icon: "🎭", path: "/games/mad-libs",                      category: "game",  title: { el: "Mad Libs",          en: "Mad Libs" },          keywords: ["madlibs", "fill", "story"] },
  { id: "cr-anim",       icon: "🎬", path: "/games/animation",                     category: "game",  title: { el: "Animation Studio",  en: "Animation Studio" },  keywords: ["animation", "frames", "animation"] },
  { id: "cr-emoji",      icon: "🎭", path: "/games/emoji-story",                   category: "game",  title: { el: "Ιστορία Emoji",     en: "Emoji Story" },       keywords: ["emoji", "story"] },
  { id: "cr-voice",      icon: "🎤", path: "/games/voice-recorder",                category: "game",  title: { el: "Φωνητική Εγγραφή", en: "Voice Recorder" },     keywords: ["voice", "record", "audio"] },
  { id: "cr-stopmot",    icon: "🎥", path: "/games/stop-motion",                   category: "game",  title: { el: "Stop Motion",       en: "Stop Motion" },       keywords: ["stop", "motion", "animation"] },
  { id: "cr-block",      icon: "🧩", path: "/games/block-coding",                  category: "game",  title: { el: "Block Coding",      en: "Block Coding" },      keywords: ["block", "coding", "scratch"] },
  { id: "cr-robot",      icon: "🤖", path: "/games/robot-maze",                    category: "game",  title: { el: "Λαβύρινθος Ρομπότ", en: "Robot Maze" },        keywords: ["robot", "maze", "λαβύρινθος"] },
  { id: "cr-beat",       icon: "🎚️", path: "/games/beat-maker",                    category: "game",  title: { el: "Beat Maker",        en: "Beat Maker" },        keywords: ["beat", "drums", "music"] },

  // Multiplayer
  { id: "mp-show",       icon: "🤝", path: "/games/multiplayer",                   category: "game",  title: { el: "Παιχνίδια Πολλαπλών", en: "Multiplayer Games" }, keywords: ["multiplayer", "1v1", "πολλαπλών"] },
  { id: "mp-battle",     icon: "⚔️", path: "/games/battle-quiz",                   category: "game",  title: { el: "Battle Quiz",       en: "Battle Quiz" },       keywords: ["battle", "quiz", "1v1"] },
  { id: "mp-coop",       icon: "🧭", path: "/games/coop-maze",                     category: "game",  title: { el: "Co-op Λαβύρινθος",  en: "Co-op Maze" },        keywords: ["coop", "maze", "συνεργασία"] },
  { id: "mp-word",       icon: "🔤", path: "/games/word-battle",                   category: "game",  title: { el: "Word Battle",       en: "Word Battle" },       keywords: ["word", "battle", "λέξεις"] },
  { id: "mp-mduel",      icon: "➗", path: "/games/math-duel",                     category: "game",  title: { el: "Math Duel",         en: "Math Duel" },         keywords: ["math", "duel", "μαθηματικά"] },
  { id: "mp-pict",       icon: "🖌️", path: "/games/pictionary",                    category: "game",  title: { el: "Pictionary",         en: "Pictionary" },        keywords: ["pictionary", "draw", "guess"] },

  // Action / Reflex
  { id: "ac-show",       icon: "⚡", path: "/games/action",                        category: "game",  title: { el: "Παιχνίδια Δράσης",  en: "Action Games" },      keywords: ["action", "reflex", "speed", "δράση"] },
  { id: "ac-react",      icon: "⚡", path: "/games/reaction",                      category: "game",  title: { el: "Χρόνος Αντίδρασης", en: "Reaction Time" },     keywords: ["reaction", "speed", "αντίδραση"] },
  { id: "ac-color",      icon: "🌈", path: "/games/color-match",                   category: "game",  title: { el: "Ταίριαξε Χρώμα",    en: "Color Match" },       keywords: ["stroop", "color", "χρώμα"] },
  { id: "ac-fall",       icon: "🔡", path: "/games/falling-letters",               category: "game",  title: { el: "Πέφτουν Γράμματα",  en: "Falling Letters" },   keywords: ["typing", "letters", "γράμματα"] },
  { id: "ac-bubble",     icon: "🫧", path: "/games/bubble-pop",                    category: "game",  title: { el: "Σκάσε Φούσκες",     en: "Bubble Pop" },        keywords: ["bubble", "pop", "φούσκες"] },
  { id: "ac-memseq",     icon: "🧠", path: "/games/memory-sequence",               category: "game",  title: { el: "Memory Sequence",   en: "Memory Sequence" },   keywords: ["simon", "memory", "μνήμη"] },
  { id: "ac-qmath",      icon: "🧮", path: "/games/quick-math",                    category: "game",  title: { el: "Quick Math",        en: "Quick Math" },        keywords: ["math", "quick", "true", "false"] },
  { id: "ac-speed",      icon: "📚", path: "/games/speed-reading",                 category: "game",  title: { el: "Γρήγορη Ανάγνωση", en: "Speed Reading" },      keywords: ["reading", "speed", "ανάγνωση"] },
  { id: "ac-tap",        icon: "🎮", path: "/games/tap-dance",                     category: "game",  title: { el: "Tap Dance",         en: "Tap Dance" },         keywords: ["rhythm", "tap", "ρυθμός"] },

  // STEM
  { id: "stem-show",     icon: "🔬", path: "/games/stem",                          category: "game",  title: { el: "STEM & Επιστήμη",   en: "STEM & Science" },    keywords: ["stem", "science", "επιστήμη"] },
  { id: "stem-chem",     icon: "🧪", path: "/games/chemistry",                     category: "game",  title: { el: "Χημικό Εργαστήριο", en: "Chemistry Lab" },     keywords: ["chemistry", "lab", "χημεία"] },
  { id: "stem-physics",  icon: "⚙️", path: "/games/physics",                       category: "game",  title: { el: "Φυσικό Sandbox",   en: "Physics Sandbox" },    keywords: ["physics", "gravity", "φυσική"] },
  { id: "stem-solar",    icon: "🌌", path: "/games/solar-system",                  category: "game",  title: { el: "Ηλιακό Σύστημα",   en: "Solar System" },       keywords: ["solar", "planets", "πλανήτες"] },
  { id: "stem-dna",      icon: "🧬", path: "/games/dna",                           category: "game",  title: { el: "DNA Builder",       en: "DNA Builder" },       keywords: ["dna", "biology", "γενετική"] },
  { id: "stem-circuit",  icon: "🔌", path: "/games/circuit",                       category: "game",  title: { el: "Φτιάξε Κύκλωμα",    en: "Circuit Builder" },   keywords: ["circuit", "electricity", "κύκλωμα"] },
  { id: "stem-weather",  icon: "🌦️", path: "/games/weather",                       category: "game",  title: { el: "Καιρός Σιμουλέισον", en: "Weather Sim" },      keywords: ["weather", "climate", "καιρός"] },
  { id: "stem-eco",      icon: "🌳", path: "/games/ecosystem",                     category: "game",  title: { el: "Οικοσύστημα",       en: "Ecosystem" },         keywords: ["ecosystem", "food chain", "οικοσύστημα"] },

  // Master showcase
  { id: "all-games",     icon: "🎯", path: "/games/all",                           category: "game",  title: { el: "Όλα τα Νέα Παιχνίδια", en: "All New Games" },  keywords: ["all", "games", "showcase", "όλα"] },
  { id: "whats-new",     icon: "🎉", path: "/whats-new",                           category: "page",  title: { el: "Τι Νέο", en: "What's New" }, keywords: ["new", "whats new", "νέα", "release"] },
  { id: "reflex-lb",     icon: "🏆", path: "/games/leaderboard",                   category: "page",  title: { el: "Personal Bests", en: "Personal Bests" }, keywords: ["leaderboard", "best", "ρεκόρ", "scores"] },
];

const STOP_WORDS = ["the", "a", "an", "to", "of", "in", "on", "για", "και", "το", "η", "ο"];

function tokenize(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[^\w\sάέήίόύώϊϋΐΰάέήίόύώ\u0370-\u03ff]/g, " ")
    .split(/\s+/)
    .filter(t => t && t.length > 1 && !STOP_WORDS.includes(t));
}

// Backward-compat alias used by older SearchOverlay component (returns items with `route`)
export function searchGames(query, lang = "el", limit = 10) {
  const items = searchIndex(query, lang, limit);
  return items.map(it => ({
    ...it,
    route: it.path,
    section: it.category,
    name: it.title.el,
    nameEn: it.title.en,
  }));
}

export function searchIndex(query, lang = "el", limit = 10) {
  const q = (query || "").trim().toLowerCase();
  if (!q) return [];
  const tokens = tokenize(q);
  if (tokens.length === 0) return [];

  const results = [];
  for (const item of SEARCH_INDEX) {
    const haystack = [
      item.title.el || "",
      item.title.en || "",
      ...(item.keywords || []),
      item.id || "",
      item.category || "",
    ].join(" ").toLowerCase();

    let score = 0;
    for (const tok of tokens) {
      if (haystack.includes(tok)) score += 2;
      if ((item.title.el || "").toLowerCase().startsWith(tok)) score += 5;
      if ((item.title.en || "").toLowerCase().startsWith(tok)) score += 5;
      if (item.keywords?.some(k => k.toLowerCase().startsWith(tok))) score += 3;
    }

    if (score > 0) results.push({ ...item, _score: score });
  }

  results.sort((a, b) => b._score - a._score);
  return results.slice(0, limit);
}
