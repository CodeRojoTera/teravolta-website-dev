'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toJsDate, formatJsDate } from '@/lib/dateUtils';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';

export default function AdminDashboard() {
    const { language } = useLanguage();
    const { user } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({
        pendingInquiries: 0,
        pendingQuotes: 0,
        activeTechnicians: 0,
        jobsInProgress: 0,
        totalInquiries: 0, // Keep for chart context
        urgentIncidents: 0
    });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                // Pending Inquiries
                const { count: pendingInquiries } = await supabase
                    .from('inquiries')
                    .select('id', { count: 'exact', head: true })
                    .eq('status', 'new');

                // Pending Quotes
                const { count: pendingQuotes } = await supabase
                    .from('quotes')
                    .select('id', { count: 'exact', head: true })
                    .eq('status', 'pending')
                    .neq('service', 'efficiency')
                    .neq('service', '');

                // Active Technicians (derived from appointments currently in progress)
                const { data: activeApps } = await supabase
                    .from('appointments')
                    .select('technician_id')
                    .in('status', ['on_route', 'in_progress']);

                const activeTechnicians = new Set(activeApps?.map(a => a.technician_id)).size;

                // Active Jobs (Projects in progress/active)
                const { count: jobsInProgress } = await supabase
                    .from('active_projects')
                    .select('id', { count: 'exact', head: true })
                    .in('status', ['active', 'in_progress', 'pending_installation', 'pending_assignment']);

                // For Chart: Total Inquiries (last 6 months logic)
                // Fetch all inquiries created_at
                const { data: inquiriesData, count: totalInquiries } = await supabase
                    .from('inquiries')
                    .select('created_at', { count: 'exact' });

                // Process chart data
                const today = new Date();
                const processedData: { date: Date; month: string; inquiries: number }[] = [];
                for (let i = 5; i >= 0; i--) {
                    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
                    processedData.push({
                        date: d,
                        month: d.toLocaleString(language === 'es' ? 'es-PA' : 'en-US', { month: 'short' }),
                        inquiries: 0
                    });
                }

                if (inquiriesData) {
                    inquiriesData.forEach(item => {
                        if (item.created_at) {
                            const date = new Date(item.created_at);
                            const monthStr = date.toLocaleString(language === 'es' ? 'es-PA' : 'en-US', { month: 'short' });
                            const match = processedData.find((d: any) => d.month === monthStr &&
                                d.date.getMonth() === date.getMonth() &&
                                d.date.getFullYear() === date.getFullYear()
                            );
                            if (match) match.inquiries++;
                        }
                    });
                }
                setChartData(processedData);

                // Urgent Incidents
                // Assuming 'active_projects' is the table name in Supabase
                const { count: urgentIncidents } = await supabase
                    .from('active_projects')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'urgent_reschedule');

                setStats({
                    pendingInquiries: pendingInquiries || 0,
                    pendingQuotes: pendingQuotes || 0,
                    activeTechnicians,
                    jobsInProgress: jobsInProgress || 0,
                    totalInquiries: totalInquiries || 0,
                    urgentIncidents: urgentIncidents || 0
                });

                // Recent Activity Fetch
                const [
                    { data: recentInquiries },
                    { data: recentQuotes },
                    { data: recentProjects }
                ] = await Promise.all([
                    supabase.from('inquiries').select('id, full_name, service, created_at').order('created_at', { ascending: false }).limit(5),
                    supabase.from('quotes').select('id, client_name, created_at').neq('service', 'efficiency').neq('service', '').order('created_at', { ascending: false }).limit(5), // removed amount, added filters
                    supabase.from('active_projects').select('id, service, client_name, status, created_at').order('created_at', { ascending: false }).limit(5) // removed project_name, added service/client_name
                ]);

                const combinedActivity = [
                    ...(recentInquiries || []).map(i => ({
                        id: i.id,
                        type: 'inquiry',
                        fullName: i.full_name,
                        service: i.service,
                        createdAt: toJsDate(i.created_at)
                    })),
                    ...(recentQuotes || []).map(q => ({
                        id: q.id,
                        type: 'quote',
                        clientName: q.client_name,
                        amount: 0, // Default to 0 as column doesn't exist
                        createdAt: toJsDate(q.created_at)
                    })),
                    ...(recentProjects || []).map(p => ({
                        id: p.id,
                        type: 'project',
                        projectName: `${p.service} - ${p.client_name}`, // Construct verified project name
                        status: p.status,
                        createdAt: toJsDate(p.created_at)
                    }))
                ].sort((a, b) => {
                    const timeA = a.createdAt ? a.createdAt.getTime() : 0;
                    const timeB = b.createdAt ? b.createdAt.getTime() : 0;
                    return timeB - timeA;
                })
                    .slice(0, 10);

                setRecentActivity(combinedActivity);
                setLoading(false);

            } catch (error) {
                console.error('Error fetching dashboard metrics:', error);
                setLoading(false);
            }
        };

        fetchMetrics();
        // Removed real-time listeners for now during migration
    }, [language]);


    const content = {
        en: {
            title: 'Command Center',
            subtitle: 'Real-time operational overview',
            attentionNeeded: 'Attention Needed',
            fieldOps: 'Field Operations',
            pendingInquiries: 'New Inquiries',
            pendingQuotes: 'Pending Quotes',
            jobsActive: 'Active Jobs',
            techsOnRoute: 'Techs on Route',
            recentActivity: 'Live Activity Feed',
            noActivity: 'No recent activity',
            types: {
                inquiry: { label: 'New Inquiry', icon: 'ri-message-3-line', color: 'bg-blue-100 text-blue-600' },
                quote: { label: 'Quote Request', icon: 'ri-file-list-3-line', color: 'bg-yellow-100 text-yellow-600' },
                project: { label: 'Project Update', icon: 'ri-briefcase-line', color: 'bg-green-100 text-green-600' }
            }
        },
        es: {
            title: 'Centro de Comando',
            subtitle: 'Resumen operativo en tiempo real',
            attentionNeeded: 'Requiere Atención',
            fieldOps: 'Operaciones de Campo',
            pendingInquiries: 'Nuevas Consultas',
            pendingQuotes: 'Cotizaciones Pendientes',
            jobsActive: 'Trabajos Activos',
            techsOnRoute: 'Técnicos en Ruta',
            recentActivity: 'Actividad en Vivo',
            noActivity: 'Sin actividad reciente',
            types: {
                inquiry: { label: 'Nueva Consulta', icon: 'ri-message-3-line', color: 'bg-blue-100 text-blue-600' },
                quote: { label: 'Solicitud Cotización', icon: 'ri-file-list-3-line', color: 'bg-yellow-100 text-yellow-600' },
                project: { label: 'Actualización Proyecto', icon: 'ri-briefcase-line', color: 'bg-green-100 text-green-600' }
            }
        }
    };

    const t = content[language];

    const getActivityDetails = (activity: any) => {
        const typeConfig = t.types[activity.type as keyof typeof t.types] || t.types.inquiry;
        let title = typeConfig.label;
        let subtitle = '';

        if (activity.type === 'inquiry') {
            subtitle = `${activity.fullName || 'Anonymous'} - ${activity.service || 'General'}`;
        } else if (activity.type === 'quote') {
            subtitle = `${activity.clientName || activity.fullName || 'Client'} - $${activity.amount || 0}`;
        } else if (activity.type === 'project') {
            subtitle = `${activity.projectName} - ${activity.status}`;
        }

        return { typeConfig, title, subtitle };
    };

    if (loading) return <PageLoadingSkeleton title={t.title} />;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-teravolta-blue">{t.title}</h1>
                <p className="text-gray-600 mt-1">{t.subtitle}</p>
            </div>

            {/* Row 1: Operational Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Urgent Attention Needed Banner */}
                {stats.urgentIncidents > 0 && (
                    <div
                        onClick={() => router.push('/portal/admin/active-projects')}
                        className="col-span-full bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm flex items-center justify-between cursor-pointer hover:bg-red-100 transition-colors"
                    >
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-red-200 flex items-center justify-center text-red-700 mr-4">
                                <i className="ri-alarm-warning-line text-xl"></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-red-800">
                                    {language === 'es' ? '¡Atención Requerida!' : 'Attention Required!'}
                                </h3>
                                <p className="text-red-700">
                                    {language === 'es'
                                        ? `${stats.urgentIncidents} proyectos requieren reagendamiento urgente.`
                                        : `${stats.urgentIncidents} projects require urgent rescheduling.`}
                                </p>
                            </div>
                        </div>
                        <i className="ri-arrow-right-line text-red-500"></i>
                    </div>
                )}

                {/* Pending Inquiries (Attention) */}
                <div
                    onClick={() => router.push('/portal/admin/inquiries')}
                    className={`bg-white rounded-xl p-6 shadow-sm border cursor-pointer hover:shadow-md transition-all ${stats.pendingInquiries > 0 ? 'border-l-4 border-l-blue-500' : 'border-gray-100'}`}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{t.pendingInquiries}</p>
                            {stats.pendingInquiries > 0 ? (
                                <h3 className="text-3xl font-bold text-teravolta-blue mt-2">{stats.pendingInquiries}</h3>
                            ) : (
                                <div className="mt-2 flex items-center gap-2">
                                    <i className="ri-checkbox-circle-line text-green-500 text-xl"></i>
                                    <span className="text-sm font-medium text-gray-400">
                                        {language === 'es' ? 'Todo al día' : 'All caught up'}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stats.pendingInquiries > 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                            <i className="ri-message-3-line text-xl"></i>
                        </div>
                    </div>
                </div>

                {/* Pending Quotes (Attention) */}
                <div
                    onClick={() => router.push('/portal/admin/quotes')}
                    className={`bg-white rounded-xl p-6 shadow-sm border cursor-pointer hover:shadow-md transition-all ${stats.pendingQuotes > 0 ? 'border-l-4 border-l-yellow-500' : 'border-gray-100'}`}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{t.pendingQuotes}</p>
                            {stats.pendingQuotes > 0 ? (
                                <h3 className="text-3xl font-bold text-teravolta-blue mt-2">{stats.pendingQuotes}</h3>
                            ) : (
                                <div className="mt-2 flex items-center gap-2">
                                    <i className="ri-checkbox-circle-line text-green-500 text-xl"></i>
                                    <span className="text-sm font-medium text-gray-400">
                                        {language === 'es' ? 'Todo al día' : 'All caught up'}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stats.pendingQuotes > 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}>
                            <i className="ri-file-list-3-line text-xl"></i>
                        </div>
                    </div>
                </div>

                {/* Active Jobs (Operations) */}
                <div
                    onClick={() => router.push('/portal/admin/active-projects')} // Ideally link to a calendar/map view
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all border-l-4 border-l-green-500"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{t.jobsActive}</p>
                            <h3 className="text-3xl font-bold text-teravolta-blue mt-2">{stats.jobsInProgress}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <i className="ri-tools-line text-xl"></i>
                        </div>
                    </div>
                </div>

                {/* Technicians Active (Operations) */}
                <div
                    onClick={() => router.push('/portal/admin/technicians')}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{t.techsOnRoute}</p>
                            <h3 className="text-3xl font-bold text-teravolta-blue mt-2">{stats.activeTechnicians}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <i className="ri-hard-hat-line text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 2: Charts & Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart - Takes up 2 cols */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-teravolta-blue mb-6">Inquiries Context (6 Months)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                            <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="inquiries"
                                stroke="#004a90"
                                strokeWidth={3}
                                dot={{ fill: '#c3d021', strokeWidth: 0, r: 6 }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Activity Feed - Takes up 1 col */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-teravolta-blue mb-6">{t.recentActivity}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                            <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="inquiries"
                                stroke="#004a90"
                                strokeWidth={3}
                                dot={{ fill: '#c3d021', strokeWidth: 0, r: 6 }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Activity Feed - Takes up 1 col */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-[#004a90] mb-6">{t.recentActivity}</h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((activity) => {
                                const { typeConfig, title, subtitle } = getActivityDetails(activity);
                                return (
                                    <div key={activity.id} className="flex gap-3 group">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${typeConfig.color} group-hover:scale-110 transition-transform`}>
                                            <i className={`${typeConfig.icon} text-sm`}></i>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{title}</p>
                                            <p className="text-xs text-gray-500 truncate">{subtitle}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">
                                                {formatJsDate(activity.createdAt, undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <i className="ri-inbox-line text-4xl mb-2 block opacity-50"></i>
                                {t.noActivity}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


