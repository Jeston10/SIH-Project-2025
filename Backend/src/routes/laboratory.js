import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { addQualityTestResult, getQualityTestData } from '../services/blockchainService.js';

const router = express.Router();

// Add quality test result to blockchain
router.post('/quality-test', authenticateToken, async (req, res) => {
  try {
    const { sampleId, testType, result, details, dnaBarcode, pesticideAnalysis } = req.body;
    
    const testResult = await addQualityTestResult({
      testId: `test_${Date.now()}`,
      sampleId,
      laboratoryId: req.user.id,
      testType,
      result,
      details,
      dnaBarcode,
      pesticideAnalysis
    });

    res.status(201).json({
      success: true,
      message: 'Quality test result added to blockchain',
      data: testResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add quality test result',
      error: error.message
    });
  }
});

// Get laboratory test data
router.get('/quality-tests', authenticateToken, async (req, res) => {
  try {
    const testData = await getQualityTestData(req.user.id);
    res.json({
      success: true,
      data: testData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quality test data',
      error: error.message
    });
  }
});

// Get laboratory tests (alias for quality-tests)
router.get('/tests', authenticateToken, async (req, res) => {
  try {
    const testData = await getQualityTestData(req.user.id);
    res.json({
      success: true,
      data: testData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quality test data',
      error: error.message
    });
  }
});

// Get laboratory dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const testData = await getQualityTestData(req.user.id);
    
    // Mock dashboard data for laboratory
    const dashboardData = {
      stats: {
        totalTests: testData.length || 0,
        pendingTests: testData.filter(test => test.status === 'pending').length || 0,
        completedTests: testData.filter(test => test.status === 'completed').length || 0,
        failedTests: testData.filter(test => test.status === 'failed').length || 0
      },
      recentTests: testData.slice(0, 5) || [],
      testQueue: testData.filter(test => test.status === 'pending').slice(0, 10) || [],
      equipmentStatus: {
        dnaSequencer: 'operational',
        pesticideAnalyzer: 'operational',
        qualityTester: 'operational',
        sampleProcessor: 'operational'
      }
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch laboratory dashboard data',
      error: error.message
    });
  }
});

export default router;
