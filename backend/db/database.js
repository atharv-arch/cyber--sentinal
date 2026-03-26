import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let db;

export function initDatabase() {
  db = new Database(join(__dirname, '../cybersentinel.db'));
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      input TEXT NOT NULL,
      type TEXT NOT NULL,
      intel_bundle TEXT NOT NULL,
      ai_report TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      input TEXT NOT NULL,
      type TEXT NOT NULL,
      risk_score INTEGER,
      risk_level TEXT,
      report_id TEXT,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_reports_created ON reports(created_at);
    CREATE INDEX IF NOT EXISTS idx_history_created ON history(created_at);
  `);

  // Clean up expired reports on startup
  const now = new Date().toISOString();
  db.prepare('DELETE FROM reports WHERE expires_at < ?').run(now);

  console.log('✅ Database initialized');
  return db;
}

export function getDatabase() {
  return db;
}
