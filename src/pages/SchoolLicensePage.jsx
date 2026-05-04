import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { SchoolLicenseService } from "../services/SchoolLicenseService";

const T = {
  el: {
    title: "Σχολική Άδεια",
    subtitle: "Εισήγαγε τον κωδικό άδειας του σχολείου σου για να ξεκλειδώσεις Premium για όλους τους μαθητές.",
    placeholder: "KIBL-XXXX-XXXX",
    activate: "Ενεργοποίηση",
    activating: "Ενεργοποίηση...",
    success: "Επιτυχής ενεργοποίηση! Καλώς ήρθες στην {school}.",
    notFound: "Άκυρος ή ληγμένος κωδικός.",
    capacity: "Η άδεια έφτασε στο μέγιστο αριθμό μελών.",
    authRequired: "Πρέπει να συνδεθείς πρώτα.",
    error: "Κάτι πήγε στραβά. Δοκίμασε ξανά.",
    contact: "Δεν έχεις άδεια; Επικοινώνησε για bulk pricing:",
    pricingTitle: "Πλάνα Σχολείων",
    perYear: "/έτος",
    students: "μαθητές",
    contactSales: "Επικοινωνία πωλήσεων",
    haveLicense: "Ήδη έχεις ενεργή άδεια:",
    deactivate: "Αποσύνδεση",
  },
  en: {
    title: "School License",
    subtitle: "Enter your school's license key to unlock Premium for all students.",
    placeholder: "KIBL-XXXX-XXXX",
    activate: "Activate",
    activating: "Activating...",
    success: "Activated! Welcome to {school}.",
    notFound: "Invalid or expired key.",
    capacity: "License has reached its maximum members.",
    authRequired: "You need to sign in first.",
    error: "Something went wrong. Please try again.",
    contact: "Don't have a license? Contact us for bulk pricing:",
    pricingTitle: "School Plans",
    perYear: "/year",
    students: "students",
    contactSales: "Contact sales",
    haveLicense: "You already have an active license:",
    deactivate: "Disconnect",
  },
};

export default function SchoolLicensePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const { user } = useContext(AuthContext) || {};
  const l = T[lang] || T.en;
  const navigate = useNavigate();

  const [key, setKey] = useState("");
  const [status, setStatus] = useState("idle"); // idle | working | success | error
  const [message, setMessage] = useState("");
  const [active, setActive] = useState(() => SchoolLicenseService.getLocalLicense());

  const handleActivate = async (e) => {
    e?.preventDefault?.();
    if (!user) {
      setStatus("error");
      setMessage(l.authRequired);
      return;
    }
    setStatus("working");
    const res = await SchoolLicenseService.activate(key);
    if (res.ok) {
      setStatus("success");
      setMessage(l.success.replace("{school}", res.license.schoolName || "—"));
      setActive(SchoolLicenseService.getLocalLicense());
      setTimeout(() => navigate("/"), 2500);
    } else {
      setStatus("error");
      const msgMap = {
        not_found: l.notFound,
        capacity: l.capacity,
        auth_required: l.authRequired,
      };
      setMessage(msgMap[res.reason] || l.error);
    }
  };

  const handleDisconnect = () => {
    SchoolLicenseService.clearLocalLicense();
    setActive(null);
  };

  return (
    <>
      <Navbar />
      <SEO title={l.title} description={l.subtitle} canonical="/school-license" />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 py-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🏫</div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{l.title}</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">{l.subtitle}</p>
          </div>

          {active ? (
            <div className="bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl p-6 mb-6">
              <div className="text-sm text-emerald-700 dark:text-emerald-300">{l.haveLicense}</div>
              <div className="font-extrabold text-xl text-emerald-900 dark:text-emerald-100">{active.schoolName}</div>
              <div className="text-xs text-emerald-700 dark:text-emerald-400 font-mono mt-1">{active.key}</div>
              <button
                type="button"
                onClick={handleDisconnect}
                className="mt-3 text-xs px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
              >
                {l.deactivate}
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleActivate}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 mb-8 border border-slate-200 dark:border-slate-700"
            >
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value.toUpperCase())}
                placeholder={l.placeholder}
                className="w-full px-4 py-3 text-lg font-mono border-2 border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-indigo-400"
                maxLength={14}
                disabled={status === "working" || status === "success"}
              />
              <button
                type="submit"
                disabled={!key || status === "working" || status === "success"}
                className="w-full mt-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl shadow disabled:opacity-50 hover:from-indigo-700 hover:to-blue-700 active:scale-95 transition-all"
              >
                {status === "working" ? l.activating : l.activate}
              </button>
              {message && (
                <div
                  className={`mt-3 text-sm text-center font-semibold ${
                    status === "success"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {message}
                </div>
              )}
            </form>
          )}

          {/* Pricing tiers */}
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">{l.pricingTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {SchoolLicenseService.TIERS.map((t) => (
              <div
                key={t.id}
                className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4"
              >
                <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{t.id}</div>
                <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                  {t.priceEur === 0 ? "—" : `€${t.priceEur}`}
                  <span className="text-sm font-normal text-slate-500 dark:text-slate-400">{l.perYear}</span>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {t.maxStudents === Infinity ? "∞" : `έως ${t.maxStudents}`} {l.students}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            {l.contact}{" "}
            <a
              href="mailto:schools@kibloo.app"
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              schools@kibloo.app
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
