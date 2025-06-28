import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(request: Request) {
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
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Upload to Cloudinary
    const publicUrl = await uploadImage(buffer);
    
    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: file.name,
      size: file.size,
      mimeType: file.type,
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
