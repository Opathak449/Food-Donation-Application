// Stub donation controller - implement as needed
const { getDb } = require('../database/db');

exports.getDonations = (req, res) => {
  try {
    const db = getDb();
    const donations = db.prepare(`
      SELECT d.*, u.full_name as donor_name
      FROM donations d
      JOIN users u ON d.donor_id = u.id
      WHERE d.status = 'available'
      ORDER BY d.created_at DESC
    `).all();
    res.json({ success: true, donations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch donations' });
  }
};

exports.getMyDonations = (req, res) => {
  try {
    const db = getDb();
    const donations = db.prepare('SELECT * FROM donations WHERE donor_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json({ success: true, donations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch donations' });
  }
};

exports.getMyClaims = (req, res) => {
  try {
    const db = getDb();
    const claims = db.prepare('SELECT * FROM donations WHERE claimed_by_recipient_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json({ success: true, claims });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch claims' });
  }
};

exports.getDonation = (req, res) => {
  try {
    const db = getDb();
    const donation = db.prepare('SELECT * FROM donations WHERE id = ?').get(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }
    res.json({ success: true, donation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch donation' });
  }
};

exports.createDonation = (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
};

exports.updateDonation = (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
};

exports.deleteDonation = (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
};

exports.claimDonation = (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
};

exports.updateStatus = (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
};