import React, { useState } from 'react';
import {
  Search,
  Download,
  Plus,
  Server,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currency: 'USD' | 'INR';
  onCurrencyToggle: () => void;
  onExportCSV: () => void;
  onOpenNewBusinessModal: () => void;
  providerName: string;
  onOpenProviderModal: () => void;
  isCollapsed: boolean;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  currency,
  onCurrencyToggle,
  onExportCSV,
  onOpenNewBusinessModal,
  providerName,
  onOpenProviderModal,
  isCollapsed,
  onToggleMobileMenu,
}) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 z-30 flex items-center justify-between px-3 sm:px-4 md:px-6 transition-all duration-300 left-0 ${
        isCollapsed ? 'md:left-20' : 'md:left-64'
      }`}
    >
      {/* ─────────────────────────────────────────────────────────────
          LEFT: Mobile Hamburger & Brand OR Desktop Search Bar
          ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 -ml-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Brand Identity */}
        <div className="flex md:hidden items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-xs font-bold text-xs shrink-0">
            AG
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-sm tracking-tight truncate">
                Ad Grow BD
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-200 px-1 py-0.2 rounded shrink-0">
                SaaS
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Global Search Input */}
        <div className="hidden md:block relative w-64 lg:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search business name, category, or city..."
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-slate-100/80 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              aria-label="Clear search input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT: Responsive Action Controls
          ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Mobile Search Toggle Button */}
        <button
          type="button"
          onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          className={`md:hidden p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
            isMobileSearchOpen || searchQuery
              ? 'bg-blue-50 text-blue-600'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          aria-label="Search businesses"
          title="Search businesses"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Desktop Provider Badge / Switcher */}
        <button
          onClick={onOpenProviderModal}
          className="hidden lg:flex items-center gap-2 h-8 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 border border-slate-200/80 transition-colors"
          title="Click to view data provider configurations and API settings"
        >
          <Server className="w-3.5 h-3.5 text-blue-600" />
          <span className="max-w-[130px] truncate">{providerName}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </button>

        {/* Currency Switcher */}
        <button
          onClick={onCurrencyToggle}
          className="h-8 px-2 sm:px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 border border-slate-200/80 transition-colors min-h-[36px] flex items-center justify-center"
          title="Toggle currency display between USD ($) and INR (₹)"
        >
          {currency === 'USD' ? 'USD ($)' : 'INR (₹)'}
        </button>

        {/* Export CSV Button (Hidden on very small screens, visible on tablet/desktop) */}
        <div className="hidden sm:block">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={onExportCSV}
            title="Export current filtered view to CSV spreadsheet"
          >
            Export
          </Button>
        </div>

        {/* Add Prospect / Lead Button */}
        <div className="hidden sm:block">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={onOpenNewBusinessModal}
          >
            Add Lead
          </Button>
        </div>
        <button
          type="button"
          onClick={onOpenNewBusinessModal}
          className="sm:hidden p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center shadow-xs"
          title="Add New Lead"
          aria-label="Add New Lead"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* User Profile Avatar */}
        <div className="h-6 w-[1px] bg-slate-200 mx-0.5 sm:mx-1 hidden xs:block" />

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-900 to-blue-900 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-500/20 shrink-0">
            VS
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-tight">Vikram Sethi</p>
            <p className="text-[11px] text-slate-400 leading-tight">Agency BD Lead</p>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MOBILE EXPANDABLE SEARCH BAR OVERLAY
          ───────────────────────────────────────────────────────────── */}
      {isMobileSearchOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 p-3 shadow-lg md:hidden z-20 flex items-center gap-2 animate-in slide-in-from-top-2 duration-150">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search business name, category, or city..."
              className="w-full h-10 pl-9 pr-8 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                aria-label="Clear search query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(false)}
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 min-h-[40px] flex items-center justify-center shrink-0"
          >
            Done
          </button>
        </div>
      )}
    </header>
  );
};
