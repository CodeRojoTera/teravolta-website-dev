
'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import { useLanguage } from '../components/LanguageProvider';
import { useAuth } from '../components/AuthProvider';

export default function Home() {
  const { t, isHydrated } = useLanguage();
  const { user } = useAuth();

  // Show loading state until hydration is complete to prevent hydration mismatch
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004a90]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - KEY: Preserving the image as requested */}
      <section
        className="relative h-screen flex items-center justify-center text-white overflow-hidden"
        style={{
          backgroundImage: `url('/images/brand/hero_main_updated.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.05) 100%)'
          }}
        />

        <div className="max-w-7xl 3xl:max-w-8xl mx-auto px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 3xl:gap-20 items-center">
            <div>
              <h1 className="text-fluid-h1 font-bold mb-6 text-white leading-tight">
                {t('hero.title')}
              </h1>
              <p className="text-xl md:text-2xl 3xl:text-3xl mb-8 text-gray-100 leading-relaxed max-w-lg 3xl:max-w-2xl">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* STATIC VERSION - Only Contact button */}
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center font-medium rounded-full transition-colors whitespace-nowrap cursor-pointer px-8 py-4 text-lg bg-[#c3d021] hover:bg-teravolta-lime-dark text-[#194271]"
                >
                  {t('header.contact') || 'Cont act Us'}
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center font-medium rounded-full transition-colors whitespace-nowrap cursor-pointer px-8 py-4 text-lg bg-transparent text-white border-2 border-white hover:bg-white hover:text-[#004a90]"
                >
                  {t('hero.cta.secondary')}
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              {/* Optional: Add a subtle glass element or keeps empty for the view */}
            </div>
          </div>
        </div>
      </section>

      {/* NEW: The Challenge Section */}
      <section className="py-fluid-section bg-white">
        <div className="max-w-7xl 3xl:max-w-8xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 3xl:mb-20">
            <h2 className="text-fluid-h2 font-bold text-[#004a90] mb-6 max-w-4xl mx-auto leading-tight">
              {t('home.challengeTitle')}
            </h2>
            <p className="text-fluid-body text-gray-600 max-w-3xl 3xl:max-w-4xl mx-auto">
              {t('home.challengeSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 3xl:gap-16">
            {/* Icon 1 - Navy (SOLID) */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#194271] rounded-full flex items-center justify-center mb-6 shadow-lg">
                <i className="ri-coins-line text-4xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold text-[#004a90] mb-2">{t('home.challengeItem1')}</h3>
            </div>
            {/* Icon 2 - Lime (SOLID) */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#c3d021] rounded-full flex items-center justify-center mb-6 shadow-lg">
                <i className="ri-information-line text-4xl" style={{ color: '#194271' }}></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('home.challengeItem2')}</h3>
            </div>
            {/* Icon 3 - Navy (SOLID) */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#194271] rounded-full flex items-center justify-center mb-6 shadow-lg">
                <i className="ri-eye-off-line text-4xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('home.challengeItem3')}</h3>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Outcome-Based Solutions (Creative Split Layout) */}
      <section className="py-fluid-section bg-white overflow-hidden">
        <div className="max-w-7xl 3xl:max-w-9xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16 3xl:gap-24">

            {/* Image Side - Creative Visual */}
            <div className="w-full lg:w-1/2 relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/images/brand/hero_smart_energy.png"
                alt="Energy Solutions"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#004a90]/80 to-transparent flex items-end p-8">
                <p className="text-white text-lg font-medium italic border-l-4 border-[#c3d021] pl-4">
                  "{t('hero.subtitle')}"
                </p>
              </div>
            </div>

            {/* Content Side */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-fluid-h2 font-bold text-[#004a90] mb-8 leading-tight">
                {t('home.solutionsTitle')}
              </h2>

              <div className="space-y-10 3xl:space-y-14">
                {/* Consulting - Navy Circle with White Icon */}
                <Link href="/services/consulting" className="flex items-start gap-6 group cursor-pointer">
                  <div className="flex-shrink-0 w-16 h-16 bg-[#194271] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <i className="ri-shake-hands-line text-3xl text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#004a90] mb-2 group-hover:text-[#194271] transition-colors">{t('home.solution1Title')}</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">{t('home.solution1Desc')}</p>
                  </div>
                </Link>

                {/* Efficiency - Lime Circle with Navy Icon */}
                <Link href="/services/efficiency" className="flex items-start gap-6 group cursor-pointer">
                  <div className="flex-shrink-0 w-16 h-16 bg-[#c3d021] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <i className="ri-flashlight-line text-3xl text-[#194271]"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-teravolta-lime-dark transition-colors">{t('home.solution2Title')}</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">{t('home.solution2Desc')}</p>
                  </div>
                </Link>

                {/* Advocacy - Navy Circle with White Icon */}
                <Link href="/services/advocacy" className="flex items-start gap-6 group cursor-pointer">
                  <div className="flex-shrink-0 w-16 h-16 bg-[#194271] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <i className="ri-scales-3-line text-3xl text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#194271] transition-colors">{t('home.solution3Title')}</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">{t('home.solution3Desc')}</p>
                  </div>
                </Link>
              </div>

              <div className="mt-12">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center font-bold text-lg text-[#004a90] hover:text-[#c3d021] transition-colors group"
                >
                  <span className="border-b-2 border-[#004a90] group-hover:border-[#c3d021] pb-1">
                    {t('hero.cta.secondary')}
                  </span>
                  <i className="ri-arrow-right-line ml-2 transform group-hover:translate-x-2 transition-transform"></i>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* NEW: Featured Case Study */}
      <section className="py-0 bg-[#004a90] overflow-hidden text-white relative">
        {/* Texture Overlay - Large Continuous Background */}
        <div
          className="absolute inset-0 opacity-[0.20] pointer-events-none"
          style={{
            backgroundImage: 'url(/images/brand/textura-alargada.svg)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            mixBlendMode: 'overlay'
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 relative z-10">
          <div className="p-12 md:p-24 3xl:p-32 flex flex-col justify-center">
            <div className="inline-block bg-[#c3d021] text-[#004a90] font-bold px-4 py-1 rounded-full text-sm mb-6 w-fit">
              {t('home.caseStudyStat')}
            </div>
            <h2 className="text-fluid-h2 font-bold mb-6 leading-tight">
              {t('home.featuredCaseStudyTitle')}
            </h2>
            <p className="text-xl 3xl:text-2xl text-blue-100 mb-8 max-w-lg 3xl:max-w-xl">
              {t('home.featuredCaseStudySubtitle')}
            </p>
            <div className="mb-10 text-sm uppercase tracking-wider text-blue-200 font-semibold">
              {t('home.caseStudyContext')}
            </div>
            <Link href="/projects" className="inline-flex items-center text-white font-bold text-lg hover:text-[#c3d021] transition-colors">
              {t('home.learnMore')} <i className="ri-arrow-right-line ml-2"></i>
            </Link>
          </div>
          <div className="relative h-[400px] lg:h-auto">
            <img
              src="/images/brand/case_study_solar.png"
              alt="Case Study"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#004a90]/20 mix-blend-multiply"></div>
          </div>
        </div>
      </section>

      {/* Why Choose Us (Refined) */}
      <section className="py-fluid-section bg-white">
        <div className="max-w-7xl 3xl:max-w-8xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-fluid-h2 font-bold text-[#004a90] mb-6">
              {t('home.whyUsTitle')}
            </h2>
            <p className="text-fluid-body text-gray-600 max-w-3xl 3xl:max-w-4xl mx-auto">
              {t('home.whyUsDescription1')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Icon 1 - Navy (SOLID) */}
            <div className="text-center p-6">
              <div className="w-16 h-16 flex items-center justify-center bg-[#194271] rounded-full mx-auto mb-6 shadow-lg">
                <i className="ri-database-2-line text-white text-2xl"></i>
              </div>
              <h4 className="font-bold text-lg text-[#004a90] mb-3">{t('home.dataAiTitle')}</h4>
              <p className="text-gray-600 text-sm">{t('home.dataAiDescription')}</p>
            </div>

            {/* Icon 2 - Lime (SOLID) */}
            <div className="text-center p-6">
              <div className="w-16 h-16 flex items-center justify-center bg-[#c3d021] rounded-full mx-auto mb-6 shadow-lg">
                <i className="ri-map-pin-line text-[#194271] text-2xl"></i>
              </div>
              <h4 className="font-bold text-lg text-[#004a90] mb-3">{t('home.panamaMarketTitle')}</h4>
              <p className="text-gray-600 text-sm">{t('home.panamaMarketDescription')}</p>
            </div>

            {/* Icon 3 - Navy (SOLID) */}
            <div className="text-center p-6">
              <div className="w-16 h-16 flex items-center justify-center bg-[#194271] rounded-full mx-auto mb-6 shadow-lg">
                <i className="ri-cpu-line text-white text-2xl"></i>
              </div>
              <h4 className="font-bold text-lg text-[#004a90] mb-3">{t('home.technologyTitle')}</h4>
              <p className="text-gray-600 text-sm">{t('home.technologyDescription')}</p>
            </div>

            {/* Icon 4 - Lime (SOLID) */}
            <div className="text-center p-6">
              <div className="w-16 h-16 flex items-center justify-center bg-[#c3d021] rounded-full mx-auto mb-6 shadow-lg">
                <i className="ri-customer-service-2-line text-[#194271] text-2xl"></i>
              </div>
              <h4 className="font-bold text-lg text-[#004a90] mb-3">{t('home.completeSupport')}</h4>
              <p className="text-gray-600 text-sm">{t('home.supportDescription')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-fluid-section bg-[#004a90] text-white relative overflow-hidden">
        {/* Texture Overlay - Large Continuous Background */}
        <div
          className="absolute inset-0 opacity-[0.20] pointer-events-none"
          style={{
            backgroundImage: 'url(/images/brand/textura-alargada.svg)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            mixBlendMode: 'overlay'
          }}
        />

        <div className="max-w-7xl 3xl:max-w-8xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-fluid-h2 font-bold mb-6">
            {t('home.ctaTitle')}
          </h2>
          <p className="text-xl 3xl:text-2xl mb-8 max-w-2xl 3xl:max-w-3xl mx-auto">
            {t('home.ctaDescription')}
          </p>
          {/* STATIC VERSION - Only Contact button */}
          <Link
            href="/contact"
            className="inline-flex items-center justify-center font-medium rounded-full transition-colors whitespace-nowrap cursor-pointer px-8 py-4 text-lg bg-[#c3d021] hover:bg-teravolta-lime-dark text-[#194271]"
          >
            {t('header.contact') || 'Contact Us'}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
