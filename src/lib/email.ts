import { env } from './env';
import { sendEmailWithBackup } from './backup-email';
import * as brevoService from './brevo';
import * as sendgridService from './sendgrid';

// Email templates
const EMAIL_TEMPLATES = {
  ORDER_CONFIRMATION: 'order-confirmation',
  ACCESS_GRANTED: 'access-granted',
  WELCOME: 'welcome',
  PASSWORD_RESET: 'password-reset',
};

type EmailOptions = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
  attachments?: Array<{
    content: string;
    filename: string;
    type?: string;
    disposition?: string;
  }>;
};

type EmailResult = {
  success: boolean;
  messageId?: string;
  service: 'brevo' | 'sendgrid' | 'backup' | 'failed';
  error?: string;
};

// Queue for failed emails
const emailQueue: Array<{ options: EmailOptions; retries: number }> = [];
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

// Health check for both services
export async function checkEmailHealth() {
  const brevoHealth = await brevoService.checkBrevoHealth();
  const sendgridHealth = await sendgridService.checkSendGridHealth();
  
  return {
    brevo: {
      healthy: brevoHealth,
      stats: brevoService.getEmailStats()
    },
    sendgrid: {
      healthy: sendgridHealth,
      stats: sendgridService.getEmailStats()
    },
    primary: brevoHealth ? 'brevo' : sendgridHealth ? 'sendgrid' : 'backup'
  };
}

// Process the email queue
async function processEmailQueue() {
  if (emailQueue.length === 0) return;
  
  const { options, retries } = emailQueue.shift()!;
  
  const result = await sendEmailInternal(options);
  
  if (result.success) {
    console.log(`Successfully sent queued email to ${options.to} via ${result.service}`);
  } else {
    if (retries < MAX_RETRIES) {
      console.log(`Requeuing email to ${options.to} (retry ${retries + 1}/${MAX_RETRIES})`);
      emailQueue.push({ options, retries: retries + 1 });
      setTimeout(processEmailQueue, RETRY_DELAY);
    } else {
      console.error(`Failed to send email to ${options.to} after ${MAX_RETRIES} retries:`, result.error);
    }
  }
}

// Internal function to send email with fallback chain
async function sendEmailInternal(options: EmailOptions): Promise<EmailResult> {
  // Validate required fields
  if (!options.to || !options.subject) {
    return {
      success: false,
      service: 'failed',
      error: 'Missing required email fields: to, subject'
    };
  }

  // For template emails, we'll use basic HTML content since Brevo handles templates differently
  const emailData = {
    to: options.to,
    from: env.EMAIL_FROM,
    subject: options.subject,
    text: options.text,
    html: options.html || options.text || 'No content provided'
  };

  // Try Brevo first (primary service)
  try {
    const brevoResult = await brevoService.sendEmail(emailData);
    console.log('✅ EMAIL: Successfully sent via Brevo to', options.to);
    return {
      success: true,
      messageId: brevoResult.messageId || 'brevo-' + Date.now(),
      service: 'brevo'
    };
  } catch (brevoError: any) {
    console.warn('⚠️ EMAIL: Brevo failed, trying SendGrid fallback:', brevoError.message);
    
    // Try SendGrid as fallback
    try {
      const sendgridResult = await sendgridService.sendEmail(emailData);
      console.log('✅ EMAIL: Successfully sent via SendGrid fallback to', options.to);
      return {
        success: true,
        messageId: 'sendgrid-' + Date.now(),
        service: 'sendgrid'
      };
    } catch (sendgridError: any) {
      console.warn('⚠️ EMAIL: SendGrid also failed, using backup system:', sendgridError.message);
      
      // Use backup system as last resort
      try {
        const backupResult = await sendEmailWithBackup({
          ...emailData,
          type: 'support' // default type for backup
        });
        
        if (backupResult.success) {
          console.log('✅ EMAIL: Successfully stored in backup system for', options.to);
          return {
            success: true,
            messageId: backupResult.id,
            service: 'backup'
          };
        } else {
          throw new Error(backupResult.error || 'Backup system failed');
        }
      } catch (backupError: any) {
        console.error('❌ EMAIL: All email services failed:', {
          brevo: brevoError.message,
          sendgrid: sendgridError.message,
          backup: backupError.message
        });
        
        return {
          success: false,
          service: 'failed',
          error: `All email services failed. Brevo: ${brevoError.message}, SendGrid: ${sendgridError.message}, Backup: ${backupError.message}`
        };
      }
    }
  }
}

// Main email sending function
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const result = await sendEmailInternal(options);
  
  if (!result.success && result.service === 'failed') {
    // Add to queue for retry
    emailQueue.push({ options, retries: 0 });
    
    // Process queue immediately
    setTimeout(processEmailQueue, 0);
  }
  
  return result;
}

