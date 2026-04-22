import React, { useState, useContext, useRef, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { ProgressService } from "../services/ProgressService";
import { AIService } from "../services/AIService";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";

const TIPS = {
  el: {
    greeting: (name) => `Γεια σου${name ? " " + name : ""}! Είμαι ο GeoBot, ο βοηθός σου. Ρώτησέ με ο,τι θέλεις!`,
    streakLow: "Φαίνεται πως δεν έχεις παίξει τελευταία. Μια μικρή καθημερινή εξάσκηση κάνει μεγάλη διαφορά!",
    streakHigh: (n) => `Εξαιρετικό σερί ${n} ημερών! Συνέχισε έτσι!`,
    accuracyLow: "Η ακρίβειά σου είναι κάτω από 50%. Δοκίμασε πιο εύκολες κατηγορίες για να χτίσεις αυτοπεποίθηση.",
    accuracyHigh: "Η ακρίβειά σου είναι πολύ καλή! Δοκίμασε πιο δύσκολα quiz για πρόκληση.",
    xpTip: (level) => `Είσαι επίπεδο ${level}. Παίξε κάθε μέρα για να ανεβείς γρήγορα!`,
    noProgress: "Δεν βρήκα δεδομένα ακόμα. Ξεκίνα ένα quiz και γύρνα εδώ!",
    favoritesTip: "Δοκίμασε να βάλεις αγαπημένα τα quiz που σε ενδιαφέρουν για εύκολη πρόσβαση.",
    suggestions: [
      "Ποια παιχνίδια να δοκιμάσω;",
      "Πώς μπορώ να βελτιωθώ;",
      "Δείξε μου τα στατιστικά μου",
      "Τι σερί έχω;",
      "Ποιο quiz είναι πιο εύκολο;",
    ],
    unknown: "Δεν κατάλαβα ακριβώς. Ρώτησέ με για τα στατιστικά σου, βελτίωση, ή προτάσεις παιχνιδιών!",
    statsAnswer: (stats) => `Έχεις παίξει ${stats.totalGamesPlayed} παιχνίδια, ${stats.totalCorrect} σωστές σε ${stats.totalAttempts} ερωτήσεις. Ακρίβεια: ${stats.totalAttempts > 0 ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100) : 0}%.`,
    gamesTip: "Σου προτείνω να δοκιμάσεις τα Logic & Math αν θέλεις πρόκληση, ή τα Natural World αν θέλεις κάτι πιο ήρεμο.",
    improveTip: "Για βελτίωση: 1) Παίξε κάθε μέρα 10 λεπτά, 2) Ξανακάνε τα λάθη σου, 3) Δοκίμασε πιο δύσκολα quiz σταδιακά.",
    easyQuiz: "Τα quiz φυσικού κόσμου (Nature) και τα βασικά μαθηματικά είναι τα πιο εύκολα για αρχή.",
    typing: "Γράφω...",
  },
  en: {
    greeting: (name) => `Hi${name ? " " + name : ""}! I'm GeoBot, your learning assistant. Ask me anything!`,
    streakLow: "It looks like you haven't played recently. A little daily practice makes a big difference!",
    streakHigh: (n) => `Amazing ${n}-day streak! Keep it up!`,
    accuracyLow: "Your accuracy is below 50%. Try easier categories to build confidence.",
    accuracyHigh: "Your accuracy is excellent! Try harder quizzes for a challenge.",
    xpTip: (level) => `You're level ${level}. Play every day to level up fast!`,
    noProgress: "No data found yet. Start a quiz and come back here!",
    favoritesTip: "Try favoriting quizzes you enjoy for easy access.",
    suggestions: [
      "Which games should I try?",
      "How can I improve?",
      "Show me my stats",
      "What's my streak?",
      "Which quiz is easiest?",
    ],
    unknown: "I didn't quite understand. Ask me about your stats, improvement tips, or game suggestions!",
    statsAnswer: (stats) => `You've played ${stats.totalGamesPlayed} games, ${stats.totalCorrect} correct in ${stats.totalAttempts} questions. Accuracy: ${stats.totalAttempts > 0 ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100) : 0}%.`,
    gamesTip: "I recommend Logic & Math for a challenge, or Natural World for something more relaxed.",
    improveTip: "To improve: 1) Play 10 minutes daily, 2) Retry wrong answers, 3) Gradually try harder quizzes.",
    easyQuiz: "Nature quizzes and basic math are the easiest to start with.",
    typing: "Typing...",
  },
};

function matchIntent(msg, lang) {
  const lower = msg.toLowerCase();
  const isEl = lang === "el";

  if (/στατιστ|stats|stat|σκορ|score/.test(lower)) return "stats";
  if (/βελτ|improv|better|καλύτερ/.test(lower)) return "improve";
  if (/παιχνίδ|game|δοκιμ|try|πρόταση|suggest|recommend/.test(lower)) return "games";
  if (/σερί|streak/.test(lower)) return "streak";
  if (/εύκολ|easy|easiest/.test(lower)) return "easy";
  if (/αγαπ|favorite|fav/.test(lower)) return "favorites";
  if (/γεια|hi|hello|hey|καλη/.test(lower)) return "greeting";
  return "unknown";
}

export default function AITutorPage() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const { user, guest, userProfile } = useContext(AuthContext);
  const l = TIPS[lang] || TIPS.en;

  const name = userProfile?.name || user?.displayName || "";
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const [messages, setMessages] = useState(() => [
    { from: "bot", text: l.greeting(name) },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const getStats = useCallback(() => ProgressService.getOverallStats(), []);
  const getStreak = useCallback(() => ProgressService.getStreak(), []);
  const getXP = useCallback(() => ProgressService.getXP(), []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const getResponse = (intent) => {
    const stats = getStats();
    const streak = getStreak();
    switch (intent) {
      case "stats":
        return l.statsAnswer(stats);
      case "improve":
        return l.improveTip;
      case "games":
        return l.gamesTip;
      case "streak": {
        if (!streak || streak.current === 0) return l.streakLow;
        return l.streakHigh(streak.current);
      }
      case "easy":
        return l.easyQuiz;
      case "favorites":
        return l.favoritesTip;
      case "greeting":
        return l.greeting(name);
      default:
        return l.unknown;
    }
  };

  const getProactiveTip = () => {
    const stats = getStats();
    const streak = getStreak();
    const xp = getXP();
    if (stats.totalGamesPlayed === 0) return l.noProgress;
    const acc = stats.totalAttempts > 0 ? (stats.totalCorrect / stats.totalAttempts) * 100 : 0;
    if (acc < 50) return l.accuracyLow;
    if (acc > 80) return l.accuracyHigh;
    if (streak && streak.current >= 5) return l.streakHigh(streak.current);
    if (streak && streak.current === 0) return l.streakLow;
    if (xp) return l.xpTip(xp.level || 1);
    return l.favoritesTip;
  };

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg = { from: "user", text: trimmed };
    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    setInput("");
    setTyping(true);

    if (AIService.isConfigured()) {
      try {
        const stats = getStats();
        const streak = getStreak();
        const xp = getXP();
        const userContext = {
          stats: {
            totalGamesPlayed: stats.totalGamesPlayed,
            totalCorrect: stats.totalCorrect,
            totalAttempts: stats.totalAttempts,
            streak: streak?.current || 0,
            level: xp?.level || 1,
          },
        };

        const aiReply = await AIService.chat(updatedMsgs, lang, userContext);
        if (aiReply) {
          setMessages((prev) => [...prev, { from: "bot", text: aiReply }]);
          setTyping(false);
          return;
        }
      } catch {}
    }

    setTimeout(() => {
      const intent = matchIntent(trimmed, lang);
      let response = getResponse(intent);

      if (intent === "stats") {
        const tip = getProactiveTip();
        if (tip) response += "\n\n💡 " + tip;
      }

      setMessages((prev) => [...prev, { from: "bot", text: response }]);
      setTyping(false);
    }, 600 + Math.random() * 800);
  }, [input, messages, lang, getStats, getStreak, getXP, getResponse, getProactiveTip]);

  const handleSuggestion = (text) => {
    setInput(text);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 flex flex-col">
      <SEO title={lang === "el" ? "Βοηθός Μελέτης" : "Study Assistant"} />
      <Navbar />

      <div className="flex-1 flex flex-col pt-20 pb-4 px-4 max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-500 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-lg text-white shadow-lg">
            📚
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold text-slate-800 dark:text-slate-100">{lang === "el" ? "Βοηθός Μελέτης" : "Study Assistant"}</h1>
              {AIService.isConfigured() && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">AI</span>
              )}
            </div>
            <p className="text-[11px] text-emerald-500 dark:text-emerald-400 font-semibold">
              {lang === "el" ? "Online • Έτοιμος να βοηθήσω" : "Online • Ready to help"}
            </p>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: "300px" }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                    msg.from === "user"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-md"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-700 px-4 py-3 rounded-2xl rounded-bl-md text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Suggestions */}
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
            {l.suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSuggestion(s)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-700 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={lang === "el" ? "Γράψε μήνυμα..." : "Type a message..."}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900/50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || typing}
              className="w-11 h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg disabled:opacity-50 hover:from-emerald-600 hover:to-teal-600 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
