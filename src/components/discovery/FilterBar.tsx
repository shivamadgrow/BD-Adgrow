import React, { useMemo, useState } from 'react';
import { FilterState } from '@/types';
import { supportedCountries } from '@/lib/data/locations';
import { businessCategories, industryGroups } from '@/lib/data/categories';
import { BusinessSearchEngine } from '@/lib/services/search-engine';
import {
  RotateCcw,
  SlidersHorizontal,
  Flame,
  Globe,
  PhoneCall,
  Star,
  Search,
  Tag,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface FilterBarProps {
  filter: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  totalMatches: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onChange,
  onReset,
  totalMatches,
}) => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const currentCountry = supportedCountries.find(
    (c) => c.code.toLowerCase() === filter.country.toLowerCase()
  );
  const cities = currentCountry ? currentCountry.cities : [];

  // Count active non-default filters
  const activeCount = useMemo(() => {
    let count = 0;
    if (filter.country !== 'all') count++;
    if (filter.city !== 'all') count++;
    if (filter.categoryId !== 'all') count++;
    if (filter.websiteStatus !== 'all') count++;
    if (filter.phoneStatus !== 'all') count++;
    if (filter.priorityTier !== 'all') count++;
    if (filter.minReviews > 0) count++;
    return count;
  }, [filter]);

  // Autocomplete / Suggested categories based on current searchQuery
  const searchSuggestions = useMemo(() => {
    if (!filter.searchQuery || filter.searchQuery.trim().length < 2) return [];
    return BusinessSearchEngine.getSuggestions(filter.searchQuery, 4);
  }, [filter.searchQuery]);

  // Quick preset filter buttons
  const quickPresets = [
    {
      id: 'preset-all',
      label: 'All Leads',
      icon: null,
      isActive:
        filter.websiteStatus === 'all' &&
        filter.priorityTier === 'all' &&
        filter.phoneStatus === 'all' &&
        filter.categoryId === 'all' &&
        !filter.searchQuery,
      apply: () =>
        onChange({
          websiteStatus: 'all',
          priorityTier: 'all',
          phoneStatus: 'all',
          categoryId: 'all',
          searchQuery: '',
        }),
    },
    {
      id: 'preset-no-web',
      label: 'No Website Listed (Prime Targets)',
      icon: Globe,
      color: 'text-rose-600',
      isActive: filter.websiteStatus === 'no_website',
      apply: () => onChange({ websiteStatus: 'no_website' }),
    },
    {
      id: 'preset-p-a',
      label: 'Priority A (75-100)',
      icon: Flame,
      color: 'text-emerald-600',
      isActive: filter.priorityTier === 'A',
      apply: () => onChange({ priorityTier: 'A' }),
    },
    {
      id: 'preset-phone-noweb',
      label: 'Direct Phone + No Website',
      icon: PhoneCall,
      color: 'text-blue-600',
      isActive: filter.websiteStatus === 'no_website' && filter.phoneStatus === 'available',
      apply: () => onChange({ websiteStatus: 'no_website', phoneStatus: 'available' }),
    },
    {
      id: 'preset-pharma-shortcut',
      label: 'Pharma & Healthcare',
      icon: Sparkles,
      color: 'text-purple-600',
      isActive: filter.searchQuery.toLowerCase() === 'pharma',
      apply: () => onChange({ searchQuery: 'pharma' }),
    },
    {
      id: 'preset-high-review',
      label: 'Established Reviews (30+)',
      icon: Star,
      color: 'text-amber-500',
      isActive: filter.minReviews === 30,
      apply: () => onChange({ minReviews: filter.minReviews === 30 ? 0 : 30 }),
    },
  ];

  // Active filter tags for chip display
  const activeChips = useMemo(() => {
    const chips: { id: string; label: string; onRemove: () => void }[] = [];
    if (filter.searchQuery.trim()) {
      chips.push({
        id: 'chip-query',
        label: `Keyword: "${filter.searchQuery}"`,
        onRemove: () => onChange({ searchQuery: '' }),
      });
    }
    if (filter.country !== 'all') {
      const c = supportedCountries.find((ct) => ct.code === filter.country);
      chips.push({
        id: 'chip-country',
        label: `Country: ${c?.name || filter.country}`,
        onRemove: () => onChange({ country: 'all', city: 'all' }),
      });
    }
    if (filter.city !== 'all') {
      chips.push({
        id: 'chip-city',
        label: `City: ${filter.city}`,
        onRemove: () => onChange({ city: 'all' }),
      });
    }
    if (filter.categoryId !== 'all') {
      const cat = businessCategories.find((c) => c.id === filter.categoryId);
      chips.push({
        id: 'chip-category',
        label: `Niche: ${cat?.name || filter.categoryId}`,
        onRemove: () => onChange({ categoryId: 'all' }),
      });
    }
    if (filter.websiteStatus !== 'all') {
      chips.push({
        id: 'chip-web',
        label: filter.websiteStatus === 'no_website' ? 'Missing Website' : 'Website Listed',
        onRemove: () => onChange({ websiteStatus: 'all' }),
      });
    }
    if (filter.priorityTier !== 'all') {
      chips.push({
        id: 'chip-priority',
        label: `Priority ${filter.priorityTier}`,
        onRemove: () => onChange({ priorityTier: 'all' }),
      });
    }
    return chips;
  }, [filter, onChange]);

  // Reusable Select Form Controls
  const renderFilterSelects = (isMobile: boolean) => (
    <div
      className={
        isMobile
          ? 'space-y-3'
          : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3'
      }
    >
      {/* 1. Country */}
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
          Country
        </label>
        <select
          value={filter.country}
          onChange={(e) => {
            const newCountry = e.target.value;
            onChange({ country: newCountry, city: 'all' });
          }}
          className={`w-full ${
            isMobile ? 'h-11 text-sm' : 'h-9 text-xs'
          } px-2.5 font-medium rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
        >
          <option value="all">Global (All Countries)</option>
          {supportedCountries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* 2. City / Metro Area */}
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
          City / Metro Area
        </label>
        <select
          value={filter.city}
          onChange={(e) => onChange({ city: e.target.value })}
          className={`w-full ${
            isMobile ? 'h-11 text-sm' : 'h-9 text-xs'
          } px-2.5 font-medium rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
        >
          <option value="all">All Cities</option>
          {cities.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name} ({city.region})
            </option>
          ))}
        </select>
      </div>

      {/* 3. Industry Category */}
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 truncate">
          Industry / Category ({businessCategories.length}+)
        </label>
        <select
          value={filter.categoryId}
          onChange={(e) => onChange({ categoryId: e.target.value })}
          className={`w-full ${
            isMobile ? 'h-11 text-sm' : 'h-9 text-xs'
          } px-2.5 font-medium rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all truncate`}
        >
          <option value="all">All Industries &amp; Niches</option>
          {industryGroups.map((group) => {
            const groupCats = businessCategories.filter((c) => c.industryGroup === group);
            if (groupCats.length === 0) return null;
            return (
              <optgroup key={group} label={`── ${group} ──`}>
                {groupCats.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </optgroup>
            );
          })}
        </select>
      </div>

      {/* 4. Website Presence */}
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
          Website Presence
        </label>
        <select
          value={filter.websiteStatus}
          onChange={(e) => onChange({ websiteStatus: e.target.value })}
          className={`w-full ${
            isMobile ? 'h-11 text-sm' : 'h-9 text-xs'
          } px-2.5 font-medium rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
        >
          <option value="all">Any Website Status</option>
          <option value="no_website">No Website Listed (Hot Lead)</option>
          <option value="has_website">Website Listed / Active</option>
          <option value="unknown">Status Unknown</option>
        </select>
      </div>

      {/* 5. Phone Reachability */}
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
          Phone Reachability
        </label>
        <select
          value={filter.phoneStatus}
          onChange={(e) => onChange({ phoneStatus: e.target.value })}
          className={`w-full ${
            isMobile ? 'h-11 text-sm' : 'h-9 text-xs'
          } px-2.5 font-medium rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
        >
          <option value="all">Any Phone Status</option>
          <option value="available">Verified Phone Available</option>
          <option value="missing">No Public Phone Listed</option>
        </select>
      </div>

      {/* 6. Opportunity Priority */}
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
          Opportunity Priority
        </label>
        <select
          value={filter.priorityTier}
          onChange={(e) => onChange({ priorityTier: e.target.value })}
          className={`w-full ${
            isMobile ? 'h-11 text-sm' : 'h-9 text-xs'
          } px-2.5 font-medium rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
        >
          <option value="all">All Tiers (A, B, C)</option>
          <option value="A">Priority A (75–100 Score)</option>
          <option value="B">Priority B (50–74 Score)</option>
          <option value="C">Priority C (&lt;50 Score)</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3.5 sm:p-4 space-y-3 sm:space-y-4 min-w-0">
      {/* ─────────────────────────────────────────────────────────────
          TOP ROW: Quick Presets (Horizontally Scrollable)
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100 min-w-0">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-full">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Presets:
          </span>
          {quickPresets.map((preset) => {
            const Icon = preset.icon;
            return (
              <button
                key={preset.id}
                onClick={preset.apply}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 min-h-[36px] sm:min-h-0 ${
                  preset.isActive
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {Icon && (
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      preset.isActive ? 'text-white' : preset.color
                    }`}
                  />
                )}
                <span className="whitespace-nowrap">{preset.label}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop Filter Logic & Reset */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
            <button
              onClick={() => onChange({ filterLogic: 'AND' })}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filter.filterLogic === 'AND'
                  ? 'bg-white shadow-xs text-slate-900 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Match ALL active filters simultaneously"
            >
              AND Logic
            </button>
            <button
              onClick={() => onChange({ filterLogic: 'OR' })}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filter.filterLogic === 'OR'
                  ? 'bg-white shadow-xs text-slate-900 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Match ANY active filter"
            >
              OR Logic
            </button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            title="Reset all filter parameters"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MOBILE EXPANDABLE TOGGLE BAR (< 768px)
          ───────────────────────────────────────────────────────────── */}
      <div className="md:hidden flex items-center justify-between gap-2 pt-1">
        <button
          type="button"
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className={`flex-1 flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-xs font-semibold min-h-[44px] transition-all ${
            isMobileFiltersOpen || activeCount > 0
              ? 'bg-blue-50/70 border-blue-200 text-blue-900'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>Detailed Filters</span>
            {activeCount > 0 && (
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {activeCount} active
              </span>
            )}
          </div>
          {isMobileFiltersOpen ? (
            <ChevronUp className="w-4 h-4 text-blue-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {/* Mobile Filter Logic Toggle */}
        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs shrink-0 h-11 items-center">
          <button
            onClick={() => onChange({ filterLogic: 'AND' })}
            className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              filter.filterLogic === 'AND'
                ? 'bg-white shadow-xs text-blue-600'
                : 'text-slate-500'
            }`}
          >
            AND
          </button>
          <button
            onClick={() => onChange({ filterLogic: 'OR' })}
            className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              filter.filterLogic === 'OR'
                ? 'bg-white shadow-xs text-blue-600'
                : 'text-slate-500'
            }`}
          >
            OR
          </button>
        </div>

        {/* Mobile Quick Reset Button */}
        <button
          type="button"
          onClick={onReset}
          className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
          title="Reset Filters"
          aria-label="Reset Filters"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MOBILE EXPANDED FILTER SECTION (< 768px)
          ───────────────────────────────────────────────────────────── */}
      {isMobileFiltersOpen && (
        <div className="md:hidden pt-2 pb-1 space-y-3.5 border-t border-slate-100 animate-in fade-in duration-200">
          {renderFilterSelects(true)}

          {/* Action Row at Bottom of Mobile Filter Drawer */}
          <div className="pt-2 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 min-h-[44px]"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={onReset}
            >
              Reset All
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="flex-1 min-h-[44px]"
              onClick={() => setIsMobileFiltersOpen(false)}
            >
              Apply ({totalMatches} Results)
            </Button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          DESKTOP FILTER DROPDOWNS GRID (>= 768px)
          ───────────────────────────────────────────────────────────── */}
      <div className="hidden md:block">
        {renderFilterSelects(false)}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          DYNAMIC SEARCH SUGGESTIONS & SYNONYM CHIPS
          ───────────────────────────────────────────────────────────── */}
      {searchSuggestions.length > 0 && (
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-600 flex items-center gap-1 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Suggestions:
          </span>
          {searchSuggestions.map((sug) => (
            <button
              key={sug.id}
              onClick={() => {
                if (sug.categoryId) {
                  onChange({ categoryId: sug.categoryId });
                }
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs transition-colors min-h-[32px]"
            >
              <span>{sug.label}</span>
              <span className="text-[10px] text-purple-400">({sug.subLabel})</span>
            </button>
          ))}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ACTIVE FILTER CHIPS BAR
          ───────────────────────────────────────────────────────────── */}
      {activeChips.length > 0 && (
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 shrink-0">
            <Tag className="w-3 h-3 text-slate-400" />
            Active:
          </span>
          {activeChips.map((chip) => (
            <span
              key={chip.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
            >
              <span className="truncate max-w-[180px]">{chip.label}</span>
              <button
                onClick={chip.onRemove}
                className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 min-h-[24px] min-w-[24px] flex items-center justify-center"
                aria-label={`Remove filter ${chip.label}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          <button
            onClick={onReset}
            className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold hover:underline ml-1 py-1"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};
