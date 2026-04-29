import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import ReadAloudButton from "../components/ReadAloudButton";
import { LanguageContext } from "../i18n/LanguageContext";
import { SpacedRepetitionService } from "../services/SpacedRepetitionService";
import { AIService } from "../services/AIService";

const T = {
  el: {
    title: "🤖 Study Buddy AI",
    subtitle: "Σου εξηγώ τα λάθη σου και σε βοηθώ να γίνεις καλύτερος",
    back: "Πίσω",
    review: "Επανάληψη Λαθών",
    chat: "Συνομιλία",
    due: "Για επανάληψη σήμερα",
    overdue: "Χρειάζονται επανάληψη",
    upcoming: "Προγραμματισμένες",
    none: "Δεν έχεις λάθη να επαναλάβεις 🎉",
    noneSub: "Συνέχισε να παίζεις για να βελτιώνεσαι!",
    explain: "💡 Εξήγησε μου",
    correct: "Σωστή",
    explanation: "Επεξήγηση",
    nextReview: "Επόμενη επανάληψη",
    today: "σήμερα",
    inDays: "σε {n} μέρες",
    inDay: "αύριο",
    inLessThanHour: "σε λίγο",
    askPlaceholder: "Ρώτα τον Study Buddy...",
    send: "Αποστολή",
    suggested1: "Πώς μπορώ να βελτιωθώ στα μαθηματικά;",
    suggested2: "Δώσε μου ένα παράδειγμα κλάσματος",
    suggested3: "Πες μου ένα τρικ μνήμης",
    aiUnavailable: "Το AI chat δεν είναι διαθέσιμο τώρα. Δοκίμασε ξανά αργότερα ή χρησιμοποίησε τις εξηγήσεις λαθών παραπάνω.",
    welcome: "Γεια! Είμαι ο Study Buddy. Μπορώ να σε βοηθήσω να καταλάβεις τα λάθη σου ή να σου εξηγήσω πράγματα. Τι θες να μάθεις;",
    typing: "Πληκτρολογεί...",
    practiceTip: "Ξαναπαίξε το ίδιο κουίζ μετά από 1 / 3 / 7 μέρες για καλύτερη εκμάθηση!",
    masteredBadge: "🏆 Master",
    stage: "Στάδιο",
    yourAnswer: "Η απάντησή σου",
  },
  en: {
    title: "🤖 Study Buddy AI",
    subtitle: "I explain your mistakes and help you improve",
    back: "Back",
    review: "Review Mistakes",
    chat: "Chat",
    due: "Due today",
    overdue: "Need review",
    upcoming: "Upcoming",
    none: "No mistakes to review 🎉",
    noneSub: "Keep playing to improve!",
    explain: "💡 Explain",
    correct: "Correct",
    explanation: "Explanation",
    nextReview: "Next review",
    today: "today",
    inDays: "in {n} days",
    inDay: "tomorrow",
    inLessThanHour: "soon",
    askPlaceholder: "Ask Study Buddy...",
    send: "Send",
    suggested1: "How can I improve in math?",
    suggested2: "Give me an example of fractions",
    suggested3: "Tell me a memory trick",
    aiUnavailable: "AI chat is not available right now. Try again later or use the mistake explanations above.",
    welcome: "Hi! I'm Study Buddy. I can help you understand your mistakes or explain concepts. What do you want to learn?",
    typing: "Typing...",
    practiceTip: "Replay the same quiz after 1 / 3 / 7 days for better learning!",
    masteredBadge: "🏆 Master",
    stage: "Stage",
    yourAnswer: "Your answer",
  },
};

function fmtNext(ts, l) {
  const ms = ts - Date.now();
  if (ms <= 0) return l.today;
  const days = Math.round(ms / (24 * 3600 * 1000));
  if (days < 1) return l.inLessThanHour;
  if (days === 1) return l.inDay;
  return l.inDays.replace("{n}", days);
}

