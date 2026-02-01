'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { ActiveProjectService } from '@/app/services/activeProjectService';
import { ActiveProject, ProjectStatus, ServiceType } from '@/lib/types';
import ManualProjectWizard from '@/components/ManualProjectWizard';

const statusColors: Record<string, string> = {
    pending_onboarding: 'bg-orange-100 text-orange-800 border-orange-200',
    pending_scheduling: 'bg-orange-100 text-orange-800 border-orange-200',
    pending_documents: 'bg-purple-100 text-purple-800 border-purple-200',
    pending_assignment: 'bg-blue-100 text-blue-800 border-blue-200',
    pending_installation: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
    active: 'bg-green-100 text-green-800 border-green-200',
    paused: 'bg-gray-100 text-gray-800 border-gray-200',
    pending_client: 'bg-orange-100 text-orange-800 border-orange-200',
    in_review: 'bg-purple-100 text-purple-800 border-purple-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    urgent_reschedule: 'bg-red-100 text-red-800 border-red-200',
    incomplete: 'bg-yellow-100 text-yellow-800 border-yellow-200'
};

const serviceColors: Record<string, string> = {
    efficiency: 'bg-green-100 text-green-700',
    consulting: 'bg-blue-100 text-blue-700',
    advocacy: 'bg-purple-100 text-purple-700'
};

