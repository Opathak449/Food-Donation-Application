require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { initDb, getDb } = require('./db');

async function seed() {
  console.log('🌱 Starting database seed...');
  initDb();
  const db = getDb();

  // Clear existing data
  db.exec(`
    DELETE FROM feedback;
    DELETE FROM notifications;
    DELETE FROM volunteer_tasks;
    DELETE FROM food_requests;
    DELETE FROM donations;
    DELETE FROM contacts;
    DELETE FROM users;
  `);

  const hashedPassword = bcrypt.hashSync('password123', 10);

  // Users
  const adminId = uuidv4();
  const donor1Id = uuidv4();
  const donor2Id = uuidv4();
  const donor3Id = uuidv4();
  const recipient1Id = uuidv4();
  const recipient2Id = uuidv4();
  const recipient3Id = uuidv4();
  const volunteer1Id = uuidv4();
  const volunteer2Id = uuidv4();

  const insertUser = db.prepare(`
    INSERT INTO users (id, full_name, email, password_hash, phone, role, address, city, latitude, longitude, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);

  const users = [
    [adminId, 'Admin User', 'admin@foodshare.org', hashedPassword, '+1-555-0100', 'admin', '123 Platform HQ', 'New York', 40.7128, -74.0060],
    [donor1Id, 'Sarah Mitchell', 'sarah@donor.com', hashedPassword, '+1-555-0101', 'donor', '456 Bakery Lane', 'New York', 40.7282, -73.7949],
    [donor2Id, 'Carlos Rivera', 'carlos@donor.com', hashedPassword, '+1-555-0102', 'donor', '789 Restaurant Row', 'Brooklyn', 40.6782, -73.9442],
    [donor3Id, 'Emily Chen', 'emily@donor.com', hashedPassword, '+1-555-0103', 'donor', '321 Grocery Ave', 'Queens', 40.7282, -73.7949],
    [recipient1Id, 'Marcus Johnson', 'marcus@recipient.com', hashedPassword, '+1-555-0104', 'recipient', '654 Community Blvd', 'Bronx', 40.8448, -73.8648],
    [recipient2Id, 'Aisha Patel', 'aisha@recipient.com', hashedPassword, '+1-555-0105', 'recipient', '987 Shelter Street', 'Manhattan', 40.7831, -73.9712],
    [recipient3Id, 'David Kim', 'david@recipient.com', hashedPassword, '+1-555-0106', 'recipient', '147 Hope Lane', 'Harlem', 40.8116, -73.9465],
    [volunteer1Id, 'Jenny Walsh', 'jenny@volunteer.com', hashedPassword, '+1-555-0107', 'volunteer', '258 Helper Road', 'New York', 40.7128, -74.0060],
    [volunteer2Id, 'Tom Garcia', 'tom@volunteer.com', hashedPassword, '+1-555-0108', 'volunteer', '369 Assist Ave', 'Brooklyn', 40.6782, -73.9442],
  ];

  const insertMany = db.transaction((users) => {
    for (const user of users) insertUser.run(...user);
  });
  insertMany(users);
  console.log('✅ Users seeded');

  // Donations
  const insertDonation = db.prepare(`
    INSERT INTO donations (id, donor_id, title, category, quantity, unit, description, cooked_at, expiry_at, is_perishable, delivery_mode, address, city, latitude, longitude, status, claimed_by_recipient_id, assigned_volunteer_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date();
  const future = (hours) => new Date(now.getTime() + hours * 3600000).toISOString();
  const past = (hours) => new Date(now.getTime() - hours * 3600000).toISOString();

  const donation1Id = uuidv4();
  const donation2Id = uuidv4();
  const donation3Id = uuidv4();
  const donation4Id = uuidv4();
  const donation5Id = uuidv4();
  const donation6Id = uuidv4();
  const donation7Id = uuidv4();
  const donation8Id = uuidv4();
  const donation9Id = uuidv4();
  const donation10Id = uuidv4();

  const donations = [
    [donation1Id, donor1Id, 'Fresh Sourdough Bread Loaves', 'Bakery', 12, 'loaves', 'Freshly baked sourdough loaves from our morning batch. Still warm! Perfect for families.', past(2), future(6), 1, 'pickup', '456 Bakery Lane', 'New York', 40.7282, -73.9442, 'available', null, null],
    [donation2Id, donor2Id, 'Homemade Rice and Beans', 'Cooked Meals', 20, 'portions', 'Traditional rice and beans cooked fresh today. Vegan-friendly, seasoned perfectly.', past(1), future(4), 1, 'volunteer_delivery', '789 Restaurant Row', 'Brooklyn', 40.6782, -73.9442, 'claimed', recipient1Id, null],
    [donation3Id, donor3Id, 'Assorted Fresh Vegetables', 'Produce', 15, 'kg', 'Mixed veggies: carrots, broccoli, bell peppers, spinach. From today\'s restocking.', past(3), future(24), 1, 'donor_delivery', '321 Grocery Ave', 'Queens', 40.7282, -73.7949, 'available', null, null],
    [donation4Id, donor1Id, 'Chocolate Birthday Cake', 'Bakery', 1, 'whole cake', 'Large chocolate cake, ordered but not picked up. Feeds 15-20 people.', past(4), future(8), 1, 'pickup', '456 Bakery Lane', 'New York', 40.7282, -73.9442, 'available', null, null],
    [donation5Id, donor2Id, 'Pasta with Marinara Sauce', 'Cooked Meals', 25, 'portions', 'Penne pasta with house-made marinara. Vegetarian. Great for shelters.', past(2), future(5), 1, 'volunteer_delivery', '789 Restaurant Row', 'Brooklyn', 40.6782, -73.9442, 'assigned', recipient2Id, volunteer1Id],
    [donation6Id, donor3Id, 'Canned Goods Bundle', 'Non-Perishable', 50, 'cans', 'Mixed canned goods: soups, beans, corn, tomatoes. Long shelf life.', past(10), future(8760), 0, 'pickup', '321 Grocery Ave', 'Queens', 40.7282, -73.7949, 'available', null, null],
    [donation7Id, donor1Id, 'Croissants and Pastries', 'Bakery', 24, 'pieces', 'Assorted croissants, muffins, and danishes from morning batch. Best consumed today.', past(5), future(3), 1, 'pickup', '456 Bakery Lane', 'New York', 40.7282, -73.9442, 'completed', recipient3Id, null],
    [donation8Id, donor2Id, 'Chicken Curry', 'Cooked Meals', 15, 'portions', 'Tender chicken curry with basmati rice. Mild spice level. Halal certified.', past(3), future(6), 1, 'volunteer_delivery', '789 Restaurant Row', 'Brooklyn', 40.6782, -73.9442, 'available', null, null],
    [donation9Id, donor3Id, 'Organic Fruit Box', 'Produce', 8, 'kg', 'Seasonal organic fruits: apples, pears, oranges, bananas. Perfect for kids.', past(1), future(48), 1, 'donor_delivery', '321 Grocery Ave', 'Queens', 40.7282, -73.7949, 'available', null, null],
    [donation10Id, donor1Id, 'Whole Wheat Sandwich Bread', 'Bakery', 6, 'loaves', 'Healthy whole wheat loaves, sliced and packaged. Great for making sandwiches.', past(2), future(12), 1, 'pickup', '456 Bakery Lane', 'New York', 40.7282, -73.9442, 'available', null, null],
  ];

  const insertDonations = db.transaction((donations) => {
    for (const d of donations) insertDonation.run(...d);
  });
  insertDonations(donations);
  console.log('✅ Donations seeded');

  // Food requests
  const insertRequest = db.prepare(`
    INSERT INTO food_requests (id, recipient_id, title, category, quantity_needed, description, urgency_level, address, city, latitude, longitude, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const requests = [
    [uuidv4(), recipient1Id, 'Need meals for 10 families', 'Cooked Meals', 50, 'We serve a shelter with 10 families. Need any cooked meals for dinner service.', 'high', '654 Community Blvd', 'Bronx', 40.8448, -73.8648, 'open'],
    [uuidv4(), recipient2Id, 'Fresh produce for food pantry', 'Produce', 30, 'Our food pantry needs fresh vegetables and fruits for distribution this weekend.', 'medium', '987 Shelter Street', 'Manhattan', 40.7831, -73.9712, 'open'],
    [uuidv4(), recipient3Id, 'Non-perishable food items', 'Non-Perishable', 100, 'Building emergency food supply for community members facing hardship.', 'critical', '147 Hope Lane', 'Harlem', 40.8116, -73.9465, 'open'],
    [uuidv4(), recipient1Id, 'Bread and bakery items', 'Bakery', 20, 'Regular supply of bread needed for morning breakfast program.', 'medium', '654 Community Blvd', 'Bronx', 40.8448, -73.8648, 'fulfilled'],
    [uuidv4(), recipient2Id, 'Baby food and formula', 'Other', 10, 'Single mothers in our shelter need baby food and formula urgently.', 'critical', '987 Shelter Street', 'Manhattan', 40.7831, -73.9712, 'open'],
  ];

  const insertRequests = db.transaction((reqs) => {
    for (const r of reqs) insertRequest.run(...r);
  });
  insertRequests(requests);
  console.log('✅ Food requests seeded');

  // Volunteer tasks
  const insertTask = db.prepare(`
    INSERT INTO volunteer_tasks (id, donation_id, volunteer_id, donor_id, recipient_id, pickup_address, delivery_address, status, notes, assigned_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const tasks = [
    [uuidv4(), donation5Id, volunteer1Id, donor2Id, recipient2Id, '789 Restaurant Row, Brooklyn', '987 Shelter Street, Manhattan', 'accepted', 'Please handle with care, hot food.', past(1)],
    [uuidv4(), donation2Id, volunteer2Id, donor2Id, recipient1Id, '789 Restaurant Row, Brooklyn', '654 Community Blvd, Bronx', 'delivered', 'Delivered successfully. Recipient was very grateful.', past(3)],
    [uuidv4(), donation7Id, volunteer1Id, donor1Id, recipient3Id, '456 Bakery Lane, New York', '147 Hope Lane, Harlem', 'delivered', 'All pastries delivered in good condition.', past(6)],
  ];

  const insertTasks = db.transaction((tasks) => {
    for (const t of tasks) insertTask.run(...t);
  });
  insertTasks(tasks);
  console.log('✅ Volunteer tasks seeded');

  // Notifications
  const insertNotification = db.prepare(`
    INSERT INTO notifications (id, user_id, title, message, type, is_read)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const notifications = [
    [uuidv4(), donor1Id, 'Donation Claimed!', 'Your donation "Croissants and Pastries" has been claimed by a recipient.', 'success', 0],
    [uuidv4(), recipient1Id, 'Donation Available Nearby', 'Fresh Sourdough Bread is available for pickup near your location!', 'info', 0],
    [uuidv4(), volunteer1Id, 'New Task Available', 'A delivery task is available in your area. Pasta with Marinara Sauce needs to be delivered.', 'info', 0],
    [uuidv4(), donor2Id, 'Volunteer Assigned', 'A volunteer has been assigned to deliver your "Pasta with Marinara Sauce" donation.', 'success', 1],
    [uuidv4(), recipient2Id, 'Delivery Completed', 'Your food order has been delivered! Please confirm receipt.', 'success', 0],
    [uuidv4(), adminId, 'New User Registered', 'A new volunteer Jenny Walsh has registered on the platform.', 'info', 1],
    [uuidv4(), donor3Id, 'Donation Expiring Soon', 'Your donation "Assorted Fresh Vegetables" is expiring in 24 hours.', 'warning', 0],
    [uuidv4(), recipient3Id, 'Donation Completed', 'The pastries donation has been successfully delivered. Please rate your experience.', 'success', 0],
  ];

  const insertNotifications = db.transaction((notifs) => {
    for (const n of notifs) insertNotification.run(...n);
  });
  insertNotifications(notifications);
  console.log('✅ Notifications seeded');

  // Feedback
  const insertFeedback = db.prepare(`
    INSERT INTO feedback (id, donation_id, recipient_id, rating, comment)
    VALUES (?, ?, ?, ?, ?)
  `);

  const feedbacks = [
    [uuidv4(), donation7Id, recipient3Id, 5, 'Amazing fresh pastries! The kids loved them. Thank you so much for your generosity!'],
    [uuidv4(), donation2Id, recipient1Id, 4, 'Food was delicious and arrived warm. Would love more seasoning next time, but very grateful!'],
    [uuidv4(), donation5Id, recipient2Id, 5, 'The pasta was perfect. Exactly what we needed for dinner service tonight. Bless you!'],
  ];

  const insertFeedbacks = db.transaction((fbs) => {
    for (const f of fbs) insertFeedback.run(...f);
  });
  insertFeedbacks(feedbacks);
  console.log('✅ Feedback seeded');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📋 Demo Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin:     admin@foodshare.org    / password123');
  console.log('Donor:     sarah@donor.com        / password123');
  console.log('Donor:     carlos@donor.com       / password123');
  console.log('Recipient: marcus@recipient.com   / password123');
  console.log('Volunteer: jenny@volunteer.com    / password123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

seed().catch(console.error);
