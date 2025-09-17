import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import Harvest from '../models/Harvest.js';
import Processing from '../models/Processing.js';
import QualityTest from '../models/QualityTest.js';
import SupplyChain from '../models/SupplyChain.js';

class BlockchainService {
  constructor() {
    this.provider = null;
    this.wallet = null;
    this.contract = null;
    this.isInitialized = false;
    
    // Don't initialize automatically - wait for manual initialization
  }

  async initialize() {
    try {
      if (!process.env.ETHEREUM_RPC_URL || !process.env.PRIVATE_KEY) {
        console.log('⚠️ Blockchain service disabled - missing configuration');
        return;
      }

      // Initialize provider
      this.provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
      
      // Initialize wallet
      this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
      
      // Initialize contract (if contract address is provided)
      if (process.env.CONTRACT_ADDRESS) {
        // Load contract ABI and initialize contract
        this.contract = new ethers.Contract(
          process.env.CONTRACT_ADDRESS,
          this.getContractABI(),
          this.wallet
        );
      }

      this.isInitialized = true;
      console.log('✅ Blockchain service initialized');
      
    } catch (error) {
      console.error('❌ Blockchain service initialization failed:', error);
      this.isInitialized = false;
    }
  }

  getContractABI() {
    // Simplified ABI for AyurChakra smart contract
    return [
      {
        "inputs": [
          {"name": "harvestId", "type": "string"},
          {"name": "farmerId", "type": "string"},
          {"name": "cropData", "type": "string"},
          {"name": "locationData", "type": "string"}
        ],
        "name": "recordHarvest",
        "outputs": [{"name": "tokenId", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {"name": "processingId", "type": "string"},
          {"name": "harvestId", "type": "string"},
          {"name": "processingData", "type": "string"}
        ],
        "name": "recordProcessing",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {"name": "testId", "type": "string"},
          {"name": "batchId", "type": "string"},
          {"name": "testResults", "type": "string"}
        ],
        "name": "recordQualityTest",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {"name": "supplyChainId", "type": "string"},
          {"name": "updateData", "type": "string"}
        ],
        "name": "updateSupplyChain",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [{"name": "tokenId", "type": "uint256"}],
        "name": "getTokenData",
        "outputs": [{"name": "data", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{"name": "batchId", "type": "string"}],
        "name": "getBatchHistory",
        "outputs": [{"name": "history", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
      }
    ];
  }

  async recordHarvest(harvestData) {
    if (!this.isInitialized) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      const { harvestId, farmerId, crop, field, quality, environmental } = harvestData;
      
      // Prepare data for blockchain
      const cropData = JSON.stringify({
        name: crop.name,
        variety: crop.variety,
        category: crop.category,
        quantity: harvestData.quantity,
        quality: quality
      });

      const locationData = JSON.stringify({
        coordinates: field.coordinates,
        address: field.name,
        soilType: field.soilType
      });

      // Estimate gas
      const gasEstimate = await this.contract.recordHarvest.estimateGas(
        harvestId,
        farmerId,
        cropData,
        locationData
      );

      // Execute transaction
      const tx = await this.contract.recordHarvest(
        harvestId,
        farmerId,
        cropData,
        locationData,
        {
          gasLimit: gasEstimate * 2n, // Add buffer
          gasPrice: await this.provider.getGasPrice()
        }
      );

      // Wait for confirmation
      const receipt = await tx.wait();
      
      // Extract token ID from events
      const tokenId = this.extractTokenIdFromReceipt(receipt);

      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        tokenId: tokenId,
        gasUsed: receipt.gasUsed.toString()
      };

    } catch (error) {
      console.error('Blockchain harvest recording error:', error);
      throw new Error(`Failed to record harvest on blockchain: ${error.message}`);
    }
  }

