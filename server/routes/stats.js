import express from 'express';
import { getStats } from '../services/ticketService.js';

const router = express.Router();

/**
 * GET /api/stats
 */
router.get('/', async (req, res) => {
  try {
    const stats = await getStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ success: false, error: 'Failed to calculate statistics' });
  }
});

export default router;
