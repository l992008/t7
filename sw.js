const CACHE_NAME = 'notes-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/manifest.json'
];

// Установка и кэширование ресурсов
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
    );
});

// Обработка запросов (сначала из кэша, потом сеть)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});