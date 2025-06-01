/**
 * Photo Service
 * Handles photo capture, storage, and management
 */

import { Platform } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import { v4 as uuidv4 } from 'uuid';

export interface PhotoOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  includeBase64?: boolean;
}

export interface Photo {
  id: string;
  uri: string;
  fileName: string;
  type: string;
  size: number;
  width: number;
  height: number;
  timestamp: number;
  base64?: string;
}

const defaultOptions: PhotoOptions = {
  quality: 0.8,
  maxWidth: 1280,
  maxHeight: 720,
  includeBase64: false
};

class PhotoService {
  private photoDir: string;
  
  constructor() {
    // Set up photo directory based on platform
    this.photoDir = Platform.OS === 'ios' 
      ? `${RNFS.DocumentDirectoryPath}/photos`
      : `${RNFS.ExternalDirectoryPath}/photos`;
    
    // Ensure photo directory exists
    this.ensurePhotoDir();
  }
  
  /**
   * Ensure the photo directory exists
   */
  private async ensurePhotoDir(): Promise<void> {
    try {
      const exists = await RNFS.exists(this.photoDir);
      if (!exists) {
        await RNFS.mkdir(this.photoDir);
      }
    } catch (error) {
      console.error('Error creating photo directory:', error);
    }
  }
  
  /**
   * Take a photo using the device camera
   * @param options Photo options
   * @returns Promise resolving to a Photo object
   */
  public async takePhoto(options: PhotoOptions = {}): Promise<Photo> {
    const mergedOptions = { ...defaultOptions, ...options };
    
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: mergedOptions.quality,
        maxWidth: mergedOptions.maxWidth,
        maxHeight: mergedOptions.maxHeight,
        includeBase64: mergedOptions.includeBase64
      });
      
      if (result.didCancel) {
        throw new Error('User cancelled photo capture');
      }
      
      if (result.errorCode) {
        throw new Error(`Photo capture error: ${result.errorMessage}`);
      }
      
      if (!result.assets || result.assets.length === 0) {
        throw new Error('No photo captured');
      }
      
      const asset = result.assets[0];
      
      return {
        id: uuidv4(),
        uri: asset.uri || '',
        fileName: asset.fileName || `photo_${Date.now()}.jpg`,
        type: asset.type || 'image/jpeg',
        size: asset.fileSize || 0,
        width: asset.width || 0,
        height: asset.height || 0,
        timestamp: Date.now(),
        base64: asset.base64
      };
    } catch (error) {
      console.error('Error taking photo:', error);
      throw error;
    }
  }
  
  /**
   * Select a photo from the device gallery
   * @param options Photo options
   * @returns Promise resolving to a Photo object
   */
  public async selectPhoto(options: PhotoOptions = {}): Promise<Photo> {
    const mergedOptions = { ...defaultOptions, ...options };
    
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: mergedOptions.quality,
        maxWidth: mergedOptions.maxWidth,
        maxHeight: mergedOptions.maxHeight,
        includeBase64: mergedOptions.includeBase64
      });
      
      if (result.didCancel) {
        throw new Error('User cancelled photo selection');
      }
      
      if (result.errorCode) {
        throw new Error(`Photo selection error: ${result.errorMessage}`);
      }
      
      if (!result.assets || result.assets.length === 0) {
        throw new Error('No photo selected');
      }
      
      const asset = result.assets[0];
      
      return {
        id: uuidv4(),
        uri: asset.uri || '',
        fileName: asset.fileName || `photo_${Date.now()}.jpg`,
        type: asset.type || 'image/jpeg',
        size: asset.fileSize || 0,
        width: asset.width || 0,
        height: asset.height || 0,
        timestamp: Date.now(),
        base64: asset.base64
      };
    } catch (error) {
      console.error('Error selecting photo:', error);
      throw error;
    }
  }
  
  /**
   * Save a photo to the device storage
   * @param photo Photo object to save
   * @returns Promise resolving to the saved photo path
   */
  public async savePhoto(photo: Photo): Promise<string> {
    try {
      const fileName = photo.fileName || `photo_${Date.now()}.jpg`;
      const filePath = `${this.photoDir}/${fileName}`;
      
      if (photo.base64) {
        await RNFS.writeFile(filePath, photo.base64, 'base64');
      } else {
        await RNFS.copyFile(photo.uri, filePath);
      }
      
      return filePath;
    } catch (error) {
      console.error('Error saving photo:', error);
      throw error;
    }
  }
  
  /**
   * Delete a photo from the device storage
   * @param photoUri URI of the photo to delete
   * @returns Promise resolving when the photo is deleted
   */
  public async deletePhoto(photoUri: string): Promise<void> {
    try {
      if (await RNFS.exists(photoUri)) {
        await RNFS.unlink(photoUri);
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      throw error;
    }
  }
}

export default new PhotoService();