# AyurChakra Backend

A comprehensive real-time backend application for the AyurChakra agricultural supply chain management platform. This backend provides blockchain-powered traceability, real-time tracking, and comprehensive data management for the entire agricultural supply chain from harvest to consumer.

## 🚀 Features

### Core Functionality
- **Real-time Data Tracking** - Live updates for harvest, processing, and supply chain data
- **Blockchain Integration** - Immutable records using Ethereum smart contracts
- **Multi-user Support** - Farmers, facilities, laboratories, regulatory authorities, and consumers
- **Quality Management** - Comprehensive testing and compliance monitoring
- **Supply Chain Transparency** - End-to-end traceability with GPS tracking
- **Real-time Notifications** - Socket.IO powered instant updates
- **Advanced Analytics** - Data insights and reporting

### User Types
1. **Farmers** - Upload harvest data, environmental conditions, GPS tracking
2. **Facility Managers** - Processing operations, batch management, transportation
3. **Laboratories** - Quality tests, DNA barcoding, pesticide analysis
4. **Regulatory Authorities** - Compliance monitoring, violation tracking
5. **End Users/Consumers** - Product tracking, quality reports, origin verification

## 🛠️ Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.IO
- **Cache**: Redis
- **Blockchain**: Ethereum (Web3.js, Ethers.js)
- **Authentication**: JWT
- **File Upload**: Multer + Cloudinary
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- MongoDB 5.0 or higher
- Redis 6.0 or higher
- Git

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/ayurchakra
   REDIS_URL=redis://localhost:6379
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   
   # Blockchain Configuration
   ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/your-project-id
   PRIVATE_KEY=your-private-key
   CONTRACT_ADDRESS=your-smart-contract-address
   
   # External Services
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📁 Project Structure

