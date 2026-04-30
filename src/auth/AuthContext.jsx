import React, { createContext, useState, useEffect, useCallback } from "react";
import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { SyncService } from "../services/SyncService";
import { ApiService } from "../services/ApiService";
import { AnalyticsService } from "../services/AnalyticsService";
import { StorageService } from "../services/StorageService";

export const AuthContext = createContext();

const NO_AUTH_MSG = {
  el: "Η υπηρεσία σύνδεσης δεν είναι διαθέσιμη. Δοκίμασε ως επισκέπτης.",
  en: "Auth service unavailable. Try guest mode.",
};

function loadProfileForUid(uid) {
  try {
    if (uid) {
      const perUser = localStorage.getItem(`geo:userProfile:${uid}`);
      if (perUser) return JSON.parse(perUser);
    }
    const legacy = localStorage.getItem("geo:userProfile");
    return legacy ? JSON.parse(legacy) : null;
  } catch { return null; }
}

function saveProfileForUid(uid, profile) {
  const effectiveUid = uid || auth?.currentUser?.uid;
  localStorage.setItem("geo:userProfile", JSON.stringify(profile));
  if (effectiveUid) localStorage.setItem(`geo:userProfile:${effectiveUid}`, JSON.stringify(profile));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [guest, setGuest] = useState(() => {
    try {
      const saved = localStorage.getItem("geo:guestProfile");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [userProfile, setUserProfile] = useState(() => loadProfileForUid(null));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const syncAfterLogin = useCallback(async () => {
    try {
      setSyncing(true);
      await SyncService.fullSync();
    } catch (e) {
      if (import.meta.env.DEV) console.warn("[Auth] Cloud sync failed, data remains local:", e);
    } finally {
      setSyncing(false);
    }
  }, []);

  const getLang = () => {
    try { return document.documentElement.lang === "el" ? "el" : "en"; } catch { return "en"; }
  };

  const loginWithGoogle = async () => {
    if (!auth) { setError(NO_AUTH_MSG[getLang()]); return null; }
    const provider = new GoogleAuthProvider();
    try {
      setError(null);
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      localStorage.removeItem("geo:guestProfile");
      syncAfterLogin();
      AnalyticsService.login("google");
      return result.user;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const registerWithEmail = async (email, password) => {
    if (!auth) { setError(NO_AUTH_MSG[getLang()]); return; }
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (result.user) {
        await sendEmailVerification(result.user).catch(() => {});
      }
      setUser(result.user);
      localStorage.removeItem("geo:guestProfile");
      syncAfterLogin();
      AnalyticsService.signup("email");
      try {
        const { AffiliateService } = await import("../services/AffiliateService");
        await AffiliateService.recordSignup({ refereeUid: result.user.uid });
      } catch { /* ignore */ }
    } catch (err) {
      setError(err.message);
    }
  };

  const loginWithEmail = async (email, password, rememberMe) => {
    if (!auth) { setError(NO_AUTH_MSG[getLang()]); return null; }
    try {
      setError(null);
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const resetPassword = async (email) => {
    if (!auth) { setError(NO_AUTH_MSG[getLang()]); return false; }
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const logout = async () => {
    if (auth) {
      try { await signOut(auth); } catch {}
    }
    setUser(null);
    setGuest(null);
    setUserProfile(null);
    localStorage.removeItem("geo:guestProfile");
    localStorage.removeItem("geo:userProfile");
    localStorage.removeItem("geo:activeProfileId");
    localStorage.removeItem("geo:childProfiles");
    localStorage.removeItem("geo:studentName");
    localStorage.removeItem("geo:myClassrooms");
    StorageService.setScope(null);
  };

  const saveUserProfile = (profile) => {
    setUserProfile(profile);
    saveProfileForUid(user?.uid, profile);
    ApiService.saveUserProfile(profile).catch(() => {});
  };

  const beginGuest = (profileData) => {
    const profile = {
      id: "guest_" + Date.now(),
      ...profileData,
      createdAt: new Date().toISOString(),
      playsUsed: 0,
      maxPlays: profileData.plays || 2,
      maxMinutes: profileData.minutes || 10,
    };
    setGuest(profile);
    localStorage.setItem("geo:guestProfile", JSON.stringify(profile));
  };

  const incrementGuestPlay = () => {
    if (!guest) return false;
    const updated = { ...guest, playsUsed: (guest.playsUsed || 0) + 1 };
    setGuest(updated);
    localStorage.setItem("geo:guestProfile", JSON.stringify(updated));
    return updated.playsUsed < (updated.maxPlays || 2);
  };

  const isGuestExpired = () => {
    if (!guest) return false;
    const elapsed = (Date.now() - new Date(guest.createdAt).getTime()) / 60000;
    const playsOver = (guest.playsUsed || 0) >= (guest.maxPlays || 2);
    const timeOver = elapsed >= (guest.maxMinutes || 10);
    return playsOver || timeOver;
  };

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser || null);
      if (firebaseUser) {
        let profile = loadProfileForUid(firebaseUser.uid);
        if (profile && !localStorage.getItem(`geo:userProfile:${firebaseUser.uid}`)) {
          localStorage.setItem(`geo:userProfile:${firebaseUser.uid}`, JSON.stringify(profile));
        }
        if (!profile) {
          try {
            const res = await ApiService.getUserProfile();
            if (res.ok && res.data) {
              profile = res.data;
              saveProfileForUid(firebaseUser.uid, profile);
            }
          } catch { /* ignore */ }
        }
        setUserProfile(profile);
        syncAfterLogin();
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [syncAfterLogin]);

  const userRole = userProfile?.role || "student";

  return (
    <AuthContext.Provider
      value={{
        user,
        guest,
        userProfile,
        userRole,
        error,
        loading,
        syncing,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        beginGuest,
        incrementGuestPlay,
        isGuestExpired,
        saveUserProfile,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
