import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔑 API Key Setup for AyurChakra Backend\n');

async function getApiKey(service) {
  return new Promise((resolve) => {
    rl.question(`Enter your ${service} API key: `, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function updateEnvFile() {
  try {
    // Read current .env file
    let envContent = fs.readFileSync('.env', 'utf8');
    
    // Get API keys from user
    const weatherKey = await getApiKey('OpenWeatherMap');
    const gpsKey = await getApiKey('Google Maps');
    
    // Update the .env file
    envContent = envContent.replace(
      'WEATHER_API_KEY=your-weather-api-key',
      `WEATHER_API_KEY=${weatherKey}`
    );
    
    envContent = envContent.replace(
      'GPS_API_KEY=your-gps-api-key',
      `GPS_API_KEY=${gpsKey}`
    );
    
    // Write updated .env file
    fs.writeFileSync('.env', envContent);
    
    console.log('\n✅ API keys updated successfully!');
    console.log('🌤️ Weather API: OpenWeatherMap');
    console.log('🗺️ GPS API: Google Maps');
    console.log('\n🚀 Your AyurChakra backend is now ready with external APIs!');
    
  } catch (error) {
    console.error('❌ Error updating API keys:', error.message);
  } finally {
    rl.close();
  }
}

updateEnvFile();
