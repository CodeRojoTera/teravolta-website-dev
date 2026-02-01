'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';

interface PortfolioProject {
    id?: string;
    title: string;
    client: string;
    service: string;
    description: string;
    challenge?: string;
    solution?: string;
    result?: string;
    images?: string[];
    imageUrl?: string;
    featured: boolean;
    published: boolean;
}

export default function PortfolioEditPage() {
    const { id } = useParams();
    const router = useRouter();
    const { language } = useLanguage();
    const { showToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0); // Supabase doesn't support progress well in client yet, simpler logic
    const [formData, setFormData] = useState<PortfolioProject>({
        title: '',
        client: '',
        service: '',
        description: '',
        challenge: '',
        solution: '',
        result: '',
        imageUrl: '',
        featured: false,
        published: true
    });

    useEffect(() => {
        const fetchProject = async () => {
            try {
                if (!id || id === 'new') {
                    setLoading(false);
                    return;
                }

                const { data, error } = await supabase
                    .from('portfolio_projects')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                if (data) {
                    setFormData({
                        title: data.title,
                        client: data.client,
                        service: data.service,
                        description: data.description,
                        challenge: data.challenge,
                        solution: data.solution,
                        result: data.result,
                        imageUrl: data.image_url || ((data.images && data.images.length > 0) ? data.images[0] : ''), // Fallback if schema differs
                        featured: data.featured,
                        published: data.published
                    });
                } else {
                    router.push('/portal/admin/portfolio');
                }
            } catch (error) {
                console.error('Error fetching project:', error);
                router.push('/portal/admin/portfolio');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProject();
        }
    }, [id, router]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            showToast(language === 'es' ? 'Solo se permiten imágenes (JPG, PNG, WEBP)' : 'Only images are allowed (JPG, PNG, WEBP)', 'error');
            return;
        }

        if (file.size > maxSize) {
            showToast(language === 'es' ? 'La imagen no debe superar los 5MB' : 'Image must not exceed 5MB', 'error');
            return;
        }

        setImageUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `projects/${fileName}`; // Upload to 'portfolio' bucket, folder 'projects'

            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('portfolio')
                .getPublicUrl(filePath);

            setFormData({ ...formData, imageUrl: publicUrl });
            showToast(language === 'es' ? 'Imagen subida exitosamente' : 'Image uploaded successfully', 'success');
        } catch (error) {
            console.error('Error uploading image:', error);
            showToast(language === 'es' ? 'Error al subir la imagen' : 'Error uploading image', 'error');
        } finally {
            setImageUploading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const updateData = {
                title: formData.title,
                client: formData.client,
                service: formData.service,
                description: formData.description,
                challenge: formData.challenge,
                solution: formData.solution,
                result: formData.result,
                image_url: formData.imageUrl,
                images: formData.imageUrl ? [formData.imageUrl] : [], // Keep existing array column in sync
                featured: formData.featured,
                published: formData.published,
                updated_at: new Date().toISOString()
            };

            if (id === 'new') {
                const { error } = await supabase
                    .from('portfolio_projects')
                    .insert([updateData]);

                if (error) throw error;
                showToast(language === 'es' ? 'Proyecto creado exitosamente' : 'Project created successfully', 'success');
                router.push('/portal/admin/portfolio');
                return;
            }

            const { error } = await supabase
                .from('portfolio_projects')
                .update(updateData)
                .eq('id', id);

            if (error) throw error;

            showToast(language === 'es' ? 'Proyecto guardado exitosamente' : 'Project saved successfully', 'success');
        } catch (error) {
            console.error('Error saving project:', error);
            showToast(language === 'es' ? 'Error al guardar el proyecto' : 'Error saving project', 'error');
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            const { error } = await supabase
                .from('portfolio_projects')
                .delete()
                .eq('id', id);

            if (error) throw error;

            showToast(language === 'es' ? 'Proyecto eliminado' : 'Project deleted', 'success');
            router.push('/portal/admin/portfolio');
        } catch (error) {
            console.error('Error deleting project:', error);
            showToast(language === 'es' ? 'Error al eliminar el proyecto' : 'Error deleting project', 'error');
            setDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const handleDelete = () => setShowDeleteModal(true);

    const content = {
        en: {
            title: 'Edit Portfolio Project',
            backToList: 'Back to Portfolio',
            save: 'Save Changes',
            delete: 'Remove from Portfolio',
            projectInfo: 'Project Information',
            projectTitle: 'Project Title',
            client: 'Client Name',
            service: 'Service',
            description: 'Description',
            challenge: 'Challenge',
            solution: 'Solution',
            result: 'Result',
            image: 'Project Image',
            uploadImage: 'Upload New Image',
            uploading: 'Uploading...',
            featured: 'Featured Project',
            published: 'Published on Website',
            saving: 'Saving...',
            featuredHelp: 'Featured projects appear prominently on the homepage',
            publishedHelp: 'Unpublish to hide from public website'
        },
        es: {
            title: 'Editar Proyecto del Portfolio',
            backToList: 'Volver al Portfolio',
            save: 'Guardar Cambios',
            delete: 'Eliminar del Portfolio',
            projectInfo: 'Información del Proyecto',
            projectTitle: 'Título del Proyecto',
            client: 'Nombre del Cliente',
            service: 'Servicio',
            description: 'Descripción',
            challenge: 'Desafío',
            solution: 'Solución',
            result: 'Resultado',
            image: 'Imagen del Proyecto',
            uploadImage: 'Subir Nueva Imagen',
            uploading: 'Subiendo...',
            featured: 'Proyecto Destacado',
            published: 'Publicado en Sitio Web',
            saving: 'Guardando...',
            featuredHelp: 'Los proyectos destacados aparecen prominentemente en la página de inicio',
            publishedHelp: 'Despublicar para ocultar del sitio web público'
        }
    };

    const t = content[language];

    if (loading) {
        return <PageLoadingSkeleton title={t.title} />;
    }

    return (
        <div className="space-y-6 max-w-4xl animate-fade-in">
            {/* Header */}
            <div>
                <button
                    onClick={() => router.push('/portal/admin/portfolio')}
                    className="text-[#004a90] hover:text-[#c3d021] mb-2 flex items-center text-sm"
                >
                    <i className="ri-arrow-left-line mr-1"></i>
                    {t.backToList}
                </button>
                <h1 className="text-3xl font-bold text-[#004a90]">
                    {id === 'new' ? (language === 'es' ? 'Crear Nuevo Proyecto' : 'Create New Project') : t.title}
                </h1>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
                <h2 className="text-xl font-bold text-[#004a90]">{t.projectInfo}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#004a90] mb-2">
                            {t.projectTitle}
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004a90] focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#004a90] mb-2">
                            {t.client}
                        </label>
                        <input
                            type="text"
                            value={formData.client}
                            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004a90] focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#004a90] mb-2">
                        {t.service}
                    </label>
                    <input
                        type="text"
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004a90] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#004a90] mb-2">
                        {t.description}
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004a90] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#004a90] mb-2">
                        {t.challenge}
                    </label>
                    <textarea
                        value={formData.challenge}
                        onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004a90] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#004a90] mb-2">
                        {t.solution}
                    </label>
                    <textarea
                        value={formData.solution}
                        onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004a90] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#004a90] mb-2">
                        {t.result}
                    </label>
                    <textarea
                        value={formData.result}
                        onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004a90] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#004a90] mb-2">
                        {t.image}
                    </label>
                    <div className="flex items-center space-x-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                        />
                        <label
                            htmlFor="image-upload"
                            className={`px-4 py-2 border border-[#004A90] text-[#004A90] rounded-lg cursor-pointer hover:bg-blue-50 transition-colors ${imageUploading ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            <i className="ri-upload-2-line mr-2"></i>
                            {language === 'es' ? 'Cambiar Imagen' : 'Change Image'}
                        </label>

                        {imageUploading && (
                            <div className="flex-1 max-w-[200px] space-y-1">
                                <div className="flex justify-between text-xs font-medium text-gray-600">
                                    <span>{language === 'es' ? 'Subiendo...' : 'Uploading...'}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-[#004A90] h-full w-full animate-pulse"></div>
                                </div>
                            </div>
                        )}
                    </div>
                    {formData.imageUrl && (
                        <img
                            src={formData.imageUrl}
                            alt="Project preview"
                            className="mt-4 w-full max-w-md rounded-lg"
                        />
                    )}
                </div>

                {/* Toggles */}
                <div className="pt-4 border-t border-gray-200 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm font-medium text-[#004a90]">
                                {t.featured}
                            </label>
                            <p className="text-xs text-gray-500 mt-1">{t.featuredHelp}</p>
                        </div>
                        <button
                            onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                            className="flex items-center gap-2"
                        >
                            <div className={`w-12 h-6 rounded-full transition-colors ${formData.featured ? 'bg-[#c3d021]' : 'bg-gray-300'
                                }`}>
                                <div className={`w-5 h-5 mt-0.5 rounded-full bg-white transition-transform ${formData.featured ? 'ml-6' : 'ml-1'
                                    }`}></div>
                            </div>
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm font-medium text-[#004a90]">
                                {t.published}
                            </label>
                            <p className="text-xs text-gray-500 mt-1">{t.publishedHelp}</p>
                        </div>
                        <button
                            onClick={() => setFormData({ ...formData, published: !formData.published })}
                            className="flex items-center gap-2"
                        >
                            <div className={`w-12 h-6 rounded-full transition-colors ${formData.published ? 'bg-green-500' : 'bg-gray-300'
                                }`}>
                                <div className={`w-5 h-5 mt-0.5 rounded-full bg-white transition-transform ${formData.published ? 'ml-6' : 'ml-1'
                                    }`}></div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-between">
                {id !== 'new' && (
                    <button
                        onClick={handleDelete}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                    >
                        <i className="ri-delete-bin-line mr-2"></i>
                        {t.delete}
                    </button>
                )}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-3 bg-[#004a90] hover:bg-[#194271] text-white rounded-lg font-medium disabled:opacity-50"
                >
                    {saving ? t.saving : t.save}
                </button>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 fade-in animate-in">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 zoom-in animate-in">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {language === 'es' ? 'Confirmar Eliminación' : 'Confirm Deletion'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            {language === 'es'
                                ? '¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.'
                                : 'Are you sure you want to delete this project? This action cannot be undone.'}
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleting}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                            >
                                {language === 'es' ? 'Cancelar' : 'Cancel'}
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleting}
                                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium flex items-center gap-2"
                            >
                                {deleting && <i className="ri-loader-4-line animate-spin"></i>}
                                {language === 'es' ? 'Eliminar' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
