import { NotificationService } from './notificationService';

export const EmailService = {
    /**
     * Send a generic email via the internal API
     */
    send: async (data: {
        to: string;
        subject: string;
        html?: string;
        text?: string;
    }) => {
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send email');
            }

            return await response.json();
        } catch (error) {
            console.error('EmailService Error:', error);
            throw error;
        }
    },

    /**
     * Send a reschedule link to a customer
     */
    /**
     * Send a reschedule link to a customer
     */
    sendRescheduleLink: async (email: string, link: string, customerName: string = 'Valued Customer') => {
        const subject = 'Reschedule Your Appointment - TeraVolta';
        const html = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #004a90;">Reschedule Your Appointment</h2>
                <p>Hello ${customerName},</p>
                <p>You have requested to reschedule your appointment. Please click the button below to choose a new time:</p>
                <p>
                    <a href="${link}" style="background-color: #c3d021; color: #194271; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                        Reschedule Now
                    </a>
                </p>
                <p>This link is valid for 48 hours.</p>
                <p>If you did not request this, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #888;">TeraVolta Operations</p>
            </div>
        `;

        return EmailService.send({
            to: email,
            subject,
            html,
            text: `Hello ${customerName},\n\nPlease use this link to reschedule your appointment: ${link}\n\nThis link is valid for 48 hours.`
        });
    },

    /**
     * Send an email only if user preferences allow it
     */
    sendWithPreferenceCheck: async (
        userId: string,
        type: 'info' | 'success' | 'warning' | 'error',
        data: {
            to: string;
            subject: string;
            html?: string;
            text?: string;
        }
    ) => {
        const shouldSend = await NotificationService.shouldSend(userId, type, 'email');
        if (!shouldSend) {
            console.log(`Email suppressed by user preference: User ${userId}, Type ${type}`);
            return null; // Sent nothing
        }
        return EmailService.send(data);
    }
};
