// Voice Command service using Web Speech Recognition API.
// Routes spoken commands to navigation paths or actions.

const COMMAND_MAP = {
  el: [
    { keywords: ["αρχική", "σπίτι"], path: "/" },
    { keywords: ["προφίλ", "λογαριασμός"], path: "/profile" },
    { keywords: ["προφίλ ρυθμίσεις", "ρυθμίσεις"], path: "/profile" },
    { keywords: ["κατάστημα", "shop", "αγορά"], path: "/shop" },
    { keywords: ["ταυτότητες", "επιτυχίες", "κουπιά"], path: "/achievements" },
    { keywords: ["κατάταξη", "leaderboard"], path: "/leaderboard" },
    { keywords: ["ημερήσια πρόκληση", "πρόκληση μέρας"], path: "/daily" },
    { keywords: ["περιπέτεια", "χάρτης"], path: "/adventure" },
    { keywords: ["μάχη", "battle"], path: "/battle" },
    { keywords: ["κατοικίδιο", "κατοικιδιο", "ζωάκι"], path: "/pet" },
    { keywords: ["ιστορίες", "ιστορία mode"], path: "/story" },
    { keywords: ["κάρτες", "συλλογή"], path: "/cards" },
    { keywords: ["πρόκληση φίλου"], path: "/challenge" },
    { keywords: ["live quiz", "ζωντανό κουίζ"], path: "/live-quiz" },
    { keywords: ["avatar", "άβαταρ"], path: "/avatar" },
    { keywords: ["επιτραπέζια"], path: "/play/board-games" },
    { keywords: ["παιχνίδια ενηλίκων"], path: "/play/adult-games" },
    { keywords: ["δάσκαλος", "πίνακας δασκάλου"], path: "/teacher" },
    { keywords: ["γονέας", "γονικός"], path: "/parent-dashboard" },
    { keywords: ["τάξη μου"], path: "/my-classroom" },
    { keywords: ["εγγραφή τάξης", "join τάξη"], path: "/join-classroom" },
    { keywords: ["οικογενειακή πρόκληση", "οικογενειακό κουίζ"], path: "/family-challenge" },
    { keywords: ["ασκήσεις", "φύλλα", "worksheets"], path: "/worksheets" },
    { keywords: ["blog"], path: "/blog" },
    { keywords: ["επικοινωνία"], path: "/contact" },
    { keywords: ["faq", "συχνές ερωτήσεις"], path: "/faq" },
    { keywords: ["συνδρομή"], path: "/subscription" },
    { keywords: ["πίσω"], action: "back" },
    { keywords: ["σκοτεινό", "νύχτα"], action: "dark" },
    { keywords: ["φωτεινό", "μέρα"], action: "light" },
    { keywords: ["αναζήτηση"], action: "search" },
    { keywords: ["βοήθεια"], action: "help" },
  ],
  en: [
    { keywords: ["home"], path: "/" },
    { keywords: ["profile", "account", "settings"], path: "/profile" },
    { keywords: ["shop", "store"], path: "/shop" },
    { keywords: ["achievements", "badges", "trophies"], path: "/achievements" },
    { keywords: ["leaderboard", "ranking"], path: "/leaderboard" },
    { keywords: ["daily", "daily challenge"], path: "/daily" },
    { keywords: ["adventure", "map"], path: "/adventure" },
    { keywords: ["battle", "fight"], path: "/battle" },
    { keywords: ["pet", "tamagotchi"], path: "/pet" },
    { keywords: ["story", "stories"], path: "/story" },
    { keywords: ["cards", "collection"], path: "/cards" },
    { keywords: ["challenge friend"], path: "/challenge" },
    { keywords: ["live quiz"], path: "/live-quiz" },
    { keywords: ["avatar"], path: "/avatar" },
    { keywords: ["board games"], path: "/play/board-games" },
    { keywords: ["adult games"], path: "/play/adult-games" },
    { keywords: ["teacher", "teacher dashboard"], path: "/teacher" },
    { keywords: ["parent", "parent dashboard"], path: "/parent-dashboard" },
    { keywords: ["my classroom"], path: "/my-classroom" },
    { keywords: ["join classroom"], path: "/join-classroom" },
    { keywords: ["family challenge", "family quiz"], path: "/family-challenge" },
    { keywords: ["worksheets", "exercises"], path: "/worksheets" },
    { keywords: ["blog"], path: "/blog" },
    { keywords: ["contact"], path: "/contact" },
    { keywords: ["faq"], path: "/faq" },
    { keywords: ["subscription", "premium"], path: "/subscription" },
    { keywords: ["back", "go back"], action: "back" },
    { keywords: ["dark", "dark mode", "night"], action: "dark" },
    { keywords: ["light", "light mode", "day"], action: "light" },
    { keywords: ["search"], action: "search" },
    { keywords: ["help"], action: "help" },
  ],
};

let recognition = null;
let listening = false;
const listeners = new Set();

function getRecognition() {
  if (recognition) return recognition;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  recognition = new SR();
  recognition.continuous = false;
  recognition.interimResults = false;
  return recognition;
}

export const VoiceCommandService = {
  isSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  },

  isListening() { return listening; },

  matchCommand(transcript, lang = "el") {
    const t = (transcript || "").toLowerCase().trim();
    if (!t) return null;
    const map = COMMAND_MAP[lang] || COMMAND_MAP.en;

    let best = null;
    let bestScore = 0;
    for (const cmd of map) {
      for (const kw of cmd.keywords) {
        const k = kw.toLowerCase();
        if (t === k) return cmd;
        if (t.includes(k)) {
          const score = k.length;
          if (score > bestScore) { bestScore = score; best = cmd; }
        }
      }
    }
    return best;
  },

  start({ lang = "el", onResult, onError } = {}) {
    const rec = getRecognition();
    if (!rec) { onError?.("not_supported"); return; }
    if (listening) return;

    rec.lang = lang === "el" ? "el-GR" : "en-US";
    rec.onstart = () => { listening = true; listeners.forEach(fn => fn(true)); };
    rec.onend = () => { listening = false; listeners.forEach(fn => fn(false)); };
    rec.onerror = (e) => { listening = false; listeners.forEach(fn => fn(false)); onError?.(e.error || "error"); };
    rec.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join(" ").trim();
      const cmd = VoiceCommandService.matchCommand(transcript, lang);
      onResult?.({ transcript, command: cmd });
    };

    try { rec.start(); } catch (e) { onError?.("start_failed"); }
  },

  stop() {
    if (recognition && listening) {
      try { recognition.stop(); } catch {}
    }
    listening = false;
  },

  onListeningChange(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
