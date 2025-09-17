import { v4 as uuidv4 } from 'uuid';
import SupplyChain from '../models/SupplyChain.js';
import Processing from '../models/Processing.js';
import QualityTest from '../models/QualityTest.js';

class RealTimeTrackingService {
  constructor(io, redisClient) {
    this.io = io;
    this.redisClient = redisClient;
    this.trackingInterval = null;
    this.activeTrackings = new Map();
  }

  async startTracking(supplyChainId, trackingData) {
    try {
      const trackingId = uuidv4();
      
      const tracking = {
        id: trackingId,
        supplyChainId,
        startTime: new Date(),
        lastUpdate: new Date(),
        status: 'active',
        data: trackingData,
        interval: trackingData.interval || 30000, // 30 seconds default
        callbacks: []
      };

      // Store in memory
      this.activeTrackings.set(trackingId, tracking);
      
      // Store in Redis for persistence
      await this.redisClient.setEx(
        `tracking:${trackingId}`, 
        24 * 60 * 60, // 24 hours TTL
        JSON.stringify(tracking)
      );

      // Start tracking loop
      this.startTrackingLoop(trackingId);

      return { success: true, trackingId };

    } catch (error) {
      console.error('Start tracking error:', error);
      return { success: false, error: error.message };
    }
  }

  async stopTracking(trackingId) {
    try {
      const tracking = this.activeTrackings.get(trackingId);
      if (!tracking) {
        return { success: false, message: 'Tracking not found' };
      }

      // Update status
      tracking.status = 'stopped';
      tracking.endTime = new Date();

      // Remove from memory
      this.activeTrackings.delete(trackingId);
      
      // Update in Redis
      await this.redisClient.setEx(
        `tracking:${trackingId}`, 
        24 * 60 * 60,
        JSON.stringify(tracking)
      );

      return { success: true };

    } catch (error) {
      console.error('Stop tracking error:', error);
      return { success: false, error: error.message };
    }
  }

  async updateTrackingData() {
    try {
      const activeTrackings = Array.from(this.activeTrackings.values());
      
      for (const tracking of activeTrackings) {
        await this.processTrackingUpdate(tracking);
      }

    } catch (error) {
      console.error('Update tracking data error:', error);
    }
  }

  async processTrackingUpdate(tracking) {
    try {
      const { supplyChainId, data } = tracking;
      
      // Get supply chain data
      const supplyChain = await SupplyChain.findById(supplyChainId);
      if (!supplyChain) {
        await this.stopTracking(tracking.id);
        return;
      }

      // Simulate real-time data updates
      const updates = await this.generateTrackingUpdates(supplyChain, data);
      
      if (updates.length > 0) {
        // Update supply chain
        for (const update of updates) {
          await this.applyTrackingUpdate(supplyChain, update);
        }

        // Emit real-time updates
        this.io.to(`supply_chain_${supplyChainId}`).emit('tracking:update', {
          supplyChainId,
          updates,
          timestamp: new Date()
        });

        // Check for alerts
        await this.checkTrackingAlerts(supplyChain, updates);
      }

      // Update tracking last update time
      tracking.lastUpdate = new Date();
      this.activeTrackings.set(tracking.id, tracking);

    } catch (error) {
      console.error('Process tracking update error:', error);
    }
  }

  async generateTrackingUpdates(supplyChain, trackingData) {
    const updates = [];

    // Simulate location updates
    if (trackingData.trackLocation) {
      const locationUpdate = await this.simulateLocationUpdate(supplyChain);
      if (locationUpdate) {
        updates.push(locationUpdate);
      }
    }

    // Simulate environmental condition updates
    if (trackingData.trackEnvironment) {
      const environmentUpdate = await this.simulateEnvironmentUpdate(supplyChain);
      if (environmentUpdate) {
        updates.push(environmentUpdate);
      }
    }

    // Simulate quality updates
    if (trackingData.trackQuality) {
      const qualityUpdate = await this.simulateQualityUpdate(supplyChain);
      if (qualityUpdate) {
        updates.push(qualityUpdate);
      }
    }

    return updates;
  }

  async simulateLocationUpdate(supplyChain) {
    try {
      const currentLocation = supplyChain.transportation.tracking.currentLocation;
      if (!currentLocation) return null;

      // Simulate small movement
      const latVariation = (Math.random() - 0.5) * 0.001; // ~100m variation
      const lngVariation = (Math.random() - 0.5) * 0.001;

      const newLocation = {
        latitude: currentLocation.latitude + latVariation,
        longitude: currentLocation.longitude + lngVariation,
        address: await this.reverseGeocode(
          currentLocation.latitude + latVariation,
          currentLocation.longitude + lngVariation
        ),
        timestamp: new Date()
      };

      return {
        type: 'location',
        data: newLocation
      };

    } catch (error) {
      console.error('Simulate location update error:', error);
      return null;
    }
  }

