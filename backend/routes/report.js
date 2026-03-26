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

    db.saveReport(id, intelBundle.input, intelBundle.type, intelBundle, aiReport, now.toISOString(), expiresAt);
    db.addHistory(intelBundle.input, intelBundle.type, aiReport.riskScore || 0, aiReport.riskLevel || 'UNKNOWN', id, now.toISOString());

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
    const report = db.getReport(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found or expired' });

    res.json({
      id: report.id,
      intelBundle: report.intel_bundle,
      aiReport: report.ai_report,
      createdAt: report.created_at,
      expiresAt: report.expires_at
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
