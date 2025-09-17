import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/sendgrid';
import { bulletproofAuth } from '@/lib/auth-bulletproof';
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
    const { name, email, subject, message, product, phone, company, projectType, services, timeline } = await request.json();

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

    // Store contact submission in Supabase
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
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      console.error('❌ CONTACT FORM: Error storing submission:', dbError);
      // Continue with email sending even if database storage fails
    } else {
      console.log(`✅ CONTACT FORM: Submission stored in database with ID: ${contactSubmission.id}`);
    }

    // Parse and format services for display
    let servicesFormatted = '';
    if (services && Array.isArray(services) && services.length > 0) {
      servicesFormatted = services.map(service => `• ${service}`).join('\n');
    } else if (typeof services === 'string' && services.trim()) {
      // Handle comma-separated string format
      servicesFormatted = services.split(',').map(service => `• ${service.trim()}`).join('\n');
    }

    // Send email to admin
    const adminEmailResult = await sendEmail({
      to: 'chris.t@ventarosales.com',
      subject: `🔔 New ${projectType ? 'Project Quote Request' : 'Contact Form Submission'}: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>New Contact Form Submission</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">${projectType ? '🎯 New Project Quote Request' : '🔔 New Contact Form Submission'}</h1>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">📋 Contact Details:</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 30%;">Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${email}" style="color: #007bff;">${email}</a></td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="tel:${phone}" style="color: #007bff;">${phone}</a></td>
              </tr>
              ` : ''}
              ${company ? `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Company:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${company}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Subject:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${subject}</td>
              </tr>
              ${projectType ? `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Project Type:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><span style="background: #e3f2fd; padding: 4px 8px; border-radius: 4px; font-weight: bold; color: #1976d2;">${projectType}</span></td>
              </tr>
              ` : ''}
              ${timeline ? `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Timeline:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><span style="background: #fff3e0; padding: 4px 8px; border-radius: 4px; font-weight: bold; color: #f57c00;">${timeline}</span></td>
              </tr>
              ` : ''}
              ${product ? `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Product Reference:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${product}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Submitted:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${new Date().toLocaleString()}</td>
              </tr>
            </table>
            
            ${servicesFormatted ? `
            <h3 style="color: #333; margin-top: 30px;">🛠️ Services Requested:</h3>
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
              <pre style="margin: 0; white-space: pre-wrap; font-family: Arial, sans-serif; color: #0c4a6e; font-weight: 500;">${servicesFormatted}</pre>
            </div>
            ` : ''}
            
            <h3 style="color: #333; margin-top: 30px;">Message:</h3>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff;">
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background: #e3f2fd; border-radius: 6px;">
              <p style="margin: 0; font-size: 14px; color: #1976d2;">
                <strong>📊 Rate Limit Info:</strong> This email has ${remaining} contact submissions remaining today.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${email}?subject=Re: ${subject}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Reply to ${name}
              </a>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `${projectType ? 'New Project Quote Request' : 'New Contact Form Submission'}

📋 CONTACT DETAILS:
Name: ${name}
Email: ${email}${phone ? `
Phone: ${phone}` : ''}${company ? `
Company: ${company}` : ''}
Subject: ${subject}${projectType ? `
Project Type: ${projectType}` : ''}${timeline ? `
Timeline: ${timeline}` : ''}
Submitted: ${new Date().toLocaleString()}

${servicesFormatted ? `🛠️ SERVICES REQUESTED:
${servicesFormatted}

` : ''}📝 MESSAGE:
${message}

📧 Reply to: ${email}`
    });

    // Send auto-reply to customer
    const customerEmailResult = await sendEmail({
      to: email,
      subject: `✅ ${projectType ? 'Your Project Quote Request' : 'Thank you for contacting'} - Ventaro AI`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Thank you for contacting us</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">${projectType ? '🎯 Quote Request Received!' : 'Thank You! 🙏'}</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">${projectType ? 'We\'re excited to work on your project' : 'We\'ve received your message'}</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${name}! 👋</h2>
            
            <p>${projectType ? `Thank you for your interest in our ${projectType.toLowerCase()} services! We've successfully received your project quote request and our expert team is already reviewing the details.` : `Thank you for reaching out to Ventaro AI! We've successfully received your message about "<strong>${subject}</strong>" and our team will review it shortly.`}</p>
            
            <div style="background: #f0f9ff; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 5px solid #0ea5e9;">
              <h3 style="margin-top: 0; color: #0c4a6e; font-size: 18px;">📋 Your ${projectType ? 'Project' : 'Submission'} Summary:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #0c4a6e; width: 35%;">Name:</td>
                  <td style="padding: 8px 0; color: #374151;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #0c4a6e;">Email:</td>
                  <td style="padding: 8px 0; color: #374151;">${email}</td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #0c4a6e;">Phone:</td>
                  <td style="padding: 8px 0; color: #374151;">${phone}</td>
                </tr>
                ` : ''}
                ${company ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #0c4a6e;">Company:</td>
                  <td style="padding: 8px 0; color: #374151;">${company}</td>
                </tr>
                ` : ''}
                ${projectType ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #0c4a6e;">Project Type:</td>
                  <td style="padding: 8px 0; color: #374151;"><span style="background: #dbeafe; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${projectType}</span></td>
                </tr>
                ` : ''}
                ${timeline ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #0c4a6e;">Timeline:</td>
                  <td style="padding: 8px 0; color: #374151;"><span style="background: #fef3c7; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${timeline}</span></td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #0c4a6e;">Subject:</td>
                  <td style="padding: 8px 0; color: #374151;">${subject}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #0c4a6e;">Submitted:</td>
                  <td style="padding: 8px 0; color: #374151;">${new Date().toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #0c4a6e;">Reference ID:</td>
                  <td style="padding: 8px 0; color: #374151; font-family: monospace;">#${Date.now()}</td>
                </tr>
              </table>
            </div>
            
            ${servicesFormatted ? `
            <div style="background: #ecfdf5; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 5px solid #10b981;">
              <h3 style="margin-top: 0; color: #065f46; font-size: 18px;">🛠️ Services You've Requested:</h3>
              <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 15px;">
                <pre style="margin: 0; white-space: pre-wrap; font-family: Arial, sans-serif; color: #065f46; font-weight: 500; font-size: 15px; line-height: 1.8;">${servicesFormatted}</pre>
              </div>
              <p style="margin: 15px 0 0 0; color: #065f46; font-style: italic; font-size: 14px;">✨ Our team will provide detailed information and pricing for each of these services.</p>
            </div>
            ` : ''}
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #2d5a2d;">⏰ What Happens Next?</h3>
              <ul style="margin: 0; padding-left: 20px; color: #2d5a2d;">
                <li>Our team will review your message within 24 hours</li>
                <li>You'll receive a personalized response via email</li>
                <li>For urgent matters, we'll prioritize your request</li>
              </ul>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #856404;">
                <strong>💡 While You Wait:</strong> Check out our <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://ventaroai.com'}/products" style="color: #856404;">AI Tools and Resources</a> to get started right away!
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #666; text-align: center; margin: 0;">
              Need immediate assistance? Contact us at <a href="mailto:chris.t@ventarosales.com" style="color: #007bff;">chris.t@ventarosales.com</a>
              <br>
              <span style="font-size: 12px;">Ventaro AI - Pioneering the future of digital products with AI</span>
            </p>
          </div>
        </body>
        </html>
      `,
      text: `${projectType ? 'Your Project Quote Request - Ventaro AI' : 'Thank you for contacting Ventaro AI!'}

Hi ${name},

${projectType ? `Thank you for your interest in our ${projectType.toLowerCase()} services! We've successfully received your project quote request and our expert team is already reviewing the details.` : `We've received your message about "${subject}" and our team will review it within 24 hours.`}

📋 YOUR ${projectType ? 'PROJECT' : 'SUBMISSION'} SUMMARY:
Name: ${name}
Email: ${email}${phone ? `
Phone: ${phone}` : ''}${company ? `
Company: ${company}` : ''}${projectType ? `
Project Type: ${projectType}` : ''}${timeline ? `
Timeline: ${timeline}` : ''}
Subject: ${subject}
Submitted: ${new Date().toLocaleString()}
Reference ID: #${Date.now()}

${servicesFormatted ? `🛠️ SERVICES YOU'VE REQUESTED:
${servicesFormatted}

✨ Our team will provide detailed information and pricing for each of these services.

` : ''}⏰ WHAT HAPPENS NEXT:
- Our team will review your ${projectType ? 'project requirements' : 'message'} within 24 hours
- You'll receive a personalized ${projectType ? 'quote and project proposal' : 'response'} via email
- For urgent matters, we'll prioritize your request
- ${projectType ? 'We may schedule a consultation call to discuss your project in detail' : 'Our experts will provide tailored recommendations'}

While you wait, check out our AI Tools and Resources: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://ventaroai.com'}/products

Best regards,
The Ventaro AI Team

Need immediate assistance? Contact: chris.t@ventarosales.com`
    });

    console.log('Admin email result:', adminEmailResult);
    const adminEmailSent = adminEmailResult.success;

    console.log('Customer email result:', customerEmailResult);
    const customerEmailSent = customerEmailResult.success;

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