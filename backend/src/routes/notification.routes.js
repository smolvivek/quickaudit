const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');

// Get all notifications for current user
router.get(
  '/',
  notificationController.getAllNotifications
);

// Mark notification as read
router.put(
  '/:id/read',
  notificationController.markAsRead
);

// Mark all notifications as read
router.put(
  '/read-all',
  notificationController.markAllAsRead
);

module.exports = router;
