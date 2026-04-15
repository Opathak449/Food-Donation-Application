const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database/db');

// Admin Controller
exports.getAnalytics = (req, res) => {
  try {
    const db = getDb();

    const totalDonations = db.prepare('SELECT COUNT(*) as count FROM donations').get().count;
    const activeDonations = db.prepare("SELECT COUNT(*) as count FROM donations WHERE status = 'available'").get().count;
    const completedDonations = db.prepare("SELECT COUNT(*) as count FROM donations WHERE status = 'completed'").get().count;
    const expiredDonations = db.prepare("SELECT COUNT(*) as count FROM donations WHERE status = 'expired'").get().count;
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users WHERE role != ?').get('admin').count;
    const totalRequests = db.prepare('SELECT COUNT(*) as count FROM food_requests').get().count;
    const totalTasks = db.prepare('SELECT COUNT(*) as count FROM volunteer_tasks').get().count;

    const usersByRole = db.prepare("SELECT role, COUNT(*) as count FROM users WHERE role != 'admin' GROUP BY role").all();
    const donationsByCategory = db.prepare('SELECT category, COUNT(*) as count FROM donations GROUP BY category ORDER BY count DESC').all();
    const donationsByStatus = db.prepare('SELECT status, COUNT(*) as count FROM donations GROUP BY status').all();
    const recentDonations = db.prepare(`
      SELECT d.*, u.full_name as donor_name FROM donations d
      LEFT JOIN users u ON d.donor_id = u.id
      ORDER BY d.created_at DESC LIMIT 5
    `).all();

    res.json({
      success: true,
      data: {
        stats: { totalDonations, activeDonations, completedDonations, expiredDonations, totalUsers, totalRequests, totalTasks },
        usersByRole,
        donationsByCategory,
        donationsByStatus,
        recentDonations
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch analytics.' });
  }
};

exports.getUsers = (req, res) => {
  try {
    const db = getDb();
    const { role, search } = req.query;
    let query = 'SELECT id, full_name, email, phone, role, city, is_active, created_at FROM users WHERE 1=1';
    const params = [];
    if (role) { query += ' AND role = ?'; params.push(role); }
    if (search) { query += ' AND (full_name LIKE ? OR email LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    query += ' ORDER BY created_at DESC';

    const users = db.prepare(query).all(...params);
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
};

exports.toggleUserStatus = (req, res) => {
  try {
    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const newStatus = user.is_active ? 0 : 1;
    db.prepare('UPDATE users SET is_active = ? WHERE id = ?').run(newStatus, req.params.id);
    res.json({ success: true, message: `User ${newStatus ? 'activated' : 'deactivated'}.` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle user status.' });
  }
};

// Feedback Controller
exports.createFeedback = (req, res) => {
  try {
    const { donation_id, rating, comment } = req.body;
    if (!donation_id || !rating) {
      return res.status(400).json({ success: false, message: 'Donation ID and rating are required.' });
    }

    const db = getDb();
    const existing = db.prepare('SELECT * FROM feedback WHERE donation_id = ? AND recipient_id = ?').get(donation_id, req.user.id);
    if (existing) return res.status(400).json({ success: false, message: 'You have already rated this donation.' });

    const id = uuidv4();
    db.prepare('INSERT INTO feedback (id, donation_id, recipient_id, rating, comment) VALUES (?, ?, ?, ?, ?)').run(id, donation_id, req.user.id, parseInt(rating), comment);
    res.status(201).json({ success: true, message: 'Feedback submitted! Thank you.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit feedback.' });
  }
};

exports.getFeedback = (req, res) => {
  try {
    const db = getDb();
    const feedback = db.prepare(`
      SELECT f.*, u.full_name as recipient_name, d.title as donation_title
      FROM feedback f
      LEFT JOIN users u ON f.recipient_id = u.id
      LEFT JOIN donations d ON f.donation_id = d.id
      ORDER BY f.created_at DESC
    `).all();
    res.json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch feedback.' });
  }
};

// Contact Controller
exports.submitContact = (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const db = getDb();
    db.prepare('INSERT INTO contacts (id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)').run(uuidv4(), name, email, subject, message);
    res.status(201).json({ success: true, message: 'Message sent! We will get back to you soon.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
};
