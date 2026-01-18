'use client';

import { useState, useRef, useEffect } from 'react';
import { useNotifications, Notification } from '@/components/NotificationContext';
import { useLanguage } from '@/components/LanguageProvider';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

export default function NotificationCenter() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const { language } = useLanguage();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const content = {
        en: {
            notifications: 'Notifications',
            markAllRead: 'Mark all as read',
            noNotifications: 'No notifications',
            viewAll: 'View all'
        },
        es: {
            notifications: 'Notificaciones',
            markAllRead: 'Marcar todo leído',
            noNotifications: 'Sin notificaciones',
            viewAll: 'Ver todas'
        }
    };

    const t = content[language];

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.read) {
            await markAsRead(notification.id);
        }
        if (notification.link) {
            router.push(notification.link);
            setIsOpen(false);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'inquiry': return 'ri-message-3-line text-blue-500';
            case 'quote': return 'ri-file-list-3-line text-purple-500';
            case 'project': return 'ri-folder-line text-green-500';
            default: return 'ri-notification-line text-gray-500';
        }
    };

    const getDateLabel = (date: any) => {
        if (!date) return '';
        try {
            return formatDistanceToNow(new Date(date), {
                addSuffix: true,
                locale: language === 'es' ? es : enUS
            });
        } catch (e) {
            return '';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-[#004a90] hover:bg-gray-100 rounded-full transition-colors"
                aria-label={t.notifications}
            >
                <i className="ri-notification-3-line text-xl"></i>
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white font-bold items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden transform origin-top-right transition-all">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                        <h3 className="font-bold text-gray-800">{t.notifications}</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={() => markAllAsRead()}
                                className="text-xs text-[#004a90] hover:underline font-medium"
                            >
                                {t.markAllRead}
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length > 0 ? (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors flex gap-3 ${!notification.read ? 'bg-blue-50/50' : ''}`}
                                    >
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100`}>
                                            <i className={getIcon(notification.type)}></i>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1">
                                                {getDateLabel(notification.createdAt)}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <div className="flex-shrink-0 self-center">
                                                <div className="w-2 h-2 bg-[#004a90] rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <i className="ri-notification-off-line text-3xl mb-2 block opacity-50"></i>
                                {t.noNotifications}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
