import React, { useContext, useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { CURRICULUM_PACKS, CurriculumPackService } from "../config/curriculumPacks";

const T = {
  el: {
    title: "📦 Έτοιμα Πακέτα Μαθημάτων",
    subtitle: "Κατέβασε και χρησιμοποίησε αμέσως πλήρη πακέτα διδασκαλίας. Μαθήματα + quiz + ασκήσεις + παιχνίδια!",
    search: "Αναζήτηση...",
    filterAge: "Ηλικία",
    filterDifficulty: "Δυσκολία",
    filterSubject: "Μάθημα",
    all: "Όλα",
    easy: "Εύκολο",
    medium: "Μέτριο",
    hard: "Δύσκολο",
    deploy: "🚀 Ενεργοποίησε",
    deployed: "✓ Ενεργοποιημένο",
    undeploy: "Αφαίρεσε",
    open: "Άνοιξε",
    duration: "Διάρκεια",
    age: "Ηλικία",
    difficulty: "Δυσκολία",
    subject: "Μάθημα",
    lessons: "Μαθήματα",
    quizzes: "Quiz",
    worksheets: "Ασκήσεις",
    games: "Παιχνίδια",
    back: "← Πίσω",
    yourPacks: "Τα ενεργά πακέτα σου",
    explore: "Όλα τα πακέτα",
    confirmDeploy: "Να ενεργοποιηθεί αυτό το πακέτο για την τάξη σου;",
    deployedToast: "✓ Πακέτο ενεργοποιήθηκε!",
    description: "Περιγραφή",
    contents: "Περιεχόμενα",
    noResults: "Δεν βρέθηκαν πακέτα.",
    needAuth: "Συνδέσου για να ενεργοποιήσεις πακέτα.",
  },
  en: {
    title: "📦 Curated Curriculum Packs",
    subtitle: "Deploy ready-made teaching bundles instantly. Lessons + quizzes + worksheets + games!",
    search: "Search...",
    filterAge: "Age",
    filterDifficulty: "Difficulty",
    filterSubject: "Subject",
    all: "All",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    deploy: "🚀 Deploy",
    deployed: "✓ Deployed",
    undeploy: "Remove",
    open: "Open",
    duration: "Duration",
    age: "Age",
    difficulty: "Difficulty",
    subject: "Subject",
    lessons: "Lessons",
    quizzes: "Quizzes",
    worksheets: "Worksheets",
    games: "Games",
    back: "← Back",
    yourPacks: "Your active packs",
    explore: "All packs",
    confirmDeploy: "Deploy this pack to your class?",
    deployedToast: "✓ Pack deployed!",
    description: "Description",
    contents: "Contents",
    noResults: "No packs found.",
    needAuth: "Sign in to deploy packs.",
  },
};

export default function CurriculumPacksPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const { user } = useContext(AuthContext) || {};
  const l = T[lang] || T.en;
  const navigate = useNavigate();
  const { id } = useParams();

  if (id) return <PackDetail id={id} l={l} lang={lang} navigate={navigate} user={user} />;

  return <PackList l={l} lang={lang} navigate={navigate} user={user} />;
}

