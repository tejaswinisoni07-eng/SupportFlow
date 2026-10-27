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

  const { total, statusCounts, priorityCounts, categoryCounts, urgentOrHighOpen } = stats;

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
              Active Desk
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
            <span className="text-xs sm:text-sm font-medium text-slate-500">In Progress Tickets</span>
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

        {/* Resolved Tickets */}
        <div 
          onClick={() => onSelectStatus('Resolved')}
          className={`cursor-pointer bg-white p-4 sm:p-5 rounded-2xl border transition-all duration-200 shadow-2xs hover:shadow-md ${
            selectedStatus === 'Resolved' || selectedStatus === 'Closed' ? 'border-emerald-600 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-slate-500">Resolved Tickets</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-600 tracking-tight">{resolvedCount}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
              {resolutionRate}% solved
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{resolvedCount} resolved ({closedCount} closed)</p>
        </div>
      </div>
    </div>
  );
}