```
Backend/
├── src/
│   ├── models/           # Database models
│   │   ├── User.js
│   │   ├── Harvest.js
│   │   ├── Processing.js
│   │   ├── QualityTest.js
│   │   └── SupplyChain.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── farmer.js
│   │   ├── facility.js
│   │   ├── laboratory.js
│   │   ├── regulatory.js
│   │   ├── user.js
│   │   └── blockchain.js
│   ├── middleware/       # Custom middleware
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── services/         # Business logic services
│   │   ├── blockchainService.js
│   │   ├── notificationService.js
│   │   └── realTimeTrackingService.js
│   ├── socket/           # Socket.IO handlers
│   │   └── socketHandlers.js
│   ├── utils/            # Utility functions
│   └── server.js         # Main server file
├── package.json
├── env.example
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Farmer Routes
- `GET /api/farmer/dashboard` - Get farmer dashboard data
- `POST /api/farmer/harvest` - Create new harvest record
- `GET /api/farmer/harvests` - Get farmer's harvests
- `PUT /api/farmer/harvest/:id` - Update harvest record
- `POST /api/farmer/upload-photos` - Upload harvest photos

### Facility Routes
- `GET /api/facility/dashboard` - Get facility dashboard data
- `POST /api/facility/processing` - Create processing record
- `GET /api/facility/processings` - Get facility processings
- `PUT /api/facility/processing/:id` - Update processing record
- `POST /api/facility/transportation` - Update transportation data

### Laboratory Routes
- `GET /api/laboratory/dashboard` - Get laboratory dashboard data
- `POST /api/laboratory/quality-test` - Create quality test
- `GET /api/laboratory/tests` - Get laboratory tests
- `PUT /api/laboratory/test/:id` - Update test results
- `POST /api/laboratory/dna-barcoding` - DNA barcoding analysis

### Regulatory Routes
- `GET /api/regulatory/dashboard` - Get regulatory dashboard
- `GET /api/regulatory/compliance` - Get compliance data
- `POST /api/regulatory/inspection` - Create inspection record
- `GET /api/regulatory/violations` - Get violations
- `POST /api/regulatory/alert` - Create compliance alert

### User Routes
- `GET /api/user/dashboard` - Get user dashboard
- `GET /api/user/track/:batchId` - Track product
- `GET /api/user/quality-reports` - Get quality reports
- `POST /api/user/feedback` - Submit feedback

### Blockchain Routes
- `POST /api/blockchain/verify` - Verify blockchain transaction
- `GET /api/blockchain/status` - Get blockchain status
- `POST /api/blockchain/qr-generate` - Generate QR code
- `POST /api/blockchain/qr-verify` - Verify QR code

## 🔄 Real-time Features

### Socket.IO Events

#### Client to Server
- `harvest:update` - Update harvest data
- `processing:update` - Update processing data
- `quality_test:update` - Update quality test results
- `supply_chain:track` - Update supply chain tracking
- `blockchain:verify` - Verify blockchain transaction
- `notification:subscribe` - Subscribe to notifications
- `compliance:monitor` - Monitor compliance
- `dashboard:data` - Request dashboard data
- `message:send` - Send message

#### Server to Client
- `harvest:updated` - Harvest data updated
- `processing:updated` - Processing data updated
- `quality_test:updated` - Quality test updated
- `supply_chain:location_updated` - Location updated
- `supply_chain:alerts` - Supply chain alerts
- `blockchain:verified` - Blockchain verification complete
- `notification:new` - New notification
- `compliance:alert` - Compliance alert
- `system:health` - System health update

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with configurable rounds
- **Rate Limiting** - Prevent abuse and DDoS attacks
- **CORS Protection** - Cross-origin resource sharing control
- **Helmet Security** - Security headers
- **Input Validation** - Comprehensive request validation
- **Account Locking** - Automatic lockout after failed attempts
- **Activity Logging** - Track user activities

## 📊 Database Models

### User Model
- Basic profile information
- User type specific data (farmer, facility, laboratory, regulatory, user)
- Location and contact information
- Authentication and security data
- Activity logging and statistics

### Harvest Model
- Crop information and quality metrics
- GPS coordinates and field data
- Environmental conditions
- Documentation and photos
- Blockchain integration
- Compliance tracking

### Processing Model
- Processing steps and parameters
- Equipment information
- Quality control data
- Timeline and efficiency metrics
- Cost tracking
- Blockchain verification

### Quality Test Model
- Test parameters and results
- Laboratory information
- Compliance data
- Documentation and certificates
- Blockchain integration
- Cost tracking

### Supply Chain Model
- Product and batch information
- Supply chain nodes and tracking
- Real-time location updates
- Quality tracking
- Environmental monitoring
- Blockchain events

## 🌐 Blockchain Integration

### Smart Contract Features
- Harvest recording with immutable data
- Processing step verification
- Quality test result storage
- Supply chain update tracking
- Token-based product representation

### Blockchain Services
- Transaction recording and verification
- QR code generation and validation
- Wallet management
- Gas optimization
- Network status monitoring

## 📱 Real-time Tracking

### Features
- GPS location tracking
- Environmental condition monitoring
- Quality degradation alerts
- Supply chain status updates
- Compliance monitoring
- Real-time notifications

### Alerts System
- Temperature and humidity breaches
- Quality score degradation
- Processing delays
- Compliance violations
- Equipment failures

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker (Optional)
```bash
docker build -t ayurchakra-backend .
docker run -p 5000:5000 ayurchakra-backend
```

## 📈 Monitoring and Analytics

- **System Health** - Real-time system status
- **Performance Metrics** - Response times and throughput
- **User Analytics** - Activity patterns and usage
- **Blockchain Analytics** - Transaction metrics
- **Quality Metrics** - Test results and compliance
- **Supply Chain Analytics** - Tracking efficiency

## 🔧 Configuration

### Environment Variables
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - JWT signing secret
- `ETHEREUM_RPC_URL` - Ethereum RPC endpoint
- `PRIVATE_KEY` - Blockchain wallet private key
- `CONTRACT_ADDRESS` - Smart contract address

### Rate Limiting
- Default: 100 requests per 15 minutes per IP
- Configurable via environment variables

### File Upload
- Maximum file size: 10MB
- Supported formats: JPEG, PNG, WebP, PDF
- Cloud storage: Cloudinary integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- Machine learning for quality prediction
- IoT sensor integration
- Advanced analytics dashboard
- Mobile app integration
- Multi-language support
- Advanced blockchain features
- AI-powered compliance monitoring

---

**AyurChakra Backend** - Revolutionizing agricultural supply chain transparency through blockchain technology and real-time tracking.
