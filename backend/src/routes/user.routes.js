const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const { authorize } = require('../middleware/auth.middleware');

// Get all users (admin only)
router.get(
  '/',
  authorize('admin'),
  userController.getAllUsers
);

// Get user by ID
router.get(
  '/:id',
  userController.getUserById
);

// Update user
router.put(
  '/:id',
  [
    body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
    body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
    body('role').optional().isIn(['field_auditor', 'supervisor', 'admin', 'client']).withMessage('Invalid role'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status')
  ],
  userController.updateUser
);

// Delete user (admin only)
router.delete(
  '/:id',
  authorize('admin'),
  userController.deleteUser
);

// Get current user profile
router.get(
  '/me',
  userController.getCurrentUser
);

// Update current user profile
router.put(
  '/me',
  [
    body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
    body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
    body('settings').optional().isObject().withMessage('Settings must be an object')
  ],
  userController.updateCurrentUser
);

// Update user password
router.put(
  '/me/password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
  ],
  userController.updatePassword
);

module.exports = router;
