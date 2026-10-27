import express from 'express';
import {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  addReply,
  deleteTicket,
  resetToDefault,
} from '../services/ticketService.js';

const router = express.Router();

/**
 * GET /api/tickets
 * Query: status, priority, category, search, sortBy, sortOrder
 */
router.get('/', async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      priority: req.query.priority,
      category: req.query.category,
      search: req.query.search,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    };
    const tickets = await getAllTickets(filters);
    res.json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (err) {
    console.error('Error fetching tickets:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve tickets' });
  }
});

/**
 * POST /api/tickets/reset-demo
 * Reset to sample tickets
 */
router.post('/reset-demo', async (req, res) => {
  try {
    const defaultData = await resetToDefault();
    res.json({
      success: true,
      message: 'Demo tickets have been reset to default capstone dataset.',
      count: defaultData.length,
      data: defaultData,
    });
  } catch (err) {
    console.error('Error resetting demo tickets:', err);
    res.status(500).json({ success: false, error: 'Failed to reset demo dataset' });
  }
});

/**
 * GET /api/tickets/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const ticket = await getTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }
    res.json({ success: true, data: ticket });
  } catch (err) {
    console.error('Error fetching ticket:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve ticket' });
  }
});

/**
 * POST /api/tickets
 * Create new ticket
 */
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, subject, description, category, priority } = req.body;

    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ success: false, error: 'Customer name is required' });
    }
    if (!subject || !subject.trim()) {
      return res.status(400).json({ success: false, error: 'Subject is required' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, error: 'Description is required' });
    }

    const newTicket = await createTicket({
      customerName,
      customerEmail: customerEmail || 'customer@example.com',
      subject,
      description,
      category: category || 'General Inquiry',
      priority: priority || 'Medium',
    });

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      data: newTicket,
    });
  } catch (err) {
    console.error('Error creating ticket:', err);
    res.status(500).json({ success: false, error: 'Failed to create ticket' });
  }
});

/**
 * PATCH /api/tickets/:id
 * Update status, priority, or details
 */
router.patch('/:id', async (req, res) => {
  try {
    const allowedFields = ['status', 'priority', 'category', 'assignedTo', 'subject', 'description'];
    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: 'No valid update fields provided' });
    }

    const updated = await updateTicket(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }

    res.json({
      success: true,
      message: 'Ticket updated successfully',
      data: updated,
    });
  } catch (err) {
    console.error('Error updating ticket:', err);
    res.status(500).json({ success: false, error: 'Failed to update ticket' });
  }
});

/**
 * POST /api/tickets/:id/replies
 * Add reply / comment
 */
router.post('/:id/replies', async (req, res) => {
  try {
    const { message, sender, authorName, isAiAssisted } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message cannot be empty' });
    }

    const result = await addReply(req.params.id, {
      message,
      sender: sender || 'agent',
      authorName: authorName || 'Support Agent',
      isAiAssisted: Boolean(isAiAssisted),
    });

    if (!result) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }

    res.status(201).json({
      success: true,
      message: 'Reply posted successfully',
      data: result.updatedTicket,
      newReply: result.newReply,
    });
  } catch (err) {
    console.error('Error posting reply:', err);
    res.status(500).json({ success: false, error: 'Failed to post reply' });
  }
});

/**
 * DELETE /api/tickets/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await deleteTicket(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }
    res.json({ success: true, message: 'Ticket deleted successfully' });
  } catch (err) {
    console.error('Error deleting ticket:', err);
    res.status(500).json({ success: false, error: 'Failed to delete ticket' });
  }
});

export default router;
