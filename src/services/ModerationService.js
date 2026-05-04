/**
 * Client-side content moderation pipeline.
 *
 * Runs three layers of checks before letting user-generated content reach
 * the database:
 *
 *   1. Length / format validation       (cheap, deterministic)
 *   2. Profanity & disallowed-pattern   (regex against curated lists EL+EN)
 *   3. Heuristic spam detection         (URLs, ALL CAPS, repeated chars)
 *
 * Optional 4th layer: server-side moderation via a Cloud Function +
 * external API (Perspective, OpenAI moderation, Azure Content Safety).
 * The client API exposes `await ModerationService.check(text)` which
 * returns { ok, score, reasons[] } so callers don't have to know whether
 * the verdict was local or remote.
 */

// Curated bad-word lists. Keep these short and high-precision. The goal
// is to prevent the worst slurs and obviously inappropriate words from
// appearing in display names / classroom names. Full moderation belongs
// on the server.
const BANNED_EN = [
  // racial/ethnic slurs
  "nigger", "nigga", "chink", "spic", "kike", "wetback", "gook",
  // homophobic/transphobic slurs
  "faggot", "fag", "tranny", "dyke",
  // sexual / explicit
  "porn", "xxx", "milf", "blowjob", "handjob", "rape", "dildo",
  // generic profanity (mild filter — kid platform)
  "shit", "fuck", "bitch", "asshole", "cunt", "dick",
];

const BANNED_EL = [
  "γαμω", "γαμώ", "μαλακα", "μαλάκα", "πουσταρ", "πούστη", "πουτσος",
  "κωλος", "βυζι", "βυζί", "γκομενα", "γαμηση", "γαμήση", "πορνη",
  "πορνη", "πορνο", "πόρνο",
];

const SUSPICIOUS_DOMAINS = [
  // common spam / link-bait domains we don't want in user-set names
  "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly",
  ".onion",
];

// Heuristic patterns that aren't strictly profanity but suggest abuse.
const PATTERN_RULES = [
  { name: "phone_number", regex: /\+?\d[\d\s().-]{8,}/, severity: "medium" },
  { name: "email_address", regex: /[\w.+-]+@[\w-]+\.[\w.-]+/i, severity: "medium" },
  { name: "url", regex: /\bhttps?:\/\/\S+|\bwww\.\S+/i, severity: "medium" },
  { name: "all_caps", regex: /^[^a-zα-ω]*$/i, severity: "low", minLen: 8 },
  { name: "repeated_chars", regex: /(.)\1{5,}/, severity: "low" },
  { name: "leet_speak", regex: /[a@4][s\$5]{2,}h[o0][l1]e/i, severity: "high" },
];

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics so "πούστη" matches "πουστη"
    .replace(/[\s\W_]+/g, " ");
}

function containsBannedWord(text) {
  const norm = normalize(text);
  for (const w of BANNED_EN) {
    if (new RegExp(`\\b${w}\\b`, "i").test(norm)) return w;
  }
  for (const w of BANNED_EL) {
    if (new RegExp(w, "i").test(norm)) return w;
  }
  return null;
}

function containsSuspiciousDomain(text) {
  const lower = String(text || "").toLowerCase();
  for (const d of SUSPICIOUS_DOMAINS) {
    if (lower.includes(d)) return d;
  }
  return null;
}

const MAX_REMOTE_CHECKS_PER_MIN = 10;
const remoteCheckTimes = [];

function rateLimitRemote() {
  const now = Date.now();
  while (remoteCheckTimes.length && now - remoteCheckTimes[0] > 60_000) {
    remoteCheckTimes.shift();
  }
  if (remoteCheckTimes.length >= MAX_REMOTE_CHECKS_PER_MIN) return false;
  remoteCheckTimes.push(now);
  return true;
}

const REMOTE_API_URL = import.meta.env.VITE_MODERATION_API_URL || "";

async function callRemote(text) {
  if (!REMOTE_API_URL) return null;
  if (!rateLimitRemote()) return null;
  try {
    const res = await fetch(REMOTE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      ok: data.ok !== false && (data.score == null || data.score < 0.7),
      score: data.score ?? 0,
      categories: data.categories || {},
    };
  } catch {
    return null;
  }
}

export const ModerationService = {
  /**
   * Synchronous local check — fast, no network. Returns:
   *   { ok: boolean, severity: "low"|"medium"|"high", reasons: string[] }
   */
  checkLocal(text, opts = {}) {
    const reasons = [];
    let severity = "low";
    const str = String(text || "").trim();

    // Length / emptiness
    const minLen = opts.minLen ?? 1;
    const maxLen = opts.maxLen ?? 200;
    if (str.length < minLen) {
      return { ok: false, severity: "low", reasons: ["too_short"] };
    }
    if (str.length > maxLen) {
      return { ok: false, severity: "low", reasons: ["too_long"] };
    }

    const banned = containsBannedWord(str);
    if (banned) {
      reasons.push(`banned_word:${banned}`);
      severity = "high";
    }

    const susDomain = containsSuspiciousDomain(str);
    if (susDomain) {
      reasons.push(`suspicious_domain:${susDomain}`);
      severity = "high";
    }

    for (const rule of PATTERN_RULES) {
      if (rule.minLen && str.length < rule.minLen) continue;
      if (rule.regex.test(str)) {
        reasons.push(`pattern:${rule.name}`);
        if (rule.severity === "high") severity = "high";
        else if (rule.severity === "medium" && severity === "low") severity = "medium";
      }
    }

    return { ok: severity !== "high", severity, reasons };
  },

  /**
   * Async check that combines local + (optionally) a remote AI moderation
   * endpoint. Always returns the union of reasons.
   */
  async check(text, opts = {}) {
    const local = this.checkLocal(text, opts);
    if (!local.ok && local.severity === "high") return local;

    if (REMOTE_API_URL && opts.useRemote !== false) {
      const remote = await callRemote(text);
      if (remote && !remote.ok) {
        return {
          ok: false,
          severity: "high",
          reasons: [...local.reasons, "remote:flagged"],
          remoteScore: remote.score,
          categories: remote.categories,
        };
      }
    }

    return local;
  },

  /**
   * Sanitize: replace banned words with bullets so we can preserve
   * formatting elsewhere if a soft block is desired (e.g. chat preview).
   */
  sanitize(text) {
    let out = String(text || "");
    for (const w of [...BANNED_EN, ...BANNED_EL]) {
      out = out.replace(new RegExp(w, "gi"), "•".repeat(w.length));
    }
    return out;
  },

  /**
   * Quick boolean wrapper for code paths that only care about pass/fail.
   */
  async isClean(text, opts) {
    const r = await this.check(text, opts);
    return r.ok;
  },
};
