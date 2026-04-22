import React, { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { LanguageContext } from "../i18n/LanguageContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import LanguageSwitcher from "../components/i18n/LanguageSwitcher";
import SEO from "../components/SEO";

const FIREBASE_ERRORS = {
  el: {
    "auth/invalid-email": "Μη έγκυρη διεύθυνση email",
    "auth/user-disabled": "Ο λογαριασμός έχει απενεργοποιηθεί",
    "auth/user-not-found": "Δεν βρέθηκε λογαριασμός με αυτό το email",
    "auth/wrong-password": "Λάθος κωδικός πρόσβασης",
    "auth/email-already-in-use": "Αυτό το email χρησιμοποιείται ήδη",
    "auth/weak-password": "Ο κωδικός πρέπει να είναι τουλάχιστον 6 χαρακτήρες",
    "auth/too-many-requests": "Πολλές προσπάθειες. Δοκίμασε ξανά αργότερα",
    "auth/network-request-failed": "Σφάλμα δικτύου. Ελέγξε τη σύνδεσή σου",
    "auth/popup-closed-by-user": "Η σύνδεση ακυρώθηκε",
    "auth/invalid-credential": "Λάθος email ή κωδικός",
  },
  en: {
    "auth/invalid-email": "Invalid email address",
    "auth/user-disabled": "This account has been disabled",
    "auth/user-not-found": "No account found with this email",
    "auth/wrong-password": "Wrong password",
    "auth/email-already-in-use": "This email is already registered",
    "auth/weak-password": "Password must be at least 6 characters",
    "auth/too-many-requests": "Too many attempts. Try again later",
    "auth/network-request-failed": "Network error. Check your connection",
    "auth/popup-closed-by-user": "Sign-in was cancelled",
    "auth/invalid-credential": "Wrong email or password",
  },
};

function friendlyError(msg, lang) {
  if (!msg) return "";
  for (const [code, friendly] of Object.entries(FIREBASE_ERRORS[lang] || FIREBASE_ERRORS.en)) {
    if (msg.includes(code)) return friendly;
  }
  return msg;
}

const t = {
  el: {
    login: "Σύνδεση",
    register: "Δημιουργία Λογαριασμού",
    resetTitle: "Επαναφορά Κωδικού",
    email: "Email",
    password: "Κωδικός",
    confirmPassword: "Επιβεβαίωση Κωδικού",
    rememberMe: "Θυμήσου με",
    loginBtn: "Σύνδεση",
    registerBtn: "Εγγραφή",
    resetBtn: "Αποστολή Email Επαναφοράς",
    orDivider: "ή",
    googleBtn: "Συνέχεια με Google",
    emailBtn: "Συνέχεια με Email",
    noAccount: "Δεν έχεις λογαριασμό;",
    hasAccount: "Έχεις ήδη λογαριασμό;",
    forgotPassword: "Ξέχασες τον κωδικό;",
    rememberPassword: "Θυμήθηκες τον κωδικό;",
    backToLogin: "Πίσω στη σύνδεση",
    guestBtn: "Συνέχεια ως Επισκέπτης",
    welcomeBack: "Καλώς ήρθες πίσω!",
    welcomeNew: "Δημιούργησε λογαριασμό",
    welcomeSub: "Συνδέσου για να αποθηκεύσεις την πρόοδό σου",
    welcomeSubNew: "Εγγράψου για να ξεκινήσεις την περιπέτεια",
    resetSub: "Θα σου στείλουμε email για επαναφορά",
    passwordMismatch: "Οι κωδικοί δεν ταιριάζουν",
    passwordTooShort: "Ο κωδικός πρέπει να είναι τουλάχιστον 6 χαρακτήρες",
    resetSent: "Σου στείλαμε email για επαναφορά κωδικού!",
    features: [
      { icon: "🎮", text: "350+ εκπαιδευτικά παιχνίδια" },
      { icon: "📊", text: "Παρακολούθηση προόδου" },
      { icon: "🏆", text: "Βραβεία & πιστοποιητικά" },
      { icon: "👨‍👩‍👧‍👦", text: "Πίνακας γονέα" },
    ],
  },
  en: {
    login: "Sign In",
    register: "Create Account",
    resetTitle: "Reset Password",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    rememberMe: "Remember me",
    loginBtn: "Sign In",
    registerBtn: "Sign Up",
    resetBtn: "Send Reset Email",
    orDivider: "or",
    googleBtn: "Continue with Google",
    emailBtn: "Continue with Email",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    forgotPassword: "Forgot password?",
    rememberPassword: "Remember your password?",
    backToLogin: "Back to sign in",
    guestBtn: "Continue as Guest",
    welcomeBack: "Welcome back!",
    welcomeNew: "Create your account",
    welcomeSub: "Sign in to save your progress across devices",
    welcomeSubNew: "Join us to start your learning adventure",
    resetSub: "We'll send you an email to reset your password",
    passwordMismatch: "Passwords don't match",
    passwordTooShort: "Password must be at least 6 characters",
    resetSent: "We sent you a password reset email!",
    features: [
      { icon: "🎮", text: "350+ educational games" },
      { icon: "📊", text: "Progress tracking" },
      { icon: "🏆", text: "Badges & certificates" },
      { icon: "👨‍👩‍👧‍👦", text: "Parent dashboard" },
    ],
  },
};

export default function AuthPage() {
  const {
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    resetPassword,
    error: authError,
  } = useContext(AuthContext);
  const { lang } = useContext(LanguageContext);
  const l = t[lang] || t.en;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [resetSent, setResetSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const error = localError || authError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setIsLoading(true);

    try {
      if (mode === "reset") {
        const ok = await resetPassword(email);
        if (ok) setResetSent(true);
        setIsLoading(false);
        return;
      }

      if (mode === "register") {
        if (password.length < 6) {
          setLocalError(l.passwordTooShort);
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setLocalError(l.passwordMismatch);
          setIsLoading(false);
          return;
        }
        await registerWithEmail(email, password);
        navigate("/onboarding");
      } else {
        await loginWithEmail(email, password, rememberMe);
        navigate("/");
      }
    } catch {
      // error handled by AuthContext
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLocalError(null);
    setIsLoading(true);
    try {
      await loginWithGoogle();
      const hasProfile = localStorage.getItem("geo:userProfile");
      navigate(hasProfile ? "/" : "/onboarding");
    } catch {
      // error handled by AuthContext
    }
    setIsLoading(false);
  };

  const handleGuestContinue = () => {
    navigate("/guest-setup");
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setLocalError(null);
    setResetSent(false);
  };

  return (
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center p-4">
      <SEO title={l.login} />
      {/* Language switcher */}
      <div className="fixed top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Left panel - branding */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-600 p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />

          <div className="relative z-10">
            <div className="text-4xl mb-2">🎮</div>
            <h2 className="text-3xl font-bold mb-2">GeoLo Platform</h2>
            <p className="text-purple-200 text-sm">
              {lang === "el"
                ? "Εκπαιδευτική Πλατφόρμα Παιχνιδιών"
                : "Educational Gaming Platform"}
            </p>
          </div>

          <div className="relative z-10 space-y-4 my-8">
            {l.features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-2xl w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  {f.icon}
                </span>
                <span className="text-sm text-purple-100">{f.text}</span>
              </div>
            ))}
          </div>

          <div className="relative z-10">
            <p className="text-xs text-purple-300">
              {lang === "el"
                ? "Ασφαλές περιβάλλον για παιδιά 2-12 ετών"
                : "Safe environment for kids ages 2-12"}
            </p>
          </div>
        </div>

        {/* Right panel - form */}
        <div className="p-8 sm:p-10">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-6">
            <span className="text-4xl">🎮</span>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">GeoLo Platform</h2>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {mode === "reset"
                ? l.resetTitle
                : mode === "register"
                ? l.welcomeNew
                : l.welcomeBack}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {mode === "reset"
                ? l.resetSub
                : mode === "register"
                ? l.welcomeSubNew
                : l.welcomeSub}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-start gap-2">
              <span className="shrink-0 mt-0.5">⚠️</span>
              <span>{friendlyError(error, lang)}</span>
            </div>
          )}

          {/* Reset success */}
          {resetSent && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm flex items-start gap-2">
              <span className="shrink-0 mt-0.5">📩</span>
              <span>{l.resetSent}</span>
            </div>
          )}

          {/* Google login - show first for login/register */}
          {mode !== "reset" && (
            <>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-200 font-medium text-slate-700 dark:text-slate-200 disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                {l.googleBtn}
              </button>

              {/* Guest option */}
              <button
                type="button"
                onClick={handleGuestContinue}
                className="w-full mt-3 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-medium rounded-xl hover:border-purple-300 dark:hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>👤</span>
                {l.guestBtn}
              </button>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-600" />
                <span className="text-xs text-slate-400 dark:text-slate-500 uppercase font-medium">{l.orDivider}</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-600" />
              </div>
            </>
          )}

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{l.email}</label>
              <input
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/50 outline-none transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-white dark:bg-slate-700"
              />
            </div>

            {mode !== "reset" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{l.password}</label>
                <input
                  type="password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/50 outline-none transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-white dark:bg-slate-700"
                />
              </div>
            )}

            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{l.confirmPassword}</label>
                <input
                  type="password"
                  value={confirmPassword}
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/50 outline-none transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-white dark:bg-slate-700"
                />
              </div>
            )}

            {mode === "login" && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{l.rememberMe}</span>
                </label>
                <button
                  type="button"
                  onClick={() => switchMode("reset")}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                >
                  {l.forgotPassword}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
            >
              {isLoading && (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {mode === "reset"
                ? l.resetBtn
                : mode === "register"
                ? l.registerBtn
                : l.loginBtn}
            </button>
          </form>

          {/* Switch mode links */}
          <div className="mt-6 text-center text-sm">
            {mode === "reset" ? (
              <p className="text-slate-600 dark:text-slate-400">
                {l.rememberPassword}{" "}
                <button
                  onClick={() => switchMode("login")}
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
                >
                  {l.backToLogin}
                </button>
              </p>
            ) : mode === "register" ? (
              <p className="text-slate-600 dark:text-slate-400">
                {l.hasAccount}{" "}
                <button
                  onClick={() => switchMode("login")}
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
                >
                  {l.login}
                </button>
              </p>
            ) : (
              <p className="text-slate-600 dark:text-slate-400">
                {l.noAccount}{" "}
                <button
                  onClick={() => switchMode("register")}
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
                >
                  {l.register}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
