"use client";

import { X, Trash2, AlertTriangle } from 'lucide-react';
import { Essay } from '@/lib/essays/types';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  essay: Essay | null;
}

export default function DeleteConfirmDialog({ isOpen, onClose, onConfirm, essay }: DeleteConfirmDialogProps) {
  if (!isOpen || !essay) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div className="bg-[#2a2a2a]/30 backdrop-blur-2xl border border-[#ff00ff]/50 rounded-md shadow-2xl w-full max-w-md m-4">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-white/20">
            <div className="p-2 bg-[#2a2a2a]/40 backdrop-blur-sm border border-[#ff00ff]/50 rounded-md">
            <AlertTriangle size={24} className="text-[#ff00ff]" />
          </div>
          <div className="flex-1">
            <h2 className="text-white text-xl font-bold">Delete Essay</h2>
            <p className="text-white/50 text-sm mt-1">This action cannot be undone</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-[#2a2a2a]/40 backdrop-blur-sm p-1.5 rounded-md transition-all duration-200"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-white/70 mb-4 leading-relaxed">
            Are you sure you want to delete <span className="text-white font-bold">"{essay.title}"</span>?
          </p>
          {essay.collegeName && (
            <div className="mb-4 px-3 py-2 bg-[#2a2a2a]/40 backdrop-blur-sm border border-white/10 rounded-md">
              <p className="text-sm text-white/50">
                College: <span className="text-white/70 font-medium">{essay.collegeName}</span>
              </p>
            </div>
          )}
          <div className="flex items-center gap-2 px-3 py-2 bg-[#2a2a2a]/40 backdrop-blur-sm border border-[#ff00ff]/50 rounded-md">
            <AlertTriangle size={16} className="text-[#ff00ff]" />
            <p className="text-sm text-white/70">
              All content and progress will be permanently lost.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/20">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white/70 hover:text-white hover:bg-[#2a2a2a]/40 backdrop-blur-sm rounded-md transition-all duration-200 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex items-center gap-2 bg-[#2a2a2a]/40 backdrop-blur-sm border border-[#ff00ff]/50 text-[#ff00ff] px-4 py-2 rounded-md hover:bg-[#ff00ff]/10 transition-all duration-200 text-sm font-medium"
          >
            <Trash2 size={16} />
            Delete Essay
          </button>
        </div>
      </div>
    </div>
  );
}

