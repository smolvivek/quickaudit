const Action = require('../models/action.model');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Get all actions for organization
exports.getAllActions = async (req, res) => {
  try {
    const organizationId = req.user.organization;
    const { status, assignee, audit, priority, dueDate } = req.query;
    
    // Build query
    const query = { organization: organizationId };
    
    // Add filters if provided
    if (status) {
      query.status = status;
    }
    
    if (assignee) {
      query.assignee = assignee;
    }
    
    if (audit) {
      query.audit = audit;
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    // Due date filter
    if (dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate === 'overdue') {
        query.dueDate = { $lt: today };
        query.status = { $ne: 'completed' };
      } else if (dueDate === 'today') {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        query.dueDate = { $gte: today, $lt: tomorrow };
      } else if (dueDate === 'week') {
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        query.dueDate = { $gte: today, $lt: nextWeek };
      }
    }
    
    // Role-based filtering
    if (req.user.role === 'field_auditor' || req.user.role === 'supervisor') {
      // Field auditors and supervisors can see actions assigned to them or created by them
      query.$or = [
        { assignee: req.user.userId },
        { assignedBy: req.user.userId }
      ];
    } else if (req.user.role === 'client') {
      // Clients can only see actions from completed audits
      // This would require a join/lookup with audits
      // For simplicity, we'll just return an empty array for now
      return res.status(200).json({
        count: 0,
        actions: []
      });
    }
    
    // Find actions with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const actions = await Action.find(query)
      .sort({ dueDate: 1, priority: -1 })
      .skip(skip)
      .limit(limit)
      .populate('assignee', 'firstName lastName')
      .populate('assignedBy', 'firstName lastName')
      .populate('audit', 'title');
    
    const total = await Action.countDocuments(query);
    
    res.status(200).json({
      count: actions.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      actions
    });
  } catch (error) {
    console.error('Get all actions error:', error);
    res.status(500).json({ message: 'Server error while fetching actions' });
  }
};

// Get action by ID
exports.getActionById = async (req, res) => {
  try {
    const actionId = req.params.id;
    
    // Find action by ID
    const action = await Action.findById(actionId)
      .populate('assignee', 'firstName lastName')
      .populate('assignedBy', 'firstName lastName')
      .populate('audit', 'title status')
      .populate('comments.user', 'firstName lastName');
    
    if (!action) {
      return res.status(404).json({ message: 'Action not found' });
    }
    
    // Check if action belongs to user's organization
    if (action.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: 'Forbidden: Cannot access action from different organization' });
    }
    
    // Role-based access control
    if (req.user.role === 'field_auditor' || req.user.role === 'supervisor') {
      // Field auditors and supervisors can only see actions assigned to them or created by them
      if (action.assignee.toString() !== req.user.userId.toString() && 
          action.assignedBy.toString() !== req.user.userId.toString()) {
        return res.status(403).json({ message: 'Forbidden: Cannot access this action' });
      }
    } else if (req.user.role === 'client') {
      // Clients can only see actions from completed audits
      // This would require checking the audit status
      return res.status(403).json({ message: 'Forbidden: Clients cannot access actions directly' });
    }
    
    res.status(200).json({ action });
  } catch (error) {
    console.error('Get action by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching action' });
  }
};

// Update action
exports.updateAction = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const actionId = req.params.id;
    const { title, description, dueDate, priority, attachments } = req.body;
    
    // Find action by ID
    const action = await Action.findById(actionId);
    
    if (!action) {
      return res.status(404).json({ message: 'Action not found' });
    }
    
    // Check if action belongs to user's organization
    if (action.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: 'Forbidden: Cannot update action from different organization' });
    }
    
    // Role-based access control
    // Only the creator or admin can update action details
    if (req.user.role !== 'admin' && action.assignedBy.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: Only the creator or admin can update action details' });
    }
    
    // Update action fields
    if (title) action.title = title;
    if (description !== undefined) action.description = description;
    if (dueDate) action.dueDate = new Date(dueDate);
    if (priority) action.priority = priority;
    if (attachments) action.attachments = attachments;
    
    // Update sync status
    action.syncStatus = 'pending_sync';
    
    await action.save();
    
    res.status(200).json({
      message: 'Action updated successfully',
      action
    });
  } catch (error) {
    console.error('Update action error:', error);
    res.status(500).json({ message: 'Server error while updating action' });
  }
};

