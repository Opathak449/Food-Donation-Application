const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const authController = require('../controllers/authController');
const donationController = require('../controllers/donationController');
const requestController = require('../controllers/requestController');
const taskController = require('../controllers/taskController');
const notificationController = require('../controllers/notificationController');
const adminController = require('../controllers/adminController');

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticate, authController.getMe);
router.put('/auth/profile', authenticate, authController.updateProfile);

// Donation routes
router.get('/donations', donationController.getDonations);
router.get('/donations/my', authenticate, donationController.getMyDonations);
router.get('/donations/claims', authenticate, authorize('recipient'), donationController.getMyClaims);
router.get('/donations/:id', donationController.getDonation);
router.post('/donations', authenticate, authorize('donor', 'admin'), upload.single('image'), donationController.createDonation);
router.put('/donations/:id', authenticate, authorize('donor', 'admin'), upload.single('image'), donationController.updateDonation);
router.delete('/donations/:id', authenticate, authorize('donor', 'admin'), donationController.deleteDonation);
router.patch('/donations/:id/claim', authenticate, authorize('recipient'), donationController.claimDonation);
router.patch('/donations/:id/status', authenticate, donationController.updateStatus);

// Food request routes
router.get('/requests', authenticate, requestController.getRequests);
router.get('/requests/my', authenticate, authorize('recipient'), requestController.getMyRequests);
router.get('/requests/:id', authenticate, requestController.getRequest);
router.post('/requests', authenticate, authorize('recipient'), requestController.createRequest);
router.put('/requests/:id', authenticate, requestController.updateRequest);
router.delete('/requests/:id', authenticate, requestController.deleteRequest);

// Volunteer task routes
router.get('/tasks', authenticate, taskController.getTasks);
router.get('/tasks/my', authenticate, authorize('volunteer'), taskController.getMyTasks);
router.patch('/tasks/:id/accept', authenticate, authorize('volunteer'), taskController.acceptTask);
router.patch('/tasks/:id/status', authenticate, taskController.updateTaskStatus);

// Notification routes
router.get('/notifications', authenticate, notificationController.getNotifications);
router.patch('/notifications/:id/read', authenticate, notificationController.markRead);
router.patch('/notifications/read-all', authenticate, notificationController.markAllRead);

// Admin routes
router.get('/admin/analytics', authenticate, authorize('admin'), adminController.getAnalytics);
router.get('/admin/users', authenticate, authorize('admin'), adminController.getUsers);
router.patch('/admin/users/:id/toggle', authenticate, authorize('admin'), adminController.toggleUserStatus);

// Feedback routes
router.get('/feedback', authenticate, adminController.getFeedback);
router.post('/feedback', authenticate, authorize('recipient'), adminController.createFeedback);

// Contact
router.post('/contact', adminController.submitContact);

module.exports = router;
