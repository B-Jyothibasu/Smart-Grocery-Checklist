const CACHE_NAME = "grocery-cache-v1";

const FILES = [

    "/",

    "/index.html",

    "/style.css",

    "/script.js",

    "/manifest.json"

];

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

        .then(cache => {

            return cache.addAll(FILES);

        })

    );

});

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)

        .then(response => {

            return response || fetch(event.request);

        })

    );

});