import express from 'express';
import { getDatabase } from '../db/database.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const db = getDatabase();
    const rows = db.prepare(`
      SELECT id, input, type, risk_score, risk_level, report_id, created_at
      FROM history
      ORDER BY created_at DESC
      LIMIT 20
    `).all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/', (req, res) => {
  try {
    const db = getDatabase();
    db.prepare('DELETE FROM history').run();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
