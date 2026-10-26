'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Business,
  FilterState,
  CRMProspect,
  PipelineStage,
} from '@/types';
import {
  fetchProspects,
  addBusinessToCRM,
  updateProspectStage,
  addProspectNote,
  toggleProspectTask,
} from '@/lib/api/crm-client';
import { Sidebar, NavigationTab } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { FilterBar } from '@/components/discovery/FilterBar';
import { BusinessTable } from '@/components/discovery/BusinessTable';
import { BusinessCardGrid } from '@/components/discovery/BusinessCardGrid';
import { BusinessMapView } from '@/components/discovery/BusinessMapView';
import { AuditModal } from '@/components/audit/AuditModal';
import { AIReportModal } from '@/components/ai/AIReportModal';
import { CRMKanbanView } from '@/components/crm/CRMKanbanView';
import { ProspectDrawer } from '@/components/crm/ProspectDrawer';
import { SalesAssistantModal } from '@/components/outreach/SalesAssistantModal';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { ProviderConfigModal } from '@/components/settings/ProviderConfigModal';
import { NewBusinessModal } from '@/components/discovery/NewBusinessModal';
import { Button } from '@/components/ui/Button';
import {
  LayoutList,
  LayoutGrid,
  Map,
  Sparkles,
  Kanban,
  Download,
  Filter,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Info,
} from 'lucide-react';

