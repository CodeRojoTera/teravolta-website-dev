
'use client';

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../components/LanguageProvider';
import { useAuth } from '../../../components/AuthProvider';

export default function ConsultingPage() {
  const { language } = useLanguage();
  const { user } = useAuth();

  const content = {
    en: {
      heroTitle: "Strategic Consulting",
      heroSubtitle: "We drive strategic decisions in PPA structuring, asset acquisition, and sustainable business development that optimize costs and competitiveness.",
      consultingTitle: "Strategic Energy Consulting",
      consultingSubtitle: "Expert guidance for complex energy decisions, from contract structuring to market positioning",
      requirementsTitle: "Requirements & Proposals",
      requirementsDesc: "Strategic definition of requirements and comprehensive request for proposals to ensure optimal supplier selection and competitive positioning.",
      requirementsItems: [
        "1. Definition of requirements",
        "2. Request for offers (RFP)",
        "3. Evaluation of offers",
        "4. Supplier selection and Contract Closing"
      ],
      dueDiligenceTitle: "Asset Due Diligence",
      dueDiligenceDesc: "Comprehensive evaluation of energy assets and investments, providing detailed technical, financial, and regulatory analysis to inform your decision-making.",
      dueDiligenceItems: [
        "• Technical asset assessment and validation",
        "• Financial model review and analysis",
        "• Regulatory compliance evaluation",
        "• Market position and competitive analysis",
        "• Risk assessment and mitigation strategies"
      ],
      businessPlanTitle: "Business Plan Design",
      businessPlanDesc: "Strategic business plan development for sustainable energy projects, ensuring optimal structure and competitive advantage in the market.",
      businessPlanItems: [
        "• Market analysis and opportunity assessment",
        "• Financial modeling and projections",
        "• Operational strategy development",
        "• Risk management frameworks",
        "• Implementation roadmap creation"
      ],
      tenderTitle: "Public Tender Bidding",
      tenderDesc: "Expert support for public tender processes, from preparation and submission to evaluation and negotiation, ensuring competitive positioning.",
      tenderItems: [
        "• Tender document preparation and review",
        "• Competitive strategy development",
        "• Proposal optimization and submission",
        "• Bid evaluation and scoring support",
        "• Contract negotiation and finalization"
      ],
      marketExpertiseTitle: "Panama Market Expertise",
      marketExpertiseDesc: "Deep understanding of the Panamanian energy market, regulatory environment, and key players provides you with insider knowledge for strategic advantage.",
      regulatoryTitle: "Regulatory Landscape",
      regulatoryDesc: "Navigate ASEP regulations, tariff structures, and compliance requirements with confidence.",
      marketDynamicsTitle: "Market Dynamics",
      marketDynamicsDesc: "Understand supply-demand patterns, pricing trends, and emerging opportunities.",
      relationshipsTitle: "Key Relationships",
      relationshipsDesc: "Leverage established relationships with distributors, generators, and regulators.",
      approachTitle: "Our Consulting Approach",
      approachSubtitle: "A structured methodology that delivers actionable insights and strategic recommendations",
      discoveryTitle: "Discovery",
      discoveryDesc: "Understanding your objectives, constraints, and market position through detailed analysis.",
      analysisTitle: "Analysis",
      analysisDesc: "Comprehensive market research and financial modeling to evaluate options and scenarios.",
      strategyTitle: "Strategy",
      strategyDesc: "Developing tailored strategies and recommendations based on data-driven insights.",
      implementationTitle: "Implementation",
      implementationDesc: "Supporting execution with ongoing guidance and performance monitoring.",
      provenResultsTitle: "Proven Results",
      provenResultsDesc: "Our strategic consulting has helped clients achieve significant cost savings and operational improvements",
      annualSavingsTitle: "Annual Savings",
      annualSavingsDesc: "Manufacturing client through PPA restructuring and demand optimization",
      costReductionTitle: "Cost Reduction",
      costReductionDesc: "Commercial real estate portfolio energy procurement optimization",
      fasterRoiTitle: "Faster ROI",
      fasterRoiDesc: "Renewable energy project through strategic tender positioning",
      ctaTitle: "Strategic Energy Decisions Start Here",
      ctaDesc: "Get expert guidance for your next major energy investment or contract negotiation.",
      scheduleConsultation: "Schedule a Consultation",
      viewProjects: "View Our Projects",
      contactUs: "Contact Us",

      processTitle: "Our Strategic Process",
      processSubtitle: "A structured methodology for PPA structuring and energy optimization.",
      step1Title: "Definition of Requirements",
      step1Desc: "We define the technical and financial requirements aligned with your long-term business goals.",
      step2Title: "Request for Offers (RFP)",
      step2Desc: "We manage the tender process, inviting qualified generators to submit competitive proposals.",
      step3Title: "Evaluation of Offers",
      step3Desc: "Rigorous analysis of received offers to ensure they meet all technical and financial criteria.",
      step4Title: "Selection & Contract",
      step4Desc: "Support in supplier selection and contract closing to secure the best possible terms."
    },
    es: {
      heroTitle: "Consultoría Estratégica",
      heroSubtitle: "Impulsamos decisiones estratégicas en estructuración de PPA, adquisición de activos y desarrollo empresarial sostenible que optimizan costos y competitividad.",
      consultingTitle: "Consultoría Energética Estratégica",
      consultingSubtitle: "Orientación experta para decisiones energéticas complejas, desde estructuración de contratos hasta posicionamiento en el mercado",
      requirementsTitle: "Requisitos y Propuestas",
      requirementsDesc: "Definición estratégica de requisitos y solicitud integral de propuestas para garantizar la selección óptima de proveedores y posicionamiento competitivo.",
      requirementsItems: [
        "1. Definición de requerimientos",
        "2. Solicitud de ofertas",
        "3. Evaluación de ofertas",
        "4. Cierre de contrato y Selección"
      ],
      dueDiligenceTitle: "Debida Diligencia de Activos",
      dueDiligenceDesc: "Evaluación integral de activos energéticos e inversiones, proporcionando análisis técnico, financiero y regulatorio detallado para informar tu toma de decisiones.",
      dueDiligenceItems: [
        "• Evaluación y validación técnica de activos",
        "• Revisión y análisis de modelos financieros",
        "• Evaluación de cumplimiento regulatorio",
        "• Análisis de posición y competitividad de mercado",
        "• Evaluación de riesgos y estrategias de mitigación"
      ],
      businessPlanTitle: "Diseño de Plan de Negocio",
      businessPlanDesc: "Desarrollo estratégico de plan de negocios para proyectos de energía sostenible, asegurando estructura óptima y ventaja competitiva en el mercado.",
      businessPlanItems: [
        "• Análisis de mercado y evaluación de oportunidades",
        "• Modelado financiero y proyecciones",
        "• Desarrollo de estrategia operacional",
        "• Marcos de gestión de riesgos",
        "• Creación de hoja de ruta de implementación"
      ],
      tenderTitle: "Licitación Pública",
      tenderDesc: "Apoyo experto para procesos de licitación pública, desde preparación y presentación hasta evaluación y negociación, asegurando posicionamiento competitivo.",
      tenderItems: [
        "• Preparación y revisión de documentos de licitación",
        "• Desarrollo de estrategia competitiva",
        "• Optimización y presentación de propuestas",
        "• Apoyo en evaluación y puntuación de ofertas",
        "• Negociación y finalización de contratos"
      ],
      marketExpertiseTitle: "Experiencia del Mercado Panameño",
      marketExpertiseDesc: "Comprensión profunda del mercado energético panameño, entorno regulatorio y actores clave te proporciona conocimiento interno para ventaja estratégica.",
      regulatoryTitle: "Panorama Regulatorio",
      regulatoryDesc: "Navega las regulaciones de ASEP, estructuras tarifarias y requisitos de cumplimiento con confianza.",
      marketDynamicsTitle: "Dinámicas del Mercado",
      marketDynamicsDesc: "Comprende patrones de oferta-demanda, tendencias de precios y oportunidades emergentes.",
      relationshipsTitle: "Relaciones Clave",
      relationshipsDesc: "Aprovecha relaciones establecidas con distribuidores, generadores y reguladores.",
      provenResultsTitle: "Resultados Comprobados",
      provenResultsDesc: "Nuestra consultoría estratégica ha ayudado a clientes a lograr ahorros significativos y mejoras operativas",
      annualSavingsTitle: "Ahorro Anual",
      annualSavingsDesc: "Cliente de manufactura mediante reestructuración de PPA y optimización de demanda",
      costReductionTitle: "Reducción de Costos",
      costReductionDesc: "Optimización de adquisición de energía para cartera de bienes raíces comerciales",
      fasterRoiTitle: "Mayor ROI",
      fasterRoiDesc: "Proyecto de energía renovable a través de posicionamiento estratégico en licitaciones",
      processTitle: "Nuestro Proceso Estratégico",
      processSubtitle: "Una metodología estructurada para la estructuración de PPA y optimización energética.",
      step1Title: "Definición de Requerimientos",
      step1Desc: "Definimos los requisitos técnicos y financieros alineados con sus objetivos de negocio.",
      step2Title: "Solicitud de Ofertas (RFP)",
      step2Desc: "Gestionamos el proceso de licitación, invitando a generadores calificados a presentar propuestas.",
      step3Title: "Evaluación de Ofertas",
      step3Desc: "Análisis riguroso de las ofertas recibidas para asegurar el cumplimiento de criterios técnicos y financieros.",
      step4Title: "Selección y Contrato",
      step4Desc: "Apoyo en la selección del proveedor y cierre del contrato con las mejores condiciones.",
      ctaTitle: "Las Decisiones Energéticas Estratégicas Comienzan Aquí",
      ctaDesc: "Obtenga orientación experta para su próxima gran inversión energética o negociación de contratos.",
      scheduleConsultation: "Agendar Consulta",
      viewProjects: "Ver Proyectos",
      contactUs: "Contáctanos"
    }
  };

  const t = (key: string) => (content[language] as any)?.[key] || (content['es'] as any)[key] || key;

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

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#004a90] mb-6">{t('consultingTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('consultingSubtitle')}
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-16 h-16 flex items-center justify-center bg-[#004a90] rounded-full mb-6">
                <i className="ri-file-text-line text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-[#004a90] mb-4">{t('requirementsTitle')}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t('requirementsDesc')}
              </p>
              <ul className="space-y-2 text-gray-700">
                {t('requirementsItems').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-16 h-16 flex items-center justify-center bg-[#c3d021] rounded-full mb-6">
                <i className="ri-shield-check-line text-[#004a90] text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-[#004a90] mb-4">{t('dueDiligenceTitle')}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t('dueDiligenceDesc')}
              </p>
              <ul className="space-y-2 text-gray-700">
                {t('dueDiligenceItems').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-16 h-16 flex items-center justify-center bg-[#004a90] rounded-full mb-6">
                <i className="ri-building-line text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-[#004a90] mb-4">{t('businessPlanTitle')}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t('businessPlanDesc')}
              </p>
              <ul className="space-y-2 text-gray-700">
                {t('businessPlanItems').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-16 h-16 flex items-center justify-center bg-[#c3d021] rounded-full mb-6">
                <i className="ri-auction-line text-[#004a90] text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-[#004a90] mb-4">{t('tenderTitle')}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t('tenderDesc')}
              </p>
              <ul className="space-y-2 text-gray-700">
                {t('tenderItems').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mobile Horizontal Scroll */}
          <div className="lg:hidden">
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

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-shrink-0" style={{ minWidth: '280px', width: '280px' }}>
                <div className="w-12 h-12 flex items-center justify-center bg-[#004a90] rounded-full mb-4">
                  <i className="ri-file-text-line text-white text-lg"></i>
                </div>
                <h3 className="text-lg font-bold text-[#004a90] mb-3">{t('requirementsTitle')}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                  {t('requirementsDesc')}
                </p>
                <ul className="space-y-1 text-gray-700 text-sm">
                  {t('requirementsItems').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-shrink-0" style={{ minWidth: '280px', width: '280px' }}>
                <div className="w-12 h-12 flex items-center justify-center bg-[#c3d021] rounded-full mb-4">
                  <i className="ri-shield-check-line text-[#004a90] text-lg"></i>
                </div>
                <h3 className="text-lg font-bold text-[#004a90] mb-3">{t('dueDiligenceTitle')}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                  {t('dueDiligenceDesc')}
                </p>
                <ul className="space-y-1 text-gray-700 text-sm">
                  {t('dueDiligenceItems').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-shrink-0" style={{ minWidth: '280px', width: '280px' }}>
                <div className="w-12 h-12 flex items-center justify-center bg-[#004a90] rounded-full mb-4">
                  <i className="ri-building-line text-white text-lg"></i>
                </div>
                <h3 className="text-lg font-bold text-[#004a90] mb-3">{t('businessPlanTitle')}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                  {t('businessPlanDesc')}
                </p>
                <ul className="space-y-1 text-gray-700 text-sm">
                  {t('businessPlanItems').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-shrink-0" style={{ minWidth: '280px', width: '280px' }}>
                <div className="w-12 h-12 flex items-center justify-center bg-[#c3d021] rounded-full mb-4">
                  <i className="ri-auction-line text-[#004a90] text-lg"></i>
                </div>
                <h3 className="text-lg font-bold text-[#004a90] mb-3">{t('tenderTitle')}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                  {t('tenderDesc')}
                </p>
                <ul className="space-y-1 text-gray-700 text-sm">
                  {t('tenderItems').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Mobile Scroll Indicator */}
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm bg-gray-100 px-4 py-2 rounded-full">
                <i className="ri-arrow-left-right-line text-lg"></i>
                <span className="font-medium">{language === 'es' ? 'Desliza para ver más' : 'Scroll to see more'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Expertise */}
      <section className="py-20 bg-[#ffffff]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#004a90] mb-6">{t('marketExpertiseTitle')}</h2>
              <p className="text-xl text-gray-600 mb-8">
                {t('marketExpertiseDesc')}
              </p>

              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h4 className="font-bold text-[#004a90] mb-2 flex items-center">
                    <i className="ri-government-line text-[#c3d021] mr-3"></i>
                    {t('regulatoryTitle')}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {t('regulatoryDesc')}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h4 className="font-bold text-[#004a90] mb-2 flex items-center">
                    <i className="ri-line-chart-line text-[#c3d021] mr-3"></i>
                    {t('marketDynamicsTitle')}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {t('marketDynamicsDesc')}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h4 className="font-bold text-[#004a90] mb-2 flex items-center">
                    <i className="ri-team-line text-[#c3d021] mr-3"></i>
                    {t('relationshipsTitle')}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {t('relationshipsDesc')}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <img
                src="/images/brand/service_consulting.png"
                alt="Panama Energy Market"
                className="w-full h-96 object-cover object-top rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Consulting Process - REPLACED with Specific PPA Flow */}
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
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="bg-white rounded-xl p-6 shadow-md border-t-4 border-[#c3d021] mt-8 md:mt-0">
                  <div className="w-10 h-10 bg-[#004a90] text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 mx-auto md:mx-0 relative z-20 ring-4 ring-white">
                    {step}
                  </div>
                  <h3 className="text-lg font-bold text-[#004a90] mb-3">
                    {t(`step${step}Title`)}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t(`step${step}Desc`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Preview */}
      <section className="py-20 bg-[#ffffff]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#004a90] mb-6">{t('provenResultsTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('provenResultsDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-3xl font-bold text-[#004a90] mb-2">$2.1M</div>
              <h4 className="font-bold text-[#004a90] mb-2">{t('annualSavingsTitle')}</h4>
              <p className="text-gray-600 text-sm">
                {t('annualSavingsDesc')}
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-3xl font-bold text-[#004a90] mb-2">35%</div>
              <h4 className="font-bold text-gray-900 mb-2">{t('costReductionTitle')}</h4>
              <p className="text-gray-600 text-sm">
                {t('costReductionDesc')}
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-3xl font-bold text-[#004a90] mb-2">18 Meses</div>
              <h4 className="font-bold text-gray-900 mb-2">{t('fasterRoiTitle')}</h4>
              <p className="text-gray-600 text-sm">
                {t('fasterRoiDesc')}
              </p>
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
            <Button href="/inquiry" size="lg" className="bg-[#c3d021] text-[#194271] hover:bg-teravolta-lime-dark">
              {t('scheduleConsultation')}
            </Button>
            <Button href="/projects" variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#004a90]">
              {t('viewProjects')}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
