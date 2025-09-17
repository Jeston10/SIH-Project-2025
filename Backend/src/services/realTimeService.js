import { v4 as uuidv4 } from 'uuid';

/**
 * Enhanced Real-Time Service for AyurChakra Backend
 * Handles real-time data streaming, live updates, and WebSocket communications
 */
class RealTimeService {
  constructor(io, redisClient) {
    this.io = io;
    this.redis = redisClient;
    this.activeConnections = new Map();
    this.subscriptions = new Map();
    this.isRunning = false;
  }

  // Initialize real-time service
  async initialize() {
    try {
      this.isRunning = true;
      console.log('✅ Real-time service initialized');
      
      // Start periodic updates
      this.startPeriodicUpdates();
      
      // Start health monitoring
      this.startHealthMonitoring();
      
    } catch (error) {
      console.error('❌ Real-time service initialization failed:', error.message);
      this.isRunning = false;
    }
  }

  // Start periodic data updates
  startPeriodicUpdates() {
    if (!this.isRunning) return;

    // Update every 30 seconds
    setInterval(async () => {
      try {
        await this.broadcastSystemHealth();
        await this.updateRealTimeData();
        await this.checkAlerts();
      } catch (error) {
        console.error('Periodic update error:', error);
      }
    }, 30000);

    // Update every 5 seconds for critical data
    setInterval(async () => {
      try {
        await this.broadcastCriticalUpdates();
      } catch (error) {
        console.error('Critical update error:', error);
      }
    }, 5000);
  }

  // Start health monitoring
  startHealthMonitoring() {
    if (!this.isRunning) return;

    setInterval(async () => {
      try {
        const healthData = await this.getSystemHealth();
        this.io.to('global').emit('system:health', healthData);
      } catch (error) {
        console.error('Health monitoring error:', error);
      }
    }, 60000); // Every minute
  }

  // Broadcast system health
  async broadcastSystemHealth() {
    const healthData = {
      timestamp: new Date(),
      activeConnections: this.io.engine.clientsCount,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      redis: {
        connected: this.redis.isReady,
        status: this.redis.isReady ? 'connected' : 'disconnected'
      },
      services: {
        blockchain: process.env.ETHEREUM_RPC_URL ? 'configured' : 'not_configured',
        email: process.env.EMAIL_HOST ? 'configured' : 'not_configured',
        cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'configured' : 'not_configured'
      }
    };

    this.io.to('global').emit('system:health', healthData);
  }

  // Update real-time data
  async updateRealTimeData() {
    try {
      // Get active supply chains
      const activeSupplyChains = await this.getActiveSupplyChains();
      
      // Broadcast supply chain updates
      for (const supplyChain of activeSupplyChains) {
        this.io.to(`supply_chain_${supplyChain._id}`).emit('supply_chain:live_update', {
          supplyChainId: supplyChain._id,
          status: supplyChain.status,
          location: supplyChain.currentLocation,
          timestamp: new Date()
        });
      }

      // Get pending quality tests
      const pendingTests = await this.getPendingQualityTests();
      
      // Notify laboratories about pending tests
      for (const test of pendingTests) {
        this.io.to(`laboratory_${test.laboratoryId}`).emit('quality_test:pending', {
          testId: test._id,
          batchId: test.batchId,
          priority: test.priority,
          timestamp: new Date()
        });
      }

    } catch (error) {
      console.error('Real-time data update error:', error);
    }
  }

  // Broadcast critical updates
  async broadcastCriticalUpdates() {
    try {
      // Check for compliance alerts
      const complianceAlerts = await this.getComplianceAlerts();
      
      if (complianceAlerts.length > 0) {
        this.io.to('type_regulatory').emit('compliance:critical_alerts', {
          alerts: complianceAlerts,
          timestamp: new Date()
        });
      }

      // Check for quality failures
      const qualityFailures = await this.getQualityFailures();
      
      if (qualityFailures.length > 0) {
        this.io.to('global').emit('quality:failures', {
          failures: qualityFailures,
          timestamp: new Date()
        });
      }

    } catch (error) {
      console.error('Critical updates error:', error);
    }
  }

  // Check for alerts
  async checkAlerts() {
    try {
      // Environmental alerts
      const environmentalAlerts = await this.getEnvironmentalAlerts();
      
      for (const alert of environmentalAlerts) {
        this.io.to(`supply_chain_${alert.supplyChainId}`).emit('environmental:alert', {
          alertId: alert._id,
          type: alert.type,
          severity: alert.severity,
          message: alert.message,
          timestamp: new Date()
        });
      }

      // Weather alerts
      const weatherAlerts = await this.getWeatherAlerts();
      
      for (const alert of weatherAlerts) {
        this.io.to(`type_farmer`).emit('weather:alert', {
          alertId: alert._id,
          location: alert.location,
          condition: alert.condition,
          severity: alert.severity,
          timestamp: new Date()
        });
      }

    } catch (error) {
      console.error('Alert checking error:', error);
    }
  }

