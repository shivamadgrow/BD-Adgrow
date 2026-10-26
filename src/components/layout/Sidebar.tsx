import React, { useEffect } from 'react';
import {
  Globe2,
  Kanban,
  Sparkles,
  Send,
  BarChart3,
  Database,
  Building2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  X,
} from 'lucide-react';

export type NavigationTab = 'discovery' | 'crm' | 'intelligence' | 'outreach' | 'analytics' | 'settings';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  counts: {
    totalBusinesses: number;
    crmLeads: number;
    highPriority: number;
  };
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  counts,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'discovery' as NavigationTab,
      label: 'Global Discovery',
      icon: Globe2,
      badge: counts.totalBusinesses,
    },
    {
      id: 'crm' as NavigationTab,
      label: 'Prospect CRM',
      icon: Kanban,
      badge: counts.crmLeads > 0 ? counts.crmLeads : undefined,
      badgeColor: 'bg-blue-500 text-white',
    },
    {
      id: 'intelligence' as NavigationTab,
      label: 'AI Intelligence Hub',
      icon: Sparkles,
      highlight: true,
    },
    {
      id: 'outreach' as NavigationTab,
      label: 'Sales Outreach',
      icon: Send,
    },
    {
      id: 'analytics' as NavigationTab,
      label: 'Agency Analytics',
      icon: BarChart3,
    },
    {
      id: 'settings' as NavigationTab,
      label: 'Data Providers & API',
      icon: Database,
    },
  ];

  // Prevent background scrolling and handle Escape key for mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen && onCloseMobile) {
        onCloseMobile();
      }
    };

    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMobileOpen, onCloseMobile]);

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. MOBILE DRAWER (< 768px): Backdrop + Slide-in Menu
          ───────────────────────────────────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />

      {/* Slide-in Mobile Drawer */}
      <aside
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] bg-[#070b19] border-r border-slate-800/90 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out md:hidden select-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        }`}
      >
        {/* Mobile Header with Logo & Prominent Close Button */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 bg-[#0b132b]/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold text-lg">
              AG
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-base tracking-tight">Ad Grow BD</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.2 rounded">
                  SaaS
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Opportunity Intelligence</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close navigation drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Active Agency Widget */}
        <div className="px-4 py-3 mx-3 my-3 rounded-lg bg-[#111c38]/70 border border-slate-800/80 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-medium text-slate-300">Active Agency</span>
          </div>
          <p className="text-xs font-semibold text-white truncate">Global Growth Media Ltd</p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>High-Priority Targets: {counts.highPriority}</span>
          </div>
        </div>

        {/* Mobile Scrollable Navigation Destination List */}
        <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium transition-all duration-150 min-h-[44px] ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-[#111c38]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : item.highlight ? 'text-amber-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      item.badgeColor || (isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-300')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile Bottom KPI Widget */}
        <div className="p-3 mx-3 mb-4 rounded-lg bg-gradient-to-br from-slate-900 to-[#111c38] border border-slate-800 shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Agency Pipeline</span>
            </span>
            <span className="text-emerald-400 font-semibold">+34%</span>
          </div>
          <div className="text-sm font-bold text-white">$48,500 / ₹40.2L</div>
          <p className="text-[10px] text-slate-400 mt-1">Identified deal opportunities</p>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          2. PERMANENT DESKTOP & TABLET SIDEBAR (>= 768px)
          ───────────────────────────────────────────────────────────── */}
      <aside
        className={`hidden md:flex fixed top-0 left-0 bottom-0 z-40 bg-[#070b19] border-r border-slate-800/80 flex-col transition-all duration-300 select-none ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 bg-[#0b132b]/60">
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold text-lg">
                AG
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-base tracking-tight">Ad Grow BD</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.2 rounded">
                    SaaS
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Opportunity Intelligence</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 mx-auto rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-bold text-lg">
              AG
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="flex p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Workspace Indicator */}
        {!isCollapsed && (
          <div className="px-4 py-3 mx-3 my-3 rounded-lg bg-[#111c38]/70 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-medium text-slate-300">Active Agency</span>
            </div>
            <p className="text-xs font-semibold text-white truncate">Global Growth Media Ltd</p>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>High-Priority Targets: {counts.highPriority}</span>
            </div>
          </div>
        )}

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-[#111c38]'
                } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : item.highlight ? 'text-amber-400' : 'text-slate-400'
                    }`}
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>

                {!isCollapsed && item.badge !== undefined && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      item.badgeColor || (isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-300')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom KPI Widget */}
        {!isCollapsed && (
          <div className="p-3 mx-3 mb-4 rounded-lg bg-gradient-to-br from-slate-900 to-[#111c38] border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Agency Pipeline</span>
              </span>
              <span className="text-emerald-400 font-semibold">+34%</span>
            </div>
            <div className="text-sm font-bold text-white">$48,500 / ₹40.2L</div>
            <p className="text-[10px] text-slate-400 mt-1">Identified deal opportunities</p>
          </div>
        )}
      </aside>
    </>
  );
};
