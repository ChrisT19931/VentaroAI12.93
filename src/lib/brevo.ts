// Enhanced Brevo (formerly Sendinblue) configuration
const brevoConfig = {
  timeout: 30000, // 30 seconds timeout
  retries: 3,
  retryDelay: 1000, // 1 second base delay
};

// Email delivery health monitoring
let emailHealth = {
  lastCheck: 0,
  isHealthy: true,
  consecutiveFailures: 0,
  totalSent: 0,
  totalFailed: 0,
};

// Initialize Brevo with build-time safety and enhanced configuration
let brevoClient: any = null;
let isConfigured = false;

const initializeBrevo = async () => {
  if (brevoClient) return isConfigured;
  try {
    const brevo = require('@getbrevo/brevo');
    
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.warn('BREVO_API_KEY not configured - will fallback to SendGrid');
      isConfigured = false;
      return false;
    }
    
    const defaultClient = brevo.ApiClient.instance;
    const apiKeyAuth = defaultClient.authentications['api-key'];
    apiKeyAuth.apiKey = apiKey;
    
    brevoClient = new brevo.TransactionalEmailsApi();
    isConfigured = true;
    return true;
  } catch (err) {
    console.error('Failed to import @getbrevo/brevo:', err);
    isConfigured = false;
    return false;
  }
};

// Enhanced Brevo health check
export async function checkBrevoHealth(): Promise<boolean> {
  await initializeBrevo();
  if (!isConfigured || !brevoClient) return false;
  
  const now = Date.now();
  if (now - emailHealth.lastCheck < 300000 && emailHealth.isHealthy) {
    return emailHealth.isHealthy;
  }
  
  try {
    // Simple health check by getting account info
    const brevo = require('@getbrevo/brevo');
    const accountApi = new brevo.AccountApi();
    await accountApi.getAccount();
    
    emailHealth.lastCheck = now;
    emailHealth.isHealthy = true;
    emailHealth.consecutiveFailures = 0;
    return true;
  } catch (error) {
    console.error('Brevo health check failed:', error);
    emailHealth.lastCheck = now;
    emailHealth.isHealthy = false;
    emailHealth.consecutiveFailures++;
    return false;
  }
}

export function getEmailStats() {
  return {
    ...emailHealth,
    service: 'brevo'
  };
}

type EmailData = {
  to: string;
  from?: string;
  subject: string;
  text?: string;
  html: string;
};

export const sendEmail = async ({ to, from, subject, text, html }: EmailData) => {
  await initializeBrevo();
  
  if (!isConfigured || !brevoClient) {
    throw new Error('Brevo is not configured properly');
  }

  const fromEmail = from || process.env.BREVO_FROM_EMAIL || process.env.EMAIL_FROM || 'noreply@ventaroai.com';
  
  try {
    const sendSmtpEmail = {
      to: [{ email: to }],
      sender: { email: fromEmail },
      subject: subject,
      htmlContent: html,
      ...(text && { textContent: text })
    };

    const result = await brevoClient.sendTransacEmail(sendSmtpEmail);
    
    emailHealth.totalSent++;
    emailHealth.consecutiveFailures = 0;
    
    console.log('✅ BREVO: Email sent successfully to', to, 'Message ID:', result.messageId);
    return { success: true, messageId: result.messageId, service: 'brevo' };
  } catch (error: any) {
    emailHealth.totalFailed++;
    emailHealth.consecutiveFailures++;
    
    console.error('❌ BREVO: Failed to send email:', error);
    throw error;
  }
};

export const sendEmailWithValidation = async (emailData: EmailData) => {
  if (!emailData.to || !emailData.subject || !emailData.html) {
    throw new Error('Missing required email fields: to, subject, html');
  }
  
  return await sendEmail(emailData);
};

