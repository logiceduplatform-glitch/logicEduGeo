/**
 * PushNotificationService — wraps Firebase Cloud Messaging (FCM) for
 * browser web push and Capacitor push notifications.
 *
 * Two transport mechanisms:
 *   - Web: FCM via service worker + VAPID key
 *   - Native (Capacitor): @capacitor/push-notifications using APNs/FCM
 *
 * The token is persisted to Firestore at users/{uid}/data/pushToken so
 * a Cloud Function can target users for re-engagement campaigns.
 */
import { app, db } from "../auth/firebase";
import { doc, setDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { NativeService } from "./NativeService";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || "";
const TOKEN_LOCAL_KEY = "edu:pushToken";

let messagingPromise = null;

async function getMessaging() {
  if (!app) return null;
  if (messagingPromise) return messagingPromise;
  messagingPromise = (async () => {
    try {
      const { getMessaging, isSupported } = await import("firebase/messaging");
      const supported = await isSupported();
      if (!supported) return null;
      return getMessaging(app);
    } catch {
      return null;
    }
  })();
  return messagingPromise;
}

async function persistToken(uid, token, platform) {
  if (!uid || !token || !db) return;
  try {
    await setDoc(
      doc(db, "users", uid, "data", "pushToken"),
      {
        token,
        platform,
        updatedAt: serverTimestamp(),
        userAgent: navigator.userAgent.slice(0, 200),
      },
      { merge: true },
    );
    localStorage.setItem(TOKEN_LOCAL_KEY, token);
  } catch (e) {
    if (import.meta.env.DEV) console.warn("[Push] persistToken failed", e);
  }
}

export const PushNotificationService = {
  isConfigured() {
    return !!VAPID_KEY;
  },

  /**
   * Request permission and obtain a push token. Returns null if denied
   * or unavailable. Should be called from a user gesture.
   */
  async enable(uid) {
    if (await NativeService.isNative()) {
      return this._enableNative(uid);
    }
    return this._enableWeb(uid);
  },

  async _enableWeb(uid) {
    if (!this.isConfigured()) {
      if (import.meta.env.DEV) console.warn("[Push] Missing VITE_FIREBASE_VAPID_KEY");
      return null;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return null;

      const messaging = await getMessaging();
      if (!messaging) return null;

      const { getToken } = await import("firebase/messaging");
      const swRegistration = await navigator.serviceWorker.ready;
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: swRegistration,
      });

      if (token) {
        await persistToken(uid, token, "web");
        this._wireForegroundHandler(messaging);
      }
      return token || null;
    } catch (e) {
      if (import.meta.env.DEV) console.warn("[Push] enable failed", e);
      return null;
    }
  },

  async _enableNative(uid) {
    try {
      const { PushNotifications } = await import("@capacitor/push-notifications");
      const perm = await PushNotifications.requestPermissions();
      if (perm.receive !== "granted") return null;

      await PushNotifications.register();

      return await new Promise((resolve) => {
        PushNotifications.addListener("registration", async (token) => {
          await persistToken(uid, token.value, "native");
          resolve(token.value);
        });
        PushNotifications.addListener("registrationError", () => resolve(null));
      });
    } catch (e) {
      if (import.meta.env.DEV) console.warn("[Push] native enable failed", e);
      return null;
    }
  },

  /**
   * Listen for foreground messages and surface them as in-app toasts.
   */
  _wireForegroundHandler(messaging) {
    if (!messaging) return;
    import("firebase/messaging").then(({ onMessage }) => {
      onMessage(messaging, (payload) => {
        const { title, body, icon } = payload.notification || {};
        if (!title) return;
        // Use the browser's Notification API as the toast (consistent
        // visuals + tap-handler).
        try {
          new Notification(title, {
            body,
            icon: icon || "/icon-192.png",
            badge: "/icon-192.png",
            tag: payload.messageId || "kibloo",
            data: payload.data || {},
          });
        } catch { /* permission lost */ }
      });
    });
  },

  /**
   * Disable push: remove the token from Firestore so the user no longer
   * receives messages targeted by uid.
   */
  async disable(uid) {
    try {
      if (uid && db) {
        await deleteDoc(doc(db, "users", uid, "data", "pushToken")).catch(() => {});
      }
      localStorage.removeItem(TOKEN_LOCAL_KEY);
    } catch { /* noop */ }
  },

  getCachedToken() {
    try { return localStorage.getItem(TOKEN_LOCAL_KEY) || null; }
    catch { return null; }
  },
};
