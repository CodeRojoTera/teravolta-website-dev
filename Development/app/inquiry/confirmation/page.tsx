
'use client';

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../components/LanguageProvider';

export default function ConfirmationPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <Header />

      {/* Confirmation Section */}
      <section className="py-20 bg-[#004A90] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <i className="ri-check-line text-4xl text-white"></i>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            {t('inquiry.confirmation.title')}
          </h1>

          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            {t('inquiry.confirmation.subtitle')}
          </p>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#004A90] mb-6" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                {t('inquiry.confirmation.whatNext')}
              </h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#004A90]/10 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <i className="ri-time-line text-[#004A90]"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#004A90] mb-2" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      {t('inquiry.confirmation.within24hours')}
                    </h3>
                    <p className="text-[#333333]" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      {t('inquiry.confirmation.within24hoursText')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#C3D021]/20 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <i className="ri-phone-line text-[#004A90]"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#004A90] mb-2" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      {t('inquiry.confirmation.initialConsultation')}
                    </h3>
                    <p className="text-[#333333]" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      {t('inquiry.confirmation.initialConsultationText')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#004A90]/10 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <i className="ri-file-text-line text-[#004A90]"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#004A90] mb-2" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      {t('inquiry.confirmation.customProposal')}
                    </h3>
                    <p className="text-[#333333]" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      {t('inquiry.confirmation.customProposalText')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-[#004A90] mb-6" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                {t('inquiry.confirmation.needHelp')}
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <i className="ri-phone-line text-[#004A90] mr-3"></i>
                  <span className="text-[#333333]" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                    {t('inquiry.confirmation.phone')}
                  </span>
                </div>

                <div className="flex items-center">
                  <i className="ri-mail-line text-[#004A90] mr-3"></i>
                  <span className="text-[#333333]" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                    {t('inquiry.confirmation.email')}
                  </span>
                </div>

                <div className="flex items-center">
                  <i className="ri-time-line text-[#004A90] mr-3"></i>
                  <span className="text-[#333333]" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                    {t('inquiry.confirmation.schedule')}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Button href="/" className="w-full whitespace-nowrap bg-[#C3D021] hover:bg-[#A8B91E] text-[#333333]">
                  <i className="ri-home-line mr-2"></i>
                  {t('inquiry.confirmation.backToHome')}
                </Button>

                <Button href="/services" variant="outline" className="w-full whitespace-nowrap border-[#004A90] text-[#004A90] hover:bg-[#004A90] hover:text-white">
                  <i className="ri-service-line mr-2"></i>
                  {t('inquiry.confirmation.viewServices')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
