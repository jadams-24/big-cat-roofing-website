// Big Cat Roofing - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle with improved touch support
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    let menuOpen = false;

    if (mobileMenuToggle && navMenu) {
        // Function to toggle menu
        function toggleMenu() {
            menuOpen = !menuOpen;
            mobileMenuToggle.classList.toggle('active', menuOpen);
            navMenu.classList.toggle('active', menuOpen);
            body.classList.toggle('menu-open', menuOpen);
            
            // Toggle aria-expanded for accessibility
            mobileMenuToggle.setAttribute('aria-expanded', menuOpen);
            
            // Prevent body scroll when menu is open
            if (menuOpen) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        }

        // Function to close menu
        function closeMenu() {
            if (menuOpen) {
                menuOpen = false;
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                body.classList.remove('menu-open');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            }
        }

        // Add both click and touchend events for better mobile support
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });

        // Prevent double-tap zoom on mobile
        mobileMenuToggle.addEventListener('touchend', function(e) {
            e.preventDefault();
        });

        // Close menu when clicking/touching outside
        document.addEventListener('click', function(e) {
            if (menuOpen && !mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                closeMenu();
            }
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a:not(.has-dropdown > a)');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMenu();
            });
        });

        // Handle escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && menuOpen) {
                closeMenu();
            }
        });
    }

    // Mobile Dropdown Toggle with better touch support
    const dropdownToggles = document.querySelectorAll('.has-dropdown');
    dropdownToggles.forEach(toggle => {
        const link = toggle.querySelector('a');
        const dropdown = toggle.querySelector('.dropdown-menu');
        
        if (link && dropdown) {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close other dropdowns
                    dropdownToggles.forEach(otherToggle => {
                        if (otherToggle !== toggle) {
                            otherToggle.classList.remove('active');
                        }
                    });
                    
                    // Toggle current dropdown
                    toggle.classList.toggle('active');
                }
            });
        }
    });

    // Smooth Scrolling for Anchor Links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact Form Handling - Removed: Using EmailJS handler instead

    // Sticky Header on Scroll
    const header = document.querySelector('.main-header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.classList.add('header-hidden');
        } else {
            // Scrolling up
            header.classList.remove('header-hidden');
        }
        
        if (scrollTop > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // Phone Number Click Tracking
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Track phone click event (Google Analytics or other tracking)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'Contact',
                    'event_label': 'Phone Call'
                });
            }
        });
    });

    // Lazy Loading for Images
    const lazyImages = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }

    // Animation on Scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    if (animateElements.length > 0 && 'IntersectionObserver' in window) {
        const animateObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    animateObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        animateElements.forEach(el => animateObserver.observe(el));
    }

    // Form Validation - DISABLED per client request
    // ALL form validation has been removed to allow unrestricted form submission
    // Forms will submit naturally to Formspree without any client-side validation barriers

    // Service Worker Registration (for PWA support)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js').then(function(registration) {
                console.log('ServiceWorker registration successful');
            }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}