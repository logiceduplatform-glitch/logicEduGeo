import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { MusicService } from "../services/MusicService";
import { CosmeticsService } from "../services/CosmeticsService";
import { SHOP_ITEMS } from "../config/shopItems";
import { CoinService } from "../services/CoinService";
import { SoundService } from "../services/SoundService";

const T = {
  el: {
    title: "🎶 Μουσική & Ηχητικά Εφέ",
    subtitle: "Διάλεξε ηχητικό περιβάλλον. Άκου παρασκηνιακή μουσική και ρύθμισε τους ήχους.",
    backgroundMusic: "Μουσική παρασκηνίου",
    enable: "Ενεργοποίηση",
    volume: "Ένταση",
    mood: "Ατμόσφαιρα",
    preview: "▶ Δοκίμασε",
    stop: "■ Σταμάτα",
    playing: "Παίζει: ",
    sfxLibrary: "Ηχητικά Εφέ",
    sfxDesc: "Δοκίμασε όλα τα ηχητικά εφέ της εφαρμογής.",
    backToProfile: "← Πίσω",
    locked: "🔒 Κλειδωμένο",
    buy: "Αγόρασε",
    buyFor: "Αγόρασε για",
    coins: "νομίσματα",
    notEnough: "Δεν έχεις αρκετά νομίσματα",
    bought: "Αγοράστηκε ✓",
    free: "Δωρεάν",
    rare: "Σπάνιο",
    legendary: "Θρυλικό",
    sfxList: {
      correct: "Σωστή απάντηση",
      wrong: "Λάθος απάντηση",
      click: "Κλικ",
      pop: "Pop",
      coin: "Νόμισμα",
      levelup: "Άνοδος επιπέδου",
      achievement: "Επίτευγμα",
      gameStart: "Έναρξη παιχνιδιού",
      gameOver: "Τέλος παιχνιδιού",
      streak: "Σερί",
      missionComplete: "Αποστολή ολοκληρώθηκε",
      star: "Αστέρι",
      timer: "Χρονόμετρο",
    },
  },
  en: {
    title: "🎶 Music & Sound Effects",
    subtitle: "Pick your audio vibe. Stream background music and try out sounds.",
    backgroundMusic: "Background music",
    enable: "Enable",
    volume: "Volume",
    mood: "Mood",
    preview: "▶ Preview",
    stop: "■ Stop",
    playing: "Playing: ",
    sfxLibrary: "Sound Effects",
    sfxDesc: "Try all the sound effects used across the platform.",
    backToProfile: "← Back",
    locked: "🔒 Locked",
    buy: "Buy",
    buyFor: "Buy for",
    coins: "coins",
    notEnough: "Not enough coins",
    bought: "Bought ✓",
    free: "Free",
    rare: "Rare",
    legendary: "Legendary",
    sfxList: {
      correct: "Correct",
      wrong: "Wrong",
      click: "Click",
      pop: "Pop",
      coin: "Coin",
      levelup: "Level up",
      achievement: "Achievement",
      gameStart: "Game start",
      gameOver: "Game over",
      streak: "Streak",
      missionComplete: "Mission complete",
      star: "Star",
      timer: "Timer",
    },
  },
};

