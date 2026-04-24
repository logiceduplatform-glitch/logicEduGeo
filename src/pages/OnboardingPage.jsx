import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import SEO from "../components/SEO";
import { AuthContext } from "../auth/AuthContext";
import { LanguageContext } from "../i18n/LanguageContext";
import {
  ageToQuizRoute,
  adultObjectiveRoutes,
  age2_3ObjectiveRoutes,
  age4_5ObjectiveRoutes,
  age6ObjectiveRoutes,
  age7_8ObjectiveRoutes,
  age9_10ObjectiveRoutes,
  age11_12ObjectiveRoutes,
} from "../config/quizRoutes";

const AGE_OPTIONS = [
  { key: "Age 2-3", icon: "👶", color: "from-rose-400 to-pink-500" },
  { key: "Age 4-5", icon: "🧒", color: "from-violet-400 to-purple-500" },
  { key: "Age 6", icon: "🎒", color: "from-blue-400 to-indigo-500" },
  { key: "Age 7-8", icon: "📖", color: "from-teal-400 to-emerald-500" },
  { key: "Age 9-10", icon: "🔬", color: "from-orange-400 to-amber-500" },
  { key: "Age 11–12", icon: "🎓", color: "from-indigo-400 to-violet-500" },
  { key: "Adult", icon: "🧠", color: "from-slate-400 to-slate-600" },
];

const KIDS_OBJECTIVES = [
  { key: "school", icon: "🏫", color: "from-blue-400 to-indigo-500" },
  { key: "fun", icon: "🎉", color: "from-pink-400 to-rose-500" },
  { key: "logic", icon: "🧩", color: "from-purple-400 to-violet-500" },
];

const ADULT_OBJECTIVES = [
  { key: "brain", icon: "🧠", color: "from-slate-400 to-slate-600" },
  { key: "fun", icon: "🎉", color: "from-pink-400 to-rose-500" },
  { key: "logic", icon: "🧩", color: "from-purple-400 to-violet-500" },
  { key: "board", icon: "♟️", color: "from-amber-500 to-orange-600" },
];

const ROLE_OPTIONS = [
  { key: "student", icon: "🎓", color: "from-blue-500 to-indigo-600" },
  { key: "parent", icon: "👨‍👩‍👧‍👦", color: "from-emerald-500 to-teal-600" },
  { key: "teacher", icon: "📚", color: "from-amber-500 to-orange-600" },
];

const GRADE_OPTIONS = [
  { key: "elem", icon: "📗", color: "from-emerald-400 to-teal-500" },
  { key: "middle", icon: "📘", color: "from-blue-400 to-indigo-500" },
  { key: "high", icon: "📕", color: "from-red-400 to-rose-500" },
  { key: "all", icon: "📚", color: "from-purple-400 to-violet-500" },
];

const PARENT_GOALS = [
  { key: "school_prep", icon: "🏫", color: "from-blue-400 to-indigo-500" },
  { key: "fun_learning", icon: "🎉", color: "from-pink-400 to-rose-500" },
  { key: "logic_skills", icon: "🧩", color: "from-purple-400 to-violet-500" },
  { key: "all_round", icon: "🌟", color: "from-amber-400 to-orange-500" },
];

const SESSION_OPTIONS = [
  { key: "10min", icon: "⏱️", color: "from-green-400 to-emerald-500" },
  { key: "20min", icon: "🕐", color: "from-blue-400 to-cyan-500" },
  { key: "30min", icon: "🕑", color: "from-purple-400 to-violet-500" },
  { key: "unlimited", icon: "♾️", color: "from-amber-400 to-orange-500" },
];

