import { v4 as uuidv4 } from 'uuid';

class NotificationService {
  constructor(io, redisClient) {
    this.io = io;
    this.redisClient = redisClient;
    this.notificationTypes = {
      HARVEST_UPDATE: 'harvest_update',
      PROCESSING_UPDATE: 'processing_update',
      QUALITY_TEST_RESULT: 'quality_test_result',
      SUPPLY_CHAIN_UPDATE: 'supply_chain_update',
      COMPLIANCE_ALERT: 'compliance_alert',
      SYSTEM_ALERT: 'system_alert',
      MESSAGE: 'message',
      REMINDER: 'reminder'
    };
  }

  async sendNotification(notification) {
    try {
      const notificationData = {
        id: uuidv4(),
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data || {},
        recipients: notification.recipients || [],
        priority: notification.priority || 'medium',
        timestamp: new Date(),
        read: false
      };

      // Store notification in Redis
      await this.storeNotification(notificationData);

      // Send real-time notification
      await this.sendRealTimeNotification(notificationData);

      // Send email notification if required
      if (notification.sendEmail) {
        await this.sendEmailNotification(notificationData);
      }

      // Send SMS notification if required
      if (notification.sendSMS) {
        await this.sendSMSNotification(notificationData);
      }

      return { success: true, notificationId: notificationData.id };

    } catch (error) {
      console.error('Notification sending error:', error);
      return { success: false, error: error.message };
    }
  }

  async storeNotification(notification) {
    try {
      // Store in Redis with TTL of 30 days
      const key = `notification:${notification.id}`;
      await this.redisClient.setEx(key, 30 * 24 * 60 * 60, JSON.stringify(notification));

      // Add to user notification lists
      for (const recipientId of notification.recipients) {
        await this.redisClient.lPush(`user_notifications:${recipientId}`, notification.id);
        await this.redisClient.lTrim(`user_notifications:${recipientId}`, 0, 99); // Keep last 100
      }

      // Add to global notification list
      await this.redisClient.lPush('global_notifications', notification.id);
      await this.redisClient.lTrim('global_notifications', 0, 999); // Keep last 1000

    } catch (error) {
      console.error('Notification storage error:', error);
      throw error;
    }
  }

  async sendRealTimeNotification(notification) {
    try {
      // Send to specific users
      for (const recipientId of notification.recipients) {
        this.io.to(`user_${recipientId}`).emit('notification:new', notification);
      }

      // Send to user type specific rooms
      if (notification.data.userTypes) {
        for (const userType of notification.data.userTypes) {
          this.io.to(`type_${userType}`).emit('notification:new', notification);
        }
      }

      // Send to global room for system-wide notifications
      if (notification.priority === 'high' || notification.type === this.notificationTypes.SYSTEM_ALERT) {
        this.io.to('global').emit('notification:new', notification);
      }

    } catch (error) {
      console.error('Real-time notification error:', error);
      throw error;
    }
  }

  async sendEmailNotification(notification) {
    try {
      // Implementation for email sending
      // This would integrate with your email service (SendGrid, AWS SES, etc.)
      console.log('Email notification sent:', notification.title);
      
    } catch (error) {
      console.error('Email notification error:', error);
      throw error;
    }
  }

  async sendSMSNotification(notification) {
    try {
      // Implementation for SMS sending
      // This would integrate with your SMS service (Twilio, AWS SNS, etc.)
      console.log('SMS notification sent:', notification.title);
      
    } catch (error) {
      console.error('SMS notification error:', error);
      throw error;
    }
  }

  async getNotifications(userId, options = {}) {
    try {
      const { limit = 20, offset = 0, type = null, unreadOnly = false } = options;
      
      // Get user notification IDs
      const notificationIds = await this.redisClient.lRange(
        `user_notifications:${userId}`, 
        offset, 
        offset + limit - 1
      );

      const notifications = [];
      
      for (const notificationId of notificationIds) {
        const notificationData = await this.redisClient.get(`notification:${notificationId}`);
        if (notificationData) {
          const notification = JSON.parse(notificationData);
          
          // Apply filters
          if (type && notification.type !== type) continue;
          if (unreadOnly && notification.read) continue;
          
          notifications.push(notification);
        }
      }

      return { success: true, notifications };

    } catch (error) {
      console.error('Get notifications error:', error);
      return { success: false, error: error.message };
    }
  }

