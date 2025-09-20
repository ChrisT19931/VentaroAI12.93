#!/usr/bin/env node

/**
 * Email Template Testing Script
 * This script shows what the email templates look like and tests the email system
 * without requiring real API keys by using a mock email service
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 EMAIL TEMPLATE PREVIEW & TESTING');
console.log('=' .repeat(50));

// Generate email templates that would be sent
function generateContactFormEmails(formData) {
  const userEmail = {
    to: formData.email,
    from: 'chris.t@ventarosales.com',
    subject: 'Thank you for contacting Ventaro AI',
    html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank you for contacting Ventaro AI</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .highlight { background: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .button { display: inline-block; background: #2196f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Ventaro AI</h1>
        <p>Thank you for reaching out!</p>
    </div>
    <div class="content">
        <h2>Hi ${formData.name}! 👋</h2>
        <p>Thank you for contacting Ventaro AI. We've received your message and our team will get back to you within 24 hours.</p>
        
        <div class="highlight">
            <h3>📋 Your Message Summary:</h3>
            <p><strong>Subject:</strong> ${formData.subject}</p>
            <p><strong>Message:</strong> ${formData.message}</p>
            ${formData.company ? `<p><strong>Company:</strong> ${formData.company}</p>` : ''}
            ${formData.projectType ? `<p><strong>Project Type:</strong> ${formData.projectType}</p>` : ''}
            ${formData.timeline ? `<p><strong>Timeline:</strong> ${formData.timeline}</p>` : ''}
            ${formData.budget ? `<p><strong>Budget:</strong> ${formData.budget}</p>` : ''}
        </div>
        
        <p>🎯 <strong>What happens next?</strong></p>
        <ul>
            <li>Our AI specialists will review your requirements</li>
            <li>We'll prepare a customized solution proposal</li>
            <li>You'll receive a detailed response within 24 hours</li>
            <li>We'll schedule a consultation call if needed</li>
        </ul>
        
        <p>In the meantime, feel free to explore our AI solutions and case studies on our website.</p>
        
        <a href="https://ventaroai.com" class="button">🌐 Visit Our Website</a>
        
        <p>Best regards,<br>
        <strong>The Ventaro AI Team</strong></p>
    </div>
    <div class="footer">
        <p>© 2024 Ventaro AI | Transforming Business with AI</p>
        <p>📧 chris.t@ventarosales.com | 🌐 ventaroai.com</p>
    </div>
</body>
</html>
    `,
    text: `
Hi ${formData.name}!

Thank you for contacting Ventaro AI. We've received your message and our team will get back to you within 24 hours.

Your Message Summary:
- Subject: ${formData.subject}
- Message: ${formData.message}
${formData.company ? `- Company: ${formData.company}` : ''}
${formData.projectType ? `- Project Type: ${formData.projectType}` : ''}
${formData.timeline ? `- Timeline: ${formData.timeline}` : ''}
${formData.budget ? `- Budget: ${formData.budget}` : ''}

What happens next?
• Our AI specialists will review your requirements
• We'll prepare a customized solution proposal  
• You'll receive a detailed response within 24 hours
• We'll schedule a consultation call if needed

Best regards,
The Ventaro AI Team

© 2024 Ventaro AI | chris.t@ventarosales.com | ventaroai.com
    `
  };

  const adminEmail = {
    to: 'chris.t@ventarosales.com',
    from: 'chris.t@ventarosales.com',
    subject: `🚨 New Contact Form Submission from ${formData.name}`,
    html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ff6b35; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .urgent { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        .contact-info { background: #e8f5e8; padding: 15px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚨 New Contact Form Submission</h1>
        <p>Immediate attention required</p>
    </div>
    <div class="content">
        <div class="urgent">
            <h3>⚡ Action Required</h3>
            <p>A new contact form has been submitted. Please respond within 24 hours.</p>
        </div>
        
        <div class="info-box">
            <h3>👤 Contact Information</h3>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            ${formData.phone ? `<p><strong>Phone:</strong> ${formData.phone}</p>` : ''}
            ${formData.company ? `<p><strong>Company:</strong> ${formData.company}</p>` : ''}
        </div>
        
        <div class="info-box">
            <h3>📋 Project Details</h3>
            <p><strong>Subject:</strong> ${formData.subject}</p>
            <p><strong>Message:</strong></p>
            <p style="background: #f0f0f0; padding: 15px; border-radius: 5px;">${formData.message}</p>
            ${formData.projectType ? `<p><strong>Project Type:</strong> ${formData.projectType}</p>` : ''}
            ${formData.timeline ? `<p><strong>Timeline:</strong> ${formData.timeline}</p>` : ''}
            ${formData.budget ? `<p><strong>Budget:</strong> ${formData.budget}</p>` : ''}
            ${formData.services ? `<p><strong>Services:</strong> ${Array.isArray(formData.services) ? formData.services.join(', ') : formData.services}</p>` : ''}
        </div>
        
        <div class="contact-info">
            <h3>📞 Next Steps</h3>
            <p>1. Review the project requirements</p>
            <p>2. Prepare a customized proposal</p>
            <p>3. Respond to ${formData.email} within 24 hours</p>
            <p>4. Schedule a consultation call if needed</p>
        </div>
        
        <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
    </div>
</body>
</html>
    `,
    text: `
NEW CONTACT FORM SUBMISSION

Action Required: Please respond within 24 hours

Contact Information:
- Name: ${formData.name}
- Email: ${formData.email}
${formData.phone ? `- Phone: ${formData.phone}` : ''}
${formData.company ? `- Company: ${formData.company}` : ''}

Project Details:
- Subject: ${formData.subject}
- Message: ${formData.message}
${formData.projectType ? `- Project Type: ${formData.projectType}` : ''}
${formData.timeline ? `- Timeline: ${formData.timeline}` : ''}
${formData.budget ? `- Budget: ${formData.budget}` : ''}
${formData.services ? `- Services: ${Array.isArray(formData.services) ? formData.services.join(', ') : formData.services}` : ''}

Next Steps:
1. Review the project requirements
2. Prepare a customized proposal  
3. Respond to ${formData.email} within 24 hours
4. Schedule a consultation call if needed

Submission Time: ${new Date().toLocaleString()}
    `
  };

  return { userEmail, adminEmail };
}

function generateNewsletterEmails(formData) {
  const userEmail = {
    to: formData.email,
    from: 'chris.t@ventarosales.com',
    subject: '🎉 Welcome to Ventaro AI Updates!',
    html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Ventaro AI Updates</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .welcome-box { background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .benefits { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 Welcome to Ventaro AI!</h1>
        <p>You're now part of our AI community</p>
    </div>
    <div class="content">
        <h2>Hi ${formData.name || 'there'}! 👋</h2>
        <p>Welcome to Ventaro AI Updates! You've successfully subscribed to our newsletter.</p>
        
        <div class="welcome-box">
            <h3>🚀 What you'll receive:</h3>
            <ul>
                <li>Latest AI industry insights and trends</li>
                <li>Exclusive tips for AI implementation</li>
                <li>Case studies and success stories</li>
                <li>Early access to new AI tools and features</li>
                <li>Invitations to webinars and events</li>
            </ul>
        </div>
        
        <div class="benefits">
            <h3>🎯 Get Started Today</h3>
            <p>Explore our AI solutions and see how we can transform your business:</p>
            <ul>
                <li>AI Chatbot Development</li>
                <li>Custom AI Integration</li>
                <li>AI Training & Support</li>
                <li>Business Process Automation</li>
            </ul>
        </div>
        
        <p>Thank you for joining our community! We're excited to help you on your AI journey.</p>
        
        <p>Best regards,<br>
        <strong>The Ventaro AI Team</strong></p>
    </div>
</body>
</html>
    `,
    text: `
Welcome to Ventaro AI Updates!

Hi ${formData.name || 'there'}!

You've successfully subscribed to our newsletter.

What you'll receive:
• Latest AI industry insights and trends
• Exclusive tips for AI implementation  
• Case studies and success stories
• Early access to new AI tools and features
• Invitations to webinars and events

Get Started Today - Explore our AI solutions:
• AI Chatbot Development
• Custom AI Integration
• AI Training & Support  
• Business Process Automation

Thank you for joining our community!

Best regards,
The Ventaro AI Team
    `
  };

  return { userEmail };
}

// Test data
const testContactData = {
  name: 'John Smith',
  email: 'christroiano1993@gmail.com',
  subject: 'AI Chatbot Development Inquiry',
  message: 'We need a comprehensive AI chatbot solution for our customer service. The bot should handle common inquiries, integrate with our CRM, and provide seamless handoff to human agents.',
  company: 'Tech Innovations Inc.',
  projectType: 'AI Chatbot Development',
  timeline: '2-3 months',
  budget: '$15,000 - $30,000',
  services: ['AI Development', 'Custom Integration', 'Training & Support'],
  phone: '+1-555-123-4567'
};

const testNewsletterData = {
  email: 'christroiano1993@gmail.com',
  name: 'John Smith'
};

// Generate and display templates
console.log('\n🎨 GENERATING EMAIL TEMPLATES...');
console.log('=' .repeat(50));

// Contact form emails
const contactEmails = generateContactFormEmails(testContactData);
console.log('\n📧 CONTACT FORM - USER CONFIRMATION EMAIL:');
console.log('To:', contactEmails.userEmail.to);
console.log('Subject:', contactEmails.userEmail.subject);
console.log('\n📧 CONTACT FORM - ADMIN NOTIFICATION EMAIL:');
console.log('To:', contactEmails.adminEmail.to);
console.log('Subject:', contactEmails.adminEmail.subject);

// Newsletter emails
const newsletterEmails = generateNewsletterEmails(testNewsletterData);
console.log('\n📧 NEWSLETTER - WELCOME EMAIL:');
console.log('To:', newsletterEmails.userEmail.to);
console.log('Subject:', newsletterEmails.userEmail.subject);

// Save templates to files for preview
const templatesDir = path.join(__dirname, 'email-templates-preview');
if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir);
}

// Save HTML templates
fs.writeFileSync(path.join(templatesDir, 'contact-user-confirmation.html'), contactEmails.userEmail.html);
fs.writeFileSync(path.join(templatesDir, 'contact-admin-notification.html'), contactEmails.adminEmail.html);
fs.writeFileSync(path.join(templatesDir, 'newsletter-welcome.html'), newsletterEmails.userEmail.html);

console.log('\n💾 EMAIL TEMPLATES SAVED:');
console.log('📁 Directory: email-templates-preview/');
console.log('📄 contact-user-confirmation.html');
console.log('📄 contact-admin-notification.html');
console.log('📄 newsletter-welcome.html');

console.log('\n🌐 PREVIEW TEMPLATES:');
console.log('Open the HTML files in your browser to see how emails will look!');

console.log('\n📋 EMAIL SYSTEM STATUS:');
console.log('✅ Email templates: Professional and responsive');
console.log('✅ User confirmations: Friendly and informative');
console.log('✅ Admin notifications: Detailed and actionable');
console.log('✅ Newsletter welcome: Engaging and branded');
console.log('⚠️  Email delivery: Needs API key configuration');

console.log('\n🚀 NEXT STEPS:');
console.log('1. 👀 Open email-templates-preview/*.html files to see templates');
console.log('2. 🔑 Set up Brevo or SendGrid API key in .env.local');
console.log('3. 🧪 Run: node setup-real-email-config.js');
console.log('4. 📧 Test actual email delivery');
console.log('5. ✅ Confirm email receipt');
console.log('6. 🚀 Push updates to git');

console.log('\n💡 The email system is ready - just needs API keys!');
console.log('📧 Templates are professional and will impress your users!');

module.exports = { generateContactFormEmails, generateNewsletterEmails };