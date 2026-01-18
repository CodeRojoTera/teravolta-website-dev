'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useLanguage } from '../../components/LanguageProvider';

export default function PrivacyPolicyPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            <Header />

            <main className="pt-32 pb-20">
                <div className="max-w-3xl mx-auto px-6">
                    <h1 className="text-4xl font-bold text-[#004a90] mb-2">{t('privacy.title')}</h1>
                    <p className="text-gray-500 mb-8">{t('privacy.lastUpdated')}</p>

                    <div className="prose prose-blue max-w-none">
                        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                            {t('privacy.intro')}
                        </p>

                        <div className="space-y-10">
                            <section>
                                <h2 className="text-2xl font-bold text-[#004a90] mb-4">{t('privacy.section1.title')}</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {t('privacy.section1.content')}
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-[#004a90] mb-4">{t('privacy.section2.title')}</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {t('privacy.section2.content')}
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-[#004a90] mb-4">{t('privacy.section3.title')}</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {t('privacy.section3.content')}
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-[#004a90] mb-4">{t('privacy.section4.title')}</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {t('privacy.section4.content')}
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
