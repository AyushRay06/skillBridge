// Clean service worker placeholder for localhost / stale PWA registrations
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => {
  self.registration.unregister();
});
