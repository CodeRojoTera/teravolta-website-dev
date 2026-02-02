'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useLanguage } from '../../components/LanguageProvider';
import { useAuth } from '../../components/AuthProvider';
import { supabasePublic as supabase } from '@/lib/supabase';
import { uploadDocument } from '@/lib/documentUtils';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/Toast';
import { updateClientType } from '@/lib/clientTypeUtils';
import { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import dynamic from 'next/dynamic';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input';
import { getExampleNumber } from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';
import type { Country } from 'react-phone-number-input';
import enLabels from 'react-phone-number-input/locale/en.json';
import esLabels from 'react-phone-number-input/locale/es.json';
import { quoteSchema, QuoteFormData, shouldShowBillUpload, isInspectionRequired } from '@/lib/schemas/quote-schema';
import { PropertyTypeSelector } from '@/components/wizards/shared/PropertyTypeSelector';
import { PropertyType } from '@/lib/schemas/constants';

const PhoneInput = dynamic(() => import('react-phone-number-input'), {
  ssr: false,
});

interface FileUpload {
  file: File;
  id: string;
  preview?: string;
}

export default function QuotePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004a90] mx-auto mb-4"></div>
          <p className="text-[#004a90]">Loading...</p>
        </div>
      </div>
    }>
      <QuotePageContent />
    </Suspense>
  );
}

