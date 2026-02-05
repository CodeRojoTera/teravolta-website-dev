
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../components/LanguageProvider';

function QuoteResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  // Get form data from URL params
  const propertyType = searchParams.get('propertyType') || 'residential';
  const propertySize = parseInt(searchParams.get('propertySize') || '2500');
  const currentBill = searchParams.get('currentBill') || '250-500';
  const name = searchParams.get('name') || 'Ana Garcia';
  const company = searchParams.get('company') || 'My Company';
  const deviceOption = searchParams.get('deviceOption') || 'purchase';
  const connectivity = searchParams.get('connectivity') || 'wifi';

  // Calculate pricing and analysis
  const monthlyBillAvg = 1850;
  const yearlyBillTotal = monthlyBillAvg * 12;
  const potentialSavingsPercent = 32;
  const annualSavings = Math.round(yearlyBillTotal * (potentialSavingsPercent / 100));
  const monthlySavings = Math.round(annualSavings / 12);

  // Peak consumption analysis
  const peakHours = {
    morning: { time: '7:00-9:00 AM', consumption: '4.2 kWh', cost: '$168' },
    afternoon: { time: '2:00-4:00 PM', consumption: '5.8 kWh', cost: '$232' },
    evening: { time: '6:00-8:00 PM', consumption: '6.5 kWh', cost: '$260' }
  };

  // Analysis data
  const analysisData = {
    averageMonthlyBill: monthlyBillAvg,
    yearlyTotal: yearlyBillTotal,
    peakDemand: '8.5 kW',
    avgDailyConsumption: '42.3 kWh',
    efficiencyRating: t('quote.results.belowAverage'),
    wasteFactors: [
      t('quote.results.wasteFactor1'),
      t('quote.results.wasteFactor2'),
      t('quote.results.wasteFactor3'),
      t('quote.results.wasteFactor4')
    ]
  };

  const handleContactClick = () => {
    router.push('/contact?source=quote-results');
  };

  const handleProceedToPayment = () => {
    const params = new URLSearchParams({
      quoteId: searchParams.get('quoteId') || '',
      name: name,
      email: searchParams.get('email') || '',
      phone: searchParams.get('phone') || '',
      address: searchParams.get('address') || ''
    });
    router.push(`/services/efficiency/contratar?${params.toString()}`);
  };

  const getPropertyTypeName = (type: string) => {
    switch (type) {
      case 'residential':
        return t('property.residential');
      case 'apartment':
        return t('property.apartment');
      case 'small-business':
        return t('property.smallBusiness');
      case 'office':
        return t('property.office');
      case 'industrial':
        return t('property.industrial');
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen font-[\'Gilroy\'] bg-white">
      <Header />

      {/* Results Header */}
      <section className="py-16 bg-[#004A90] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-white/20 rounded-full px-4 py-2 mb-6">
              <i className="ri-check-line text-white mr-2"></i>
              <span className="text-sm font-medium">{t('quote.results.analysisComplete')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{t('quote.results.title')}</h1>
            <p className="text-xl mb-2 text-white">¡{t('quote.results.hello')} {name}!</p>
            {company !== 'My Company' && <p className="text-lg opacity-90 text-white">{t('quote.results.company')}: {company}</p>}
            <p className="text-lg opacity-90 text-white">Propiedad de {propertySize} {t('quote.results.property')}: {getPropertyTypeName(propertyType)}</p>

            {/* Pre-Analysis Notice */}
            <div className="mt-6 bg-[#C3D021]/20 border border-[#C3D021]/30 rounded-xl p-4 text-left max-w-2xl mx-auto">
              <div className="flex items-start">
                <i className="ri-information-line text-[#C3D021] mr-3 mt-0.5 text-lg"></i>
                <div>
                  <h4 className="font-bold text-white mb-1">{t('quote.results.preliminaryNotice')}</h4>
                  <p className="text-sm text-white/90">
                    {t('quote.results.preliminaryText')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bill Analysis */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-[#004A90] mb-8 text-center">{t('quote.results.billAnalysis')}</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Current Consumption */}
              <div className="bg-white rounded-2xl p-8 border-2 border-[#004A90]/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#194271] rounded-full mr-4">
                    <i className="ri-flashlight-line text-white text-xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-[#004A90]">{t('quote.results.currentConsumption')}</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-[#004A90]/20">
                    <span className="text-[#333333]">{t('quote.results.monthlyAverage')}</span>
                    <span className="text-2xl font-bold text-[#004A90]">${analysisData.averageMonthlyBill.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-[#004A90]/20">
                    <span className="text-[#333333]">{t('quote.results.annualTotal')}</span>
                    <span className="text-xl font-bold text-[#004A90]">${analysisData.yearlyTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-[#004A90]/20">
                    <span className="text-[#333333]">{t('quote.results.peakDemand')}</span>
                    <span className="font-bold text-[#C3D021]">{analysisData.peakDemand}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-[#333333]">{t('quote.results.avgDailyConsumption')}</span>
                    <span className="font-bold text-[#C3D021]">{analysisData.avgDailyConsumption}</span>
                  </div>
                </div>

                {/* Estimation Note */}
                <div className="mt-6 p-3 bg-[#004A90]/10 rounded-lg">
                  <p className="text-xs text-[#004A90]">
                    <i className="ri-information-line mr-1"></i>
                    {t('quote.results.estimationNote')}
                  </p>
                </div>
              </div>

              {/* Efficiency Rating */}
              <div className="bg-white rounded-2xl p-8 border-2 border-[#004A90]/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#194271] rounded-full mr-4">
                    <i className="ri-speed-line text-white text-xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-[#004A90]">{t('quote.results.efficiencyRating')}</h3>
                </div>

                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-[#C3D021] mb-2">C+ {t('quote.results.belowAverage')}</div>
                  <p className="text-[#333333]">{t('quote.results.consumesMore')}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-[#004A90] mb-3">{t('quote.results.wasteFactors')}</h4>
                  {analysisData.wasteFactors.map((factor, index) => (
                    <div key={index} className="flex items-start">
                      <i className="ri-close-circle-line text-red-500 mr-2 mt-0.5 flex-shrink-0"></i>
                      <span className="text-sm text-[#333333]">{factor}</span>
                    </div>
                  ))}
                </div>

                {/* Analysis Limitation Note */}
                <div className="mt-6 p-3 bg-[#004A90]/10 rounded-lg">
                  <p className="text-xs text-[#004A90]">
                    <i className="ri-information-line mr-1"></i>
                    {t('quote.results.preliminaryAnalysisNote')}
                  </p>
                </div>
              </div>
            </div>

            {/* Peak Hours Analysis */}
            <div className="bg-white rounded-2xl p-8 border-2 border-[#004A90]/20 mb-8">
              <h3 className="text-2xl font-bold text-[#004A90] mb-6 text-center">{t('quote.results.peakHoursAnalysis')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 text-center">
                  <h4 className="font-bold text-[#004A90] mb-2">{t('quote.results.morning')}</h4>
                  <div className="text-lg font-bold text-[#004A90] mb-1">{peakHours.morning.time}</div>
                  <div className="text-sm text-[#333333] mb-2">{peakHours.morning.consumption}</div>
                  <div className="text-lg font-bold text-[#C3D021]">{peakHours.morning.cost}/mes</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center">
                  <h4 className="font-bold text-[#004A90] mb-2">{t('quote.results.afternoon')}</h4>
                  <div className="text-lg font-bold text-[#004A90] mb-1">{peakHours.afternoon.time}</div>
                  <div className="text-sm text-[#333333] mb-2">{peakHours.afternoon.consumption}</div>
                  <div className="text-lg font-bold text-[#C3D021]">{peakHours.afternoon.cost}/mes</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center">
                  <h4 className="font-bold text-[#004A90] mb-2">{t('quote.results.evening')}</h4>
                  <div className="text-lg font-bold text-[#004A90] mb-1">{peakHours.evening.time}</div>
                  <div className="text-sm text-[#333333] mb-2">{peakHours.evening.consumption}</div>
                  <div className="text-lg font-bold text-[#C3D021]">{peakHours.evening.cost}/mes</div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-[#C3D021]/20 rounded-xl text-center">
                <p className="text-sm text-[#333333]">
                  <i className="ri-lightbulb-line text-[#C3D021] mr-1"></i>
                  <strong className="text-[#004A90]">{t('quote.results.opportunity')}:</strong> {t('quote.results.opportunityText')}
                </p>
              </div>
              <div className="mt-4 p-3 bg-[#004A90]/10 rounded-lg">
                <p className="text-xs text-[#004A90]">
                  <i className="ri-information-line mr-1"></i>
                  {t('quote.results.estimationNote')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Savings Potential */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#004A90] mb-4">{t('quote.results.savingsPotential')}</h2>
            <p className="text-lg text-[#333333] mb-8">{t('quote.results.preliminaryProjections')}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 flex items-center justify-center bg-[#c3d021] rounded-full mx-auto mb-4">
                  <i className="ri-coins-line text-2xl" style={{ color: '#194271' }}></i>
                </div>
                <h3 className="text-xl font-bold text-[#004A90] mb-2">{t('quote.results.monthlySavings')}</h3>
                <div className="text-4xl font-bold text-[#C3D021] mb-2">${monthlySavings.toLocaleString()}</div>
                <p className="text-[#333333] text-sm">{potentialSavingsPercent}% {t('quote.results.reduction')}</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 flex items-center justify-center bg-[#194271] rounded-full mx-auto mb-4">
                  <i className="ri-calendar-event-line text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-[#004A90] mb-2">{t('quote.results.annualSavings')}</h3>
                <div className="text-4xl font-bold text-[#004A90] mb-2">${annualSavings.toLocaleString()}</div>
                <p className="text-[#333333] text-sm">{t('quote.results.basedOnOptimization')}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#004A90] to-[#C3D021] rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">{t('quote.results.fiveYearProjection')}</h3>
              <div className="text-5xl font-bold mb-2">${(annualSavings * 5).toLocaleString()}</div>
              <p className="text-lg opacity-90">{t('quote.results.totalEstimatedSavings')}</p>
              <div className="mt-4 p-3 bg-white/20 rounded-lg">
                <p className="text-sm opacity-90">
                  <i className="ri-information-line mr-1"></i>
                  {t('quote.results.projectionsNote')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Summary */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#004A90] mb-8 text-center">{t('quote.results.quoteSummary')}</h2>

            <div className="bg-white rounded-2xl p-8 border-2 border-[#004A90]/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold text-[#004A90] mb-4">{t('quote.results.serviceDetails')}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[#333333]">{t('quote.results.selectedService')}</span>
                      <span className="font-medium text-[#004A90]">{t('quote.results.energyEfficiency')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#333333]">{t('quote.results.propertyType')}</span>
                      <span className="font-medium text-[#004A90] capitalize">{getPropertyTypeName(propertyType)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#333333]">{t('quote.results.area')}</span>
                      <span className="font-medium text-[#004A90]">{propertySize} {t('quote.results.sqFeet')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#333333]">{t('quote.results.measurementDevice')}</span>
                      <span className="font-medium text-[#004A90]">{deviceOption === 'purchase' ? t('quote.results.purchase') : t('quote.results.rental')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#333333]">{t('quote.results.connectivity')}</span>
                      <span className="font-medium text-[#004A90]">{connectivity === 'wifi' ? 'Wi-Fi' : '3G'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-[#004A90] mb-4">{t('quote.results.estimatedInvestment')}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[#333333]">{t('quote.results.analysisOptimization')}</span>
                      <span className="font-medium text-[#C3D021]">$2,850</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#333333]">{t('quote.results.measurementDevice')}</span>
                      <span className="font-medium text-[#C3D021]">{deviceOption === 'purchase' ? '$850' : '$45/mes'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#333333]">{connectivity === 'wifi' ? t('quote.results.wifiConnectivity') : t('quote.results.connectivity3g')}</span>
                      <span className="font-medium text-[#C3D021]">{connectivity === 'wifi' ? t('quote.results.included') : '$25/mes'}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-[#004A90]">{t('quote.results.initialTotal')}</span>
                        <span className="text-[#004A90]">$3,700</span>
                      </div>
                      {(deviceOption === 'rental' || connectivity === '3g') && (
                        <div className="flex justify-between text-sm text-[#333333] mt-1">
                          <span>{t('quote.results.additionalMonthlyCost')}</span>
                          <span>${(deviceOption === 'rental' ? 45 : 0) + (connectivity === '3g' ? 25 : 0)}/mes</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-[#C3D021]/20 rounded-xl">
                <div className="text-center">
                  <h5 className="font-bold text-[#004A90] mb-2">{t('quote.results.roi')}</h5>
                  <p className="text-sm text-[#333333]">
                    {t('quote.results.roiText')
                      .replace('${savings}', `$${monthlySavings.toLocaleString()}`)
                      .replace('{months}', Math.round(3700 / monthlySavings).toString())}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#004A90] mb-6">{t('quote.results.whatNext')}</h2>
          <p className="text-xl text-[#333333] mb-8">
            {t('quote.results.preliminaryText2')}
          </p>
          <p className="text-lg text-[#333333] mb-12">
            {t('quote.results.twoOptions')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 flex items-center justify-center bg-[#194271] rounded-full mx-auto mb-6">
                <i className="ri-information-line text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-[#004A90] mb-4">{t('quote.results.haveQuestions')}</h3>
              <p className="text-[#333333] mb-6">
                {t('quote.results.talkToExperts')}
              </p>
              <Button
                onClick={handleContactClick}
                variant="outline"
                size="lg"
                className="w-full border-[#004A90] text-[#004A90] hover:bg-[#004A90]/10 whitespace-nowrap"
              >
                <i className="ri-phone-line mr-2"></i>
                {t('quote.results.contactExpert')}
              </Button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg ring-2 ring-[#C3D021] ring-offset-2">
              <div className="w-16 h-16 flex items-center justify-center bg-[#c3d021] rounded-full mx-auto mb-6">
                <i className="ri-send-plane-line text-2xl" style={{ color: '#194271' }}></i>
              </div>
              <h3 className="text-xl font-bold text-[#004A90] mb-4">{t('quote.results.startNow')}</h3>
              <p className="text-[#333333] mb-6">
                {t('quote.results.proceedPayment')}
              </p>
              <Button
                onClick={handleProceedToPayment}
                size="lg"
                className="w-full bg-[#C3D021] hover:bg-teravolta-lime-dark text-[#194271] font-bold whitespace-nowrap"
              >
                <i className="ri-secure-payment-line mr-2"></i>
                {t('quote.results.proceedToPayment')}
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6">
            <div className="flex items-center justify-center">
              <i className="ri-shield-check-line text-[#C3D021] mr-2"></i>
              <span className="text-sm text-[#333333]">
                {t('quote.results.guarantee')}
              </span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function QuoteResults() {
  const { t } = useLanguage();

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004A90] mx-auto mb-4"></div>
          <p className="text-[#004A90]">{t('quote.results.loadingAnalysis')}</p>
        </div>
      </div>
    }>
      <QuoteResultsContent />
    </Suspense>
  );
}
