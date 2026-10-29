// SupportFlow Client API Service
const API_BASE = 'https://supportflow-yfc2.onrender.com/api';

export async function fetchTickets(filters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.status && filters.status !== 'All') params.append('status', filters.status);
  if (filters.priority && filters.priority !== 'All') params.append('priority', filters.priority);
  if (filters.category && filters.category !== 'All') params.append('category', filters.category);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_BASE}/tickets${query}`);
  if (!res.ok) throw new Error('Failed to fetch tickets');
  const json = await res.json();
  return json.data || [];
}

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  const json = await res.json();
  return json.data;
}

export async function fetchTicketById(id) {
  const res = await fetch(`${API_BASE}/tickets/${id}`);
  if (!res.ok) throw new Error('Ticket not found');
  const json = await res.json();
  return json.data;
}

export async function createTicket(ticketData) {
  const res = await fetch(`${API_BASE}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticketData),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create ticket');
  return json.data;
}

export async function updateTicket(id, updates) {
  const res = await fetch(`${API_BASE}/tickets/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update ticket');
  return json.data;
}

export async function addReply(id, replyData) {
  const res = await fetch(`${API_BASE}/tickets/${id}/replies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(replyData),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to post reply');
  return json.data;
}

export async function deleteTicket(id) {
  const res = await fetch(`${API_BASE}/tickets/${id}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to delete ticket');
  return true;
}

export async function resetDemoTickets() {
  const res = await fetch(`${API_BASE}/tickets/reset-demo`, {
    method: 'POST',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to reset demo data');
  return json.data;
}

export async function fetchAiSuggestions(ticketData) {
  const res = await fetch(`${API_BASE}/ai/suggest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticketData),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to generate AI suggestion');
  return json;
}

export async function submitSatisfaction(id, { rating, comment }) {
  const res = await fetch(`${API_BASE}/tickets/${id}/satisfaction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating, comment }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to submit feedback');
  return json.data;
}

export async function suggestPriorityApi(subject, description) {
  const res = await fetch(`${API_BASE}/ai/suggest-priority`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject, description }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to analyze priority');
  return json;
}
