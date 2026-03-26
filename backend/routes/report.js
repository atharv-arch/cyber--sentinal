import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../db/database.js';

const router = express.Router();

// POST /api/report — save report
router.post('/', (req, res) => {
  try {
    const { intelBundle, aiReport } = req.body;
    if (!intelBundle || !aiReport) return res.status(400).json({ error: 'Missing data' });

    const db = getDatabase();
    const id = uuidv4();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    db.prepare(`
      INSERT INTO reports (id, input, type, intel_bundle, ai_report, created_at, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, intelBundle.input, intelBundle.type, JSON.stringify(intelBundle), JSON.stringify(aiReport), now.toISOString(), expiresAt);

    // Track in history
    db.prepare(`
      INSERT INTO history (input, type, risk_score, risk_level, report_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(intelBundle.input, intelBundle.type, aiReport.riskScore || 0, aiReport.riskLevel || 'UNKNOWN', id, now.toISOString());

    res.json({ id, shareUrl: `/report/${id}`, expiresAt });
  } catch (err) {
    console.error('Report save error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/report/:id — load saved report
router.get('/:id', (req, res) => {
  try {
    const db = getDatabase();
    const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(req.params.id);

    if (!report) return res.status(404).json({ error: 'Report not found or expired' });

    if (new Date(report.expires_at) < new Date()) {
      db.prepare('DELETE FROM reports WHERE id = ?').run(req.params.id);
      return res.status(410).json({ error: 'Report has expired' });
    }

    res.json({
      id: report.id,
      intelBundle: JSON.parse(report.intel_bundle),
      aiReport: JSON.parse(report.ai_report),
      createdAt: report.created_at,
      expiresAt: report.expires_at
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
