import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { AccessibilityService } from "../services/AccessibilityService";
import { SignLanguageService } from "../services/SignLanguageService";
import SignLanguageButton from "../components/SignLanguageButton";

const T = {
  el: {
    title: "♿ Προσβασιμότητα",
    subtitle: "Προσάρμοσε την εφαρμογή στις δικές σου ανάγκες. Ορισμένες επιλογές μπορεί να χρειαστούν ανανέωση σελίδας για πλήρες effect.",
    visual: "👁️ Όψη",
    motor: "✋ Κινητικότητα",
    audio: "🔊 Ήχος / Νοηματική",
    cognitive: "🧠 Νόηση & Εστίαση",
    dyslexia: "Mode για δυσλεξία",
    dyslexiaDesc: "Φόντο OpenDyslexic, μεγαλύτερα διαστήματα γραμμάτων.",
    largeText: "Μεγαλύτερο κείμενο",
    largeTextDesc: "Αυξάνει το βασικό μέγεθος γραμματοσειράς για καλύτερη αναγνωσιμότητα.",
    highContrast: "Υψηλή αντίθεση",
    highContrastDesc: "Μαύρο φόντο, λευκό κείμενο, κίτρινα κουμπιά. Ιδανικό για χαμηλή όραση.",
    colorBlind: "Λειτουργία Δαλτωνισμού",
    colorBlindDesc: "Προσαρμόζει τα χρώματα της σελίδας ώστε να διακρίνονται καλύτερα.",
    reducedMotion: "Λιγότερη κίνηση",
    reducedMotionDesc: "Απενεργοποιεί animations & transitions. Καλό για ίλιγγο/μηχανικές διαταραχές.",
    underlineLinks: "Υπογράμμιση συνδέσμων",
    underlineLinksDesc: "Όλοι οι σύνδεσμοι θα είναι πάντα υπογραμμισμένοι.",
    simplified: "Απλοποιημένο UI",
    simplifiedDesc: "Αφαιρεί διακοσμητικά στοιχεία (animations, εφέ).",
    signLanguage: "Νοηματική γλώσσα",
    signLanguageDesc: "Εμφανίζει κουμπιά 🤟 για βίντεο νοηματικής γλώσσας στις βασικές οδηγίες.",
    signLanguageType: "Είδος νοηματικής",
    reset: "Επαναφορά προεπιλογών",
    resetConfirm: "Να επαναφερθούν όλες οι ρυθμίσεις προσβασιμότητας;",
    back: "← Πίσω",
    on: "ΕΝΕΡΓΟ",
    off: "ΑΝΕΝΕΡΓΟ",
    preview: "Προεπισκόπηση",
    previewSign: "Δοκίμασε ένα βίντεο νοηματικής:",
    aboutTitle: "📖 Για την προσβασιμότητα",
    about1: "Το Kibloo σχεδιάζεται για να είναι προσιτό σε όλους τους μαθητές. Παρακαλώ διάλεξε ποιες ρυθμίσεις σε βοηθούν.",
    about2: "Όλες οι ρυθμίσεις αποθηκεύονται στη συσκευή σου και δεν συγχρονίζονται με τον λογαριασμό.",
    keyboardTitle: "⌨️ Συντομεύσεις πληκτρολογίου",
    keyboardHelp: "Πάτα Tab για περιήγηση, Enter για ενεργοποίηση, Esc για κλείσιμο.",
  },
  en: {
    title: "♿ Accessibility",
    subtitle: "Adjust the app to your needs. Some settings may require a page refresh for full effect.",
    visual: "👁️ Visual",
    motor: "✋ Motor",
    audio: "🔊 Audio / Sign",
    cognitive: "🧠 Cognitive",
    dyslexia: "Dyslexia mode",
    dyslexiaDesc: "OpenDyslexic font with wider letter spacing.",
    largeText: "Larger text",
    largeTextDesc: "Increases base font size for better readability.",
    highContrast: "High contrast",
    highContrastDesc: "Black background, white text, yellow buttons. Great for low vision.",
    colorBlind: "Color-blind mode",
    colorBlindDesc: "Re-maps page colors for better distinction.",
    reducedMotion: "Reduced motion",
    reducedMotionDesc: "Disables animations & transitions. Good for vestibular disorders.",
    underlineLinks: "Underline links",
    underlineLinksDesc: "All links will always be underlined.",
    simplified: "Simplified UI",
    simplifiedDesc: "Hides decorative elements (animations, effects).",
    signLanguage: "Sign language",
    signLanguageDesc: "Shows 🤟 buttons for sign-language videos on key instructions.",
    signLanguageType: "Sign language type",
    reset: "Reset to defaults",
    resetConfirm: "Reset all accessibility settings?",
    back: "← Back",
    on: "ON",
    off: "OFF",
    preview: "Preview",
    previewSign: "Try a sign language video:",
    aboutTitle: "📖 About accessibility",
    about1: "Kibloo is designed to be accessible to all learners. Please pick the settings that help you.",
    about2: "All settings are stored on your device and not synced to your account.",
    keyboardTitle: "⌨️ Keyboard shortcuts",
    keyboardHelp: "Press Tab to navigate, Enter to activate, Esc to close.",
  },
};