  async simulateEnvironmentUpdate(supplyChain) {
    try {
      const currentEnv = supplyChain.environmental;
      
      // Simulate realistic environmental changes
      const temperatureVariation = (Math.random() - 0.5) * 2; // ±1°C
      const humidityVariation = (Math.random() - 0.5) * 5; // ±2.5%

      const newEnvironment = {
        temperature: {
          ...currentEnv.temperature,
          current: Math.max(0, Math.min(50, 
            (currentEnv.temperature?.current || 25) + temperatureVariation
          ))
        },
        humidity: {
          ...currentEnv.humidity,
          current: Math.max(0, Math.min(100, 
            (currentEnv.humidity?.current || 60) + humidityVariation
          ))
        }
      };

      return {
        type: 'environment',
        data: newEnvironment
      };

    } catch (error) {
      console.error('Simulate environment update error:', error);
      return null;
    }
  }

  async simulateQualityUpdate(supplyChain) {
    try {
      const currentQuality = supplyChain.qualityTracking.currentQuality;
      if (!currentQuality) return null;

      // Simulate minor quality changes
      const qualityVariation = (Math.random() - 0.5) * 2; // ±1 point
      const newScore = Math.max(0, Math.min(100, 
        (currentQuality.score || 95) + qualityVariation
      ));

      const newQuality = {
        ...currentQuality,
        score: newScore,
        grade: this.getQualityGrade(newScore)
      };

      return {
        type: 'quality',
        data: newQuality
      };

    } catch (error) {
      console.error('Simulate quality update error:', error);
      return null;
    }
  }

  async applyTrackingUpdate(supplyChain, update) {
    try {
      switch (update.type) {
        case 'location':
          await supplyChain.updateLocation(update.data);
          break;
          
        case 'environment':
          supplyChain.environmental = {
            ...supplyChain.environmental,
            ...update.data
          };
          await supplyChain.save();
          break;
          
        case 'quality':
          supplyChain.qualityTracking.currentQuality = update.data;
          supplyChain.qualityTracking.qualityHistory.push({
            node: 'tracking',
            timestamp: new Date(),
            quality: update.data,
            testedBy: 'system'
          });
          await supplyChain.save();
          break;
      }

    } catch (error) {
      console.error('Apply tracking update error:', error);
    }
  }

  async checkTrackingAlerts(supplyChain, updates) {
    try {
      const alerts = [];

      for (const update of updates) {
        if (update.type === 'environment') {
          const { temperature, humidity } = update.data;
          
          // Temperature alerts
          if (temperature?.current) {
            if (temperature.current > 35 || temperature.current < 5) {
              alerts.push({
                type: 'temperature_breach',
                severity: 'high',
                message: `Temperature breach: ${temperature.current}°C`,
                value: temperature.current,
                threshold: { min: 5, max: 35 }
              });
            }
          }

          // Humidity alerts
          if (humidity?.current) {
            if (humidity.current > 85 || humidity.current < 15) {
              alerts.push({
                type: 'humidity_breach',
                severity: 'medium',
                message: `Humidity breach: ${humidity.current}%`,
                value: humidity.current,
                threshold: { min: 15, max: 85 }
              });
            }
          }
        }

        if (update.type === 'quality') {
          const { score } = update.data;
          
          if (score < 80) {
            alerts.push({
              type: 'quality_degradation',
              severity: 'high',
              message: `Quality score dropped to ${score}%`,
              value: score,
              threshold: { min: 80 }
            });
          }
        }
      }

      // Add alerts to supply chain
      for (const alert of alerts) {
        await supplyChain.addAlert(alert);
      }

      // Emit alerts if any
      if (alerts.length > 0) {
        this.io.to(`supply_chain_${supplyChain._id}`).emit('tracking:alerts', {
          supplyChainId: supplyChain._id,
          alerts,
          timestamp: new Date()
        });

        // Notify regulatory for critical alerts
        const criticalAlerts = alerts.filter(alert => alert.severity === 'high');
        if (criticalAlerts.length > 0) {
          this.io.to('type_regulatory').emit('compliance:alert', {
            supplyChainId: supplyChain._id,
            alerts: criticalAlerts,
            timestamp: new Date()
          });
        }
      }

    } catch (error) {
      console.error('Check tracking alerts error:', error);
    }
  }

