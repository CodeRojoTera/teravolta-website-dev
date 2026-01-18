
'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="pt-8 pb-4 text-white bg-[#194271] border-t border-[#004a90]">
      <div className="max-w-7xl mx-auto px-10 py-12">
        <div className="flex flex-wrap lg:flex-nowrap justify-between gap-12">
          <div className="w-full lg:w-2/5">
            <img
              src="/images/logos/horizontal.png"
              alt="TeraVolta Logo"
              className="h-8 w-auto object-contain mb-6 brightness-0 invert"
            />
            <p className="text-white mb-4">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-[#c3d021] rounded-full flex items-center justify-center hover:bg-[#a5b01a] transition-colors cursor-pointer">
                <i className="ri-linkedin-line text-[#194271] text-lg"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-[#c3d021] rounded-full flex items-center justify-center hover:bg-[#a5b01a] transition-colors cursor-pointer">
                <i className="ri-twitter-line text-[#194271] text-lg"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-[#c3d021] rounded-full flex items-center justify-center hover:bg-[#a5b01a] transition-colors cursor-pointer">
                <i className="ri-facebook-line text-[#194271] text-lg"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-[#c3d021] rounded-full flex items-center justify-center hover:bg-[#a5b01a] transition-colors cursor-pointer">
                <i className="ri-instagram-line text-[#194271] text-lg"></i>
              </a>
            </div>
          </div>

          <div className="w-1/2 md:w-auto">
            <h4 className="font-semibold text-white mb-4">{t('footer.services')}</h4>
            <ul className="space-y-2">
              <li><Link href="/services/efficiency" className="text-gray-300 hover:text-[#c3d021] transition-colors cursor-pointer">{t('footer.efficiency')}</Link></li>
              <li><Link href="/services/consulting" className="text-gray-300 hover:text-[#c3d021] transition-colors cursor-pointer">{t('footer.consulting')}</Link></li>
              <li><Link href="/services/advocacy" className="text-gray-300 hover:text-[#c3d021] transition-colors cursor-pointer">{t('footer.advocacy')}</Link></li>
            </ul>
          </div>

          <div className="w-1/2 md:w-auto">
            <h4 className="font-semibold text-white mb-4">{t('footer.company')}</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-[#c3d021] transition-colors cursor-pointer">{t('footer.about')}</Link></li>
              <li><Link href="/projects" className="text-gray-300 hover:text-[#c3d021] transition-colors cursor-pointer">{t('footer.projects')}</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-[#c3d021] transition-colors cursor-pointer">{t('footer.contact')}</Link></li>
            </ul>
          </div>

          <div className="w-full md:w-auto text-left lg:text-right">
            <h4 className="font-semibold text-white mb-4">{t('footer.contactInfo')}</h4>
            <div className="space-y-2 text-gray-300 flex flex-col items-start lg:items-end">
              <p className="flex items-center">
                <i className="ri-mail-line mr-2 lg:order-2 lg:ml-2 lg:mr-0"></i>
                info@teravolta.com
              </p>
              <p className="flex items-center">
                <i className="ri-phone-line mr-2 lg:order-2 lg:ml-2 lg:mr-0"></i>
                +507 6000-0000
              </p>
              <p className="flex items-center">
                <i className="ri-map-pin-line mr-2 lg:order-2 lg:ml-2 lg:mr-0"></i>
                {t('footer.address')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#004a90] text-center text-gray-400 text-sm">
          <p className="mb-4">{t('footer.rights')}</p>
          <div className="flex justify-center space-x-6">
            <Link href="/terms" className="hover:text-[#c3d021] transition-colors">{t('footer.terms')}</Link>
            <Link href="/privacy" className="hover:text-[#c3d021] transition-colors">{t('footer.privacy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
