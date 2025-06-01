const User = require('../models/user.model');
const { validationResult } = require('express-validator');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    // Get organization ID from query params or use the user's organization
    const organizationId = req.query.organization || req.user.organization;

    // Find users by organization
    const users = await User.find({ organization: organizationId })
      .select('-passwordHash -salt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find user by ID
    const user = await User.findById(userId).select('-passwordHash -salt');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user belongs to the same organization or requester is admin
    if (user.organization.toString() !== req.user.organization.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Cannot access user from different organization' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.params.id;
    const { firstName, lastName, email, role, status } = req.body;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check permissions
    // Only admin can change roles or status
    if ((role && role !== user.role || status && status !== user.status) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access required to change role or status' });
    }

    // Check if user belongs to the same organization or requester is admin
    if (user.organization.toString() !== req.user.organization.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Cannot update user from different organization' });
    }

    // Update user fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (role && req.user.role === 'admin') user.role = role;
    if (status && req.user.role === 'admin') user.status = status;

    await user.save();

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error while updating user' });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    const userId = req.params.id;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user belongs to the same organization
    if (user.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: 'Forbidden: Cannot delete user from different organization' });
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
};

// Get current user profile
exports.getCurrentUser = async (req, res) => {
  try {
    // Find user by ID
    const user = await User.findById(req.user.userId).select('-passwordHash -salt');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error while fetching current user' });
  }
};

// Update current user profile
exports.updateCurrentUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, settings } = req.body;

    // Find user by ID
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (settings) {
      // Update only provided settings
      user.settings = {
        ...user.settings,
        ...settings
      };
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        settings: user.settings
      }
    });
  } catch (error) {
    console.error('Update current user error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

// Update user password
exports.updatePassword = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    // Find user by ID
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate current password
    const isPasswordValid = await user.validatePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const { hash, salt } = await User.hashPassword(newPassword);
    
    // Update user password
    user.passwordHash = hash;
    user.salt = salt;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Server error while updating password' });
  }
};
