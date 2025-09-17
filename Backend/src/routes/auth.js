import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { catchAsync, AppError } from '../middleware/errorHandler.js';
import { authenticateToken, hashPassword, comparePassword } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('userType').isIn(['farmer', 'facility', 'laboratory', 'regulatory', 'user']),
  body('profile.firstName').notEmpty().trim(),
  body('profile.lastName').notEmpty().trim()
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegistration, catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { email, password, userType, profile, location, ...userTypeData } = req.body;

  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    });
  }

  // Create user data based on type
  const userData = {
    email,
    password,
    userType,
    profile,
    location,
    isActive: true,
    isVerified: false
  };

  // Add user type specific data
  switch (userType) {
    case 'farmer':
      userData.farmerData = userTypeData.farmerData || {};
      break;
    case 'facility':
      userData.facilityData = userTypeData.facilityData || {};
      break;
    case 'laboratory':
      userData.laboratoryData = userTypeData.laboratoryData || {};
      break;
    case 'regulatory':
      userData.regulatoryData = userTypeData.regulatoryData || {};
      break;
  }

  // Create user
  const user = new User(userData);
  await user.save();

  // Generate token
  const token = generateToken(user._id);

  // Log activity
  await user.logActivity('user_registered', {
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: user.getDashboardData(),
      token
    }
  });
}));

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { email, password } = req.body;

  // Find user
  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if account is locked
  if (user.isLocked) {
    return res.status(423).json({
      success: false,
      message: 'Account is temporarily locked due to too many failed login attempts'
    });
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    // Increment login attempts
    await user.incLoginAttempts();
    
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if account is active
  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Account is deactivated'
    });
  }

  // Reset login attempts
  await user.resetLoginAttempts();

  // Ensure stats object exists to avoid runtime errors on older records
  if (!user.stats) {
    user.stats = {
      totalLogins: 0,
      dataUploads: 0,
      qualityScore: 0,
      lastActivity: new Date()
    };
  }

  // Update last login and stats
  user.lastLogin = new Date();
  user.stats.totalLogins = (user.stats.totalLogins || 0) + 1;
  user.stats.lastActivity = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user._id);

  // Log activity
  await user.logActivity('user_login', {
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: user.getDashboardData(),
      token
    }
  });
}));

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authenticateToken, catchAsync(async (req, res) => {
  // Log activity
  await req.user.logActivity('user_logout', {
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.json({
    success: true,
    message: 'Logout successful'
  });
}));

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticateToken, catchAsync(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user.getDashboardData()
    }
  });
}));

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, catchAsync(async (req, res) => {
  const { profile, location, preferences } = req.body;
  const user = req.user;

  // Update profile
  if (profile) {
    user.profile = { ...user.profile, ...profile };
  }

  // Update location
  if (location) {
    user.location = { ...user.location, ...location };
  }

  // Update preferences
  if (preferences) {
    user.preferences = { ...user.preferences, ...preferences };
  }

  await user.save();

  // Log activity
  await user.logActivity('profile_updated', {
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
    updatedFields: Object.keys(req.body)
  });

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: user.getDashboardData()
    }
  });
}));

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', authenticateToken, catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password and new password are required'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters long'
    });
  }

  const user = req.user;

  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Log activity
  await user.logActivity('password_changed', {
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
}));

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }

  const user = await User.findByEmail(email);
  if (!user) {
    // Don't reveal if user exists or not
    return res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent'
    });
  }

  // Generate reset token
  const resetToken = jwt.sign(
    { userId: user._id, type: 'password_reset' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Save reset token
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  // In production, send email with reset link
  console.log(`Password reset token for ${email}: ${resetToken}`);

  res.json({
    success: true,
    message: 'If an account with that email exists, a password reset link has been sent'
  });
}));

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', catchAsync(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Token and new password are required'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters long'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'password_reset') {
      throw new Error('Invalid token type');
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user || user.resetPasswordToken !== token || user.resetPasswordExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Log activity
    await user.logActivity('password_reset', {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token'
    });
  }
}));

// @route   POST /api/auth/verify-email
// @desc    Verify email address
// @access  Public
router.post('/verify-email', catchAsync(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Verification token is required'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'email_verification') {
      throw new Error('Invalid token type');
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user || user.emailVerificationToken !== token) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token'
      });
    }

    // Update user
    user.emailVerified = true;
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    // Log activity
    await user.logActivity('email_verified', {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid verification token'
    });
  }
}));

// @route   POST /api/auth/resend-verification
// @desc    Resend email verification
// @access  Private
router.post('/resend-verification', authenticateToken, catchAsync(async (req, res) => {
  const user = req.user;

  if (user.emailVerified) {
    return res.status(400).json({
      success: false,
      message: 'Email is already verified'
    });
  }

  // Generate verification token
  const verificationToken = jwt.sign(
    { userId: user._id, type: 'email_verification' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Save verification token
  user.emailVerificationToken = verificationToken;
  await user.save();

  // In production, send verification email
  console.log(`Email verification token for ${user.email}: ${verificationToken}`);

  res.json({
    success: true,
    message: 'Verification email sent'
  });
}));

// @route   GET /api/auth/activity
// @desc    Get user activity log
// @access  Private
router.get('/activity', authenticateToken, catchAsync(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const user = req.user;

  const activities = user.activityLog
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice((page - 1) * limit, page * limit);

  res.json({
    success: true,
    data: {
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: user.activityLog.length,
        pages: Math.ceil(user.activityLog.length / limit)
      }
    }
  });
}));

// @route   DELETE /api/auth/account
// @desc    Delete user account
// @access  Private
router.delete('/account', authenticateToken, catchAsync(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Password is required to delete account'
    });
  }

  const user = req.user;

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(400).json({
      success: false,
      message: 'Incorrect password'
    });
  }

  // Deactivate account instead of deleting
  user.isActive = false;
  user.email = `deleted_${Date.now()}_${user.email}`;
  await user.save();

  // Log activity
  await user.logActivity('account_deleted', {
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.json({
    success: true,
    message: 'Account deleted successfully'
  });
}));

export default router;
