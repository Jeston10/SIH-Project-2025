import express from 'express';
import { authenticateToken, requireUserType } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/realtime/status
// @desc    Get real-time service status
// @access  Private
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const realTimeService = req.app.locals.services?.realTimeService;
    
    if (!realTimeService) {
      return res.status(503).json({
        success: false,
        message: 'Real-time service not available'
      });
    }

    const status = await realTimeService.getSystemHealth();
    
    res.json({
      success: true,
      data: {
        ...status,
        message: 'Real-time service is running'
      }
    });
  } catch (error) {
    console.error('Real-time status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get real-time service status'
    });
  }
});

// @route   POST /api/realtime/tracking/start
// @desc    Start live tracking for supply chain
// @access  Private
router.post('/tracking/start', authenticateToken, async (req, res) => {
  try {
    const { supplyChainId } = req.body;
    const userId = req.user._id.toString();
    
    if (!supplyChainId) {
      return res.status(400).json({
        success: false,
        message: 'Supply chain ID is required'
      });
    }

    const realTimeService = req.app.locals.services?.realTimeService;
    
    if (!realTimeService) {
      return res.status(503).json({
        success: false,
        message: 'Real-time service not available'
      });
    }

    const result = await realTimeService.startLiveTracking(supplyChainId, userId);

    res.json({
      success: true,
      message: 'Live tracking started successfully',
      data: result
    });
  } catch (error) {
    console.error('Start tracking error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/realtime/tracking/stop
// @desc    Stop live tracking for supply chain
// @access  Private
router.post('/tracking/stop', authenticateToken, async (req, res) => {
  try {
    const { supplyChainId } = req.body;
    const userId = req.user._id.toString();
    
    if (!supplyChainId) {
      return res.status(400).json({
        success: false,
        message: 'Supply chain ID is required'
      });
    }

    const realTimeService = req.app.locals.services?.realTimeService;
    
    if (!realTimeService) {
      return res.status(503).json({
        success: false,
        message: 'Real-time service not available'
      });
    }

    const result = await realTimeService.stopLiveTracking(supplyChainId, userId);

    res.json({
      success: true,
      message: 'Live tracking stopped successfully',
      data: result
    });
  } catch (error) {
    console.error('Stop tracking error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/realtime/notification/send
// @desc    Send real-time notification
// @access  Private
router.post('/notification/send', authenticateToken, async (req, res) => {
  try {
    const { userId, type, title, message, data } = req.body;
    
    if (!userId || !type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'User ID, type, title, and message are required'
      });
    }

    const realTimeService = req.app.locals.services?.realTimeService;
    
    if (!realTimeService) {
      return res.status(503).json({
        success: false,
        message: 'Real-time service not available'
      });
    }

    const result = await realTimeService.sendRealTimeNotification(userId, {
      type,
      title,
      message,
      data
    });

    res.json({
      success: true,
      message: 'Real-time notification sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/realtime/broadcast/user-type
// @desc    Broadcast message to user type
// @access  Private (Admin only)
router.post('/broadcast/user-type', authenticateToken, requireUserType('regulatory'), async (req, res) => {
  try {
    const { userType, event, data } = req.body;
    
    if (!userType || !event || !data) {
      return res.status(400).json({
        success: false,
        message: 'User type, event, and data are required'
      });
    }

    const realTimeService = req.app.locals.services?.realTimeService;
    
    if (!realTimeService) {
      return res.status(503).json({
        success: false,
        message: 'Real-time service not available'
      });
    }

    const result = await realTimeService.broadcastToUserType(userType, event, data);

    res.json({
      success: true,
      message: `Message broadcasted to ${userType} users successfully`,
      data: result
    });
  } catch (error) {
    console.error('Broadcast to user type error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/realtime/broadcast/room
// @desc    Broadcast message to specific room
// @access  Private
router.post('/broadcast/room', authenticateToken, async (req, res) => {
  try {
    const { room, event, data } = req.body;
    
    if (!room || !event || !data) {
      return res.status(400).json({
        success: false,
        message: 'Room, event, and data are required'
      });
    }

    const realTimeService = req.app.locals.services?.realTimeService;
    
    if (!realTimeService) {
      return res.status(503).json({
        success: false,
        message: 'Real-time service not available'
      });
    }

    const result = await realTimeService.broadcastToRoom(room, event, data);

    res.json({
      success: true,
      message: `Message broadcasted to room ${room} successfully`,
      data: result
    });
  } catch (error) {
    console.error('Broadcast to room error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/realtime/connections
// @desc    Get active WebSocket connections
// @access  Private (Admin only)
router.get('/connections', authenticateToken, requireUserType('regulatory'), async (req, res) => {
  try {
    const realTimeService = req.app.locals.services?.realTimeService;
    
    if (!realTimeService) {
      return res.status(503).json({
        success: false,
        message: 'Real-time service not available'
      });
    }

    const healthData = await realTimeService.getSystemHealth();
    
    res.json({
      success: true,
      data: {
        activeConnections: healthData.activeConnections,
        memoryUsage: healthData.memoryUsage,
        uptime: healthData.uptime,
        timestamp: healthData.timestamp
      }
    });
  } catch (error) {
    console.error('Get connections error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get connection information'
    });
  }
});

// @route   GET /api/realtime/events
// @desc    Get available real-time events
// @access  Private
router.get('/events', authenticateToken, async (req, res) => {
  try {
    const events = {
      harvest: [
        'harvest:update',
        'harvest:created',
        'harvest:updated',
        'harvest:deleted'
      ],
      processing: [
        'processing:update',
        'processing:created',
        'processing:updated',
        'processing:completed'
      ],
      quality: [
        'quality_test:update',
        'quality_test:created',
        'quality_test:completed',
        'quality_test:failed'
      ],
      supplyChain: [
        'supply_chain:track',
        'supply_chain:updated',
        'supply_chain:location_updated',
        'supply_chain:alerts'
      ],
      blockchain: [
        'blockchain:verify',
        'blockchain:verified',
        'blockchain:verification_complete'
      ],
      notifications: [
        'notification:subscribe',
        'notification:new',
        'notification:recent'
      ],
      compliance: [
        'compliance:monitor',
        'compliance:status',
        'compliance:alert',
        'compliance:critical_alerts'
      ],
      dashboard: [
        'dashboard:data',
        'dashboard:update'
      ],
      system: [
        'system:health',
        'system:status'
      ],
      messaging: [
        'message:send',
        'message:received',
        'message:sent'
      ],
      tracking: [
        'location:update',
        'tracking:start',
        'tracking:stop'
      ]
    };

    res.json({
      success: true,
      data: {
        events,
        usage: {
          harvest: 'Real-time harvest data updates',
          processing: 'Processing facility updates',
          quality: 'Quality test results and alerts',
          supplyChain: 'Supply chain tracking and monitoring',
          blockchain: 'Blockchain verification events',
          notifications: 'Real-time notifications',
          compliance: 'Compliance monitoring and alerts',
          dashboard: 'Dashboard data updates',
          system: 'System health and status',
          messaging: 'Real-time messaging between users',
          tracking: 'Live location tracking'
        }
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get available events'
    });
  }
});

// @route   POST /api/realtime/subscribe
// @desc    Subscribe to real-time events
// @access  Private
router.post('/subscribe', authenticateToken, async (req, res) => {
  try {
    const { events, rooms } = req.body;
    
    if (!events || !Array.isArray(events)) {
      return res.status(400).json({
        success: false,
        message: 'Events array is required'
      });
    }

    // In a real implementation, you would store subscriptions in Redis
    // and handle them in the Socket.IO connection handler
    
    res.json({
      success: true,
      message: 'Successfully subscribed to real-time events',
      data: {
        events,
        rooms: rooms || [],
        userId: req.user._id.toString(),
        userType: req.user.userType
      }
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to events'
    });
  }
});

// @route   POST /api/realtime/unsubscribe
// @desc    Unsubscribe from real-time events
// @access  Private
router.post('/unsubscribe', authenticateToken, async (req, res) => {
  try {
    const { events, rooms } = req.body;
    
    // In a real implementation, you would remove subscriptions from Redis
    
    res.json({
      success: true,
      message: 'Successfully unsubscribed from real-time events',
      data: {
        events: events || [],
        rooms: rooms || [],
        userId: req.user._id.toString()
      }
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe from events'
    });
  }
});

export default router;
