import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUser, updateProfile } from "firebase/auth";
import { AuthContext } from "../auth/AuthContext";
import { auth } from "../auth/firebase";
import { LanguageContext } from "../i18n/LanguageContext";
import SEO from "../components/SEO";
import { useSubscription } from "../contexts/SubscriptionContext";
import { VoiceService } from "../services/VoiceService";
import { SoundService } from "../services/SoundService";
import { NotificationService } from "../services/NotificationService";
import { ProfileService } from "../services/ProfileService";
import { StorageService } from "../services/StorageService";
import ProfileSwitcher from "../components/ProfileSwitcher";

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

// Matches OnboardingPage teacher step (gradeRange keys: elem, middle, high, all)
const TEACHER_GRADE_OPTIONS = [
  { key: "elem", icon: "📗", color: "from-emerald-400 to-teal-500" },
  { key: "middle", icon: "📘", color: "from-blue-400 to-indigo-500" },
  { key: "high", icon: "📕", color: "from-red-400 to-rose-500" },
  { key: "all", icon: "📚", color: "from-purple-400 to-violet-500" },
];

const AGE_OPTIONS = [
  { key: "Age 2-3", icon: "👶" },
  { key: "Age 4-5", icon: "🧒" },
  { key: "Age 6", icon: "🎒" },
  { key: "Age 7-8", icon: "📖" },
  { key: "Age 9-10", icon: "🔬" },
  { key: "Age 11–12", icon: "🎓" },
  { key: "Adult", icon: "🧠" },
];

const KIDS_OBJECTIVE_MAP = {
  school: { el: "Προετοιμασία για σχολείο", en: "Preparation for school", icon: "🏫" },
  fun: { el: "Διασκέδαση & παιχνίδι", en: "Fun & play", icon: "🎉" },
  logic: { el: "Λογική σκέψη", en: "Logical thinking", icon: "🧩" },
};

const ADULT_OBJECTIVE_MAP = {
  brain: { el: "Εξάσκηση μυαλού", en: "Brain training", icon: "🧠" },
  fun: { el: "Διασκέδαση & παιχνίδι", en: "Fun & play", icon: "🎉" },
  logic: { el: "Λογική σκέψη", en: "Logical thinking", icon: "🧩" },
};

const T = {
  el: {
    title: "Προφίλ & Ρυθμίσεις",
    subtitle: "Διαχειρίσου τα στοιχεία σου",
    profileTab: "Προφίλ",
    accountTab: "Λογαριασμός",
    name: "Όνομα",
    age: "Ηλικιακή ομάδα",
    objective: "Στόχος",
    save: "Αποθήκευση",
    saved: "Αποθηκεύτηκε!",
    email: "Email",
    provider: "Μέθοδος σύνδεσης",
    google: "Google",
    emailPassword: "Email & Κωδικός",
    resetPassword: "Επαναφορά κωδικού",
    resetSent: "Σου στείλαμε email επαναφοράς!",
    exportData: "Εξαγωγή δεδομένων",
    exportDesc: "Κατέβασε αντίγραφο των δεδομένων σου (GDPR)",
    deleteAccount: "Διαγραφή λογαριασμού",
    deleteWarning: "Αυτή η ενέργεια είναι μη αναστρέψιμη",
    deleteConfirmMessage: "Είσαι σίγουρος; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.",
    cancel: "Ακύρωση",
    back: "Πίσω",
    guestWarning: "Ως επισκέπτης δεν μπορείς να αλλάξεις ρυθμίσεις λογαριασμού.",
    signUpToSave: "Εγγράψου για να αποθηκεύσεις την πρόοδό σου",
    memberSince: "Μέλος από",
    soundsTab: "Ήχοι",
    voiceLabel: "Φωνή αφήγησης",
    voiceDesc: "Ενεργοποίηση text-to-speech",
    voiceSpeed: "Ταχύτητα",
    voicePreview: "Δοκιμή",
    sfxLabel: "Εφέ ήχου",
    sfxDesc: "Ήχοι κατά τις ενέργειες",
    quizSoundLabel: "Ήχοι Quiz",
    quizSoundDesc: "Σωστό/λάθος ήχοι στα quiz",
    notifLabel: "Ειδοποιήσεις",
    notifDesc: "Υπενθυμίσεις σερί & αποστολών",
    teacherSettingsTitle: "Ρυθμίσεις δασκάλου",
    schoolLabel: "Σχολείο",
    gradeRangeLabel: "Βαθμίδα μαθητών",
    teacherElem: "Δημοτικό",
    teacherMiddle: "Γυμνάσιο",
    teacherHigh: "Λύκειο",
    teacherAll: "Όλες οι βαθμίδες",
  },
  en: {
    title: "Profile & Settings",
    subtitle: "Manage your details",
    profileTab: "Profile",
    accountTab: "Account",
    name: "Name",
    age: "Age group",
    objective: "Goal",
    save: "Save",
    saved: "Saved!",
    email: "Email",
    provider: "Sign-in method",
    google: "Google",
    emailPassword: "Email & Password",
    resetPassword: "Reset password",
    resetSent: "We sent you a reset email!",
    deleteAccount: "Delete account",
    deleteWarning: "This action is irreversible",
    deleteConfirmMessage: "Are you sure? This action cannot be undone.",
    cancel: "Cancel",
    back: "Back",
    exportData: "Export data",
    exportDesc: "Download a copy of your data (GDPR)",
    guestWarning: "As a guest you can't change account settings.",
    signUpToSave: "Sign up to save your progress",
    memberSince: "Member since",
    soundsTab: "Sounds",
    voiceLabel: "Narration Voice",
    voiceDesc: "Enable text-to-speech",
    voiceSpeed: "Speed",
    voicePreview: "Preview",
    sfxLabel: "Sound Effects",
    sfxDesc: "Sounds during actions",
    quizSoundLabel: "Quiz Sounds",
    quizSoundDesc: "Correct/wrong sounds in quizzes",
    notifLabel: "Notifications",
    notifDesc: "Streak & mission reminders",
    teacherSettingsTitle: "Teacher settings",
    schoolLabel: "School",
    gradeRangeLabel: "Student grade level",
    teacherElem: "Elementary",
    teacherMiddle: "Middle school",
    teacherHigh: "High school",
    teacherAll: "All levels",
  },
};

