// Weather Service using OpenWeatherMap API
// Free tier: 1,000 calls/day

export class WeatherService {
  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  // Get current weather by coordinates
  async getCurrentWeather(latitude, longitude) {
    if (!this.apiKey || this.apiKey === 'your-weather-api-key') {
      return {
        success: false,
        error: 'Weather API key not configured'
      };
    }

    try {
      const url = `${this.baseUrl}/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          data: {
            temperature: data.main.temp,
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            description: data.weather[0].description,
            windSpeed: data.wind.speed,
            windDirection: data.wind.deg,
            visibility: data.visibility,
            cloudiness: data.clouds.all,
            location: {
              name: data.name,
              country: data.sys.country,
              coordinates: {
                latitude: data.coord.lat,
                longitude: data.coord.lon
              }
            },
            timestamp: new Date(data.dt * 1000)
          }
        };
      } else {
        return {
          success: false,
          error: data.message || 'Weather API error'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get weather forecast (5 days)
  async getForecast(latitude, longitude) {
    if (!this.apiKey || this.apiKey === 'your-weather-api-key') {
      return {
        success: false,
        error: 'Weather API key not configured'
      };
    }

    try {
      const url = `${this.baseUrl}/forecast?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          data: {
            location: {
              name: data.city.name,
              country: data.city.country,
              coordinates: {
                latitude: data.city.coord.lat,
                longitude: data.city.coord.lon
              }
            },
            forecast: data.list.map(item => ({
              timestamp: new Date(item.dt * 1000),
              temperature: item.main.temp,
              humidity: item.main.humidity,
              pressure: item.main.pressure,
              description: item.weather[0].description,
              windSpeed: item.wind.speed,
              windDirection: item.wind.deg,
              cloudiness: item.clouds.all
            }))
          }
        };
      } else {
        return {
          success: false,
          error: data.message || 'Weather API error'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get weather by city name
  async getWeatherByCity(cityName, countryCode = '') {
    if (!this.apiKey || this.apiKey === 'your-weather-api-key') {
      return {
        success: false,
        error: 'Weather API key not configured'
      };
    }

    try {
      const query = countryCode ? `${cityName},${countryCode}` : cityName;
      const url = `${this.baseUrl}/weather?q=${encodeURIComponent(query)}&appid=${this.apiKey}&units=metric`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          data: {
            temperature: data.main.temp,
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            description: data.weather[0].description,
            windSpeed: data.wind.speed,
            windDirection: data.wind.deg,
            visibility: data.visibility,
            cloudiness: data.clouds.all,
            location: {
              name: data.name,
              country: data.sys.country,
              coordinates: {
                latitude: data.coord.lat,
                longitude: data.coord.lon
              }
            },
            timestamp: new Date(data.dt * 1000)
          }
        };
      } else {
        return {
          success: false,
          error: data.message || 'Weather API error'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Check if weather conditions are suitable for harvest
  isHarvestSuitable(weatherData) {
    if (!weatherData.success) return false;

    const { temperature, humidity, windSpeed, description } = weatherData.data;
    
    // Ideal harvest conditions
    const suitableTemperature = temperature >= 15 && temperature <= 35; // 15-35°C
    const suitableHumidity = humidity <= 80; // Below 80%
    const suitableWind = windSpeed <= 20; // Below 20 km/h
    const noRain = !description.toLowerCase().includes('rain');
    
    return suitableTemperature && suitableHumidity && suitableWind && noRain;
  }

  // Get weather alerts for farming
  getWeatherAlerts(weatherData) {
    if (!weatherData.success) return [];

    const alerts = [];
    const { temperature, humidity, windSpeed, description } = weatherData.data;
    
    if (temperature < 10) {
      alerts.push({ type: 'warning', message: 'Low temperature may affect crop quality' });
    }
    
    if (temperature > 40) {
      alerts.push({ type: 'danger', message: 'High temperature may damage crops' });
    }
    
    if (humidity > 90) {
      alerts.push({ type: 'warning', message: 'High humidity may cause mold growth' });
    }
    
    if (windSpeed > 25) {
      alerts.push({ type: 'warning', message: 'Strong winds may damage crops' });
    }
    
    if (description.toLowerCase().includes('rain')) {
      alerts.push({ type: 'info', message: 'Rain expected - consider delaying harvest' });
    }
    
    return alerts;
  }
}

export default WeatherService;
