import { NextRequest, NextResponse } from 'next/server';
import { supabaseAuth } from '@/lib/supabase-auth';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

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
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Send password reset email using Supabase Auth service
    const result = await supabaseAuth.sendPasswordReset(email);

    // Always return success message for security (don't reveal if email exists)
    return NextResponse.json(
      { 
        message: 'If an account with that email exists, we have sent a password reset link.',
        success: true 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}