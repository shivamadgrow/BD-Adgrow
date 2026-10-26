import React, { useState } from 'react';
import { Business } from '@/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { MapPin, Navigation, Sparkles, Plus, CheckCircle2 } from 'lucide-react';

interface BusinessMapViewProps {
  businesses: Business[];
  onOpenAIReport: (b: Business) => void;
  onAddToCRM: (b: Business) => void;
  crmBusinessIds: Set<string>;
  currency: 'USD' | 'INR';
}

export const BusinessMapView: React.FC<BusinessMapViewProps> = ({
  businesses,
  onOpenAIReport,
  onAddToCRM,
  crmBusinessIds,
  currency,
}) => {
  const [selectedBiz, setSelectedBiz] = useState<Business | null>(businesses[0] || null);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col lg:flex-row min-h-[560px] lg:h-[560px]">
      {/* Map Graphic Canvas / Spatial Simulation */}
      <div className="relative flex-1 min-h-[300px] sm:min-h-[360px] bg-slate-900 overflow-hidden flex items-center justify-center p-4 sm:p-6">
        {/* Abstract World Grid Background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #60a5fa 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Floating Controls Overlay */}
        <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800 text-xs text-white flex items-center gap-2">
          <Navigation className="w-3.5 h-3.5 text-blue-400" />
          <span>Showing {businesses.length} geo-located business coordinates</span>
        </div>

        {/* Spatial Pins Array */}
        <div className="relative w-full h-full max-w-xl max-h-[460px]">
          {businesses.map((biz, idx) => {
            // Project relative coordinates inside canvas
            // Hash lat/lng to normalized 10-90% range for visual rendering
            const topPct = 20 + ((Math.abs(biz.location.lat * 13) % 65));
            const leftPct = 15 + ((Math.abs(biz.location.lng * 17) % 70));
            const isSelected = selectedBiz?.id === biz.id;
            const isHighPriority = biz.score.priority === 'A';

            return (
              <button
                key={biz.id}
                onClick={() => setSelectedBiz(biz)}
                style={{ top: `${topPct}%`, left: `${leftPct}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-transform ${
                  isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                }`}
                title={`${biz.name} (${biz.score.totalScore}/100)`}
              >
                <div
                  className={`relative p-2 rounded-full shadow-lg transition-all ${
                    isSelected
                      ? 'bg-blue-600 ring-4 ring-blue-400/50'
                      : isHighPriority
                      ? 'bg-emerald-500 hover:bg-emerald-400'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-white" />
                  {isHighPriority && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-900" />
                  )}
                </div>
                {/* Tooltip Label */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 hidden group-hover:block whitespace-nowrap bg-slate-900/95 text-white text-[11px] px-2 py-1 rounded shadow-md border border-slate-800 pointer-events-none">
                  {biz.name} • {biz.score.totalScore} pts
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Business Side Panel */}
      <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-200 bg-slate-50 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto">
        {selectedBiz ? (
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <Badge variant="priority" priority={selectedBiz.score.priority} />
              <Badge variant="website" websiteStatus={selectedBiz.websiteStatus} />
            </div>

            <h3 className="font-bold text-slate-900 text-lg leading-snug">{selectedBiz.name}</h3>
            <p className="text-xs text-slate-500 mt-1">{selectedBiz.category}</p>

            <div className="mt-4 p-3.5 bg-white rounded-lg border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-medium text-slate-900">
                  {selectedBiz.location.city}, {selectedBiz.location.countryName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Address:</span>
                <span className="font-medium text-slate-900 text-right truncate max-w-[180px]" title={selectedBiz.formattedAddress}>
                  {selectedBiz.formattedAddress}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="font-mono font-medium text-emerald-700">
                  {selectedBiz.phone || 'Not listed'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Lead Score:</span>
                <span className="font-bold text-blue-600">{selectedBiz.score.totalScore}/100</span>
              </div>
            </div>

            {/* Strategic Finding */}
            {selectedBiz.opportunities[0] && (
              <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs">
                <span className="font-semibold text-amber-900 block">
                  {selectedBiz.opportunities[0].title}
                </span>
                <p className="text-[11px] text-amber-800 mt-1">
                  {selectedBiz.opportunities[0].recommendedPitch}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs">
            Select any map pin to view prospect intelligence
          </div>
        )}

        {/* Actions */}
        {selectedBiz && (
          <div className="space-y-2 pt-4 border-t border-slate-200 mt-4">
            <Button
              variant="navy"
              className="w-full text-xs"
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-400" />}
              onClick={() => onOpenAIReport(selectedBiz)}
            >
              Open AI Research Dossier
            </Button>
            {crmBusinessIds.has(selectedBiz.id) ? (
              <div className="text-center py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Currently in Active CRM Pipeline</span>
              </div>
            ) : (
              <Button
                variant="primary"
                className="w-full text-xs"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => onAddToCRM(selectedBiz)}
              >
                Add to CRM Pipeline
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
