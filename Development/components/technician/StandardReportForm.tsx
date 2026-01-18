'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadDocument } from '@/lib/documentUtils';
import { useToast } from '@/components/ui/Toast';

interface StandardReportFormProps {
    appointmentId: string;
    onComplete?: () => void;
}

export default function StandardReportForm({ appointmentId, onComplete }: StandardReportFormProps) {
    const { showToast } = useToast();
    const [uploading, setUploading] = useState(false);
    const [notes, setNotes] = useState('');
    // Assuming we might fetch existing evidence, but for MVP just upload new
    // In a real app we'd fetch current appointment's photos to display

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);

        try {
            const uploadedUrls: string[] = [];
            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i];
                const result = await uploadDocument({
                    file,
                    entityType: 'technicians',
                    entityId: appointmentId,
                    uploadedBy: 'technician',
                    category: 'report'
                });

                if (result.success && result.document) {
                    uploadedUrls.push(result.document.downloadURL);
                }
            }

            // Update Appointment with new photos (append)
            // Note: This requires the appointment row to have a 'photos' column or similar
            // The architecture says 'evidence' is documents.
            // For now, we just upload them. Later we might link them better.
            // But let's assume we update the 'notes' or just leave the documents linked via entityId.

            showToast('Evidence uploaded successfully', 'success');
        } catch (error) {
            console.error(error);
            showToast('Error uploading evidence', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleSaveNotes = async () => {
        if (!notes) return;
        try {
            const { error } = await supabase.from('appointments').update({
                notes: notes // Assuming 'notes' column exists
            }).eq('id', appointmentId);

            if (error) throw error;
            showToast('Notes saved', 'success');
        } catch (e) {
            console.error(e);
            showToast('Failed to save notes', 'error');
        }
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-[#004a90] mb-4">Inspection Report</h3>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Visit Notes</label>
                    <textarea
                        className="w-full p-3 border rounded-lg h-32"
                        placeholder="Describe observations, actions taken, or recommendations..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        onBlur={handleSaveNotes} // Auto-save on blur
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Evidence (Photos/Docs)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors relative">
                        <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            disabled={uploading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="pointer-events-none">
                            {uploading ? (
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004a90] mx-auto mb-2"></div>
                            ) : (
                                <i className="ri-upload-cloud-2-line text-4xl text-gray-400 mb-2"></i>
                            )}
                            <p className="text-gray-600 font-medium">{uploading ? 'Uploading...' : 'Click or Drag files to upload'}</p>
                            <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF supported</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
