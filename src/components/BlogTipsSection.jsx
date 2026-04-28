import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";

const TIPS = [
  {
    slug: "math-magic-tricks",
    icon: "🧮",
    tag: { el: "Μαθηματικά", en: "Math" },
    tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    title: { el: "5 μαθηματικά κόλπα που θα εντυπωσιάσουν το παιδί σας", en: "5 math magic tricks that will impress your child" },
    desc: { el: "Μάθετε πώς τα απλά μαθηματικά μπορούν να γίνουν μαγικά tricks για καθημερινή εξάσκηση.", en: "Learn how simple math can become magic tricks for daily practice." },
    readTime: { el: "3 λεπτά", en: "3 min read" },
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    slug: "word-games-school-performance",
    icon: "🎲",
    tag: { el: "Λεκτικά παιχνίδια", en: "Word games" },
    tagColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    title: { el: "6 λεκτικά παιχνίδια που αυξάνουν τη σχολική επίδοση", en: "6 word games that boost school performance" },
    desc: { el: "Παιχνίδια με λέξεις που βελτιώνουν λεξιλόγιο, ορθογραφία και κατανόηση.", en: "Word games that improve vocabulary, spelling, and comprehension." },
    readTime: { el: "4 λεπτά", en: "4 min read" },
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    slug: "puzzles-make-kids-smarter",
    icon: "🧩",
    tag: { el: "Λογική", en: "Logic" },
    tagColor: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    title: { el: "Γιατί τα puzzles κάνουν τα παιδιά πιο έξυπνα", en: "Why puzzles make children smarter" },
    desc: { el: "Η επιστήμη πίσω από τα puzzles και πώς αναπτύσσουν τη λογική σκέψη.", en: "The science behind puzzles and how they develop logical thinking." },
    readTime: { el: "3 λεπτά", en: "3 min read" },
    gradient: "from-violet-400 to-purple-500",
  },
  {
    slug: "teaching-kids-to-lose",
    icon: "💪",
    tag: { el: "Ανάπτυξη", en: "Growth" },
    tagColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    title: { el: "Να μάθουμε στα παιδιά να χάνουν — το κλειδί για την επιτυχία", en: "Teaching kids to lose — the key to success" },
    desc: { el: "Πώς η αντιμετώπιση της ήττας χτίζει ανθεκτικότητα και χαρακτήρα.", en: "How facing defeat builds resilience and character." },
    readTime: { el: "5 λεπτά", en: "5 min read" },
    gradient: "from-amber-400 to-orange-500",
  },
  {
    slug: "school-readiness-checklist",
    icon: "📋",
    tag: { el: "Γονείς", en: "Parents" },
    tagColor: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    title: { el: "Τι πρέπει να ξέρει ένα παιδί πριν το σχολείο: Checklist", en: "What your child needs to know before school: Checklist" },
    desc: { el: "Ένα πρακτικό checklist για γονείς που θέλουν να προετοιμάσουν το παιδί τους.", en: "A practical checklist for parents preparing their child for school." },
    readTime: { el: "4 λεπτά", en: "4 min read" },
    gradient: "from-rose-400 to-pink-500",
  },
  {
    slug: "fun-educational-holidays",
    icon: "⏰",
    tag: { el: "Συμβουλές", en: "Tips" },
    tagColor: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    title: { el: "Πώς να κάνετε τις διακοπές διασκεδαστικές ΚΑΙ εκπαιδευτικές", en: "How to make holidays fun AND educational" },
    desc: { el: "8 ιδέες για παραγωγικές διακοπές χωρίς βαρεμάρα.", en: "8 ideas for productive holidays without boredom." },
    readTime: { el: "3 λεπτά", en: "3 min read" },
    gradient: "from-cyan-400 to-blue-500",
  },
];

export default function BlogTipsSection() {
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const l = isEl ? "el" : "en";

  return (
    <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-800/50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-semibold mb-4">
            {isEl ? "Εκπαιδευτικό Blog" : "Educational Blog"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">
            {isEl ? "Χρήσιμα άρθρα & συμβουλές" : "Useful articles & tips"}
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            {isEl
              ? "Ιδέες, τεχνικές και πρακτικές συμβουλές για γονείς και εκπαιδευτικούς."
              : "Ideas, techniques, and practical tips for parents and educators."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TIPS.map((tip) => (
            <Link
              key={tip.slug}
              to={`/blog/${tip.slug}`}
              className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`h-2 bg-gradient-to-r ${tip.gradient}`} />
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${tip.tagColor}`}>
                    {tip.tag[l]}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto">
                    {tip.readTime[l]}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                    {tip.icon}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm sm:text-base mb-1.5 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {tip.title[l]}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {tip.desc[l]}
                    </p>
                  </div>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:gap-2 transition-all">
                  {isEl ? "Διάβασε περισσότερα" : "Read more"}
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors shadow-md hover:shadow-lg"
          >
            {isEl ? "Δες όλα τα άρθρα" : "View all articles"}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
