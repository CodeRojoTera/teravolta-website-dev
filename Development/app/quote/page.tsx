'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

const PhoneInput = dynamic(() => import('react-phone-number-input'), {
  ssr: false,
});

interface FileUpload {
  file: File;
  id: string;
  preview?: string;
}

interface FormData {
  service: string;
  propertyType: string;
  propertySize: string;
  // currentBill removed
  fullName: string;
  email: string;
  phone: string;
  company: string;
  operatingHours: string; // New field
  bills: FileUpload[];
  // deviceMode removed
  // connectivity removed
  message: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  renewableBudget: string;
  bookingDate: string; // New field
  bookingTime: string; // New field
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
  const [formData, setFormData] = useState<FormData>({
    service: '',
    propertyType: '',
    propertySize: '',
    fullName: '',
    email: '',
    phone: '',
    company: '',
    operatingHours: '',
    bills: [],
    message: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    renewableBudget: '',
    bookingDate: '',
    bookingTime: ''
  });
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
      propertyTypeLabel: 'Property type *',
      residential: 'Residential',
      apartment: 'Apartment',
      hotel: 'Hotel', // New
      building: 'Building / Common Areas', // New
      industry: 'Industry', // New
      smallBusiness: 'Business',
      propertySizeLabel: 'Property size (square feet) *',
      selectSize: 'Select size',
      fullNameLabel: 'Full name *',
      fullNamePlaceholder: 'Your name',
      emailLabel: 'Email *',
      emailPlaceholder: 'your@email.com',
      phoneLabel: 'Phone *',
      phonePlaceholder: 'Your phone number',
      companyLabel: 'Company',
      companyPlaceholder: 'Company name',
      operatingHoursLabel: 'Operating Hours', // New
      operatingHoursPlaceholder: 'e.g., 9:00 AM - 5:00 PM',
      addressLabel: 'Address *',
      addressPlaceholder: 'Your address',
      cityLabel: 'City *',
      cityPlaceholder: 'Your city',
      stateLabel: 'State/Province *',
      statePlaceholder: 'Your state',
      zipCodeLabel: 'ZIP Code *',
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
      propertyTypeLabel: 'Tipo de propiedad *',
      residential: 'Residencial',
      apartment: 'Apartamento',
      hotel: 'Hotel', // New
      building: 'Edificio / Áreas Comunes', // New
      industry: 'Industria', // New
      smallBusiness: 'Comercio',
      propertySizeLabel: 'Tamaño de la propiedad (pies cuadrados) *',
      selectSize: 'Selecciona el tamaño',
      fullNameLabel: 'Nombre completo *',
      fullNamePlaceholder: 'Tu nombre',
      emailLabel: 'Correo electrónico *',
      emailPlaceholder: 'tu@correo.com',
      phoneLabel: 'Teléfono *',
      phonePlaceholder: 'Tu número de teléfono',
      companyLabel: 'Empresa',
      companyPlaceholder: 'Nombre de la empresa',
      operatingHoursLabel: 'Horario de Operación', // New
      operatingHoursPlaceholder: 'ej. 9:00 AM - 5:00 PM',
      addressLabel: 'Dirección *',
      addressPlaceholder: 'Tu dirección',
      cityLabel: 'Ciudad *',
      cityPlaceholder: 'Tu ciudad',
      stateLabel: 'Estado/Provincia *',
      statePlaceholder: 'Tu estado',
      zipCodeLabel: 'Código Postal *',
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


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

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
  };

  const handlePhoneChange = (value: string | undefined) => {
    if (!isMountedRef.current || !isClient) return;
    if (!value) {
      setFormData((prev) => ({ ...prev, phone: '' }));
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
    updateFormField('phone', value);
  };

  const updateFormField = (name: keyof FormData, value: string) => {
    if (!isMountedRef.current || !isClient) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceSelect = (service: string) => {
    if (!isMountedRef.current || !isClient) return;
    setSelectedService(service);
    setFormData((prev) => ({ ...prev, service: service }));

    requestAnimationFrame(() => {
      if (!isMountedRef.current || !isClient) return;
      if (service === 'consulting' || service === 'advocacy') {
        router.push(`/inquiry?service=${service}`);
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
      setFormData((prev) => ({ ...prev, bills: [...prev.bills, ...validFiles].slice(0, 12) }));
      showToast(language === 'es' ? 'Archivos agregados' : 'Files added', 'success');
    }
  };

  const removeFile = (id: string) => {
    if (!isMountedRef.current || !isClient) return;
    setFormData((prev) => ({ ...prev, bills: prev.bills.filter((bill) => bill.id !== id) }));
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
    const type = formData.propertyType;
    return ['small-business', 'office', 'industrial', 'hotel', 'building'].includes(type);
  };

  const canProceedToBills = () => {
    const basicValid = formData.propertyType && formData.propertySize && formData.fullName && formData.email && formData.phone && formData.address && formData.city && formData.state && formData.zipCode && !fieldErrors.email && !fieldErrors.phone;
    if (isCommercial()) {
      return basicValid && formData.company;
    }
    return basicValid;
  };

  const canProceedToBooking = () => {
    return formData.bills.length > 0;
  };

  const canSubmitForm = () => {
    return formData.bookingDate && formData.bookingTime;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canProceedToBills() || !isMountedRef.current || !isClient) return;
    router.push('/quote?step=3');
  };

  const handleBillsContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canProceedToBooking()) return;
    router.push('/quote?step=4');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitForm() || isSubmitting || !isMountedRef.current || !isClient) return;

    setIsSubmitting(true);

    try {
      const quoteId = uuidv4();
      const uploadedBills = [];

      // Upload files
      if (formData.bills && formData.bills.length > 0) {
        for (const billFile of formData.bills) {
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

      // Insert Quote via API (bypasses RLS)
      const quoteResponse = await fetch('/api/create-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: quoteId,
          service: formData.service || selectedService,
          property_type: formData.propertyType,
          property_size: formData.propertySize,
          client_name: formData.fullName,
          client_email: formData.email,
          client_phone: formData.phone,
          client_company: formData.company,
          message: formData.message,
          address: {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zipCode,
            country: 'PA'
          },
          bill_files: uploadedBills,
          user_id: user ? user.id : null,
          booking_preference: {
            date: formData.bookingDate,
            time: formData.bookingTime,
            operating_hours: formData.operatingHours
          }
        })
      });

      const quoteResult = await quoteResponse.json();
      if (!quoteResult.success) throw new Error(quoteResult.error || 'Failed to create quote');

      // Update client type
      if (formData.email && formData.propertyType) {
        await updateClientType(formData.email, formData.propertyType);
      }

      // Generate Magic Link for Onboarding
      const linkResponse = await fetch('/api/create-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
          phone: formData.phone,
          company: formData.company,
          role: 'customer',
          quoteId: quoteId,
          service: 'efficiency'
        })
      });

      const linkData = await linkResponse.json();
      if (!linkData.success) throw new Error('Failed to create onboarding link');

      // Send Email (Internal & External) - Optional, maybe API handles it?
      // For now, simpler to just redirect.
      // Notification emails should be handled by a trigger or separate API if needed, 
      // but 'create-magic-link' might not send email.
      // Let's assume we want to redirect immediately.

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

          {currentStep === 1 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 lg:p-12">
              {/* Step 1 Content (Service Selection) - Unchanged mostly */}
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

          {currentStep === 2 && (
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
                <div>
                  <label className="block text-sm font-medium text-[#004a90] mb-2">{getText('propertyTypeLabel')}</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    {[
                      { value: 'residential', label: getText('residential'), icon: 'ri-home-line' },
                      { value: 'apartment', label: getText('apartment'), icon: 'ri-building-line' },
                      { value: 'small-business', label: getText('smallBusiness'), icon: 'ri-store-line' },
                      { value: 'hotel', label: getText('hotel'), icon: 'ri-hotel-line' }, // New
                      { value: 'building', label: getText('building'), icon: 'ri-building-2-line' }, // New
                      { value: 'industrial', label: getText('industry'), icon: 'ri-factory-line' }, // New
                    ].map((option) => (
                      <div key={option.value} className={`p-3 md:p-4 border-2 rounded-lg cursor-pointer transition-all group ${formData.propertyType === option.value ? 'border-[#004a90] bg-[#004a90]/5' : 'border-gray-200 hover:border-[#004a90]'}`} onClick={() => updateFormField('propertyType', option.value)}>
                        <div className="text-center">
                          <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-[#004a90]/5 rounded-full mx-auto mb-2 group-hover:scale-110 transition-transform">
                            <i className={`${option.icon} text-xl md:text-2xl text-[#004a90]`}></i>
                          </div>
                          <div className="text-xs md:text-sm font-medium text-[#004a90]">{option.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#004a90] mb-2">{getText('propertySizeLabel')}</label>
                  <select name="propertySize" value={formData.propertySize} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg pr-8 text-sm md:text-base !bg-white">
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
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg text-sm md:text-base !bg-white" placeholder={getText('fullNamePlaceholder')} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#004a90] mb-2">{getText('emailLabel')}</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full p-3 border rounded-lg !bg-white ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'}`} placeholder={getText('emailPlaceholder')} required />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm md:text-base font-medium text-[#004a90]">
                    {getText('phoneLabel')}
                  </label>
                  <div className={`transition-colors rounded-lg overflow-hidden border ${fieldErrors.phone ? 'border-red-500' : 'border-gray-300'}`}>
                    <style jsx global>{phoneInputStyles}</style>
                    <PhoneInput international country={country} value={formData.phone} onChange={handlePhoneChange} onCountryChange={(c) => setCountry(c as Country)} labels={customLabels} className="w-full text-base !bg-white" />
                  </div>
                </div>

                {/* Conditional Company */}
                {(isCommercial()) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#004a90] mb-2">{getText('companyLabel')}</label>
                      <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" placeholder={getText('companyPlaceholder')} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#004a90] mb-2">{getText('operatingHoursLabel')}</label>
                      <input type="text" name="operatingHours" value={formData.operatingHours} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" placeholder={getText('operatingHoursPlaceholder')} />
                    </div>
                  </div>
                )}

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-[#004a90] mb-2">{getText('addressLabel')}</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" placeholder={getText('cityLabel')} required />
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" placeholder={getText('stateLabel')} required />
                  <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" placeholder={getText('zipCodeLabel')} required />
                </div>

                <div className="flex justify-center pt-6">
                  <button type="submit" disabled={!canProceedToBills()} className={`w-full max-w-md px-8 py-4 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap text-base shadow-md ${canProceedToBills() ? 'bg-[#c3d021] hover:bg-teravolta-lime-dark text-[#194271] cursor-pointer hover:shadow-lg transform hover:scale-105' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                    {getText('continueBtn')} <i className="ri-arrow-right-line ml-2"></i>
                  </button>
                </div>
              </form>
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 lg:p-12">
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[#004a90] mb-4">{getText('step3Title')}</h2>
                <p className="text-lg md:text-xl text-gray-600">{getText('step3Subtitle')}</p>
              </div>

              <form onSubmit={handleBillsContinue} className="space-y-6">
                {/* Drag & Drop Area */}
                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragOver ? 'border-[#004a90] bg-[#004a90]/5' : 'border-gray-300 hover:border-[#004a90]'}`}
                  onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
                  <i className="ri-upload-cloud-line text-4xl text-[#004a90] mb-4"></i>
                  <p className="text-gray-600 mb-4">{getText('dragDropSubtitle')}</p>
                  <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => e.target.files && handleFileUpload(e.target.files)} className="hidden" id="file-upload" />
                  <label htmlFor="file-upload" className="inline-block px-6 py-3 bg-[#004a90] text-white rounded-lg cursor-pointer hover:bg-[#194271]">{getText('selectFilesBtn')}</label>
                </div>

                {/* File List */}
                {formData.bills.length > 0 && (
                  <div className="grid grid-cols-1 gap-3">
                    {formData.bills.map((bill) => (
                      <div key={bill.id} className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                        <span className="truncate max-w-[200px] text-sm">{bill.file.name}</span>
                        <button type="button" onClick={() => removeFile(bill.id)} className="text-red-500"><i className="ri-close-line"></i></button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between pt-6">
                  <button type="button" onClick={() => handleStepChange(2)} className="px-6 py-3 border border-gray-300 rounded-lg">{getText('previousBtn')}</button>
                  <button type="submit" disabled={!canProceedToBooking()} className={`px-6 py-3 rounded-lg font-bold ${canProceedToBooking() ? 'bg-[#c3d021] text-[#194271]' : 'bg-gray-300'}`}>
                    {getText('continueBtn')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {currentStep === 4 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 lg:p-12">
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[#004a90] mb-4">{getText('step4Title')}</h2>
                <p className="text-lg md:text-xl text-gray-600">{getText('step4Subtitle')}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
                <div>
                  <label className="block text-sm font-medium text-[#004a90] mb-2">{getText('bookingDateLabel')}</label>
                  <input type="date" name="bookingDate" value={formData.bookingDate} onChange={handleInputChange} className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-[#004a90] outline-none" required min={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#004a90] mb-2">{getText('bookingTimeLabel')}</label>
                  <input type="time" name="bookingTime" value={formData.bookingTime} onChange={handleInputChange} className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-[#004a90] outline-none" required />
                </div>

                <div className="pt-6">
                  <button type="submit" disabled={isSubmitting || !canSubmitForm()} className="w-full bg-[#004a90] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#194271] disabled:opacity-70 shadow-lg hover:shadow-xl transition-all">
                    {isSubmitting ? getText('submittingBtn') : getText('submitBtn')}
                  </button>
                </div>
                <div className="text-center mt-4">
                  <button type="button" onClick={() => handleStepChange(3)} className="text-gray-500 hover:text-[#004a90] text-sm">
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
