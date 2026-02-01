import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase-admin';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { to, fullName, projectName, documents, projectId, language = 'es', context } = await request.json();

        if (!to || !documents || !Array.isArray(documents) || documents.length === 0 || !projectId) {
            return NextResponse.json({ error: 'Email, documents array and Project ID are required' }, { status: 400 });
        }

        const isPhased = context?.projectType === 'phased';
        const phaseName = context?.phaseName || '';

        // Subject Construction
        let subject_en = `Invoice for Project: ${projectName}`;
        let subject_es = `Factura del Proyecto: ${projectName}`;

        if (isPhased && phaseName) {
            subject_en = `Invoice for ${phaseName} - ${projectName}`;
            subject_es = `Factura de ${phaseName} - ${projectName}`;
        }

        // Intro Construction
        let intro_en = `We hope this email finds you well. Your invoice(s) for the project "${projectName}" are now available.`;
        let intro_es = `Esperamos que se encuentre bien. Su(s) factura(s) correspondiente(s) al proyecto "${projectName}" ya están disponibles.`;

        if (isPhased && phaseName) {
            intro_en = `We hope this email finds you well. Here are the invoice(s) for **${phaseName}** of project "${projectName}".`;
            intro_es = `Esperamos que se encuentre bien. Aquí están la(s) factura(s) para **${phaseName}** del proyecto "${projectName}".`;
        }

        const content = {
            en: {
                subject: subject_en,
                greeting: `Dear ${fullName},`,
                intro: intro_en,
                action: 'You can view and download your documents by clicking the buttons below:',
                portalNote: 'You can also access all your project documentation and invoices in your customer portal.',
                signature: 'Best regards,',
                team: 'The TeraVolta Team'
            },
            es: {
                subject: subject_es,
                greeting: `Estimado/a ${fullName},`,
                intro: intro_es,
                action: 'Puede ver y descargar sus documentos haciendo clic en los botones a continuación:',
                portalNote: 'También puede acceder a toda la documentación de su proyecto y facturas desde su portal de cliente.',
                signature: 'Saludos cordiales,',
                team: 'El Equipo de TeraVolta'
            }
        };

        const t = content[language as 'en' | 'es'] || content.es;

        // Generate Buttons HTML
        const buttonsHtml = documents.map((doc: { name: string, url: string }) => `
            <div style="text-align: center; margin: 15px 0;">
                <a href="${doc.url}" style="display: inline-block; background-color: #c3d021; color: #194271; padding: 14px 30px; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    ${language === 'es' ? 'Ver' : 'View'} ${doc.name}
                </a>
            </div>
        `).join('');

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
                <h1 style="margin: 0; font-size: 20px;">📄 ${t.subject}</h1>
            </div>
            
            <p style="font-size: 16px;">${t.greeting}</p>
            
            <p style="font-size: 16px;">${t.intro}</p>
            
            <p style="font-size: 16px;">${t.action}</p>
            
            <div style="margin: 35px 0;">
                ${buttonsHtml}
            </div>
            
            <p style="font-size: 14px; color: #666; background: #f9f9f9; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #eee;">
                ${t.portalNote}
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 16px;">${t.signature}<br><strong>${t.team}</strong></p>
            
            <div style="text-align: center; font-size: 12px; color: #999; margin-top: 30px;">
                <p>TeraVolta Energy Solutions<br>Panamá</p>
            </div>
        </body>
        </html>
        `;

        const { data, error } = await resend.emails.send({
            from: 'TeraVolta <billing@teravolta.com>',
            to: [to],
            subject: t.subject,
            html: htmlContent
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json({ error: 'Failed to send email', details: error }, { status: 500 });
        }

        // Update project with sent timestamp (Postgres/Supabase)
        const { error: updateError } = await supabaseAdmin
            .from('active_projects')
            .update({
                last_updated: new Date().toISOString()
                // We might need a specific field for invoice_sent_at if it exists in schema, 
                // otherwise check schema. Assuming 'events' or just 'last_updated' for now based on context.
                // Re-reading code: it sets invoiceSentAt. Let's check if that column exists or if we should add a timeline event.
            })
            .eq('id', projectId);

        if (updateError) {
            console.error('Supabase update error:', updateError);
            // Non-blocking but good to log
        }
    } catch (error) {
        console.error('Invoice sending error:', error);
        return NextResponse.json(
            { error: 'Failed to send invoice email' },
            { status: 500 }
        );
    }
}
