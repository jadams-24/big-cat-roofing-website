# Big Cat Roofing - EmailJS Setup Instructions

## Overview
This document provides complete instructions for setting up automated email notifications for all contact forms on the Big Cat Roofing website using EmailJS.

## 1. EmailJS Account Setup

### Step 1: Create EmailJS Account
1. Visit [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (allows 200 emails/month)
3. Verify your email address

### Step 2: Add Email Service
1. Go to "Email Services" in your EmailJS dashboard
2. Click "Add New Service"
3. Choose "Gmail" (recommended) or your preferred email provider
4. Connect your **Office@bigcatroofs.com** account
5. Note the **Service ID** (e.g., "service_xyz123")

## 2. Email Templates Setup

### Template 1: Office Notification Template
**Template ID:** `big_cat_contact_form`

**Subject:** `New Lead from Big Cat Roofing Website - {{service_requested}}`

**Email Body:**
```
New Customer Inquiry

Customer Information:
Name: {{customer_name}}
Phone: {{customer_phone}}
Email: {{customer_email}}
Service Requested: {{service_requested}}

Additional Details:
Property Address: {{property_address}}
City/Area: {{city_area}}
Project Urgency: {{project_urgency}}
Newsletter Signup: {{newsletter_signup}}

Message:
{{customer_message}}

Lead Source: {{lead_source}}
Date/Time: {{submission_time}}
Customer IP: {{customer_ip}}
Referrer: {{referrer}}
Form URL: {{form_url}}

---
This is an automated message from BigCatRoofs.com
```

### Template 2: Customer Confirmation Template
**Template ID:** `customer_confirmation_template`

**Subject:** `Thank you for your roofing inquiry - Big Cat Roofing`

**Email Body:**
```
Dear {{customer_name}},

Thank you for contacting Big Cat Roofing! We have received your inquiry for {{service_requested}} and will contact you within 24 hours to schedule your free estimate.

Your Inquiry Details:
- Service: {{service_requested}}
- Submitted: {{submission_time}}

Need Immediate Assistance?
Phone: {{phone_number}}
Website: {{website}}

We appreciate your interest in Big Cat Roofing and look forward to serving you!

Best regards,
The Big Cat Roofing Team

---
Big Cat Roofing
Phone: 248-709-3746
Website: BigCatRoofs.com
```

## 3. Configuration Updates

### Update JavaScript Configuration
In `/js/email-notifications.js`, replace the placeholder values:

```javascript
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'YOUR_ACTUAL_PUBLIC_KEY',     // From EmailJS dashboard
    SERVICE_ID: 'YOUR_ACTUAL_SERVICE_ID',     // From your email service setup
    TEMPLATE_ID: 'big_cat_contact_form'       // Your template ID
};
```

### Get Your EmailJS Keys
1. **Public Key:** Go to "Account" → "General" → "Public Key"
2. **Service ID:** Go to "Email Services" → Select your service → Copy the Service ID
3. **Template IDs:** Go to "Email Templates" → Select template → Copy the Template ID

## 4. Testing Instructions

### Test Email Functionality
1. Fill out any contact form on the website
2. Check that:
   - Form shows "Sending..." during submission
   - Success message appears after submission
   - Office@bigcatroofs.com receives the notification email
   - Customer receives confirmation email
   - Error message appears if EmailJS fails

### Test All Forms
Test these 9 forms:
- ✅ Homepage contact form
- ✅ Main contact page form
- ✅ Service areas main form
- ✅ Warren service area form
- ✅ Sterling Heights service area form
- ✅ Royal Oak service area form
- ✅ Ferndale service area form
- ✅ Roseville service area form
- ✅ Grosse Pointe service area form

## 5. Troubleshooting

### Common Issues

**Emails going to spam folder:**
- Add noreply@emailjs.com to email whitelist
- Check EmailJS service connection
- Verify sender email authentication

**Form submission fails:**
- Check browser console for errors
- Verify EmailJS configuration values
- Ensure internet connection is stable

**Customer confirmations not working:**
- Verify second template is created
- Check template ID matches configuration
- Ensure customer email is valid

### Error Messages
The system includes fallback error handling:
- Shows alternative contact methods if email fails
- Provides phone number and direct email
- Logs errors to browser console for debugging

## 6. Analytics and Monitoring

### Form Submission Tracking
The system automatically tracks:
- Google Analytics events for form submissions
- Facebook Pixel lead tracking (if configured)
- Console logging for debugging

### Monthly Usage Monitoring
- Monitor EmailJS dashboard for usage limits
- Free plan: 200 emails/month
- Upgrade to paid plan if needed

## 7. Security Features

### Anti-Spam Protection
- Form validation prevents empty submissions
- Rate limiting through EmailJS
- Input sanitization and validation
- User agent and IP tracking for analysis

### Data Protection
- No sensitive data stored locally
- HTTPS encryption for all transmissions
- EmailJS handles email delivery securely

## 8. Maintenance

### Regular Checks
- Monthly: Check email delivery rates
- Quarterly: Review and update email templates
- Annually: Review EmailJS plan and usage

### Backup Procedures
- Document all EmailJS settings
- Export email templates
- Maintain alternative contact methods

## 9. Upgrade Options

### EmailJS Paid Plans
- **Personal Plan** ($15/month): 1,000 emails/month
- **Team Plan** ($45/month): 10,000 emails/month
- **Pro Plan** ($75/month): 50,000 emails/month

### Alternative Solutions
If EmailJS becomes insufficient:
- Formspree.io (form backend service)
- Netlify Forms (if hosting on Netlify)
- Custom server-side solution with SendGrid/Mailgun

## 10. Support Contacts

### EmailJS Support
- Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- Support: support@emailjs.com

### Implementation Support
- Review browser console for error messages
- Check EmailJS dashboard for delivery status
- Test with different email providers if issues persist

---

**Important:** After implementing these changes, test thoroughly with real email addresses to ensure proper functionality before going live.