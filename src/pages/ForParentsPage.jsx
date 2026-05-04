import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import SEO from "../components/SEO";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";

const PROMISES = {
  el: [
    {
      icon: "🔒",
      title: "100% ασφαλές",
      desc: "Χωρίς διαφημίσεις, χωρίς εξωτερικούς συνδέσμους, χωρίς ακατάλληλο περιεχόμενο. Σχεδιασμένο με kidSAFE standards.",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      icon: "📊",
      title: "Γονικός πίνακας ελέγχου",
      desc: "Δείτε ακριβώς τι έπαιξε, πόσο χρόνο αφιέρωσε, τι σκορ πήρε και πού δυσκολεύτηκε — σε πραγματικό χρόνο.",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: "⏱️",
      title: "Όριο χρόνου οθόνης",
      desc: "Ρυθμίστε πόση ώρα μπορεί να παίζει το παιδί ανά ημέρα. Αυτόματη ειδοποίηση όταν τελειώσει ο χρόνος.",
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-900/20",
    },
    {
      icon: "👶",
      title: "Πολλαπλά παιδικά προφίλ",
      desc: "Προσθέστε ξεχωριστά προφίλ για κάθε παιδί. Κάθε ένα έχει τη δική του ηλικία, πρόοδο και αποτελέσματα.",
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-900/20",
    },
    {
      icon: "🔐",
      title: "PIN γονέα",
      desc: "Προστατέψτε τις ρυθμίσεις σας με 4ψήφιο PIN. Τα παιδιά δεν μπορούν να αλλάξουν τίποτα χωρίς αυτό.",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      icon: "📋",
      title: "Εβδομαδιαίες αναφορές",
      desc: "Λεπτομερής αναφορά κάθε εβδομάδα: πόσα παιχνίδια, μέσος όρος, βελτίωση, αδύναμα σημεία.",
      color: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-50 dark:bg-cyan-900/20",
    },
  ],
  en: [
    {
      icon: "🔒",
      title: "100% safe",
      desc: "No ads, no external links, no inappropriate content. Designed with kidSAFE standards.",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      icon: "📊",
      title: "Parent dashboard",
      desc: "See exactly what they played, how much time they spent, their scores, and where they struggled — in real time.",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: "⏱️",
      title: "Screen time limits",
      desc: "Set how much time your child can play per day. Automatic notification when time is up.",
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-900/20",
    },
    {
      icon: "👶",
      title: "Multiple child profiles",
      desc: "Add separate profiles for each child. Each has their own age, progress, and results.",
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-900/20",
    },
    {
      icon: "🔐",
      title: "Parent PIN",
      desc: "Protect your settings with a 4-digit PIN. Kids can't change anything without it.",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      icon: "📋",
      title: "Weekly reports",
      desc: "Detailed weekly report: games played, averages, improvement, weak areas.",
      color: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-50 dark:bg-cyan-900/20",
    },
  ],
};

const BENEFITS = {
  el: [
    { icon: "📱", text: "Παίζει σε κάθε συσκευή — tablet, κινητό, υπολογιστή" },
    { icon: "🔊", text: "Ηχητικές οδηγίες για παιδιά που δεν διαβάζουν ακόμα" },
    { icon: "⏰", text: "5-10 λεπτά αρκούν — ιδανικό για κάθε στιγμή" },
    { icon: "🎓", text: "Χωρίς δάσκαλο, χωρίς ωράριο — μαθαίνει στον ρυθμό του" },
    { icon: "🏆", text: "Badges, XP, certificates — κίνητρο χωρίς πίεση" },
    { icon: "💰", text: "Δωρεάν βασική πλατφόρμα — 350+ παιχνίδια χωρίς πληρωμή" },
  ],
  en: [
    { icon: "📱", text: "Works on any device — tablet, phone, computer" },
    { icon: "🔊", text: "Voice instructions for kids who can't read yet" },
    { icon: "⏰", text: "5-10 minutes is enough — perfect for any moment" },
    { icon: "🎓", text: "No tutor, no schedule — learns at their own pace" },
    { icon: "🏆", text: "Badges, XP, certificates — motivation without pressure" },
    { icon: "💰", text: "Free core platform — 350+ games with no payment" },
  ],
};

