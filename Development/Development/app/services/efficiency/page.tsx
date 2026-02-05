
'use client';

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../components/LanguageProvider';
import { useAuth } from '../../../components/AuthProvider';

export default function EfficiencyPage() {
  const { language } = useLanguage();
  const { user } = useAuth();

  const content = {
    en: {
      heroTitle: "Energy Efficiency for Homes & Businesses",
      heroSubtitle: "We analyze the load profile of your home, business, or industry to identify energy efficiency solutions and opportunities with renewable energy.",
      comprehensiveTitle: "Comprehensive Energy Analysis",
      comprehensiveSubtitle: "From understanding your electricity bill to identifying renewable energy opportunities",
      understandBillsTitle: "Understand Your Energy Bills",
      understandBillsDesc: "Comprehensive analysis of your electricity bills and real-time energy use monitoring to provide complete visibility into your consumption patterns.",
      billAnalysisTitle: "Bill Analysis & Breakdown",
      billAnalysisItems: [
        "• Detailed bill component explanation",
        "• Rate structure and tariff analysis",
        "• Historical consumption trends",
        "• Cost driver identification"
      ],
      energyMonitoringTitle: "Energy Use Monitoring",
      energyMonitoringItems: [
        "• Real-time consumption tracking",
        "• Peak demand analysis",
        "• Load profiling and patterns",
        "• Equipment-level monitoring"
      ],
      consumptionAnalysisTitle: "Consumption Analysis & Savings",
      consumptionAnalysisDesc: "Deep dive into energy consumption patterns to identify specific savings opportunities and renewable energy potential for your property.",
      consumptionAnalysisCardTitle: "Energy Consumption Analysis",
      consumptionAnalysisItems: [
        "• Load profile characterization",
        "• Efficiency benchmarking",
        "• Waste identification and quantification",
        "• Seasonal variation analysis"
      ],
      renewableOpportunitiesTitle: "Renewable Energy Opportunities",
      renewableOpportunitiesItems: [
        "• Solar potential assessment",
        "• System sizing and design",
        "• Financial analysis and ROI",
        "• Payback period calculations"
      ],
      solutionsTitle: "Solutions for Every Property Type",
      solutionsSubtitle: "Whether you're a homeowner, small business, or large industry, we have tailored efficiency solutions",
      residentialTitle: "Residential Homes",
      residentialDesc: "Comprehensive analysis for homeowners looking to reduce energy costs and explore solar opportunities.",
      residentialItems: [
        "• Home energy audits",
        "• Solar feasibility studies",
        "• Appliance efficiency analysis",
        "• HVAC optimization"
      ],
      businessTitle: "Small Businesses",
      businessDesc: "Tailored solutions for commercial properties to optimize operations and reduce overhead costs.",
      businessItems: [
        "• Commercial energy assessments",
        "• Demand charge optimization",
        "• Lighting and equipment upgrades",
        "• Renewable energy integration"
      ],
      industrialTitle: "Industrial Facilities",
      industrialDesc: "Complex analysis for manufacturing and industrial operations to maximize efficiency and competitiveness.",
      industrialItems: [
        "• Process optimization studies",
        "• Power quality analysis",
        "• Large-scale renewable projects",
        "• Energy management systems"
      ],
      processTitle: "Our Analysis Process",
      processSubtitle: "A systematic approach to understanding your energy consumption and identifying optimization opportunities",
      dataCollectionTitle: "Data Collection",
      dataCollectionDesc: "12+ months of meter data and bill analysis",
      loadProfileTitle: "Load Profile Analysis",
      loadProfileDesc: "AI-powered pattern recognition and profiling",
      opportunityTitle: "Opportunity Assessment",
      opportunityDesc: "Efficiency and renewable energy evaluation",
      actionPlanTitle: "Action Plan",
      actionPlanDesc: "Prioritized recommendations with ROI analysis",
      resultsTitle: "Measurable Results",
      resultsDesc: "Our clients - from individual households to large businesses - typically see significant improvements in their energy efficiency and cost savings within the first year of implementation.",
      energyReductionTitle: "15-30% Energy Reduction",
      energyReductionDesc: "Average consumption decrease",
      paybackTitle: "12-18 Month Payback",
      paybackDesc: "Typical investment recovery period",
      carbonReductionTitle: "20-40% Carbon Reduction",
      carbonReductionDesc: "Environmental impact improvement",
      ctaTitle: "Start Your Efficiency Journey",
      ctaDesc: "Get a comprehensive analysis of your energy consumption and discover your savings potential.",
      getQuote: "Get Quote",
      contractService: "Hire Service",
      contactUs: "Contact Us"
    },
    es: {
      heroTitle: "Eficiencia Energética para Hogares y Empresas",
      heroSubtitle: "Analizamos el perfil de carga de tu hogar, negocio o industria para identificar soluciones de eficiencia energética y oportunidades con energía renovable.",
      comprehensiveTitle: "Análisis Energético Integral",
      comprehensiveSubtitle: "Desde entender tu factura de electricidad hasta identificar oportunidades de energía renovable",
      understandBillsTitle: "Entiende tus Facturas de Energía",
      understandBillsDesc: "Análisis integral de tus facturas de electricidad y monitoreo en tiempo real del uso de energía para proporcionar visibilidad completa de tus patrones de consumo.",
      billAnalysisTitle: "Análisis y Desglose de Facturas",
      billAnalysisItems: [
        "• Explicación detallada de componentes de factura",
        "• Análisis de estructura tarifaria",
        "• Tendencias de consumo histórico",
        "• Identificación de factores de costo"
      ],
      energyMonitoringTitle: "Monitoreo de Uso de Energía",
      energyMonitoringItems: [
        "• Seguimiento de consumo en tiempo real",
        "• Análisis de demanda pico",
        "• Perfiles de carga y patrones",
        "• Monitoreo a nivel de equipo"
      ],
      consumptionAnalysisTitle: "Análisis de Consumo y Ahorros",
      consumptionAnalysisDesc: "Análisis profundo de patrones de consumo energético para identificar oportunidades específicas de ahorro y potencial de energía renovable para tu propiedad.",
      consumptionAnalysisCardTitle: "Análisis de Consumo Energético",
      consumptionAnalysisItems: [
        "• Caracterización del perfil de carga",
        "• Benchmarking de eficiencia",
        "• Identificación y cuantificación de desperdicios",
        "• Análisis de variación estacional"
      ],
      renewableOpportunitiesTitle: "Oportunidades de Energía Renovable",
      renewableOpportunitiesItems: [
        "• Evaluación de potencial solar",
        "• Dimensionamiento y diseño de sistema",
        "• Análisis financiero y ROI",
        "• Cálculos de período de recuperación"
      ],
      solutionsTitle: "Soluciones para Todo Tipo de Propiedad",
      solutionsSubtitle: "Ya seas propietario de casa, pequeña empresa o gran industria, tenemos soluciones de eficiencia adaptadas",
      residentialTitle: "Hogares Residenciales",
      residentialDesc: "Análisis integral para propietarios que buscan reducir costos energéticos y explorar oportunidades solares.",
      residentialItems: [
        "• Auditorías energéticas residenciales",
        "• Estudios de viabilidad solar",
        "• Análisis de eficiencia de electrodomésticos",
        "• Optimización de HVAC"
      ],
      businessTitle: "Pequeñas Empresas",
      businessDesc: "Soluciones adaptadas para propiedades comerciales para optimizar operaciones y reducir costos generales.",
      businessItems: [
        "• Evaluaciones energéticas comerciales",
        "• Optimización de cargos por demanda",
        "• Actualizaciones de iluminación y equipos",
        "• Integración de energía renovable"
      ],
      industrialTitle: "Instalaciones Industriales",
      industrialDesc: "Análisis complejo para operaciones manufactureras e industriales para maximizar eficiencia y competitividad.",
      industrialItems: [
        "• Estudios de optimización de procesos",
        "• Análisis de calidad de energía",
        "• Proyectos renovables a gran escala",
        "• Sistemas de gestión energética"
      ],
      feature1Title: "Entendimiento de Factura",
      feature1Description: "Desglosamos cada componente de tu factura eléctrica para identificar costos ocultos, errores de facturación y oportunidades de ahorro inmediato.",
      feature2Title: "Monitoreo Inteligente",
      feature2Description: "Implementamos medidores IoT que registran tu consumo minuto a minuto, permitiendo detectar picos de demanda y desperdicios en tiempo real.",
      feature3Title: "Análisis de Consumo",
      feature3Description: "Nuestros algoritmos procesan tus datos históricos y actuales para modelar tu perfil de carga y predecir tendencias futuras.",
      feature4Title: "Estrategias de Ahorro",
      feature4Description: "Diseñamos un plan de acción concreto con medidas operativas y tecnológicas para reducir tu consumo sin afectar tus operaciones.",
      feature5Title: "Oportunidades Renovables",
      feature5Description: "Evaluamos y dimensionamos sistemas solares o almacenamiento de energía ajustados a tu perfil de consumo y presupuesto.",
      processTitle: "Nuestro Proceso de Análisis",
      processSubtitle: "Un enfoque sistemático para entender tu consumo energético e identificar oportunidades de optimización",
      dataCollectionTitle: "Recopilación de Datos",
      dataCollectionDesc: "12+ meses de datos de medidor y análisis de facturas",
      loadProfileTitle: "Análisis del Perfil de Carga",
      loadProfileDesc: "Reconocimiento de patrones y perfilado potenciado por IA",
      opportunityTitle: "Evaluación de Oportunidades",
      opportunityDesc: "Evaluación de eficiencia y energía renovable",
      actionPlanTitle: "Plan de Acción",
      actionPlanDesc: "Recomendaciones priorizadas con análisis de ROI",
      resultsTitle: "Resultados Medibles",
      resultsDesc: "Nuestros clientes - desde hogares individuales hasta grandes empresas - típicamente ven mejoras significativas en su eficiencia energética y ahorros de costos dentro del primer año de implementación.",
      energyReductionTitle: "Reducción de Energía",
      energyReductionDesc: "Disminución promedio de consumo",
      paybackTitle: "Recuperación de Inversión",
      paybackDesc: "Período típico de recuperación de inversión",
      carbonReductionTitle: "Reducción de Carbono",
      carbonReductionDesc: "Mejora del impacto ambiental",
      ctaTitle: "Comienza tu Viaje de Eficiencia",
      ctaDesc: "Obtén un análisis integral de tu consumo energético y descubre tu potencial de ahorro.",
      getQuote: "Obtener Cotización",
      contractService: "Contratar Servicio",
      contactUs: "Contáctanos"
    }
  };

  const t = (key: string): any => (content[language] as any)?.[key] || (content['es'] as any)[key] || key;

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

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('heroTitle')}</h1>
            <p className="text-xl leading-relaxed">
              {t('heroSubtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#004a90] mb-6">{t('comprehensiveTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('comprehensiveSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Bill Understanding & Monitoring */}
            <div className="bg-[#ffffff] rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="w-20 h-20 flex items-center justify-center bg-[#004a90] rounded-full mb-6">
                <i className="ri-file-text-line text-white text-3xl"></i>
              </div>
              <h3 className="text-3xl font-bold text-[#004a90] mb-6">{t('understandBillsTitle')}</h3>
              <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                {t('understandBillsDesc')}
              </p>

              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6">
                  <h4 className="font-bold text-[#004a90] mb-3 flex items-center">
                    <i className="ri-bill-line text-[#c3d021] mr-3"></i>
                    {t('billAnalysisTitle')}
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    {t('billAnalysisItems').map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-6">
                  <h4 className="font-bold text-[#004a90] mb-3 flex items-center">
                    <i className="ri-dashboard-line text-[#c3d021] mr-3"></i>
                    {t('energyMonitoringTitle')}
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    {t('energyMonitoringItems').map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Consumption Analysis & Savings */}
            <div className="bg-[#ffffff] rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="w-20 h-20 flex items-center justify-center bg-[#004a90] rounded-full mb-6">
                <i className="ri-line-chart-line text-white text-3xl"></i>
              </div>
              <h3 className="text-3xl font-bold text-[#004a90] mb-6">{t('consumptionAnalysisTitle')}</h3>
              <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                {t('consumptionAnalysisDesc')}
              </p>

              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6">
                  <h4 className="font-bold text-[#004a90] mb-3 flex items-center">
                    <i className="ri-search-line text-[#c3d021] mr-3"></i>
                    {t('consumptionAnalysisCardTitle')}
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    {t('consumptionAnalysisItems').map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-6">
                  <h4 className="font-bold text-[#004a90] mb-3 flex items-center">
                    <i className="ri-sun-line text-[#c3d021] mr-3"></i>
                    {t('renewableOpportunitiesTitle')}
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    {t('renewableOpportunitiesItems').map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For All Property Types */}
      <section className="py-20 bg-[#ffffff]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#004a90] mb-6">{t('solutionsTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('solutionsSubtitle')}
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 flex items-center justify-center bg-[#004a90] rounded-full mx-auto mb-6">
                <i className="ri-home-line text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-[#004a90] mb-4">{t('residentialTitle')}</h3>
              <p className="text-gray-600 mb-4">
                {t('residentialDesc')}
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                {t('residentialItems').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 flex items-center justify-center bg-[#c3d021] rounded-full mx-auto mb-6">
                <i className="ri-store-line text-[#004a90] text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-[#004a90] mb-4">{t('businessTitle')}</h3>
              <p className="text-gray-600 mb-4">
                {t('businessDesc')}
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                {t('businessItems').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 flex items-center justify-center bg-[#004a90] rounded-full mx-auto mb-6">
                <i className="ri-building-line text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-[#004a90] mb-4">{t('industrialTitle')}</h3>
              <p className="text-gray-600 mb-4">
                {t('industrialDesc')}
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                {t('industrialItems').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
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

              <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 flex-shrink-0" style={{ minWidth: '280px', width: '280px' }}>
                <div className="w-12 h-12 flex items-center justify-center bg-[#004a90] rounded-full mx-auto mb-4">
                  <i className="ri-home-line text-white text-lg"></i>
                </div>
                <h3 className="text-lg font-bold text-[#004a90] mb-3">{t('residentialTitle')}</h3>
                <p className="text-gray-600 mb-3 text-sm">
                  {t('residentialDesc')}
                </p>
                <ul className="text-xs text-gray-700 space-y-1">
                  {t('residentialItems').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 flex-shrink-0" style={{ minWidth: '280px', width: '280px' }}>
                <div className="w-12 h-12 flex items-center justify-center bg-[#c3d021] rounded-full mx-auto mb-4">
                  <i className="ri-store-line text-[#004a90] text-lg"></i>
                </div>
                <h3 className="text-lg font-bold text-[#004a90] mb-3">{t('businessTitle')}</h3>
                <p className="text-gray-600 mb-3 text-sm">
                  {t('businessDesc')}
                </p>
                <ul className="text-xs text-gray-700 space-y-1">
                  {t('businessItems').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 flex-shrink-0" style={{ minWidth: '280px', width: '280px' }}>
                <div className="w-12 h-12 flex items-center justify-center bg-[#004a90] rounded-full mx-auto mb-4">
                  <i className="ri-building-line text-white text-lg"></i>
                </div>
                <h3 className="text-lg font-bold text-[#004a90] mb-3">{t('industrialTitle')}</h3>
                <p className="text-gray-600 mb-3 text-sm">
                  {t('industrialDesc')}
                </p>
                <ul className="text-xs text-gray-700 space-y-1">
                  {t('industrialItems').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Mobile Scroll Indicator */}
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm bg-gray-100 px-4 py-2 rounded-full">
                <i className="ri-arrow-left-right-line text-lg"></i>
                <span className="font-medium">Desliza para ver más</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#004a90] mb-6">{t('processTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('processSubtitle')}
            </p>
          </div>

          <div className="relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-[40px] left-0 w-full h-1 bg-gray-200 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {[
                { step: 1, title: 'dataCollectionTitle', desc: 'dataCollectionDesc' },
                { step: 2, title: 'loadProfileTitle', desc: 'loadProfileDesc' },
                { step: 3, title: 'opportunityTitle', desc: 'opportunityDesc' },
                { step: 4, title: 'actionPlanTitle', desc: 'actionPlanDesc' }
              ].map((item) => (
                <div key={item.step} className="bg-white rounded-xl p-6 shadow-md border-t-4 border-[#c3d021] mt-8 md:mt-0">
                  <div className="w-10 h-10 bg-[#004a90] text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 mx-auto md:mx-0 relative z-20 ring-4 ring-white">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-[#004a90] mb-3">
                    {t(item.title)}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t(item.desc)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#004a90] mb-6">{t('resultsTitle')}</h2>
              <p className="text-xl text-gray-600 mb-8">
                {t('resultsDesc')}
              </p>

              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#c3d021] rounded-full mr-4">
                    <i className="ri-arrow-down-line text-xl" style={{ color: '#194271' }}></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#004a90]">{t('energyReductionTitle')}</h4>
                    <p className="text-gray-600">{t('energyReductionDesc')}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#c3d021] rounded-full mr-4">
                    <i className="ri-coins-line text-xl" style={{ color: '#194271' }}></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{t('paybackTitle')}</h4>
                    <p className="text-gray-600">{t('paybackDesc')}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#c3d021] rounded-full mr-4">
                    <i className="ri-leaf-line text-xl" style={{ color: '#194271' }}></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{t('carbonReductionTitle')}</h4>
                    <p className="text-gray-600">{t('carbonReductionDesc')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <img
                src="/images/brand/service_efficiency.png"
                alt="Energy Efficiency Results"
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">{t('ctaTitle')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('ctaDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* CTA Buttons */}
            <Button href="/quote" size="lg" className="bg-[#c3d021] text-[#194271] hover:bg-teravolta-lime-dark">
              {t('getQuote')}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
