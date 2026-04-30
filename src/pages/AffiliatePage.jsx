import React, { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import QRCode from "../components/QRCode";
import { AffiliateService } from "../services/AffiliateService";

const T = {
  el: {
    title: "💼 Affiliate Πρόγραμμα",
    subtitle: "Σύστησε φίλους εκπαιδευτικούς στην πλατφόρμα και πάρε προμήθεια 30% από κάθε νέα συνδρομή!",
    needAuth: "Συνδέσου για να δεις τα στοιχεία σου.",
    yourCode: "Ο κωδικός σου",
    yourLink: "Το link σου",
    copy: "Αντιγραφή",
    copied: "Αντιγράφηκε!",
    share: "📤 Κοινοποίηση",
    yourStats: "Τα στατιστικά σου",
    referrals: "Συστάσεις",
    commission: "Προμήθεια",
    paid: "Πληρώθηκε",
    pending: "Σε αναμονή",
    paypalEmail: "PayPal Email (για πληρωμές)",
    paypalPh: "name@email.com",
    save: "Αποθήκευση",
    saved: "Αποθηκεύτηκε ✓",
    history: "Ιστορικό συστάσεων",
    noReferrals: "Δεν έχεις συστάσεις ακόμη.",
    statusSignup: "Εγγραφή",
    statusPending: "Σε αναμονή",
    statusApproved: "Εγκεκριμένη",
    statusPaid: "Πληρωμένη",
    howItWorks: "Πώς λειτουργεί;",
    step1: "1. Μοιράσου το link σου με συναδέλφους εκπαιδευτικούς",
    step2: "2. Όταν εγγραφούν & κάνουν συνδρομή, παίρνεις 30% του πρώτου μήνα",
    step3: "3. Λαμβάνεις τις πληρωμές μέσω PayPal κάθε μήνα (ελάχιστο €10)",
    rate: "Προμήθεια ανά νέα συνδρομή",
    monthly: "Μηνιαία",
    yearly: "Ετήσια",
    family: "Οικογενειακή",
    school: "Σχολική",
    qrCode: "QR Code για εκτύπωση",
    print: "🖨️ Εκτύπωση",
    earnings: "Συνολικά κέρδη",
  },
  en: {
    title: "💼 Affiliate Program",
    subtitle: "Refer fellow teachers to Kibloo and earn 30% commission on every new subscription!",
    needAuth: "Sign in to view your stats.",
    yourCode: "Your code",
    yourLink: "Your link",
    copy: "Copy",
    copied: "Copied!",
    share: "📤 Share",
    yourStats: "Your stats",
    referrals: "Referrals",
    commission: "Commission",
    paid: "Paid out",
    pending: "Pending",
    paypalEmail: "PayPal Email (for payouts)",
    paypalPh: "name@email.com",
    save: "Save",
    saved: "Saved ✓",
    history: "Referral history",
    noReferrals: "No referrals yet.",
    statusSignup: "Signup",
    statusPending: "Pending",
    statusApproved: "Approved",
    statusPaid: "Paid",
    howItWorks: "How it works",
    step1: "1. Share your link with teacher friends",
    step2: "2. When they sign up & subscribe, you earn 30% of their first month",
    step3: "3. We pay out monthly via PayPal (€10 minimum)",
    rate: "Commission per new subscription",
    monthly: "Monthly",
    yearly: "Yearly",
    family: "Family",
    school: "School",
    qrCode: "Printable QR code",
    print: "🖨️ Print",
    earnings: "Total earnings",
  },
};

export default function AffiliatePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const { user } = useContext(AuthContext) || {};
  const l = T[lang] || T.en;
  const navigate = useNavigate();

  const [aff, setAff] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [busy, setBusy] = useState(false);
  const [paypalInput, setPaypalInput] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    if (!user?.uid) return;
    setBusy(true);
    try {
      const a = await AffiliateService.getOrCreate(user.uid);
      setAff(a);
      setPaypalInput(a.paypalEmail || "");
      const refs = await AffiliateService.getReferrals(user.uid);
      setReferrals(refs);
    } catch (e) { /* ignore */ }
    setBusy(false);
  }, [user?.uid]);

  useEffect(() => { load(); }, [load]);

  const handleCopy = async () => {
    if (!aff) return;
    try { await navigator.clipboard.writeText(aff.link); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };

  const handleShare = async () => {
    if (!aff) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Kibloo — Where curiosity blooms",
          text: lang === "el" ? "Δοκίμασε αυτή την εκπαιδευτική πλατφόρμα!" : "Check out this educational platform!",
          url: aff.link,
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  const handleSavePaypal = async () => {
    if (!user?.uid) return;
    setBusy(true);
    try {
      await AffiliateService.update(user.uid, { paypalEmail: paypalInput });
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1500);
      await load();
    } catch (e) { alert(e.message); }
    setBusy(false);
  };

  if (!user?.uid) {
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-slate-900">
        <Navbar />
        <div className="pt-20 pb-12 px-4 text-center"><p className="text-slate-500 mt-20">{l.needAuth}</p></div>
      </div>
    );
  }

  const totalCommission = aff?.totalCommission || 0;
  const totalPaid = aff?.totalPaid || 0;
  const pending = totalCommission - totalPaid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={l.title} />
      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-3xl space-y-5">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white">{l.title}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{l.subtitle}</p>
          </div>

          {/* Code & Link */}
          {aff && (
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-2xl space-y-4">
              <div>
                <p className="text-xs font-bold opacity-80 uppercase tracking-wider">{l.yourCode}</p>
                <p className="text-3xl font-mono font-extrabold tracking-widest mt-1">{aff.code}</p>
              </div>
              <div>
                <p className="text-xs font-bold opacity-80 uppercase tracking-wider">{l.yourLink}</p>
                <p className="font-mono text-sm opacity-95 break-all mt-1 bg-white/10 rounded-lg p-2">{aff.link}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={handleCopy} className="px-4 py-2 rounded-lg bg-white text-emerald-700 font-bold text-sm shadow">
                  {copied ? l.copied : "🔗 " + l.copy}
                </button>
                <button onClick={handleShare} className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-sm border border-white/30">
                  {l.share}
                </button>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label={l.referrals} value={aff?.totalReferrals || 0} icon="👥" color="from-violet-400 to-fuchsia-500" />
            <Stat label={l.earnings} value={`€${totalCommission.toFixed(2)}`} icon="💰" color="from-emerald-400 to-teal-500" />
            <Stat label={l.pending} value={`€${pending.toFixed(2)}`} icon="⏳" color="from-amber-400 to-orange-500" />
            <Stat label={l.paid} value={`€${totalPaid.toFixed(2)}`} icon="✓" color="from-blue-400 to-indigo-500" />
          </div>

          {/* PayPal email */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-slate-800 dark:text-white mb-2">{l.paypalEmail}</h3>
            <div className="flex gap-2">
              <input value={paypalInput} onChange={(e) => setPaypalInput(e.target.value)} type="email" placeholder={l.paypalPh} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none" />
              <button onClick={handleSavePaypal} disabled={busy} className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-bold disabled:opacity-50">
                {savedFlash ? l.saved : l.save}
              </button>
            </div>
          </div>

          {/* Commission rates */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-slate-800 dark:text-white mb-3">{l.rate} (30%)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-sm">
              {Object.entries(AffiliateService.PRICE_BY_PLAN).map(([k, v]) => (
                <div key={k} className="bg-slate-50 dark:bg-slate-700/40 rounded-lg p-2">
                  <p className="text-xs text-slate-500 capitalize">{l[k] || k}</p>
                  <p className="font-bold text-emerald-600">€{(v * AffiliateService.COMMISSION_RATE).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* QR Code */}
          {aff && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 text-center">
              <h3 className="font-bold text-slate-800 dark:text-white mb-3">{l.qrCode}</h3>
              <div className="inline-block bg-white p-3 rounded-xl">
                <QRCode value={aff.link} size={180} />
              </div>
              <button onClick={() => window.print()} className="block mx-auto mt-3 px-4 py-2 rounded-lg bg-violet-500 text-white text-sm font-bold">
                {l.print}
              </button>
            </div>
          )}

          {/* History */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-slate-800 dark:text-white mb-3">{l.history}</h3>
            {referrals.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">{l.noReferrals}</p>
            ) : (
              <ul className="space-y-2">
                {referrals.map((r) => (
                  <li key={r.id} className="flex items-center justify-between text-sm gap-2 bg-slate-50 dark:bg-slate-700/40 rounded-lg px-3 py-2">
                    <span className="font-mono text-xs text-slate-500 truncate">{r.refereeUid?.slice(0, 10)}…</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-bold">{l["status_" + r.status] || r.status}</span>
                    {r.commission > 0 && <span className="font-bold text-emerald-600">€{r.commission.toFixed(2)}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* How it works */}
          <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-2xl p-5 text-cyan-800 dark:text-cyan-200 text-sm">
            <p className="font-bold mb-2">{l.howItWorks}</p>
            <p>{l.step1}</p>
            <p>{l.step2}</p>
            <p>{l.step3}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon, color }) {
  return (
    <div className={`relative rounded-2xl p-3 bg-gradient-to-br ${color} text-white shadow overflow-hidden`}>
      <div className="absolute -top-2 -right-2 text-4xl opacity-30">{icon}</div>
      <p className="text-[10px] font-bold uppercase tracking-wider opacity-90">{label}</p>
      <p className="text-xl font-extrabold mt-1">{value}</p>
    </div>
  );
}
