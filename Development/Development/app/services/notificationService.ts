import { supabase } from '@/lib/supabase';

export interface Notification {
    id: string;
    user_id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    link?: string;
    read: boolean;
    created_at: string;
}

export const NotificationService = {
    /**
     * Get unread notifications count
     */
    async getUnreadCount(userId: string): Promise<number> {
        const { count, error } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('read', false);

        if (error) throw error;
        return count || 0;
    },

    /**
     * Get recent notifications
     */
    async getNotifications(userId: string, limit = 10): Promise<Notification[]> {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data as Notification[];
    },

    /**
     * Mark a notification as read
     */
    async markAsRead(id: string): Promise<void> {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', id);

        if (error) throw error;
    },

    /**
     * Mark all notifications as read for a user
     */
    async markAllAsRead(userId: string): Promise<void> {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', userId)
            .eq('read', false);

        if (error) throw error;
    },

    /**
     * Create a new notification
     */
    /**
     * Check if a notification should be sent based on user preferences
     */
    async shouldSend(userId: string, type: 'info' | 'success' | 'warning' | 'error', channel: 'in_app' | 'email' = 'in_app'): Promise<boolean> {
        try {
            const { data, error } = await supabase
                .from('user_settings')
                .select('preferences')
                .eq('user_id', userId)
                .single();

            // Default to true if no settings found or error (safe default)
            if (error || !data || !data.preferences) return true;

            const prefs = data.preferences as any;

            // 1. Check Global Channel Switch
            if (channel === 'in_app' && prefs.in_app === false) return false;
            if (channel === 'email' && prefs.email === false) return false;

            // 2. Check Specific Type Preference
            // If types object exists and has the key, respect it. Otherwise default to true.
            if (prefs.types && typeof prefs.types[type] === 'boolean') {
                return prefs.types[type];
            }

            return true;
        } catch (error) {
            console.error('Error checking notification preferences:', error);
            return true; // Safe default
        }
    },

    /**
     * Create a new notification
     */
    async create(notification: Omit<Notification, 'id' | 'created_at' | 'read'>): Promise<void> {
        // Enforce Preference Check
        const shouldSend = await this.shouldSend(notification.user_id, notification.type, 'in_app');

        if (!shouldSend) {
            console.log(`Notification suppressed by user preference: User ${notification.user_id}, Type ${notification.type}`);
            return;
        }

        const { error } = await supabase
            .from('notifications')
            .insert({
                ...notification,
                read: false
            });

        if (error) throw error;
    }
};
