const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database/db');
const { createNotification } = require('../services/notificationService');

exports.getTasks = (req, res) => {
  try {
    const db = getDb();
    const { status } = req.query;
    let query = `
      SELECT t.*, d.title as donation_title, d.category, d.image_url,
             donor.full_name as donor_name, donor.phone as donor_phone,
             rec.full_name as recipient_name, rec.phone as recipient_phone,
             vol.full_name as volunteer_name
      FROM volunteer_tasks t
      LEFT JOIN donations d ON t.donation_id = d.id
      LEFT JOIN users donor ON t.donor_id = donor.id
      LEFT JOIN users rec ON t.recipient_id = rec.id
      LEFT JOIN users vol ON t.volunteer_id = vol.id
      WHERE 1=1
    `;
    const params = [];
    if (status) { query += ' AND t.status = ?'; params.push(status); }
    query += ' ORDER BY t.created_at DESC';

    const tasks = db.prepare(query).all(...params);
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch tasks.' });
  }
};

exports.getMyTasks = (req, res) => {
  try {
    const db = getDb();
    const tasks = db.prepare(`
      SELECT t.*, d.title as donation_title, d.category, d.image_url,
             donor.full_name as donor_name, donor.phone as donor_phone,
             rec.full_name as recipient_name, rec.phone as recipient_phone
      FROM volunteer_tasks t
      LEFT JOIN donations d ON t.donation_id = d.id
      LEFT JOIN users donor ON t.donor_id = donor.id
      LEFT JOIN users rec ON t.recipient_id = rec.id
      WHERE t.volunteer_id = ?
      ORDER BY t.created_at DESC
    `).all(req.user.id);
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch your tasks.' });
  }
};

exports.acceptTask = (req, res) => {
  try {
    const db = getDb();
    const task = db.prepare('SELECT * FROM volunteer_tasks WHERE id = ?').get(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    if (task.status !== 'pending') return res.status(400).json({ success: false, message: 'Task is no longer available.' });

    db.prepare(`
      UPDATE volunteer_tasks SET volunteer_id = ?, status = 'accepted', assigned_at = datetime('now')
      WHERE id = ?
    `).run(req.user.id, req.params.id);

    db.prepare(`UPDATE donations SET assigned_volunteer_id = ?, status = 'assigned', updated_at = datetime('now') WHERE id = ?`).run(req.user.id, task.donation_id);

    createNotification(task.donor_id, 'Volunteer Assigned!', 'A volunteer has accepted the task to deliver your donation.', 'success');
    if (task.recipient_id) createNotification(task.recipient_id, 'Volunteer On the Way!', 'A volunteer has accepted the task to deliver your food.', 'info');

    const updated = db.prepare('SELECT * FROM volunteer_tasks WHERE id = ?').get(req.params.id);
    res.json({ success: true, message: 'Task accepted!', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to accept task.' });
  }
};

exports.updateTaskStatus = (req, res) => {
  try {
    const { status, notes } = req.body;
    const validStatuses = ['accepted', 'collected', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const db = getDb();
    const task = db.prepare('SELECT * FROM volunteer_tasks WHERE id = ?').get(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    if (task.volunteer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const completedAt = status === 'delivered' ? new Date().toISOString() : task.completed_at;
    db.prepare(`
      UPDATE volunteer_tasks SET status = ?, notes = ?, completed_at = ? WHERE id = ?
    `).run(status, notes || task.notes, completedAt, req.params.id);

    if (status === 'delivered') {
      db.prepare(`UPDATE donations SET status = 'completed', updated_at = datetime('now') WHERE id = ?`).run(task.donation_id);
      if (task.recipient_id) createNotification(task.recipient_id, 'Food Delivered!', 'Your food has been delivered! Please confirm and leave feedback.', 'success');
      createNotification(task.donor_id, 'Donation Completed!', 'Your donation has been successfully delivered to the recipient.', 'success');
    } else if (status === 'collected') {
      db.prepare(`UPDATE donations SET status = 'in_transit', updated_at = datetime('now') WHERE id = ?`).run(task.donation_id);
    }

    const updated = db.prepare('SELECT * FROM volunteer_tasks WHERE id = ?').get(req.params.id);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update task.' });
  }
};
