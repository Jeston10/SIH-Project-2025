import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import path from 'path';

/**
 * Upload Service for AyurChakra Backend
 * Handles file uploads to Cloudinary with image processing and optimization
 */
class UploadService {
  constructor() {
    this.cloudinary = cloudinary;
    this.isConfigured = false;
    this.uploader = null;
    this.initialize();
  }

  async initialize() {
    try {
      // Check if Cloudinary configuration is available
      const config = this.getCloudinaryConfig();
      
      if (!config.cloudName || !config.apiKey || !config.apiSecret) {
        console.warn('⚠️ Cloudinary service disabled - missing configuration');
        return;
      }

      // Configure Cloudinary
      this.cloudinary.config({
        cloud_name: config.cloudName,
        api_key: config.apiKey,
        api_secret: config.apiSecret,
        secure: true
      });

      // Test connection
      await this.cloudinary.api.ping();
      this.isConfigured = true;
      
      console.log('✅ Cloudinary service initialized successfully');
      
      // Setup multer with Cloudinary storage
      this.setupMulter();
      
    } catch (error) {
      console.error('❌ Cloudinary service initialization failed:', error.message);
      this.isConfigured = false;
    }
  }

  getCloudinaryConfig() {
    return {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
      folder: process.env.CLOUDINARY_FOLDER || 'ayurchakra'
    };
  }

  setupMulter() {
    if (!this.isConfigured) return;

    const config = this.getCloudinaryConfig();
    
    // Cloudinary storage configuration
    const storage = new CloudinaryStorage({
      cloudinary: this.cloudinary,
      params: {
        folder: config.folder,
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'],
        transformation: [
          { width: 1200, height: 1200, crop: 'limit', quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      }
    });

    // Multer configuration
    this.uploader = multer({
      storage: storage,
      limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
        files: 5 // Maximum 5 files per request
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp,application/pdf').split(',');
        
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error(`File type ${file.mimetype} is not allowed`), false);
        }
      }
    });

