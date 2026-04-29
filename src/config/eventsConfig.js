// Events & tournaments - rotating weekly schedule
// Deterministic events generated from week number for consistency

export const EVENT_TEMPLATES = [
  {
    id: "math_marathon",
    icon: "🏃",
    color: "from-orange-500 to-red-500",
    title: { el: "Μαθηματικός Μαραθώνιος", en: "Math Marathon" },
    desc: { el: "Λύσε όσες περισσότερες πράξεις μπορείς σε 7 μέρες!", en: "Solve as many problems as you can in 7 days!" },
    rules: { el: "Παίξε καθημερινά Daily Challenge και μάζεψε XP", en: "Play Daily Challenge daily and earn XP" },
    target: 100, // XP
    reward: { coins: 50, badgeId: "math_marathon" },
    category: "xp",
    cta: { label: { el: "Παίξε Daily", en: "Play Daily" }, path: "/daily" },
  },
  {
    id: "battle_king",
    icon: "👑",
    color: "from-purple-500 to-pink-500",
    title: { el: "Βασιλιάς της Μάχης", en: "Battle King" },
    desc: { el: "Νίκησε σε Battle Royale για μετάλλιο!", en: "Win Battle Royales for a medal!" },
    rules: { el: "Νίκησε 3 Battle Royale", en: "Win 3 Battle Royale games" },
    target: 3, // wins
    reward: { coins: 75, badgeId: "battle_king" },
    category: "battle",
    cta: { label: { el: "Στη μάχη!", en: "To battle!" }, path: "/battle" },
  },
  {
    id: "card_collector",
    icon: "🃏",
    color: "from-cyan-500 to-blue-500",
    title: { el: "Συλλέκτης Καρτών", en: "Card Collector" },
    desc: { el: "Μάζεψε όσες περισσότερες κάρτες μπορείς!", en: "Collect as many cards as you can!" },
    rules: { el: "Συλλογή 15 διαφορετικών καρτών", en: "Collect 15 unique cards" },
    target: 15,
    reward: { coins: 100, badgeId: "card_collector" },
    category: "cards",
    cta: { label: { el: "Άνοιξε κάρτες", en: "Open cards" }, path: "/cards" },
  },
  {
    id: "story_explorer",
    icon: "📖",
    color: "from-emerald-500 to-teal-500",
    title: { el: "Εξερευνητής Ιστοριών", en: "Story Explorer" },
    desc: { el: "Διάβασε 3 ιστορίες αυτή την εβδομάδα!", en: "Read 3 stories this week!" },
    rules: { el: "Ολοκλήρωσε 3 διαφορετικές ιστορίες", en: "Complete 3 different stories" },
    target: 3,
    reward: { coins: 60, badgeId: "story_explorer" },
    category: "story",
    cta: { label: { el: "Ξεκίνα ιστορία", en: "Start story" }, path: "/story" },
  },
  {
    id: "streak_master",
    icon: "🔥",
    color: "from-orange-400 to-yellow-500",
    title: { el: "Master του Σεριού", en: "Streak Master" },
    desc: { el: "Παίξε καθημερινά για να φτιάξεις σερί!", en: "Play daily to build a streak!" },
    rules: { el: "Φτάσε σερί 7 ημερών", en: "Reach a 7-day streak" },
    target: 7,
    reward: { coins: 80, badgeId: "streak_master" },
    category: "streak",
    cta: { label: { el: "Παίξε σήμερα", en: "Play today" }, path: "/daily" },
  },
];

export const TOURNAMENTS = [
  {
    id: "weekly_xp",
    icon: "⭐",
    color: "from-purple-600 to-blue-600",
    title: { el: "Εβδομαδιαίο Τουρνουά XP", en: "Weekly XP Tournament" },
    desc: { el: "Top 10 της εβδομάδας παίρνουν ΜΕΓΑΛΑ έπαθλα!", en: "Top 10 of the week get BIG rewards!" },
    rewards: [
      { rank: 1, coins: 500, label: "🥇" },
      { rank: 2, coins: 300, label: "🥈" },
      { rank: 3, coins: 150, label: "🥉" },
      { rank: 10, coins: 50, label: "🏅" },
    ],
    leaderboardCategory: "xp",
    leaderboardPeriod: "week",
  },
  {
    id: "monthly_global",
    icon: "🌍",
    color: "from-emerald-500 to-teal-600",
    title: { el: "Μηνιαίο Παγκόσμιο", en: "Monthly Global" },
    desc: { el: "Παγκόσμια κατάταξη όλο τον μήνα!", en: "Global ranking all month long!" },
    rewards: [
      { rank: 1, coins: 1500, label: "👑" },
      { rank: 5, coins: 500, label: "🏆" },
      { rank: 20, coins: 100, label: "🎖️" },
    ],
    leaderboardCategory: "xp",
    leaderboardPeriod: "all",
  },
];

function weekNumber(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

export function getCurrentEvent() {
  const wn = weekNumber();
  return EVENT_TEMPLATES[wn % EVENT_TEMPLATES.length];
}

export function getUpcomingEvents(count = 3) {
  const wn = weekNumber();
  const list = [];
  for (let i = 1; i <= count; i++) {
    list.push(EVENT_TEMPLATES[(wn + i) % EVENT_TEMPLATES.length]);
  }
  return list;
}

export function daysUntilNextWeek() {
  const now = new Date();
  const day = now.getDay() || 7; // Mon=1..Sun=7
  return 8 - day; // until next Monday
}

export function getEventProgress(event) {
  if (!event) return 0;
  try {
    if (event.category === "xp") {
      const xp = JSON.parse(localStorage.getItem("geo:xp") || "{}");
      return Math.min(xp.weekXP || 0, event.target);
    }
    if (event.category === "battle") {
      return Math.min(parseInt(localStorage.getItem("geo:battleWins") || "0", 10), event.target);
    }
    if (event.category === "cards") {
      const col = JSON.parse(localStorage.getItem("geo:cardCollection") || "{}");
      return Math.min(Object.keys(col).length, event.target);
    }
    if (event.category === "story") {
      const sp = JSON.parse(localStorage.getItem("geo:storyProgress") || "{}");
      const completed = Object.values(sp).filter(s => s?.completed).length;
      return Math.min(completed, event.target);
    }
    if (event.category === "streak") {
      const streak = parseInt(localStorage.getItem("geo:dailyChallengeStreak") || "0", 10);
      return Math.min(streak, event.target);
    }
  } catch {}
  return 0;
}
