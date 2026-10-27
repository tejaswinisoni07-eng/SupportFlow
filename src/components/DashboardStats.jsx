import React from 'react';
import { 
  Inbox, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp,
  Flame,
  CheckCircle,
  FolderOpen
} from 'lucide-react';

export default function DashboardStats({ stats, selectedStatus, onSelectStatus }) {
  if (!stats) return null;

  const { total, statusCounts, priorityCounts, categoryCounts, urgentOrHighOpen, sampleCount, customCount } = stats;

  const openCount = statusCounts?.Open || 0;
  const inProgressCount = statusCounts?.['In Progress'] || 0;
  const resolvedCount = statusCounts?.Resolved || 0;
  const closedCount = statusCounts?.Closed || 0;
  const completedTotal = resolvedCount + closedCount;

  const resolutionRate = total > 0 ? Math.round((completedTotal / total) * 100) : 0;

  return (
    <div className="space-y-4 mb-6">
      {/* High Attention Urgent Banner if needed */}
      {urgentOrHighOpen > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-3.5 rounded-r-xl flex items-center justify-between text-amber-900 shadow-2xs">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-amber-100 rounded-lg text-amber-700">
              <Flame className="w-5 h-5 text-amber-600 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-semibold">
                High Priority Attention: {urgentOrHighOpen} {urgentOrHighOpen === 1 ? 'ticket requires' : 'tickets require'} immediate action
              </p>
              <p className="text-xs text-amber-700">
                Critical customer requests flagged as Urgent or High priority currently awaiting resolution.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectStatus('Open')}
            className="text-xs font-semibold px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-2xs"
          >
            Review Open
          </button>
        </div>
      )}

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Tickets */}
        <div 
          onClick={() => onSelectStatus('All')}
          className={`cursor-pointer bg-white p-4 sm:p-5 rounded-2xl border transition-all duration-200 shadow-2xs hover:shadow-md ${
            selectedStatus === 'All' ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-indigo-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-slate-500">Total Tickets</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Inbox className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{total}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              {sampleCount} sample · {customCount} custom
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Across all categories</p>
        </div>

        {/* Open Tickets */}
        <div 
          onClick={() => onSelectStatus('Open')}
          className={`cursor-pointer bg-white p-4 sm:p-5 rounded-2xl border transition-all duration-200 shadow-2xs hover:shadow-md ${
            selectedStatus === 'Open' ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 hover:border-blue-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-slate-500">Open Tickets</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-blue-600 tracking-tight">{openCount}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
              {total > 0 ? Math.round((openCount / total) * 100) : 0}% of queue
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Pending initial review</p>
        </div>

        {/* In Progress Tickets */}
        <div 
          onClick={() => onSelectStatus('In Progress')}
          className={`cursor-pointer bg-white p-4 sm:p-5 rounded-2xl border transition-all duration-200 shadow-2xs hover:shadow-md ${
            selectedStatus === 'In Progress' ? 'border-amber-600 ring-2 ring-amber-100' : 'border-slate-200 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-slate-500">In Progress</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-amber-600 tracking-tight">{inProgressCount}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">
              Active handling
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Agent assigned & investigating</p>
        </div>

        {/* Resolved & Closed Tickets */}
        <div 
          onClick={() => onSelectStatus('Resolved')}
          className={`cursor-pointer bg-white p-4 sm:p-5 rounded-2xl border transition-all duration-200 shadow-2xs hover:shadow-md ${
            selectedStatus === 'Resolved' || selectedStatus === 'Closed' ? 'border-emerald-600 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-slate-500">Resolved / Closed</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-600 tracking-tight">{completedTotal}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
              {resolutionRate}% solved
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{resolvedCount} resolved · {closedCount} closed</p>
        </div>
      </div>

      {/* Visual Status Breakdown Bar & Category Chips */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
          <div className="font-semibold text-slate-800 flex items-center space-x-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            <span>Workflow Queue Distribution</span>
          </div>
          <div className="flex items-center flex-wrap gap-3">
            <span className="inline-flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span>Open: {openCount}</span>
            </span>
            <span className="inline-flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>In Progress: {inProgressCount}</span>
            </span>
            <span className="inline-flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Resolved: {resolvedCount}</span>
            </span>
            <span className="inline-flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
              <span>Closed: {closedCount}</span>
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
          {total > 0 && (
            <>
              <div 
                style={{ width: `${(openCount / total) * 100}%` }} 
                className="bg-blue-500 transition-all duration-500" 
                title={`Open: ${openCount}`}
              />
              <div 
                style={{ width: `${(inProgressCount / total) * 100}%` }} 
                className="bg-amber-500 transition-all duration-500" 
                title={`In Progress: ${inProgressCount}`}
              />
              <div 
                style={{ width: `${(resolvedCount / total) * 100}%` }} 
                className="bg-emerald-500 transition-all duration-500" 
                title={`Resolved: ${resolvedCount}`}
              />
              <div 
                style={{ width: `${(closedCount / total) * 100}%` }} 
                className="bg-slate-400 transition-all duration-500" 
                title={`Closed: ${closedCount}`}
              />
            </>
          )}
        </div>

        {/* Categories summary */}
        {categoryCounts && Object.keys(categoryCounts).length > 0 && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Categories:</span>
            {Object.entries(categoryCounts).map(([cat, count]) => (
              <span 
                key={cat}
                className="text-2xs sm:text-xs px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium"
              >
                {cat}: <span className="font-bold text-slate-900">{count}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
