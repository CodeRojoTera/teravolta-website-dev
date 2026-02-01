'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Appointment } from '@/lib/types'; // Base type
import BoardListManager from './BoardListManager';
import StandardReportForm from './StandardReportForm';

interface InspectionDashboardProps {
    appointment: any; // Using any because basic Appointment type might lack 'project' join
}

export default function InspectionDashboard({ appointment }: InspectionDashboardProps) {
    const [serviceType, setServiceType] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServiceType = async () => {
            // If appointment already has project info joined
            if (appointment.project?.service) {
                setServiceType(appointment.project.service);
                setLoading(false);
                return;
            }

            // Otherwise fetch it
            if (appointment.projectId || appointment.project_id) {
                const pid = appointment.projectId || appointment.project_id;
                const { data, error } = await supabase
                    .from('active_projects')
                    .select('service')
                    .eq('id', pid)
                    .single();

                if (data) {
                    setServiceType(data.service);
                }
            }
            setLoading(false);
        };

        fetchServiceType();
    }, [appointment]);

    if (loading) {
        return <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004a90] mx-auto"></div></div>;
    }

    // Logic: Efficiency = Multi-Board Inspection
    // Others (Consulting/Advocacy) = Standard Report
    const isEfficiency = serviceType === 'efficiency' || serviceType === 'energy_efficiency';

    return (
        <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#004a90]">
                    {isEfficiency ? 'Efficiency Inspection' : 'Visit Report'}
                </h2>
                <span className="px-3 py-1 bg-white border rounded text-sm text-gray-600 uppercase tracking-wide font-medium">
                    {serviceType || 'Unknown Service'}
                </span>
            </div>

            {isEfficiency ? (
                <BoardListManager appointmentId={appointment.id} />
            ) : (
                <StandardReportForm appointmentId={appointment.id} />
            )}
        </div>
    );
}
