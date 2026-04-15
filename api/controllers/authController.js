const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database/db');
const { createNotification } = require('../services/notificationService');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const sanitizeUser = (user) => {
  const { password_hash, ...rest } = user;
  return rest;
};

exports.register = async (req, res) => {
  try {
    const { full_name, email, password, phone, role, address, city } = req.body;

    if (!full_name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Name, email, password, and role are required.' });
    }

    const validRoles = ['donor', 'recipient', 'volunteer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role selected.' });
    }

    const db = getDb();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const id = uuidv4();

    db.prepare(`
      INSERT INTO users (id, full_name, email, password_hash, phone, role, address, city)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, full_name, email, password_hash, phone || null, role, address || null, city || null);

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    const token = generateToken(user);

    createNotification(id, 'Welcome to FoodShare!', `Hi ${full_name}, your account has been created successfully. Start making a difference today!`, 'success');

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Registration failed.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Account has been deactivated.' });
    }

    const token = generateToken(user);
    res.json({ success: true, token, user: sanitizeUser(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Login failed.' });
  }
};

exports.getMe = (req, res) => {
  const { password_hash, ...user } = req.user;
  res.json({ success: true, user });
};

exports.updateProfile = async (req, res) => {
  try {
    const { full_name, phone, address, city, latitude, longitude } = req.body;
    const db = getDb();

    db.prepare(`
      UPDATE users SET full_name = ?, phone = ?, address = ?, city = ?, latitude = ?, longitude = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(full_name, phone, address, city, latitude, longitude, req.user.id);

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    res.json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Profile update failed.' });
  }
};