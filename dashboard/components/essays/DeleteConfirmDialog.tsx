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
      <div className="bg-[#2a2a2a]/70 backdrop-blur-xl rounded-2xl border border-red-400/30 shadow-2xl shadow-red-500/20 w-full max-w-md m-4 pattern-overlay">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-white/8 bg-gradient-to-r from-red-400/10 to-orange-400/10">
          <div className="p-2 bg-red-400/20 rounded-lg border border-red-400/30">
            <AlertTriangle size={24} className="text-red-300" />
          </div>
          <div className="flex-1">
            <h2 className="text-[#e5e5e5] text-xl font-semibold tracking-tight">Delete Essay</h2>
            <p className="text-[#999999] text-sm mt-1">This action cannot be undone</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#999999] hover:text-[#e5e5e5] hover:bg-white/10 p-1.5 rounded-lg transition-all duration-200"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-[#b8b8b8] mb-4 leading-relaxed">
            Are you sure you want to delete <span className="text-[#e5e5e5] font-semibold">"{essay.title}"</span>?
          </p>
          {essay.collegeName && (
            <div className="mb-4 px-3 py-2 bg-white/5 rounded-lg border border-white/8">
              <p className="text-sm text-[#999999]">
                College: <span className="text-[#b8b8b8] font-medium">{essay.collegeName}</span>
              </p>
            </div>
          )}
          <div className="flex items-center gap-2 px-3 py-2 bg-red-400/10 rounded-lg border border-red-400/20">
            <AlertTriangle size={16} className="text-red-300" />
            <p className="text-sm text-red-200">
              All content and progress will be permanently lost.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/8">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[#999999] hover:text-[#e5e5e5] hover:bg-white/5 rounded-lg transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex items-center gap-2 bg-gradient-to-r from-red-400/20 to-red-500/20 border border-red-400/30 text-red-200 px-4 py-2 rounded-lg hover:from-red-400/25 hover:to-red-500/25 transition-all duration-200 ease-in-out active:scale-95 text-sm font-medium"
          >
            <Trash2 size={16} />
            Delete Essay
          </button>
        </div>
      </div>
    </div>
  );
}

