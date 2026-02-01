'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { Document, DocumentEntityType } from '@/lib/types';
import { getDocumentsForEntity } from '@/lib/documentUtils';
import { formatJsDate } from '@/lib/dateUtils';

interface ProjectUpdatesProps {
    projectId: string;
    timeline?: any[];
}

interface UpdateEvent {
    id: string;
    type: 'document' | 'timeline' | 'progress';
    date: string | Date;
    title: string;
    description?: string;
    icon: string;
    iconColor: string; // e.g., 'text-blue-500'
    link?: string;
}

export default function ProjectUpdates({ projectId, timeline = [] }: ProjectUpdatesProps) {
    const { language } = useLanguage();
    const [events, setEvents] = useState<UpdateEvent[]>([]);
    const [loading, setLoading] = useState(true);

    const t = {
        en: {
            title: 'Recent Updates',
            noUpdates: 'No recent updates',
            newReport: 'New Report Available',
            newContract: 'Contract Uploaded',
            timelineUpdate: 'Project Update'
        },
        es: {
            title: 'Actualizaciones Recientes',
            noUpdates: 'Sin actualizaciones recientes',
            newReport: 'Nuevo Reporte Disponible',
            newContract: 'Contrato Subido',
            timelineUpdate: 'Actualización del Proyecto'
        }
    }[language === 'es' ? 'es' : 'en'];

    useEffect(() => {
        let isMounted = true;

        const fetchUpdates = async () => {
            try {
                // 1. Fetch Documents (Reports & Contracts only)
                const docs = await getDocumentsForEntity('active_projects', projectId);

                const importantDocs = docs.filter(d =>
                    d.category === 'report' ||
                    d.category === 'monthly_report' ||
                    d.category === 'contract'
                );

                const docEvents: UpdateEvent[] = importantDocs.map(doc => ({
                    id: doc.id || `doc-${Math.random()}`,
                    type: 'document',
                    date: doc.uploadedAt,
                    title: doc.category === 'contract' ? t.newContract : t.newReport,
                    description: doc.name,
                    icon: 'ri-file-text-line',
                    iconColor: 'text-[#004a90]',
                    link: doc.downloadURL
                }));

                // 2. Map Timeline
                const timelineEvents: UpdateEvent[] = timeline.map((item, idx) => {
                    // Try to find a valid date field
                    const rawDate = item.timestamp || item.createdAt || item.date || item.created_at;
                    const parsedDate = rawDate ? new Date(rawDate) : new Date();
                    const isValidDate = !isNaN(parsedDate.getTime());

                    if (!isValidDate) {
                        console.warn('Invalid date in timeline item:', item);
                    }

                    return {
                        id: item.id || `tl-${idx}`,
                        type: 'timeline',
                        // Use valid parsed date or fallback to now
                        date: isValidDate ? parsedDate : new Date(),
                        title: t.timelineUpdate,
                        description: item.description || item.note || item.message || '',
                        icon: 'ri-flag-line',
                        iconColor: 'text-[#c3d021]'
                    };
                });

                // 3. Merge & Sort
                const allEvents = [...docEvents, ...timelineEvents].sort((a, b) => {
                    const timeA = new Date(a.date).getTime();
                    const timeB = new Date(b.date).getTime();

                    // Handle NaN safely (though we try to prevent it above)
                    if (isNaN(timeA)) return 1; // A is invalid -> push to bottom
                    if (isNaN(timeB)) return -1; // B is invalid -> push to bottom

                    return timeB - timeA; // Descending (Newest first)
                });

                console.log('ProjectUpdates Debug:', {
                    rawTimeline: timeline,
                    firstDocDate: docEvents[0]?.date,
                    firstTlDate: timelineEvents[0]?.date,
                    sortedEvents: allEvents.map(e => ({ type: e.type, date: e.date, title: e.title }))
                });

                if (isMounted) {
                    setEvents(allEvents.slice(0, 5));
                }
            } catch (err) {
                console.error('Error loading updates', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchUpdates();

        return () => { isMounted = false; };
    }, [projectId, timeline, language]); // added language to dep

    if (loading) {
        return <div className="animate-pulse h-20 bg-gray-50 rounded-lg"></div>;
    }

    if (events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-100 border-dashed">
                <i className="ri-notification-badge-line text-gray-300 text-xl mb-1"></i>
                <p className="text-xs text-gray-400">{t.noUpdates}</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#004a90] flex items-center gap-2">
                <i className="ri-notification-3-line"></i>
                {t.title}
            </h4>
            <div className="space-y-2">
                {events.map(event => (
                    <div key={event.id} className="flex gap-3 items-start p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className={`mt-0.5 ${event.iconColor}`}>
                            <i className={event.icon}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-800 truncate">
                                {event.title}
                            </p>
                            <p className="text-xs text-gray-500 line-clamp-2">
                                {event.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-gray-400">
                                    {formatJsDate(event.date, language === 'es' ? 'es-PA' : 'en-US')}
                                </span>
                                {event.link && (
                                    <a
                                        href={event.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-[10px] text-[#004a90] font-medium hover:underline flex items-center gap-1"
                                    >
                                        VER <i className="ri-external-link-line"></i>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
