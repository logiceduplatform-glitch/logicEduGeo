import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const hasConfig = !!(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_APP_ID
);

let auth = null;
let googleProvider = null;
let db = null;
let analytics = null;

if (hasConfig) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined,
  };
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  db = getFirestore(app);

  const consent = localStorage.getItem("edu:cookieConsent");
  if (consent === "accepted") {
    isSupported().then((yes) => {
      if (yes) {
        analytics = getAnalytics(app);
      }
    }).catch(() => {});
  }
} else {
  if (import.meta.env.DEV) console.warn(
    "[Firebase] Missing env vars (VITE_FIREBASE_*). Auth disabled — app runs in guest-only mode."
  );
}

function enableAnalytics() {
  if (analytics || !hasConfig) return;
  isSupported().then((yes) => {
    if (yes) {
      const app = auth?.app;
      if (app) analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export { auth, googleProvider, db, analytics, enableAnalytics };
