import React, { useState, useContext } from "react";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { LanguageContext } from "../i18n/LanguageContext";
import { AIService } from "../services/AIService";
import { VoiceService } from "../services/VoiceService";

const T = {
  el: {
    title: "AI Παραμυθάς",
    subtitle: "Δώσε 3 λέξεις και πάρε μια μοναδική ιστορία!",
    word1: "Λέξη 1 (π.χ. δράκος)",
    word2: "Λέξη 2 (π.χ. δάσος)",
    word3: "Λέξη 3 (π.χ. φεγγάρι)",
    age: "Ηλικία",
    subject: "Θέμα",
    generate: "Φτιάξε ιστορία",
    generating: "Γράφω...",
    listen: "🔊 Άκου την ιστορία",
    stop: "⏸ Σταμάτα",
    quizQ: "🧠 Γρίφος",
    show: "Δες απάντηση",
    hide: "Κρύψε",
    new: "Νέα ιστορία",
  },
  en: {
    title: "AI Storyteller",
    subtitle: "Give 3 words and get a unique story!",
    word1: "Word 1 (e.g. dragon)",
    word2: "Word 2 (e.g. forest)",
    word3: "Word 3 (e.g. moon)",
    age: "Age",
    subject: "Subject",
    generate: "Create story",
    generating: "Writing...",
    listen: "🔊 Listen to the story",
    stop: "⏸ Stop",
    quizQ: "🧠 Riddle",
    show: "Show answer",
    hide: "Hide",
    new: "New story",
  },
};

const SUBJECTS = [
  { id: "general", el: "Γενικά", en: "General" },
  { id: "math", el: "Μαθηματικά", en: "Math" },
  { id: "science", el: "Επιστήμες", en: "Science" },
  { id: "language", el: "Γλώσσα", en: "Language" },
];

const AGES = ["3-5", "6-8", "9-12"];

export default function AIStoryPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const [words, setWords] = useState(["", "", ""]);
  const [age, setAge] = useState("6-8");
  const [subject, setSubject] = useState("general");
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAns, setShowAns] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setStory(null);
    setShowAns(false);
    const keywords = words.filter((w) => w.trim()).map((w) => w.trim());
    const res = await AIService.generateStory({ keywords, lang, ageGroup: age, subject });
    setStory(res);
    setLoading(false);
  };

  const handleListen = () => {
    if (speaking) {
      VoiceService.stopSpeaking?.();
      setSpeaking(false);
      return;
    }
    if (!story) return;
    const text = `${story.title}. ${story.paragraphs.join(" ")}`;
    VoiceService.speak?.(text, { lang: lang === "el" ? "el-GR" : "en-US" });
    setSpeaking(true);
    // Heuristic stop tracking — speechSynthesis doesn't always fire onend reliably.
    setTimeout(() => setSpeaking(false), text.length * 80);
  };

  return (
    <>
      <Navbar />
      <SEO title={l.title} description={l.subtitle} canonical="/ai-story" />
      <main className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50 dark:from-slate-900 dark:to-slate-800 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">📖</div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{l.title}</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">{l.subtitle}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-5 mb-4">
            <div className="space-y-2 mb-3">
              {[0, 1, 2].map((i) => (
                <input
                  key={i}
                  value={words[i]}
                  onChange={(e) => {
                    const next = [...words];
                    next[i] = e.target.value;
                    setWords(next);
                  }}
                  placeholder={l[`word${i + 1}`]}
                  maxLength={30}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <select
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              >
                {AGES.map((a) => <option key={a} value={a}>{l.age}: {a}</option>)}
              </select>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              >
                {SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s[lang] || s.en}</option>)}
              </select>
            </div>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || words.every((w) => !w.trim())}
              className="w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold rounded-xl shadow disabled:opacity-50"
            >
              {loading ? l.generating : story ? l.new : l.generate}
            </button>
          </div>

          {story && (
            <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-3">{story.title}</h2>
              <button
                type="button"
                onClick={handleListen}
                className="mb-4 text-sm font-semibold px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 hover:bg-blue-200"
              >
                {speaking ? l.stop : l.listen}
              </button>
              <div className="space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed">
                {story.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
              </div>
              {story.question && (
                <div className="mt-5 p-4 bg-amber-50 dark:bg-amber-900/30 rounded-xl border-l-4 border-amber-400">
                  <div className="font-bold text-amber-900 dark:text-amber-200 mb-2">{l.quizQ}: {story.question.q}</div>
                  <button
                    type="button"
                    onClick={() => setShowAns((s) => !s)}
                    className="text-sm font-semibold text-amber-700 dark:text-amber-300 hover:underline"
                  >
                    {showAns ? `${l.hide} ▲` : `${l.show} ▼`}
                  </button>
                  {showAns && (
                    <div className="mt-2 font-extrabold text-amber-900 dark:text-amber-100">{story.question.a}</div>
                  )}
                </div>
              )}
            </article>
          )}
        </div>
      </main>
    </>
  );
}
