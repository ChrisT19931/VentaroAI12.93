import { createClient } from '@supabase/supabase-js';
import { createClientWithRetry } from '@/lib/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Service role client for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  user_role: 'admin' | 'user';
  email_confirmed: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResult {
  user: AuthUser | null;
  error: string | null;
  success: boolean;
}

export class SupabaseAuthService {
  private supabase: any;

  constructor() {
    this.supabase = createClientWithRetry();
  }

  /**
   * Sign up a new user with Supabase Auth
   */
  async signUp(email: string, password: string, name: string): Promise<AuthResult> {
    try {
      // Create user with Supabase Auth
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            name: name.trim(),
            user_role: 'user'
          }
        }
      });

      if (authError) {
        console.error('❌ Supabase Auth signup error:', authError);
        return {
          user: null,
          error: this.getReadableError(authError.message),
          success: false
        };
      }

      if (!authData.user) {
        return {
          user: null,
          error: 'Failed to create user account',
          success: false
        };
      }

      // Create profile record
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: email.toLowerCase().trim(),
          name: name.trim(),
          user_role: 'user',
          email_confirmed: authData.user.email_confirmed_at ? true : false
        });

      if (profileError) {
        console.warn('⚠️ Profile creation failed:', profileError);
        // Don't fail the signup if profile creation fails
      }

      const user: AuthUser = {
        id: authData.user.id,
        email: authData.user.email!,
        name: name.trim(),
        user_role: 'user',
        email_confirmed: authData.user.email_confirmed_at ? true : false,
        created_at: authData.user.created_at!,
        updated_at: authData.user.updated_at!
      };

      console.log('✅ User signed up successfully:', email);
      return {
        user,
        error: null,
        success: true
      };

    } catch (error: any) {
      console.error('❌ Signup error:', error);
      return {
        user: null,
        error: 'An unexpected error occurred during signup',
        success: false
      };
    }
  }

  /**
   * Sign in user with Supabase Auth
   */
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      });

      if (authError) {
        console.error('❌ Supabase Auth signin error:', authError);
        return {
          user: null,
          error: this.getReadableError(authError.message),
          success: false
        };
      }

      if (!authData.user) {
        return {
          user: null,
          error: 'Invalid email or password',
          success: false
        };
      }

      // Get user profile
      const profile = await this.getUserProfile(authData.user.id);
      
      const user: AuthUser = {
        id: authData.user.id,
        email: authData.user.email!,
        name: profile?.name || authData.user.user_metadata?.name || '',
        user_role: profile?.user_role || 'user',
        email_confirmed: authData.user.email_confirmed_at ? true : false,
        created_at: authData.user.created_at!,
        updated_at: authData.user.updated_at!
      };

      console.log('✅ User signed in successfully:', email);
      return {
        user,
        error: null,
        success: true
      };

    } catch (error: any) {
      console.error('❌ Signin error:', error);
      return {
        user: null,
        error: 'An unexpected error occurred during signin',
        success: false
      };
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(email: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`;
      
      const { error } = await this.supabase.auth.resetPasswordForEmail(email.toLowerCase().trim(), {
        redirectTo: redirectUrl
      });

      if (error) {
        console.error('❌ Password reset error:', error);
        return {
          success: false,
          error: this.getReadableError(error.message)
        };
      }

      // Log the reset request
      await this.logPasswordReset(email, 'email_sent');

      console.log('✅ Password reset email sent:', email);
      return {
        success: true,
        error: null
      };

    } catch (error: any) {
      console.error('❌ Password reset error:', error);
      return {
        success: false,
        error: 'Failed to send password reset email'
      };
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(accessToken: string, refreshToken: string, newPassword: string): Promise<{ success: boolean; error: string | null }> {
    try {
      // Set the session with the tokens
      const { error: sessionError } = await this.supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });

      if (sessionError) {
        console.error('❌ Session error:', sessionError);
        return {
          success: false,
          error: 'Invalid or expired reset link'
        };
      }

      // Update the password
      const { error: updateError } = await this.supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        console.error('❌ Password update error:', updateError);
        return {
          success: false,
          error: this.getReadableError(updateError.message)
        };
      }

      // Get current user for logging
      const { data: { user } } = await this.supabase.auth.getUser();
      if (user?.email) {
        await this.logPasswordReset(user.email, 'password_reset');
      }

      console.log('✅ Password reset successfully');
      return {
        success: true,
        error: null
      };

    } catch (error: any) {
      console.error('❌ Password reset error:', error);
      return {
        success: false,
        error: 'Failed to reset password'
      };
    }
  }

  /**
   * Get user profile from the profiles table
   */
  async getUserProfile(userId: string): Promise<{ success: boolean; profile?: { name?: string; user_role: 'user' | 'admin' }; error?: string }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('name, user_role')
        .eq('id', userId)
        .single();

      if (error || !data) {
        return { success: false, error: error?.message || 'Profile not found' };
      }

      return { success: true, profile: data };
    } catch (error) {
      console.warn('⚠️ Failed to get user profile:', error);
      return { success: false, error: 'Failed to fetch user profile' };
    }
  }

  /**
   * Log password reset activity
   */
  private async logPasswordReset(email: string, action: 'email_sent' | 'password_reset'): Promise<void> {
    try {
      await supabaseAdmin
        .from('password_reset_logs')
        .insert({
          email: email.toLowerCase().trim(),
          action,
          ip_address: 'server',
          user_agent: 'server',
          success: true
        });
    } catch (error) {
      console.warn('⚠️ Failed to log password reset:', error);
    }
  }

  /**
   * Convert Supabase error messages to user-friendly messages
   */
  private getReadableError(message: string): string {
    const errorMap: { [key: string]: string } = {
      'Invalid login credentials': 'Invalid email or password',
      'Email not confirmed': 'Please check your email and click the confirmation link',
      'User already registered': 'An account with this email already exists',
      'Password should be at least 6 characters': 'Password must be at least 6 characters long',
      'Unable to validate email address: invalid format': 'Please enter a valid email address',
      'signup_disabled': 'New registrations are currently disabled',
      'email_address_invalid': 'Please enter a valid email address',
      'weak_password': 'Password is too weak. Please choose a stronger password.'
    };

    // Check for exact matches first
    if (errorMap[message]) {
      return errorMap[message];
    }

    // Check for partial matches
    for (const [key, value] of Object.entries(errorMap)) {
      if (message.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }

    // Return original message if no mapping found
    return message;
  }

  /**
   * Check if user exists (for password reset)
   */
  async userExists(email: string): Promise<boolean> {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', email.toLowerCase().trim())
        .single();

      return !error && !!data;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get user purchases for entitlements
   */
  async getUserPurchases(userId: string): Promise<{ success: boolean; purchases?: any[]; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from('purchases')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user purchases:', error);
        return { success: false, error: error.message };
      }

      return { success: true, purchases: data || [] };
    } catch (error) {
      console.error('Error in getUserPurchases:', error);
      return { success: false, error: 'Failed to fetch user purchases' };
    }
  }

  /**
   * Get user purchases by email
   */
  async getUserPurchasesByEmail(email: string): Promise<{ success: boolean; purchases?: any[]; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from('purchases')
        .select('*')
        .eq('customer_email', email);

      if (error) {
        console.error('Error fetching user purchases by email:', error);
        return { success: false, error: error.message };
      }

      return { success: true, purchases: data || [] };
    } catch (error) {
      console.error('Error in getUserPurchasesByEmail:', error);
      return { success: false, error: 'Failed to fetch user purchases by email' };
    }
  }

  /**
   * Create a new purchase record
   */
  async createPurchase(purchaseData: any): Promise<{ success: boolean; purchase?: any; error?: string }> {
    try {
      // If no user_id provided, try to find user by email
      if (!purchaseData.user_id && purchaseData.customer_email) {
        const userResult = await this.findUserByEmail(purchaseData.customer_email);
        if (userResult.success && userResult.user) {
          purchaseData.user_id = userResult.user.id;
        }
      }

      const { data, error } = await this.supabase
        .from('purchases')
        .insert(purchaseData)
        .select()
        .single();

      if (error) {
        console.error('Error creating purchase:', error);
        return { success: false, error: error.message };
      }

      return { success: true, purchase: data };
    } catch (error) {
      console.error('Error in createPurchase:', error);
      return { success: false, error: 'Failed to create purchase' };
    }
  }

  /**
   * Find user by email
   */
  async findUserByEmail(email: string): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error finding user by email:', error);
        return { success: false, error: error.message };
      }

      return { success: true, user: data };
    } catch (error) {
      console.error('Error in findUserByEmail:', error);
      return { success: false, error: 'Failed to find user by email' };
    }
  }

  /**
   * Health check for the service
   */
  async healthCheck(): Promise<{ success: boolean; status?: string; database?: string; users?: number; purchases?: number; error?: string }> {
    try {
      // Check profiles table
      const { data: profilesData, error: profilesError } = await this.supabase
        .from('profiles')
        .select('count')
        .limit(1);

      // Check purchases table
      const { data: purchasesData, error: purchasesError } = await this.supabase
        .from('purchases')
        .select('count')
        .limit(1);

      if (profilesError || purchasesError) {
        console.error('Health check failed:', profilesError || purchasesError);
        return { 
          success: false, 
          status: 'unhealthy',
          database: 'error',
          error: (profilesError || purchasesError)?.message 
        };
      }

      return { 
        success: true, 
        status: 'healthy',
        database: 'connected',
        users: 0, // Could be enhanced to get actual count
        purchases: 0 // Could be enhanced to get actual count
      };
    } catch (error) {
      console.error('Error in healthCheck:', error);
      return { 
        success: false, 
        status: 'unhealthy',
        database: 'error',
        error: 'Health check failed' 
      };
    }
  }
}

export const supabaseAuth = new SupabaseAuthService();