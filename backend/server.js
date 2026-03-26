import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRouter from './routes/analyze.js';
import reportRouter from './routes/report.js';
import chatRouter from './routes/chat.js';
import historyRouter from './routes/history.js';
import { initDatabase } from './db/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

app.use('/api/analyze', analyzeRouter);
app.use('/api/report', reportRouter);
app.use('/api/chat', chatRouter);
app.use('/api/history', historyRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Async startup — sql.js needs to initialize
async function start() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`🛡️  CyberSentinel backend running on port ${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
  });
}

start().catch(console.error);

export default app;
