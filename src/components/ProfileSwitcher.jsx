import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileService } from "../services/ProfileService";
import { FamilyPlanService } from "../services/FamilyPlanService";
import { useSubscription } from "../contexts/SubscriptionContext";
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

const AGE_ICONS = {
  "Age 2-3": "👶", "Age 4-5": "🧒", "Age 6": "🎒",
  "Age 7-8": "📖", "Age 9-10": "🔬", "Age 11–12": "🎓", "Age 11-12": "🎓", "Adult": "🧠",
};

const AGE_OPTIONS = [
  { key: "Age 2-3", icon: "👶", label: "2-3" },
  { key: "Age 4-5", icon: "🧒", label: "4-5" },
  { key: "Age 6", icon: "🎒", label: "6" },
  { key: "Age 7-8", icon: "📖", label: "7-8" },
  { key: "Age 9-10", icon: "🔬", label: "9-10" },
  { key: "Age 11–12", icon: "🎓", label: "11-12" },
];

const OBJECTIVE_MAP = {
  school: { el: "Προετοιμασία σχολείου", en: "School prep", icon: "🏫" },
  fun: { el: "Διασκέδαση & παιχνίδι", en: "Fun & play", icon: "🎉" },
  logic: { el: "Λογική σκέψη", en: "Logical thinking", icon: "🧩" },
};

function getObjectiveRoutes(ageKey) {
  if (ageKey === "Adult") return adultObjectiveRoutes;
  if (ageKey === "Age 2-3") return age2_3ObjectiveRoutes;
  if (ageKey === "Age 4-5") return age4_5ObjectiveRoutes;
  if (ageKey === "Age 6") return age6ObjectiveRoutes;
  if (ageKey === "Age 7-8") return age7_8ObjectiveRoutes;
  if (ageKey === "Age 9-10") return age9_10ObjectiveRoutes;
  if (ageKey === "Age 11–12" || ageKey === "Age 11-12") return age11_12ObjectiveRoutes;
  return null;
}

