import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { SchoolService } from "../services/SchoolService";
import SEO from "../components/SEO";

const T = {
  el: {
    title: "👋 Καλωσήρθες!",
    subtitle: "Σύνδεση μαθητή με QR ή PIN",
    classCode: "Κωδικός τάξης",
    classCodePh: "π.χ. ABC123",
    pin: "PIN",
    pinPh: "4 ψηφία",
    login: "Σύνδεση",
    qrLogin: "🔍 Σαρώστε QR με την κάμερα",
    welcome: "Γειά σου,",
    continue: "Συνέχεια ➜",
    notFound: "Δεν βρέθηκε. Έλεγξε QR ή PIN.",
    loading: "...",
    logout: "Αποσύνδεση",
    backToLogin: "Πίσω στη σύνδεση",
  },
  en: {
    title: "👋 Welcome!",
    subtitle: "Student login with QR or PIN",
    classCode: "Class code",
    classCodePh: "e.g. ABC123",
    pin: "PIN",
    pinPh: "4 digits",
    login: "Login",
    qrLogin: "🔍 Scan QR with camera",
    welcome: "Hi",
    continue: "Continue ➜",
    notFound: "Not found. Check QR/PIN.",
    loading: "...",
    logout: "Log out",
    backToLogin: "Back to login",
  },
};

export default function KidLoginPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const navigate = useNavigate();
  const { code: qrCode } = useParams();

  const [classCode, setClassCode] = useState("");
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [student, setStudent] = useState(null);

  // Auto-login from QR code in URL
  useEffect(() => {
    if (!qrCode) return;
    (async () => {
      setBusy(true);
      try {
        const s = await SchoolService.findByQR(qrCode);
        if (s) {
          const cls = await SchoolService.getClass(s.classId);
          SchoolService.setKidSession(s, cls);
          setStudent({ ...s, _className: cls?.name });
        } else {
          setError(l.notFound);
        }
      } catch { setError(l.notFound); }
      setBusy(false);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrCode]);

  const handlePinLogin = async (e) => {
    e?.preventDefault();
    if (!classCode || !pin) return;
    setBusy(true); setError("");
    try {
      const s = await SchoolService.findByClassAndPin(classCode.toUpperCase(), pin);
      if (s) {
        const cls = await SchoolService.getClass(s.classId);
        SchoolService.setKidSession(s, cls);
        setStudent({ ...s, _className: cls?.name });
      } else {
        setError(l.notFound);
      }
    } catch { setError(l.notFound); }
    setBusy(false);
  };

  const handleContinue = () => navigate("/");

  if (student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-200 via-orange-200 to-rose-200 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center p-4">
        <SEO title={l.title} />
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl max-w-md w-full text-center space-y-4">
          <div className="text-9xl">{student.avatar || "👋"}</div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">{l.welcome} {student.name}!</h1>
          {student._className && <p className="text-slate-500">{student._className}</p>}
          <button onClick={handleContinue} className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xl font-extrabold shadow-lg hover:scale-[1.02] transition">
            {l.continue}
          </button>
          <button onClick={() => { SchoolService.clearKidSession(); setStudent(null); }} className="text-sm text-slate-400 hover:underline">
            {l.logout}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center p-4">
      <SEO title={l.title} />
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl max-w-md w-full space-y-5">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">{l.title}</h1>
          <p className="text-slate-500 mt-1">{l.subtitle}</p>
        </div>

        {busy ? (
          <p className="text-center text-slate-500">{l.loading}</p>
        ) : (
          <form onSubmit={handlePinLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">{l.classCode}</label>
              <input
                value={classCode}
                onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                placeholder={l.classCodePh}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white font-mono uppercase outline-none text-center text-lg tracking-widest"
                maxLength={20}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">{l.pin}</label>
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder={l.pinPh}
                inputMode="numeric"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white font-mono outline-none text-center text-3xl tracking-widest"
                maxLength={4}
                required
              />
            </div>

            {error && <p className="text-rose-600 font-bold text-sm text-center">⚠️ {error}</p>}

            <button type="submit" disabled={busy || !classCode || pin.length !== 4} className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg font-extrabold shadow-lg disabled:opacity-50">
              {l.login}
            </button>
          </form>
        )}

        <p className="text-xs text-center text-slate-400">{l.qrLogin}</p>
      </div>
    </div>
  );
}
