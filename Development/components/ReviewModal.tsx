'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => Promise<void>;
    isSubmitting: boolean;
}

export function ReviewModal({ isOpen, onClose, onSubmit, isSubmitting }: ReviewModalProps) {
    const { language } = useLanguage();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (rating === 0) return;
        await onSubmit(rating, comment);
    };

    const t = {
        title: language === 'es' ? 'Calificar Técnico' : 'Rate Technician',
        subtitle: language === 'es' ? '¿Cómo fue tu experiencia?' : 'How was your experience?',
        commentLabel: language === 'es' ? 'Comentario (Opcional)' : 'Comment (Optional)',
        cancel: language === 'es' ? 'Cancelar' : 'Cancel',
        submit: language === 'es' ? 'Enviar Calificación' : 'Submit Review',
        submitting: language === 'es' ? 'Enviando...' : 'Submitting...',
        selectRating: language === 'es' ? 'Por favor selecciona una calificación' : 'Please select a rating'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 text-center">
                    <h2 className="text-xl font-bold text-[#004a90]">{t.title}</h2>
                    <p className="text-gray-500 text-sm mt-1 mb-6">{t.subtitle}</p>

                    {/* Star Rating */}
                    <div className="flex justify-center gap-2 mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="transition-transform hover:scale-110 focus:outline-none"
                            >
                                <i
                                    className={`ri-star-fill text-4xl transition-colors ${star <= (hoverRating || rating) ? 'text-[#c3d021]' : 'text-gray-200'
                                        }`}
                                ></i>
                            </button>
                        ))}
                    </div>

                    {/* Comment Area */}
                    <div className="text-left mb-6">
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                            {t.commentLabel}
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#004a90] focus:border-transparent outline-none resize-none h-24 text-sm"
                            placeholder={language === 'es' ? 'Escribe aquí...' : 'Write here...'}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 py-2.5 text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            {t.cancel}
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={rating === 0 || isSubmitting}
                            className="flex-1 py-2.5 bg-[#004a90] text-white font-bold rounded-lg hover:bg-[#003870] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <i className="ri-loader-4-line animate-spin"></i>
                                    {t.submitting}
                                </span>
                            ) : (
                                t.submit
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