function QuotePageContent() {
  const { language, t } = useLanguage();
  const { isAdmin, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMountedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isClient, setIsClient] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    mode: 'onBlur',
    defaultValues: {
      service: 'efficiency',
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      clientCompany: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      propertyType: undefined,
      propertySize: '',
      operatingHours: '',
      bookingDate: '',
      bookingTime: '',
      message: '',
      inspectionRequested: false,
    },
  });

  // Watch values for conditional rendering
  const service = watch('service');
  const propertyType = watch('propertyType');
  const clientPhone = watch('clientPhone');
  const clientEmail = watch('clientEmail');

  // Separate state for file uploads (not part of Zod schema)
  const [bills, setBills] = useState<FileUpload[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [country, setCountry] = useState<Country>('PA');
  const [phoneKey, setPhoneKey] = useState(0);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const translations = {
    en: {
      title: 'Get Your Energy Quote',
      subtitle: 'Tell us about your energy needs and we\'ll provide you with a personalized solution.',
      loadingText: 'Loading form...',
      step1Title: 'What service do you need?',
      step1Subtitle: 'Select the service that best fits your needs',
      step2Title: 'Property Information',
      step2Subtitle: 'Tell us about your property and energy needs',
      step3Title: 'Upload Your Bills',
      step3Subtitle: 'Upload your electricity bills for analysis',
      step4Title: 'Schedule Your Inspection',
      step4Subtitle: 'Choose a convenient time for our technician to visit',
      efficiencyService: 'Energy Efficiency',
      efficiencyDesc: 'Complete analysis of your energy consumption and optimization',
      consultingService: 'Strategic Consulting',
      consultingDesc: 'Strategic decisions in PPA structuring and business development',
      advocacyService: 'Service Quality',
      advocacyDesc: 'Representation for service quality disputes and regulatory matters',
      specializedServiceTitle: 'Need another more specialized service?',
      specializedServiceDesc: 'Contact us and we will assist you.',
      contactUsBtn: 'Contact Us',
      propertySizeLabel: 'Property size (square feet)',
      selectSize: 'Select size',
      fullNameLabel: 'Full name *',
      fullNamePlaceholder: 'Your name',
      emailLabel: 'Email *',
      emailPlaceholder: 'your@email.com',
      phoneLabel: 'Phone *',
      phonePlaceholder: 'Your phone number',
      companyLabel: 'Company',
      companyPlaceholder: 'Company name',
      operatingHoursLabel: 'Operating Hours',
      operatingHoursPlaceholder: 'e.g., 9:00 AM - 5:00 PM',
      addressLabel: 'Address *',
      addressPlaceholder: 'Your address',
      cityLabel: 'City',
      cityPlaceholder: 'Your city',
      stateLabel: 'State/Province',
      statePlaceholder: 'Your state',
      zipCodeLabel: 'ZIP Code',
      zipCodePlaceholder: 'ZIP code',
      messageLabel: 'Additional Comments (optional)',
      messagePlaceholder: 'Tell us more about your specific needs...',
      dragDropTitle: 'Drag and drop your bills',
      dragDropSubtitle: 'or click to select files',
      selectFilesBtn: 'Select Files',
      fileFormats: 'PDF, JPG, PNG up to 5MB each',
      filesUploaded: 'Files uploaded',
      previousBtn: 'Previous',
      continueBtn: 'Continue',
      submitBtn: 'Confirm & Schedule',
      submittingBtn: 'Processing...',
      bookingDateLabel: 'Preferred Inspection Date *',
      bookingTimeLabel: 'Preferred Time *',
      changeService: 'Change Service',
      serviceSelected: 'Selected Service:',
      requiredField: 'Please fill out this field.',
    },
    es: {
      title: 'Obtén tu Cotización de Energía',
      subtitle: 'Cuéntanos sobre tus necesidades energéticas y te ofreceremos una solución personalizada.',
      loadingText: 'Cargando formulario...',
      step1Title: '¿Qué servicio necesitas?',
      step1Subtitle: 'Selecciona el servicio que mejor se adapte a tus necesidades',
      step2Title: 'Información de tu Propiedad',
      step2Subtitle: 'Cuéntanos sobre tu propiedad y necesidades energéticas',
      step3Title: 'Sube tus Facturas',
      step3Subtitle: 'Sube tus facturas de electricidad para el análisis',
      step4Title: 'Agenda tu Inspección',
      step4Subtitle: 'Elige un horario conveniente para que nuestro técnico te visite',
      efficiencyService: 'Eficiencia Energética',
      efficiencyDesc: 'Análisis completo de tu consumo energético y optimización',
      consultingService: 'Consultoría Estratégica',
      consultingDesc: 'Decisiones estratégicas en estructuración de PPA y desarrollo de negocios',
      advocacyService: 'Calidad de Servicio',
      advocacyDesc: 'Representación para disputas de calidad de servicio y asuntos regulatorios',
      specializedServiceTitle: '¿Requieres algún otro servicio más especializado?',
      specializedServiceDesc: 'Contáctanos y te atenderemos.',
      contactUsBtn: 'Contáctanos',
      propertySizeLabel: 'Tamaño de la propiedad (pies cuadrados)',
      selectSize: 'Selecciona el tamaño',
      fullNameLabel: 'Nombre completo *',
      fullNamePlaceholder: 'Tu nombre',
      emailLabel: 'Correo electrónico *',
      emailPlaceholder: 'tu@correo.com',
      phoneLabel: 'Teléfono *',
      phonePlaceholder: 'Tu número de teléfono',
      companyLabel: 'Empresa',
      companyPlaceholder: 'Nombre de la empresa',
      operatingHoursLabel: 'Horario de Operación',
      operatingHoursPlaceholder: 'ej. 9:00 AM - 5:00 PM',
      addressLabel: 'Dirección *',
      addressPlaceholder: 'Tu dirección',
      cityLabel: 'Ciudad',
      cityPlaceholder: 'Tu ciudad',
      stateLabel: 'Estado/Provincia',
      statePlaceholder: 'Tu estado',
      zipCodeLabel: 'Código Postal',
      zipCodePlaceholder: 'Código postal',
      messageLabel: 'Comentarios Adicionales (opcional)',
      messagePlaceholder: 'Cuéntanos más sobre tus necesidades específicas...',
      dragDropTitle: 'Arrastra y suelta tus facturas',
      dragDropSubtitle: 'o haz clic para seleccionar archivos',
      selectFilesBtn: 'Seleccionar Archivos',
      fileFormats: 'PDF, JPG, PNG hasta 5MB cada uno',
      filesUploaded: 'Archivos subidos',
      previousBtn: 'Anterior',
      continueBtn: 'Continuar',
      submitBtn: 'Confirmar y Agendar',
      submittingBtn: 'Procesando...',
      bookingDateLabel: 'Fecha de Inspección Preferida *',
      bookingTimeLabel: 'Hora Preferida *',
      changeService: 'Cambiar Servicio',
      serviceSelected: 'Servicio seleccionado:',
      requiredField: 'Por favor, complete este campo.',
    }
  };

  type TranslationKey = keyof typeof translations.en;
  const translationsTyped: Record<'en' | 'es', Record<string, string>> = translations;

  const getText = (key: TranslationKey | string) => {
    const lang = (language === 'en' || language === 'es') ? language : 'es';
    return translationsTyped[lang][key as string] || translationsTyped['es'][key as string] || key;
  };

  useEffect(() => {
    isMountedRef.current = true;
    setIsClient(true);
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const countryLabels = language === 'en' ? enLabels : esLabels;
  const customLabels = { ...countryLabels };

  getCountries().forEach((country) => {
    const callingCode = getCountryCallingCode(country);
    if (customLabels[country]) {
      customLabels[country] = `${customLabels[country]} +${callingCode}`;
    }
  });

  const phoneInputStyles = `
    .PhoneInput {
        display: flex;
        align-items: center;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        padding: 0.75rem 1rem;
        background-color: #ffffff !important;
    }
    .PhoneInput input,
    .PhoneInput .PhoneInputInput {
        background-color: #ffffff !important;
        border: none !important;
        outline: none !important;
    }
    .PhoneInput:focus-within {
        border-color: #004a90;
        box-shadow: 0 0 0 1px #004a90;
    }
    .PhoneInputInput {
        flex: 1;
        min-width: 0;
        border: none;
        outline: none;
        background: transparent;
        font-size: 1rem;
        color: #111827;
        margin-left: 0.5rem;
    }
  `;

  useEffect(() => {
    if (isClient) {
      const stepParam = searchParams.get('step');
      if (stepParam) {
        const step = parseInt(stepParam);
        if (!isNaN(step) && step >= 1 && step <= 4) {
          setCurrentStep(step);
        }
      } else {
        setCurrentStep(1);
      }
    }
  }, [searchParams, isClient]);

  const handlePhoneChange = (value: string | undefined) => {
    if (!isMountedRef.current || !isClient) return;
    if (!value) {
      setValue('clientPhone', '');
      return;
    }
    if (value && isValidPhoneNumber(value)) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    } else if (value) {
      setFieldErrors(prev => ({ ...prev, phone: language === 'es' ? 'Número inválido' : 'Invalid number' }));
    }
    setValue('clientPhone', value, { shouldValidate: true });
  };

  const handleServiceSelect = (serviceType: string) => {
    if (!isMountedRef.current || !isClient) return;
    setSelectedService(serviceType);
    setValue('service', serviceType as any);

    requestAnimationFrame(() => {
      if (!isMountedRef.current || !isClient) return;
      if (serviceType === 'consulting' || serviceType === 'advocacy') {
        router.push(`/inquiry?service=${serviceType}`);
      } else {
        router.push('/quote?step=2');
      }
    });
  };

  const handleStepChange = (step: number) => {
    if (!isMountedRef.current || !isClient) return;
    if (step === 1) {
      router.push('/quote');
    } else {
      router.push(`/quote?step=${step}`);
    }
  };

  const handleFileUpload = (files: FileList) => {
    if (!isMountedRef.current || !isClient) return;
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validFiles: FileUpload[] = [];
    let hasInvalidType = false;
    let hasInvalidSize = false;

    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        hasInvalidType = true;
        return;
      }
      if (file.size > maxSize) {
        hasInvalidSize = true;
        return;
      }
      validFiles.push({
        file,
        id: Math.random().toString(36).substr(2, 9),
      });
    });

    if (hasInvalidType) showToast(language === 'es' ? 'Solo se permiten PDF e imágenes' : 'Only PDF/images allowed', 'error');
    if (hasInvalidSize) showToast(language === 'es' ? 'Máximo 5MB' : 'Max 5MB', 'error');

    if (validFiles.length > 0) {
      setBills((prev) => [...prev, ...validFiles].slice(0, 12));
      showToast(language === 'es' ? 'Archivos agregados' : 'Files added', 'success');
    }
  };

  const removeFile = (id: string) => {
    if (!isMountedRef.current || !isClient) return;
    setBills((prev) => prev.filter((bill) => bill.id !== id));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isMountedRef.current || !isClient) return;
    setIsDragOver(false);
    if (e.dataTransfer.files) handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isMountedRef.current || !isClient) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isMountedRef.current || !isClient) return;
    setIsDragOver(false);
  };

  const isCommercial = () => {
    return propertyType && isInspectionRequired(propertyType);
  };

  const canProceedToBills = async () => {
    const fieldsToValidate = [
      'propertyType',
      'clientName',
      'clientEmail',
      'clientPhone',
      'address',
    ] as const;
    return await trigger(fieldsToValidate as any);
  };

  const canProceedToBooking = () => {
    return bills.length > 0;
  };

  const canSubmitForm = async () => {
    const fieldsToValidate = ['bookingDate', 'bookingTime'] as const;
    return await trigger(fieldsToValidate as any);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await canProceedToBills();
    if (isValid && isMountedRef.current && isClient) {
      router.push('/quote?step=3');
    }
  };

  const handleBillsContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canProceedToBooking()) return;
    router.push('/quote?step=4');
  };

  const onFinalSubmit = async (data: QuoteFormData) => {
    if (isSubmitting || !isMountedRef.current || !isClient) return;

    setIsSubmitting(true);

    try {
      const quoteId = uuidv4();
      const uploadedBills = [];

      // Upload files
      if (bills && bills.length > 0) {
        for (const billFile of bills) {
          setUploadProgress((prev) => ({ ...prev, [billFile.id]: 10 }));
          const result = await uploadDocument({
            file: billFile.file,
            entityType: 'quotes',
            entityId: quoteId,
            uploadedBy: user?.id || 'system',
            category: 'bill'
          });
          setUploadProgress((prev) => ({ ...prev, [billFile.id]: 100 }));
          if (result.success && result.document) {
            uploadedBills.push({
              name: result.document.name,
              url: result.document.downloadURL,
              storagePath: result.document.storagePath,
              type: result.document.contentType,
              uploadedAt: new Date().toISOString()
            });
          }
        }
      }

      // Add inspection request to message if applicable
      let finalMessage = data.message || '';
      if ((data as any).inspectionRequested) {
        finalMessage += (finalMessage ? '\n\n' : '') + 'Inspection requested: Yes';
      }

      // Insert Quote via API (bypasses RLS)
      const quoteResponse = await fetch('/api/create-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: quoteId,
          service: data.service || selectedService,
          property_type: data.propertyType,
          property_size: (data as any).propertySize,
          client_name: data.clientName,
          client_email: data.clientEmail,
          client_phone: data.clientPhone,
          client_company: data.clientCompany,
          message: finalMessage,
          address: {
            street: data.address,
            city: data.city,
            state: data.state,
            zip_code: data.zipCode,
            country: 'PA'
          },
          bill_files: uploadedBills,
          user_id: user ? user.id : null,
          booking_preference: {
            date: (data as any).bookingDate,
            time: (data as any).bookingTime,
            operating_hours: (data as any).operatingHours
          }
        })
      });

      const quoteResult = await quoteResponse.json();
      if (!quoteResult.success) throw new Error(quoteResult.error || 'Failed to create quote');

      // Update client type
      if (data.clientEmail && data.propertyType) {
        await updateClientType(data.clientEmail, data.propertyType);
      }

      // Generate Magic Link for Onboarding
      const linkResponse = await fetch('/api/create-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.clientEmail,
          fullName: data.clientName,
          phone: data.clientPhone,
          company: data.clientCompany,
          role: 'customer',
          quoteId: quoteId,
          service: 'efficiency'
        })
      });

      const linkData = await linkResponse.json();
      if (!linkData.success) throw new Error('Failed to create onboarding link');

      router.push(`/onboard/${linkData.token}`);

    } catch (error) {
      console.error('Error submitting form:', error);
      showToast(language === 'es' ? 'Error al enviar cotización' : 'Error submitting quote', 'error');
      setIsSubmitting(false);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004a90] mx-auto mb-4"></div>
          <p className="text-[#004a90]">{getText('loadingText')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <Header />
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#004a90] mb-4">{getText('title')}</h1>
            <p className="text-lg md:text-xl text-[#004a90] max-w-3xl mx-auto">{getText('subtitle')}</p>
          </div>

          {/* Step 1 - Service Selection */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 lg:p-12">
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[#004a90] mb-4">{getText('step1Title')}</h2>
                <p className="text-lg md:text-xl text-gray-600">{getText('step1Subtitle')}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {/* Consulting */}
                <div onClick={() => handleServiceSelect('consulting')} className="p-4 md:p-6 border-2 rounded-xl cursor-pointer transition-all bg-white hover:border-[#004a90] group">
                  <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-[#004a90] rounded-full mx-auto mb-4 group-hover:scale-110 shadow-lg">
                    <i className="ri-file-text-line text-white text-xl md:text-2xl"></i>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-[#004a90] mb-2 text-center">{getText('consultingService')}</h3>
                  <p className="text-sm md:text-base text-gray-600 text-center">{getText('consultingDesc')}</p>
                </div>

                {/* Efficiency - Highlighted */}
                <div onClick={() => handleServiceSelect('efficiency')} className={`p-4 md:p-6 border-2 rounded-xl cursor-pointer transition-all bg-white group ${selectedService === 'efficiency' ? 'border-[#c3d021]' : 'hover:border-[#004a90]'}`}>
                  <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-[#c3d021] rounded-full mx-auto mb-4 group-hover:scale-110 shadow-lg">
                    <i className="ri-lightbulb-line text-[#004a90] text-xl md:text-2xl"></i>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-[#004a90] mb-2 text-center">{getText('efficiencyService')}</h3>
                  <p className="text-sm md:text-base text-gray-600 text-center">{getText('efficiencyDesc')}</p>
                </div>

                {/* Advocacy */}
                <div onClick={() => handleServiceSelect('advocacy')} className="p-4 md:p-6 border-2 rounded-xl cursor-pointer transition-all bg-white hover:border-[#004a90] group">
                  <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-[#004a90] rounded-full mx-auto mb-4 group-hover:scale-110 shadow-lg">
                    <i className="ri-shield-check-line text-white text-xl md:text-2xl"></i>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-[#004a90] mb-2 text-center">{getText('advocacyService')}</h3>
                  <p className="text-sm md:text-base text-gray-600 text-center">{getText('advocacyDesc')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 - Property Information (efficiency only) */}
          {currentStep === 2 && service === 'efficiency' && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 lg:p-12">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#004a90]">{getText('step2Title')}</h2>
                </div>
                <button onClick={() => handleStepChange(1)} className="text-[#004a90] hover:text-[#003270] transition-colors cursor-pointer whitespace-nowrap text-sm md:text-base self-start sm:self-center">
                  ← {getText('changeService')}
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Property Type Selector - Using shared component */}
                <PropertyTypeSelector
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  value={propertyType}
                />

                {/* Property Size */}
                <div>
                  <label className="block text-sm font-medium text-[#004a90] mb-2">{getText('propertySizeLabel')}</label>
                  <select
                    {...register('propertySize' as any)}
                    className="w-full p-3 border border-gray-300 rounded-lg pr-8 text-sm md:text-base !bg-white"
                  >
                    <option value="">{getText('selectSize')}</option>
                    <option value="1000">&lt; 1,000 sq ft</option>
                    <option value="3000">1,000 - 3,000 sq ft</option>
                    <option value="5000">3,000 - 5,000 sq ft</option>
                    <option value="10000">&gt; 5,000 sq ft</option>
                  </select>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#004a90] mb-2">{getText('fullNameLabel')}</label>
                    <input
                      type="text"
                      {...register('clientName')}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm md:text-base !bg-white"
                      placeholder={getText('fullNamePlaceholder')}
                    />
                    {errors.clientName && (
                      <span className="text-red-500 text-sm mt-1 block">{errors.clientName.message}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#004a90] mb-2">{getText('emailLabel')}</label>
                    <input
                      type="email"
                      {...register('clientEmail')}
                      className={`w-full p-3 border rounded-lg !bg-white ${errors.clientEmail ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder={getText('emailPlaceholder')}
                    />
                    {errors.clientEmail && (
                      <span className="text-red-500 text-sm mt-1 block">{errors.clientEmail.message}</span>
                    )}
                  </div>
                </div>

                {/* Phone Input */}
                <div className="space-y-1">
                  <label className="block text-sm md:text-base font-medium text-[#004a90]">
                    {getText('phoneLabel')}
                  </label>
                  <div className={`transition-colors rounded-lg overflow-hidden border ${fieldErrors.phone ? 'border-red-500' : 'border-gray-300'}`}>
                    <style jsx global>{phoneInputStyles}</style>
                    <PhoneInput
                      international
                      country={country}
                      value={clientPhone}
                      onChange={handlePhoneChange}
                      onCountryChange={(c) => setCountry(c as Country)}
                      labels={customLabels}
                      className="w-full text-base !bg-white"
                    />
                  </div>
                  {fieldErrors.phone && (
                    <span className="text-red-500 text-sm mt-1 block">{fieldErrors.phone}</span>
                  )}
                </div>

                {/* Conditional Company & Operating Hours for commercial properties */}
                {isCommercial() && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#004a90] mb-2">{getText('companyLabel')}</label>
                      <input
                        type="text"
                        {...register('clientCompany')}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder={getText('companyPlaceholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#004a90] mb-2">{getText('operatingHoursLabel')}</label>
                      <input
                        type="text"
                        {...register('operatingHours' as any)}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder={getText('operatingHoursPlaceholder')}
                      />
                    </div>
                  </div>
                )}

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-[#004a90] mb-2">{getText('addressLabel')}</label>
                  <input
                    type="text"
                    {...register('address')}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  {errors.address && (
                    <span className="text-red-500 text-sm mt-1 block">{errors.address.message}</span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    {...register('city')}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder={getText('cityLabel')}
                  />
                  <input
                    type="text"
                    {...register('state')}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder={getText('stateLabel')}
                  />
                  <input
                    type="text"
                    {...register('zipCode')}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder={getText('zipCodeLabel')}
                  />
                </div>

                {/* Inspection requirement notice */}
                {propertyType && (
                  <div className={`p-4 rounded-lg text-sm ${
                    isCommercial()
                      ? 'bg-blue-50 border border-blue-100 text-blue-800'
                      : 'bg-gray-50 border border-gray-100 text-gray-600'
                  }`}>
                    <i className={`${isCommercial() ? 'ri-information-line' : 'ri-lightbulb-line'} mr-2`}></i>
                    {isCommercial()
                      ? (language === 'es'
                        ? 'Este tipo de propiedad requiere una inspección técnica antes de la instalación.'
                        : 'This property type requires a technical inspection before installation.')
                      : (language === 'es'
                        ? 'La inspección es opcional para propiedades residenciales.'
                        : 'Inspection is optional for residential properties.')
                    }
                  </div>
                )}

                {/* Optional inspection request checkbox for residential properties */}
                {propertyType && !isCommercial() && (
                  <label className="flex items-start gap-3 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      {...register('inspectionRequested' as any)}
                      className="mt-1"
                    />
                    <span>
                      <span className="font-medium text-[#004a90]">
                        {language === 'es' ? 'Solicitar inspección técnica' : 'Request a technical inspection'}
                      </span>
                      <span className="block text-xs text-gray-500">
                        {language === 'es'
                          ? 'Marca esta opción si deseas que el equipo coordine una inspección.'
                          : 'Check this if you want the team to schedule an inspection.'}
                      </span>
                    </span>
                  </label>
                )}

                <div className="flex justify-center pt-6">
                  <button
                    type="submit"
                    className="w-full max-w-md px-8 py-4 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap text-base shadow-md bg-[#c3d021] hover:bg-teravolta-lime-dark text-[#194271] cursor-pointer hover:shadow-lg transform hover:scale-105"
                  >
                    {getText('continueBtn')} <i className="ri-arrow-right-line ml-2"></i>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3 - Bill Upload (efficiency only) */}
          {currentStep === 3 && shouldShowBillUpload(service as any) && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 lg:p-12">
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[#004a90] mb-4">{getText('step3Title')}</h2>
                <p className="text-lg md:text-xl text-gray-600">{getText('step3Subtitle')}</p>
              </div>

              <form onSubmit={handleBillsContinue} className="space-y-6">
                {/* Drag & Drop Area */}
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragOver ? 'border-[#004a90] bg-[#004a90]/5' : 'border-gray-300 hover:border-[#004a90]'}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <i className="ri-upload-cloud-line text-4xl text-[#004a90] mb-4"></i>
                  <p className="text-gray-600 mb-4">{getText('dragDropSubtitle')}</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="inline-block px-6 py-3 bg-[#004a90] text-white rounded-lg cursor-pointer hover:bg-[#194271]">
                    {getText('selectFilesBtn')}
                  </label>
                </div>

                {/* File List */}
                {bills.length > 0 && (
                  <div className="grid grid-cols-1 gap-3">
                    {bills.map((bill) => (
                      <div key={bill.id} className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                        <span className="truncate max-w-[200px] text-sm">{bill.file.name}</span>
                        <button type="button" onClick={() => removeFile(bill.id)} className="text-red-500">
                          <i className="ri-close-line"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between pt-6">
                  <button
                    type="button"
                    onClick={() => handleStepChange(2)}
                    className="px-6 py-3 border border-gray-300 rounded-lg"
                  >
                    {getText('previousBtn')}
                  </button>
                  <button
                    type="submit"
                    disabled={!canProceedToBooking()}
                    className={`px-6 py-3 rounded-lg font-bold ${canProceedToBooking() ? 'bg-[#c3d021] text-[#194271]' : 'bg-gray-300'}`}
                  >
                    {getText('continueBtn')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 4 - Booking (efficiency only) */}
          {currentStep === 4 && service === 'efficiency' && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 lg:p-12">
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[#004a90] mb-4">{getText('step4Title')}</h2>
                <p className="text-lg md:text-xl text-gray-600">{getText('step4Subtitle')}</p>
              </div>

              <form onSubmit={handleSubmit(onFinalSubmit)} className="space-y-6 max-w-md mx-auto">
                <div>
                  <label className="block text-sm font-medium text-[#004a90] mb-2">{getText('bookingDateLabel')}</label>
                  <input
                    type="date"
                    {...register('bookingDate' as any)}
                    className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-[#004a90] outline-none"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {(errors as any).bookingDate && (
                    <span className="text-red-500 text-sm mt-1 block">{(errors as any).bookingDate.message}</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#004a90] mb-2">{getText('bookingTimeLabel')}</label>
                  <input
                    type="time"
                    {...register('bookingTime' as any)}
                    className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-[#004a90] outline-none"
                  />
                  {(errors as any).bookingTime && (
                    <span className="text-red-500 text-sm mt-1 block">{(errors as any).bookingTime.message}</span>
                  )}
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#004a90] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#194271] disabled:opacity-70 shadow-lg hover:shadow-xl transition-all"
                  >
                    {isSubmitting ? getText('submittingBtn') : getText('submitBtn')}
                  </button>
                </div>
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => handleStepChange(3)}
                    className="text-gray-500 hover:text-[#004a90] text-sm"
                  >
                    {getText('previousBtn')}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
}
