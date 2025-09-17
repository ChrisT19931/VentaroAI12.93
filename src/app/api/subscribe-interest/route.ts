import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'
import { createClientWithRetry } from '@/lib/supabase'

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { product, timestamp, source } = await request.json()

    // Get user's IP for tracking
    const userIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

    // Initialize Supabase client
    const supabase = await createClientWithRetry()
    
    // Store interest in database
    const { data, error } = await supabase
      .from('product_interest')
      .insert({
        product_name: product,
        source: source,
        user_ip: userIP,
        created_at: timestamp
      })
      .select()

    if (error) {
      console.error('Database error:', error)
      // Continue even if database fails
    }

    // Send email notification to admin
    const emailData = {
      to: process.env.ADMIN_EMAIL || 'ventaro@ventaro.ai',
      from: process.env.FROM_EMAIL || 'noreply@ventaro.ai',
      subject: `🎯 New Interest: ${product}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🎯 New Product Interest!</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Interest Details</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 10px 0;"><strong>Product:</strong> ${product}</p>
              <p style="margin: 10px 0;"><strong>Source:</strong> ${source}</p>
              <p style="margin: 10px 0;"><strong>Timestamp:</strong> ${new Date(timestamp).toLocaleString()}</p>
              <p style="margin: 10px 0;"><strong>User IP:</strong> ${userIP}</p>
            </div>
            
            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
              <h3 style="color: #1976d2; margin-top: 0;">📊 Action Required</h3>
              <p style="color: #333; margin-bottom: 0;">Someone is interested in the AI Web Creation Masterclass! Consider reaching out or adding them to your launch sequence.</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>This notification was sent automatically from your Ventaro AI system.</p>
          </div>
        </div>
      `
    }

    await sgMail.send(emailData)

    return NextResponse.json({ 
      success: true, 
      message: 'Interest registered successfully',
      data: data?.[0] || null
    })

  } catch (error) {
    console.error('Subscribe interest error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to register interest' 
      },
      { status: 500 }
    )
  }
}