export const sendOrderConfirmationEmail = async ({
  email,
  orderNumber,
  orderItems,
  total,
  downloadLinks,
  isGuest = false,
}: {
  email: string;
  orderNumber: string;
  orderItems: any[];
  total: number;
  downloadLinks: { productName: string; url: string }[];
  isGuest?: boolean;
}) => {
  const itemsHtml = orderItems
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            <strong>${item.name}</strong>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
            $${item.price.toFixed(2)}
          </td>
        </tr>
      `
    )
    .join('');

  const downloadLinksHtml = downloadLinks
    .map(
      (link) => `
        <div style="margin: 10px 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #007bff;">
          <h4 style="margin: 0 0 8px 0; color: #007bff;">${link.productName}</h4>
          <a href="${link.url}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Download Now</a>
        </div>
      `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - ${orderNumber}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed! 🎉</h1>
        <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Thank you for your purchase</p>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h2 style="color: #333; margin: 0 0 10px 0;">Order Details</h2>
          <p style="margin: 5px 0; font-size: 16px;"><strong>Order Number:</strong> ${orderNumber}</p>
          <p style="margin: 5px 0; font-size: 16px;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0; font-size: 16px;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <h3 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Items Purchased</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Product</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            <tr style="background-color: #f8f9fa; font-weight: bold;">
              <td style="padding: 15px; border-top: 2px solid #007bff;">Total</td>
              <td style="padding: 15px; text-align: right; border-top: 2px solid #007bff; color: #007bff; font-size: 18px;">$${total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <h3 style="color: #333; border-bottom: 2px solid #28a745; padding-bottom: 10px;">Your Downloads</h3>
        <p style="margin-bottom: 20px; color: #666;">Click the buttons below to download your purchased items:</p>
        ${downloadLinksHtml}

        ${isGuest ? `
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h4 style="color: #856404; margin: 0 0 10px 0;">💡 Create an Account</h4>
            <p style="color: #856404; margin: 0;">Create an account to easily access your purchases anytime and get exclusive member benefits!</p>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/auth/signup" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background-color: #ffc107; color: #212529; text-decoration: none; border-radius: 5px; font-weight: bold;">Create Account</a>
          </div>
        ` : ''}

        <div style="background-color: #e7f3ff; border-left: 4px solid #007bff; padding: 20px; margin: 25px 0;">
          <h4 style="color: #004085; margin: 0 0 10px 0;">Need Help?</h4>
          <p style="color: #004085; margin: 0;">If you have any questions about your order or need assistance, please contact our support team at <a href="mailto:support@ventaroai.com" style="color: #007bff;">support@ventaroai.com</a></p>
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #ddd; border-top: none;">
        <p style="margin: 0; color: #666; font-size: 14px;">Thank you for choosing Ventaro AI!</p>
        <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">This email was sent to ${email}</p>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: `Order Confirmation - ${orderNumber}`,
    html,
  });
};

export const sendWelcomeEmail = async ({
  email,
  firstName = '',
}: {
  email: string;
  firstName?: string;
}) => {
  const displayName = firstName || email.split('@')[0];
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Ventaro AI</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 32px;">Welcome to Ventaro AI! 🚀</h1>
        <p style="color: #f0f0f0; margin: 15px 0 0 0; font-size: 18px;">Your AI journey starts here</p>
      </div>
      
      <div style="background: white; padding: 40px; border: 1px solid #ddd; border-top: none;">
        <h2 style="color: #333; margin: 0 0 20px 0;">Hello ${displayName}! 👋</h2>
        
        <p style="font-size: 16px; margin-bottom: 25px;">Thank you for joining Ventaro AI! We're excited to have you as part of our community of AI enthusiasts and innovators.</p>
        
        <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0;">
          <h3 style="color: #333; margin: 0 0 15px 0;">What's Next?</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 10px;">Explore our AI tools and solutions</li>
            <li style="margin-bottom: 10px;">Join our community discussions</li>
            <li style="margin-bottom: 10px;">Stay updated with the latest AI trends</li>
            <li style="margin-bottom: 10px;">Access exclusive member content</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" style="display: inline-block; padding: 15px 30px; background-color: #007bff; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Get Started</a>
        </div>
        
        <div style="background-color: #e7f3ff; border-left: 4px solid #007bff; padding: 20px; margin: 25px 0;">
          <h4 style="color: #004085; margin: 0 0 10px 0;">Need Help?</h4>
          <p style="color: #004085; margin: 0;">If you have any questions or need assistance, our support team is here to help at <a href="mailto:support@ventaroai.com" style="color: #007bff;">support@ventaroai.com</a></p>
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #ddd; border-top: none;">
        <p style="margin: 0; color: #666; font-size: 14px;">Welcome to the future of AI!</p>
        <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">This email was sent to ${email}</p>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: 'Welcome to Ventaro AI! 🚀',
    html,
  });
};

export const sendAccessGrantedEmail = async ({
  email,
  productName,
  accessUrl,
  firstName = '',
}: {
  email: string;
  productName: string;
  accessUrl: string;
  firstName?: string;
}) => {
  const displayName = firstName || email.split('@')[0];
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Access Granted - ${productName}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 32px;">Access Granted! 🎉</h1>
        <p style="color: #f0f0f0; margin: 15px 0 0 0; font-size: 18px;">Your ${productName} is ready</p>
      </div>
      
      <div style="background: white; padding: 40px; border: 1px solid #ddd; border-top: none;">
        <h2 style="color: #333; margin: 0 0 20px 0;">Hello ${displayName}! 👋</h2>
        
        <p style="font-size: 16px; margin-bottom: 25px;">Great news! Your access to <strong>${productName}</strong> has been granted and is now ready for you to use.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${accessUrl}" style="display: inline-block; padding: 15px 30px; background-color: #28a745; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Access ${productName}</a>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0;">
          <h3 style="color: #333; margin: 0 0 15px 0;">Getting Started</h3>
          <p style="margin: 0;">Click the button above to access your ${productName}. If you have any questions or need assistance getting started, our support team is here to help.</p>
        </div>
        
        <div style="background-color: #e7f3ff; border-left: 4px solid #007bff; padding: 20px; margin: 25px 0;">
          <h4 style="color: #004085; margin: 0 0 10px 0;">Need Help?</h4>
          <p style="color: #004085; margin: 0;">If you have any questions or need assistance, please contact our support team at <a href="mailto:support@ventaroai.com" style="color: #007bff;">support@ventaroai.com</a></p>
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #ddd; border-top: none;">
        <p style="margin: 0; color: #666; font-size: 14px;">Thank you for choosing Ventaro AI!</p>
        <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">This email was sent to ${email}</p>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: `Access Granted - ${productName}`,
    html,
  });
};

export const sendPasswordResetEmail = async ({
  email,
  resetUrl,
}: {
  email: string;
  resetUrl: string;
}) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 32px;">Reset Your Password 🔐</h1>
        <p style="color: #f0f0f0; margin: 15px 0 0 0; font-size: 18px;">Secure your account</p>
      </div>
      
      <div style="background: white; padding: 40px; border: 1px solid #ddd; border-top: none;">
        <h2 style="color: #333; margin: 0 0 20px 0;">Password Reset Request</h2>
        
        <p style="font-size: 16px; margin-bottom: 25px;">We received a request to reset your password for your Ventaro AI account. Click the button below to create a new password.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="display: inline-block; padding: 15px 30px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Reset Password</a>
        </div>
        
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 25px 0;">
          <h4 style="color: #856404; margin: 0 0 10px 0;">⚠️ Security Notice</h4>
          <p style="color: #856404; margin: 0; font-size: 14px;">This password reset link will expire in 1 hour. If you didn't request this reset, please ignore this email and your password will remain unchanged.</p>
        </div>
        
        <div style="background-color: #e7f3ff; border-left: 4px solid #007bff; padding: 20px; margin: 25px 0;">
          <h4 style="color: #004085; margin: 0 0 10px 0;">Need Help?</h4>
          <p style="color: #004085; margin: 0;">If you're having trouble with the button above, copy and paste this link into your browser:</p>
          <p style="color: #007bff; word-break: break-all; margin: 10px 0 0 0; font-size: 14px;">${resetUrl}</p>
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #ddd; border-top: none;">
        <p style="margin: 0; color: #666; font-size: 14px;">Ventaro AI Security Team</p>
        <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">This email was sent to ${email}</p>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: 'Reset Your Password - Ventaro AI',
    html,
  });
};