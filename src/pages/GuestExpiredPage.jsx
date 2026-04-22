import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import SEO from "../components/SEO";

export default function GuestExpiredPage() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";

  return (
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <SEO title={isEl ? "Η δοκιμή έληξε" : "Trial ended"} />
      <div className="text-center max-w-md">
        <div className="text-7xl mb-6">⏰</div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-3">
          {isEl ? "Η δωρεάν δοκιμή έληξε!" : "Your free trial has ended!"}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          {isEl
            ? "Δημιούργησε δωρεάν λογαριασμό για να συνεχίσεις να παίζεις χωρίς όρια και να αποθηκεύσεις την πρόοδό σου."
            : "Create a free account to keep playing without limits and save your progress."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/auth?mode=register")}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-200 dark:shadow-purple-900/30 hover:-translate-y-0.5 transition-all"
          >
            {isEl ? "Εγγραφή δωρεάν" : "Sign up free"}
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="px-8 py-3 rounded-2xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:border-purple-400 hover:text-purple-700 dark:hover:text-purple-400 transition-all"
          >
            {isEl ? "Σύνδεση" : "Log in"}
          </button>
        </div>
        <button
          onClick={() => navigate("/")}
          className="mt-6 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          {isEl ? "← Αρχική σελίδα" : "← Go home"}
        </button>
      </div>
    </div>
  );
}
