import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { LanguageContext } from "../i18n/LanguageContext";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";

  return (
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <SEO title="404" />
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6 animate-bounce">🗺️</div>

        <h1
          className="text-6xl font-extrabold mb-4"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #db2777)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </h1>

        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
          {isEl ? "Ωπ! Χάθηκες;" : "Oops! Lost your way?"}
        </h2>

        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          {isEl
            ? "Η σελίδα που ψάχνεις δεν υπάρχει. Ας γυρίσουμε πίσω στα παιχνίδια!"
            : "The page you're looking for doesn't exist. Let's get back to the games!"}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-200 hover:-translate-y-0.5 transition-all"
          >
            {isEl ? "Αρχική σελίδα" : "Go home"}
          </button>
          <button
            onClick={() => { window.history.length > 1 ? navigate(-1) : navigate("/"); }}
            className="px-8 py-3 rounded-2xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:border-purple-400 hover:text-purple-700 dark:hover:text-purple-400 transition-all"
          >
            {isEl ? "Πίσω" : "Go back"}
          </button>
        </div>
      </div>
    </div>
  );
}
