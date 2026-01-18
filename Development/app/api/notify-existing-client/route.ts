import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { to, fullName, projectName, service, language = 'es' } = await request.json();

        if (!to) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const content = {
            en: {
                subject: `New Project Initiated: ${projectName}`,
                greeting: `Dear ${fullName},`,
                intro: `A new project has been initiated for you at TeraVolta: **${projectName}**.`,
                serviceLabel: 'Service:',
                action: 'You can track the progress of this project in your customer portal.',
                buttonText: 'View Project',
                signature: 'Best regards,',
                team: 'The TeraVolta Team'
            },
            es: {
                subject: `Nuevo Proyecto Iniciado: ${projectName}`,
                greeting: `Estimado/a ${fullName},`,
                intro: `Se ha iniciado un nuevo proyecto para usted en TeraVolta: **${projectName}**.`,
                serviceLabel: 'Servicio:',
                action: 'Puede dar seguimiento al progreso de este proyecto en su portal de cliente.',
                buttonText: 'Ver Proyecto',
                signature: 'Saludos cordiales,',
                team: 'El Equipo de TeraVolta'
            }
        };

        const t = content[language as 'en' | 'es'] || content.es;

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const projectLink = `${baseUrl}/portal/customer/projects`;

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <img src="https://teravolta.com/logo.png" alt="TeraVolta" style="max-width: 200px; height: auto;">
            </div>
            
            <div style="background: linear-gradient(135deg, #004a90, #194271); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
                <h1 style="margin: 0; font-size: 24px;">🚀 ${t.subject}</h1>
            </div>
            
            <p style="font-size: 16px;">${t.greeting}</p>
            <p style="font-size: 16px;">${t.intro}</p>
            <p style="font-size: 16px;"><strong>${t.serviceLabel}</strong> ${service}</p>
            
            <p style="font-size: 16px;">${t.action}</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${projectLink}" style="display: inline-block; background-color: #c3d021; color: #194271; padding: 15px 40px; font-size: 18px; font-weight: bold; text-decoration: none; border-radius: 8px;">${t.buttonText}</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 16px;">${t.signature}<br><strong>${t.team}</strong></p>
        </body>
        </html>
        `;

        const { data, error } = await resend.emails.send({
            from: 'TeraVolta <info@teravolta.com>',
            to: [to],
            subject: t.subject,
            html: htmlContent
        });

        if (error) throw error;

        return NextResponse.json({ success: true, messageId: data?.id });
    } catch (error: any) {
        console.error('Email sending error:', error);
        return NextResponse.json({ error: error.message || 'Failed to send notification email' }, { status: 500 });
    }
}
