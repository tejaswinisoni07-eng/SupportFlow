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
    isSample: false, // User-created tickets are not sample tickets
    createdAt: now,
    updatedAt: now,
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
  if (updates.status && updates.status !== current.status) {
    auditLogs.push(`Status updated from "${current.status}" to "${updates.status}".`);
  }
  if (updates.priority && updates.priority !== current.priority) {
    auditLogs.push(`Priority changed from "${current.priority}" to "${updates.priority}".`);
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
    replies: updatedReplies,
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

  let sampleCount = 0;
  let customCount = 0;

  for (const t of cachedTickets) {
    if (statusCounts[t.status] !== undefined) statusCounts[t.status]++;
    if (priorityCounts[t.priority] !== undefined) priorityCounts[t.priority]++;
    
    categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;

    if (t.isSample) sampleCount++;
    else customCount++;
  }

  const urgentOrHighOpen = cachedTickets.filter(
    t => (t.priority === 'Urgent' || t.priority === 'High') && (t.status === 'Open' || t.status === 'In Progress')
  ).length;

  return {
    total,
    statusCounts,
    priorityCounts,
    categoryCounts,
    urgentOrHighOpen,
    sampleCount,
    customCount,
    storageType: 'Local JSON File Store (Atomic Write)',
    storageLimitations: 'Optimized for local capstone demos. For multi-node enterprise clustering, replace with a distributed SQL/NoSQL database (e.g. PostgreSQL or Salesforce Service Cloud).',
  };
}
