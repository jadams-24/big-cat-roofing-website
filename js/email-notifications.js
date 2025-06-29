// Big Cat Roofing - Email Notification System
// EmailJS Integration for automated email notifications

// EmailJS Configuration
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'vRW-Ukq8hMSjaW2GJ',      // Your EmailJS public key
    SERVICE_ID: 'service_ais5dcc',         // Your EmailJS service ID
    TEMPLATE_ID: 'big_cat_contact_form'    // Template ID for contact form emails
};

// Initialize EmailJS when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your public key
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    
    // Initialize all contact forms
    initializeContactForms();
});

// Initialize all contact forms with email notifications
function initializeContactForms() {
    const formConfigs = [
        { id: 'contact-form', type: 'homepage' },
        { id: 'main-contact-form', type: 'contact-page' },
        { id: 'service-area-contact-form', type: 'service-areas' },
        { id: 'warren-contact-form', type: 'warren' },
        { id: 'sterling-heights-contact-form', type: 'sterling-heights' },
        { id: 'royal-oak-contact-form', type: 'royal-oak' },
        { id: 'ferndale-contact-form', type: 'ferndale' },
        { id: 'roseville-contact-form', type: 'roseville' },
        { id: 'grosse-pointe-contact-form', type: 'grosse-pointe' }
    ];

    formConfigs.forEach(config => {
        const form = document.getElementById(config.id);
        if (form) {
            setupFormSubmission(form, config.type);
        }
    });
}

// Setup form submission with email notifications
function setupFormSubmission(form, formType) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        try {
            // Validate form
            if (!validateForm(form)) {
                throw new Error('Please fill in all required fields correctly.');
            }
            
            // Get form data
            const formData = getFormData(form, formType);
            
            // Send email notification to office
            await sendEmailNotification(formData);
            
            // Send confirmation email to customer
            await sendCustomerConfirmation(formData);
            
            // Show success message
            showSuccessMessage(form);
            
            // Reset form
            form.reset();
            
            // Track conversion (Google Analytics)
            trackFormSubmission(formType, formData.service);
            
        } catch (error) {
            console.error('Form submission error:', error);
            showErrorMessage(form, error.message);
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

// Extract and format form data
function getFormData(form, formType) {
    const formData = new FormData(form);
    const data = {};
    
    // Extract all form fields
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    // Add metadata
    data.formType = formType;
    data.timestamp = new Date().toLocaleString('en-US', {
        timeZone: 'America/Detroit',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    data.userAgent = navigator.userAgent;
    data.referrer = document.referrer || 'Direct';
    data.currentUrl = window.location.href;
    
    // Get user's IP address (will be added by EmailJS)
    data.userIp = 'Detected by server';
    
    return data;
}

// Send email notification to office
async function sendEmailNotification(data) {
    const emailParams = {
        to_email: 'Office@bigcatroofs.com',
        from_name: 'Big Cat Roofing Website',
        subject: `New Lead from Big Cat Roofing Website - ${data.service || 'General Inquiry'}`,
        
        // Customer Information
        customer_name: data.name || 'Not provided',
        customer_phone: data.phone || 'Not provided',
        customer_email: data.email || 'Not provided',
        service_requested: data.service || 'Not specified',
        customer_message: data.message || 'No message provided',
        
        // Additional Information
        property_address: data.address || data.warren_address || data.sterling_heights_address || 'Not provided',
        city_area: data.city || getLocationFromFormType(data.formType),
        project_urgency: data.urgency || 'Normal',
        newsletter_signup: data.newsletter ? 'Yes' : 'No',
        
        // Metadata
        lead_source: `Website Contact Form (${data.formType})`,
        submission_time: data.timestamp,
        customer_ip: data.userIp,
        user_agent: data.userAgent,
        referrer: data.referrer,
        form_url: data.currentUrl
    };
    
    try {
        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            emailParams
        );
        
        console.log('Office notification sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Failed to send office notification:', error);
        throw new Error('Failed to send notification. Please try again or call us directly at 248-709-3746.');
    }
}

// Send confirmation email to customer
async function sendCustomerConfirmation(data) {
    const confirmationParams = {
        to_email: data.email,
        to_name: data.name,
        from_name: 'Big Cat Roofing',
        subject: 'Thank you for your roofing inquiry - Big Cat Roofing',
        
        customer_name: data.name,
        service_requested: data.service || 'General Inquiry',
        phone_number: '248-709-3746',
        website: 'BigCatRoofs.com',
        submission_time: data.timestamp
    };
    
    try {
        // Use a separate template for customer confirmations
        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            'customer_confirmation_', // Separate template for customer emails
            confirmationParams
        );
        
        console.log('Customer confirmation sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Failed to send customer confirmation:', error);
        // Don't throw error here - office notification is more important
    }
}

// Enhanced form validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        // Clear previous errors
        field.classList.remove('error');
        
        // Check if field is empty
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            return;
        }
        
        // Email validation
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                field.classList.add('error');
            }
        }
        
        // Phone validation (allow various formats)
        if (field.type === 'tel') {
            const phoneRegex = /^[\d\s\-\(\)\+\.]+$/;
            const digitsOnly = field.value.replace(/\D/g, '');
            if (!phoneRegex.test(field.value) || digitsOnly.length < 10) {
                isValid = false;
                field.classList.add('error');
            }
        }
        
        // Name validation (no numbers or special characters)
        if (field.name === 'name') {
            const nameRegex = /^[a-zA-Z\s\-\'\.]+$/;
            if (!nameRegex.test(field.value)) {
                isValid = false;
                field.classList.add('error');
            }
        }
    });
    
    return isValid;
}

