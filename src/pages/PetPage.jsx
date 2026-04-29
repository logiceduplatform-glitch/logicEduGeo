import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { CoinService } from "../services/CoinService";
import { PET_TYPES, PET_CONFIG, getPet, adoptPet, feedPet, playWithPet, restPet, getPetType, getPetCurrentStage, getPetMood } from "../config/petConfig";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";

const T = {
  el: {
    title: "Το Κατοικίδιό μου",
    subtitle: "Φρόντισέ το, ταΐσέ το, μεγάλωσέ το!",
    adoptTitle: "Υιοθέτησε το πρώτο σου κατοικίδιο!",
    chooseType: "Διάλεξε τύπο",
    petName: "Δώσε όνομα",
    adopt: "Υιοθέτησε",
    feed: "Τάϊσε",
    play: "Παίξε",
    rest: "Ξεκούρασε",
    stage: "Στάδιο",
    nextEvolution: "Επόμενη εξέλιξη σε",
    xp: "XP",
    hunger: "Πείνα",
    happiness: "Ευτυχία",
    energy: "Ενέργεια",
    mood: "Διάθεση",
    cost: "Κόστος",
    coins: "νομίσματα",
    notEnoughCoins: "Δεν έχεις αρκετά νομίσματα",
    petFed: "Έφαγε!",
    petPlayed: "Έπαιξε!",
    petRested: "Ξεκουράστηκε!",
    abandoned: "Άφησε το κατοικίδιο",
    confirm: "Σίγουρα;",
    yes: "Ναι",
    no: "Όχι",
    bornOn: "Υιοθετήθηκε",
    earnXPInfo: "Κάθε φορά που παίζεις παιχνίδια, το κατοικίδιό σου κερδίζει XP!",
    needsCoins: "Χρειάζεσαι 1 νόμισμα για να ταΐσεις",
    fullHunger: "Είναι χορτάτο!",
    tooTired: "Είναι κουρασμένο!",
  },
  en: {
    title: "My Pet",
    subtitle: "Care for it, feed it, grow it!",
    adoptTitle: "Adopt your first pet!",
    chooseType: "Choose type",
    petName: "Give it a name",
    adopt: "Adopt",
    feed: "Feed",
    play: "Play",
    rest: "Rest",
    stage: "Stage",
    nextEvolution: "Next evolution at",
    xp: "XP",
    hunger: "Hunger",
    happiness: "Happiness",
    energy: "Energy",
    mood: "Mood",
    cost: "Cost",
    coins: "coins",
    notEnoughCoins: "Not enough coins",
    petFed: "Yum!",
    petPlayed: "Yay!",
    petRested: "Refreshed!",
    abandoned: "Release pet",
    confirm: "Are you sure?",
    yes: "Yes",
    no: "No",
    bornOn: "Adopted",
    earnXPInfo: "Every time you play games, your pet earns XP!",
    needsCoins: "Need 1 coin to feed",
    fullHunger: "It's full!",
    tooTired: "It's too tired!",
  },
};

