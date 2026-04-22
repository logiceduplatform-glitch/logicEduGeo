const CACHE_NAME = "edu-platform-v4";
const RUNTIME_CACHE = "edu-runtime-v4";
const GAME_CACHE = "edu-games-v1";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.svg",
  "/icon-192.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  const keep = [CACHE_NAME, RUNTIME_CACHE, GAME_CACHE];
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !keep.includes(k)).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

function isDevRequest(url) {
  return (
    url.pathname.includes("node_modules") ||
    url.pathname.includes("/@") ||
    url.pathname.includes("__vite") ||
    url.pathname.startsWith("/src/") ||
    url.search.includes("v=")
  );
}

function isAPIRequest(url) {
  return (
    url.pathname.startsWith("/api/") ||
    url.hostname.includes("firestore") ||
    url.hostname.includes("identitytoolkit") ||
    url.hostname.includes("googleapis") ||
    url.hostname.includes("openai") ||
    url.hostname.includes("stripe")
  );
}

function isGameChunk(url) {
  return /\/(assets\/)(.*Game|.*Quiz|.*Puzzle|exercises|funGameConfig|adultGameConfig|activityConfig|gameInstructions|searchIndex)/.test(url.pathname);
}

function isStaticAsset(url) {
  return /\.(js|css|png|jpg|jpeg|gif|svg|webp|woff2?|ico|json)$/.test(url.pathname);
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (isDevRequest(url) || isAPIRequest(url)) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  if (isGameChunk(url)) {
    event.respondWith(
      caches.open(GAME_CACHE).then((cache) =>
        cache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((response) => {
            if (response && response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        })
      )
    );
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then((cache) =>
        cache.match(event.request).then((cached) => {
          const fetchPromise = fetch(event.request)
            .then((response) => {
              if (response && response.status === 200 && response.type === "basic") {
                cache.put(event.request, response.clone());
              }
              return response;
            })
            .catch(() => cached);

          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && response.type === "basic") {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data === "PRECACHE_GAMES") {
    event.waitUntil(precachePopularGames());
  }
});

async function precachePopularGames() {
  try {
    const cache = await caches.open(GAME_CACHE);
    const response = await fetch("/");
    const html = await response.text();

    const scriptMatches = html.match(/\/assets\/[a-zA-Z0-9_-]+\.js/g) || [];
    const cssMatches = html.match(/\/assets\/[a-zA-Z0-9_-]+\.css/g) || [];
    const allAssets = [...new Set([...scriptMatches, ...cssMatches])];

    const gameAssets = allAssets.filter((a) =>
      /Game|Quiz|Puzzle|exercises|funGame|adultGame|activity|gameInstruction|searchIndex/i.test(a)
    );

    const toCache = gameAssets.slice(0, 30);

    await Promise.allSettled(
      toCache.map((url) =>
        fetch(url).then((res) => {
          if (res.ok) cache.put(url, res);
        })
      )
    );
  } catch {}
}
