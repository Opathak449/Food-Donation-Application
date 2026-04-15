const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database/db');

function createNotification(userId, title, message, type = 'info') {
  try {
    const db = getDb();
    db.prepare(`
      INSERT INTO notifications (id, user_id, title, message, type, is_read)
      VALUES (?, ?, ?, ?, ?, 0)
    `).run(uuidv4(), userId, title, message, type);
  } catch (err) {
    console.error('Notification error:', err);
  }
}

module.exports = { createNotification };
