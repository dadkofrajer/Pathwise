"use client";

import { EssayStatus } from '@/lib/essays/types';
import { getStatusLabel } from '@/lib/essays/utils';
import { Circle, Clock, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  status: EssayStatus;
  showIcon?: boolean;
}

export default function StatusBadge({ status, showIcon = true }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'not_started':
        return {
          bg: 'bg-[#0a0a1a]',
          border: 'border-white/20',
          text: 'text-white/50',
          icon: <Circle size={12} className="text-white/50" />
        };
      case 'in_progress':
        return {
          bg: 'bg-[#0a0a1a]',
          border: 'border-[#00ffff]',
          text: 'text-[#00ffff]',
          icon: <Clock size={12} className="text-[#00ffff]" />
        };
      case 'complete':
        return {
          bg: 'bg-[#0a0a1a]',
          border: 'border-[#00ffff]',
          text: 'text-[#00ffff]',
          icon: <CheckCircle2 size={12} className="text-[#00ffff]" />
        };
      default:
        return {
          bg: 'bg-[#0a0a1a]',
          border: 'border-white/20',
          text: 'text-white/50',
          icon: <Circle size={12} className="text-white/50" />
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border ${styles.bg} ${styles.border} ${styles.text}`}>
      {showIcon && styles.icon}
      <span>{getStatusLabel(status)}</span>
    </div>
  );
}

