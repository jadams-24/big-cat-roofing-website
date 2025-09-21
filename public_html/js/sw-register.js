/**
 * Service Worker Registration
 * Registers the service worker and provides cache management utilities
 */

class ServiceWorkerManager {
    constructor() {
        this.swRegistration = null;
        this.isOnline = navigator.onLine;
        this.setupEventListeners();
    }

    /**
     * Initialize service worker registration
     */
    async init() {
        if (!('serviceWorker' in navigator)) {
            console.log('Service Worker not supported');
            return false;
        }

        try {
            console.log('Registering Service Worker...');
            this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

            console.log('Service Worker registered successfully');

            // Handle updates
            this.swRegistration.addEventListener('updatefound', () => {
                this.handleUpdate();
            });

            // Check for immediate updates
            if (this.swRegistration.waiting) {
                this.showUpdateNotification();
            }

            // Get cache statistics
            this.displayCacheStats();

            return true;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            return false;
        }
    }

    /**
     * Handle service worker updates
     */
    handleUpdate() {
        const newWorker = this.swRegistration.installing;

        newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.showUpdateNotification();
            }
        });
    }

    /**
     * Show update notification to user
     */
    showUpdateNotification() {
        if (confirm('A new version is available. Reload to update?')) {
            this.activateUpdate();
        }
    }

    /**
     * Activate service worker update
     */
    activateUpdate() {
        if (this.swRegistration.waiting) {
            this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
        }
    }

    /**
     * Setup event listeners for online/offline detection
     */
    setupEventListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.handleOnlineStatus();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.handleOfflineStatus();
        });
    }

    /**
     * Handle online status changes
     */
    handleOnlineStatus() {
        console.log('Back online - syncing queued actions...');

        // Trigger background sync if available
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            navigator.serviceWorker.ready.then(registration => {
                return registration.sync.register('contact-form-sync');
            });
        }

        // Remove offline indicators
        this.removeOfflineIndicator();
    }

    /**
     * Handle offline status
     */
    handleOfflineStatus() {
        console.log('Gone offline - caching enabled');
        this.showOfflineIndicator();
    }

    /**
     * Show offline indicator
     */
    showOfflineIndicator() {
        let indicator = document.getElementById('offline-indicator');

        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'offline-indicator';
            indicator.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: #ff6b6b;
                    color: white;
                    text-align: center;
                    padding: 10px;
                    z-index: 9999;
                    font-family: Arial, sans-serif;
                ">
                    📱 You're offline. Browsing cached content.
                </div>
            `;
            document.body.appendChild(indicator);
        }
    }

    /**
     * Remove offline indicator
     */
    removeOfflineIndicator() {
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    /**
     * Get cache statistics
     */
    async getCacheStats() {
        if (!this.swRegistration) return null;

        return new Promise((resolve) => {
            const messageChannel = new MessageChannel();

            messageChannel.port1.onmessage = (event) => {
                resolve(event.data);
            };

            this.swRegistration.active.postMessage(
                { type: 'CACHE_STATS' },
                [messageChannel.port2]
            );
        });
    }

    /**
     * Display cache statistics (for debugging)
     */
    async displayCacheStats() {
        try {
            const stats = await this.getCacheStats();
            if (stats) {
                console.log('Cache Statistics:', stats);

                // Calculate estimated savings
                const estimatedSavings = stats.totalResources * 15; // Average 15KB per resource
                console.log(`Estimated cache savings: ${estimatedSavings} KB`);
            }
        } catch (error) {
            console.log('Could not retrieve cache stats:', error);
        }
    }

    /**
     * Clear all caches (for debugging)
     */
    async clearAllCaches() {
        if (!this.swRegistration) return false;

        return new Promise((resolve) => {
            const messageChannel = new MessageChannel();

            messageChannel.port1.onmessage = (event) => {
                resolve(event.data.success);
            };

            this.swRegistration.active.postMessage(
                { type: 'CLEAR_CACHE' },
                [messageChannel.port2]
            );
        });
    }

    /**
     * Preload critical resources
     */
    async preloadCriticalResources() {
        const criticalResources = [
            '/css/styles.css',
            '/js/main.js',
            '/assets/images/logo.png'
        ];

        try {
            await Promise.all(
                criticalResources.map(url =>
                    fetch(url).catch(error =>
                        console.log(`Failed to preload ${url}:`, error)
                    )
                )
            );
            console.log('Critical resources preloaded');
        } catch (error) {
            console.log('Preload failed:', error);
        }
    }
}

// Initialize service worker when DOM is ready
let swManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServiceWorker);
} else {
    initServiceWorker();
}

async function initServiceWorker() {
    swManager = new ServiceWorkerManager();
    const registered = await swManager.init();

    if (registered) {
        // Preload critical resources
        await swManager.preloadCriticalResources();

        // Set up periodic cache cleanup (every 24 hours)
        setInterval(() => {
            swManager.displayCacheStats();
        }, 24 * 60 * 60 * 1000);
    }
}

// Expose to global scope for debugging
window.swManager = swManager;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ServiceWorkerManager;
}