# Big Cat Roofing - City Service Page Blueprint

**STRICTLY FOR CITY SERVICE PAGES ONLY**
- Use for: warren-roofing.html, troy-roofing.html, sterling-heights-roofing.html, etc.
- DO NOT use for: residential-roofing.html, commercial-roofing.html, gutter-services.html, or main service pages
- This template is exclusively for location-specific landing pages

## HTML Structure Template

### 1. Document Head Section
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Service Type] in [City Name], MI | Big Cat Roofing</title>
    <meta name="description" content="Professional [service type] in [City Name], MI. Big Cat Roofing serves [City Name] with expert roofing services. Licensed contractors. Free estimates. Call 248-709-3746.">
    <link rel="canonical" href="https://bigcatroofs.com/[city-name]-roofing.html" />
    
    <!-- Include existing CSS files -->
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/responsive.css">
    
    <!-- Google Analytics -->
    <!-- [Include existing Google tag code] -->
</head>
```

### 2. Page Header Structure
```html
<body>
    <!-- Include existing header/navigation -->
    <header class="main-header">
        <!-- Existing navigation structure -->
    </header>
```

### 3. Hero Section Template
```html
<section class="hero-section city-hero">
    <div class="container">
        <div class="hero-content">
            <h1 class="hero-title">[Service Type] in [City Name], Michigan</h1>
            <p class="hero-subtitle">Professional Service • Same-Day Quotes • [Unique City Benefit]</p>
            <div class="hero-description">
                <p>[Unique city introduction with local landmark/characteristic]</p>
            </div>
            <div class="hero-features">
                <div class="feature-item">✓ Licensed & Insured (License No. 262400159)</div>
                <div class="feature-item">✓ [City-specific benefit]</div>
                <div class="feature-item">✓ Free Estimates</div>
            </div>
            <a href="#contact" class="cta-button primary">Get Free Estimate in [City Name]</a>
        </div>
    </div>
</section>
```

### 4. Services Section Template
```html
<section class="services-section">
    <div class="container">
        <h2 class="section-title">Comprehensive [Service Type] Services for [City Name] Residents</h2>
        
        <div class="services-grid">
            <div class="service-card">
                <div class="service-icon">
                    <i class="icon-[service1]"></i>
                </div>
                <h3>[Service 1 Name]</h3>
                <p>[Service description with city-specific context]</p>
                <a href="/[main-service-page].html" class="learn-more-link" 
                   title="Learn more about [Service 1] services in [City Name]">
                   Learn More About [Service 1]
                </a>
            </div>
            
            <!-- Repeat for additional services -->
        </div>
    </div>
</section>
```

### 5. Local Expertise Section
```html
<section class="local-expertise">
    <div class="container">
        <h2>Why Choose Big Cat Roofing in [City Name]?</h2>
        
        <div class="expertise-grid">
            <div class="expertise-item">
                <h3>Local Knowledge</h3>
                <p>[City-specific expertise - weather patterns, architecture, etc.]</p>
            </div>
            
            <div class="expertise-item">
                <h3>Proven Results</h3>
                <p>[Number] successful projects completed in [City Name] and surrounding areas.</p>
            </div>
            
            <div class="expertise-item">
                <h3>Fast Response</h3>
                <p>Emergency service available throughout [City Name] and [nearby neighborhoods].</p>
            </div>
        </div>
    </div>
</section>
```

### 6. Testimonials Section
```html
<section class="testimonials-section">
    <div class="container">
        <h2>What [City Name] Homeowners Say</h2>
        
        <div class="testimonials-grid">
            <div class="testimonial-card">
                <div class="testimonial-content">
                    <p>"[City-specific customer quote]"</p>
                </div>
                <div class="testimonial-author">
                    <strong>[Customer Name]</strong>
                    <span>[Neighborhood], [City Name]</span>
                </div>
            </div>
            
            <!-- Add 2-3 city-specific testimonials -->
        </div>
    </div>
</section>
```

### 7. Service Area Map Section
```html
<section class="service-area-section">
    <div class="container">
        <h2>Serving [City Name] and Surrounding Areas</h2>
        
        <div class="map-container">
            <!-- Embedded Google Map focused on the city -->
            <iframe src="https://www.google.com/maps/embed?pb=[city-specific-coordinates]"
                    width="100%" height="400" style="border:0;" allowfullscreen="" 
                    loading="lazy" referrerpolicy="no-referrer-when-downgrade">
            </iframe>
        </div>
        
        <div class="service-areas">
            <h3>Areas We Serve in [City Name]:</h3>
            <ul class="areas-list">
                <li>[Neighborhood 1]</li>
                <li>[Neighborhood 2]</li>
                <li>[Neighborhood 3]</li>
                <li>And surrounding areas</li>
            </ul>
        </div>
    </div>
