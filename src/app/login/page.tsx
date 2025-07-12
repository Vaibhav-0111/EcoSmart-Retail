// src/app/login/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.48 2.04-4.33 2.04-3.87 0-7-3.13-7-7s3.13-7 7-7c1.73 0 3.26.59 4.34 1.6l2.44-2.44C17.44 2.59 15.18 1.5 12.48 1.5c-5.48 0-9.94 4.46-9.94 9.94s4.46 9.94 9.94 9.94c5.22 0 9.4-4.22 9.4-9.94v-3.28H12.48z"
    />
  </svg>
);

export default function LoginPage() {
  const { user, signInWithGoogle, loading, isConfigured } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Icons.logo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle>Welcome to EcoSmart Retail</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConfigured && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Configuration Missing</AlertTitle>
              <AlertDescription>
                Firebase credentials are not set up. Please add them to your
                <code>.env</code> file to enable login.
              </AlertDescription>
            </Alert>
          )}
          <Button 
            onClick={signInWithGoogle} 
            disabled={loading || !isConfigured} 
            className="w-full"
          >
            {loading ? (
              <Icons.logo className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon className="mr-2 h-4 w-4" />
            )}
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
