// src/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { auth, isConfigured as firebaseIsConfigured } from '@/lib/firebase';
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => void;
  logOut: () => void;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(firebaseIsConfigured);
  const { toast } = useToast();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const signInWithGoogle = async () => {
    if (!auth) {
        toast({
            title: "Configuration Error",
            description: "Firebase is not configured. Please check your .env file.",
            variant: "destructive"
        });
        return;
    }
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Authentication error:", error);
       if (error.code === 'auth/api-key-not-valid' || error.code === 'auth/invalid-api-key') {
         toast({
            title: "Invalid Firebase API Key",
            description: "The provided Firebase API key is not valid. Please check your .env file.",
            variant: "destructive",
        });
      } else if (error.code === 'auth/configuration-not-found') {
        toast({
           title: "Configuration Not Found",
           description: "Google Sign-in is not enabled in your Firebase project. Please enable it in the Firebase Console under Authentication > Sign-in method.",
           variant: "destructive",
           duration: 10000,
       });
      } else if (error.code === 'auth/unauthorized-domain') {
        toast({
           title: "Domain Not Authorized",
           description: "This app's domain is not authorized for Firebase Authentication. Please add it in the Firebase Console under Authentication > Settings > Authorized domains.",
           variant: "destructive",
           duration: 10000,
       });
      } else {
        toast({
            title: "Login Failed",
            description: "Could not sign in with Google. Please try again.",
            variant: "destructive",
        });
      }
    } finally {
        setLoading(false);
    }
  };

  const logOut = async () => {
    if (!auth) return;
    await auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logOut, isConfigured }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