  startTrackingLoop(trackingId) {
    const tracking = this.activeTrackings.get(trackingId);
    if (!tracking) return;

    const interval = setInterval(async () => {
      try {
        if (tracking.status !== 'active') {
          clearInterval(interval);
          return;
        }

        await this.processTrackingUpdate(tracking);

      } catch (error) {
        console.error('Tracking loop error:', error);
      }
    }, tracking.interval);

    // Store interval ID for cleanup
    tracking.intervalId = interval;
    this.activeTrackings.set(trackingId, tracking);
  }

  async reverseGeocode(latitude, longitude) {
    try {
      // In a real implementation, this would call a geocoding service
      // For now, return a simulated address
      return `Simulated Address for ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Unknown Location';
    }
  }

  getQualityGrade(score) {
    if (score >= 95) return 'Premium';
    if (score >= 90) return 'Grade A';
    if (score >= 80) return 'Grade B';
    if (score >= 70) return 'Grade C';
    return 'Rejected';
  }

  async getTrackingStatus(trackingId) {
    try {
      const tracking = this.activeTrackings.get(trackingId);
      if (tracking) {
        return { success: true, tracking };
      }

      // Check Redis for stopped tracking
      const trackingData = await this.redisClient.get(`tracking:${trackingId}`);
      if (trackingData) {
        return { success: true, tracking: JSON.parse(trackingData) };
      }

      return { success: false, message: 'Tracking not found' };

    } catch (error) {
      console.error('Get tracking status error:', error);
      return { success: false, error: error.message };
    }
  }

  async getAllActiveTrackings() {
    try {
      const activeTrackings = Array.from(this.activeTrackings.values());
      
      return {
        success: true,
        trackings: activeTrackings,
        count: activeTrackings.length
      };

    } catch (error) {
      console.error('Get all active trackings error:', error);
      return { success: false, error: error.message };
    }
  }

  async getTrackingAnalytics(timeframe = '24h') {
    try {
      const activeTrackings = Array.from(this.activeTrackings.values());
      
      const analytics = {
        timeframe,
        activeTrackings: activeTrackings.length,
        totalUpdates: 0,
        alertsGenerated: 0,
        averageUpdateInterval: 0,
        timestamp: new Date()
      };

      // Calculate analytics from active trackings
      for (const tracking of activeTrackings) {
        analytics.totalUpdates += tracking.data?.updateCount || 0;
        analytics.alertsGenerated += tracking.data?.alertCount || 0;
      }

      if (activeTrackings.length > 0) {
        analytics.averageUpdateInterval = activeTrackings.reduce(
          (sum, tracking) => sum + tracking.interval, 0
        ) / activeTrackings.length;
      }

      return { success: true, analytics };

    } catch (error) {
      console.error('Get tracking analytics error:', error);
      return { success: false, error: error.message };
    }
  }

  async cleanupExpiredTrackings() {
    try {
      const expiredTrackings = [];
      
      for (const [trackingId, tracking] of this.activeTrackings) {
        const now = new Date();
        const timeDiff = now - tracking.lastUpdate;
        
        // Consider tracking expired if no update for 1 hour
        if (timeDiff > 60 * 60 * 1000) {
          expiredTrackings.push(trackingId);
        }
      }

      // Stop expired trackings
      for (const trackingId of expiredTrackings) {
        await this.stopTracking(trackingId);
      }

      return { success: true, cleaned: expiredTrackings.length };

    } catch (error) {
      console.error('Cleanup expired trackings error:', error);
      return { success: false, error: error.message };
    }
  }

  // Initialize tracking service
  async initialize() {
    try {
      // Start periodic cleanup
      setInterval(async () => {
        await this.cleanupExpiredTrackings();
      }, 60 * 60 * 1000); // Every hour

      // Start global tracking data updates
      this.trackingInterval = setInterval(async () => {
        await this.updateTrackingData();
      }, 30000); // Every 30 seconds

      console.log('✅ Real-time tracking service initialized');

    } catch (error) {
      console.error('❌ Real-time tracking service initialization failed:', error);
    }
  }

  // Cleanup on shutdown
  async shutdown() {
    try {
      if (this.trackingInterval) {
        clearInterval(this.trackingInterval);
      }

      // Stop all active trackings
      for (const trackingId of this.activeTrackings.keys()) {
        await this.stopTracking(trackingId);
      }

      console.log('✅ Real-time tracking service shutdown complete');

    } catch (error) {
      console.error('❌ Real-time tracking service shutdown error:', error);
    }
  }
}

export { RealTimeTrackingService };
