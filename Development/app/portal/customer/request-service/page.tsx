'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import { supabase } from '@/lib/supabase';
import { updateClientType } from '@/lib/clientTypeUtils';
import { useToast } from '@/components/ui/Toast';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';

type ServiceType = '' | 'efficiency' | 'advocacy' | 'consulting';

interface FileUpload {
    file: File;
    id: string;
}

export default function RequestServicePage() {
    const { user } = useAuth();
    const router = useRouter();
    const { language } = useLanguage();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedService, setSelectedService] = useState<ServiceType>('');
    const [submitting, setSubmitting] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [files, setFiles] = useState<FileUpload[]>([]);
    const { showToast } = useToast();

    // Efficiency form
    const [efficiencyForm, setEfficiencyForm] = useState({
        propertyType: '',
        propertySize: '',
        currentBill: '',
        renewableBudget: '',
        address: '',
        city: '',
        state: '',
        deviceMode: '',
        connectivity: '',
        operatingHours: '',
        bookingDate: '',
        bookingTime: ''
    });

    // Advocacy form
    const [advocacyForm, setAdvocacyForm] = useState({
        propertyType: '',
        address: '',
        city: '',
        state: '',
        description: ''
    });

    // Consulting form
    const [consultingForm, setConsultingForm] = useState({
        description: '',
        timeline: '',
        budget: ''
    });

    // Fetch user profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setUserProfile(data);
                }
            } catch (e) {
                console.error('Error fetching profile:', e);
            } finally {
                setPageLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    const t = {
        title: language === 'es' ? 'Solicitar Nuevo Servicio' : 'Request New Service',
        back: language === 'es' ? '← Volver al Dashboard' : '← Back to Dashboard',
        yourInfo: language === 'es' ? 'Tu información de contacto se usará automáticamente' : 'Your contact info will be used automatically',
        selectService: language === 'es' ? 'Selecciona un servicio' : 'Select a service',
        efficiency: language === 'es' ? 'Eficiencia Energética' : 'Energy Efficiency',
        efficiencyDesc: language === 'es' ? 'Análisis y optimización de consumo' : 'Consumption analysis and optimization',
        advocacy: language === 'es' ? 'Calidad de Servicio' : 'Service Quality',
        advocacyDesc: language === 'es' ? 'Disputas y asuntos regulatorios' : 'Disputes and regulatory matters',
        consulting: language === 'es' ? 'Consultoría Estratégica' : 'Strategic Consulting',
        consultingDesc: language === 'es' ? 'PPA y desarrollo de negocios' : 'PPA and business development',
        propertyType: language === 'es' ? 'Tipo de Propiedad' : 'Property Type',
        residential: language === 'es' ? 'Residencial' : 'Residential',
        apartment: language === 'es' ? 'Apartamento' : 'Apartment',
        smallBusiness: language === 'es' ? 'Pequeña Empresa' : 'Small Business',
        office: language === 'es' ? 'Oficina' : 'Office',
        industrial: language === 'es' ? 'Industrial' : 'Industrial',
        hotel: language === 'es' ? 'Hotel' : 'Hotel',
        building: language === 'es' ? 'Edificio' : 'Building',
        propertySize: language === 'es' ? 'Tamaño (pies²)' : 'Size (sq ft)',
        selectSize: language === 'es' ? 'Seleccionar tamaño' : 'Select size',
        currentBill: language === 'es' ? 'Factura Mensual' : 'Monthly Bill',
        selectRange: language === 'es' ? 'Seleccionar rango' : 'Select range',
        address: language === 'es' ? 'Dirección' : 'Address',
        city: language === 'es' ? 'Ciudad' : 'City',
        state: language === 'es' ? 'Estado/Provincia' : 'State/Province',
        deviceMode: language === 'es' ? 'Modalidad del Dispositivo' : 'Device Mode',
        purchase: language === 'es' ? 'Compra ($850)' : 'Purchase ($850)',
        rental: language === 'es' ? 'Alquiler ($45/mes)' : 'Rental ($45/mo)',
        connectivity: language === 'es' ? 'Conectividad' : 'Connectivity',
        wifi: 'Wi-Fi',
        cellular: language === 'es' ? '3G Celular (+$25/mes)' : '3G Cellular (+$25/mo)',
        description: language === 'es' ? 'Descripción del Proyecto' : 'Project Description',
        descPlaceholder: language === 'es' ? 'Describe tu proyecto o necesidad...' : 'Describe your project or need...',
        timeline: language === 'es' ? 'Cronograma' : 'Timeline',
        selectTimeline: language === 'es' ? 'Seleccionar' : 'Select',
        immediate: language === 'es' ? 'Inmediato' : 'Immediate',
        oneMonth: language === 'es' ? '1 mes' : '1 month',
        twoThreeMonths: language === 'es' ? '2-3 meses' : '2-3 months',
        moreThanThree: language === 'es' ? 'Más de 3 meses' : 'More than 3 months',
        budget: language === 'es' ? 'Presupuesto' : 'Budget',
        renewableBudget: language === 'es' ? 'Presupuesto para Renovables' : 'Renewable Budget',
        renewableBudgetDesc: language === 'es' ? '¿Cuánto estás dispuesto a invertir en soluciones renovables?' : 'How much are you willing to invest in renewable solutions?',
        documents: language === 'es' ? 'Documentos (opcional)' : 'Documents (optional)',
        uploadDocs: language === 'es' ? 'Subir documentos' : 'Upload documents',
        submit: language === 'es' ? 'Enviar Solicitud' : 'Submit Request',
        submitting: language === 'es' ? 'Enviando...' : 'Submitting...',
        successTitle: language === 'es' ? '¡Solicitud Enviada!' : 'Request Submitted!',
        successMsg: language === 'es' ? 'Tu solicitud ha sido recibida. Te contactaremos pronto.' : 'Your request has been received. We\'ll contact you soon.',
        backToDash: language === 'es' ? 'Volver al Dashboard' : 'Back to Dashboard',
        // New scheduling fields
        scheduleInspection: language === 'es' ? 'Agendar Inspección' : 'Schedule Inspection',
        preferredDate: language === 'es' ? 'Fecha Preferida' : 'Preferred Date',
        preferredTime: language === 'es' ? 'Hora Preferida' : 'Preferred Time',
        operatingHours: language === 'es' ? 'Horarios de Operación' : 'Operating Hours',
        operatingHoursDesc: language === 'es' ? 'Horario de actividad del local (para propiedades comerciales)' : 'Business operating hours (for commercial properties)',
        morning: language === 'es' ? 'Mañana (8am - 12pm)' : 'Morning (8am - 12pm)',
        afternoon: language === 'es' ? 'Tarde (12pm - 5pm)' : 'Afternoon (12pm - 5pm)',
        evening: language === 'es' ? 'Noche (5pm - 8pm)' : 'Evening (5pm - 8pm)'
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const newFiles = Array.from(e.target.files).map(file => ({
            file,
            id: Math.random().toString(36).substr(2, 9)
        }));
        setFiles(prev => [...prev, ...newFiles].slice(0, 12));
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const getPropertyType = () => {
        if (selectedService === 'efficiency') return efficiencyForm.propertyType;
        if (selectedService === 'advocacy') return advocacyForm.propertyType;
        return '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !userProfile) return;

        setSubmitting(true);

        try {
            // 1. Upload Files to Storage
            const uploadedDocs = [];

            for (const fileObj of files) {
                const file = fileObj.file;
                const fileExt = file.name.split('.').pop();
                const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('quotes')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                // Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('quotes')
                    .getPublicUrl(fileName);

                uploadedDocs.push({
                    name: file.name,
                    storagePath: fileName,
                    url: publicUrl, // Legacy support
                    downloadURL: publicUrl,
                    type: file.type,
                    size: file.size,
                    uploadedAt: new Date().toISOString()
                });
            }

            // 2. Prepare Data Payload
            let formData: any = {
                service: selectedService,
                user_id: user.id,
                client_name: userProfile.full_name || userProfile.fullName, // Handle both cases
                client_email: userProfile.email,
                client_phone: userProfile.phone,
                client_company: userProfile.company || '',
                bill_files: uploadedDocs, // Store metadata in jsonb column
                created_at: new Date().toISOString(),
                status: 'pending_review' // Use correct enum value
            };

            const details: any = {};
            if (selectedService === 'efficiency') {
                Object.assign(details, efficiencyForm);
            } else if (selectedService === 'advocacy') {
                Object.assign(details, advocacyForm);
            } else if (selectedService === 'consulting') {
                Object.assign(details, consultingForm);
            }

            // 3. Map Fields to Columns
            // Address Handling (JSONB + Individual Columns)
            if (details.address || details.city || details.state) {
                formData.address = {
                    street: details.address || '',
                    city: details.city || '',
                    state: details.state || ''
                };
                formData.city = details.city;
                formData.state = details.state;
            }

            // Common Fields
            if (details.propertyType) formData.property_type = details.propertyType;
            if (details.propertySize) formData.property_size = details.propertySize;
            if (details.currentBill) formData.monthly_bill = details.currentBill; // Map to monthly_bill
            if (details.renewableBudget) formData.renewable_budget = details.renewableBudget;
            if (details.deviceMode) formData.device_mode = details.deviceMode;
            if (details.connectivity) formData.connectivity = details.connectivity;

            // Description mapping
            if (details.description) {
                formData.project_description = details.description;
                formData.message = details.description; // Redundant backup
            }

            if (details.timeline) formData.timeline = details.timeline;
            if (details.budget) formData.budget = details.budget;

            // Booking preference (scheduling) - aligns with public Quote form
            if (details.bookingDate || details.bookingTime || details.operatingHours) {
                formData.booking_preference = {
                    date: details.bookingDate || '',
                    time: details.bookingTime || '',
                    operating_hours: details.operatingHours || ''
                };
            }

            // 4. Insert into Quotes Table
            const { error } = await supabase.from('quotes').insert(formData);

            if (error) throw error;

            // Update client type if property type was selected
            const propertyType = getPropertyType();
            if (propertyType && userProfile.email) {
                await updateClientType(userProfile.email, propertyType);
            }

            setSuccess(true);
            showToast(t.successTitle, 'success'); // Simplified toast usage
        } catch (error) {
            console.error('Error submitting:', error);
            showToast(language === 'es' ? 'Error al enviar solicitud' : 'Error submitting request', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (pageLoading) {
        return <PageLoadingSkeleton title={t.title} />;
    }

    if (success) {
        return (
            <div className="max-w-lg mx-auto text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="ri-check-line text-4xl text-green-500"></i>
                </div>
                <h1 className="text-2xl font-bold text-[#004a90] mb-2">{t.successTitle}</h1>
                <p className="text-gray-600 mb-6">{t.successMsg}</p>
                <button
                    onClick={() => router.push('/portal/customer')}
                    className="px-6 py-3 bg-[#004a90] text-white rounded-lg font-medium hover:bg-[#194271]"
                >
                    {t.backToDash}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
            {/* Header */}
            <div>
                <button
                    onClick={() => router.push('/portal/customer')}
                    className="text-[#004a90] hover:text-[#c3d021] mb-2 flex items-center text-sm"
                >
                    {t.back}
                </button>
                <h1 className="text-3xl font-bold text-[#004a90]">{t.title}</h1>
            </div>

            {/* User Info Banner */}
            {userProfile && (
                <div className="bg-[#004a90]/5 border border-[#004a90]/20 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#c3d021] rounded-full flex items-center justify-center">
                        <span className="font-bold text-xl text-[#194271]">
                            {userProfile.fullName?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-600">{t.yourInfo}</p>
                        <p className="font-medium text-[#004a90]">
                            {userProfile.fullName} • {userProfile.email} • {userProfile.phone}
                        </p>
                    </div>
                </div>
            )}

            {/* Service Selector */}
            {!selectedService && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-[#004a90] mb-4">{t.selectService}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { id: 'efficiency', name: t.efficiency, desc: t.efficiencyDesc, icon: 'ri-lightbulb-line', color: 'bg-[#c3d021]', iconColor: 'text-[#194271]' },
                            { id: 'advocacy', name: t.advocacy, desc: t.advocacyDesc, icon: 'ri-shield-check-line', color: 'bg-[#004a90]', iconColor: 'text-white' },
                            { id: 'consulting', name: t.consulting, desc: t.consultingDesc, icon: 'ri-file-text-line', color: 'bg-[#004a90]', iconColor: 'text-white' }
                        ].map(service => (
                            <div
                                key={service.id}
                                onClick={() => setSelectedService(service.id as ServiceType)}
                                className="p-6 border-2 border-gray-200 hover:border-[#004a90] rounded-xl cursor-pointer transition-all group"
                            >
                                <div className={`w-14 h-14 ${service.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <i className={`${service.icon} text-2xl ${service.iconColor}`}></i>
                                </div>
                                <h3 className="font-bold text-[#004a90] mb-1">{service.name}</h3>
                                <p className="text-sm text-gray-600">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Service Form */}
            {selectedService && (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-[#004a90]">
                            {selectedService === 'efficiency' ? t.efficiency : selectedService === 'advocacy' ? t.advocacy : t.consulting}
                        </h2>
                        <button
                            type="button"
                            onClick={() => setSelectedService('')}
                            className="text-sm text-gray-500 hover:text-[#004a90]"
                        >
                            ← {language === 'es' ? 'Cambiar' : 'Change'}
                        </button>
                    </div>

                    {/* Efficiency Form */}
                    {selectedService === 'efficiency' && (
                        <>
                            {/* Property Type */}
                            <div>
                                <label className="block text-sm font-medium text-[#004a90] mb-2">{t.propertyType} *</label>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                    {[
                                        { id: 'residential', label: t.residential, icon: 'ri-home-line' },
                                        { id: 'apartment', label: t.apartment, icon: 'ri-building-line' },
                                        { id: 'small-business', label: t.smallBusiness, icon: 'ri-store-line' },
                                        { id: 'office', label: t.office, icon: 'ri-briefcase-line' },
                                        { id: 'industrial', label: t.industrial, icon: 'ri-building-4-line' }
                                    ].map(opt => (
                                        <div
                                            key={opt.id}
                                            onClick={() => setEfficiencyForm(p => ({ ...p, propertyType: opt.id }))}
                                            className={`p-3 border-2 rounded-lg cursor-pointer text-center ${efficiencyForm.propertyType === opt.id ? 'border-[#004a90] bg-[#004a90]/5' : 'border-gray-200'}`}
                                        >
                                            <i className={`${opt.icon} text-xl text-[#004a90]`}></i>
                                            <div className="text-xs mt-1 text-[#004a90]">{opt.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Property Size & Bill */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#004a90] mb-2">{t.propertySize} *</label>
                                    <select
                                        value={efficiencyForm.propertySize}
                                        onChange={e => setEfficiencyForm(p => ({ ...p, propertySize: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        required
                                    >
                                        <option value="">{t.selectSize}</option>
                                        <option value="1000">&lt; 1,000</option>
                                        <option value="2000">1,000 - 2,000</option>
                                        <option value="3000">2,000 - 3,000</option>
                                        <option value="5000">3,000 - 5,000</option>
                                        <option value="5001">&gt; 5,000</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#004a90] mb-2">{t.currentBill} *</label>
                                    <select
                                        value={efficiencyForm.currentBill}
                                        onChange={e => setEfficiencyForm(p => ({ ...p, currentBill: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        required
                                    >
                                        <option value="">{t.selectRange}</option>
                                        <option value="100-250">$100 - $250</option>
                                        <option value="250-500">$250 - $500</option>
                                        <option value="500-1000">$500 - $1,000</option>
                                        <option value="1000-2000">$1,000 - $2,000</option>
                                        <option value="2000+">$2,000+</option>
                                    </select>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#004a90] mb-2">{t.address} *</label>
                                    <input
                                        type="text"
                                        value={efficiencyForm.address}
                                        onChange={e => setEfficiencyForm(p => ({ ...p, address: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#004a90] mb-2">{t.city} *</label>
                                    <input
                                        type="text"
                                        value={efficiencyForm.city}
                                        onChange={e => setEfficiencyForm(p => ({ ...p, city: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#004a90] mb-2">{t.state} *</label>
                                <input
                                    type="text"
                                    value={efficiencyForm.state}
                                    onChange={e => setEfficiencyForm(p => ({ ...p, state: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>

                            {/* Renewable Budget */}
                            <div>
                                <label className="block text-sm font-medium text-[#004a90] mb-2">{t.renewableBudget}</label>
                                <p className="text-xs text-gray-500 mb-2">{t.renewableBudgetDesc}</p>
                                <select
                                    value={efficiencyForm.renewableBudget}
                                    onChange={e => setEfficiencyForm(p => ({ ...p, renewableBudget: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                >
                                    <option value="">{t.selectRange}</option>
                                    <option value="<5000">&lt; $5,000</option>
                                    <option value="5000-15000">$5,000 - $15,000</option>
                                    <option value="15000-30000">$15,000 - $30,000</option>
                                    <option value="30000-50000">$30,000 - $50,000</option>
                                    <option value="50000+">&gt; $50,000</option>
                                </select>
                            </div>

                            {/* Device Mode & Connectivity */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#004a90] mb-2">{t.deviceMode} *</label>
                                    <div className="space-y-2">
                                        {[
                                            { id: 'purchase', label: t.purchase },
                                            { id: 'rental', label: t.rental }
                                        ].map(opt => (
                                            <label key={opt.id} className={`flex items-center p-3 border-2 rounded-lg cursor-pointer ${efficiencyForm.deviceMode === opt.id ? 'border-[#004a90] bg-[#004a90]/5' : 'border-gray-200'}`}>
                                                <input
                                                    type="radio"
                                                    name="deviceMode"
                                                    value={opt.id}
                                                    checked={efficiencyForm.deviceMode === opt.id}
                                                    onChange={e => setEfficiencyForm(p => ({ ...p, deviceMode: e.target.value }))}
                                                    className="mr-3"
                                                    required
                                                />
                                                {opt.label}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#004a90] mb-2">{t.connectivity} *</label>
                                    <div className="space-y-2">
                                        {[
                                            { id: 'wifi', label: t.wifi },
                                            { id: 'cellular', label: t.cellular }
                                        ].map(opt => (
                                            <label key={opt.id} className={`flex items-center p-3 border-2 rounded-lg cursor-pointer ${efficiencyForm.connectivity === opt.id ? 'border-[#004a90] bg-[#004a90]/5' : 'border-gray-200'}`}>
                                                <input
                                                    type="radio"
                                                    name="connectivity"
                                                    value={opt.id}
                                                    checked={efficiencyForm.connectivity === opt.id}
                                                    onChange={e => setEfficiencyForm(p => ({ ...p, connectivity: e.target.value }))}
                                                    className="mr-3"
                                                    required
                                                />
                                                {opt.label}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Inspection Scheduling - Aligns with public Quote form */}
                            <div className="border-t pt-6 mt-6">
                                <h3 className="text-lg font-semibold text-[#004a90] mb-4">
                                    <i className="ri-calendar-check-line mr-2"></i>
                                    {t.scheduleInspection}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#004a90] mb-2">{t.preferredDate}</label>
                                        <input
                                            type="date"
                                            value={efficiencyForm.bookingDate}
                                            onChange={e => setEfficiencyForm(p => ({ ...p, bookingDate: e.target.value }))}
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#004a90] mb-2">{t.preferredTime}</label>
                                        <select
                                            value={efficiencyForm.bookingTime}
                                            onChange={e => setEfficiencyForm(p => ({ ...p, bookingTime: e.target.value }))}
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                        >
                                            <option value="">{t.selectTimeline}</option>
                                            <option value="morning">{t.morning}</option>
                                            <option value="afternoon">{t.afternoon}</option>
                                            <option value="evening">{t.evening}</option>
                                        </select>
                                    </div>
                                </div>
                                {/* Operating Hours - for commercial properties */}
                                {['small-business', 'office', 'industrial'].includes(efficiencyForm.propertyType) && (
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-[#004a90] mb-2">{t.operatingHours}</label>
                                        <p className="text-xs text-gray-500 mb-2">{t.operatingHoursDesc}</p>
                                        <input
                                            type="text"
                                            value={efficiencyForm.operatingHours}
                                            onChange={e => setEfficiencyForm(p => ({ ...p, operatingHours: e.target.value }))}
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                            placeholder="e.g., 8:00 AM - 6:00 PM"
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Advocacy Form */}
                    {selectedService === 'advocacy' && (
                        <>
                            {/* Property Type */}
                            <div>
                                <label className="block text-sm font-medium text-[#004a90] mb-2">{t.propertyType} *</label>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                    {[
                                        { id: 'residential', label: t.residential, icon: 'ri-home-line' },
                                        { id: 'apartment', label: t.apartment, icon: 'ri-building-line' },
                                        { id: 'small-business', label: t.smallBusiness, icon: 'ri-store-line' },
                                        { id: 'office', label: t.office, icon: 'ri-briefcase-line' },
                                        { id: 'industrial', label: t.industrial, icon: 'ri-building-4-line' }
                                    ].map(opt => (
                                        <div
                                            key={opt.id}
                                            onClick={() => setAdvocacyForm(p => ({ ...p, propertyType: opt.id }))}
                                            className={`p-3 border-2 rounded-lg cursor-pointer text-center ${advocacyForm.propertyType === opt.id ? 'border-[#004a90] bg-[#004a90]/5' : 'border-gray-200'}`}
                                        >
                                            <i className={`${opt.icon} text-xl text-[#004a90]`}></i>
                                            <div className="text-xs mt-1 text-[#004a90]">{opt.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Address */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#004a90] mb-2">{t.address} *</label>
                                    <input
                                        type="text"
                                        value={advocacyForm.address}
                                        onChange={e => setAdvocacyForm(p => ({ ...p, address: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#004a90] mb-2">{t.city} *</label>
                                    <input
                                        type="text"
                                        value={advocacyForm.city}
                                        onChange={e => setAdvocacyForm(p => ({ ...p, city: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#004a90] mb-2">{t.state} *</label>
                                <input
                                    type="text"
                                    value={advocacyForm.state}
                                    onChange={e => setAdvocacyForm(p => ({ ...p, state: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-[#004a90] mb-2">{t.description} *</label>
                                <textarea
                                    value={advocacyForm.description}
                                    onChange={e => setAdvocacyForm(p => ({ ...p, description: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    rows={4}
                                    placeholder={t.descPlaceholder}
                                    required
                                />
                            </div>
                        </>
                    )}

                    {/* Consulting Form */}
                    {selectedService === 'consulting' && (
                        <>
                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-[#004a90] mb-2">{t.description} *</label>
                                <textarea
                                    value={consultingForm.description}
                                    onChange={e => setConsultingForm(p => ({ ...p, description: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    rows={4}
                                    placeholder={t.descPlaceholder}
                                    required
                                />
                            </div>

                            {/* Timeline & Budget */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#004a90] mb-2">{t.timeline}</label>
                                    <select
                                        value={consultingForm.timeline}
                                        onChange={e => setConsultingForm(p => ({ ...p, timeline: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                    >
                                        <option value="">{t.selectTimeline}</option>
                                        <option value="immediate">{t.immediate}</option>
                                        <option value="1-month">{t.oneMonth}</option>
                                        <option value="2-3-months">{t.twoThreeMonths}</option>
                                        <option value="3+-months">{t.moreThanThree}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#004a90] mb-2">{t.budget}</label>
                                    <select
                                        value={consultingForm.budget}
                                        onChange={e => setConsultingForm(p => ({ ...p, budget: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                    >
                                        <option value="">{t.selectRange}</option>
                                        <option value="<5000">&lt; $5,000</option>
                                        <option value="5000-15000">$5,000 - $15,000</option>
                                        <option value="15000-50000">$15,000 - $50,000</option>
                                        <option value="50000+">&gt; $50,000</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Document Upload (all services) */}
                    <div>
                        <label className="block text-sm font-medium text-[#004a90] mb-2">{t.documents}</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
                            >
                                <i className="ri-upload-line mr-2"></i>
                                {t.uploadDocs}
                            </button>
                            {files.length > 0 && (
                                <div className="mt-4 text-left space-y-2">
                                    {files.map(f => (
                                        <div key={f.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                            <span className="text-sm text-gray-700 truncate">{f.file.name}</span>
                                            <button type="button" onClick={() => removeFile(f.id)} className="text-red-500 hover:text-red-700">
                                                <i className="ri-close-line"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        variant="secondary"
                        disabled={submitting}
                        isLoading={submitting}
                        className="w-full rounded-lg font-bold"
                    >
                        {t.submit}
                    </Button>
                </form>
            )}
        </div>
    );
}
