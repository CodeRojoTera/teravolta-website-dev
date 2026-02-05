'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ElectricalBoard } from '@/lib/types';
import BoardForm from './BoardForm';
import { useToast } from '@/components/ui/Toast';

interface BoardListManagerProps {
    appointmentId: string;
}

export default function BoardListManager({ appointmentId }: BoardListManagerProps) {
    const { showToast } = useToast();
    const [boards, setBoards] = useState<ElectricalBoard[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedBoard, setSelectedBoard] = useState<ElectricalBoard | undefined>(undefined);

    const fetchBoards = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('electrical_boards')
            .select('*')
            .eq('appointment_id', appointmentId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching boards:', error);
            showToast('Failed to load boards', 'error');
        } else {
            setBoards((data as ElectricalBoard[]) || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBoards();
    }, [appointmentId]);

    const handleCreate = () => {
        setSelectedBoard(undefined);
        setIsEditing(true);
    };

    const handleEdit = (board: ElectricalBoard) => {
        setSelectedBoard(board);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this board?')) return;
        const { error } = await supabase.from('electrical_boards').delete().eq('id', id);
        if (error) {
            showToast('Error deleting board', 'error');
        } else {
            showToast('Board deleted', 'success');
            fetchBoards();
        }
    };

    const handleSave = () => {
        setIsEditing(false);
        fetchBoards();
    };

    if (isEditing) {
        return (
            <BoardForm
                appointmentId={appointmentId}
                board={selectedBoard}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div>
                    <h3 className="text-lg font-bold text-[#004a90]">Electrical Boards</h3>
                    <p className="text-sm text-gray-500">{boards.length} Boards Identified</p>
                </div>
                <button onClick={handleCreate} className="px-4 py-2 bg-[#c3d021] text-[#194271] font-bold rounded hover:bg-[#a8b91e] transition-colors flex items-center">
                    <i className="ri-add-line mr-2"></i> Add Board
                </button>
            </div>

            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004a90] mx-auto"></div>
                </div>
            ) : boards.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <i className="ri-dashboard-3-line text-4xl text-gray-300 mb-2"></i>
                    <p className="text-gray-500">No boards recorded yet.</p>
                    <p className="text-sm text-gray-400">Click &quot;Add Board&quot; to start the inspection.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {boards.map(board => (
                        <div key={board.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-gray-900">{board.name}</h4>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${board.emporia_classification === 'standard' ? 'bg-green-100 text-green-800' :
                                            board.emporia_classification === 'adjustments' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {board.emporia_classification === 'standard' ? 'Standard' : board.emporia_classification === 'adjustments' ? 'Needs Adjustment' : 'Incompatible'}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600 flex flex-wrap gap-x-4">
                                    <span><i className="ri-settings-3-line mr-1"></i> {board.system_type}</span>
                                    <span>{board.has_neutral ? '✅ Neutral' : '❌ No Neutral'}</span>
                                    <span>Rating: {board.recommended_solution}</span>
                                </div>
                            </div>
                            <div className="flex gap-2 self-end md:self-center">
                                <button onClick={() => handleEdit(board)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                                    <i className="ri-edit-line text-xl"></i>
                                </button>
                                <button onClick={() => handleDelete(board.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                                    <i className="ri-delete-bin-line text-xl"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* System Validation Summary (Optional for Admin but good for Tech) */}
            {boards.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h4 className="font-bold text-[#004a90] mb-2">Inspection Summary</h4>
                    <p className="text-sm text-gray-700">
                        {boards.filter(b => b.emporia_classification === 'incompatible').length > 0
                            ? '⚠️ Some boards are marked as Incompatible. This project may require significant electrical work.'
                            : '✅ All boards appear compatible or adjustable.'}
                    </p>
                </div>
            )}
        </div>
    );
}
