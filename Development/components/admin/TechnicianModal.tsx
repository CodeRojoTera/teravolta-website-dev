'use strict';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { Technician } from '@/lib/types';

interface TechnicianModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<Technician>) => Promise<void>;
    technician?: Technician | null;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const TechnicianModal = ({ isOpen, onClose, onSave, technician }: TechnicianModalProps) => {
    const { language } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [specialtyInput, setSpecialtyInput] = useState('');

    // Initial State
    const [formData, setFormData] = useState<Partial<Technician>>({
        fullName: '',
        email: '',
        phone: '',
        specialties: [],
        active: true,
        workingHours: {
            start: '08:00',
            end: '17:00',
            days: [1, 2, 3, 4, 5]
        }
    });

    useEffect(() => {
        if (technician) {
            setFormData(technician);
        } else {
            // Reset for create mode
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                specialties: [],
                active: true,
                workingHours: {
                    start: '08:00',
                    end: '17:00',
                    days: [1, 2, 3, 4, 5]
                }
            });
        }
    }, [technician, isOpen]);

    if (!isOpen) return null;

    const t = {
        title: technician ? (language === 'es' ? 'Editar Técnico' : 'Edit Technician') : (language === 'es' ? 'Nuevo Técnico' : 'New Technician'),
        name: language === 'es' ? 'Nombre Completo' : 'Full Name',
        email: language === 'es' ? 'Correo Electrónico' : 'Email Address',
        phone: language === 'es' ? 'Teléfono' : 'Phone Number',
        specialties: language === 'es' ? 'Especialidades' : 'Specialties',
        add: language === 'es' ? 'Agregar' : 'Add',
        schedule: language === 'es' ? 'Horario Laboral' : 'Working Schedule',
        active: language === 'es' ? 'Activo' : 'Active',
        save: language === 'es' ? 'Guardar' : 'Save',
        saving: language === 'es' ? 'Guardando...' : 'Saving...',
        cancel: language === 'es' ? 'Cancelar' : 'Cancel'
    };

    const handleSave = async () => {
        if (!formData.fullName || !formData.email) return;
        setLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const addSpecialty = () => {
        if (!specialtyInput.trim()) return;
        setFormData({
            ...formData,
            specialties: [...(formData.specialties || []), specialtyInput.trim()]
        });
        setSpecialtyInput('');
    };

    const toggleDay = (dayIndex: number) => {
        const days = formData.workingHours?.days || [];
        const newDays = days.includes(dayIndex)
            ? days.filter(d => d !== dayIndex)
            : [...days, dayIndex].sort();

        setFormData({
            ...formData,
            workingHours: { ...formData.workingHours!, days: newDays }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#004a90] text-white rounded-t-2xl">
                    <h2 className="text-xl font-bold">{t.title}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                        <i className="ri-close-line text-2xl"></i>
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Basic Info */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.name}</label>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004a90]"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.email}</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                disabled={!!technician} // Cannot trigger invite again via edit
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004a90] disabled:bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.phone}</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004a90]"
                            />
                        </div>
                    </div>

                    {/* Specialties */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.specialties}</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={specialtyInput}
                                onChange={(e) => setSpecialtyInput(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004a90]"
                                placeholder="Solar, Electrical..."
                                onKeyDown={(e) => e.key === 'Enter' && addSpecialty()}
                            />
                            <button
                                onClick={addSpecialty}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
                            >
                                {t.add}
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.specialties?.map((spec, i) => (
                                <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">
                                    {spec}
                                    <button
                                        onClick={() => setFormData({ ...formData, specialties: formData.specialties?.filter(s => s !== spec) })}
                                        className="hover:text-red-500"
                                    >
                                        <i className="ri-close-line"></i>
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Schedule */}
                    <div className="border-t pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.schedule}</label>
                        <div className="flex gap-4 mb-3">
                            <div>
                                <label className="text-xs text-gray-500">Start</label>
                                <input
                                    type="time"
                                    value={formData.workingHours?.start}
                                    onChange={(e) => setFormData({ ...formData, workingHours: { ...formData.workingHours!, start: e.target.value } })}
                                    className="block w-full px-2 py-1 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">End</label>
                                <input
                                    type="time"
                                    value={formData.workingHours?.end}
                                    onChange={(e) => setFormData({ ...formData, workingHours: { ...formData.workingHours!, end: e.target.value } })}
                                    className="block w-full px-2 py-1 border border-gray-300 rounded"
                                />
                            </div>
                        </div>
                        <div className="flex gap-1 justify-between">
                            {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                                <button
                                    key={day}
                                    onClick={() => toggleDay(day)}
                                    className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${formData.workingHours?.days.includes(day)
                                            ? 'bg-[#004a90] text-white'
                                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                        }`}
                                >
                                    {language === 'es' ? DAYS_ES[day].charAt(0) : DAYS[day].charAt(0)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            checked={formData.active}
                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            className="w-4 h-4 text-[#004a90] rounded focus:ring-[#004a90]"
                        />
                        <label className="text-sm font-medium text-gray-700">{t.active}</label>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                    >
                        {t.cancel}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-2 bg-[#004a90] hover:bg-[#194271] text-white rounded-lg font-bold shadow-lg shadow-blue-900/20 disabled:opacity-50 transition-all transform hover:scale-105"
                    >
                        {loading ? t.saving : t.save}
                    </button>
                </div>
            </div>
        </div>
    );
};
