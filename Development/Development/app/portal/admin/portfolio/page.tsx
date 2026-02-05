'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

interface PortfolioProject {
    id: string;
    title: string;
    client: string;
    service: string;
    description: string;
    images?: string[];
    featured: boolean;
    published: boolean;
    createdAt: any;
    completedAt?: any;
}

export default function PortfolioPage() {
    const { language } = useLanguage();
    const router = useRouter();
    const [projects, setProjects] = useState<PortfolioProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data, error } = await supabase
                .from('portfolio_projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const projectsData = (data || []).map(p => ({
                id: p.id,
                title: p.title,
                client: p.client,
                service: p.service,
                description: p.description,
                images: p.images,
                featured: p.featured,
                published: p.published,
                createdAt: p.created_at,
                completedAt: p.completed_at
            } as PortfolioProject));

            setProjects(projectsData);
        } catch (error) {
            console.error('Error fetching portfolio projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFeatured = async (e: React.MouseEvent, projectId: string, currentFeatured: boolean) => {
        e.stopPropagation();
        try {
            const { error } = await supabase
                .from('portfolio_projects')
                .update({ featured: !currentFeatured })
                .eq('id', projectId);

            if (error) throw error;

            // Update local state
            setProjects(projects.map(p =>
                p.id === projectId ? { ...p, featured: !currentFeatured } : p
            ));
        } catch (error) {
            console.error('Error toggling featured:', error);
        }
    };

    const handleTogglePublished = async (e: React.MouseEvent, projectId: string, currentPublished: boolean) => {
        e.stopPropagation();
        try {
            const { error } = await supabase
                .from('portfolio_projects')
                .update({ published: !currentPublished })
                .eq('id', projectId);

            if (error) throw error;

            // Update local state
            setProjects(projects.map(p =>
                p.id === projectId ? { ...p, published: !currentPublished } : p
            ));
        } catch (error) {
            console.error('Error toggling published:', error);
        }
    };

    const content = {
        en: {
            title: 'Portfolio',
            subtitle: 'Manage published portfolio projects',
            all: 'All Projects',
            published: 'Published',
            draft: 'Drafts',
            name: 'Project',
            client: 'Client',
            service: 'Service',
            status: 'Status',
            featured: 'Featured',
            actions: 'Actions',
            noProjects: 'No portfolio projects found',
            edit: 'Edit',
            searchPlaceholder: 'Search by project name or client...',
            statusPublished: 'Published',
            statusDraft: 'Draft',
            featuredYes: 'Yes',
            featuredNo: 'No'
        },
        es: {
            title: 'Portfolio',
            subtitle: 'Gestionar proyectos publicados en el portfolio',
            all: 'Todos los Proyectos',
            published: 'Publicados',
            draft: 'Borradores',
            name: 'Proyecto',
            client: 'Cliente',
            service: 'Servicio',
            status: 'Estado',
            featured: 'Destacado',
            actions: 'Acciones',
            noProjects: 'No se encontraron proyectos en el portfolio',
            edit: 'Editar',
            searchPlaceholder: 'Buscar por nombre de proyecto o cliente...',
            statusPublished: 'Publicado',
            statusDraft: 'Borrador',
            featuredYes: 'Sí',
            featuredNo: 'No'
        }
    };

    const t = content[language];

    const getCounts = () => {
        return {
            all: projects.length,
            published: projects.filter(p => p.published).length,
            draft: projects.filter(p => !p.published).length
        };
    };

    const counts = getCounts();

    const filteredProjects = projects.filter(project => {
        const matchesFilter =
            filter === 'all' ||
            (filter === 'published' && project.published) ||
            (filter === 'draft' && !project.published);

        const matchesSearch = searchTerm === '' ||
            project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.client.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const getStatusBadge = (published: boolean) => {
        if (published) {
            return (
                <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">
                    {t.statusPublished}
                </span>
            );
        }
        return (
            <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-800 font-medium">
                {t.statusDraft}
            </span>
        );
    };

    if (loading) {
        return <PageLoadingSkeleton title={t.title} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-[#004a90]">{t.title}</h1>
                    <p className="text-gray-600 mt-1">{t.subtitle}</p>
                </div>
                <button
                    onClick={() => router.push('/portal/admin/portfolio/new')}
                    className="flex items-center gap-2 px-4 py-2 bg-[#c3d021] hover:bg-[#b0bc1e] text-[#194271] rounded-lg font-bold transition-colors"
                >
                    <i className="ri-add-line"></i>
                    {language === 'es' ? 'Nuevo Proyecto' : 'New Project'}
                </button>
            </div>

            {/* Filter Tabs with Counts */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${filter === 'all'
                        ? 'bg-[#004a90] text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                >
                    {t.all}
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${filter === 'all' ? 'bg-white/20' : 'bg-gray-100'
                        }`}>
                        {counts.all}
                    </span>
                </button>
                <button
                    onClick={() => setFilter('published')}
                    className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${filter === 'published'
                        ? 'bg-[#004a90] text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                >
                    {t.published}
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${filter === 'published' ? 'bg-white/20' : 'bg-gray-100'
                        }`}>
                        {counts.published}
                    </span>
                </button>
                <button
                    onClick={() => setFilter('draft')}
                    className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${filter === 'draft'
                        ? 'bg-[#004a90] text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                >
                    {t.draft}
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${filter === 'draft' ? 'bg-white/20' : 'bg-gray-100'
                        }`}>
                        {counts.draft}
                    </span>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="relative">
                    <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
                    <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004a90] focus:border-transparent"
                    />
                </div>
            </div>

            {/* Projects Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {filteredProjects.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {t.name}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {t.client}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {t.service}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {t.status}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {t.featured}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredProjects.map((project) => (
                                    <tr
                                        key={project.id}
                                        onClick={() => router.push(`/portal/admin/portfolio/${project.id}`)}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors animate-fade-in"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{project.title || 'Untitled'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {project.client || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {project.service || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={(e) => handleTogglePublished(e, project.id, project.published)}
                                                className="text-left"
                                            >
                                                {getStatusBadge(project.published)}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={(e) => handleToggleFeatured(e, project.id, project.featured)}
                                                className="flex items-center gap-2"
                                            >
                                                <div className={`w-10 h-6 rounded-full transition-colors ${project.featured ? 'bg-[#c3d021]' : 'bg-gray-300'
                                                    }`}>
                                                    <div className={`w-4 h-4 mt-1 rounded-full bg-white transition-transform ${project.featured ? 'ml-5' : 'ml-1'
                                                        }`}></div>
                                                </div>
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <i className="ri-arrow-right-s-line text-xl text-gray-400"></i>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <EmptyState
                        title={t.noProjects}
                        description={searchTerm ? (language === 'es' ? 'Intenta con otros términos de búsqueda' : 'Try different search terms') : (language === 'es' ? 'Comienza agregando tu primer proyecto' : 'Start by adding your first project')}
                        icon="ri-folder-line"
                    />
                )}
            </div>
        </div>
    );
}
