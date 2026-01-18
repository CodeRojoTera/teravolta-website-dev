import type { Metadata } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
    title: 'Reschedule Appointment - TeraVolta',
    description: 'Select a new time for your service visit.',
};

export default function RescheduleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-gray-50 min-h-screen font-sans">
                <main className="flex justify-center items-center min-h-screen p-4">
                    {children}
                </main>
            </body>
        </html>
    );
}
