import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// Bcrypt configuration
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;

// Utility functions for password hashing
export const hashPassword = async (password) => {
  try {
    const saltRounds = BCRYPT_ROUNDS;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Password hashing error:', error);
    throw new Error('Failed to hash password');
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('Password comparison error:', error);
    throw new Error('Failed to compare password');
  }
};

// Middleware to authenticate JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Middleware to check user type
export const requireUserType = (...allowedTypes) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedTypes.includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required user types: ${allowedTypes.join(', ')}`
      });
    }

    next();
  };
};

// Middleware to check if user is verified
export const requireVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Account verification required'
    });
  }

  next();
};

// Middleware to check if user owns the resource
export const requireOwnership = (resourceModel, resourceIdParam = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceIdParam];
      const resource = await resourceModel.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }

      // Check ownership based on user type and resource type
      let isOwner = false;

      if (resource.farmerId && req.user.userType === 'farmer') {
        isOwner = resource.farmerId.toString() === req.user._id.toString();
      } else if (resource.facilityId && req.user.userType === 'facility') {
        isOwner = resource.facilityId.toString() === req.user._id.toString();
      } else if (resource.laboratoryId && req.user.userType === 'laboratory') {
        isOwner = resource.laboratoryId.toString() === req.user._id.toString();
      } else if (req.user.userType === 'regulatory') {
        // Regulatory users can access all resources
        isOwner = true;
      }

      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You do not own this resource'
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking resource ownership'
      });
    }
  };
};

// Middleware to log user activity
export const logActivity = (action) => {
  return async (req, res, next) => {
    try {
      if (req.user) {
        await req.user.logActivity(action, {
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          endpoint: req.originalUrl,
          method: req.method
        });
      }
      next();
    } catch (error) {
      console.error('Activity logging error:', error);
      // Don't fail the request if logging fails
      next();
    }
  };
};

// Middleware to check rate limiting for specific user
export const userRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user._id.toString();
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    if (requests.has(userId)) {
      const userRequests = requests.get(userId);
      const validRequests = userRequests.filter(time => time > windowStart);
      requests.set(userId, validRequests);
    } else {
      requests.set(userId, []);
    }

    const userRequests = requests.get(userId);

    if (userRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    userRequests.push(now);
    next();
  };
};

// Middleware to validate user permissions for specific actions
export const validatePermissions = (action) => {
  const permissions = {
    'read_harvest': ['farmer', 'facility', 'laboratory', 'regulatory', 'user'],
    'write_harvest': ['farmer'],
    'read_processing': ['facility', 'laboratory', 'regulatory', 'user'],
    'write_processing': ['facility'],
    'read_quality_test': ['laboratory', 'regulatory', 'user'],
    'write_quality_test': ['laboratory'],
    'read_supply_chain': ['farmer', 'facility', 'laboratory', 'regulatory', 'user'],
    'write_supply_chain': ['facility', 'laboratory'],
    'read_compliance': ['regulatory'],
    'write_compliance': ['regulatory'],
    'read_analytics': ['farmer', 'facility', 'laboratory', 'regulatory'],
    'write_analytics': ['farmer', 'facility', 'laboratory', 'regulatory']
  };

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const allowedTypes = permissions[action];
    if (!allowedTypes) {
      return res.status(500).json({
        success: false,
        message: 'Invalid permission action'
      });
    }

    if (!allowedTypes.includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required permissions for: ${action}`
      });
    }

    next();
  };
};

// Middleware to check if user has blockchain verification
export const requireBlockchainVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (!req.user.blockchainVerified) {
    return res.status(403).json({
      success: false,
      message: 'Blockchain verification required'
    });
  }

  next();
};

// Middleware to validate API key for external integrations
export const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'API key required'
    });
  }

  // In production, validate against database
  const validApiKeys = process.env.VALID_API_KEYS?.split(',') || [];
  
  if (!validApiKeys.includes(apiKey)) {
    return res.status(401).json({
      success: false,
      message: 'Invalid API key'
    });
  }

  next();
};

// Middleware to check maintenance mode
export const checkMaintenanceMode = (req, res, next) => {
  if (process.env.MAINTENANCE_MODE === 'true') {
    return res.status(503).json({
      success: false,
      message: 'System is under maintenance. Please try again later.',
      maintenanceEnd: process.env.MAINTENANCE_END
    });
  }

  next();
};

// Middleware to validate request size
export const validateRequestSize = (maxSize = '10mb') => {
  return (req, res, next) => {
    const contentLength = parseInt(req.get('content-length') || '0');
    const maxSizeBytes = parseSize(maxSize);

    if (contentLength > maxSizeBytes) {
      return res.status(413).json({
        success: false,
        message: `Request too large. Maximum size: ${maxSize}`
      });
    }

    next();
  };
};

// Helper function to parse size string
function parseSize(size) {
  const units = {
    'b': 1,
    'kb': 1024,
    'mb': 1024 * 1024,
    'gb': 1024 * 1024 * 1024
  };

  const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)$/);
  if (!match) return 0;

  const value = parseFloat(match[1]);
  const unit = match[2];
  
  return value * units[unit];
}

export default {
  hashPassword,
  comparePassword,
  authenticateToken,
  requireUserType,
  requireVerified,
  requireOwnership,
  logActivity,
  userRateLimit,
  validatePermissions,
  requireBlockchainVerification,
  validateApiKey,
  checkMaintenanceMode,
  validateRequestSize
};
