// src/app/login/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { auth } from '@/lib/firebase';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.37 1.62-3.82 1.62-3.01 0-5.4-2.43-5.4-5.4s2.39-5.4 5.4-5.4c1.32 0 2.5.54 3.38 1.38l2.53-2.52C16.95 3.24 14.88 2 12.48 2c-4.97 0-9 4.03-9 9s4.03 9 9 9c5.05 0 8.67-3.48 8.67-8.82C21.15 11.45 21.08 11.18 21 10.92z"
      ></path>
    </svg>
  );


export default function LoginPage() {
  const router = useRouter();
  const { user, loading, loginWithGoogle } = useAuth();
  const isFirebaseConfigured = !!auth;

  useEffect(() => {
    if (user) {
        router.replace('/dashboard');
    }
  }, [user, router]);


  if(loading || user) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 flex items-center gap-2 text-2xl font-bold text-primary">
        <Icons.logo className="size-8" />
        <h1>EcoSmart Retail</h1>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>
            {isFirebaseConfigured ? 'Sign in to access your dashboard' : 'Firebase is not configured.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Button onClick={loginWithGoogle} className="w-full" variant="outline" disabled={!isFirebaseConfigured}>
              <GoogleIcon className="mr-2 h-4 w-4" />
              Sign in with Google
            </Button>
             {!isFirebaseConfigured && (
              <p className="mt-4 text-center text-xs text-destructive">
                Please add your Firebase credentials to the .env file to enable login.
              </p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
