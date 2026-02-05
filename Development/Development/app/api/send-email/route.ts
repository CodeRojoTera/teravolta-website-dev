import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with API Key from env
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { to, subject, html, text, from } = await request.json();

        if (!process.env.RESEND_API_KEY) {
            console.error('RESEND_API_KEY is missing');
            return NextResponse.json(
                { error: 'Server misconfiguration: Missing Email API Key' },
                { status: 500 }
            );
        }

        if (!to || !subject || (!html && !text)) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Default 'from' address if not provided. 
        // Note: 'resend.dev' only works for testing. Production needs verified domain.
        // We use a safe default to avoid 400 errors if 'from' is missing.
        const fromAddress = from || 'TeraVolta <info@teravolta.com>';

        // In development/test mode (without verified domain), we might want to override 'to' 
        // to the account owner's email to avoid "403 Forbidden" errors from Resend
        // if the 'to' address isn't verified. 
        // For now, we assume the user has set this up or is testing accordingly.

        const data = await resend.emails.send({
            from: fromAddress,
            to: Array.isArray(to) ? to : [to],
            subject: subject,
            html: html,
            text: text
        });

        if (data.error) {
            console.error('Resend API Error:', data.error);
            return NextResponse.json({ error: data.error.message }, { status: 400 });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Email sending error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to send email' },
            { status: 500 }
        );
    }
}
