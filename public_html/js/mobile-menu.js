// Big Cat Roofing - Mobile Menu JavaScript

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

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (menuOpen && !navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                closeMenu();
            }
        });

        // Close menu when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && menuOpen) {
                closeMenu();
            }
        });

        // Close menu when window is resized (to desktop size)
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && menuOpen) {
                closeMenu();
            }
        });

        // Close menu when clicking on nav links
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (menuOpen) {
                    closeMenu();
                }
            });
        });
    }
});