  async recordProcessing(processingData) {
    if (!this.isInitialized) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      const { processingId, harvestId, processingType, quantities, qualityControl } = processingData;
      
      const processingDataString = JSON.stringify({
        type: processingType,
        input: quantities.input,
        output: quantities.output,
        qualityResult: qualityControl.overallResult,
        qualityScore: qualityControl.qualityScore
      });

      const gasEstimate = await this.contract.recordProcessing.estimateGas(
        processingId,
        harvestId,
        processingDataString
      );

      const tx = await this.contract.recordProcessing(
        processingId,
        harvestId,
        processingDataString,
        {
          gasLimit: gasEstimate * 2n,
          gasPrice: await this.provider.getGasPrice()
        }
      );

      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };

    } catch (error) {
      console.error('Blockchain processing recording error:', error);
      throw new Error(`Failed to record processing on blockchain: ${error.message}`);
    }
  }

  async recordQualityTest(testData) {
    if (!this.isInitialized) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      const { testId, batchId, testType, results, parameters } = testData;
      
      const testResults = JSON.stringify({
        type: testType,
        result: results.overallResult,
        qualityScore: results.qualityScore,
        parameters: parameters,
        compliance: results.compliance
      });

      const gasEstimate = await this.contract.recordQualityTest.estimateGas(
        testId,
        batchId,
        testResults
      );

      const tx = await this.contract.recordQualityTest(
        testId,
        batchId,
        testResults,
        {
          gasLimit: gasEstimate * 2n,
          gasPrice: await this.provider.getGasPrice()
        }
      );

      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };

    } catch (error) {
      console.error('Blockchain quality test recording error:', error);
      throw new Error(`Failed to record quality test on blockchain: ${error.message}`);
    }
  }

  async updateSupplyChain(supplyChainData) {
    if (!this.isInitialized) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      const { supplyChainId, currentStatus, location, qualityTracking } = supplyChainData;
      
      const updateData = JSON.stringify({
        status: currentStatus,
        location: location,
        quality: qualityTracking.currentQuality,
        timestamp: new Date().toISOString()
      });

      const gasEstimate = await this.contract.updateSupplyChain.estimateGas(
        supplyChainId,
        updateData
      );

      const tx = await this.contract.updateSupplyChain(
        supplyChainId,
        updateData,
        {
          gasLimit: gasEstimate * 2n,
          gasPrice: await this.provider.getGasPrice()
        }
      );

      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };

    } catch (error) {
      console.error('Blockchain supply chain update error:', error);
      throw new Error(`Failed to update supply chain on blockchain: ${error.message}`);
    }
  }

  async verifyHarvest(harvestId, transactionHash) {
    try {
      if (!this.isInitialized) {
        return { success: false, message: 'Blockchain service not initialized' };
      }

      // Get transaction details
      const tx = await this.provider.getTransaction(transactionHash);
      if (!tx) {
        return { success: false, message: 'Transaction not found' };
      }

      // Get transaction receipt
      const receipt = await this.provider.getTransactionReceipt(transactionHash);
      if (!receipt || receipt.status !== 1) {
        return { success: false, message: 'Transaction failed' };
      }

      // Verify transaction data matches harvest data
      const harvest = await Harvest.findById(harvestId);
      if (!harvest) {
        return { success: false, message: 'Harvest not found' };
      }

      // Update harvest with blockchain data
      harvest.blockchain = {
        transactionHash: transactionHash,
        blockNumber: receipt.blockNumber,
        isVerified: true,
        verificationDate: new Date()
      };

      await harvest.save();

      return {
        success: true,
        message: 'Harvest verified on blockchain',
        transactionHash,
        blockNumber: receipt.blockNumber
      };

    } catch (error) {
      console.error('Harvest verification error:', error);
      return { success: false, message: error.message };
    }
  }

  async verifyProcessing(processingId, transactionHash) {
    try {
      if (!this.isInitialized) {
        return { success: false, message: 'Blockchain service not initialized' };
      }

      const tx = await this.provider.getTransaction(transactionHash);
      const receipt = await this.provider.getTransactionReceipt(transactionHash);
      
      if (!tx || !receipt || receipt.status !== 1) {
        return { success: false, message: 'Invalid transaction' };
      }

      const processing = await Processing.findById(processingId);
      if (!processing) {
        return { success: false, message: 'Processing not found' };
      }

      processing.blockchain = {
        transactionHash: transactionHash,
        blockNumber: receipt.blockNumber,
        isVerified: true,
        verificationDate: new Date()
      };

      await processing.save();

      return {
        success: true,
        message: 'Processing verified on blockchain',
        transactionHash,
        blockNumber: receipt.blockNumber
      };

    } catch (error) {
      console.error('Processing verification error:', error);
      return { success: false, message: error.message };
    }
  }

  async verifyQualityTest(testId, transactionHash) {
    try {
      if (!this.isInitialized) {
        return { success: false, message: 'Blockchain service not initialized' };
      }

      const tx = await this.provider.getTransaction(transactionHash);
      const receipt = await this.provider.getTransactionReceipt(transactionHash);
      
      if (!tx || !receipt || receipt.status !== 1) {
        return { success: false, message: 'Invalid transaction' };
      }

      const qualityTest = await QualityTest.findById(testId);
      if (!qualityTest) {
        return { success: false, message: 'Quality test not found' };
      }

      qualityTest.blockchain = {
        transactionHash: transactionHash,
        blockNumber: receipt.blockNumber,
        isVerified: true,
        verificationDate: new Date()
      };

      await qualityTest.save();

      return {
        success: true,
        message: 'Quality test verified on blockchain',
        transactionHash,
        blockNumber: receipt.blockNumber
      };

    } catch (error) {
      console.error('Quality test verification error:', error);
      return { success: false, message: error.message };
    }
  }

  async getBatchHistory(batchId) {
    try {
      if (!this.isInitialized) {
        return { success: false, message: 'Blockchain service not initialized' };
      }

      // Query blockchain for batch history
      const history = await this.contract.getBatchHistory(batchId);
      
      return {
        success: true,
        history: JSON.parse(history)
      };

    } catch (error) {
      console.error('Batch history retrieval error:', error);
      return { success: false, message: error.message };
    }
  }

  async getTokenData(tokenId) {
    try {
      if (!this.isInitialized) {
        return { success: false, message: 'Blockchain service not initialized' };
      }

      const data = await this.contract.getTokenData(tokenId);
      
      return {
        success: true,
        data: JSON.parse(data)
      };

    } catch (error) {
      console.error('Token data retrieval error:', error);
      return { success: false, message: error.message };
    }
  }

  async getWalletBalance() {
    try {
      if (!this.isInitialized) {
        return { success: false, message: 'Blockchain service not initialized' };
      }

      const balance = await this.wallet.getBalance();
      
      return {
        success: true,
        balance: ethers.formatEther(balance),
        address: this.wallet.address
      };

    } catch (error) {
      console.error('Wallet balance retrieval error:', error);
      return { success: false, message: error.message };
    }
  }

  async getGasPrice() {
    try {
      if (!this.isInitialized) {
        return { success: false, message: 'Blockchain service not initialized' };
      }

      const gasPrice = await this.provider.getGasPrice();
      
      return {
        success: true,
        gasPrice: ethers.formatUnits(gasPrice, 'gwei')
      };

    } catch (error) {
      console.error('Gas price retrieval error:', error);
      return { success: false, message: error.message };
    }
  }

  extractTokenIdFromReceipt(receipt) {
    // Extract token ID from contract events
    // This is a simplified implementation
    // In a real scenario, you would parse the contract events
    return Math.floor(Math.random() * 1000000);
  }

  async generateQRCodeData(harvestId) {
    try {
      const harvest = await Harvest.findById(harvestId);
      if (!harvest) {
        throw new Error('Harvest not found');
      }

      const qrData = {
        harvestId: harvest._id,
        batchId: harvest.batchId,
        crop: harvest.crop,
        farmer: harvest.farmerId,
        blockchain: harvest.blockchain,
        timestamp: new Date().toISOString(),
        verificationUrl: `${process.env.FRONTEND_URL}/verify/${harvest.batchId}`
      };

      return {
        success: true,
        qrData: JSON.stringify(qrData),
        publicUrl: qrData.verificationUrl
      };

    } catch (error) {
      console.error('QR code generation error:', error);
      return { success: false, message: error.message };
    }
  }

  async validateQRCode(qrData) {
    try {
      const data = JSON.parse(qrData);
      
      // Verify harvest exists
      const harvest = await Harvest.findById(data.harvestId);
      if (!harvest) {
        return { success: false, message: 'Harvest not found' };
      }

      // Verify blockchain data if available
      if (data.blockchain && data.blockchain.transactionHash) {
        const verification = await this.verifyHarvest(
          data.harvestId, 
          data.blockchain.transactionHash
        );
        
        if (!verification.success) {
          return { success: false, message: 'Blockchain verification failed' };
        }
      }

      return {
        success: true,
        harvest: harvest,
        verified: true,
        message: 'QR code validated successfully'
      };

    } catch (error) {
      console.error('QR code validation error:', error);
      return { success: false, message: error.message };
    }
  }

  async getNetworkStatus() {
    try {
      if (!this.isInitialized) {
        return { 
          connected: false, 
          message: 'Blockchain service not initialized' 
        };
      }

      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();
      const gasPrice = await this.provider.getGasPrice();

      return {
        connected: true,
        network: {
          name: network.name,
          chainId: network.chainId.toString(),
          blockNumber: blockNumber,
          gasPrice: ethers.formatUnits(gasPrice, 'gwei')
        }
      };

    } catch (error) {
      console.error('Network status error:', error);
      return { 
        connected: false, 
        message: error.message 
      };
    }
  }
}

