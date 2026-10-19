import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function ensureCloudinaryConfig() {
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
    return true;
  }
  return false;
}

export const mediaService = {
  isCloudinaryConfigured: () => {
    return ensureCloudinaryConfig();
  },

  checkHealth: async () => {
    if (mediaService.isCloudinaryConfigured()) {
      try {
        const start = Date.now();
        const res = await cloudinary.api.ping();
        const latencyMs = Date.now() - start;
        return {
          status: res.status === 'ok' ? 'healthy' : 'degraded',
          provider: 'cloudinary',
          connected: true,
          cloudName: process.env.CLOUDINARY_CLOUD_NAME,
          latencyMs,
          rateLimitRemaining: res.rate_limit_remaining
        };
      } catch (err) {
        return {
          status: 'degraded',
          provider: 'cloudinary',
          connected: false,
          error: err.message
        };
      }
    }
    return {
      status: 'healthy',
      provider: 'local-disk',
      connected: true,
      directory: 'client/public/uploads'
    };
  },

  uploadImage: async (fileBuffer, originalName, mimeType, folder = 'chandrakanta') => {
    if (mediaService.isCloudinaryConfigured()) {
      try {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder,
              resource_type: 'image'
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(fileBuffer);
        });

        return {
          url: result.secure_url || result.url,
          publicId: result.public_id,
          provider: 'cloudinary',
          bytes: result.bytes || fileBuffer.length
        };
      } catch (cloudErr) {
        console.warn('⚠️ Cloudinary upload failed, falling back to local disk:', cloudErr.message);
      }
    }

    // Fallback to local public uploads
    const uploadsDir = path.join(__dirname, '..', '..', 'client', 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = path.extname(originalName) || '.jpg';
    const filename = `${folder}_${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    await fs.promises.writeFile(filePath, fileBuffer);

    return {
      url: `/uploads/${filename}`,
      publicId: filename,
      provider: 'local-disk',
      bytes: fileBuffer.length
    };
  },

  deleteImage: async (publicId) => {
    if (mediaService.isCloudinaryConfigured() && !publicId.includes('.jpg') && !publicId.includes('.png')) {
      try {
        const res = await cloudinary.uploader.destroy(publicId);
        return { deleted: res.result === 'ok', provider: 'cloudinary' };
      } catch (err) {
        console.warn('⚠️ Cloudinary delete error:', err.message);
      }
    }

    const uploadsDir = path.join(__dirname, '..', '..', 'client', 'public', 'uploads');
    const filePath = path.join(uploadsDir, publicId);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return { deleted: true, provider: 'local-disk' };
    }
    return { deleted: false, reason: 'File not found' };
  }
};

