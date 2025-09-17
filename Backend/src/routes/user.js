import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getSupplyChainData, getProductHistory } from '../services/blockchainService.js';

const router = express.Router();

// Get supply chain data for end users
router.get('/supply-chain/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const supplyChainData = await getProductHistory(productId);
    
    res.json({
      success: true,
      data: supplyChainData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product history',
      error: error.message
    });
  }
});

// Get all supply chain data
router.get('/supply-chain', authenticateToken, async (req, res) => {
  try {
    const supplyChainData = await getSupplyChainData();
    res.json({
      success: true,
      data: supplyChainData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch supply chain data',
      error: error.message
    });
  }
});

// Get user dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const supplyChainData = await getSupplyChainData();
    
    const userStats = [
      { name: 'Active Orders', value: 3, change: '+1', changeType: 'positive' },
      { name: 'Products Tracked', value: supplyChainData.length || 0, change: '+0', changeType: 'positive' },
      { name: 'Quality Score', value: '98%', change: '+0%', changeType: 'positive' },
      { name: 'Verified Origins', value: (supplyChainData.filter(i => i.verified).length || 0), change: '+0', changeType: 'positive' }
    ];

    const recentOrders = (supplyChainData || []).slice(0, 5).map((item, i) => ({
      id: item.orderId || `ORD${String(i + 1).padStart(3, '0')}`,
      product: item.product || item.name || 'Product',
      quantity: item.quantity || '1 unit',
      status: item.status || 'processing',
      orderDate: item.orderDate || new Date().toISOString().slice(0, 10),
      deliveryDate: item.deliveryDate || new Date(Date.now() + 5*24*3600*1000).toISOString().slice(0, 10),
      batchId: item.batchId || `B${String(i + 1).padStart(3, '0')}`,
    }));

    const featuredProducts = (supplyChainData || []).slice(0, 6).map((p, i) => ({
      id: p.productId || `P${i + 1}`,
      name: p.name || p.product || 'Product',
      origin: p.origin || p.supplier || 'Farm',
      qualityScore: p.qualityScore || 95,
      certifications: p.certifications || ['Verified'],
      image: p.image || ''
    }));

    const dashboardData = {
      userStats,
      recentOrders,
      featuredProducts
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user dashboard data',
      error: error.message
    });
  }
});

export default router;
