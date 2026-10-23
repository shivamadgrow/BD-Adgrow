import React from 'react';
import {
  Search,
  Download,
  Plus,
  Server,
  Bell,
  Sparkles,
  HelpCircle,
  ExternalLink,
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
}) => {
  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 z-30 flex items-center justify-between px-6 transition-all duration-300 ${
        isCollapsed ? 'left-20' : 'left-64'
      }`}
    >
      {/* Search Input */}
      <div className="relative w-72 sm:w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search business name, category, or city..."
          className="w-full h-9 pl-9 pr-4 rounded-lg bg-slate-100/80 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Provider Badge / Switcher */}
        <button
          onClick={onOpenProviderModal}
          className="hidden md:flex items-center gap-2 h-8 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 border border-slate-200/80 transition-colors"
          title="Click to view data provider configurations and API settings"
        >
          <Server className="w-3.5 h-3.5 text-blue-600" />
          <span className="max-w-[140px] truncate">{providerName}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </button>

        {/* Currency Switcher */}
        <button
          onClick={onCurrencyToggle}
          className="h-8 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 border border-slate-200/80 transition-colors"
          title="Toggle currency display between USD ($) and INR (₹)"
        >
          {currency === 'USD' ? 'USD ($)' : 'INR (₹)'}
        </button>

        {/* Export CSV Button */}
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Download className="w-3.5 h-3.5" />}
          onClick={onExportCSV}
          title="Export current filtered view to CSV spreadsheet"
        >
          Export
        </Button>

        {/* Add Prospect Button */}
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={onOpenNewBusinessModal}
        >
          Add Lead
        </Button>

        {/* Notifications & User Profile */}
        <div className="h-6 w-[1px] bg-slate-200 mx-1" />

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-900 to-blue-900 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-500/20">
            VS
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-tight">Vikram Sethi</p>
            <p className="text-[11px] text-slate-400 leading-tight">Agency BD Lead</p>
          </div>
        </div>
      </div>
    </header>
  );
};