// Update action status
exports.updateActionStatus = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const actionId = req.params.id;
    const { status } = req.body;
    
    // Find action by ID
    const action = await Action.findById(actionId);
    
    if (!action) {
      return res.status(404).json({ message: 'Action not found' });
    }
    
    // Check if action belongs to user's organization
    if (action.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: 'Forbidden: Cannot update action from different organization' });
    }
    
    // Role-based access control
    // Only the assignee, creator, or admin can update action status
    if (req.user.role !== 'admin' && 
        action.assignee.toString() !== req.user.userId.toString() && 
        action.assignedBy.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: Only the assignee, creator, or admin can update action status' });
    }
    
    // Update status
    action.status = status;
    
    // Set completed date if status is completed
    if (status === 'completed' && !action.completedDate) {
      action.completedDate = new Date();
      action.progress = 100;
    } else if (status !== 'completed') {
      action.completedDate = null;
    }
    
    // Update sync status
    action.syncStatus = 'pending_sync';
    
    await action.save();
    
    res.status(200).json({
      message: 'Action status updated successfully',
      action
    });
  } catch (error) {
    console.error('Update action status error:', error);
    res.status(500).json({ message: 'Server error while updating action status' });
  }
};

// Update action progress
exports.updateActionProgress = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const actionId = req.params.id;
    const { progress } = req.body;
    
    // Find action by ID
    const action = await Action.findById(actionId);
    
    if (!action) {
      return res.status(404).json({ message: 'Action not found' });
    }
    
    // Check if action belongs to user's organization
    if (action.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: 'Forbidden: Cannot update action from different organization' });
    }
    
    // Role-based access control
    // Only the assignee can update progress
    if (action.assignee.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: Only the assignee can update action progress' });
    }
    
    // Update progress
    action.progress = progress;
    
    // Update status based on progress
    if (progress === 0) {
      action.status = 'open';
    } else if (progress === 100) {
      action.status = 'completed';
      action.completedDate = new Date();
    } else {
      action.status = 'in_progress';
    }
    
    // Update sync status
    action.syncStatus = 'pending_sync';
    
    await action.save();
    
    res.status(200).json({
      message: 'Action progress updated successfully',
      action
    });
  } catch (error) {
    console.error('Update action progress error:', error);
    res.status(500).json({ message: 'Server error while updating action progress' });
  }
};

// Add comment to action
exports.addComment = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const actionId = req.params.id;
    const { text } = req.body;
    
    // Find action by ID
    const action = await Action.findById(actionId);
    
    if (!action) {
      return res.status(404).json({ message: 'Action not found' });
    }
    
    // Check if action belongs to user's organization
    if (action.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: 'Forbidden: Cannot comment on action from different organization' });
    }
    
    // Role-based access control
    // Only the assignee, creator, or admin can add comments
    if (req.user.role !== 'admin' && 
        action.assignee.toString() !== req.user.userId.toString() && 
        action.assignedBy.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: Only the assignee, creator, or admin can add comments' });
    }
    
    // Add comment
    action.comments.push({
      user: req.user.userId,
      text,
      timestamp: new Date()
    });
    
    // Update sync status
    action.syncStatus = 'pending_sync';
    
    await action.save();
    
    // Populate the new comment's user
    const updatedAction = await Action.findById(actionId)
      .populate('comments.user', 'firstName lastName');
    
    res.status(200).json({
      message: 'Comment added successfully',
      action: updatedAction
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error while adding comment' });
  }
};
