const Organization = require('../models/organization.model');
const { validationResult } = require('express-validator');

// Get all organizations (admin only)
exports.getAllOrganizations = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    // Find all organizations
    const organizations = await Organization.find().sort({ name: 1 });

    res.status(200).json({
      count: organizations.length,
      organizations
    });
  } catch (error) {
    console.error('Get all organizations error:', error);
    res.status(500).json({ message: 'Server error while fetching organizations' });
  }
};

// Create organization (admin only)
exports.createOrganization = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    const { name, address, contactEmail, contactPhone, subscription, settings } = req.body;

    // Check if organization already exists
    const existingOrg = await Organization.findOne({ name });
    if (existingOrg) {
      return res.status(400).json({ message: 'Organization with this name already exists' });
    }

    // Create new organization
    const organization = new Organization({
      name,
      address,
      contactEmail,
      contactPhone,
      subscription,
      settings
    });

    await organization.save();

    res.status(201).json({
      message: 'Organization created successfully',
      organization
    });
  } catch (error) {
    console.error('Create organization error:', error);
    res.status(500).json({ message: 'Server error while creating organization' });
  }
};

// Get organization by ID
exports.getOrganizationById = async (req, res) => {
  try {
    const orgId = req.params.id;

    // Find organization by ID
    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Check if user belongs to this organization or is admin
    if (organization._id.toString() !== req.user.organization.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Cannot access different organization' });
    }

    res.status(200).json({ organization });
  } catch (error) {
    console.error('Get organization by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching organization' });
  }
};

// Update organization
exports.updateOrganization = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const orgId = req.params.id;
    const { name, address, contactEmail, contactPhone, logo, subscription, settings } = req.body;

    // Find organization by ID
    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Check if user belongs to this organization and is admin
    if (organization._id.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: 'Forbidden: Cannot update different organization' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    // Update organization fields
    if (name) organization.name = name;
    if (address) organization.address = address;
    if (contactEmail) organization.contactEmail = contactEmail;
    if (contactPhone) organization.contactPhone = contactPhone;
    if (logo) organization.logo = logo;
    
    // Update subscription if provided
    if (subscription) {
      organization.subscription = {
        ...organization.subscription,
        ...subscription
      };
    }
    
    // Update settings if provided
    if (settings) {
      // Deep merge settings
      if (settings.branding) {
        organization.settings.branding = {
          ...organization.settings.branding,
          ...settings.branding
        };
      }
      
      if (settings.features) {
        organization.settings.features = {
          ...organization.settings.features,
          ...settings.features
        };
      }
    }

    await organization.save();

    res.status(200).json({
      message: 'Organization updated successfully',
      organization
    });
  } catch (error) {
    console.error('Update organization error:', error);
    res.status(500).json({ message: 'Server error while updating organization' });
  }
};

// Delete organization (admin only)
exports.deleteOrganization = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    const orgId = req.params.id;

    // Find organization by ID
    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // In a real implementation, you would need to check for dependencies
    // and possibly archive instead of delete

    // Delete organization
    await Organization.findByIdAndDelete(orgId);

    res.status(200).json({ message: 'Organization deleted successfully' });
  } catch (error) {
    console.error('Delete organization error:', error);
    res.status(500).json({ message: 'Server error while deleting organization' });
  }
};
