import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import mongoose from 'mongoose';
import { createClient } from 'redis';

// Import routes
import authRoutes from './routes/auth.js';
import farmerRoutes from './routes/farmer.js';
import facilityRoutes from './routes/facility.js';
import laboratoryRoutes from './routes/laboratory.js';
import regulatoryRoutes from './routes/regulatory.js';
import userRoutes from './routes/user.js';
import blockchainRoutes from './routes/blockchain.js';
import gpsRoutes from './routes/gps.js';
import weatherRoutes from './routes/weather.js';
import emailRoutes from './routes/email.js';
import uploadRoutes from './routes/upload.js';
import realtimeRoutes from './routes/realtime.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { authenticateToken, hashPassword, comparePassword } from './middleware/auth.js';
import { 
  setupSecurityMiddleware, 
  authRateLimit, 
  apiRateLimit, 
  createSlowDown,
  sanitizeInput 
} from './middleware/security.js';

// Import socket handlers
import { setupSocketHandlers } from './socket/socketHandlers.js';

// Import services
import { BlockchainService } from './services/blockchainService.js';
import { NotificationService } from './services/notificationService.js';
import { RealTimeTrackingService } from './services/realTimeTrackingService.js';
import { GeocodingService } from './services/geocodingService.js';
import { WeatherService } from './services/weatherService.js';
import { EmailService } from './services/emailService.js';
import { UploadService } from './services/uploadService.js';
import { RealTimeService } from './services/realTimeService.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Connect to Redis
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('✅ Connected to Redis'));
await redisClient.connect();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ayurchakra')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Setup comprehensive security middleware
setupSecurityMiddleware(app);

// Input sanitization middleware
app.use(sanitizeInput);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    services: {
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      redis: redisClient.isReady ? 'connected' : 'disconnected'
    }
  });
});

// API Routes with enhanced security
app.use('/api/auth', authRateLimit, authRoutes); // Stricter rate limiting for auth
app.use('/api/farmer', authenticateToken, apiRateLimit, farmerRoutes);
app.use('/api/facility', authenticateToken, apiRateLimit, facilityRoutes);
app.use('/api/laboratory', authenticateToken, apiRateLimit, laboratoryRoutes);
app.use('/api/regulatory', authenticateToken, apiRateLimit, regulatoryRoutes);
app.use('/api/user', authenticateToken, apiRateLimit, userRoutes);
app.use('/api/blockchain', authenticateToken, apiRateLimit, blockchainRoutes);
app.use('/api/gps', authenticateToken, apiRateLimit, gpsRoutes);
app.use('/api/weather', authenticateToken, apiRateLimit, weatherRoutes);
app.use('/api/email', authenticateToken, apiRateLimit, emailRoutes);
app.use('/api/upload', authenticateToken, apiRateLimit, uploadRoutes);
app.use('/api/realtime', authenticateToken, apiRateLimit, realtimeRoutes);

// Initialize services
const blockchainService = new BlockchainService();
// Manually initialize blockchain service after environment variables are loaded
await blockchainService.initialize();

const geocodingService = new GeocodingService();
const weatherService = new WeatherService();
const emailService = new EmailService();
const uploadService = new UploadService();
const realTimeService = new RealTimeService(io, redisClient);
const notificationService = new NotificationService(io, redisClient);
const realTimeTrackingService = new RealTimeTrackingService(io, redisClient);

// Initialize real-time service
await realTimeService.initialize();

// Make services available to routes
app.locals.services = {
  blockchainService,
  geocodingService,
  weatherService,
  emailService,
  uploadService,
  realTimeService,
  notificationService,
  realTimeTrackingService
};

// Setup Socket.IO handlers
setupSocketHandlers(io, {
  blockchainService,
  geocodingService,
  weatherService,
  emailService,
  uploadService,
  realTimeService,
  notificationService,
  realTimeTrackingService,
  redisClient
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await redisClient.quit();
  mongoose.connection.close();
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await redisClient.quit();
  mongoose.connection.close();
  server.close(() => {
    console.log('Process terminated');
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
🚀 AyurChakra Backend Server Running!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🔗 API Base URL: http://localhost:${PORT}/api
📡 Socket.IO: http://localhost:${PORT}
🔒 Blockchain Integration: ${process.env.ENABLE_BLOCKCHAIN_SYNC === 'true' ? 'Enabled' : 'Disabled'}
📊 Real-time Tracking: ${process.env.ENABLE_REAL_TIME_TRACKING === 'true' ? 'Enabled' : 'Disabled'}
  `);
});

export { io, redisClient };
