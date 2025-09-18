import { getSupabaseAdmin } from './supabase';

// Backup email system using Supabase storage and database
// This serves as a fallback when SendGrid is unavailable

interface EmailData {
  to: string;
  from?: string;
  subject: string;
  text?: string;
  html?: string;
  type: 'contact' | 'subscription' | 'newsletter' | 'web-design' | 'support' | 'membership';
  formData?: Record<string, any>;
}

interface BackupEmailResult {
  success: boolean;
  id?: string;
  error?: string;
  method: 'sendgrid' | 'backup' | 'failed';
}

// Store email in Supabase as backup
export async function storeBackupEmail(emailData: EmailData): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const supabase = getSupabaseAdmin();
    
    // Store email in database
    const { data, error } = await supabase
      .from('backup_emails')
      .insert({
        to_email: emailData.to,
        from_email: emailData.from || 'noreply@ventaroai.com',
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
      return { success: false, error: error.message };
    }

    console.log('✅ BACKUP EMAIL: Email stored successfully with ID:', data.id);
    return { success: true, id: data.id };
  } catch (error: any) {
    console.error('❌ BACKUP EMAIL: Error storing email:', error);
    return { success: false, error: error.message };
  }
}

// Send email with SendGrid fallback to backup system
export async function sendEmailWithBackup(emailData: EmailData): Promise<BackupEmailResult> {
  // First try SendGrid
  if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'your_sendgrid_api_key') {
    try {
      const sgMail = (await import('@sendgrid/mail')).default;
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: emailData.to,
        from: emailData.from || process.env.SENDGRID_FROM_EMAIL || 'noreply@ventaroai.com',
        subject: emailData.subject,
        ...(emailData.html ? { html: emailData.html } : {}),
        ...(emailData.text ? { text: emailData.text } : {})
      };

      await sgMail.send(msg);
      console.log('✅ SENDGRID: Email sent successfully to', emailData.to);
      
      // Also store in backup for record keeping
      await storeBackupEmail({ ...emailData, type: emailData.type });
      
      return { success: true, method: 'sendgrid' };
    } catch (error: any) {
      console.error('❌ SENDGRID: Failed to send email:', error);
      // Fall back to backup system
    }
  }

  // Fallback to backup system
  console.log('📧 BACKUP EMAIL: Using backup email system for', emailData.to);
  const backupResult = await storeBackupEmail(emailData);
  
  if (backupResult.success) {
    // Send notification to admin about backup email
    await notifyAdminAboutBackupEmail(emailData, backupResult.id!);
    return { success: true, id: backupResult.id, method: 'backup' };
  }

  return { success: false, error: backupResult.error, method: 'failed' };
}

// Notify admin about backup email via console and database
async function notifyAdminAboutBackupEmail(emailData: EmailData, backupId: string) {
  console.log('🚨 BACKUP EMAIL NOTIFICATION:');
  console.log('📧 Email Type:', emailData.type);
  console.log('📧 To:', emailData.to);
  console.log('📧 Subject:', emailData.subject);
  console.log('📧 Backup ID:', backupId);
  console.log('📧 Admin Action Required: Check backup_emails table in Supabase');
  
  // Store admin notification
  try {
    const supabase = getSupabaseAdmin();
    await supabase
      .from('admin_notifications')
      .insert({
        type: 'backup_email',
        title: `Backup Email: ${emailData.type}`,
        message: `Email to ${emailData.to} was sent via backup system. Subject: ${emailData.subject}`,
        data: {
          backup_email_id: backupId,
          email_type: emailData.type,
          recipient: emailData.to,
          subject: emailData.subject
        },
        status: 'unread',
        created_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('❌ Failed to store admin notification:', error);
  }
}

// Get pending backup emails for manual processing
export async function getPendingBackupEmails(limit: number = 50) {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from('backup_emails')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('❌ Failed to get pending backup emails:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('❌ Error getting pending backup emails:', error);
    return [];
  }
}

// Mark backup email as processed
export async function markBackupEmailProcessed(id: string, status: 'sent' | 'failed', error?: string) {
  try {
    const supabase = getSupabaseAdmin();
    
    const { error: updateError } = await supabase
      .from('backup_emails')
      .update({
        status,
        processed_at: new Date().toISOString(),
        error_message: error,
        attempts: status === 'failed' ? 1 : 0
      })
      .eq('id', id);

    if (updateError) {
      console.error('❌ Failed to update backup email status:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Error updating backup email status:', error);
    return false;
  }
}

// Process backup emails (for cron job or manual processing)
export async function processBackupEmails() {
  const pendingEmails = await getPendingBackupEmails(10);
  
  console.log(`📧 BACKUP EMAIL PROCESSOR: Found ${pendingEmails.length} pending emails`);
  
  for (const email of pendingEmails) {
    try {
      // Try to send via SendGrid again
      const result = await sendEmailWithBackup({
        to: email.to_email,
        from: email.from_email,
        subject: email.subject,
        text: email.text_content,
        html: email.html_content,
        type: email.email_type as any,
        formData: email.form_data
      });
      
      if (result.success && result.method === 'sendgrid') {
        await markBackupEmailProcessed(email.id, 'sent');
        console.log('✅ BACKUP EMAIL PROCESSOR: Successfully sent email', email.id);
      } else {
        console.log('⏳ BACKUP EMAIL PROCESSOR: Email still in backup queue', email.id);
      }
    } catch (error) {
      console.error('❌ BACKUP EMAIL PROCESSOR: Failed to process email', email.id, error);
      await markBackupEmailProcessed(email.id, 'failed', String(error));
    }
  }
}

// Get backup email statistics
export async function getBackupEmailStats() {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from('backup_emails')
      .select('status, email_type, created_at')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()); // Last 7 days

    if (error) {
      console.error('❌ Failed to get backup email stats:', error);
      return null;
    }

    const stats = {
      total: data.length,
      pending: data.filter(e => e.status === 'pending').length,
      sent: data.filter(e => e.status === 'sent').length,
      failed: data.filter(e => e.status === 'failed').length,
      byType: {} as Record<string, number>
    };

    // Count by type
    data.forEach(email => {
      stats.byType[email.email_type] = (stats.byType[email.email_type] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error('❌ Error getting backup email stats:', error);
    return null;
  }
}