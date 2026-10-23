import React, { useState } from 'react';
import { CRMProspect, PipelineStage, ServiceType } from '@/types';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Plus,
  Send,
  User,
  DollarSign,
  Tag,
} from 'lucide-react';

interface ProspectDrawerProps {
  prospect: CRMProspect | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStage: (prospectId: string, stage: PipelineStage) => void;
  onAddNote: (prospectId: string, note: string) => void;
  onToggleTask: (prospectId: string, taskId: string) => void;
  onOpenAIReport: (prospect: CRMProspect) => void;
  currency: 'USD' | 'INR';
}

const allStages: { stage: PipelineStage; label: string }[] = [
  { stage: 'discovered', label: 'Discovered' },
  { stage: 'qualified', label: 'Qualified' },
  { stage: 'ready_for_outreach', label: 'Ready for Outreach' },
  { stage: 'contacted', label: 'Contacted' },
  { stage: 'interested', label: 'Interested / In Discussions' },
  { stage: 'meeting_scheduled', label: 'Meeting Scheduled' },
  { stage: 'proposal_sent', label: 'Proposal Sent' },
  { stage: 'negotiation', label: 'Negotiation' },
  { stage: 'won', label: 'Closed Won 🎉' },
  { stage: 'lost', label: 'Closed Lost' },
  { stage: 'not_a_fit', label: 'Not a Fit' },
];

export const ProspectDrawer: React.FC<ProspectDrawerProps> = ({
  prospect,
  isOpen,
  onClose,
  onUpdateStage,
  onAddNote,
  onToggleTask,
  onOpenAIReport,
  currency,
}) => {
  const [newNoteText, setNewNoteText] = useState('');

  if (!prospect) return null;

  const biz = prospect.business;

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(prospect.id, newNoteText.trim());
    setNewNoteText('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={biz.name}
      subtitle={`CRM Prospect File • Opportunity Score: ${biz.score.totalScore}/100`}
      maxWidth="4xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-slate-500">
            Assigned BD Lead: <span className="font-semibold text-slate-700">{prospect.assignedTo}</span>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close File
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Top Info Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
          {/* Pipeline Stage Select */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Pipeline Stage
            </label>
            <select
              value={prospect.stage}
              onChange={(e) => onUpdateStage(prospect.id, e.target.value as PipelineStage)}
              className="w-full h-9 px-2.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {allStages.map((s) => (
                <option key={s.stage} value={s.stage}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Deal Value */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Estimated Deal Value
            </label>
            <div className="h-9 px-3 text-sm font-bold rounded-lg bg-white border border-slate-200 flex items-center text-slate-900">
              {currency === 'USD' ? `$${prospect.estimatedDealValue}` : `₹${(prospect.estimatedDealValue * 83).toLocaleString('en-IN')}`}
            </div>
          </div>

          {/* Service Pitched */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Service Offered
            </label>
            <div className="h-9 px-3 text-xs font-medium rounded-lg bg-white border border-slate-200 flex items-center text-blue-700 truncate">
              {prospect.servicePitched.replace('_', ' ').toUpperCase()}
            </div>
          </div>
        </div>

        {/* Business Contact & Verified Details */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <h4 className="font-bold text-slate-900 mb-2">Verified Contact Channel</h4>
            <div className="space-y-1.5 text-slate-600">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-mono text-slate-800">{biz.phone || 'No phone listed'}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium text-slate-400">Address:</span>
                <span className="truncate">{biz.formattedAddress}</span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-2">Agency Opportunity Summary</h4>
            <p className="text-slate-600">
              {biz.opportunities[0]?.recommendedPitch || 'Website development and Google local maps pack optimization.'}
            </p>
            <div className="mt-2">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-indigo-600" />}
                onClick={() => onOpenAIReport(prospect)}
              >
                View AI Sales Playbook
              </Button>
            </div>
          </div>
        </div>

        {/* Action Tasks Checklist */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center justify-between">
            <span>Pending Next Actions & Follow-ups</span>
            <span className="text-slate-400 font-normal">
              {prospect.tasks.filter((t) => t.completed).length}/{prospect.tasks.length} Completed
            </span>
          </h4>
          <div className="space-y-2">
            {prospect.tasks.map((task) => (
              <label
                key={task.id}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-slate-200 text-xs cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleTask(prospect.id, task.id)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <span className={`flex-1 font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  {task.title}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Due: {task.dueDate}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Activity & Notes Log */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            Interaction Log & Internal Notes
          </h4>

          {/* New Note Form */}
          <form onSubmit={handleAddNoteSubmit} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Log a call outcome, client objection, or follow-up note..."
              className="flex-1 h-9 px-3 text-xs rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button type="submit" variant="primary" size="sm" leftIcon={<Send className="w-3.5 h-3.5" />}>
              Add Note
            </Button>
          </form>

          {/* Activity Timeline List */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {prospect.activities.map((act) => (
              <div key={act.id} className="p-3 rounded-lg bg-white border border-slate-200 text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                  <span className="font-semibold text-slate-700">{act.author}</span>
                  <span>{new Date(act.date).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-800">{act.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
