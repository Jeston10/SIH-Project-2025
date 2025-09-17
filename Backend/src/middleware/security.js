import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';

/**
 * Enhanced Security Middleware for AyurChakra Backend
 * Provides comprehensive security features including rate limiting, CORS, and security headers
 */

// Rate limiting configurations
export const createRateLimit = (options = {}) => {
  const defaultOptions = {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
      });
    }
  };

  return rateLimit({ ...defaultOptions, ...options });
};

// Authentication rate limiting (stricter)
export const authRateLimit = createRateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_AUTH_MAX_REQUESTS) || 5, // limit each IP to 5 auth requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS) || 15 * 60 * 1000) / 1000)
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  skipFailedRequests: false // Count failed requests
});

// API rate limiting (more lenient)
export const apiRateLimit = createRateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_API_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_API_MAX_REQUESTS) || 1000, // limit each IP to 1000 API requests per windowMs
  message: {
    success: false,
    message: 'API rate limit exceeded, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_API_WINDOW_MS) || 15 * 60 * 1000) / 1000)
  }
});

// Slow down middleware (gradual slowdown)
export const createSlowDown = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 50, // allow 50 requests per 15 minutes, then...
    delayMs: () => 500, // begin adding 500ms of delay per request above 50
    maxDelayMs: 20000, // max delay of 20 seconds
    skipSuccessfulRequests: true,
    skipFailedRequests: false
  };

  return slowDown({ ...defaultOptions, ...options });
};

// CORS configuration
export const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CORS_ORIGIN || 'http://localhost:3000',
      'http://localhost:3000',
      'http://localhost:3001',
      'https://ayurchakra.vercel.app', // Production frontend
      'https://ayurchakra.netlify.app' // Alternative production frontend
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400 // 24 hours
};

// Helmet security headers configuration
export const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.openweathermap.org", "https://nominatim.openstreetmap.org"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
};

// Morgan logging configuration
export const morganOptions = {
  format: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  options: {
    skip: function (req, res) {
      // Skip logging for health checks and static files
      return req.url === '/health' || req.url.startsWith('/static/');
    }
  }
};

// Security middleware setup
export const setupSecurityMiddleware = (app) => {
  // Trust proxy (for rate limiting behind reverse proxy)
  if (process.env.TRUST_PROXY === '1') {
    app.set('trust proxy', 1);
  }

  // Enable security features based on environment variables
  if (process.env.ENABLE_HELMET !== 'false') {
    app.use(helmet(helmetOptions));
    console.log('✅ Helmet security headers enabled');
  }

  if (process.env.ENABLE_CORS !== 'false') {
    app.use(cors(corsOptions));
    console.log('✅ CORS enabled');
  }

  if (process.env.ENABLE_COMPRESSION !== 'false') {
    app.use(compression());
    console.log('✅ Compression enabled');
  }

  if (process.env.ENABLE_MORGAN !== 'false') {
    app.use(morgan(morganOptions.format, morganOptions.options));
    console.log('✅ Morgan logging enabled');
  }

  if (process.env.ENABLE_RATE_LIMITING !== 'false') {
    // Apply general rate limiting - DISABLED FOR DEVELOPMENT
    // app.use(createRateLimit());
    console.log('⚠️  Rate limiting disabled');
  }

  // Apply slow down middleware - DISABLED FOR DEVELOPMENT
  // app.use(createSlowDown());
  console.log('⚠️  Slow down middleware disabled');

  console.log('🔒 Security middleware setup complete');
};

// Input validation middleware
export const validateInput = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

// File upload security middleware
export const fileUploadSecurity = (req, res, next) => {
  const maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp,application/pdf').split(',');

  if (req.file) {
    // Check file size
    if (req.file.size > maxFileSize) {
      return res.status(400).json({
        success: false,
        message: `File size exceeds maximum allowed size of ${maxFileSize / (1024 * 1024)}MB`
      });
    }

    // Check file type
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `File type ${req.file.mimetype} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
      });
    }
  }

  next();
};

// IP whitelist middleware (for admin routes)
export const ipWhitelist = (allowedIPs = []) => {
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (allowedIPs.length === 0 || allowedIPs.includes(clientIP)) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: 'Access denied from this IP address'
      });
    }
  };
};

// Request sanitization middleware
export const sanitizeInput = (req, res, next) => {
  // Remove potentially dangerous characters from string inputs
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  };

  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    const sanitizeObject = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = sanitizeString(obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        }
      }
    };
    sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeString(req.query[key]);
      }
    }
  }

  next();
};

export default {
  createRateLimit,
  authRateLimit,
  apiRateLimit,
  createSlowDown,
  corsOptions,
  helmetOptions,
  morganOptions,
  setupSecurityMiddleware,
  validateInput,
  fileUploadSecurity,
  ipWhitelist,
  sanitizeInput
};
