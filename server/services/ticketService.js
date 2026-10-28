import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { DEFAULT_TICKETS } from '../data/defaultTickets.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE_PATH = path.join(__dirname, '..', 'data', 'tickets.json');

// In-memory cache synced with disk
let cachedTickets = null;
let isSaving = false;
let pendingSave = false;

/**
 * Initialize data store
 */
export async function initStorage() {
  try {
    const dataDir = path.dirname(DATA_FILE_PATH);
    await fs.mkdir(dataDir, { recursive: true });
    
    try {
      const raw = await fs.readFile(DATA_FILE_PATH, 'utf-8');
      cachedTickets = JSON.parse(raw);
      if (!Array.isArray(cachedTickets)) {
        throw new Error('Data is not an array');
      }
    } catch {
      // File doesn't exist or invalid, initialize with defaults
      console.log('Initializing tickets.json with sample demo tickets...');
      cachedTickets = JSON.parse(JSON.stringify(DEFAULT_TICKETS));
      await saveTicketsToDisk();
    }
  } catch (err) {
    console.error('Failed to initialize ticket storage:', err);
    cachedTickets = JSON.parse(JSON.stringify(DEFAULT_TICKETS));
  }
}

/**
 * Persist tickets to JSON file atomically
 */
async function saveTicketsToDisk() {
  if (isSaving) {
    pendingSave = true;
    return;
  }
  isSaving = true;
  try {
    const tempFile = `${DATA_FILE_PATH}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(cachedTickets, null, 2), 'utf-8');
    await fs.rename(tempFile, DATA_FILE_PATH);
  } catch (err) {
    console.error('Error saving tickets to disk:', err);
  } finally {
    isSaving = false;
    if (pendingSave) {
      pendingSave = false;
      saveTicketsToDisk();
    }
  }
}

/**
 * Get all tickets with optional filtering, search, and sorting
 */
export async function getAllTickets(filters = {}) {
  if (!cachedTickets) await initStorage();

  let results = [...cachedTickets];

  // Text Search across subject, description, customerName, customerEmail, ID
  if (filters.search) {
    const term = filters.search.toLowerCase().trim();
    results = results.filter(t =>
      t.id.toLowerCase().includes(term) ||
      t.subject.toLowerCase().includes(term) ||
      t.customerName.toLowerCase().includes(term) ||
      t.customerEmail.toLowerCase().includes(term) ||
      t.description.toLowerCase().includes(term)
    );
  }

  // Filter by Status
  if (filters.status && filters.status !== 'All') {
    results = results.filter(t => t.status.toLowerCase() === filters.status.toLowerCase());
  }

  // Filter by Priority
  if (filters.priority && filters.priority !== 'All') {
    results = results.filter(t => t.priority.toLowerCase() === filters.priority.toLowerCase());
  }

  // Filter by Category
  if (filters.category && filters.category !== 'All') {
    results = results.filter(t => t.category.toLowerCase() === filters.category.toLowerCase());
  }

  // Sorting
  const sortBy = filters.sortBy || 'createdAt';
  const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;

  results.sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityWeights = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
      const weightA = priorityWeights[a.priority] || 0;
      const weightB = priorityWeights[b.priority] || 0;
      return (weightA - weightB) * sortOrder;
    }
    
    const valA = a[sortBy] || '';
    const valB = b[sortBy] || '';
    if (valA < valB) return -1 * sortOrder;
    if (valA > valB) return 1 * sortOrder;
    return 0;
  });

  return results;
}

/**
 * Get single ticket by ID
 */
export async function getTicketById(id) {
  if (!cachedTickets) await initStorage();
  return cachedTickets.find(t => t.id === id) || null;
}

/**
 * Create a new ticket
 */
export async function createTicket(ticketData) {
  if (!cachedTickets) await initStorage();

  // Generate readable ticket ID (e.g., SF-1008, SF-1009)
  const maxNumber = cachedTickets.reduce((max, t) => {
    const match = t.id.match(/^SF-(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      return num > max ? num : max;
    }
    return max;
  }, 1000);

  const newId = `SF-${maxNumber + 1}`;
  const now = new Date().toISOString();

  // SLA deadline calculation: use provided deadline or calculate from standard priority policy
  let slaDeadline = ticketData.slaDeadline;
  if (!slaDeadline) {
    const slaHoursMap = { Urgent: 4, High: 24, Medium: 48, Low: 72 };
    const hours = slaHoursMap[ticketData.priority] || 48;
    slaDeadline = new Date(Date.now() + hours * 3600000).toISOString();
  }

  const newTicket = {
    id: newId,
    customerName: (ticketData.customerName || 'Anonymous Customer').trim(),
    customerEmail: (ticketData.customerEmail || 'support@client.com').trim(),
    subject: (ticketData.subject || 'Untitled Support Request').trim(),
    description: (ticketData.description || '').trim(),
    category: ticketData.category || 'General Inquiry',
    priority: ticketData.priority || 'Medium',
    status: ticketData.status || 'Open',
    assignedTo: ticketData.assignedTo || 'Unassigned',
    slaDeadline,
    satisfaction: null,
    isSample: false, // User-created tickets are not sample tickets
    createdAt: now,
    updatedAt: now,
    activities: [
      {
        id: `act-${Date.now()}-created`,
        type: 'ticket_created',
        description: `Ticket created by ${ticketData.customerName || 'Customer'}.`,
        timestamp: now,
        actor: ticketData.customerName || 'Customer',
        oldValue: null,
        newValue: 'Open',
      }
    ],
    replies: [
      {
        id: `rep-${Date.now()}`,
        sender: 'customer',
        authorName: ticketData.customerName || 'Customer',
        message: ticketData.description || 'Ticket created.',
        createdAt: now,
      }
    ]
  };

  cachedTickets.unshift(newTicket);
  await saveTicketsToDisk();
  return newTicket;
}

/**
 * Update ticket fields (e.g., status, priority, category, assignedTo)
 */
export async function updateTicket(id, updates) {
  if (!cachedTickets) await initStorage();

  const index = cachedTickets.findIndex(t => t.id === id);
  if (index === -1) return null;

  const current = cachedTickets[index];
  const now = new Date().toISOString();

  // Create audit system reply if status or priority changes
  const auditLogs = [];
  const newActivities = [...(current.activities || [])];

  if (updates.status && updates.status !== current.status) {
    auditLogs.push(`Status updated from "${current.status}" to "${updates.status}".`);
    if (updates.status === 'Resolved') {
      newActivities.push({
        id: `act-${Date.now()}-resolved`,
        type: 'ticket_resolved',
        description: `Ticket marked as Resolved (from "${current.status}").`,
        timestamp: now,
        actor: 'Support Agent',
        oldValue: current.status,
        newValue: 'Resolved',
      });
    } else {
      newActivities.push({
        id: `act-${Date.now()}-status`,
        type: 'status_changed',
        description: `Status changed from "${current.status}" to "${updates.status}".`,
        timestamp: now,
        actor: 'Support Agent',
        oldValue: current.status,
        newValue: updates.status,
      });
    }
  }

  if (updates.priority && updates.priority !== current.priority) {
    auditLogs.push(`Priority changed from "${current.priority}" to "${updates.priority}".`);
    newActivities.push({
      id: `act-${Date.now()}-priority`,
      type: 'priority_changed',
      description: `Priority changed from "${current.priority}" to "${updates.priority}".`,
      timestamp: now,
      actor: 'Support Agent',
      oldValue: current.priority,
      newValue: updates.priority,
    });
  }

  // Detect detail edits
  const editedFields = [];
  if (updates.subject && updates.subject !== current.subject) editedFields.push('subject');
  if (updates.description && updates.description !== current.description) editedFields.push('description');
  if (updates.category && updates.category !== current.category) editedFields.push(`category (${current.category} ➔ ${updates.category})`);
  if (updates.customerName && updates.customerName !== current.customerName) editedFields.push('customer name');
  if (updates.customerEmail && updates.customerEmail !== current.customerEmail) editedFields.push('customer email');
  if (updates.assignedTo && updates.assignedTo !== current.assignedTo) editedFields.push(`assigned agent (${updates.assignedTo})`);
  if (updates.slaDeadline && updates.slaDeadline !== current.slaDeadline) editedFields.push('SLA deadline');

  if (editedFields.length > 0) {
    newActivities.push({
      id: `act-${Date.now()}-edited`,
      type: 'ticket_edited',
      description: `Ticket details updated: ${editedFields.join(', ')}.`,
      timestamp: now,
      actor: 'Support Agent',
      oldValue: null,
      newValue: editedFields.join(', '),
    });
  }

  const updatedReplies = [...(current.replies || [])];
  for (const log of auditLogs) {
    updatedReplies.push({
      id: `sys-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender: 'system',
      authorName: 'SupportFlow System',
      message: log,
      createdAt: now,
    });
  }

  const updatedTicket = {
    ...current,
    ...updates,
    activities: newActivities,
    replies: updatedReplies,
    updatedAt: now,
  };

  cachedTickets[index] = updatedTicket;
  await saveTicketsToDisk();
  return updatedTicket;
}

