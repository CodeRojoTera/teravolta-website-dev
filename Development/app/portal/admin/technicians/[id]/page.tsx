'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';
import { TechnicianService } from '@/app/services/technicianService';
import { ReviewService, Review } from '@/app/services/reviewService';
import { Technician, TechnicianLeave } from '@/lib/types';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

export default function TechnicianDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { language } = useLanguage();
    const { showToast } = useToast();

    const [technician, setTechnician] = useState<Technician | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [averageRating, setAverageRating] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    // New State for Dashboard
    const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'leaves'>('overview');
    const [appointments, setAppointments] = useState<any[]>([]);
    const [leaves, setLeaves] = useState<any[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Confirmation
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean, leaveId: string | null }>({
        isOpen: false,
        leaveId: null
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                // Parallel fetch
                const [techData, reviewsData, ratingData] = await Promise.all([
                    TechnicianService.getById(id as string),
                    ReviewService.getTechnicianReviews(id as string),
                    ReviewService.getAverageRating(id as string)
                ]);

                if (!techData) {
                    router.push('/portal/admin/technicians');
                    return;
                }

                setTechnician(techData);
                setReviews(reviewsData);
                setAverageRating(ratingData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, router]);

    useEffect(() => {
        const fetchAdditionalData = async () => {
            if (!id) return;
            try {
                const [leavesData, appsData] = await Promise.all([
                    TechnicianService.getLeaves(id as string),
                    import('@/app/services/activeProjectService').then(m => m.ActiveProjectService.getByTechnicianId(id as string))
                ]);
                setLeaves(leavesData);
                setAppointments(appsData);
            } catch (e) {
                console.error('Error fetching dashboard data', e);
            }
        };
        fetchAdditionalData();
    }, [id]);

    const handleExportHistory = async () => {
        if (!id) return;
        setExporting(true);
        try {
            const history = await TechnicianService.getHistory(id as string);

            // CSV Header
            const headers = ['Date', 'Type', 'Client/Reason', 'Status', 'Notes'];
            const csvRows = [headers.join(',')];

            // CSV Rows
            history.forEach(item => {
                const row = [
                    `"${new Date(item.date).toLocaleDateString()}"`,
                    `"${item.type}"`,
                    `"${(item.clientOrReason || '').replace(/"/g, '""')}"`,
                    `"${item.status}"`,
                    `"${(item.notes || '').replace(/"/g, '""')}"`
                ];
                csvRows.push(row.join(','));
            });

            // Create Blob and Download
            const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('hidden', '');
            a.setAttribute('href', url);
            a.setAttribute('download', `technician_history_${technician?.fullName || id}_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error exporting history:', error);
        } finally {
            setExporting(false);
        }
    };



    const handleCancelLeave = (leaveId: string) => {
        setConfirmModal({ isOpen: true, leaveId });
    };

    const confirmCancelLeave = async () => {
        if (!confirmModal.leaveId) return;

        try {
            await TechnicianService.updateLeaveStatus(confirmModal.leaveId, 'cancelled');
            showToast('Absence cancelled successfully', 'success');

            // Refresh Data
            if (technician?.id) {
                const leavesData = await TechnicianService.getLeaves(technician.id);
                setLeaves(leavesData);
            }
        } catch (error) {
            console.error('Error cancelling absence:', error);
            showToast('Failed to cancel absence', 'error');
        }
    };

    const t = {
        back: language === 'es' ? 'Volver a Técnicos' : 'Back to Technicians',
        profile: language === 'es' ? 'Perfil del Técnico' : 'Technician Profile',
        contact: language === 'es' ? 'Información de Contacto' : 'Contact Information',
        schedule: language === 'es' ? 'Horario' : 'Schedule',
        status: language === 'es' ? 'Estado' : 'Status',
        reviews: language === 'es' ? 'Reseñas y Calificaciones' : 'Reviews & Ratings',
        noReviews: language === 'es' ? 'Sin reseñas aún' : 'No reviews yet',
        noReviewsDesc: language === 'es' ? 'Este técnico aún no tiene calificaciones.' : 'This technician has not been rated yet.',
        rating: language === 'es' ? 'Calificación Promedio' : 'Average Rating',
        totalReviews: language === 'es' ? 'Total de Reseñas' : 'Total Reviews',
        active: language === 'es' ? 'Activo' : 'Active',
        inactive: language === 'es' ? 'Inactivo' : 'Inactive'
    };

    if (loading) return <PageLoadingSkeleton title={t.profile} />;
    if (!technician) return null;

    // Calculate Dynamic Status (Active vs On Leave)
    const today = new Date().toISOString().split('T')[0];
    const currentLeave = leaves.find(l =>
        l.status === 'approved' &&
        l.start_date <= today &&
        l.end_date >= today
    );

    const statusBadge = currentLeave ? (
        <span className="px-2 py-0.5 text-xs rounded-full font-bold bg-red-100 text-red-800 flex items-center gap-1 border border-red-200">
            <i className="ri-prohibited-line"></i>
            Unavailable
        </span>
    ) : (
        <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${technician.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            {technician.active ? t.active : t.inactive}
        </span>
    );

    const incompleteJobs = appointments.filter(a => a.status === 'incomplete');

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {/* Header / Nav */}
            <div>
                <button
                    onClick={() => router.push('/portal/admin/technicians')}
                    className="group text-[#004a90] hover:text-[#c3d021] mb-6 flex items-center text-sm font-bold transition-colors"
                >
                    <i className="ri-arrow-left-s-line mr-1 text-lg group-hover:-translate-x-1 transition-transform"></i>
                    {t.back}
                </button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#004a90] rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-md">
                            {technician.fullName.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-[#004a90]">{technician.fullName}</h1>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                {statusBadge}
                                {technician.specialties?.map(s => (
                                    <span key={s} className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleExportHistory}
                        disabled={exporting}
                        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        {exporting ? (
                            <span className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            <i className="ri-download-line font-normal"></i>
                        )}
                        {language === 'es' ? 'Exportar Historial' : 'Export History'}
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-[#004a90] text-[#004a90]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Overview
                </button>
                <button
                    onClick={() => { setActiveTab('appointments'); setFilterStatus('all'); }}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'appointments' && filterStatus === 'all' ? 'border-[#004a90] text-[#004a90]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Appointments ({appointments.length})
                </button>
                <button
                    onClick={() => { setActiveTab('appointments'); setFilterStatus('incomplete'); }}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'appointments' && filterStatus === 'incomplete' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-red-600'}`}
                >
                    Incomplete Jobs ({incompleteJobs.length})
                </button>
                <button
                    onClick={() => setActiveTab('leaves')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'leaves' ? 'border-[#004a90] text-[#004a90]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Leaves History
                </button>
            </div>


            {/* Content Areas */}
            < div className="grid grid-cols-1 lg:grid-cols-3 gap-8" >

                {/* Overview Tab Content */}
                {
                    activeTab === 'overview' && (
                        <>
                            {/* Left Col: Info */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <h2 className="text-lg font-bold text-[#004a90] mb-4">{t.contact}</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase block">Email</label>
                                            <a href={`mailto:${technician.email}`} className="text-gray-900 hover:text-blue-600 font-medium truncate block">
                                                {technician.email}
                                            </a>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase block">Phone</label>
                                            <a href={`tel:${technician.phone}`} className="text-gray-900 hover:text-blue-600 font-medium">
                                                {technician.phone}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <h2 className="text-lg font-bold text-[#004a90] mb-4">{t.schedule}</h2>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Hours</span>
                                            <span className="font-semibold text-gray-900">{technician.workingHours?.start} - {technician.workingHours?.end}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Days</span>
                                            <span className="font-semibold text-gray-900">
                                                {/* Map indices to day names roughly if needed */}
                                                {technician.workingHours?.days.join(', ')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Col: Reviews */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-h-[400px]">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-lg font-bold text-[#004a90] flex items-center gap-2">
                                            <i className="ri-chat-quote-line"></i>
                                            {t.reviews}
                                        </h2>
                                        <div className="flex items-center gap-3">
                                            {averageRating && (
                                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                                                    <span className="font-bold text-[#004a90]">{averageRating}</span>
                                                    <i className="ri-star-fill text-[#c3d021]"></i>
                                                </div>
                                            )}
                                            <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">{reviews.length} {t.totalReviews}</span>
                                        </div>
                                    </div>

                                    {reviews.length === 0 ? (
                                        <EmptyState
                                            title={t.noReviews}
                                            description={t.noReviewsDesc}
                                            icon="ri-chat-1-line"
                                        />
                                    ) : (
                                        <div className="space-y-4">
                                            {reviews.map((review) => (
                                                <div key={review.id} className="bg-gray-50 rounded-xl p-5 hover:bg-white hover:shadow-md transition-all border border-gray-100">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center gap-1 text-[#c3d021]">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <i key={i} className={`ri-star-fill ${i < review.rating ? '' : 'text-gray-300'}`}></i>
                                                            ))}
                                                            <span className="ml-2 font-bold text-gray-900">{review.rating}.0</span>
                                                        </div>
                                                        <span className="text-xs text-gray-400">
                                                            {new Date(review.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    {review.comment ? (
                                                        <p className="text-gray-700 italic">"{review.comment}"</p>
                                                    ) : (
                                                        <p className="text-gray-400 text-sm italic">No written comment</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )
                }

                {/* Appointments Tab Content */}
                {
                    activeTab === 'appointments' && (
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="divide-y divide-gray-100">
                                    {appointments
                                        .filter(a => {
                                            // Filter logic based on tab selected
                                            if (filterStatus === 'all') {
                                                // Show Appointments (exclude Cancelled/Incomplete)
                                                return a.status !== 'cancelled' && a.status !== 'incomplete';
                                            } else if (filterStatus === 'incomplete') {
                                                // Show Incomplete Jobs (include Cancelled/Incomplete)
                                                return a.status === 'cancelled' || a.status === 'incomplete';
                                            }
                                            return true;
                                        })
                                        .map(appt => (
                                            <div key={appt.id} className="p-4 hover:bg-gray-50 flex justify-between items-center group cursor-pointer" onClick={() => router.push(`/portal/admin/active-projects/${appt.id}`)}>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${appt.status === 'incomplete' || appt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                            appt.status === 'urgent_reschedule' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-blue-100 text-blue-700'
                                                            }`}>
                                                            {appt.status?.replace('_', ' ')}
                                                        </span>
                                                        <span className="text-sm font-semibold text-gray-900">{appt.projectName}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        <i className="ri-calendar-line mr-1"></i>
                                                        {appt.scheduledDate} {appt.scheduledTime}
                                                    </div>
                                                </div>
                                                <div className="flex items-center text-gray-400 group-hover:text-[#004a90] transition-colors">
                                                    <span className="text-sm mr-2 font-medium">View Details</span>
                                                    <i className="ri-arrow-right-line"></i>
                                                </div>
                                            </div>
                                        ))}
                                    {appointments.filter(a => filterStatus === 'all' ? (a.status !== 'cancelled' && a.status !== 'incomplete') : (a.status === 'cancelled' || a.status === 'incomplete')).length === 0 && (
                                        <div className="p-8 text-center text-gray-500">
                                            {filterStatus === 'all' ? 'No active appointments found.' : 'No incomplete or cancelled jobs found.'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Leaves History Tab Content */}
                {
                    activeTab === 'leaves' && (
                        <div className="lg:col-span-3">
                            <div className="mb-4">
                                <h3 className="font-bold text-gray-700">Absence History</h3>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Type</th>
                                            <th className="px-6 py-3 font-medium">Dates</th>
                                            <th className="px-6 py-3 font-medium">Reason</th>
                                            <th className="px-6 py-3 font-medium">Status</th>
                                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {leaves.map(leave => (
                                            <tr key={leave.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 uppercase font-bold text-xs">{leave.leave_type}</td>
                                                <td className="px-6 py-4">
                                                    {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 truncate max-w-xs">{leave.reason}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${leave.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                        leave.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                            leave.status === 'cancelled' ? 'bg-gray-100 text-gray-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {leave.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {leave.status === 'approved' && (
                                                        <button
                                                            onClick={() => handleCancelLeave(leave.id)}
                                                            className="text-red-500 hover:text-red-700 text-xs font-bold px-3 py-1 border border-red-200 rounded hover:bg-red-50 transition-colors"
                                                            title="Cancel / Revoke Absence"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {leaves.length === 0 && (
                                            <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No leave history found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                }

            </div >



            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmCancelLeave}
                title="Cancel Absence?"
                message="Are you sure you want to cancel this absence? The technician will become available immediately and the absence will be marked as cancelled."
                confirmText="Yes, Cancel Absence"
                cancelText="No, Keep It"
                variant="warning"
            />
        </div >
    );
}
