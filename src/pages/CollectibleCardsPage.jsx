import React, { useState, useContext } from "react";
import { LanguageContext } from "../i18n/LanguageContext";
import { CoinService } from "../services/CoinService";
import { CARDS, CARD_CATEGORIES, RARITIES, getCollection, getOwnedCount, addCardToCollection, isCardOwned, getCardCount, pickRandomCard, canFreeSpin, getNextFreeSpinHours, recordSpin, getOwnedByRarity } from "../config/cardsConfig";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";

const SPIN_COST = 5;

const T = {
  el: {
    title: "Συλλογή Κάρτες",
    subtitle: "Συλλέξε όλες τις κάρτες!",
    collection: "Συλλογή",
    spin: "Τυχερή Κάρτα!",
    freeSpin: "Δωρεάν Κάρτα",
    spinCost: "Κόστος",
    nextFree: "Επόμενη δωρεάν σε",
    hours: "ώρες",
    notEnoughCoins: "Δεν έχεις αρκετά νομίσματα",
    youGot: "Βρήκες!",
    duplicate: "Διπλό!",
    newCard: "Νέα Κάρτα!",
    closeBtn: "Κλείσε",
    all: "Όλες",
    owned: "Έχεις",
    of: "από",
    locked: "Κλειδωμένη",
    rarity: "Σπανιότητα",
  },
  en: {
    title: "Card Collection",
    subtitle: "Collect them all!",
    collection: "Collection",
    spin: "Lucky Card!",
    freeSpin: "Free Card",
    spinCost: "Cost",
    nextFree: "Next free in",
    hours: "hours",
    notEnoughCoins: "Not enough coins",
    youGot: "You got!",
    duplicate: "Duplicate!",
    newCard: "New Card!",
    closeBtn: "Close",
    all: "All",
    owned: "Owned",
    of: "of",
    locked: "Locked",
    rarity: "Rarity",
  },
};

