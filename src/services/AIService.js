const AI_API_URL = import.meta.env.VITE_AI_API_URL || "";

// ── Client-side rate limiter ─────────────────────────────────────────────
// This is a defense-in-depth layer; the real enforcement should also live
// server-side in your AI proxy (Cloud Function). We track per-action and
// per-day caps so a runaway bug or malicious user can't burn through quota.
const RATE_KEY = "edu:aiRateLimit";
const LIMITS = {
  chat:   { perMinute: 8,  perHour: 40,  perDay: 100 },
  lesson: { perMinute: 2,  perHour: 10,  perDay: 25  },
};

function loadRate() {
  try {
    return JSON.parse(localStorage.getItem(RATE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveRate(data) {
  try {
    localStorage.setItem(RATE_KEY, JSON.stringify(data));
  } catch {
    /* storage full */
  }
}

function pruneOld(arr, windowMs) {
  const now = Date.now();
  return (arr || []).filter((ts) => now - ts < windowMs);
}

/**
 * Returns { allowed: boolean, retryAfterMs?: number, reason?: string }
 */
function checkRateLimit(action) {
  const limits = LIMITS[action] || LIMITS.chat;
  const data = loadRate();
  const bucket = data[action] || { calls: [] };

  const calls = pruneOld(bucket.calls, 24 * 60 * 60 * 1000); // keep 24h
  const now = Date.now();

  const callsLastMin  = calls.filter((ts) => now - ts < 60_000).length;
  const callsLastHour = calls.filter((ts) => now - ts < 3_600_000).length;
  const callsLastDay  = calls.length;

  if (callsLastMin >= limits.perMinute) {
    return { allowed: false, reason: "minute", retryAfterMs: 60_000 };
  }
  if (callsLastHour >= limits.perHour) {
    return { allowed: false, reason: "hour", retryAfterMs: 3_600_000 };
  }
  if (callsLastDay >= limits.perDay) {
    return { allowed: false, reason: "day", retryAfterMs: 24 * 60 * 60 * 1000 };
  }
  return { allowed: true };
}

function recordCall(action) {
  const data = loadRate();
  const bucket = data[action] || { calls: [] };
  bucket.calls = pruneOld(bucket.calls, 24 * 60 * 60 * 1000);
  bucket.calls.push(Date.now());
  data[action] = bucket;
  saveRate(data);
}

export function getRateLimitStatus() {
  const out = {};
  for (const action of Object.keys(LIMITS)) {
    const check = checkRateLimit(action);
    const data = loadRate();
    const calls = data[action]?.calls || [];
    const now = Date.now();
    out[action] = {
      ...check,
      callsLastMin:  calls.filter((ts) => now - ts < 60_000).length,
      callsLastHour: calls.filter((ts) => now - ts < 3_600_000).length,
      callsLastDay:  calls.filter((ts) => now - ts < 24 * 60 * 60 * 1000).length,
      limits: LIMITS[action],
    };
  }
  return out;
}

const SYSTEM_PROMPT_EL = `Είσαι ο "Βοηθός Μελέτης" στην εκπαιδευτική πλατφόρμα Kibloo.
Βοηθάς παιδιά 2-12 ετών και ενήλικες να μάθουν μέσα από παιχνίδια.
Απαντάς ΠΑΝΤΑ στα ελληνικά, σύντομα (2-4 προτάσεις), φιλικά, ενθαρρυντικά.
Αν σου ρωτήσουν κάτι εκτός θέματος, φέρε τη συζήτηση πίσω στη μάθηση.
Αν σου δώσουν στατιστικά χρήστη, δώσε εξατομικευμένες συμβουλές.
Μην δίνεις λανθασμένες πληροφορίες. Αν δεν ξέρεις, πες το.
Χρησιμοποίησε emoji με μέτρο (1-2 ανά μήνυμα).`;

const SYSTEM_PROMPT_EN = `You are the "Study Assistant" on Kibloo, a playful learning platform.
You help children aged 2-12 and adults learn through games.
Always respond in English, concisely (2-4 sentences), friendly, encouraging.
If asked something off-topic, gently guide conversation back to learning.
If given user stats, provide personalized advice.
Don't give incorrect information. If unsure, say so.
Use emoji sparingly (1-2 per message).`;

export const AIService = {
  isConfigured() {
    return !!AI_API_URL;
  },

  async chat(messages, lang = "el", userContext = {}) {
    if (!this.isConfigured()) {
      return null;
    }

    const rate = checkRateLimit("chat");
    if (!rate.allowed) {
      const minutes = Math.ceil(rate.retryAfterMs / 60_000);
      return lang === "el"
        ? `🚦 Έφτασες στο όριο μηνυμάτων (${rate.reason}). Δοκίμασε ξανά σε ~${minutes} λεπτά.`
        : `🚦 You've hit the message limit (${rate.reason}). Try again in ~${minutes} min.`;
    }
    recordCall("chat");

    const systemPrompt = lang === "el" ? SYSTEM_PROMPT_EL : SYSTEM_PROMPT_EN;
    let contextNote = "";
    if (userContext.stats) {
      const s = userContext.stats;
      contextNote = lang === "el"
        ? `\n[Στατιστικά χρήστη: ${s.totalGamesPlayed} παιχνίδια, ${s.totalCorrect}/${s.totalAttempts} σωστές, Σερί: ${s.streak || 0} μέρες, Επίπεδο: ${s.level || 1}]`
        : `\n[User stats: ${s.totalGamesPlayed} games, ${s.totalCorrect}/${s.totalAttempts} correct, Streak: ${s.streak || 0} days, Level: ${s.level || 1}]`;
    }

    const apiMessages = [
      { role: "system", content: systemPrompt + contextNote },
      ...messages.slice(-10).map(m => ({
        role: m.from === "user" ? "user" : "assistant",
        content: m.text,
      })),
    ];

    try {
      if (AI_API_URL) {
        return await this._callProxy(apiMessages);
      }
      return null;
    } catch (err) {
      if (import.meta.env.DEV) console.warn("[AIService] Error:", err);
      return null;
    }
  },

  async _callProxy(messages) {
    const res = await fetch(AI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.reply || data.choices?.[0]?.message?.content || null;
  },

  /**
   * Generate a full lesson from a topic prompt.
   * Falls back to a deterministic local generator if no AI is configured.
   * Returns: { title, theory, examples[], exercises[], quiz[{question, options[], correctIdx, explanation}], worksheet[{question, answer}] }
   */
  async generateLesson({ topic, subject, ageGroup, difficulty = "medium", lang = "el" }) {
    if (this.isConfigured()) {
      const rate = checkRateLimit("lesson");
      if (!rate.allowed) {
        // Quietly fall through to local generator instead of erroring out.
        return _localLesson({ topic, subject, ageGroup, difficulty, lang });
      }
      recordCall("lesson");
      const prompt = lang === "el"
        ? `Δημιούργησε ΠΛΗΡΕΣ μάθημα στα Ελληνικά για παιδιά (ηλικία ${ageGroup || "-"}, δυσκολία ${difficulty}).
Θέμα: "${topic}". Μάθημα: ${subject || "-"}.
Επέστρεψε ΑΠΟΚΛΕΙΣΤΙΚΑ έγκυρο JSON, χωρίς άλλο κείμενο, με αυτή τη δομή:
{
  "title": "...",
  "theory": "Σύντομη θεωρία 4-8 προτάσεις σε απλή γλώσσα.",
  "examples": ["Παράδειγμα 1...", "Παράδειγμα 2...", "Παράδειγμα 3..."],
  "exercises": ["Άσκηση 1", "Άσκηση 2", "Άσκηση 3", "Άσκηση 4", "Άσκηση 5"],
  "quiz": [
    {"question": "Ερώτηση;", "options": ["A", "B", "C", "D"], "correctIdx": 0, "explanation": "Γιατί είναι αυτό σωστό"}
  ],
  "worksheet": [
    {"question": "...", "answer": "..."}
  ]
}
Δώσε 5 ασκήσεις, 5 quiz ερωτήσεις, και 8 worksheet items.`
        : `Generate a COMPLETE lesson in English for kids (age ${ageGroup || "-"}, difficulty ${difficulty}).
Topic: "${topic}". Subject: ${subject || "-"}.
Return ONLY valid JSON, no other text, with structure:
{
  "title": "...",
  "theory": "Short 4-8 sentences theory in simple language.",
  "examples": ["Example 1...", "Example 2...", "Example 3..."],
  "exercises": ["Exercise 1", "Exercise 2", "Exercise 3", "Exercise 4", "Exercise 5"],
  "quiz": [
    {"question": "Q?", "options": ["A","B","C","D"], "correctIdx": 0, "explanation": "Why correct"}
  ],
  "worksheet": [
    {"question": "...", "answer": "..."}
  ]
}
Give 5 exercises, 5 quiz questions, 8 worksheet items.`;
      try {
        const reply = await this._callProxy([
          { role: "system", content: lang === "el" ? "Είσαι ειδικός εκπαιδευτικός σχεδιαστής μαθημάτων. Επιστρέφεις πάντα έγκυρο JSON." : "You are an expert lesson designer. Always return valid JSON." },
          { role: "user", content: prompt },
        ]);
        if (reply) {
          // Extract JSON
          const m = reply.match(/\{[\s\S]*\}/);
          if (m) {
            try { return JSON.parse(m[0]); } catch {}
          }
        }
      } catch {}
    }
    // Fallback: local deterministic lesson
    return _localLesson({ topic, subject, ageGroup, difficulty, lang });
  },

  /**
   * Generate a short, age-appropriate story containing optional learning hooks
   * (e.g. embedded math facts). Falls back to a deterministic template when
   * no AI proxy is configured.
   *
   * @param {{ keywords?: string[], lang?: "el"|"en", ageGroup?: string,
   *           subject?: "math"|"science"|"language"|"general" }} opts
   * @returns {Promise<{ title: string, paragraphs: string[],
   *                     question?: { q: string, a: string } }>}
   */
  async generateStory({ keywords = [], lang = "el", ageGroup = "6-8", subject = "general" } = {}) {
    const rate = checkRateLimit("chat");
    if (rate.allowed && AI_API_URL) {
      const prompt = lang === "el"
        ? `Γράψε μια σύντομη ιστορία (~150 λέξεις) για παιδιά ${ageGroup} χρονών χρησιμοποιώντας τις λέξεις: ${keywords.join(", ")}. Μάθημα: ${subject}. Επιστροφή σε JSON: {"title": "...", "paragraphs": ["...", "..."], "question": {"q": "...", "a": "..."}}`
        : `Write a short story (~150 words) for children aged ${ageGroup} using the words: ${keywords.join(", ")}. Subject: ${subject}. Return as JSON: {"title": "...", "paragraphs": ["...", "..."], "question": {"q": "...", "a": "..."}}`;
      try {
        const reply = await this._callProxy([
          { role: "system", content: lang === "el" ? "Είσαι παιδικός συγγραφέας. Πάντα επιστρέφεις έγκυρο JSON." : "You are a kids' story writer. Always return valid JSON." },
          { role: "user", content: prompt },
        ]);
        if (reply) {
          const m = reply.match(/\{[\s\S]*\}/);
          if (m) {
            try { return JSON.parse(m[0]); } catch { /* fall through */ }
          }
        }
      } catch { /* fall through */ }
    }
    return _localStory({ keywords, lang, ageGroup, subject });
  },

  /**
   * Solve a math problem captured as an image. The image must be a base64
   * data URL (jpeg/png). Returns a step-by-step solution.
   *
   * NOTE: requires a vision-enabled AI proxy. If unavailable, returns a
   * helpful "feature unavailable" object so the UI can degrade gracefully.
   */
  async solveImage({ imageDataUrl, lang = "el" } = {}) {
    if (!imageDataUrl) return { ok: false, reason: "no_image" };
    const rate = checkRateLimit("lesson");
    if (!rate.allowed) return { ok: false, reason: "rate_limit", retryAfterMs: rate.retryAfterMs };
    if (!AI_API_URL) return { ok: false, reason: "not_configured" };

    try {
      // Vision payload: most providers accept image_url with data URLs
      const messages = [
        {
          role: "system",
          content: lang === "el"
            ? "Είσαι δάσκαλος μαθηματικών. Λύσε το πρόβλημα στην εικόνα βήμα-βήμα με απλά λόγια κατάλληλα για παιδιά. Επιστροφή σε JSON."
            : "You are a math teacher. Solve the problem in the image step by step in simple words for children. Return as JSON.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: lang === "el"
                ? 'Λύσε το με JSON: {"problem": "η άσκηση που βλέπεις", "steps": ["βήμα 1", ...], "answer": "τελική απάντηση"}'
                : 'Solve as JSON: {"problem": "the exercise you see", "steps": ["step 1", ...], "answer": "final answer"}' },
            { type: "image_url", image_url: { url: imageDataUrl } },
          ],
        },
      ];
      const reply = await this._callProxy(messages);
      recordCall("lesson");
      if (reply) {
        const m = reply.match(/\{[\s\S]*\}/);
        if (m) {
          try { return { ok: true, ...JSON.parse(m[0]) }; } catch { /* */ }
        }
        return { ok: true, problem: "?", steps: [reply], answer: "—" };
      }
    } catch (e) {
      console.warn("[AI] solveImage failed", e);
    }
    return { ok: false, reason: "ai_error" };
  },
};

// ── Local fallback story generator ──────────────────────────────────
// Deterministic template that mixes in the user-supplied keywords.
function _localStory({ keywords = [], lang = "el", ageGroup = "6-8" }) {
  const isEl = lang === "el";
  const k = keywords.length > 0 ? keywords : (isEl ? ["μαγικός", "δράκος", "κήπος"] : ["magic", "dragon", "garden"]);
  const [a, b, c] = [k[0] || "?", k[1] || "?", k[2] || "?"];
  const title = isEl ? `Η ιστορία του ${a}` : `The tale of ${a}`;
  const paragraphs = isEl ? [
    `Μια φορά κι έναν καιρό ζούσε ο/η ${a} σε ένα μέρος γεμάτο ${b}.`,
    `Κάθε πρωί έπαιρνε τον/την φίλο/η του/της ${c} και ξεκινούσαν για περιπέτεια.`,
    `Μια μέρα συνάντησαν ένα γρίφο: αν ο/η ${a} είχε 3 ${b} και βρήκε ακόμη 4, πόσα είχε συνολικά;`,
    `Με λίγη σκέψη βρήκαν την απάντηση και επέστρεψαν στο σπίτι, χαρούμενοι/ες ότι έλυσαν το μυστήριο.`,
  ] : [
    `Once upon a time there was ${a} in a place full of ${b}.`,
    `Every morning ${a} took friend ${c} and headed off on an adventure.`,
    `One day they met a riddle: if ${a} had 3 ${b} and found 4 more, how many in total?`,
    `After a moment of thought they found the answer and went home, happy they cracked the mystery.`,
  ];
  return {
    title,
    paragraphs,
    question: isEl
      ? { q: `Πόσα ${b} είχε συνολικά ο/η ${a};`, a: "7" }
      : { q: `How many ${b} did ${a} have in total?`, a: "7" },
    ageGroup,
  };
}

// ── Local fallback generator ─────────────────────────────────────────────
function _localLesson({ topic, subject, ageGroup, difficulty, lang }) {
  const L = (el, en) => (lang === "el" ? el : en);
  const isMath = /math|μαθ|αριθ|πρόσθ|αφαίρ|πολλαπλ|διαίρ|κλάσ|γεωμ/i.test(`${topic} ${subject || ""}`);
  const isLang = /γλώσσα|ορθογρ|γραμμ|λεξιλ|language|spelling|grammar|vocabulary/i.test(`${topic} ${subject || ""}`);

  const title = L(`Μάθημα: ${topic}`, `Lesson: ${topic}`);
  const theory = isMath
    ? L(
        `Σήμερα θα μάθουμε για: ${topic}. Πρόκειται για ένα βασικό κεφάλαιο των μαθηματικών. Θα δούμε τη βασική ιδέα, μερικά παραδείγματα, και θα κάνουμε εξάσκηση. Πάμε βήμα-βήμα και χωρίς άγχος.`,
        `Today we'll learn about: ${topic}. This is an important math topic. We'll cover the main idea, see examples, and practice. Step by step.`
      )
    : isLang
    ? L(
        `Στο μάθημα αυτό θα μάθουμε για: ${topic}. Θα δούμε τους κανόνες, παραδείγματα και θα γράψουμε ασκήσεις. Διάβασε προσεκτικά τη θεωρία πριν προχωρήσεις στις ασκήσεις.`,
        `In this lesson we'll learn about: ${topic}. We'll cover rules, examples, and practice exercises. Read the theory carefully before trying the exercises.`
      )
    : L(
        `Σήμερα θα μάθουμε για: ${topic}. Θα δούμε γενική εισαγωγή, παραδείγματα και ασκήσεις. Επιπέδου: ${ageGroup || "γενικό"}.`,
        `Today we'll learn about: ${topic}. General intro, examples, and exercises. Level: ${ageGroup || "general"}.`
      );

  // Examples
  const examples = [
    L(`Παράδειγμα 1: σκέψου το θέμα "${topic}" στην καθημερινή ζωή.`, `Example 1: think of "${topic}" in daily life.`),
    L(`Παράδειγμα 2: ένα απλό σενάριο που εφαρμόζεται.`, `Example 2: a simple scenario that applies.`),
    L(`Παράδειγμα 3: ένα παράδειγμα που μπορεί να σε μπερδέψει — προσοχή!`, `Example 3: a tricky example — be careful!`),
  ];

  // Exercises
  const exercises = Array.from({ length: 5 }, (_, i) =>
    L(`Άσκηση ${i + 1}: εξήγησε ή λύσε ένα πρόβλημα σχετικό με "${topic}".`,
      `Exercise ${i + 1}: explain or solve a problem related to "${topic}".`)
  );

  // Quiz
  const quiz = [];
  if (isMath) {
    for (let i = 0; i < 5; i++) {
      const a = 2 + Math.floor(Math.random() * 9);
      const b = 2 + Math.floor(Math.random() * 9);
      const correct = a + b;
      const opts = [correct, correct + 1, correct - 1, correct + 2].sort(() => Math.random() - 0.5);
      const correctIdx = opts.indexOf(correct);
      quiz.push({
        question: L(`Πόσο κάνει ${a} + ${b};`, `What is ${a} + ${b}?`),
        options: opts.map(String),
        correctIdx,
        explanation: L(`Πρόσθεσε ${a} και ${b}: ${a}+${b}=${correct}.`, `Add ${a} and ${b}: ${a}+${b}=${correct}.`),
      });
    }
  } else {
    for (let i = 0; i < 5; i++) {
      quiz.push({
        question: L(`Ερώτηση ${i + 1} σχετικά με "${topic}";`, `Question ${i + 1} about "${topic}"?`),
        options: [L("Σωστό", "Correct"), L("Λάθος", "Wrong"), L("Ίσως", "Maybe"), L("Δεν ξέρω", "Don't know")],
        correctIdx: 0,
        explanation: L(`Η σωστή απάντηση σχετίζεται με την κύρια ιδέα του "${topic}".`, `The correct answer relates to the main idea of "${topic}".`),
      });
    }
  }

  // Worksheet
  const worksheet = [];
  if (isMath) {
    for (let i = 0; i < 8; i++) {
      const a = 1 + Math.floor(Math.random() * 20);
      const b = 1 + Math.floor(Math.random() * 20);
      worksheet.push({ question: `${a} + ${b} = ___`, answer: String(a + b) });
    }
  } else {
    for (let i = 0; i < 8; i++) {
      worksheet.push({
        question: L(`Γράψε μια πρόταση για το "${topic}". (${i + 1})`, `Write a sentence about "${topic}". (${i + 1})`),
        answer: L("(Ανοιχτή απάντηση)", "(Open answer)"),
      });
    }
  }

  return { title, theory, examples, exercises, quiz, worksheet };
}
