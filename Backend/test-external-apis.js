import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

console.log('🧪 Testing External APIs...\n');

// Test Weather API
async function testWeatherAPI() {
  console.log('🌤️ Testing OpenWeatherMap API...');
  
  if (!process.env.WEATHER_API_KEY || process.env.WEATHER_API_KEY === 'your-weather-api-key') {
    console.log('❌ Weather API key not configured');
    return;
  }
  
  try {
    // Test with Delhi coordinates (example)
    const lat = 28.6139;
    const lon = 77.2090;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Weather API working!');
      console.log(`📍 Location: ${data.name}, ${data.sys.country}`);
      console.log(`🌡️ Temperature: ${data.main.temp}°C`);
      console.log(`☁️ Weather: ${data.weather[0].description}`);
    } else {
      console.log('❌ Weather API error:', data.message);
    }
  } catch (error) {
    console.log('❌ Weather API test failed:', error.message);
  }
}

// Test GPS API
async function testGPSAPI() {
  console.log('\n🗺️ Testing Google Maps Geocoding API...');
  
  if (!process.env.GPS_API_KEY || process.env.GPS_API_KEY === 'your-gps-api-key') {
    console.log('❌ GPS API key not configured');
    return;
  }
  
  try {
    // Test geocoding with a sample address
    const address = 'Delhi, India';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GPS_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      console.log('✅ GPS API working!');
      const result = data.results[0];
      console.log(`📍 Address: ${result.formatted_address}`);
      console.log(`📍 Coordinates: ${result.geometry.location.lat}, ${result.geometry.location.lng}`);
    } else {
      console.log('❌ GPS API error:', data.status, data.error_message || '');
    }
  } catch (error) {
    console.log('❌ GPS API test failed:', error.message);
  }
}

// Run tests
async function runTests() {
  await testWeatherAPI();
  await testGPSAPI();
  
  console.log('\n🎯 API testing completed!');
  console.log('\n💡 Next steps:');
  console.log('1. Get your API keys from the provided links');
  console.log('2. Update your .env file with the actual keys');
  console.log('3. Run this test again to verify everything works');
}

runTests();
