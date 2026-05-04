import React, { useContext, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const CATS = {
  animals: ["🐶", "🐱", "🦊", "🐻", "🐼", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🦄", "🐢", "🐬", "🦋"],
  people: ["🧑", "👶", "👧", "👦", "🧙", "🦸", "🧚", "👨‍🚀", "👩‍🍳", "🧝", "🤴", "👸"],
  places: ["🏠", "🏰", "🌳", "🏖️", "🏔️", "🌋", "🌊", "🌌", "🚀", "🌈", "🌙", "☀️", "🏟️"],
  objects: ["⚔️", "🛡️", "💎", "🗝️", "📜", "💰", "🎁", "🎈", "🎂", "📚", "🎨", "🎮", "⚽", "🚗"],
  emotions: ["😊", "😢", "😱", "😡", "🥰", "😎", "🤔", "😴", "🤯", "🥳", "🤗", "😇"],
  actions: ["🏃", "🤸", "🦘", "🏊", "🚴", "🤺", "💃", "🕺", "🎤", "🎭", "👑", "💪"],
};

const SLOTS = 6;

export default function EmojiStoryPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [story, setStory] = useState(Array(SLOTS).fill(""));
  const [active, setActive] = useState(0);

  const setSlot = (e) => {
    setStory((s) => s.map((v, i) => i === active ? e : v));
    setActive((a) => Math.min(SLOTS - 1, a + 1));
  };

  const reset = () => { setStory(Array(SLOTS).fill("")); setActive(0); };

  const random = () => {
    const all = Object.values(CATS).flat();
    setStory(Array(SLOTS).fill(0).map(() => all[Math.floor(Math.random() * all.length)]));
  };

  return (
    <GameShell title={isEl ? "Ιστορία με Emoji" : "Emoji Story"} description={isEl ? "Διηγήσου την ιστορία σου μόνο με emoji" : "Tell a story using only emojis"} emoji="🎭" canonical="/games/emoji-story" back="/games">
      <div className="grid grid-cols-6 gap-2 mb-4">
        {story.map((e, i) => (
          <button key={i} onClick={() => setActive(i)} className={`aspect-square rounded-xl border-2 text-4xl flex items-center justify-center ${active === i ? "border-purple-600 bg-purple-100 dark:bg-purple-900/30" : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"}`}>
            {e || <span className="text-slate-300 text-sm">{i + 1}</span>}
          </button>
        ))}
      </div>
      <div className="space-y-3 text-sm max-h-[280px] overflow-y-auto">
        {Object.entries(CATS).map(([cat, list]) => (
          <div key={cat}>
            <div className="font-bold text-slate-500 uppercase text-xs mb-1">{cat}</div>
            <div className="flex flex-wrap gap-1">
              {list.map((e) => (
                <button key={e} onClick={() => setSlot(e)} className="text-2xl hover:scale-125 transition-transform">{e}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 justify-center mt-3 flex-wrap">
        <button onClick={reset} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 font-bold rounded-lg">↺ {isEl ? "Καθαρισμός" : "Clear"}</button>
        <button onClick={random} className="px-4 py-2 bg-purple-500 text-white font-bold rounded-lg">🎲 {isEl ? "Τυχαία" : "Random"}</button>
      </div>
    </GameShell>
  );
}
