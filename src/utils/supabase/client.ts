'use client';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI3MjYsImV4cCI6MTk2MDc2ODcyNn0.placeholder';

// Check for placeholder values (only warn, don't throw errors)
if (supabaseUrl.includes('placeholder') || supabaseUrl === 'https://supabase.co') {
  console.warn('⚠️  NEXT_PUBLIC_SUPABASE_URL contains placeholder value. Database features will be disabled until you configure actual Supabase credentials.');
}

if (supabaseAnonKey.includes('placeholder') || supabaseAnonKey.includes('EXAMPLE')) {
  console.warn('⚠️  NEXT_PUBLIC_SUPABASE_ANON_KEY contains placeholder value. Database features will be disabled until you configure actual Supabase credentials.');
}

export const createClient = () => {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storageKey: 'ventaro-store-auth-token',
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
};