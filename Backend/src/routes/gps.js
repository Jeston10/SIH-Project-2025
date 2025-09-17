import express from 'express';
import { GeocodingService } from '../services/geocodingService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const geocodingService = new GeocodingService();

// @route   POST /api/gps/geocode
// @desc    Convert address to coordinates
// @access  Private
router.post('/geocode', authenticateToken, async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Address is required'
      });
    }

    const result = await geocodingService.geocode(address);

    if (result.success) {
      res.json({
        success: true,
        data: {
          address: result.address,
          coordinates: {
            latitude: result.latitude,
            longitude: result.longitude
          },
          confidence: result.confidence
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/gps/reverse
// @desc    Convert coordinates to address
// @access  Private
router.post('/reverse', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    // Validate coordinates
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates'
      });
    }

    const result = await geocodingService.reverseGeocode(latitude, longitude);

    if (result.success) {
      res.json({
        success: true,
        data: {
          address: result.address,
          components: result.components,
          coordinates: {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
          }
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/gps/distance
// @desc    Calculate distance between two coordinates
// @access  Private
router.post('/distance', authenticateToken, async (req, res) => {
  try {
    const { from, to } = req.body;

    if (!from || !to || !from.latitude || !from.longitude || !to.latitude || !to.longitude) {
      return res.status(400).json({
        success: false,
        message: 'Both from and to coordinates are required'
      });
    }

    // Validate coordinates
    const validateCoords = (lat, lon) => {
      return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
    };

    if (!validateCoords(from.latitude, from.longitude) || !validateCoords(to.latitude, to.longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates'
      });
    }

    const distance = geocodingService.calculateDistance(
      from.latitude,
      from.longitude,
      to.latitude,
      to.longitude
    );

    res.json({
      success: true,
      data: {
        distance: distance,
        unit: 'kilometers',
        from: {
          latitude: from.latitude,
          longitude: from.longitude
        },
        to: {
          latitude: to.latitude,
          longitude: to.longitude
        }
      }
    });
  } catch (error) {
    console.error('Distance calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/gps/validate-address
// @desc    Validate and get detailed address information
// @access  Private
router.post('/validate-address', authenticateToken, async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Address is required'
      });
    }

    const result = await geocodingService.geocode(address);

    if (result.success) {
      // Get detailed address components
      const reverseResult = await geocodingService.reverseGeocode(result.latitude, result.longitude);
      
      res.json({
        success: true,
        data: {
          originalAddress: address,
          foundAddress: result.address,
          coordinates: {
            latitude: result.latitude,
            longitude: result.longitude
          },
          confidence: result.confidence,
          components: reverseResult.success ? reverseResult.components : null,
          isValid: result.confidence > 0.5
        }
      });
    } else {
      res.json({
        success: false,
        data: {
          originalAddress: address,
          isValid: false,
          error: result.error
        }
      });
    }
  } catch (error) {
    console.error('Address validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/gps/nearby-farms
// @desc    Find farms near a given location
// @access  Private
router.get('/nearby-farms', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    // This would typically query your database for farms within the radius
    // For now, we'll return a placeholder response
    res.json({
      success: true,
      data: {
        center: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        },
        radius: parseFloat(radius),
        farms: [], // This would be populated from your database
        message: 'Nearby farms feature - to be implemented with database integration'
      }
    });
  } catch (error) {
    console.error('Nearby farms error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
