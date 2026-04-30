import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { ACHIEVEMENTS } from "../config/achievements";
import { ProgressService } from "../services/ProgressService";
import { useToast } from "./ToastNotification";

const T = {
  el: {
    title: "🏆 Επιδείξιμα Trophies",
    desc: "Διάλεξε τα 6 αγαπημένα σου να εμφανίζονται στο προφίλ σου",
    pinned: "Καρφιτσωμένα",
    available: "Διαθέσιμα",
    unlock: "Ξεκλείδωσε ταυτότητες για να εμφανίζονται εδώ!",
    seeAll: "Δες όλες",
    locked: "Κλειδωμένο",
    pin: "Καρφίτσωσε",
    unpin: "Ξεκαρφίτσωσε",
    share: "Μοιράσου",
    copied: "Αντιγράφηκε!",
    full: "Έχεις φτάσει τα 6 - ξεκαρφίτσωσε ένα πρώτα",
  },
  en: {
    title: "🏆 Showcase Trophies",
    desc: "Pick your 6 favorites to display on your profile",
    pinned: "Pinned",
    available: "Available",
    unlock: "Unlock badges to display them here!",
    seeAll: "See all",
    locked: "Locked",
    pin: "Pin",
    unpin: "Unpin",
    share: "Share",
    copied: "Copied!",
    full: "Maximum 6 - unpin one first",
  },
};

const SHOWCASE_KEY = "geo:showcase";
const MAX_PINNED = 6;

function loadShowcase() {
  try { return JSON.parse(localStorage.getItem(SHOWCASE_KEY) || "[]"); } catch { return []; }
}

function saveShowcase(ids) {
  try { localStorage.setItem(SHOWCASE_KEY, JSON.stringify(ids)); } catch {}
}

export default function AchievementShowcase({ readonly = false, profileUrl = null }) {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const { toast } = useToast() || { toast: () => {} };
  const [pinnedIds, setPinnedIds] = useState(loadShowcase);
  const [unlocked, setUnlocked] = useState([]);
  const [shareState, setShareState] = useState("idle");

  useEffect(() => {
    setUnlocked(ProgressService.getUnlockedAchievements());
  }, []);

  const togglePin = (id) => {
    if (readonly) return;
    const isPinned = pinnedIds.includes(id);
    if (isPinned) {
      const next = pinnedIds.filter(x => x !== id);
      setPinnedIds(next); saveShowcase(next);
    } else {
      if (pinnedIds.length >= MAX_PINNED) {
        toast(l.full, "warning");
        return;
      }
      const next = [...pinnedIds, id];
      setPinnedIds(next); saveShowcase(next);
    }
  };

  const sharedUrl = profileUrl || (typeof window !== "undefined" ? window.location.origin + "/profile" : "");

  const handleShare = async () => {
    const text = `${l.title}\n${pinnedIds.map(id => {
      const a = ACHIEVEMENTS.find(x => x.id === id);
      return a ? `${a.icon} ${a.title[lang] || a.title.en}` : "";
    }).filter(Boolean).join("\n")}\n\n${sharedUrl}`;
    if (navigator.share) {
      try { await navigator.share({ title: "Kibloo Trophies", text, url: sharedUrl }); return; } catch {}
    }
    try {
      await navigator.clipboard.writeText(text);
      setShareState("copied");
      setTimeout(() => setShareState("idle"), 2000);
    } catch {}
  };

  const pinned = pinnedIds.map(id => ACHIEVEMENTS.find(a => a.id === id)).filter(Boolean);
  const availableUnlocked = ACHIEVEMENTS.filter(a => unlocked.includes(a.id) && !pinnedIds.includes(a.id));

  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{l.title}</h2>
          {!readonly && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{l.desc}</p>}
        </div>
        {pinned.length > 0 && (
          <button onClick={handleShare} className="px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-200 transition flex items-center gap-1">
            {shareState === "copied" ? `✅ ${l.copied}` : `🔗 ${l.share}`}
          </button>
        )}
      </div>

      {/* Pinned */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-5">
        {Array.from({ length: MAX_PINNED }).map((_, i) => {
          const a = pinned[i];
          return (
            <div
              key={a?.id || `slot_${i}`}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition ${a ? "bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 border-amber-300" : "bg-slate-50 dark:bg-slate-700/30 border-dashed border-slate-300 dark:border-slate-600"}`}
            >
              {a ? (
                <button
                  onClick={() => togglePin(a.id)}
                  disabled={readonly}
                  title={readonly ? "" : l.unpin}
                  className="w-full h-full flex flex-col items-center justify-center p-2 group"
                >
                  <span className="text-3xl sm:text-4xl mb-1 group-hover:scale-110 transition">{a.icon}</span>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-200 text-center line-clamp-2">{a.title[lang] || a.title.en}</span>
                </button>
              ) : (
                <span className="text-2xl text-slate-300 dark:text-slate-600">+</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Available to pin */}
      {!readonly && (
        <>
          {availableUnlocked.length > 0 ? (
            <>
              <p className="text-xs font-bold text-slate-500 uppercase mb-2">{l.available}</p>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {availableUnlocked.map(a => (
                  <button
                    key={a.id}
                    onClick={() => togglePin(a.id)}
                    title={a.title[lang] || a.title.en}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-xs font-semibold transition"
                  >
                    <span>{a.icon}</span>
                    <span className="text-slate-700 dark:text-slate-200">{a.title[lang] || a.title.en}</span>
                    <span className="text-amber-500 ml-1">📌</span>
                  </button>
                ))}
              </div>
            </>
          ) : unlocked.length === 0 ? (
            <p className="text-sm text-center text-slate-500 italic py-4">{l.unlock}</p>
          ) : null}
          <Link to="/achievements" className="inline-block mt-3 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline">
            {l.seeAll} →
          </Link>
        </>
      )}
    </section>
  );
}