const TESTIMONIALS = {
  el: [
    {
      text: "Το screen time guilt εξαφανίστηκε! Ξέρω ότι το παιδί μου μαθαίνει κάτι χρήσιμο.",
      name: "Κατερίνα Μ.",
      role: "Μαμά 2 παιδιών (5 & 8 ετών)",
    },
    {
      text: "Ο γιος μου ζητάει μόνος του να παίξει 'εκπαιδευτικά'. Αυτό δεν έχει ξαναγίνει!",
      name: "Δημήτρης Α.",
      role: "Μπαμπάς (7 ετών)",
    },
    {
      text: "Το parent dashboard είναι φανταστικό. Βλέπω ακριβώς πού χρειάζεται βοήθεια.",
      name: "Σοφία Κ.",
      role: "Μαμά (6 ετών)",
    },
  ],
  en: [
    {
      text: "The screen time guilt disappeared! I know my child is learning something useful.",
      name: "Katherine M.",
      role: "Mom of 2 kids (5 & 8 years old)",
    },
    {
      text: "My son asks to play 'educational games' on his own. That's never happened before!",
      name: "James A.",
      role: "Dad (7 years old)",
    },
    {
      text: "The parent dashboard is amazing. I can see exactly where they need help.",
      name: "Sophie K.",
      role: "Mom (6 years old)",
    },
  ],
};

