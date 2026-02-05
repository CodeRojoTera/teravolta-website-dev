
'use client';

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../components/LanguageProvider';
import { useAuth } from '../../../components/AuthProvider';

export default function AdvocacyPage() {
  const { language } = useLanguage();
  const { user } = useAuth();

  const content = {
    en: {
      heroTitle: "Service Quality",
      heroSubtitle: "We advise on claims regarding the quality of electrical service to Panamanian distributors and before the Regulatory Body (ASEP).",
      advocacyTitle: "Service Quality Advocacy",
      advocacySubtitle: "Expert representation and advocacy for electrical service quality disputes and regulatory matters",
      distributorTitle: "Distributor Claims Management",
      distributorDesc: "Professional management of service quality disputes with Panamanian energy distributors, ensuring you receive the reliable electrical service you're paying for.",
      powerQualityTitle: "Power Quality Issues",
      powerQualityDesc: "Voltage fluctuations, harmonics, and power factor problems affecting your equipment",
      interruptionsTitle: "Service Interruptions",
      interruptionsDesc: "Frequent outages and extended service disruptions impacting operations",
      billingDisputesTitle: "Billing Disputes",
      billingDisputesDesc: "Incorrect charges and meter reading discrepancies requiring resolution",
      infrastructureTitle: "Infrastructure Issues",
      infrastructureDesc: "Inadequate network capacity and maintenance problems affecting service reliability",
      asepTitle: "ASEP Regulatory Representation",
      asepDesc: "Expert representation before Panama's energy regulator (ASEP), ensuring your interests are properly represented in regulatory proceedings and compliance matters.",
      complaintsTitle: "Formal Complaints",
      complaintsDesc: "Filing and managing formal complaints with ASEP against distributors",
      participationTitle: "Regulatory Participation",
      participationDesc: "Representing your interests in tariff reviews and policy consultations",
      complianceTitle: "Compliance Monitoring",
      complianceDesc: "Ensuring distributors meet regulatory service quality standards",
      compensationTitle: "Compensation Claims",
      compensationDesc: "Securing appropriate compensation for service quality failures and losses",

      expertTitle: "Expert Representation",
      expertDesc: "Our deep understanding of Panama's energy regulatory framework and established relationships ensure effective advocacy for your interests.",
      trackRecordTitle: "Proven Track Record",
      trackRecordDesc: "95% success rate in service quality claims and regulatory proceedings",
      relationshipsTitle: "Industry Relationships",
      relationshipsDesc: "Established connections with distributors, ASEP, and key stakeholders",
      fasterTitle: "Faster Resolution",
      fasterDesc: "Average case resolution time of 3-6 months vs. 12+ months self-represented",
      maximumTitle: "Maximum Compensation",
      maximumDesc: "Secure full compensation for damages and service quality failures",
      storiesTitle: "Success Stories",
      storiesDesc: "Real results for real clients facing energy service challenges",
      compensationSecured: "Compensation Secured",
      manufacturingTitle: "Manufacturing Plant",
      manufacturingDesc: "Frequent power quality issues causing equipment damage and production losses.",
      manufacturingResult: "Result: Full compensation for damages plus infrastructure improvements by distributor.",
      averageResolution: "Average Resolution",
      commercialTitle: "Commercial Complex",
      commercialDesc: "Chronic billing errors resulting in overcharges of $15,000+ monthly.",
      commercialResult: "Result: Billing corrected, refunds issued, automated monitoring implemented.",
      serviceReliability: "Service Reliability",
      hospitalTitle: "Hospital Facility",
      hospitalDesc: "Critical service interruptions affecting patient care and safety.",
      hospitalResult: "Result: Priority service classification and backup power requirements implemented.",
      ctaTitle: "Protect Your Energy Service Rights",
      ctaDesc: "Don't let electrical service quality issues impact your operations. Get expert advocacy to resolve disputes effectively.",
      startCase: "Start Your Service Quality Case",
      discussSituation: "Discuss Your Situation",
      contactUs: "Contact Us",
      processTitle: "Our Advocacy Process",
      processSubtitle: "We handle the complexity of regulatory claims so you can focus on your business.",
      step1Title: "Audit & Detection",
      step1Desc: "Thorough audit of bills and technical quality to detect irregularities or overcharges.",
      step2Title: "Claim Formulation",
      step2Desc: "Preparation of a robust technical and legal claim supported by granular data.",
      step3Title: "Regulatory Representation",
      step3Desc: "We represent you before the distributor and the regulator (ASEP) during the dispute.",
      step4Title: "Resolution & Recovery",
      step4Desc: "Finalizing the process with the recovery of funds and permanent correction of tariffs.",
    },
    es: {
      heroTitle: "Calidad de Servicio y Defensoría",
      heroSubtitle: "Protegemos sus intereses ante las distribuidoras y el ente regulador (ASEP), asegurando calidad de servicio y facturación justa.",
      advocacyTitle: "Defensoría y Reclamos",
      advocacySubtitle: "Expertos en navegar el marco regulatorio para resolver disputas y corregir irregularidades.",
      distributorTitle: "Reclamos a Distribuidora",
      distributorDesc: "Gestión experta de reclamos directos con compañías de distribución para correcciones rápidas.",
      powerQualityTitle: "Calidad de Energía",
      powerQualityDesc: "Investigación técnica de interrupciones, fluctuaciones de voltaje y daños a equipos.",
      interruptionsTitle: "Interrupciones del Servicio",
      interruptionsDesc: "Cortes frecuentes y interrupciones prolongadas del servicio que impactan las operaciones",
      billingDisputesTitle: "Disputas de Facturación",
      billingDisputesDesc: "Cargos incorrectos y discrepancias en lecturas de medidores que requieren resolución",
      infrastructureTitle: "Infraestructura",
      infrastructureDesc: "Reclamos relacionados con daños a infraestructura y equipos debido a fallas en la red.",
      asepTitle: "Representación ante ASEP",
      asepDesc: "Representación formal ante la Autoridad Nacional de los Servicios Públicos para disputas escaladas.",
      complaintsTitle: "Quejas Formales",
      complaintsDesc: "Presentación y gestión de quejas formales ante ASEP contra distribuidoras",
      participationTitle: "Participación Regulatoria",
      participationDesc: "Representando tus intereses en revisiones tarifarias y consultas de políticas",
      complianceTitle: "Monitoreo de Cumplimiento",
      complianceDesc: "Asegurando que las distribuidoras cumplan con los estándares regulatorios de calidad del servicio",
      compensationTitle: "Reclamos de Compensación",
      compensationDesc: "Asegurando compensación apropiada por fallas de calidad del servicio y pérdidas",
      processTitle: "Nuestro Proceso de Defensoría",
      processSubtitle: "Manejamos la complejidad de los reclamos regulatorios para que usted pueda enfocarse en su negocio.",
      assessmentTitle: "Evaluación",
      assessmentDesc: "Evaluar problemas de calidad del servicio y documentar evidencia",
      documentationTitle: "Documentación",
      documentationDesc: "Preparar queja formal y evidencia técnica de apoyo",
      submissionTitle: "Presentación",
      submissionDesc: "Presentar queja ante distribuidoras y/o ASEP según corresponda",
      representationTitle: "Representación",
      representationDesc: "Defender tus intereses en procedimientos regulatorios",
      resolutionTitle: "Resolución",
      resolutionDesc: "Asegurar resultado favorable y compensación apropiada",
      expertTitle: "Representación Experta",
      expertDesc: "Nuestra comprensión profunda del marco regulatorio energético de Panamá y relaciones establecidas aseguran defensa efectiva para tus intereses.",
      trackRecordTitle: "Historial Comprobado",
      trackRecordDesc: "95% de tasa de éxito en reclamos de calidad del servicio y procedimientos regulatorios",
      relationshipsTitle: "Relaciones de la Industria",
      relationshipsDesc: "Conexiones establecidas con distribuidoras, ASEP y partes interesadas clave",
      fasterTitle: "Resolución Más Rápida",
      fasterDesc: "Tiempo promedio de resolución de casos de 3-6 meses vs. 12+ meses autorrepresentado",
      maximumTitle: "Compensación Máxima",
      maximumDesc: "Asegurar compensación completa por daños y fallas de calidad del servicio",
      storiesTitle: "Historias de Éxito",
      storiesDesc: "Resultados reales para clientes reales que enfrentan desafíos de servicios energéticos",
      compensationSecured: "Compensación Asegurada",
      manufacturingTitle: "Planta Manufacturera",
      manufacturingDesc: "Problemas frecuentes de calidad de energía causando daños a equipos y pérdidas de producción.",
      manufacturingResult: "Resultado: Compensación completa por daños más mejoras de infraestructura por parte de la distribuidora.",
      averageResolution: "Resolución Promedio",
      commercialTitle: "Complejo Comercial",
      commercialDesc: "Errores crónicos de facturación resultando en sobrecargos de $15,000+ mensuales.",
      commercialResult: "Resultado: Facturación corregida, reembolsos emitidos, monitoreo automatizado implementado.",
      serviceReliability: "Confiabilidad del Servicio",
      hospitalTitle: "Instalación Hospitalaria",
      hospitalDesc: "Interrupciones críticas del servicio afectando la atención al paciente y la seguridad.",
      hospitalResult: "Resultado: Clasificación de servicio prioritario y requisitos de energía de respaldo implementados.",
      ctaTitle: "Protege tus Derechos de Servicio Energético",
      ctaDesc: "No dejes que los problemas de calidad del servicio eléctrico impacten tus operaciones. Obtén defensa experta para resolver disputas efectivamente.",
      startCase: "Comenzar tu Caso de Calidad del Servicio",
      discussSituation: "Discute tu Situación",
      contactUs: "Contáctanos",
      billingTitle: "Disputas de Facturación",
      billingDesc: "Auditoría forense de facturas para identificar y recuperar sobrecargos históricos.",
      step1Title: "Auditoría y Detección",
      step1Desc: "Auditoría exhaustiva de facturas y calidad técnica para detectar irregularidades o sobrecargos.",
      step2Title: "Formulación del Reclamo",
      step2Desc: "Preparación de un reclamo técnico y legal robusto respaldado por datos granulares.",
      step3Title: "Representación Regulatoria",
      step3Desc: "Lo representamos ante la distribuidora y el regulador (ASEP) durante la disputa.",
      step4Title: "Resolución y Recuperación",
      step4Desc: "Finalización del proceso con la recuperación de fondos y corrección permanente de tarifas.",
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
            <h2 className="text-4xl font-bold text-[#004a90] mb-6">{t('advocacyTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('advocacySubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-16 h-16 flex items-center justify-center bg-[#004a90] rounded-full mb-6">
                <i className="ri-customer-service-line text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-[#004a90] mb-6">{t('distributorTitle')}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t('distributorDesc')}
              </p>

              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-bold text-[#004a90] mb-2 flex items-center">
                    <i className="ri-flashlight-line text-[#c3d021] mr-3"></i>
                    {t('powerQualityTitle')}
                  </h4>
                  <p className="text-gray-600 text-sm">{t('powerQualityDesc')}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-bold text-[#004a90] mb-2 flex items-center">
                    <i className="ri-time-line text-[#c3d021] mr-3"></i>
                    {t('interruptionsTitle')}
                  </h4>
                  <p className="text-gray-600 text-sm">{t('interruptionsDesc')}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-bold text-[#004a90] mb-2 flex items-center">
                    <i className="ri-file-text-line text-[#c3d021] mr-3"></i>
                    {t('billingDisputesTitle')}
                  </h4>
                  <p className="text-gray-600 text-sm">{t('billingDisputesDesc')}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-bold text-[#004a90] mb-2 flex items-center">
                    <i className="ri-tools-line text-[#c3d021] mr-3"></i>
                    {t('infrastructureTitle')}
                  </h4>
                  <p className="text-gray-600 text-sm">{t('infrastructureDesc')}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-16 h-16 flex items-center justify-center bg-[#004a90] rounded-full mb-6">
                <i className="ri-government-line text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-[#004a90] mb-6">{t('asepTitle')}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t('asepDesc')}
              </p>

              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-bold text-[#004a90] mb-2 flex items-center">
                    <i className="ri-scales-line text-[#c3d021] mr-3"></i>
                    {t('complaintsTitle')}
                  </h4>
                  <p className="text-gray-600 text-sm">{t('complaintsDesc')}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-bold text-[#004a90] mb-2 flex items-center">
                    <i className="ri-bookmark-line text-[#c3d021] mr-3"></i>
                    {t('participationTitle')}
                  </h4>
                  <p className="text-gray-600 text-sm">{t('participationDesc')}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-bold text-[#004a90] mb-2 flex items-center">
                    <i className="ri-shield-check-line text-[#c3d021] mr-3"></i>
                    {t('complianceTitle')}
                  </h4>
                  <p className="text-gray-600 text-sm">{t('complianceDesc')}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-bold text-[#004a90] mb-2 flex items-center">
                    <i className="ri-award-line text-[#c3d021] mr-3"></i>
                    {t('compensationTitle')}
                  </h4>
                  <p className="text-gray-600 text-sm">{t('compensationDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section - Specific Advocacy Flow */}
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

      {/* Why Choose Our Advocacy */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/images/brand/service_advocacy.png"
                alt="Energy Advocacy"
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
            </div>

            <div>
              <h2 className="text-4xl font-bold text-[#004a90] mb-6">{t('expertTitle')}</h2>
              <p className="text-xl text-gray-600 mb-8">
                {t('expertDesc')}
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#c3d021] rounded-full mr-4 flex-shrink-0">
                    <i className="ri-award-line text-xl" style={{ color: '#194271' }}></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#004a90] mb-1">{t('trackRecordTitle')}</h4>
                    <p className="text-gray-600 text-sm">{t('trackRecordDesc')}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#c3d021] rounded-full mr-4 flex-shrink-0">
                    <i className="ri-team-line text-xl" style={{ color: '#194271' }}></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{t('relationshipsTitle')}</h4>
                    <p className="text-gray-600 text-sm">{t('relationshipsDesc')}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#c3d021] rounded-full mr-4 flex-shrink-0">
                    <i className="ri-time-line text-xl" style={{ color: '#194271' }}></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{t('fasterTitle')}</h4>
                    <p className="text-gray-600 text-sm">{t('fasterDesc')}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#c3d021] rounded-full mr-4 flex-shrink-0">
                    <i className="ri-coins-line text-xl" style={{ color: '#194271' }}></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{t('maximumTitle')}</h4>
                    <p className="text-gray-600 text-sm">{t('maximumDesc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Success Stories */}


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
              {t('startCase')}
            </Button>
            <Button href="/inquiry" variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#004a90]">
              {t('discussSituation')}
            </Button>
          </div>
        </div>
      </section >

      <Footer />
    </div >
  );
}
