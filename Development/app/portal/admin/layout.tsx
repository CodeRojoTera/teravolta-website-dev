'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import { useAuth } from '@/components/AuthProvider';
import { NotificationProvider } from '@/components/NotificationContext'; // Imported Provider
import NotificationCenter from '@/components/NotificationCenter'; // Imported UI
import RoleGuard from '@/components/RoleGuard';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { language, setLanguage } = useLanguage();
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [userRole, setUserRole] = useState<string>('admin');
    const [userName, setUserName] = useState<string>('');
    const [usersDropdownOpen, setUsersDropdownOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [techniciansDropdownOpen, setTechniciansDropdownOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setIsSidebarOpen(false);
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;

            try {
                const { data: userData, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (userData) {
                    setUserRole(userData.role || 'admin');
                    setUserName(userData.full_name || user.email?.split('@')[0] || 'User');
                } else {
                    setUserName(user.email?.split('@')[0] || 'User');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [user]);

    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    const content = {
        en: {
            dashboard: 'Dashboard',
            inquiries: 'Inquiries',
            portfolio: 'Portfolio',
            quotes: 'Quotes',
            activeProjects: 'Active Projects',
            users: 'Users',
            requests: 'Requests',
            settings: 'Settings',
            logout: 'Logout',
            welcome: 'Welcome back',
            superAdmin: 'Super Admin',
            admin: 'Admin',
            toggleSidebar: 'Toggle Sidebar',
            website: 'Website',
            calendar: 'Absence Calendar'
        },
        es: {
            dashboard: 'Panel',
            inquiries: 'Consultas',
            portfolio: 'Portfolio',
            quotes: 'Cotizaciones',
            activeProjects: 'Proyectos Activos',
            users: 'Usuarios',
            requests: 'Solicitudes',
            settings: 'Configuración',
            logout: 'Cerrar Sesión',
            welcome: 'Bienvenido',
            superAdmin: 'Super Administrador',
            admin: 'Administrador',
            toggleSidebar: 'Alternar Barra',
            website: 'Sitio Web',
            calendar: 'Calendario de Ausencias'
        }
    };

    const t = content[language];

    const [unresolvedCount, setUnresolvedCount] = useState(0);

    useEffect(() => {
        if (userRole !== 'super_admin') {
            setUnresolvedCount(0);
            return;
        }

        const fetchCount = async () => {
            const { count } = await supabase
                .from('admin_inquiries')
                .select('*', { count: 'exact', head: true })
                .neq('status', 'closed'); // != 'closed' map to neq

            setUnresolvedCount(count || 0);
        };

        fetchCount();

        // Realtime subscription
        const channel = supabase.channel('admin_notifications')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'admin_inquiries' },
                () => {
                    fetchCount();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userRole]);

    const technicianSubItems = [
        { name: language === 'es' ? 'Lista' : 'List', href: '/portal/admin/technicians', icon: 'ri-list-check' },
        { name: t.calendar, href: '/portal/admin/technicians/calendar', icon: 'ri-calendar-event-line' },
    ];

    const operationsItems = [
        { name: t.dashboard, href: '/portal/admin', icon: 'ri-dashboard-line' },
        { name: t.inquiries, href: '/portal/admin/inquiries', icon: 'ri-message-3-line' },
        { name: t.quotes, href: '/portal/admin/quotes', icon: 'ri-file-list-3-line' },
        { name: language === 'es' ? 'Proyectos' : 'Projects', href: '/portal/admin/active-projects', icon: 'ri-folders-line' },
        { name: language === 'es' ? 'Técnicos' : 'Technicians', href: '#technicians', icon: 'ri-tools-line' },
    ];

    const managementItems = [
        { name: t.portfolio, href: '/portal/admin/portfolio', icon: 'ri-gallery-line' },
        { name: t.users, href: '/portal/admin/users', icon: 'ri-group-line' }, // handled separately in render
        // Requests is Super Admin only
        ...(userRole === 'super_admin' ? [{
            name: language === 'es' ? 'Solicitudes' : 'Requests',
            href: '/portal/admin/requests',
            icon: 'ri-mail-send-line',
            badge: unresolvedCount > 0 ? unresolvedCount : undefined
        }] : []),
        { name: t.settings, href: '/portal/admin/settings', icon: 'ri-settings-3-line' },
    ];

    const usersSubItems = [
        { name: language === 'es' ? 'Clientes' : 'Clients', href: '/portal/admin/users/clients', icon: 'ri-user-line' },
        { name: language === 'es' ? 'Administrativos' : 'Admins', href: '/portal/admin/users/staff', icon: 'ri-shield-user-line' },
        { name: language === 'es' ? 'Técnicos' : 'Technicians', href: '/portal/admin/users/technicians', icon: 'ri-tools-line' },
    ];

    const isUsersActive = pathname?.startsWith('/portal/admin/users');

    return (
        <RoleGuard requiredRole="admin">
            <NotificationProvider>
                <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                    {/* Mobile Backdrop */}
                    {isMobile && isSidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-30 transition-opacity"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    )}

                    {/* Sidebar */}
                    <aside
                        className={`fixed left-0 top-0 h-full bg-[#004A90] text-white transition-all duration-300 z-40 flex flex-col
                            ${isMobile
                                ? (isSidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full')
                                : (isSidebarOpen ? 'w-64' : 'w-20')
                            }`}
                    >
                        {/* Scrollable Content Container */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                            {/* Logo & Toggle */}
                            <div className="p-6 border-b border-white/10 flex items-center justify-center">
                                {isSidebarOpen ? (
                                    <img
                                        src="/images/logos/horizontal.png"
                                        alt="TeraVolta"
                                        className="w-40 h-auto object-contain"
                                        style={{ filter: 'brightness(0) invert(1)' }}
                                    />
                                ) : (
                                    <img
                                        src="/images/logos/icon.png"
                                        alt="TeraVolta"
                                        className="w-12 h-12 object-contain"
                                        style={{ filter: 'brightness(0) invert(1)' }}
                                    />
                                )}
                            </div>

                            {/* Welcome Message */}
                            {isSidebarOpen && (
                                <div className="p-6 border-b border-white/10">
                                    <div className="text-sm opacity-80">{t.welcome},</div>
                                    <div className="font-bold text-lg mt-1">{userName}</div>
                                    <div className="mt-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${userRole === 'super_admin' ? 'bg-[#c3d021] text-[#194271]' : 'bg-white/20'
                                            }`}>
                                            {userRole === 'super_admin' ? t.superAdmin : t.admin}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Operations Navigation */}
                            <div className="px-6 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
                                {language === 'es' ? 'Operaciones' : 'Operations'}
                            </div>
                            <nav className="flex-1 overflow-y-auto mb-6">
                                {operationsItems.map((item) => {
                                    // Special handling for Technicians Dropdown
                                    if (item.href === '#technicians') {
                                        const isTechActive = pathname?.startsWith('/portal/admin/technicians');
                                        return (
                                            <div key="technicians-dropdown">
                                                <button
                                                    onClick={() => setTechniciansDropdownOpen(!techniciansDropdownOpen)}
                                                    className={`flex items-center w-full px-6 py-2.5 transition-colors ${isTechActive
                                                        ? 'bg-white/10 border-l-4 border-[#c3d021] text-white'
                                                        : 'text-white/70 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
                                                        }`}
                                                >
                                                    <i className={`${item.icon} text-lg ${!isSidebarOpen && 'mx-auto'}`}></i>
                                                    {isSidebarOpen && (
                                                        <>
                                                            <span className="ml-3 flex-1 text-left">{item.name}</span>
                                                            <i className={`ri-arrow-${techniciansDropdownOpen ? 'up' : 'down'}-s-line text-lg`}></i>
                                                        </>
                                                    )}
                                                </button>
                                                {techniciansDropdownOpen && isSidebarOpen && (
                                                    <div className="bg-white/5">
                                                        {technicianSubItems.map((subItem) => {
                                                            const isSubActive = pathname === subItem.href;
                                                            return (
                                                                <Link
                                                                    key={subItem.href}
                                                                    href={subItem.href}
                                                                    className={`flex items-center pl-12 pr-6 py-2 transition-colors ${isSubActive
                                                                        ? 'bg-white/10 text-white'
                                                                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                                                                        }`}
                                                                >
                                                                    <i className={`${subItem.icon} text-lg`}></i>
                                                                    <span className="ml-3 text-sm whitespace-nowrap">{subItem.name}</span>
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }

                                    const isActive = pathname === item.href || (item.href !== '/portal/admin' && pathname?.startsWith(item.href));
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center px-6 py-2.5 transition-colors ${isActive
                                                ? 'bg-white/10 border-l-4 border-[#c3d021] text-white'
                                                : 'text-white/70 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
                                                }`}
                                        >
                                            <div className="flex items-center w-full">
                                                <i className={`${item.icon} text-lg ${!isSidebarOpen && 'mx-auto'}`}></i>
                                                {isSidebarOpen && <span className="ml-3 flex-1">{item.name}</span>}
                                                {isSidebarOpen && (item as any).badge && (
                                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-auto">
                                                        {(item as any).badge}
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Management Navigation */}
                            <div className="px-6 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider border-t border-white/10 mt-2 pt-4">
                                {language === 'es' ? 'Gestión' : 'Management'}
                            </div>
                            <nav className="flex-1 overflow-y-auto">
                                {managementItems.map((item) => {
                                    // Special handling for Users Dropdown
                                    if (item.href === '/portal/admin/users') {
                                        return (
                                            <div key="users-dropdown">
                                                <button
                                                    onClick={() => setUsersDropdownOpen(!usersDropdownOpen)}
                                                    className={`flex items-center w-full px-6 py-2.5 transition-colors ${isUsersActive
                                                        ? 'bg-white/10 border-l-4 border-[#c3d021] text-white'
                                                        : 'text-white/70 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
                                                        }`}
                                                >
                                                    <i className={`ri-group-line text-lg ${!isSidebarOpen && 'mx-auto'}`}></i>
                                                    {isSidebarOpen && (
                                                        <>
                                                            <span className="ml-3 flex-1 text-left">{t.users}</span>
                                                            <i className={`ri-arrow-${usersDropdownOpen ? 'up' : 'down'}-s-line text-lg`}></i>
                                                        </>
                                                    )}
                                                </button>
                                                {usersDropdownOpen && isSidebarOpen && (
                                                    <div className="bg-white/5">
                                                        {usersSubItems.map((subItem) => {
                                                            const isSubActive = pathname === subItem.href;
                                                            return (
                                                                <Link
                                                                    key={subItem.href}
                                                                    href={subItem.href}
                                                                    className={`flex items-center pl-12 pr-6 py-2 transition-colors ${isSubActive
                                                                        ? 'bg-white/10 text-white'
                                                                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                                                                        }`}
                                                                >
                                                                    <i className={`${subItem.icon} text-lg`}></i>
                                                                    <span className="ml-3 text-sm whitespace-nowrap">{subItem.name}</span>
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }

                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center px-6 py-2.5 transition-colors ${isActive
                                                ? 'bg-white/10 border-l-4 border-[#c3d021] text-white'
                                                : 'text-white/70 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
                                                }`}
                                        >
                                            <div className="flex items-center w-full">
                                                <i className={`${item.icon} text-lg ${!isSidebarOpen && 'mx-auto'}`}></i>
                                                {isSidebarOpen && <span className="ml-3 flex-1">{item.name}</span>}
                                                {isSidebarOpen && (item as any).badge && (
                                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-auto">
                                                        {(item as any).badge}
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </nav>


                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className={`transition-all duration-300 ${isMobile ? 'ml-0' : (isSidebarOpen ? 'ml-64' : 'ml-20')
                        }`}>
                        {/* Top Bar */}
                        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                            <div className="px-6 py-4 flex items-center justify-between">
                                <button
                                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    aria-label={t.toggleSidebar}
                                >
                                    <i className="ri-menu-line text-xl text-[#004A90]"></i>
                                </button>

                                <div className="flex items-center space-x-4">
                                    {/* Back to Website */}
                                    <a
                                        href="/"
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-[#004a90] hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <i className="ri-home-line"></i>
                                        <span className="hidden md:inline">{t.website}</span>
                                    </a>

                                    {/* Notification Center - ADDED HERE */}
                                    <NotificationCenter />

                                    {/* Language Selector */}
                                    <div className="flex items-center space-x-2 text-sm">
                                        <span
                                            onClick={() => setLanguage('en')}
                                            className={`cursor-pointer transition-colors ${language === 'en' ? 'font-bold text-[#c3d021]' : 'text-[#004a90] hover:text-[#c3d021]'}`}
                                        >
                                            EN
                                        </span>
                                        <span className="text-gray-300">|</span>
                                        <span
                                            onClick={() => setLanguage('es')}
                                            className={`cursor-pointer transition-colors ${language === 'es' ? 'font-bold text-[#c3d021]' : 'text-[#004a90] hover:text-[#c3d021]'}`}
                                        >
                                            ES
                                        </span>
                                    </div>

                                    {/* User Avatar */}
                                    {/* User Profile Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                            className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-1 transition-colors"
                                        >
                                            <div className="w-10 h-10 bg-[#004A90] rounded-full flex items-center justify-center text-white font-bold">
                                                {userName.charAt(0).toUpperCase()}
                                            </div>
                                            <i className={`ri-arrow-${profileDropdownOpen ? 'up' : 'down'}-s-line text-gray-500`}></i>
                                        </button>

                                        {profileDropdownOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setProfileDropdownOpen(false)}
                                                />
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                                                    <div className="px-4 py-3 border-b border-gray-100">
                                                        <p className="text-sm font-semibold text-[#004a90] truncate">{userName}</p>
                                                        <p className="text-xs text-gray-500 truncate capitalize">{userRole.replace('_', ' ')}</p>
                                                    </div>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                                    >
                                                        <i className="ri-logout-box-line"></i>
                                                        {t.logout}
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Page Content */}
                        <main className="p-6">
                            {children}
                        </main>
                    </div>
                </div>
            </NotificationProvider>
        </RoleGuard>
    );
}
