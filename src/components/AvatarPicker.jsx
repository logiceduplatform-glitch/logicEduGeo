import React, { useContext, useMemo, useState } from "react";
import { LanguageContext } from "../i18n/LanguageContext";

const FREE_AVATARS = ["🦊", "🐼", "🦁", "🐸", "🐶", "🐱", "🐰", "🦄", "🐻", "🐧", "🦋", "🐝"];

const T = {
  el: { title: "Επίλεξε Avatar", free: "Δωρεάν", premium: "Premium", select: "Επιλογή", locked: "Κλειδωμένο", close: "Κλείσιμο" },
  en: { title: "Choose Avatar", free: "Free", premium: "Premium", select: "Select", locked: "Locked", close: "Close" },
};

export default function AvatarPicker({ currentAvatar, onSelect, onClose, ownedAvatars = [] }) {
  const { lang } = useContext(LanguageContext);
  const l = T[lang] || T.en;
  const [selected, setSelected] = useState(currentAvatar || "");

  const premiumAvatars = useMemo(() => {
    try {
      const owned = JSON.parse(localStorage.getItem("geo:shop:owned")) || [];
      return owned.filter((item) => item.type === "avatar").map((item) => item.emoji);
    } catch { return []; }
  }, []);

  const allAvatars = useMemo(() => {
    const combined = [...FREE_AVATARS];
    for (const pa of premiumAvatars) {
      if (!combined.includes(pa)) combined.push(pa);
    }
    for (const oa of ownedAvatars) {
      if (!combined.includes(oa)) combined.push(oa);
    }
    return combined;
  }, [premiumAvatars, ownedAvatars]);

  const handleConfirm = () => {
    if (selected) onSelect(selected);
  };

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={l.title}
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-slate-800 dark:text-white text-center mb-5">
          {l.title}
        </h2>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {allAvatars.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setSelected(emoji)}
              className={`w-16 h-16 rounded-2xl text-3xl flex items-center justify-center transition-all ${
                selected === emoji
                  ? "bg-purple-100 dark:bg-purple-900/50 border-2 border-purple-500 scale-110 shadow-lg"
                  : "bg-slate-100 dark:bg-slate-700 border-2 border-transparent hover:border-purple-300 hover:scale-105"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            {l.close}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className="flex-1 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:hover:scale-100"
          >
            {l.select}
          </button>
        </div>
      </div>
    </div>
  );
}
