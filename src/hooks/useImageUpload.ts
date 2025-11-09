// src/hooks/useImageUpload.ts
import * as ImagePicker from 'expo-image-picker';
import { storage, ID } from '@/src/config/appwrite';
import { useState } from 'react';

interface UploadResult {
  id: string;
  url: string;
  name: string;
}

export const useImageUpload = (bucketId: string = 'images') => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const pickAndUpload = async (): Promise<UploadResult | null> => {
    try {
      setUploading(true);
      setProgress(0);

      // 1. Request permissions and pick image
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return null;
      }

      // 2. Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.[0]) {
        return null;
      }

      const asset = result.assets[0];
      const uri = asset.uri;
      const fileName = asset.fileName || `image-${Date.now()}.jpg`;
      const mimeType = asset.mimeType || 'image/jpeg';

      setProgress(20); // Start progress

      // 3. Convert URI to blob
      const response = await fetch(uri);
      const blob = await response.blob();

      setProgress(50); // Fetch complete

      // 4. Upload to Appwrite
      const file = await storage.createFile(
        bucketId,
        ID.unique(),
        blob as any
      );

      setProgress(90); // Upload complete

      // 5. Get public URL
      const fileView = storage.getFileView(bucketId, file.$id);
      const fileUrl = fileView.toString();

      setProgress(100);

      return {
        id: file.$id,
        url: fileUrl,
        name: fileName,
      };
    } catch (error: any) {
      console.error('Upload failed:', error.message);
      throw new Error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const deleteFile = async (fileId: string): Promise<boolean> => {
    try {
      await storage.deleteFile(bucketId, fileId);
      return true;
    } catch (error: any) {
      console.error('Delete failed:', error.message);
      return false;
    }
  };

  return {
    pickAndUpload,
    deleteFile,
    uploading,
    progress,
  };
};