
'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../components/LanguageProvider';
import { useAuth } from '../../components/AuthProvider';

export default function ServicesPage() {
  const { language } = useLanguage();
  const { user } = useAuth();

  const content = {
    en: {
      heroTitle: "Our Services",
      heroSubtitle: "Comprehensive consulting, efficiency, and advocacy solutions designed to optimize your energy strategy, reduce costs, and ensure service quality.",
      ourServices: 'Our Services',
      servicesDescription: 'Integral energy efficiency, strategic consulting, and service quality solutions tailored to your specific needs',
      consulting: 'Strategic Consulting',
      consultingDescription: 'We drive strategic decisions in PPA structuring, Contract Evaluation, and sustainable business development that optimize costs and competitiveness.',
      ppaStructuring: 'Requirement definition',
      assetAcquisition: 'Request for proposals',
      businessDevelopment: 'Proposal evaluation',
      marketAnalysis: 'Provider selection',
      consultingBullet5: 'Asset Due Diligence',
      consultingBullet6: 'Business plan design',
      consultingBullet7: 'Public Tenders Offer',
      efficiency: 'Energy Efficiency for Homes and Businesses',
      efficiencyDescription: 'We analyze the load profile of your home, business, or industry to identify energy efficiency solutions.',
      billAnalysis: 'Understand your electric bill',
      consumptionMonitoring: 'Monitoring Energy Use',
      renewableOpportunities: 'Analysis of Energy Consumption',
      savingsRecommendations: 'Identification of Savings',
      efficiencyBullet5: 'Opportunities with renewable energies',
      learnMore: 'Learn More',
      advocacy: 'Service Quality',
      advocacyDescription: 'We advise on claims for electricity service quality to distributors in Panama and before the Regulatory Body (ASEP).',
      qualityClaims: 'Quality claims',
      regulatoryRepresentation: 'Regulatory advice',
      billingDisputes: 'ASEP representation',
      whyChooseTitle: "Why Choose TeraVolta?",
      whyChooseSubtitle: "Our unique combination of technology, expertise, and local market knowledge delivers results",
      feature1Title: "Data-Driven",
      feature1Description: "Real meter data, not estimates",
      feature2Title: "Local Expertise",
      feature2Description: "Deep Panama market knowledge",
      feature3Title: "AI-Powered",
      feature3Description: "Advanced analytics and insights",
      feature4Title: "Full Support",
      feature4Description: "End-to-end service and advocacy",
      ctaTitle: "Ready to Get Started?",
      ctaSubtitle: "Choose the service that best fits your needs and start your journey to energy clarity.",
      ctaButton: "Get Your Custom Quote"
    },
    es: {
      heroTitle: "Nuestros Servicios",
      heroSubtitle: "Soluciones integrales de consultoría, eficiencia y defensa del consumidor, diseñadas para optimizar tu estrategia energética, reducir costos y garantizar la calidad del servicio.",
      ourServices: 'Nuestros Servicios',
      servicesDescription: 'Soluciones integrales de eficiencia energética, consultoría estratégica y calidad de servicio adaptadas a tus necesidades',
      consulting: 'Consultoría Estratégica',
      consultingDescription: 'Impulsamos decisiones estratégicas en estructuración de PPAs, Evaluación de Contratos y desarrollo de negocios sostenibles que optimizan costos y competitividad.',
      ppaStructuring: 'Definición de requerimientos',
      assetAcquisition: 'Solicitud de ofertas',
      businessDevelopment: 'Evaluación de ofertas',
      marketAnalysis: 'Selección del proveedor',
      consultingBullet5: 'Due Diligence de activos',
      consultingBullet6: 'Diseño de planes de negocio',
      consultingBullet7: 'Oferta de Licitaciones Públicas',
      efficiency: 'Eficiencia Energética para Hogares y Negocios',
      efficiencyDescription: 'Analizamos el perfil de carga de su hogar, negocio o industria para identificar soluciones de eficiencia energética.',
      billAnalysis: 'Entiende tu factura eléctrica',
      consumptionMonitoring: 'Monitoreo del Uso de la Energía',
      renewableOpportunities: 'Análisis de Consumo Energético',
      savingsRecommendations: 'Identificación de Ahorros',
      efficiencyBullet5: 'Oportunidades con energías renovables',
      learnMore: 'Más Información',
      advocacy: 'Calidad de Servicio',
      advocacyDescription: 'Asesoramos en reclamos por calidad del servicio eléctrico a distribuidoras de Panamá y ante el Ente Regulador (ASEP).',
      qualityClaims: 'Reclamos por calidad',
      regulatoryRepresentation: 'Asesoría regulatoria',
      billingDisputes: 'Representación ante ASEP',
      whyChooseTitle: "¿Por Qué Elegir TeraVolta?",
      whyChooseSubtitle: "Nuestra combinación única de tecnología, experiencia y conocimiento del mercado local entrega resultados",
      feature1Title: "Basado en Datos",
      feature1Description: "Datos reales de medidores, no estimaciones",
      feature2Title: "Experiencia Local",
      feature2Description: "Conocimiento profundo del mercado panameño",
      feature3Title: "Potenciado por IA",
      feature3Description: "Análisis avanzado e insights",
      feature4Title: "Soporte Completo",
      feature4Description: "Servicio y representación integral",
      ctaTitle: "¿Listo para Comenzar?",
      ctaSubtitle: "Elige el servicio que mejor se adapte a tus necesidades y comienza tu camino hacia la claridad energética.",
      ctaButton: "Obtén tu Cotización Personalizada"
    }
  };

  const t = (key: string): string => {
    const currentContent = content[language] || content['es'];
    return (currentContent as any)[key] || key;
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="py-20 text-white bg-[#004a90] relative overflow-hidden">
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
          <h1 className="text-fluid-h1 font-bold mb-6 text-white">{t('heroTitle')}</h1>
          <p className="text-xl md:text-2xl 3xl:text-3xl max-w-3xl 3xl:max-w-4xl mx-auto">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-fluid-section bg-white">
        <div className="max-w-7xl 3xl:max-w-9xl mx-auto px-6">


          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8 3xl:gap-16 items-start">
            {/* Strategic Consulting - Primera posición */}
            <Link
              href="/services/consulting"
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#004a90] transition-all h-full flex flex-col group cursor-pointer"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-[#c3d021] rounded-full mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <i className="ri-bar-chart-line text-[#004a90] text-2xl"></i>
              </div>
              <h3 className="text-fluid-h3 font-bold text-[#004a90] mb-4 text-center group-hover:text-[#003870] transition-colors">
                {t('consulting')}
              </h3>
              <p className="text-gray-600 text-fluid-body mb-6 text-center">
                {t('consultingDescription')}
              </p>
              <div className="space-y-3 mb-6 flex-grow">
                <div className="flex items-center text-sm text-gray-700">
                  <i className="ri-check-line text-[#c3d021] mr-2"></i>
                  <span>{t('ppaStructuring')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <i className="ri-check-line text-[#c3d021] mr-2"></i>
                  <span>{t('assetAcquisition')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <i className="ri-check-line text-[#c3d021] mr-2"></i>
                  <span>{t('businessDevelopment')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <i className="ri-check-line text-[#c3d021] mr-2"></i>
                  <span>{t('marketAnalysis')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <i className="ri-check-line text-[#c3d021] mr-2"></i>
                  <span>{t('consultingBullet5')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <i className="ri-check-line text-[#c3d021] mr-2"></i>
                  <span>{t('consultingBullet6')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <i className="ri-check-line text-[#c3d021] mr-2"></i>
                  <span>{t('consultingBullet7')}</span>
                </div>
              </div>
              <div className="text-center mt-6">
                <div className="inline-flex items-center justify-center font-medium rounded-full transition-colors whitespace-nowrap px-6 py-3 text-base bg-[#004a90] text-white group-hover:bg-teravolta-blue-dark w-full">
                  {t('learnMore')}
                </div>
              </div>
            </Link>

            {/* Energy Efficiency - Posición central */}
            <Link
              href="/services/efficiency"
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#004a90] transition-all h-full flex flex-col group cursor-pointer"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-[#004a90] rounded-full mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <i className="ri-line-chart-line text-white text-2xl"></i>
              </div>
              <h3 className="text-fluid-h3 font-bold text-[#004a90] mb-4 text-center group-hover:text-[#003870] transition-colors">
                {t('efficiency')}
              </h3>
              <p className="text-gray-600 text-fluid-body mb-6 text-center">
                {t('efficiencyDescription')}
              </p>
              <div className="space-y-3 mb-6 flex-grow">
                <div className="flex items-center text-sm text-gray-700">
                  <i className="ri-check-line text-[#c3d021] mr-2"></i>
                  <span>{t('billAnalysis')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <i className="ri-check-line text-[#c3d021] mr-2"></i>
                  <span>{t('consumptionMonitoring')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <i className="ri-check-line text-[#c3d021] mr-2"></i>
                  <span>{t('renewableOpportunities')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <i className="ri-check-line text-[#c3d021] mr-2"></i>
                  <span>{t('savingsRecommendations')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <i className="ri-check-line text-[#c3d021] mr-2"></i>
                  <span>{t('efficiencyBullet5')}</span>
                </div>
              </div>
              <div className="text-center mt-6">
                <div className="inline-flex items-center justify-center font-medium rounded-full transition-colors whitespace-nowrap px-6 py-3 text-base bg-[#c3d021] text-[#194271] group-hover:bg-teravolta-lime-dark w-full">
                  {t('learnMore')}
                </div>
              </div>
            </Link>

            {/* Service Quality - Tercera posición */}
            <Link
              href="/services/advocacy"
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#004a90] transition-all h-full flex flex-col group cursor-pointer"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-[#c3d021] rounded-full mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <i className="ri-shield-user-line text-[#004a90] text-2xl"></i>
              </div>
              <h3 className="text-fluid-h3 font-bold text-[#004a90] mb-4 text-center group-hover:text-[#003870] transition-colors">
                {t('advocacy')}
              </h3>
              <p className="text-gray-600 text-fluid-body mb-6 text-center">
                {t('advocacyDescription')}
              </p>
              <div className="space-y-3 mb-6 flex-grow">
                <div className="flex items-center text-sm text-gray-700">
                  <i className="ri-check-line text-[#c3d021] mr-2"></i>
                  <span>{t('qualityClaims')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <i className="ri-check-line text-[#c3d021] mr-2"></i>
                  <span>{t('regulatoryRepresentation')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <i className="ri-check-line text-[#c3d021] mr-2"></i>
                  <span>{t('billingDisputes')}</span>
                </div>
              </div>
              <div className="text-center mt-6">
                <div className="inline-flex items-center justify-center font-medium rounded-full transition-colors whitespace-nowrap px-6 py-3 text-base bg-[#004a90] text-white group-hover:bg-teravolta-blue-dark w-full">
                  {t('learnMore')}
                </div>
              </div>
            </Link>
          </div>

          {/* Mobile Horizontal Scroll */}
          <div className="md:hidden">
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

              {/* Strategic Consulting - Mobile */}
              <Link
                href="/services/consulting"
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#004a90] transition-all flex-shrink-0 flex flex-col group cursor-pointer"
                style={{ minWidth: '280px', width: '280px' }}
              >
                <div className="w-12 h-12 flex items-center justify-center bg-[#c3d021] rounded-full mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <i className="ri-bar-chart-line text-[#004a90] text-xl"></i>
                </div>
                <h3 className="text-lg font-bold text-[#004a90] mb-3 text-center group-hover:text-[#003870] transition-colors">
                  {t('consulting')}
                </h3>
                <p className="text-gray-600 mb-4 text-center flex-grow text-sm">
                  {t('consultingDescription')}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-center text-xs text-gray-700">
                    <i className="ri-check-line text-[#c3d021] mr-2"></i>
                    <span>{t('ppaStructuring')}</span>
                  </div>
                  <div className="flex items-center justify-center text-xs text-gray-700">
                    <i className="ri-check-line text-[#c3d021] mr-2"></i>
                    <span>{t('assetAcquisition')}</span>
                  </div>
                  <div className="flex items-center justify-center text-xs text-gray-700">
                    <i className="ri-check-line text-[#c3d021] mr-2"></i>
                    <span>{t('businessDevelopment')}</span>
                  </div>
                  <div className="flex items-center justify-center text-xs text-gray-700">
                    <i className="ri-check-line text-[#c3d021] mr-2"></i>
                    <span>{t('marketAnalysis')}</span>
                  </div>
                </div>
                <div className="text-center mt-auto">
                  <div className="inline-flex items-center justify-center font-medium rounded-full transition-colors whitespace-nowrap bg-[#004a90] text-white w-full text-sm py-2 group-hover:bg-teravolta-blue-dark">
                    {t('learnMore')}
                  </div>
                </div>
              </Link>

              {/* Energy Efficiency - Mobile */}
              <Link
                href="/services/efficiency"
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#004a90] transition-all flex-shrink-0 flex flex-col group cursor-pointer"
                style={{ minWidth: '280px', width: '280px' }}
              >
                <div className="w-12 h-12 flex items-center justify-center bg-[#004a90] rounded-full mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <i className="ri-line-chart-line text-white text-xl"></i>
                </div>
                <h3 className="text-lg font-bold text-[#004a90] mb-3 text-center group-hover:text-[#003870] transition-colors">
                  {t('efficiency')}
                </h3>
                <p className="text-gray-600 mb-4 text-center flex-grow text-sm">
                  {t('efficiencyDescription')}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-center text-xs text-gray-700">
                    <i className="ri-check-line text-[#c3d021] mr-2"></i>
                    <span>{t('billAnalysis')}</span>
                  </div>
                  <div className="flex items-center justify-center text-xs text-gray-700">
                    <i className="ri-check-line text-[#c3d021] mr-2"></i>
                    <span>{t('consumptionMonitoring')}</span>
                  </div>
                  <div className="flex items-center justify-center text-xs text-gray-700">
                    <i className="ri-check-line text-[#c3d021] mr-2"></i>
                    <span>{t('renewableOpportunities')}</span>
                  </div>
                  <div className="flex items-center justify-center text-xs text-gray-700">
                    <i className="ri-check-line text-[#c3d021] mr-2"></i>
                    <span>{t('savingsRecommendations')}</span>
                  </div>
                </div>
                <div className="text-center mt-auto">
                  <div className="inline-flex items-center justify-center font-medium rounded-full transition-colors whitespace-nowrap bg-[#c3d021] text-[#194271] w-full text-sm py-2 group-hover:bg-teravolta-lime-dark">
                    {t('learnMore')}
                  </div>
                </div>
              </Link>

              {/* Service Quality - Mobile */}
              <Link
                href="/services/advocacy"
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#004a90] transition-all flex-shrink-0 flex flex-col group cursor-pointer"
                style={{ minWidth: '280px', width: '280px' }}
              >
                <div className="w-12 h-12 flex items-center justify-center bg-[#c3d021] rounded-full mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <i className="ri-shield-user-line text-[#004a90] text-xl"></i>
                </div>
                <h3 className="text-lg font-bold text-[#004a90] mb-3 text-center group-hover:text-[#003870] transition-colors">
                  {t('advocacy')}
                </h3>
                <p className="text-gray-600 mb-4 text-center flex-grow text-sm">
                  {t('advocacyDescription')}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-center text-xs text-gray-700">
                    <i className="ri-check-line text-[#c3d021] mr-2"></i>
                    <span>{t('qualityClaims')}</span>
                  </div>
                  <div className="flex items-center justify-center text-xs text-gray-700">
                    <i className="ri-check-line text-[#c3d021] mr-2"></i>
                    <span>{t('regulatoryRepresentation')}</span>
                  </div>
                  <div className="flex items-center justify-center text-xs text-gray-700">
                    <i className="ri-check-line text-[#c3d021] mr-2"></i>
                    <span>{t('billingDisputes')}</span>
                  </div>
                </div>
                <div className="text-center mt-auto">
                  <div className="inline-flex items-center justify-center font-medium rounded-full transition-colors whitespace-nowrap bg-[#004a90] text-white w-full text-sm py-2 group-hover:bg-teravolta-blue-dark">
                    {t('learnMore')}
                  </div>
                </div>
              </Link>
            </div>

            {/* Mobile Scroll Indicator */}
            <div className="flex justify-center mt-4 px-6">
              <div className="flex items-center gap-2 text-gray-500 text-sm bg-gray-100 px-4 py-2 rounded-full">
                <i className="ri-arrow-left-right-line text-lg"></i>
                <span className="font-medium">Desliza para ver más</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-fluid-section bg-[#ffffff]">
        <div className="max-w-7xl 3xl:max-w-8xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-fluid-h2 font-bold text-[#004a90] mb-6">{t('whyChooseTitle')}</h2>
            <p className="text-fluid-body text-gray-600 max-w-3xl mx-auto">
              {t('whyChooseSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-[#004a90] rounded-full mx-auto mb-4">
                <i className="ri-database-line text-white text-2xl"></i>
              </div>
              <h4 className="font-bold text-[#004a90] mb-2">{t('feature1Title')}</h4>
              <p className="text-gray-600 text-sm">{t('feature1Description')}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-[#c3d021] rounded-full mx-auto mb-4">
                <i className="ri-map-pin-line text-[#004a90] text-2xl"></i>
              </div>
              <h4 className="font-bold text-[#004a90] mb-2">{t('feature2Title')}</h4>
              <p className="text-gray-600 text-sm">{t('feature2Description')}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-[#004a90] rounded-full mx-auto mb-4">
                <i className="ri-cpu-line text-white text-2xl"></i>
              </div>
              <h4 className="font-bold text-[#004a90] mb-2">{t('feature3Title')}</h4>
              <p className="text-gray-600 text-sm">{t('feature3Description')}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-[#c3d021] rounded-full mx-auto mb-4">
                <i className="ri-customer-service-line text-[#004a90] text-2xl"></i>
              </div>
              <h4 className="font-bold text-[#004a90] mb-2">{t('feature4Title')}</h4>
              <p className="text-gray-600 text-sm">{t('feature4Description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-fluid-section bg-white">
        <div className="max-w-7xl 3xl:max-w-8xl mx-auto px-6 text-center">
          <h2 className="text-fluid-h2 font-bold text-[#004a90] mb-6">{t('ctaTitle')}</h2>
          <p className="text-fluid-body text-gray-600 mb-8 max-w-2xl 3xl:max-w-3xl mx-auto">
            {t('ctaSubtitle')}
          </p>
          <Button href="/contact" size="lg" className="bg-[#c3d021] hover:bg-teravolta-lime-dark text-[#194271]">
            {language === 'en' ? 'Contact Us' : 'Contáctanos'}
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
