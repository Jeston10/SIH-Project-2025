import express from 'express';
import { WeatherService } from '../services/weatherService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const weatherService = new WeatherService();

// @route   POST /api/weather/current
// @desc    Get current weather by coordinates
// @access  Private
router.post('/current', authenticateToken, async (req, res) => {
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

    const result = await weatherService.getCurrentWeather(latitude, longitude);

    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('Current weather error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/weather/forecast
// @desc    Get 5-day weather forecast by coordinates
// @access  Private
router.post('/forecast', authenticateToken, async (req, res) => {
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

    const result = await weatherService.getForecast(latitude, longitude);

    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('Weather forecast error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/weather/city
// @desc    Get current weather by city name
// @access  Private
router.post('/city', authenticateToken, async (req, res) => {
  try {
    const { cityName, countryCode } = req.body;

    if (!cityName) {
      return res.status(400).json({
        success: false,
        message: 'City name is required'
      });
    }

    const result = await weatherService.getWeatherByCity(cityName, countryCode);

    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('City weather error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/weather/harvest-suitability
// @desc    Check if weather conditions are suitable for harvest
// @access  Private
router.post('/harvest-suitability', authenticateToken, async (req, res) => {
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

    const weatherResult = await weatherService.getCurrentWeather(latitude, longitude);

    if (weatherResult.success) {
      const isSuitable = weatherService.isHarvestSuitable(weatherResult);
      const alerts = weatherService.getWeatherAlerts(weatherResult);

      res.json({
        success: true,
        data: {
          isSuitable,
          weather: weatherResult.data,
          alerts,
          recommendations: isSuitable ? 
            ['Weather conditions are suitable for harvest'] : 
            ['Consider delaying harvest due to weather conditions']
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: weatherResult.error
      });
    }
  } catch (error) {
    console.error('Harvest suitability error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/weather/alerts
// @desc    Get weather alerts for farming
// @access  Private
router.post('/alerts', authenticateToken, async (req, res) => {
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

    const weatherResult = await weatherService.getCurrentWeather(latitude, longitude);

    if (weatherResult.success) {
      const alerts = weatherService.getWeatherAlerts(weatherResult);

      res.json({
        success: true,
        data: {
          location: weatherResult.data.location,
          alerts,
          alertCount: alerts.length,
          hasAlerts: alerts.length > 0
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: weatherResult.error
      });
    }
  } catch (error) {
    console.error('Weather alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/weather/current
// @desc    Get current weather by coordinates (GET method for testing)
// @access  Private
router.get('/current', authenticateToken, async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'Latitude (lat) and longitude (lon) query parameters are required'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    // Validate coordinates
    if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates'
      });
    }

    const result = await weatherService.getCurrentWeather(latitude, longitude);

    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('Current weather error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/weather/status
// @desc    Check weather API status
// @access  Private
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const hasApiKey = weatherService.apiKey && weatherService.apiKey !== 'your-weather-api-key';
    
    res.json({
      success: true,
      data: {
        apiConfigured: hasApiKey,
        service: 'OpenWeatherMap',
        freeTier: '1,000 calls/day',
        message: hasApiKey ? 
          'Weather API is configured and ready' : 
          'Weather API key not configured. Get your free key at: https://home.openweathermap.org/users/sign_up'
      }
    });
  } catch (error) {
    console.error('Weather status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