const teacherGradeLabel = (optKey, tObj) => {
  const map = { elem: tObj.teacherElem, middle: tObj.teacherMiddle, high: tObj.teacherHigh, all: tObj.teacherAll };
  return map[optKey] || optKey;
};

async function hashPin(pin) {
  const encoded = new TextEncoder().encode(pin + "edu-salt-2026");
  const hash = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

const EMOJI_AVATARS = ["🦊", "🐼", "🦁", "🐸", "🐶", "🐱", "🐰", "🦄", "🐻", "🐧", "🦋", "🐝"];

function resizeImageFile(file, maxSize = 128) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext("2d");
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, maxSize, maxSize);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function InlineAvatarPicker({ selectedAvatar, avatarUrl, lang, onSelectEmoji, onPhotoUpload, onClose }) {
  const isEl = lang === "el";
  const [picked, setPicked] = React.useState(selectedAvatar || "");
  const [photoPreview, setPhotoPreview] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const fileRef = React.useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const dataUrl = await resizeImageFile(file, 128);
      setPhotoPreview(dataUrl);
      setPicked("");
    } catch { /* ignore */ } finally { setUploading(false); }
  };

  return (
    <>
      <h2 className="text-xl font-bold text-slate-800 dark:text-white text-center mb-5">
        {isEl ? "Επίλεξε Avatar" : "Choose Avatar"}
      </h2>

      <div className="mb-4">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-purple-400 transition-colors"
        >
          {photoPreview ? (
            <img src={photoPreview} alt="preview" className="w-12 h-12 rounded-xl object-cover" />
          ) : avatarUrl ? (
            <img src={avatarUrl} alt="current" className="w-12 h-12 rounded-xl object-cover opacity-60" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl">📷</div>
          )}
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{isEl ? "Ανέβασε φωτογραφία" : "Upload photo"}</p>
            <p className="text-xs text-slate-400">JPG, PNG</p>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        <span className="text-xs font-semibold text-slate-400 uppercase">{isEl ? "ή" : "or"}</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {EMOJI_AVATARS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => { setPicked(emoji); setPhotoPreview(null); }}
            className={`w-16 h-16 rounded-2xl text-3xl flex items-center justify-center transition-all ${
              picked === emoji && !photoPreview
                ? "bg-purple-100 dark:bg-purple-900/50 border-2 border-purple-500 scale-110 shadow-lg"
                : "bg-slate-100 dark:bg-slate-700 border-2 border-transparent hover:border-purple-300 hover:scale-105"
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-300 transition-colors">
          {isEl ? "Κλείσιμο" : "Close"}
        </button>
        {photoPreview ? (
          <button type="button" onClick={() => onPhotoUpload(photoPreview)} className="flex-1 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition-transform shadow-lg">
            {isEl ? "Επιλογή" : "Select"}
          </button>
        ) : (
          <button type="button" onClick={() => { if (picked) onSelectEmoji(picked); }} disabled={!picked} className="flex-1 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:hover:scale-100">
            {isEl ? "Επιλογή" : "Select"}
          </button>
        )}
      </div>
    </>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, guest, userProfile, saveUserProfile, resetPassword, logout, beginGuest } = useContext(AuthContext);
  const { t, lang } = useContext(LanguageContext);
  const l = T[lang] || T.en;
  const isEl = lang === "el";
  const isGuest = !!guest && !user;
  const { isPremium, tier, unsubscribe } = useSubscription();

  const isParent = userProfile?.role === "parent";
  const isTeacher = userProfile?.role === "teacher";
  const activeChild = isTeacher ? null : ProfileService.getActive();
  const isChildView = !!activeChild;

  const [parentUnlocked, setParentUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  useEffect(() => {
    if (parentUnlocked && isChildView) {
      StorageService.setScope(null);
      return () => {
        const aid = ProfileService.getActiveId();
        if (aid) StorageService.setScope(aid);
      };
    }
  }, [parentUnlocked, isChildView]);

  const [tab, setTab] = useState("profile");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(() => userProfile?.avatar || null);
  const [name, setName] = useState(userProfile?.name || user?.displayName || "");
  const [age, setAge] = useState(userProfile?.age || guest?.age || "");
  const [objective, setObjective] = useState(userProfile?.objective || guest?.objective || "");
  const [schoolName, setSchoolName] = useState(userProfile?.schoolName || "");
  const [gradeRange, setGradeRange] = useState(userProfile?.gradeRange || "");
  const [teacherSettingsSaved, setTeacherSettingsSaved] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Sound settings state (synced when opening Sounds tab)
  const [voiceEnabled, setVoiceEnabled] = useState(() => VoiceService.isEnabled());
  const [voiceRate, setVoiceRate] = useState(() => VoiceService.getRate());
  const [sfxEnabled, setSfxEnabled] = useState(() => SoundService.isEnabled());
  const [quizMuted, setQuizMuted] = useState(() => localStorage.getItem("geo:quiz:muted") === "true");
  const [notifEnabled, setNotifEnabled] = useState(() => NotificationService.isEnabled());

  useEffect(() => {
    if (isTeacher) {
      setSchoolName(userProfile?.schoolName || "");
      setGradeRange(userProfile?.gradeRange || "");
    }
  }, [isTeacher, userProfile?.schoolName, userProfile?.gradeRange]);

  useEffect(() => {
    if (tab === "sounds") {
      setVoiceEnabled(VoiceService.isEnabled());
      setVoiceRate(VoiceService.getRate());
      setSfxEnabled(SoundService.isEnabled());
      setQuizMuted(localStorage.getItem("geo:quiz:muted") === "true");
    }
  }, [tab]);

  const displayEmail = user?.email || "";
  const isGoogle = user?.providerData?.[0]?.providerId === "google.com";
  const avatarUrl = userProfile?.customPhoto || user?.photoURL || null;
  const initials = (name || displayEmail?.split("@")[0] || "?").slice(0, 2).toUpperCase();
  const createdAt = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString(lang === "el" ? "el-GR" : "en-US", { year: "numeric", month: "long" })
    : null;

  const prevAge = userProfile?.age || guest?.age || "";
  const prevObjective = userProfile?.objective || guest?.objective || "";

  const handleSave = () => {
    saveUserProfile({ name: name.trim(), age, objective, ...(selectedAvatar ? { avatar: selectedAvatar } : {}) });

    const ageChanged = age !== prevAge;
    const objectiveChanged = objective !== prevObjective;

    if (isGuest && (ageChanged || objectiveChanged)) {
      beginGuest({ age, objective, minutes: 10, plays: 2 });

      const routes = getObjectiveRoutes(age);
      if (routes && routes[objective]) {
        navigate(routes[objective]);
      } else {
        navigate(ageToQuizRoute[age] || "/play");
      }
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTeacherSettingsSave = () => {
    saveUserProfile({ ...(userProfile || {}), schoolName: schoolName.trim(), gradeRange });
    setTeacherSettingsSaved(true);
    setTimeout(() => setTeacherSettingsSaved(false), 2000);
  };

  const handleResetPassword = async () => {
    if (displayEmail) {
      await resetPassword(displayEmail);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 3000);
    }
  };

  const handleExportData = () => {
    const prefixes = ["geo:", "progress:", "stats:", "achievements:", "edu:"];
    const collected = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && prefixes.some((p) => key.startsWith(p))) {
        try {
          const raw = localStorage.getItem(key);
          collected[key] = raw ? JSON.parse(raw) : raw;
        } catch {
          collected[key] = localStorage.getItem(key);
        }
      }
    }
    const data = {
      exportedAt: new Date().toISOString(),
      user: {
        email: displayEmail,
        name: name || user?.displayName || "",
        age: age || "",
      },
      localStorage: collected,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-data-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleVoiceToggle = () => {
    const next = VoiceService.toggle();
    setVoiceEnabled(next);
  };

  const handleVoiceRateChange = (e) => {
    const val = parseFloat(e.target.value);
    VoiceService.setRate(val);
    setVoiceRate(val);
  };

  const handleVoicePreview = () => {
    const sample = lang === "el" ? "Γεια σου! Αυτή είναι μια δοκιμή φωνής." : "Hello! This is a voice preview.";
    VoiceService.speakCustom(sample, { lang, rate: voiceRate });
  };

  const handleSfxToggle = () => {
    const next = SoundService.toggle();
    setSfxEnabled(next);
  };

  const handleSfxPreview = () => {
    const was = SoundService.isEnabled();
    if (!was) { SoundService.toggle(); setSfxEnabled(true); }
    SoundService.correct();
    if (!was) {
      setTimeout(() => { SoundService.toggle(); setSfxEnabled(false); }, 600);
    }
  };

  const handleQuizSoundsToggle = () => {
    const next = !quizMuted;
    setQuizMuted(next);
    localStorage.setItem("geo:quiz:muted", next ? "true" : "false");
  };

  const handleDeleteAccount = async () => {
    setDeleteError(null);
    try {
      await deleteUser(auth.currentUser);
      localStorage.removeItem("geo:userProfile");
      localStorage.removeItem("geo:guestProfile");
      localStorage.removeItem("geo:errorLog");
      localStorage.removeItem("geo:parentPin");
      await logout();
      navigate("/");
    } catch (err) {
      setDeleteError(err?.message || String(err));
    }
  };

  // Child-friendly read-only view (parent must enter PIN to manage)
  if (isChildView && !parentUnlocked) {
    const storedPin = localStorage.getItem("geo:parentPin");
    return (
      <ChildReadOnlyView
        child={activeChild}
        lang={lang}
        isEl={isEl}
        navigate={navigate}
        storedPin={storedPin}
        pinInput={pinInput}
        setPinInput={setPinInput}
        pinError={pinError}
        setPinError={setPinError}
        onUnlock={() => setParentUnlocked(true)}
      />
    );
  }

  return (
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 py-10 px-4">
      <SEO title={l.title} />
      <div className="mx-auto max-w-2xl">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {l.back}
        </button>

        {/* PIN setup reminder for parents */}
        {isParent && !localStorage.getItem("geo:parentPin") && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-200 dark:border-amber-700 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <span className="text-2xl shrink-0">🔐</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-800 dark:text-amber-200">
                {isEl ? "Ορίστε ένα PIN γονέα" : "Set a parent PIN"}
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                {isEl
                  ? "Χωρίς PIN, τα παιδιά μπορούν να αλλάξουν ρυθμίσεις. Ορίστε ένα 4ψήφιο PIN στον Πίνακα Γονέα."
                  : "Without a PIN, children can change settings. Set a 4-digit PIN in the Parent Dashboard."}
              </p>
            </div>
            <button
              onClick={() => navigate("/parent-dashboard")}
              className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-800/40 hover:bg-amber-200 dark:hover:bg-amber-800/60 transition-colors"
            >
              {isEl ? "Ρύθμιση →" : "Set up →"}
            </button>
          </div>
        )}

        {/* Header card */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 rounded-3xl p-8 text-white mb-6 relative overflow-visible">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute -left-6 -bottom-6 w-28 h-28 bg-white/5 rounded-full pointer-events-none" />

          <div className="relative flex items-center gap-5">
            <div className="flex flex-col items-center gap-2">
              <div
                onClick={() => setShowAvatarPicker(true)}
                className="w-20 h-20 rounded-2xl border-4 border-white/30 shadow-lg overflow-hidden flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
              >
                {selectedAvatar ? (
                  <div className="w-full h-full bg-white/20 backdrop-blur flex items-center justify-center text-4xl">
                    {selectedAvatar}
                  </div>
                ) : avatarUrl ? (
                  <img src={avatarUrl} alt={`${name || "User"} avatar`} loading="lazy" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-bold">
                    {initials}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarPicker(p => !p)}
                className="px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium transition-colors flex items-center gap-1"
              >
                ✏️ {lang === "el" ? "Αλλαγή" : "Edit"}
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{name || displayEmail?.split("@")[0] || (lang === "el" ? "Επισκέπτης" : "Guest")}</h1>
              {displayEmail && <p className="text-purple-200 text-sm mt-1">{displayEmail}</p>}
              {createdAt && <p className="text-purple-300 text-xs mt-1">{l.memberSince} {createdAt}</p>}
              {isGuest && (
                <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {lang === "el" ? "Επισκέπτης" : "Guest"}
                </span>
              )}
            </div>
          </div>
        </div>

        {showAvatarPicker && (
          <div
            className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
            style={{ zIndex: 99999 }}
            onClick={() => setShowAvatarPicker(false)}
          >
            <div
              className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-sm w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <InlineAvatarPicker
                selectedAvatar={selectedAvatar}
                avatarUrl={avatarUrl}
                lang={lang}
                onSelectEmoji={(emoji) => {
                  setSelectedAvatar(emoji);
                  saveUserProfile({ ...(userProfile || {}), name: name.trim(), age, objective, avatar: emoji, customPhoto: null });
                  if (user) updateProfile(user, { photoURL: "" }).catch(() => {});
                  setShowAvatarPicker(false);
                }}
                onPhotoUpload={(dataUrl) => {
                  setSelectedAvatar(null);
                  saveUserProfile({ ...(userProfile || {}), name: name.trim(), age, objective, avatar: null, customPhoto: dataUrl });
                  if (user) updateProfile(user, { photoURL: dataUrl }).catch(() => {});
                  setShowAvatarPicker(false);
                }}
                onClose={() => setShowAvatarPicker(false)}
              />
            </div>
          </div>
        )}

        {/* Tabs */}
        <div
          role="tablist"
          aria-label={lang === "el" ? "Ρυθμίσεις Προφίλ" : "Profile Settings"}
          className="flex gap-1 bg-white/60 dark:bg-slate-800/60 backdrop-blur rounded-2xl p-1 mb-6 shadow-sm border border-white/80 dark:border-slate-600/50"
          onKeyDown={(e) => {
            const tabs = ["profile", "account", "sounds"];
            const idx = tabs.indexOf(tab);
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
              e.preventDefault();
              const next = tabs[(idx + 1) % tabs.length];
              setTab(next);
              document.getElementById(`tab-${next}`)?.focus();
            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
              e.preventDefault();
              const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
              setTab(prev);
              document.getElementById(`tab-${prev}`)?.focus();
            } else if (e.key === "Home") {
              e.preventDefault();
              setTab("profile");
              document.getElementById("tab-profile")?.focus();
            } else if (e.key === "End") {
              e.preventDefault();
              setTab("sounds");
              document.getElementById("tab-sounds")?.focus();
            }
          }}
        >
          {["profile", "account", "sounds"].map((t_) => (
            <button
              key={t_}
              role="tab"
              tabIndex={tab === t_ ? 0 : -1}
              aria-selected={tab === t_}
              aria-controls={`tabpanel-${t_}`}
              id={`tab-${t_}`}
              onClick={() => setTab(t_)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                tab === t_
                  ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-md"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              {t_ === "profile" ? l.profileTab : t_ === "account" ? l.accountTab : l.soundsTab}
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {tab === "profile" && (
          <div role="tabpanel" id="tabpanel-profile" aria-labelledby="tab-profile" className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 space-y-6 border border-slate-100 dark:border-slate-700">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{l.name}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/50 outline-none transition-all text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{l.age}</label>
              <div className="grid grid-cols-4 gap-2">
                {AGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setAge(opt.key)}
                    className={`rounded-xl p-3 border-2 text-center transition-all ${
                      age === opt.key
                        ? "border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/30 shadow-md"
                        : "border-slate-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/20"
                    }`}
                  >
                    <span className="text-xl block mb-1">{opt.icon}</span>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t(opt.key, opt.key)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Objective */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{l.objective}</label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(age === "Adult" ? ADULT_OBJECTIVE_MAP : KIDS_OBJECTIVE_MAP).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setObjective(key)}
                    className={`rounded-xl p-4 border-2 text-center transition-all ${
                      objective === key
                        ? "border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/30 shadow-md"
                        : "border-slate-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/20"
                    }`}
                  >
                    <span className="text-2xl block mb-1">{val.icon}</span>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{val[lang] || val.en}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-200 dark:shadow-purple-900/30 disabled:opacity-40 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {saved ? (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {l.saved}
                </>
              ) : (
                l.save
              )}
            </button>
          </div>
        )}

        {/* Teacher: school + grade range */}
        {tab === "profile" && user && isTeacher && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700 mt-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
              <span>🏫</span>
              {l.teacherSettingsTitle}
            </h3>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {l.schoolLabel}
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/50 outline-none transition-all text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {l.gradeRangeLabel}
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {TEACHER_GRADE_OPTIONS.map((g) => (
                  <button
                    key={g.key}
                    type="button"
                    onClick={() => setGradeRange(g.key)}
                    className={`relative rounded-xl p-3 border-2 text-left transition-all ${
                      gradeRange === g.key
                        ? "border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/30 shadow-md"
                        : "border-slate-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/20"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg bg-gradient-to-br ${g.color} flex items-center justify-center text-base mb-1.5 shadow-sm`}
                    >
                      {g.icon}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {teacherGradeLabel(g.key, l)}
                    </span>
                    {gradeRange === g.key && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={handleTeacherSettingsSave}
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-200 dark:shadow-purple-900/30 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {teacherSettingsSaved ? (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {l.saved}
                </>
              ) : (
                l.save
              )}
            </button>
          </div>
        )}

        {/* Parent tools section */}
        {tab === "profile" && user && isParent && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 mt-6 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <span>🛠️</span>
              {isEl ? "Εργαλεία Γονέα" : "Parent Tools"}
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                onClick={() => navigate("/parent-dashboard")}
                className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all text-left group"
              >
                <span className="text-3xl shrink-0">📊</span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                    {isEl ? "Γονικός Πίνακας Ελέγχου" : "Parent Dashboard"}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {isEl
                      ? "Πρόοδος, στατιστικά, PIN & ρυθμίσεις"
                      : "Progress, stats, PIN & settings"}
                  </p>
                </div>
                <svg className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-purple-400 transition-colors shrink-0 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={() => navigate("/weekly-report")}
                className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all text-left group"
              >
                <span className="text-3xl shrink-0">📋</span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                    {isEl ? "Εβδομαδιαίες Αναφορές" : "Weekly Reports"}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {isEl
                      ? "Σύνοψη προόδου & φύλλα εξάσκησης"
                      : "Progress summary & practice worksheets"}
                  </p>
                </div>
                <svg className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

          </div>
        )}

        {/* Child profiles section (for parents) */}
        {tab === "profile" && user && userProfile?.role === "parent" && (
          <ChildProfilesManager lang={lang} isEl={isEl} />
        )}

        {/* Child profiles section (for non-parent, non-teacher logged-in users) */}
        {tab === "profile" && user && userProfile?.role !== "parent" && !isTeacher && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700 mt-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
              <span>👨‍👩‍👧‍👦</span>
              {isEl ? "Προφίλ παιδιών" : "Child profiles"}
            </h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">
              {isEl
                ? "Πρόσθεσε ξεχωριστά προφίλ για κάθε παιδί. Η πρόοδος αποθηκεύεται ξεχωριστά."
                : "Add separate profiles for each child. Progress is tracked independently."}
            </p>
            <ProfileSwitcher lang={lang} onSwitch={() => window.location.reload()} />
          </div>
        )}

        {/* Subscription section */}
        {tab === "account" && (
          <div role="tabpanel" id="tabpanel-account" aria-labelledby="tab-account" className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700 mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <span>⭐</span>
              {lang === "el" ? "Συνδρομή" : "Subscription"}
            </h3>
            {isPremium ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold">
                    {tier === "family" ? (lang === "el" ? "Οικογενειακό" : "Family") : "Premium"}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {lang === "el" ? "Ενεργή συνδρομή" : "Active subscription"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate("/subscription")}
                    className="px-4 py-2 text-sm rounded-xl font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    {lang === "el" ? "Διαχείριση" : "Manage"}
                  </button>
                  <button
                    onClick={unsubscribe}
                    className="px-4 py-2 text-sm rounded-xl font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    {lang === "el" ? "Ακύρωση" : "Cancel"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-sm font-medium">
                    {lang === "el" ? "Δωρεάν πλάνο" : "Free plan"}
                  </span>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                    {lang === "el" ? "5 παιχνίδια ανά κατηγορία" : "5 games per category"}
                  </p>
                </div>
                <button
                  onClick={() => navigate("/subscription")}
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-300/30 dark:shadow-amber-900/30 transition-all hover:scale-[1.02] active:scale-95"
                >
                  {lang === "el" ? "Αναβάθμιση" : "Upgrade"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Account tab */}
        {tab === "account" && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 space-y-6 border border-slate-100 dark:border-slate-700">
            {isGuest ? (
              <div className="text-center py-8">
                <span className="text-5xl block mb-4">👤</span>
                <p className="text-slate-500 dark:text-slate-400 mb-4">{l.guestWarning}</p>
                <button
                  onClick={() => navigate("/auth?mode=register")}
                  className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-200 dark:shadow-purple-900/30 transition-all active:scale-95"
                >
                  {l.signUpToSave}
                </button>
              </div>
            ) : (
              <>
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{l.email}</label>
                  <div className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm">
                    {displayEmail || "—"}
                  </div>
                </div>

                {/* Provider */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{l.provider}</label>
                  <div className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm flex items-center gap-2">
                    {isGoogle ? (
                      <>
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        {l.google}
                      </>
                    ) : (
                      <>📧 {l.emailPassword}</>
                    )}
                  </div>
                </div>

                {/* Reset password */}
                {!isGoogle && (
                  <div>
                    <button
                      onClick={handleResetPassword}
                      className="w-full py-3 rounded-xl font-semibold text-purple-700 dark:text-purple-300 border-2 border-purple-200 dark:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-400 dark:hover:border-purple-500 transition-all"
                    >
                      {resetSent ? (
                        <span className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {l.resetSent}
                        </span>
                      ) : (
                        l.resetPassword
                      )}
                    </button>
                  </div>
                )}

                {/* Export my data (GDPR) */}
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-2">{l.exportDesc}</p>
                  <button
                    onClick={handleExportData}
                    className="w-full py-3 rounded-xl font-semibold text-emerald-700 dark:text-emerald-400 border-2 border-emerald-200 dark:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all"
                  >
                    {l.exportData}
                  </button>
                </div>

                {/* Danger zone */}
                <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full py-3 rounded-xl font-semibold text-red-500 dark:text-red-400 border-2 border-red-200 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-300 dark:hover:border-red-500 transition-all"
                  >
                    {l.deleteAccount}
                  </button>
                  <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-2">{l.deleteWarning}</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Sounds tab */}
        {tab === "sounds" && (
          <div role="tabpanel" id="tabpanel-sounds" aria-labelledby="tab-sounds" className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 space-y-6 border border-slate-100 dark:border-slate-700">
            {/* Voice TTS */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl shrink-0">🗣️</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{l.voiceLabel}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{l.voiceDesc}</p>
                </div>
              </div>
              <button
                onClick={handleVoiceToggle}
                className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${voiceEnabled ? "bg-purple-500" : "bg-slate-300 dark:bg-slate-600"}`}
                aria-label={l.voiceLabel}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${voiceEnabled ? "translate-x-5" : ""}`} />
              </button>
            </div>

            {/* Voice speed + preview */}
            {voiceEnabled && (
              <div className="pl-4 space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">
                    {l.voiceSpeed}: {voiceRate.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={voiceRate}
                    onChange={handleVoiceRateChange}
                    className="w-full accent-purple-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                    <span>0.5x</span>
                    <span>1.0x</span>
                    <span>1.5x</span>
                    <span>2.0x</span>
                  </div>
                </div>
                <button
                  onClick={handleVoicePreview}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {l.voicePreview}
                </button>
              </div>
            )}

            {/* Sound effects */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl shrink-0">🔊</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{l.sfxLabel}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{l.sfxDesc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleSfxPreview}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-slate-600 hover:bg-slate-100 dark:hover:bg-slate-500 flex items-center justify-center text-sm transition-colors"
                  title={l.voicePreview}
                >
                  <svg className="w-4 h-4 text-slate-500 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                </button>
                <button
                  onClick={handleSfxToggle}
                  className={`relative w-12 h-7 rounded-full transition-colors ${sfxEnabled ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`}
                  aria-label={l.sfxLabel}
                >
                  <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${sfxEnabled ? "translate-x-5" : ""}`} />
                </button>
              </div>
            </div>

            {/* Quiz sounds */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl shrink-0">🎵</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{l.quizSoundLabel}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{l.quizSoundDesc}</p>
                </div>
              </div>
              <button
                onClick={handleQuizSoundsToggle}
                className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${!quizMuted ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-600"}`}
                aria-label={l.quizSoundLabel}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${!quizMuted ? "translate-x-5" : ""}`} />
              </button>
            </div>

            {/* Notifications */}
            {NotificationService.isSupported() && (
              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0">🔔</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{l.notifLabel}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{l.notifDesc}</p>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    if (notifEnabled) {
                      await NotificationService.disable();
                      setNotifEnabled(false);
                    } else {
                      const granted = await NotificationService.requestPermission();
                      setNotifEnabled(granted);
                    }
                  }}
                  className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${notifEnabled ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-600"}`}
                  aria-label={l.notifLabel}
                >
                  <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${notifEnabled ? "translate-x-5" : ""}`} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete account confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
            {deleteError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                {deleteError}
              </div>
            )}
            <p className="text-slate-700 dark:text-slate-200 font-medium">{l.deleteConfirmMessage}</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteError(null); }}
                className="flex-1 py-2.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
              >
                {l.cancel}
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 transition-all"
              >
                {l.deleteAccount}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const CHILD_OBJECTIVE_LABELS = {
  school: { el: "Σχολείο", en: "School", icon: "🏫" },
  fun: { el: "Διασκέδαση", en: "Fun", icon: "🎉" },
  logic: { el: "Λογική", en: "Logic", icon: "🧩" },
};

function ChildReadOnlyView({ child, lang, isEl, navigate, storedPin, pinInput, setPinInput, pinError, setPinError, onUnlock }) {
  const [showPinForm, setShowPinForm] = useState(false);

  const handlePinSubmit = async () => {
    if (!storedPin) {
      onUnlock();
      return;
    }
    const hashed = await hashPin(pinInput);
    if (hashed === storedPin) {
      setPinError(false);
      onUnlock();
    } else {
      setPinError(true);
      setPinInput("");
    }
  };

  const objLabel = child.objective ? (CHILD_OBJECTIVE_LABELS[child.objective]?.[lang] || child.objective) : null;
  const objIcon = child.objective ? (CHILD_OBJECTIVE_LABELS[child.objective]?.icon || "") : "";

  return (
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center px-4 py-10">
      <SEO title={child.name} />
      <div className="w-full max-w-md">
        {/* Child avatar card */}
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full" />
          <div className="relative">
            <div className="w-24 h-24 mx-auto rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-5xl border-4 border-white/30 shadow-lg mb-4">
              {child.avatar || "👤"}
            </div>
            <h1 className="text-3xl font-bold mb-1">{child.name}</h1>
            <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
              {child.age && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium">
                  {child.age.replace("Age ", "")} {isEl ? "χρονών" : "years"}
                </span>
              )}
              {objLabel && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium">
                  {objIcon} {objLabel}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Play button */}
        <button
          onClick={() => {
            const routes = getObjectiveRoutes(child.age);
            if (routes && child.objective && routes[child.objective]) {
              window.location.href = routes[child.objective];
            } else {
              window.location.href = ageToQuizRoute[child.age] || "/play";
            }
          }}
          className="w-full mt-6 py-4 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-xl shadow-emerald-200/40 dark:shadow-emerald-900/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
        >
          🎮 {isEl ? "Ας παίξουμε!" : "Let's play!"}
        </button>

        {/* Parent area (locked) */}
        <div className="mt-8 text-center">
          {showPinForm ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-100 dark:border-slate-700">
              <div className="text-4xl mb-3">🔐</div>
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-200 mb-1">
                {isEl ? "Περιοχή Γονέα" : "Parent Area"}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
                {storedPin
                  ? (isEl ? "Εισάγετε το PIN γονέα για πρόσβαση" : "Enter parent PIN to access")
                  : (isEl ? "Δεν έχει οριστεί PIN — πάτα για να μπεις" : "No PIN set — press to enter")}
              </p>
              {storedPin ? (
                <>
                  <input
                    type="password"
                    maxLength={4}
                    value={pinInput}
                    onChange={(e) => { setPinInput(e.target.value.replace(/\D/g, "")); setPinError(false); }}
                    onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
                    className={`w-28 text-center text-2xl tracking-[0.5em] border-2 rounded-xl py-3 mb-3 focus:outline-none ${
                      pinError
                        ? "border-red-400 bg-red-50 dark:bg-red-900/20"
                        : "border-slate-200 dark:border-slate-600 focus:border-purple-400"
                    }`}
                    placeholder="····"
                    autoFocus
                  />
                  {pinError && (
                    <p className="text-xs text-red-500 mb-2">{isEl ? "Λάθος PIN" : "Wrong PIN"}</p>
                  )}
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={handlePinSubmit}
                      className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-sm active:scale-95"
                    >
                      {isEl ? "Είσοδος" : "Enter"}
                    </button>
                    <button
                      onClick={() => { setShowPinForm(false); setPinInput(""); setPinError(false); }}
                      className="px-5 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-semibold text-sm"
                    >
                      {isEl ? "Ακύρωση" : "Cancel"}
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={onUnlock}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-sm active:scale-95"
                >
                  {isEl ? "Μπες ως γονέας" : "Enter as parent"}
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowPinForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all"
            >
              🔒 {isEl ? "Περιοχή γονέα" : "Parent area"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const CHILD_AGE_OPTIONS = [
  { key: "Age 2-3", icon: "👶" },
  { key: "Age 4-5", icon: "🧒" },
  { key: "Age 6", icon: "🎒" },
  { key: "Age 7-8", icon: "📖" },
  { key: "Age 9-10", icon: "🔬" },
  { key: "Age 11–12", icon: "🎓" },
];

const CHILD_OBJECTIVE_MAP = {
  school: { el: "Σχολείο", en: "School", icon: "🏫" },
  fun: { el: "Διασκέδαση", en: "Fun", icon: "🎉" },
  logic: { el: "Λογική", en: "Logic", icon: "🧩" },
};

function ChildProfilesManager({ lang, isEl }) {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState(() => ProfileService.getAll());
  const [adding, setAdding] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newObjective, setNewObjective] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [savedId, setSavedId] = useState(null);

  const refreshProfiles = () => setProfiles(ProfileService.getAll());

  const resetAddForm = () => {
    setAdding(false);
    setAddStep(1);
    setNewName("");
    setNewAge("");
    setNewObjective("");
    setNewAvatar("");
  };

  const handleAdd = () => {
    if (!newName.trim() || !newAge) return;
    const ageVal = newAge;
    const objVal = newObjective || "fun";
    ProfileService.add({ name: newName.trim(), age: ageVal, objective: objVal, ...(newAvatar ? { avatar: newAvatar } : {}) });
    const routes = getObjectiveRoutes(ageVal);
    let target = "/play";
    if (routes && routes[objVal]) {
      target = routes[objVal];
    } else if (ageToQuizRoute[ageVal]) {
      target = ageToQuizRoute[ageVal];
    }
    window.location.href = target;
  };

  const handleUpdate = (id) => {
    const p = profiles.find((pr) => pr.id === id);
    if (!p) return;
    ProfileService.update(id, { name: p.name, age: p.age, objective: p.objective });
    setSavedId(id);
    setTimeout(() => setSavedId(null), 2000);
    setEditingId(null);
  };

  const handleRemove = (id) => {
    ProfileService.remove(id);
    refreshProfiles();
    if (editingId === id) setEditingId(null);
  };

  const updateField = (id, field, value) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const hasProfiles = profiles.length > 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 mt-6 overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <span>👨‍👩‍👧‍👦</span>
            {isEl ? "Προφίλ παιδιών" : "Child profiles"}
          </h3>
          {hasProfiles && !adding && (
            <button
              onClick={() => setAdding(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              {isEl ? "Προσθήκη" : "Add"}
            </button>
          )}
        </div>
        <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">
          {isEl
            ? "Δημιούργησε ξεχωριστά προφίλ για κάθε παιδί. Η πρόοδος αποθηκεύεται ξεχωριστά."
            : "Create separate profiles for each child. Progress is tracked independently."}
        </p>

        {!hasProfiles && !adding && (
          <div className="text-center py-8">
            <span className="text-5xl block mb-3">👶</span>
            <h4 className="text-base font-bold text-slate-700 dark:text-slate-200 mb-2">
              {isEl ? "Δεν υπάρχουν παιδικά προφίλ" : "No child profiles yet"}
            </h4>
            <p className="text-sm text-slate-400 dark:text-slate-500 mb-5">
              {isEl
                ? "Πρόσθεσε το πρώτο παιδί για να παρακολουθείς την πρόοδό του."
                : "Add your first child to start tracking their progress."}
            </p>
            <button
              onClick={() => setAdding(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-200/40 dark:shadow-emerald-900/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              {isEl ? "Προσθήκη παιδιού" : "Add child"}
            </button>
          </div>
        )}

        {/* Existing child profiles */}
        <div className="space-y-4">
          {profiles.map((child) => {
            const isEditing = editingId === child.id;
            const justSaved = savedId === child.id;
            return (
              <div
                key={child.id}
                className={`rounded-2xl border-2 p-5 transition-all ${
                  isEditing
                    ? "border-purple-300 dark:border-purple-600 bg-purple-50/50 dark:bg-purple-900/10"
                    : "border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/30"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{child.avatar || "👤"}</span>
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <input
                        type="text"
                        value={child.name}
                        onChange={(e) => updateField(child.id, "name", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-sm font-semibold border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-purple-400"
                      />
                    ) : (
                      <p className="text-base font-bold text-slate-800 dark:text-slate-100 truncate">{child.name}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 dark:text-slate-500">
                      {child.age && <span>{child.age}</span>}
                      {child.age && child.objective && <span>·</span>}
                      {child.objective && (
                        <span>{CHILD_OBJECTIVE_MAP[child.objective]?.[lang] || child.objective}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleUpdate(child.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-500 text-white hover:bg-purple-600 transition-colors active:scale-95"
                        >
                          {isEl ? "Αποθήκευση" : "Save"}
                        </button>
                        <button
                          onClick={() => { setEditingId(null); refreshProfiles(); }}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                        >
                          {isEl ? "Ακύρωση" : "Cancel"}
                        </button>
                      </>
                    ) : (
                      <>
                        {justSaved && (
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mr-2">
                            ✓ {isEl ? "Αποθηκεύτηκε" : "Saved"}
                          </span>
                        )}
                        <button
                          onClick={() => setEditingId(child.id)}
                          className="w-8 h-8 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                          title={isEl ? "Επεξεργασία" : "Edit"}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleRemove(child.id)}
                          className="w-8 h-8 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors"
                          title={isEl ? "Αφαίρεση" : "Remove"}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="space-y-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        {isEl ? "Ηλικιακή ομάδα" : "Age group"}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {CHILD_AGE_OPTIONS.map((opt) => (
                          <button
                            key={opt.key}
                            onClick={() => updateField(child.id, "age", opt.key)}
                            className={`rounded-xl px-3 py-2 border-2 text-center transition-all text-xs ${
                              child.age === opt.key
                                ? "border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/30 font-bold"
                                : "border-slate-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-500"
                            }`}
                          >
                            <span className="mr-1">{opt.icon}</span>
                            {opt.key.replace("Age ", "")}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        {isEl ? "Στόχος" : "Goal"}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(CHILD_OBJECTIVE_MAP).map(([key, val]) => (
                          <button
                            key={key}
                            onClick={() => updateField(child.id, "objective", key)}
                            className={`rounded-xl px-4 py-2 border-2 text-center transition-all text-xs ${
                              child.objective === key
                                ? "border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/30 font-bold"
                                : "border-slate-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-500"
                            }`}
                          >
                            <span className="mr-1">{val.icon}</span>
                            {val[lang] || val.en}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add new child wizard */}
        {adding && (
          <div className="mt-4 rounded-2xl border-2 border-dashed border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-900/10 p-5">
            <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2">
              <span>➕</span>
              {isEl ? "Νέο παιδικό προφίλ" : "New child profile"}
            </h4>

            {/* Progress bar */}
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= addStep ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-600"}`} />
              ))}
            </div>

            {/* Step 1: Name */}
            {addStep === 1 && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {isEl ? "Βήμα 1: Πώς λέγεται το παιδί;" : "Step 1: What's your child's name?"}
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && newName.trim() && setAddStep(2)}
                  placeholder={isEl ? "Όνομα παιδιού..." : "Child's name..."}
                  className="w-full px-4 py-3 rounded-xl text-sm border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-400 dark:focus:border-emerald-500"
                  autoFocus
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => newName.trim() && setAddStep(2)}
                    disabled={!newName.trim()}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-40 transition-all active:scale-95"
                  >
                    {isEl ? "Επόμενο →" : "Next →"}
                  </button>
                  <button onClick={resetAddForm} className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                    {isEl ? "Ακύρωση" : "Cancel"}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Age group */}
            {addStep === 2 && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {isEl ? `Βήμα 2: Ηλικία ${newName}` : `Step 2: ${newName}'s age group`}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CHILD_AGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => { setNewAge(opt.key); setAddStep(3); }}
                      className={`rounded-xl p-3 border-2 text-center transition-all ${
                        newAge === opt.key
                          ? "border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 shadow-md"
                          : "border-slate-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20"
                      }`}
                    >
                      <span className="text-xl block mb-1">{opt.icon}</span>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{opt.key.replace("Age ", "")}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setAddStep(1)} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  ← {isEl ? "Πίσω" : "Back"}
                </button>
              </div>
            )}

            {/* Step 3: Goal */}
            {addStep === 3 && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {isEl ? `Βήμα 3: Στόχος για ${newName}` : `Step 3: Goal for ${newName}`}
                </label>
                <div className="space-y-2">
                  {Object.entries(CHILD_OBJECTIVE_MAP).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => { setNewObjective(key); setAddStep(4); }}
                      className={`w-full rounded-xl p-4 border-2 text-left transition-all flex items-center gap-3 ${
                        newObjective === key
                          ? "border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 shadow-md"
                          : "border-slate-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20"
                      }`}
                    >
                      <span className="text-2xl">{val.icon}</span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{val[lang] || val.en}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setAddStep(2)} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  ← {isEl ? "Πίσω" : "Back"}
                </button>
              </div>
            )}

            {/* Step 4: Avatar */}
            {addStep === 4 && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {isEl ? `Βήμα 4: Avatar για ${newName}` : `Step 4: Avatar for ${newName}`}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["🦊", "🐼", "🦁", "🐸", "🐶", "🐱", "🐰", "🦄", "🐻", "🐧", "🦋", "🐝"].map((emoji) => (
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
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={handleAdd}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg active:scale-95"
                  >
                    {isEl ? "Δημιουργία & Παιχνίδι! 🎮" : "Create & Play! 🎮"}
                  </button>
                  <button onClick={() => setAddStep(3)} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                    ← {isEl ? "Πίσω" : "Back"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
