/**
 * SLA Helper utility for SupportFlow
 * 
 * Supports dynamic real-time recalculation using current system time.
 */

export function getSlaInfo(ticket, currentTime = new Date()) {
  if (!ticket || !ticket.slaDeadline) {
    return {
      status: 'none',
      label: 'No SLA Configured',
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
      timeText: 'No SLA Deadline',
      isOverdue: false,
      isDueSoon: false,
      isApproaching: false,
      deadlineFormatted: 'Not configured',
    };
  }

  const deadline = new Date(ticket.slaDeadline);
  const now = currentTime instanceof Date ? currentTime : new Date(currentTime);
  const deadlineFormatted = deadline.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // If ticket is Resolved or Closed: Do NOT show Overdue
  if (ticket.status === 'Resolved' || ticket.status === 'Closed') {
    const resolvedAt = new Date(ticket.updatedAt || ticket.createdAt);
    const met = resolvedAt <= deadline;
    if (met) {
      return {
        status: 'met',
        label: 'SLA Met',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
        timeText: 'Resolved within SLA target',
        isOverdue: false,
        isDueSoon: false,
        isApproaching: false,
        deadlineFormatted,
      };
    } else {
      return {
        status: 'breached',
        label: 'SLA Breached',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-300 font-medium',
        timeText: 'Resolved past deadline',
        isOverdue: false, // Resolved tickets are not in an active overdue alert state
        isDueSoon: false,
        isApproaching: false,
        deadlineFormatted,
      };
    }
  }

  // Active tickets (Open or In Progress)
  const diffMs = deadline.getTime() - now.getTime();

  if (diffMs < 0) {
    // Overdue
    const absDiff = Math.abs(diffMs);
    const hours = Math.floor(absDiff / 3600000);
    const mins = Math.floor((absDiff % 3600000) / 60000);
    const timeText = hours > 0 ? `Overdue by ${hours}h ${mins}m` : `Overdue by ${mins}m`;

    return {
      status: 'overdue',
      label: 'SLA Overdue',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 font-bold animate-pulse',
      timeText,
      isOverdue: true,
      isDueSoon: false,
      isApproaching: false,
      deadlineFormatted,
    };
  }

  if (diffMs <= 4 * 3600 * 1000) {
    // Due Soon (< 4 hours)
    const hours = Math.floor(diffMs / 3600000);
    const mins = Math.floor((diffMs % 3600000) / 60000);
    const timeText = hours > 0 ? `Due in ${hours}h ${mins}m` : `Due in ${mins}m`;

    return {
      status: 'approaching',
      label: 'Due Soon',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 font-semibold',
      timeText,
      isOverdue: false,
      isDueSoon: true,
      isApproaching: true,
      deadlineFormatted,
    };
  }

  // On track (> 4 hours remaining)
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(hours / 24);
  const timeText = days > 0 ? `Due in ${days}d ${hours % 24}h` : `Due in ${hours}h`;

  return {
    status: 'on_track',
    label: 'On Track',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    timeText,
    isOverdue: false,
    isDueSoon: false,
    isApproaching: false,
    deadlineFormatted,
  };
}
