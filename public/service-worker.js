// Install immediately
self.addEventListener("install", () => {
  self.skipWaiting();
});

// Activate immediately
self.addEventListener("activate", () => {
  // No clientsClaim() — it breaks on Edge
});

// Only cache static assets (NO HTML)
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Cache only images, scripts, styles
  if (
    req.destination === "image" ||
    req.destination === "script" ||
    req.destination === "style"
  ) {
    event.respondWith(
      caches.open("flowpay-cache").then(cache =>
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
