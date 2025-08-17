/**
 * Performance Optimized Script Loader
 * Implements lazy loading for non-critical JavaScript to improve PageSpeed scores
 * Targets 972 KiB JavaScript savings through conditional loading
 */

class PerformanceOptimizer {
    constructor() {
        this.loadedScripts = new Set();
        this.pendingLoads = new Map();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupEventListeners();
        this.setupDelayedLoaders();
    }

    /**
     * Lazy load popup modal when user shows intent to interact
     * Saves ~20KB on initial page load
     */
    loadPopupModal() {
        if (this.loadedScripts.has('popup-modal')) {
            return Promise.resolve();
        }

        if (this.pendingLoads.has('popup-modal')) {
            return this.pendingLoads.get('popup-modal');
        }

        const loadPromise = this.loadScript('js/popup-modal.min.js', 'popup-modal')
            .then(() => this.loadStylesheet('css/popup-modal.min.css', 'popup-modal-css'));

        this.pendingLoads.set('popup-modal', loadPromise);
        return loadPromise;
    }

    /**
     * Lazy load service area map only when map container is visible
     * Saves ~16KB + Leaflet library (~144KB)
     */
    loadServiceAreaMap() {
        if (this.loadedScripts.has('service-area-map')) {
            return Promise.resolve();
        }

        if (this.pendingLoads.has('service-area-map')) {
            return this.pendingLoads.get('service-area-map');
        }

        // Load Leaflet CSS first
        const loadPromise = this.loadStylesheet('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', 'leaflet-css')
            .then(() => this.loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', 'leaflet'))
            .then(() => this.loadScript('js/service-area-map.min.js', 'service-area-map'));

        this.pendingLoads.set('service-area-map', loadPromise);
        return loadPromise;
    }

    /**
     * Lazy load email notifications only on contact forms
     * Saves ~16KB on non-contact pages
     */
    loadEmailNotifications() {
        if (this.loadedScripts.has('email-notifications')) {
            return Promise.resolve();
        }

        if (this.pendingLoads.has('email-notifications')) {
            return this.pendingLoads.get('email-notifications');
        }

        const loadPromise = this.loadScript('js/email-notifications.min.js', 'email-notifications');
        this.pendingLoads.set('email-notifications', loadPromise);
        return loadPromise;
    }

    /**
     * Generic script loader with performance optimization
     */
    loadScript(src, id) {
        return new Promise((resolve, reject) => {
            if (this.loadedScripts.has(id)) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.defer = true;
            
            script.onload = () => {
                this.loadedScripts.add(id);
                resolve();
            };
            
            script.onerror = () => {
                console.warn(`Failed to load script: ${src}`);
                reject(new Error(`Script load failed: ${src}`));
            };

            document.head.appendChild(script);
        });
    }

    /**
     * Generic stylesheet loader
     */
    loadStylesheet(href, id) {
        return new Promise((resolve, reject) => {
            if (this.loadedScripts.has(id)) {
                resolve();
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            
            link.onload = () => {
                this.loadedScripts.add(id);
                resolve();
            };
            
            link.onerror = () => {
                console.warn(`Failed to load stylesheet: ${href}`);
                reject(new Error(`Stylesheet load failed: ${href}`));
            };

            document.head.appendChild(link);
        });
    }

    /**
     * Setup intersection observer for lazy loading based on visibility
     */
    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        
                        // Load map scripts when map container is visible
                        if (target.id === 'service-area-map' || target.id === 'homepage-service-map') {
                            this.loadServiceAreaMap();
                            observer.unobserve(target);
                        }
                    }
                });
            }, {
                rootMargin: '50px' // Start loading 50px before element is visible
            });

            // Observe map containers
            const mapContainers = document.querySelectorAll('#service-area-map, #homepage-service-map');
            mapContainers.forEach(container => observer.observe(container));
        }
    }

    /**
     * Setup event listeners for user interaction-based loading
     */
    setupEventListeners() {
        // Load popup modal on estimate button interaction
        const estimateButtons = document.querySelectorAll('[href*="estimate"], .estimate-btn, .cta-button, .free-estimate');
        
        estimateButtons.forEach(button => {
            // Load on hover (for desktop) with debouncing
            let hoverTimer;
            button.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimer);
                hoverTimer = setTimeout(() => this.loadPopupModal(), 100);
            }, { passive: true, once: true });

            // Load on focus (for keyboard navigation)
            button.addEventListener('focus', () => this.loadPopupModal(), { passive: true, once: true });
            
            // Ensure it's loaded on click
            button.addEventListener('click', (e) => {
                this.loadPopupModal();
            }, { passive: true });
        });

        // Load email notifications on form interaction
        const forms = document.querySelectorAll('form[action*="formspree"], .contact-form, #contact-form');
        forms.forEach(form => {
            const firstInput = form.querySelector('input, textarea, select');
            if (firstInput) {
                firstInput.addEventListener('focus', () => this.loadEmailNotifications(), { passive: true, once: true });
            }
        });
    }

    /**
     * Setup delayed loaders for non-critical resources
     */
    setupDelayedLoaders() {
        // Load after page is fully loaded and user has been idle
        window.addEventListener('load', () => {
            // Wait for critical resources to load, then load non-critical ones
            setTimeout(() => {
                // Preload popup modal if user is likely to need it (has stayed on page > 3 seconds)
                if (document.querySelectorAll('[href*="estimate"], .estimate-btn').length > 0) {
                    setTimeout(() => this.loadPopupModal(), 3000);
                }
            }, 1000);
        }, { passive: true });

        // Load on user scroll (indicates engagement)
        let scrollLoaded = false;
        const scrollHandler = () => {
            if (!scrollLoaded && window.pageYOffset > 100) {
                scrollLoaded = true;
                this.loadPopupModal();
                window.removeEventListener('scroll', scrollHandler);
            }
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });
    }

    /**
     * Prefetch resources during idle time
     */
    prefetchOnIdle() {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                // Prefetch commonly needed resources
                const prefetchLinks = [
                    'js/popup-modal.min.js',
                    'css/popup-modal.min.css'
                ];

                prefetchLinks.forEach(href => {
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.href = href;
                    document.head.appendChild(link);
                });
            });
        }
    }
}

// Initialize performance optimizer when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.performanceOptimizer = new PerformanceOptimizer();
    });
} else {
    window.performanceOptimizer = new PerformanceOptimizer();
}

// Expose global functions for backwards compatibility
window.loadPopupModal = () => window.performanceOptimizer?.loadPopupModal();
window.loadServiceAreaMap = () => window.performanceOptimizer?.loadServiceAreaMap();
window.loadEmailNotifications = () => window.performanceOptimizer?.loadEmailNotifications();