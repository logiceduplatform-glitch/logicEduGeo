import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { ProgressService } from "../services/ProgressService";
import { CoinService } from "../services/CoinService";
import AvatarDisplay, { AVATAR_PARTS, DEFAULT_AVATAR, getAvatarData, saveAvatarData } from "../components/AvatarDisplay";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";

const T = {
  el: {
    title: "Δημιουργία Avatar",
    subtitle: "Φτιάξε τον δικό σου χαρακτήρα!",
    face: "Πρόσωπο",
    eyes: "Μάτια",
    mouth: "Στόμα",
    hair: "Μαλλιά",
    accessory: "Αξεσουάρ",
    hat: "Καπέλο",
    bg: "Φόντο",
    save: "Αποθήκευση",
    saved: "Αποθηκεύτηκε!",
    reset: "Επαναφορά",
    locked: "Κλειδωμένο",
    unlockAt: "Ξεκλείδωμα σε Level",
    buyInShop: "Αγόρασε στο Shop",
    preview: "Προεπισκόπηση",
    none: "Κανένα",
  },
  en: {
    title: "Avatar Builder",
    subtitle: "Create your own character!",
    face: "Face",
    eyes: "Eyes",
    mouth: "Mouth",
    hair: "Hair",
    accessory: "Accessory",
    hat: "Hat",
    bg: "Background",
    save: "Save",
    saved: "Saved!",
    reset: "Reset",
    locked: "Locked",
    unlockAt: "Unlock at Level",
    buyInShop: "Buy in Shop",
    preview: "Preview",
    none: "None",
  },
};

const CATEGORIES = [
  { key: "face",      icon: "😊" },
  { key: "eyes",      icon: "👁️" },
  { key: "mouth",     icon: "👄" },
  { key: "hair",      icon: "💇" },
  { key: "accessory", icon: "✨" },
  { key: "hat",       icon: "🎩" },
  { key: "bg",        icon: "🎨" },
];

export default function AvatarBuilderPage() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const l = T[lang] || T.en;
  const isEl = lang === "el";

  const [avatar, setAvatar] = useState(() => getAvatarData());
  const [activeTab, setActiveTab] = useState("face");
  const [saved, setSaved] = useState(false);

  const xpData = ProgressService.getXP();
  const userLevel = xpData.level;
  const ownedItems = CoinService.getOwned();

  const isPartUnlocked = (part) => {
    if (!part.locked) return true;
    if (part.unlockLevel && userLevel >= part.unlockLevel) return true;
    if (part.shopId && ownedItems.some(o => o.id === part.shopId)) return true;
    return false;
  };

  const handleSelect = (category, partId) => {
    const part = AVATAR_PARTS[category]?.find(p => p.id === partId);
    if (part && !isPartUnlocked(part)) return;
    setAvatar(prev => ({ ...prev, [category]: partId }));
    setSaved(false);
  };

  const handleSave = () => {
    saveAvatarData(avatar);
    setSaved(true);
    window.dispatchEvent(new CustomEvent("geo:avatarChanged"));
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setAvatar({ ...DEFAULT_AVATAR });
    setSaved(false);
  };

  const parts = AVATAR_PARTS[activeTab] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-amber-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={l.title} />

      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-2">
              🎭 {l.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">{l.subtitle}</p>
          </div>

          {/* Avatar preview */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <AvatarDisplay avatar={avatar} size={160} className="shadow-2xl ring-4 ring-white dark:ring-slate-700" />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white dark:bg-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 shadow-md">
                {l.preview}
              </span>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveTab(cat.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  activeTab === cat.key
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-slate-200 dark:border-slate-700"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{l[cat.key]}</span>
              </button>
            ))}
          </div>

          {/* Parts grid */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-slate-100 dark:border-slate-700 mb-6">
            <div className={`grid gap-3 ${activeTab === "bg" ? "grid-cols-4 sm:grid-cols-8" : "grid-cols-3 sm:grid-cols-5"}`}>
              {parts.map(part => {
                const unlocked = isPartUnlocked(part);
                const selected = avatar[activeTab] === part.id;

                if (activeTab === "bg") {
                  return (
                    <button
                      key={part.id}
                      onClick={() => handleSelect(activeTab, part.id)}
                      className={`w-full aspect-square rounded-xl border-3 transition-all ${
                        selected ? "border-purple-500 ring-2 ring-purple-300 scale-110" : "border-slate-200 dark:border-slate-600 hover:border-purple-300"
                      }`}
                      style={{ backgroundColor: part.color }}
                      title={part.label}
                    />
                  );
                }

                if (activeTab === "eyes") {
                  return (
                    <button
                      key={part.id}
                      onClick={() => handleSelect(activeTab, part.id)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                        selected ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30" : "border-slate-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-600"
                      }`}
                    >
                      <div className="flex gap-2">
                        <div className="w-5 h-5 rounded-full border-2 border-slate-200" style={{ backgroundColor: part.color }} />
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{part.label}</span>
                    </button>
                  );
                }

                if (activeTab === "mouth") {
                  return (
                    <button
                      key={part.id}
                      onClick={() => handleSelect(activeTab, part.id)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                        selected ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30" : "border-slate-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-600"
                      }`}
                    >
                      <svg viewBox="0 0 32 32" width="32" height="32">
                        <path d={part.path} fill="none" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{part.label}</span>
                    </button>
                  );
                }

                const emoji = activeTab === "face" ? part.emoji
                  : activeTab === "hair" ? part.emoji
                  : (part.emoji || "—");

                return (
                  <button
                    key={part.id}
                    onClick={() => unlocked && handleSelect(activeTab, part.id)}
                    disabled={!unlocked}
                    className={`relative flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                      !unlocked
                        ? "opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-600 grayscale"
                        : selected
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 scale-105"
                          : "border-slate-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/10"
                    }`}
                  >
                    <span className="text-2xl">{emoji || "—"}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{part.label}</span>
                    {!unlocked && (
                      <span className="absolute -top-1 -right-1 text-xs bg-slate-200 dark:bg-slate-600 rounded-full w-5 h-5 flex items-center justify-center">🔒</span>
                    )}
                    {!unlocked && part.unlockLevel && (
                      <span className="text-[8px] text-amber-600 dark:text-amber-400 font-bold">Lv.{part.unlockLevel}</span>
                    )}
                    {!unlocked && part.shopId && (
                      <span className="text-[8px] text-pink-600 dark:text-pink-400 font-bold">🛒</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleSave}
              className={`px-8 py-3 rounded-xl font-bold shadow-md transition-all ${
                saved
                  ? "bg-emerald-500 text-white"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-[1.02]"
              }`}
            >
              {saved ? `✅ ${l.saved}` : l.save}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
            >
              {l.reset}
            </button>
            <button
              onClick={() => navigate("/shop")}
              className="px-6 py-3 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-semibold hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-all"
            >
              🛒 Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
