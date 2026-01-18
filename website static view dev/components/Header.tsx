'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from './LanguageProvider';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
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
              {/* STATIC VERSION - No Get Quote button (use /dev/login for development) */}
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