/**
 * Submit Customer Satisfaction feedback for a ticket
 */
export async function addSatisfaction(id, { rating, comment }) {
  if (!cachedTickets) await initStorage();

  const index = cachedTickets.findIndex(t => t.id === id);
  if (index === -1) return null;

  const current = cachedTickets[index];
  const now = new Date().toISOString();
  const numRating = Math.min(5, Math.max(1, parseInt(rating, 10) || 5));

  const satisfactionData = {
    rating: numRating,
    comment: (comment || '').trim(),
    submittedAt: now,
  };

  const newActivities = [...(current.activities || [])];
  newActivities.push({
    id: `act-${Date.now()}-csat`,
    type: 'feedback_submitted',
    description: `Customer submitted satisfaction rating: ${numRating} Star${numRating > 1 ? 's' : ''}${satisfactionData.comment ? ` - "${satisfactionData.comment}"` : ''}.`,
    timestamp: now,
    actor: 'Customer',
    oldValue: null,
    newValue: `${numRating} Stars`,
  });

  const updatedTicket = {
    ...current,
    satisfaction: satisfactionData,
    activities: newActivities,
    updatedAt: now,
  };

  cachedTickets[index] = updatedTicket;
  await saveTicketsToDisk();
  return updatedTicket;
}

/**
 * Add message reply to ticket conversation
 */
