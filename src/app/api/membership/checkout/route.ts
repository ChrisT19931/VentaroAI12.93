import { NextRequest, NextResponse } from 'next/server';
import getStripeInstance from '@/lib/stripe';
import sgMail from '@sendgrid/mail';
import { createClientWithRetry } from '@/lib/supabase';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClientWithRetry();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { tier_id, billing_cycle } = body;

    // Validate required fields
    if (!tier_id || !billing_cycle) {
      return NextResponse.json(
        { error: 'Missing required fields: tier_id, billing_cycle' },
        { status: 400 }
      );
    }

    // Get the membership tier
    const { data: tier, error: tierError } = await supabase
      .from('membership_tiers')
      .select('*')
      .eq('id', tier_id)
      .eq('is_active', true)
      .single();

    if (tierError || !tier) {
      return NextResponse.json(
        { error: 'Invalid tier ID' },
        { status: 400 }
      );
    }

    // Get user profile for email
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const userName = profile?.name || user.email?.split('@')[0] || 'Member';
    const userEmail = user.email!;

    // Create Stripe checkout session
    const stripe = await getStripeInstance();
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    
    // Determine price based on billing cycle
    const price = billing_cycle === 'yearly' ? tier.price_yearly : tier.price_monthly;
    const stripePrice = billing_cycle === 'yearly' ? tier.stripe_price_id_yearly : tier.stripe_price_id_monthly;

    if (!price || !stripePrice) {
      return NextResponse.json(
        { error: 'Pricing not available for selected billing cycle' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePrice,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/membership?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/membership?canceled=true`,
      customer_email: userEmail,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        tier_id: tier_id,
        billing_cycle: billing_cycle,
        user_email: userEmail,
        user_name: userName
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          tier_id: tier_id,
          billing_cycle: billing_cycle
        }
      },
      allow_promotion_codes: true,
    });

    // Send subscription notification emails
    await sendSubscriptionEmails({
      userEmail,
      userName,
      tierName: tier.name,
      billingCycle: billing_cycle,
      price: price / 100, // Convert from cents to dollars
      sessionId: session.id
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id
    });

  } catch (error) {
    console.error('Membership checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// Function to send subscription notification emails
async function sendSubscriptionEmails({
  userEmail,
  userName,
  tierName,
  billingCycle,
  price,
  sessionId
}: {
  userEmail: string;
  userName: string;
  tierName: string;
  billingCycle: string;
  price: number;
  sessionId: string;
}) {
  if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY === 'SG.placeholder_api_key_replace_with_real_key') {
    console.log('📧 SendGrid not configured - Subscription emails would be sent');
    console.log('📧 Admin notification:', {
      to: 'chris.t@ventarosales.com',
      subject: `🎯 New Subscription: ${tierName} (${billingCycle})`,
      user: userName,
      email: userEmail
    });
    console.log('📧 User confirmation:', {
      to: userEmail,
      subject: `Welcome to ${tierName} - First Access to AI Toolbox!`
    });
    return;
  }

  try {
    // Admin notification email
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 25px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🎯 New Subscription Alert!</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #059669; margin-top: 0;">Subscription Details</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Customer:</strong> ${userName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${userEmail}</p>
            <p style="margin: 5px 0;"><strong>Tier:</strong> ${tierName}</p>
            <p style="margin: 5px 0;"><strong>Billing:</strong> ${billingCycle}</p>
            <p style="margin: 5px 0;"><strong>Price:</strong> $${price}/${billingCycle === 'yearly' ? 'year' : 'month'}</p>
            <p style="margin: 5px 0;"><strong>Session ID:</strong> ${sessionId}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background: #ecfdf5; border-left: 4px solid #059669; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #065f46;"><strong>Action Required:</strong> Customer will get first access to VAI Toolkit and VAI Masterclass when subscription is confirmed.</p>
          </div>
        </div>
      </div>
    `;

    // User confirmation email
    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 25px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Welcome to ${tierName}!</h1>
          <p style="color: #e0e7ff; margin: 10px 0 0 0;">You're getting first access to our AI Toolbox</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #3b82f6; margin-top: 0;">Hi ${userName}!</h2>
          
          <p style="color: #374151; line-height: 1.6;">Thank you for subscribing to <strong>${tierName}</strong>! You're now among the first to get exclusive access to:</p>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">🚀 What You Get First Access To:</h3>
            <ul style="color: #374151; line-height: 1.8;">
              <li><strong>AI Toolbox:</strong> 30+ curated AI tools for business automation</li>
              <li><strong>VAI Masterclass:</strong> Complete video training series</li>
              <li><strong>Premium Prompts:</strong> Expert-crafted AI prompts</li>
              <li><strong>Priority Support:</strong> Direct access to our team</li>
              <li><strong>Early Access:</strong> Be first to try new tools and features</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://ventaroai.com/membership" style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Access Your Dashboard →</a>
          </div>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;"><strong>Next Steps:</strong> Keep an eye on your email for updates on when the AI Toolbox and Masterclass go live. You'll be the first to know!</p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">Questions? Reply to this email or contact us at chris.t@ventarosales.com</p>
        </div>
      </div>
    `;

    // Send admin notification
    await sgMail.send({
      to: 'chris.t@ventarosales.com',
      from: {
        email: 'noreply@ventaroai.com',
        name: 'VentaroAI Subscriptions'
      },
      subject: `🎯 New Subscription: ${tierName} (${billingCycle}) - ${userName}`,
      html: adminEmailHtml
    });

    // Send user confirmation
    await sgMail.send({
      to: userEmail,
      from: {
        email: 'noreply@ventaroai.com',
        name: 'VentaroAI'
      },
      subject: `🎉 Welcome to ${tierName} - First Access to AI Toolbox!`,
      html: userEmailHtml
    });

    console.log('✅ Subscription notification emails sent successfully');

  } catch (error) {
    console.error('❌ Failed to send subscription emails:', error);
    // Don't throw error - subscription should still work even if emails fail
  }
}