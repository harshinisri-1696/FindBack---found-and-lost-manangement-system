import { supabase, isSupabaseConfigured } from './supabase';

const BUCKET_NAME = 'item-images';

export interface StorageUploadResult {
  success: boolean;
  publicUrl: string;
  error?: string;
}

/**
 * Upload an item photo to Supabase Storage (bucket: item-images)
 * Falls back to local base64/dataURL if Supabase is not yet configured.
 */
export async function uploadItemImage(file: File): Promise<StorageUploadResult> {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    return {
      success: false,
      publicUrl: '',
      error: 'Please select a valid image file (JPG, PNG, WebP)'
    };
  }

  // Validate size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return {
      success: false,
      publicUrl: '',
      error: 'Image file size exceeds the 5MB limit'
    };
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `reports/${Date.now()}_${sanitizedName}`;

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.warn('Supabase Storage upload error, falling back to data URL:', error);
      } else if (data) {
        const { data: publicUrlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(data.path);

        return {
          success: true,
          publicUrl: publicUrlData.publicUrl
        };
      }
    } catch (err: any) {
      console.warn('Supabase storage upload exception:', err);
    }
  }

  // Local Data URL fallback
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        success: true,
        publicUrl: reader.result as string
      });
    };
    reader.onerror = () => {
      resolve({
        success: false,
        publicUrl: '',
        error: 'Failed to read image file'
      });
    };
    reader.readAsDataURL(file);
  });
}
