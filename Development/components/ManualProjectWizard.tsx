'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useToast } from '@/components/ui/Toast';
import { ServiceType, Technician, User } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { ActiveProjectService } from '@/app/services/activeProjectService';

interface ManualProjectWizardProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function ManualProjectWizard({ onClose, onSuccess }: ManualProjectWizardProps) {
    const { language } = useLanguage();
    const { showToast } = useToast();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Clients state
    const [clients, setClients] = useState<User[]>([]);
    const [loadingClients, setLoadingClients] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form state interface
    interface ManualProjectFormData {
        clientType: 'existing' | 'new';
        selectedClientId: string;
        newClient: {
            fullName: string;
            email: string;
            phone: string;
            company: string;
        };
        project: {
            name: string;
            service: ServiceType;
            address: string;
            description: string;
            propertyType: string;
            propertySize: string;
            deviceOption: 'purchase' | 'rent';
            connectivity: 'wifi' | '3g';
            timeline: string;
            budget: string;
            phases: { id: string; name: string; amount: number }[];
        };
    }

    // Form state
    const [formData, setFormData] = useState<ManualProjectFormData>({
        clientType: 'existing',
        selectedClientId: '',
        newClient: {
            fullName: '',
            email: '',
            phone: '',
            company: ''
        },
        project: {
            name: '',
            service: 'efficiency',
            address: '',
            description: '',
            propertyType: '',
            propertySize: '',
            deviceOption: 'purchase',
            connectivity: 'wifi',
            timeline: '',
            budget: '',
            phases: []
        }
    });

    useEffect(() => {
        if (formData.clientType === 'existing') {
            fetchClients();
        }
    }, [formData.clientType]);

