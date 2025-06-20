import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import connect from '@/lib/mongodb';

export async function POST(request: Request) {
  await connect();
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }
    
    // Generate unique filename
    const extension = mime.extension(file.type) || '';
    const filename = `${uuidv4()}.${extension}`;
    
    // In production, you'd want to use a cloud storage service like AWS S3, Cloudinary, or Firebase Storage
    // For development, we'll save to the public/uploads directory
    const uploadDir = join(process.cwd(), 'public/uploads');
    const filePath = join(uploadDir, filename);
    
    // Convert file to buffer and write to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // In a real app, you'd want to ensure the upload directory exists
    // and handle file storage appropriately for your deployment environment
    await writeFile(filePath, buffer);
    
    // Return the public URL
    const publicUrl = `/uploads/${filename}`;
    
    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: file.name,
      size: file.size,
      mimeType: file.type,
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// Add this to ensure the directory exists
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const ensureUploadDir = async () => {
  const uploadDir = join(process.cwd(), 'public/uploads');
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }
};

// Call this when the module loads
ensureUploadDir().catch(console.error);
