import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
, TextStyle} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {colors} from '../theme/designSystem';
import {Icon} from './Icon';

interface PhotoUploaderProps {
  photos: string[];, onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({photos: any,    onPhotosChange: any,    maxPhotos = 5: any,    : any}) => {
  const [uploading, setUploading] = useState(false);

  

const handleAddPhoto = async () => {
    if (photos.length >= maxPhotos) {
      Alert.alert(
        'Maximum Photos Reached',
        `You can only upload up to ${maxPhotos} photos.`,
      );
      return;
    }

    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1200,
        maxHeight: 1200,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert('Error', 'Failed to select photo');
        return;
      }

      if (result.assets && result.assets[0]?.uri) {
        setUploading(true);
        // In a real app, you would upload the photo to your server here
        // For now, we'll just add the local URI to the photos array
        onPhotosChange([...photos, result.assets[0].uri]);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to select photo');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    Alert.alert('Remove Photo', 'Are you sure you want to remove this photo?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          const newPhotos = [...photos];
          newPhotos.splice(index, 1);
          onPhotosChange(newPhotos);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {photos.map((photo, index) => (
          <View key={index} style={styles.photoContainer}>
            <Image source={{uri: photo}} style={styles.photo} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemovePhoto(index)}>
              <Icon name="close" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        ))}
        {photos.length < maxPhotos && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddPhoto}
            disabled={uploading}>
            {uploading ? (
              <ActivityIndicator color={colors.primary.main} />
            ) : (
              <>
                <Icon name="add" size={24} color={colors.primary.main} />
                <Text style={styles.addButtonText}></Text>Add Photo</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  photoContainer: {
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.error.main,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.primary.main,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.primary.main,
    fontWeight: 'bold',
  },
});
