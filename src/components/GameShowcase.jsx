import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AGE_ROUTE_MAP = {
  "2-3": "/play/2-3-fun",
  "4-5": "/play/4-5-fun",
  "6+": "/play/6-fun",
  "7+": "/play/7-8-fun",
  "9-10": "/play/9-10-fun",
  "11-12": "/play/11-12-fun",
  "Adult": "/play/adult-games",
};

const SHOWCASE_GAMES = {
  el: [
    { icon: "🧩", title: "Παζλ Εικόνων", desc: "Σύρε τα κομμάτια στη σωστή θέση", longDesc: "Παζλ εικόνων με πολλά επίπεδα δυσκολίας. Αναπτύσσει χωρική αντίληψη και αναγνώριση μοτίβων.", age: "4-5", gradient: "from-blue-500 to-purple-600", difficulty: "Εύκολο" },
    { icon: "🫧", title: "Φούσκες που Σκάζουν", desc: "Σκάσε τις φούσκες πριν εξαφανιστούν!", longDesc: "Πάτα τις χρωματιστές φούσκες πριν εξαφανιστούν! Εξασκεί αντανακλαστικά και αναγνώριση χρωμάτων.", age: "2-3", gradient: "from-cyan-500 to-blue-600", difficulty: "Εύκολο" },
    { icon: "🧮", title: "Βρες τον Αριθμό", desc: "Συμπλήρωσε την ακολουθία αριθμών", longDesc: "Ανακάλυψε το μοτίβο και βρες τον επόμενο αριθμό. Ενισχύει τη μαθηματική λογική.", age: "6+", gradient: "from-emerald-500 to-teal-600", difficulty: "Μέτριο" },
    { icon: "🐾", title: "Ζώα & Ήχοι", desc: "Αναγνώρισε τα ζώα από τον ήχο τους", longDesc: "Άκουσε τον ήχο και βρες ποιο ζώο είναι! Διασκεδαστικό παιχνίδι αναγνώρισης.", age: "2-3", gradient: "from-green-500 to-emerald-600", difficulty: "Εύκολο" },
    { icon: "🎨", title: "Χρώματα & Σχήματα", desc: "Ταίριαξε χρώματα με σχήματα", longDesc: "Μάθε χρώματα και σχήματα μέσα από διαδραστικά παιχνίδια ταιριάσματος.", age: "4-5", gradient: "from-pink-500 to-rose-600", difficulty: "Εύκολο" },
    { icon: "🧠", title: "Μνήμη Θέσεων", desc: "Θυμήσου πού ήταν κάθε κάρτα", longDesc: "Κλασικό memory game που ενισχύει τη μνήμη εργασίας και τη συγκέντρωση.", age: "7+", gradient: "from-violet-500 to-purple-600", difficulty: "Δύσκολο" },
    { icon: "🔬", title: "Πειράματα Επιστήμης", desc: "Μικρά πειράματα βήμα-βήμα", longDesc: "Εξερεύνησε τον κόσμο της επιστήμης με απλά πειράματα που μπορείς να κάνεις μόνος σου!", age: "6+", gradient: "from-indigo-500 to-blue-600", difficulty: "Μέτριο" },
    { icon: "🌍", title: "Γεωγραφία", desc: "Μάθε για χώρες και ηπείρους", longDesc: "Ταξίδεψε γύρω από τον κόσμο μαθαίνοντας για ηπείρους, χώρες και πρωτεύουσες.", age: "9-10", gradient: "from-amber-500 to-orange-600", difficulty: "Μέτριο" },
  ],
  en: [
    { icon: "🧩", title: "Image Puzzle", desc: "Drag the pieces to the right spot", longDesc: "Image puzzles with multiple difficulty levels. Develops spatial awareness and pattern recognition.", age: "4-5", gradient: "from-blue-500 to-purple-600", difficulty: "Easy" },
    { icon: "🫧", title: "Bubble Pop", desc: "Pop the bubbles before they vanish!", longDesc: "Tap colorful bubbles before they disappear! Trains reflexes and color recognition.", age: "2-3", gradient: "from-cyan-500 to-blue-600", difficulty: "Easy" },
    { icon: "🧮", title: "Find the Number", desc: "Complete the number sequence", longDesc: "Discover the pattern and find the next number. Strengthens mathematical thinking.", age: "6+", gradient: "from-emerald-500 to-teal-600", difficulty: "Medium" },
    { icon: "🐾", title: "Animals & Sounds", desc: "Identify animals by their sound", longDesc: "Listen to the sound and guess the animal! A fun recognition game for toddlers.", age: "2-3", gradient: "from-green-500 to-emerald-600", difficulty: "Easy" },
    { icon: "🎨", title: "Colors & Shapes", desc: "Match colors with shapes", longDesc: "Learn colors and shapes through interactive matching games.", age: "4-5", gradient: "from-pink-500 to-rose-600", difficulty: "Easy" },
    { icon: "🧠", title: "Position Memory", desc: "Remember where each card was", longDesc: "Classic memory game that strengthens working memory and concentration.", age: "7+", gradient: "from-violet-500 to-purple-600", difficulty: "Hard" },
    { icon: "🔬", title: "Science Experiments", desc: "Step-by-step mini experiments", longDesc: "Explore the world of science with simple experiments you can do yourself!", age: "6+", gradient: "from-indigo-500 to-blue-600", difficulty: "Medium" },
    { icon: "🌍", title: "Geography", desc: "Learn about countries and continents", longDesc: "Travel around the world learning about continents, countries, and capitals.", age: "9-10", gradient: "from-amber-500 to-orange-600", difficulty: "Medium" },
  ],
};

