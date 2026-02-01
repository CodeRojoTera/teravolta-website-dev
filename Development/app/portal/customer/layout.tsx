'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import Link from 'next/link';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';
import { NotificationProvider } from '@/components/NotificationContext';
import NotificationCenter from '@/components/NotificationCenter';

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const { language, setLanguage, t } = useLanguage();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Click outside handler for dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/portal/login');
            }
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return <PageLoadingSkeleton />;
    }

    return (
        <NotificationProvider>
            <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden">
                {/* Background Texture Overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
                    style={{
                        backgroundImage: 'url(/images/brand/textura-alargada.svg)',
                        backgroundRepeat: 'repeat',
                        backgroundPosition: 'center',
                        backgroundSize: '1000px',
                    }}
                />

                {/* Aligned Header for Customers */}
                <header className="bg-white shadow-sm sticky top-0 z-50">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center cursor-pointer shrink-0">
                                <img
                                    src="/images/logos/horizontal.png"
                                    alt="TeraVolta Logo"
                                    className="h-10 w-auto object-contain"
                                />
                            </Link>

                            <div className="flex items-center space-x-6">
                                {/* Notification Center */}
                                <NotificationCenter />

                                {/* User Account Dropdown - Aligned with main site */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center gap-2 px-4 md:px-6 py-2 bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#004a90] rounded-full transition-colors font-medium whitespace-nowrap cursor-pointer"
                                    >
                                        <i className="ri-user-line"></i>
                                        <span className="hidden sm:inline">{t('header.account')}</span>
                                        <i className={`ri-arrow-down-s-line transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                            <div className="px-4 py-2 border-b border-gray-100 mb-2">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
                                                    {t('header.account') || 'Account'}
                                                </p>
                                                <p className="text-sm font-bold text-[#004a90] truncate">{user.user_metadata?.full_name || user.email?.split('@')[0]}</p>
                                            </div>

                                            {pathname !== '/portal/customer' && (
                                                <Link
                                                    href="/portal/customer"
                                                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-[#004a90] transition-colors"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    <i className="ri-dashboard-line"></i>
                                                    <span>{t('header.dashboard') || 'Dashboard'}</span>
                                                </Link>
                                            )}

                                            {pathname !== '/portal/customer/settings' && (
                                                <Link
                                                    href="/portal/customer/settings"
                                                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-[#004a90] transition-colors"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    <i className="ri-settings-4-line"></i>
                                                    <span>{t('header.settings') || 'Settings'}</span>
                                                </Link>
                                            )}

                                            <div className="my-2 border-t border-gray-100"></div>

                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await logout();
                                                        router.push('/');
                                                    } catch (error) {
                                                        console.error('Logout error:', error);
                                                    }
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-left"
                                            >
                                                <i className="ri-logout-box-r-line"></i>
                                                <span>{t('header.logout') || 'Logout'}</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Language Selector - Aligned Design: EN | ES */}
                                <div className="flex items-center space-x-2 text-sm">
                                    <button
                                        onClick={() => setLanguage('en')}
                                        className={`text-[#004a90] hover:text-[#c3d021] cursor-pointer transition-colors ${language === 'en' ? 'font-bold text-[#c3d021]' : ''
                                            }`}
                                    >
                                        EN
                                    </button>
                                    <span className="text-gray-300">|</span>
                                    <button
                                        onClick={() => setLanguage('es')}
                                        className={`text-[#004a90] hover:text-[#c3d021] cursor-pointer transition-colors ${language === 'es' ? 'font-bold text-[#c3d021]' : ''
                                            }`}
                                    >
                                        ES
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
                    {children}
                </main>
            </div>
        </NotificationProvider>
    );
}