// Show success message
function showSuccessMessage(form) {
    // Remove any existing messages
    removeStatusMessages(form);
    
    const successMessage = document.createElement('div');
    successMessage.className = 'form-message success-message';
    successMessage.innerHTML = `
        <div class="message-content">
            <svg class="message-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="message-text">
                <h4>Thank You!</h4>
                <p>Your inquiry has been received. We'll contact you within 24 hours to schedule your free estimate.</p>
                <p><strong>Need immediate assistance?</strong><br>
                Call us now: <a href="tel:248-709-3746">248-709-3746</a></p>
            </div>
        </div>
    `;
    
    form.parentNode.insertBefore(successMessage, form);
    
    // Auto-remove message after 10 seconds
    setTimeout(() => {
        if (successMessage.parentNode) {
            successMessage.parentNode.removeChild(successMessage);
        }
    }, 10000);
}

// Show error message
function showErrorMessage(form, message) {
    // Remove any existing messages
    removeStatusMessages(form);
    
    const errorMessage = document.createElement('div');
    errorMessage.className = 'form-message error-message';
    errorMessage.innerHTML = `
        <div class="message-content">
            <svg class="message-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
            </svg>
            <div class="message-text">
                <h4>Submission Failed</h4>
                <p>${message}</p>
                <p><strong>Alternative contact methods:</strong><br>
                Call: <a href="tel:248-709-3746">248-709-3746</a><br>
                Email: <a href="mailto:Office@bigcatroofs.com">Office@bigcatroofs.com</a></p>
            </div>
        </div>
    `;
    
    form.parentNode.insertBefore(errorMessage, form);
    
    // Auto-remove message after 15 seconds
    setTimeout(() => {
        if (errorMessage.parentNode) {
            errorMessage.parentNode.removeChild(errorMessage);
        }
    }, 15000);
}

// Remove status messages
function removeStatusMessages(form) {
    const existingMessages = form.parentNode.querySelectorAll('.form-message');
    existingMessages.forEach(message => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    });
}

// Get location from form type
function getLocationFromFormType(formType) {
    const locationMap = {
        'warren': 'Warren, MI',
        'sterling-heights': 'Sterling Heights, MI',
        'royal-oak': 'Royal Oak, MI',
        'ferndale': 'Ferndale, MI',
        'roseville': 'Roseville, MI',
        'grosse-pointe': 'Grosse Pointe, MI',
        'homepage': 'Website Homepage',
        'contact-page': 'Contact Page',
        'service-areas': 'Service Areas Page'
    };
    
    return locationMap[formType] || 'Metro Detroit';
}

// Track form submission for analytics
function trackFormSubmission(formType, service) {
    // Google Analytics 4 tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
            'event_category': 'Contact',
            'event_label': `${formType} - ${service}`,
            'form_type': formType,
            'service_type': service
        });
    }
    
    // Facebook Pixel tracking
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: 'Contact Form Submission',
            content_category: formType,
            service_type: service
        });
    }
    
    console.log('Form submission tracked:', { formType, service });
}

// Export functions for external use
window.BigCatEmailNotifications = {
    initializeContactForms,
    setupFormSubmission,
    validateForm,
    sendEmailNotification,
    sendCustomerConfirmation
};