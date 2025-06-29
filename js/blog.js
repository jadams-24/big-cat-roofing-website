// Blog Functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Blog Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterCategory = button.getAttribute('data-category');
            
            blogCards.forEach(card => {
                if (filterCategory === 'all') {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    const cardCategories = card.getAttribute('data-category').split(' ');
                    if (cardCategories.includes(filterCategory)) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
    
    // Search Functionality
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-form input');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                // Show all posts if search is empty
                blogCards.forEach(card => {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                });
                return;
            }
            
            blogCards.forEach(card => {
                const title = card.querySelector('.blog-title a').textContent.toLowerCase();
                const excerpt = card.querySelector('.blog-excerpt').textContent.toLowerCase();
                const category = card.querySelector('.blog-category').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || excerpt.includes(searchTerm) || category.includes(searchTerm)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    }
    
    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Here you would typically send the email to your newsletter service
            alert('Thank you for subscribing! We\'ll send you valuable roofing tips and updates.');
            this.reset();
        });
    }
    
    // Pagination Functionality
    const paginationNumbers = document.querySelectorAll('.pagination-number');
    const prevBtn = document.querySelector('.pagination-btn.prev');
    const nextBtn = document.querySelector('.pagination-btn.next');
    
    paginationNumbers.forEach(number => {
        number.addEventListener('click', () => {
            // Remove active class from all numbers
            paginationNumbers.forEach(num => num.classList.remove('active'));
            // Add active class to clicked number
            number.classList.add('active');
            
            // Update prev/next button states
            const currentPage = parseInt(number.textContent);
            const totalPages = paginationNumbers.length;
            
            prevBtn.disabled = currentPage === 1;
            nextBtn.disabled = currentPage === totalPages;
            
            // Scroll to top of blog content
            document.querySelector('.blog-content').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        });
    });
    
    // Prev/Next Button Functionality
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            const current = document.querySelector('.pagination-number.active');
            const prev = current.previousElementSibling;
            if (prev && prev.classList.contains('pagination-number')) {
                prev.click();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            const current = document.querySelector('.pagination-number.active');
            const next = current.nextElementSibling;
            if (next && next.classList.contains('pagination-number')) {
                next.click();
            }
        });
    }
    
    // Smooth animations for blog cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const blogObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Apply animation observer to blog cards
    blogCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        blogObserver.observe(card);
    });
    
    // Apply animation to sidebar widgets
    const sidebarWidgets = document.querySelectorAll('.sidebar-widget');
    sidebarWidgets.forEach((widget, index) => {
        widget.style.opacity = '0';
        widget.style.transform = 'translateX(30px)';
        widget.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        widget.style.transitionDelay = `${index * 0.1}s`;
        
        setTimeout(() => {
            widget.style.opacity = '1';
            widget.style.transform = 'translateX(0)';
        }, 300 + (index * 100));
    });
});