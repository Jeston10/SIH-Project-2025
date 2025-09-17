import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Email Service for AyurChakra Backend
 * Handles all email communications including notifications, verifications, and alerts
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.templates = new Map();
    this.isConfigured = false;
    this.initialize();
  }

  async initialize() {
    try {
      // Check if email configuration is available
      const emailConfig = this.getEmailConfig();
      
      if (!emailConfig.host || !emailConfig.user || !emailConfig.pass) {
        console.warn('⚠️ Email service disabled - missing configuration');
        return;
      }

      // Create transporter
      this.transporter = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.port === 465, // true for 465, false for other ports
        auth: {
          user: emailConfig.user,
          pass: emailConfig.pass
        },
        tls: {
          rejectUnauthorized: false // For development only
        }
      });

      // Verify connection
      await this.transporter.verify();
      this.isConfigured = true;
      
      console.log('✅ Email service initialized successfully');
      
      // Load email templates
      await this.loadTemplates();
      
    } catch (error) {
      console.error('❌ Email service initialization failed:', error.message);
      this.isConfigured = false;
    }
  }

  getEmailConfig() {
    return {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_USER
    };
  }

  async loadTemplates() {
    try {
      const templatesDir = path.join(__dirname, '../templates/email');
      
      // Check if templates directory exists
      try {
        await fs.access(templatesDir);
      } catch {
        console.log('📧 Email templates directory not found, creating default templates...');
        await this.createDefaultTemplates();
        return;
      }

      const templateFiles = await fs.readdir(templatesDir);
      
      for (const file of templateFiles) {
        if (file.endsWith('.hbs')) {
          const templateName = path.basename(file, '.hbs');
          const templatePath = path.join(templatesDir, file);
          const templateContent = await fs.readFile(templatePath, 'utf8');
          const template = handlebars.compile(templateContent);
          this.templates.set(templateName, template);
        }
      }
      
      console.log(`✅ Loaded ${this.templates.size} email templates`);
    } catch (error) {
      console.error('❌ Error loading email templates:', error.message);
    }
  }

  async createDefaultTemplates() {
    const templatesDir = path.join(__dirname, '../templates/email');
    
    // Create templates directory
    await fs.mkdir(templatesDir, { recursive: true });
    
    // Default templates
    const templates = {
      'welcome': this.getWelcomeTemplate(),
      'email-verification': this.getEmailVerificationTemplate(),
      'password-reset': this.getPasswordResetTemplate(),
      'harvest-notification': this.getHarvestNotificationTemplate(),
      'quality-alert': this.getQualityAlertTemplate(),
      'supply-chain-update': this.getSupplyChainUpdateTemplate(),
      'compliance-alert': this.getComplianceAlertTemplate(),
      'system-notification': this.getSystemNotificationTemplate()
    };

    for (const [name, content] of Object.entries(templates)) {
      const templatePath = path.join(templatesDir, `${name}.hbs`);
      await fs.writeFile(templatePath, content);
    }
    
    console.log('✅ Created default email templates');
    
    // Reload templates
    await this.loadTemplates();
  }

  async sendEmail(options) {
    if (!this.isConfigured) {
      throw new Error('Email service is not configured');
    }

    try {
      const emailConfig = this.getEmailConfig();
      
      const mailOptions = {
        from: `"AyurChakra" <${emailConfig.from}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: emailConfig.replyTo
      };

      // Add CC and BCC if provided
      if (options.cc) mailOptions.cc = options.cc;
      if (options.bcc) mailOptions.bcc = options.bcc;

      // Add attachments if provided
      if (options.attachments) mailOptions.attachments = options.attachments;

      const result = await this.transporter.sendMail(mailOptions);
      
      console.log(`📧 Email sent successfully to ${options.to}: ${result.messageId}`);
      return {
        success: true,
        messageId: result.messageId,
        response: result.response
      };
    } catch (error) {
      console.error('❌ Email sending failed:', error.message);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendTemplateEmail(templateName, data, options) {
    if (!this.isConfigured) {
      throw new Error('Email service is not configured');
    }

    try {
      const template = this.templates.get(templateName);
      if (!template) {
        throw new Error(`Email template '${templateName}' not found`);
      }

      const html = template(data);
      
      return await this.sendEmail({
        to: options.to,
        subject: options.subject,
        html: html,
        cc: options.cc,
        bcc: options.bcc,
        attachments: options.attachments
      });
    } catch (error) {
      console.error(`❌ Template email sending failed (${templateName}):`, error.message);
      throw error;
    }
  }

  // Email template methods
  async sendWelcomeEmail(user) {
    return await this.sendTemplateEmail('welcome', {
      name: user.profile.firstName,
      email: user.email,
      userType: user.userType,
      verificationLink: `${process.env.FRONTEND_URL}/verify-email?token=${user.emailVerificationToken}`
    }, {
      to: user.email,
      subject: 'Welcome to AyurChakra - Your Account is Ready!'
    });
  }

  async sendEmailVerification(user) {
    return await this.sendTemplateEmail('email-verification', {
      name: user.profile.firstName,
      verificationLink: `${process.env.FRONTEND_URL}/verify-email?token=${user.emailVerificationToken}`
    }, {
      to: user.email,
      subject: 'Verify Your Email Address - AyurChakra'
    });
  }

  async sendPasswordResetEmail(user, resetToken) {
    return await this.sendTemplateEmail('password-reset', {
      name: user.profile.firstName,
      resetLink: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
    }, {
      to: user.email,
      subject: 'Password Reset Request - AyurChakra'
    });
  }

  async sendHarvestNotification(user, harvestData) {
    return await this.sendTemplateEmail('harvest-notification', {
      name: user.profile.firstName,
      harvestData: harvestData,
      dashboardLink: `${process.env.FRONTEND_URL}/farmer/dashboard`
    }, {
      to: user.email,
      subject: `Harvest Update: ${harvestData.cropType} - Batch ${harvestData.batchId}`
    });
  }

  async sendQualityAlert(user, qualityData) {
    return await this.sendTemplateEmail('quality-alert', {
      name: user.profile.firstName,
      qualityData: qualityData,
      dashboardLink: `${process.env.FRONTEND_URL}/laboratory/dashboard`
    }, {
      to: user.email,
      subject: `Quality Alert: ${qualityData.testType} - Batch ${qualityData.batchId}`
    });
  }

  async sendSupplyChainUpdate(user, supplyChainData) {
    return await this.sendTemplateEmail('supply-chain-update', {
      name: user.profile.firstName,
      supplyChainData: supplyChainData,
      dashboardLink: `${process.env.FRONTEND_URL}/facility/dashboard`
    }, {
      to: user.email,
      subject: `Supply Chain Update: ${supplyChainData.productId}`
    });
  }

  async sendComplianceAlert(user, complianceData) {
    return await this.sendTemplateEmail('compliance-alert', {
      name: user.profile.firstName,
      complianceData: complianceData,
      dashboardLink: `${process.env.FRONTEND_URL}/regulatory/dashboard`
    }, {
      to: user.email,
      subject: `Compliance Alert: ${complianceData.alertType}`
    });
  }

  async sendSystemNotification(user, notificationData) {
    return await this.sendTemplateEmail('system-notification', {
      name: user.profile.firstName,
      notificationData: notificationData,
      dashboardLink: `${process.env.FRONTEND_URL}/${user.userType}/dashboard`
    }, {
      to: user.email,
      subject: `System Notification: ${notificationData.title}`
    });
  }

  // Template content methods
  getWelcomeTemplate() {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to AyurChakra</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2E7D32; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; }
        .footer { text-align: center; padding: 20px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌿 Welcome to AyurChakra</h1>
        </div>
        <div class="content">
            <h2>Hello {{name}}!</h2>
            <p>Welcome to AyurChakra, your comprehensive agricultural supply chain management platform!</p>
            <p>Your account has been successfully created as a <strong>{{userType}}</strong> user.</p>
            <p>To get started, please verify your email address:</p>
            <p style="text-align: center;">
                <a href="{{verificationLink}}" class="button">Verify Email Address</a>
            </p>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">{{verificationLink}}</p>
        </div>
        <div class="footer">
            <p>© 2024 AyurChakra. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
  }

  getEmailVerificationTemplate() {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Email Verification</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1976D2; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; background: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; }
        .footer { text-align: center; padding: 20px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 Email Verification</h1>
        </div>
        <div class="content">
            <h2>Hello {{name}}!</h2>
            <p>Please verify your email address to complete your AyurChakra account setup.</p>
            <p style="text-align: center;">
                <a href="{{verificationLink}}" class="button">Verify Email Address</a>
            </p>
            <p>This link will expire in 24 hours for security reasons.</p>
        </div>
        <div class="footer">
            <p>© 2024 AyurChakra. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
  }

  getPasswordResetTemplate() {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Password Reset</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #D32F2F; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; background: #F44336; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; }
        .footer { text-align: center; padding: 20px; color: #666; }
        .warning { background: #FFF3E0; border-left: 4px solid #FF9800; padding: 10px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔒 Password Reset</h1>
        </div>
        <div class="content">
            <h2>Hello {{name}}!</h2>
            <p>You requested a password reset for your AyurChakra account.</p>
            <p style="text-align: center;">
                <a href="{{resetLink}}" class="button">Reset Password</a>
            </p>
            <div class="warning">
                <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
            </div>
        </div>
        <div class="footer">
            <p>© 2024 AyurChakra. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
  }

  getHarvestNotificationTemplate() {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Harvest Notification</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .data-table th, .data-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .data-table th { background: #f2f2f2; }
        .button { display: inline-block; background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; }
        .footer { text-align: center; padding: 20px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌾 Harvest Notification</h1>
        </div>
        <div class="content">
            <h2>Hello {{name}}!</h2>
            <p>Your harvest data has been successfully recorded in the AyurChakra system.</p>
            <table class="data-table">
                <tr><th>Batch ID</th><td>{{harvestData.batchId}}</td></tr>
                <tr><th>Crop Type</th><td>{{harvestData.cropType}}</td></tr>
                <tr><th>Quantity</th><td>{{harvestData.quantity}} {{harvestData.unit}}</td></tr>
                <tr><th>Harvest Date</th><td>{{harvestData.harvestDate}}</td></tr>
                <tr><th>Location</th><td>{{harvestData.location}}</td></tr>
            </table>
            <p style="text-align: center;">
                <a href="{{dashboardLink}}" class="button">View Dashboard</a>
            </p>
        </div>
        <div class="footer">
            <p>© 2024 AyurChakra. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
  }

  getQualityAlertTemplate() {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Quality Alert</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #FF9800; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .alert { background: #FFEBEE; border-left: 4px solid #F44336; padding: 10px; margin: 10px 0; }
        .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .data-table th, .data-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .data-table th { background: #f2f2f2; }
        .button { display: inline-block; background: #FF9800; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; }
        .footer { text-align: center; padding: 20px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚠️ Quality Alert</h1>
        </div>
        <div class="content">
            <h2>Hello {{name}}!</h2>
            <div class="alert">
                <strong>Quality Alert:</strong> Test results require your attention.
            </div>
            <table class="data-table">
                <tr><th>Test ID</th><td>{{qualityData.testId}}</td></tr>
                <tr><th>Batch ID</th><td>{{qualityData.batchId}}</td></tr>
                <tr><th>Test Type</th><td>{{qualityData.testType}}</td></tr>
                <tr><th>Result</th><td>{{qualityData.result}}</td></tr>
                <tr><th>Status</th><td>{{qualityData.status}}</td></tr>
            </table>
            <p style="text-align: center;">
                <a href="{{dashboardLink}}" class="button">View Details</a>
            </p>
        </div>
        <div class="footer">
            <p>© 2024 AyurChakra. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
  }

  getSupplyChainUpdateTemplate() {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Supply Chain Update</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #9C27B0; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .data-table th, .data-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .data-table th { background: #f2f2f2; }
        .button { display: inline-block; background: #9C27B0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; }
        .footer { text-align: center; padding: 20px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📦 Supply Chain Update</h1>
        </div>
        <div class="content">
            <h2>Hello {{name}}!</h2>
            <p>Your supply chain has been updated with new information.</p>
            <table class="data-table">
                <tr><th>Product ID</th><td>{{supplyChainData.productId}}</td></tr>
                <tr><th>Batch ID</th><td>{{supplyChainData.batchId}}</td></tr>
                <tr><th>Current Stage</th><td>{{supplyChainData.currentStage}}</td></tr>
                <tr><th>Status</th><td>{{supplyChainData.status}}</td></tr>
                <tr><th>Last Updated</th><td>{{supplyChainData.lastUpdated}}</td></tr>
            </table>
            <p style="text-align: center;">
                <a href="{{dashboardLink}}" class="button">View Supply Chain</a>
            </p>
        </div>
        <div class="footer">
            <p>© 2024 AyurChakra. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
  }

  getComplianceAlertTemplate() {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Compliance Alert</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #F44336; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .alert { background: #FFEBEE; border-left: 4px solid #F44336; padding: 10px; margin: 10px 0; }
        .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .data-table th, .data-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .data-table th { background: #f2f2f2; }
        .button { display: inline-block; background: #F44336; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; }
        .footer { text-align: center; padding: 20px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚨 Compliance Alert</h1>
        </div>
        <div class="content">
            <h2>Hello {{name}}!</h2>
            <div class="alert">
                <strong>Compliance Alert:</strong> {{complianceData.alertType}} requires immediate attention.
            </div>
            <table class="data-table">
                <tr><th>Alert Type</th><td>{{complianceData.alertType}}</td></tr>
                <tr><th>Entity</th><td>{{complianceData.entity}}</td></tr>
                <tr><th>Severity</th><td>{{complianceData.severity}}</td></tr>
                <tr><th>Description</th><td>{{complianceData.description}}</td></tr>
                <tr><th>Due Date</th><td>{{complianceData.dueDate}}</td></tr>
            </table>
            <p style="text-align: center;">
                <a href="{{dashboardLink}}" class="button">View Compliance</a>
            </p>
        </div>
        <div class="footer">
            <p>© 2024 AyurChakra. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
  }

  getSystemNotificationTemplate() {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>System Notification</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #607D8B; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .data-table th, .data-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .data-table th { background: #f2f2f2; }
        .button { display: inline-block; background: #607D8B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; }
        .footer { text-align: center; padding: 20px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔔 System Notification</h1>
        </div>
        <div class="content">
            <h2>Hello {{name}}!</h2>
            <p>{{notificationData.message}}</p>
            <table class="data-table">
                <tr><th>Title</th><td>{{notificationData.title}}</td></tr>
                <tr><th>Type</th><td>{{notificationData.type}}</td></tr>
                <tr><th>Priority</th><td>{{notificationData.priority}}</td></tr>
                <tr><th>Date</th><td>{{notificationData.date}}</td></tr>
            </table>
            <p style="text-align: center;">
                <a href="{{dashboardLink}}" class="button">View Dashboard</a>
            </p>
        </div>
        <div class="footer">
            <p>© 2024 AyurChakra. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
  }

  // Utility methods
  async testConnection() {
    if (!this.isConfigured) {
      throw new Error('Email service is not configured');
    }

    try {
      await this.transporter.verify();
      return { success: true, message: 'Email service connection successful' };
    } catch (error) {
      throw new Error(`Email service connection failed: ${error.message}`);
    }
  }

  getStatus() {
    return {
      configured: this.isConfigured,
      templatesLoaded: this.templates.size,
      config: this.isConfigured ? this.getEmailConfig() : null
    };
  }
}

export { EmailService };
