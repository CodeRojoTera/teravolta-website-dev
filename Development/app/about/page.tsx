
'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useLanguage } from '../../components/LanguageProvider';
import { useAuth } from '../../components/AuthProvider';

export default function AboutPage() {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
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

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('about.title') || 'Sobre TeraVolta'}
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            {t('about.heroDescription') || 'Transformando la gestión energética en Centroamérica a través de soluciones basadas en datos y tecnología de vanguardia.'}
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#004a90]">
                {t('about.ourStoryTitle') || 'Nuestra Historia'}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {t('about.ourStoryText1') || 'TeraVolta fue fundada en Panamá con la misión de revolucionar cómo las empresas entienden y gestionan su consumo energético. Nacimos del reconocimiento de que la industria energética tradicional opera con demasiadas suposiciones y muy pocos datos concretos.'}
              </p>
              <p className="text-lg text-gray-600 mb-6">
                {t('about.ourStoryText2') || 'TeraVolta nace de una alianza estratégica entre emprendedores tecnológicos y RL Consulting SA, una firma con más de 8 años de experiencia en el sector energético regional. Esta unión combina la agilidad de la innovación digital con la solidez de la consultoría experta.'}
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Nuestro enfoque se basa en análisis de datos precisos, tecnología IoT avanzada y soluciones personalizadas que entregan resultados medibles y transparentes para cada cliente.
              </p>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#004a90' }}>
                {t('about.dataGapTitle') || 'El Desafío de la Brecha de Datos'}
              </h3>
              <p className="text-lg text-gray-600">
                {t('about.dataGapText') || 'Identificamos que más del 80% de las empresas en Centroamérica toman decisiones energéticas sin datos suficientes. TeraVolta cierra esta brecha con monitoreo en tiempo real y análisis predictivo.'}
              </p>
            </div>
            <div className="relative">
              <img
                src="/images/brand/about_data_center.png"
                alt="Centro de Análisis TeraVolta"
                className="w-full h-96 object-cover object-top rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section - RESTORED */}
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

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('about.impactTitle') || 'Nuestro Impacto en Números'}
            </h2>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              {t('about.impactDescription') || 'Resultados reales que demuestran el poder de las soluciones energéticas basadas en datos. (Cifras estimadas de la industria, pendientes de verificación final)'}
            </p>
            <div className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mt-2">
              Data Pending Verification
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#c3d021' }}>500+</div>
              <p className="text-lg opacity-90">{t('about.clientsServed') || 'Clientes Atendidos'}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#c3d021' }}>$12M</div>
              <p className="text-lg opacity-90">{t('about.totalSavings') || 'Ahorros Generados'}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#c3d021' }}>25%</div>
              <p className="text-lg opacity-90">{t('about.avgReduction') || 'Reducción Promedio'}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#c3d021' }}>5,000</div>
              <p className="text-lg opacity-90">{t('about.co2Reduction') || 'Toneladas CO₂ Evitadas'}</p>
            </div>
          </div>
        </div>
      </section >

      {/* Our Values - RESTORED ORIGINAL VALUES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#004a90]">
              {t('about.ourValues') || 'Nuestros Valores Fundamentales'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6" style={{ backgroundColor: '#c3d021' }}>
                <i className="ri-shield-check-line text-2xl" style={{ color: '#004a90' }}></i>
              </div>
              <h3 className="font-bold text-xl mb-4" style={{ color: '#004a90' }}>
                {t('about.integrityTitle') || 'Integridad'}
              </h3>
              <p className="text-gray-600">
                {t('about.integrityText') || 'Operamos con transparencia absoluta, proporcionando datos precisos y recomendaciones honestas que priorizan los mejores intereses de nuestros clientes por encima de todo.'}
              </p>
            </div>

            <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6" style={{ backgroundColor: '#c3d021' }}>
                <i className="ri-lightbulb-line text-2xl" style={{ color: '#004a90' }}></i>
              </div>
              <h3 className="font-bold text-xl mb-4" style={{ color: '#004a90' }}>
                {t('about.innovationTitle') || 'Innovación'}
              </h3>
              <p className="text-gray-600">
                {t('about.innovationText') || 'Adoptamos tecnologías emergentes y metodologías de vanguardia para mantenernos a la cabeza de la evolución del sector energético y ofrecer soluciones superiores.'}
              </p>
            </div>

            <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6" style={{ backgroundColor: '#c3d021' }}>
                <i className="ri-team-line text-2xl" style={{ color: '#004a90' }}></i>
              </div>
              <h3 className="font-bold text-xl mb-4" style={{ color: '#004a90' }}>
                {t('about.collaborationTitle') || 'Colaboración'}
              </h3>
              <p className="text-gray-600">
                {t('about.collaborationText') || 'Creemos en el poder de trabajar juntos. Construimos relaciones sólidas con clientes, socios y comunidades para crear un futuro energético más sostenible.'}
              </p>
            </div>
          </div>
        </div>
      </section >

      {/* Founders Section - RESTORED ORIGINAL DESIGN */}
      < section className="py-20 bg-white" >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#004a90]">
              {t('about.foundersTitle') || 'Conoce a Nuestros Fundadores'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.foundersDescription') || 'Una combinación única de experiencia tecnológica, conocimiento de la industria energética e innovación en ciencia de datos'}
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <img
                src="/images/brand/founder_agustin.jpg"
                alt="Agustín Ledesma"
                className="w-32 h-32 object-cover object-top rounded-full mx-auto mb-6"
              />
              <h3 className="font-bold text-xl mb-2 text-[#004a90]">Agustín Ledesma</h3>
              <p className="text-sm font-medium mb-4" style={{ color: '#0066CC' }}>
                {t('about.agustinTitle') || 'Co-Fundador y Director de Tecnología'}
              </p>

              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                {t('about.agustinBio') || 'Emprendedor en STEM graduado de Florida State University, Agustín fusiona una sólida formación técnica en ciencias de la computación con una visión estratégica en innovación energética.'}
              </p>

              <div className="space-y-3 text-xs text-gray-500">
                <div className="flex items-center">
                  <i className="ri-graduation-cap-line w-4 h-4 flex items-center justify-center mr-2" style={{ color: '#0066CC' }}></i>
                  <span>{t('about.agustinEducation') || 'B.S. en Emprendimiento STEM, Florida State University (Minors en Innovación y CS)'}</span>
                </div>
                <div className="flex items-center">
                  <i className="ri-briefcase-line w-4 h-4 flex items-center justify-center mr-2" style={{ color: '#0066CC' }}></i>
                  <span>{t('about.agustinExperience') || 'Experiencia: Soluciones IA, chatbots y prototipado de sistemas de datos.'}</span>
                </div>
                <div className="flex items-center">
                  <i className="ri-settings-line w-4 h-4 flex items-center justify-center mr-2" style={{ color: '#0066CC' }}></i>
                  <span>{t('about.agustinSpecialty') || 'Especialidad: Estrategia tecnológica, analítica energética y optimización digital.'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <img
                src="/images/brand/founder_roque.png"
                alt="Roque Villareal"
                className="w-32 h-32 object-cover object-top rounded-full mx-auto mb-6"
              />
              <h3 className="font-bold text-xl mb-2 text-[#004a90]">Roque Villareal</h3>
              <p className="text-sm font-medium mb-4" style={{ color: '#00B050' }}>
                {t('about.roqueTitle') || 'CTO & Co-fundador'}
              </p>

              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                {t('about.roqueBio') || 'Veterano de la industria energética con más de 20 años en generación, distribución y regulación de energía. Ex-comisionado de ASEP y consultor energético. Roque aporta conocimiento profundo sin igual y experiencia regulatoria.'}
              </p>

              <div className="space-y-3 text-xs text-gray-500">
                <div className="flex items-center">
                  <i className="ri-graduation-cap-line w-4 h-4 flex items-center justify-center mr-2" style={{ color: '#00B050' }}></i>
                  <span>{t('about.roqueEducation') || 'MS Ingeniería Eléctrica, Universidad Tecnológica de Panamá'}</span>
                </div>
                <div className="flex items-center">
                  <i className="ri-briefcase-line w-4 h-4 flex items-center justify-center mr-2" style={{ color: '#00B050' }}></i>
                  <span>{t('about.roqueExperience') || 'Anterior: Comisionado ASEP, AES Panamá'}</span>
                </div>
                <div className="flex items-center">
                  <i className="ri-settings-line w-4 h-4 flex items-center justify-center mr-2" style={{ color: '#00B050' }}></i>
                  <span>{t('about.roqueSpecialty') || 'Especialidad: Sistemas Eléctricos, Regulación, Análisis de Mercado'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <img
                src="/images/brand/founder_alex.png"
                alt="Alex Chen"
                className="w-32 h-32 object-cover object-top rounded-full mx-auto mb-6"
              />
              <h3 className="font-bold text-xl mb-2 text-[#004a90]">Alex Chen</h3>
              <p className="text-sm font-medium mb-4" style={{ color: '#FF6600' }}>
                {t('about.alexTitle') || 'COO & Co-fundador'}
              </p>

              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                {t('about.alexBio') || 'Innovador en ciencia de datos con experiencia en aprendizaje automático y análisis energético. PhD en Matemáticas Aplicadas con enfoque en análisis de series temporales y modelado predictivo para sistemas energéticos.'}
              </p>

              <div className="space-y-3 text-xs text-gray-500">
                <div className="flex items-center">
                  <i className="ri-graduation-cap-line w-4 h-4 flex items-center justify-center mr-2" style={{ color: '#FF6600' }}></i>
                  <span>{t('about.alexEducation') || 'PhD Matemáticas Aplicadas, MIT'}</span>
                </div>
                <div className="flex items-center">
                  <i className="ri-briefcase-line w-4 h-4 flex items-center justify-center mr-2" style={{ color: '#FF6600' }}></i>
                  <span>{t('about.alexExperience') || 'Anterior: Tesla Energy, McKinsey Analytics'}</span>
                </div>
                <div className="flex items-center">
                  <i className="ri-settings-line w-4 h-4 flex items-center justify-center mr-2" style={{ color: '#FF6600' }}></i>
                  <span>{t('about.alexSpecialty') || 'Especialidad: ML, Análisis Predictivo, Modelado Energético'}</span>
                </div>
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

              <div className="bg-white rounded-xl shadow-lg p-6 text-center flex-shrink-0" style={{ minWidth: '280px', width: '280px' }}>
                <img
                  src="/images/brand/founder_agustin.jpg"
                  alt="Agustín Ledesma"
                  className="w-24 h-24 object-cover object-top rounded-full mx-auto mb-4"
                />
                <h3 className="font-bold text-lg mb-2 text-[#004a90]">Agustín Ledesma</h3>
                <p className="text-xs font-medium mb-3" style={{ color: '#0066CC' }}>
                  {t('about.agustinTitle') || 'Co-Fundador y Director de Tecnología'}
                </p>

                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  {t('about.agustinBio') || 'Emprendedor en STEM graduado de Florida State University, Agustín fusiona formación técnica con visión estratégica en innovación energética.'}
                </p>

                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center text-xs">
                    <i className="ri-graduation-cap-line w-3 h-3 flex items-center justify-center mr-2" style={{ color: '#0066CC' }}></i>
                    <span>{t('about.agustinEducation') || 'B.S. en Emprendimiento STEM, Florida State University'}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <i className="ri-briefcase-line w-3 h-3 flex items-center justify-center mr-2" style={{ color: '#0066CC' }}></i>
                    <span>{t('about.agustinExperience') || 'Experiencia: Soluciones IA y sistemas de datos.'}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <i className="ri-settings-line w-3 h-3 flex items-center justify-center mr-2" style={{ color: '#0066CC' }}></i>
                    <span>{t('about.agustinSpecialty') || 'Especialidad: Estrategia tecnológica y optimización.'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 text-center flex-shrink-0" style={{ minWidth: '280px', width: '280px' }}>
                <img
                  src="/images/brand/founder_roque.png"
                  alt="Roque Villareal"
                  className="w-24 h-24 object-cover object-top rounded-full mx-auto mb-4"
                />
                <h3 className="font-bold text-lg mb-2 text-[#004a90]">Roque Villareal</h3>
                <p className="text-xs font-medium mb-3" style={{ color: '#00B050' }}>
                  {t('about.roqueTitle') || 'CTO & Co-fundador'}
                </p>

                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  {t('about.roqueBio') || 'Veterano de la industria energética con más de 20 años en generación, distribución y regulación de energía. Ex-comisionado de ASEP y consultor energético. Roque aporta conocimiento profundo sin igual y experiencia regulatoria.'}
                </p>

                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center text-xs">
                    <i className="ri-graduation-cap-line w-3 h-3 flex items-center justify-center mr-2" style={{ color: '#00B050' }}></i>
                    <span>{t('about.roqueEducation') || 'MS Ingeniería Eléctrica, Universidad Tecnológica de Panamá'}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <i className="ri-briefcase-line w-3 h-3 flex items-center justify-center mr-2" style={{ color: '#00B050' }}></i>
                    <span>{t('about.roqueExperience') || 'Anterior: Comisionado ASEP, AES Panamá'}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <i className="ri-settings-line w-3 h-3 flex items-center justify-center mr-2" style={{ color: '#00B050' }}></i>
                    <span>{t('about.roqueSpecialty') || 'Especialidad: Sistemas Eléctricos, Regulación, Análisis de Mercado'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 text-center flex-shrink-0" style={{ minWidth: '280px', width: '280px' }}>
                <img
                  src="/images/brand/founder_alex.png"
                  alt="Alex Chen"
                  className="w-24 h-24 object-cover object-top rounded-full mx-auto mb-4"
                />
                <h3 className="font-bold text-lg mb-2 text-[#004a90]">Alex Chen</h3>
                <p className="text-xs font-medium mb-3" style={{ color: '#FF6600' }}>
                  {t('about.alexTitle') || 'COO & Co-fundador'}
                </p>

                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  {t('about.alexBio') || 'Innovador en ciencia de datos con experiencia en aprendizaje automático y análisis energético. PhD en Matemáticas Aplicadas con enfoque en análisis de series temporales y modelado predictivo para sistemas energéticos.'}
                </p>

                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center text-xs">
                    <i className="ri-graduation-cap-line w-3 h-3 flex items-center justify-center mr-2" style={{ color: '#FF6600' }}></i>
                    <span>{t('about.alexEducation') || 'PhD Matemáticas Aplicadas, MIT'}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <i className="ri-briefcase-line w-3 h-3 flex items-center justify-center mr-2" style={{ color: '#FF6600' }}></i>
                    <span>{t('about.alexExperience') || 'Anterior: Tesla Energy, McKinsey Analytics'}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <i className="ri-settings-line w-3 h-3 flex items-center justify-center mr-2" style={{ color: '#FF6600' }}></i>
                    <span>{t('about.alexSpecialty') || 'Especialidad: ML, Análisis Predictivo, Modelado Energético'}</span>
                  </div>
                </div>
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
      </section >

      {/* Call to Action */}
      < section className="py-20 bg-white" >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#004a90]">
            {t('about.ctaTitle') || '¿Listo para Transformar tu Gestión Energética?'}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('about.ctaDescription') || 'Únete a cientos de clientes satisfechos que ya han optimizado su consumo energético con nuestras soluciones basadas en datos.'}
          </p>
          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/quote"
              className="px-8 py-3 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap bg-[#c3d021] text-[#194271] hover:bg-[#a5b01c]"
            >
              {t('hero.cta.primary') || 'Get Quote'}
            </a>
            <a
              href="/contact"
              className="px-8 py-3 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap border-2 border-[#004a90] text-[#004a90] bg-transparent hover:bg-[#004a90] hover:text-white"
            >
              {t('about.contactUs') || 'Contact Us'}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div >
  );
}
