import React from 'react';
import { Business } from '@/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Sparkles,
  Phone,
  Star,
  Activity,
  Plus,
  CheckCircle2,
  MapPin,
  ExternalLink,
} from 'lucide-react';

interface BusinessCardGridProps {
  businesses: Business[];
  onOpenAudit: (b: Business) => void;
  onOpenAIReport: (b: Business) => void;
  onAddToCRM: (b: Business) => void;
  crmBusinessIds: Set<string>;
  currency: 'USD' | 'INR';
}

export const BusinessCardGrid: React.FC<BusinessCardGridProps> = ({
  businesses,
  onOpenAudit,
  onOpenAIReport,
  onAddToCRM,
  crmBusinessIds,
  currency,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {businesses.map((biz) => {
        const inCrm = crmBusinessIds.has(biz.id);
        const topOpportunity = biz.opportunities[0];

        return (
          <div
            key={biz.id}
            className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
          >
            <div>
              {/* Header: Score & Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <Badge variant="priority" priority={biz.score.priority} />
                  <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full">
                    {biz.score.totalScore}/100
                  </span>
                </div>
                <Badge variant="website" websiteStatus={biz.websiteStatus} />
              </div>

              {/* Title & Category */}
              <h4
                className="font-bold text-slate-900 text-base hover:text-blue-600 cursor-pointer line-clamp-1"
                onClick={() => onOpenAIReport(biz)}
              >
                {biz.name}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">{biz.category}</p>

              {/* Location & Reviews */}
              <div className="flex items-center justify-between text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{biz.location.city}, {biz.location.countryCode}</span>
                </span>
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{biz.rating || 4.5}</span>
                  <span className="text-slate-400 font-normal">({biz.reviewCount})</span>
                </span>
              </div>

              {/* Verified Phone */}
              <div className="mt-2 text-xs">
                {biz.phone ? (
                  <span className="flex items-center gap-1.5 font-mono text-slate-700 bg-slate-50 px-2 py-1 rounded-md border border-slate-200/60">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    {biz.phone}
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px] italic">No public direct phone listed</span>
                )}
              </div>

              {/* Primary Detected Gap / Opportunity */}
              {topOpportunity && (
                <div className="mt-3 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/70 text-xs">
                  <span className="font-semibold text-amber-900 block truncate">
                    {topOpportunity.title}
                  </span>
                  <p className="text-[11px] text-amber-800/90 line-clamp-2 mt-0.5">
                    {topOpportunity.evidence}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenAIReport(biz)}
                  className="p-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors text-xs font-medium flex items-center gap-1"
                  title="Open AI Dossier"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>AI Dossier</span>
                </button>
                <button
                  onClick={() => onOpenAudit(biz)}
                  className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors text-xs font-medium"
                  title="Run Full Audit"
                >
                  <Activity className="w-3.5 h-3.5" />
                </button>
              </div>

              {inCrm ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  In CRM
                </span>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => onAddToCRM(biz)}
                >
                  Add to CRM
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
