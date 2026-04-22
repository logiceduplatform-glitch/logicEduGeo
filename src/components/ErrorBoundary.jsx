import React from "react";
import { ErrorReportingService } from "../services/ErrorReportingService";

const TEXTS = {
  el: {
    title: "Ωχ! Κάτι πήγε στραβά",
    fallbackMsg: "Παρουσιάστηκε ένα απροσδόκητο σφάλμα.",
    retry: "Δοκίμασε ξανά",
    goHome: "Αρχική σελίδα",
  },
  en: {
    title: "Oops! Something went wrong",
    fallbackMsg: "An unexpected error occurred.",
    retry: "Try again",
    goHome: "Go home",
  },
};

export default class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    ErrorReportingService.captureException(error, {
      source: "ErrorBoundary",
      componentStack: errorInfo?.componentStack?.slice(0, 500),
    });
  }

  handleReset = () => this.setState({ hasError: false, error: null });

  render() {
    if (!this.state.hasError) return this.props.children;

    const lang = document.documentElement.lang === "el" ? "el" : "en";
    const t = TEXTS[lang];

    return (
      <div className="min-h-[300px] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {t.title}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {t.fallbackMsg}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={this.handleReset}
              className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
            >
              {t.retry}
            </button>
            <button
              onClick={() => { window.location.href = "/"; }}
              className="px-6 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:border-purple-400 transition-colors"
            >
              {t.goHome}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
