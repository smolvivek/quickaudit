const Audit = require('../models/audit.model');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Get all audits for organization
exports.getAllAudits = async (req, res) => {
  try {
    const organizationId = req.user.organization;
    const { status, auditor, supervisor, startDate, endDate, location } = req.query;
    
    // Build query
    const query = { organization: organizationId };
    
    // Add filters if provided
    if (status) {
      query.status = status;
    }
    
    if (auditor) {
      query.auditor = auditor;
    }
    
    if (supervisor) {
      query.supervisor = supervisor;
    }
    
    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    // Role-based filtering
    if (req.user.role === 'field_auditor') {
      // Field auditors can only see their own audits
      query.auditor = req.user.userId;
    } else if (req.user.role === 'supervisor') {
      // Supervisors can see audits they supervise or all pending review
      query.$or = [
        { supervisor: req.user.userId },
        { status: 'pending_review' }
      ];
    } else if (req.user.role === 'client') {
      // Clients can only see completed audits
      query.status = 'completed';
    }
    
    // Find audits with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const audits = await Audit.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('auditor', 'firstName lastName')
      .populate('supervisor', 'firstName lastName')
      .populate('template', 'title category');
    
    const total = await Audit.countDocuments(query);
    
    res.status(200).json({
      count: audits.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      audits
    });
  } catch (error) {
    console.error('Get all audits error:', error);
    res.status(500).json({ message: 'Server error while fetching audits' });
  }
};

// Create audit
exports.createAudit = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { title, template, location, supervisor } = req.body;
    
    // Create new audit
    const audit = new Audit({
      title,
      template,
      organization: req.user.organization,
      location,
      auditor: req.user.userId,
      supervisor,
      status: 'draft',
      syncId: new mongoose.Types.ObjectId().toString() // Generate unique sync ID
    });
    
    await audit.save();
    
    res.status(201).json({
      message: 'Audit created successfully',
      audit
    });
  } catch (error) {
    console.error('Create audit error:', error);
    res.status(500).json({ message: 'Server error while creating audit' });
  }
};

// Get audit by ID
exports.getAuditById = async (req, res) => {
  try {
    const auditId = req.params.id;
    
    // Find audit by ID
    const audit = await Audit.findById(auditId)
      .populate('auditor', 'firstName lastName')
      .populate('supervisor', 'firstName lastName')
      .populate('template', 'title category sections');
    
    if (!audit) {
      return res.status(404).json({ message: 'Audit not found' });
    }
    
    // Check if audit belongs to user's organization
    if (audit.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: 'Forbidden: Cannot access audit from different organization' });
    }
    
    // Role-based access control
    if (req.user.role === 'field_auditor' && audit.auditor.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: Cannot access audit assigned to another auditor' });
    }
    
    if (req.user.role === 'client' && audit.status !== 'completed') {
      return res.status(403).json({ message: 'Forbidden: Clients can only access completed audits' });
    }
    
    res.status(200).json({ audit });
  } catch (error) {
    console.error('Get audit by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching audit' });
  }
};

// Update audit
exports.updateAudit = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const auditId = req.params.id;
    const { title, location, sections, findings, notes } = req.body;
    
    // Find audit by ID
    const audit = await Audit.findById(auditId);
    
    if (!audit) {
      return res.status(404).json({ message: 'Audit not found' });
    }
    
    // Check if audit belongs to user's organization
    if (audit.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: 'Forbidden: Cannot update audit from different organization' });
    }
    
    // Role-based access control
    if (req.user.role === 'field_auditor' && audit.auditor.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: Cannot update audit assigned to another auditor' });
    }
    
    if (req.user.role === 'client') {
      return res.status(403).json({ message: 'Forbidden: Clients cannot update audits' });
    }
    
    // Check if audit is in a state that can be updated
    if (audit.status === 'completed' || audit.status === 'archived') {
      return res.status(400).json({ message: 'Cannot update completed or archived audit' });
    }
    
    // Update audit fields
    if (title) audit.title = title;
    if (location) audit.location = location;
    if (sections) audit.sections = sections;
    if (findings) audit.findings = findings;
    if (notes !== undefined) audit.notes = notes;
    
    // Calculate scores if sections are updated
    if (sections) {
      audit.calculateSectionScores();
      audit.score = audit.calculateScore();
    }
    
    // Update sync status
    audit.syncStatus = 'pending_sync';
    
    await audit.save();
    
    res.status(200).json({
      message: 'Audit updated successfully',
      audit
    });
  } catch (error) {
    console.error('Update audit error:', error);
    res.status(500).json({ message: 'Server error while updating audit' });
  }
};

