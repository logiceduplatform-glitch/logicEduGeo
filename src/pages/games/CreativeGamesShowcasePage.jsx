import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import SEO from "../../components/SEO";
import { LanguageContext } from "../../i18n/LanguageContext";

const T = {
  el: { title: "Δημιουργικά Παιχνίδια", subtitle: "Δείξε τη φαντασία σου!" },
  en: { title: "Creative Games", subtitle: "Show your imagination!" },
};

const GAMES = [
  { path: "/games/story-builder",  emoji: "📖", color: "from-purple-500 to-pink-500",  el: "Φτιάξε Ιστορία",      en: "Story Builder",      descEl: "Σύνθεσε ιστορίες", descEn: "Compose stories" },
  { path: "/games/comic-maker",    emoji: "💬", color: "from-blue-500 to-cyan-500",    el: "Comic Maker",          en: "Comic Maker",        descEl: "4 καρέ κόμικ", descEn: "4-panel comics" },
  { path: "/games/music-composer", emoji: "🎼", color: "from-pink-500 to-rose-500",    el: "Συνθέτης Μουσικής",   en: "Music Composer",     descEl: "Πιάνο 16 βήματα", descEn: "16-step piano" },
  { path: "/games/patterns",       emoji: "🎨", color: "from-fuchsia-500 to-purple-500", el: "Σχέδια & Μοτίβα",  en: "Pattern Designer",   descEl: "Συμμετρία 8x8", descEn: "8x8 symmetry" },
  { path: "/games/pixel-art",      emoji: "🟦", color: "from-indigo-500 to-blue-600",  el: "Pixel Art",            en: "Pixel Art",          descEl: "16-32 pixel καμβάς", descEn: "16-32 pixel canvas" },
  { path: "/games/mad-libs",       emoji: "🎭", color: "from-amber-500 to-orange-500", el: "Mad Libs",             en: "Mad Libs",           descEl: "Αστείες ιστορίες", descEn: "Funny stories" },
  { path: "/games/animation",      emoji: "🎬", color: "from-violet-500 to-purple-600", el: "Στούντιο Animation",  en: "Animation Studio",   descEl: "Καρέ-καρέ", descEn: "Frame by frame" },
  { path: "/games/emoji-story",    emoji: "🎭", color: "from-yellow-500 to-orange-500", el: "Ιστορία Emoji",       en: "Emoji Story",        descEl: "Μόνο emoji!", descEn: "Emojis only!" },
  { path: "/games/voice-recorder", emoji: "🎤", color: "from-red-500 to-pink-600",     el: "Φωνητική Εγγραφή",    en: "Voice Recorder",     descEl: "Καταγραφή ήχου", descEn: "Audio recording" },
  { path: "/games/stop-motion",    emoji: "🎥", color: "from-cyan-500 to-teal-600",    el: "Stop Motion",          en: "Stop Motion",        descEl: "Animation με κάμερα", descEn: "Camera animation" },
  { path: "/games/block-coding",   emoji: "🧩", color: "from-emerald-500 to-green-600", el: "Block Coding",        en: "Block Coding",       descEl: "Drag & drop μπλοκ", descEn: "Drag & drop blocks" },
  { path: "/games/robot-maze",     emoji: "🤖", color: "from-blue-600 to-indigo-600",  el: "Λαβύρινθος Ρομπότ",   en: "Robot Maze",         descEl: "Λύσε λαβυρίνθους", descEn: "Solve mazes" },
  { path: "/games/beat-maker",     emoji: "🎚️", color: "from-purple-600 to-pink-600",  el: "Beat Maker",           en: "Beat Maker",         descEl: "Drum machine 5 tracks", descEn: "5-track drum machine" },
];

export default function CreativeGamesShowcasePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  return (
    <>
      <Navbar />
      <SEO title={l.title} description={l.subtitle} canonical="/games/creative" />
      <main className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="text-5xl mb-2">🎨</div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">{l.title}</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">{l.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GAMES.map((g) => (
              <Link key={g.path} to={g.path} className={`bg-gradient-to-br ${g.color} text-white rounded-2xl p-5 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all`}>
                <div className="text-5xl mb-2">{g.emoji}</div>
                <div className="font-extrabold text-xl">{lang === "el" ? g.el : g.en}</div>
                <div className="text-sm opacity-90 mt-1">{lang === "el" ? g.descEl : g.descEn}</div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