const TEXTS = {
  el: {
    step1Title: "Πώς σε λένε;",
    step1Sub: "Γράψε το όνομά σου",
    step1SubKid: "Γράψε το όνομα του παιδιού",
    namePlaceholder: "π.χ. Μαρία",
    step2Title: "Πόσο χρονών είσαι;",
    step2Sub: "Επίλεξε ηλικιακή ομάδα",
    step3Title: "Τι θέλεις να κάνεις;",
    step3Sub: "Επίλεξε τον στόχο σου",
    stepRoleTitle: "Ποιος είσαι;",
    stepRoleSub: "Διάλεξε τον ρόλο σου",
    stepTeacherTitle: "Λίγα ακόμα στοιχεία",
    stepTeacherSub: "Βοήθησέ μας να προσαρμόσουμε την εμπειρία",
    parentChildName: "Πώς λένε το παιδί;",
    parentChildNameSub: "Γράψε το όνομα του παιδιού σου",
    parentChildAge: "Πόσο χρονών είναι;",
    parentChildAgeSub: "Επίλεξε την ηλικιακή ομάδα του παιδιού",
    parentGoalTitle: "Τι θέλεις για το παιδί;",
    parentGoalSub: "Ποιος είναι ο κύριος στόχος σου;",
    parentSessionTitle: "Πόσο χρόνο την ημέρα;",
    parentSessionSub: "Προτεινόμενη διάρκεια ανά συνεδρία",
    school_prep: "Σχολική προετοιμασία",
    fun_learning: "Μάθηση μέσα από παιχνίδι",
    logic_skills: "Ανάπτυξη λογικής",
    all_round: "Όλα τα παραπάνω",
    "10min": "10 λεπτά",
    "20min": "20 λεπτά",
    "30min": "30 λεπτά",
    unlimited: "Χωρίς όριο",
    childNamePlaceholder: "π.χ. Νίκος",
    school: "Προετοιμασία για σχολείο",
    fun: "Διασκέδαση & παιχνίδι",
    logic: "Λογική σκέψη",
    brain: "Εξάσκηση μυαλού",
    board: "Επιτραπέζια παιχνίδια",
    next: "Επόμενο",
    back: "Πίσω",
    start: "Ας ξεκινήσουμε!",
    welcome: "Καλωσόρισες",
    stepOf: "Βήμα",
    of: "από",
    schoolNamePlaceholder: "π.χ. 3ο Δημοτικό Αθηνών",
    elem: "Δημοτικό (6-12)",
    middle: "Γυμνάσιο (13-15)",
    high: "Λύκειο (16-18)",
    all: "Όλες οι βαθμίδες",
    parentReady: "Ετοιμαστήκαμε! Ας βρούμε τα κατάλληλα παιχνίδια",
  },
  en: {
    step1Title: "What's your name?",
    step1Sub: "Enter your name",
    step1SubKid: "Enter the child's name",
    namePlaceholder: "e.g. Maria",
    step2Title: "How old are you?",
    step2Sub: "Pick your age group",
    step3Title: "What do you want to do?",
    step3Sub: "Choose your goal",
    stepRoleTitle: "Who are you?",
    stepRoleSub: "Choose your role",
    stepTeacherTitle: "A few more details",
    stepTeacherSub: "Help us customize your experience",
    parentChildName: "What's your child's name?",
    parentChildNameSub: "Enter your child's name",
    parentChildAge: "How old are they?",
    parentChildAgeSub: "Select your child's age group",
    parentGoalTitle: "What's your goal?",
    parentGoalSub: "What do you want for your child?",
    parentSessionTitle: "Session length?",
    parentSessionSub: "Recommended time per session",
    school_prep: "School preparation",
    fun_learning: "Learn through play",
    logic_skills: "Logic & reasoning skills",
    all_round: "All of the above",
    "10min": "10 minutes",
    "20min": "20 minutes",
    "30min": "30 minutes",
    unlimited: "No limit",
    childNamePlaceholder: "e.g. Nick",
    school: "Preparation for school",
    fun: "Fun & play",
    logic: "Logical thinking",
    brain: "Brain training",
    board: "Board games",
    next: "Next",
    back: "Back",
    start: "Let's go!",
    welcome: "Welcome",
    stepOf: "Step",
    of: "of",
    schoolNamePlaceholder: "e.g. Lincoln Elementary",
    elem: "Elementary (6-12)",
    middle: "Middle school (13-15)",
    high: "High school (16-18)",
    all: "All grades",
    parentReady: "All set! Let's find the right games",
  },
};

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, saveUserProfile } = useContext(AuthContext);
  const { lang, t } = useContext(LanguageContext);
  const l = TEXTS[lang] || TEXTS.en;

  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [objective, setObjective] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [gradeRange, setGradeRange] = useState("");
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [parentGoal, setParentGoal] = useState("");
  const [sessionTime, setSessionTime] = useState("");

  const isAdult = age === "Adult";
  const objectives = isAdult ? ADULT_OBJECTIVES : KIDS_OBJECTIVES;
  const childAgeOptions = AGE_OPTIONS.filter(a => a.key !== "Adult");

  const getSteps = () => {
    if (role === "student") return ["role", "name", "age", "objective"];
    if (role === "parent") return ["role", "name", "child-name", "child-age", "parent-goal", "parent-session"];
    if (role === "teacher") return ["role", "name", "teacher-info"];
    return ["role"];
  };

  const steps = getSteps();
  const totalSteps = steps.length;
  const currentStepKey = steps[step - 1] || "role";
  const progress = (step / totalSteps) * 100;

  const handleFinish = () => {
    // Sync display name to Firebase Auth for all roles
    if (user && name.trim() && !user.displayName) {
      updateProfile(user, { displayName: name.trim() }).catch(() => {});
    }

    if (role === "parent") {
      const goalToObjective = { school_prep: "school", fun_learning: "fun", logic_skills: "logic", all_round: "school" };
      const childObjective = goalToObjective[parentGoal] || "school";
      const profile = {
        name: name.trim(),
        role: "parent",
        age: childAge || "Age 4-5",
        objective: childObjective,
        childName: childName.trim(),
        parentGoal,
        sessionTime: sessionTime || "20min",
      };
      saveUserProfile(profile);

      const routeMaps = {
        "Age 2-3": age2_3ObjectiveRoutes,
        "Age 4-5": age4_5ObjectiveRoutes,
        "Age 6": age6ObjectiveRoutes,
        "Age 7-8": age7_8ObjectiveRoutes,
        "Age 9-10": age9_10ObjectiveRoutes,
        "Age 11–12": age11_12ObjectiveRoutes,
      };
      const map = routeMaps[childAge];
      const route = map?.[childObjective] || ageToQuizRoute[childAge] || "/play";
      navigate(route);
      return;
    }

    if (role === "teacher") {
      const profile = { name: name.trim(), role: "teacher", objective: "brain", schoolName: schoolName.trim(), gradeRange };
      saveUserProfile(profile);
      if (user && name.trim()) {
        updateProfile(user, { displayName: name.trim() }).catch(() => {});
      }
      navigate("/teacher-dashboard");
      return;
    }

    const profile = { name: name.trim(), role: "student", age, objective };
    saveUserProfile(profile);

    if (age === "Adult") { navigate(adultObjectiveRoutes[objective] || "/play/adult-games"); return; }
    if (age === "Age 2-3" && age2_3ObjectiveRoutes[objective]) { navigate(age2_3ObjectiveRoutes[objective]); return; }
    if (age === "Age 4-5" && age4_5ObjectiveRoutes[objective]) { navigate(age4_5ObjectiveRoutes[objective]); return; }
    if (age === "Age 6" && age6ObjectiveRoutes[objective]) { navigate(age6ObjectiveRoutes[objective]); return; }
    if (age === "Age 7-8" && age7_8ObjectiveRoutes[objective]) { navigate(age7_8ObjectiveRoutes[objective]); return; }
    if (age === "Age 9-10" && age9_10ObjectiveRoutes[objective]) { navigate(age9_10ObjectiveRoutes[objective]); return; }
    if (age === "Age 11–12" && age11_12ObjectiveRoutes[objective]) { navigate(age11_12ObjectiveRoutes[objective]); return; }
    navigate(ageToQuizRoute[age] || "/play");
  };

  const canNext =
    (currentStepKey === "role" && role) ||
    (currentStepKey === "name" && name.trim().length >= 1) ||
    (currentStepKey === "age" && age) ||
    (currentStepKey === "objective" && objective) ||
    (currentStepKey === "teacher-info" && gradeRange) ||
    (currentStepKey === "child-name" && childName.trim().length >= 1) ||
    (currentStepKey === "child-age" && childAge) ||
    (currentStepKey === "parent-goal" && parentGoal) ||
    (currentStepKey === "parent-session" && sessionTime);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      if (step === 2 && currentStepKey === "name") {
        setRole("");
        setName("");
        setAge("");
        setObjective("");
        setSchoolName("");
        setGradeRange("");
        setChildName("");
        setChildAge("");
        setParentGoal("");
        setSessionTime("");
      }
      setStep(step - 1);
    }
  };

  const getStepTitle = () => {
    switch (currentStepKey) {
      case "role": return l.stepRoleTitle;
      case "name": return l.step1Title;
      case "age": return l.step2Title;
      case "objective": return l.step3Title;
      case "teacher-info": return l.stepTeacherTitle;
      case "child-name": return l.parentChildName;
      case "child-age": return l.parentChildAge;
      case "parent-goal": return l.parentGoalTitle;
      case "parent-session": return l.parentSessionTitle;
      default: return "";
    }
  };

  const getStepSub = () => {
    switch (currentStepKey) {
      case "role": return l.stepRoleSub;
      case "name": return l.step1Sub;
      case "age": return l.step2Sub;
      case "objective": return l.step3Sub;
      case "teacher-info": return l.stepTeacherSub;
      case "child-name": return l.parentChildNameSub;
      case "child-age": return l.parentChildAgeSub;
      case "parent-goal": return l.parentGoalSub;
      case "parent-session": return l.parentSessionSub;
      default: return "";
    }
  };

  return (
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center p-4">
      <SEO title={getStepTitle()} />
      <div className="w-full max-w-lg">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-2">
            <span>{l.stepOf} {step} {l.of} {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-white/80 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 px-8 py-6 text-white">
            <h1 className="text-2xl font-bold">{getStepTitle()}</h1>
            <p className="text-purple-200 text-sm mt-1">{getStepSub()}</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Role Selection */}
            {currentStepKey === "role" && (
              <div className="space-y-3">
                {ROLE_OPTIONS.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => { setRole(r.key); setAge(""); setObjective(""); }}
                    className={`w-full rounded-2xl p-5 border-2 transition-all duration-200 flex items-center gap-4 ${
                      role === r.key
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-lg shadow-purple-200/50 dark:shadow-purple-900/30 scale-[1.01]"
                        : "border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-700 hover:border-purple-300 hover:bg-purple-50/50 dark:hover:border-purple-500 dark:hover:bg-purple-900/20"
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center text-2xl shadow-sm shrink-0`}>
                      {r.icon}
                    </div>
                    <div className="text-left">
                      <span className="text-base font-semibold text-slate-700 dark:text-slate-200 block">
                        {t(`im${r.key.charAt(0).toUpperCase() + r.key.slice(1)}`)}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {t(`${r.key}Desc`)}
                      </span>
                    </div>
                    {role === r.key && (
                      <div className="ml-auto w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Name */}
            {currentStepKey === "name" && (
              <div>
                <div className="text-center mb-6">
                  <span className="text-6xl">{role === "teacher" ? "📚" : role === "parent" ? "👨‍👩‍👧‍👦" : "👋"}</span>
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={l.namePlaceholder}
                  autoFocus
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/50 outline-none transition-all text-lg text-center text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-white dark:bg-slate-700"
                  onKeyDown={(e) => e.key === "Enter" && canNext && handleNext()}
                />
              </div>
            )}

            {/* Age */}
            {currentStepKey === "age" && (
              <div className="grid grid-cols-2 gap-3">
                {AGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => { setAge(opt.key); setObjective(""); }}
                    className={`relative rounded-2xl p-4 border-2 transition-all duration-200 text-left ${
                      age === opt.key
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-lg shadow-purple-200/50 dark:shadow-purple-900/30 scale-[1.02]"
                        : "border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-700 hover:border-purple-300 hover:bg-purple-50/50 dark:hover:border-purple-500 dark:hover:bg-purple-900/20"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${opt.color} flex items-center justify-center text-xl mb-2 shadow-sm`}>
                      {opt.icon}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t(opt.key, opt.key)}</span>
                    {age === opt.key && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Objective */}
            {currentStepKey === "objective" && (
              <div className="space-y-3">
                {objectives.map((obj) => (
                  <button
                    key={obj.key}
                    onClick={() => setObjective(obj.key)}
                    className={`w-full rounded-2xl p-5 border-2 transition-all duration-200 flex items-center gap-4 ${
                      objective === obj.key
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-lg shadow-purple-200/50 dark:shadow-purple-900/30 scale-[1.01]"
                        : "border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-700 hover:border-purple-300 hover:bg-purple-50/50 dark:hover:border-purple-500 dark:hover:bg-purple-900/20"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${obj.color} flex items-center justify-center text-2xl shadow-sm shrink-0`}>
                      {obj.icon}
                    </div>
                    <span className="text-base font-semibold text-slate-700 dark:text-slate-200">{l[obj.key]}</span>
                    {objective === obj.key && (
                      <div className="ml-auto w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}

                {objective && name.trim() && (
                  <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-100 dark:border-purple-700/50 text-center">
                    <span className="text-2xl">🎉</span>
                    <p className="text-sm text-purple-700 dark:text-purple-300 font-medium mt-1">
                      {l.welcome}, <span className="font-bold">{name.trim()}</span>!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Teacher Info */}
            {currentStepKey === "teacher-info" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {t("schoolName")}
                  </label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder={l.schoolNamePlaceholder}
                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/50 outline-none transition-all text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-white dark:bg-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    {t("gradeRange")}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {GRADE_OPTIONS.map((g) => (
                      <button
                        key={g.key}
                        onClick={() => setGradeRange(g.key)}
                        className={`relative rounded-2xl p-4 border-2 transition-all duration-200 text-left ${
                          gradeRange === g.key
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-lg scale-[1.02]"
                            : "border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-700 hover:border-purple-300"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center text-xl mb-2 shadow-sm`}>
                          {g.icon}
                        </div>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{l[g.key]}</span>
                        {gradeRange === g.key && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {gradeRange && name.trim() && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700/50 text-center">
                    <span className="text-2xl">📚</span>
                    <p className="text-sm text-amber-700 dark:text-amber-300 font-medium mt-1">
                      {l.welcome}, <span className="font-bold">{name.trim()}</span>!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Parent: Child's name */}
            {currentStepKey === "child-name" && (
              <div>
                <div className="text-center mb-6">
                  <span className="text-6xl">👧</span>
                </div>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder={l.childNamePlaceholder}
                  autoFocus
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/50 outline-none transition-all text-lg text-center text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-white dark:bg-slate-700"
                  onKeyDown={(e) => e.key === "Enter" && canNext && handleNext()}
                />
              </div>
            )}

            {/* Parent: Child's age */}
            {currentStepKey === "child-age" && (
              <div className="grid grid-cols-2 gap-3">
                {childAgeOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setChildAge(opt.key)}
                    className={`relative rounded-2xl p-4 border-2 transition-all duration-200 text-left ${
                      childAge === opt.key
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-lg shadow-purple-200/50 dark:shadow-purple-900/30 scale-[1.02]"
                        : "border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-700 hover:border-purple-300 hover:bg-purple-50/50 dark:hover:border-purple-500 dark:hover:bg-purple-900/20"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${opt.color} flex items-center justify-center text-xl mb-2 shadow-sm`}>
                      {opt.icon}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t(opt.key, opt.key)}</span>
                    {childAge === opt.key && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Parent: Goal for child */}
            {currentStepKey === "parent-goal" && (
              <div className="space-y-3">
                {PARENT_GOALS.map((g) => (
                  <button
                    key={g.key}
                    onClick={() => setParentGoal(g.key)}
                    className={`w-full rounded-2xl p-5 border-2 transition-all duration-200 flex items-center gap-4 ${
                      parentGoal === g.key
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-lg shadow-purple-200/50 dark:shadow-purple-900/30 scale-[1.01]"
                        : "border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-700 hover:border-purple-300 hover:bg-purple-50/50 dark:hover:border-purple-500 dark:hover:bg-purple-900/20"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center text-2xl shadow-sm shrink-0`}>
                      {g.icon}
                    </div>
                    <span className="text-base font-semibold text-slate-700 dark:text-slate-200">{l[g.key]}</span>
                    {parentGoal === g.key && (
                      <div className="ml-auto w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Parent: Session time */}
            {currentStepKey === "parent-session" && (
              <div className="space-y-3">
                {SESSION_OPTIONS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSessionTime(s.key)}
                    className={`w-full rounded-2xl p-5 border-2 transition-all duration-200 flex items-center gap-4 ${
                      sessionTime === s.key
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-lg shadow-purple-200/50 dark:shadow-purple-900/30 scale-[1.01]"
                        : "border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-700 hover:border-purple-300 hover:bg-purple-50/50 dark:hover:border-purple-500 dark:hover:bg-purple-900/20"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl shadow-sm shrink-0`}>
                      {s.icon}
                    </div>
                    <span className="text-base font-semibold text-slate-700 dark:text-slate-200">{l[s.key]}</span>
                    {sessionTime === s.key && (
                      <div className="ml-auto w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}

                {sessionTime && childName.trim() && (
                  <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-700/50 text-center">
                    <span className="text-2xl">🎉</span>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium mt-1">
                      {l.parentReady}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                      {childName.trim()} · {t(childAge, childAge)} · {l[parentGoal]} · {l[sessionTime]}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer buttons */}
          <div className="px-8 pb-8 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              >
                &larr; {l.back}
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNext}
              disabled={!canNext}
              className="px-8 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-300/40 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 active:scale-95"
            >
              {step === totalSteps ? l.start : l.next}
              {step < totalSteps && <span>&rarr;</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
