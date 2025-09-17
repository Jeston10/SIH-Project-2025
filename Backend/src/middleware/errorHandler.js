import mongoose from 'mongoose';

// Custom error class
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Handle different types of errors
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

// Send error response in development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

// Send error response in production
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong!'
    });
  }
};

// Main error handling middleware
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

// Handle unhandled promise rejections
export const handleUnhandledRejection = () => {
  process.on('unhandledRejection', (err, promise) => {
    console.log('Unhandled Promise Rejection:', err.message);
    console.log('Promise:', promise);
    
    // Close server & exit process
    process.exit(1);
  });
};

// Handle uncaught exceptions
export const handleUncaughtException = () => {
  process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception:', err.message);
    console.log('Stack:', err.stack);
    
    // Close server & exit process
    process.exit(1);
  });
};

// Async error wrapper
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// 404 handler
export const notFound = (req, res, next) => {
  const error = new AppError(`Not found - ${req.originalUrl}`, 404);
  next(error);
};

// Validation error handler
export const handleValidationError = (errors) => {
  const formattedErrors = errors.array().map(error => ({
    field: error.param,
    message: error.msg,
    value: error.value
  }));

  return new AppError('Validation failed', 400, formattedErrors);
};

// Database connection error handler
export const handleDatabaseError = (err) => {
  if (err.name === 'MongoNetworkError') {
    return new AppError('Database connection failed. Please try again later.', 503);
  }
  
  if (err.name === 'MongoTimeoutError') {
    return new AppError('Database operation timed out. Please try again.', 504);
  }
  
  return new AppError('Database error occurred.', 500);
};

// File upload error handler
export const handleFileUploadError = (err) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return new AppError('File too large. Maximum size allowed is 10MB.', 400);
  }
  
  if (err.code === 'LIMIT_FILE_COUNT') {
    return new AppError('Too many files. Maximum 5 files allowed.', 400);
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return new AppError('Unexpected file field.', 400);
  }
  
  return new AppError('File upload error.', 500);
};

// Rate limit error handler
export const handleRateLimitError = (req, res) => {
  res.status(429).json({
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: req.rateLimit?.resetTime
  });
};

// CORS error handler
export const handleCorsError = (err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation. Origin not allowed.'
    });
  }
  next(err);
};

// Socket.IO error handler
export const handleSocketError = (socket, error) => {
  console.error('Socket error:', error);
  
  socket.emit('error', {
    success: false,
    message: 'An error occurred',
    code: error.code || 'UNKNOWN_ERROR'
  });
};

// Blockchain error handler
export const handleBlockchainError = (err) => {
  if (err.message.includes('insufficient funds')) {
    return new AppError('Insufficient funds for blockchain transaction.', 400);
  }
  
  if (err.message.includes('gas limit')) {
    return new AppError('Transaction gas limit exceeded.', 400);
  }
  
  if (err.message.includes('network')) {
    return new AppError('Blockchain network error. Please try again later.', 503);
  }
  
  return new AppError('Blockchain transaction failed.', 500);
};

// External API error handler
export const handleExternalApiError = (err) => {
  if (err.response) {
    // API responded with error status
    const status = err.response.status;
    const message = err.response.data?.message || 'External API error';
    
    if (status >= 500) {
      return new AppError('External service temporarily unavailable.', 503);
    }
    
    return new AppError(message, status);
  }
  
  if (err.request) {
    // Request was made but no response received
    return new AppError('External service timeout.', 504);
  }
  
  return new AppError('External service error.', 500);
};

// Log error to external service (e.g., Sentry, LogRocket)
export const logError = (err, req = null) => {
  const errorInfo = {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    timestamp: new Date().toISOString(),
    url: req?.originalUrl,
    method: req?.method,
    ip: req?.ip,
    userAgent: req?.get('User-Agent'),
    userId: req?.user?._id
  };
  
  // In production, send to external logging service
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(err, { extra: errorInfo });
    console.error('Error logged:', errorInfo);
  } else {
    console.error('Development error:', errorInfo);
  }
};

export default {
  AppError,
  errorHandler,
  handleUnhandledRejection,
  handleUncaughtException,
  catchAsync,
  notFound,
  handleValidationError,
  handleDatabaseError,
  handleFileUploadError,
  handleRateLimitError,
  handleCorsError,
  handleSocketError,
  handleBlockchainError,
  handleExternalApiError,
  logError
};
