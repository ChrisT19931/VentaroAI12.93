'use client';

// Force update for Vercel deployment
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    // Authentication flow handled by NextAuth
    const redirectTo = params?.get('redirect') || '/';
    router.replace(redirectTo);
  }, [params, router]);

  return null;
}