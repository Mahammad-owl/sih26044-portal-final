const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const isVercel = process.env.VERCEL === '1';

let dbPath;

if (isVercel) {
  // Vercel allows writing to /tmp
  dbPath = '/tmp/sih_portal.sqlite';

  // Copy the original seeded database to /tmp on first startup
  const sourceDb = path.resolve(__dirname, '../../database/sih_portal.sqlite');

  if (!fs.existsSync(dbPath) && fs.existsSync(sourceDb)) {
    fs.copyFileSync(sourceDb, dbPath);
  }
} else {
  // Local development uses the original database
  dbPath = path.resolve(__dirname, '../../database/sih_portal.sqlite');
}

const db = new Database(dbPath, { verbose: null });

db.pragma('foreign_keys = ON');

// Initialize schema
const schemaPath = path.resolve(__dirname, 'schema.sql');

if (fs.existsSync(schemaPath)) {
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema);
}

module.exports = db;
