const PREFIX = "geo:";

let scopePrefix = "";

function prefixKey(key) {
  const base = key.startsWith(PREFIX) ? key.slice(PREFIX.length) : key;
  return PREFIX + scopePrefix + base;
}

function globalPrefixKey(key) {
  return key.startsWith(PREFIX) ? key : PREFIX + key;
}

const localStorageAdapter = {
  get(key) {
    try {
      const raw = localStorage.getItem(prefixKey(key));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(prefixKey(key), JSON.stringify(value));
    } catch { /* quota exceeded - silently fail */ }
  },

  remove(key) {
    localStorage.removeItem(prefixKey(key));
  },

  getAll(keyPrefix) {
    const results = {};
    const fullPrefix = prefixKey(keyPrefix);
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k.startsWith(fullPrefix)) {
        try {
          const logicalKey = k.slice(PREFIX.length + scopePrefix.length);
          results[logicalKey] = JSON.parse(localStorage.getItem(k));
        } catch { /* skip corrupt entries */ }
      }
    }
    return results;
  },

  getGlobal(key) {
    try {
      const raw = localStorage.getItem(globalPrefixKey(key));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setGlobal(key, value) {
    try {
      localStorage.setItem(globalPrefixKey(key), JSON.stringify(value));
    } catch { /* quota exceeded - silently fail */ }
  },

  removeGlobal(key) {
    localStorage.removeItem(globalPrefixKey(key));
  },
};

let activeAdapter = localStorageAdapter;

export const StorageService = {
  get: (key) => activeAdapter.get(key),
  set: (key, value) => activeAdapter.set(key, value),
  remove: (key) => activeAdapter.remove(key),
  getAll: (prefix) => activeAdapter.getAll(prefix),

  getGlobal: (key) => activeAdapter.getGlobal(key),
  setGlobal: (key, value) => activeAdapter.setGlobal(key, value),
  removeGlobal: (key) => activeAdapter.removeGlobal(key),

  setScope(profileId) {
    scopePrefix = profileId ? `profile:${profileId}:` : "";
  },

  getScope() {
    return scopePrefix;
  },

  setAdapter(adapter) {
    activeAdapter = adapter;
  },
};
