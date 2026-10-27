// Automated End-to-End Verification Test for SupportFlow
import fs from 'fs';
import path from 'path';

const BASE = 'http://127.0.0.1:5000';

async function request(path, options = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
}

async function runTests() {
  console.log('🚀 Starting SupportFlow API & Workflow Verification Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const health = await request('/api/health');
    assert(health.status === 200 && health.data.status === 'online', 'Server health check returns 200 online');

    // 2. Fetch stats
    const statsRes = await request('/api/stats');
    const stats = statsRes.data?.data;
    assert(statsRes.ok && stats && stats.total >= 7, `Dashboard stats returns ${stats?.total} total tickets`);
    assert(stats.statusCounts.Open > 0, `Status summaries include Open: ${stats?.statusCounts?.Open}`);
    assert(stats.statusCounts['In Progress'] > 0, `Status summaries include In Progress: ${stats?.statusCounts?.['In Progress']}`);
    assert(stats.statusCounts.Resolved > 0, `Status summaries include Resolved: ${stats?.statusCounts?.Resolved}`);
    assert(stats.slaCounts && stats.slaCounts.overdue !== undefined, `SLA stats calculated (Overdue: ${stats?.slaCounts?.overdue}, Approaching: ${stats?.slaCounts?.approaching})`);

    // 3. Fetch tickets list
    const ticketsRes = await request('/api/tickets');
    assert(ticketsRes.ok && Array.isArray(ticketsRes.data.data), 'GET /api/tickets returns array of tickets');
    const sampleTicket = ticketsRes.data.data.find(t => t.isSample);
    assert(sampleTicket !== undefined, `Sample ticket identified with isSample=true (${sampleTicket?.id})`);

    // 4. Create a new ticket with SLA
    const customDeadline = new Date(Date.now() + 3600000 * 5).toISOString();
    const newTicketPayload = {
      customerName: 'Marcus Holloway',
      customerEmail: 'marcus@dedsec.org',
      subject: 'Critical: SSO authentication failure on login gateway',
      description: 'Users cannot log into the admin dashboard via SAML 2.0. HTTP 500 error returned.',
      category: 'Technical',
      priority: 'High',
      slaDeadline: customDeadline,
    };
    const createRes = await request('/api/tickets', {
      method: 'POST',
      body: JSON.stringify(newTicketPayload),
    });
    assert(createRes.status === 201 && createRes.data.data.id.startsWith('SF-'), `Ticket created successfully with ID ${createRes.data?.data?.id}`);
    const createdId = createRes.data?.data?.id;

    // 5. Fetch single ticket details
    const singleTicket = await request(`/api/tickets/${createdId}`);
    assert(singleTicket.ok && singleTicket.data.data.customerName === 'Marcus Holloway', 'GET /api/tickets/:id retrieves correct customer info');
    assert(singleTicket.data.data.slaDeadline === customDeadline, 'Custom SLA deadline persisted properly');

    // 6. Update ticket status & priority
    const patchRes = await request(`/api/tickets/${createdId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'In Progress', priority: 'Urgent' }),
    });
    assert(patchRes.ok && patchRes.data.data.status === 'In Progress', 'Status updated to "In Progress"');
    assert(patchRes.data.data.priority === 'Urgent', 'Priority updated to "Urgent"');

    // 7. Full ticket editing (edit customerName, subject, description)
    const editRes = await request(`/api/tickets/${createdId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        customerName: 'Marcus Holloway (Lead Eng)',
        subject: 'SSO SAML Gateway Recovery in Progress',
        description: 'Upstream certificates were rotated. Re-validating identity assertions.',
        category: 'Technical',
      }),
    });
    assert(editRes.ok && editRes.data.data.customerName === 'Marcus Holloway (Lead Eng)', 'Ticket customer name edited successfully');
    assert(editRes.data.data.subject === 'SSO SAML Gateway Recovery in Progress', 'Ticket subject edited successfully');

    // 8. Disk persistence check
    const diskPath = path.resolve('server', 'data', 'tickets.json');
    const diskContent = JSON.parse(fs.readFileSync(diskPath, 'utf8'));
    const diskTicket = diskContent.find(t => t.id === createdId);
    assert(diskTicket && diskTicket.subject === 'SSO SAML Gateway Recovery in Progress', 'Verified changes persisted to server/data/tickets.json on disk');

    // 9. Test AI Suggestion generation (Demo Mode)
    const aiRes = await request('/api/ai/suggest', {
      method: 'POST',
      body: JSON.stringify({
        customerName: 'Marcus Holloway',
        subject: 'SSO SAML Gateway Recovery in Progress',
        description: 'Upstream certificates were rotated. Re-validating identity assertions.',
        category: 'Technical',
        priority: 'Urgent',
      }),
    });
    assert(aiRes.ok && Array.isArray(aiRes.data.suggestions), 'AI response generator returns array of suggestions');
    assert(aiRes.data.suggestions.length === 3, 'AI generator returned 3 distinct contextual response options');
    assert(aiRes.data.isSimulated === true, `AI Engine transparently reports demo mode: "${aiRes.data.mode}"`);
    console.log(`     -> Sample AI Draft Title: "${aiRes.data.suggestions[0].title}"`);

    // 10. Add Reply to ticket
    const replyRes = await request(`/api/tickets/${createdId}/replies`, {
      method: 'POST',
      body: JSON.stringify({
        message: aiRes.data.suggestions[0].text,
        sender: 'agent',
        authorName: 'Agent Sarah',
        isAiAssisted: true,
      }),
    });
    assert(replyRes.status === 201, 'Agent reply added to conversation history');
    assert(replyRes.data.data.replies.some(r => r.isAiAssisted === true), 'Reply successfully tagged as isAiAssisted=true');

    // 11. Search and Filter
    const searchRes = await request('/api/tickets?search=Marcus');
    assert(searchRes.ok && searchRes.data.data.length >= 1, `Search by customer name found ${searchRes.data.data.length} match`);

    const filterStatus = await request('/api/tickets?status=In%20Progress');
    assert(filterStatus.ok && filterStatus.data.data.every(t => t.status === 'In Progress'), 'Filter by status "In Progress" verified');

    // 12. Clean up / Delete test ticket
    const deleteRes = await request(`/api/tickets/${createdId}`, { method: 'DELETE' });
    assert(deleteRes.ok, `Test ticket ${createdId} deleted successfully`);

    // 13. Test Reset Demo endpoint
    const resetRes = await request('/api/tickets/reset-demo', { method: 'POST' });
    assert(resetRes.ok && resetRes.data.count >= 7, 'Demo reset endpoint restored default sample tickets');

    console.log(`\n===============================================`);
    console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
    console.log(`===============================================\n`);

    if (failed > 0) process.exit(1);
    process.exit(0);
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  }
}

// Start server and run tests if not already running
import('../server/server.js').then(() => {
  setTimeout(runTests, 800);
}).catch((e) => {
  if (e.code === 'EADDRINUSE') {
    runTests();
  } else {
    console.error(e);
  }
});