    console.log('✅ Multer with Cloudinary storage configured');
  }

  // Upload single file
  async uploadSingle(file, options = {}) {
    if (!this.isConfigured) {
      throw new Error('Cloudinary service is not configured');
    }

    try {
      const config = this.getCloudinaryConfig();
      const uploadOptions = {
        folder: options.folder || config.folder,
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
        ...options
      };

      const result = await this.cloudinary.uploader.upload(file.path, uploadOptions);
      
      console.log(`☁️ File uploaded successfully: ${result.public_id}`);
      return {
        success: true,
        data: {
          public_id: result.public_id,
          secure_url: result.secure_url,
          url: result.url,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
          created_at: result.created_at
        }
      };
    } catch (error) {
      console.error('❌ File upload failed:', error.message);
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  // Upload multiple files
  async uploadMultiple(files, options = {}) {
    if (!this.isConfigured) {
      throw new Error('Cloudinary service is not configured');
    }

    try {
      const uploadPromises = files.map(file => this.uploadSingle(file, options));
      const results = await Promise.all(uploadPromises);
      
      return {
        success: true,
        data: results.map(result => result.data)
      };
    } catch (error) {
      console.error('❌ Multiple file upload failed:', error.message);
      throw new Error(`Multiple file upload failed: ${error.message}`);
    }
  }

  // Upload from URL
  async uploadFromUrl(url, options = {}) {
    if (!this.isConfigured) {
      throw new Error('Cloudinary service is not configured');
    }

    try {
      const config = this.getCloudinaryConfig();
      const uploadOptions = {
        folder: options.folder || config.folder,
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
        ...options
      };

      const result = await this.cloudinary.uploader.upload(url, uploadOptions);
      
      console.log(`☁️ URL uploaded successfully: ${result.public_id}`);
      return {
        success: true,
        data: {
          public_id: result.public_id,
          secure_url: result.secure_url,
          url: result.url,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
          created_at: result.created_at
        }
      };
    } catch (error) {
      console.error('❌ URL upload failed:', error.message);
      throw new Error(`URL upload failed: ${error.message}`);
    }
  }

  // Delete file
  async deleteFile(publicId) {
    if (!this.isConfigured) {
      throw new Error('Cloudinary service is not configured');
    }

    try {
      const result = await this.cloudinary.uploader.destroy(publicId);
      
      if (result.result === 'ok') {
        console.log(`☁️ File deleted successfully: ${publicId}`);
        return {
          success: true,
          message: 'File deleted successfully'
        };
      } else {
        throw new Error('Failed to delete file');
      }
    } catch (error) {
      console.error('❌ File deletion failed:', error.message);
      throw new Error(`File deletion failed: ${error.message}`);
    }
  }

  // Generate image transformations
  generateImageUrl(publicId, transformations = {}) {
    if (!this.isConfigured) {
      throw new Error('Cloudinary service is not configured');
    }

    try {
      const defaultTransformations = {
        quality: 'auto',
        fetch_format: 'auto',
        ...transformations
      };

      const url = this.cloudinary.url(publicId, defaultTransformations);
      return url;
    } catch (error) {
      console.error('❌ Image URL generation failed:', error.message);
      throw new Error(`Image URL generation failed: ${error.message}`);
    }
  }

  // Get file information
  async getFileInfo(publicId) {
    if (!this.isConfigured) {
      throw new Error('Cloudinary service is not configured');
    }

    try {
      const result = await this.cloudinary.api.resource(publicId);
      
      return {
        success: true,
        data: {
          public_id: result.public_id,
          secure_url: result.secure_url,
          url: result.url,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
          created_at: result.created_at,
          tags: result.tags,
          context: result.context
        }
      };
    } catch (error) {
      console.error('❌ File info retrieval failed:', error.message);
      throw new Error(`File info retrieval failed: ${error.message}`);
    }
  }

  // List files in folder
  async listFiles(folder = null, options = {}) {
    if (!this.isConfigured) {
      throw new Error('Cloudinary service is not configured');
    }

    try {
      const config = this.getCloudinaryConfig();
      const listOptions = {
        type: 'upload',
        prefix: folder || config.folder,
        max_results: options.limit || 50,
        ...options
      };

      const result = await this.cloudinary.api.resources(listOptions);
      
      return {
        success: true,
        data: {
          resources: result.resources.map(resource => ({
            public_id: resource.public_id,
            secure_url: resource.secure_url,
            url: resource.url,
            format: resource.format,
            width: resource.width,
            height: resource.height,
            bytes: resource.bytes,
            created_at: resource.created_at
          })),
          total_count: result.total_count,
          next_cursor: result.next_cursor
        }
      };
    } catch (error) {
      console.error('❌ File listing failed:', error.message);
      throw new Error(`File listing failed: ${error.message}`);
    }
  }

  // Create image transformations for different use cases
  getTransformationPresets() {
    return {
      thumbnail: { width: 150, height: 150, crop: 'fill', quality: 'auto' },
      small: { width: 300, height: 300, crop: 'limit', quality: 'auto' },
      medium: { width: 600, height: 600, crop: 'limit', quality: 'auto' },
      large: { width: 1200, height: 1200, crop: 'limit', quality: 'auto' },
      profile: { width: 200, height: 200, crop: 'fill', gravity: 'face', quality: 'auto' },
      harvest: { width: 800, height: 600, crop: 'fill', quality: 'auto' },
      quality: { width: 1000, height: 800, crop: 'limit', quality: 'auto' },
      document: { width: 800, height: 1000, crop: 'limit', quality: 'auto' }
    };
  }

  // Get multer middleware
  getMulterMiddleware() {
    if (!this.uploader) {
      throw new Error('Multer is not configured');
    }
    return this.uploader;
  }

  // Single file upload middleware
  single(fieldName) {
    return this.uploader.single(fieldName);
  }

  // Multiple files upload middleware
  array(fieldName, maxCount = 5) {
    return this.uploader.array(fieldName, maxCount);
  }

  // Multiple fields upload middleware
  fields(fields) {
    return this.uploader.fields(fields);
  }

  // Test connection
  async testConnection() {
    if (!this.isConfigured) {
      throw new Error('Cloudinary service is not configured');
    }

    try {
      await this.cloudinary.api.ping();
      return { success: true, message: 'Cloudinary connection successful' };
    } catch (error) {
      throw new Error(`Cloudinary connection failed: ${error.message}`);
    }
  }

  // Get service status
  getStatus() {
    return {
      configured: this.isConfigured,
      config: this.isConfigured ? this.getCloudinaryConfig() : null,
      presets: this.getTransformationPresets()
    };
  }
}

export { UploadService };
