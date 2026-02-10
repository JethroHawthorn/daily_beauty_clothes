'use server';

import { uploadFileToDrive } from '@/lib/google-drive';

export async function uploadImages(formData: FormData) {
  const files = formData.getAll('files') as File[];
  
  if (!files || files.length === 0) {
    return { success: false, error: 'No files provided' };
  }

  const uploadedUrls: string[] = [];
  const errors: string[] = [];

  for (const file of files) {
    // Basic validation
    if (!file.type.startsWith('image/')) {
        errors.push(`File ${file.name} is not an image.`);
        continue;
    }

    try {
      const result = await uploadFileToDrive(file);
      // Return the webViewLink for viewing, or the direct download link if preferred.
      // The result object has: id, url (direct), name, webViewLink
      if (result.webViewLink) {
        uploadedUrls.push(result.webViewLink);
      } else {
        uploadedUrls.push(result.url); 
      } 
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error);
      errors.push(`Failed to upload ${file.name}`);
    }
  }

  if (uploadedUrls.length === 0 && errors.length > 0) {
      return { success: false, error: errors.join(', ') };
  }

  return { 
      success: true, 
      urls: uploadedUrls,
      errors: errors.length > 0 ? errors : undefined 
  };
}
