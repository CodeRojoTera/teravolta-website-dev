'use client';

import { useEffect } from 'react';

export default function GlobalErrorSuppressor() {
    useEffect(() => {
        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            const reason = event.reason;
            if (
                reason?.name === 'AbortError' ||
                reason?.message?.includes('AbortError') ||
                reason?.message?.includes('signal is aborted without reason')
            ) {
                // Prevent the error from showing up in the console or error boundary
                event.preventDefault();
            }
        };

        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        return () => {
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    }, []);

    return null;
}