  // Live tracking for supply chain
  async startLiveTracking(supplyChainId, userId) {
    try {
      const trackingData = {
        supplyChainId,
        userId,
        startTime: new Date(),
        isActive: true
      };

      // Store in Redis
      await this.redis.setex(
        `tracking:${supplyChainId}:${userId}`,
        3600, // 1 hour expiry
        JSON.stringify(trackingData)
      );

      // Join tracking room
      this.io.to(`user_${userId}`).socketsJoin(`tracking_${supplyChainId}`);

      // Start location updates
      this.startLocationUpdates(supplyChainId);

      return { success: true, trackingData };

    } catch (error) {
      console.error('Live tracking start error:', error);
      throw new Error('Failed to start live tracking');
    }
  }

  // Stop live tracking
  async stopLiveTracking(supplyChainId, userId) {
    try {
      // Remove from Redis
      await this.redis.del(`tracking:${supplyChainId}:${userId}`);

      // Leave tracking room
      this.io.to(`user_${userId}`).socketsLeave(`tracking_${supplyChainId}`);

      return { success: true };

    } catch (error) {
      console.error('Live tracking stop error:', error);
      throw new Error('Failed to stop live tracking');
    }
  }

  // Start location updates
  startLocationUpdates(supplyChainId) {
    // Simulate location updates (in real app, this would come from GPS/IoT devices)
    const locationInterval = setInterval(async () => {
      try {
        const location = await this.generateMockLocation();
        
        this.io.to(`tracking_${supplyChainId}`).emit('location:update', {
          supplyChainId,
          location,
          timestamp: new Date()
        });

      } catch (error) {
        console.error('Location update error:', error);
        clearInterval(locationInterval);
      }
    }, 10000); // Every 10 seconds

    // Store interval for cleanup
    this.activeConnections.set(`location_${supplyChainId}`, locationInterval);
  }

  // Generate mock location (for testing)
  async generateMockLocation() {
    return {
      latitude: 28.6139 + (Math.random() - 0.5) * 0.01,
      longitude: 77.2090 + (Math.random() - 0.5) * 0.01,
      accuracy: Math.random() * 10 + 5,
      speed: Math.random() * 50,
      heading: Math.random() * 360
    };
  }

  // Real-time notifications
  async sendRealTimeNotification(userId, notification) {
    try {
      const notificationData = {
        id: uuidv4(),
        userId,
        ...notification,
        timestamp: new Date(),
        read: false
      };

      // Store in Redis
      await this.redis.lpush(
        `notifications:${userId}`,
        JSON.stringify(notificationData)
      );

      // Send to user if online
      this.io.to(`user_${userId}`).emit('notification:new', notificationData);

      return { success: true, notification: notificationData };

    } catch (error) {
      console.error('Real-time notification error:', error);
      throw new Error('Failed to send real-time notification');
    }
  }

  // Broadcast to user type
  async broadcastToUserType(userType, event, data) {
    try {
      this.io.to(`type_${userType}`).emit(event, {
        ...data,
        timestamp: new Date()
      });

      return { success: true };

    } catch (error) {
      console.error('Broadcast to user type error:', error);
      throw new Error('Failed to broadcast to user type');
    }
  }

  // Broadcast to specific room
  async broadcastToRoom(room, event, data) {
    try {
      this.io.to(room).emit(event, {
        ...data,
        timestamp: new Date()
      });

      return { success: true };

    } catch (error) {
      console.error('Broadcast to room error:', error);
      throw new Error('Failed to broadcast to room');
    }
  }

  // Get system health
  async getSystemHealth() {
    return {
      timestamp: new Date(),
      activeConnections: this.io.engine.clientsCount,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      redis: {
        connected: this.redis.isReady,
        status: this.redis.isReady ? 'connected' : 'disconnected'
      },
      services: {
        blockchain: process.env.ETHEREUM_RPC_URL ? 'configured' : 'not_configured',
        email: process.env.EMAIL_HOST ? 'configured' : 'not_configured',
        cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'configured' : 'not_configured'
      }
    };
  }

  // Helper methods for data retrieval
  async getActiveSupplyChains() {
    // Mock data - in real app, query database
    return [
      {
        _id: 'supply_chain_1',
        status: 'in_transit',
        currentLocation: { latitude: 28.6139, longitude: 77.2090 }
      }
    ];
  }

  async getPendingQualityTests() {
    // Mock data - in real app, query database
    return [
      {
        _id: 'test_1',
        laboratoryId: 'lab_1',
        batchId: 'batch_1',
        priority: 'high'
      }
    ];
  }

  async getComplianceAlerts() {
    // Mock data - in real app, query database
    return [];
  }

  async getQualityFailures() {
    // Mock data - in real app, query database
    return [];
  }

  async getEnvironmentalAlerts() {
    // Mock data - in real app, query database
    return [];
  }

  async getWeatherAlerts() {
    // Mock data - in real app, query database
    return [];
  }

  // Cleanup
  async cleanup() {
    try {
      this.isRunning = false;
      
      // Clear all intervals
      for (const [key, interval] of this.activeConnections) {
        clearInterval(interval);
      }
      
      this.activeConnections.clear();
      this.subscriptions.clear();
      
      console.log('✅ Real-time service cleaned up');

    } catch (error) {
      console.error('❌ Real-time service cleanup failed:', error.message);
    }
  }
}

export { RealTimeService };
