import { NextRequest, NextResponse } from 'next/server';
import { supabaseAuth } from '@/lib/supabase-auth';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Input validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Password strength validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Enhanced password validation
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' },
        { status: 400 }
      );
    }

    // Name validation
    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Create user with Supabase Auth
    const result = await supabaseAuth.signUp(email, password, name);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error?.includes('already exists') ? 409 : 400 }
      );
    }

    // Send welcome email (non-blocking)
    sendEmail({
      to: email,
      subject: 'Welcome to Ventaro AI!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4F46E5; margin: 0;">Ventaro AI</h1>
          </div>
          <h2 style="color: #333; margin-bottom: 20px;">Welcome to Ventaro AI, ${name}!</h2>
          <p style="color: #666; line-height: 1.6;">Thank you for joining our platform. We're excited to have you on board!</p>
          <p style="color: #666; line-height: 1.6;">You can now access all our AI-powered tools and resources to accelerate your business growth.</p>
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">What's Next?</h3>
            <ul style="color: #666; line-height: 1.6;">
              <li>Explore our AI business tools</li>
              <li>Access exclusive coaching resources</li>
              <li>Join our community of entrepreneurs</li>
            </ul>
          </div>
          <p style="color: #666; line-height: 1.6;">If you have any questions, feel free to reach out to our support team.</p>
          <p style="color: #666; line-height: 1.6;">Best regards,<br><strong>The Ventaro AI Team</strong></p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
          <p style="color: #9CA3AF; font-size: 12px; text-align: center;">This email was sent to ${email}. If you didn't create an account, please ignore this email.</p>
        </div>
      `
    }).catch(error => {
      console.error('Failed to send welcome email:', error);
    });

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: {
          id: result.user!.id,
          email: result.user!.email,
          name: result.user!.name,
          user_role: result.user!.user_role
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}