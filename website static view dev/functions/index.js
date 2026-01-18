/**
 * Cloud Functions for TeraVolta
 * Handles email notifications via Zoho Mail when new inquiries are created in Firestore.
 * 
 * IMPORTANT: 
 * 1. This function sends emails using SMTP, which requires outbound networking.
 *    You MUST be on the Firebase "Blaze" (Pay-as-you-go) plan. The free Spark plan blocks external network requests.
 * 
 * 2. You must configure your Zoho credentials in Firebase environment variables:
 *    firebase functions:config:set zoho.email="info@teravolta.com" zoho.password="YOUR_APP_PASSWORD"
 *    (Use an App Password if 2FA is enabled on Zoho, which is recommended)
 */

const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const { defineString } = require("firebase-functions/params");

admin.initializeApp();

// Define parameters (they will read from .env or config)
const zohoEmailParam = defineString("ZOHO_EMAIL");
const zohoPasswordParam = defineString("ZOHO_PASSWORD");

// Helper to create transporter with current config
const getTransporter = () => {
    const zohoEmail = zohoEmailParam.value();
    const zohoPassword = zohoPasswordParam.value();

    if (!zohoEmail || !zohoPassword) {
        throw new Error("Zoho credentials not configured.");
    }

    return nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: zohoEmail,
            pass: zohoPassword
        }
    });
};

exports.sendInquiryEmails = functions.firestore
    .document("inquiries/{inquiryId}")
    .onCreate(async (snap, context) => {
        const data = snap.data();
        const inquiryId = context.params.inquiryId;

        const { fullName, email, subject, message, language, clientType, companyName, phoneNumber, attachments } = data;

        // Verify critical data
        if (!email || !message) {
            console.log("Missing email or message, skipping email sending.");
            return null;
        }

        try {
            const transporter = getTransporter();
            const senderEmail = zohoEmailParam.value();

            // Prepare Attachment Links
            let attachmentHtml = "";
            if (attachments && attachments.length > 0) {
                attachmentHtml = `
                    <p><strong>Attachments:</strong></p>
                    <ul style="padding-left: 20px;">
                        ${attachments.map(file => `<li><a href="${file.downloadURL}" target="_blank">${file.fileName}</a> (${(file.size / 1024 / 1024).toFixed(2)} MB)</li>`).join('')}
                    </ul>
                `;
            }

            // 1. Send Internal Notification to Admin
            const mailOptionsAdmin = {
                from: `"TeraVolta Ops" <${senderEmail}>`,
                to: senderEmail,
                replyTo: email,
                subject: `[New Inquiry] ${subject || 'No Subject'} - ${fullName}`,
                html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #004a90;">New Website Inquiry</h2>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Client Type:</strong> ${clientType ? (clientType === 'business' ? 'Business / Company' : 'Residential') : 'N/A'}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${clientType === 'business' ? `<p><strong>Company:</strong> ${companyName || "N/A"}</p>` : ''}
            <p><strong>Phone:</strong> ${phoneNumber || "N/A"}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Source:</strong> ${data.source || "Website"}</p>
            
            ${attachmentHtml}

            <p><strong>Message:</strong></p>
            <blockquote style="background: #f4f6f8; padding: 15px; border-left: 4px solid #c3d021; margin: 0;">
              ${message.replace(/\n/g, '<br>')}
            </blockquote>
            <p style="margin-top: 20px; font-size: 12px; color: #888;">ID: ${inquiryId}</p>
          </div>
        `
            };

            // 2. Send Customer Confirmation
            const isEs = language === 'es';
            const customerSubject = isEs
                ? `Hemos recibido tu mensaje - TeraVolta`
                : `We received your message - TeraVolta`;

            const attachmentNote = (attachments && attachments.length > 0)
                ? (isEs ? `<p>Hemos recibido ${attachments.length} archivo(s) adjunto(s).</p>` : `<p>We have received ${attachments.length} attached file(s).</p>`)
                : '';

            const customerBody = isEs
                ? `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <p>Hola <strong>${fullName}</strong>,</p>
            <p>Gracias por contactar a TeraVolta. Hemos recibido tu consulta sobre "<strong>${subject}</strong>".</p>
            ${attachmentNote}
            <p>Nuestro equipo revisará tu mensaje y te responderá en un plazo de 24 horas.</p>
            <p>Tu referencia de consulta es: <strong>${inquiryId}</strong></p>
            <br>
            <p>Saludos cordiales,</p>
            <p><strong>El Equipo de TeraVolta</strong></p>
            <p><a href="https://teravolta.com" style="color: #004a90; text-decoration: none;">www.teravolta.com</a></p>
          </div>
        `
                : `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <p>Hello <strong>${fullName}</strong>,</p>
            <p>Thank you for contacting TeraVolta. We have received your inquiry regarding "<strong>${subject}</strong>".</p>
            ${attachmentNote}
            <p>Our team will review your message and get back to you within 24 hours.</p>
            <p>Your inquiry reference is: <strong>${inquiryId}</strong></p>
            <br>
            <p>Best regards,</p>
            <p><strong>The TeraVolta Team</strong></p>
            <p><a href="https://teravolta.com" style="color: #004a90; text-decoration: none;">www.teravolta.com</a></p>
          </div>
        `;

            const mailOptionsCustomer = {
                from: `"TeraVolta Support" <${senderEmail}>`,
                to: email,
                subject: customerSubject,
                html: customerBody
            };

            // Send both emails in parallel
            await Promise.all([
                transporter.sendMail(mailOptionsAdmin),
                transporter.sendMail(mailOptionsCustomer)
            ]);

            console.log(`Emails sent successfully via Zoho for inquiry ${inquiryId}`);

            // Update status in Firestore to indicate email sent
            await snap.ref.update({ status: 'email_sent' });

        } catch (error) {
            console.error("Error sending emails:", error);
            // Log error in Firestore for debugging
            await snap.ref.update({
                status: 'email_failed',
                error: error.message
            });
        }
    });
