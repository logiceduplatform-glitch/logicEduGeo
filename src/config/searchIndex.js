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
