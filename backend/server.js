import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import analyzeRouter from './routes/analyze.js';
import reportRouter from './routes/report.js';
import chatRouter from './routes/chat.js';
import historyRouter from './routes/history.js';
import { initDatabase } from './db/database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

// Initialize DB
initDatabase();

// Routes
app.use('/api/analyze', analyzeRouter);
app.use('/api/report', reportRouter);
app.use('/api/chat', chatRouter);
app.use('/api/history', historyRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🛡️  CyberSentinel backend running on port ${PORT}`);
});

export default app;
