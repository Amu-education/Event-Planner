const cacheName ="Offline-Event-Planner";

const filesToCache = [
    "index.html",
    "css/styles.css",
    "js/main.js",
    "js/events.js",
    "js/validation.js",
    "js/api.js",
];

self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener("fetch", function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});

