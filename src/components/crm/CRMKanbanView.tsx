import React from 'react';
import { CRMProspect, PipelineStage } from '@/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  MoreVertical,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle,
  Building2,
} from 'lucide-react';

interface CRMKanbanViewProps {
  prospects: CRMProspect[];
  onSelectProspect: (prospect: CRMProspect) => void;
  onAdvanceStage: (prospectId: string, currentStage: PipelineStage, direction: 'forward' | 'backward') => void;
  currency: 'USD' | 'INR';
}

const activePipelineColumns: { stage: PipelineStage; label: string; color: string }[] = [
  { stage: 'qualified', label: '1. Qualified Leads', color: 'border-t-blue-500' },
  { stage: 'ready_for_outreach', label: '2. Ready for Outreach', color: 'border-t-purple-500' },
  { stage: 'contacted', label: '3. Contacted', color: 'border-t-amber-500' },
  { stage: 'interested', label: '4. Interested / Reply', color: 'border-t-teal-500' },
  { stage: 'meeting_scheduled', label: '5. Meeting Booked', color: 'border-t-indigo-600' },
  { stage: 'proposal_sent', label: '6. Proposal Sent', color: 'border-t-violet-600' },
  { stage: 'won', label: '7. Closed Won 🎉', color: 'border-t-emerald-600' },
];

export const CRMKanbanView: React.FC<CRMKanbanViewProps> = ({
  prospects,
  onSelectProspect,
  onAdvanceStage,
  currency,
}) => {
  return (
    <div className="w-full max-w-full min-w-0">
      <div className="md:hidden flex items-center justify-between text-[11px] text-slate-500 mb-2 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200">
        <span>Kanban Pipeline Board</span>
        <span className="font-semibold text-blue-600">Swipe stages →</span>
      </div>
      <div className="overflow-x-auto pb-4 max-w-full min-w-0">
        <div className="flex gap-4 min-w-[1400px]">
        {activePipelineColumns.map((col) => {
          const colProspects = prospects.filter((p) => p.stage === col.stage);
          const colTotalValue = colProspects.reduce((sum, p) => sum + (p.estimatedDealValue || 0), 0);

          return (
            <div
              key={col.stage}
              className={`w-72 shrink-0 bg-slate-100/70 rounded-xl border border-slate-200 border-t-4 ${col.color} p-3 flex flex-col max-h-[calc(100vh-210px)]`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80">
                <div>
                  <h4 className="font-bold text-xs text-slate-800">{col.label}</h4>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {colProspects.length} {colProspects.length === 1 ? 'prospect' : 'prospects'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900">
                    {currency === 'USD' ? `$${colTotalValue.toLocaleString()}` : `₹${colTotalValue.toLocaleString('en-IN')}`}
                  </span>
                </div>
              </div>

              {/* Column Prospects Cards */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {colProspects.length === 0 ? (
                  <div className="py-8 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-lg">
                    No prospects in this stage
                  </div>
                ) : (
                  colProspects.map((prospect) => {
                    const biz = prospect.business;
                    const formatPrice = currency === 'USD' 
                      ? `$${prospect.estimatedDealValue}` 
                      : `₹${(prospect.estimatedDealValue * 83).toLocaleString('en-IN')}`;

                    return (
                      <div
                        key={prospect.id}
                        className="p-3.5 bg-white rounded-lg border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all text-xs flex flex-col justify-between"
                      >
                        <div>
                          {/* Card Top: Priority & Value */}
                          <div className="flex items-center justify-between mb-1.5">
                            <Badge variant="priority" priority={prospect.priority} />
                            <span className="font-bold text-slate-900 text-xs">{formatPrice}</span>
                          </div>

                          {/* Business Name */}
                          <h5
                            className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-1 text-sm"
                            onClick={() => onSelectProspect(prospect)}
                          >
                            {biz.name}
                          </h5>

                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {biz.location.city} • {biz.category}
                          </p>

                          {/* Direct Phone */}
                          {biz.phone && (
                            <div className="mt-2 text-[11px] font-mono text-slate-600 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-emerald-600" />
                              <span>{biz.phone}</span>
                            </div>
                          )}

                          {/* Service Pitched */}
                          <div className="mt-2 text-[10px] uppercase font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 truncate">
                            {prospect.servicePitched.replace('_', ' ')}
                          </div>
                        </div>

                        {/* Card Footer: Advancement Controls */}
                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                          <button
                            onClick={() => onAdvanceStage(prospect.id, prospect.stage, 'backward')}
                            disabled={col.stage === 'qualified'}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
                            title="Move back one stage"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onSelectProspect(prospect)}
                            className="text-[11px] font-medium text-slate-600 hover:text-blue-600 hover:underline"
                          >
                            View Details ({prospect.tasks.filter((t) => !t.completed).length} tasks)
                          </button>

                          <button
                            onClick={() => onAdvanceStage(prospect.id, prospect.stage, 'forward')}
                            disabled={col.stage === 'won'}
                            className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
                            title="Advance to next pipeline stage"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
};
