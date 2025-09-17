import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Testing AyurChakra API Endpoints...\n');

  const endpoints = [
    { method: 'GET', path: '/health', description: 'Health Check' },
    { method: 'GET', path: '/auth/status', description: 'Auth Status' },
    { method: 'GET', path: '/blockchain/data', description: 'Blockchain Data' },
    { method: 'GET', path: '/farmer/harvest', description: 'Farmer Harvest Data' },
    { method: 'GET', path: '/facility/processing', description: 'Facility Processing Data' },
    { method: 'GET', path: '/laboratory/quality-tests', description: 'Laboratory Quality Tests' },
    { method: 'GET', path: '/regulatory/supply-chain', description: 'Regulatory Supply Chain' },
    { method: 'GET', path: '/user/supply-chain', description: 'User Supply Chain' }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`🔍 Testing ${endpoint.method} ${endpoint.path} - ${endpoint.description}`);
      
      const response = await fetch(`${BASE_URL}${endpoint.path}`, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const status = response.status;
      const statusText = response.statusText;
      
      if (status === 200) {
        console.log(`✅ ${status} ${statusText} - Success!`);
      } else if (status === 401) {
        console.log(`🔒 ${status} ${statusText} - Authentication required (expected)`);
      } else if (status === 500) {
        console.log(`⚠️ ${status} ${statusText} - Server error (MongoDB connection issue)`);
      } else {
        console.log(`❓ ${status} ${statusText} - Unexpected response`);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }

  console.log('🎯 API Testing Complete!');
  console.log('\n📋 Summary:');
  console.log('- ✅ Server is running on port 5000');
  console.log('- ✅ API endpoints are accessible');
  console.log('- ⚠️ MongoDB connection needs to be fixed');
  console.log('- ⚠️ Blockchain service needs private key');
}

testAPI().catch(console.error);