export default function ActiveProjectsPage() {
    const router = useRouter();
    const { language } = useLanguage();
    const { showToast } = useToast();

    const [projects, setProjects] = useState<ActiveProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeService, setActiveService] = useState<ServiceType | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showWizard, setShowWizard] = useState(false);

    const t = {
        en: {
            title: 'Active Projects',
            subtitle: 'Manage all ongoing projects and client work',
            search: 'Search by name, email, or project...',
            all: 'All Projects',
            efficiency: 'Efficiency',
            consulting: 'Consulting',
            advocacy: 'Advocacy',
            createProject: 'Create Project',
            noProjects: 'No projects found',
            noProjectsDesc: 'Create a new project to get started',
            client: 'Client',
            service: 'Service',
            status: 'Status',
            progress: 'Progress',
            scheduled: 'Scheduled',
            pendingSetup: 'Pending Setup',
            viewDetails: 'View Details'
        },
        es: {
            title: 'Proyectos Activos',
            subtitle: 'Gestiona todos los proyectos en curso y trabajo con clientes',
            search: 'Buscar por nombre, correo o proyecto...',
            all: 'Todos los Proyectos',
            efficiency: 'Eficiencia',
            consulting: 'Consultoría',
            advocacy: 'Asesoría',
            createProject: 'Crear Proyecto',
            noProjects: 'No se encontraron proyectos',
            noProjectsDesc: 'Crea un nuevo proyecto para comenzar',
            client: 'Cliente',
            service: 'Servicio',
            status: 'Estado',
            progress: 'Progreso',
            scheduled: 'Programado',
            pendingSetup: 'Pendiente Configuración',
            viewDetails: 'Ver Detalles'
        }
    }[language as 'en' | 'es'] || {
        title: 'Active Projects',
        subtitle: 'Manage all ongoing projects and client work',
        search: 'Search by name, email, or project...',
        all: 'All Projects',
        efficiency: 'Efficiency',
        consulting: 'Consulting',
        advocacy: 'Advocacy',
        createProject: 'Create Project',
        noProjects: 'No projects found',
        noProjectsDesc: 'Create a new project to get started',
        client: 'Client',
        service: 'Service',
        status: 'Status',
        progress: 'Progress',
        scheduled: 'Scheduled',
        pendingSetup: 'Pending Setup',
        viewDetails: 'View Details'
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const data = await ActiveProjectService.getAll();
            setProjects(data);
        } catch (err) {
            console.error(err);
            showToast('Error loading projects', 'error');
        } finally {
            setLoading(false);
        }
    };

    const getServiceCounts = () => {
        const counts: Record<string, number> = {
            all: projects.length,
            efficiency: 0,
            consulting: 0,
            advocacy: 0
        };
        projects.forEach(p => {
            if (p.service && counts[p.service] !== undefined) {
                counts[p.service]++;
            }
        });
        return counts;
    };

    const serviceCounts = getServiceCounts();

    const filteredProjects = projects.filter(project => {
        const matchesService = activeService === 'all' || project.service === activeService;
        const matchesSearch = searchQuery === '' ||
            project.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.clientEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.projectName?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesService && matchesSearch;
    });

    // Sort: pending projects first, then by date
    const sortedProjects = [...filteredProjects].sort((a, b) => {
        const aPending = a.status?.startsWith('pending') ? 0 : 1;
        const bPending = b.status?.startsWith('pending') ? 0 : 1;
        if (aPending !== bPending) return aPending - bPending;
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    const isPendingSetup = (status: string) => {
        return status === 'pending_onboarding' || status === 'pending_scheduling';
    };

    const handleWizardSuccess = () => {
        setShowWizard(false);
        fetchProjects();
        showToast(language === 'es' ? 'Proyecto creado exitosamente' : 'Project created successfully', 'success');
    };

    if (loading) return <PageLoadingSkeleton title={t.title} />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#004a90]">{t.title}</h1>
                    <p className="text-gray-500 mt-1">{t.subtitle}</p>
                </div>
                <button
                    onClick={() => setShowWizard(true)}
                    className="bg-[#004a90] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#003670] transition-colors shadow-sm"
                >
                    <i className="ri-add-line text-lg"></i>
                    {t.createProject}
                </button>
            </div>

            {/* Service Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                    onClick={() => setActiveService('all')}
                    className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${activeService === 'all'
                        ? 'bg-[#004a90] text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                >
                    {t.all}
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${activeService === 'all' ? 'bg-white/20' : 'bg-gray-100'}`}>
                        {serviceCounts.all}
                    </span>
                </button>
                <button
                    onClick={() => setActiveService('efficiency')}
                    className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${activeService === 'efficiency'
                        ? 'bg-[#004a90] text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                >
                    {t.efficiency}
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${activeService === 'efficiency' ? 'bg-white/20' : 'bg-gray-100'}`}>
                        {serviceCounts.efficiency}
                    </span>
                </button>
                <button
                    onClick={() => setActiveService('consulting')}
                    className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${activeService === 'consulting'
                        ? 'bg-[#004a90] text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                >
                    {t.consulting}
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${activeService === 'consulting' ? 'bg-white/20' : 'bg-gray-100'}`}>
                        {serviceCounts.consulting}
                    </span>
                </button>
                <button
                    onClick={() => setActiveService('advocacy')}
                    className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${activeService === 'advocacy'
                        ? 'bg-[#004a90] text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                >
                    {t.advocacy}
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${activeService === 'advocacy' ? 'bg-white/20' : 'bg-gray-100'}`}>
                        {serviceCounts.advocacy}
                    </span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="relative">
                    <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
                    <input
                        type="text"
                        placeholder={t.search}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004a90] focus:border-transparent"
                    />
                </div>
            </div>

            {/* Project Cards Grid */}
            {sortedProjects.length === 0 ? (
                <EmptyState
                    icon="ri-folder-line"
                    title={t.noProjects}
                    description={t.noProjectsDesc}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedProjects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => router.push(`/portal/admin/active-projects/${project.id}`)}
                            className={`bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all cursor-pointer group ${isPendingSetup(project.status)
                                ? 'border-orange-300 ring-2 ring-orange-100'
                                : 'border-gray-100'
                                }`}
                        >
                            {/* Pending Setup Badge */}
                            {isPendingSetup(project.status) && (
                                <div className="mb-3 -mt-2 -mx-2">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white">
                                        <i className="ri-alert-line"></i>
                                        {t.pendingSetup}
                                    </span>
                                </div>
                            )}

                            {/* Project Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-[#004a90] text-lg truncate group-hover:text-[#003670]">
                                        {project.projectName || project.clientName}
                                    </h3>
                                    <p className="text-sm text-gray-500 truncate">{project.clientEmail}</p>
                                </div>
                            </div>

                            {/* Service & Status Badges */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${serviceColors[project.service] || 'bg-gray-100 text-gray-700'}`}>
                                    {project.service}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${statusColors[project.status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                    {project.status?.replace(/_/g, ' ')}
                                </span>
                            </div>

                            {/* Service Specific Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.propertyType && (
                                    <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-100 flex items-center gap-1">
                                        <i className="ri-home-line"></i> {project.propertyType}
                                    </span>
                                )}
                                {project.deviceOption && (
                                    <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-100 flex items-center gap-1">
                                        <i className="ri-cpu-line"></i> {project.deviceOption}
                                    </span>
                                )}
                                {project.clientTimeline && (
                                    <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-100 flex items-center gap-1">
                                        <i className="ri-calendar-line"></i> {project.clientTimeline}
                                    </span>
                                )}
                                {project.budget && (
                                    <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-100 flex items-center gap-1">
                                        <i className="ri-money-dollar-circle-line"></i> {project.budget}
                                    </span>
                                )}
                            </div>

                            {/* Project Details */}
                            <div className="space-y-3 text-sm">
                                {project.scheduledDate && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <i className="ri-calendar-line text-gray-400"></i>
                                        <span>{t.scheduled}: {new Date(project.scheduledDate).toLocaleDateString()}</span>
                                    </div>
                                )}

                                {/* Progress Bar */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-500">{t.progress}</span>
                                        <span className="font-bold text-gray-700">{project.progress || 0}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-[#c3d021] h-2 rounded-full transition-all"
                                            style={{ width: `${project.progress || 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-xs text-gray-400">
                                    {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : '-'}
                                </span>
                                <span className="text-[#004a90] text-sm font-bold flex items-center gap-1 group-hover:underline">
                                    {t.viewDetails} <i className="ri-arrow-right-s-line"></i>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Manual Project Wizard Modal */}
            {showWizard && (
                <ManualProjectWizard
                    onClose={() => setShowWizard(false)}
                    onSuccess={handleWizardSuccess}
                />
            )}
        </div>
    );
}
