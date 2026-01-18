
'use client';

import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../components/LanguageProvider';
import { useAuth } from '../../components/AuthProvider';
import { supabase } from '@/lib/supabase';
import { PageLoadingSkeleton } from '../../components/ui/Skeleton';

interface DbProject {
  id: string;
  title: string;
  client: string;
  service: string;
  description: string;
  challenge?: string;
  solution?: string;
  result?: string;
  image_url?: string;
  images?: string[];
  featured: boolean;
  published: boolean;
}

interface UiProject {
  id: number | string;
  client: string;
  category: string;
  problem: string;
  solution: string;
  result: string;
  image: string;
  tags: string[];
}

export default function ProjectsPage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<UiProject[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_projects')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const mappedProjects: UiProject[] = data.map((p: DbProject) => ({
            id: p.id,
            client: p.client,
            category: p.service, // Map service to category
            problem: p.challenge || '',
            solution: p.solution || '',
            result: p.result || '',
            // Use image_url or first image from array, or fallback
            image: p.image_url || (p.images && p.images.length > 0 ? p.images[0] : '/images/placeholder-project.jpg'),
            tags: [p.service] // Use service as the main tag for now
          }));
          setProjects(mappedProjects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Optionally set fallback/static projects here if fetch fails, or just empty
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 pb-20 max-w-7xl mx-auto px-6">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-[#004a90] text-white relative overflow-hidden">
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
      <section className="py-fluid-section bg-white">
        <div className="max-w-full mx-auto">
          <div className="px-6 mb-8"></div>

          <div className="relative">
            {/* Horizontal scrolling container for all screen sizes */}
            {projects.length > 0 ? (
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
                    key={project.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex-shrink-0"
                    style={{ minWidth: '320px', width: '320px' }}
                  >
                    <div className="relative h-48">
                      <img
                        src={project.image}
                        alt={project.client}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/placeholder-project.jpg';
                        }}
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
                        {project.problem && (
                          <div>
                            <h4 className="font-semibold text-[#004a90] mb-2 flex items-center text-sm">
                              <i className="ri-error-warning-line text-red-500 mr-2"></i>
                              {t('projects.problem')}
                            </h4>
                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{project.problem}</p>
                          </div>
                        )}

                        {project.solution && (
                          <div>
                            <h4 className="font-semibold text-[#004a90] mb-2 flex items-center text-sm">
                              <i className="ri-lightbulb-line text-[#c3d021] mr-2"></i>
                              {t('projects.solution')}
                            </h4>
                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{project.solution}</p>
                          </div>
                        )}

                        {project.result && (
                          <div>
                            <h4 className="font-semibold text-[#004a90] mb-2 flex items-center text-sm">
                              <i className="ri-trophy-line text-[#004a90] mr-2"></i>
                              {t('projects.result')}
                            </h4>
                            <p className="text-gray-600 text-sm font-medium leading-relaxed line-clamp-3">{project.result}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, index) => (
                          <span
                            key={index}
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
            ) : (
              <div className="text-center py-20 px-6">
                <div className="inline-flex items-center justify-center p-4 bg-gray-50 rounded-full mb-4">
                  <i className="ri-folder-open-line text-3xl text-gray-400"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {language === 'es' ? 'Próximamente' : 'Coming Soon'}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {language === 'es'
                    ? 'Estamos documentando nuestros proyectos más recientes. Vuelve pronto para ver nuestro trabajo.'
                    : 'We are documenting our latest projects. Check back soon to see our work.'}
                </p>
              </div>
            )}


            {/* Scroll Indicator - Only show if projects exist */}
            {projects.length > 0 && (
              <div className="flex justify-center mt-6">
                <div className="flex items-center gap-2 text-gray-500 text-sm bg-gray-100 px-4 py-2 rounded-full">
                  <i className="ri-arrow-left-right-line text-lg"></i>
                  <span className="font-medium">{t('projects.scrollIndicator')}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results Summary */}
      <section className="py-fluid-section bg-[#ffffff]">
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
      <section className="py-fluid-section bg-white">
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
      <section className="py-fluid-section bg-[#ffffff]">
        <div className="max-w-7xl 3xl:max-w-9xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-fluid-h2 font-bold text-[#004a90] mb-6">{t('projects.testimonialsTitle')}</h2>
            <p className="text-fluid-body text-gray-600 max-w-3xl 3xl:max-w-4xl mx-auto">
              {t('projects.testimonialsSubtitle')}
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
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

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
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

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
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

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex-shrink-0" style={{ minWidth: '280px', width: '280px' }}>
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

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex-shrink-0" style={{ minWidth: '280px', width: '280px' }}>
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

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex-shrink-0" style={{ minWidth: '280px', width: '280px' }}>
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
      <section className="py-fluid-section bg-white text-gray-900">
        <div className="max-w-7xl 3xl:max-w-8xl mx-auto px-6 text-center">
          <h2 className="text-fluid-h2 font-bold mb-6 text-[#004a90]">{t('projects.ctaTitle')}</h2>
          <p className="text-fluid-body mb-8 max-w-2xl 3xl:max-w-3xl mx-auto text-gray-600">
            {t('projects.ctaSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/quote" size="lg" className="bg-[#c3d021] hover:bg-teravolta-lime-dark text-[#194271] whitespace-nowrap">
              {language === 'en' ? 'Start Project' : 'Iniciar Proyecto'}
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
