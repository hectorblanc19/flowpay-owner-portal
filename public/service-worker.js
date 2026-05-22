const CACHE_NAME = "flowpay-mobile-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Safe fetch handler — caches ONLY static assets
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Never cache HTML or API calls
  if (req.mode === "navigate" || req.url.includes("/api/")) {
    return;
  }

  // Cache static assets only
  if (req.destination === "script" || req.destination === "style" || req.destination === "image") {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(req).then(cached => {
          if (cached) return cached;

          return fetch(req).then(networkRes => {
            cache.put(req, networkRes.clone());
            return networkRes;
          });
        })
      )
    );
  }
});
