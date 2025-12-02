"use client";

import { useState } from 'react';
import { College } from '@/lib/essays/types';
import EssayCard from './EssayCard';
import { Building2, ChevronDown, ChevronUp, Plus, FileText } from 'lucide-react';

interface CollegeEssaySectionProps {
  college: College;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAdd?: (collegeId: string) => void;
}

export default function CollegeEssaySection({ 
  college, 
  onEdit, 
  onDelete, 
  onAdd 
}: CollegeEssaySectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const completedCount = college.essays.filter(essay => essay.status === 'complete').length;
  const totalCount = college.essays.length;

  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="mb-4">
      {/* College Header */}
      <div className="bg-[#0f0f23] border border-white/20 rounded-md p-5 hover:border-[#00ffff]/50 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white/50 hover:text-white transition-all duration-200"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>
            <Building2 size={20} className="text-[#00ffff]" />
            <div className="flex-1">
              <h3 className="text-white text-lg font-bold mb-1">{college.name}</h3>
              <div className="flex items-center gap-3">
                <p className="text-sm text-white/70">{completedCount} of {totalCount} essays complete</p>
                <div className="flex-1 max-w-[120px] bg-[#0a0a1a] rounded-full h-1.5 overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-[#00ffff] transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <span className="text-xs text-white/50">{completionPercentage}%</span>
              </div>
            </div>
          </div>
          {onAdd && (
            <button
              onClick={() => onAdd(college.id)}
              className="flex items-center gap-2 bg-[#0f0f23] border border-[#00ffff] text-[#00ffff] px-4 py-2 rounded-md hover:bg-[#00ffff]/10 transition-all duration-200 text-sm font-medium"
            >
              <Plus size={16} />
              Add Essay
            </button>
          )}
        </div>
      </div>

      {/* Essays List */}
      {isExpanded && (
        <div className="mt-4 space-y-4 ml-12">
          {college.essays.length === 0 ? (
            <div className="bg-[#0f0f23] border border-white/20 rounded-md p-8 text-center">
              <div className="inline-flex p-3 bg-[#0a0a1a] border border-white/20 rounded-md mb-3">
                <FileText size={24} className="text-white/50" />
              </div>
              <p className="text-white/70 text-sm">No essays for this college yet.</p>
              <p className="text-xs text-white/50 mt-1">Click "Add Essay" to create one</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {college.essays.map((essay) => (
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
      )}
    </div>
  );
}

