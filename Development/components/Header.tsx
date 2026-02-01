'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from './LanguageProvider';
import { useAuth } from './AuthProvider';
import { supabase } from '@/lib/supabase';
import NotificationBell from './NotificationBell';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const { language, setLanguage, t } = useLanguage();
  const { user, logout, loading: authLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setUserRole(null);
        setRoleLoading(false);
        return;
      }

      setRoleLoading(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (data && !error) {
          setUserRole(data.role || 'customer');
        } else {
          setUserRole('customer');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('customer');
      } finally {
        setRoleLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  // Click outside handler for dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAdminDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (lang: 'en' | 'es') => {
    if (!isMountedRef.current) return;
    setLanguage(lang);
  };

  // STATIC VERSION - No development features
  const navItems = [
    { name: t('header.home'), href: '/' },
    { name: t('header.services'), href: '/services' },
    { name: t('header.projects'), href: '/projects' },
    { name: t('header.about'), href: '/about' },
    { name: t('header.contact'), href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-12">
          <Link href="/" className="flex items-center cursor-pointer">
            <img
              src="/images/logos/horizontal.png"
              alt="TeraVolta Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center space-x-6">
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-[#004a90] hover:text-[#c3d021] transition-colors font-medium whitespace-nowrap cursor-pointer"
                >
                  {item.name}
                </Link>
              ))}
              {/* Admin Dropdown Menu - Always visible for admins */}
              {/* Dynamic Auth Button */}
              {!user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/quote"
                    className="flex items-center gap-2 px-4 py-2 border-2 border-[#004a90] text-[#004a90] hover:bg-[#004a90] hover:text-white rounded-full transition-colors font-medium whitespace-nowrap cursor-pointer"
                  >
                    <span>{t('header.getQuote')}</span>
                  </Link>
                  <Link
                    href="/portal/login"
                    className="p-2 text-[#004a90] hover:text-[#c3d021] transition-colors"
                    title="Sign In"
                  >
                    <i className="ri-user-line text-xl"></i>
                  </Link>
                </div>
              ) : userRole === 'customer' ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/quote"
                    className="flex items-center gap-2 px-4 py-2 border-2 border-[#004a90] text-[#004a90] hover:bg-[#004a90] hover:text-white rounded-full transition-colors font-medium whitespace-nowrap cursor-pointer"
                  >
                    <span>{t('header.getQuote')}</span>
                  </Link>

                  {/* Customer Dropdown Trigger */}
                  <NotificationBell />
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                      className="flex items-center gap-2 px-6 py-2 bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#004a90] rounded-full transition-colors font-medium whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-user-line"></i>
                      <span>{t('header.account')}</span>
                      <i className={`ri-arrow-down-s-line transition-transform ${isAdminDropdownOpen ? 'rotate-180' : ''}`}></i>
                    </button>

                    {/* Dropdown Menu */}
                    {isAdminDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {pathname !== '/portal/customer' && (
                          <Link
                            href="/portal/customer"
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-[#004a90] transition-colors"
                            onClick={() => setIsAdminDropdownOpen(false)}
                          >
                            <i className="ri-dashboard-line"></i>
                            <span>{t('header.dashboard')}</span>
                          </Link>
                        )}

                        {pathname !== '/portal/customer/settings' && (
                          <Link
                            href="/portal/customer/settings"
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-[#004a90] transition-colors"
                            onClick={() => setIsAdminDropdownOpen(false)}
                          >
                            <i className="ri-settings-4-line"></i>
                            <span>{t('header.settings')}</span>
                          </Link>
                        )}

                        <div className="my-2 border-t border-gray-100"></div>

                        <button
                          onClick={async () => {
                            await logout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                          <i className="ri-logout-box-r-line"></i>
                          <span>{t('header.logout') || 'Logout'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (userRole === 'admin' || userRole === 'super_admin') ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/quote"
                    className="flex items-center gap-2 px-4 py-2 border-2 border-[#004a90] text-[#004a90] hover:bg-[#004a90] hover:text-white rounded-full transition-colors font-medium whitespace-nowrap cursor-pointer"
                  >
                    <span>{t('header.getQuote')}</span>
                  </Link>

                  {/* Admin Dropdown Trigger */}
                  <NotificationBell />
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                      className="flex items-center gap-2 px-6 py-2 bg-[#c3d021] hover:bg-[#a5b01c] text-[#194271] rounded-full transition-colors font-medium whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-dashboard-line"></i>
                      <span>Admin</span>
                      <i className={`ri-arrow-down-s-line transition-transform ${isAdminDropdownOpen ? 'rotate-180' : ''}`}></i>
                    </button>

                    {/* Dropdown Menu */}
                    {isAdminDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-4 py-2 border-b border-gray-100 mb-2">
                          <p className="text-sm font-bold text-[#004a90]">{t('header.adminControls')}</p>
                        </div>

                        {pathname !== '/portal/admin' && (
                          <Link
                            href="/portal/admin"
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-[#004a90] transition-colors"
                            onClick={() => setIsAdminDropdownOpen(false)}
                          >
                            <i className="ri-dashboard-line"></i>
                            <span>{t('header.dashboard')}</span>
                          </Link>
                        )}

                        {pathname !== '/portal/customer' && (
                          <Link
                            href="/portal/customer"
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-[#004a90] transition-colors"
                            title={t('header.clientView')}
                            onClick={() => setIsAdminDropdownOpen(false)}
                          >
                            <i className="ri-user-settings-line"></i>
                            <span>{t('header.clientView')}</span>
                          </Link>
                        )}

                        <div className="my-2 border-t border-gray-100"></div>

                        <button
                          onClick={async () => {
                            await logout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                          <i className="ri-logout-box-r-line"></i>
                          <span>{t('header.logout') || 'Logout'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (userRole === 'technician') ? (
                <div className="flex items-center gap-4">
                  {/* Technician Dropdown Trigger */}
                  <NotificationBell />
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                      className="flex items-center gap-2 px-6 py-2 bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#004a90] rounded-full transition-colors font-medium whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-tools-line"></i>
                      <span>Technician</span>
                      <i className={`ri-arrow-down-s-line transition-transform ${isAdminDropdownOpen ? 'rotate-180' : ''}`}></i>
                    </button>

                    {/* Dropdown Menu */}
                    {isAdminDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {pathname !== '/portal/technician' && (
                          <Link
                            href="/portal/technician"
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-[#004a90] transition-colors"
                            onClick={() => setIsAdminDropdownOpen(false)}
                          >
                            <i className="ri-dashboard-line"></i>
                            <span>{t('header.dashboard')}</span>
                          </Link>
                        )}

                        <div className="my-2 border-t border-gray-100"></div>

                        <button
                          onClick={async () => {
                            await logout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                          <i className="ri-logout-box-r-line"></i>
                          <span>{t('header.logout') || 'Logout'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (authLoading || roleLoading || !user) ? (
                // Loading state or effectively logged out but waiting for state update - show nothing or skeleton
                <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full"></div>
              ) : (
                // Fallback for unknown roles - Clean generic style
                <div className="flex items-center gap-4">
                  <button
                    onClick={async () => {
                      await logout();
                      // Router push handled by logout() in AuthProvider
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[#004a90] font-medium whitespace-nowrap transition-colors"
                  >
                    <i className="ri-logout-box-r-line"></i>
                    <span>{t('header.logout') || 'Logout'}</span>
                  </button>
                </div>
              )}
              {/* STATIC VERSION - No Get Quote button (use /portal/login for development) */}
            </nav>

            {/* Language Selector */}
            <div className="flex items-center space-x-2 text-sm">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`text-[#004a90] hover:text-[#c3d021] cursor-pointer transition-colors ${language === 'en' ? 'font-bold text-[#c3d021]' : ''
                  }`}
              >
                EN
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => handleLanguageChange('es')}
                className={`text-[#004a90] hover:text-[#c3d021] cursor-pointer transition-colors ${language === 'es' ? 'font-bold text-[#c3d021]' : ''
                  }`}
              >
                ES
              </button>
            </div>

            <button
              className="lg:hidden p-2 cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-xl text-[#004a90]`}></i>
              </div>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4 mt-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-[#004a90] hover:text-[#c3d021] transition-colors font-medium cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {/* Dashboard options for admin in mobile */}
              {/* Mobile Dynamic Auth Button */}
              {!user ? (
                <>
                  <Link
                    href="/quote"
                    className="flex items-center justify-center gap-2 px-4 py-3 mt-4 border-2 border-[#004a90] text-[#004a90] bg-[#004a90]/10 rounded-lg font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="ri-calculator-line"></i>
                    <span>{t('header.getQuote')}</span>
                  </Link>
                  <Link
                    href="/portal/login"
                    className="flex items-center justify-center gap-2 px-4 py-3 mt-2 bg-[#004a90] text-white rounded-lg font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="ri-user-line"></i>
                    <span>Sign In</span>
                  </Link>
                </>
              ) : userRole === 'customer' ? (
                <Link
                  href="/portal/customer"
                  className="flex items-center justify-center gap-2 px-4 py-3 mt-4 bg-[#c3d021] text-[#194271] rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="ri-user-settings-line"></i>
                  <span>Account</span>
                </Link>
              ) : (userRole === 'admin' || userRole === 'super_admin') ? (
                <>
                  <Link
                    href="/portal/admin"
                    className="flex items-center justify-center gap-2 px-4 py-3 mt-4 bg-[#c3d021] text-[#194271] rounded-lg font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="ri-dashboard-line"></i>
                    <span>Admin Dashboard</span>
                  </Link>
                  <Link
                    href="/portal/customer"
                    className="flex items-center justify-center gap-2 px-4 py-3 mt-2 border-2 border-[#c3d021] text-[#194271] bg-[#c3d021]/10 rounded-lg font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="ri-user-settings-line"></i>
                    <span>Client View</span>
                  </Link>
                </>
              ) : null}
              {/* Mobile Get Quote & Logout Buttons (Visible if user is logged in) */}
              {user && (
                <>
                  <Link
                    href="/quote"
                    className="flex items-center justify-center gap-2 px-4 py-3 mt-2 border-2 border-[#c3d021] text-[#194271] bg-[#c3d021]/10 rounded-lg font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="ri-calculator-line"></i>
                    <span>Get Quote</span>
                  </Link>
                  <button
                    onClick={async () => {
                      await logout();
                      setIsMenuOpen(false);
                      // Router push handled by logout() in AuthProvider
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 mt-2 bg-gray-100 text-[#004a90] hover:bg-gray-200 rounded-lg font-medium w-full"
                  >
                    <i className="ri-logout-box-r-line"></i>
                    <span>{t('header.logout') || 'Logout'}</span>
                  </button>
                </>
              )}
              {/* STATIC VERSION - No Get Quote button in mobile either */}

              {/* Mobile Language Selector */}
              <div className="flex items-center justify-center space-x-2 text-sm pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`text-[#004a90] hover:text-[#c3d021] cursor-pointer transition-colors ${language === 'en' ? 'font-bold text-[#c3d021]' : ''
                    }`}
                >
                  EN
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => handleLanguageChange('es')}
                  className={`text-[#004a90] hover:text-[#c3d021] cursor-pointer transition-colors ${language === 'es' ? 'font-bold text-[#c3d021]' : ''
                    }`}
                >
                  ES
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
