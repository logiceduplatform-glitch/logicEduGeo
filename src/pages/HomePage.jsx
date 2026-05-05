import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { LanguageContext } from "../i18n/LanguageContext";
import SEO from "../components/SEO";

import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import StatsBar from "../components/StatsBar";
import RevealSection from "../components/RevealSection";
import DailyChallenge from "../components/DailyChallenge";
import FunZoneSection from "../components/FunZoneSection";
import PetWidget from "../components/PetWidget";
import FeaturesSection from "../components/FeaturesSection";
import GameShowcase from "../components/GameShowcase";
import TestimonialsSection from "../components/TestimonialsSection";
import TrustSignals from "../components/TrustSignals";
import PricingSection from "../components/PricingSection";
import FAQSection from "../components/FAQSection";
import TryFreeSection from "../components/TryFreeSection";
import FooterSection from "../components/FooterSection";
import OnboardingTour from "../components/OnboardingTour";
import HomeRecommendations from "../components/HomeRecommendations";
import DailyMissions from "../components/DailyMissions";
import MissionBanner from "../components/MissionBanner";
import RoleShowcase from "../components/RoleShowcase";
import MilestonesSection from "../components/MilestonesSection";
import UseCasesSection from "../components/UseCasesSection";
import ParentPeaceSection from "../components/ParentPeaceSection";
import BlogTipsSection from "../components/BlogTipsSection";
import ValuePillarsSection from "../components/ValuePillarsSection";

const CATEGORIES = [
  { key: "Age 2-3", icon: "👶", gradient: "from-rose-400 to-pink-400", route: "/play/2-3-school", desc: { el: "Πρώτα βήματα", en: "First steps" } },
  { key: "Age 4-5", icon: "🧒", gradient: "from-violet-400 to-purple-400", route: "/play/4-5-fun", desc: { el: "Χρώματα, σχήματα, αριθμοί", en: "Colors, shapes, numbers" } },
  { key: "Age 6", icon: "🎒", gradient: "from-blue-400 to-indigo-400", route: "/play/6-fun", desc: { el: "Προετοιμασία Α' Δημοτικού", en: "1st grade prep" } },
  { key: "Age 7-8", icon: "📖", gradient: "from-teal-400 to-emerald-400", route: "/play/7-8-fun", desc: { el: "Γλώσσα, μαθηματικά, λογική", en: "Language, math, logic" } },
  { key: "Age 9-10", icon: "🔬", gradient: "from-orange-400 to-amber-400", route: "/play/9-10-fun", desc: { el: "Επιστήμη & γεωγραφία", en: "Science & geography" } },
  { key: "Age 11–12", icon: "🎓", gradient: "from-indigo-400 to-violet-400", route: "/play/11-12-school", desc: { el: "Κριτική σκέψη", en: "Critical thinking" } },
  { key: "Adult", icon: "🧠", gradient: "from-slate-500 to-slate-600", route: "/play/adult-games", desc: { el: "Γρίφοι, γνώσεις & επιτραπέζια", en: "Puzzles, trivia & board games" } },
];

const HOW_IT_WORKS = {
  el: [
    { step: "1", icon: "👤", title: "Δημιούργησε λογαριασμό", desc: "Εγγράψου δωρεάν ή δοκίμασε ως επισκέπτης" },
    { step: "2", icon: "🎮", title: "Επίλεξε δραστηριότητα", desc: "Διάλεξε από 350+ παιχνίδια ανά ηλικία & κατηγορία" },
    { step: "3", icon: "🏆", title: "Μάθε & κέρδισε", desc: "Κέρδισε badges, ξεκλείδωσε πιστοποιητικά & ανέβα επίπεδο" },
  ],
  en: [
    { step: "1", icon: "👤", title: "Create an account", desc: "Sign up for free or try as guest" },
    { step: "2", icon: "🎮", title: "Pick an activity", desc: "Choose from 350+ games by age & category" },
    { step: "3", icon: "🏆", title: "Learn & earn", desc: "Win badges, unlock certificates & level up" },
  ],
};

