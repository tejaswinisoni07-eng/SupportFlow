import React from 'react';
import { 
  Flame, 
  AlertTriangle, 
  MessageSquare, 
  ChevronRight, 
  Clock, 
  CheckCircle,
  Eye,
  Pencil
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

export default function TicketTableView({ tickets = [], onSelectTicket, onEditTicket }) {
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
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">SLA Deadline</th>
              <th className="py-3 px-4">Created</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {tickets.map((ticket) => {
              const sla = getSlaInfo(ticket);
              const repliesCount = ticket.replies?.length || 0;

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

                  {/* Priority */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getPriorityBadge(ticket.priority)}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(ticket.status)}
                  </td>

                  {/* SLA Deadline */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {sla.status !== 'none' ? (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-3xs font-medium border ${sla.badgeClass}`}>
                        <Clock className="w-2.5 h-2.5 mr-1" />
                        {sla.timeText}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-3xs">Not configured</span>
                    )}
                  </td>

                  {/* Created */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                    {formatDate(ticket.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectTicket(ticket)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Ticket Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEditTicket(ticket)}
                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit Ticket"
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
