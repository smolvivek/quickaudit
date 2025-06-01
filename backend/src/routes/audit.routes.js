const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auditController = require('../controllers/audit.controller');
const { authorize } = require('../middleware/auth.middleware');

// Get all audits for organization
router.get(
  '/',
  auditController.getAllAudits
);

// Create audit
router.post(
  '/',
  authorize('field_auditor', 'supervisor', 'admin'),
  [
    body('title').notEmpty().withMessage('Audit title is required'),
    body('template').notEmpty().withMessage('Audit template is required'),
    body('location').notEmpty().withMessage('Audit location is required')
  ],
  auditController.createAudit
);

// Get audit by ID
router.get(
  '/:id',
  auditController.getAuditById
);

// Update audit
router.put(
  '/:id',
  authorize('field_auditor', 'supervisor', 'admin'),
  auditController.updateAudit
);

// Delete audit
router.delete(
  '/:id',
  authorize('field_auditor', 'supervisor', 'admin'),
  auditController.deleteAudit
);

// Update audit status
router.put(
  '/:id/status',
  authorize('field_auditor', 'supervisor', 'admin'),
  [
    body('status').isIn(['draft', 'in_progress', 'pending_review', 'completed', 'archived']).withMessage('Invalid status')
  ],
  auditController.updateAuditStatus
);

// Submit audit for review
router.post(
  '/:id/submit',
  authorize('field_auditor'),
  auditController.submitAudit
);

// Approve audit (supervisor only)
router.post(
  '/:id/approve',
  authorize('supervisor'),
  auditController.approveAudit
);

// Reject audit (supervisor only)
router.post(
  '/:id/reject',
  authorize('supervisor'),
  [
    body('feedback').notEmpty().withMessage('Feedback is required when rejecting an audit')
  ],
  auditController.rejectAudit
);

// Generate PDF report
router.get(
  '/:id/pdf',
  auditController.generatePdfReport
);

module.exports = router;
