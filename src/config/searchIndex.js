import { ADULT_GAME_CATEGORIES } from "./adultGameConfig";
import {
  LOGIC_4_5_GAMES,
  SCHOOL_2_3_GAMES,
  FUN_2_3_GAMES,
  LOGIC_2_3_GAMES,
} from "./localGamesConfig";

const BOARD_CATEGORIES = [
  {
    id: "classics",
    title: { en: "Strategy Classics", el: "Κλασικά Στρατηγικής" },
    games: [
      { id: "chess", label: { el: "Σκάκι", en: "Chess" }, icon: "♟️" },
      { id: "go", label: { el: "Go", en: "Go" }, icon: "⚫" },
      { id: "checkers", label: { el: "Ντάμα", en: "Checkers" }, icon: "🔴" },
      { id: "othello", label: { el: "Όθελο", en: "Othello" }, icon: "⚪" },
      { id: "backgammon", label: { el: "Τάβλι", en: "Backgammon" }, icon: "🎲" },
      { id: "connect4", label: { el: "Σκορ 4", en: "Connect 4" }, icon: "🟡" },
      { id: "mahjong", label: { el: "Mahjong", en: "Mahjong" }, icon: "🀄" },
      { id: "stratego", label: { el: "Stratego", en: "Stratego" }, icon: "⚔️" },
      { id: "battleship", label: { el: "Ναυμαχία", en: "Battleship" }, icon: "🚢" },
    ],
  },
  {
    id: "modern",
    title: { en: "Modern Board Games", el: "Σύγχρονα Επιτραπέζια" },
    games: [
      { id: "catan", label: { el: "Catan", en: "Catan" }, icon: "🏝️" },
      { id: "ticket", label: { el: "Ticket to Ride", en: "Ticket to Ride" }, icon: "🚂" },
      { id: "carcassonne", label: { el: "Carcassonne", en: "Carcassonne" }, icon: "🏰" },
      { id: "pandemic", label: { el: "Pandemic", en: "Pandemic" }, icon: "🦠" },
      { id: "trivial", label: { el: "Trivial Pursuit", en: "Trivial Pursuit" }, icon: "🧩" },
    ],
  },
  {
    id: "party",
    title: { en: "Party Games", el: "Παιχνίδια Παρέας" },
    games: [
      { id: "codenames", label: { el: "Codenames", en: "Codenames" }, icon: "🕵️" },
      { id: "uno", label: { el: "UNO", en: "UNO" }, icon: "🃏" },
      { id: "monopoly", label: { el: "Monopoly", en: "Monopoly" }, icon: "🏦" },
      { id: "werewolf", label: { el: "Λυκάνθρωπος", en: "Werewolf" }, icon: "🐺" },
    ],
  },
];

const QUIZ_CATEGORIES = [
  { id: "LogicMath", label: { el: "Μαθηματική Λογική", en: "Logic & Math" }, icon: "🧮" },
  { id: "NaturalWorld", label: { el: "Φυσικός Κόσμος", en: "Natural World" }, icon: "🌍" },
  { id: "Adventures", label: { el: "Περιπέτειες", en: "Adventures" }, icon: "🏔️" },
  { id: "BrainTeasers", label: { el: "Γρίφοι", en: "Brain Teasers" }, icon: "🧩" },
  { id: "Edutainment", label: { el: "Εκπαιδευτικά", en: "Edutainment" }, icon: "🎓" },
  { id: "History", label: { el: "Ιστορία", en: "History" }, icon: "📜" },
  { id: "Language", label: { el: "Γλώσσα", en: "Language" }, icon: "📚" },
  { id: "Space", label: { el: "Διάστημα", en: "Space" }, icon: "🚀" },
  { id: "Politics", label: { el: "Πολιτική", en: "Politics" }, icon: "🏛️" },
  { id: "Health", label: { el: "Υγεία", en: "Health" }, icon: "💊" },
  { id: "Art", label: { el: "Τέχνη", en: "Art" }, icon: "🎨" },
];

let _cachedIndex = null;

