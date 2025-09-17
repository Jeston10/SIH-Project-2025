import fetch from 'node-fetch';

async function testServer() {
  console.log('🧪 Testing AyurChakra Server...\n');
  
  try {
    // Test health endpoint
    console.log('🔍 Testing health endpoint...');
    const response = await fetch('http://localhost:5000/health');
    const data = await response.json();
    
    console.log('✅ Health check successful!');
    console.log('📊 Server status:', data.status);
    console.log('⏰ Uptime:', data.uptime, 'seconds');
    console.log('🌍 Environment:', data.environment);
    console.log('🔗 Services:', data.services);
    
  } catch (error) {
    console.log('❌ Server test failed:', error.message);
    console.log('💡 Make sure the server is running on port 5000');
  }
}

testServer();
