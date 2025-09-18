import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { 
  getPendingBackupEmails, 
  getBackupEmailStats, 
  processBackupEmails,
  markBackupEmailProcessed 
} from '@/lib/backup-email';

// GET - Get backup email statistics and pending emails
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const limit = parseInt(searchParams.get('limit') || '50');

    switch (action) {
      case 'stats':
        const stats = await getBackupEmailStats();
        return NextResponse.json({
          success: true,
          stats
        });

      case 'pending':
        const pendingEmails = await getPendingBackupEmails(limit);
        return NextResponse.json({
          success: true,
          emails: pendingEmails,
          count: pendingEmails.length
        });

      case 'all':
        const supabase = getSupabaseAdmin();
        const { data: allEmails, error } = await supabase
          .from('backup_emails')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) {
          return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          emails: allEmails,
          count: allEmails?.length || 0
        });

      default:
        return NextResponse.json({
          success: true,
          message: 'Backup email system is operational',
          availableActions: ['stats', 'pending', 'all']
        });
    }
  } catch (error: any) {
    console.error('❌ BACKUP EMAILS API: Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Process backup emails or update email status
export async function POST(request: NextRequest) {
  try {
    const { action, emailId, status, error: errorMessage } = await request.json();

    switch (action) {
      case 'process':
        console.log('📧 BACKUP EMAILS API: Processing backup emails...');
        await processBackupEmails();
        return NextResponse.json({
          success: true,
          message: 'Backup emails processing initiated'
        });

      case 'mark-processed':
        if (!emailId || !status) {
          return NextResponse.json(
            { success: false, error: 'Email ID and status are required' },
            { status: 400 }
          );
        }

        const result = await markBackupEmailProcessed(emailId, status, errorMessage);
        return NextResponse.json({
          success: result,
          message: result ? 'Email status updated' : 'Failed to update email status'
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('❌ BACKUP EMAILS API: Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Clean up old backup emails
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const daysOld = parseInt(searchParams.get('days') || '30');
    const emailId = searchParams.get('id');

    const supabase = getSupabaseAdmin();

    if (emailId) {
      // Delete specific email
      const { error } = await supabase
        .from('backup_emails')
        .delete()
        .eq('id', emailId);

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Email deleted successfully'
      });
    } else {
      // Clean up old emails
      const { data, error } = await supabase
        .rpc('cleanup_old_backup_emails', { days_old: daysOld });

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Cleaned up ${data} old backup emails`,
        deletedCount: data
      });
    }
  } catch (error: any) {
    console.error('❌ BACKUP EMAILS API: Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}