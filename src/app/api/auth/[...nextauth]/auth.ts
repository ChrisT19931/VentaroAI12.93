import NextAuth, { NextAuthOptions, User, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabaseAuth } from '@/lib/supabase-auth';

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      entitlements?: string[];
      roles?: string[];
      created_at?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    entitlements?: string[];
    roles?: string[];
    created_at?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name?: string;
    entitlements?: string[];
    roles?: string[];
    created_at?: string;
  }
}

// Product ID mapping for entitlements
const PRODUCT_ENTITLEMENT_MAP: Record<string, string[]> = {
  '1': ['ai-tools-mastery-guide-2025', 'ebook'],
  '2': ['ai-prompts-arsenal-2025', 'prompts'],
  '4': ['ai-business-video-guide-2025', 'video', 'masterclass'],
  '5': ['weekly-support-contract-2025', 'support'],
};

function mapPurchasesToEntitlements(purchases: any[]): string[] {
  const entitlements = new Set<string>();
  
  for (const purchase of purchases) {
    const productId = purchase.product_id;
    
    // Add the raw product ID
    entitlements.add(productId);
    
    // Add mapped entitlements
    if (PRODUCT_ENTITLEMENT_MAP[productId]) {
      PRODUCT_ENTITLEMENT_MAP[productId].forEach(entitlement => {
        entitlements.add(entitlement);
      });
    }
  }
  
  return Array.from(entitlements);
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('🚀 BULLETPROOF AUTH: Starting authentication for:', credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.error('❌ BULLETPROOF AUTH: Missing credentials');
          throw new Error('Email and password are required');
        }

        try {
          // Use Supabase authentication
          const result = await supabaseAuth.signIn(
            credentials.email,
            credentials.password
          );

          if (!result.success || !result.user) {
            console.error('❌ SUPABASE AUTH: User authentication failed:', result.error);
            throw new Error(result.error || 'Invalid email or password');
          }

          console.log('✅ SUPABASE AUTH: User authenticated:', result.user.email);

          // Get user profile and purchases for entitlements
          let entitlements: string[] = [];
          let roles: string[] = ['user'];
          let userName = result.user.email?.split('@')[0]; // Default name from email
          
          try {
            const profileResult = await supabaseAuth.getUserProfile(result.user.id);
            if (profileResult.success && profileResult.profile) {
              userName = profileResult.profile.name || userName;
              roles = profileResult.profile.user_role ? [profileResult.profile.user_role] : ['user'];
              
              // Get purchases for entitlements
              const purchases = await supabaseAuth.getUserPurchases(result.user.id);
              if (purchases.success && purchases.purchases) {
                entitlements = mapPurchasesToEntitlements(purchases.purchases);
                console.log('✅ SUPABASE AUTH: User entitlements loaded:', entitlements);
              }
            }
          } catch (error) {
            console.warn('⚠️ SUPABASE AUTH: Error loading profile/purchases (non-blocking):', error);
          }

          const authUser: User = {
            id: result.user.id,
            email: result.user.email!,
            name: userName,
            entitlements,
            roles,
            created_at: result.user.created_at,
          };

          console.log('🎉 SUPABASE AUTH: Authentication complete for:', result.user.email);
          return authUser;

        } catch (error) {
          console.error('❌ SUPABASE AUTH: Authentication error:', error);
          throw new Error(error instanceof Error ? error.message : 'Authentication failed');
        }
      }
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      console.log('🔐 BULLETPROOF AUTH: JWT callback - user present:', !!user);
      
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.entitlements = user.entitlements || [];
        token.roles = user.roles || ['user'];
        token.created_at = user.created_at;
        console.log('✅ SUPABASE AUTH: JWT token populated for:', user.email);
      }
      return token;
    },
    
    async session({ session, token }) {
      console.log('🔐 SUPABASE AUTH: Session callback - token present:', !!token);
      
      if (token && session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.roles = token.roles || ['user'];
        session.user.created_at = token.created_at;
        
        // CRITICAL: Always refresh entitlements from database to ensure immediate access after purchase
        try {
          const purchasesResult = await supabaseAuth.getUserPurchases(token.id);
          if (purchasesResult.success && purchasesResult.purchases) {
            const freshEntitlements = mapPurchasesToEntitlements(purchasesResult.purchases);
            session.user.entitlements = freshEntitlements;
            console.log('✅ SUPABASE AUTH: Fresh entitlements loaded for:', token.email, freshEntitlements);
          } else {
            console.warn('⚠️ SUPABASE AUTH: Failed to refresh entitlements, using cached:', purchasesResult.error);
            session.user.entitlements = token.entitlements || [];
          }
        } catch (error) {
          console.warn('⚠️ SUPABASE AUTH: Failed to refresh entitlements, using cached:', error);
          session.user.entitlements = token.entitlements || [];
        }
        
        console.log('✅ SUPABASE AUTH: Session populated for:', token.email);
      }
      return session;
    },
    
    async redirect({ url, baseUrl }) {
      console.log('🔄 SUPABASE AUTH: Redirect callback - url:', url, 'baseUrl:', baseUrl);
      
      // If user is signing in, redirect to my-account page
      if (url.startsWith(baseUrl)) {
        // If it's a callback URL, check if it's a sign-in
        if (url.includes('/api/auth/callback') || url.includes('/signin') || url.includes('/signup')) {
          console.log('✅ SUPABASE AUTH: Redirecting to /my-account after login');
          return `${baseUrl}/my-account`;
        }
        return url;
      }
      
      // Default redirect to my-account for successful authentication
      console.log('✅ BULLETPROOF AUTH: Default redirect to /my-account');
      return `${baseUrl}/my-account`;
    },
  },
  
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  
  debug: process.env.NODE_ENV === 'development',
  
  secret: process.env.NEXTAUTH_SECRET || 'bulletproof-fallback-secret-for-development',
  
  events: {
    async signIn(message) {
      console.log('🎉 BULLETPROOF AUTH: User signed in successfully:', message.user.email);
    },
    async signOut(message) {
      console.log('👋 BULLETPROOF AUTH: User signed out');
    },
    async session(message) {
      console.log('🔄 BULLETPROOF AUTH: Session accessed for:', message.session.user?.email);
    },
  },
};