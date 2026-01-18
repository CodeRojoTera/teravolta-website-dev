'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import { useAuth } from '@/components/AuthProvider';
import { NotificationProvider } from '@/components/NotificationContext';
import NotificationCenter from '@/components/NotificationCenter';
import RoleGuard from '@/components/RoleGuard';
import { supabase } from '@/lib/supabase';

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { language, setLanguage } = useLanguage();
    const { user, logout } = useAuth();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;
            try {
                // Fetch from Supabase 'users' table
                const { data, error } = await supabase
                    .from('users')
                    .select('full_name, email')
                    .eq('id', user.id)
                    .single();

                if (data && !error) {
                    setUserName(data.full_name || data.email?.split('@')[0] || 'Technician');
                } else if (user.email) {
                    setUserName(user.email.split('@')[0]);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [user]);

    const handleLogout = async () => {
        try {
            await logout();      // Supabase Logout (from AuthProvider)
        } catch (error) {
            console.error('Logout error:', error);
        }
        router.push('/');
    };

    const t = {
        title: language === 'es' ? 'Portal Técnico' : 'Technician Portal',
        dashboard: language === 'es' ? 'Mis Citas' : 'My Appointments',
        logout: language === 'es' ? 'Cerrar Sesión' : 'Logout',
        profile: language === 'es' ? 'Mi Perfil' : 'My Profile'
    };

    return (
        <RoleGuard requiredRole="technician">
            <NotificationProvider>
                <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
                    {/* Simplified Header */}
                    <header className="bg-[#004A90] text-white shadow-md sticky top-0 z-50">
                        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img
                                    src="/images/logos/icon.png"
                                    alt="TeraVolta"
                                    className="w-8 h-8 object-contain brightness-0 invert"
                                />
                                <h1 className="font-bold text-lg hidden md:block">{t.title}</h1>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Language */}
                                <div className="text-sm font-bold cursor-pointer" onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}>
                                    {language === 'en' ? 'ES' : 'EN'}
                                </div>

                                {/* Notifications */}
                                <NotificationCenter />

                                {/* User Menu */}
                                <div className="flex items-center gap-3 pl-3 border-l border-white/20">
                                    <div className="text-right hidden sm:block">
                                        <div className="text-sm font-bold">{userName}</div>
                                        <div className="text-xs opacity-80">Technician</div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
                                        title={t.logout}
                                    >
                                        <i className="ri-logout-box-line"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 container mx-auto px-4 py-6">
                        {children}
                    </main>

                    {/* Simple Footer */}
                    <footer className="bg-white border-t py-4 text-center text-xs text-gray-500">
                        &copy; {new Date().getFullYear()} TeraVolta Field Service
                    </footer>
                </div>
            </NotificationProvider>
        </RoleGuard>
    );
}
