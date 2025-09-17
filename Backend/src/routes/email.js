import express from 'express';
import { EmailService } from '../services/emailService.js';
import { authenticateToken, requireUserType } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const emailService = new EmailService();

// Validation middleware
const validateEmailSend = [
  body('to').isEmail().normalizeEmail(),
  body('subject').notEmpty().trim(),
  body('html').optional().isString(),
  body('text').optional().isString()
];

const validateTemplateEmail = [
  body('to').isEmail().normalizeEmail(),
  body('templateName').notEmpty().trim(),
  body('subject').notEmpty().trim(),
  body('data').isObject()
];

// @route   GET /api/email/status
// @desc    Get email service status
// @access  Private
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const status = emailService.getStatus();
    
    res.json({
      success: true,
      data: {
        ...status,
        message: status.configured ? 
          'Email service is configured and ready' : 
          'Email service is not configured. Please check your email settings.'
      }
    });
  } catch (error) {
    console.error('Email status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get email service status'
    });
  }
});

// @route   POST /api/email/test-connection
// @desc    Test email service connection
// @access  Private (Admin only)
router.post('/test-connection', authenticateToken, requireUserType('regulatory'), async (req, res) => {
  try {
    const result = await emailService.testConnection();
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Email connection test error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/email/send
// @desc    Send a custom email
// @access  Private
router.post('/send', authenticateToken, validateEmailSend, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { to, subject, html, text, cc, bcc, attachments } = req.body;

    const result = await emailService.sendEmail({
      to,
      subject,
      html,
      text,
      cc,
      bcc,
      attachments
    });

    res.json({
      success: true,
      message: 'Email sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/email/send-template
// @desc    Send email using template
// @access  Private
router.post('/send-template', authenticateToken, validateTemplateEmail, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { to, templateName, subject, data, cc, bcc, attachments } = req.body;

    const result = await emailService.sendTemplateEmail(templateName, data, {
      to,
      subject,
      cc,
      bcc,
      attachments
    });

    res.json({
      success: true,
      message: 'Template email sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Template email send error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/email/welcome
// @desc    Send welcome email to user
// @access  Private
router.post('/welcome', authenticateToken, async (req, res) => {
  try {
    const { user } = req.body;

    if (!user || !user.email) {
      return res.status(400).json({
        success: false,
        message: 'User data with email is required'
      });
    }

    const result = await emailService.sendWelcomeEmail(user);

    res.json({
      success: true,
      message: 'Welcome email sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Welcome email error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/email/verify-email
// @desc    Send email verification
// @access  Private
router.post('/verify-email', authenticateToken, async (req, res) => {
  try {
    const { user } = req.body;

    if (!user || !user.email) {
      return res.status(400).json({
        success: false,
        message: 'User data with email is required'
      });
    }

    const result = await emailService.sendEmailVerification(user);

    res.json({
      success: true,
      message: 'Email verification sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/email/password-reset
// @desc    Send password reset email
// @access  Private
router.post('/password-reset', authenticateToken, async (req, res) => {
  try {
    const { user, resetToken } = req.body;

    if (!user || !user.email || !resetToken) {
      return res.status(400).json({
        success: false,
        message: 'User data, email, and reset token are required'
      });
    }

    const result = await emailService.sendPasswordResetEmail(user, resetToken);

    res.json({
      success: true,
      message: 'Password reset email sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Password reset email error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/email/harvest-notification
// @desc    Send harvest notification email
// @access  Private (Farmer only)
router.post('/harvest-notification', authenticateToken, requireUserType('farmer'), async (req, res) => {
  try {
    const { user, harvestData } = req.body;

    if (!user || !user.email || !harvestData) {
      return res.status(400).json({
        success: false,
        message: 'User data, email, and harvest data are required'
      });
    }

    const result = await emailService.sendHarvestNotification(user, harvestData);

    res.json({
      success: true,
      message: 'Harvest notification sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Harvest notification error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/email/quality-alert
// @desc    Send quality alert email
// @access  Private (Laboratory only)
router.post('/quality-alert', authenticateToken, requireUserType('laboratory'), async (req, res) => {
  try {
    const { user, qualityData } = req.body;

    if (!user || !user.email || !qualityData) {
      return res.status(400).json({
        success: false,
        message: 'User data, email, and quality data are required'
      });
    }

    const result = await emailService.sendQualityAlert(user, qualityData);

    res.json({
      success: true,
      message: 'Quality alert sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Quality alert error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/email/supply-chain-update
// @desc    Send supply chain update email
// @access  Private (Facility only)
router.post('/supply-chain-update', authenticateToken, requireUserType('facility'), async (req, res) => {
  try {
    const { user, supplyChainData } = req.body;

    if (!user || !user.email || !supplyChainData) {
      return res.status(400).json({
        success: false,
        message: 'User data, email, and supply chain data are required'
      });
    }

    const result = await emailService.sendSupplyChainUpdate(user, supplyChainData);

    res.json({
      success: true,
      message: 'Supply chain update sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Supply chain update error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/email/compliance-alert
// @desc    Send compliance alert email
// @access  Private (Regulatory only)
router.post('/compliance-alert', authenticateToken, requireUserType('regulatory'), async (req, res) => {
  try {
    const { user, complianceData } = req.body;

    if (!user || !user.email || !complianceData) {
      return res.status(400).json({
        success: false,
        message: 'User data, email, and compliance data are required'
      });
    }

    const result = await emailService.sendComplianceAlert(user, complianceData);

    res.json({
      success: true,
      message: 'Compliance alert sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Compliance alert error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/email/system-notification
// @desc    Send system notification email
// @access  Private
router.post('/system-notification', authenticateToken, async (req, res) => {
  try {
    const { user, notificationData } = req.body;

    if (!user || !user.email || !notificationData) {
      return res.status(400).json({
        success: false,
        message: 'User data, email, and notification data are required'
      });
    }

    const result = await emailService.sendSystemNotification(user, notificationData);

    res.json({
      success: true,
      message: 'System notification sent successfully',
      data: result
    });
  } catch (error) {
    console.error('System notification error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/email/templates
// @desc    Get available email templates
// @access  Private
router.get('/templates', authenticateToken, async (req, res) => {
  try {
    const status = emailService.getStatus();
    
    const templates = [
      'welcome',
      'email-verification',
      'password-reset',
      'harvest-notification',
      'quality-alert',
      'supply-chain-update',
      'compliance-alert',
      'system-notification'
    ];

    res.json({
      success: true,
      data: {
        available: templates,
        loaded: status.templatesLoaded,
        configured: status.configured
      }
    });
  } catch (error) {
    console.error('Email templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get email templates'
    });
  }
});

export default router;
