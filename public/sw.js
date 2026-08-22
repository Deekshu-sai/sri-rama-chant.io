/**
 * Service Worker for Sri Rama Chant Counter
 * Provides offline support, caching, and PWA functionality
 */

const CACHE_NAME = 'sri-rama-chant-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/css/styles.css',
  '/src/js/main.js',
  '/src/js/modules/config.js',
  '/src/js/modules/storage.js',
  '/src/js/modules/i18n.js',
  '/src/js/modules/achievements.js',
  '/src/js/modules/notifications.js',
  '/src/js/modules/haptics.js',
  '/src/js/modules/firebase.js',
  '/src/js/modules/grid.js',
  '/src/js/modules/app.js',
  '/languages.js',
  '/sri rama image.png',
  'https://fonts.googleapis.com/css2?family=Noto+Serif+Telugu:wght@400;700&display=swap',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'
];

const CACHE_STRATEGIES = {
  // Cache first - for static assets
  cacheFirst: ['/src/css/', '/src/js/', '/languages.js', '/sri rama image.png'],
  // Network first - for API calls
  networkFirst: ['/firebase/', 'https://www.gstatic.com/firebasejs/'],
  // Stale while revalidate - for HTML
  staleWhileRevalidate: ['/index.html', '/']
};

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

/**
 * Fetch event - serve from cache with network fallback
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) return;

  // Determine caching strategy
  let strategy = 'networkFirst';

  if (CACHE_STRATEGIES.cacheFirst.some(path => request.url.includes(path))) {
    strategy = 'cacheFirst';
  } else if (CACHE_STRATEGIES.staleWhileRevalidate.some(path => request.url.includes(path))) {
    strategy = 'staleWhileRevalidate';
  } else if (CACHE_STRATEGIES.networkFirst.some(path => request.url.includes(path))) {
    strategy = 'networkFirst';
  }

  event.respondWith(handleRequest(request, strategy));
});

/**
 * Handle request based on strategy
 */
async function handleRequest(request, strategy) {
  const cache = await caches.open(CACHE_NAME);

  switch (strategy) {
    case 'cacheFirst':
      return cacheFirst(request, cache);
    case 'networkFirst':
      return networkFirst(request, cache);
    case 'staleWhileRevalidate':
      return staleWhileRevalidate(request, cache);
    default:
      return networkFirst(request, cache);
  }
}

/**
 * Cache first strategy
 */
async function cacheFirst(request, cache) {
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Return offline page or fallback
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Network first strategy
 */
async function networkFirst(request, cache) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Stale while revalidate strategy
 */
async function staleWhileRevalidate(request, cache) {
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}

/**
 * Background sync for pending operations
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-chants') {
    event.waitUntil(syncPendingChants());
  }
});

/**
 * Sync pending chants to Firebase when online
 */
async function syncPendingChants() {
  // This would sync any locally stored pending operations
  // Implementation depends on storing pending operations in IndexedDB
  console.log('Background sync triggered');
}

/**
 * Push notification handling
 */
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/sri rama image.png',
    badge: '/sri rama image.png',
    vibrate: [100, 50, 100],
    data: data.data || {},
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'close', title: 'Close' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

/**
 * Notification click handling
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then((clientList) => {
          for (const client of clientList) {
            if (client.url === '/' && 'focus' in client) {
              return client.focus();
            }
          }
          return clients.openWindow('/');
        })
    );
  }
});

/**
 * Periodic background sync (if supported)
 */
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'daily-reminder') {
    event.waitUntil(checkDailyReminder());
  }
});

async function checkDailyReminder() {
  // Check if reminder should be shown
  // This would integrate with the reminder settings
  console.log('Periodic sync for daily reminder');
}

console.log('Service Worker loaded');