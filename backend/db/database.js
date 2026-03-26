import initSqlJs from 'sql.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = join(__dirname, '../cybersentinel.db.json');

let db;
let SQL;

export async function initDatabase() {
  SQL = await initSqlJs();

  // Load existing data from JSON file or create fresh
  if (existsSync(DB_PATH)) {
    try {
      const saved = JSON.parse(readFileSync(DB_PATH, 'utf8'));
      db = { reports: saved.reports || {}, history: saved.history || [] };
    } catch {
      db = { reports: {}, history: [] };
    }
  } else {
    db = { reports: {}, history: [] };
  }

  // Cleanup expired reports
  const now = new Date().toISOString();
  Object.keys(db.reports).forEach(id => {
    if (db.reports[id].expires_at < now) delete db.reports[id];
  });

  console.log('✅ Database initialized (sql.js / JSON store)');
  return db;
}

function persist() {
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function getDatabase() {
  return {
    // Reports
    saveReport(id, input, type, intelBundle, aiReport, createdAt, expiresAt) {
      db.reports[id] = { id, input, type, intel_bundle: JSON.stringify(intelBundle), ai_report: JSON.stringify(aiReport), created_at: createdAt, expires_at: expiresAt };
      persist();
    },
    getReport(id) {
      const r = db.reports[id];
      if (!r) return null;
      if (r.expires_at < new Date().toISOString()) {
        delete db.reports[id];
        persist();
        return null;
      }
      return { ...r, intel_bundle: JSON.parse(r.intel_bundle), ai_report: JSON.parse(r.ai_report) };
    },
    deleteReport(id) {
      delete db.reports[id];
      persist();
    },

    // History
    addHistory(input, type, riskScore, riskLevel, reportId, createdAt) {
      db.history.unshift({ id: Date.now(), input, type, risk_score: riskScore, risk_level: riskLevel, report_id: reportId, created_at: createdAt });
      db.history = db.history.slice(0, 100); // keep last 100
      persist();
    },
    getHistory(limit = 20) {
      return db.history.slice(0, limit);
    },
    clearHistory() {
      db.history = [];
      persist();
    }
  };
}