export function getSearchIndex() {
  if (_cachedIndex) return _cachedIndex;

  const items = [];
  const seen = new Set();

  function add(item) {
    const key = `${item.section}::${item.id}`;
    if (seen.has(key)) return;
    seen.add(key);
    items.push(item);
  }

  // Adult games
  for (const cat of ADULT_GAME_CATEGORIES) {
    for (const g of cat.games) {
      add({
        id: g.id,
        title: g.title,
        desc: g.desc,
        icon: g.icon,
        section: "adult",
        category: cat.title,
        route: `/play/adult-games`,
      });
    }
  }

  // Board games
  for (const cat of BOARD_CATEGORIES) {
    for (const g of cat.games) {
      add({
        id: g.id,
        title: g.label,
        desc: null,
        icon: g.icon,
        section: "board",
        category: cat.title,
        route: `/play/board-games?game=${g.id}`,
      });
    }
  }

  // Quiz categories (11-12 / adult)
  for (const q of QUIZ_CATEGORIES) {
    add({
      id: q.id,
      title: q.label,
      desc: null,
      icon: q.icon,
      section: "quiz",
      category: { el: "Quiz", en: "Quiz" },
      route: `/play/11-12-school`,
    });
  }

  // Age 2-3 games
  const age23groups = [
    { games: SCHOOL_2_3_GAMES, sub: "school", route: "/play/2-3-school" },
    { games: FUN_2_3_GAMES, sub: "fun", route: "/play/2-3-fun" },
    { games: LOGIC_2_3_GAMES, sub: "logic", route: "/play/2-3-logic" },
  ];
  for (const g of age23groups) {
    for (const game of g.games) {
      add({
        id: game.id,
        title: game.title,
        desc: game.description || null,
        icon: game.icon,
        section: `age-2-3-${g.sub}`,
        category: { el: "Ηλικία 2-3", en: "Age 2-3" },
        route: g.route,
      });
    }
  }

  // Age 4-5 logic games
  for (const game of LOGIC_4_5_GAMES) {
    add({
      id: game.id,
      title: game.title,
      desc: game.description || null,
      icon: game.icon,
      section: "age-4-5-logic",
      category: { el: "Ηλικία 4-5", en: "Age 4-5" },
      route: "/play/4-5-logic",
    });
  }

  // Static pages
  const pages = [
    { id: "home", title: { el: "Αρχική", en: "Home" }, icon: "🏠", route: "/" },
    { id: "profile", title: { el: "Προφίλ", en: "Profile" }, icon: "👤", route: "/profile" },
    { id: "my-games", title: { el: "Τα Παιχνίδια Μου", en: "My Games" }, icon: "⭐", route: "/my-games" },
    { id: "subscription", title: { el: "Συνδρομές", en: "Subscriptions" }, icon: "💳", route: "/subscription" },
    { id: "board-games", title: { el: "Επιτραπέζια", en: "Board Games" }, icon: "🎲", route: "/play/board-games" },
    { id: "content-editor", title: { el: "Δημιουργία Quiz", en: "Content Editor" }, icon: "✏️", route: "/content-editor" },
    { id: "weekly-report", title: { el: "Εβδομαδιαία Αναφορά", en: "Weekly Report" }, icon: "📊", route: "/weekly-report" },
    { id: "sound-settings", title: { el: "Ρυθμίσεις Ήχου", en: "Sound Settings" }, icon: "🔊", route: "/sound-settings" },
    { id: "faq", title: { el: "Συχνές Ερωτήσεις", en: "FAQ" }, icon: "❓", route: "/faq" },
    { id: "contact", title: { el: "Επικοινωνία", en: "Contact" }, icon: "📧", route: "/contact" },
    { id: "about", title: { el: "Σχετικά", en: "About" }, icon: "ℹ️", route: "/about" },
  ];

  for (const p of pages) {
    add({
      id: p.id,
      title: p.title,
      desc: null,
      icon: p.icon,
      section: "page",
      category: { el: "Σελίδα", en: "Page" },
      route: p.route,
    });
  }

  _cachedIndex = items;
  return items;
}

export function searchGames(query, lang = "en") {
  if (!query || query.length < 2) return [];

  const items = getSearchIndex();
  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/);

  const scored = [];

  for (const item of items) {
    const titleEn = (item.title?.en || "").toLowerCase();
    const titleEl = (item.title?.el || "").toLowerCase();
    const descEn = (item.desc?.en || "").toLowerCase();
    const descEl = (item.desc?.el || "").toLowerCase();
    const catEn = (item.category?.en || "").toLowerCase();
    const catEl = (item.category?.el || "").toLowerCase();
    const id = item.id.toLowerCase();

    let score = 0;

    // Exact match in title is highest
    if (titleEn === q || titleEl === q) score += 100;
    else if (titleEn.startsWith(q) || titleEl.startsWith(q)) score += 80;
    else if (titleEn.includes(q) || titleEl.includes(q)) score += 60;
    else if (id.includes(q)) score += 50;
    else if (descEn.includes(q) || descEl.includes(q)) score += 30;
    else if (catEn.includes(q) || catEl.includes(q)) score += 20;
    else {
      // Try word-by-word matching
      let wordHits = 0;
      for (const w of words) {
        if (
          titleEn.includes(w) || titleEl.includes(w) ||
          descEn.includes(w) || descEl.includes(w) ||
          id.includes(w) || catEn.includes(w) || catEl.includes(w)
        ) {
          wordHits++;
        }
      }
      if (wordHits > 0) score += wordHits * 15;
    }

    if (score > 0) {
      scored.push({ ...item, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 12);
}