export default function HomePage() {
  const navigate = useNavigate();
  const { loginWithGoogle, beginGuest, guest, user, userProfile } = useContext(AuthContext);
  const { t, lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const howSteps = HOW_IT_WORKS[isEl ? "el" : "en"];

  return (
    <div id="main-content" className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <SEO
        title={isEl ? "Αρχική" : "Home"}
        description={isEl ? "Εκπαιδευτικά παιχνίδια για όλες τις ηλικίες" : "Educational games for all ages"}
      />
      <Navbar />

      <div className="pt-16">
        <HeroSection
          t={t}
          loginWithGoogle={loginWithGoogle}
          beginGuest={beginGuest}
          guest={guest}
          user={user}
          userProfile={userProfile}
        />
      </div>

      {/* STATS BAR */}
      <StatsBar />

      {/* MISSION */}
      <RevealSection>
        <MissionBanner />
      </RevealSection>

      {/* VALUE PILLARS */}
      <RevealSection>
        <ValuePillarsSection />
      </RevealSection>

      {/* USE CASES */}
      <RevealSection>
        <UseCasesSection />
      </RevealSection>

      {/* CATEGORIES */}
      <RevealSection>
      <section id="categories" className="mx-auto max-w-6xl px-4 py-14">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-semibold mb-4">
            {isEl ? "Ηλικιακές Ομάδες" : "Age Groups"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
            {isEl ? "Βρες τα παιχνίδια για την ηλικία σου" : "Find games for your age"}
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {CATEGORIES.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => navigate(cat.route)}
              className="group flex flex-col items-center gap-3 rounded-2xl bg-white dark:bg-slate-800 p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-transparent transition-all duration-300 cursor-pointer"
            >
              <span className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </span>
              <div className="text-center">
                <span className="text-slate-800 dark:text-white font-bold text-sm block">
                  {t(cat.key, cat.key)}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 block">
                  {cat.desc[isEl ? "el" : "en"]}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
      </RevealSection>

      {/* ROLE SHOWCASE */}
      <RevealSection>
        <RoleShowcase />
      </RevealSection>

      {/* HOW IT WORKS */}
      <RevealSection>
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm font-semibold mb-4">
              {isEl ? "Πώς λειτουργεί" : "How it works"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white">
              {isEl ? "3 απλά βήματα" : "3 simple steps"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howSteps.map((s, i) => (
              <div key={i} className="relative text-center group">
                {i < howSteps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-purple-200 to-transparent" />
                )}

                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl">{s.icon}</span>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white text-xs font-bold flex items-center justify-center shadow-md">
                    {s.step}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </RevealSection>

      {/* PARENT PEACE OF MIND */}
      <RevealSection>
        <ParentPeaceSection />
      </RevealSection>

      {/* START HERE banner for anonymous visitors */}
      {!user && !guest && (
        <RevealSection>
          <section className="mx-auto max-w-4xl px-4 py-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 p-[2px]">
              <div className="rounded-[22px] bg-white dark:bg-slate-900 p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6">
                <div className="text-5xl shrink-0 animate-bounce" style={{ animationDuration: "2s" }}>🚀</div>
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white mb-2">
                    {isEl ? "Ξεκίνα εδώ!" : "Start Here!"}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isEl
                      ? "Δοκίμασε δωρεάν 350+ εκπαιδευτικά παιχνίδια χωρίς εγγραφή. Ασφαλές, χωρίς διαφημίσεις, σχεδιασμένο για παιδιά 2–12 ετών."
                      : "Try 350+ educational games for free — no sign-up required. Safe, ad-free, and designed for kids ages 2–12."}
                  </p>
                </div>
                <button
                  onClick={() => navigate("/guest-setup")}
                  className="shrink-0 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-sm sm:text-base"
                >
                  {isEl ? "Δοκίμασε Δωρεάν" : "Try Free Now"}
                </button>
              </div>
            </div>
          </section>
        </RevealSection>
      )}

      {/* RECOMMENDED GAMES for logged-in users */}
      {(user || guest) && (
        <RevealSection>
          <div className="mx-auto max-w-6xl px-4 pb-4">
            <HomeRecommendations lang={lang} />
          </div>
        </RevealSection>
      )}

      {/* DAILY MISSIONS for logged-in users */}
      {(user || guest) && (
        <RevealSection>
          <div className="mx-auto max-w-6xl px-4 pb-4">
            <DailyMissions />
          </div>
        </RevealSection>
      )}

      {/* PET WIDGET for logged-in users */}
      {(user || guest) && (
        <RevealSection>
          <div className="mx-auto max-w-md px-4 pb-4">
            <PetWidget />
          </div>
        </RevealSection>
      )}

      {/* DAILY CHALLENGE */}
      <RevealSection>
      <div className="mx-auto max-w-6xl px-4 pb-8">
        <DailyChallenge />
      </div>
      </RevealSection>

      {/* FUN ZONE - Battle / Pet / Stories / Cards */}
      <RevealSection>
        <FunZoneSection />
      </RevealSection>

      {/* NEW GAMES MEGA BANNER */}
      <RevealSection>
        <div className="max-w-6xl mx-auto px-4 py-6">
          <a
            href="/whats-new"
            className="block rounded-3xl p-8 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-2xl hover:shadow-2xl hover:scale-[1.01] transition-all mb-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold uppercase tracking-wider opacity-90">
                  {lang === "el" ? "🎉 Νέα στην Kibloo" : "🎉 New on Kibloo"}
                </div>
                <h3 className="text-2xl sm:text-4xl font-extrabold mt-1">
                  {lang === "el" ? "59 νέα παιχνίδια — 6 κατηγορίες!" : "59 new games — 6 categories!"}
                </h3>
                <div className="text-sm opacity-90 mt-1">
                  {lang === "el" ? "Κλασικά · Εκπαιδευτικά · Δημιουργικά · Multiplayer · Δράσης · STEM" : "Classics · Educational · Creative · Multiplayer · Action · STEM"}
                </div>
              </div>
              <span className="px-5 py-3 bg-white/20 hover:bg-white/30 rounded-full font-bold">
                {lang === "el" ? "Τι Νέο →" : "What's New →"}
              </span>
            </div>
          </a>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { p: "/games", e: "🎮", el: "Κλασικά", en: "Classics", n: 10 },
              { p: "/games/educational", e: "🎓", el: "Μάθηση", en: "Learn", n: 16 },
              { p: "/games/creative", e: "🎨", el: "Τέχνη", en: "Create", n: 13 },
              { p: "/games/multiplayer", e: "🤝", el: "1v1", en: "1v1", n: 5 },
              { p: "/games/action", e: "⚡", el: "Δράση", en: "Action", n: 8 },
              { p: "/games/stem", e: "🔬", el: "STEM", en: "STEM", n: 7 },
            ].map((c) => (
              <a key={c.p} href={c.p} className="bg-white dark:bg-slate-800 hover:scale-[1.05] transition-transform border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-center shadow">
                <div className="text-3xl">{c.e}</div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">{lang === "el" ? c.el : c.en}</div>
                <div className="text-[10px] text-slate-500">{c.n} {lang === "el" ? "παιχνίδια" : "games"}</div>
              </a>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* FEATURES */}
      <RevealSection>
      <div id="features">
        <FeaturesSection t={t} />
      </div>
      </RevealSection>

      {/* GAME SHOWCASE */}
      <RevealSection>
      <GameShowcase lang={lang} />
      </RevealSection>

      {/* MILESTONES */}
      <RevealSection>
      <MilestonesSection />
      </RevealSection>

      {/* TESTIMONIALS */}
      <RevealSection>
      <TestimonialsSection lang={lang} />
      </RevealSection>

      {/* BLOG TIPS */}
      <RevealSection>
        <BlogTipsSection />
      </RevealSection>

      {/* TRUST SIGNALS */}
      <RevealSection>
      <TrustSignals />
      </RevealSection>

      {/* PRICING */}
      <RevealSection>
      <PricingSection />
      </RevealSection>

      {/* FAQ */}
      <RevealSection>
      <FAQSection />
      </RevealSection>

      {/* CTA */}
      <RevealSection>
      <TryFreeSection t={t} />
      </RevealSection>

      {/* FOOTER */}
      <FooterSection t={t} />
      <OnboardingTour />
    </div>
  );
}
