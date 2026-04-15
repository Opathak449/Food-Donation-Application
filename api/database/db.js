const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '../../data/food_donation.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function initDb() {
  const database = getDb();

  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL CHECK(role IN ('donor', 'recipient', 'volunteer', 'admin')),
      address TEXT,
      city TEXT,
      latitude REAL,
      longitude REAL,
      avatar TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS donations (
      id TEXT PRIMARY KEY,
      donor_id TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      quantity REAL NOT NULL,
      unit TEXT NOT NULL,
      description TEXT,
      cooked_at TEXT,
      expiry_at TEXT,
      is_perishable INTEGER DEFAULT 1,
      delivery_mode TEXT NOT NULL CHECK(delivery_mode IN ('pickup', 'donor_delivery', 'volunteer_delivery')),
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      image_url TEXT,
      status TEXT DEFAULT 'available' CHECK(status IN ('available', 'claimed', 'assigned', 'in_transit', 'completed', 'expired', 'cancelled')),
      claimed_by_recipient_id TEXT,
      assigned_volunteer_id TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (donor_id) REFERENCES users(id),
      FOREIGN KEY (claimed_by_recipient_id) REFERENCES users(id),
      FOREIGN KEY (assigned_volunteer_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS food_requests (
      id TEXT PRIMARY KEY,
      recipient_id TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      quantity_needed REAL NOT NULL,
      description TEXT,
      urgency_level TEXT DEFAULT 'medium' CHECK(urgency_level IN ('low', 'medium', 'high', 'critical')),
      address TEXT,
      city TEXT,
      latitude REAL,
      longitude REAL,
      status TEXT DEFAULT 'open' CHECK(status IN ('open', 'fulfilled', 'cancelled')),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (recipient_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS volunteer_tasks (
      id TEXT PRIMARY KEY,
      donation_id TEXT NOT NULL,
      volunteer_id TEXT,
      donor_id TEXT NOT NULL,
      recipient_id TEXT,
      pickup_address TEXT,
      delivery_address TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'collected', 'delivered', 'cancelled')),
      notes TEXT,
      assigned_at TEXT,
      completed_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (donation_id) REFERENCES donations(id),
      FOREIGN KEY (volunteer_id) REFERENCES users(id),
      FOREIGN KEY (donor_id) REFERENCES users(id),
      FOREIGN KEY (recipient_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'info' CHECK(type IN ('info', 'success', 'warning', 'error')),
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id TEXT PRIMARY KEY,
      recipient_id TEXT NOT NULL,
      donation_id TEXT,
      rating INTEGER CHECK(rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (recipient_id) REFERENCES users(id),
      FOREIGN KEY (donation_id) REFERENCES donations(id)
    );
  `);

  console.log('✅ Database initialized successfully');
}

module.exports = { getDb, initDb };