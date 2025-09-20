import { NextRequest, NextResponse } from 'next/server';
import { sendEmailWithBrevo, generateUserConfirmationEmail, generateAdminNotificationEmail } from '@/lib/brevo-email';
import { sendEmailWithBackup } from '@/lib/backup-email';

import { supabase } from '@/lib/supabase';

// Rate limiting storage (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up old rate limit entries
const cleanupRateLimit = () => {
  const now = Date.now();
  rateLimitStore.forEach((value, key) => {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  });
};

// Check rate limit (3 submissions per day per email)
const checkRateLimit = (email: string): { allowed: boolean; remaining: number } => {
  cleanupRateLimit();
  
  const now = Date.now();
  const resetTime = new Date().setHours(24, 0, 0, 0); // Reset at midnight
  const key = `contact_${email}`;
  
  const current = rateLimitStore.get(key) || { count: 0, resetTime };
  
  if (now > current.resetTime) {
    // Reset counter for new day
    current.count = 0;
    current.resetTime = resetTime;
  }
  
  const allowed = current.count < 3;
  const remaining = Math.max(0, 3 - current.count);
  
  if (allowed) {
    current.count++;
    rateLimitStore.set(key, current);
  }
  
  return { allowed, remaining };
};

export async function POST(request: NextRequest) {
  console.log('📧 CONTACT FORM: Processing submission...');
  
  try {
    const { name, email, subject, message, product, phone, company, projectType, services, timeline, budget, businessStage } = await request.json();

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check rate limit
    const { allowed, remaining } = checkRateLimit(email);
    if (!allowed) {
      return NextResponse.json(
        { 
          error: 'You have reached the maximum number of submissions for today (3). Please try again tomorrow.',
          remaining: 0
        },
        { status: 429 }
      );
    }

    console.log(`✅ CONTACT FORM: Rate limit check passed. Remaining: ${remaining}`);

    // Store contact submission in Supabase (non-blocking)
    console.log('💾 CONTACT FORM: Storing submission in database...');
    let submissionId = null;
    try {
      const { data: contactSubmission, error: dbError } = await supabase
        .from('contact_submissions')
        .insert({
          name,
          email,
          subject,
          message,
          product: product || null,
          phone: phone || null,
          company: company || null,
          project_type: projectType || null,
          services: services ? (Array.isArray(services) ? services.join(', ') : services) : null,
          timeline: timeline || null,
          budget: budget || null,
          business_stage: businessStage || null,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) {
        console.warn('⚠️ CONTACT FORM: Database storage failed, but continuing:', dbError);
      } else {
        console.log(`✅ CONTACT FORM: Submission stored in database with ID: ${contactSubmission.id}`);
        submissionId = contactSubmission.id;
      }
    } catch (dbConnectionError) {
      console.warn('⚠️ CONTACT FORM: Database connection failed, but continuing:', dbConnectionError);
    }

    // Parse and format services for display
    let servicesFormatted = '';
    if (services && Array.isArray(services) && services.length > 0) {
      servicesFormatted = services.map(service => `• ${service}`).join('\n');
    } else if (typeof services === 'string' && services.trim()) {
      // Handle comma-separated string format
      servicesFormatted = services.split(',').map(service => `• ${service.trim()}`).join('\n');
    }

    // Prepare form data for email templates
    const formData = {
      name,
      email,
      subject,
      message,
      services,
      projectType,
      timeline,
      budget,
      businessStage,
      phone,
      company,
      product,
      description: message // alias for consistency
    };

    // Send admin notification email using Brevo
    let adminEmailResult;
    try {
      const adminEmail = generateAdminNotificationEmail(formData);
      adminEmailResult = await sendEmailWithBrevo({
        to: 'chris.t@ventarosales.com',
        subject: adminEmail.subject,
        html: adminEmail.html,
        text: adminEmail.text,
        type: projectType ? 'quote_request' : 'contact',
        formData
      });
    } catch (emailError) {
       console.warn('⚠️ CONTACT FORM: Admin email sending error:', emailError);
       adminEmailResult = { success: false, error: emailError instanceof Error ? emailError.message : String(emailError) };
    }

    // Send user confirmation email using Brevo
    let customerEmailResult;
    try {
      const userEmail = generateUserConfirmationEmail(formData);
      customerEmailResult = await sendEmailWithBrevo({
        to: email,
        subject: userEmail.subject,
        html: userEmail.html,
        text: userEmail.text,
        type: 'confirmation',
        formData
      });
    } catch (emailError) {
       console.warn('⚠️ CONTACT FORM: Customer email sending error:', emailError);
       customerEmailResult = { success: false, error: emailError instanceof Error ? emailError.message : String(emailError) };
    }

    console.log('Admin email result:', adminEmailResult);
    const adminEmailSent = adminEmailResult?.success || false;

    console.log('Customer email result:', customerEmailResult);
    const customerEmailSent = customerEmailResult?.success || false;

    console.log(`📧 CONTACT FORM: Admin email ${adminEmailSent ? 'sent' : 'failed'}`);
    console.log(`📧 CONTACT FORM: Customer email ${customerEmailSent ? 'sent' : 'failed'}`);

    return NextResponse.json({
      success: true,
      message: adminEmailSent && customerEmailSent 
        ? 'Message sent successfully! We\'ll get back to you within 24 hours.'
        : adminEmailSent 
        ? 'Message sent successfully! We\'ll get back to you within 24 hours.'
        : customerEmailSent
        ? 'Message sent successfully! We\'ll get back to you within 24 hours.'
        : 'Message received successfully! Email notifications are currently unavailable, but we\'ll get back to you within 24 hours.',
      remaining: remaining - 1,
      emailStatus: {
        adminEmailSent,
        customerEmailSent,
        emailConfigured: !!(process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'SG.placeholder_api_key_replace_with_real_key')
      }
    });

  } catch (error: any) {
    console.error('❌ CONTACT FORM: Error:', error);
    
    return NextResponse.json({
      error: 'Failed to send message. Please try again.',
      success: false
    }, { status: 500 });
  }
}