export default function PetPage() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const l = T[lang] || T.en;
  const isEl = lang === "el";

  const [pet, setPet] = useState(() => getPet());
  const [showAdoption, setShowAdoption] = useState(!pet);
  const [selectedType, setSelectedType] = useState(PET_TYPES[0].id);
  const [petName, setPetName] = useState("");
  const [actionMsg, setActionMsg] = useState(null);
  const [confirmRelease, setConfirmRelease] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const fresh = getPet();
      if (fresh) setPet({ ...fresh });
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAdopt = () => {
    if (!petName.trim()) return;
    const newPet = adoptPet(selectedType, petName.trim());
    setPet(newPet);
    setShowAdoption(false);
  };

  const showMessage = (msg) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(null), 1500);
  };

  const handleFeed = () => {
    if (!pet) return;
    if (pet.hunger >= 95) { showMessage(`✅ ${l.fullHunger}`); return; }
    const balance = CoinService.getBalance().balance;
    if (balance < PET_CONFIG.feedCost) { showMessage(`❌ ${l.notEnoughCoins}`); return; }
    CoinService.spend(PET_CONFIG.feedCost);
    const updated = feedPet();
    setPet({ ...updated });
    showMessage(`🍎 ${l.petFed}`);
  };

  const handlePlay = () => {
    if (!pet) return;
    if (pet.energy < 15) { showMessage(`😴 ${l.tooTired}`); return; }
    const updated = playWithPet();
    setPet({ ...updated });
    showMessage(`🎉 ${l.petPlayed}`);
  };

  const handleRest = () => {
    if (!pet) return;
    const updated = restPet();
    setPet({ ...updated });
    showMessage(`😴 ${l.petRested}`);
  };

  const handleRelease = () => {
    localStorage.removeItem("geo:pet");
    setPet(null);
    setShowAdoption(true);
    setConfirmRelease(false);
  };

  if (showAdoption || !pet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Navbar />
        <SEO title={l.title} />
        <div className="pt-24 pb-12 px-4 flex items-center justify-center">
          <div className="max-w-md w-full space-y-6">
            <div className="text-center">
              <div className="text-7xl mb-2 animate-bounce">🥚</div>
              <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">{l.adoptTitle}</h1>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 space-y-4">
              <h3 className="text-sm font-bold text-slate-500">{l.chooseType}</h3>
              <div className="grid grid-cols-3 gap-2">
                {PET_TYPES.map(t => (
                  <button key={t.id} onClick={() => setSelectedType(t.id)} className={`p-3 rounded-xl border-2 transition-all ${selectedType === t.id ? `border-purple-500 bg-gradient-to-br ${t.color} text-white scale-105` : "border-slate-200 dark:border-slate-600 hover:border-purple-300"}`}>
                    <div className="text-3xl">{t.stages[2].emoji}</div>
                    <div className={`text-xs font-bold mt-1 ${selectedType === t.id ? "text-white" : "text-slate-600 dark:text-slate-300"}`}>{isEl ? t.name.el : t.name.en}</div>
                  </button>
                ))}
              </div>

              <input value={petName} onChange={e => setPetName(e.target.value)} placeholder={l.petName} maxLength={15} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-purple-400" />

              <button onClick={handleAdopt} disabled={!petName.trim()} className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50">
                🥰 {l.adopt}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const type = getPetType(pet.typeId);
  const stage = getPetCurrentStage(pet);
  const mood = getPetMood(pet);
  const nextEvoXP = pet.stage === 1 ? PET_CONFIG.evolveStage2XP : pet.stage === 2 ? PET_CONFIG.evolveStage3XP : null;
  const evoProgress = nextEvoXP ? (pet.xp / nextEvoXP) * 100 : 100;

  return (
    <div className={`min-h-screen ${type.bgColor}`}>
      <Navbar />
      <SEO title={l.title} />

      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white text-center mb-6">
            🏡 {l.title}
          </h1>

          {/* Pet display */}
          <div className={`bg-gradient-to-br ${type.color} rounded-3xl p-8 shadow-2xl text-center mb-6 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl" />
            <div className="relative">
              <div className="text-9xl mb-3 animate-bounce" style={{ animationDuration: "2s" }}>{stage.emoji}</div>
              <h2 className="text-2xl font-extrabold text-white mb-1">{pet.name}</h2>
              <div className="flex items-center justify-center gap-2 text-white/90 text-sm">
                <span className="bg-white/20 px-2 py-0.5 rounded-full">{l.stage} {pet.stage}/3</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full">{mood.emoji} {isEl ? mood.label.el : mood.label.en}</span>
              </div>
              <p className="text-white/80 text-xs mt-2">{isEl ? stage.name.el : stage.name.en}</p>
            </div>

            {actionMsg && (
              <div className="absolute top-4 right-4 bg-white text-slate-800 px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
                {actionMsg}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg border border-slate-100 dark:border-slate-700 mb-4 space-y-3">
            <StatBar label={l.hunger} icon="🍎" value={pet.hunger} max={100} color="from-red-400 to-orange-500" />
            <StatBar label={l.happiness} icon="❤️" value={pet.happiness} max={100} color="from-pink-400 to-rose-500" />
            <StatBar label={l.energy} icon="⚡" value={pet.energy} max={100} color="from-yellow-400 to-amber-500" />
            {nextEvoXP && (
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                  <span>✨ {l.xp}: {pet.xp}</span>
                  <span>{l.nextEvolution} {nextEvoXP} XP</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all" style={{ width: `${Math.min(100, evoProgress)}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <button onClick={handleFeed} className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-red-200 dark:border-red-800 hover:scale-105 transition-all shadow-md">
              <span className="text-3xl">🍎</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{l.feed}</span>
              <span className="text-[10px] text-amber-500">1 🪙</span>
            </button>
            <button onClick={handlePlay} className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-pink-200 dark:border-pink-800 hover:scale-105 transition-all shadow-md">
              <span className="text-3xl">🎾</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{l.play}</span>
              <span className="text-[10px] text-purple-500">+5 XP</span>
            </button>
            <button onClick={handleRest} className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-800 hover:scale-105 transition-all shadow-md">
              <span className="text-3xl">💤</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{l.rest}</span>
              <span className="text-[10px] text-blue-500">⚡ +100</span>
            </button>
          </div>

          {/* Info */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 text-xs text-amber-800 dark:text-amber-300 text-center">
            💡 {l.earnXPInfo}
          </div>

          <div className="mt-4 text-center">
            <button onClick={() => setConfirmRelease(true)} className="text-xs text-slate-400 hover:text-red-500 transition-colors">
              {l.abandoned}
            </button>
          </div>
        </div>
      </div>

      {confirmRelease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-xs w-full shadow-2xl text-center space-y-4">
            <span className="text-4xl">😢</span>
            <p className="text-slate-700 dark:text-slate-200 font-semibold">{l.confirm}</p>
            <div className="flex gap-3 justify-center">
              <button onClick={handleRelease} className="px-6 py-2 rounded-xl bg-red-500 text-white font-bold">{l.yes}</button>
              <button onClick={() => setConfirmRelease(false)} className="px-6 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">{l.no}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBar({ label, icon, value, max, color }) {
  const pct = (value / max) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
        <span>{icon} {label}</span>
        <span>{Math.round(value)}/{max}</span>
      </div>
      <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
