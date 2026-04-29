import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";

export default function FunZoneSection() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";

  const cards = [
    {
      route: "/battle",
      icon: "⚔️",
      title: { el: "Battle Royale", en: "Battle Royale" },
      description: { el: "Νίκησε 9 αντιπάλους και γίνε νικητής!", en: "Beat 9 opponents and become the winner!" },
      gradient: "from-red-500 to-orange-600",
      badge: { el: "ΝΕΟ!", en: "NEW!" },
    },
    {
      route: "/pet",
      icon: "🐾",
      title: { el: "Το Pet μου", en: "My Pet" },
      description: { el: "Υιοθέτησε και μεγάλωσε το κατοικίδιό σου!", en: "Adopt and grow your pet!" },
      gradient: "from-pink-500 to-purple-600",
      badge: { el: "ΝΕΟ!", en: "NEW!" },
    },
    {
      route: "/story",
      icon: "📖",
      title: { el: "Ιστορίες", en: "Stories" },
      description: { el: "5 περιπέτειες με αποφάσεις!", en: "5 adventures with choices!" },
      gradient: "from-violet-500 to-indigo-600",
      badge: { el: "ΝΕΟ!", en: "NEW!" },
    },
    {
      route: "/cards",
      icon: "🎴",
      title: { el: "Συλλογή Καρτών", en: "Card Collection" },
      description: { el: "Συλλέξε 55+ μοναδικές κάρτες!", en: "Collect 55+ unique cards!" },
      gradient: "from-amber-500 to-rose-500",
      badge: { el: "ΝΕΟ!", en: "NEW!" },
    },
  ];

  return (
    <section className="py-12 px-4 bg-gradient-to-br from-violet-50 via-pink-50 to-amber-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold uppercase tracking-wider mb-3">
            🎉 {isEl ? "Νέα Διασκέδαση" : "New Fun"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-2">
            {isEl ? "Ζώνη Διασκέδασης" : "Fun Zone"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            {isEl ? "Νέα παιχνίδια που θα λατρέψεις!" : "New games you'll love!"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(card => (
            <button
              key={card.route}
              onClick={() => navigate(card.route)}
              className="group relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 hover:scale-[1.02] hover:shadow-xl transition-all text-left"
            >
              <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${card.gradient} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <span className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-2xl shadow-md`}>
                    {card.icon}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold uppercase">
                    {isEl ? card.badge.el : card.badge.en}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-1">
                  {isEl ? card.title.el : card.title.en}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isEl ? card.description.el : card.description.en}
                </p>
                <div className={`mt-3 inline-block text-xs font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                  {isEl ? "Παίξε →" : "Play →"}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
