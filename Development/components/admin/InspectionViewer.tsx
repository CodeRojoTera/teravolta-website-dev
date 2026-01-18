'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ElectricalBoard } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';

interface InspectionViewerProps {
    appointmentId: string;
}

export default function InspectionViewer({ appointmentId }: InspectionViewerProps) {
    const { showToast } = useToast();
    const [boards, setBoards] = useState<ElectricalBoard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBoards = async () => {
            if (!appointmentId) return;
            setLoading(true);
            const { data, error } = await supabase
                .from('electrical_boards')
                .select('*')
                .eq('appointment_id', appointmentId)
                .order('created_at', { ascending: true });

            if (error) {
                console.error(error);
                showToast('Failed to load inspection data', 'error');
            } else {
                setBoards((data as ElectricalBoard[]) || []);
            }
            setLoading(false);
        };

        fetchBoards();
    }, [appointmentId, showToast]);

    if (loading) return <div className="text-center py-4 text-gray-400">Loading inspection data...</div>;
    if (!boards.length) return <div className="text-center py-4 text-gray-400 italic">No inspection data recorded yet.</div>;

    const incompatibleCount = boards.filter(b => b.emporia_classification === 'incompatible').length;

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex justify-between items-center">
                <div>
                    <h4 className="font-bold text-[#004a90]">Inspection Summary</h4>
                    <p className="text-sm text-gray-600">
                        {boards.length} Boards inspected. {incompatibleCount > 0 ? `${incompatibleCount} require significant work.` : 'All boards standard/adjustable.'}
                    </p>
                </div>
                {incompatibleCount > 0 && (
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase">High Complexity</span>
                )}
            </div>

            <div className="space-y-4">
                {boards.map(board => (
                    <div key={board.id} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                            <h5 className="font-bold text-gray-900">{board.name}</h5>
                            <span className={`text-xs px-2 py-0.5 rounded-full uppercase font-bold ${board.emporia_classification === 'standard' ? 'bg-green-100 text-green-700' :
                                    board.emporia_classification === 'adjustments' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                }`}>
                                {board.emporia_classification}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700 mb-3">
                            <div>
                                <span className="block text-xs text-gray-500">System</span>
                                {board.system_type}
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500">Solution</span>
                                {board.recommended_solution}
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500">CT Fits?</span>
                                {board.ct_status}
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500">Neutral?</span>
                                {board.has_neutral ? 'Yes' : 'No'}
                            </div>
                        </div>

                        {board.observations && (
                            <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 italic mb-3">
                                {board.observations}
                            </div>
                        )}

                        {board.photos && board.photos.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {board.photos.map((url, idx) => (
                                    <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="shrink-0 w-16 h-16 rounded border overflow-hidden relative group">
                                        <img src={url} alt={`Evidence ${idx}`} className="w-full h-full object-cover" />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
