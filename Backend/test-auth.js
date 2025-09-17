import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function testAuthentication() {
  console.log('🔐 Testing AyurChakra Authentication Flow...\n');

  // Test data
  const testUser = {
    email: 'test@ayurchakra.com',
    password: 'password123',
    userType: 'farmer',
    profile: {
      firstName: 'Test',
      lastName: 'User',
      phone: '+1234567890',
      address: 'Test Address'
    }
  };

  try {
    // Step 1: Register a new user
    console.log('📝 Step 1: Registering new user...');
    const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    const registerResult = await registerResponse.json();
    
    if (registerResponse.status === 201) {
      console.log('✅ User registered successfully!');
      console.log('👤 User ID:', registerResult.data.user._id);
    } else if (registerResponse.status === 400 && registerResult.message.includes('already exists')) {
      console.log('ℹ️ User already exists, proceeding to login...');
    } else {
      console.log('❌ Registration failed:', registerResult.message);
      return;
    }

    // Step 2: Login
    console.log('\n🔑 Step 2: Logging in...');
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });

    const loginResult = await loginResponse.json();
    
    if (loginResponse.status === 200) {
      console.log('✅ Login successful!');
      console.log('🎫 Token received:', loginResult.token ? 'Yes' : 'No');
      
      const token = loginResult.token;
      
      // Step 3: Test authenticated endpoint
      console.log('\n🔒 Step 3: Testing authenticated endpoint...');
      const meResponse = await fetch(`${BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const meResult = await meResponse.json();
      
      if (meResponse.status === 200) {
        console.log('✅ Authenticated request successful!');
        console.log('👤 User info:', {
          id: meResult.data._id,
          email: meResult.data.email,
          userType: meResult.data.userType,
          name: `${meResult.data.profile.firstName} ${meResult.data.profile.lastName}`
        });
      } else {
        console.log('❌ Authenticated request failed:', meResult.message);
      }

      // Step 4: Test blockchain endpoint
      console.log('\n⛓️ Step 4: Testing blockchain endpoint...');
      const blockchainResponse = await fetch(`${BASE_URL}/blockchain/data`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const blockchainResult = await blockchainResponse.json();
      
      if (blockchainResponse.status === 200) {
        console.log('✅ Blockchain endpoint accessible!');
        console.log('📊 Data received:', Object.keys(blockchainResult.data));
      } else {
        console.log('⚠️ Blockchain endpoint response:', blockchainResponse.status, blockchainResult.message);
      }

    } else {
      console.log('❌ Login failed:', loginResult.message);
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }

  console.log('\n🎯 Authentication test complete!');
}

testAuthentication().catch(console.error);
