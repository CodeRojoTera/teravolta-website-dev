'use client';

import { ReactNode } from 'react';

interface EmptyStateProps {
    icon?: string;
    title: string;
    description?: string;
    action?: ReactNode;
    variant?: 'default' | 'compact';
}

export function EmptyState({
    icon = 'ri-inbox-line',
    title,
    description,
    action,
    variant = 'default'
}: EmptyStateProps) {
    if (variant === 'compact') {
        return (
            <div className="text-center py-8">
                <i className={`${icon} text-4xl text-gray-300 mb-2 block`}></i>
                <p className="text-gray-500 text-sm">{title}</p>
                {action && <div className="mt-3">{action}</div>}
            </div>
        );
    }

    return (
        <div className="text-center py-12 px-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className={`${icon} text-4xl text-gray-400`}></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
            {description && (
                <p className="text-gray-500 text-sm max-w-sm mx-auto mb-4">{description}</p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}

// Specific empty states for common scenarios
export function NoProjectsEmpty({ language = 'en' }: { language?: string }) {
    return (
        <EmptyState
            icon="ri-folder-line"
            title={language === 'es' ? 'No hay proyectos' : 'No projects yet'}
            description={language === 'es'
                ? 'Los proyectos aparecerán aquí cuando se creen'
                : 'Projects will appear here when created'}
        />
    );
}

export function NoInquiriesEmpty({ language = 'en' }: { language?: string }) {
    return (
        <EmptyState
            icon="ri-message-3-line"
            title={language === 'es' ? 'No hay consultas' : 'No inquiries'}
            description={language === 'es'
                ? 'Las consultas de clientes aparecerán aquí'
                : 'Customer inquiries will appear here'}
        />
    );
}

export function NoQuotesEmpty({ language = 'en' }: { language?: string }) {
    return (
        <EmptyState
            icon="ri-file-list-3-line"
            title={language === 'es' ? 'No hay cotizaciones' : 'No quotes'}
            description={language === 'es'
                ? 'Las solicitudes de cotización aparecerán aquí'
                : 'Quote requests will appear here'}
        />
    );
}

export function NoNotificationsEmpty({ language = 'en' }: { language?: string }) {
    return (
        <EmptyState
            icon="ri-notification-line"
            title={language === 'es' ? 'Sin notificaciones' : 'No notifications'}
            variant="compact"
        />
    );
}

export function SearchNoResults({ language = 'en' }: { language?: string }) {
    return (
        <EmptyState
            icon="ri-search-line"
            title={language === 'es' ? 'Sin resultados' : 'No results found'}
            description={language === 'es'
                ? 'Intenta con otros términos de búsqueda'
                : 'Try different search terms'}
        />
    );
}
