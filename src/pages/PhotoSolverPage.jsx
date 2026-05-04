import React, { useState, useContext, useRef } from "react";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { LanguageContext } from "../i18n/LanguageContext";
import { AIService } from "../services/AIService";

const T = {
  el: {
    title: "Λύστης Άσκησης",
    subtitle: "Φωτογράφισε ή ανέβασε άσκηση και πάρε εξήγηση βήμα-βήμα.",
    upload: "Επίλεξε φωτογραφία",
    take: "Τράβα φωτογραφία",
    solve: "Λύσε με AI",
    solving: "Σκέφτομαι...",
    notConfigured: "Το feature δεν έχει ρυθμιστεί ακόμη. Ζήτα από τον admin να ορίσει τον AI proxy.",
    rateLimit: "Ξεπέρασες το όριο για σήμερα. Δοκίμασε αύριο!",
    error: "Κάτι πήγε στραβά. Δοκίμασε ξανά.",
    problem: "Άσκηση",
    steps: "Βήματα λύσης",
    answer: "Απάντηση",
    privacy: "🔒 Η εικόνα στέλνεται μόνο στον AI για επεξεργασία. Δεν αποθηκεύεται.",
  },
  en: {
    title: "Photo Math Solver",
    subtitle: "Snap or upload an exercise and get a step-by-step solution.",
    upload: "Choose photo",
    take: "Take photo",
    solve: "Solve with AI",
    solving: "Thinking...",
    notConfigured: "Feature not configured yet. Ask the admin to set up the AI proxy.",
    rateLimit: "Daily limit reached. Try again tomorrow!",
    error: "Something went wrong. Please try again.",
    problem: "Problem",
    steps: "Solution steps",
    answer: "Answer",
    privacy: "🔒 Image is sent to the AI for processing only. It is not stored.",
  },
};

export default function PhotoSolverPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const fileRef = useRef(null);
  const cameraRef = useRef(null);
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [solving, setSolving] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setError("Image too large (max 4 MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageDataUrl(ev.target.result);
      setResult(null);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSolve = async () => {
    if (!imageDataUrl) return;
    setSolving(true);
    setError("");
    setResult(null);
    const res = await AIService.solveImage({ imageDataUrl, lang });
    setSolving(false);
    if (res.ok) {
      setResult(res);
    } else {
      const msg = {
        not_configured: l.notConfigured,
        rate_limit: l.rateLimit,
      }[res.reason] || l.error;
      setError(msg);
    }
  };

  return (
    <>
      <Navbar />
      <SEO title={l.title} description={l.subtitle} canonical="/photo-solver" />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">📷</div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{l.title}</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">{l.subtitle}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-5 mb-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl"
              >
                📁 {l.upload}
              </button>
              <button
                type="button"
                onClick={() => cameraRef.current?.click()}
                className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl"
              >
                📸 {l.take}
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />

            {imageDataUrl && (
              <>
                <img src={imageDataUrl} alt="exercise" className="w-full max-h-72 object-contain rounded-xl bg-slate-100 dark:bg-slate-900 mb-3" />
                <button
                  type="button"
                  onClick={handleSolve}
                  disabled={solving}
                  className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow disabled:opacity-50"
                >
                  {solving ? l.solving : l.solve}
                </button>
              </>
            )}

            {error && <div className="mt-3 text-sm text-rose-600 dark:text-rose-400">{error}</div>}
          </div>

          {result && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-5 space-y-4">
              {result.problem && (
                <div>
                  <div className="text-xs uppercase text-slate-500 dark:text-slate-400">{l.problem}</div>
                  <div className="text-base font-semibold text-slate-800 dark:text-slate-100 mt-1">{result.problem}</div>
                </div>
              )}
              {result.steps?.length > 0 && (
                <div>
                  <div className="text-xs uppercase text-slate-500 dark:text-slate-400 mb-2">{l.steps}</div>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300">
                    {result.steps.map((s, i) => <li key={i}>{s}</li>)}
                  </ol>
                </div>
              )}
              {result.answer && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
                  <div className="text-xs uppercase text-emerald-600 dark:text-emerald-400">{l.answer}</div>
                  <div className="text-lg font-extrabold text-emerald-900 dark:text-emerald-100 mt-1">{result.answer}</div>
                </div>
              )}
            </div>
          )}

          <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-6">{l.privacy}</p>
        </div>
      </main>
    </>
  );
}
