import React, { useState } from 'react';
import { Business, FilterState } from '@/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { BusinessSearchEngine } from '@/lib/services/search-engine';
import {
  Sparkles,
  Phone,
  Star,
  CheckCircle2,
  Plus,
  Activity,
  Building,
  RotateCcw,
  SlidersHorizontal,
  Search,
  HelpCircle,
  ArrowRight,
  MapPin,
  Send,
} from 'lucide-react';

interface BusinessTableProps {
  businesses: Business[];
  onOpenAudit: (b: Business) => void;
  onOpenAIReport: (b: Business) => void;
  onAddToCRM: (b: Business) => void;
  onOpenSalesOutreach: (b: Business) => void;
  crmBusinessIds: Set<string>;
  currency: 'USD' | 'INR';
  currentFilter?: FilterState;
  onResetFilters?: () => void;
  onApplyCategorySuggestion?: (catId: string) => void;
  onSwitchToOrLogic?: () => void;
}

export const BusinessTable: React.FC<BusinessTableProps> = ({
  businesses,
  onOpenAudit,
  onOpenAIReport,
  onAddToCRM,
  onOpenSalesOutreach,
  crmBusinessIds,
  currency,
  currentFilter,
  onResetFilters,
  onApplyCategorySuggestion,
  onSwitchToOrLogic,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelectAll = () => {
    if (selectedIds.size === businesses.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(businesses.map((b) => b.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // Rich Empty State with Suggestions & Diagnostics
  if (businesses.length === 0) {
    const query = currentFilter?.searchQuery || '';
    const suggestedCategories = query ? BusinessSearchEngine.findMatchingCategories(query) : [];

    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-10 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <Building className="w-6 h-6 text-slate-400" />
        </div>
        <h4 className="text-base font-bold text-slate-900">
          No businesses found matching your criteria
        </h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
          {query
            ? `No records directly matched "${query}" under current filters. Try relaxing location/website criteria or selecting a related category below.`
            : 'No records matched the selected combination of country, category, and digital filters.'}
        </p>

        {/* Category Suggestions if query exists */}
        {suggestedCategories.length > 0 && onApplyCategorySuggestion && (
          <div className="mt-5 p-4 max-w-lg mx-auto bg-purple-50/60 rounded-xl border border-purple-200/80 text-left">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900 mb-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Related Industries Found in Directory:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {suggestedCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onApplyCategorySuggestion(cat.id)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-purple-100 border border-purple-200 rounded-lg text-xs font-medium text-purple-800 transition-colors shadow-2xs"
                >
                  <span>{cat.name}</span>
                  <ArrowRight className="w-3 h-3 text-purple-500" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 mt-6">
          {onSwitchToOrLogic && currentFilter?.filterLogic === 'AND' && (
            <Button
              variant="secondary"
              size="sm"
              className="w-full sm:w-auto min-h-[40px] sm:min-h-0"
              leftIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}
              onClick={onSwitchToOrLogic}
            >
              Switch to OR Logic (Broader Match)
            </Button>
          )}

          {onResetFilters && (
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto min-h-[40px] sm:min-h-0"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={onResetFilters}
            >
              Reset All Filters
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden min-w-0">
      {/* ─────────────────────────────────────────────────────────────
          BATCH ACTIONS BAR (when rows are selected)
          ───────────────────────────────────────────────────────────── */}
      {selectedIds.size > 0 && (
        <div className="bg-blue-50 border-b border-blue-100 px-3.5 sm:px-4 py-2.5 flex items-center justify-between text-xs animate-in fade-in flex-wrap gap-2">
          <span className="font-semibold text-blue-900">
            {selectedIds.size} {selectedIds.size === 1 ? 'business' : 'businesses'} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              className="min-h-[38px] sm:min-h-0"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => {
                const toAdd = businesses.filter((b) => selectedIds.has(b.id));
                toAdd.forEach((b) => onAddToCRM(b));
                setSelectedIds(new Set());
              }}
            >
              Add to CRM ({selectedIds.size})
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="min-h-[38px] sm:min-h-0"
              onClick={() => setSelectedIds(new Set())}
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          1. MOBILE RESPONSIVE CARD-BASED LIST (< 768px)
          ───────────────────────────────────────────────────────────── */}
      <div className="block md:hidden">
        {/* Mobile Header: Select All toggle */}
        <div className="p-3 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <label className="flex items-center gap-2 font-medium cursor-pointer min-h-[36px]">
            <input
              type="checkbox"
              checked={businesses.length > 0 && selectedIds.size === businesses.length}
              onChange={toggleSelectAll}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <span>Select All ({businesses.length})</span>
          </label>
          <span className="text-[11px] text-slate-400">
            {selectedIds.size} selected
          </span>
        </div>

        {/* Business Cards */}
        <div className="divide-y divide-slate-100">
          {businesses.map((biz) => {
            const isSelected = selectedIds.has(biz.id);
            const inCrm = crmBusinessIds.has(biz.id);
            const isHighPriority = biz.score.priority === 'A';
            const topOpportunity = biz.opportunities[0];

            return (
              <div
                key={biz.id}
                className={`p-4 transition-colors space-y-3 ${
                  isSelected ? 'bg-blue-50/40' : 'bg-white hover:bg-slate-50/60'
                }`}
              >
                {/* Row 1: Checkbox + Name + Priority & Score */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="pt-0.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(biz.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer min-h-[24px] min-w-[24px]"
                        aria-label={`Select ${biz.name}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <div
                        className="font-bold text-slate-900 text-sm leading-tight hover:text-blue-600 cursor-pointer flex items-center gap-1.5 flex-wrap"
                        onClick={() => onOpenAIReport(biz)}
                      >
                        <span className="break-words">{biz.name}</span>
                        {isHighPriority && (
                          <span
                            className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"
                            title="Priority A target"
                          />
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                        <span className="font-medium text-slate-700">{biz.category}</span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-0.5 text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{biz.location.city}, {biz.location.countryCode}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <Badge variant="priority" priority={biz.score.priority} />
                    <span className="text-[11px] font-bold text-slate-700 mt-1">
                      {biz.score.totalScore}/100
                    </span>
                  </div>
                </div>

                {/* Row 2: Website, Phone, Rating */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="website" websiteStatus={biz.websiteStatus} />
                    {biz.phone ? (
                      <span className="flex items-center gap-1 font-mono text-[11px] text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">
                        <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate max-w-[130px]">{biz.phone}</span>
                      </span>
                    ) : (
                      <Badge variant="phone" phoneStatus={biz.phoneStatus} />
                    )}
                  </div>

                  <div className="flex items-center gap-1 font-semibold text-slate-800 text-xs shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                    <span>{biz.rating ? biz.rating.toFixed(1) : '4.5'}</span>
                    <span className="text-slate-400 font-normal">({biz.reviewCount})</span>
                  </div>
                </div>

                {/* Row 3: Top Detected Gap */}
                {topOpportunity && (
                  <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/70 text-xs">
                    <span className="font-semibold text-amber-900 block truncate">
                      {topOpportunity.title}
                    </span>
                    <p className="text-[11px] text-amber-800/90 line-clamp-1 mt-0.5">
                      {topOpportunity.evidence}
                    </p>
                  </div>
                )}

                {/* Row 4: Action Buttons (Large Touch Targets) */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 flex-1">
                    <button
                      type="button"
                      onClick={() => onOpenAIReport(biz)}
                      className="px-2.5 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors text-xs font-semibold flex items-center justify-center gap-1.5 min-h-[40px] flex-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>AI Report</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenAudit(biz)}
                      className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0"
                      title="View Full Audit"
                      aria-label="View Full Audit"
                    >
                      <Activity className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenSalesOutreach(biz)}
                      className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0"
                      title="Sales Outreach Pitch"
                      aria-label="Sales Outreach Pitch"
                    >
                      <Send className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>

                  <div className="shrink-0">
                    {inCrm ? (
                      <span className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 min-h-[40px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        In CRM
                      </span>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        className="min-h-[40px]"
                        leftIcon={<Plus className="w-3.5 h-3.5" />}
                        onClick={() => onAddToCRM(biz)}
                      >
                        Add CRM
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. DESKTOP ENTERPRISE DATA TABLE (>= 768px)
          ───────────────────────────────────────────────────────────── */}
      <div className="hidden md:block table-container">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 select-none">
              <th className="py-3.5 pl-4 pr-2 w-10">
                <input
                  type="checkbox"
                  checked={businesses.length > 0 && selectedIds.size === businesses.length}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  aria-label="Select all businesses"
                />
              </th>
              <th className="py-3.5 px-3 min-w-[240px]">Business &amp; Industry</th>
              <th className="py-3.5 px-3 min-w-[160px]">Market Location</th>
              <th className="py-3.5 px-3 min-w-[170px]">Website &amp; Contact</th>
              <th className="py-3.5 px-3 min-w-[110px]">Google Reviews</th>
              <th className="py-3.5 px-3 min-w-[130px]">Opportunity Score</th>
              <th className="py-3.5 pr-4 pl-3 text-right min-w-[210px]">Sales Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {businesses.map((biz) => {
              const isSelected = selectedIds.has(biz.id);
              const inCrm = crmBusinessIds.has(biz.id);
              const isHighPriority = biz.score.priority === 'A';

              return (
                <tr
                  key={biz.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isSelected ? 'bg-blue-50/40' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-3.5 pl-4 pr-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectOne(biz.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      aria-label={`Select ${biz.name}`}
                    />
                  </td>

                  {/* Business Name & Category */}
                  <td className="py-3.5 px-3">
                    <div
                      className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer flex items-center gap-1.5"
                      onClick={() => onOpenAIReport(biz)}
                    >
                      <span>{biz.name}</span>
                      {isHighPriority && (
                        <span
                          className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"
                          title="Priority A target"
                        />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                      <span className="font-medium text-slate-600 truncate max-w-[200px]">
                        {biz.category}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-400 capitalize">
                        {biz.sourceProvider.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-3">
                    <div className="font-medium text-slate-800">
                      {biz.location.city}, {biz.location.countryCode}
                    </div>
                    <div
                      className="text-[11px] text-slate-400 truncate max-w-[180px]"
                      title={biz.formattedAddress}
                    >
                      {biz.location.neighborhood || biz.formattedAddress}
                    </div>
                  </td>

                  {/* Website & Phone Badges */}
                  <td className="py-3.5 px-3 space-y-1.5">
                    <div>
                      <Badge variant="website" websiteStatus={biz.websiteStatus} />
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-600">
                      {biz.phone ? (
                        <span className="flex items-center gap-1 font-mono text-slate-700">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          {biz.phone}
                        </span>
                      ) : (
                        <Badge variant="phone" phoneStatus={biz.phoneStatus} />
                      )}
                    </div>
                  </td>

                  {/* Reviews & Rating */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1 font-semibold text-slate-900">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{biz.rating ? biz.rating.toFixed(1) : 'N/A'}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {biz.reviewCount} customer reviews
                    </div>
                  </td>

                  {/* Lead Score & Priority */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-sm text-slate-900">
                        {biz.score.totalScore}
                        <span className="text-[10px] text-slate-400 font-normal">/100</span>
                      </div>
                      <Badge variant="priority" priority={biz.score.priority} />
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          biz.score.priority === 'A'
                            ? 'bg-emerald-500'
                            : biz.score.priority === 'B'
                            ? 'bg-amber-500'
                            : 'bg-slate-400'
                        }`}
                        style={{ width: `${biz.score.totalScore}%` }}
                      />
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 pr-4 pl-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* AI Dossier Button */}
                      <button
                        onClick={() => onOpenAIReport(biz)}
                        className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors border border-indigo-200/60"
                        title="Open AI Business Intelligence Dossier & Sales Angles"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>

                      {/* Audit Modal Button */}
                      <button
                        onClick={() => onOpenAudit(biz)}
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors border border-slate-200"
                        title="View Full Website & Digital Presence Audit"
                      >
                        <Activity className="w-4 h-4" />
                      </button>

                      {/* Add to CRM / In CRM Button */}
                      {inCrm ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          In CRM
                        </span>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<Plus className="w-3.5 h-3.5 text-blue-600" />}
                          onClick={() => onAddToCRM(biz)}
                        >
                          Add to CRM
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
