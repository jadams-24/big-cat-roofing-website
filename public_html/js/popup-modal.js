/**
 * Big Cat Roofing - Popup Modal Functionality
 * Professional estimate request modal system
 */

class EstimateModal {
    constructor() {
        this.modal = null;
        this.isOpen = false;
        this.focusableElements = [];
        this.previousActiveElement = null;
        
        this.init();
    }

    init() {
        this.createModal();
        this.bindEvents();
        this.setupFocusTrap();
    }

    createModal() {
        // Create modal HTML structure
        const modalHTML = `
            <div class="estimate-modal-overlay" id="estimate-modal-overlay" role="dialog" aria-labelledby="modal-title" aria-describedby="modal-description" aria-hidden="true">
                <div class="estimate-modal">
                    <div class="estimate-modal-header">
                        <h2 id="modal-title">Request Free Estimate</h2>
                        <p id="modal-description">Professional Service • Same-Day Quotes</p>
                        <button class="estimate-modal-close" aria-label="Close modal" tabindex="0">×</button>
                    </div>
                    
                    <div class="estimate-modal-body">
                        <div class="estimate-modal-intro">
                            <h3>Get Your Free Roofing Quote</h3>
                            <p>Over 20 years serving Metro Detroit with GAF certified excellence. Complete the form below and we'll contact you within 24 hours with your personalized estimate.</p>
                        </div>
                        
                        <div class="estimate-modal-message" id="modal-message"></div>
                        
                        <form class="estimate-modal-form" id="popup-estimate-form">
                            <div class="form-group">
                                <label for="popup-name">Full Name *</label>
                                <input type="text" name="name" id="popup-name" placeholder="Enter your full name" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="popup-phone">Phone Number *</label>
                                <input type="tel" name="phone" id="popup-phone" placeholder="(248) 709-3746" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="popup-email">Email Address *</label>
                                <input type="email" name="email" id="popup-email" placeholder="your.email@example.com" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="popup-address">Property Address *</label>
                                <input type="text" name="address" id="popup-address" placeholder="Property address for estimate" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="popup-service">Service Type *</label>
                                <select name="service" id="popup-service" required>
                                    <option value="">Select Service Type</option>
                                    <option value="residential-roofing">Residential Roofing</option>
                                    <option value="commercial-roofing">Commercial Roofing</option>
                                    <option value="roof-repair">Roof Repair</option>
                                    <option value="emergency-repair">Emergency Repair</option>
                                    <option value="roof-replacement">Roof Replacement</option>
                                    <option value="storm-damage">Storm Damage</option>
                                    <option value="gutter-services">Gutter Services</option>
                                    <option value="inspection">Roof Inspection</option>
                                    <option value="maintenance">Roof Maintenance</option>
                                    <option value="siding">Siding Services</option>
                                    <option value="windows">Window Services</option>
                                    <option value="other">Other Services</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="popup-message">Project Details</label>
                                <textarea name="message" id="popup-message" placeholder="Tell us about your roofing project (optional)" rows="4"></textarea>
                            </div>
                            
                            <button type="submit" class="estimate-modal-submit" id="popup-submit-btn">
                                Request Free Estimate
                            </button>
                        </form>
                    </div>
                    
                    <div class="estimate-modal-trust">
                        <h4>Why Choose Big Cat Roofing?</h4>
                        <div class="estimate-modal-trust-items">
                            <div class="estimate-modal-trust-item">
                                <div class="icon">🏆</div>
                                <span>GAF Certified</span>
                            </div>
                            <div class="estimate-modal-trust-item">
                                <div class="icon">📞</div>
                                <span>Same Day Service</span>
                            </div>
                            <div class="estimate-modal-trust-item">
                                <div class="icon">💰</div>
                                <span>Free Estimates</span>
                            </div>
                            <div class="estimate-modal-trust-item">
                                <div class="icon">🔒</div>
                                <span>Fully Insured</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('estimate-modal-overlay');
    }

    bindEvents() {
        // Bind all "Free Estimate" buttons
        this.bindEstimateButtons();
        
        // Modal close events
        const closeBtn = this.modal.querySelector('.estimate-modal-close');
        closeBtn.addEventListener('click', () => this.closeModal());
        
        // Close on overlay click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeModal();
            }
        });
        
        // Form submission
        const form = this.modal.querySelector('#popup-estimate-form');
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    bindEstimateButtons() {
        // Find all "Free Estimate" buttons and "Schedule Inspection" buttons
        const selectors = [
            'a[href*="contact"]',
            'a[href="#contact"]',
            'button[class*="estimate"]',
            'a[class*="estimate"]',
            '.btn:contains("Free Estimate")',
            '.btn:contains("Get Estimate")',
            '.btn:contains("Request Quote")',
            '.btn:contains("Schedule Inspection")',
            '.nav-cta a',
            'a[href="contact.html"]'
        ];
        
        // More specific approach - look for text content
        const buttons = document.querySelectorAll('a, button');
        buttons.forEach(button => {
            const text = button.textContent.toLowerCase().trim();
            const href = button.getAttribute('href') || '';
            
            if (
                text.includes('free estimate') ||
                text.includes('get estimate') ||
                text.includes('request quote') ||
                text.includes('get quote') ||
                text.includes('schedule inspection') ||
                (text.includes('estimate') && button.classList.contains('btn')) ||
                (href.includes('contact') && text.includes('estimate')) ||
                (href === '#contact' && button.classList.contains('btn-secondary'))
            ) {
                button.addEventListener('click', (e) => this.handleEstimateClick(e, button));
            }
        });
    }

    handleEstimateClick(e, button) {
        e.preventDefault();
        
        // Check if this is a "Schedule Inspection" button
        const buttonText = button.textContent.toLowerCase().trim();
        const serviceSelect = this.modal.querySelector('#popup-service');
        
        if (buttonText.includes('schedule inspection')) {
            // Pre-select "Free Inspection" for inspection buttons
            serviceSelect.value = 'inspection';
        } else {
            // Pre-fill service type if we can determine it from the page
            const serviceType = this.detectServiceType();
            if (serviceType) {
                serviceSelect.value = serviceType;
            } else {
                // Reset to default selection
                serviceSelect.value = '';
            }
        }
        
        this.openModal();
    }

    detectServiceType() {
        const pathname = window.location.pathname.toLowerCase();
        
        if (pathname.includes('residential')) return 'residential-roofing';
        if (pathname.includes('commercial')) return 'commercial-roofing';
        if (pathname.includes('emergency')) return 'emergency-repair';
        if (pathname.includes('gutter')) return 'gutter-services';
        if (pathname.includes('repair')) return 'roof-repair';
        
        return '';
    }

    openModal() {
        this.previousActiveElement = document.activeElement;
        this.modal.setAttribute('aria-hidden', 'false');
        this.modal.classList.add('active');
        document.body.classList.add('modal-open');
        this.isOpen = true;
        
        // Focus first input
        setTimeout(() => {
            const firstInput = this.modal.querySelector('#popup-name');
            if (firstInput) firstInput.focus();
        }, 300);
        
        this.updateFocusableElements();
    }

    closeModal() {
        this.modal.setAttribute('aria-hidden', 'true');
        this.modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        this.isOpen = false;
        
        // Reset form
        const form = this.modal.querySelector('#popup-estimate-form');
        form.reset();
        
        // Hide any messages
        const message = this.modal.querySelector('#modal-message');
        message.style.display = 'none';
        message.className = 'estimate-modal-message';
        
        // Return focus
        if (this.previousActiveElement) {
            this.previousActiveElement.focus();
        }
    }

    setupFocusTrap() {
        this.modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && this.isOpen) {
                this.handleTabKey(e);
            }
        });
    }

    updateFocusableElements() {
        this.focusableElements = this.modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
    }

    handleTabKey(e) {
        this.updateFocusableElements();
        
        const firstElement = this.focusableElements[0];
        const lastElement = this.focusableElements[this.focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const submitBtn = this.modal.querySelector('#popup-submit-btn');
        const messageDiv = this.modal.querySelector('#modal-message');
        const form = e.target;
        
        // Validate form
        if (!this.validateForm(form)) {
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            // Collect form data
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                address: formData.get('address'),
                service: formData.get('service'),
                message: formData.get('message') || 'No additional details provided',
                source: 'Popup Modal - ' + window.location.pathname,
                timestamp: new Date().toLocaleString()
            };
            
            // Use EmailJS if available
            if (window.emailjs && window.EMAILJS_CONFIG) {
                // Format data to match EmailJS template
                const emailParams = {
                    to_email: 'Office@bigcatroofs.com',
                    from_name: 'Big Cat Roofing Website',
                    subject: `New Lead - ${data.service}`,
                    customer_name: data.name,
                    customer_phone: data.phone,
                    customer_email: data.email,
                    service_requested: data.service,
                    customer_message: data.message,
                    property_address: data.address,
                    lead_source: data.source,
                    submission_time: data.timestamp
                };
                
                const response = await emailjs.send(
                    window.EMAILJS_CONFIG.SERVICE_ID,
                    window.EMAILJS_CONFIG.TEMPLATE_ID,
                    emailParams
                );
                
                if (response.status === 200) {
                    this.showSuccessMessage(messageDiv);
                    
                    // Send customer confirmation if template exists
                    if (window.EMAILJS_CONFIG.CUSTOMER_TEMPLATE_ID) {
                        await emailjs.send(
                            window.EMAILJS_CONFIG.SERVICE_ID,
                            window.EMAILJS_CONFIG.CUSTOMER_TEMPLATE_ID,
                            {
                                customer_name: data.name,
                                customer_email: data.email,
                                service_type: data.service,
                                call_number: '248-709-3746'
                            },
                            window.EMAILJS_CONFIG.PUBLIC_KEY
                        );
                    }
                    
                    // Reset form after success
                    setTimeout(() => {
                        form.reset();
                        this.closeModal();
                    }, 3000);
                } else {
                    throw new Error('Failed to send email');
                }
            } else {
                // Fallback to mailto if EmailJS not available
                this.fallbackSubmission(data);
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage(messageDiv);
        } finally {
            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Request Free Estimate';
        }
    }

    showSuccessMessage(messageDiv) {
        messageDiv.className = 'estimate-modal-message success';
        messageDiv.innerHTML = `
            <h4>Request Sent Successfully!</h4>
            <p>Thank you for choosing Big Cat Roofing. We'll contact you within 24 hours to schedule your free estimate. For immediate assistance, call <a href="tel:248-709-3746">248-709-3746</a>.</p>
        `;
        messageDiv.style.display = 'block';
    }

    showErrorMessage(messageDiv) {
        messageDiv.className = 'estimate-modal-message error';
        messageDiv.innerHTML = `
            <h4>Unable to Send Request</h4>
            <p>Please call us directly at <a href="tel:248-709-3746">248-709-3746</a> or try again in a few moments.</p>
        `;
        messageDiv.style.display = 'block';
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        // Clear previous errors
        form.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
        
        requiredFields.forEach(field => {
            const value = field.value.trim();
            
            if (!value) {
                isValid = false;
                field.classList.add('error');
                return;
            }
            
            // Email validation
            if (field.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    field.classList.add('error');
                }
            }
            
            // Phone validation
            if (field.type === 'tel') {
                const phoneRegex = /^[\d\s\-\(\)\+\.]+$/;
                const digitsOnly = value.replace(/\D/g, '');
                if (!phoneRegex.test(value) || digitsOnly.length < 10) {
                    isValid = false;
                    field.classList.add('error');
                }
            }
        });
        
        if (!isValid) {
            // Focus first error field
            const firstError = form.querySelector('.error');
            if (firstError) firstError.focus();
        }
        
        return isValid;
    }
    
    fallbackSubmission(data) {
        const subject = `Free Estimate Request - ${data.service}`;
        const body = `
Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email}
Address: ${data.address}
Service: ${data.service}
Message: ${data.message}
Source: ${data.source}
Time: ${data.timestamp}
        `;
        
        window.location.href = `mailto:Office@bigcatroofs.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        const messageDiv = this.modal.querySelector('#modal-message');
        this.showSuccessMessage(messageDiv);
    }
}

// Initialize modal when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.estimateModal = new EstimateModal();
        console.log('Big Cat Roofing: Estimate modal initialized');
    });
} else {
    // DOM already loaded
    window.estimateModal = new EstimateModal();
    console.log('Big Cat Roofing: Estimate modal initialized');
}

// Debug function to test modal
window.testEstimateModal = function() {
    if (window.estimateModal) {
        window.estimateModal.openModal();
        console.log('Modal test opened successfully');
    } else {
        console.error('Modal not initialized');
    }
};