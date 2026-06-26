const CACHE_NAME = 'naam-jap-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/192.png',
  '/512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js'
];

// Install event – cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event – clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
    })
  );
  self.clients.claim();
});

// Fetch event – serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const request = event.request;

  // For navigation (HTML pages) – try network first, fallback to cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match(request))
    );
    return;
  }

  // For all other assets – cache first, fallback to network
  event.respondWith(
    caches.match(request)
      .then(response => response || fetch(request))
  );
});
