import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
  Image,
} from 'react-native';
import {saveFinding} from '../utils/storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const SEVERITY_OPTIONS = [
  {label: 'Low', value: 'low', color: '#34C759'},
  {label: 'Medium', value: 'medium', color: '#FFA500'},
  {label: 'High', value: 'high', color: '#FF3B30'},
  {label: 'Critical', value: 'critical', color: '#FF3B30'},
];

const CATEGORY_OPTIONS = [
  {label: 'Safety', value: 'safety'},
  {label: 'Quality', value: 'quality'},
  {label: 'Compliance', value: 'compliance'},
  {label: 'Environmental', value: 'environmental'},
  {label: 'Other', value: 'other'},
];

const AddFindingScreen = ({route, navigation}) => {
  const {auditId} = route.params;
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    severity: 'medium',
    category: '',
    recommendation: '',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 1 week from now
    location: null,
    photos: [],
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [locationLoading, setLocationLoading] = React.useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.recommendation.trim()) {
      newErrors.recommendation = 'Recommendation is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const finding = {
        id: Date.now().toString(),
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        recommendation: formData.recommendation.trim(),
        date: new Date().toISOString(),
      };

      await saveFinding(auditId, finding);
      Alert.alert('Success', 'Finding added successfully', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      console.error('Error saving finding:', error);
      Alert.alert('Error', 'Failed to save finding');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({...prev, dueDate: selectedDate}));
    }
  };

  const handlePhotoPick = async () => {
    try {
      const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please grant camera roll permissions to add photos',
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, result.assets[0].uri],
        }));
      }
    } catch (error) {
      console.error('Error picking photo:', error);
      Alert.alert('Error', 'Failed to pick photo');
    }
  };

  const handleLocationPick = async () => {
    try {
      setLocationLoading(true);
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please grant location permissions to add location',
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setFormData(prev => ({
        ...prev,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      }));
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get location');
    } finally {
      setLocationLoading(false);
    }
  };

  const renderOptionButton = (options, field, label) => (
    <View style={styles.optionGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.optionsContainer}>
        {options.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              formData[field] === option.value && styles.optionButtonSelected,
              field === 'severity' && {borderColor: option.color},
              formData[field] === option.value &&
                field === 'severity' && {backgroundColor: option.color},
            ]}
            onPress={() =>
              setFormData(prev => ({...prev, [field]: option.value}))
            }
            disabled={loading}>
            <Text
              style={[
                styles.optionButtonText,
                formData[field] === option.value &&
                  styles.optionButtonTextSelected,
              ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Add Finding</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.goBack()}
              disabled={loading}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              value={formData.title}
              onChangeText={text => {
                setFormData(prev => ({...prev, title: text}));
                if (errors.title) {
                  setErrors(prev => ({...prev, title: null}));
                }
              }}
              placeholder="Enter finding title"
              placeholderTextColor="#999"
              editable={!loading}
            />
            {errors.title && (
              <Text style={styles.errorText}>{errors.title}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.description && styles.inputError,
              ]}
              value={formData.description}
              onChangeText={text => {
                setFormData(prev => ({...prev, description: text}));
                if (errors.description) {
                  setErrors(prev => ({...prev, description: null}));
                }
              }}
              placeholder="Enter finding description"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!loading}
            />
            {errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
          </View>

          {renderOptionButton(SEVERITY_OPTIONS, 'severity', 'Severity')}
          {renderOptionButton(CATEGORY_OPTIONS, 'category', 'Category *')}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recommendation *</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.recommendation && styles.inputError,
              ]}
              value={formData.recommendation}
              onChangeText={text => {
                setFormData(prev => ({...prev, recommendation: text}));
                if (errors.recommendation) {
                  setErrors(prev => ({...prev, recommendation: null}));
                }
              }}
              placeholder="Enter recommendation"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!loading}
            />
            {errors.recommendation && (
              <Text style={styles.errorText}>{errors.recommendation}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Due Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
              disabled={loading}>
              <Icon name="event" size={20} color="#666" />
              <Text style={styles.dateButtonText}>
                {formData.dueDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.dueDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TouchableOpacity
              style={styles.locationButton}
              onPress={handleLocationPick}
              disabled={loading || locationLoading}>
              <Icon name="location-on" size={20} color="#666" />
              <Text style={styles.locationButtonText}>
                {formData.location
                  ? `${formData.location.latitude.toFixed(
                      4,
                    )}, ${formData.location.longitude.toFixed(4)}`
                  : 'Add Location'}
              </Text>
              {locationLoading && (
                <ActivityIndicator size="small" color="#666" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Photos</Text>
            <View style={styles.photosContainer}>
              {formData.photos.map((uri, index) => (
                <View key={index} style={styles.photoContainer}>
                  <Image source={{uri}} style={styles.photo} />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => {
                      setFormData(prev => ({
                        ...prev,
                        photos: prev.photos.filter((_, i) => i !== index),
                      }));
                    }}>
                    <Icon name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
              {formData.photos.length < 5 && (
                <TouchableOpacity
                  style={styles.addPhotoButton}
                  onPress={handlePhotoPick}
                  disabled={loading}>
                  <Icon name="add-a-photo" size={24} color="#666" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Add Finding</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  textArea: {
    height: 120,
  },
  optionGroup: {
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
  },
  optionButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#666',
  },
  optionButtonTextSelected: {
    color: '#fff',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  dateButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  locationButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  photoContainer: {
    width: 100,
    height: 100,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    margin: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddFindingScreen;
