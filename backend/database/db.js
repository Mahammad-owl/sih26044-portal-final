const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const isVercel = process.env.VERCEL === '1';

let dbPath;

if (isVercel) {
  const seedDb = path.resolve(__dirname, 'sih_portal.sqlite');
  dbPath = '/tmp/sih_portal.sqlite';

  // Create a writable copy of the seeded database.
  if (!fs.existsSync(dbPath)) {
    fs.copyFileSync(seedDb, dbPath);
  }
} else {
  dbPath = path.resolve(__dirname, 'sih_portal.sqlite');
}

const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

const schemaPath = path.resolve(__dirname, 'schema.sql');

if (fs.existsSync(schemaPath)) {
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema);
}

module.exports = db;
