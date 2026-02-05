
'use client';

import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../components/LanguageProvider';
import { useAuth } from '../../components/AuthProvider';

export default function ProjectsPage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [forceRender, setForceRender] = useState(0);

  // Forzar re-render más agresivo cuando cambia el idioma
  useEffect(() => {
    setForceRender(prev => prev + 1);
    // Forzar una actualización adicional después de un pequeño delay
    const timer = setTimeout(() => {
      setForceRender(prev => prev + 1);
    }, 100);
    return () => clearTimeout(timer);
  }, [language]);

  const projects = [
    {
      id: 1,
      client: t('projects.project1.client'),
      category: t('projects.efficiency'),
      problem: t('projects.project1.problem'),
      solution: t('projects.project1.solution'),
      result: t('projects.project1.result'),
      image: "/images/brand/project_1.png",
      tags: [t('projects.project1.tag1'), t('projects.project1.tag2'), t('projects.project1.tag3')]
    },
    {
      id: 2,
      client: t('projects.project2.client'),
      category: t('projects.efficiency'),
      problem: t('projects.project2.problem'),
      solution: t('projects.project2.solution'),
      result: t('projects.project2.result'),
      image: "/images/brand/project_2.png",
      tags: [t('projects.project2.tag1'), t('projects.project2.tag2'), t('projects.project2.tag3')]
    },
    {
      id: 3,
      client: t('projects.project3.client'),
      category: t('projects.consulting'),
      problem: t('projects.project3.problem'),
      solution: t('projects.project3.solution'),
      result: t('projects.project3.result'),
      image: "/images/brand/project_3.png",
      tags: [t('projects.project3.tag1'), t('projects.project3.tag2'), t('projects.project3.tag3')]
    },
    {
      id: 4,
      client: t('projects.project4.client'),
      category: t('projects.advocacy'),
      problem: t('projects.project4.problem'),
      solution: t('projects.project4.solution'),
      result: t('projects.project4.result'),
      image: "/images/brand/project_4.png",
      tags: [t('projects.project4.tag1'), t('projects.project4.tag2'), t('projects.project4.tag3')]
    },
    {
      id: 5,
      client: t('projects.project5.client'),
      category: t('projects.consulting'),
      problem: t('projects.project5.problem'),
      solution: t('projects.project5.solution'),
      result: t('projects.project5.result'),
      image: "/images/brand/project_5.png",
      tags: [t('projects.project5.tag1'), t('projects.project5.tag2'), t('projects.project5.tag3')]
    },
    {
      id: 6,
      client: t('projects.project6.client'),
      category: t('projects.efficiency'),
      problem: t('projects.project6.problem'),
      solution: t('projects.project6.solution'),
      result: t('projects.project6.result'),
      image: "/images/brand/project_6.png",
      tags: [t('projects.project6.tag1'), t('projects.project6.tag2'), t('projects.project6.tag3')]
    },
    {
      id: 7,
      client: t('projects.project7.client'),
      category: t('projects.consulting'),
      problem: t('projects.project7.problem'),
      solution: t('projects.project7.solution'),
      result: t('projects.project7.result'),
      image: "/images/brand/project_7.png",
      tags: [t('projects.project7.tag1'), t('projects.project7.tag2'), t('projects.project7.tag3')]
    }
  ];

  return (
    <div className="min-h-screen" key={`projects-${language}-${forceRender}`}>
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-[#004a90] text-white relative overflow-hidden" key={`hero-${language}`}>
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

        <div className="max-w-7xl 3xl:max-w-8xl mx-auto px-6 text-center relative z-10 w-full">
          <h1 className="text-fluid-h1 font-bold mb-6">{t('projects.title')}</h1>
          <p className="text-xl md:text-2xl 3xl:text-3xl max-w-3xl 3xl:max-w-4xl mx-auto">
            {t('projects.subtitle')}
          </p>
        </div>
      </section>

      {/* Projects Horizontal Scroll */}
      <section className="py-fluid-section bg-white" key={`projects-section-${language}`}>
        <div className="max-w-full mx-auto">
          <div className="px-6 mb-8"></div>

          <div className="relative">
            {/* Horizontal scrolling container for all screen sizes */}
            <div
              className="flex overflow-x-auto gap-6 px-6 pb-4"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                scrollBehavior: 'smooth'
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {projects.map((project) => (
                <div
                  key={`project-${project.id}-${language}-${forceRender}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex-shrink-0"
                  style={{ minWidth: '320px', width: '320px' }}
                >
                  <div className="relative h-48">
                    <img
                      src={project.image}
                      alt={project.client}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#004a90] text-white px-3 py-1 rounded-full text-sm font-medium">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-fluid-card">
                    <h3 className="text-fluid-h3 font-bold text-[#004a90] mb-4">{project.client}</h3>

                    <div className="space-y-4 mb-6">
                      <div key={`problem-${project.id}-${language}`}>
                        <h4 className="font-semibold text-[#004a90] mb-2 flex items-center text-sm">
                          <i className="ri-error-warning-line text-red-500 mr-2"></i>
                          {t('projects.problem')}
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{project.problem}</p>
                      </div>

                      <div key={`solution-${project.id}-${language}`}>
                        <h4 className="font-semibold text-[#004a90] mb-2 flex items-center text-sm">
                          <i className="ri-lightbulb-line text-[#c3d021] mr-2"></i>
                          {t('projects.solution')}
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{project.solution}</p>
                      </div>

                      <div key={`result-${project.id}-${language}`}>
                        <h4 className="font-semibold text-[#004a90] mb-2 flex items-center text-sm">
                          <i className="ri-trophy-line text-[#004a90] mr-2"></i>
                          {t('projects.result')}
                        </h4>
                        <p className="text-gray-600 text-sm font-medium leading-relaxed">{project.result}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, index) => (
                        <span
                          key={`tag-${project.id}-${index}-${language}-${forceRender}`}
                          className="bg-[#004a90]/10 text-[#004a90] px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-2 text-gray-500 text-sm bg-gray-100 px-4 py-2 rounded-full">
                <i className="ri-arrow-left-right-line text-lg"></i>
                <span className="font-medium">{t('projects.scrollIndicator')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Summary */}
      <section className="py-fluid-section bg-[#ffffff]" key={`results-${language}`}>
        <div className="max-w-7xl 3xl:max-w-9xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-fluid-h2 font-bold text-[#004a90] mb-6">{t('projects.impactTitle')}</h2>
            <p className="text-fluid-body text-gray-600 max-w-3xl 3xl:max-w-4xl mx-auto">
              {t('projects.impactSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 flex items-center justify-center bg-[#004a90] rounded-full mx-auto mb-4">
                <i className="ri-coins-line text-white text-2xl"></i>
              </div>
              <div className="text-3xl font-bold text-[#004a90] mb-2">$5.2M</div>
              <p className="text-gray-600">{t('projects.totalSavings')}</p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 flex items-center justify-center bg-[#c3d021] rounded-full mx-auto mb-4">
                <i className="ri-arrow-down-line text-[#004a90] text-2xl"></i>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">23%</div>
              <p className="text-gray-600">{t('projects.avgReduction')}</p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 flex items-center justify-center bg-[#004a90] rounded-full mx-auto mb-4">
                <i className="ri-leaf-line text-white text-2xl"></i>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">2,800</div>
              <p className="text-gray-600">{t('projects.co2Reduction')}</p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 flex items-center justify-center bg-[#c3d021] rounded-full mx-auto mb-4">
                <i className="ri-customer-service-line text-[#004a90] text-2xl"></i>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">98%</div>
              <p className="text-gray-600">{t('projects.satisfaction')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Sectors */}
      <section className="py-fluid-section bg-white" key={`industries-${language}`}>
        <div className="max-w-7xl 3xl:max-w-8xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-fluid-h2 font-bold text-[#004a90] mb-6">{t('projects.industriesTitle')}</h2>
            <p className="text-fluid-body text-gray-600 max-w-3xl 3xl:max-w-4xl mx-auto">
              {t('projects.industriesSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-[#004a90] rounded-full mx-auto mb-3">
                <i className="ri-building-line text-white text-2xl"></i>
              </div>
              <h4 className="font-semibold text-[#004a90] text-sm">{t('projects.manufacturing')}</h4>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-[#c3d021] rounded-full mx-auto mb-3">
                <i className="ri-hotel-line text-[#004a90] text-2xl"></i>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">{t('projects.hospitality')}</h4>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-[#004a90] rounded-full mx-auto mb-3">
                <i className="ri-hospital-line text-white text-2xl"></i>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">{t('projects.healthcare')}</h4>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-[#c3d021] rounded-full mx-auto mb-3">
                <i className="ri-bank-line text-[#004a90] text-2xl"></i>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">{t('projects.banking')}</h4>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-[#004a90] rounded-full mx-auto mb-3">
                <i className="ri-truck-line text-white text-2xl"></i>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">{t('projects.logistics')}</h4>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-[#c3d021] rounded-full mx-auto mb-3">
                <i className="ri-store-line text-[#004a90] text-2xl"></i>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">{t('projects.retail')}</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-fluid-section bg-[#ffffff]" key={`testimonials-${language}`}>
        <div className="max-w-7xl 3xl:max-w-9xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-fluid-h2 font-bold text-[#004a90] mb-6">{t('projects.testimonialsTitle')}</h2>
            <p className="text-fluid-body text-gray-600 max-w-3xl 3xl:max-w-4xl mx-auto">
              {t('projects.testimonialsSubtitle')}
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100" key={`testimonial-1-${language}`}>
              <div className="flex items-center mb-4">
                <div className="flex text-[#c3d021]">
                  <i className="ri-star-line"></i>
                  <i className="ri-star-line"></i>
                  <i className="ri-star-line"></i>
                  <i className="ri-star-line"></i>
                  <i className="ri-star-line"></i>
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                "{t('projects.testimonial1.text')}"
              </p>
              <div>
                <div className="font-semibold text-[#004a90]">{t('projects.testimonial1.name')}</div>
                <div className="text-sm text-gray-500">{t('projects.testimonial1.position')}</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100" key={`testimonial-2-${language}`}>
              <div className="flex items-center mb-4">
                <div className="flex text-[#c3d021]">
                  <i className="ri-star-line"></i>
                  <i className="ri-star-line"></i>
                  <i className="ri-star-line"></i>
                  <i className="ri-star-line"></i>
                  <i className="ri-star-line"></i>
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                "{t('projects.testimonial2.text')}"
              </p>
              <div>
                <div className="font-semibold text-[#004a90]">{t('projects.testimonial2.name')}</div>
                <div className="text-sm text-gray-500">{t('projects.testimonial2.position')}</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100" key={`testimonial-3-${language}`}>
              <div className="flex items-center mb-4">
                <div className="flex text-[#c3d021]">
                  <i className="ri-star-line"></i>
                  <i className="ri-star-line"></i>
                  <i className="ri-star-line"></i>
                  <i className="ri-star-line"></i>
                  <i className="ri-star-line"></i>
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                "{t('projects.testimonial3.text')}"
              </p>
              <div>
                <div className="font-semibold text-[#004a90]">{t('projects.testimonial3.name')}</div>
                <div className="text-sm text-gray-500">{t('projects.testimonial3.position')}</div>
              </div>
            </div>
          </div>

          {/* Mobile Horizontal Scroll */}
          <div className="md:hidden">
            <div
              className="flex overflow-x-auto gap-6 pb-4"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                scrollBehavior: 'smooth'
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex-shrink-0" style={{ minWidth: '280px', width: '280px' }} key={`testimonial-mobile-1-${language}`}>
                <div className="flex items-center mb-4">
                  <div className="flex text-[#c3d021]">
                    <i className="ri-star-line"></i>
                    <i className="ri-star-line"></i>
                    <i className="ri-star-line"></i>
                    <i className="ri-star-line"></i>
                    <i className="ri-star-line"></i>
                  </div>
                </div>
                <p className="text-gray-600 mb-6 italic text-sm">
                  "{t('projects.testimonial1.text')}"
                </p>
                <div>
                  <div className="font-semibold text-[#004a90] text-sm">{t('projects.testimonial1.name')}</div>
                  <div className="text-xs text-gray-500">{t('projects.testimonial1.position')}</div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex-shrink-0" style={{ minWidth: '280px', width: '280px' }} key={`testimonial-mobile-2-${language}`}>
                <div className="flex items-center mb-4">
                  <div className="flex text-[#c3d021]">
                    <i className="ri-star-line"></i>
                    <i className="ri-star-line"></i>
                    <i className="ri-star-line"></i>
                    <i className="ri-star-line"></i>
                    <i className="ri-star-line"></i>
                  </div>
                </div>
                <p className="text-gray-600 mb-6 italic text-sm">
                  "{t('projects.testimonial2.text')}"
                </p>
                <div>
                  <div className="font-semibold text-[#004a90] text-sm">{t('projects.testimonial2.name')}</div>
                  <div className="text-xs text-gray-500">{t('projects.testimonial2.position')}</div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex-shrink-0" style={{ minWidth: '280px', width: '280px' }} key={`testimonial-mobile-3-${language}`}>
                <div className="flex items-center mb-4">
                  <div className="flex text-[#c3d021]">
                    <i className="ri-star-line"></i>
                    <i className="ri-star-line"></i>
                    <i className="ri-star-line"></i>
                    <i className="ri-star-line"></i>
                    <i className="ri-star-line"></i>
                  </div>
                </div>
                <p className="text-gray-600 mb-6 italic text-sm">
                  "{t('projects.testimonial3.text')}"
                </p>
                <div>
                  <div className="font-semibold text-[#004a90] text-sm">{t('projects.testimonial3.name')}</div>
                  <div className="text-xs text-gray-500">{t('projects.testimonial3.position')}</div>
                </div>
              </div>
            </div>

            {/* Mobile Scroll Indicator */}
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm bg-gray-100 px-4 py-2 rounded-full">
                <i className="ri-arrow-left-right-line text-lg"></i>
                <span className="font-medium">{t('projects.scrollIndicator')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-fluid-section bg-white text-gray-900" key={`cta-${language}`}>
        <div className="max-w-7xl 3xl:max-w-8xl mx-auto px-6 text-center">
          <h2 className="text-fluid-h2 font-bold mb-6 text-[#004a90]">{t('projects.ctaTitle')}</h2>
          <p className="text-fluid-body mb-8 max-w-2xl 3xl:max-w-3xl mx-auto text-gray-600">
            {t('projects.ctaSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact" size="lg" className="bg-[#c3d021] hover:bg-teravolta-lime-dark text-white whitespace-nowrap">
              {language === 'en' ? 'Contact Us' : 'Contáctanos'}
            </Button>
            <Button href="/services" variant="outline" size="lg" className="border-[#004a90] text-[#004a90] hover:bg-[#004a90] hover:text-white whitespace-nowrap">
              {t('projects.seeServices')}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
