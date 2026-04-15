const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database/db');
const { createNotification } = require('../services/notificationService');

exports.getDonations = (req, res) => {
  try {
    const db = getDb();
    const { status, category, city, delivery_mode, is_perishable, search } = req.query;

    let query = `
      SELECT d.*, u.full_name as donor_name, u.phone as donor_phone,
             r.full_name as recipient_name, v.full_name as volunteer_name
      FROM donations d
      LEFT JOIN users u ON d.donor_id = u.id
      LEFT JOIN users r ON d.claimed_by_recipient_id = r.id
      LEFT JOIN users v ON d.assigned_volunteer_id = v.id
      WHERE 1=1
    `;
    const params = [];

    if (status) { query += ' AND d.status = ?'; params.push(status); }
    if (category) { query += ' AND d.category = ?'; params.push(category); }
    if (city) { query += ' AND d.city LIKE ?'; params.push(`%${city}%`); }
    if (delivery_mode) { query += ' AND d.delivery_mode = ?'; params.push(delivery_mode); }
    if (is_perishable !== undefined) { query += ' AND d.is_perishable = ?'; params.push(is_perishable === 'true' ? 1 : 0); }
    if (search) { query += ' AND (d.title LIKE ? OR d.description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

    query += ' ORDER BY d.created_at DESC';

    const donations = db.prepare(query).all(...params);
    res.json({ success: true, data: donations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch donations.' });
  }
};

exports.getDonation = (req, res) => {
  try {
    const db = getDb();
    const donation = db.prepare(`
      SELECT d.*, u.full_name as donor_name, u.phone as donor_phone, u.email as donor_email,
             r.full_name as recipient_name, r.phone as recipient_phone,
             v.full_name as volunteer_name, v.phone as volunteer_phone
      FROM donations d
      LEFT JOIN users u ON d.donor_id = u.id
      LEFT JOIN users r ON d.claimed_by_recipient_id = r.id
      LEFT JOIN users v ON d.assigned_volunteer_id = v.id
      WHERE d.id = ?
    `).get(req.params.id);

    if (!donation) return res.status(404).json({ success: false, message: 'Donation not found.' });
    res.json({ success: true, data: donation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch donation.' });
  }
};

exports.createDonation = (req, res) => {
  try {
    const {
      title, category, quantity, unit, description, cooked_at, expiry_at,
      is_perishable, delivery_mode, address, city, latitude, longitude
    } = req.body;

    if (!title || !category || !quantity || !unit || !delivery_mode || !address || !city) {
      return res.status(400).json({ success: false, message: 'Required fields missing.' });
    }

    const db = getDb();
    const id = uuidv4();
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    db.prepare(`
      INSERT INTO donations (id, donor_id, title, category, quantity, unit, description, cooked_at, expiry_at, is_perishable, delivery_mode, address, city, latitude, longitude, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, req.user.id, title, category, parseFloat(quantity), unit, description, cooked_at, expiry_at, is_perishable === 'true' ? 1 : 0, delivery_mode, address, city, latitude ? parseFloat(latitude) : null, longitude ? parseFloat(longitude) : null, image_url);

    const donation = db.prepare('SELECT * FROM donations WHERE id = ?').get(id);
    res.status(201).json({ success: true, message: 'Donation created!', data: donation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create donation.' });
  }
};

exports.updateDonation = (req, res) => {
  try {
    const db = getDb();
    const donation = db.prepare('SELECT * FROM donations WHERE id = ?').get(req.params.id);

    if (!donation) return res.status(404).json({ success: false, message: 'Donation not found.' });
    if (donation.donor_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }
    if (!['available'].includes(donation.status)) {
      return res.status(400).json({ success: false, message: 'Cannot edit donation that is not in available status.' });
    }

    const { title, category, quantity, unit, description, cooked_at, expiry_at, is_perishable, delivery_mode, address, city, latitude, longitude } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : donation.image_url;

    db.prepare(`
      UPDATE donations SET title=?, category=?, quantity=?, unit=?, description=?, cooked_at=?, expiry_at=?, is_perishable=?, delivery_mode=?, address=?, city=?, latitude=?, longitude=?, image_url=?, updated_at=datetime('now')
      WHERE id = ?
    `).run(title, category, parseFloat(quantity), unit, description, cooked_at, expiry_at, is_perishable === 'true' ? 1 : 0, delivery_mode, address, city, latitude, longitude, image_url, req.params.id);

    const updated = db.prepare('SELECT * FROM donations WHERE id = ?').get(req.params.id);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update donation.' });
  }
};

exports.deleteDonation = (req, res) => {
  try {
    const db = getDb();
    const donation = db.prepare('SELECT * FROM donations WHERE id = ?').get(req.params.id);

    if (!donation) return res.status(404).json({ success: false, message: 'Donation not found.' });
    if (donation.donor_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }
    if (!['available'].includes(donation.status)) {
      return res.status(400).json({ success: false, message: 'Cannot delete claimed donation.' });
    }

    db.prepare('DELETE FROM donations WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Donation deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete donation.' });
  }
};

exports.claimDonation = (req, res) => {
  try {
    if (req.user.role !== 'recipient') {
      return res.status(403).json({ success: false, message: 'Only recipients can claim donations.' });
    }

    const db = getDb();
    const donation = db.prepare('SELECT * FROM donations WHERE id = ?').get(req.params.id);

    if (!donation) return res.status(404).json({ success: false, message: 'Donation not found.' });
    if (donation.status !== 'available') {
      return res.status(400).json({ success: false, message: 'Donation is not available for claiming.' });
    }

    const newStatus = donation.delivery_mode === 'volunteer_delivery' ? 'claimed' : 'claimed';

    db.prepare(`
      UPDATE donations SET status = ?, claimed_by_recipient_id = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(newStatus, req.user.id, req.params.id);

    // If volunteer_delivery, create a task
    if (donation.delivery_mode === 'volunteer_delivery') {
      db.prepare(`
        INSERT INTO volunteer_tasks (id, donation_id, donor_id, recipient_id, pickup_address, delivery_address, status)
        VALUES (?, ?, ?, ?, ?, ?, 'pending')
      `).run(uuidv4(), donation.id, donation.donor_id, req.user.id, donation.address, req.body.delivery_address || '');
    }

    createNotification(donation.donor_id, 'Your donation was claimed!', `Your donation "${donation.title}" has been claimed by a recipient.`, 'success');
    createNotification(req.user.id, 'Donation claimed!', `You have successfully claimed "${donation.title}". ${donation.delivery_mode === 'pickup' ? 'Please arrange pickup.' : 'A volunteer will be assigned.'}`, 'success');

    const updated = db.prepare('SELECT * FROM donations WHERE id = ?').get(req.params.id);
    res.json({ success: true, message: 'Donation claimed!', data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to claim donation.' });
  }
};

exports.updateStatus = (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['available', 'claimed', 'assigned', 'in_transit', 'completed', 'expired', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const db = getDb();
    db.prepare(`UPDATE donations SET status = ?, updated_at = datetime('now') WHERE id = ?`).run(status, req.params.id);
    const updated = db.prepare('SELECT * FROM donations WHERE id = ?').get(req.params.id);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update status.' });
  }
};

exports.getMyDonations = (req, res) => {
  try {
    const db = getDb();
    const donations = db.prepare(`
      SELECT d.*, r.full_name as recipient_name, v.full_name as volunteer_name
      FROM donations d
      LEFT JOIN users r ON d.claimed_by_recipient_id = r.id
      LEFT JOIN users v ON d.assigned_volunteer_id = v.id
      WHERE d.donor_id = ?
      ORDER BY d.created_at DESC
    `).all(req.user.id);
    res.json({ success: true, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch your donations.' });
  }
};

exports.getMyClaims = (req, res) => {
  try {
    const db = getDb();
    const claims = db.prepare(`
      SELECT d.*, u.full_name as donor_name, u.phone as donor_phone
      FROM donations d
      LEFT JOIN users u ON d.donor_id = u.id
      WHERE d.claimed_by_recipient_id = ?
      ORDER BY d.updated_at DESC
    `).all(req.user.id);
    res.json({ success: true, data: claims });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch claims.' });
  }
};
