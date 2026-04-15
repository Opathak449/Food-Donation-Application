const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database/db');

exports.getRequests = (req, res) => {
  try {
    const db = getDb();
    const { status, category, city, urgency_level } = req.query;
    let query = `
      SELECT r.*, u.full_name as recipient_name, u.phone as recipient_phone
      FROM food_requests r
      LEFT JOIN users u ON r.recipient_id = u.id
      WHERE 1=1
    `;
    const params = [];
    if (status) { query += ' AND r.status = ?'; params.push(status); }
    if (category) { query += ' AND r.category = ?'; params.push(category); }
    if (city) { query += ' AND r.city LIKE ?'; params.push(`%${city}%`); }
    if (urgency_level) { query += ' AND r.urgency_level = ?'; params.push(urgency_level); }
    query += ' ORDER BY r.created_at DESC';

    const requests = db.prepare(query).all(...params);
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch requests.' });
  }
};

exports.getRequest = (req, res) => {
  try {
    const db = getDb();
    const request = db.prepare(`
      SELECT r.*, u.full_name as recipient_name, u.phone as recipient_phone, u.email as recipient_email
      FROM food_requests r
      LEFT JOIN users u ON r.recipient_id = u.id
      WHERE r.id = ?
    `).get(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch request.' });
  }
};

exports.createRequest = (req, res) => {
  try {
    const { title, category, quantity_needed, description, urgency_level, address, city, latitude, longitude } = req.body;
    if (!title || !category || !quantity_needed) {
      return res.status(400).json({ success: false, message: 'Title, category, and quantity are required.' });
    }

    const db = getDb();
    const id = uuidv4();
    db.prepare(`
      INSERT INTO food_requests (id, recipient_id, title, category, quantity_needed, description, urgency_level, address, city, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, req.user.id, title, category, parseFloat(quantity_needed), description, urgency_level || 'medium', address, city, latitude, longitude);

    const request = db.prepare('SELECT * FROM food_requests WHERE id = ?').get(id);
    res.status(201).json({ success: true, message: 'Food request submitted!', data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create request.' });
  }
};

exports.updateRequest = (req, res) => {
  try {
    const db = getDb();
    const request = db.prepare('SELECT * FROM food_requests WHERE id = ?').get(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });
    if (request.recipient_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const { title, category, quantity_needed, description, urgency_level, address, city, status } = req.body;
    db.prepare(`
      UPDATE food_requests SET title=?, category=?, quantity_needed=?, description=?, urgency_level=?, address=?, city=?, status=?, updated_at=datetime('now')
      WHERE id = ?
    `).run(title, category, parseFloat(quantity_needed), description, urgency_level, address, city, status || request.status, req.params.id);

    const updated = db.prepare('SELECT * FROM food_requests WHERE id = ?').get(req.params.id);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update request.' });
  }
};

exports.deleteRequest = (req, res) => {
  try {
    const db = getDb();
    const request = db.prepare('SELECT * FROM food_requests WHERE id = ?').get(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });
    if (request.recipient_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    db.prepare('DELETE FROM food_requests WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Request deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete request.' });
  }
};

exports.getMyRequests = (req, res) => {
  try {
    const db = getDb();
    const requests = db.prepare('SELECT * FROM food_requests WHERE recipient_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch your requests.' });
  }
};
