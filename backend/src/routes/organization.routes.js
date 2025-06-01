const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const organizationController = require('../controllers/organization.controller');
const { authorize } = require('../middleware/auth.middleware');

// Get all organizations (admin only)
router.get(
  '/',
  authorize('admin'),
  organizationController.getAllOrganizations
);

// Create organization (admin only)
router.post(
  '/',
  authorize('admin'),
  [
    body('name').notEmpty().withMessage('Organization name is required'),
    body('contactEmail').optional().isEmail().withMessage('Please provide a valid email'),
    body('subscription.plan').optional().isIn(['free', 'basic', 'premium', 'enterprise']).withMessage('Invalid subscription plan'),
    body('subscription.status').optional().isIn(['active', 'expired', 'trial']).withMessage('Invalid subscription status')
  ],
  organizationController.createOrganization
);

// Get organization by ID
router.get(
  '/:id',
  organizationController.getOrganizationById
);

// Update organization
router.put(
  '/:id',
  authorize('admin'),
  [
    body('name').optional().notEmpty().withMessage('Organization name cannot be empty'),
    body('contactEmail').optional().isEmail().withMessage('Please provide a valid email'),
    body('subscription.plan').optional().isIn(['free', 'basic', 'premium', 'enterprise']).withMessage('Invalid subscription plan'),
    body('subscription.status').optional().isIn(['active', 'expired', 'trial']).withMessage('Invalid subscription status')
  ],
  organizationController.updateOrganization
);

// Delete organization (admin only)
router.delete(
  '/:id',
  authorize('admin'),
  organizationController.deleteOrganization
);

module.exports = router;
