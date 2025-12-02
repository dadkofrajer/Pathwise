"use client";

import { Essay } from '@/lib/essays/types';
import { formatDate } from '@/lib/essays/utils';
import { Pencil, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useRouter } from 'next/navigation';

interface EssayCardProps {
  essay: Essay;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function EssayCard({ essay, onEdit, onDelete }: EssayCardProps) {
  const router = useRouter();

  const handleEdit = () => {
    if (onEdit) {
      onEdit(essay.id);
    } else {
      router.push(`/essays/${essay.id}/edit`);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(essay.id);
    }
  };

  const progressPercentage = Math.min((essay.wordCount / essay.wordLimit) * 100, 100);
  const isOverLimit = essay.wordCount > essay.wordLimit;

  const progressBarColor = isOverLimit 
    ? '#ff00ff' 
    : progressPercentage >= 90 
    ? '#00ffff'
    : progressPercentage >= 80
    ? '#00d4ff'
    : '#0080ff';

  return (
    <div className="bg-[#0f0f23] border border-white/20 rounded-md p-6 hover:border-[#00ffff]/50 transition-all duration-200">
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white text-base font-bold flex-1">{essay.title}</h3>
          {essay.collegeName && (
            <span className="px-2 py-0.5 bg-[#0a0a1a] border border-[#00ffff] rounded-md text-xs text-[#00ffff] ml-2 font-medium">
              {essay.collegeName.split(' ')[0]}
            </span>
          )}
        </div>
        <p className="text-white/70 text-sm mb-4 line-clamp-2 leading-relaxed">{essay.prompt}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/50 font-medium">Progress</span>
          <span className="text-xs font-bold text-white">
            {essay.wordCount} / {essay.wordLimit}
          </span>
        </div>
        <div className="w-full bg-[#0a0a1a] rounded-full h-1.5 overflow-hidden border border-white/10">
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{ 
              width: `${Math.min(progressPercentage, 100)}%`,
              backgroundColor: progressBarColor
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 text-xs text-white/50">
        <span>Last edited: {formatDate(essay.lastEdited)}</span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <StatusBadge status={essay.status} />
        <div className="flex items-center gap-2">
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 bg-[#0f0f23] border border-[#00ffff] text-[#00ffff] px-4 py-2 rounded-md hover:bg-[#00ffff]/10 transition-all duration-200 text-sm font-medium"
          >
            <Pencil size={14} />
            Edit
          </button>
          {onDelete && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-[#0f0f23] border border-white/20 text-white/70 px-4 py-2 rounded-md hover:border-[#ff00ff] hover:text-[#ff00ff] transition-all duration-200 text-sm font-medium"
              aria-label="Delete essay"
            >
              <Trash2 size={14} />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
