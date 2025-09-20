import { getSupabaseAdmin } from './supabase';

interface EmailData {
  to: string;
  from?: string;
  subject: string;
  text?: string;
  html?: string;
  type: 'contact' | 'subscription' | 'newsletter' | 'web-design' | 'support' | 'membership' | 'quote_request';
  formData?: Record<string, any>;
}

interface BrevoEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  method: 'brevo' | 'sendgrid' | 'backup' | 'failed';
}

// Store email in Supabase for record keeping
export async function storeEmailRecord(emailData: EmailData, status: 'sent' | 'failed' | 'pending', messageId?: string, error?: string): Promise<{ success: boolean; id?: string }> {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data, error: dbError } = await supabase
      .from('email_logs')
      .insert({
        to_email: emailData.to,
        from_email: emailData.from || process.env.BREVO_FROM_EMAIL || 'chris.t@ventarosales.com',
        subject: emailData.subject,
        text_content: emailData.text,
        html_content: emailData.html,
        email_type: emailData.type,
        form_data: emailData.formData || {},
        status,
        message_id: messageId,
        error_message: error,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      console.error('❌ EMAIL LOG: Failed to store email record:', dbError);
      return { success: false };
    }

    return { success: true, id: data.id };
  } catch (error: any) {
    console.error('❌ EMAIL LOG: Error storing email record:', error);
    return { success: false };
  }
}

