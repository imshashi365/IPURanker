import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function uploadImage(file: Buffer | File, folder = 'blog-posts'): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      let fileBuffer: Buffer;
      
      // Handle both Buffer and File objects
      if (file instanceof Buffer) {
        fileBuffer = file;
      } else if (file instanceof File) {
        // Convert File to ArrayBuffer then to Buffer
        const arrayBuffer = await file.arrayBuffer();
        fileBuffer = Buffer.from(arrayBuffer);
      } else {
        throw new Error('Unsupported file type. Expected Buffer or File.');
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          filename_override: file instanceof File ? file.name : undefined,
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(error);
          }
          if (!result?.secure_url) {
            return reject(new Error('Failed to get secure URL from Cloudinary'));
          }
          resolve(result.secure_url);
        }
      );

      uploadStream.end(fileBuffer);
    } catch (error) {
      console.error('Error processing file for upload:', error);
      reject(error);
    }
  });
}

export async function deleteImage(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
}

// Helper to extract public ID from Cloudinary URL
export function getPublicIdFromUrl(url: string): string | null {
  const matches = url.match(/upload\/(?:v\d+\/)?([^/]+)/);
  return matches ? matches[1].split('.')[0] : null;
}
