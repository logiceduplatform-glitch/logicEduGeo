// Firebase Cloud Messaging service worker for background push notifications.
// MUST live at /firebase-messaging-sw.js (root) — Firebase looks for it there.
//
// IMPORTANT: For background push to work in production, fill in the
// firebaseConfig values below with your real project's config (they are
// public and safe to commit). They must EXACTLY match the values you
// pass to initializeApp() in src/auth/firebase.js.
//
// Until you set the values, the SW will silently no-op (no errors, no
// background pushes — only foreground notifications work).

importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "logic-education-platform.firebaseapp.com",
  projectId: "logic-education-platform",
  appId: "REPLACE_ME",
  messagingSenderId: "REPLACE_ME",
};

let messaging = null;
try {
  if (firebaseConfig.apiKey !== "REPLACE_ME") {
    firebase.initializeApp(firebaseConfig);
    messaging = firebase.messaging();
  }
} catch (e) {
  // Initialization failed — silently no-op so the rest of the SW keeps working.
  console.warn("[firebase-messaging-sw] init failed:", e.message);
}

if (messaging) {
  // Background message handler — fires when the page is closed/minimized.
  messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title || "Kibloo";
    const options = {
      body: payload.notification?.body || "",
      icon: payload.notification?.icon || "/icon-192.png",
      badge: "/icon-192.png",
      tag: payload.messageId || "kibloo-bg",
      data: { ...(payload.data || {}), url: payload.fcmOptions?.link || "/" },
      actions: [
        { action: "open", title: "Open" },
        { action: "close", title: "Dismiss" },
      ],
    };
    return self.registration.showNotification(title, options);
  });
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "close") return;
  const url = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const c of clients) {
        if (c.url.includes(self.location.origin)) {
          c.focus();
          if ("navigate" in c) c.navigate(url);
          return;
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    }),
  );
});
