import React from 'react';
import { Business, CRMProspect } from '@/types';
import {
  BarChart3,
  TrendingUp,
  Globe,
  Phone,
  Flame,
  DollarSign,
  PieChart,
  Users,
  Target,
  CheckCircle2,
} from 'lucide-react';

interface AnalyticsDashboardProps {
  businesses: Business[];
  prospects: CRMProspect[];
  currency: 'USD' | 'INR';
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  businesses,
  prospects,
  currency,
}) => {
  const totalCount = businesses.length;
  const noWebsiteCount = businesses.filter(
    (b) => b.websiteStatus === 'not_listed' || b.websiteStatus === 'not_found'
  ).length;
  const verifiedPhoneCount = businesses.filter((b) => b.phoneStatus === 'available' && b.phone).length;
  const priorityACount = businesses.filter((b) => b.score.priority === 'A').length;

  const totalCrmValue = prospects.reduce((sum, p) => sum + (p.estimatedDealValue || 0), 0);
  const wonProspects = prospects.filter((p) => p.stage === 'won');
  const wonValue = wonProspects.reduce((sum, p) => sum + (p.estimatedDealValue || 0), 0);

  // Category breakdown
  const categoryMap: { [cat: string]: number } = {};
  businesses.forEach((b) => {
    categoryMap[b.category] = (categoryMap[b.category] || 0) + 1;
  });
  const topCategories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // City breakdown
  const cityMap: { [city: string]: number } = {};
  businesses.forEach((b) => {
    cityMap[b.location.city] = (cityMap[b.location.city] || 0) + 1;
  });
  const topCities = Object.entries(cityMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const formatCurrency = (amount: number) => {
    if (currency === 'USD') {
      return `$${amount.toLocaleString()}`;
    }
    return `₹${(amount * 83).toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Analyzed */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Businesses Discovered</span>
            <Globe className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">Multi-market verified POIs</p>
        </div>

        {/* Missing Website Ratio */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Missing Website (Gap)</span>
            <Target className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-600">
            {totalCount > 0 ? Math.round((noWebsiteCount / totalCount) * 100) : 0}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{noWebsiteCount} prime web dev prospects</p>
        </div>

        {/* Priority A High-Intent Leads */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Priority A Leads (Score 75+)</span>
            <Flame className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{priorityACount}</div>
          <p className="text-[11px] text-slate-500 mt-1">Immediate outreach recommended</p>
        </div>

        {/* CRM Pipeline Value */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-900 text-white shadow-xs">
          <div className="flex items-center justify-between text-xs text-blue-200 mb-1">
            <span>Active CRM Pipeline</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{formatCurrency(totalCrmValue)}</div>
          <p className="text-[11px] text-blue-200 mt-1">
            {prospects.length} prospects in active sales stages
          </p>
        </div>
      </div>

      {/* Charts & Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industry Category Opportunity Distribution */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <h4 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-blue-600" />
            Top Opportunity Industries
          </h4>
          <div className="space-y-3">
            {topCategories.map(([category, count]) => {
              const pct = Math.round((count / totalCount) * 100);
              return (
                <div key={category}>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span className="truncate max-w-[240px]">{category}</span>
                    <span className="font-semibold text-slate-900">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Metro Market Distribution */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <h4 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            Top Geographic Markets
          </h4>
          <div className="space-y-3">
            {topCities.map(([city, count]) => {
              const pct = Math.round((count / totalCount) * 100);
              return (
                <div key={city}>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>{city}</span>
                    <span className="font-semibold text-slate-900">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CRM Funnel Performance */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <h4 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          Agency CRM Conversion Funnel
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-center">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-xs text-slate-500">Qualified</div>
            <div className="text-lg font-bold text-slate-900">
              {prospects.filter((p) => p.stage === 'qualified').length}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-xs text-slate-500">Ready Outreach</div>
            <div className="text-lg font-bold text-slate-900">
              {prospects.filter((p) => p.stage === 'ready_for_outreach').length}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-xs text-slate-500">Contacted</div>
            <div className="text-lg font-bold text-slate-900">
              {prospects.filter((p) => p.stage === 'contacted').length}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-xs text-slate-500">Meetings Booked</div>
            <div className="text-lg font-bold text-slate-900">
              {prospects.filter((p) => p.stage === 'meeting_scheduled').length}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-xs text-slate-500">Proposals Sent</div>
            <div className="text-lg font-bold text-slate-900">
              {prospects.filter((p) => p.stage === 'proposal_sent').length}
            </div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="text-xs text-emerald-700 font-semibold">Closed Won 🎉</div>
            <div className="text-lg font-black text-emerald-800">
              {wonProspects.length} ({formatCurrency(wonValue)})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