export async function addReply(id, replyData) {
  if (!cachedTickets) await initStorage();

  const index = cachedTickets.findIndex(t => t.id === id);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const newReply = {
    id: `rep-${Date.now()}`,
    sender: replyData.sender || 'agent',
    authorName: replyData.authorName || (replyData.sender === 'agent' ? 'Support Agent' : 'Customer'),
    message: (replyData.message || '').trim(),
    isAiAssisted: Boolean(replyData.isAiAssisted),
    createdAt: now,
  };

  // If agent replies and ticket was Open, transition to In Progress
  let status = cachedTickets[index].status;
  if (replyData.sender === 'agent' && status === 'Open') {
    status = 'In Progress';
  }

  const updatedTicket = {
    ...cachedTickets[index],
    status,
    updatedAt: now,
    replies: [...(cachedTickets[index].replies || []), newReply],
  };

  cachedTickets[index] = updatedTicket;
  await saveTicketsToDisk();
  return { updatedTicket, newReply };
}

/**
 * Delete a ticket
 */
export async function deleteTicket(id) {
  if (!cachedTickets) await initStorage();
  const index = cachedTickets.findIndex(t => t.id === id);
  if (index === -1) return false;

  cachedTickets.splice(index, 1);
  await saveTicketsToDisk();
  return true;
}

/**
 * Reset data back to default sample tickets
 */
export async function resetToDefault() {
  cachedTickets = JSON.parse(JSON.stringify(DEFAULT_TICKETS));
  await saveTicketsToDisk();
  return cachedTickets;
}

/**
 * Calculate aggregate statistics for dashboard
 */
export async function getStats() {
  if (!cachedTickets) await initStorage();

  const total = cachedTickets.length;
  const statusCounts = {
    Open: 0,
    'In Progress': 0,
    Resolved: 0,
    Closed: 0,
  };
  const priorityCounts = {
    Urgent: 0,
    High: 0,
    Medium: 0,
    Low: 0,
  };
  const categoryCounts = {};
  const slaCounts = {
    onTrack: 0,
    approaching: 0,
    overdue: 0,
    met: 0,
    breached: 0,
    none: 0,
  };

  const now = new Date();

  let sampleCount = 0;
  let customCount = 0;

  for (const t of cachedTickets) {
    if (statusCounts[t.status] !== undefined) statusCounts[t.status]++;
    if (priorityCounts[t.priority] !== undefined) priorityCounts[t.priority]++;
    
    categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;

    // SLA status analysis
    if (t.slaDeadline) {
      const deadline = new Date(t.slaDeadline);
      if (t.status === 'Resolved' || t.status === 'Closed') {
        const resolvedAt = new Date(t.updatedAt || t.createdAt);
        if (resolvedAt <= deadline) slaCounts.met++;
        else slaCounts.breached++;
      } else {
        const diffMs = deadline.getTime() - now.getTime();
        if (diffMs < 0) slaCounts.overdue++;
        else if (diffMs <= 4 * 3600 * 1000) slaCounts.approaching++;
        else slaCounts.onTrack++;
      }
    } else {
      slaCounts.none++;
    }

    if (t.isSample) sampleCount++;
    else customCount++;
  }

  const urgentOrHighOpen = cachedTickets.filter(
    t => (t.priority === 'Urgent' || t.priority === 'High') && (t.status === 'Open' || t.status === 'In Progress')
  ).length;

  // Agent Performance Summary (calculated strictly from actual ticket records)
  const agentMap = {};
  for (const t of cachedTickets) {
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
  }

  const agentPerformance = Object.values(agentMap).map(a => {
    let avgResolutionTimeText = 'N/A (No resolved tickets with verified duration)';
    let avgResolutionMinutes = null;
    if (a.resolvedWithTimeCount > 0) {
      const avgMs = a.totalResolutionTimeMs / a.resolvedWithTimeCount;
      const mins = Math.round(avgMs / 60000);
      avgResolutionMinutes = mins;
      const hours = Math.floor(mins / 60);
      const remMins = mins % 60;
      avgResolutionTimeText = hours > 0 ? `${hours}h ${remMins}m` : `${remMins}m`;
    }

    return {
      agentName: a.agentName,
      assignedCount: a.assignedCount,
      resolvedCount: a.resolvedCount,
      avgResolutionTimeText,
      avgResolutionMinutes,
    };
  });

  return {
    total,
    statusCounts,
    priorityCounts,
    categoryCounts,
    slaCounts,
    agentPerformance,
    urgentOrHighOpen,
    sampleCount,
    customCount,
    storageType: 'Local JSON File Store (Atomic Write)',
    storageLimitations: 'Optimized for local capstone demos. For multi-node enterprise clustering, replace with a distributed SQL/NoSQL database (e.g. PostgreSQL or Salesforce Service Cloud).',
  };
}
