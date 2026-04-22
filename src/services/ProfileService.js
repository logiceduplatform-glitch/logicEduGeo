import { SyncService } from "./SyncService";
import { StorageService } from "./StorageService";

const PROFILES_KEY = "geo:childProfiles";
const ACTIVE_KEY = "geo:activeProfileId";

function getProfiles() {
  try {
    return JSON.parse(localStorage.getItem(PROFILES_KEY)) || [];
  } catch {
    return [];
  }
}

function saveProfiles(profiles) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

function getActiveId() {
  return localStorage.getItem(ACTIVE_KEY) || null;
}

function setActiveId(id) {
  if (id) localStorage.setItem(ACTIVE_KEY, id);
  else localStorage.removeItem(ACTIVE_KEY);
}

export const ProfileService = {
  getAll() {
    return getProfiles();
  },

  getActive() {
    const activeId = getActiveId();
    if (!activeId) return null;
    const profiles = getProfiles();
    return profiles.find((p) => p.id === activeId) || null;
  },

  getActiveId() {
    return getActiveId();
  },

  add(profile) {
    const profiles = getProfiles();
    const newProfile = {
      id: "child_" + Date.now(),
      name: profile.name || "",
      age: profile.age || "",
      objective: profile.objective || "",
      avatar: profile.avatar || this._randomAvatar(),
      createdAt: new Date().toISOString(),
    };
    profiles.push(newProfile);
    saveProfiles(profiles);
    setActiveId(newProfile.id);
    StorageService.setScope(newProfile.id);
    SyncService.syncProfile(newProfile);
    return newProfile;
  },

  update(id, updates) {
    const profiles = getProfiles();
    const idx = profiles.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    profiles[idx] = { ...profiles[idx], ...updates };
    saveProfiles(profiles);
    SyncService.syncProfile(profiles[idx]);
    return profiles[idx];
  },

  remove(id) {
    let profiles = getProfiles();
    profiles = profiles.filter((p) => p.id !== id);
    saveProfiles(profiles);
    SyncService.syncProfileDelete(id);
    if (getActiveId() === id) {
      const nextId = profiles[0]?.id || null;
      setActiveId(nextId);
      StorageService.setScope(nextId);
    }
    return profiles;
  },

  switchTo(id) {
    const profiles = getProfiles();
    const found = profiles.find((p) => p.id === id);
    if (found) {
      setActiveId(id);
      StorageService.setScope(id);
      return found;
    }
    return null;
  },

  clearActive() {
    setActiveId(null);
    StorageService.setScope(null);
  },

  updateAvatar(profileId, avatar) {
    return this.update(profileId, { avatar });
  },

  _randomAvatar() {
    const avatars = ["🦊", "🐼", "🦁", "🐸", "🐶", "🐱", "🐰", "🦄", "🐻", "🐧", "🦋", "🐝"];
    return avatars[Math.floor(Math.random() * avatars.length)];
  },

  migrateFromUserProfile(userProfile) {
    if (!userProfile?.name) return null;
    const profiles = getProfiles();
    if (profiles.length > 0) return profiles[0];
    return this.add({
      name: userProfile.name,
      age: userProfile.age,
      objective: userProfile.objective,
    });
  },
};
