'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';

interface Inquiry {
    id: string;
    clientId?: string;
    full_name: string; // Supabase column
    email: string;
    phone: string;
    company?: string;
    service: string;
    project_description?: string; // New column
    status?: 'pending' | 'in_process' | 'completed' | 'closed';
    created_at: string; // Supabase returns ISO string
    isNew?: boolean;
    // Map old field names for compatibility if needed or update usage
    fullName?: string;
    createdAt?: any;
    latestDate?: any;
}

interface GroupedInquiry {
    clientId: string;
    clientName: string;
    email: string;
    phone: string;
    inquiries: Inquiry[];
    newCount: number;
    latestDate: Date; // Changed to Date object
}

// ... imports

export default function InquiriesPage() {
    const { language } = useLanguage();
    const router = useRouter();
    const [groupedInquiries, setGroupedInquiries] = useState<GroupedInquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Helper function to generate client ID
    const generateClientId = (email: string, phone: string) => {
        return `${email}_${phone}`.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    };

    useEffect(() => {
        const fetchInquiries = async () => {
            try {
                const { data, error } = await supabase
                    .from('inquiries')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                const allInquiries: Inquiry[] = (data || []).map(item => ({
                    ...item,
                    fullName: item.full_name, // Map snake_case to camelCase
                    createdAt: item.created_at
                }));

                // Group inquiries by client (email + phone)
                const grouped = new Map<string, GroupedInquiry>();

                allInquiries.forEach(inquiry => {
                    // Handle missing email/phone gracefully
                    const email = inquiry.email || '';
                    const phone = inquiry.phone || '';
                    const clientId = generateClientId(email, phone);

                    if (!grouped.has(clientId)) {
                        grouped.set(clientId, {
                            clientId,
                            clientName: inquiry.full_name || inquiry.fullName || 'Unknown',
                            email: email,
                            phone: phone,
                            inquiries: [],
                            newCount: 0,
                            latestDate: new Date(inquiry.createdAt || 0)
                        });
                    }

                    const group = grouped.get(clientId)!;
                    group.inquiries.push(inquiry);

                    // Count new inquiries
                    if (inquiry.status === 'pending') {
                        group.newCount++;
                    }

                    // Update latest date
                    const inquiryDate = new Date(inquiry.createdAt || 0);
                    if (inquiryDate > group.latestDate) {
                        group.latestDate = inquiryDate;
                    }
                });

                // Convert to array and sort by latest date
                const groupedArray = Array.from(grouped.values()).sort((a, b) => {
                    return b.latestDate.getTime() - a.latestDate.getTime();
                });

                setGroupedInquiries(groupedArray);
            } catch (error) {
                console.error('Error fetching inquiries:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInquiries();
    }, []);

    const content = {
        en: {
            title: 'Client Inquiries',
            subtitle: 'Manage customer inquiries grouped by client',
            client: 'Client',
            totalInquiries: 'Total Inquiries',
            newInquiries: 'New',
            lastContact: 'Last Contact',
            actions: 'Actions',
            noInquiries: 'No inquiries found',
            viewDetails: 'View Details',
            status: 'Status',
            statusPending: 'Pending',
            statusInProcess: 'In Process',
            statusCompleted: 'Completed',
            statusClosed: 'Closed',
            searchPlaceholder: 'Search by name, email, phone or ID...',
            grandTotal: 'Grand Total Inquiries'
        },
        es: {
            title: 'Consultas de Clientes',
            subtitle: 'Gestionar consultas de clientes agrupadas',
            client: 'Cliente',
            totalInquiries: 'Total de Consultas',
            newInquiries: 'Nuevas',
            lastContact: 'Último Contacto',
            actions: 'Acciones',
            noInquiries: 'No se encontraron consultas',
            viewDetails: 'Ver Detalles',
            status: 'Estado',
            statusPending: 'Pendiente',
            statusInProcess: 'En Proceso',
            statusCompleted: 'Completado',
            statusClosed: 'Cerrado',
            searchPlaceholder: 'Buscar por nombre, email, teléfono o ID...',
            grandTotal: 'Gran Total de Consultas'
        }
    };

    const t = content[language];

    // Calculate Grand Total
    const grandTotalInquiries = groupedInquiries.reduce((acc, group) => acc + group.inquiries.length, 0);

    // Filter Logic
    const filteredInquiries = groupedInquiries.filter(group => {
        const query = searchQuery.toLowerCase();
        return (
            group.clientName?.toLowerCase().includes(query) ||
            group.email?.toLowerCase().includes(query) ||
            group.phone?.includes(query) ||
            group.clientId?.includes(query)
        );
    });

    // ... (getStatusBadge remains useful if needed later, but not used in main table currently)

    if (loading) {
        return <PageLoadingSkeleton title={t.title} />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[#004a90]">{t.title}</h1>
                <p className="text-gray-600 mt-1">{t.subtitle}</p>
            </div>

            {/* Inquiries Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#004a90] rounded-full flex items-center justify-center">
                            <i className="ri-message-3-line text-white text-2xl"></i>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-[#004a90]">
                                {language === 'es' ? 'Consultas Generales' : 'General Inquiries'}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {language === 'es' ? 'Contacto inicial de clientes' : 'Initial client contact'}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-[#004a90]">{grandTotalInquiries}</p>
                        <p className="text-sm text-gray-500">{t.grandTotal}</p>
                    </div>
                </div>
                <div className="text-sm text-gray-600 border-t border-gray-100 pt-3">
                    <span className="text-green-600 font-medium">
                        {groupedInquiries.reduce((sum, g) => sum + g.newCount, 0)}
                    </span> {language === 'es' ? 'pendientes' : 'pending'}
                </div>
            </div>
            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative">
                    <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004a90] text-gray-600 placeholder-gray-400"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {filteredInquiries.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#004a90] uppercase tracking-wider">
                                        {t.client}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#004a90] uppercase tracking-wider">
                                        {t.totalInquiries}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#004a90] uppercase tracking-wider">
                                        {t.lastContact}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#004a90] uppercase tracking-wider">
                                        {t.actions}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredInquiries.map((group) => (
                                    <tr
                                        key={group.clientId}
                                        onClick={() => router.push(`/portal/admin/inquiries/client/${group.clientId}`)}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-[#194271] rounded-full flex items-center justify-center">
                                                    <span className="text-white font-bold">
                                                        {group.clientName.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="font-medium text-[#004a90]">{group.clientName}</div>
                                                    <div className="text-sm text-gray-600">{group.email}</div>
                                                    <div className="text-sm text-gray-500">{group.phone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-bold text-[#004a90]">
                                                    {group.inquiries.length}
                                                </span>
                                                {group.newCount > 0 && (
                                                    <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                                                        {group.newCount} {t.newInquiries}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {group.latestDate ? group.latestDate.toLocaleString(language === 'es' ? 'es-PA' : 'en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : 'Recently'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/portal/admin/inquiries/client/${group.clientId}`);
                                                }}
                                                className="text-[#004a90] hover:text-[#c3d021] text-sm font-medium"
                                            >
                                                {t.viewDetails} →
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <i className="ri-message-3-line text-6xl text-gray-300 mb-4 block"></i>
                        <p className="text-gray-500">{t.noInquiries}</p>
                    </div>
                )}
            </div>
        </div >
    );
}
