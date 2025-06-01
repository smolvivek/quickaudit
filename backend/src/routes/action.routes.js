const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const actionController = require('../controllers/action.controller');
const { authorize } = require('../middleware/auth.middleware');

// Get all actions for organization
router.get(
  '/',
  actionController.getAllActions
);

// Get action by ID
router.get(
  '/:id',
  actionController.getActionById
);

// Update action
router.put(
  '/:id',
  [
    body('title').optional().notEmpty().withMessage('Action title cannot be empty'),
    body('dueDate').optional().isISO8601().withMessage('Invalid due date format'),
    body('priority').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority')
  ],
  actionController.updateAction
);

// Update action status
router.put(
  '/:id/status',
  [
    body('status').isIn(['open', 'in_progress', 'completed']).withMessage('Invalid status')
  ],
  actionController.updateActionStatus
);

// Update action progress
router.put(
  '/:id/progress',
  [
    body('progress').isInt({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100')
  ],
  actionController.updateActionProgress
);

// Add comment to action
router.post(
  '/:id/comments',
  [
    body('text').notEmpty().withMessage('Comment text is required')
  ],
  actionController.addComment
);

module.exports = router;
