# Google Ads Lead Generation Setup Guide

This guide will help you set up Google Ads conversion tracking for the "Get a free custom website quote" lead generation campaign.

## 🎯 Current Optimizations Implemented

### 1. SEO & Meta Tags Optimization
- **Title**: "Get Free Custom Website Quote | Professional Web Development | Ventaro AI"
- **Description**: Focused on lead generation keywords
- **Keywords**: Optimized for "free website quote", "custom website development", etc.
- **Open Graph & Twitter Cards**: Configured for social sharing

### 2. Conversion Tracking Setup
- ✅ Google Analytics enhanced ecommerce tracking
- ✅ Custom event tracking for form submissions
- ✅ Lead generation event tracking
- ✅ Error tracking for form failures
- ⚠️ **Google Ads conversion tracking** (needs configuration)

### 3. Structured Data (JSON-LD)
- ✅ LocalBusiness schema markup
- ✅ Service offerings structured data
- ✅ Aggregate ratings and reviews
- ✅ Contact information and service area

## 🔧 Google Ads Conversion Setup

### Step 1: Create Google Ads Conversion Action

1. **Go to Google Ads Console**:
   - Navigate to Tools & Settings > Conversions
   - Click the "+" button to create a new conversion

2. **Choose Conversion Type**:
   - Select "Website"
   - Choose "Leads" as the conversion category

3. **Configure Conversion Settings**:
   ```
   Conversion Name: Website Quote Request
   Category: Lead
   Value: Use the same value for each conversion
   Default Value: 1 (or your estimated lead value)
   Count: One (recommended for leads)
   Conversion Window: 30 days
   View-through Conversion Window: 1 day
   Attribution Model: Data-driven
   ```

### Step 2: Get Your Conversion ID and Label

After creating the conversion action, Google will provide:
- **Conversion ID**: Format `AW-XXXXXXXXXX`
- **Conversion Label**: Format `XXXXXXXXXXXXXX`

### Step 3: Update the Code

Replace the placeholder in `/src/app/page.tsx`:

```javascript
// BEFORE (line ~95)
window.gtag('event', 'conversion', {
  'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL', // Replace with actual Google Ads conversion ID
  'value': 1.0,
  'currency': 'USD',
  'transaction_id': Date.now().toString()
});

// AFTER (replace with your actual values)
window.gtag('event', 'conversion', {
  'send_to': 'AW-1234567890/AbCdEfGhIj', // Your actual conversion ID/Label
  'value': 1.0,
  'currency': 'USD',
  'transaction_id': Date.now().toString()
});
```

### Step 4: Test Conversion Tracking

1. **Use Google Tag Assistant**:
   - Install the Google Tag Assistant Chrome extension
   - Navigate to your website
   - Fill out and submit the quote form
   - Verify that the conversion event fires

2. **Check Google Ads**:
   - Go to Tools & Settings > Conversions
   - Look for test conversions (may take 24-48 hours to appear)

## 📊 Analytics Events Implemented

### Form Interaction Events
```javascript
// Form submission start
analytics.trackFormSubmit('website_quote_request', {
  project_type: contactForm.projectType,
  services: contactForm.services,
  timeline: contactForm.timeline,
  has_phone: !!contactForm.phone,
  has_company: !!contactForm.company
});

// Successful lead generation
analytics.track('lead_generated', {
  lead_type: 'website_quote_request',
  project_type: contactForm.projectType,
  services_count: contactForm.services.length,
  timeline: contactForm.timeline,
  form_location: 'homepage_quote_builder'
});

// Google Ads conversion
window.gtag('event', 'conversion', {
  'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
  'value': 1.0,
  'currency': 'USD',
  'transaction_id': Date.now().toString()
});

// Standard lead generation event
window.gtag('event', 'generate_lead', {
  'currency': 'USD',
  'value': 1.0
});
```

## 🎯 Google Ads Campaign Recommendations

### Target Keywords
- "free website quote"
- "custom website development"
- "professional web design services"
- "e-commerce website development"
- "get website quote online"
- "web development consultation"

### Ad Copy Suggestions
```
Headline 1: Get Free Custom Website Quote
Headline 2: Professional Web Development
Headline 3: Transform Your Business Online

Description 1: Professional custom websites, e-commerce stores, and SEO optimization. Get your free quote today!
Description 2: Expert web developers ready to build your perfect website. Free consultation and quote available.
```

### Landing Page Optimizations
- ✅ Clear value proposition in hero section
- ✅ Prominent quote form above the fold
- ✅ Service selection with comprehensive options
- ✅ Professional design and trust signals
- ✅ Mobile-responsive design
- ✅ Fast loading times

## 🔍 Monitoring & Optimization

### Key Metrics to Track
1. **Conversion Rate**: Form submissions / Page visits
2. **Cost Per Lead**: Ad spend / Number of leads
3. **Lead Quality**: Follow-up success rate
4. **Form Completion Rate**: Submissions / Form starts

### A/B Testing Opportunities
1. **Headlines**: Test different value propositions
2. **Form Fields**: Test required vs optional fields
3. **CTA Buttons**: Test different button text and colors
4. **Service Options**: Test different service categorizations

## 🚀 Next Steps

1. **Set up Google Ads conversion tracking** (replace placeholder values)
2. **Create Google Ads campaigns** targeting the recommended keywords
3. **Set up Google Search Console** for organic search optimization
4. **Implement heat mapping** (Hotjar/Crazy Egg) to optimize form placement
5. **Set up automated email sequences** for lead nurturing

## 📞 Support

If you need help with the Google Ads setup:
- Email: chris.t@ventarosales.com
- The conversion tracking code is ready - just needs the actual conversion ID/Label

---

**Note**: The website is already optimized for Google Ads lead generation. You just need to:
1. Create the Google Ads conversion action
2. Replace the placeholder conversion ID in the code
3. Launch your campaigns

All tracking, analytics, and optimization features are already implemented and ready to go!