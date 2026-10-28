import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Users,
  ShieldCheck,
  TrendingUp,
  Inbox
} from 'lucide-react';
import { getSlaInfo } from '../utils/sla';

export default function AnalyticsCharts({ tickets = [] }) {
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'agents'

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

  // 1. Group by Status (calculated from actual ticket records)
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

  // 2. Group by Priority (calculated from actual ticket records)
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
    if (info.status === 'overdue') slaCounts.overdue++;
    else if (info.status === 'approaching') slaCounts.approaching++;
    else if (info.status === 'met') slaCounts.met++;
    else if (info.status === 'on_track') slaCounts.onTrack++;
  });

  // 4. Agent Performance Summary (strictly computed from real data)
  const agentMap = {};
  tickets.forEach(t => {
    const agent = (t.assignedTo || 'Unassigned').trim();
    if (!agentMap[agent]) {
      agentMap[agent] = {
        agentName: agent,
        assignedCount: 0,
        resolvedCount: 0,
        totalResolutionTimeMs: 0,
        resolvedWithTimeCount: 0,
      };
    }
    agentMap[agent].assignedCount++;

    if (t.status === 'Resolved' || t.status === 'Closed') {
      agentMap[agent].resolvedCount++;
      if (t.createdAt && t.updatedAt) {
        const createdMs = new Date(t.createdAt).getTime();
        const resolvedMs = new Date(t.updatedAt).getTime();
        if (resolvedMs > createdMs) {
          agentMap[agent].totalResolutionTimeMs += (resolvedMs - createdMs);
          agentMap[agent].resolvedWithTimeCount++;
        }
      }
    }
  });

  const agentPerformance = Object.values(agentMap).sort((a, b) => b.assignedCount - a.assignedCount);

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
      {/* Header with Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Live Ticket Analytics & Distribution</h3>
            <p className="text-xs text-slate-500">Calculated in real-time from active ticket records ({total} total)</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 border border-slate-200 text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('queue')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
              activeTab === 'queue'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Queue Analytics</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('agents')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
              activeTab === 'agents'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Agent Performance</span>
          </button>
        </div>
      </div>

      {activeTab === 'queue' ? (
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
                  SLA Service Level Performance
                </span>
                <span className="text-2xs font-semibold text-slate-500">Queue Health</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-center">
                  <span className="text-xs text-rose-600 font-semibold block">Overdue</span>
                  <span className="text-lg font-bold text-slate-900">{slaCounts.overdue}</span>
                  <span className="text-3xs text-slate-400 block">Immediate action</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-center">
                  <span className="text-xs text-amber-600 font-semibold block">Due Soon</span>
                  <span className="text-lg font-bold text-slate-900">{slaCounts.approaching}</span>
                  <span className="text-3xs text-slate-400 block">&lt; 4 hours remaining</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-center">
                  <span className="text-xs text-blue-600 font-semibold block">On Track</span>
                  <span className="text-lg font-bold text-slate-900">{slaCounts.onTrack}</span>
                  <span className="text-3xs text-slate-400 block">Healthy window</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-center">
                  <span className="text-xs text-emerald-600 font-semibold block">SLA Met</span>
                  <span className="text-lg font-bold text-slate-900">{slaCounts.met}</span>
                  <span className="text-3xs text-slate-400 block">Resolved in target</span>
                </div>
              </div>

              <p className="text-3xs text-slate-500 mt-3 text-center">
                Thresholds: Urgent (4h), High (24h), Medium (48h), Low (72h)
              </p>
            </div>
          </div>

        </div>
      ) : (
        /* TAB 2: AGENT PERFORMANCE SUMMARY (Strictly calculated from real data) */
        <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Agent Workload & Resolution Metrics
              </span>
            </div>
            <span className="text-2xs text-slate-500">
              Computed strictly from active ticket records · No synthetic figures
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-3xs">
                <tr>
                  <th className="py-2.5 px-4">Agent Name</th>
                  <th className="py-2.5 px-4 text-center">Assigned Tickets</th>
                  <th className="py-2.5 px-4 text-center">Resolved Tickets</th>
                  <th className="py-2.5 px-4 text-center">Resolution Rate</th>
                  <th className="py-2.5 px-4">Avg Resolution Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                {agentPerformance.map((agent) => {
                  const rate = agent.assignedCount > 0 
                    ? Math.round((agent.resolvedCount / agent.assignedCount) * 100) 
                    : 0;

                  let avgTimeDisplay;
                  if (agent.resolvedWithTimeCount > 0) {
                    const avgMs = agent.totalResolutionTimeMs / agent.resolvedWithTimeCount;
                    const mins = Math.round(avgMs / 60000);
                    const hrs = Math.floor(mins / 60);
                    const remMins = mins % 60;
                    avgTimeDisplay = (
                      <span className="font-semibold text-slate-900">
                        {hrs > 0 ? `${hrs}h ${remMins}m` : `${remMins}m`}
                        <span className="text-3xs text-slate-400 font-normal ml-1">({agent.resolvedWithTimeCount} verified)</span>
                      </span>
                    );
                  } else {
                    avgTimeDisplay = (
                      <span className="text-slate-400 text-3xs italic">
                        N/A (No resolved tickets with verified duration)
                      </span>
                    );
                  }

                  return (
                    <tr key={agent.agentName} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900 flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                          {agent.agentName.charAt(0)}
                        </div>
                        <span>{agent.agentName}</span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-900">
                        {agent.assignedCount}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600">
                        {agent.resolvedCount}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded text-3xs font-semibold ${
                          rate >= 50 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {rate}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {avgTimeDisplay}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
