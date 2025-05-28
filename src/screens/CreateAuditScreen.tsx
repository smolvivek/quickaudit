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
  TextStyle,
  ViewStyle,
} from 'react-native';
import { useAudits } from '../hooks/useAudits';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../navigation/types';
import { auditApi } from '../services/api';
import { Audit } from '../types/audit';

interface Template {
  id: string;
  title: string;
  description?: string;
}

interface FormData {
  title: string;
  description: string;
  location: string;
  template: Template | null;
  startDate: Date;
}

interface FormErrors {
  title?: string;
  location?: string;
  template?: string;
}

type CreateAuditScreenNavigationProp = StackNavigationProp<MainStackParamList, 'CreateAudit'>;

interface Props {
  navigation: CreateAuditScreenNavigationProp;
}

const CreateAuditScreen: React.FC<Props> = ({ navigation }) => {
  const { refresh } = useAudits();
  const [formData, setFormData] = React.useState<FormData>({
    title: '',
    description: '',
    location: '',
    template: null,
    startDate: new Date(),
  });
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [loading, setLoading] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.template) {
      newErrors.template = 'Template is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const auditData: Omit<Audit, 'id' | 'createdAt'> = {
        title: formData.title.trim(),
        location: formData.location.trim(),
        status: 'draft',
        findings: [],
        template: formData.template?.id,
      };

      await auditApi.create(auditData);
      await refresh();

      Alert.alert(
        'Success',
        'Audit created successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error creating audit:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create audit');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date): void => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, startDate: selectedDate }));
    }
  };

  const handleTemplateSelect = (): void => {
    // Navigate to template selection screen
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Create Audit</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={[styles.input, errors.title ? styles.inputError : null]}
              value={formData.title}
              onChangeText={text => {
                setFormData(prev => ({ ...prev, title: text }));
                if (errors.title) {
                  setErrors(prev => ({ ...prev, title: undefined }));
                }
              }}
              placeholder="Enter audit title"
              placeholderTextColor="#999"
              editable={!loading}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={text => setFormData(prev => ({ ...prev, description: text }))}
              placeholder="Enter audit description"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={[styles.input, errors.location ? styles.inputError : null]}
              value={formData.location}
              onChangeText={text => {
                setFormData(prev => ({ ...prev, location: text }));
                if (errors.location) {
                  setErrors(prev => ({ ...prev, location: undefined }));
                }
              }}
              placeholder="Enter audit location"
              placeholderTextColor="#999"
              editable={!loading}
            />
            {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Template *</Text>
            <TouchableOpacity
              style={[styles.templateButton, errors.template ? styles.inputError : null]}
              onPress={handleTemplateSelect}
              disabled={loading}
            >
              <Text style={styles.templateButtonText}>
                {formData.template ? formData.template.title : 'Select Template'}
              </Text>
              <Icon name="chevron-right" size={24} color="#666" />
            </TouchableOpacity>
            {errors.template && <Text style={styles.errorText}>{errors.template}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
              disabled={loading}
            >
              <Icon name="event" size={20} color="#666" />
              <Text style={styles.dateButtonText}>
                {formData.startDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.startDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading ? styles.submitButtonDisabled : null]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Create Audit</Text>
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
  } as TextStyle,
  inputError: {
    borderColor: '#ff3b30',
  } as TextStyle,
  textArea: {
    height: 100,
  } as TextStyle,
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 4,
  },
  templateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  } as ViewStyle,
  templateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  } as ViewStyle,
  dateButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  } as ViewStyle,
  submitButtonDisabled: {
    opacity: 0.5,
  } as ViewStyle,
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateAuditScreen; 