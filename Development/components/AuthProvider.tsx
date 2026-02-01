'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isAdmin: false,
    logout: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check active session
        const checkSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;

                setUser(session?.user ?? null);
                if (session?.user) {
                    await checkUserRole(session.user);
                } else {
                    setLoading(false);
                }
            } catch (error: any) {
                // Ignore AbortError which happens on rapid navigation/strict mode
                if (error.message !== 'AbortError' && error.name !== 'AbortError') {
                    console.error('Error checking session:', error);
                }
                setLoading(false);
            }
        };

        checkSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                await checkUserRole(session.user);
            } else {
                setIsAdmin(false);
                setLoading(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const checkUserRole = async (currentUser: User) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('role')
                .eq('id', currentUser.id)
                .maybeSingle();

            if (error) {
                // Ignore AbortError
                if (!error.message?.includes('AbortError') && error.name !== 'AbortError') {
                    console.error('Error checking user role:', error);
                }
                setIsAdmin(false);
            } else if (data && (data.role === 'admin' || data.role === 'super_admin')) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        } catch (error) {
            console.error('Unexpected error checking role:', error);
            setIsAdmin(false);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
            setIsAdmin(false);
            router.push('/portal/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
