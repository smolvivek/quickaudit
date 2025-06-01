const Notification = require('../models/notification.model');
const { validationResult } = require('express-validator');

// Get all notifications for current user
exports.getAllNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Find notifications for the user
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .populate('sender', 'firstName lastName')
      .limit(50); // Limit to most recent 50 notifications
    
    res.status(200).json({
      count: notifications.length,
      notifications
    });
  } catch (error) {
    console.error('Get all notifications error:', error);
    res.status(500).json({ message: 'Server error while fetching notifications' });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    
    // Find notification by ID
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // Check if notification belongs to user
    if (notification.recipient.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: Cannot access notification for different user' });
    }
    
    // Mark as read
    notification.isRead = true;
    await notification.save();
    
    res.status(200).json({
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ message: 'Server error while updating notification' });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Update all unread notifications for the user
    const result = await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );
    
    res.status(200).json({
      message: 'All notifications marked as read',
      count: result.nModified
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ message: 'Server error while updating notifications' });
  }
};

// Create notification (internal use only)
exports.createNotification = async (data) => {
  try {
    const { recipient, sender, type, title, message, relatedEntity } = data;
    
    const notification = new Notification({
      recipient,
      sender,
      type,
      title,
      message,
      relatedEntity,
      isRead: false
    });
    
    await notification.save();
    
    return notification;
  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
};
