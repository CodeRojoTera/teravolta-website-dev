'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { RescheduleService } from '@/app/services/rescheduleService';
import { TechnicianService } from '@/app/services/technicianService';
import { useLanguage } from '@/components/LanguageProvider';
import { useToast } from '@/components/ui/Toast';
import { formatJsDate } from '@/lib/dateUtils';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';

export default function ReschedulePage() {
    const { language } = useLanguage();
    const params = useParams();
    const router = useRouter();
    const { showToast } = useToast();
    const token = params.token as string;

    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(true);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const [selectedDate, setSelectedDate] = useState<string>('');
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string>('');
    const [confirming, setConfirming] = useState(false);
    const [success, setSuccess] = useState(false);

    // 1. Verify Token on Load
    useEffect(() => {
        const verify = async () => {
            try {
                const result = await RescheduleService.validateToken(token);
                setData(result);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Invalid or expired link.');
            } finally {
                setVerifying(false);
                setLoading(false);
            }
        };
        verify();
    }, [token]);

    // 2. Fetch Slots when Date changes
    useEffect(() => {
        if (!selectedDate) {
            setAvailableSlots([]);
            return;
        }
        const fetchSlots = async () => {
            try {
                // Ensure date is YYYY-MM-DD
                const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
                const slots = await TechnicianService.getAvailableTimeSlots(formattedDate);
                setAvailableSlots(slots);
            } catch (err) {
                console.error("Error fetching slots", err);
            }
        };
        fetchSlots();
    }, [selectedDate]);

    const handleConfirm = async () => {
        if (!selectedDate || !selectedSlot) return;
        setConfirming(true);
        try {
            const formattedDate = new Date(selectedDate).toISOString().split('T')[0];

            // Find a valid tech for this slot
            const availableTechs = await TechnicianService.findAvailableTechnicians(formattedDate, selectedSlot);

            if (availableTechs.length === 0) {
                alert('Sorry, this slot was just taken. Please choose another.');
                showToast('Sorry, this slot was just taken. Please choose another.', 'error');
                setAvailableSlots(prev => prev.filter(s => s !== selectedSlot));
                setSelectedSlot('');
                setConfirming(false);
                return;
            }

            // Pick the first available tech (Simple Auto-Assign)
            const newTechId = availableTechs[0].id;

            // Construct new DateTime object
            const [hours, minutes] = selectedSlot.split(':').map(Number);
            const newDateTime = new Date(selectedDate);
            newDateTime.setHours(hours, minutes, 0, 0);

            await RescheduleService.confirmReschedule(token, newDateTime, newTechId);
            setSuccess(true);
        } catch (err: any) {
            showToast(err.message || 'Failed to reschedule.', 'error');
        } finally {
            setConfirming(false);
        }
    };

    if (verifying) return <div className="p-8 text-center text-gray-500">Verifying link...</div>;

    if (error) return (
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border-t-4 border-red-500">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-error-warning-line text-3xl"></i>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Link Invalid</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <p className="text-sm text-gray-500">Please contact support if you believe this is an error.</p>
        </div>
    );

    if (success) return (
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border-t-4 border-green-500">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-checkbox-circle-line text-3xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Reschedule Confirmed!</h1>
            <p className="text-gray-600 mb-6">
                Your appointment has been updated to:
                <br />
                <span className="font-semibold text-[#004a90] block mt-2 text-lg">
                    {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedSlot}
                </span>
            </p>
            <p className="text-sm text-gray-500">You can close this page now.</p>
        </div>
    );

    const project = data?.appointments?.active_projects;
    const currentAppt = data?.appointments;

    return (
        <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden">
            {/* Header */}
            <div className="bg-[#004a90] p-6 text-white text-center">
                <h1 className="text-xl font-bold">Reschedule Appointment</h1>
                <p className="text-blue-100 text-sm mt-1">Select a new time for your visit</p>
            </div>

            <div className="p-6 space-y-6">
                {/* Info Card */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Current Appointment</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="block text-gray-500 text-xs">Customer</span>
                            <span className="font-medium">{project?.client_name || 'Valued Customer'}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500 text-xs">Service</span>
                            <span className="font-medium">{project?.service || 'Service Visit'}</span>
                        </div>
                        <div className="col-span-2">
                            <span className="block text-gray-500 text-xs">Address</span>
                            <span className="font-medium text-gray-700">{project?.address || 'Provided Address'}</span>
                        </div>
                    </div>
                </div>

                {/* Selection Form */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pick a Date</label>
                        <input
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                setSelectedSlot('');
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>

                    {selectedDate && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Available Times</label>
                            {availableSlots.length > 0 ? (
                                <div className="grid grid-cols-3 gap-2">
                                    {availableSlots.map(slot => (
                                        <button
                                            key={slot}
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`py-2 px-3 rounded-md text-sm font-medium transition-all ${selectedSlot === slot
                                                ? 'bg-[#004a90] text-white shadow-md'
                                                : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                                                }`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-orange-600 bg-orange-50 p-3 rounded-md">
                                    No slots available on this date. Please try another day.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Action */}
                <button
                    onClick={handleConfirm}
                    disabled={!selectedSlot || confirming}
                    className={`w-full py-3 rounded-lg font-semibold text-white transition-all shadow-md ${!selectedSlot || confirming
                        ? 'bg-gray-300 cursor-not-allowed shadow-none'
                        : 'bg-[#004a90] hover:bg-[#003870] hover:shadow-lg'
                        }`}
                >
                    {confirming ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Confirming...
                        </span>
                    ) : (
                        'Confirm New Time'
                    )}
                </button>
            </div>
        </div>
    );
}
