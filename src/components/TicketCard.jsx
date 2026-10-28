import React from 'react';
import { 
  Flame, 
  AlertTriangle, 
  MessageSquare, 
  User, 
  Calendar, 
  ChevronRight,
  ShieldAlert,
  Clock,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { getSlaInfo } from '../utils/sla';

export function getPriorityBadge(priority) {
  switch (priority) {
    case 'Urgent':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
          <Flame className="w-3 h-3 mr-1 text-red-500 fill-red-500" />
          Urgent
        </span>
      );
    case 'High':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <AlertTriangle className="w-3 h-3 mr-1 text-amber-500" />
          High
        </span>
      );
    case 'Medium':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          Medium
        </span>
      );
    case 'Low':
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
          Low
        </span>
      );
  }
}

export function getStatusBadge(status) {
  switch (status) {
    case 'Open':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>
          Open
        </span>
      );
    case 'In Progress':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3 h-3 mr-1 text-amber-600 animate-spin" style={{ animationDuration: '4s' }} />
          In Progress
        </span>
      );
    case 'Resolved':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle className="w-3 h-3 mr-1 text-emerald-600" />
          Resolved
        </span>
      );
    case 'Closed':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
          Closed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
          {status}
        </span>
      );
  }
}

export function getCategoryBadge(category) {
  const styles = {
    Billing: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    Technical: 'bg-violet-50 text-violet-800 border-violet-200',
    'Account Access': 'bg-rose-50 text-rose-800 border-rose-200',
    'Feature Request': 'bg-cyan-50 text-cyan-800 border-cyan-200',
    'General Inquiry': 'bg-slate-100 text-slate-700 border-slate-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[category] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
      {category}
    </span>
  );
}

function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function TicketCard({ ticket, onSelectTicket, onQuickResolve }) {
  const repliesCount = ticket.replies?.length || 0;
  const sla = getSlaInfo(ticket);

  return (
    <div
      onClick={() => onSelectTicket(ticket)}
      className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between cursor-pointer group shadow-2xs relative"
    >
      <div>
        {/* Top Badges row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 group-hover:border-indigo-200">
              {ticket.id}
            </span>
            {getCategoryBadge(ticket.category)}
          </div>

          <div className="flex items-center space-x-2">
            {getPriorityBadge(ticket.priority)}
            {getStatusBadge(ticket.status)}
          </div>
        </div>

        {/* Subject */}
        <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1.5">
          {ticket.subject}
        </h3>

        {/* Description preview */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-3 leading-relaxed">
          {ticket.description}
        </p>

        {/* SLA Status Pill if configured */}
        {sla.status !== 'none' && (
          <div className="mb-3 flex items-center justify-between">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-3xs font-medium border ${sla.badgeClass}`}>
              <Clock className="w-2.5 h-2.5 mr-1" />
              <span>{sla.label}: <strong className="ml-1">{sla.timeText}</strong></span>
            </span>

            {/* Quick Resolve button */}
            {onQuickResolve && ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickResolve(ticket.id);
                }}
                className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-3xs font-semibold flex items-center space-x-1 transition-colors"
                title="Quick Action: Mark as Resolved"
              >
                <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
                <span>Quick Resolve</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Footer Info */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        {/* Customer Information */}
        <div className="flex items-center space-x-2 min-w-0 pr-2">
          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold shrink-0">
            {ticket.customerName ? ticket.customerName.charAt(0).toUpperCase() : 'C'}
          </div>
          <span className="font-medium text-slate-800 truncate">{ticket.customerName}</span>
          <span className="hidden sm:inline text-slate-400">·</span>
          <span className="hidden md:inline text-slate-500 truncate">{ticket.customerEmail}</span>
        </div>

        {/* Date & Replies count */}
        <div className="flex items-center space-x-3 shrink-0">
          <span className="hidden lg:inline text-slate-400">
            {formatDate(ticket.createdAt)}
          </span>
          <span className="inline-flex items-center space-x-1 text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700">{repliesCount}</span>
          </span>
          <span className="p-1 rounded-full text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
}
