// Validator για quiz datasets — only outputs in development
const isDev = import.meta.env.DEV;
const log = {
  error: (...args) => isDev && console.error(...args),
  warn: (...args) => isDev && console.warn(...args),
  group: (...args) => isDev && console.group(...args),
  groupCollapsed: (...args) => isDev && console.groupCollapsed(...args),
  groupEnd: () => isDev && console.groupEnd(),
  table: (...args) => isDev && console.table(...args),
};

function norm(s) {
  return String(s ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^\p{Letter}\p{Number}]/gu, '');
}

function pickText(obj, lang = 'el') {
  if (obj == null) return undefined;
  if (typeof obj === 'string') return obj;
  if (Array.isArray(obj)) return obj; // για options που είναι σκέτο array
  return obj[lang] ?? obj['en'] ?? obj['el'] ?? undefined;
}

function getOptions(q, lang = 'el') {
  let opts = pickText(q?.options, lang);
  if (!opts && q?.options && typeof q.options === 'object' && !Array.isArray(q.options)) {
    const maybe = q.options['el'] ?? q.options['en'];
    if (Array.isArray(maybe)) opts = maybe;
  }
  return Array.isArray(opts) ? opts : [];
}

function getQuestionText(q, lang = 'el') {
  const t = pickText(q?.question, lang);
  return typeof t === 'string' ? t : '';
}

function getCorrect(q, lang = 'el') {
  const c = pickText(q?.correct, lang);
  return typeof c === 'string' ? c : undefined;
}

function plural(n, one, many) {
  return n === 1 ? one : many;
}

/**
 * @param {Array} dataset - array ερωτήσεων
 * @param {Object} options
 * @param {string} options.expectedCategory - π.χ. 'LogicMath'
 * @param {string} [options.name] - φιλικό όνομα για τις εκτυπώσεις
 * @param {string} [options.lang='el']
 * @returns {{ ok: boolean, errors: number, warnings: number, stats: object }}
 */
export function validateDataset(dataset, { expectedCategory, name, lang = 'el' } = {}) {
  const label = name || expectedCategory || 'Dataset';
  const seenIds = new Set();
  let errors = 0;
  let warnings = 0;

  const diffCount = { easy: 0, medium: 0, hard: 0, unknown: 0 };
  let emptyOptions = 0;
  let missingCorrect = 0;
  let correctNotInOptions = 0;
  let categoryMismatch = 0;
  let missingExplanation = 0;

  dataset.forEach((q, idx) => {
    // id
    if (!q?.id || typeof q.id !== 'string') {
      log.error(`[${label}] #${idx}: Missing or invalid id`, q);
      errors++;
    } else if (seenIds.has(q.id)) {
      log.error(`[${label}] Duplicate id: ${q.id}`);
      errors++;
    } else {
      seenIds.add(q.id);
    }

    // category
    if (expectedCategory && norm(q?.category) !== norm(expectedCategory)) {
      log.warn(
        `[${label}] ${q?.id || `#${idx}`} category mismatch:`,
        q?.category,
        '≠',
        expectedCategory
      );
      warnings++;
      categoryMismatch++;
    }

    // difficulty
    const d = q?.difficulty;
    if (d !== 'easy' && d !== 'medium' && d !== 'hard') {
      diffCount.unknown++;
      log.warn(`[${label}] ${q?.id || `#${idx}`} unknown difficulty:`, d);
      warnings++;
    } else {
      diffCount[d]++;
    }

    // question text
    const qt = getQuestionText(q, lang);
    if (!qt) {
      log.warn(`[${label}] ${q?.id || `#${idx}`} empty question text for lang=${lang}`);
      warnings++;
    }

    // options
    const opts = getOptions(q, lang);
    if (!opts.length) {
      log.warn(`[${label}] ${q?.id || `#${idx}`} has no options for lang=${lang}`);
      warnings++;
      emptyOptions++;
    }

    // correct
    const corr = getCorrect(q, lang);
    if (!corr) {
      log.warn(`[${label}] ${q?.id || `#${idx}`} missing correct answer for lang=${lang}`);
      warnings++;
      missingCorrect++;
    } else if (opts.length && !opts.includes(corr)) {
      log.warn(
        `[${label}] ${q?.id || `#${idx}`} correct not in options: "${corr}" not in [${opts.join(
          ', '
        )}]`
      );
      warnings++;
      correctNotInOptions++;
    }

    // explanation
    const expl = q?.explanation;
    if (!expl) {
      missingExplanation++;
    } else if (typeof expl === 'object' && (!expl.en || !expl.el)) {
      log.warn(`[${label}] ${q?.id || `#${idx}`} explanation missing en or el`);
      warnings++;
      missingExplanation++;
    }
  });

  const stats = {
    total: dataset.length,
    difficulties: diffCount,
    emptyOptions,
    missingCorrect,
    correctNotInOptions,
    categoryMismatch,
    missingExplanation,
    uniqueIds: seenIds.size
  };

  const ok = errors === 0;

  // Συνοπτικό report
  const header = ok ? `✅ ${label} OK` : `❌ ${label} HAS ISSUES`;
  log.groupCollapsed(`${header} — ${dataset.length} ${plural(dataset.length, 'question', 'questions')}`);
  log.table(stats);
  if (!ok) log.warn(`Errors: ${errors}, Warnings: ${warnings}`);
  log.groupEnd();

  return { ok, errors, warnings, stats };
}

/**
 * Επικύρωση πολλών datasets με ένα κάλεσμα.
 * @param {Record<string,Array>} sources - { LogicMath: questionsLogicMath, ... }
 * @param {string} [lang='el']
 */
export function validateAllDatasets(sources, lang = 'el') {
  log.group('%cQuiz Datasets Validation', 'color:#0ea5e9;font-weight:700;');
  const results = {};
  for (const [cat, data] of Object.entries(sources)) {
    results[cat] = validateDataset(data || [], { expectedCategory: cat, name: cat, lang });
  }
  log.groupEnd();
  return results;
}