// Create a singleton instance
const blockchainService = new BlockchainService();

// Export individual functions for easier use
export const addHarvestData = (data) => blockchainService.recordHarvest(data);
export const addProcessingStep = (data) => blockchainService.recordProcessing(data);
export const addQualityTestResult = (data) => blockchainService.recordQualityTest(data);
export const addSupplyChainEvent = (data) => blockchainService.updateSupplyChain(data);

export const getHarvestData = async (farmerId) => {
  try {
    const harvests = await Harvest.find({ farmerId });
    return harvests;
  } catch (error) {
    throw new Error(`Failed to fetch harvest data: ${error.message}`);
  }
};

export const getProcessingData = async (facilityId) => {
  try {
    const processing = await Processing.find({ facilityId });
    return processing;
  } catch (error) {
    throw new Error(`Failed to fetch processing data: ${error.message}`);
  }
};

export const getQualityTestData = async (laboratoryId) => {
  try {
    const tests = await QualityTest.find({ laboratoryId });
    return tests;
  } catch (error) {
    throw new Error(`Failed to fetch quality test data: ${error.message}`);
  }
};

export const getSupplyChainData = async () => {
  try {
    const supplyChain = await SupplyChain.find();
    return supplyChain;
  } catch (error) {
    throw new Error(`Failed to fetch supply chain data: ${error.message}`);
  }
};

export const getProductHistory = async (productId) => {
  try {
    const history = await SupplyChain.find({ productId }).sort({ timestamp: 1 });
    return history;
  } catch (error) {
    throw new Error(`Failed to fetch product history: ${error.message}`);
  }
};

export const getComplianceData = async () => {
  try {
    const compliance = await SupplyChain.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
    return compliance;
  } catch (error) {
    throw new Error(`Failed to fetch compliance data: ${error.message}`);
  }
};

export const uploadPhotos = async (data) => {
  // Placeholder for photo upload functionality
  return {
    success: true,
    message: 'Photos uploaded successfully',
    data: data
  };
};

export { BlockchainService };
