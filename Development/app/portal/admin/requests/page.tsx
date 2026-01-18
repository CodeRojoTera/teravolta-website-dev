'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/ui/Toast';
import { supabase } from '@/lib/supabase';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';
import { formatJsDate } from '@/lib/dateUtils';
import { RescheduleService } from '@/app/services/rescheduleService';

export default function RequestsPage() {
    const { language } = useLanguage();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                // 1. Fetch Deletion Requests (Legacy)
                const { data: deletionData, error: delError } = await supabase
                    .from('deletion_requests')
                    .select('*')
                    .order('requested_at', { ascending: false });

                if (delError) console.error('Error fetching deletion requests:', delError);

                // 2. Fetch Admin Requests (New System)
                const { data: adminData, error: adminError } = await supabase
                    .from('admin_requests')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (adminError) console.error('Error fetching admin requests:', adminError);

                // 3. Fetch Technician Leave Requests
                const { data: leaveData, error: leaveError } = await supabase
                    .from('technician_leave_requests')
                    .select('*, technicians(name)')
                    .order('created_at', { ascending: false });

                if (leaveError) console.error('Error fetching leave requests:', leaveError);

                // Normalize & Merge
                const normalizedDeletion = (deletionData || []).map((req: any) => ({
                    id: req.id,
                    sourceTable: 'deletion_requests',
                    type: 'deletion', // broadly classified
                    subType: req.resource_type,
                    requestedBy: req.user_id,
                    requestedByName: req.user_id ? `User ${req.user_id.substring(0, 6)}...` : 'Unknown',
                    reason: req.reason,
                    status: req.status,
                    createdAt: new Date(req.requested_at),
                    details: {}
                }));

                const normalizedAdmin = (adminData || []).map((req: any) => ({
                    id: req.id,
                    sourceTable: 'admin_requests',
                    type: req.type, // e.g., 'reschedule_request', 'incident_report'
                    subType: req.related_entity_type,
                    requestedBy: req.requester_id,
                    requestedByName: req.requester_id ? `Tech ${req.requester_id.substring(0, 6)}...` : 'System',
                    reason: req.details?.reason || req.details?.comment || '-',
                    status: req.status,
                    createdAt: new Date(req.created_at),
                    details: req.details || {}
                }));

                const normalizedLeaves = (leaveData || []).map((req: any) => ({
                    id: req.id,
                    sourceTable: 'technician_leave_requests',
                    type: 'leave_request',
                    subType: req.leave_type ? req.leave_type.replace(/_/g, ' ') : 'time off',
                    requestedBy: req.technician_id,
                    requestedByName: req.technicians?.name || 'Unknown Tech',
                    reason: `${req.reason} (${formatJsDate(req.start_date, 'en-US')} - ${formatJsDate(req.end_date, 'en-US')})`,
                    status: req.status,
                    createdAt: new Date(req.created_at || req.start_date),
                    details: {
                        startDate: req.start_date,
                        endDate: req.end_date,
                        reason: req.reason,
                        leaveType: req.leave_type
                    }
                }));

                const merged = [...normalizedAdmin, ...normalizedDeletion, ...normalizedLeaves]
                    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
                setRequests(merged);

            } catch (error) {
                console.error('Error fetching requests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleApprove = async (request: any) => {
        try {
            if (request.sourceTable === 'deletion_requests') {
                const { error } = await supabase
                    .from('deletion_requests')
                    .update({ status: 'approved', reviewed_by: user?.id, reviewed_at: new Date().toISOString() })
                    .eq('id', request.id);
                if (error) throw error;
            } else if (request.sourceTable === 'technician_leave_requests') {
                const { error } = await supabase
                    .from('technician_leave_requests')
                    .update({ status: 'approved' })
                    .eq('id', request.id);
                if (error) throw error;
            } else {
                // Admin Requests Logic
                if (request.type === 'reschedule_request') {
                    // Logic: Generate Token -> Show Link
                    const appointmentId = request.details?.appointment_id || request.related_entity_id; // Check both
                    if (!appointmentId) {
                        showToast('Error: No appointment ID found attached to this request.', 'error');
                        return;
                    }

                    // Generate Token
                    const token = await RescheduleService.createToken(appointmentId, user?.id || '');

                    // Send Email to Customer
                    try {
                        const result = await RescheduleService.sendToCustomer(appointmentId, token);
                        showToast(`Reschedule link sent to ${result.email}`, 'success');
                    } catch (err: any) {
                        console.error('Email failed, showing manual link:', err);
                        // Fallback to manual link if email fails
                        const link = `${window.location.origin}/reschedule/${token}`;

                        // Try to copy to clipboard
                        navigator.clipboard.writeText(link).then(() => {
                            showToast('Email failed. Link copied to clipboard.', 'warning', 6000);
                        }).catch(() => {
                            // Fallback if clipboard fails (rare)
                            showToast('Email failed. Check console for link.', 'error');
                            console.log('Manual Reschedule Link:', link);
                        });
                    }

                    // We don't mark as approved yet? Or maybe we mark as 'in_progress'?
                    // For now, let's mark as 'approved' (meaning "Action Taken")
                }

                const { error } = await supabase
                    .from('admin_requests')
                    .update({ status: 'approved', updated_at: new Date().toISOString() })
                    .eq('id', request.id);
                if (error) throw error;
            }

            // Refresh local state
            setRequests(prev => prev.map(r => r.id === request.id ? { ...r, status: 'approved' } : r));

        } catch (error) {
            console.error('Error approving request:', error);
            showToast('Error processing request', 'error');
        }
    };

    const handleReject = async (request: any) => {
        try {
            if (request.sourceTable === 'deletion_requests') {
                const { error } = await supabase
                    .from('deletion_requests')
                    .update({ status: 'rejected', reviewed_by: user?.id, reviewed_at: new Date().toISOString() })
                    .eq('id', request.id);
                if (error) throw error;
            } else if (request.sourceTable === 'technician_leave_requests') {
                const { error } = await supabase
                    .from('technician_leave_requests')
                    .update({ status: 'rejected' })
                    .eq('id', request.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('admin_requests')
                    .update({ status: 'rejected' })
                    .eq('id', request.id);
                if (error) throw error;
            }

            setRequests(prev => prev.map(r => r.id === request.id ? { ...r, status: 'rejected' } : r));
        } catch (error) {
            console.error('Error rejecting request:', error);
            showToast('Error rejecting request', 'error');
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: any = {
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            pending: 'bg-yellow-100 text-yellow-800',
            auto_resolved: 'bg-blue-100 text-blue-800'
        };
        const style = styles[status] || 'bg-gray-100 text-gray-800';
        return <span className={`px-2 py-1 text-xs rounded-full ${style} capitalize`}>{status.replace('_', ' ')}</span>;
    };

    if (loading) return <PageLoadingSkeleton title="Requests" />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[#004a90]">{language === 'es' ? 'Centro de Solicitudes' : 'Request Center'}</h1>
                <p className="text-gray-600 mt-1">{language === 'es' ? 'Gestionar solicitudes y aprobaciones' : 'Manage requests and approvals'}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {requests.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#004a90] uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#004a90] uppercase tracking-wider">Requester</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#004a90] uppercase tracking-wider">Reason/Details</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#004a90] uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#004a90] uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#004a90] uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {requests.map((req) => (
                                    <tr key={req.id + req.sourceTable} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-[#194271] block capitalize">{req.type.replace('_', ' ')}</span>
                                            <span className="text-xs text-gray-500 capitalize">{req.subType?.replace('_', ' ') || '-'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{req.requestedByName}</div>
                                            {req.sourceTable === 'technician_leave_requests' && (
                                                <span className="text-xs text-blue-600">Technician</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                                            <div className="truncate" title={req.reason}>
                                                {req.reason}
                                            </div>
                                            {req.details?.suggested_action && <span className="block text-xs text-orange-600 mt-1">Suggested: {req.details.suggested_action}</span>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {req.createdAt.toLocaleDateString()}
                                            <span className="block text-xs text-gray-400">{req.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(req.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {req.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleApprove(req)}
                                                        className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
                                                        title="Approve"
                                                    >
                                                        <i className="ri-check-line text-lg"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(req)}
                                                        className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                                                        title="Reject"
                                                    >
                                                        <i className="ri-close-line text-lg"></i>
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <i className="ri-inbox-line text-6xl text-gray-300 mb-4 block"></i>
                        <p className="text-gray-500">No requests found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
