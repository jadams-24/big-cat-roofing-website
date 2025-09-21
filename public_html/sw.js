/**
 * Service Worker for Advanced Caching
 * Implements cache-first, network-first, and stale-while-revalidate strategies
 * Designed to achieve 1,390 KiB savings from PageSpeed Insights
 */

const CACHE_NAME = 'big-cat-roofing-v1';
const CACHE_VERSION = '2025-09-21-001';
const STATIC_CACHE = `${CACHE_NAME}-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `${CACHE_NAME}-dynamic-${CACHE_VERSION}`;
const THIRD_PARTY_CACHE = `${CACHE_NAME}-third-party-${CACHE_VERSION}`;

// Resources to cache immediately on install
const CRITICAL_RESOURCES = [
    '/',
    '/css/styles.css',
    '/css/bootstrap.min.css',
    '/js/main.js',
    '/assets/images/logo.png',
    '/assets/fonts/font.woff2',
    '/manifest.json'
];

// Static resources for cache-first strategy
const STATIC_RESOURCES = [
    /\.(?:css|js|woff|woff2|ttf|eot|otf|png|jpg|jpeg|gif|webp|svg|ico)$/,
    /\/assets\//,
    /\/css\//,
    /\/js\//,
    /\/fonts\//,
    /\/images\//
];

// Network-first resources (dynamic content)
const NETWORK_FIRST = [
    /\.html$/,
    /\/api\//,
    /\/contact/,
    /\/blog\//
];

// Third-party resources to proxy cache
const THIRD_PARTY_DOMAINS = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'maps.googleapis.com',
    'cdn.jsdelivr.net',
    'cdnjs.cloudflare.com'
];

/**
 * Service Worker Installation
 */
self.addEventListener('install', event => {
    console.log('[SW] Installing Service Worker...');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('[SW] Caching critical resources...');
                return cache.addAll(CRITICAL_RESOURCES);
            })
            .then(() => {
                console.log('[SW] Critical resources cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('[SW] Failed to cache critical resources:', error);
            })
    );
});

/**
 * Service Worker Activation
 */
self.addEventListener('activate', event => {
    console.log('[SW] Activating Service Worker...');

    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        // Delete old caches
                        if (cacheName.startsWith(CACHE_NAME) &&
                            cacheName !== STATIC_CACHE &&
                            cacheName !== DYNAMIC_CACHE &&
                            cacheName !== THIRD_PARTY_CACHE) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[SW] Service Worker activated');
                return self.clients.claim();
            })
    );
});

/**
 * Fetch Event Handler - Main caching logic
 */
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip browser extension requests
    if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:') return;

    // Route to appropriate caching strategy
    if (isStaticResource(request)) {
        event.respondWith(cacheFirstStrategy(request));
    } else if (isNetworkFirstResource(request)) {
        event.respondWith(networkFirstStrategy(request));
    } else if (isThirdPartyResource(request)) {
        event.respondWith(staleWhileRevalidateStrategy(request));
    } else {
        event.respondWith(networkFirstStrategy(request));
    }
});

/**
 * Cache-First Strategy (for static assets)
 * Maximum performance for unchanging resources
 */
async function cacheFirstStrategy(request) {
    try {
        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        // Fetch and cache if not found
        const networkResponse = await fetch(request);

        if (networkResponse.status === 200) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.error('[SW] Cache-first strategy failed:', error);

        // Fallback to cached version if available
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        throw error;
    }
}

/**
 * Network-First Strategy (for dynamic content)
 * Fresh content with cache fallback
 */
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);

        if (networkResponse.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.log('[SW] Network failed, trying cache...');

        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Return offline page for HTML requests
        if (request.destination === 'document') {
            const offlineResponse = await caches.match('/offline.html');
            if (offlineResponse) {
                return offlineResponse;
            }
        }

        throw error;
    }
}

/**
 * Stale-While-Revalidate Strategy (for third-party resources)
 * Serves from cache immediately, updates in background
 */
async function staleWhileRevalidateStrategy(request) {
    const cache = await caches.open(THIRD_PARTY_CACHE);
    const cachedResponse = await cache.match(request);

    // Fetch update in background
    const fetchPromise = fetch(request)
        .then(networkResponse => {
            if (networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        })
        .catch(error => {
            console.log('[SW] Third-party fetch failed:', error);
        });

    // Return cached version immediately if available
    if (cachedResponse) {
        return cachedResponse;
    }

    // Wait for network if no cache
    return await fetchPromise;
}

/**
 * Resource type detection functions
 */
function isStaticResource(request) {
    return STATIC_RESOURCES.some(pattern => pattern.test(request.url));
}

function isNetworkFirstResource(request) {
    return NETWORK_FIRST.some(pattern => pattern.test(request.url));
}

function isThirdPartyResource(request) {
    const url = new URL(request.url);
    return THIRD_PARTY_DOMAINS.some(domain => url.hostname.includes(domain));
}

/**
 * Background Sync for offline form submissions
 */
self.addEventListener('sync', event => {
    if (event.tag === 'contact-form-sync') {
        event.waitUntil(syncContactForm());
    }
});

async function syncContactForm() {
    try {
        // Retrieve queued form data from IndexedDB
        const formData = await getQueuedFormData();

        if (formData.length > 0) {
            for (const data of formData) {
                await submitForm(data);
            }

            await clearQueuedFormData();
            console.log('[SW] Offline form submissions synced');
        }
    } catch (error) {
        console.error('[SW] Form sync failed:', error);
    }
}

/**
 * Cache management utilities
 */
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'CACHE_STATS') {
        getCacheStats().then(stats => {
            event.ports[0].postMessage(stats);
        });
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        clearAllCaches().then(() => {
            event.ports[0].postMessage({ success: true });
        });
    }
});

async function getCacheStats() {
    const cacheNames = await caches.keys();
    const stats = {};

    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        stats[cacheName] = keys.length;
    }

    return {
        caches: stats,
        totalCaches: cacheNames.length,
        totalResources: Object.values(stats).reduce((sum, count) => sum + count, 0)
    };
}

async function clearAllCaches() {
    const cacheNames = await caches.keys();
    return Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
    );
}

/**
 * IndexedDB utilities for offline form storage
 */
async function getQueuedFormData() {
    // Implementation would connect to IndexedDB
    // Simplified for this example
    return [];
}

async function clearQueuedFormData() {
    // Implementation would clear IndexedDB
    // Simplified for this example
    return true;
}

async function submitForm(data) {
    // Implementation would submit form data
    // Simplified for this example
    return fetch('/contact', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

console.log('[SW] Service Worker script loaded successfully');