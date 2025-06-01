const AuditTemplate = require('../models/auditTemplate.model');
const { validationResult } = require('express-validator');

// Get all templates for organization
exports.getAllTemplates = async (req, res) => {
  try {
    const organizationId = req.user.organization;
    const { category, active } = req.query;
    
    // Build query
    const query = { organization: organizationId };
    
    // Add filters if provided
    if (category) {
      query.category = category;
    }
    
    if (active !== undefined) {
      query.isActive = active === 'true';
    }
    
    // Find templates
    const templates = await AuditTemplate.find(query)
      .sort({ updatedAt: -1 })
      .populate('creator', 'firstName lastName');
    
    res.status(200).json({
      count: templates.length,
      templates
    });
  } catch (error) {
    console.error('Get all templates error:', error);
    res.status(500).json({ message: 'Server error while fetching templates' });
  }
};

// Create template
exports.createTemplate = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { title, description, category, sections } = req.body;
    
    // Create new template
    const template = new AuditTemplate({
      title,
      description,
      organization: req.user.organization,
      creator: req.user.userId,
      category,
      sections
    });
    
    await template.save();
    
    res.status(201).json({
      message: 'Template created successfully',
      template
    });
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ message: 'Server error while creating template' });
  }
};

// Get template by ID
exports.getTemplateById = async (req, res) => {
  try {
    const templateId = req.params.id;
    
    // Find template by ID
    const template = await AuditTemplate.findById(templateId)
      .populate('creator', 'firstName lastName');
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    // Check if template belongs to user's organization
    if (template.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: 'Forbidden: Cannot access template from different organization' });
    }
    
    res.status(200).json({ template });
  } catch (error) {
    console.error('Get template by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching template' });
  }
};

// Update template
exports.updateTemplate = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const templateId = req.params.id;
    const { title, description, category, sections, isActive } = req.body;
    
    // Find template by ID
    const template = await AuditTemplate.findById(templateId);
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    // Check if template belongs to user's organization
    if (template.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: 'Forbidden: Cannot update template from different organization' });
    }
    
    // Check permissions
    // Only admin, supervisor, or the creator can update templates
    if (req.user.role !== 'admin' && req.user.role !== 'supervisor' && 
        template.creator.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions to update template' });
    }
    
    // Update template fields
    if (title) template.title = title;
    if (description !== undefined) template.description = description;
    if (category) template.category = category;
    if (sections) template.sections = sections;
    if (isActive !== undefined) template.isActive = isActive;
    
    await template.save();
    
    res.status(200).json({
      message: 'Template updated successfully',
      template
    });
  } catch (error) {
    console.error('Update template error:', error);
    res.status(500).json({ message: 'Server error while updating template' });
  }
};

// Delete template
exports.deleteTemplate = async (req, res) => {
  try {
    const templateId = req.params.id;
    
    // Find template by ID
    const template = await AuditTemplate.findById(templateId);
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    // Check if template belongs to user's organization
    if (template.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: 'Forbidden: Cannot delete template from different organization' });
    }
    
    // Check permissions
    // Only admin or the creator can delete templates
    if (req.user.role !== 'admin' && template.creator.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions to delete template' });
    }
    
    // In a real implementation, you would check if the template is in use
    // and possibly archive instead of delete
    
    // Delete template
    await AuditTemplate.findByIdAndDelete(templateId);
    
    res.status(200).json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({ message: 'Server error while deleting template' });
  }
};

// Get all template categories
exports.getCategories = async (req, res) => {
  try {
    const organizationId = req.user.organization;
    
    // Find distinct categories for the organization
    const categories = await AuditTemplate.distinct('category', { organization: organizationId });
    
    res.status(200).json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
};
