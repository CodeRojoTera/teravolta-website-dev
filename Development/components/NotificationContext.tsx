'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

export interface Notification {
    id: string;
    type: 'inquiry' | 'quote' | 'project' | 'system';
    title: string;
    message: string;
    read: boolean;
    createdAt: string; // ISO string
    link?: string;
    recipientId?: string;
    targetRole?: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    loading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [standardNotifications, setStandardNotifications] = useState<Notification[]>([]);
    const [inquiryNotifications, setInquiryNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);

    // Fetch user role
    useEffect(() => {
        const fetchUserRole = async () => {
            if (!user) {
                setUserRole(null);
                return;
            }
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setUserRole(data.role || 'admin');
                }
            } catch (error) {
                console.error("Error fetching user role:", error);
            }
        };
        fetchUserRole();
    }, [user]);

    useEffect(() => {
        if (!user || userRole === null) {
            setNotifications([]);
            setLoading(false);
            return;
        }

        // 1. Fetch Standard Notifications and Subscribe
        const fetchStandard = async () => {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data) {
                setStandardNotifications(data.map(d => ({
                    ...d,
                    createdAt: d.created_at, // Map snake_case to camelCase for internal use if needed, but easier to adapt type
                    recipientId: d.user_id
                })) as any);
            }
        };

        fetchStandard();

        const channelStandard = supabase.channel('notifications_std')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
                (payload) => {
                    fetchStandard();
                }
            )
            .subscribe();


        // 2. Fetch Inquiries and Subscribe
        const fetchInquiries = async () => {
            let query = supabase
                .from('admin_inquiries')
                .select('*')
                .order('requested_at', { ascending: false });

            if (userRole !== 'super_admin') {
                query = query.eq('requested_by', user.id);
            }

            const { data: inquiries, error } = await query;

            if (inquiries) {
                processInquiries(inquiries);
            }
        };

        const processInquiries = (inquiries: any[]) => {
            const messageNotifs: Notification[] = [];

            inquiries.forEach(inq => {
                // Filter out resolved inquiries
                if (inq.status === 'resolved') return;

                const myReadTime = inq.read_by?.[user.id]; // Access JSONB field

                // Case 1: New Message (Standard)
                if (inq.last_message_at && inq.last_message_by) {
                    // Do not notify the sender
                    if (inq.last_message_by === user.id) return;

                    // Check if read
                    if (myReadTime && new Date(myReadTime).getTime() >= new Date(inq.last_message_at).getTime()) return;

                    messageNotifs.push({
                        id: `msg-${inq.id}`,
                        type: 'inquiry',
                        title: 'New Message',
                        message: `New message in ${inq.type} request`,
                        read: false,
                        createdAt: inq.last_message_at,
                        link: `/portal/admin/admin-inquiries?id=${inq.id}`,
                        recipientId: user.id
                    } as any);
                    return;
                }

                // Case 2: New Request (Super Admin only - if no message yet)
                if (userRole === 'super_admin' && !inq.last_message_at) {
                    if (inq.requested_by === user.id) return;

                    // Check if read (compare against requestedAt)
                    if (myReadTime && new Date(myReadTime).getTime() >= new Date(inq.requested_at).getTime()) return;

                    messageNotifs.push({
                        id: `req-${inq.id}`,
                        type: 'inquiry',
                        title: 'New Request',
                        message: `New ${inq.type} request from ${inq.requested_by_email}`,
                        read: false,
                        createdAt: inq.requested_at,
                        link: `/portal/admin/admin-inquiries?id=${inq.id}`,
                        recipientId: user.id
                    } as any);
                }
            });

            setInquiryNotifications(messageNotifs as any);
        };

        fetchInquiries();

        const channelInquiries = supabase.channel('notifications_inq')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'admin_inquiries' },
                () => {
                    fetchInquiries();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channelStandard);
            supabase.removeChannel(channelInquiries);
        };
    }, [user, userRole]);

    // Combine notifications
    useEffect(() => {
        const sorted = [...standardNotifications, ...inquiryNotifications].sort((a, b) => {
            const timeA = new Date(a.createdAt || 0).getTime();
            const timeB = new Date(b.createdAt || 0).getTime();
            return timeB - timeA;
        });
        setNotifications(sorted);
    }, [standardNotifications, inquiryNotifications]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = async (id: string) => {
        try {
            if (id.startsWith('msg-') || id.startsWith('req-')) {
                // Inquiry notification (message or new request)
                const inquiryId = id.replace('msg-', '').replace('req-', '');

                // Fetch current read_by map
                const { data: currentData } = await supabase.from('admin_inquiries').select('read_by').eq('id', inquiryId).single();
                const currentReadBy = currentData?.read_by || {};

                if (user) {
                    await supabase.from('admin_inquiries').update({
                        read_by: { ...currentReadBy, [user.id]: new Date().toISOString() }
                    }).eq('id', inquiryId);
                }
            } else {
                // Standard notification
                await supabase.from('notifications').update({ read: true }).eq('id', id);
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const unread = notifications.filter(n => !n.read);

            const standardIds = unread.filter(n => !n.id.startsWith('msg-') && !n.id.startsWith('req-')).map(n => n.id);
            const inquiryIds = unread.filter(n => n.id.startsWith('msg-') || n.id.startsWith('req-')).map(n => n.id.replace('msg-', '').replace('req-', ''));

            if (standardIds.length > 0) {
                await supabase.from('notifications').update({ read: true }).in('id', standardIds);
            }

            // For inquiries we need to update read_by map for each one, which is tricky in batch.
            // Loop for now.
            for (const id of inquiryIds) {
                if (!user) continue;
                // Fetch current read_by map (inefficient in loop but safe)
                const { data: currentData } = await supabase.from('admin_inquiries').select('read_by').eq('id', id).single();
                const currentReadBy = currentData?.read_by || {};

                await supabase.from('admin_inquiries').update({
                    read_by: { ...currentReadBy, [user.id]: new Date().toISOString() }
                }).eq('id', id);
            }

        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, loading }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