</section>
```

### 8. FAQ Section
```html
<section class="faq-section">
    <div class="container">
        <h2>Frequently Asked Questions - [City Name] Roofing</h2>
        
        <div class="faq-grid">
            <div class="faq-item">
                <h3>Do I need a permit for roof repair in [City Name], MI?</h3>
                <p>[City-specific permit information]</p>
            </div>
            
            <div class="faq-item">
                <h3>How does [City Name]'s weather affect my roof?</h3>
                <p>[Local weather impact explanation]</p>
            </div>
            
            <div class="faq-item">
                <h3>What's the average cost of roofing in [City Name]?</h3>
                <p>[Local pricing context with ranges]</p>
            </div>
            
            <!-- Add 3-5 city-specific FAQs -->
        </div>
    </div>
</section>
```

### 9. Contact/CTA Section
```html
<section class="contact-cta">
    <div class="container">
        <div class="cta-content">
            <h2>Ready to Get Started in [City Name]?</h2>
            <p>Get your free [service type] estimate today. Same-day quotes available!</p>
            
            <div class="contact-options">
                <a href="tel:248-709-3746" class="cta-button primary">
                    Call (248) 709-3746
                </a>
                <a href="#quote-form" class="cta-button secondary">
                    Request Free Estimate
                </a>
            </div>
            
            <div class="service-info">
                <p><strong>Serving:</strong> [City Name] • [Nearby City 1] • [Nearby City 2] • And surrounding Metro Detroit areas</p>
            </div>
        </div>
    </div>
</section>
```

## CSS Styling Requirements

### 1. Color Scheme (Consistent with Main Site)
```css
:root {
    --primary-gold: #d4af37;
    --secondary-gold: #C8AF6A;
    --dark-background: #333;
    --light-background: #f9f9f9;
    --text-primary: #333;
    --text-secondary: #666;
    --white: #ffffff;
}
```

### 2. Typography
```css
.hero-title {
    font-size: 2.5rem;
    color: var(--text-primary);
    margin-bottom: 1rem;
    font-weight: bold;
}

.section-title {
    font-size: 2rem;
    color: var(--text-primary);
    text-align: center;
    margin-bottom: 2rem;
    border-bottom: 2px solid var(--primary-gold);
    padding-bottom: 0.5rem;
}

.hero-subtitle {
    font-size: 1.2rem;
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
}
```

### 3. Layout Components
```css
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.service-card {
    background: var(--white);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    text-align: center;
}

.service-icon {
    width: 80px;
    height: 80px;
    background: var(--secondary-gold);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem auto;
    color: var(--white);
    font-size: 2rem;
}
```

### 4. Buttons and CTAs
```css
.cta-button {
    display: inline-block;
    padding: 15px 30px;
    border-radius: 5px;
    text-decoration: none;
    font-weight: bold;
    transition: all 0.3s ease;
    text-align: center;
}

.cta-button.primary {
    background: var(--primary-gold);
    color: var(--white);
}

.cta-button.primary:hover {
    background: var(--secondary-gold);
    transform: translateY(-2px);
}

.cta-button.secondary {
    background: transparent;
    color: var(--primary-gold);
    border: 2px solid var(--primary-gold);
}
```

### 5. Responsive Design
```css
@media (max-width: 768px) {
    .hero-title {
        font-size: 2rem;
    }
    
    .services-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
    
    .container {
        padding: 0 15px;
    }
}
```

## Implementation Guidelines

### Brand Consistency
- **Primary Gold**: #d4af37 (Main buttons, headers)
- **Secondary Gold**: #C8AF6A (Icons, accents)
- **Dark Text**: #333 (Primary content)
- **Light Background**: #f9f9f9 (Section backgrounds)

### Content Guidelines
1. **City-Specific Content**: Each page must include unique local information
2. **Service Integration**: Link to main service pages for detailed information
3. **Local SEO**: Include city name in titles, headers, and throughout content
4. **Contact Information**: Always include phone number and service area

### Technical Requirements
1. **Responsive Design**: Must work on all device sizes
2. **Fast Loading**: Optimize images and minify CSS
3. **SEO Optimized**: Include meta descriptions, canonical URLs
4. **Accessibility**: Use proper heading structure and alt text

### File Naming Convention
- City pages: `[city-name]-roofing.html`
- Example: `warren-roofing.html`, `troy-roofing.html`

### Testing Checklist
- [ ] Responsive design on mobile, tablet, desktop
- [ ] All links work correctly
- [ ] Contact forms submit properly
- [ ] Google Maps embed loads correctly
- [ ] CSS is minified and optimized
- [ ] Page loads in under 3 seconds

## IMPORTANT REMINDERS

**✅ USE THIS BLUEPRINT FOR:**
- warren-roofing.html
- troy-roofing.html
- sterling-heights-roofing.html
- ferndale-roofing.html
- Any new city-specific landing pages

**❌ DO NOT USE FOR:**
- residential-roofing.html (main service page)
- commercial-roofing.html (main service page)
- gutter-services.html (main service page)
- storm-repair.html (main service page)
- contact.html (contact page)
- index.html (homepage)

This blueprint ensures consistency across all city-specific pages while maintaining the Big Cat Roofing brand identity and providing the structure needed for effective local SEO and user experience.