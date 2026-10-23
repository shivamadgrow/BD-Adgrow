import React from 'react';
import { PriorityTier, WebsiteStatus, PhoneStatus, PipelineStage } from '@/types';
import { designTokens } from '@/lib/design-tokens';

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'priority' | 'website' | 'phone' | 'stage' | 'custom';
  priority?: PriorityTier;
  websiteStatus?: WebsiteStatus;
  phoneStatus?: PhoneStatus;
  stage?: PipelineStage;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'custom',
  priority,
  websiteStatus,
  phoneStatus,
  stage,
  className = '',
}) => {
  if (variant === 'priority' && priority) {
    const config = designTokens.priorityBadges[priority];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${className}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        Priority {priority}
      </span>
    );
  }

  if (variant === 'website' && websiteStatus) {
    const config = designTokens.websiteStatusBadges[websiteStatus] || designTokens.websiteStatusBadges.unknown;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${className}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {config.label}
      </span>
    );
  }

  if (variant === 'phone' && phoneStatus) {
    const config = designTokens.phoneStatusBadges[phoneStatus];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${className}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {config.label}
      </span>
    );
  }

  if (variant === 'stage' && stage) {
    const config = designTokens.pipelineStages[stage] || { label: stage, color: 'bg-slate-100 text-slate-700 border-slate-200' };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color} ${className}`}>
        {config.label}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 ${className}`}>
      {children}
    </span>
  );
};