const DIFF_LEVELS = { Easy: 1, "Εύκολο": 1, Medium: 2, "Μέτριο": 2, Hard: 3, "Δύσκολο": 3 };

function DifficultyDots({ level }) {
  const n = DIFF_LEVELS[level] || 1;
  const label = `${level} (${n}/3)`;
  return (
    <div className="flex gap-1" role="img" aria-label={label}>
      {[1, 2, 3].map((d) => (
        <div key={d} className={`w-2 h-2 rounded-full ${d <= n ? "bg-current" : "bg-current/20"}`} />
      ))}
    </div>
  );
}

export default function GameShowcase({ lang }) {
  const navigate = useNavigate();
  const isEl = lang === "el";
  const games = SHOWCASE_GAMES[isEl ? "el" : "en"];
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <section id="games" className="py-20 bg-slate-50 dark:bg-slate-800/50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 text-sm font-semibold mb-4">
            {isEl ? "Δείγμα Παιχνιδιών" : "Game Preview"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-3">
            {isEl ? "Δες τι σε περιμένει" : "See what awaits you"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            {isEl
              ? "Μερικά από τα 350+ παιχνίδια που θα βρεις στην πλατφόρμα"
              : "A few of the 350+ games you'll find on the platform"}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {games.map((game, i) => {
            const isHovered = hoveredIdx === i;
            return (
              <button
                key={i}
                onClick={() => navigate(AGE_ROUTE_MAP[game.age] || "/play")}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                onFocus={() => setHoveredIdx(i)}
                onBlur={() => setHoveredIdx(null)}
                aria-label={`${game.title} – ${game.desc} (${isEl ? "Ηλικία" : "Age"} ${game.age})`}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-2xl focus-visible:shadow-2xl hover:-translate-y-2 focus-visible:-translate-y-2 transition-all duration-300 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
              >
                <div className={`h-28 bg-gradient-to-br ${game.gradient} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  <span className={`text-5xl transition-transform duration-500 ${isHovered ? "scale-125 rotate-6" : ""}`}>
                    {game.icon}
                  </span>
                  <span className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-white/90 text-xs font-bold text-slate-700 shadow-sm backdrop-blur-sm">
                    {isEl ? "Ηλικία" : "Age"} {game.age}
                  </span>
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white/80">
                    <DifficultyDots level={game.difficulty} />
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1.5 truncate">
                    {game.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {isHovered ? game.longDesc : game.desc}
                  </p>
                </div>

                <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col items-center justify-end pb-6 gap-2 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                  <span className="text-white text-xs font-medium px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                    {game.difficulty}
                  </span>
                  <span className="px-6 py-2.5 bg-white rounded-xl text-sm font-bold text-slate-800 shadow-lg">
                    {isEl ? "Παίξε τώρα" : "Play now"} &rarr;
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