// Send order confirmation email
export async function sendOrderConfirmationEmail({
  email,
  orderDetails,
}: {
  email: string;
  orderDetails: {
    productName: string;
    price: number;
    orderId: string;
    orderItems?: any[];
    total?: number;
    downloadLinks?: { productName: string; url: string }[];
    isGuest?: boolean;
  };
}): Promise<EmailResult> {
  try {
    // Try Brevo first
    const result = await brevoService.sendOrderConfirmationEmail({
      email,
      orderNumber: orderDetails.orderId,
      orderItems: orderDetails.orderItems || [{ name: orderDetails.productName, price: orderDetails.price }],
      total: orderDetails.total || orderDetails.price,
      downloadLinks: orderDetails.downloadLinks || [],
      isGuest: orderDetails.isGuest || false
    });
    return {
      success: true,
      messageId: result.messageId || 'brevo-' + Date.now(),
      service: 'brevo'
    };
  } catch (error: any) {
    console.warn('⚠️ EMAIL: Brevo order confirmation failed, trying SendGrid:', error.message);
    
    try {
      // Fallback to SendGrid
      const result = await sendgridService.sendOrderConfirmationEmail({
        email,
        orderNumber: orderDetails.orderId,
        orderItems: orderDetails.orderItems || [{ name: orderDetails.productName, price: orderDetails.price }],
        total: orderDetails.total || orderDetails.price,
        downloadLinks: orderDetails.downloadLinks || [],
        isGuest: orderDetails.isGuest || false
      });
      return {
        success: true,
        messageId: result.id || 'backup-' + Date.now(),
        service: 'backup'
      };
    } catch (fallbackError: any) {
      console.error('❌ EMAIL: Order confirmation failed on both services:', fallbackError.message);
      return {
        success: false,
        service: 'failed',
        error: fallbackError.message
      };
    }
  }
}

// Send access granted email
export async function sendAccessGrantedEmail({
  email,
  productName,
  accessLink,
  firstName,
}: {
  email: string;
  productName: string;
  accessLink: string;
  firstName?: string;
}): Promise<EmailResult> {
  try {
    // Try Brevo first
    const result = await brevoService.sendAccessGrantedEmail({
      email,
      productName,
      accessUrl: accessLink,
      firstName
    });
    return {
        success: true,
        messageId: result.messageId || 'brevo-' + Date.now(),
        service: 'brevo'
      };
  } catch (error: any) {
    console.warn('⚠️ EMAIL: Brevo access granted email failed, trying SendGrid:', error.message);
    
    try {
      // Fallback to SendGrid
      const result = await sendgridService.sendAccessGrantedEmail({
        email,
        productName,
        accessUrl: accessLink,
        firstName
      });
      return {
        success: true,
        messageId: result.id || 'backup-' + Date.now(),
        service: 'backup'
      };
    } catch (fallbackError: any) {
      console.error('❌ EMAIL: Access granted email failed on both services:', fallbackError.message);
      return {
        success: false,
        service: 'failed',
        error: fallbackError.message
      };
    }
  }
}

// Send welcome email
export async function sendWelcomeEmail({
  email,
  name,
}: {
  email: string;
  name?: string;
}): Promise<EmailResult> {
  try {
    // Try Brevo first
    const result = await brevoService.sendWelcomeEmail({
      email,
      firstName: name
    });
    return {
        success: true,
        messageId: result.messageId || 'brevo-' + Date.now(),
        service: 'brevo'
      };
  } catch (error: any) {
    console.warn('⚠️ EMAIL: Brevo welcome email failed, trying SendGrid:', error.message);
    
    try {
      // Fallback to SendGrid
      const result = await sendgridService.sendWelcomeEmail({
        email,
        firstName: name
      });
      return {
          success: true,
          messageId: 'sendgrid-' + Date.now(),
          service: 'sendgrid'
        };
    } catch (fallbackError: any) {
      console.error('❌ EMAIL: Welcome email failed on both services:', fallbackError.message);
      return {
        success: false,
        service: 'failed',
        error: fallbackError.message
      };
    }
  }
}

// Send password reset email
export async function sendPasswordResetEmail({
  email,
  resetLink,
}: {
  email: string;
  resetLink: string;
}): Promise<EmailResult> {
  try {
    // Try Brevo first
    const result = await brevoService.sendPasswordResetEmail({
      email,
      resetUrl: resetLink
    });
    return {
      success: true,
      messageId: result.messageId,
      service: 'brevo'
    };
  } catch (error: any) {
    console.warn('⚠️ EMAIL: Brevo password reset email failed, trying SendGrid:', error.message);
    
    try {
      // Fallback to SendGrid
      const result = await sendgridService.sendPasswordResetEmail({
        email,
        resetUrl: resetLink
      });
      return {
          success: true,
          messageId: 'sendgrid-' + Date.now(),
          service: 'sendgrid'
        };
    } catch (fallbackError: any) {
      console.error('❌ EMAIL: Password reset email failed on both services:', fallbackError.message);
      return {
        success: false,
        service: 'failed',
        error: fallbackError.message
      };
    }
  }
}