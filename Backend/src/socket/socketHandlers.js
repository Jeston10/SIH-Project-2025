import { v4 as uuidv4 } from 'uuid';
import Harvest from '../models/Harvest.js';
import Processing from '../models/Processing.js';
import QualityTest from '../models/QualityTest.js';
import SupplyChain from '../models/SupplyChain.js';
import User from '../models/User.js';

// Socket.IO connection handler
export const setupSocketHandlers = (io, services) => {
  const { blockchainService, notificationService, realTimeTrackingService, redisClient } = services;

  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const jwt = await import('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.userId).select('-password');
      if (!user || !user.isActive) {
        return next(new Error('Authentication error: Invalid user'));
      }

      socket.userId = user._id.toString();
      socket.userType = user.userType;
      socket.user = user;
      
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId} (${socket.userType})`);
    
    // Join user-specific room
    socket.join(`user_${socket.userId}`);
    
    // Join user type specific room
    socket.join(`type_${socket.userType}`);
    
    // Join global room for notifications
    socket.join('global');

    // Handle harvest data updates
    socket.on('harvest:update', async (data) => {
      try {
        const { harvestId, updates } = data;
        
        // Verify ownership
        const harvest = await Harvest.findOne({ 
          _id: harvestId, 
          farmerId: socket.userId 
        });
        
        if (!harvest) {
          socket.emit('error', { message: 'Harvest not found or access denied' });
          return;
        }

        // Update harvest
        Object.assign(harvest, updates);
        await harvest.save();

        // Emit update to relevant parties
        io.to(`harvest_${harvestId}`).emit('harvest:updated', {
          harvestId,
          updates,
          timestamp: new Date()
        });

        // Notify supply chain if applicable
        const supplyChain = await SupplyChain.findOne({ harvestId });
        if (supplyChain) {
          io.to(`supply_chain_${supplyChain._id}`).emit('supply_chain:updated', {
            supplyChainId: supplyChain._id,
            harvestUpdates: updates,
            timestamp: new Date()
          });
        }

        // Log activity
        await harvest.logActivity('harvest_updated', {
          updatedBy: socket.userId,
          updates: Object.keys(updates)
        });

      } catch (error) {
        console.error('Harvest update error:', error);
        socket.emit('error', { message: 'Failed to update harvest' });
      }
    });

    // Handle processing updates
    socket.on('processing:update', async (data) => {
      try {
        const { processingId, updates } = data;
        
        const processing = await Processing.findOne({ 
          _id: processingId, 
          facilityId: socket.userId 
        });
        
        if (!processing) {
          socket.emit('error', { message: 'Processing not found or access denied' });
          return;
        }

        Object.assign(processing, updates);
        await processing.save();

        // Emit to facility and related parties
        io.to(`facility_${socket.userId}`).emit('processing:updated', {
          processingId,
          updates,
          timestamp: new Date()
        });

        // Update supply chain
        const supplyChain = await SupplyChain.findOne({ 
          'nodes.entityId': socket.userId,
          'nodes.status': 'in_progress'
        });
        
        if (supplyChain) {
          io.to(`supply_chain_${supplyChain._id}`).emit('supply_chain:updated', {
            supplyChainId: supplyChain._id,
            processingUpdates: updates,
            timestamp: new Date()
          });
        }

      } catch (error) {
        console.error('Processing update error:', error);
        socket.emit('error', { message: 'Failed to update processing' });
      }
    });

    // Handle quality test updates
    socket.on('quality_test:update', async (data) => {
      try {
        const { testId, updates } = data;
        
        const qualityTest = await QualityTest.findOne({ 
          _id: testId, 
          laboratoryId: socket.userId 
        });
        
        if (!qualityTest) {
          socket.emit('error', { message: 'Quality test not found or access denied' });
          return;
        }

        Object.assign(qualityTest, updates);
        await qualityTest.save();

        // Emit to laboratory and related parties
        io.to(`laboratory_${socket.userId}`).emit('quality_test:updated', {
          testId,
          updates,
          timestamp: new Date()
        });

        // Notify supply chain
        const supplyChain = await SupplyChain.findOne({ 
          batchId: qualityTest.batchId 
        });
        
        if (supplyChain) {
          io.to(`supply_chain_${supplyChain._id}`).emit('supply_chain:updated', {
            supplyChainId: supplyChain._id,
            qualityTestUpdates: updates,
            timestamp: new Date()
          });
        }

        // Notify regulatory if compliance issue
        if (updates.results?.overallResult === 'fail') {
          io.to('type_regulatory').emit('compliance:alert', {
            testId,
            batchId: qualityTest.batchId,
            issue: 'Quality test failed',
            severity: 'high',
            timestamp: new Date()
          });
        }

      } catch (error) {
        console.error('Quality test update error:', error);
        socket.emit('error', { message: 'Failed to update quality test' });
      }
    });

    // Handle supply chain tracking
    socket.on('supply_chain:track', async (data) => {
      try {
        const { supplyChainId, location, conditions } = data;
        
        const supplyChain = await SupplyChain.findById(supplyChainId);
        if (!supplyChain) {
          socket.emit('error', { message: 'Supply chain not found' });
          return;
        }

        // Update location
        await supplyChain.updateLocation(location);

        // Update environmental conditions
        if (conditions) {
          supplyChain.environmental = {
            ...supplyChain.environmental,
            ...conditions
          };
          await supplyChain.save();
        }

        // Emit real-time tracking update
        io.to(`supply_chain_${supplyChainId}`).emit('supply_chain:location_updated', {
          supplyChainId,
          location,
          conditions,
          timestamp: new Date()
        });

        // Check for alerts
        await checkEnvironmentalAlerts(supplyChain, conditions);

      } catch (error) {
        console.error('Supply chain tracking error:', error);
        socket.emit('error', { message: 'Failed to update tracking' });
      }
    });

    // Handle blockchain verification
    socket.on('blockchain:verify', async (data) => {
      try {
        const { type, id, transactionHash } = data;
        
        let result;
        switch (type) {
          case 'harvest':
            result = await blockchainService.verifyHarvest(id, transactionHash);
            break;
          case 'processing':
            result = await blockchainService.verifyProcessing(id, transactionHash);
            break;
          case 'quality_test':
            result = await blockchainService.verifyQualityTest(id, transactionHash);
            break;
          default:
            throw new Error('Invalid verification type');
        }

        socket.emit('blockchain:verified', {
          type,
          id,
          result,
          timestamp: new Date()
        });

        // Notify all relevant parties
        io.to(`global`).emit('blockchain:verification_complete', {
          type,
          id,
          verified: result.success,
          timestamp: new Date()
        });

      } catch (error) {
        console.error('Blockchain verification error:', error);
        socket.emit('error', { message: 'Blockchain verification failed' });
      }
    });

    // Handle real-time notifications
    socket.on('notification:subscribe', async (data) => {
      try {
        const { types = [] } = data;
        
        // Join notification-specific rooms
        types.forEach(type => {
          socket.join(`notification_${type}`);
        });

        // Send recent notifications
        const notifications = await notificationService.getRecentNotifications(
          socket.userId, 
          types
        );
        
        socket.emit('notification:recent', notifications);

      } catch (error) {
        console.error('Notification subscription error:', error);
        socket.emit('error', { message: 'Failed to subscribe to notifications' });
      }
    });

    // Handle compliance monitoring
    socket.on('compliance:monitor', async (data) => {
      try {
        if (socket.userType !== 'regulatory') {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        const { entityType, entityId } = data;
        
        // Join compliance monitoring room
        socket.join(`compliance_${entityType}_${entityId}`);

        // Get compliance status
        const complianceStatus = await getComplianceStatus(entityType, entityId);
        
        socket.emit('compliance:status', complianceStatus);

      } catch (error) {
        console.error('Compliance monitoring error:', error);
        socket.emit('error', { message: 'Failed to monitor compliance' });
      }
    });

    // Handle dashboard data requests
    socket.on('dashboard:data', async (data) => {
      try {
        const { type } = data;
        let dashboardData;

        switch (socket.userType) {
          case 'farmer':
            dashboardData = await getFarmerDashboardData(socket.userId);
            break;
          case 'facility':
            dashboardData = await getFacilityDashboardData(socket.userId);
            break;
          case 'laboratory':
            dashboardData = await getLaboratoryDashboardData(socket.userId);
            break;
          case 'regulatory':
            dashboardData = await getRegulatoryDashboardData();
            break;
          case 'user':
            dashboardData = await getUserDashboardData(socket.userId);
            break;
          default:
            throw new Error('Invalid user type');
        }

        socket.emit('dashboard:data', dashboardData);

      } catch (error) {
        console.error('Dashboard data error:', error);
        socket.emit('error', { message: 'Failed to fetch dashboard data' });
      }
    });

    // Handle file upload progress
    socket.on('upload:progress', (data) => {
      const { uploadId, progress, status } = data;
      
      // Broadcast progress to user
      socket.emit('upload:progress', {
        uploadId,
        progress,
        status,
        timestamp: new Date()
      });
    });

    // Handle chat/messaging
    socket.on('message:send', async (data) => {
      try {
        const { recipientId, message, type = 'text' } = data;
        
        const messageData = {
          id: uuidv4(),
          senderId: socket.userId,
          recipientId,
          message,
          type,
          timestamp: new Date()
        };

        // Store message in Redis for persistence
        await redisClient.lPush(
          `messages:${recipientId}`, 
          JSON.stringify(messageData)
        );

        // Send to recipient if online
        io.to(`user_${recipientId}`).emit('message:received', messageData);
        
        // Send confirmation to sender
        socket.emit('message:sent', messageData);

      } catch (error) {
        console.error('Message send error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`❌ User disconnected: ${socket.userId} (${reason})`);
      
      // Clean up user-specific data
      socket.leave(`user_${socket.userId}`);
      socket.leave(`type_${socket.userType}`);
      socket.leave('global');
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  // Periodic data updates
  setInterval(async () => {
    try {
      // Broadcast system health
      const healthData = {
        timestamp: new Date(),
        activeConnections: io.engine.clientsCount,
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime()
      };

      io.to('global').emit('system:health', healthData);

      // Update real-time tracking data
      await realTimeTrackingService.updateTrackingData();

    } catch (error) {
      console.error('Periodic update error:', error);
    }
  }, 30000); // Every 30 seconds
};

// Helper functions
async function checkEnvironmentalAlerts(supplyChain, conditions) {
  const alerts = [];

  // Temperature alerts
  if (conditions.temperature) {
    if (conditions.temperature > 30 || conditions.temperature < 5) {
      alerts.push({
        type: 'temperature_breach',
        severity: 'high',
        message: `Temperature breach: ${conditions.temperature}°C`,
        value: conditions.temperature,
        threshold: { min: 5, max: 30 }
      });
    }
  }

  // Humidity alerts
  if (conditions.humidity) {
    if (conditions.humidity > 80 || conditions.humidity < 20) {
      alerts.push({
        type: 'humidity_breach',
        severity: 'medium',
        message: `Humidity breach: ${conditions.humidity}%`,
        value: conditions.humidity,
        threshold: { min: 20, max: 80 }
      });
    }
  }

  // Add alerts to supply chain
  for (const alert of alerts) {
    await supplyChain.addAlert(alert);
  }

  // Emit alerts if any
  if (alerts.length > 0) {
    io.to(`supply_chain_${supplyChain._id}`).emit('supply_chain:alerts', {
      supplyChainId: supplyChain._id,
      alerts,
      timestamp: new Date()
    });
  }
}

async function getComplianceStatus(entityType, entityId) {
  // Implementation for compliance status
  return {
    entityType,
    entityId,
    status: 'compliant',
    score: 95,
    lastCheck: new Date(),
    violations: [],
    recommendations: []
  };
}

async function getFarmerDashboardData(userId) {
  const harvests = await Harvest.find({ farmerId: userId }).limit(10);
  const stats = await Harvest.getHarvestStats(userId);
  
  return {
    harvests,
    stats: stats[0] || {},
    timestamp: new Date()
  };
}

async function getFacilityDashboardData(userId) {
  const processings = await Processing.findByFacility(userId, 10);
  const stats = await Processing.getProcessingStats(userId);
  
  return {
    processings,
    stats: stats[0] || {},
    timestamp: new Date()
  };
}

async function getLaboratoryDashboardData(userId) {
  const tests = await QualityTest.findByLaboratory(userId, 10);
  const stats = await QualityTest.getTestStats(userId);
  
  return {
    tests,
    stats: stats[0] || {},
    timestamp: new Date()
  };
}

async function getRegulatoryDashboardData() {
  // Implementation for regulatory dashboard
  return {
    compliance: {
      overall: 94,
      farmers: 93,
      facilities: 92,
      laboratories: 100
    },
    violations: [],
    inspections: [],
    timestamp: new Date()
  };
}

async function getUserDashboardData(userId) {
  // Implementation for user dashboard
  return {
    orders: [],
    trackedProducts: [],
    qualityReports: [],
    timestamp: new Date()
  };
}

export default setupSocketHandlers;
