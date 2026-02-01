'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ElectricalBoard, SYSTEM_TYPES, EMPORIA_CLASSIFICATIONS, INCOMPATIBILITY_REASONS, CT_STATUSES, RECOMMENDED_SOLUTIONS } from '@/lib/types';
import { uploadDocument } from '@/lib/documentUtils';
import { useToast } from '@/components/ui/Toast';

interface BoardFormProps {
    appointmentId: string;
    board?: ElectricalBoard;
    onSave: () => void;
    onCancel: () => void;
}

export default function BoardForm({ appointmentId, board, onSave, onCancel }: BoardFormProps) {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<ElectricalBoard>>(board || {
        name: '',
        system_type: 'monophase_120_240',
        has_neutral: true,
        emporia_classification: 'standard',
        incompatibility_reason: undefined,
        ct_status: 'fits',
        ct_issue: '',
        recommended_solution: 'standard',
        observations: '',
        photos: []
    });

    const [uploading, setUploading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    // Auto-Classification Logic
    // Reacts to changes in technical details to suggest classification
    useEffect(() => {
        setFormData(prev => {
            const next = { ...prev };
            let changed = false;

            // Rule 1: No Neutral = Incompatible
            if (next.has_neutral === false) {
                if (next.emporia_classification !== 'incompatible') {
                    next.emporia_classification = 'incompatible';
                    next.incompatibility_reason = 'no_neutral'; // Ensure this matches enum
                    // next.recommended_solution = 'void'; // Removed invalid type assignment
                    changed = true;
                }
            }

            // Rule 2: CT No Fit = Special CTs (unless already incompatible/void)
            // Note: 'void' logic removed, so just checking incompatible
            if (next.ct_status === 'no_fit' && next.emporia_classification !== 'incompatible') {
                if (next.recommended_solution !== 'special_cts') {
                    next.recommended_solution = 'special_cts';
                    changed = true;
                }
            }

            return changed ? next : prev;
        });
    }, [formData.has_neutral, formData.ct_status, formData.system_type]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);

        try {
            const newPhotos: string[] = [...(formData.photos || [])];
            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i];
                const result = await uploadDocument({
                    file,
                    entityType: 'technicians', // or 'boards' if we had strict folder
                    entityId: appointmentId,
                    uploadedBy: 'technician',
                    category: 'other' // Using 'other' for evidence
                });

                if (result.success && result.document) {
                    newPhotos.push(result.document.downloadURL);
                }
            }
            setFormData(prev => ({ ...prev, photos: newPhotos }));
            showToast('Photos uploaded successfully', 'success');
        } catch (error) {
            console.error(error);
            showToast('Error uploading photos', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (board?.id) {
                // Update
                const { error } = await supabase
                    .from('electrical_boards')
                    .update({
                        ...formData,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', board.id);
                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from('electrical_boards')
                    .insert({
                        ...formData,
                        appointment_id: appointmentId
                    });
                if (error) throw error;
            }
            showToast('Board saved successfully', 'success');
            onSave();
        } catch (error) {
            console.error(error);
            showToast('Error saving board', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-[#004a90] mb-4">{board ? 'Edit Board' : 'Add Electrical Board'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Board Name / Location</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" placeholder="e.g. Main Panel, Garage Subpanel" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">System Type</label>
                        <select name="system_type" value={formData.system_type} onChange={handleChange} className="w-full p-2 border rounded">
                            {SYSTEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center mt-6">
                        <input type="checkbox" name="has_neutral" checked={formData.has_neutral} onChange={handleCheckboxChange} className="w-5 h-5 text-[#004a90]" />
                        <label className="ml-2 text-sm font-medium text-gray-700">Has Neutral?</label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Emporia Classification</label>
                        <select name="emporia_classification" value={formData.emporia_classification} onChange={handleChange} className="w-full p-2 border rounded">
                            {EMPORIA_CLASSIFICATIONS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    {formData.emporia_classification === 'incompatible' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Incompatibility Reason</label>
                            <select name="incompatibility_reason" value={formData.incompatibility_reason} onChange={handleChange} className="w-full p-2 border rounded">
                                <option value="">Select Reason</option>
                                {INCOMPATIBILITY_REASONS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">CT Status</label>
                        <select name="ct_status" value={formData.ct_status} onChange={handleChange} className="w-full p-2 border rounded">
                            {CT_STATUSES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    {formData.ct_status === 'no_fit' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">CT Issue Detail</label>
                            <input type="text" name="ct_issue" value={formData.ct_issue} onChange={handleChange} className="w-full p-2 border rounded" placeholder="e.g. Busbars too wide" />
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Recommended Solution</label>
                    <select name="recommended_solution" value={formData.recommended_solution} onChange={handleChange} className="w-full p-2 border rounded">
                        {RECOMMENDED_SOLUTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Observations</label>
                    <textarea name="observations" value={formData.observations} onChange={handleChange} className="w-full p-2 border rounded" rows={3}></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Photos</label>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                        {formData.photos?.map((url, idx) => (
                            <a key={idx} href={url} target="_blank" rel="noreferrer" className="block relative aspect-square border rounded overflow-hidden">
                                <img src={url} alt="Board" className="object-cover w-full h-full" />
                            </a>
                        ))}
                    </div>
                    <input type="file" multiple accept="image/*" onChange={handleFileUpload} disabled={uploading} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#004a90] file:text-white hover:file:bg-[#003270]" />
                    {uploading && <p className="text-sm text-blue-500 mt-1">Uploading...</p>}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onCancel} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">Cancel</button>
                    <button type="submit" disabled={loading || uploading} className="px-4 py-2 bg-[#004a90] text-white rounded hover:bg-[#003270] disabled:opacity-50">Save Board</button>
                </div>
            </form>
        </div>
    );
}