export default function MusicSettingsPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const navigate = useNavigate();

  const [prefs, setPrefs] = useState(() => MusicService.getPrefs());
  const [equipped, setEquipped] = useState(() => CosmeticsService.getEquipped());
  const [owned, setOwned] = useState(() => new Set((CoinService.getOwned() || []).map((x) => x.id)));
  const [coinBalance, setCoinBalance] = useState(() => CoinService.getBalance().balance || 0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    MusicService.setPrefs(prefs);
  }, [prefs]);

  const handleToggle = () => setPrefs((p) => ({ ...p, enabled: !p.enabled }));
  const handleVolume = (v) => setPrefs((p) => ({ ...p, volume: v }));
  const handleMood = (mood) => {
    const item = SHOP_ITEMS.music.find((m) => m.mood === mood);
    if (item && !item.default && !owned.has(item.id)) return; // locked
    setPrefs((p) => ({ ...p, mood, enabled: true }));
    CosmeticsService.equip("music", item?.id || `music_${mood}`);
    setEquipped(CosmeticsService.getEquipped());
  };

  const handleBuy = (item) => {
    if (owned.has(item.id)) return;
    if (item.price === 0) {
      CoinService.addOwned({ id: item.id, type: "music", emoji: item.emoji, name: item.name });
    } else {
      if (!CoinService.spend(item.price)) {
        alert(l.notEnough);
        return;
      }
      CoinService.addOwned({ id: item.id, type: "music", emoji: item.emoji, name: item.name });
    }
    setOwned(new Set((CoinService.getOwned() || []).map((x) => x.id)));
    setCoinBalance(CoinService.getBalance().balance || 0);
  };

  const handlePreview = (mood) => {
    MusicService.preview(mood);
  };

  const playSfx = (key) => {
    try {
      if (typeof SoundService[key] === "function") SoundService[key]();
      else if (SoundService.play) SoundService.play(key);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={l.title} />
      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-3xl space-y-5">
          <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:underline">{l.backToProfile}</button>

          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white">{l.title}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{l.subtitle}</p>
          </div>

          <div className="flex justify-end">
            <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-bold">🪙 {coinBalance}</span>
          </div>

          {/* BG Music */}
          <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-slate-800 dark:text-white text-lg">{l.backgroundMusic}</h2>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={prefs.enabled} onChange={handleToggle} className="sr-only peer" />
                <div className="relative w-11 h-6 bg-slate-300 dark:bg-slate-600 peer-checked:bg-violet-500 rounded-full transition">
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${prefs.enabled ? "translate-x-5" : ""}`} />
                </div>
              </label>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">{l.volume}</label>
              <input type="range" min={0} max={1} step={0.05} value={prefs.volume} onChange={(e) => handleVolume(parseFloat(e.target.value))} className="w-full accent-violet-500" />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{l.mood}</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SHOP_ITEMS.music.map((track) => {
                  const isOwned = owned.has(track.id) || track.default;
                  const isActive = prefs.mood === track.mood && prefs.enabled;
                  return (
                    <div key={track.id} className={`rounded-xl p-3 border-2 transition relative ${isActive ? "bg-violet-100 dark:bg-violet-900/30 border-violet-400" : "bg-slate-50 dark:bg-slate-700/40 border-slate-200 dark:border-slate-600"}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{track.emoji}</span>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{track.name[lang] || track.name.en}</p>
                            {track.rarity && <span className="text-[10px] uppercase font-bold text-amber-600">{l[track.rarity] || track.rarity}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        {isOwned ? (
                          <>
                            <button onClick={() => handleMood(track.mood)} className="flex-1 py-1.5 rounded-lg bg-violet-500 text-white text-xs font-bold">
                              {isActive ? l.playing.trim() : l.preview}
                            </button>
                            <button onClick={() => handlePreview(track.mood)} className="px-2 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold">▶</button>
                          </>
                        ) : (
                          <button onClick={() => handleBuy(track)} className="flex-1 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-bold">
                            {track.price === 0 ? l.free : `${l.buyFor} 🪙${track.price}`}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* SFX library */}
          <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
            <h2 className="font-extrabold text-slate-800 dark:text-white text-lg">{l.sfxLibrary}</h2>
            <p className="text-sm text-slate-500 mb-3">{l.sfxDesc}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(l.sfxList).map(([key, label]) => (
                <button key={key} onClick={() => playSfx(key)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700/40 hover:bg-violet-50 dark:hover:bg-violet-900/20 text-slate-700 dark:text-slate-200 text-sm font-semibold transition">
                  <span className="text-lg">🔊</span>
                  {label}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