// Delete audit
exports.deleteAudit = async (req, res) => {
  try {
    const auditId = req.params.id;
    
    // Find audit by ID
    const audit = await Audit.findById(auditId);
    
    if (!audit) {
      return res.status(404).json({ message: 'Audit not found' });
    }
    
    // Check if audit belongs to user's organization
    if (audit.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: 'Forbidden: Cannot delete audit from different organization' });
    }
    
    // Role-based access control
    if (req.user.role === 'field_auditor' && audit.auditor.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: Cannot delete audit assigned to another auditor' });
    }
    
    if (req.user.role === 'client') {
      return res.status(403).json({ message: 'Forbidden: Clients cannot delete audits' });
    }
    
    // Check if audit is in a state that can be deleted
    if (audit.status !== 'draft') {
      return res.status(400).json({ message: 'Only draft audits can be deleted' });
    }
    
    // Delete audit
    await Audit.findByIdAndDelete(auditId);
    
    res.status(200).json({ message: 'Audit deleted successfully' });
  } catch (error) {
    console.error('Delete audit error:', error);
    res.status(500).json({ message: 'Server error while deleting audit' });
  }
};

// Update audit status
exports.updateAuditStatus = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const auditId = req.params.id;
    const { status } = req.body;
    
    // Find audit by ID
    const audit = await Audit.findById(auditId);
    
    if (!audit) {
      return res.status(404).json({ message: 'Audit not found' });
    }
    
    // Check if audit belongs to user's organization
    if (audit.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: 'Forbidden: Cannot update audit from different organization' });
    }
    
    // Role-based access control for status changes
    if (status === 'in_progress' || status === 'pending_review') {
      // Only auditor can change to in_progress or pending_review
      if (req.user.role !== 'field_auditor' || audit.auditor.toString() !== req.user.userId.toString()) {
        return res.status(403).json({ message: 'Forbidden: Only assigned auditor can update to this status' });
      }
    } else if (status === 'completed') {
      // Only supervisor can approve and complete
      if (req.user.role !== 'supervisor') {
        return res.status(403).json({ message: 'Forbidden: Only supervisors can complete audits' });
      }
    } else if (status === 'archived') {
      // Only admin can archive
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can archive audits' });
      }
    }
    
    // Validate status transitions
    const validTransitions = {
      draft: ['in_progress'],
      in_progress: ['pending_review'],
      pending_review: ['in_progress', 'completed'],
      completed: ['archived']
    };
    
    if (!validTransitions[audit.status] || !validTransitions[audit.status].includes(status)) {
      return res.status(400).json({ 
        message: `Invalid status transition from ${audit.status} to ${status}`,
        validTransitions: validTransitions[audit.status]
      });
    }
    
    // Update status
    audit.status = status;
    
    // Set timestamps for status changes
    if (status === 'in_progress' && !audit.startTime) {
      audit.startTime = new Date();
    } else if (status === 'completed') {
      audit.endTime = new Date();
    }
    
    // Update sync status
    audit.syncStatus = 'pending_sync';
    
    await audit.save();
    
    res.status(200).json({
      message: 'Audit status updated successfully',
      audit
    });
  } catch (error) {
    console.error('Update audit status error:', error);
    res.status(500).json({ message: 'Server error while updating audit status' });
  }
};

// Submit audit for review
exports.submitAudit = async (req, res) => {
  try {
    const auditId = req.params.id;
    
    // Find audit by ID
    const audit = await Audit.findById(auditId);
    
    if (!audit) {
      return res.status(404).json({ message: 'Audit not found' });
    }
    
    // Check if audit belongs to user's organization
    if (audit.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: 'Forbidden: Cannot submit audit from different organization' });
    }
    
    // Role-based access control
    if (req.user.role !== 'field_auditor' || audit.auditor.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: Only assigned auditor can submit audit for review' });
    }
    
    // Check if audit is in a state that can be submitted
    if (audit.status !== 'in_progress') {
      return res.status(400).json({ message: 'Only in-progress audits can be submitted for review' });
    }
    
    // Calculate scores before submission
    audit.calculateSectionScores();
    audit.score = audit.calculateScore();
    
    // Update status
    audit.status = 'pending_review';
    
    // Update sync status
    audit.syncStatus = 'pending_sync';
    
    await audit.save();
    
    // TODO: Send notification to supervisor
    
    res.status(200).json({
      message: 'Audit submitted for review successfully',
      audit
    });
  } catch (error) {
    console.error('Submit audit error:', error);
    res.status(500).json({ message: 'Server error while submitting audit' });
  }
};