export default function CollectibleCardsPage() {
  const { lang } = useContext(LanguageContext);
  const l = T[lang] || T.en;
  const isEl = lang === "el";

  const [activeCategory, setActiveCategory] = useState("all");
  const [collection, setCollection] = useState(() => getCollection());
  const [revealCard, setRevealCard] = useState(null);
  const [revealAnimation, setRevealAnimation] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [spinning, setSpinning] = useState(false);

  const ownedCount = getOwnedCount();
  const totalCards = CARDS.length;
  const rarityCounts = getOwnedByRarity();

  const filtered = activeCategory === "all" ? CARDS : CARDS.filter(c => c.category === activeCategory);

  const performSpin = (free = false) => {
    if (spinning) return;
    if (!free) {
      const balance = CoinService.getBalance().balance;
      if (balance < SPIN_COST) { alert(l.notEnoughCoins); return; }
      CoinService.spend(SPIN_COST);
    } else {
      recordSpin();
    }

    setSpinning(true);
    setTimeout(() => {
      const card = pickRandomCard();
      const wasOwned = isCardOwned(card.id);
      addCardToCollection(card.id);
      setCollection(getCollection());
      setRevealCard(card);
      setIsDuplicate(wasOwned);
      setSpinning(false);
      setRevealAnimation(true);
      setTimeout(() => setRevealAnimation(false), 100);
    }, 1500);
  };

  const freeAvailable = canFreeSpin();
  const nextFreeHours = Math.ceil(getNextFreeSpinHours());

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={l.title} />

      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-2">
              🎴 {l.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">{l.subtitle}</p>
          </div>

          {/* Stats banner */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg border border-slate-100 dark:border-slate-700 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-700 dark:text-slate-200">{l.collection}: {ownedCount}/{totalCards}</h3>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{Math.round((ownedCount / totalCards) * 100)}%</span>
            </div>
            <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all" style={{ width: `${(ownedCount / totalCards) * 100}%` }} />
            </div>
            <div className="flex justify-around mt-3 text-xs">
              {Object.entries(RARITIES).map(([r, info]) => (
                <div key={r} className="text-center">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${info.color} mx-auto mb-1`} />
                  <span className="text-slate-500 font-bold">{rarityCounts[r]} <span className="text-slate-400">{isEl ? info.label.el : info.label.en}</span></span>
                </div>
              ))}
            </div>
          </div>

          {/* Spin buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button onClick={() => performSpin(true)} disabled={!freeAvailable || spinning} className={`px-4 py-4 rounded-2xl font-bold shadow-md transition-all ${freeAvailable && !spinning ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:scale-105" : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"}`}>
              <div className="text-2xl mb-1">🎁</div>
              <div className="text-sm">{l.freeSpin}</div>
              {!freeAvailable && <div className="text-[10px] mt-0.5">{l.nextFree} {nextFreeHours}{l.hours[0]}</div>}
            </button>
            <button onClick={() => performSpin(false)} disabled={spinning} className="px-4 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shadow-md hover:scale-105 transition-all disabled:opacity-50">
              <div className="text-2xl mb-1">🎲</div>
              <div className="text-sm">{l.spin}</div>
              <div className="text-[10px] mt-0.5">{l.spinCost} {SPIN_COST} 🪙</div>
            </button>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            <button onClick={() => setActiveCategory("all")} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap ${activeCategory === "all" ? "bg-purple-500 text-white" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"}`}>
              {l.all}
            </button>
            {CARD_CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap flex items-center gap-1 ${activeCategory === cat.id ? "bg-purple-500 text-white" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"}`}>
                <span>{cat.icon}</span>{isEl ? cat.label.el : cat.label.en}
              </button>
            ))}
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {filtered.map(card => {
              const owned = isCardOwned(card.id);
              const count = getCardCount(card.id);
              const rarity = RARITIES[card.rarity];
              return (
                <div key={card.id} className={`relative rounded-2xl p-3 border-2 transition-all ${owned ? `bg-gradient-to-br ${rarity.color} ${rarity.glow}` : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 grayscale opacity-50"} ${rarity.border}`}>
                  <div className="text-center">
                    <div className="text-4xl mb-1">{owned ? card.emoji : "❓"}</div>
                    <div className={`text-[10px] font-bold ${owned ? "text-white" : "text-slate-400"} truncate`}>{owned ? (isEl ? card.name.el : card.name.en) : l.locked}</div>
                    <div className={`text-[9px] mt-0.5 ${owned ? "text-white/80" : "text-slate-300"}`}>
                      {isEl ? rarity.label.el : rarity.label.en}
                    </div>
                  </div>
                  {count > 1 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">×{count}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Spinning animation */}
      {spinning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-9xl animate-spin" style={{ animationDuration: "0.5s" }}>🎰</div>
            <p className="text-white text-xl font-bold mt-4 animate-pulse">✨ ✨ ✨</p>
          </div>
        </div>
      )}

      {/* Card reveal */}
      {revealCard && !spinning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setRevealCard(null)}>
          <div className={`relative max-w-xs w-full transform transition-all ${revealAnimation ? "scale-50 rotate-180" : "scale-100 rotate-0"}`}>
            <div className={`bg-gradient-to-br ${RARITIES[revealCard.rarity].color} rounded-3xl p-6 shadow-2xl text-center border-4 border-white`}>
              <p className="text-white text-sm font-bold uppercase tracking-wider mb-2">{isDuplicate ? l.duplicate : `🌟 ${l.newCard}`}</p>
              <div className="text-9xl mb-3 animate-bounce" style={{ animationDuration: "1.5s" }}>{revealCard.emoji}</div>
              <h2 className="text-2xl font-extrabold text-white mb-1">{isEl ? revealCard.name.el : revealCard.name.en}</h2>
              <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">{isEl ? RARITIES[revealCard.rarity].label.el : RARITIES[revealCard.rarity].label.en}</span>
              <p className="text-white/90 text-sm italic mt-2">"{isEl ? revealCard.fact.el : revealCard.fact.en}"</p>
              <button onClick={() => setRevealCard(null)} className="mt-4 px-8 py-2.5 rounded-xl bg-white text-slate-800 font-bold shadow-md hover:scale-105 transition-all">
                {l.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
