"use client";

import { Essay } from '@/lib/essays/types';
import EssayCard from './EssayCard';
import { Plus, FileText } from 'lucide-react';

interface GeneralEssaySectionProps {
  essays: Essay[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
}

export default function GeneralEssaySection({ 
  essays, 
  onEdit, 
  onDelete, 
  onAdd 
}: GeneralEssaySectionProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText size={20} className="text-[#ff00ff]" />
          <div>
            <h2 className="text-white text-xl font-bold">General Essays</h2>
            <p className="text-white/50 text-sm mt-0.5">{essays.length} {essays.length === 1 ? 'essay' : 'essays'}</p>
          </div>
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-[#2a2a2a]/40 backdrop-blur-sm border border-[#00ffff]/50 text-[#00ffff] px-4 py-2 rounded-md hover:bg-[#00ffff]/10 transition-all duration-200 text-sm font-medium"
          >
            <Plus size={16} />
            Add Essay
          </button>
        )}
      </div>

      {essays.length === 0 ? (
        <div className="bg-[#2a2a2a]/30 backdrop-blur-xl border border-white/10 rounded-md p-12 text-center">
          <div className="inline-flex p-4 bg-[#2a2a2a]/40 backdrop-blur-sm border border-white/10 rounded-md mb-4">
            <FileText size={32} className="text-white/50" />
          </div>
          <p className="text-white/70 mb-2">No general essays yet.</p>
          <p className="text-sm text-white/50">Click "Add Essay" to create your first essay</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {essays.map((essay) => (
            <EssayCard
              key={essay.id}
              essay={essay}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