// Approve audit (supervisor only)
exports.approveAudit = async (req, res) => {
  try {
    const auditId = req.params.id;
    
    // Find audit by ID
    const audit = await Audit.findById(auditId);
    
    if (!audit) {
      return res.status(404).json({ message: 'Audit not found' });
    }
    
    // Check if audit belongs to user's organization
    if (audit.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: 'Forbidden: Cannot approve audit from different organization' });
    }
    
    // Role-based access control
    if (req.user.role !== 'supervisor') {
      return res.status(403).json({ message: 'Forbidden: Only supervisors can approve audits' });
    }
    
    // Check if audit is in a state that can be approved
    if (audit.status !== 'pending_review') {
      return res.status(400).json({ message: 'Only pending review audits can be approved' });
    }
    
    // Update status
    audit.status = 'completed';
    audit.endTime = new Date();
    
    // Update supervisor if not already set
    if (!audit.supervisor) {
      audit.supervisor = req.user.userId;
    }
    
    // Update sync status
    audit.syncStatus = 'pending_sync';
    
    await audit.save();
    
    // TODO: Send notification to auditor
    
    res.status(200).json({
      message: 'Audit approved successfully',
      audit
    });
  } catch (error) {
    console.error('Approve audit error:', error);
    res.status(500).json({ message: 'Server error while approving audit' });
  }
};

// Reject audit (supervisor only)
exports.rejectAudit = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const auditId = req.params.id;
    const { feedback } = req.body;
    
    // Find audit by ID
    const audit = await Audit.findById(auditId);
    
    if (!audit) {
      return res.status(404).json({ message: 'Audit not found' });
    }
    
    // Check if audit belongs to user's organization
    if (audit.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: 'Forbidden: Cannot reject audit from different organization' });
    }
    
    // Role-based access control
    if (req.user.role !== 'supervisor') {
      return res.status(403).json({ message: 'Forbidden: Only supervisors can reject audits' });
    }
    
    // Check if audit is in a state that can be rejected
    if (audit.status !== 'pending_review') {
      return res.status(400).json({ message: 'Only pending review audits can be rejected' });
    }
    
    // Update status
    audit.status = 'in_progress';
    
    // Add feedback to notes
    const supervisorFeedback = `[Supervisor Feedback ${new Date().toISOString()}]: ${feedback}`;
    audit.notes = audit.notes ? `${audit.notes}\n\n${supervisorFeedback}` : supervisorFeedback;
    
    // Update supervisor if not already set
    if (!audit.supervisor) {
      audit.supervisor = req.user.userId;
    }
    
    // Update sync status
    audit.syncStatus = 'pending_sync';
    
    await audit.save();
    
    // TODO: Send notification to auditor
    
    res.status(200).json({
      message: 'Audit rejected and returned to auditor',
      audit
    });
  } catch (error) {
    console.error('Reject audit error:', error);
    res.status(500).json({ message: 'Server error while rejecting audit' });
  }
};

// Generate PDF report
exports.generatePdfReport = async (req, res) => {
  try {
    const auditId = req.params.id;
    
    // Find audit by ID
    const audit = await Audit.findById(auditId)
      .populate('auditor', 'firstName lastName')
      .populate('supervisor', 'firstName lastName')
      .populate('template', 'title category');
    
    if (!audit) {
      return res.status(404).json({ message: 'Audit not found' });
    }
    
    // Check if audit belongs to user's organization
    if (audit.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: 'Forbidden: Cannot access audit from different organization' });
    }
    
    // Role-based access control
    if (req.user.role === 'field_auditor' && audit.auditor.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: Cannot access audit assigned to another auditor' });
    }
    
    // Check if audit is in a state that can be exported
    if (audit.status === 'draft') {
      return res.status(400).json({ message: 'Draft audits cannot be exported to PDF' });
    }
    
    // TODO: Implement actual PDF generation
    // This would typically use a library like PDFKit or html-pdf
    
    // For now, just return a success message
    res.status(200).json({
      message: 'PDF report generation would happen here',
      audit: audit._id,
      // In a real implementation, this would return a URL to the generated PDF
      pdfUrl: `/api/v1/files/reports/${audit._id}.pdf`
    });
  } catch (error) {
    console.error('Generate PDF report error:', error);
    res.status(500).json({ message: 'Server error while generating PDF report' });
  }
};
