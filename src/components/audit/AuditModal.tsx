import React from 'react';
import { Business } from '@/types';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Smartphone,
  Laptop,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Phone,
  FileCode,
  DollarSign,
  Plus,
} from 'lucide-react';

interface AuditModalProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCRM: (b: Business) => void;
  inCrm: boolean;
  currency: 'USD' | 'INR';
}

export const AuditModal: React.FC<AuditModalProps> = ({
  business,
  isOpen,
  onClose,
  onAddToCRM,
  inCrm,
  currency,
}) => {
  if (!business) return null;

  const audit = business.audit;
  const isNoWebsite = business.websiteStatus === 'not_listed' || !business.website;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Digital Presence & Audit: ${business.name}`}
      subtitle={`${business.category} • ${business.location.city}, ${business.location.countryName}`}
      maxWidth="4xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-slate-500">
            Source Audit Date: <span className="font-medium text-slate-700">{audit?.auditDate || 'Recent'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            {!inCrm && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => {
                  onAddToCRM(business);
                  onClose();
                }}
              >
                Add to CRM Pipeline
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Top Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Mobile Speed */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Smartphone className="w-4 h-4 text-slate-600" />
              <span>Mobile PageSpeed</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-2xl font-bold ${
                  isNoWebsite
                    ? 'text-slate-400'
                    : (audit?.mobileScore || 0) < 50
                    ? 'text-rose-600'
                    : 'text-emerald-600'
                }`}
              >
                {isNoWebsite ? 'N/A' : `${audit?.mobileScore}/100`}
              </span>
              {!isNoWebsite && (
                <span className="text-[11px] font-medium text-slate-400">
                  {(audit?.mobileScore || 0) < 50 ? 'Failing' : 'Passing'}
                </span>
              )}
            </div>
          </div>

          {/* SSL Status */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <ShieldCheck className="w-4 h-4 text-slate-600" />
              <span>SSL Encryption</span>
            </div>
            <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              {audit?.sslValid ? (
                <span className="text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Valid HTTPS
                </span>
              ) : (
                <span className="text-rose-700 flex items-center gap-1">
                  <XCircle className="w-4 h-4 text-rose-600" /> No SSL / Inactive
                </span>
              )}
            </div>
          </div>

          {/* Booking / CTA Funnel */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Calendar className="w-4 h-4 text-slate-600" />
              <span>Direct Booking CTA</span>
            </div>
            <div className="text-sm font-bold">
              {audit?.hasBookingCta ? (
                <span className="text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Detected
                </span>
              ) : (
                <span className="text-amber-700 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Missing CTA
                </span>
              )}
            </div>
          </div>

          {/* Lead Opportunity Score */}
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-1.5 text-xs text-blue-700 mb-1">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Opportunity Score</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-blue-900">{business.score.totalScore}/100</span>
              <Badge variant="priority" priority={business.score.priority} />
            </div>
          </div>
        </div>

        {/* Observable Issues Box */}
        <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5 mb-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            Empirical Digital Presence Deficiencies
          </h4>
          <ul className="space-y-1.5 text-xs text-rose-800">
            {audit?.detectedIssues && audit.detectedIssues.length > 0 ? (
              audit.detectedIssues.map((issue, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{issue}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500">No critical issues identified.</li>
            )}
          </ul>
        </div>

        {/* Actionable Agency Opportunities */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            Detected Agency Pitches & Commercial Opportunities
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {business.opportunities.map((opp) => (
              <div
                key={opp.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-slate-900">{opp.title}</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {currency === 'USD' ? `$${opp.estimatedValueUsd}` : `₹${opp.estimatedValueInr.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{opp.evidence}</p>
                <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-700 italic">
                  &ldquo;{opp.recommendedPitch}&rdquo;
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
