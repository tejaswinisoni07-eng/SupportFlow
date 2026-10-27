import React from 'react';
import { 
  BarChart3, 
  PieChart, 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert,
  TrendingUp,
  Inbox
} from 'lucide-react';
import { getSlaInfo } from '../utils/sla';

export default function AnalyticsCharts({ tickets = [] }) {
  if (!tickets || tickets.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-2xs text-center mb-6">
        <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl mx-auto flex items-center justify-center mb-3">
          <BarChart3 className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-800">No Analytics Data Available</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          No tickets currently match the view. Charts will automatically render when tickets are created or loaded.
        </p>
      </div>
    );
  }

  const total = tickets.length;

  // 1. Group by Status (calculated from ticket records)
  const statusCounts = {
    Open: 0,
    'In Progress': 0,
    Resolved: 0,
    Closed: 0,
  };
  tickets.forEach(t => {
    if (statusCounts[t.status] !== undefined) {
      statusCounts[t.status]++;
    } else {
      statusCounts[t.status] = 1;
    }
  });

  // 2. Group by Priority (calculated from ticket records)
  const priorityCounts = {
    Urgent: 0,
    High: 0,
    Medium: 0,
    Low: 0,
  };
  tickets.forEach(t => {
    if (priorityCounts[t.priority] !== undefined) {
      priorityCounts[t.priority]++;
    } else {
      priorityCounts[t.priority] = 1;
    }
  });

  // 3. Group by SLA status
  const slaCounts = {
    onTrack: 0,
    approaching: 0,
    overdue: 0,
    met: 0,
  };
  tickets.forEach(t => {
    const info = getSlaInfo(t);
    if (info.status === 'overdue' || info.status === 'breached') slaCounts.overdue++;
    else if (info.status === 'approaching') slaCounts.approaching++;
    else if (info.status === 'met') slaCounts.met++;
    else if (info.status === 'on_track') slaCounts.onTrack++;
  });

  const statusColors = {
    Open: { bg: 'bg-blue-500', text: 'text-blue-700', badge: 'bg-blue-50 border-blue-200' },
    'In Progress': { bg: 'bg-amber-500', text: 'text-amber-700', badge: 'bg-amber-50 border-amber-200' },
    Resolved: { bg: 'bg-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-50 border-emerald-200' },
    Closed: { bg: 'bg-slate-400', text: 'text-slate-700', badge: 'bg-slate-100 border-slate-200' },
  };

  const priorityColors = {
    Urgent: { bg: 'bg-rose-500', text: 'text-rose-700', badge: 'bg-rose-50 border-rose-200' },
    High: { bg: 'bg-amber-500', text: 'text-amber-700', badge: 'bg-amber-50 border-amber-200' },
    Medium: { bg: 'bg-blue-500', text: 'text-blue-700', badge: 'bg-blue-50 border-blue-200' },
    Low: { bg: 'bg-slate-400', text: 'text-slate-600', badge: 'bg-slate-100 border-slate-200' },
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs mb-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Live Ticket Analytics & Distribution</h3>
            <p className="text-xs text-slate-500">Calculated in real-time from active ticket records ({total} total)</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg">
          Live Sync Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* CHART 1: Grouped by Status */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
                <PieChart className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                Tickets by Status
              </span>
              <span className="text-2xs font-semibold text-slate-500">{total} tickets</span>
            </div>

            {/* Visual Multi-Segment Bar */}
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex mb-3 shadow-inner">
              {Object.entries(statusCounts).map(([st, count]) => {
                if (count === 0) return null;
                const pct = (count / total) * 100;
                return (
                  <div
                    key={st}
                    style={{ width: `${pct}%` }}
                    className={`${statusColors[st]?.bg || 'bg-slate-400'} transition-all duration-300`}
                    title={`${st}: ${count} (${Math.round(pct)}%)`}
                  />
                );
              })}
            </div>

            {/* Status Breakdown Legend & Counts */}
            <div className="space-y-2">
              {Object.entries(statusCounts).map(([st, count]) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={st} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${statusColors[st]?.bg || 'bg-slate-400'}`}></span>
                      <span className="text-slate-700 font-medium">{st}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">{count}</span>
                      <span className="text-2xs text-slate-400 w-8 text-right">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CHART 2: Grouped by Priority */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
                <Flame className="w-3.5 h-3.5 mr-1.5 text-rose-500" />
                Tickets by Priority
              </span>
              <span className="text-2xs font-semibold text-slate-500">Severity Balance</span>
            </div>

            {/* Visual Priority Bars */}
            <div className="space-y-2.5 pt-1">
              {Object.entries(priorityCounts).map(([pr, count]) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={pr} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{pr}</span>
                      <span className="text-slate-900 font-bold">
                        {count} <span className="text-2xs font-normal text-slate-400">({pct}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className={`h-full ${priorityColors[pr]?.bg || 'bg-slate-400'} rounded-full transition-all duration-300`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CHART 3: SLA Deadline Tracking */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                SLA Compliance & Deadlines
              </span>
              <span className="text-2xs font-semibold text-slate-500">Service Targets</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-center">
                <span className="text-xs text-rose-600 font-semibold block">Overdue</span>
                <span className="text-lg font-bold text-slate-900">{slaCounts.overdue}</span>
                <span className="text-3xs text-slate-400 block">Needs escalation</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-center">
                <span className="text-xs text-amber-600 font-semibold block">Approaching</span>
                <span className="text-lg font-bold text-slate-900">{slaCounts.approaching}</span>
                <span className="text-3xs text-slate-400 block">&lt; 4 hours left</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-center">
                <span className="text-xs text-blue-600 font-semibold block">On Track</span>
                <span className="text-lg font-bold text-slate-900">{slaCounts.onTrack}</span>
                <span className="text-3xs text-slate-400 block">Within target</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-center">
                <span className="text-xs text-emerald-600 font-semibold block">SLA Met</span>
                <span className="text-lg font-bold text-slate-900">{slaCounts.met}</span>
                <span className="text-3xs text-slate-400 block">Resolved in time</span>
              </div>
            </div>

            <p className="text-3xs text-slate-500 mt-3 text-center">
              Target policy: Urgent (4h), High (24h), Medium (48h), Low (72h)
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
