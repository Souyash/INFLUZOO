import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.js';
import { creatorsRouter } from './routes/creators.js';
import { campaignsRouter } from './routes/campaigns.js';
import { dealsRouter } from './routes/deals.js';
import { escrowRouter } from './routes/escrow.js';
import { adminRouter } from './routes/admin.js';
import { aiRouter } from './routes/ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    platform: 'Influzo Creator & Escrow Engine',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/creators', creatorsRouter);
app.use('/api/campaigns', campaignsRouter);
app.use('/api/deals', dealsRouter);
app.use('/api/escrow', escrowRouter);
app.use('/api/admin', adminRouter);
app.use('/api/ai', aiRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Influzo Backend Server is running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🛡️ Admin API: http://localhost:${PORT}/api/admin/overview`);
});
