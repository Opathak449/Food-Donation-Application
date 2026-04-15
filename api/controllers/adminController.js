// Stub admin controller
const { getDb } = require('../database/db');

exports.getAnalytics = (req, res) => {
  try {
    const db = getDb();
    const stats = {
      totalUsers: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
      totalDonations: db.prepare('SELECT COUNT(*) as count FROM donations').get().count,
      activeDonations: db.prepare('SELECT COUNT(*) as count FROM donations WHERE status = "available"').get().count,
      totalRequests: db.prepare('SELECT COUNT(*) as count FROM food_requests').get().count
    };
    res.json({ success: true, analytics: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
};

exports.getUsers = (req, res) => {
  try {
    const db = getDb();
    const users = db.prepare('SELECT id, full_name, email, role, is_active, created_at FROM users ORDER BY created_at DESC').all();
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

exports.toggleUserStatus = (req, res) => {
  try {
    const db = getDb();
    const user = db.prepare('SELECT is_active FROM users WHERE id = ?').get(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    db.prepare('UPDATE users SET is_active = ? WHERE id = ?').run(user.is_active ? 0 : 1, req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle user status' });
  }
};

exports.getFeedback = (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
};

exports.createFeedback = (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
};

exports.submitContact = (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
};