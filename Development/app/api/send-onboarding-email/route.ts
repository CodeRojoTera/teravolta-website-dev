'use server';

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { to, fullName, magicLink, service, language = 'es', paymentAmount, scheduledDate, scheduledTime, role } = await request.json();

        if (!to || !magicLink) {
            return NextResponse.json({ error: 'Email and magic link are required' }, { status: 400 });
        }

        const content = {
            en: {
                subject: 'Welcome to TeraVolta - Activate Your Account',
                greeting: `Dear ${fullName},`,
                intro: 'Thank you for choosing TeraVolta for your energy solutions. Your service has been confirmed!',
                serviceLabel: 'Service:',
                action: 'To access your customer portal and track your project progress, please activate your account by clicking the button below:',
                buttonText: 'Activate My Account',
                expiry: 'This link will expire in 24 hours.',
                signature: 'Best regards,',
                team: 'The TeraVolta Team'
            },
            es: {
                subject: 'Bienvenido a TeraVolta - Activa Tu Cuenta',
                greeting: `Estimado/a ${fullName},`,
                intro: '¡Gracias por elegir TeraVolta para sus soluciones energéticas. Su servicio ha sido confirmado!',
                serviceLabel: 'Servicio:',
                action: 'Para acceder a su portal de cliente y dar seguimiento al progreso de su proyecto, por favor active su cuenta haciendo clic en el botón a continuación:',
                buttonText: 'Activar Mi Cuenta',
                expiry: 'Este enlace expirará en 24 horas.',
                signature: 'Saludos cordiales,',
                team: 'El Equipo de TeraVolta'
            },
            technician: {
                en: {
                    subject: 'Welcome to Team TeraVolta - Activate Your Account',
                    greeting: `Hello ${fullName},`,
                    intro: 'Welcome to the team! You have been invited to join TeraVolta as a field technician.',
                    serviceLabel: 'Role:',
                    action: 'To access your technician dashboard and view your schedule, please activate your account:',
                    buttonText: 'Activate Technician Account',
                    expiry: 'This link will expire in 24 hours.',
                    signature: 'Best regards,',
                    team: 'TeraVolta Admin'
                },
                es: {
                    subject: 'Bienvenido al Equipo TeraVolta - Activa Tu Cuenta',
                    greeting: `Hola ${fullName},`,
                    intro: '¡Bienvenido al equipo! Has sido invitado a unirte a TeraVolta como técnico de campo.',
                    serviceLabel: 'Rol:',
                    action: 'Para acceder a tu panel de técnico y ver tu horario, por favor activa tu cuenta:',
                    buttonText: 'Activar Cuenta de Técnico',
                    expiry: 'Este enlace expirará en 24 horas.',
                    signature: 'Saludos,',
                    team: 'Admin TeraVolta'
                }
            }
        };

        let t;
        if (role === 'technician') {
            // @ts-ignore
            t = content.technician[language as 'en' | 'es'] || content.technician.es;
        } else {
            // @ts-ignore
            t = content[language as 'en' | 'es'] || content.es;
        }

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
                <h1 style="margin: 0; font-size: 24px;">🎉 ${t.subject.replace('Welcome to TeraVolta - ', '').replace('Bienvenido a TeraVolta - ', '')}</h1>
            </div>
            
            <p style="font-size: 16px;">${t.greeting}</p>
            
            <p style="font-size: 16px;">${t.intro}</p>
            
            ${service ? `<p style="font-size: 16px;"><strong>${t.serviceLabel}</strong> ${service}</p>` : ''}
            
            ${paymentAmount ? `
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #c3d021;">
                <h3 style="margin: 0 0 10px 0; color: #004a90; font-size: 18px;">${language === 'es' ? 'Detalles de la Compra' : 'Purchase Details'}</h3>
                <p style="margin: 5px 0;"><strong>${language === 'es' ? 'Monto Pagado:' : 'Amount Paid:'}</strong> $${paymentAmount}</p>
                <p style="margin: 5px 0; color: #28a745;"><strong>✓ ${language === 'es' ? 'Pago Confirmado' : 'Payment Confirmed'}</strong></p>
            </div>` : ''}

            ${scheduledDate ? `
            <div style="background-color: #f0f7ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #004a90;">
                <h3 style="margin: 0 0 10px 0; color: #004a90; font-size: 18px;">${language === 'es' ? 'Cita Programada' : 'Scheduled Appointment'}</h3>
                <p style="margin: 5px 0;"><strong>${language === 'es' ? 'Fecha:' : 'Date:'}</strong> ${scheduledDate}</p>
                <p style="margin: 5px 0;"><strong>${language === 'es' ? 'Hora:' : 'Time:'}</strong> ${scheduledTime}</p>
            </div>` : ''}
            
            <p style="font-size: 16px;">${t.action}</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${magicLink}" style="display: inline-block; background-color: #c3d021; color: #194271; padding: 15px 40px; font-size: 18px; font-weight: bold; text-decoration: none; border-radius: 8px;">${t.buttonText}</a>
            </div>
            
            <p style="font-size: 14px; color: #666; text-align: center;">${t.expiry}</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 16px;">${t.signature}<br><strong>${t.team}</strong></p>
            
            <div style="text-align: center; font-size: 12px; color: #999; margin-top: 30px;">
                <p>TeraVolta Energy Solutions<br>Panamá</p>
            </div>
        </body>
        </html>
        `;

        const { data, error } = await resend.emails.send({
            from: 'TeraVolta <info@teravolta.com>',
            to: [to],
            subject: t.subject,
            html: htmlContent
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json({ error: 'Failed to send email', details: error }, { status: 500 });
        }

        return NextResponse.json({ success: true, messageId: data?.id });
    } catch (error) {
        console.error('Email sending error:', error);
        return NextResponse.json(
            { error: 'Failed to send onboarding email' },
            { status: 500 }
        );
    }
}
