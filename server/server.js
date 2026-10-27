import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initStorage } from './services/ticketService.js';
import ticketsRouter from './routes/tickets.js';
import statsRouter from './routes/stats.js';
import aiRouter from './routes/ai.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize file-based database
await initStorage();

// API Routes
app.use('/api/tickets', ticketsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/ai', aiRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'SupportFlow Ticketing API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    demoMode: true,
  });
});

// Serve frontend build if dist folder exists
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send(`
      <div style="font-family: system-ui, sans-serif; padding: 2rem; max-width: 600px; margin: 0 auto; text-align: center;">
        <h1 style="color: #4f46e5;">SupportFlow API Server is Running!</h1>
        <p style="color: #4b5563;">Frontend has not been compiled yet.</p>
        <p>To run in development mode, use: <code>npm run dev</code></p>
        <p>To build and serve production app, run: <code>npm run build && npm start</code></p>
        <p><a href="/api/health" style="color: #4f46e5;">Check API Health</a> | <a href="/api/tickets" style="color: #4f46e5;">View Tickets API</a></p>
      </div>
    `);
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`===============================================`);
  console.log(` SupportFlow Server active on http://localhost:${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
  console.log(` Tickets API:  http://localhost:${PORT}/api/tickets`);
  console.log(`===============================================`);
});
