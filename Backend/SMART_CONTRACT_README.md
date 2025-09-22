# AyurChakra Herb Traceability Smart Contracts

## 🌿 Overview

This repository contains the smart contracts for the AyurChakra Herb Traceability system, enabling complete transparency and provenance tracking for Ayurvedic herbs from cultivation to consumer consumption.

## 🚀 Features

- **Complete Traceability**: Track herbs from cultivation to consumer
- **Quality Testing**: Laboratory test results stored on blockchain
- **Processing Steps**: Detailed processing history with GPS coordinates
- **Ownership Transfer**: Secure ownership management throughout supply chain
- **Authorization System**: Role-based access control for farmers, laboratories, and processors
- **Immutable Records**: Tamper-proof blockchain storage
- **Real-time Updates**: Live tracking of herb journey

## 📁 Project Structure

```
Backend/
├── contracts/
│   └── AyurChakraHerbTraceability.sol    # Main smart contract
├── test/
│   └── AyurChakraContract.test.js        # Comprehensive test suite
├── scripts/
│   └── deploy.js                         # Deployment script
├── hardhat.config.js                     # Hardhat configuration
└── package-smart-contract.json           # Dependencies
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation Steps

1. **Install Dependencies**
   ```bash
   cd Backend
   npm install
   ```

2. **Install Hardhat Dependencies**
   ```bash
   npm install --save-dev @nomicfoundation/hardhat-toolbox
   npm install --save-dev @nomicfoundation/hardhat-verify
   npm install --save-dev hardhat
   npm install --save-dev hardhat-gas-reporter
   npm install dotenv
   ```

3. **Environment Setup**
   Create a `.env` file in the Backend directory:
   ```env
   PRIVATE_KEY=your_wallet_private_key
   MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
   AMOY_RPC_URL=https://rpc-amoy.polygon.technology
   POLYGONSCAN_API_KEY=your_polygonscan_api_key
   ```

## 🧪 Testing

### Run All Tests
```bash
npx hardhat test
```

### Run Specific Test
```bash
npx hardhat test test/AyurChakraContract.test.js
```

### Test Coverage
The test suite includes:
- ✅ Contract deployment verification
- ✅ Authorization management
- ✅ Herb batch creation
- ✅ Quality testing
- ✅ Processing steps
- ✅ Ownership transfers
- ✅ Distribution tracking
- ✅ Complete traceability chain
- ✅ Error handling
- ✅ Demo scenario

## 🚀 Deployment

### Local Network
```bash
npx hardhat run scripts/deploy.js
```

### Mumbai Testnet
```bash
npx hardhat run scripts/deploy.js --network mumbai
```

### Amoy Testnet
```bash
npx hardhat run scripts/deploy.js --network amoy
```

## 📋 Smart Contract Functions

### Core Functions
- `createHerbBatch()` - Create new herb batch
- `addQualityTest()` - Add laboratory test results
- `addProcessingStep()` - Add processing step
- `transferOwnership()` - Transfer batch ownership
- `markAsProcessed()` - Mark batch as processed
- `markAsDistributed()` - Mark batch as distributed

### Query Functions
- `getHerbBatch()` - Get complete batch information
- `getQualityTests()` - Get all quality tests for batch
- `getProcessingSteps()` - Get all processing steps for batch
- `getTraceabilityChain()` - Get complete traceability chain

### Admin Functions
- `authorizeFarmer()` - Authorize farmer
- `authorizeLaboratory()` - Authorize laboratory
- `authorizeProcessor()` - Authorize processor
- `revokeFarmerAuthorization()` - Revoke farmer authorization
- `revokeLaboratoryAuthorization()` - Revoke laboratory authorization
- `revokeProcessorAuthorization()` - Revoke processor authorization

## 🔗 Integration with Frontend

The smart contract integrates with your AyurChakra frontend through:

1. **Web3 Integration**: Connect to user wallets (MetaMask)
2. **Real-time Updates**: Listen to contract events
3. **Data Display**: Show traceability information in 3D visualizations
4. **User Interactions**: Allow stakeholders to interact with contracts

## 📊 Demo Scenario

The test suite includes a complete demo scenario showing:

1. **Authorization**: Authorize farmers, laboratories, and processors
2. **Batch Creation**: Farmer creates Ashwagandha batch
3. **Quality Testing**: Laboratory conducts active compound analysis
4. **Processing**: Multiple processing steps (drying, powdering, packaging)
5. **Ownership Transfer**: Transfer from farmer to processor
6. **Distribution**: Mark batch as distributed
7. **Traceability**: Complete chain from cultivation to consumer

## 🌐 Network Configuration

### Supported Networks
- **Hardhat Local**: Development and testing
- **Mumbai Testnet**: Polygon testnet (deprecated)
- **Amoy Testnet**: New Polygon testnet (recommended)

### Getting Testnet Tokens
- **Mumbai Faucet**: https://faucet.polygon.technology/
- **Amoy Faucet**: https://faucet.polygon.technology/

## 🔒 Security Features

- **Role-based Access Control**: Only authorized users can perform specific actions
- **Input Validation**: All inputs are validated before processing
- **Ownership Verification**: Only batch owners can transfer ownership
- **State Validation**: Ensures proper workflow (test before process, process before distribute)
- **Immutable Records**: Once recorded, data cannot be modified

## 📈 Gas Optimization

- **Efficient Storage**: Optimized data structures
- **Batch Operations**: Multiple operations in single transaction
- **Event Logging**: Use events for off-chain data
- **Gas Estimation**: Built-in gas estimation for transactions

## 🎯 Use Cases

1. **Farmers**: Create herb batches with GPS coordinates
2. **Laboratories**: Add quality test results and certificates
3. **Processors**: Record processing steps and transfer ownership
4. **Distributors**: Track and manage herb inventory
5. **Consumers**: Verify herb authenticity and quality
6. **Regulators**: Monitor compliance and audit trails

## 🚀 Future Enhancements

- **NFT Integration**: Mint NFTs for premium herb batches
- **DeFi Features**: Tokenization of herb assets
- **IoT Integration**: Automatic data collection from sensors
- **AI Integration**: Automated quality assessment
- **Cross-chain**: Support for multiple blockchain networks

## 📞 Support

For questions or support regarding the smart contracts:
- Check the test files for usage examples
- Review the contract comments for detailed function descriptions
- Run the demo scenario to understand the complete workflow

## 📄 License

MIT License - See LICENSE file for details

---

**🌿 AyurChakra - Revolutionizing Ayurvedic Herb Traceability with Blockchain Technology**
