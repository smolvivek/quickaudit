import { launchCamera, launchImageLibrary, ImagePickerOptions } from 'react-native-image-picker';
import { Platform, PermissionsAndroid } from 'react-native';

class PhotoService {
  private async requestCameraPermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'QuickAudit needs access to your camera to take photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  }

  async takePhoto(): Promise<string | null> {
    const hasPermission = await this.requestCameraPermission();
    if (!hasPermission) {
      throw new Error('Camera permission not granted');
    }

    const options: ImagePickerOptions = {
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: true,
    };

    try {
      const result = await launchCamera(options);
      if (result.didCancel) {
        return null;
      }
      if (result.errorCode) {
        throw new Error(result.errorMessage);
      }
      return result.assets?.[0]?.uri || null;
    } catch (error) {
      console.error('Error taking photo:', error);
      throw error;
    }
  }

  async pickFromGallery(): Promise<string | null> {
    const options: ImagePickerOptions = {
      mediaType: 'photo',
      quality: 0.8,
    };

    try {
      const result = await launchImageLibrary(options);
      if (result.didCancel) {
        return null;
      }
      if (result.errorCode) {
        throw new Error(result.errorMessage);
      }
      return result.assets?.[0]?.uri || null;
    } catch (error) {
      console.error('Error picking photo:', error);
      throw error;
    }
  }
}

export const photoService = new PhotoService(); 