// Send email using Brevo API
export async function sendBrevoEmail(emailData: EmailData): Promise<BrevoEmailResult> {
  if (!process.env.BREVO_API_KEY || process.env.BREVO_API_KEY.startsWith('xkeysib-a0348dc3')) {
    console.warn('⚠️ BREVO: API key not configured properly');
    return { success: false, error: 'Brevo API key not configured', method: 'failed' };
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: {
          name: 'Ventaro AI',
          email: emailData.from || process.env.BREVO_FROM_EMAIL || 'chris.t@ventarosales.com'
        },
        to: [{
          email: emailData.to,
          name: emailData.formData?.name || emailData.to.split('@')[0]
        }],
        subject: emailData.subject,
        htmlContent: emailData.html,
        textContent: emailData.text
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`Brevo API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log('✅ BREVO: Email sent successfully to', emailData.to, 'MessageId:', result.messageId);
    
    // Store successful email record
    await storeEmailRecord(emailData, 'sent', result.messageId);
    
    return { success: true, messageId: result.messageId, method: 'brevo' };
  } catch (error: any) {
    console.error('❌ BREVO: Failed to send email:', error);
    
    // Store failed email record
    await storeEmailRecord(emailData, 'failed', undefined, error.message);
    
    return { success: false, error: error.message, method: 'failed' };
  }
}

// Send email with Brevo -> SendGrid -> Backup fallback
export async function sendEmailWithBrevo(emailData: EmailData): Promise<BrevoEmailResult> {
  // Try Brevo first
  const brevoResult = await sendBrevoEmail(emailData);
  if (brevoResult.success) {
    return brevoResult;
  }

  console.log('📧 BREVO: Failed, trying SendGrid fallback...');
  
  // Try SendGrid as fallback
  if (process.env.SENDGRID_API_KEY && !process.env.SENDGRID_API_KEY.startsWith('SG.placeholder')) {
    try {
      const sgMail = (await import('@sendgrid/mail')).default;
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg: any = {
        to: emailData.to,
        from: emailData.from || process.env.SENDGRID_FROM_EMAIL || 'chris.t@ventarosales.com',
        subject: emailData.subject,
        ...(emailData.html ? { html: emailData.html } : {}),
        ...(emailData.text ? { text: emailData.text } : {})
      };

      const result = await sgMail.send(msg);
      console.log('✅ SENDGRID: Email sent successfully to', emailData.to);
      
      // Store successful email record
      await storeEmailRecord(emailData, 'sent', result[0].headers['x-message-id']);
      
      return { success: true, messageId: result[0].headers['x-message-id'], method: 'sendgrid' };
    } catch (error: any) {
      console.error('❌ SENDGRID: Failed to send email:', error);
    }
  }

  // Final fallback - store in backup system
  console.log('📧 EMAIL: Using backup storage system for', emailData.to);
  try {
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from('backup_emails')
      .insert({
        to_email: emailData.to,
        from_email: emailData.from || 'chris.t@ventarosales.com',
        subject: emailData.subject,
        text_content: emailData.text,
        html_content: emailData.html,
        email_type: emailData.type,
        form_data: emailData.formData || {},
        status: 'pending',
        created_at: new Date().toISOString(),
        attempts: 0
      })
      .select()
      .single();

    if (error) {
      console.error('❌ BACKUP EMAIL: Failed to store email:', error);
      return { success: false, error: error.message, method: 'failed' };
    }

    console.log('✅ BACKUP EMAIL: Email stored successfully with ID:', data.id);
    return { success: true, messageId: data.id, method: 'backup' };
  } catch (error: any) {
    console.error('❌ BACKUP EMAIL: Error storing email:', error);
    return { success: false, error: error.message, method: 'failed' };
  }
}

// Generate user confirmation email template
export function generateUserConfirmationEmail(formData: any): { subject: string; html: string; text: string } {
  const subject = `Thank you for your inquiry - Ventaro AI`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Thank you for your inquiry</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">🚀 Thank You for Your Inquiry!</h1>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="font-size: 18px; margin-bottom: 20px;">Hi ${formData.name || 'there'},</p>
        
        <p>Thank you for reaching out to Ventaro AI! We've received your inquiry and are excited to help transform your business with AI.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">📋 Your Inquiry Summary:</h3>
          <ul style="margin: 0; padding-left: 20px;">
            ${formData.projectType ? `<li><strong>Project Type:</strong> ${formData.projectType}</li>` : ''}
            ${formData.timeline ? `<li><strong>Timeline:</strong> ${formData.timeline}</li>` : ''}
            ${formData.budget ? `<li><strong>Budget Range:</strong> ${formData.budget}</li>` : ''}
            ${formData.company ? `<li><strong>Company:</strong> ${formData.company}</li>` : ''}
          </ul>
        </div>
        
        <h3 style="color: #333;">⏰ What Happens Next?</h3>
        <ol style="padding-left: 20px;">
          <li><strong>Review (Within 2 hours):</strong> Chris T will personally review your requirements</li>
          <li><strong>Custom Proposal (Within 24 hours):</strong> You'll receive a detailed solution proposal</li>
          <li><strong>Strategy Call:</strong> We'll schedule a call to discuss your project in detail</li>
          <li><strong>Implementation:</strong> Once approved, we'll start building your AI solution</li>
        </ol>
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;">
          <h4 style="color: #1976d2; margin-top: 0;">💡 Quick Tip:</h4>
          <p style="margin-bottom: 0;">While you wait, check out our <a href="https://ventaroai.com/products" style="color: #2196f3;">AI solutions showcase</a> to see examples of what we can build for you.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="margin-bottom: 10px;"><strong>Need to talk immediately?</strong></p>
          <p style="font-size: 18px; color: #2196f3; font-weight: bold;">📞 Call Chris T directly: 0435 413 110</p>
        </div>
        
        <p>Best regards,<br>
        <strong>Chris T</strong><br>
        Founder, Ventaro AI<br>
        <a href="mailto:chris.t@ventarosales.com" style="color: #2196f3;">chris.t@ventarosales.com</a></p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          This email was sent because you submitted an inquiry on our website.<br>
          Ventaro AI - Transforming businesses with AI solutions
        </p>
      </div>
    </body>
    </html>
  `;
  
  const text = `
Hi ${formData.name || 'there'},

Thank you for reaching out to Ventaro AI! We've received your inquiry and are excited to help transform your business with AI.

Your Inquiry Summary:
${formData.projectType ? `- Project Type: ${formData.projectType}\n` : ''}${formData.timeline ? `- Timeline: ${formData.timeline}\n` : ''}${formData.budget ? `- Budget Range: ${formData.budget}\n` : ''}${formData.company ? `- Company: ${formData.company}\n` : ''}

What Happens Next?
1. Review (Within 2 hours): Chris T will personally review your requirements
2. Custom Proposal (Within 24 hours): You'll receive a detailed solution proposal
3. Strategy Call: We'll schedule a call to discuss your project in detail
4. Implementation: Once approved, we'll start building your AI solution

Need to talk immediately?
Call Chris T directly: 0435 413 110

Best regards,
Chris T
Founder, Ventaro AI
chris.t@ventarosales.com
  `;
  
  return { subject, html, text };
}

// Generate admin notification email template
export function generateAdminNotificationEmail(formData: any): { subject: string; html: string; text: string } {
  const subject = `🔔 New ${formData.projectType ? 'Project Quote Request' : 'Contact Form Submission'}: ${formData.subject || 'No Subject'}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Contact Form Submission</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">${formData.projectType ? '🎯 New Project Quote Request' : '🔔 New Contact Form Submission'}</h1>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">📋 Contact Details:</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 30%;">Name:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${formData.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${formData.email}" style="color: #007bff;">${formData.email}</a></td>
          </tr>
          ${formData.phone ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="tel:${formData.phone}" style="color: #007bff;">${formData.phone}</a></td>
          </tr>
          ` : ''}
          ${formData.company ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Company:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${formData.company}</td>
          </tr>
          ` : ''}
          ${formData.subject ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Subject:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${formData.subject}</td>
          </tr>
          ` : ''}
          ${formData.projectType ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Project Type:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><span style="background: #e3f2fd; padding: 4px 8px; border-radius: 4px; font-weight: bold; color: #1976d2;">${formData.projectType}</span></td>
          </tr>
          ` : ''}
          ${formData.timeline ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Timeline:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><span style="background: #fff3e0; padding: 4px 8px; border-radius: 4px; font-weight: bold; color: #f57c00;">${formData.timeline}</span></td>
          </tr>
          ` : ''}
          ${formData.budget ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Budget:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><span style="background: #e8f5e8; padding: 4px 8px; border-radius: 4px; font-weight: bold; color: #2e7d32;">${formData.budget}</span></td>
          </tr>
          ` : ''}
        </table>
        
        ${formData.message || formData.description ? `
        <h3 style="color: #333;">💬 Message:</h3>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff;">
          <p style="margin: 0; white-space: pre-wrap;">${formData.message || formData.description}</p>
        </div>
        ` : ''}
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <h4 style="color: #856404; margin-top: 0;">⚡ Quick Actions:</h4>
          <p style="margin-bottom: 10px;"><a href="mailto:${formData.email}?subject=Re: ${formData.subject || 'Your inquiry'}" style="color: #007bff; text-decoration: none;">📧 Reply to ${formData.name}</a></p>
          ${formData.phone ? `<p style="margin-bottom: 0;"><a href="tel:${formData.phone}" style="color: #007bff; text-decoration: none;">📞 Call ${formData.phone}</a></p>` : ''}
        </div>
        
        <p style="font-size: 12px; color: #666; text-align: center; margin-top: 30px;">
          Submitted at: ${new Date().toLocaleString()}<br>
          From: Ventaro AI Contact Form
        </p>
      </div>
    </body>
    </html>
  `;
  
  const text = `
New ${formData.projectType ? 'Project Quote Request' : 'Contact Form Submission'}

Contact Details:
- Name: ${formData.name}
- Email: ${formData.email}
${formData.phone ? `- Phone: ${formData.phone}\n` : ''}${formData.company ? `- Company: ${formData.company}\n` : ''}${formData.subject ? `- Subject: ${formData.subject}\n` : ''}${formData.projectType ? `- Project Type: ${formData.projectType}\n` : ''}${formData.timeline ? `- Timeline: ${formData.timeline}\n` : ''}${formData.budget ? `- Budget: ${formData.budget}\n` : ''}

${formData.message || formData.description ? `Message:\n${formData.message || formData.description}\n\n` : ''}Submitted at: ${new Date().toLocaleString()}
From: Ventaro AI Contact Form
  `;
  
  return { subject, html, text };
}