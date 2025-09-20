import { NextRequest, NextResponse } from 'next/server';
import { supabaseAuth } from '@/lib/supabase-auth';
import { sendWelcomeEmail } from '@/lib/email';

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
    sendWelcomeEmail({ email, name }).catch(error => {
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