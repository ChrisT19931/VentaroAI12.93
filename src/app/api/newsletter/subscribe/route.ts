import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/sendgrid';
import { supabase } from '@/lib/supabase';
import { sendEmailWithBackup } from '@/lib/backup-email';

export async function POST(request: NextRequest) {
  console.log('📰 NEWSLETTER: Processing subscription...');
  
  try {
    const { email, name } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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

    // Check if Supabase is properly configured
    const supabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                              process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';
    
    let existingSubscription = null;
    let insertError = null;
    
    if (supabaseConfigured) {
      // Check if already subscribed in Supabase
      const { data, error: checkError } = await supabase
        .from('newsletter_subscriptions')
        .select('email')
        .eq('email', email.toLowerCase())
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('❌ NEWSLETTER: Error checking subscription:', checkError);
        insertError = checkError;
      } else {
        existingSubscription = data;
      }

      if (existingSubscription) {
        return NextResponse.json({
          success: false,
          message: 'Thanks for subscribing! You\'re already on our updates list.',
          alreadySubscribed: true
        });
      }

      // Add to Supabase newsletter subscriptions table
      if (!insertError) {
        const { data: newSubscription, error } = await supabase
          .from('newsletter_subscriptions')
          .insert({
            email: email.toLowerCase(),
            name: name || null,
            subscribed_at: new Date().toISOString(),
            is_active: true
          })
          .select()
          .single();

        if (error) {
          console.error('❌ NEWSLETTER: Error storing subscription:', error);
          insertError = error;
        }
      }
    } else {
      console.log('📰 NEWSLETTER: Supabase not configured, skipping database storage');
    }

    if (supabaseConfigured && !insertError) {
      console.log(`✅ NEWSLETTER: New subscription added for ${email}`);
    } else if (!supabaseConfigured) {
      console.log(`✅ NEWSLETTER: Subscription processed for ${email} (database storage skipped)`);
    }

    // Send welcome email to subscriber using backup system
    const welcomeEmailResult = await sendEmailWithBackup({
      to: email,
      subject: '🎉 Welcome to Ventaro AI Updates!',
      type: 'newsletter',
      formData: {
        name,
        email,
        source: 'newsletter_subscribe'
      },
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to Ventaro AI Updates</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome to Ventaro AI!</h1>
            <p style="color: white; margin: 15px 0 0 0; font-size: 18px; opacity: 0.9;">You're now subscribed to our updates</p>
          </div>
          
          <div style="background: white; padding: 35px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Hi ${name || 'AI Enthusiast'}! 👋</h2>
            
            <p style="font-size: 16px; margin-bottom: 25px;">
              Thank you for subscribing to <strong>Ventaro AI Updates</strong>! 
              You've just joined a community of forward-thinking individuals who are leveraging AI to transform their businesses and lives.
            </p>
            
            <div style="background: #f0f9ff; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #667eea;">
              <h3 style="margin-top: 0; color: #1e40af; font-size: 18px;">📬 What to Expect</h3>
              <ul style="margin: 15px 0; padding-left: 20px; color: #1e40af;">
                <li><strong>Weekly AI Insights:</strong> Latest trends and breakthrough technologies</li>
                <li><strong>Exclusive Tools:</strong> Early access to new AI products and features</li>
                <li><strong>Success Stories:</strong> Real case studies from our community</li>
                <li><strong>Expert Tips:</strong> Practical advice from AI specialists</li>
                <li><strong>Product Updates:</strong> First to know about new releases and offers</li>
              </ul>
            </div>
            
            <div style="background: #ecfdf5; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #10b981;">
              <h3 style="margin-top: 0; color: #047857; font-size: 18px;">🚀 Get Started</h3>
              <p style="color: #047857; margin-bottom: 15px;">
                Ready to transform your business with AI? Explore our premium products and services:
              </p>
              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://ventaroai.com'}/products" 
                   style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 5px;">
                  🛍️ View Our Products
                </a>
              </div>
            </div>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #f59e0b;">
              <h4 style="margin-top: 0; color: #92400e; font-size: 16px;">💡 Pro Tip for New Subscribers</h4>
              <p style="margin: 0; color: #92400e;">
                Add <strong>chris.t@ventarosales.com</strong> to your contacts to ensure our emails reach your inbox and not your spam folder!
              </p>
            </div>
            
            <hr style="border: none; border-top: 2px solid #e5e7eb; margin: 35px 0;">
            
            <div style="text-align: center;">
              <h4 style="color: #374151; margin-bottom: 15px;">Stay Connected</h4>
              <p style="margin: 10px 0; color: #6b7280;">
                Questions or feedback? Reply to this email anytime!
              </p>
              <p style="font-size: 14px; color: #9ca3af; margin-top: 20px;">
                Ventaro AI - Pioneering the future of digital products with AI
                <br>
                <a href="mailto:chris.t@ventarosales.com" style="color: #667eea; text-decoration: none;">Unsubscribe</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Welcome to Ventaro AI Updates!

Hi ${name || 'AI Enthusiast'},

Thank you for subscribing to Ventaro AI Updates! You've just joined a community of forward-thinking individuals who are leveraging AI to transform their businesses and lives.

What to Expect:
- Weekly AI Insights: Latest trends and breakthrough technologies
- Exclusive Tools: Early access to new AI products and features
- Success Stories: Real case studies from our community
- Expert Tips: Practical advice from AI specialists
- Product Updates: First to know about new releases and offers

Get Started:
Ready to transform your business with AI? Explore our premium products: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://ventaroai.com'}/products

Pro Tip: Add chris.t@ventarosales.com to your contacts to ensure our emails reach your inbox!

Stay Connected:
Questions or feedback? Reply to this email anytime!

Best regards,
The Ventaro AI Team

Unsubscribe: chris.t@ventarosales.com`
    });

    // Send notification to admin using backup system
    const adminEmailResult = await sendEmailWithBackup({
      to: 'chris.t@ventarosales.com',
      subject: `📰 New Updates Subscription: ${email}`,
      type: 'newsletter',
      formData: {
        name,
        email,
        source: 'newsletter_subscribe'
      },
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>New Updates Subscription</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">📰 New Updates Subscription</h1>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Subscriber Details:</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 30%;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${email}" style="color: #667eea;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${name || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Subscribed:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${new Date().toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold;">Total Subscribers:</td>
                <td style="padding: 10px; color: #10b981; font-weight: bold;" id="total-count">Loading...</td>
              </tr>
            </table>
            
            <div style="margin-top: 25px; padding: 15px; background: #f0f9ff; border-radius: 6px;">
              <p style="margin: 0; font-size: 14px; color: #1976d2;">
                <strong>📊 Updates Growth:</strong> New subscriber added successfully!
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `New Updates Subscription

Subscriber Details:
- Email: ${email}
- Name: ${name || 'Not provided'}
- Subscribed: ${new Date().toLocaleString()}

Updates Growth: New subscriber added successfully!`
    });

    console.log(`📰 NEWSLETTER: Welcome email ${welcomeEmailResult.success ? 'sent' : 'failed'} - ${welcomeEmailResult.error || 'Success'}`);
    console.log(`📰 NEWSLETTER: Admin notification ${adminEmailResult.success ? 'sent' : 'failed'} - ${adminEmailResult.error || 'Success'}`);

    // Get total subscriber count from Supabase (if configured)
    let totalSubscribers = 1;
    if (supabaseConfigured && !insertError) {
      const { count } = await supabase
        .from('newsletter_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      totalSubscribers = count || 1;
    }

    // Always show success - even if there are technical issues, confirm subscription
    if (insertError) {
      console.error('❌ NEWSLETTER: Database error (showing success to user):', insertError);
      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed to updates! You\'re now on our updates list.',
        totalSubscribers: 1,
        emailsSent: {
          welcome: false,
          admin: false
        },
        emailConfigured: false,
        databaseConfigured: supabaseConfigured
      });
    }
    
    // Determine success message - always positive
    const emailConfigured = welcomeEmailResult.success || adminEmailResult.success;
    let message;
    
    if (emailConfigured) {
      message = 'Successfully subscribed to updates! Check your email for a welcome message.';
    } else {
      message = 'Successfully subscribed to updates! You\'re now on our updates list.';
    }

    return NextResponse.json({
      success: true,
      message,
      totalSubscribers: totalSubscribers || 1,
      emailsSent: {
        welcome: welcomeEmailResult.success,
        admin: adminEmailResult.success
      },
      emailConfigured,
      databaseConfigured: supabaseConfigured
    });

  } catch (error: any) {
    console.error('❌ NEWSLETTER: Error (showing success to user):', error);
    
    // Always show success to user even if there are technical issues
    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to updates! You\'re now on our updates list.',
      totalSubscribers: 1,
      emailsSent: {
        welcome: false,
        admin: false
      },
      emailConfigured: false,
      databaseConfigured: false
    });
  }
}