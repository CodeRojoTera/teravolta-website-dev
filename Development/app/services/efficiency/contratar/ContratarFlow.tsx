
'use client';

import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import Button from '../../../../components/ui/Button';
import { useLanguage } from '../../../../components/LanguageProvider';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ActiveProjectService } from '@/app/services/activeProjectService';
import { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import dynamic from 'next/dynamic';
import { TechnicianService } from '../../technicianService';
import { AppointmentService } from '../../appointmentService';
import { supabase } from '@/lib/supabase';

const PhoneInput = dynamic(() => import('react-phone-number-input'), {
  ssr: false,
});

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  installationDate: string;
  installationTime: string;
}

import { useAuth } from '@/components/AuthProvider';

export default function ContratarFlow() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const isMountedRef = useRef(false);
  const [isClient, setIsClient] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    installationDate: '',
    installationTime: ''
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const [prefillData, setPrefillData] = useState<any>(null);
  const [quoteData, setQuoteData] = useState<any>(null);

  useEffect(() => {
    const quoteId = searchParams.get('quoteId');
    if (quoteId) {
      const fetchQuote = async () => {
        try {
          const { data, error } = await supabase
            .from('quotes')
            .select('*')
            .eq('id', quoteId)
            .single();

          if (data) {
            setQuoteData(data);
            // Auto-fill form from quote if generic params missing
            setFormData((prev) => ({
              ...prev,
              fullName: prev.fullName || data.client_name || '',
              email: prev.email || data.client_email || '',
              phone: prev.phone || data.client_phone || '',
              address: prev.address || (data.address as any)?.street || ''
            }));
          }
        } catch (err) {
          console.error('Error fetching quote:', err);
        }
      };
      fetchQuote();
    }
  }, [searchParams]);

  useEffect(() => {
    isMountedRef.current = true;
    setIsClient(true);

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const prefillInfo = {
        name: urlParams.get('name') || '',
        email: urlParams.get('email') || '',
        phone: urlParams.get('phone') || '',
        address: urlParams.get('address') || ''
      };

      if (prefillInfo.name || prefillInfo.email) {
        setFormData(prev => ({
          ...prev,
          fullName: prefillInfo.name,
          email: prefillInfo.email,
          phone: prefillInfo.phone,
          address: prefillInfo.address
        }));
        setPrefillData(prefillInfo);
      }
    }

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);

    const dayOfWeek = date.getDay();
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();

    const weekdays = [
      t('contract.days.DOM') || 'SUN',
      t('contract.days.LUN') || 'MON',
      t('contract.days.MAR') || 'TUE',
      t('contract.days.MIE') || 'WED',
      t('contract.days.JUE') || 'THU',
      t('contract.days.VIE') || 'FRI',
      t('contract.days.SAB') || 'SAT'
    ];

    const months = [
      t('contract.months.Ene') || 'Jan',
      t('contract.months.Feb') || 'Feb',
      t('contract.months.Mar') || 'Mar',
      t('contract.months.Abr') || 'Apr',
      t('contract.months.May') || 'May',
      t('contract.months.Jun') || 'Jun',
      t('contract.months.Jul') || 'Jul',
      t('contract.months.Ago') || 'Aug',
      t('contract.months.Sep') || 'Sep',
      t('contract.months.Oct') || 'Oct',
      t('contract.months.Nov') || 'Nov',
      t('contract.months.Dic') || 'Dec'
    ];

    const weekdayText = weekdays[dayOfWeek];
    const monthText = months[month];
    const ofText = t('contract.of') || (language === 'es' ? 'de' : 'of');

    return `${weekdayText}, ${day} ${ofText} ${monthText} ${ofText} ${year}`;
  };

  const formatTime = (time: string) => {
    return time;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!isMountedRef.current || !isClient) return;

    const { name, value } = e.target;

    if (name === 'cardNumber') {
      const cleanValue = value.replace(/\s/g, '').replace(/\D/g, '');
      const formattedValue = cleanValue.replace(/(.{4})/g, '$1 ').trim();
      if (cleanValue.length <= 16) {
        setFormData(prev => ({ ...prev, [name]: formattedValue }));
      }
    } else if (name === 'expiryDate') {
      const cleanValue = value.replace(/\D/g, '');
      let formattedValue = cleanValue;
      if (cleanValue.length >= 2) {
        formattedValue = cleanValue.substring(0, 2) + '/' + cleanValue.substring(2, 4);
      }
      if (cleanValue.length <= 4) {
        setFormData(prev => ({ ...prev, [name]: formattedValue }));
      }
    } else if (name === 'cvv') {
      const cleanValue = value.replace(/\D/g, '');
      if (cleanValue.length <= 4) {
        setFormData(prev => ({ ...prev, [name]: cleanValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));

      // Real-time validation
      if (name === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          setFieldErrors(prev => ({ ...prev, email: language === 'es' ? 'Email inválido' : 'Invalid email' }));
        } else {
          setFieldErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.email;
            return newErrors;
          });
        }
      }
    }
  };

  const handlePhoneChange = (value: string | undefined) => {
    setFormData(prev => ({ ...prev, phone: value || '' }));

    if (value && isValidPhoneNumber(value)) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    } else if (value) {
      setFieldErrors(prev => ({ ...prev, phone: language === 'es' ? 'Número inválido' : 'Invalid number' }));
    } else {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  };

  const fetchAvailableSlots = async (date: string) => {
    setIsLoadingSlots(true);
    try {
      const slots = await TechnicianService.getAvailableTimeSlots(date);
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error fetching slots:', error);
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const days = [];

    const weekdays = [
      t('contract.days.DOM') || 'SUN',
      t('contract.days.LUN') || 'MON',
      t('contract.days.MAR') || 'TUE',
      t('contract.days.MIE') || 'WED',
      t('contract.days.JUE') || 'THU',
      t('contract.days.VIE') || 'FRI',
      t('contract.days.SAB') || 'SAT'
    ];

    const months = [
      t('contract.months.Ene') || 'Jan',
      t('contract.months.Feb') || 'Feb',
      t('contract.months.Mar') || 'Mar',
      t('contract.months.Abr') || 'Apr',
      t('contract.months.May') || 'May',
      t('contract.months.Jun') || 'Jun',
      t('contract.months.Jul') || 'Jul',
      t('contract.months.Ago') || 'Aug',
      t('contract.months.Sep') || 'Sep',
      t('contract.months.Oct') || 'Oct',
      t('contract.months.Nov') || 'Nov',
      t('contract.months.Dic') || 'Dec'
    ];

    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      if (date.getDay() !== 0 && date.getDay() !== 6) {
        const weekday = weekdays[date.getDay()];
        const month = months[date.getMonth()];

        days.push({
          date: date.toISOString().split('T')[0],
          day: date.getDate(),
          month: month,
          weekday: weekday
        });
      }
    }

    return days.slice(0, 20);
  };

  const validateStep1 = () => {
    const cardNumberClean = formData.cardNumber.replace(/\s/g, '');
    const expiryValid = (/^\d{2}\/\d{2}$/.test(formData.expiryDate));
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const phoneValid = formData.phone && isValidPhoneNumber(formData.phone);

    return formData.fullName.trim() !== '' &&
      emailValid &&
      phoneValid &&
      formData.address.trim() !== '' &&
      formData.cardholderName.trim() !== '' &&
      cardNumberClean.length >= 15 &&
      expiryValid &&
      formData.cvv.length >= 3;
  };

  const validateStep3 = () => {
    return formData.installationDate !== '' && formData.installationTime !== '';
  };

  const handleSubmitPayment = async () => {
    if (!validateStep1() || !isMountedRef.current || !isClient) return;

    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      if (isMountedRef.current && isClient) {
        setIsProcessing(false);

        // Use requestAnimationFrame to ensure state update happens after current render cycle
        requestAnimationFrame(() => {
          if (isMountedRef.current && isClient) {
            setCurrentStep(2);
          }
        });
      }
    } catch (error) {
      if (isMountedRef.current && isClient) {
        setIsProcessing(false);
      }
    }
  };

  const handleConfirmAppointment = async () => {
    if (!validateStep3() || !isMountedRef.current || !isClient) return;

    setIsProcessing(true);

    try {
      // ⚠️ SIMULATED PAYMENT - Replace with Stripe before production

      // 1. Create Initial Project (Pending Assignment)

      const projectId = await ActiveProjectService.create({
        userId: user?.id || null, // Send null if no user (DB expects uuid or null)
        clientId: user?.id || undefined, // clientId is optional (undefined)
        quoteId: searchParams.get('quoteId') || undefined,
        projectName: `Eficiencia Energética - ${formData.fullName}`,
        clientName: formData.fullName,
        clientEmail: formData.email,
        clientPhone: formData.phone,
        clientCompany: '',
        address: formData.address,
        service: 'efficiency',
        package: 'Standard',
        status: 'pending_assignment',
        paymentStatus: 'paid',
        assignedTo: [],
        scheduledDate: formData.installationDate,
        scheduledTime: formData.installationTime,
        service: 'efficiency',
        package: 'Standard',
        status: 'pending_assignment',
        paymentStatus: 'paid',
        assignedTo: [],
        scheduledDate: formData.installationDate,
        scheduledTime: formData.installationTime,
        invoiceSentAt: undefined,

        // Mapped from Quote Data (New 2026-01-09)
        sourceQuoteId: searchParams.get('quoteId') || undefined,
        propertyType: quoteData?.property_type,
        propertySize: quoteData?.property_size,
        monthlyBill: quoteData?.monthly_bill,
        connectivityType: quoteData?.connectivity,
        deviceOption: quoteData?.device_mode,
        city: (quoteData?.address as any)?.city || formData.address.split(',')[1]?.trim() || '',
        state: (quoteData?.address as any)?.state || '',
        zipCode: (quoteData?.address as any)?.zip_code || '',
      });
      console.log('Project created:', projectId);

      // 2. Call Secure API to Assign Technician
      // This bypasses client-side security rules for reading appointments
      try {
        const assignRes = await fetch('/api/assign-technician', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: projectId,
            date: formData.installationDate,
            time: formData.installationTime,
            clientName: formData.fullName,
            clientAddress: formData.address,
            clientPhone: formData.phone
          })
        });

        if (!assignRes.ok) {
          console.warn('Auto-assignment failed via API, admins will be notified via urgent status.');
        }
      } catch (assignError) {
        console.error('Error calling assignment API:', assignError);
        // Non-blocking, the project is created and admin will see it as pending or handle it
      }

      // 3. Create magic link and send onboarding email
      try {
        const magicLinkRes = await fetch('/api/create-magic-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            fullName: formData.fullName,
            phone: formData.phone,
            service: 'efficiency'
          })
        });

        if (magicLinkRes.ok) {
          const { magicLink } = await magicLinkRes.json();

          // Send onboarding email
          await fetch('/api/send-onboarding-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: formData.email, // API expects 'to'
              fullName: formData.fullName,
              service: 'Eficiencia Energética',
              magicLink: magicLink,
              paymentAmount: '2,500.00',
              scheduledDate: formatDate(formData.installationDate),
              scheduledTime: formData.installationTime,
              language: language
            })
          });
        }
      } catch (emailError) {
        console.error('Error sending onboarding email:', emailError);
        // Continue anyway - account can be created later
      }

      if (isMountedRef.current && isClient) {
        setIsProcessing(false);

        // Use requestAnimationFrame to ensure state update happens after current render cycle
        requestAnimationFrame(() => {
          if (isMountedRef.current && isClient) {
            setCurrentStep(4);
          }
        });
      }
    } catch (error) {
      console.error('Error confirming appointment:', error);
      if (isMountedRef.current && isClient) {
        setIsProcessing(false);
      }
    }
  };

  const handleStepChange = (step: number) => {
    if (!isMountedRef.current || !isClient) return;

    // Use requestAnimationFrame to ensure state update happens in next animation frame
    requestAnimationFrame(() => {
      if (isMountedRef.current && isClient) {
        setCurrentStep(step);
      }
    });
  };

  const handleDateSelection = (date: string) => {
    if (!isMountedRef.current || !isClient) return;
    setSelectedDate(date);
    setFormData(prev => ({ ...prev, installationDate: date, installationTime: '' }));
    fetchAvailableSlots(date);
  };

  const handleTimeSelection = (time: string) => {
    if (!isMountedRef.current || !isClient) return;
    setFormData(prev => ({ ...prev, installationTime: time }));
  };

  const stepTitles = [
    t('contract.step1') || 'Payment Information',
    t('contract.step2') || 'Successful Payment',
    t('contract.step3') || 'Schedule Installation',
    t('contract.step4') || 'Final Confirmation'
  ];

  if (!isClient) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004A90] mx-auto mb-4"></div>
          <p className="text-[#004A90]">{t('contract.loading') || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {currentStep <= 3 && (
        <div className="bg-white min-h-screen">
          <section className="py-12 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#004A90] mb-4">
                  {t('contract.title') || 'Contract Energy Efficiency Service'}
                </h1>
                <p className="text-lg md:text-xl text-[#004A90] max-w-2xl mx-auto">
                  Paso {currentStep} de 4: {stepTitles[currentStep - 1]}
                </p>
              </div>

              <div className="flex items-center justify-center mb-12">
                <div className="flex items-center space-x-2 md:space-x-4">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border-2 text-xs md:text-sm font-medium transition-all ${currentStep >= step
                        ? 'bg-[#004A90] border-[#004A90] text-white'
                        : 'border-gray-300 text-gray-400'
                        }`}>
                        {currentStep > step ? (
                          <i className="ri-check-line text-sm md:text-base"></i>
                        ) : (
                          <span>{step}</span>
                        )}
                      </div>
                      {step < 4 && (
                        <div className={`w-8 md:w-16 h-0.5 ml-2 md:ml-4 ${currentStep > step
                          ? 'bg-[#004A90]'
                          : 'bg-gray-300'
                          }`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 lg:p-12">
                {currentStep === 1 && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                      <h2 className="text-2xl md:text-3xl font-bold text-[#004A90]">
                        {t('contract.step1') || 'Payment Information'}
                      </h2>
                      <a
                        href="/quote"
                        className="text-[#004A90] hover:text-[#003270] transition-colors cursor-pointer whitespace-nowrap text-sm md:text-base"
                      >
                        {t('contract.changeService') || '← Change Service'}
                      </a>
                    </div>

                    <div className="bg-[#004A90]/5 border border-[#004A90]/20 rounded-xl p-4 md:p-6 mb-6 md:mb-8">
                      <p className="text-[#004A90] font-semibold text-sm md:text-base leading-relaxed">
                        {t('contract.selectedService') || 'Selected service: Energy Efficiency'}
                      </p>
                    </div>

                    <div className="mb-8">
                      <p className="text-lg md:text-xl text-[#004A90] max-w-2xl">
                        {t('contract.serviceDescription') || 'Enter your card details to proceed with the service payment.'}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
                      <h3 className="text-lg font-semibold mb-4 text-[#004A90]">{t('contract.summaryTitle') || 'Service Summary'}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center">
                          <i className="ri-check-line mr-3 text-[#c3d021]"></i>
                          <span className="text-gray-700">{t('contract.summaryFeature1') || 'Complete efficiency analysis'}</span>
                        </div>
                        <div className="flex items-center">
                          <i className="ri-check-line mr-3 text-[#c3d021]"></i>
                          <span className="text-gray-700">{t('contract.summaryFeature2') || 'Smart meter installation'}</span>
                        </div>
                        <div className="flex items-center">
                          <i className="ri-check-line mr-3 text-[#c3d021]"></i>
                          <span className="text-gray-700">{t('contract.summaryFeature3') || 'Real-time monitoring'}</span>
                        </div>
                        <div className="flex items-center">
                          <i className="ri-check-line mr-3 text-[#c3d021]"></i>
                          <span className="text-gray-700">{t('contract.summaryFeature4') || 'Monthly savings reports'}</span>
                        </div>
                      </div>
                      <div className="border-t border-gray-300 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-medium text-gray-700">{t('contract.totalToPay') || 'Total to Pay'}</span>
                          <span className="text-3xl font-bold text-[#004A90]">$2,500</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{t('contract.includesInstallation') || 'Includes installation and setup'}</div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Contact Information Section */}
                      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-6">
                        <h3 className="text-lg font-semibold mb-4 text-[#004A90]">
                          <i className="ri-user-line mr-2"></i>
                          {t('contract.contactInfo') || 'Contact Information'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-[#004A90] mb-2">
                              {t('contract.fullName') || 'Full Name'} *
                            </label>
                            <input
                              type="text"
                              id="fullName"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A90] focus:border-[#004A90]"
                              placeholder={t('contract.fullNamePlaceholder') || 'John Doe'}
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[#004A90] mb-2">
                              {t('contract.email') || 'Email'} *
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#004A90] transition-all ${fieldErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                              placeholder="email@example.com"
                            />
                            {fieldErrors.email && (
                              <p className="text-red-500 text-xs mt-1 animate-shake">{fieldErrors.email}</p>
                            )}
                          </div>
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-[#004A90] mb-2">
                              {t('contract.phone') || 'Phone'} *
                            </label>
                            <PhoneInput
                              international
                              defaultCountry="PA"
                              value={formData.phone}
                              onChange={handlePhoneChange}
                              className={`w-full px-4 py-3 border rounded-lg focus-within:ring-2 focus-within:ring-[#004A90] transition-all bg-white ${fieldErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                            />
                            {fieldErrors.phone && (
                              <p className="text-red-500 text-xs mt-1 animate-shake">{fieldErrors.phone}</p>
                            )}
                          </div>
                          <div>
                            <label htmlFor="address" className="block text-sm font-medium text-[#004A90] mb-2">
                              {t('contract.address') || 'Installation Address'} *
                            </label>
                            <input
                              type="text"
                              id="address"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A90] focus:border-[#004A90]"
                              placeholder={t('contract.addressPlaceholder') || 'Full installation address'}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Payment Fields Section */}
                      <div>
                        <label htmlFor="cardholderName" className="block text-sm md:text-base font-medium text-[#004A90] mb-2">
                          <i className="ri-user-line mr-2"></i>
                          {t('contract.cardholderName') || 'Cardholder name'} *
                        </label>
                        <input
                          type="text"
                          id="cardholderName"
                          name="cardholderName"
                          value={formData.cardholderName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A90] focus:border-[#004A90] text-sm md:text-base"
                          placeholder={t('contract.cardholderPlaceholder') || 'Name as it appears on card'}
                        />
                      </div>

                      <div>
                        <label htmlFor="cardNumber" className="block text-sm md:text-base font-medium text-[#004A90] mb-2">
                          <i className="ri-bank-card-line mr-2"></i>
                          {t('contract.cardNumber') || 'Card number'} *
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A90] focus:border-[#004A90] text-sm md:text-base"
                          placeholder={t('contract.cardNumberPlaceholder') || '0000 0000 0000 0000'}
                        />
                        <div className="flex items-center mt-2 space-x-2">
                          <span className="text-xs text-gray-500">{t('contract.acceptCards') || 'We accept:'}</span>
                          <i className="ri-visa-line text-blue-600 text-lg"></i>
                          <i className="ri-mastercard-line text-red-500 text-lg"></i>
                          <span className="text-xs text-gray-400">{t('contract.visaMastercard') || 'Visa and Mastercard'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                          <label htmlFor="expiryDate" className="block text-sm md:text-base font-medium text-[#004A90] mb-2">
                            <i className="ri-calendar-line mr-2"></i>
                            {t('contract.expiryDate') || 'Expiry date'} *
                          </label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A90] focus:border-[#004A90] text-sm md:text-base"
                            placeholder={t('contract.expiryPlaceholder') || 'MM/YY'}
                          />
                        </div>

                        <div>
                          <label htmlFor="cvv" className="block text-sm md:text-base font-medium text-[#004A90] mb-2">
                            <i className="ri-shield-check-line mr-2"></i>
                            {t('contract.securityCode') || 'Security code'} *
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A90] focus:border-[#004A90] text-sm md:text-base"
                            placeholder={t('contract.securityPlaceholder') || 'CVV'}
                          />
                        </div>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <i className="ri-shield-check-line text-[#c3d021] mr-3 mt-0.5"></i>
                          <div>
                            <h4 className="text-sm font-medium mb-1" style={{ color: '#194271' }}>{t('contract.securePayment') || 'Secure Payment'}</h4>
                            <p className="text-sm" style={{ color: '#666' }}>
                              {t('contract.securePaymentText') || 'Your information is protected with 256-bit SSL encryption. We do not store card data.'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {!validateStep1() && (formData.cardholderName || formData.cardNumber || formData.expiryDate || formData.cvv) && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex items-start">
                            <i className="ri-error-warning-line text-red-600 mr-3 mt-0.5"></i>
                            <div>
                              <h4 className="text-sm font-medium text-red-800 mb-1">{t('contract.completeFields') || 'Please complete all fields'}</h4>
                              <ul className="text-sm text-red-700 space-y-1">
                                {!formData.cardholderName.trim() && <li>{t('contract.cardholderRequired') || 'Cardholder name is required'}</li>}
                                {formData.cardNumber.replace(/\s/g, '').length < 15 && <li>{t('contract.invalidCard') || 'Invalid card number'}</li>}
                                {!/^\d{2}\/\d{2}$/.test(formData.expiryDate) && formData.expiryDate && <li>{t('contract.invalidExpiry') || 'Invalid expiry date'}</li>}
                                {formData.cvv.length < 3 && <li>{t('contract.invalidCvv') || 'Invalid CVV'}</li>}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-6">
                      <button
                        onClick={handleSubmitPayment}
                        disabled={!validateStep1() || isProcessing}
                        className={`w-full py-4 rounded-lg font-medium transition-colors whitespace-nowrap text-sm md:text-base ${validateStep1() && !isProcessing
                          ? 'bg-[#C3D021] hover:bg-teravolta-lime-dark text-[#194271] cursor-pointer'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                      >
                        {isProcessing ? (
                          <><i className="ri-loader-4-line animate-spin mr-2"></i>{t('contract.processingPayment') || 'Processing payment...'}</>
                        ) : (<><i className="ri-secure-payment-line mr-2"></i>{t('contract.payAmount') || 'Pay $2,500'}</>)}
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="text-center">
                    <div className="w-20 h-20 flex items-center justify-center rounded-full mx-auto mb-6" style={{ backgroundColor: '#c3d021' }}>
                      <i className="ri-check-line text-3xl" style={{ color: '#194271' }}></i>
                    </div>
                    <h2 className="text-3xl font-bold mb-4" style={{ color: '#004A90', fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      {t('contract.paymentSuccessful') || 'Payment Successful!'}
                    </h2>
                    <p className="text-xl mb-8 text-gray-600" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      {t('contract.paymentProcessed') || 'Your payment has been processed successfully. Now let\'s schedule the installation.'}
                    </p>

                    <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left border border-gray-200">
                      <h3 className="text-lg font-semibold mb-4" style={{ color: '#004A90', fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                        {t('contract.purchaseDetails') || 'Purchase Details'}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                            {t('contract.service') || 'Service'}
                          </span>
                          <span className="font-semibold" style={{ color: '#004A90', fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                            {t('contract.completeEnergyEfficiency') || 'Complete Energy Efficiency'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                            {t('contract.paymentMethod') || 'Payment method'}
                          </span>
                          <span className="font-semibold" style={{ color: '#004A90', fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                            {t('contract.cardEnding') || 'Card ending in'} {formData.cardNumber.slice(-4)}
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-gray-300 pt-3">
                          <span className="text-lg font-bold text-gray-700" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                            {t('contract.totalPaid') || 'Total Paid'}
                          </span>
                          <span className="text-3xl font-bold" style={{ color: '#c3d021' }}>$2,500</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                      <h3 className="text-lg font-semibold mb-3" style={{ color: '#004A90', fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                        {t('contract.nextStep') || 'Next Step'}
                      </h3>
                      <p className="text-gray-700" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                        {t('contract.nextStepText') || 'Now we need to schedule the installation of your smart meter. Select the date and time that works best for you.'}
                      </p>
                    </div>

                    <button
                      onClick={() => handleStepChange(3)}
                      className="px-8 py-4 rounded-lg font-medium transition-colors whitespace-nowrap hover:opacity-90"
                      style={{ backgroundColor: '#C3D021', color: '#333333', fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}
                    >
                      <i className="ri-calendar-line mr-2"></i>
                      {t('contract.scheduleInstallation') || 'Schedule Installation'}
                    </button>
                  </div>
                )}

                {currentStep === 3 && (
                  <div>
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold mb-2" style={{ color: '#004A90', fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                        {t('contract.scheduleTitle') || 'Schedule Installation'}
                      </h2>
                      <p className="text-gray-600" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                        {t('contract.scheduleDescription') || 'Select the date and time that works best for you for the installation.'}
                      </p>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4" style={{ color: '#004A90', fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                        {t('contract.selectDate') || 'Select a date'}
                      </h3>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2 md:gap-3">
                        {generateCalendarDays().map((day) => (
                          <div
                            key={day.date}
                            onClick={() => handleDateSelection(day.date)}
                            className={`p-3 md:p-4 border-2 rounded-lg cursor-pointer text-center transition-all hover:shadow-md ${selectedDate === day.date
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                              }`}
                          >
                            <div className="text-xs text-gray-500 uppercase" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                              {day.weekday}
                            </div>
                            <div className="text-lg font-bold" style={{ color: '#004A90', fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                              {day.day}
                            </div>
                            <div className="text-xs text-gray-500" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                              {day.month}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedDate && (
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4" style={{ color: '#004A90', fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                          {t('contract.availableSlots') || 'Available slots for'} {formatDate(selectedDate)}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {isLoadingSlots ? (
                            <div className="col-span-full py-8 text-center text-gray-500">
                              <i className="ri-loader-4-line animate-spin text-2xl mb-2 block"></i>
                              {t('contract.checkingAvailability') || 'Checking availability...'}
                            </div>
                          ) : availableSlots.length === 0 ? (
                            <div className="col-span-full py-4 text-center text-red-500 bg-red-50 rounded-lg border border-red-100">
                              {t('contract.noSlots') || 'No slots available for this date. Please select another day.'}
                            </div>
                          ) : (
                            availableSlots.map((slot) => (
                              <div
                                key={slot}
                                onClick={() => handleTimeSelection(slot)}
                                className={`p-3 md:p-4 border-2 rounded-lg cursor-pointer text-center transition-all hover:shadow-md ${formData.installationTime === slot
                                  ? 'border-blue-600 bg-blue-50'
                                  : 'border-gray-200 hover:border-blue-300'
                                  }`}
                              >
                                <div className="font-medium text-sm md:text-base" style={{ color: '#004A90', fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                                  {slot}
                                </div>
                                <div className="text-xs text-gray-500" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                                  {t('contract.available') || 'Available'}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    {formData.installationDate && formData.installationTime && (
                      <div className="bg-gray-50 rounded-xl p-4 md:p-6 mb-8 border border-gray-200">
                        <h4 className="font-semibold mb-3" style={{ color: '#004A90', fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                          {t('contract.appointmentSummary') || 'Appointment Summary'}
                        </h4>
                        <div className="flex items-center mb-2 text-gray-700">
                          <i className="ri-calendar-line mr-2" style={{ color: '#004A90' }}></i>
                          <span className="font-medium text-sm md:text-base" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                            {formatDate(formData.installationDate)} {t('contract.at') || 'at'} {formatTime(formData.installationTime)}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <i className="ri-time-line mr-2" style={{ color: '#004A90' }}></i>
                          <span className="text-sm md:text-base" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                            {t('contract.estimatedDuration') || 'Estimated duration: 2-3 hours'}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 sm:justify-between pt-6">
                      <button
                        onClick={() => handleStepChange(2)}
                        className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors whitespace-nowrap"
                        style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}
                      >
                        <i className="ri-arrow-left-line mr-2"></i>
                        {t('contract.previous') || 'Previous'}
                      </button>
                      <button
                        onClick={handleConfirmAppointment}
                        disabled={!validateStep3() || isProcessing}
                        className={`w-full sm:w-auto px-6 md:px-8 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${validateStep3() && !isProcessing
                          ? 'cursor-pointer hover:opacity-90'
                          : 'cursor-not-allowed opacity-50'
                          }`}
                        style={{
                          backgroundColor: validateStep3() && !isProcessing ? '#C3D021' : '#9CA3AF',
                          color: '#333333',
                          fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif'
                        }}
                      >
                        {isProcessing ? (
                          <><i className="ri-loader-4-line animate-spin mr-2"></i>{t('contract.confirmingAppointment') || 'Confirming appointment...'}</>
                        ) : (<><i className="ri-check-line mr-2"></i>{t('contract.confirmAppointment') || 'Confirm Appointment'}</>)}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      {currentStep === 4 && (
        <>
          <section className="text-white py-20 relative overflow-hidden" style={{ backgroundColor: '#004A90' }}>
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

            <div className="max-w-6xl mx-auto px-6 text-center relative z-10" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              <div className="w-24 h-24 flex items-center justify-center rounded-full mx-auto mb-6" style={{ backgroundColor: '#C3D021' }}>
                <i className="ri-check-double-line text-4xl" style={{ color: '#004A90' }}></i>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                {t('contract.allReady') || 'All Ready!'}
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                {t('contract.serviceContracted') || 'Your service has been successfully contracted. We will contact you soon to confirm the details.'}
              </p>
            </div>
          </section>

          <section className="py-16 bg-white" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            <div className="max-w-6xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <div className="text-white rounded-2xl p-8 mb-8" style={{ backgroundColor: '#004A90' }}>
                    <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      <i className="ri-calendar-event-line mr-3"></i>
                      {t('contract.yourInstallationAppointment') || 'Your Installation Appointment'}
                    </h2>
                    <div className="text-3xl font-bold mb-3" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      {formatDate(formData.installationDate)}
                    </div>
                    <div className="text-2xl mb-4" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      {t('contract.at') || 'at'} {formatTime(formData.installationTime)}
                    </div>
                    <div className="text-blue-100 flex items-center" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      <i className="ri-time-line mr-2"></i>
                      {t('contract.estimatedDuration') || 'Estimated duration: 2-3 hours'}
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-yellow-800 mb-4" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      <i className="ri-information-line mr-2"></i>
                      {t('contract.nextSteps') || 'Next Steps'}
                    </h3>
                    <ul className="text-yellow-700 space-y-3" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      <li className="flex items-start">
                        <i className="ri-mail-line text-yellow-600 mr-3 mt-1"></i>
                        <span>{t('contract.nextStep1') || 'You will receive a confirmation email with all details'}</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-phone-line text-yellow-600 mr-3 mt-1"></i>
                        <span>{t('contract.nextStep2') || 'We will call you 24 hours before to confirm the appointment'}</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-user-3-line text-yellow-600 mr-3 mt-1"></i>
                        <span>{t('contract.nextStep3') || 'A certified technician will perform the installation'}</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-smartphone-line text-yellow-600 mr-3 mt-1"></i>
                        <span>{t('contract.nextStep4') || 'You will have immediate access to your monitoring dashboard'}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 mb-8">
                    <h3 className="text-2xl font-bold mb-6" style={{ color: '#004A90', fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      {t('contract.finalSummary') || 'Final Summary'}
                    </h3>
                    <div className="space-y-4" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">{t('contract.service') || 'Service'}</span>
                        <span className="font-semibold" style={{ color: '#004A90', fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                          {t('contract.completeEnergyEfficiency') || 'Complete Energy Efficiency'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">{t('contract.paymentMethod') || 'Payment method'}</span>
                        <span className="font-semibold" style={{ color: '#004A90', fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                          {t('contract.cardEnding') || 'Card ending in'} {formData.cardNumber.slice(-4)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-t-2 border-gray-300">
                        <span className="text-lg font-bold text-gray-700">{t('contract.totalPaid') || 'Total Paid'}</span>
                        <span className="text-3xl font-bold" style={{ color: '#c3d021' }}>$2,500</span>
                      </div>
                    </div>
                  </div>

                  <a href="/" className="w-full px-8 py-4 rounded-lg font-medium transition-colors whitespace-nowrap inline-flex items-center justify-center hover:opacity-90" style={{ backgroundColor: '#C3D021', color: '#333333', fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                    <i className="ri-home-line mr-2"></i>
                    {t('contract.backToHome') || 'Back to Home'}
                  </a>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center mt-4">
                    <p className="text-sm font-medium mb-1" style={{ color: '#004A90', fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      <i className="ri-mail-check-line mr-2"></i>
                      {language === 'es' ? 'Acceso a tu Cuenta' : 'Access Your Account'}
                    </p>
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      {language === 'es'
                        ? 'Hemos enviado un enlace mágico a tu correo. Úsalo para acceder a tu dashboard y ver el progreso.'
                        : 'We sent a magic link to your email. Use it to access your dashboard and track progress.'}
                    </p>
                  </div>

                  <div className="mt-8 p-4 bg-blue-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      <i className="ri-phone-line mr-1"></i>
                      {t('contract.changeAppointment') || 'Need to change your appointment? Call us at (507) 6000-0000'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div >
  );
}