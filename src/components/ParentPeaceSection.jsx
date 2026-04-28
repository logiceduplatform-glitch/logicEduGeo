import React, { useContext } from "react";
import { LanguageContext } from "../i18n/LanguageContext";

const BENEFITS = {
  el: [
    {
      icon: "📱",
      title: "Παντού & πάντα",
      desc: "Σπίτι, αυτοκίνητο, ουρά, γιαγιά — μαθαίνει οπουδήποτε, σε κάθε συσκευή.",
    },
    {
      icon: "⏱️",
      title: "Σύντομες δραστηριότητες",
      desc: "5-10 λεπτά αρκούν. Ιδανικό για κάθε κενό στιγμή της ημέρας.",
    },
    {
      icon: "🔊",
      title: "Ηχητικές οδηγίες",
      desc: "Όλες οι ασκήσεις έχουν φωνητικές οδηγίες — ακόμα κι αν δεν διαβάζει ακόμα.",
    },
    {
      icon: "🔒",
      title: "Ασφαλές περιβάλλον",
      desc: "Χωρίς διαφημίσεις, χωρίς ακατάλληλο περιεχόμενο. kidSAFE standards.",
    },
    {
      icon: "📊",
      title: "Ενημέρωση γονέα",
      desc: "Βλέπεις ακριβώς τι έμαθε, πόσο χρόνο αφιέρωσε και πού δυσκολεύτηκε.",
    },
    {
      icon: "🎓",
      title: "Χωρίς δάσκαλο, χωρίς ωράριο",
      desc: "Μαθαίνει στον δικό του ρυθμό. Δεν χρειάζεται να προσαρμοστείτε σε πρόγραμμα.",
    },
  ],
  en: [
    {
      icon: "📱",
      title: "Anywhere, anytime",
      desc: "Home, car, waiting room, grandma's — learning works on any device, anywhere.",
    },
    {
      icon: "⏱️",
      title: "Bite-sized activities",
      desc: "5-10 minutes is enough. Perfect for any spare moment of the day.",
    },
    {
      icon: "🔊",
      title: "Voice instructions",
      desc: "All exercises have voice guidance — even for kids who can't read yet.",
    },
    {
      icon: "🔒",
      title: "Safe environment",
      desc: "No ads, no inappropriate content. Built with kidSAFE standards in mind.",
    },
    {
      icon: "📊",
      title: "Parent insights",
      desc: "See exactly what they learned, how much time they spent, and where they struggled.",
    },
    {
      icon: "🎓",
      title: "No tutor, no schedule",
      desc: "They learn at their own pace. No need to match a teacher's timetable.",
    },
  ],
};

export default function ParentPeaceSection() {
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const benefits = BENEFITS[isEl ? "el" : "en"];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — messaging */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm font-semibold mb-4">
              {isEl ? "Για γονείς" : "For parents"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-4 leading-tight">
              {isEl ? (
                <>Παιδιά ενθουσιασμένα —<br /><span className="text-emerald-600 dark:text-emerald-400">Γονείς ξέγνοιαστοι</span></>
              ) : (
                <>Kids excited —<br /><span className="text-emerald-600 dark:text-emerald-400">Parents relaxed</span></>
              )}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              {isEl
                ? "Μαθαίνουν στο σπίτι, στο αυτοκίνητο, στην αναμονή, μαζί με φίλους, στη γιαγιά — αντί για κινούμενα σχέδια και βαρεμάρα!"
                : "They learn at home, in the car, in the waiting room, with friends, at grandma's — instead of cartoons and boredom!"}
            </p>

            <div className="flex items-center gap-6 mb-2">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">93%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isEl ? "Γονείς ικανοποιημένοι" : "Parents satisfied"}
                </div>
              </div>
              <div className="w-px h-12 bg-slate-200 dark:bg-slate-700" />
              <div className="text-center">
                <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">15'</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isEl ? "Μέσος χρόνος / ημέρα" : "Avg. time / day"}
                </div>
              </div>
              <div className="w-px h-12 bg-slate-200 dark:bg-slate-700" />
              <div className="text-center">
                <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">0</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isEl ? "Διαφημίσεις" : "Ads"}
                </div>
              </div>
            </div>
          </div>

          {/* Right — benefit cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="group flex items-start gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-xl p-4 border border-emerald-100 dark:border-slate-700 hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300"
              >
                <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                  {b.icon}
                </span>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-1">
                    {b.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
