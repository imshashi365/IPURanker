import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Button } from './button';
import { Loader2, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  disabled?: boolean;
  className?: string;
  maxSizeMB?: number;
  accept?: string;
  label?: string;
  aspectRatio?: 'square' | 'video' | 'custom';
}

export const ImageUpload = ({
  value,
  onChange,
  onRemove,
  disabled = false,
  className = '',
  maxSizeMB = 5,
  accept = 'image/*',
  label = 'Upload an image',
  aspectRatio = 'square',
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(
    async (file: File) => {
      if (disabled) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File size must be less than ${maxSizeMB}MB`);
        return;
      }

      setError(null);
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to upload image');
        }


        const { url } = await response.json();
        onChange(url);
      } catch (err) {
        console.error('Error uploading image:', err);
        setError(err instanceof Error ? err.message : 'Failed to upload image');
      } finally {
        setIsUploading(false);
      }
    },
    [disabled, maxSizeMB, onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setDragActive(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    custom: '',
  };

  return (
    <div className={cn('w-full', className)}>
      {value ? (
        <div className="relative group">
          <div className={cn(
            'relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700',
            aspectRatioClasses[aspectRatio]
          )}>
            <Image
              src={value}
              alt="Uploaded preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  onRemove();
                }}
                disabled={disabled || isUploading}
                className="opacity-90 hover:opacity-100"
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 dark:border-gray-600',
            disabled && 'opacity-60 cursor-not-allowed',
            aspectRatioClasses[aspectRatio],
            'flex flex-col items-center justify-center space-y-2',
            'relative overflow-hidden'
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-2">
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-sm text-center">
                <p className="font-medium text-foreground">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept={accept}
                      disabled={disabled || isUploading}
                    />
                  </label>{' '}
                  or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {accept.includes('*') ? 'Any image format' : accept}
                  {maxSizeMB ? ` up to ${maxSizeMB}MB` : ''}
                </p>
              </div>
            </>
          )}
        </div>
      )}
      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};

export default ImageUpload;
