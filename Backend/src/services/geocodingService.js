// Free Geocoding Service using OpenStreetMap Nominatim
// No API key required - completely free!

export class GeocodingService {
  constructor() {
    this.baseUrl = 'https://nominatim.openstreetmap.org';
    this.userAgent = 'AyurChakra/1.0'; // Required by Nominatim
  }

  // Convert address to coordinates
  async geocode(address) {
    try {
      const url = `${this.baseUrl}/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': this.userAgent
        }
      });
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          success: true,
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
          address: data[0].display_name,
          confidence: data[0].importance
        };
      } else {
        return {
          success: false,
          error: 'Address not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Convert coordinates to address (reverse geocoding)
  async reverseGeocode(latitude, longitude) {
    try {
      const url = `${this.baseUrl}/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': this.userAgent
        }
      });
      
      const data = await response.json();
      
      if (data && data.display_name) {
        return {
          success: true,
          address: data.display_name,
          components: data.address || {}
        };
      } else {
        return {
          success: false,
          error: 'Location not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get distance between two coordinates (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
}

export default GeocodingService;
