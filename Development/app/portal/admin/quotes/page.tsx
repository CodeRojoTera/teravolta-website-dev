'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useRouter } from 'next/navigation';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';
import { Quote, ServiceType, QuoteStatus } from '@/lib/types';
import { QuoteService } from '@/app/services/quoteService';

export default function QuotesPage() {
    const { language } = useLanguage();
    const router = useRouter();
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeService, setActiveService] = useState<ServiceType | 'all'>('all');

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const data = await QuoteService.getAll();
                // Filter out efficiency if needed, or keep all. Original code filtered efficiency?
                // Original: .filter((q: Quote) => q.service !== 'efficiency');
                // Removed legacy filter: .filter(q => q.service !== 'efficiency');
                const filteredData = data;
                setQuotes(filteredData);
                setFilteredQuotes(filteredData);
            } catch (error) {
                console.error('Error fetching quotes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuotes();
    }, []);

    useEffect(() => {
        if (activeService === 'all') {
            setFilteredQuotes(quotes);
        } else {
            setFilteredQuotes(quotes.filter(q =>
                q.service?.toLowerCase().includes(activeService.toLowerCase())
            ));
        }
    }, [activeService, quotes]);

    const content = {
        en: {
            title: 'Quotes Management',
            subtitle: 'Review and manage customer quotation requests',
            all: 'All Services',
            consulting: 'Consulting',
            efficiency: 'Efficiency',
            advocacy: 'Advocacy',
            client: 'Client',
            service: 'Service',
            amount: 'Amount',
            status: 'Status',
            date: 'Date',
            actions: 'Actions',
            noQuotes: 'No quotes found',
            viewDetails: 'View Details',
            pending: 'Pending',
            statusPendingReview: 'Pending Review',
            statusInReview: 'In Review',
            statusApproved: 'Approved',
            statusPaid: 'Paid',
            statusRejected: 'Rejected',
            statusCancelled: 'Cancelled',
            details: 'Details'
        },
        es: {
            title: 'Gestión de Cotizaciones',
            subtitle: 'Revisar y gestionar solicitudes de cotización de clientes',
            all: 'Todos los Servicios',
            consulting: 'Consultoría',
            efficiency: 'Eficiencia',
            advocacy: 'Abogacía',
            client: 'Cliente',
            service: 'Servicio',
            amount: 'Monto',
            status: 'Estado',
            date: 'Fecha',
            actions: 'Acciones',
            noQuotes: 'No se encontraron cotizaciones',
            viewDetails: 'Ver Detalles',
            pending: 'Pendiente',
            statusPendingReview: 'Pendiente Revisión',
            statusInReview: 'En Revisión',
            statusApproved: 'Aprobado',
            statusPaid: 'Pagado',
            statusRejected: 'Rechazado',
            statusCancelled: 'Cancelado',
            details: 'Detalles'
        }
    };

    const t = content[language];

    const getStatusBadge = (status: QuoteStatus) => {
        const badges: Record<string, React.ReactNode> = {
            pending_review: <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 font-medium">{t.statusPendingReview}</span>,
            in_review: <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">{t.statusInReview}</span>,
            approved: <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">{t.statusApproved}</span>,
            paid: <span className="px-3 py-1 text-xs rounded-full bg-teal-100 text-teal-800 font-medium">{t.statusPaid}</span>,
            rejected: <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-800 font-medium">{t.statusRejected}</span>,
            cancelled: <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-800 font-medium">{t.statusCancelled}</span>
        };
        return badges[status as string] || badges.pending_review;
    };

    if (loading) {
        return <PageLoadingSkeleton title={t.title} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
                    <p className="text-gray-500">{t.subtitle}</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex overflow-x-auto pb-2 gap-2">
                <button
                    onClick={() => setActiveService('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeService === 'all'
                        ? 'bg-[#004a90] text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    {t.all}
                </button>
                <button
                    onClick={() => setActiveService('consulting')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeService === 'consulting'
                        ? 'bg-[#004a90] text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    {t.consulting}
                </button>
                <button
                    onClick={() => setActiveService('efficiency')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeService === 'efficiency'
                        ? 'bg-[#004a90] text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    {t.efficiency}
                </button>
                <button
                    onClick={() => setActiveService('advocacy')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeService === 'advocacy'
                        ? 'bg-[#004a90] text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    {t.advocacy}
                </button>
            </div>

            {/* Quotes List Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.client}</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.service}</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.details}</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.status}</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.date}</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">{t.actions}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredQuotes.length > 0 ? (
                                filteredQuotes.map((quote) => (
                                    <tr
                                        key={quote.id}
                                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => router.push(`/portal/admin/quotes/${quote.id}`)}
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{quote.clientName}</p>
                                                <p className="text-sm text-gray-500">{quote.clientEmail}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${quote.service === 'consulting' ? 'bg-blue-100 text-blue-700' :
                                                quote.service === 'advocacy' ? 'bg-purple-100 text-purple-700' :
                                                    quote.service === 'efficiency' ? 'bg-lime-100 text-lime-700' :
                                                        'bg-gray-100 text-gray-700'
                                                }`}>
                                                {quote.service}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-xs">
                                                {quote.projectDescription && (
                                                    <p className="text-sm text-gray-700 truncate" title={quote.projectDescription}>
                                                        {quote.projectDescription}
                                                    </p>
                                                )}
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {quote.timeline && (
                                                        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                                            📅 {quote.timeline}
                                                        </span>
                                                    )}
                                                    {quote.budget && (
                                                        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                                            💰 {quote.budget}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(quote.status)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(quote.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                className="text-[#004a90] hover:text-[#194271] font-medium text-sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/portal/admin/quotes/${quote.id}`);
                                                }}
                                            >
                                                {t.viewDetails}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <i className="ri-file-list-3-line text-3xl mb-3 text-gray-300"></i>
                                            <p>{t.noQuotes}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