export default function ForParentsPage() {
  const { lang } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isEl = lang === "el";
  const l = isEl ? "el" : "en";
  const promises = PROMISES[l];
  const benefits = BENEFITS[l];
  const testimonials = TESTIMONIALS[l];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <SEO
        title={isEl ? "Για Γονείς" : "For Parents"}
        description={isEl
          ? "Ασφαλές, χωρίς διαφημίσεις εκπαιδευτικό περιβάλλον. Παρακολουθήστε την πρόοδο του παιδιού σας σε πραγματικό χρόνο."
          : "Safe, ad-free educational environment. Track your child's progress in real time."}
      />
      <Navbar />

      {/* HERO */}
      <section className="pt-24 pb-16 sm:pt-28 sm:pb-20 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 text-[120px]">👨‍👩‍👧‍👦</div>
          <div className="absolute bottom-10 right-10 text-[100px]">🛡️</div>
          <div className="absolute top-40 right-40 text-[80px]">❤️</div>
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-semibold mb-6 backdrop-blur">
            {isEl ? "Για Γονείς" : "For Parents"}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            {isEl ? (
              <>Παιδιά που μαθαίνουν,<br /><span className="text-amber-300">γονείς που ξεκουράζονται</span></>
            ) : (
              <>Kids who learn,<br /><span className="text-amber-300">parents who relax</span></>
            )}
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            {isEl
              ? "Screen time που αξίζει. 350+ εκπαιδευτικά παιχνίδια σε ασφαλές περιβάλλον, χωρίς διαφημίσεις, με πλήρη γονικό έλεγχο."
              : "Screen time that's worth it. 350+ educational games in a safe environment, ad-free, with full parental controls."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(user ? "/parent-dashboard" : "/auth")}
              className="px-8 py-4 rounded-2xl bg-white text-emerald-700 font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
            >
              {isEl
                ? (user ? "Γονικός Πίνακας" : "Ξεκινήστε Δωρεάν")
                : (user ? "Parent Dashboard" : "Get Started Free")}
            </button>
            <button
              onClick={() => navigate("/guest-setup")}
              className="px-8 py-4 rounded-2xl border-2 border-white/40 text-white font-bold text-lg hover:bg-white/10 transition-all"
            >
              {isEl ? "Δοκιμάστε ως Επισκέπτης" : "Try as Guest"}
            </button>
          </div>
        </div>
      </section>

      {/* TRUST NUMBERS */}
      <section className="py-12 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
        <div className="mx-auto max-w-4xl px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { val: "0", label: isEl ? "Διαφημίσεις" : "Ads" },
            { val: "350+", label: isEl ? "Παιχνίδια" : "Games" },
            { val: "2-12", label: isEl ? "Ηλικίες" : "Ages" },
            { val: "100%", label: isEl ? "Ασφαλές" : "Safe" },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{s.val}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PARENT PROMISES */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">
              {isEl ? "Τι σας εγγυόμαστε" : "Our promise to you"}
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              {isEl
                ? "Κάθε feature σχεδιάστηκε σκεπτόμενοι πρώτα τους γονείς."
                : "Every feature was designed with parents in mind first."}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {promises.map((p, i) => (
              <div
                key={i}
                className={`group rounded-2xl p-6 ${p.bg} border border-slate-100 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                <span className={`text-3xl block mb-4 group-hover:scale-110 transition-transform duration-300`}>{p.icon}</span>
                <h3 className={`font-bold text-base mb-2 ${p.color}`}>{p.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY PARENTS LOVE IT */}
      <section className="py-16 sm:py-20 bg-emerald-50 dark:bg-slate-800/50">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-12 text-center">
            {isEl ? "Γιατί οι γονείς το λατρεύουν" : "Why parents love it"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3 bg-white dark:bg-slate-800 rounded-xl p-4 border border-emerald-100 dark:border-slate-700 shadow-sm">
                <span className="text-2xl shrink-0">{b.icon}</span>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-12 text-center">
            {isEl ? "Τι λένε οι γονείς" : "What parents say"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="text-emerald-400 mb-3 text-3xl">"</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 italic">{t.text}</p>
                <div>
                  <div className="font-bold text-slate-800 dark:text-white text-sm">{t.name}</div>
                  <div className="text-xs text-slate-400">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="py-16 sm:py-20 bg-white dark:bg-slate-800">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-10 text-center">
            {isEl ? "Screen time: Πριν vs Μετά" : "Screen time: Before vs After"}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 p-5 border border-red-100 dark:border-red-800/40">
              <div className="text-xl font-bold text-red-600 dark:text-red-400 mb-3">
                {isEl ? "❌ Πριν" : "❌ Before"}
              </div>
              <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
                {(isEl
                  ? ["Παθητική παρακολούθηση βίντεο", "Ενοχές για screen time", "Δεν ξέρω τι βλέπει", "Αυξανόμενη εξάρτηση", "Χαμένος χρόνος"]
                  : ["Passive video watching", "Screen time guilt", "No idea what they see", "Growing dependency", "Wasted time"]
                ).map((t, i) => <li key={i} className="flex items-start gap-2"><span className="shrink-0 mt-0.5">•</span>{t}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 p-5 border border-emerald-100 dark:border-emerald-800/40">
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-3">
                {isEl ? "✅ Μετά" : "✅ After"}
              </div>
              <ul className="space-y-2 text-sm text-emerald-700 dark:text-emerald-300">
                {(isEl
                  ? ["Ενεργή μάθηση μέσω παιχνιδιών", "Screen time χωρίς ενοχές", "Πλήρης εποπτεία & αναφορές", "Κίνητρο & αυτοπεποίθηση", "Ουσιαστική πρόοδος"]
                  : ["Active learning through games", "Screen time without guilt", "Full oversight & reports", "Motivation & confidence", "Meaningful progress"]
                ).map((t, i) => <li key={i} className="flex items-start gap-2"><span className="shrink-0 mt-0.5">•</span>{t}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="py-10 bg-white dark:bg-slate-800 border-y border-slate-100 dark:border-slate-700">
        <div className="mx-auto max-w-5xl px-4">
          <p className="text-center text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-6">
            {isEl ? "Ασφαλές & αξιόπιστο" : "Safe & trusted"}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-2 text-sm font-semibold">🇪🇺 GDPR</span>
            <span className="flex items-center gap-2 text-sm font-semibold">👶 COPPA</span>
            <span className="flex items-center gap-2 text-sm font-semibold">🔒 SSL</span>
            <span className="flex items-center gap-2 text-sm font-semibold">🚫 No ads</span>
            <span className="flex items-center gap-2 text-sm font-semibold">🛡️ No tracking</span>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            {isEl ? "Δώστε στο παιδί σας screen time που αξίζει" : "Give your child screen time that's worth it"}
          </h2>
          <p className="text-lg text-white/80 mb-8">
            {isEl
              ? "Δωρεάν, ασφαλές, εκπαιδευτικό. Εγγραφείτε σε 30 δευτερόλεπτα. + 14 ημέρες δωρεάν Premium trial."
              : "Free, safe, educational. Sign up in 30 seconds. + 14-day free Premium trial."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(user ? "/parent-dashboard" : "/auth")}
              className="px-10 py-4 rounded-2xl bg-white text-emerald-700 font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
            >
              {isEl
                ? (user ? "Γονικός Πίνακας" : "Δημιουργία Δωρεάν Λογαριασμού")
                : (user ? "Parent Dashboard" : "Create Free Account")}
            </button>
            <button
              onClick={() => navigate("/guest-setup")}
              className="px-10 py-4 rounded-2xl border-2 border-white/40 text-white font-bold text-lg hover:bg-white/10 transition-all"
            >
              {isEl ? "Δοκιμή χωρίς εγγραφή" : "Try without signing up"}
            </button>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
