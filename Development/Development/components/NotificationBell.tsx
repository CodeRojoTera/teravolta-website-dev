'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { NotificationService, Notification } from '@/app/services/notificationService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotificationBell() {
    const { user } = useAuth();
    const router = useRouter();
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Initial Fetch & Polling for Count
    useEffect(() => {
        if (!user) return;

        const fetchCount = async () => {
            try {
                const count = await NotificationService.getUnreadCount(user.id);
                setUnreadCount(count);
            } catch (error: any) {
                if (!error.message?.includes('AbortError') && error.name !== 'AbortError') {
                    console.error('Error fetching notification count:', error);
                }
            }
        };

        fetchCount();
        const interval = setInterval(fetchCount, 30000); // Poll every 30s

        return () => clearInterval(interval);
    }, [user]);

    // Fetch details when opening
    useEffect(() => {
        if (isOpen && user) {
            setLoading(true);
            NotificationService.getNotifications(user.id)
                .then(setNotifications)
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [isOpen, user]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id: string, link?: string) => {
        try {
            await NotificationService.markAsRead(id);
            setUnreadCount(prev => Math.max(0, prev - 1));
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

            if (link) {
                setIsOpen(false);
                router.push(link);
            }
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleMarkAllRead = async () => {
        if (!user) return;
        try {
            await NotificationService.markAllAsRead(user.id);
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Error marking all read:', error);
        }
    };

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors outline-none focus:ring-2 focus:ring-[#004a90]"
                aria-label="Notifications"
            >
                <i className="ri-notification-3-line text-xl"></i>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full min-w-[18px]">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs text-[#004a90] hover:underline font-medium"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-gray-400 text-sm">Loading...</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm flex flex-col items-center gap-2">
                                <i className="ri-notification-off-line text-2xl opacity-50"></i>
                                No notifications
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`p-3 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 ${!n.read ? 'bg-blue-50/50' : ''}`}
                                        onClick={() => handleMarkAsRead(n.id, n.link)}
                                    >
                                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!n.read ? 'bg-[#004a90]' : 'bg-transparent'}`}></div>
                                        <div className="flex-1">
                                            <p className={`text-sm ${!n.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                                {n.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                                {n.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1">
                                                {new Date(n.created_at).toLocaleDateString()} • {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