  async getRecentNotifications(userId, types = []) {
    try {
      const notificationIds = await this.redisClient.lRange(
        `user_notifications:${userId}`, 
        0, 
        9 // Last 10 notifications
      );

      const notifications = [];
      
      for (const notificationId of notificationIds) {
        const notificationData = await this.redisClient.get(`notification:${notificationId}`);
        if (notificationData) {
          const notification = JSON.parse(notificationData);
          
          if (types.length === 0 || types.includes(notification.type)) {
            notifications.push(notification);
          }
        }
      }

      return notifications;

    } catch (error) {
      console.error('Get recent notifications error:', error);
      return [];
    }
  }

  async markAsRead(notificationId, userId) {
    try {
      const notificationData = await this.redisClient.get(`notification:${notificationId}`);
      if (!notificationData) {
        return { success: false, message: 'Notification not found' };
      }

      const notification = JSON.parse(notificationData);
      notification.read = true;
      notification.readAt = new Date();

      await this.redisClient.setEx(
        `notification:${notificationId}`, 
        30 * 24 * 60 * 60, 
        JSON.stringify(notification)
      );

      return { success: true };

    } catch (error) {
      console.error('Mark as read error:', error);
      return { success: false, error: error.message };
    }
  }

  async markAllAsRead(userId) {
    try {
      const notificationIds = await this.redisClient.lRange(
        `user_notifications:${userId}`, 
        0, 
        -1
      );

      for (const notificationId of notificationIds) {
        await this.markAsRead(notificationId, userId);
      }

      return { success: true };

    } catch (error) {
      console.error('Mark all as read error:', error);
      return { success: false, error: error.message };
    }
  }

