'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useLanguage } from '../../components/LanguageProvider';

export default function TermsOfServicePage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            <Header />

            <main className="pt-32 pb-20">
                <div className="max-w-3xl mx-auto px-6">
                    <h1 className="text-4xl font-bold text-[#004a90] mb-2">{t('terms.title')}</h1>
                    <p className="text-gray-500 mb-8">{t('terms.lastUpdated')}</p>

                    <div className="prose prose-blue max-w-none">
                        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                            {t('terms.intro')}
                        </p>

                        <div className="space-y-10">
                            <section>
                                <h2 className="text-2xl font-bold text-[#004a90] mb-4">{t('terms.section1.title')}</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {t('terms.section1.content')}
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-[#004a90] mb-4">{t('terms.section2.title')}</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {t('terms.section2.content')}
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-[#004a90] mb-4">{t('terms.section3.title')}</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {t('terms.section3.content')}
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-[#004a90] mb-4">{t('terms.section4.title')}</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {t('terms.section4.content')}
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
