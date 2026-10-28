import React from 'react';
import { 
  Flame, 
  AlertTriangle, 
  MessageSquare, 
  ChevronRight, 
  Clock, 
  CheckCircle,
  CheckCircle2,
  Eye,
  Pencil,
  RotateCw
} from 'lucide-react';
import { getPriorityBadge, getStatusBadge, getCategoryBadge } from './TicketCard';
import { getSlaInfo } from '../utils/sla';

function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function TicketTableView({ 
  tickets = [], 
  onSelectTicket, 
  onEditTicket,
  onQuickUpdate,
  updatingTicketId
}) {
  if (tickets.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs mb-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-3xs">
            <tr>
              <th className="py-3 px-4">Ticket ID</th>
              <th className="py-3 px-4">Subject & Customer</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Priority (Quick Change)</th>
              <th className="py-3 px-4">Status (Quick Change)</th>
              <th className="py-3 px-4">SLA Target</th>
              <th className="py-3 px-4">Created</th>
              <th className="py-3 px-4 text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {tickets.map((ticket) => {
              const sla = getSlaInfo(ticket);
              const repliesCount = ticket.replies?.length || 0;
              const isUpdating = updatingTicketId === ticket.id;

              return (
                <tr
                  key={ticket.id}
                  onClick={() => onSelectTicket(ticket)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  {/* Ticket ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                    <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 group-hover:border-indigo-300">
                      {ticket.id}
                    </span>
                  </td>

                  {/* Subject & Customer */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-semibold text-slate-900 group-hover:text-indigo-600 truncate">
                      {ticket.subject}
                    </div>
                    <div className="text-2xs text-slate-500 truncate flex items-center space-x-1.5 mt-0.5">
                      <span>{ticket.customerName}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-400">{ticket.customerEmail}</span>
                      {repliesCount > 0 && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="text-slate-500 font-medium">{repliesCount} {repliesCount === 1 ? 'reply' : 'replies'}</span>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getCategoryBadge(ticket.category)}
                  </td>

                  {/* Quick Priority Dropdown */}
                  <td className="py-3.5 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={ticket.priority}
                      disabled={isUpdating}
                      onChange={(e) => onQuickUpdate(ticket.id, { priority: e.target.value })}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-2xs font-semibold text-slate-800 hover:bg-white hover:border-indigo-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                      title="Quick Change Priority"
                    >
                      <option value="Urgent">🔥 Urgent</option>
                      <option value="High">⚠️ High</option>
                      <option value="Medium">🔷 Medium</option>
                      <option value="Low">⚪ Low</option>
                    </select>
                  </td>

                  {/* Quick Status Dropdown */}
                  <td className="py-3.5 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={ticket.status}
                      disabled={isUpdating}
                      onChange={(e) => onQuickUpdate(ticket.id, { status: e.target.value })}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-2xs font-semibold text-slate-800 hover:bg-white hover:border-indigo-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                      title="Quick Change Status"
                    >
                      <option value="Open">🔵 Open</option>
                      <option value="In Progress">🟡 In Progress</option>
                      <option value="Resolved">🟢 Resolved</option>
                      <option value="Closed">⚪ Closed</option>
                    </select>
                  </td>

                  {/* SLA Deadline */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {sla.status !== 'none' ? (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-3xs font-medium border ${sla.badgeClass}`}>
                        <Clock className="w-2.5 h-2.5 mr-1" />
                        {sla.timeText}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-3xs">No SLA</span>
                    )}
                  </td>

                  {/* Created */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                    {formatDate(ticket.createdAt)}
                  </td>

                  {/* Quick Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end space-x-1">
                      {/* Mark as Resolved button (if not already resolved/closed) */}
                      {ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => onQuickUpdate(ticket.id, { status: 'Resolved' })}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-3xs font-semibold transition-colors flex items-center space-x-1 disabled:opacity-50"
                          title="Quick Action: Mark as Resolved"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Resolve</span>
                        </button>
                      )}

                      {/* View Details button */}
                      <button
                        type="button"
                        onClick={() => onSelectTicket(ticket)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Full Ticket Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit Ticket button */}
                      <button
                        type="button"
                        onClick={() => onEditTicket(ticket)}
                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit Ticket Details"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
