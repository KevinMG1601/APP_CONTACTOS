const CACHE_NAME = "KMG-pwa-1";

const APP_SHELL = [
    "/",
    "/index.html",
    "/manifest.json",
    "/logo.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
});

self.addEventListener("fetch", event =>{
    if (event.request.method !== "GET") return;

    event.respondWith(
        fetch(event.request)
            .then(Response => {
                const clone = Response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, clone);
                });
                return Response;
            })
            .catch(() => caches.match(event.request))
    );
});