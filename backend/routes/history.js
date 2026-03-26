import express from 'express';
import { getDatabase } from '../db/database.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const db = getDatabase();
    res.json(db.getHistory(20));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/', (req, res) => {
  try {
    const db = getDatabase();
    db.clearHistory();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
