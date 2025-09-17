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
    
    const stats = [
      { name: 'Tests Completed', value: testData.filter(t => t.status === 'completed').length || 0, change: '+0', changeType: 'positive' },
      { name: 'Pending Analysis', value: testData.filter(t => t.status === 'pending').length || 0, change: '+0', changeType: 'positive' },
      { name: 'DNA Samples', value: testData.filter(t => (t.testType || '').toLowerCase().includes('dna')).length || 0, change: '+0', changeType: 'positive' },
      { name: 'Quality Score', value: '98%', change: '+0%', changeType: 'positive' }
    ];

    const recentTests = (Array.isArray(testData) ? testData : []).slice(0, 5).map((t, i) => ({
      id: t.testId || `T${i + 1}`,
      sample: t.sampleId || 'Sample',
      type: t.testType || 'Quality Test',
      status: t.status || (t.result ? 'Completed' : 'Pending'),
      result: t.result || 'Pending'
    }));

    const testQueue = (Array.isArray(testData) ? testData : [])
      .filter(t => (t.status || '').toLowerCase() === 'pending')
      .slice(0, 10)
      .map((t, i) => ({ id: t.testId || `Q${i + 1}`, sample: t.sampleId || 'Sample', priority: 'Medium', estimatedTime: '4 hours' }));

    const dashboardData = { stats, recentTests, testQueue };

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
