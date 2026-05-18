const CACHE_NAME = "flowpay-v5";

// Install new SW immediately
self.addEventListener("install", () => {
  self.skipWaiting();
});

// Activate new SW and delete old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    )
  );
});

// Cache ONLY static assets (JS, CSS, images)
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Never cache HTML — always fetch fresh
  if (req.destination === "document") {
    return;
  }

  // Cache JS, CSS, images
  if (
    req.destination === "script" ||
    req.destination === "style" ||
    req.destination === "image"
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(req).then(res => {
          return (
            res ||
            fetch(req).then(fetchRes => {
              cache.put(req, fetchRes.clone());
              return fetchRes;
            })
          );
        })
      )
    );
  }
});
