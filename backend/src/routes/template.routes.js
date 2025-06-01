const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const templateController = require('../controllers/template.controller');
const { authorize } = require('../middleware/auth.middleware');

// Get all templates for organization
router.get(
  '/',
  templateController.getAllTemplates
);

// Create template
router.post(
  '/',
  authorize('admin', 'supervisor', 'field_auditor'),
  [
    body('title').notEmpty().withMessage('Template title is required'),
    body('category').notEmpty().withMessage('Template category is required'),
    body('sections').isArray().withMessage('Sections must be an array'),
    body('sections.*.title').notEmpty().withMessage('Section title is required'),
    body('sections.*.items').isArray().withMessage('Section items must be an array'),
    body('sections.*.items.*.text').notEmpty().withMessage('Item text is required')
  ],
  templateController.createTemplate
);

// Get template by ID
router.get(
  '/:id',
  templateController.getTemplateById
);

// Update template
router.put(
  '/:id',
  authorize('admin', 'supervisor', 'field_auditor'),
  [
    body('title').optional().notEmpty().withMessage('Template title cannot be empty'),
    body('category').optional().notEmpty().withMessage('Template category cannot be empty'),
    body('sections').optional().isArray().withMessage('Sections must be an array'),
    body('sections.*.title').optional().notEmpty().withMessage('Section title cannot be empty'),
    body('sections.*.items').optional().isArray().withMessage('Section items must be an array'),
    body('sections.*.items.*.text').optional().notEmpty().withMessage('Item text cannot be empty')
  ],
  templateController.updateTemplate
);

// Delete template
router.delete(
  '/:id',
  authorize('admin', 'field_auditor'),
  templateController.deleteTemplate
);

// Get all template categories
router.get(
  '/categories',
  templateController.getCategories
);

module.exports = router;