export default function ProfileSwitcher({ lang, onSwitch, compact = false, readOnly = false }) {
  const isEl = lang === "el";
  const navigate = useNavigate();
  const { tier } = useSubscription() || { tier: "free" };
  const [profiles, setProfiles] = useState(() => ProfileService.getAll());
  const [active, setActive] = useState(() => ProfileService.getActive());
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [step, setStep] = useState(1); // 1=name, 2=age, 3=objective
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newObjective, setNewObjective] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        if (adding && step === 1 && !newName.trim()) resetAddForm();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [adding, step, newName]);

  const resetAddForm = () => {
    setAdding(false);
    setStep(1);
    setNewName("");
    setNewAge("");
    setNewObjective("");
    setNewAvatar("");
  };

  const handleSwitch = (id) => {
    const p = ProfileService.switchTo(id);
    if (p) {
      if (!p.age) {
        window.location.reload();
        return;
      }
      const routes = getObjectiveRoutes(p.age);
      let target = "/play";
      if (routes && p.objective && routes[p.objective]) {
        target = routes[p.objective];
      } else if (ageToQuizRoute[p.age]) {
        target = ageToQuizRoute[p.age];
      }
      window.location.href = target;
    }
  };

  const handleAdd = () => {
    if (!newName.trim() || !newAge) return;
    if (!FamilyPlanService.canAddMember(tier)) {
      const limit = FamilyPlanService.getMemberLimit(tier);
      window.alert(
        `Έφτασες το όριο των ${limit} προφίλ για το πλάνο σου. ` +
        `Αναβάθμισε σε Family Plan (έως 6 μέλη).`
      );
      navigate("/subscription");
      return;
    }
    const ageVal = newAge;
    const objVal = newObjective || "fun";
    ProfileService.add({
      name: newName.trim(),
      age: ageVal,
      objective: objVal,
      ...(newAvatar ? { avatar: newAvatar } : {}),
    });
    const routes = getObjectiveRoutes(ageVal);
    let target = "/play";
    if (routes && routes[objVal]) {
      target = routes[objVal];
    } else if (ageToQuizRoute[ageVal]) {
      target = ageToQuizRoute[ageVal];
    }
    window.location.href = target;
  };

  const handleRemove = (id, e) => {
    e.stopPropagation();
    const remaining = ProfileService.remove(id);
    setProfiles(remaining);
    setActive(ProfileService.getActive());
  };

  // Read-only mode: just show active child's name (for child view)
  if (readOnly) {
    if (!active) return null;
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold border-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
        <span className="text-base">{active.avatar || "👤"}</span>
        <span className="max-w-[100px] truncate">{active.name}</span>
      </div>
    );
  }

  // Empty state: full add-child wizard
  if (profiles.length === 0) {
    return (
      <div ref={ref}>
        {adding ? (
          <AddChildWizard
            isEl={isEl}
            lang={lang}
            step={step}
            setStep={setStep}
            newName={newName}
            setNewName={setNewName}
            newAge={newAge}
            setNewAge={setNewAge}
            newObjective={newObjective}
            setNewObjective={setNewObjective}
            newAvatar={newAvatar}
            setNewAvatar={setNewAvatar}
            onAdd={handleAdd}
            onCancel={resetAddForm}
          />
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-200/40 dark:shadow-emerald-900/30 transition-all hover:scale-[1.02]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {isEl ? "Προσθήκη παιδιού" : "Add child"}
          </button>
        )}
      </div>
    );
  }

  if (profiles.length === 1 && !open && compact) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold border-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all"
        title={isEl ? "Αλλαγή προφίλ" : "Switch profile"}
      >
        <span className="text-base">{active?.avatar || "👤"}</span>
        <span className="max-w-[80px] truncate">{active?.name || (isEl ? "Προφίλ" : "Profile")}</span>
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-[60]">
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {isEl ? "Προφίλ παιδιών" : "Child profiles"}
            </p>
          </div>

          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSwitch(p.id)}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors ${
                active?.id === p.id ? "bg-indigo-50 dark:bg-indigo-900/20" : ""
              }`}
            >
              <span className="text-xl">{p.avatar || "👤"}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{p.name}</p>
                {(p.age || p.objective) && (
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    {p.age && <>{AGE_ICONS[p.age] || ""} {p.age?.replace("Age ", "")}</>}
                    {p.age && p.objective && " · "}
                    {p.objective && (OBJECTIVE_MAP[p.objective]?.[lang] || p.objective)}
                  </p>
                )}
              </div>
              {active?.id === p.id && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              )}
              {profiles.length > 1 && (
                <button
                  onClick={(e) => handleRemove(p.id, e)}
                  className="w-7 h-7 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors shrink-0"
                  title={isEl ? "Αφαίρεση" : "Remove"}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </button>
          ))}

          <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
            {adding ? (
              <div className="px-3 py-3">
                <AddChildWizard
                  isEl={isEl}
                  lang={lang}
                  step={step}
                  setStep={setStep}
                  newName={newName}
                  setNewName={setNewName}
                  newAge={newAge}
                  setNewAge={setNewAge}
                  newObjective={newObjective}
                  setNewObjective={setNewObjective}
                  newAvatar={newAvatar}
                  setNewAvatar={setNewAvatar}
                  onAdd={handleAdd}
                  onCancel={resetAddForm}
                  inline
                />
              </div>
            ) : (
              <button
                onClick={() => setAdding(true)}
                className="w-full text-left px-4 py-3 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                {isEl ? "Προσθήκη παιδιού" : "Add child"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const AVATAR_CHOICES = ["🦊", "🐼", "🦁", "🐸", "🐶", "🐱", "🐰", "🦄", "🐻", "🐧", "🦋", "🐝"];

function AddChildWizard({
  isEl, lang, step, setStep,
  newName, setNewName, newAge, setNewAge,
  newObjective, setNewObjective,
  newAvatar, setNewAvatar,
  onAdd, onCancel, inline = false,
}) {
  const containerClass = inline
    ? "space-y-3"
    : "bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-emerald-300 dark:border-emerald-700 p-5 space-y-4";

  const stepLabels = {
    1: isEl ? "Βήμα 1: Όνομα" : "Step 1: Name",
    2: isEl ? "Βήμα 2: Ηλικία" : "Step 2: Age",
    3: isEl ? "Βήμα 3: Στόχος" : "Step 3: Goal",
    4: isEl ? "Βήμα 4: Avatar" : "Step 4: Avatar",
  };

  return (
    <div className={containerClass}>
      {/* Progress indicator */}
      <div className="flex items-center gap-1 mb-1">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              s <= step ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-600"
            }`}
          />
        ))}
      </div>
      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{stepLabels[step]}</p>

      {/* Step 1: Name */}
      {step === 1 && (
        <div>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && newName.trim() && setStep(2)}
            placeholder={isEl ? "Όνομα παιδιού..." : "Child's name..."}
            className="w-full px-4 py-3 rounded-xl text-sm border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-400 dark:focus:border-emerald-500"
            autoFocus
          />
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => newName.trim() && setStep(2)}
              disabled={!newName.trim()}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-40 transition-all"
            >
              {isEl ? "Επόμενο →" : "Next →"}
            </button>
            <button
              onClick={onCancel}
              className="px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Age */}
      {step === 2 && (
        <div>
          <div className="grid grid-cols-3 gap-2">
            {AGE_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => { setNewAge(opt.key); setStep(3); }}
                className={`rounded-xl p-2.5 border-2 text-center transition-all ${
                  newAge === opt.key
                    ? "border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 shadow-md"
                    : "border-slate-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20"
                }`}
              >
                <span className="text-lg block">{opt.icon}</span>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">{opt.label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(1)}
            className="mt-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            ← {isEl ? "Πίσω" : "Back"}
          </button>
        </div>
      )}

      {/* Step 3: Objective */}
      {step === 3 && (
        <div>
          <div className="space-y-2">
            {Object.entries(OBJECTIVE_MAP).map(([key, val]) => (
              <button
                key={key}
                onClick={() => { setNewObjective(key); setStep(4); }}
                className={`w-full rounded-xl p-3 border-2 text-left transition-all flex items-center gap-3 ${
                  newObjective === key
                    ? "border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 shadow-md"
                    : "border-slate-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20"
                }`}
              >
                <span className="text-xl">{val.icon}</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{val[lang] || val.en}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(2)}
            className="mt-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            ← {isEl ? "Πίσω" : "Back"}
          </button>
        </div>
      )}

      {/* Step 4: Avatar */}
      {step === 4 && (
        <div>
          <div className="grid grid-cols-4 gap-2">
            {AVATAR_CHOICES.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setNewAvatar(emoji)}
                className={`w-full aspect-square rounded-xl text-2xl flex items-center justify-center transition-all ${
                  newAvatar === emoji
                    ? "bg-emerald-100 dark:bg-emerald-900/40 border-2 border-emerald-500 scale-110 shadow-lg"
                    : "bg-slate-100 dark:bg-slate-700 border-2 border-transparent hover:border-emerald-300 hover:scale-105"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={onAdd}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg"
            >
              {isEl ? "Δημιουργία & Παιχνίδι! 🎮" : "Create & Play! 🎮"}
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-3 py-2.5 rounded-xl text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              ← {isEl ? "Πίσω" : "Back"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
