const CACHE_NAME = 'coptic-ai-cache-v6';
const PRECACHE_ASSETS = [
  '/public/index.html',
  '/public/offline.html', // Add offline.html to cache
  '/public/style.css',
  '/public/script.js',
  '/public/logo.png',
  '/public/icons/coptic-cross-192x192.png',
  '/public/icons/coptic-cross-512x512.png',
  '/public/icons/coptic-cross-maskable-512x512.png',
  '/public/fontawesome/css/all.min.css',
  '/public/fontawesome/webfonts/fa-solid-900.woff2',
  '/public/fontawesome/webfonts/fa-regular-900.woff2',
  '/public/new_testament.json',
  '/public/old_testament.json',
  '/public/deuterocanonical.json',
  '/public/synaxarium/Tout.json',
  '/public/synaxarium/Baba.json',
  '/public/synaxarium/Hator.json',
  '/public/synaxarium/Kiahk.json',
  '/public/synaxarium/Toba.json',
  '/public/synaxarium/Amshir.json',
  '/public/synaxarium/Baramhat.json',
  '/public/synaxarium/Baramouda.json',
  '/public/synaxarium/Bashans.json',
  '/public/synaxarium/Paona.json',
  '/public/synaxarium/Epep.json',
  '/public/synaxarium/Mesore.json',
  '/public/synaxarium/Nasie.json',
  '/public/sayings-of-the-desert-fathers/alpha.json',
  '/public/sayings-of-the-desert-fathers/beta.json',
  '/public/sayings-of-the-desert-fathers/gamma.json',
  '/public/sayings-of-the-desert-fathers/delta.json',
  '/public/sayings-of-the-desert-fathers/epsilon.json',
  '/public/sayings-of-the-desert-fathers/zeta.json',
  '/public/sayings-of-the-desert-fathers/eta.json',
  '/public/sayings-of-the-desert-fathers/theta.json',
  '/public/sayings-of-the-desert-fathers/iota.json',
  '/public/sayings-of-the-desert-fathers/kappa.json',
  '/public/sayings-of-the-desert-fathers/lambda.json',
  '/public/sayings-of-the-desert-fathers/mu.json',
  '/public/sayings-of-the-desert-fathers/nu.json',
  '/public/sayings-of-the-desert-fathers/xi.json',
  '/public/sayings-of-the-desert-fathers/omicron.json',
  '/public/sayings-of-the-desert-fathers/pi.json',
  '/public/sayings-of-the-desert-fathers/rho.json',
  '/public/sayings-of-the-desert-fathers/sigma.json',
  '/public/sayings-of-the-desert-fathers/tau.json',
  '/public/sayings-of-the-desert-fathers/upsilon.json',
  '/public/sayings-of-the-desert-fathers/phi.json',
  '/public/sayings-of-the-desert-fathers/chi.json',
  '/public/sayings-of-the-desert-fathers/psi.json',
  '/public/sayings-of-the-desert-fathers/omega.json'
];

// Install event: Cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.error('Failed to cache assets:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: Handle requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Handle navigation requests (e.g., HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Online: Cache the response for index.html
          if (url.pathname === '/public/index.html' || url.pathname === '/') {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, response.clone());
            });
          }
          return response;
        })
        .catch(async () => {
          // Offline: Serve offline.html
          const cache = await caches.open(CACHE_NAME);
          return cache.match('/public/offline.html') || new Response('Offline content unavailable.', { status: 503 });
        })
    );
  } else {
    // Handle other requests (CSS, JS, images, JSON, fonts)
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request).catch(() => {
          return new Response('Resource unavailable offline.', { status: 503 });
        });
      })
    );
  }
});

// Handle SKIP_WAITING message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});