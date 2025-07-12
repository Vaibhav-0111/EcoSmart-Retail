// src/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, googleProvider, isFirebaseConfigured } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        if (!isFirebaseConfigured() || !auth) {
            setLoading(false);
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        if (!auth || !googleProvider) {
            toast({
                title: 'Configuration Error',
                description: 'Firebase is not configured correctly. Please add your project credentials to the .env file.',
                variant: 'destructive'
            });
            return;
        }
        setLoading(true);
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error: any) {
            console.error("Error signing in with Google: ", error);
             if (error.code === 'auth/invalid-api-key') {
                 toast({
                    title: 'Invalid API Key',
                    description: 'The Firebase API key is not valid. Please check your .env file and ensure it is correct.',
                    variant: 'destructive'
                })
            } else {
                toast({
                    title: 'Login Failed',
                    description: 'Could not sign in with Google. Please try again.',
                    variant: 'destructive'
                })
            }
            setLoading(false);
        }
    };

    const logout = async () => {
        if (!auth) return;
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out: ", error);
             toast({
                title: 'Logout Failed',
                description: 'Could not sign out. Please try again.',
                variant: 'destructive'
            })
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
