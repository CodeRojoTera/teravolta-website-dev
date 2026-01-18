'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import { useAuth } from '@/components/AuthProvider';
import { ActiveProjectService } from '@/app/services/activeProjectService';
import { supabase } from '@/lib/supabase';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { uploadDocument } from '@/lib/documentUtils';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { EmptyState } from '@/components/ui/EmptyState';
import DocumentManager from '@/components/DocumentManager';
import { v4 as uuidv4 } from 'uuid'; // Standard import if available, else manual string
import { NotificationService } from '@/app/services/notificationService';
import { EmailService } from '@/app/services/emailService';

type QuoteStatus = 'pending_review' | 'in_review' | 'approved' | 'paid' | 'rejected' | 'cancelled';

export default function QuoteDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { language } = useLanguage();
    const { user } = useAuth();
    const [quote, setQuote] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [sendingOnboarding, setSendingOnboarding] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const { showToast } = useToast();

    // Phases State
    const [newPhaseName, setNewPhaseName] = useState('');
    const [newPhaseAmount, setNewPhaseAmount] = useState('');

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                if (!id) return;

                const { data, error } = await supabase
                    .from('quotes')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error || !data) {
                    console.error('Error fetching quote:', error);
                    router.push('/portal/admin/quotes');
                    return;
                }

                // Map snake_case to camelCase for internal use
                setQuote({
                    ...data,
                    // Map known snake_case fields that need camelCase mapping
                    fullName: data.client_name,
                    clientName: data.client_name,
                    email: data.client_email,
                    phone: data.client_phone,
                    company: data.client_company,
                    zipCode: data.zip_code,
                    propertyType: data.property_type,
                    propertySize: data.property_size,
                    currentBill: data.current_bill,
                    deviceMode: data.device_mode,
                    renewableBudget: data.renewable_budget,
                    reviewedBy: data.reviewed_by,
                    reviewedAt: data.reviewed_at,
                    linkedProjectId: data.linked_project_id,
                    createdAt: data.created_at,
                    // Map new fields
                    timeline: data.timeline,
                    budget: data.budget,
                    projectDescription: data.project_description,
                    city: data.city,
                    state: data.state,
                    // zipCode already mapped above
                    preferredContact: data.preferred_contact,
                    connectivity: data.connectivity_type, // map from snake_case
                    phases: data.phases || [] // Load phases
                });

            } catch (error) {
                console.error('Error fetching quote:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuote();
    }, [id, router]);

    const handleStatusChange = async (newStatus: QuoteStatus) => {
        if (!quote || updating) return;

        setUpdating(true);
        try {
            const updateData: any = {
                status: newStatus,
                reviewed_by: user?.email,
                reviewed_at: new Date().toISOString()
            };



            const { error } = await supabase
                .from('quotes')
                .update(updateData)
                .eq('id', quote.id);

            if (error) throw error;

            // Notify User if linked
            if (quote.user_id) {
                try {
                    await NotificationService.create({
                        user_id: quote.user_id,
                        type: 'info',
                        title: 'Quote Updated',
                        message: `Your quote status has been updated to ${newStatus.replace('_', ' ')}.`,
                        link: `/portal/customer/quotes/${quote.id}`
                    });
                } catch (err) {
                    console.error('Failed to notify user', err);
                }
            }

            // Update local state
            setQuote({
                ...quote,
                status: newStatus,
                reviewedBy: updateData.reviewed_by,
                reviewedAt: updateData.reviewed_at,
                paymentLink: updateData.payment_link || quote.paymentLink
            });

        } catch (error) {
            console.error('Error updating status:', error);
            showToast('Error updating status', 'error');
        } finally {
            setUpdating(false);
        }
    };

    const handleAddPhase = async () => {
        if (!newPhaseName || !newPhaseAmount) return;
        const amount = parseFloat(newPhaseAmount);
        if (isNaN(amount) || amount <= 0) {
            showToast('Invalid amount', 'error');
            return;
        }

        const newPhase = {
            id: crypto.randomUUID(),
            name: newPhaseName,
            amount: amount,
            status: 'pending'
        };

        const updatedPhases = [...(quote.phases || []), newPhase];

        // Optimistic update
        const oldPhases = quote.phases;
        setQuote({ ...quote, phases: updatedPhases });
        setNewPhaseName('');
        setNewPhaseAmount('');

        try {
            const { error } = await supabase
                .from('quotes')
                .update({ phases: updatedPhases })
                .eq('id', quote.id);

            if (error) throw error;
        } catch (error) {
            console.error('Error adding phase:', error);
            showToast('Error saving phase', 'error');
            setQuote({ ...quote, phases: oldPhases }); // Revert
        }
    };

    const handleDeletePhase = async (phaseId: string) => {
        const updatedPhases = quote.phases.filter((p: any) => p.id !== phaseId);

        // Optimistic update
        const oldPhases = quote.phases;
        setQuote({ ...quote, phases: updatedPhases });

        try {
            const { error } = await supabase
                .from('quotes')
                .update({ phases: updatedPhases })
                .eq('id', quote.id);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting phase:', error);
            showToast('Error deleting phase', 'error');
            setQuote({ ...quote, phases: oldPhases }); // Revert
        }
    };

    const isPhasesValid = () => {
        if (!quote || !quote.phases) return true;
        const totalPhases = quote.phases.reduce((sum: number, p: any) => sum + p.amount, 0);
        // Allow a small epsilon for float comparison or just check strict equality if integer
        // Just checking if total matches budget/amount might be strict, let's just warn visually
        return Math.abs(totalPhases - (quote.amount || 0)) < 0.01;
    };

    const handleCreateProject = async () => {
        if (!quote || updating) return;

        // Validation for Consulting/Advocacy: Must have phases if amount > 0
        const isConsultingOrAdvocacy = quote.service?.toLowerCase().includes('consulting') || quote.service?.toLowerCase().includes('advocacy');
        if (isConsultingOrAdvocacy && quote.amount > 0 && (!quote.phases || quote.phases.length === 0)) {
            showToast(language === 'es' ? 'Debe definir las fases de pago primero' : 'Must define payment phases first', 'warning');
            return;
        }

        setUpdating(true);
        try {
            const projectData = {
                userId: quote.user_id || user?.id,
                quoteId: quote.id,
                service: quote.service,
                clientName: quote.fullName || quote.clientName,
                clientEmail: quote.email || quote.clientEmail,
                clientPhone: quote.phone || quote.clientPhone,
                clientCompany: quote.company || quote.clientCompany,
                address: quote.address, // Correct field name is 'address' in ActiveProject
                description: quote.description || quote.message,
                amount: quote.amount,
                projectName: `${quote.fullName || 'Client'} - ${quote.service}`,
                status: 'pending_planning', // Initial status for consulting/advocacy
                paymentStatus: 'pending',
                progress: 0,

                // New Service Fields
                propertyType: quote.propertyType,
                propertySize: quote.propertySize,
                deviceOption: quote.deviceMode,
                connectivityType: quote.connectivity,
                timeline: quote.timeline,
                budget: quote.budget,
                projectDescription: quote.projectDescription,
                city: quote.city,
                state: quote.state,
                zipCode: quote.zipCode,

                // Map phases
                phases: quote.phases || []
            };

            // @ts-ignore - Ignore strict type check if partial match issue persists
            const projectId = await ActiveProjectService.create(projectData);

            // Update quote to link to project (Supabase)
            const { error } = await supabase
                .from('quotes')
                .update({
                    linked_project_id: projectId,
                    status: 'approved'
                })
                .eq('id', quote.id);

            if (error) throw error;

            setQuote({
                ...quote,
                linkedProjectId: projectId,
                status: 'approved'
            });

            // --- AUTO ONBOARDING SEQUENCE ---
            try {
                // 1. Create Magic Link
                const linkResponse = await fetch('/api/create-magic-link', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: quote.email,
                        fullName: quote.fullName || quote.clientName,
                        phone: quote.phone,
                        company: quote.company || '',
                        quoteId: quote.id,
                        service: quote.service
                    })
                });

                if (linkResponse.ok) {
                    const { magicLink } = await linkResponse.json();

                    // 2. Send Onboarding Email
                    await fetch('/api/send-onboarding-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            to: quote.email,
                            fullName: quote.fullName || quote.clientName,
                            magicLink,
                            service: quote.service,
                            language
                        })
                    });
                    showToast(language === 'es' ? 'Proyecto creado y onboarding enviado' : 'Project created & onboarding sent', 'success');
                } else {
                    console.error('Failed to create magic link during project creation');
                    showToast('Project created, but onboarding failed', 'warning');
                }
            } catch (onboardingError) {
                console.error('Error in auto-onboarding:', onboardingError);
                showToast('Project created, error sending email', 'warning');
            }

            // Redirect to new project
            setTimeout(() => {
                router.push(`/portal/admin/active-projects/${projectId}`);
            }, 1000);

        } catch (error) {
            console.error('Error creating project:', error);
            showToast('Error creating project', 'error');
        } finally {
            setUpdating(false);
        }
    };

    const handleRejectQuote = async () => {
        // Validation moved to modal confirmation
        setShowRejectModal(true);
    };

    const confirmRejectQuote = async () => {
        setUpdating(true);
        try {
            // Update status
            const { error } = await supabase
                .from('quotes')
                .update({
                    status: 'rejected',
                    reviewed_by: user?.email,
                    reviewed_at: new Date().toISOString()
                })
                .eq('id', quote.id);

            if (error) throw error;

            // Notify User
            if (quote.user_id) {
                try {
                    await NotificationService.create({
                        user_id: quote.user_id,
                        type: 'error',
                        title: 'Quote Rejected',
                        message: `Your quote request has been rejected. Please check your email for details.`,
                        link: `/portal/customer/quotes/${quote.id}`
                    });
                } catch (err) {
                    console.error('Failed to notify user', err);
                }
            }

            // Send Rejection Email
            if (quote.user_id) {
                await EmailService.sendWithPreferenceCheck(
                    quote.user_id,
                    'error',
                    {
                        to: quote.email,
                        subject: language === 'es' ? 'Actualización sobre su solicitud - TeraVolta' : 'Update regarding your request - TeraVolta',
                        html: language === 'es' ? `
                        <h1>Actualización de su Solicitud</h1>
                        <p>Estimado/a ${quote.fullName || 'Cliente'},</p>
                        <p>Gracias por su interés en nuestros servicios.</p>
                        <p>Después de revisar su solicitud, lamentamos informarle que no podemos proceder con este proyecto en este momento.</p>
                        <p>Si tiene alguna pregunta, por favor contáctenos.</p>
                        <p>Saludos,<br>Equipo TeraVolta</p>
                    ` : `
                        <h1>Request Update</h1>
                        <p>Dear ${quote.fullName || 'Client'},</p>
                        <p>Thank you for your interest in our services.</p>
                        <p>After reviewing your request, we regret to inform you that we cannot proceed with this project at this time.</p>
                        <p>If you have any questions, please contact us.</p>
                        <p>Best regards,<br>TeraVolta Team</p>
                    `
                    }
                );
            } else {
                // Guest User - Send directly
                await EmailService.send({
                    to: quote.email,
                    subject: language === 'es' ? 'Actualización sobre su solicitud - TeraVolta' : 'Update regarding your request - TeraVolta',
                    html: language === 'es' ? `
                        <h1>Actualización de su Solicitud</h1>
                        <p>Estimado/a ${quote.fullName || 'Cliente'},</p>
                        <p>Gracias por su interés en nuestros servicios.</p>
                        <p>Después de revisar su solicitud, lamentamos informarle que no podemos proceder con este proyecto en este momento.</p>
                        <p>Si tiene alguna pregunta, por favor contáctenos.</p>
                        <p>Saludos,<br>Equipo TeraVolta</p>
                    ` : `
                        <h1>Request Update</h1>
                        <p>Dear ${quote.fullName || 'Client'},</p>
                        <p>Thank you for your interest in our services.</p>
                        <p>After reviewing your request, we regret to inform you that we cannot proceed with this project at this time.</p>
                        <p>If you have any questions, please contact us.</p>
                        <p>Best regards,<br>TeraVolta Team</p>
                    `
                });
            }

            setQuote({ ...quote, status: 'rejected' });
            showToast(language === 'es' ? 'Quote rechazado y cliente notificado' : 'Quote rejected and client notified', 'success');
        } catch (error) {
            console.error('Error rejecting quote:', error);
            showToast('Error rejecting quote', 'error');
        } finally {
            setUpdating(false);
        }
    };

    const handleAcceptAndOnboard = async () => {
        if (!quote || sendingOnboarding) return;
        setSendingOnboarding(true);
        try {
            // 1. Create magic link (API uses Supabase)
            const linkResponse = await fetch('/api/create-magic-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: quote.email,
                    fullName: quote.fullName || quote.clientName,
                    phone: quote.phone,
                    company: quote.company || '',
                    quoteId: quote.id,
                    service: quote.service
                })
            });

            if (!linkResponse.ok) throw new Error('Failed to create magic link');
            const { magicLink } = await linkResponse.json();

            // 2. Send onboarding email
            const emailResponse = await fetch('/api/send-onboarding-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: quote.email,
                    fullName: quote.fullName || quote.clientName,
                    magicLink,
                    service: quote.service,
                    language
                })
            });

            if (!emailResponse.ok) throw new Error('Failed to send email');

            // 3. Update quote status to approved/paid if not already
            await handleStatusChange('converted');

            showToast(language === 'es' ? 'Onboarding enviado exitosamente' : 'Onboarding sent successfully', 'success');
        } catch (error) {
            console.error('Error sending onboarding:', error);
            showToast(language === 'es' ? 'Error al enviar onboarding' : 'Error sending onboarding', 'error');
        } finally {
            setSendingOnboarding(false);
        }
    };

    const [isEditingAmount, setIsEditingAmount] = useState(false);
    const [editedAmount, setEditedAmount] = useState('');
    const [isEditingProjDesc, setIsEditingProjDesc] = useState(false);
    const [editedProjDesc, setEditedProjDesc] = useState('');

    useEffect(() => {
        if (quote?.amount) {
            setEditedAmount(quote.amount.toString());
        }
        if (quote?.projectDescription) {
            setEditedProjDesc(quote.projectDescription);
        }
    }, [quote?.amount, quote?.projectDescription]);

    const handleSaveProjDesc = async () => {
        try {
            const { error } = await supabase
                .from('quotes')
                .update({ project_description: editedProjDesc })
                .eq('id', quote.id);

            if (error) throw error;

            setQuote({ ...quote, projectDescription: editedProjDesc });
            setIsEditingProjDesc(false);
            showToast('Project description updated', 'success');
        } catch (error) {
            console.error('Error updating project description:', error);
            showToast('Error updating description', 'error');
        }
    };

    useEffect(() => {
        if (quote?.amount) {
            setEditedAmount(quote.amount.toString());
        }
    }, [quote?.amount]);

    const handleSaveAmount = async () => {
        if (!editedAmount) return;
        const newAmount = parseFloat(editedAmount);
        if (isNaN(newAmount) || newAmount < 0) {
            showToast('Invalid amount', 'error');
            return;
        }

        try {
            const { error } = await supabase
                .from('quotes')
                .update({ amount: newAmount })
                .eq('id', quote.id);

            if (error) throw error;

            setQuote({ ...quote, amount: newAmount });
            setIsEditingAmount(false);
            showToast('Amount updated', 'success');
        } catch (error) {
            console.error('Error updating amount:', error);
            showToast('Error updating amount', 'error');
        }
    };

    const handleMarkAsReviewed = async () => {
        setUpdating(true);
        try {
            // Update status
            const { error } = await supabase
                .from('quotes')
                .update({
                    status: 'reviewed',
                    reviewed_by: user?.email,
                    reviewed_at: new Date().toISOString()
                })
                .eq('id', quote.id);

            if (error) throw error;

            // Notify User
            if (quote.user_id) {
                try {
                    await NotificationService.create({
                        user_id: quote.user_id,
                        type: 'info',
                        title: 'Quote In Review',
                        message: `Your quote is now being reviewed by our team.`,
                        link: `/portal/customer/quotes/${quote.id}`
                    });
                } catch (err) {
                    console.error('Failed to notify user', err);
                }
            }

            // Send "In Review" Email
            const emailData = {
                to: quote.email,
                subject: language === 'es' ? 'Su solicitud está en revisión - TeraVolta' : 'Your request is being reviewed - TeraVolta',
                html: language === 'es' ? `
                        <h1>Actualización de su Solicitud</h1>
                        <p>Estimado/a ${quote.fullName || 'Cliente'},</p>
                        <p>Hemos recibido su solicitud y nuestro equipo técnico la está revisando en este momento.</p>
                        <p>Nos pondremos en contacto pronto con los siguientes pasos o si necesitamos información adicional.</p>
                        <p>Saludos,<br>Equipo TeraVolta</p>
                    ` : `
                        <h1>Request Update</h1>
                        <p>Dear ${quote.fullName || 'Client'},</p>
                        <p>We have received your request and our technical team is currently reviewing it.</p>
                        <p>We will be in touch shortly with next steps or if we need any additional information.</p>
                        <p>Best regards,<br>TeraVolta Team</p>
                    `
            };

            if (quote.user_id) {
                await EmailService.sendWithPreferenceCheck(quote.user_id, 'info', emailData);
            } else {
                await EmailService.send(emailData);
            }

            setQuote({ ...quote, status: 'reviewed' });
            showToast(language === 'es' ? 'Cliente notificado: En Revisión' : 'Client notified: In Review', 'success');
        } catch (error) {
            console.error('Error marking as reviewed:', error);
            showToast('Error updating status', 'error');
        } finally {
            setUpdating(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !quote) return;

        // Validate file type
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(file.type)) {
            showToast('Only PDF, Excel (.xlsx), and Word (.docx) files are allowed', 'warning');
            return;
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            showToast('File size must be less than 10MB', 'warning');
            return;
        }

        setUploading(true);
        try {
            // Upload to Supabase Storage
            const result = await uploadDocument({
                file,
                entityType: 'quotes',
                entityId: quote.id,
                uploadedBy: user?.email || 'admin',
                category: 'other' // 'document' is invalid, mapped to 'other'
            });

            if (!result.success || !result.document) {
                throw new Error(result.error);
            }

            const newDoc = {
                name: result.document.name,
                url: result.document.downloadURL,
                type: result.document.contentType,
                uploadedAt: new Date().toISOString(),
                uploadedBy: user?.email
            };

            const documents = quote.documents || [];
            documents.push(newDoc);

            const { error } = await supabase
                .from('quotes')
                .update({ documents: documents })
                .eq('id', quote.id);

            if (error) throw error;

            setQuote({ ...quote, documents });
        } catch (error) {
            console.error('Error uploading file:', error);
            showToast('Error uploading file', 'error');
        } finally {
            setUploading(false);
        }
    };

    const content = {
        en: {
            backToQuotes: 'Back to Quotes',
            quoteDetails: 'Quote Details',
            clientInformation: 'Client Information',
            name: 'Name',
            email: 'Email',
            phone: 'Phone',
            service: 'Service',
            address: 'Address',
            city: 'City',
            state: 'State/Province',
            zipCode: 'Zip Code',
            timeline: 'Timeline',
            budget: 'Budget',
            projectDescription: 'Project Description',
            propertyType: 'Property Type',
            propertySize: 'Size',
            deviceOption: 'Device Option',
            connectivity: 'Connectivity',
            preferredContact: 'Preferred Contact',
            quoteInformation: 'Quote Information',
            amount: 'Amount',
            description: 'Description',
            status: 'Status',
            createdDate: 'Created Date',
            reviewedBy: 'Reviewed By',
            reviewedDate: 'Reviewed Date',
            actions: 'Actions',
            approveQuote: 'Approve Quote',
            rejectQuote: 'Reject Quote',
            markAsPaid: 'Mark as Paid',
            createProject: 'Create Project',
            paymentLink: 'Payment Link',
            copyLink: 'Copy Link',
            documentHub: 'Document Hub',
            uploadDocument: 'Upload Document',
            noDocuments: 'No documents uploaded',
            allowedFiles: 'Allowed: PDF, Excel (.xlsx), Word (.docx)',
            statusPendingReview: 'Pending Review',
            statusInReview: 'In Review (Notified)',
            viewed: 'Viewed by Client',
            markInReview: 'Notify: In Review',
            statusApproved: 'Approved - Pending Payment',
            statusPaid: 'Paid',
            statusRejected: 'Rejected',
            statusCancelled: 'Cancelled',
            autoApproveNote: 'Auto-approve enabled for Energy Efficiency',
            generatingLink: 'Generating payment link...',
            linkGenerated: 'Payment link generated',
            updating: 'Updating...',
            acceptAndOnboard: 'Accept & Send Onboarding',
            onboardingSent: 'Onboarding sent!',
            onboardingError: 'Error sending onboarding',
            clientBills: 'Client Bills',
            noBills: 'No bills uploaded by client',
            billsNote: 'Bills uploaded during quote submission',
            paymentPhases: 'Payment Phases',
            phaseName: 'Phase Name',
            phaseAmount: 'Amount',
            addPhase: 'Add Phase',
            totalPhases: 'Total Phases',
            quoteTotal: 'Quote Total',
            amountMismatch: 'Total mismatch with Quote Amount'
        },
        es: {
            backToQuotes: 'Volver a Cotizaciones',
            quoteDetails: 'Detalles de Cotización',
            clientInformation: 'Información del Cliente',
            name: 'Nombre',
            email: 'Correo',
            phone: 'Teléfono',
            address: 'Dirección',
            city: 'Ciudad',
            state: 'Estado/Provincia',
            zipCode: 'Zip Code',
            service: 'Servicio',
            timeline: 'Tiempo Estimado',
            budget: 'Presupuesto',
            projectDescription: 'Descripción del Proyecto',
            propertyType: 'Tipo de Propiedad',
            propertySize: 'Tamaño',
            deviceOption: 'Opción de Equipo',
            connectivity: 'Conectividad',
            preferredContact: 'Contacto Preferido',
            quoteInformation: 'Información de Cotización',
            amount: 'Monto',
            description: 'Descripción',
            status: 'Estado',
            createdDate: 'Fecha de Creación',
            reviewedBy: 'Revisado Por',
            reviewedDate: 'Fecha de Revisión',
            actions: 'Acciones',
            approveQuote: 'Aprobar Cotización',
            rejectQuote: 'Rechazar Cotización',
            markAsPaid: 'Marcar como Pagado',
            createProject: 'Crear Proyecto',
            paymentLink: 'Link de Pago',
            copyLink: 'Copiar Link',
            documentHub: 'Centro de Documentos',
            uploadDocument: 'Subir Documento',
            noDocuments: 'No hay documentos subidos',
            allowedFiles: 'Permitidos: PDF, Excel (.xlsx), Word (.docx)',
            statusPendingReview: 'Pendiente de Revisión',
            statusInReview: 'En Revisión (Notificado)',
            viewed: 'Visto por Cliente',
            markInReview: 'Notificar: En Revisión',
            statusApproved: 'Aprobado - Pendiente de Pago',
            statusPaid: 'Pagado',
            statusRejected: 'Rechazado',
            statusCancelled: 'Cancelado',
            autoApproveNote: 'Auto-aprobación activada para Eficiencia Energética',
            generatingLink: 'Generando link de pago...',
            linkGenerated: 'Link de pago generado',
            updating: 'Actualizando...',
            acceptAndOnboard: 'Aceptar y Enviar Onboarding',
            onboardingSent: '¡Onboarding enviado!',
            onboardingError: 'Error al enviar onboarding',
            clientBills: 'Facturas del Cliente',
            noBills: 'El cliente no subió facturas',
            billsNote: 'Facturas subidas durante la solicitud de cotización',
            paymentPhases: 'Fases de Pago',
            phaseName: 'Nombre de Fase',
            phaseAmount: 'Monto',
            addPhase: 'Agregar Fase',
            totalPhases: 'Total Fases',
            quoteTotal: 'Total Cotización',
            amountMismatch: 'El total no coincide con el monto de la cotización'
        }
    };

    type QuoteStatus = 'pending' | 'reviewed' | 'converted' | 'approved' | 'paid' | 'rejected' | 'cancelled';

    const t = content[language as 'en' | 'es'];

    const getStatusBadge = (status: QuoteStatus) => {
        const badges = {
            pending: <span className="px-4 py-2 text-sm rounded-full bg-yellow-100 text-yellow-800 font-medium">{t.statusPendingReview}</span>,
            reviewed: <span className="px-4 py-2 text-sm rounded-full bg-blue-100 text-blue-800 font-medium">{t.statusInReview}</span>,
            viewed: <span className="px-4 py-2 text-sm rounded-full bg-purple-100 text-purple-800 font-medium">{t.viewed}</span>,
            approved: <span className="px-4 py-2 text-sm rounded-full bg-green-100 text-green-800 font-medium">{t.statusApproved}</span>,
            paid: <span className="px-4 py-2 text-sm rounded-full bg-green-600 text-white font-medium">{t.statusPaid}</span>,
            rejected: <span className="px-4 py-2 text-sm rounded-full bg-red-100 text-red-800 font-medium">{t.statusRejected}</span>,
            cancelled: <span className="px-4 py-2 text-sm rounded-full bg-gray-100 text-gray-800 font-medium">{t.statusCancelled}</span>,
            // Backwards compatibility just in case
            pending_review: <span className="px-4 py-2 text-sm rounded-full bg-yellow-100 text-yellow-800 font-medium">{t.statusPendingReview}</span>,
            in_review: <span className="px-4 py-2 text-sm rounded-full bg-blue-100 text-blue-800 font-medium">{t.statusInReview}</span>,
            converted: <span className="px-4 py-2 text-sm rounded-full bg-purple-100 text-purple-800 font-medium">Converted</span>
        };
        // @ts-ignore
        return badges[status] || badges.pending;
    };

    if (loading) {
        return <PageLoadingSkeleton title={t.quoteDetails} />;
    }

    if (!quote) return null;

    const isEnergyEfficiency = quote.service?.toLowerCase().includes('efficiency') || quote.service?.toLowerCase().includes('eficiencia');
    const isConsultingOrAdvocacy = quote.service?.toLowerCase().includes('consulting') || quote.service?.toLowerCase().includes('advocacy') || quote.service?.toLowerCase().includes('consultoría') || quote.service?.toLowerCase().includes('abogacía');

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {/* Header */}
            <div>
                <button
                    onClick={() => router.push('/portal/admin/quotes')}
                    className="text-[#004a90] hover:text-[#c3d021] mb-2 flex items-center text-sm"
                >
                    <i className="ri-arrow-left-line mr-1"></i>
                    {t.backToQuotes}
                </button>
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-[#004a90]">{t.quoteDetails}</h1>
                    {getStatusBadge(quote.status)}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Client Info */}
                <div className="space-y-6">
                    {/* Client Information */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-[#004a90] mb-4">{t.clientInformation}</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase">{t.name}</label>
                                <p className="text-base font-medium text-gray-900">{quote.fullName || quote.clientName}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase">{t.email}</label>
                                <p className="text-base text-gray-900">{quote.email}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase">{t.phone}</label>
                                <p className="text-base text-gray-900">{quote.phone}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase">{t.service}</label>
                                <p className="mt-1">
                                    <span className="inline-flex px-3 py-1 rounded-full text-sm bg-[#c3d021]/20 text-[#194271] font-medium">
                                        {quote.service}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Service Specific Details */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-[#004a90] mb-4">
                            {isEnergyEfficiency ? (language === 'es' ? 'Detalles de Eficiencia' : 'Efficiency Details') : (language === 'es' ? 'Detalles del Proyecto' : 'Project Details')}
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {quote.propertyType && (
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">{t.propertyType}</label>
                                    <p className="text-base text-gray-900">{quote.propertyType}</p>
                                </div>
                            )}
                            {quote.propertySize && (
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">{t.propertySize}</label>
                                    <p className="text-base text-gray-900">{quote.propertySize}</p>
                                </div>
                            )}
                            {quote.timeline && (
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">{t.timeline}</label>
                                    <p className="text-base text-gray-900">{quote.timeline}</p>
                                </div>
                            )}
                            {quote.budget && (
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">{t.budget}</label>
                                    <p className="text-base text-gray-900">{quote.budget}</p>
                                </div>
                            )}

                            {/* Address Details */}
                            {quote.city && (
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">{t.city}</label>
                                    <p className="text-base text-gray-900">{quote.city}</p>
                                </div>
                            )}
                            {quote.state && (
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">{t.state}</label>
                                    <p className="text-base text-gray-900">{quote.state}</p>
                                </div>
                            )}

                            {/* Efficiency Specifics */}
                            {quote.deviceMode && (
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">{t.deviceOption}</label>
                                    <p className="text-base text-gray-900 capitalize">{quote.deviceMode}</p>
                                </div>
                            )}
                            {quote.connectivity && (
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">{t.connectivity}</label>
                                    <p className="text-base text-gray-900 uppercase">{quote.connectivity}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Auto-approve Note */}
                    {isEnergyEfficiency && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex items-start gap-2">
                                <i className="ri-information-line text-blue-600 text-xl"></i>
                                <div>
                                    <p className="text-sm text-blue-800 font-medium">{t.autoApproveNote}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Quote Details & Actions */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Quote Information */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-lg font-bold text-[#004a90]">{t.quoteInformation}</h2>
                            <span className="text-sm font-medium text-gray-400">ID: {quote.id.slice(0, 8)}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                    {t.amount}
                                    {!isEditingAmount && (
                                        <button
                                            onClick={() => setIsEditingAmount(true)}
                                            className="text-xs text-[#004a90] hover:underline"
                                        >
                                            (Edit)
                                        </button>
                                    )}
                                </label>
                                {isEditingAmount ? (
                                    <div className="flex items-center gap-2 mt-1">
                                        <input
                                            type="number"
                                            value={editedAmount}
                                            onChange={(e) => setEditedAmount(e.target.value)}
                                            className="w-32 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#004a90]"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleSaveAmount();
                                                if (e.key === 'Escape') setIsEditingAmount(false);
                                            }}
                                        />
                                        <button
                                            onClick={handleSaveAmount}
                                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                                        >
                                            <i className="ri-check-line"></i>
                                        </button>
                                        <button
                                            onClick={() => setIsEditingAmount(false)}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                        >
                                            <i className="ri-close-line"></i>
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-2xl font-bold text-[#004a90] mt-1">
                                        {quote.amount ? `$${quote.amount.toLocaleString()}` : '-'}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">{t.createdDate}</label>
                                <p className="text-base text-gray-900 mt-1">
                                    {quote.createdAt ? new Date(quote.createdAt).toLocaleString(language === 'es' ? 'es-PA' : 'en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : '-'}
                                </p>
                            </div>
                            {quote.reviewedBy && (
                                <>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">{t.reviewedBy}</label>
                                        <p className="text-base text-gray-900 mt-1">{quote.reviewedBy}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">{t.reviewedDate}</label>
                                        <p className="text-base text-gray-900 mt-1">
                                            {quote.reviewedAt ? new Date(quote.reviewedAt).toLocaleString(language === 'es' ? 'es-PA' : 'en-US') : '-'}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        {quote.description && (
                            <div className="mt-4">
                                <label className="text-sm font-medium text-gray-600">{t.description}</label>
                                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-gray-900 whitespace-pre-wrap">{quote.description}</p>
                                </div>
                            </div>
                        )}

                        {/* Project Description (Editable) */}
                        <div className="mt-4">
                            <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                {t.projectDescription}
                                {!isEditingProjDesc && (
                                    <button
                                        onClick={() => setIsEditingProjDesc(true)}
                                        className="text-xs text-[#004a90] hover:underline"
                                    >
                                        (Edit)
                                    </button>
                                )}
                            </label>

                            {isEditingProjDesc ? (
                                <div className="mt-2">
                                    <textarea
                                        value={editedProjDesc}
                                        onChange={(e) => setEditedProjDesc(e.target.value)}
                                        className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004a90] text-sm text-gray-900"
                                        placeholder="Enter project description..."
                                    />
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button
                                            onClick={() => setIsEditingProjDesc(false)}
                                            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveProjDesc}
                                            className="px-3 py-1.5 text-sm bg-[#004a90] text-white rounded hover:bg-[#194271]"
                                        >
                                            Save Description
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                quote.projectDescription && (
                                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                        <p className="text-gray-900 whitespace-pre-wrap">{quote.projectDescription}</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* Phases Management (Consulting/Advocacy) */}
                    {isConsultingOrAdvocacy && quote.status !== 'cancelled' && ( // Allow adding phases even if paid/approved if we want to track them
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-[#004a90] mb-4 flex items-center gap-2">
                                <i className="ri-stack-line"></i>
                                {t.paymentPhases}
                            </h2>

                            <div className="space-y-4">
                                {/* Existings Phases */}
                                {quote.phases && quote.phases.length > 0 ? (
                                    <div className="border rounded-lg overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50 border-b">
                                                <tr>
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-600">{t.phaseName}</th>
                                                    <th className="px-4 py-3 text-right font-semibold text-gray-600">{t.phaseAmount}</th>
                                                    <th className="px-4 py-3 w-16"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {quote.phases.map((phase: any) => (
                                                    <tr key={phase.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-gray-900">{phase.name}</td>
                                                        <td className="px-4 py-3 text-right font-medium text-gray-900">${phase.amount.toLocaleString()}</td>
                                                        <td className="px-4 py-3 text-right">
                                                            {quote.status !== 'paid' && quote.status !== 'cancelled' && (
                                                                <button
                                                                    onClick={() => handleDeletePhase(phase.id)}
                                                                    className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                                                                >
                                                                    <i className="ri-delete-bin-line"></i>
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr className="bg-gray-50 font-bold border-t">
                                                    <td className="px-4 py-3 text-right">{t.totalPhases}:</td>
                                                    <td className={`px-4 py-3 text-right ${!isPhasesValid() ? 'text-red-600' : 'text-green-700'}`}>
                                                        ${quote.phases.reduce((acc: number, cur: any) => acc + cur.amount, 0).toLocaleString()}
                                                    </td>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                        <p className="text-gray-500 mb-2">{language === 'es' ? 'No hay fases definidas.' : 'No phases defined.'}</p>
                                    </div>
                                )}

                                {/* Validation Message */}
                                {!isPhasesValid() && (
                                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm font-medium">
                                        <i className="ri-alert-line"></i>
                                        {t.amountMismatch} (${quote.amount?.toLocaleString()})
                                    </div>
                                )}

                                {/* Add Phase Form */}
                                {quote.status !== 'paid' && quote.status !== 'cancelled' && (
                                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t items-end">
                                        <div className="w-full">
                                            <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">{t.phaseName}</label>
                                            <input
                                                type="text"
                                                value={newPhaseName}
                                                onChange={(e) => setNewPhaseName(e.target.value)}
                                                placeholder={language === 'es' ? 'Ej: Anticipo, Entrega final...' : 'Ex: Deposit, Final delivery...'}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004a90]"
                                            />
                                        </div>
                                        <div className="w-full sm:w-40">
                                            <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">{t.phaseAmount}</label>
                                            <input
                                                type="number"
                                                value={newPhaseAmount}
                                                onChange={(e) => setNewPhaseAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004a90]"
                                            />
                                        </div>
                                        <button
                                            onClick={handleAddPhase}
                                            disabled={!newPhaseName || !newPhaseAmount}
                                            className="px-4 py-2 bg-[#004a90] text-white rounded-lg hover:bg-[#194271] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap font-medium h-[42px]"
                                        >
                                            <i className="ri-add-line mr-1"></i>
                                            {t.addPhase}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    {quote.status !== 'paid' && quote.status !== 'cancelled' && (
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-[#004a90] mb-4">{t.actions}</h2>
                            <div className="flex flex-wrap gap-3">
                                {(quote.status === 'pending' || quote.status === 'pending_review' || quote.status === 'reviewed' || quote.status === 'in_review' || quote.status === 'viewed') && (
                                    <>
                                        {(quote.status !== 'reviewed' && quote.status !== 'in_review') && (
                                            <button
                                                onClick={handleMarkAsReviewed}
                                                disabled={updating}
                                                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                                            >
                                                <i className="ri-eye-line"></i>
                                                {updating ? t.updating : (t.markInReview || 'Notify: In Review')}
                                            </button>
                                        )}
                                        <button
                                            onClick={handleAcceptAndOnboard}
                                            disabled={sendingOnboarding || updating}
                                            className="flex items-center gap-2 px-6 py-3 bg-[#004a90] hover:bg-[#194271] text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                                        >
                                            <i className="ri-user-add-line"></i>
                                            {sendingOnboarding ? (language === 'es' ? 'Enviando...' : 'Sending...') : t.acceptAndOnboard}
                                        </button>
                                        <button
                                            onClick={handleRejectQuote}
                                            disabled={updating}
                                            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                                        >
                                            <i className="ri-close-circle-line"></i>
                                            {t.rejectQuote}
                                        </button>
                                    </>
                                )}
                                {(quote.status === 'approved' || quote.status === 'paid') && (
                                    <>
                                        {quote.status === 'approved' && isEnergyEfficiency && ( /* Only mark paid for efficiency here freely? Or all? Let's leave for all */
                                            <button
                                                onClick={() => handleStatusChange('paid')}
                                                disabled={updating}
                                                className="flex items-center gap-2 px-6 py-3 bg-[#004a90] hover:bg-[#194271] text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                                            >
                                                <i className="ri-money-dollar-circle-line"></i>
                                                {updating ? t.updating : t.markAsPaid}
                                            </button>
                                        )}
                                        <button
                                            onClick={handleCreateProject}
                                            disabled={updating}
                                            className="flex items-center gap-2 px-6 py-3 bg-[#c3d021] hover:bg-[#a5b01c] text-[#194271] rounded-lg transition-colors font-medium disabled:opacity-50"
                                        >
                                            <i className="ri-briefcase-line"></i>
                                            {updating ? t.updating : t.createProject}
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Payment Link */}
                            {quote.status === 'approved' && quote.paymentLink && (
                                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <label className="text-sm font-medium text-green-800 block mb-2">{t.paymentLink}</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={quote.paymentLink}
                                            readOnly
                                            className="flex-1 px-3 py-2 bg-white border border-green-300 rounded-lg text-sm"
                                        />
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(quote.paymentLink);
                                                showToast('Link copied to clipboard!', 'success');
                                            }}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                                        >
                                            {t.copyLink}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Client Bills - Uploaded during quote submission */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-[#004a90] mb-2">{t.clientBills}</h2>
                        <p className="text-xs text-gray-500 mb-4">{t.billsNote}</p>

                        {quote.bills && quote.bills.length > 0 ? (
                            <div className="space-y-2">
                                {quote.bills.map((bill: any, index: number) => {
                                    // Determine icon based on content type
                                    const getFileIcon = (contentType: string, name: string) => {
                                        if (contentType?.includes('pdf') || name?.endsWith('.pdf')) return 'ri-file-pdf-line text-red-500';
                                        if (contentType?.includes('image') || name?.match(/\.(jpg|jpeg|png|gif)$/i)) return 'ri-image-line text-green-500';
                                        return 'ri-file-line text-[#004a90]';
                                    };

                                    return (
                                        <div key={index} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                                            <div className="flex items-center gap-3">
                                                <i className={`${getFileIcon(bill.type, bill.name)} text-2xl`}></i>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{bill.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {bill.uploadedAt ? new Date(bill.uploadedAt).toLocaleDateString() : ''}
                                                        {bill.size ? ` · ${(bill.size / 1024).toFixed(1)} KB` : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            <a
                                                href={bill.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 px-3 py-1 bg-[#004a90] hover:bg-[#194271] text-white rounded-lg text-sm font-medium transition-colors"
                                            >
                                                <i className="ri-download-line"></i>
                                                {language === 'es' ? 'Ver' : 'View'}
                                            </a>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <EmptyState
                                icon="ri-file-warning-line"
                                title={t.noBills}
                                variant="compact"
                            />
                        )}
                    </div>

                    {/* Document Hub */}
                    {/* Document Hub */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <DocumentManager
                            entityType="quotes"
                            entityId={quote.id}
                            title={t.documentHub}
                            allowedCategories={['quote', 'contract', 'site_plan', 'bill', 'other']}
                        />
                    </div>
                </div>
            </div>


            {/* Reject Confirmation Modal */}
            <ConfirmationModal
                isOpen={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                onConfirm={confirmRejectQuote}
                title={language === 'es' ? 'Rechazar Cotización' : 'Reject Quote'}
                message={language === 'es'
                    ? '¿Estás seguro de que deseas rechazar esta cotización? Esta acción notificará al cliente y no se puede deshacer.'
                    : 'Are you sure you want to reject this quote? This action will notify the client and cannot be undone.'}
                confirmText={language === 'es' ? 'Sí, Rechazar' : 'Yes, Reject'}
                cancelText={language === 'es' ? 'Cancelar' : 'Cancel'}
                variant="danger"
            />
        </div >
    );
}