function PackList({ l, lang, navigate, user }) {
  const [search, setSearch] = useState("");
  const [age, setAge] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [subject, setSubject] = useState("");
  const [deployed, setDeployed] = useState(() => CurriculumPackService.getDeployed());

  const filtered = useMemo(() => CurriculumPackService.filter({ search, age, difficulty, subject }), [search, age, difficulty, subject]);

  const deployedPacks = useMemo(() => deployed.map((d) => CurriculumPackService.get(d.packId)).filter(Boolean), [deployed]);

  const subjects = useMemo(() => Array.from(new Set(CURRICULUM_PACKS.map((p) => p.subject))), []);
  const ages = useMemo(() => Array.from(new Set(CURRICULUM_PACKS.map((p) => p.age))), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={l.title} />
      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-5xl space-y-5">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white">{l.title}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{l.subtitle}</p>
          </div>

          {/* Deployed packs */}
          {deployedPacks.length > 0 && (
            <section className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4">
              <h2 className="font-bold text-emerald-800 dark:text-emerald-200 mb-3">{l.yourPacks}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {deployedPacks.map((p) => <PackCard key={p.id} p={p} l={l} lang={lang} navigate={navigate} small />)}
              </div>
            </section>
          )}

          {/* Filters */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 flex flex-wrap gap-2 items-center">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={l.search} className="flex-1 min-w-[180px] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none" />
            <select value={age} onChange={(e) => setAge(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm">
              <option value="">{l.filterAge}: {l.all}</option>
              {ages.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm">
              <option value="">{l.filterDifficulty}: {l.all}</option>
              <option value="easy">{l.easy}</option>
              <option value="medium">{l.medium}</option>
              <option value="hard">{l.hard}</option>
            </select>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm">
              <option value="">{l.filterSubject}: {l.all}</option>
              {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Explore */}
          <section>
            <h2 className="font-bold text-slate-800 dark:text-white mb-3">{l.explore} ({filtered.length})</h2>
            {filtered.length === 0 ? (
              <p className="text-center text-slate-500 py-8">{l.noResults}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((p) => <PackCard key={p.id} p={p} l={l} lang={lang} navigate={navigate} />)}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function PackCard({ p, l, lang, navigate, small }) {
  return (
    <button
      onClick={() => navigate(`/curriculum/${p.id}`)}
      className={`text-left w-full bg-gradient-to-br ${p.color} rounded-2xl p-${small ? "3" : "5"} text-white shadow-lg hover:scale-[1.02] transition relative overflow-hidden`}
    >
      <div className="absolute -top-3 -right-3 text-7xl opacity-20">{p.icon}</div>
      <h3 className={`font-extrabold ${small ? "text-base" : "text-lg"} mb-1`}>{p.title[lang] || p.title.en}</h3>
      {!small && <p className="text-sm opacity-90 line-clamp-2">{p.description[lang] || p.description.en}</p>}
      <div className="flex flex-wrap gap-1 mt-3">
        <span className="text-[10px] font-bold bg-white/25 px-2 py-0.5 rounded-full">👥 {p.age}</span>
        <span className="text-[10px] font-bold bg-white/25 px-2 py-0.5 rounded-full">🎯 {l[p.difficulty] || p.difficulty}</span>
        {!small && <span className="text-[10px] font-bold bg-white/25 px-2 py-0.5 rounded-full">⏱ {p.duration[lang] || p.duration.en}</span>}
      </div>
      {!small && (
        <div className="flex flex-wrap gap-2 mt-3 text-xs opacity-95">
          <span>📚 {p.lessons.length} {l.lessons}</span>
          <span>❓ {p.quizzes.length} {l.quizzes}</span>
          <span>🎮 {p.games.length} {l.games}</span>
        </div>
      )}
    </button>
  );
}

function PackDetail({ id, l, lang, navigate, user }) {
  const pack = CurriculumPackService.get(id);
  const [deployed, setDeployed] = useState(() => CurriculumPackService.getDeployed());
  const [toast, setToast] = useState("");

  useEffect(() => {
    const sync = () => setDeployed(CurriculumPackService.getDeployed());
    window.addEventListener("geo:pack-deployed", sync);
    return () => window.removeEventListener("geo:pack-deployed", sync);
  }, []);

  if (!pack) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="pt-20 pb-12 px-4 text-center"><p className="text-slate-500 mt-20">404</p></div>
      </div>
    );
  }

  const isDeployed = deployed.some((d) => d.packId === pack.id);

  const handleDeploy = () => {
    if (!user?.uid) return alert(l.needAuth);
    if (!window.confirm(l.confirmDeploy)) return;
    CurriculumPackService.deploy(pack.id);
    setDeployed(CurriculumPackService.getDeployed());
    setToast(l.deployedToast);
    setTimeout(() => setToast(""), 2000);
  };

  const handleUndeploy = () => {
    CurriculumPackService.undeploy(pack.id);
    setDeployed(CurriculumPackService.getDeployed());
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900`}>
      <Navbar />
      <SEO title={pack.title[lang] || pack.title.en} />
      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-3xl space-y-5">
          <button onClick={() => navigate("/curriculum")} className="text-sm text-slate-500 hover:underline">{l.back}</button>

          {/* Hero */}
          <div className={`bg-gradient-to-br ${pack.color} rounded-3xl p-7 text-white shadow-2xl relative overflow-hidden`}>
            <div className="absolute -top-6 -right-6 text-9xl opacity-20">{pack.icon}</div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{pack.title[lang] || pack.title.en}</h1>
            <p className="mt-2 text-base sm:text-lg opacity-95">{pack.description[lang] || pack.description.en}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-xs">
              <Meta label={l.age} value={pack.age} />
              <Meta label={l.difficulty} value={l[pack.difficulty] || pack.difficulty} />
              <Meta label={l.subject} value={pack.subject} />
              <Meta label={l.duration} value={pack.duration[lang] || pack.duration.en} />
            </div>

            {!isDeployed ? (
              <button onClick={handleDeploy} className="mt-5 px-6 py-3 rounded-xl bg-white text-slate-800 font-extrabold shadow-lg hover:scale-[1.02] transition">
                {l.deploy}
              </button>
            ) : (
              <div className="flex flex-wrap gap-2 mt-5">
                <span className="px-4 py-2 rounded-xl bg-white/20 text-white font-bold border border-white/30">{l.deployed}</span>
                <button onClick={handleUndeploy} className="px-4 py-2 rounded-xl bg-white/30 hover:bg-white/40 text-white text-sm font-bold">{l.undeploy}</button>
              </div>
            )}
          </div>

          {toast && (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-lg font-bold z-50">
              {toast}
            </div>
          )}

          {/* Contents */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
            <h2 className="font-bold text-slate-800 dark:text-white mb-3">📚 {l.lessons} ({pack.lessons.length})</h2>
            <ol className="space-y-2 list-decimal list-inside">
              {pack.lessons.map((les, i) => (
                <li key={i} className="text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700/40 rounded-lg p-2">
                  <strong>{les.title[lang] || les.title.en}</strong>
                  <span className="block text-xs text-slate-500 mt-0.5">{les.theory[lang] || les.theory.en}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
            <h2 className="font-bold text-slate-800 dark:text-white mb-3">❓ {l.quizzes} ({pack.quizzes.length})</h2>
            <ul className="space-y-1">
              {pack.quizzes.map((q, i) => (
                <li key={i} className="text-sm text-slate-700 dark:text-slate-200 flex items-center justify-between bg-slate-50 dark:bg-slate-700/40 rounded-lg px-3 py-2">
                  <span>{q.title[lang] || q.title.en}</span>
                  <span className="text-xs font-bold text-violet-600">{q.count} Q</span>
                </li>
              ))}
            </ul>
          </div>

          {pack.worksheets?.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
              <h2 className="font-bold text-slate-800 dark:text-white mb-3">📝 {l.worksheets}</h2>
              <div className="flex flex-wrap gap-1">
                {pack.worksheets.map((w) => (
                  <span key={w} className="px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-bold">{w}</span>
                ))}
              </div>
            </div>
          )}

          {pack.games?.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
              <h2 className="font-bold text-slate-800 dark:text-white mb-3">🎮 {l.games}</h2>
              <div className="flex flex-wrap gap-1">
                {pack.games.map((g) => (
                  <span key={g} className="px-2 py-1 rounded-md bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-bold">{g}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }) {
  return (
    <div className="bg-white/15 rounded-lg p-2">
      <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">{label}</p>
      <p className="font-bold mt-0.5">{value}</p>
    </div>
  );
}
