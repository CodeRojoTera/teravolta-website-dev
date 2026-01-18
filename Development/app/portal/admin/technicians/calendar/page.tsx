'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { TechnicianService } from '@/app/services/technicianService';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    eachDayOfInterval,
    parseISO,
    isWithinInterval
} from 'date-fns';
import { es, enUS } from 'date-fns/locale';

interface Absence {
    id: string;
    technician_id: string;
    start_date: string;
    end_date: string;
    reason: string;
    status: string;
    leave_type: string;
    technicians: {
        name: string;
    }
}

export default function AbsenceCalendarPage() {
    const { language } = useLanguage();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [absences, setAbsences] = useState<Absence[]>([]);
    const [loading, setLoading] = useState(true);

    const locale = language === 'es' ? es : enUS;

    const fetchAbsences = async () => {
        try {
            const data = await TechnicianService.getAllLeaves();
            setAbsences(data);
        } catch (error) {
            console.error('Error fetching absences:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAbsences();
    }, []);

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    if (loading) {
        return <PageLoadingSkeleton title={language === 'es' ? 'Calendario de Ausencias' : 'Absence Calendar'} />;
    }

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const getAbsencesForDay = (day: Date) => {
        return absences.filter(absence => {
            const start = parseISO(absence.start_date);
            const end = parseISO(absence.end_date);
            return isWithinInterval(day, { start, end });
        });
    };

    const getLeaveColor = (type: string) => {
        switch (type) {
            case 'vacation': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'sickness': return 'bg-red-100 text-red-700 border-red-200';
            case 'suspension': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'unplanned': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const t = {
        en: {
            title: 'Absence Calendar',
            subtitle: 'Overview of all technician leaves and availability',
            mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun',
            vacation: 'Vacation', sickness: 'Sickness', suspension: 'Suspension', unplanned: 'Unplanned', other: 'Other'
        },
        es: {
            title: 'Calendario de Ausencias',
            subtitle: 'Vista general de permisos y disponibilidad de técnicos',
            mon: 'Lun', tue: 'Mar', wed: 'Mié', thu: 'Jue', fri: 'Vie', sat: 'Sáb', sun: 'Dom',
            vacation: 'Vacaciones', sickness: 'Enfermedad', suspension: 'Suspensión', unplanned: 'No Planeado', other: 'Otro'
        }
    }[language];

    const weekDays = [t.mon, t.tue, t.wed, t.thu, t.fri, t.sat, t.sun];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
                    <p className="text-gray-500">{t.subtitle}</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                    <button
                        onClick={prevMonth}
                        className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-[#004a90]"
                    >
                        <i className="ri-arrow-left-s-line text-xl"></i>
                    </button>
                    <span className="text-lg font-bold text-[#004a90] min-w-[150px] text-center capitalize">
                        {format(currentDate, 'MMMM yyyy', { locale })}
                    </span>
                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-[#004a90]"
                    >
                        <i className="ri-arrow-right-s-line text-xl"></i>
                    </button>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></span>
                    <span>{t.vacation}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-red-100 border border-red-200"></span>
                    <span>{t.sickness}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-orange-100 border border-orange-200"></span>
                    <span>{t.suspension}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-purple-100 border border-purple-200"></span>
                    <span>{t.unplanned}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-gray-100 border border-gray-200"></span>
                    <span>{t.other}</span>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-7 border-b border-gray-100">
                    {weekDays.map(day => (
                        <div key={day} className="py-3 text-center text-sm font-bold text-gray-500 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 auto-rows-[120px]">
                    {calendarDays.map((day, idx) => {
                        const dayAbsences = getAbsencesForDay(day);
                        const isCurrentMonth = isSameMonth(day, monthStart);
                        const isToday = isSameDay(day, new Date());

                        return (
                            <div
                                key={idx}
                                className={`p-2 border-r border-b border-gray-50 last:border-r-0 relative group transition-colors
                                    ${!isCurrentMonth ? 'bg-gray-50/50' : 'hover:bg-gray-50/30'}
                                `}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                                        ${isToday ? 'bg-[#c3d021] text-[#194271] font-bold' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                                    `}>
                                        {format(day, 'd')}
                                    </span>
                                </div>

                                <div className="space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                                    {dayAbsences.map(absence => (
                                        <div
                                            key={absence.id}
                                            className={`text-[10px] px-1.5 py-0.5 rounded border truncate cursor-help ${getLeaveColor(absence.leave_type)}`}
                                            title={`${absence.technicians?.name}: ${absence.reason}`}
                                        >
                                            {absence.technicians?.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
