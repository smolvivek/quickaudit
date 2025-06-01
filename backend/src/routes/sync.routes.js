const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const syncController = require('../controllers/sync.controller');

// Sync offline data
router.post(
  '/',
  [
    body('lastSyncTimestamp').isISO8601().withMessage('Invalid timestamp format'),
    body('audits').optional().isArray().withMessage('Audits must be an array'),
    body('actions').optional().isArray().withMessage('Actions must be an array')
  ],
  syncController.syncData
);

// Get sync status
router.get(
  '/status',
  syncController.getSyncStatus
);

module.exports = router;