    const fetchClients = async () => {
        setLoadingClients(true);
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .or('role.eq.customer,role.is.null')
                .order('full_name');
            if (error) throw error;
            setClients(data || []);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoadingClients(false);
        }
    };

    const filteredClients = clients.filter(c =>
        c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async () => {
        setLoading(true);
        try {
            let userId = formData.clientType === 'existing' ? formData.selectedClientId : null;
            let clientName = '';
            let clientEmail = '';
            let clientPhone = '';
            let clientCompany = '';

            if (formData.clientType === 'existing') {
                const client = clients.find(c => c.uid === userId);
                clientName = client?.fullName || '';
                clientEmail = client?.email || '';
                clientPhone = client?.phone || '';
                clientCompany = client?.company || '';
            } else {
                clientName = formData.newClient.fullName;
                clientEmail = formData.newClient.email;
                clientPhone = formData.newClient.phone;
                clientCompany = formData.newClient.company;
            }

            // Create Project
            const projectId = await ActiveProjectService.create({
                userId: userId,
                clientName,
                clientEmail,
                clientPhone,
                clientCompany,
                projectName: formData.project.name || `${clientName} - ${formData.project.service}`,
                service: formData.project.service,
                address: formData.project.address,
                description: formData.project.description,
                // Service Specifics
                propertyType: formData.project.service !== 'consulting' ? formData.project.propertyType : undefined,
                propertySize: formData.project.service === 'efficiency' ? formData.project.propertySize : undefined,
                deviceOption: formData.project.service === 'efficiency' ? formData.project.deviceOption : undefined,
                connectivityType: formData.project.service === 'efficiency' ? formData.project.connectivity : undefined,
                clientTimeline: formData.project.service !== 'efficiency' ? formData.project.timeline : undefined,

                budget: formData.project.service !== 'efficiency' ? formData.project.budget : undefined,
                phases: formData.project.service !== 'efficiency'
                    ? formData.project.phases.map(p => ({
                        ...p,
                        status: 'pending' // Initialize as pending
                    })) as any
                    : [], // Initialize empty for efficiency

                amount: formData.project.service !== 'efficiency'
                    ? formData.project.phases.reduce((sum, p) => sum + (p.amount || 0), 0)
                    : (Number(formData.project.budget) || 0),

                status: userId
                    ? (formData.project.service === 'efficiency' ? 'pending_payment' : 'pending_scheduling')
                    : 'pending_onboarding',
                paymentStatus: 'pending'
            });

            // If new client, create magic link and send onboarding email
            if (!userId) {
                const linkRes = await fetch('/api/create-magic-link', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: clientEmail,
                        fullName: clientName,
                        phone: clientPhone,
                        company: clientCompany,
                        service: formData.project.service
                    })
                });
                const { magicLink } = await linkRes.json();

                await fetch('/api/send-onboarding-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: clientEmail,
                        fullName: clientName,
                        magicLink,
                        service: formData.project.service,
                        language
                    })
                });
            } else {
                // Notify existing client about new project
                await fetch('/api/notify-existing-client', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: clientEmail,
                        fullName: clientName,
                        projectName: formData.project.name || `${clientName} - ${formData.project.service}`,
                        service: formData.project.service,
                        language
                    })
                });
            }

            showToast(
                language === 'es' ? 'Proyecto creado exitosamente' : 'Project created successfully',
                'success'
            );
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error creating project:', error);
            showToast('Error creating project', 'error');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const t = {
        en: {
            step1: 'Client Selection',
            step2: 'Project Details',
            step1: 'Client Selection',
            step2: 'Project Details',
            step3: 'Payment Phases',
            step4: 'Confirmation',
            existingClient: 'Existing Client',
            newClient: 'New Client',
            selectClient: 'Select Client',
            searchClients: 'Search clients...',
            fullName: 'Full Name',
            email: 'Email',
            phone: 'Phone',
            company: 'Company',
            projectName: 'Project Name',
            serviceType: 'Service Type',
            address: 'Installation Address',
            description: 'Project Description',
            consulting: 'Consulting',
            efficiency: 'Energy Efficiency',
            advocacy: 'Advocacy',
            back: 'Back',
            next: 'Next',
            createProject: 'Create Project',
            summary: 'Review project initiation',
            client: 'Client',
            service: 'Service',
            onboardingNote: 'This is a new client. They will receive an onboarding email to activate their account and schedule the project.',
            propertyType: 'Property Type',
            propertySize: 'Property Size',
            deviceOption: 'Device Option',
            connectivity: 'Connectivity',
            timeline: 'Timeline',
            budget: 'Budget',
            rent: 'Rent',
            purchase: 'Purchase',
            residential: 'Residential',
            commercial: 'Commercial'
        },
        es: {
            step1: 'Selección de Cliente',
            step2: 'Detalles del Proyecto',
            step1: 'Selección de Cliente',
            step2: 'Detalles del Proyecto',
            step3: 'Fases de Pago',
            step4: 'Confirmación',
            existingClient: 'Cliente Existente',
            newClient: 'Nuevo Cliente',
            selectClient: 'Seleccionar Cliente',
            searchClients: 'Buscar clientes...',
            fullName: 'Nombre Completo',
            email: 'Correo Electrónico',
            phone: 'Teléfono',
            company: 'Empresa',
            projectName: 'Nombre del Proyecto',
            serviceType: 'Tipo de Servicio',
            address: 'Dirección de Instalación',
            description: 'Descripción del Proyecto',
            consulting: 'Consultoría',
            efficiency: 'Eficiencia Energética',
            advocacy: 'Abogacía Energética',
            back: 'Atrás',
            next: 'Siguiente',
            createProject: 'Crear Proyecto',
            summary: 'Revisar inicio de proyecto',
            client: 'Cliente',
            service: 'Servicio',
            onboardingNote: 'Este es un cliente nuevo. Recibirá un correo de onboarding para activar su cuenta y agendar el proyecto.',
            propertyType: 'Tipo de Propiedad',
            propertySize: 'Tamaño de Propiedad',
            deviceOption: 'Opción de Equipo',
            connectivity: 'Conectividad',
            timeline: 'Tiempo Estimado',
            budget: 'Presupuesto',
            rent: 'Alquiler',
            purchase: 'Compra',
            residential: 'Residencial',
            commercial: 'Comercial'
        }
    }[language as 'en' | 'es'];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#004a90]">
                        {step === 1 ? t.step1 : step === 2 ? t.step2 : step === 3 ? (formData.project.service === 'efficiency' ? t.summary : t.step3) : t.summary}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <i className="ri-close-line text-2xl"></i>
                    </button>
                </div>

                <div className="p-6">
                    {/* Progress Bar */}
                    <div className="flex gap-2 mb-8">
                        {[1, 2, 3, 4].map(i => {
                            if (formData.project.service === 'efficiency' && i === 3) return null; // Skip phase step for efficiency
                            return (
                                <div key={i} className={`h-2 flex-1 rounded-full ${i <= step ? 'bg-[#c3d021]' : 'bg-gray-100'}`}></div>
                            );
                        })}
                    </div>

                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="flex bg-gray-100 p-1 rounded-xl">
                                <button
                                    onClick={() => setFormData(f => ({ ...f, clientType: 'existing' }))}
                                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${formData.clientType === 'existing' ? 'bg-white shadow-sm text-[#004a90]' : 'text-gray-500'}`}
                                >
                                    {t.existingClient}
                                </button>
                                <button
                                    onClick={() => setFormData(f => ({ ...f, clientType: 'new' }))}
                                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${formData.clientType === 'new' ? 'bg-white shadow-sm text-[#004a90]' : 'text-gray-500'}`}
                                >
                                    {t.newClient}
                                </button>
                            </div>

                            {formData.clientType === 'existing' ? (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                        <input
                                            type="text"
                                            placeholder={t.searchClients}
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#004a90]/20"
                                        />
                                    </div>
                                    <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                                        {loadingClients ? (
                                            <div className="text-center py-4 text-gray-500">Loading clients...</div>
                                        ) : filteredClients.map(client => (
                                            <div
                                                key={client.uid}
                                                onClick={() => setFormData(f => ({ ...f, selectedClientId: client.uid }))}
                                                className={`p-3 border rounded-xl cursor-pointer transition-all ${formData.selectedClientId === client.uid ? 'border-[#c3d021] bg-[#c3d021]/5 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}
                                            >
                                                <p className="font-bold text-[#004a90]">{client.fullName}</p>
                                                <p className="text-sm text-gray-500">{client.email}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.fullName}</label>
                                        <input
                                            type="text"
                                            value={formData.newClient.fullName}
                                            onChange={e => setFormData(f => ({ ...f, newClient: { ...f.newClient, fullName: e.target.value } }))}
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.email}</label>
                                        <input
                                            type="email"
                                            value={formData.newClient.email}
                                            onChange={e => setFormData(f => ({ ...f, newClient: { ...f.newClient, email: e.target.value } }))}
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.phone}</label>
                                        <input
                                            type="text"
                                            value={formData.newClient.phone}
                                            onChange={e => setFormData(f => ({ ...f, newClient: { ...f.newClient, phone: e.target.value } }))}
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1 text-gray-500">{t.company} (Optional)</label>
                                        <input
                                            type="text"
                                            value={formData.newClient.company}
                                            onChange={e => setFormData(f => ({ ...f, newClient: { ...f.newClient, company: e.target.value } }))}
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t.projectName}</label>
                                <input
                                    type="text"
                                    value={formData.project.name}
                                    onChange={e => setFormData(f => ({ ...f, project: { ...f.project, name: e.target.value } }))}
                                    placeholder="Ex: Solar San Francisco"
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t.serviceType}</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['efficiency', 'consulting', 'advocacy'] as ServiceType[]).map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setFormData(f => ({ ...f, project: { ...f.project, service: type } }))}
                                            className={`py-2 text-sm font-bold rounded-lg border-2 transition-all ${formData.project.service === type ? 'border-[#c3d021] bg-[#c3d021]/5 text-[#194271]' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
                                        >
                                            {t[type]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t.address}</label>
                                <input
                                    type="text"
                                    value={formData.project.address}
                                    onChange={e => setFormData(f => ({ ...f, project: { ...f.project, address: e.target.value } }))}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>

                            {/* Dynamic Fields based on Service */}
                            {formData.project.service !== 'consulting' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.propertyType}</label>
                                        <select
                                            value={formData.project.propertyType}
                                            onChange={e => setFormData(f => ({ ...f, project: { ...f.project, propertyType: e.target.value } }))}
                                            className="w-full px-4 py-2 border rounded-lg"
                                        >
                                            <option value="">Select...</option>
                                            <option value="residential">{t.residential}</option>
                                            <option value="commercial">{t.commercial}</option>
                                        </select>
                                    </div>
                                    {formData.project.service === 'efficiency' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.propertySize}</label>
                                            <input
                                                type="text"
                                                value={formData.project.propertySize}
                                                onChange={e => setFormData(f => ({ ...f, project: { ...f.project, propertySize: e.target.value } }))}
                                                placeholder="m2 / sqft"
                                                className="w-full px-4 py-2 border rounded-lg"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {formData.project.service === 'efficiency' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.deviceOption}</label>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setFormData(f => ({ ...f, project: { ...f.project, deviceOption: 'purchase' } }))}
                                                className={`flex-1 py-2 text-xs font-bold rounded border ${formData.project.deviceOption === 'purchase' ? 'bg-[#004a90] text-white' : 'border-gray-200 text-gray-500'}`}
                                            >
                                                {t.purchase}
                                            </button>
                                            <button
                                                onClick={() => setFormData(f => ({ ...f, project: { ...f.project, deviceOption: 'rent' } }))}
                                                className={`flex-1 py-2 text-xs font-bold rounded border ${formData.project.deviceOption === 'rent' ? 'bg-[#004a90] text-white' : 'border-gray-200 text-gray-500'}`}
                                            >
                                                {t.rent}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.connectivity}</label>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setFormData(f => ({ ...f, project: { ...f.project, connectivity: 'wifi' } }))}
                                                className={`flex-1 py-2 text-xs font-bold rounded border ${formData.project.connectivity === 'wifi' ? 'bg-[#004a90] text-white' : 'border-gray-200 text-gray-500'}`}
                                            >
                                                WiFi
                                            </button>
                                            <button
                                                onClick={() => setFormData(f => ({ ...f, project: { ...f.project, connectivity: '3g' } }))}
                                                className={`flex-1 py-2 text-xs font-bold rounded border ${formData.project.connectivity === '3g' ? 'bg-[#004a90] text-white' : 'border-gray-200 text-gray-500'}`}
                                            >
                                                3G
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {formData.project.service !== 'efficiency' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.timeline}</label>
                                        <input
                                            type="text"
                                            value={formData.project.timeline}
                                            onChange={e => setFormData(f => ({ ...f, project: { ...f.project, timeline: e.target.value } }))}
                                            placeholder="Ex: 3 months"
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.budget}</label>
                                        <input
                                            type="text"
                                            value={formData.project.budget}
                                            onChange={e => setFormData(f => ({ ...f, project: { ...f.project, budget: e.target.value } }))}
                                            placeholder="Ex: $5000"
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t.description}</label>
                                <textarea
                                    value={formData.project.description}
                                    onChange={e => setFormData(f => ({ ...f, project: { ...f.project, description: e.target.value } }))}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    rows={3}
                                ></textarea>
                            </div>
                        </div>
                    )}

                </div>
                    )}

                {step === 3 && formData.project.service !== 'efficiency' && (
                    <div className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                            <p className="text-sm text-blue-800">
                                {language === 'es'
                                    ? 'Define las fases de pago para este proyecto. El cliente podrá pagar cada fase individualmente.'
                                    : 'Define payment phases for this project. The client will be able to pay each phase individually.'}
                            </p>
                        </div>

                        <div className="space-y-3">
                            {formData.project.phases.map((phase, idx) => (
                                <div key={idx} className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        value={phase.name}
                                        onChange={e => {
                                            const newPhases = [...formData.project.phases];
                                            newPhases[idx].name = e.target.value;
                                            setFormData(f => ({ ...f, project: { ...f.project, phases: newPhases } }));
                                        }}
                                        placeholder="Phase Name (e.g., Initial Deposit)"
                                        className="flex-[2] px-4 py-2 border rounded-lg"
                                    />
                                    <input
                                        type="number"
                                        value={phase.amount}
                                        onChange={e => {
                                            const newPhases = [...formData.project.phases];
                                            newPhases[idx].amount = Number(e.target.value);
                                            setFormData(f => ({ ...f, project: { ...f.project, phases: newPhases } }));
                                        }}
                                        placeholder="Amount"
                                        className="flex-1 px-4 py-2 border rounded-lg"
                                    />
                                    <button
                                        onClick={() => {
                                            const newPhases = formData.project.phases.filter((_, i) => i !== idx);
                                            setFormData(f => ({ ...f, project: { ...f.project, phases: newPhases } }));
                                        }}
                                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                                    >
                                        <i className="ri-delete-bin-line"></i>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setFormData(f => ({
                                ...f,
                                project: {
                                    ...f.project,
                                    phases: [...f.project.phases, { id: crypto.randomUUID(), name: '', amount: 0 }]
                                }
                            }))}
                            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-[#004a90] hover:text-[#004a90] transition-colors"
                        >
                            <i className="ri-add-line mr-2"></i>
                            {language === 'es' ? 'Agregar Fase' : 'Add Phase'}
                        </button>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <span className="font-medium text-gray-700">Total</span>
                            <span className="text-xl font-bold text-[#004a90]">
                                ${formData.project.phases.reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2)}
                            </span>
                        </div>
                    </div>
                )}

                {(step === 4 || (step === 3 && formData.project.service === 'efficiency')) && (
                    <div className="space-y-6">
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">{t.summary}</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-gray-900 border-b border-gray-100 pb-3">
                                    <span className="font-medium">{t.client}</span>
                                    <span className="font-bold">
                                        {formData.clientType === 'existing'
                                            ? clients.find(c => c.uid === formData.selectedClientId)?.fullName
                                            : formData.newClient.fullName}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-gray-900 border-b border-gray-100 pb-3">
                                    <span className="font-medium">{t.service}</span>
                                    <span className="font-bold capitalize text-[#004a90]">{t[formData.project.service]}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-900">
                                    <span className="font-medium">{t.projectName}</span>
                                    <span className="font-bold">{formData.project.name || '-'}</span>
                                </div>
                            </div>
                        </div>

                        {formData.clientType === 'new' && (
                            <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                <i className="ri-information-line text-amber-600 text-xl"></i>
                                <p className="text-sm text-amber-800">{t.onboardingNote}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex gap-3">
                {step > 1 && (
                    <button
                        onClick={prevStep}
                        className="px-6 py-2 border border-gray-300 rounded-xl font-medium text-gray-600 hover:bg-white transition-colors"
                    >
                        {t.back}
                    </button>
                )}
                <button
                    onClick={step === 3 && formData.project.service === 'efficiency' ? handleSubmit : step === 4 ? handleSubmit : nextStep}
                    disabled={
                        loading ||
                        (step === 1 && (formData.clientType === 'existing' ? !formData.selectedClientId : (!formData.newClient.fullName || !formData.newClient.email))) ||
                        (step === 2 && !formData.project.address) ||
                        (step === 3 && formData.project.service !== 'efficiency' && formData.project.phases.length === 0)
                    }
                    className="flex-1 px-6 py-2 bg-[#004a90] text-white rounded-xl font-bold hover:bg-[#194271] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? '...' : (step === 4 || (step === 3 && formData.project.service === 'efficiency')) ? t.createProject : t.next}
                </button>
            </div>
        </div>
    );
}