export default function HomePage() {
  // Navigation & View Mode
  const [currentTab, setCurrentTab] = useState<NavigationTab>('discovery');
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'map'>('table');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'INR'>('INR');

  // Auto-collapse sidebar on tablet / small desktop screens to give maximum room
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Master State
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [searchMeta, setSearchMeta] = useState<{ totalCount: number; latencyMs: number } | null>(null);
  const [prospects, setProspects] = useState<CRMProspect[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [providerError, setProviderError] = useState<string | null>(null);

  // Filter State
  const initialFilterState: FilterState = {
    country: 'all',
    city: 'all',
    categoryId: 'all',
    searchQuery: '',
    websiteStatus: 'all',
    phoneStatus: 'all',
    minRating: 0,
    minReviews: 0,
    minScore: 0,
    priorityTier: 'all',
    filterLogic: 'AND',
    sortBy: 'score',
    sortOrder: 'desc',
  };
  const [filter, setFilter] = useState<FilterState>(initialFilterState);

  // Active Modals & Selected Objects
  const [selectedAuditBiz, setSelectedAuditBiz] = useState<Business | null>(null);
  const [selectedAIBiz, setSelectedAIBiz] = useState<Business | null>(null);
  const [selectedCRMProspect, setSelectedCRMProspect] = useState<CRMProspect | null>(null);
  const [selectedOutreachBiz, setSelectedOutreachBiz] = useState<Business | null>(null);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [isNewBizModalOpen, setIsNewBizModalOpen] = useState(false);

  // Load CRM prospects from MongoDB on client mount (server seeds demo data on first run)
  useEffect(() => {
    fetchProspects()
      .then(setProspects)
      .catch((err) => console.error('Failed to load CRM prospects', err));
  }, []);

  // Search: always read saved MongoDB businesses (no key needed), and merge in
  // live Google Places results too whenever an API key is configured.
  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoadingSearch(true);
      setProviderError(null);

      const filterBody = { ...filter, query: filter.searchQuery };

      const savedPromise = fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filterBody),
      })
        .then((res) => res.json())
        .then((data) => (data.success ? (data.businesses as Business[]) : []))
        .catch(() => []);

      const storedKey = typeof window !== 'undefined' ? localStorage.getItem('adgrow_google_api_key') || '' : '';
      const livePromise = storedKey
        ? fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...filterBody, googleApiKey: storedKey }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (!data.success) {
                setProviderError(data.message || 'Google Places API query failed.');
                return [];
              }
              return data.businesses as Business[];
            })
            .catch((err) => {
              setProviderError(err.message || 'Failed to reach the live search API.');
              return [];
            })
        : Promise.resolve([] as Business[]);

      const [saved, live] = await Promise.all([savedPromise, livePromise]);

      const combined = [...saved];
      const existingIds = new Set(saved.map((b) => b.id));
      for (const b of live) {
        if (!existingIds.has(b.id)) combined.push(b);
      }

      setFilteredBusinesses(combined);
      setSearchMeta({ totalCount: combined.length, latencyMs: 0 });
      setBusinesses((prev) => {
        const prevIds = new Set(prev.map((b) => b.id));
        const newOnes = combined.filter((b) => !prevIds.has(b.id));
        return newOnes.length > 0 ? [...prev, ...newOnes] : prev;
      });
      setIsLoadingSearch(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [filter]);

  // Derived set of CRM business IDs
  const crmBusinessIds = useMemo(() => new Set(prospects.map((p) => p.businessId)), [prospects]);

  // CRM Handlers
  const handleAddToCRM = async (business: Business) => {
    try {
      const newProspect = await addBusinessToCRM(business, 'qualified', 'website_development', 1800, 'USD');
      setProspects((prev) => [newProspect, ...prev.filter((p) => p.id !== newProspect.id)]);
    } catch (err) {
      console.error('Failed to add business to CRM', err);
    }
  };

  const handleUpdateStage = async (prospectId: string, stage: PipelineStage) => {
    try {
      const updated = await updateProspectStage(prospectId, stage);
      setProspects((prev) => prev.map((p) => (p.id === prospectId ? updated : p)));
      setSelectedCRMProspect((prev) => (prev?.id === prospectId ? updated : prev));
    } catch (err) {
      console.error('Failed to update prospect stage', err);
    }
  };

  const handleAdvanceStage = (
    prospectId: string,
    currentStage: PipelineStage,
    direction: 'forward' | 'backward'
  ) => {
    const stagesOrder: PipelineStage[] = [
      'qualified',
      'ready_for_outreach',
      'contacted',
      'interested',
      'meeting_scheduled',
      'proposal_sent',
      'won',
    ];
    const currentIndex = stagesOrder.indexOf(currentStage);
    if (currentIndex === -1) return;

    const nextIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= 0 && nextIndex < stagesOrder.length) {
      handleUpdateStage(prospectId, stagesOrder[nextIndex]);
    }
  };

  const handleAddNote = async (prospectId: string, note: string) => {
    try {
      const updated = await addProspectNote(prospectId, note);
      setProspects((prev) => prev.map((p) => (p.id === prospectId ? updated : p)));
      setSelectedCRMProspect((prev) => (prev?.id === prospectId ? updated : prev));
    } catch (err) {
      console.error('Failed to add note', err);
    }
  };

  const handleToggleTask = async (prospectId: string, taskId: string) => {
    try {
      const updated = await toggleProspectTask(prospectId, taskId);
      setProspects((prev) => prev.map((p) => (p.id === prospectId ? updated : p)));
      setSelectedCRMProspect((prev) => (prev?.id === prospectId ? updated : prev));
    } catch (err) {
      console.error('Failed to toggle task', err);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Business Name',
      'Category',
      'Country',
      'City',
      'Address',
      'Phone',
      'Phone Status',
      'Website',
      'Website Status',
      'Rating',
      'Review Count',
      'Opportunity Score',
      'Priority Tier',
      'Top Opportunity',
    ];

    const rows = filteredBusinesses.map((b) => [
      `"${b.id}"`,
      `"${b.name.replace(/"/g, '""')}"`,
      `"${b.category}"`,
      `"${b.location.countryName}"`,
      `"${b.location.city}"`,
      `"${b.formattedAddress.replace(/"/g, '""')}"`,
      `"${b.phone || ''}"`,
      `"${b.phoneStatus}"`,
      `"${b.website || ''}"`,
      `"${b.websiteStatus}"`,
      b.rating || 0,
      b.reviewCount || 0,
      b.score.totalScore,
      `"${b.score.priority}"`,
      `"${(b.opportunities[0]?.title || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ad-grow-bd-prospects-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-x-hidden">
      {/* Responsive Sidebar Navigation (Mobile Drawer + Collapsible Desktop) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setIsMobileMenuOpen(false);
        }}
        counts={{
          totalBusinesses: businesses.length,
          crmLeads: prospects.length,
          highPriority: businesses.filter((b) => b.score.priority === 'A').length,
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Workspace (pl-0 on mobile, md:pl-20/md:pl-64 on desktop) */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 w-full max-w-full min-w-0 pl-0 ${
          isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        {/* Top Header */}
        <Header
          searchQuery={filter.searchQuery}
          onSearchChange={(q) => setFilter((prev) => ({ ...prev, searchQuery: q }))}
          currency={currency}
          onCurrencyToggle={() => setCurrency((c) => (c === 'USD' ? 'INR' : 'USD'))}
          onExportCSV={handleExportCSV}
          onOpenNewBusinessModal={() => setIsNewBizModalOpen(true)}
          providerName="MongoDB + Google Places"
          onOpenProviderModal={() => setIsProviderModalOpen(true)}
          isCollapsed={isSidebarCollapsed}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        {/* Page Content Container */}
        <main className="flex-1 p-3.5 sm:p-5 md:p-6 pt-18 md:pt-20 space-y-4 sm:space-y-6 max-w-[1720px] w-full mx-auto min-w-0 overflow-x-hidden">
          {/* TAB 1: Global Discovery Engine */}
          {currentTab === 'discovery' && (
            <div className="space-y-4 sm:space-y-6 min-w-0">
              {/* Page Header & View Switchers */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Business Discovery
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Discover businesses worldwide, detect observable digital presence gaps, and qualify high-intent sales opportunities.
                  </p>
                </div>

                {/* View Mode Buttons (Table / Cards / Map) */}
                <div className="grid grid-cols-3 sm:inline-flex rounded-lg border border-slate-200 p-0.5 bg-white shadow-2xs shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-md text-xs font-semibold transition-colors min-h-[38px] sm:min-h-0 ${
                      viewMode === 'table' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LayoutList className="w-3.5 h-3.5" />
                    <span>Table View</span>
                  </button>
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-md text-xs font-semibold transition-colors min-h-[38px] sm:min-h-0 ${
                      viewMode === 'cards' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Card Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-md text-xs font-semibold transition-colors min-h-[38px] sm:min-h-0 ${
                      viewMode === 'map' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Map className="w-3.5 h-3.5" />
                    <span>Map View</span>
                  </button>
                </div>
              </div>

              {/* Advanced Multi-Filter Bar with Suggestions */}
              <FilterBar
                filter={filter}
                onChange={(updated) => setFilter((prev) => ({ ...prev, ...updated }))}
                onReset={() => setFilter(initialFilterState)}
                totalMatches={filteredBusinesses.length}
              />

              {/* Live Search Telemetry Bar */}
              {searchMeta && (
                <div className="p-3 bg-purple-50/70 border border-purple-200/80 rounded-xl flex items-center justify-between text-xs flex-wrap gap-2 text-purple-900">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Saved leads from MongoDB{typeof window !== 'undefined' && localStorage.getItem('adgrow_google_api_key') ? ' + live Google Places results' : ''}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-purple-600 font-mono">
                    <span>Matched: {searchMeta.totalCount}</span>
                  </div>
                </div>
              )}

              {/* Provider Notice / Error Banner (if any) */}
              {providerError && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{providerError} (saved MongoDB leads are unaffected)</span>
                  </div>
                  <button
                    onClick={() => setIsProviderModalOpen(true)}
                    className="font-bold underline text-amber-800 hover:text-amber-950 text-[11px]"
                  >
                    Configure API Key
                  </button>
                </div>
              )}

              {/* Results Status Header */}
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>
                  Showing <strong className="text-slate-900 font-bold">{filteredBusinesses.length}</strong> matching businesses
                  {filter.websiteStatus === 'no_website' && ' (Filtered by: No Website Listed)'}
                  {filter.priorityTier !== 'all' && ` (Priority ${filter.priorityTier})`}
                </span>
                <span className="text-[11px] text-slate-400">Data Providers: MongoDB + Google Places API</span>
              </div>

              {/* View Components */}
              {viewMode === 'table' && (
                <BusinessTable
                  businesses={filteredBusinesses}
                  onOpenAudit={(b) => setSelectedAuditBiz(b)}
                  onOpenAIReport={(b) => setSelectedAIBiz(b)}
                  onAddToCRM={handleAddToCRM}
                  onOpenSalesOutreach={(b) => setSelectedOutreachBiz(b)}
                  crmBusinessIds={crmBusinessIds}
                  currency={currency}
                  currentFilter={filter}
                  onResetFilters={() => setFilter(initialFilterState)}
                  onApplyCategorySuggestion={(catId) => setFilter((prev) => ({ ...prev, categoryId: catId }))}
                  onSwitchToOrLogic={() => setFilter((prev) => ({ ...prev, filterLogic: 'OR' }))}
                />
              )}

              {viewMode === 'cards' && (
                <BusinessCardGrid
                  businesses={filteredBusinesses}
                  onOpenAudit={(b) => setSelectedAuditBiz(b)}
                  onOpenAIReport={(b) => setSelectedAIBiz(b)}
                  onAddToCRM={handleAddToCRM}
                  crmBusinessIds={crmBusinessIds}
                  currency={currency}
                />
              )}

              {viewMode === 'map' && (
                <BusinessMapView
                  businesses={filteredBusinesses}
                  onOpenAIReport={(b) => setSelectedAIBiz(b)}
                  onAddToCRM={handleAddToCRM}
                  crmBusinessIds={crmBusinessIds}
                  currency={currency}
                />
              )}
            </div>
          )}

          {/* TAB 2: CRM Pipeline */}
          {currentTab === 'crm' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Kanban className="w-6 h-6 text-blue-600" />
                    <span>Prospect Management CRM Pipeline</span>
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage qualification stages, follow-up reminders, outreach history, and closed deals.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<TrendingUp className="w-3.5 h-3.5" />}
                  onClick={() => setCurrentTab('discovery')}
                >
                  Discover More Leads
                </Button>
              </div>

              {/* Kanban Pipeline Board */}
              <CRMKanbanView
                prospects={prospects}
                onSelectProspect={(p) => setSelectedCRMProspect(p)}
                onAdvanceStage={handleAdvanceStage}
                currency={currency}
              />
            </div>
          )}

          {/* TAB 3: AI Intelligence Hub */}
          {currentTab === 'intelligence' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                  <span>AI Business Intelligence &amp; Playbook Hub</span>
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Empirical research dossiers, evidence-backed digital presence gaps, and verified sales playbooks.
                </p>
              </div>

              {/* Grid of All Businesses with 1-Click AI Dossier */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {businesses.map((biz) => (
                  <div
                    key={biz.id}
                    className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          Score: {biz.score.totalScore}/100
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{biz.location.city}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base">{biz.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{biz.category}</p>
                      <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700">
                        <span className="font-semibold block text-slate-900">
                          Recommended Pitch:
                        </span>
                        {biz.opportunities[0]?.recommendedPitch || 'Website development and Google Maps optimization.'}
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <Button
                        variant="navy"
                        className="w-full text-xs"
                        leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                        onClick={() => setSelectedAIBiz(biz)}
                      >
                        Generate Structured Dossier
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Sales Outreach Assistant */}
          {currentTab === 'outreach' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Agency Sales Outreach &amp; Pitch Assistant
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Deploy high-converting Cold Emails, Phone Scripts, WhatsApp messages, and Proposal outlines for active prospects.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {businesses.map((biz) => (
                  <div
                    key={biz.id}
                    className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{biz.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {biz.location.city} • {biz.category}
                      </p>
                      <div className="mt-3 text-xs text-slate-600">
                        {biz.phone ? `Phone: ${biz.phone}` : 'No public phone listed'}
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <Button
                        variant="primary"
                        className="w-full text-xs"
                        onClick={() => setSelectedOutreachBiz(biz)}
                      >
                        Open Sales Assistant &amp; Drafts
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Agency Analytics */}
          {currentTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Agency Executive Intelligence &amp; Funnel Analytics
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Source-backed digital presence statistics, category distribution, and CRM revenue conversions.
                </p>
              </div>
              <AnalyticsDashboard
                businesses={businesses}
                prospects={prospects}
                currency={currency}
              />
            </div>
          )}

          {/* TAB 6: Settings / Data Providers */}
          {currentTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Data Provider Governance &amp; Integrations
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Manage provider endpoints, Google Places API credentials, and rate limits.
                </p>
              </div>
              <div className="max-w-2xl bg-white p-6 rounded-xl border border-slate-200">
                <Button
                  variant="primary"
                  onClick={() => setIsProviderModalOpen(true)}
                >
                  Configure Authorized Data Providers
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ALL INTERACTIVE MODALS */}
      {/* 1. Website Audit Modal */}
      <AuditModal
        business={selectedAuditBiz}
        isOpen={!!selectedAuditBiz}
        onClose={() => setSelectedAuditBiz(null)}
        onAddToCRM={handleAddToCRM}
        inCrm={selectedAuditBiz ? crmBusinessIds.has(selectedAuditBiz.id) : false}
        currency={currency}
      />

      {/* 2. AI Intelligence Report Modal */}
      <AIReportModal
        business={selectedAIBiz}
        isOpen={!!selectedAIBiz}
        onClose={() => setSelectedAIBiz(null)}
        onAddToCRM={handleAddToCRM}
        inCrm={selectedAIBiz ? crmBusinessIds.has(selectedAIBiz.id) : false}
      />

      {/* 3. CRM Prospect Detail Drawer / Modal */}
      <ProspectDrawer
        prospect={selectedCRMProspect}
        isOpen={!!selectedCRMProspect}
        onClose={() => setSelectedCRMProspect(null)}
        onUpdateStage={handleUpdateStage}
        onAddNote={handleAddNote}
        onToggleTask={handleToggleTask}
        onOpenAIReport={(p) => setSelectedAIBiz(p.business)}
        currency={currency}
      />

      {/* 4. Sales Outreach Assistant Modal */}
      <SalesAssistantModal
        business={selectedOutreachBiz}
        isOpen={!!selectedOutreachBiz}
        onClose={() => setSelectedOutreachBiz(null)}
        currency={currency}
      />

      {/* 5. Data Provider Governance Modal */}
      <ProviderConfigModal
        isOpen={isProviderModalOpen}
        onClose={() => setIsProviderModalOpen(false)}
      />

      {/* 6. Manual Business Indexing Modal */}
      <NewBusinessModal
        isOpen={isNewBizModalOpen}
        onClose={() => setIsNewBizModalOpen(false)}
        onAddBusiness={(newBiz, addToCrmDirectly) => {
          setBusinesses((prev) => [newBiz, ...prev]);
          setFilteredBusinesses((prev) => [newBiz, ...prev]);
          if (addToCrmDirectly) {
            handleAddToCRM(newBiz);
          }
        }}
      />
    </div>
  );
}
