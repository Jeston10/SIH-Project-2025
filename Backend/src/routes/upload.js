import express from 'express';
import { UploadService } from '../services/uploadService.js';
import { authenticateToken, requireUserType } from '../middleware/auth.js';
import { fileUploadSecurity } from '../middleware/security.js';

const router = express.Router();
const uploadService = new UploadService();

// @route   GET /api/upload/status
// @desc    Get upload service status
// @access  Private
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const status = uploadService.getStatus();
    
    res.json({
      success: true,
      data: {
        ...status,
        message: status.configured ? 
          'Upload service is configured and ready' : 
          'Upload service is not configured. Please check your Cloudinary settings.'
      }
    });
  } catch (error) {
    console.error('Upload status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get upload service status'
    });
  }
});

// @route   POST /api/upload/test-connection
// @desc    Test Cloudinary connection
// @access  Private (Admin only)
router.post('/test-connection', authenticateToken, requireUserType('regulatory'), async (req, res) => {
  try {
    const result = await uploadService.testConnection();
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Upload connection test error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/upload/single
// @desc    Upload single file
// @access  Private
router.post('/single', authenticateToken, (req, res, next) => {
  const upload = uploadService.single('file');
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
}, fileUploadSecurity, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const result = await uploadService.uploadSingle(req.file, {
      folder: req.body.folder || 'ayurchakra',
      tags: req.body.tags ? req.body.tags.split(',') : []
    });

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: result.data
    });
  } catch (error) {
    console.error('Single file upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple files
// @access  Private
router.post('/multiple', authenticateToken, (req, res, next) => {
  const upload = uploadService.array('files', 5);
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
}, fileUploadSecurity, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const result = await uploadService.uploadMultiple(req.files, {
      folder: req.body.folder || 'ayurchakra',
      tags: req.body.tags ? req.body.tags.split(',') : []
    });

    res.json({
      success: true,
      message: `${req.files.length} files uploaded successfully`,
      data: result.data
    });
  } catch (error) {
    console.error('Multiple file upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/upload/from-url
// @desc    Upload file from URL
// @access  Private
router.post('/from-url', authenticateToken, async (req, res) => {
  try {
    const { url, folder, tags } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL is required'
      });
    }

    const result = await uploadService.uploadFromUrl(url, {
      folder: folder || 'ayurchakra',
      tags: tags ? tags.split(',') : []
    });

    res.json({
      success: true,
      message: 'File uploaded from URL successfully',
      data: result.data
    });
  } catch (error) {
    console.error('URL upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/upload/:publicId
// @desc    Delete file
// @access  Private
router.delete('/:publicId', authenticateToken, async (req, res) => {
  try {
    const { publicId } = req.params;

    const result = await uploadService.deleteFile(publicId);

    res.json({
      success: true,
      message: 'File deleted successfully',
      data: result
    });
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/upload/info/:publicId
// @desc    Get file information
// @access  Private
router.get('/info/:publicId', authenticateToken, async (req, res) => {
  try {
    const { publicId } = req.params;

    const result = await uploadService.getFileInfo(publicId);

    res.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('File info error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/upload/list
// @desc    List files in folder
// @access  Private
router.get('/list', authenticateToken, async (req, res) => {
  try {
    const { folder, limit } = req.query;

    const result = await uploadService.listFiles(folder, {
      limit: limit ? parseInt(limit) : 50
    });

    res.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('File listing error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/upload/transform/:publicId
// @desc    Get transformed image URL
// @access  Private
router.get('/transform/:publicId', authenticateToken, async (req, res) => {
  try {
    const { publicId } = req.params;
    const { preset, width, height, crop, quality } = req.query;

    let transformations = {};

    // Use preset if provided
    if (preset) {
      const presets = uploadService.getTransformationPresets();
      if (presets[preset]) {
        transformations = presets[preset];
      }
    } else {
      // Use individual parameters
      if (width) transformations.width = parseInt(width);
      if (height) transformations.height = parseInt(height);
      if (crop) transformations.crop = crop;
      if (quality) transformations.quality = quality;
    }

    const url = uploadService.generateImageUrl(publicId, transformations);

    res.json({
      success: true,
      data: {
        url,
        transformations
      }
    });
  } catch (error) {
    console.error('Image transformation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/upload/presets
// @desc    Get available transformation presets
// @access  Private
router.get('/presets', authenticateToken, async (req, res) => {
  try {
    const presets = uploadService.getTransformationPresets();

    res.json({
      success: true,
      data: {
        presets,
        usage: {
          thumbnail: 'Small profile images, icons',
          small: 'Preview images, thumbnails',
          medium: 'Card images, medium displays',
          large: 'Full-size images, galleries',
          profile: 'User profile pictures with face detection',
          harvest: 'Harvest photos with specific crop ratio',
          quality: 'Quality test images with high resolution',
          document: 'Document images with portrait orientation'
        }
      }
    });
  } catch (error) {
    console.error('Presets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transformation presets'
    });
  }
});

// Specialized upload endpoints for different user types

// @route   POST /api/upload/harvest-photos
// @desc    Upload harvest photos (Farmer only)
// @access  Private (Farmer only)
router.post('/harvest-photos', authenticateToken, requireUserType('farmer'), (req, res, next) => {
  const upload = uploadService.array('photos', 10);
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
}, fileUploadSecurity, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No harvest photos uploaded'
      });
    }

    const result = await uploadService.uploadMultiple(req.files, {
      folder: 'ayurchakra/harvest',
      tags: ['harvest', 'farmer', req.user._id.toString()]
    });

    res.json({
      success: true,
      message: `${req.files.length} harvest photos uploaded successfully`,
      data: result.data
    });
  } catch (error) {
    console.error('Harvest photos upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/upload/quality-images
// @desc    Upload quality test images (Laboratory only)
// @access  Private (Laboratory only)
router.post('/quality-images', authenticateToken, requireUserType('laboratory'), (req, res, next) => {
  const upload = uploadService.array('images', 5);
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
}, fileUploadSecurity, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No quality test images uploaded'
      });
    }

    const result = await uploadService.uploadMultiple(req.files, {
      folder: 'ayurchakra/quality',
      tags: ['quality', 'laboratory', req.user._id.toString()]
    });

    res.json({
      success: true,
      message: `${req.files.length} quality test images uploaded successfully`,
      data: result.data
    });
  } catch (error) {
    console.error('Quality images upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/upload/facility-documents
// @desc    Upload facility documents (Facility only)
// @access  Private (Facility only)
router.post('/facility-documents', authenticateToken, requireUserType('facility'), (req, res, next) => {
  const upload = uploadService.array('documents', 10);
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
}, fileUploadSecurity, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No facility documents uploaded'
      });
    }

    const result = await uploadService.uploadMultiple(req.files, {
      folder: 'ayurchakra/facility',
      tags: ['facility', 'documents', req.user._id.toString()]
    });

    res.json({
      success: true,
      message: `${req.files.length} facility documents uploaded successfully`,
      data: result.data
    });
  } catch (error) {
    console.error('Facility documents upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/upload/profile-picture
// @desc    Upload profile picture
// @access  Private
router.post('/profile-picture', authenticateToken, (req, res, next) => {
  const upload = uploadService.single('profilePicture');
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
}, fileUploadSecurity, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No profile picture uploaded'
      });
    }

    const result = await uploadService.uploadSingle(req.file, {
      folder: 'ayurchakra/profiles',
      tags: ['profile', 'user', req.user._id.toString()],
      transformation: [
        { width: 200, height: 200, crop: 'fill', gravity: 'face', quality: 'auto' }
      ]
    });

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: result.data
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
