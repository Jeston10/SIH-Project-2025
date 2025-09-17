import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { addHarvestData, getHarvestData, uploadPhotos } from '../services/blockchainService.js';

const router = express.Router();

// Add harvest data to blockchain
router.post('/harvest', authenticateToken, async (req, res) => {
  try {
    const { cropType, quantity, location, environmentalConditions, photoHash, qualityScore } = req.body;
    
    const result = await addHarvestData({
      harvestId: `harvest_${Date.now()}`,
      farmerId: req.user.id,
      cropType,
      quantity,
      location,
      environmentalConditions,
      photoHash,
      qualityScore
    });

    res.status(201).json({
      success: true,
      message: 'Harvest data added to blockchain',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add harvest data',
      error: error.message
    });
  }
});

// Get farmer's harvest data
router.get('/harvest', authenticateToken, async (req, res) => {
  try {
    const harvestData = await getHarvestData(req.user.id);
    res.json({
      success: true,
      data: harvestData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch harvest data',
      error: error.message
    });
  }
});

// Upload photos and environment data
router.post('/upload', authenticateToken, async (req, res) => {
  try {
    const { photos, environmentalData } = req.body;
    
    const result = await uploadPhotos({
      farmerId: req.user.id,
      photos,
      environmentalData
    });

    res.status(201).json({
      success: true,
      message: 'Photos and environment data uploaded',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload data',
      error: error.message
    });
  }
});

export default router;