export default function AccessibilityPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState(() => AccessibilityService.getPrefs());
  const [signPrefs, setSignPrefs] = useState(() => SignLanguageService.getPrefs());

  useEffect(() => AccessibilityService.subscribe(setPrefs), []);

  const update = (k, v) => AccessibilityService.update({ [k]: v });

  const handleReset = () => {
    if (window.confirm(l.resetConfirm)) {
      AccessibilityService.reset();
    }
  };

  const updateSign = (k, v) => {
    const next = { ...signPrefs, [k]: v };
    setSignPrefs(next);
    SignLanguageService.setPrefs(next);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-fuchsia-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={l.title} />
      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-3xl space-y-5">
          <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:underline">{l.back}</button>

          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white">{l.title}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{l.subtitle}</p>
          </div>

          {/* Visual */}
          <Section title={l.visual}>
            <Toggle label={l.dyslexia} desc={l.dyslexiaDesc} value={prefs.dyslexia} onChange={(v) => update("dyslexia", v)} l={l} />
            <Toggle label={l.largeText} desc={l.largeTextDesc} value={prefs.largeText} onChange={(v) => update("largeText", v)} l={l} />
            <Toggle label={l.highContrast} desc={l.highContrastDesc} value={prefs.highContrast} onChange={(v) => update("highContrast", v)} l={l} />
            <Toggle label={l.underlineLinks} desc={l.underlineLinksDesc} value={prefs.underlineLinks} onChange={(v) => update("underlineLinks", v)} l={l} />

            <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-4">
              <p className="font-bold text-slate-800 dark:text-white">{l.colorBlind}</p>
              <p className="text-xs text-slate-500 mt-0.5">{l.colorBlindDesc}</p>
              <select
                value={prefs.colorBlindMode}
                onChange={(e) => update("colorBlindMode", e.target.value)}
                className="mt-2 w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none"
              >
                {AccessibilityService.COLORBLIND_MODES.map((m) => (
                  <option key={m.id} value={m.id}>{lang === "el" ? m.labelEl : m.labelEn}</option>
                ))}
              </select>

              <div className="mt-3 grid grid-cols-5 gap-1">
                {["#ef4444", "#f97316", "#eab308", "#10b981", "#3b82f6"].map((c) => (
                  <div key={c} className="h-6 rounded" style={{ background: c }} title={c} />
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 text-center">{l.preview}</p>
            </div>
          </Section>

          {/* Cognitive */}
          <Section title={l.cognitive}>
            <Toggle label={l.reducedMotion} desc={l.reducedMotionDesc} value={prefs.reducedMotion} onChange={(v) => update("reducedMotion", v)} l={l} />
            <Toggle label={l.simplified} desc={l.simplifiedDesc} value={prefs.simplifiedUI} onChange={(v) => update("simplifiedUI", v)} l={l} />
          </Section>

          {/* Audio / Sign */}
          <Section title={l.audio}>
            <Toggle label={l.signLanguage} desc={l.signLanguageDesc} value={prefs.signLanguage} onChange={(v) => update("signLanguage", v)} l={l} />

            {prefs.signLanguage && (
              <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-4">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">{l.signLanguageType}</label>
                <select
                  value={signPrefs.language}
                  onChange={(e) => updateSign("language", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none"
                >
                  {SignLanguageService.LANGUAGES.map((sl) => (
                    <option key={sl.id} value={sl.id}>{sl.flag} {sl.label}</option>
                  ))}
                </select>

                <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span>{l.previewSign}</span>
                  <SignLanguageButton signKey="hello" label="Hello" />
                  <SignLanguageButton signKey="play" label="Play" />
                  <SignLanguageButton signKey="thank_you" label="Thank you" />
                </div>
              </div>
            )}
          </Section>

          {/* Reset */}
          <button onClick={handleReset} className="w-full py-3 rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-bold border border-rose-200 dark:border-rose-800">
            🔄 {l.reset}
          </button>

          {/* About */}
          <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-4 text-sm text-violet-800 dark:text-violet-200 space-y-2">
            <p className="font-bold">{l.aboutTitle}</p>
            <p>{l.about1}</p>
            <p>{l.about2}</p>
            <hr className="border-violet-200 dark:border-violet-800" />
            <p className="font-bold">{l.keyboardTitle}</p>
            <p>{l.keyboardHelp}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 space-y-3">
      <h2 className="font-extrabold text-slate-800 dark:text-white text-lg">{title}</h2>
      {children}
    </section>
  );
}

function Toggle({ label, desc, value, onChange, l }) {
  return (
    <div className="flex items-start justify-between gap-4 bg-slate-50 dark:bg-slate-700/40 rounded-xl p-4">
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-800 dark:text-white">{label}</p>
        {desc && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>}
      </div>
      <button
        role="switch"
        aria-checked={!!value}
        aria-label={label}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full transition ${value ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`}
      >
        <span className={`absolute top-1 left-1 h-5 w-5 bg-white rounded-full shadow transition ${value ? "translate-x-5" : ""}`} />
        <span className="sr-only">{value ? l.on : l.off}</span>
      </button>
    </div>
  );
}