// Heuristic local explanation if no AI configured
function localExplain(item, lang) {
  if (item.explanation && item.explanation.trim()) return item.explanation;
  const correct = String(item.correct || "");
  if (lang === "el") {
    return `Η σωστή απάντηση είναι "${correct}". Διάβασε ξανά την ερώτηση και προσπάθησε να συνδέσεις την έννοια με κάτι που ήδη ξέρεις.`;
  }
  return `The correct answer is "${correct}". Re-read the question and try to connect the concept to something you already know.`;
}

export default function StudyBuddyPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const navigate = useNavigate();
  const l = T[lang] || T.en;

  const [tab, setTab] = useState("review");
  const [tick, setTick] = useState(0);
  const [expanded, setExpanded] = useState({});
  const [aiAnswers, setAiAnswers] = useState({});

  // Chat
  const [messages, setMessages] = useState([{ from: "ai", text: T[lang]?.welcome || T.en.welcome }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const chatEnd = useRef(null);

  const items = useMemo(() => SpacedRepetitionService.getAll(), [tick]);
  const due = items.filter(it => it.nextReview <= Date.now()).sort((a, b) => a.nextReview - b.nextReview);
  const upcoming = items.filter(it => it.nextReview > Date.now()).sort((a, b) => a.nextReview - b.nextReview);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const explainItem = async (item) => {
    setExpanded((e) => ({ ...e, [item.id]: true }));
    if (aiAnswers[item.id]) return;
    if (AIService.isConfigured()) {
      const prompt = lang === "el"
        ? `Εξήγησε σύντομα γιατί η σωστή απάντηση στην ερώτηση "${item.question}" είναι "${item.correct}". Δώσε ένα μικρό παράδειγμα ή τρικ μνήμης.`
        : `Briefly explain why the correct answer to "${item.question}" is "${item.correct}". Give a small example or memory trick.`;
      const reply = await AIService.chat([{ from: "user", text: prompt }], lang);
      if (reply) {
        setAiAnswers((a) => ({ ...a, [item.id]: reply }));
        return;
      }
    }
    setAiAnswers((a) => ({ ...a, [item.id]: localExplain(item, lang) }));
  };

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed) return;
    const next = [...messages, { from: "user", text: trimmed }];
    setMessages(next);
    setInput("");
    setThinking(true);
    if (AIService.isConfigured()) {
      const reply = await AIService.chat(next, lang);
      setThinking(false);
      if (reply) {
        setMessages([...next, { from: "ai", text: reply }]);
        return;
      }
    } else {
      setThinking(false);
    }
    setMessages([...next, { from: "ai", text: l.aiUnavailable }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <SEO title={l.title} description={l.subtitle} canonical="/study-buddy" />
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-purple-600 mb-4">← {l.back}</button>

        <header className="text-center mb-6">
          <div className="text-6xl mb-2">🤖</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">{l.title}</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">{l.subtitle}</p>
        </header>

        {/* Tabs */}
        <div role="tablist" className="flex gap-2 mb-6 justify-center">
          <button
            role="tab"
            aria-selected={tab === "review"}
            onClick={() => setTab("review")}
            className={`px-4 py-2 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-400 ${tab === "review" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"}`}
          >
            🔁 {l.review} {due.length > 0 && <span className="ml-1 text-xs">({due.length})</span>}
          </button>
          <button
            role="tab"
            aria-selected={tab === "chat"}
            onClick={() => setTab("chat")}
            className={`px-4 py-2 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-400 ${tab === "chat" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"}`}
          >
            💬 {l.chat}
          </button>
        </div>

        {tab === "review" && (
          <>
            {items.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 text-center border border-slate-100 dark:border-slate-700">
                <div className="text-7xl mb-3">🎉</div>
                <p className="font-bold text-slate-800 dark:text-slate-100">{l.none}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{l.noneSub}</p>
                <Link to="/quiz" className="inline-block mt-5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm">
                  {lang === "el" ? "Παίξε ένα κουίζ" : "Play a quiz"}
                </Link>
              </div>
            ) : (
              <>
                <p className="text-xs text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 rounded-xl p-3 mb-4 text-center">
                  ⏱️ {l.practiceTip}
                </p>

                {due.length > 0 && (
                  <Section title={`🔥 ${l.due} (${due.length})`}>
                    {due.map((item) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        l={l}
                        lang={lang}
                        expanded={expanded[item.id]}
                        aiAnswer={aiAnswers[item.id]}
                        onExplain={() => explainItem(item)}
                        onToggle={() => setExpanded((e) => ({ ...e, [item.id]: !e[item.id] }))}
                      />
                    ))}
                  </Section>
                )}

                {upcoming.length > 0 && (
                  <Section title={`📅 ${l.upcoming} (${upcoming.length})`}>
                    {upcoming.map((item) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        l={l}
                        lang={lang}
                        expanded={expanded[item.id]}
                        aiAnswer={aiAnswers[item.id]}
                        onExplain={() => explainItem(item)}
                        onToggle={() => setExpanded((e) => ({ ...e, [item.id]: !e[item.id] }))}
                      />
                    ))}
                  </Section>
                )}
              </>
            )}
          </>
        )}

        {tab === "chat" && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="h-[460px] overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${m.from === "user" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {thinking && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl px-4 py-2.5 text-sm text-slate-500 italic">{l.typing}</div>
                </div>
              )}
              <div ref={chatEnd} />
            </div>

            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2 border-t border-slate-100 dark:border-slate-700 pt-3">
                {[l.suggested1, l.suggested2, l.suggested3].map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s)} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 hover:bg-purple-200">
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
              className="flex gap-2 p-3 border-t border-slate-100 dark:border-slate-700"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={l.askPlaceholder}
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-purple-400"
              />
              <button type="submit" disabled={!input.trim() || thinking} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold disabled:opacity-50">
                {l.send}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-6">
      <h2 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function ItemCard({ item, l, lang, expanded, aiAnswer, onExplain, onToggle }) {
  const stagePct = ((item.stage + 1) / 4) * 100;
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <p className="font-semibold text-slate-800 dark:text-slate-100 flex-1">{item.question}</p>
            <ReadAloudButton text={item.question} size="sm" />
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span>📅 {l.nextReview}: {fmtNext(item.nextReview, l)}</span>
            <span>•</span>
            <span>{l.stage} {item.stage + 1}/4</span>
            {item.wrongCount > 1 && <><span>•</span><span>×{item.wrongCount}</span></>}
          </div>
          <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${stagePct}%` }} />
          </div>
        </div>
        <button onClick={onToggle} className="text-xs font-bold text-purple-600 dark:text-purple-400 shrink-0 hover:underline">
          {expanded ? "▲" : "▼"}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30">✅ {l.correct}</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">{String(item.correct)}</span>
          </div>

          {item.options && item.options.length > 0 && (
            <div className="grid grid-cols-2 gap-1.5">
              {item.options.map((opt, i) => (
                <div key={i} className={`px-2 py-1.5 rounded-lg text-xs font-semibold ${String(opt) === String(item.correct) ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200" : "bg-slate-100 dark:bg-slate-700/40 text-slate-600 dark:text-slate-300"}`}>
                  {String(opt)}
                </div>
              ))}
            </div>
          )}

          <button onClick={onExplain} className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm">
            {l.explain}
          </button>

          {aiAnswer && (
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-3 text-purple-900 dark:text-purple-200 text-sm whitespace-pre-line">
              <div className="flex items-start gap-2">
                <span className="text-lg">🤖</span>
                <div className="flex-1">{aiAnswer}</div>
                <ReadAloudButton text={aiAnswer} size="sm" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