  async getUnreadCount(userId) {
    try {
      const notificationIds = await this.redisClient.lRange(
        `user_notifications:${userId}`, 
        0, 
        -1
      );

      let unreadCount = 0;
      
      for (const notificationId of notificationIds) {
        const notificationData = await this.redisClient.get(`notification:${notificationId}`);
        if (notificationData) {
          const notification = JSON.parse(notificationData);
          if (!notification.read) {
            unreadCount++;
          }
        }
      }

      return { success: true, count: unreadCount };

    } catch (error) {
      console.error('Get unread count error:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteNotification(notificationId, userId) {
    try {
      // Remove from user's notification list
      await this.redisClient.lRem(`user_notifications:${userId}`, 1, notificationId);
      
      // Remove from Redis
      await this.redisClient.del(`notification:${notificationId}`);

      return { success: true };

    } catch (error) {
      console.error('Delete notification error:', error);
      return { success: false, error: error.message };
    }
  }

  // Specific notification methods
  async notifyHarvestUpdate(harvestId, farmerId, updates) {
    const notification = {
      type: this.notificationTypes.HARVEST_UPDATE,
      title: 'Harvest Updated',
      message: `Your harvest ${harvestId} has been updated with new information.`,
      data: {
        harvestId,
        updates,
        userTypes: ['facility', 'laboratory', 'regulatory']
      },
      recipients: [farmerId],
      priority: 'medium'
    };

    return await this.sendNotification(notification);
  }

  async notifyProcessingUpdate(processingId, facilityId, updates) {
    const notification = {
      type: this.notificationTypes.PROCESSING_UPDATE,
      title: 'Processing Update',
      message: `Processing batch ${processingId} has been updated.`,
      data: {
        processingId,
        updates,
        userTypes: ['farmer', 'laboratory', 'regulatory']
      },
      recipients: [facilityId],
      priority: 'medium'
    };

    return await this.sendNotification(notification);
  }

  async notifyQualityTestResult(testId, laboratoryId, result) {
    const notification = {
      type: this.notificationTypes.QUALITY_TEST_RESULT,
      title: 'Quality Test Result',
      message: `Quality test ${testId} has been completed with result: ${result.overallResult}`,
      data: {
        testId,
        result,
        userTypes: ['farmer', 'facility', 'regulatory']
      },
      recipients: [laboratoryId],
      priority: result.overallResult === 'fail' ? 'high' : 'medium'
    };

    return await this.sendNotification(notification);
  }

  async notifySupplyChainUpdate(supplyChainId, updates) {
    const notification = {
      type: this.notificationTypes.SUPPLY_CHAIN_UPDATE,
      title: 'Supply Chain Update',
      message: `Supply chain ${supplyChainId} has been updated.`,
      data: {
        supplyChainId,
        updates,
        userTypes: ['farmer', 'facility', 'laboratory', 'regulatory', 'user']
      },
      recipients: [],
      priority: 'low'
    };

    return await this.sendNotification(notification);
  }

  async notifyComplianceAlert(alertData) {
    const notification = {
      type: this.notificationTypes.COMPLIANCE_ALERT,
      title: 'Compliance Alert',
      message: alertData.message,
      data: {
        alert: alertData,
        userTypes: ['regulatory']
      },
      recipients: [],
      priority: alertData.severity === 'critical' ? 'high' : 'medium'
    };

    return await this.sendNotification(notification);
  }

  async notifySystemAlert(message, priority = 'medium') {
    const notification = {
      type: this.notificationTypes.SYSTEM_ALERT,
      title: 'System Alert',
      message: message,
      data: {
        userTypes: ['farmer', 'facility', 'laboratory', 'regulatory', 'user']
      },
      recipients: [],
      priority: priority
    };

    return await this.sendNotification(notification);
  }

  async notifyMessage(senderId, recipientId, message) {
    const notification = {
      type: this.notificationTypes.MESSAGE,
      title: 'New Message',
      message: `You have received a new message: ${message.substring(0, 50)}...`,
      data: {
        senderId,
        message
      },
      recipients: [recipientId],
      priority: 'low'
    };

    return await this.sendNotification(notification);
  }

  async notifyReminder(userId, title, message, reminderData) {
    const notification = {
      type: this.notificationTypes.REMINDER,
      title: title,
      message: message,
      data: reminderData,
      recipients: [userId],
      priority: 'low'
    };

    return await this.sendNotification(notification);
  }

  // Bulk notification methods
  async notifyUserType(userType, notification) {
    try {
      // Get all users of specific type
      const userIds = await this.redisClient.sMembers(`users:type:${userType}`);
      
      notification.recipients = userIds;
      notification.data = { ...notification.data, userTypes: [userType] };

      return await this.sendNotification(notification);

    } catch (error) {
      console.error('User type notification error:', error);
      return { success: false, error: error.message };
    }
  }

  async notifyAllUsers(notification) {
    try {
      // Get all active users
      const userIds = await this.redisClient.sMembers('users:active');
      
      notification.recipients = userIds;
      notification.data = { 
        ...notification.data, 
        userTypes: ['farmer', 'facility', 'laboratory', 'regulatory', 'user'] 
      };

      return await this.sendNotification(notification);

    } catch (error) {
      console.error('All users notification error:', error);
      return { success: false, error: error.message };
    }
  }

  // Analytics methods
  async getNotificationStats() {
    try {
      const totalNotifications = await this.redisClient.llen('global_notifications');
      const activeUsers = await this.redisClient.scard('users:active');
      
      return {
        success: true,
        stats: {
          totalNotifications,
          activeUsers,
          timestamp: new Date()
        }
      };

    } catch (error) {
      console.error('Notification stats error:', error);
      return { success: false, error: error.message };
    }
  }

  async getNotificationAnalytics(timeframe = '24h') {
    try {
      // Implementation for notification analytics
      // This would analyze notification patterns, delivery rates, etc.
      
      return {
        success: true,
        analytics: {
          timeframe,
          totalSent: 0,
          deliveryRate: 0,
          readRate: 0,
          timestamp: new Date()
        }
      };

    } catch (error) {
      console.error('Notification analytics error:', error);
      return { success: false, error: error.message };
    }
  }
}

export { NotificationService };
