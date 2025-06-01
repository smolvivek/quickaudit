const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Audit = require('../models/audit.model');
const Action = require('../models/action.model');

// Sync offline data
exports.syncData = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { audits, actions, lastSyncTimestamp } = req.body;
    const userId = req.user.userId;
    const organizationId = req.user.organization;
    
    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Process incoming audits
      const auditResults = await processAudits(audits, userId, organizationId, lastSyncTimestamp, session);
      
      // Process incoming actions
      const actionResults = await processActions(actions, userId, organizationId, lastSyncTimestamp, session);
      
      // Get server changes since last sync
      const serverChanges = await getServerChanges(userId, organizationId, lastSyncTimestamp);
      
      // Commit transaction
      await session.commitTransaction();
      session.endSession();
      
      // Return sync results
      res.status(200).json({
        message: 'Sync completed successfully',
        timestamp: new Date().toISOString(),
        results: {
          audits: auditResults,
          actions: actionResults
        },
        serverChanges
      });
    } catch (error) {
      // Abort transaction on error
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ message: 'Server error during sync process' });
  }
};

// Process incoming audits
async function processAudits(audits, userId, organizationId, lastSyncTimestamp, session) {
  if (!audits || !Array.isArray(audits) || audits.length === 0) {
    return { created: 0, updated: 0, conflicts: 0 };
  }
  
  let created = 0;
  let updated = 0;
  let conflicts = 0;
  
  for (const auditData of audits) {
    try {
      // Check if audit exists
      let audit = null;
      
      if (auditData.syncId) {
        audit = await Audit.findOne({ syncId: auditData.syncId }).session(session);
      }
      
      if (!audit && auditData._id) {
        audit = await Audit.findById(auditData._id).session(session);
      }
      
      if (!audit) {
        // Create new audit
        audit = new Audit({
          ...auditData,
          organization: organizationId,
          auditor: userId,
          syncId: auditData.syncId || new mongoose.Types.ObjectId().toString(),
          syncStatus: 'synced'
        });
        
        await audit.save({ session });
        created++;
      } else {
        // Check for conflicts
        if (audit.updatedAt && new Date(audit.updatedAt) > new Date(lastSyncTimestamp)) {
          // Server version is newer, potential conflict
          if (auditData.syncStatus === 'conflict') {
            // Client is sending conflict resolution
            Object.assign(audit, auditData);
            audit.syncStatus = 'synced';
            await audit.save({ session });
            updated++;
          } else {
            // Mark as conflict
            audit.syncStatus = 'conflict';
            await audit.save({ session });
            conflicts++;
          }
        } else {
          // No conflict, update audit
          Object.assign(audit, auditData);
          audit.syncStatus = 'synced';
          await audit.save({ session });
          updated++;
        }
      }
    } catch (error) {
      console.error('Error processing audit:', error);
      conflicts++;
    }
  }
  
  return { created, updated, conflicts };
}

// Process incoming actions
async function processActions(actions, userId, organizationId, lastSyncTimestamp, session) {
  if (!actions || !Array.isArray(actions) || actions.length === 0) {
    return { created: 0, updated: 0, conflicts: 0 };
  }
  
  let created = 0;
  let updated = 0;
  let conflicts = 0;
  
  for (const actionData of actions) {
    try {
      // Check if action exists
      let action = null;
      
      if (actionData.syncId) {
        action = await Action.findOne({ syncId: actionData.syncId }).session(session);
      }
      
      if (!action && actionData._id) {
        action = await Action.findById(actionData._id).session(session);
      }
      
      if (!action) {
        // Create new action
        action = new Action({
          ...actionData,
          organization: organizationId,
          assignedBy: userId,
          syncId: actionData.syncId || new mongoose.Types.ObjectId().toString(),
          syncStatus: 'synced'
        });
        
        await action.save({ session });
        created++;
      } else {
        // Check for conflicts
        if (action.updatedAt && new Date(action.updatedAt) > new Date(lastSyncTimestamp)) {
          // Server version is newer, potential conflict
          if (actionData.syncStatus === 'conflict') {
            // Client is sending conflict resolution
            Object.assign(action, actionData);
            action.syncStatus = 'synced';
            await action.save({ session });
            updated++;
          } else {
            // Mark as conflict
            action.syncStatus = 'conflict';
            await action.save({ session });
            conflicts++;
          }
        } else {
          // No conflict, update action
          Object.assign(action, actionData);
          action.syncStatus = 'synced';
          await action.save({ session });
          updated++;
        }
      }
    } catch (error) {
      console.error('Error processing action:', error);
      conflicts++;
    }
  }
  
  return { created, updated, conflicts };
}

// Get server changes since last sync
async function getServerChanges(userId, organizationId, lastSyncTimestamp) {
  // Find audits updated since last sync
  const audits = await Audit.find({
    organization: organizationId,
    updatedAt: { $gt: new Date(lastSyncTimestamp) },
    syncStatus: { $ne: 'conflict' }
  }).populate('auditor', 'firstName lastName')
    .populate('supervisor', 'firstName lastName')
    .populate('template', 'title');
  
  // Find actions updated since last sync
  const actions = await Action.find({
    organization: organizationId,
    updatedAt: { $gt: new Date(lastSyncTimestamp) },
    syncStatus: { $ne: 'conflict' }
  }).populate('assignee', 'firstName lastName')
    .populate('assignedBy', 'firstName lastName');
  
  return {
    audits,
    actions
  };
}

// Get sync status
exports.getSyncStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const organizationId = req.user.organization;
    
    // Count conflicts
    const auditConflicts = await Audit.countDocuments({
      organization: organizationId,
      syncStatus: 'conflict'
    });
    
    const actionConflicts = await Action.countDocuments({
      organization: organizationId,
      syncStatus: 'conflict'
    });
    
    // Count pending sync items
    const auditPending = await Audit.countDocuments({
      organization: organizationId,
      syncStatus: 'pending_sync'
    });
    
    const actionPending = await Action.countDocuments({
      organization: organizationId,
      syncStatus: 'pending_sync'
    });
    
    res.status(200).json({
      conflicts: {
        audits: auditConflicts,
        actions: actionConflicts,
        total: auditConflicts + actionConflicts
      },
      pending: {
        audits: auditPending,
        actions: actionPending,
        total: auditPending + actionPending
      },
      lastSyncTimestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get sync status error:', error);
    res.status(500).json({ message: 'Server error while getting sync status' });
  }
};
