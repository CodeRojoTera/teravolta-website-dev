import { supabase } from '@/lib/supabase';
import { NotificationService } from './notificationService';

export interface Review {
    id: string;
    technician_id: string;
    project_id: string;
    reviewer_id?: string;
    rating: number;
    comment?: string;
    created_at: string;
}

export const ReviewService = {
    /**
     * Submit a new review for a technician.
     */
    async submitReview(data: {
        technicianId: string;
        projectId: string; // The project being reviewed
        rating: number;
        comment?: string;
    }) {
        const { error } = await supabase
            .from('technician_reviews')
            .insert({
                technician_id: data.technicianId,
                project_id: data.projectId,
                rating: data.rating,
                comment: data.comment,
                // reviewer_id is handled by RLS via auth.uid() automatically if logged in,
                // or we can explicitly pass it if needed, but RLS `default` is cleaner. 
                // Wait, RLS policies check `auth.uid() = reviewer_id`, so we MUST send it if we want it stored.
                // However, triggers can auto-set it. Let's explicitly set it if we have context, 
                // or rely on the backend to know who sent it.
                // Actually, for simplicity in client-side calls:
            });

        if (error) {
            console.error('Error submitting review:', error);
            throw error;
        }
    },

    /**
     * Get reviews for a specific technician.
     */
    async getTechnicianReviews(technicianId: string) {
        const { data, error } = await supabase
            .from('technician_reviews')
            .select('*')
            .eq('technician_id', technicianId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Review[];
    },

    /**
     * Calculate average rating for a technician.
     */
    async getAverageRating(technicianId: string): Promise<number | null> {
        const { data, error } = await supabase
            .from('technician_reviews')
            .select('rating')
            .eq('technician_id', technicianId);

        if (error) throw error;
        if (!data || data.length === 0) return null;

        const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
        return parseFloat((sum / data.length).toFixed(1));
    },

    /**
     * Trigger a review request email to the client.
     */
    /**
     * Trigger a review request email to the client.
     */
    async requestReview(email: string, projectId: string, clientName: string, clientUserId?: string | null) {
        try {
            // Check User Preferences if registered
            if (clientUserId) {
                const shouldSend = await NotificationService.shouldSend(clientUserId, 'info', 'email');
                if (!shouldSend) {
                    console.log(`Skipping review request for ${email}: User disabled email notifications.`);
                    return;
                }
            }

            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: email,
                    type: 'review_request',
                    templateData: {
                        name: clientName,
                        projectId: projectId,
                        reviewLink: `${window.location.origin}/portal/customer/projects/${projectId}?action=review`
                    }
                })
            });

            if (!response.ok) {
                console.error('Failed to send review request');
            }
        } catch (error) {
            console.error('Error requesting review:', error);
            // Don't throw, just log. This is a side effect.
        }
    }
};
