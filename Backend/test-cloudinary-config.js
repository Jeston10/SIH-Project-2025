import dotenv from 'dotenv';
import { UploadService } from './src/services/uploadService.js';

// Load environment variables
dotenv.config();

console.log('☁️ Testing Your Cloudinary Configuration...\n');

const uploadService = new UploadService();

async function testYourCloudinaryConfig() {
  console.log('🔍 Checking your Cloudinary credentials...');
  
  // Check if credentials are set
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  
  console.log('📊 Your Configuration:');
  console.log(`   ☁️ Cloud Name: ${cloudName || 'NOT SET'}`);
  console.log(`   🔑 API Key: ${apiKey ? 'SET' : 'NOT SET'}`);
  console.log(`   🔐 API Secret: ${apiSecret ? 'SET' : 'NOT SET'}`);
  
  if (!cloudName || !apiKey || !apiSecret) {
    console.log('\n❌ Missing Cloudinary credentials!');
    console.log('💡 Please update your .env file with:');
    console.log('   CLOUDINARY_CLOUD_NAME=your-actual-cloud-name');
    console.log('   CLOUDINARY_API_KEY=your-actual-api-key');
    console.log('   CLOUDINARY_API_SECRET=your-actual-api-secret');
    return;
  }
  
  console.log('\n✅ All credentials are set!');
  console.log('🔍 Testing Cloudinary connection...');
  
  try {
    const result = await uploadService.testConnection();
    console.log('🎉 SUCCESS! Cloudinary is working perfectly!');
    console.log(`☁️ ${result.message}`);
    
    console.log('\n🎯 Your AyurChakra backend is now ready for:');
    console.log('✅ Image uploads');
    console.log('✅ File storage');
    console.log('✅ Image transformations');
    console.log('✅ Automatic optimization');
    console.log('✅ Responsive images');
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Double-check your credentials in .env file');
    console.log('2. Make sure you copied them correctly from Cloudinary dashboard');
    console.log('3. Verify your Cloudinary account is active');
    console.log('4. Check if there are any typos in the credentials');
  }
}

testYourCloudinaryConfig();
