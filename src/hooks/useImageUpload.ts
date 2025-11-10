import * as ImagePicker from 'expo-image-picker';
import { storage, ID, BUCKET_ID, APPWRITE_URL_CONSTANTS } from '@/src/config/appwrite';
import { useState } from 'react';

export interface ImageAsset {
  uri: string;
  fileName: string;
  mimeType: string;
  fileSize?: number;  // Optional, but include for accuracy
}

export const useImageUpload = (bucketId: string = BUCKET_ID) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const pickImage = async (): Promise<ImageAsset | null> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access photos is required!');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]) return null;

    const a = result.assets[0];
    return {
      uri: a.uri,
      fileName: a.fileName ?? `image-${Date.now()}.jpg`,
      mimeType: a.mimeType ?? 'image/jpeg',
      fileSize: a.fileSize,  // Use actual size if available
    };
  };

  const uploadImage = async (asset: ImageAsset): Promise<{ id: string; url: string } | null> => {
    setUploading(true);
    setProgress(0);

    try {
        const fileObject = {
        name: asset.fileName,
        type: asset.mimeType,
        size: asset.fileSize ?? 0,
        uri: asset.uri,
        };

        console.log('Uploading file object:', fileObject);

        setProgress(30);
        const fileId = ID.unique();

        const file = await storage.createFile(
        bucketId,
        fileId,
        fileObject,
        ['read("any")'], // Public read
        (progressEvent: any) => { 
            if (progressEvent.sizeTotal > 0) { 
                const pct = Math.round((progressEvent.sizeUploaded * 100) / progressEvent.sizeTotal);
                setProgress(30 + pct * 0.7);
            } else if (progressEvent.total > 0) { // Fallback to 'total' if available in a nested object
                const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgress(30 + pct * 0.7);
            }
        }
        );

        setProgress(80);

        // public image url        
        const url = `${APPWRITE_URL_CONSTANTS.endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${APPWRITE_URL_CONSTANTS.projectId}`;

        console.log("download", url)

        setProgress(100);

        console.log('Upload success:', { id: file.$id, url }); // Now logs real URL
        return { id: file.$id, url };
    } catch (err: any) {
        console.error('Upload error:', err);
        alert(`Upload failed: ${err.message ?? 'Unknown error'}`);
        return null;
    } finally {
        setUploading(false);
        setProgress(0);
    }
  };

  return { pickImage, uploadImage, uploading, progress };
};