/**
 * Script to fix TypeScript errors in AddFinding.tsx
 */

const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const ensureDirectoryExists = (dirPath) => {
  if (!dirPath || dirPath === '') return;
  
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error);
  }
};

// Fix AddFinding.tsx
const fixAddFinding = () => {
  const filePath = path.join(process.cwd(), 'src/screens/AddFinding.tsx');
  
  const content = `/**
 * Add Finding Screen
 * Screen for adding new findings during an audit
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  TextInput,
  Divider,
  Chip,
  IconButton,
  RadioButton,
  HelperText,
  Menu,
  List
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { appTheme } from '../theme/webAppTheme';

// Mock data for categories
const categories = [
  'Security',
  'Compliance',
  'Operational',
  'Financial',
  'Environmental',
  'Health & Safety'
];

// Mock data for assignees
const assignees = [
  { id: 'U1', name: 'John Smith', role: 'Manager' },
  { id: 'U2', name: 'Sarah Johnson', role: 'Auditor' },
  { id: 'U3', name: 'Mike Williams', role: 'Auditor' },
  { id: 'U4', name: 'Emily Davis', role: 'Client' },
  { id: 'U5', name: 'Robert Brown', role: 'Client' }
];

interface Finding {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  assignedTo: string;
  dueDate: string;
  location: string;
  recommendations: string;
}

interface Photo {
  uri: string;
  width?: number;
  height?: number;
  fileSize?: number;
  type?: string;
  fileName?: string;
}

interface ErrorState {
  title?: string;
  description?: string;
  category?: string;
}

const AddFinding = ({ route, navigation }) => {
  // State for the finding
  const [finding, setFinding] = useState<Finding>({
    title: '',
    description: '',
    severity: 'medium',
    category: '',
    assignedTo: '',
    dueDate: '',
    location: '',
    recommendations: ''
  });
  
  // State for validation errors
  const [errors, setErrors] = useState<ErrorState>({});
  
  // State for photos
  const [photos, setPhotos] = useState<Photo[]>([]);
  
  // State for menus
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showAssigneeMenu, setShowAssigneeMenu] = useState(false);
  
  const validateForm = () => {
    const newErrors: ErrorState = {};
    let isValid = true;
    
    if (!finding.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }
    
    if (!finding.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }
    
    if (!finding.category) {
      newErrors.category = 'Category is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSaveFinding = () => {
    if (!validateForm()) {
      return;
    }
    
    // In a real app, this would save the finding to the database
    Alert.alert(
      'Success',
      'Finding added successfully',
      [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]
    );
  };
  
  const handleTakePhoto = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8
      });
      
      if (!result.didCancel && result.assets && result.assets.length > 0) {
        const newPhoto = result.assets[0];
        setPhotos([...photos, newPhoto]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };
  
  const handleSelectPhoto = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1
      });
      
      if (!result.didCancel && result.assets && result.assets.length > 0) {
        const newPhoto = result.assets[0];
        setPhotos([...photos, newPhoto]);
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
      Alert.alert('Error', 'Failed to select photo');
    }
  };
  
  const handleDeletePhoto = (index: number) => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '#f44336';
      case 'high':
        return '#ff9800';
      case 'medium':
        return '#ffeb3b';
      case 'low':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => navigation.goBack()}
          />
          <Title style={styles.headerTitle}>Add Finding</Title>
        </View>
        
        <ScrollView style={styles.content}>
          <Card style={styles.card}>
            <Card.Content>
              <TextInput
                label="Title"
                value={finding.title}
                onChangeText={(text) => setFinding({ ...finding, title: text })}
                style={styles.input}
                error={!!errors.title}
                mode="outlined"
              />
              {!!errors.title && (
                <HelperText type="error" visible={!!errors.title}>
                  {errors.title}
                </HelperText>
              )}
              
              <TextInput
                label="Description"
                value={finding.description}
                onChangeText={(text) => setFinding({ ...finding, description: text })}
                multiline
                numberOfLines={4}
                style={styles.input}
                error={!!errors.description}
                mode="outlined"
              />
              {!!errors.description && (
                <HelperText type="error" visible={!!errors.description}>
                  {errors.description}
                </HelperText>
              )}
              
              <Text style={styles.sectionTitle}>Severity</Text>
              <View style={styles.severityContainer}>
                <TouchableOpacity
                  style={[
                    styles.severityOption,
                    finding.severity === 'low' && { backgroundColor: getSeverityColor('low') }
                  ]}
                  onPress={() => setFinding({ ...finding, severity: 'low' })}
                >
                  <Text style={[
                    styles.severityText,
                    finding.severity === 'low' && styles.selectedSeverityText
                  ]}>
                    Low
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.severityOption,
                    finding.severity === 'medium' && { backgroundColor: getSeverityColor('medium') }
                  ]}
                  onPress={() => setFinding({ ...finding, severity: 'medium' })}
                >
                  <Text style={[
                    styles.severityText,
                    finding.severity === 'medium' && styles.selectedSeverityText
                  ]}>
                    Medium
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.severityOption,
                    finding.severity === 'high' && { backgroundColor: getSeverityColor('high') }
                  ]}
                  onPress={() => setFinding({ ...finding, severity: 'high' })}
                >
                  <Text style={[
                    styles.severityText,
                    finding.severity === 'high' && styles.selectedSeverityText
                  ]}>
                    High
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.severityOption,
                    finding.severity === 'critical' && { backgroundColor: getSeverityColor('critical') }
                  ]}
                  onPress={() => setFinding({ ...finding, severity: 'critical' })}
                >
                  <Text style={[
                    styles.severityText,
                    finding.severity === 'critical' && styles.selectedSeverityText
                  ]}>
                    Critical
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.menuContainer}>
                <Text style={styles.sectionTitle}>Category</Text>
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() => setShowCategoryMenu(true)}
                >
                  <Text style={styles.menuButtonText}>
                    {finding.category || 'Select Category'}
                  </Text>
                  <Icon name="chevron-down" size={20} color="#666" />
                </TouchableOpacity>
                {!!errors.category && (
                  <HelperText type="error" visible={!!errors.category}>
                    {errors.category}
                  </HelperText>
                )}
                
                <Menu
                  visible={showCategoryMenu}
                  onDismiss={() => setShowCategoryMenu(false)}
                  anchor={{ x: 0, y: 0 }}
                  style={styles.menu}
                >
                  {categories.map((category) => (
                    <Menu.Item
                      key={category}
                      title={category}
                      onPress={() => {
                        setFinding({ ...finding, category });
                        setShowCategoryMenu(false);
                      }}
                    />
                  ))}
                </Menu>
              </View>
              
              <View style={styles.menuContainer}>
                <Text style={styles.sectionTitle}>Assigned To</Text>
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() => setShowAssigneeMenu(true)}
                >
                  <Text style={styles.menuButtonText}>
                    {assignees.find(a => a.id === finding.assignedTo)?.name || 'Select Assignee'}
                  </Text>
                  <Icon name="chevron-down" size={20} color="#666" />
                </TouchableOpacity>
                
                <Menu
                  visible={showAssigneeMenu}
                  onDismiss={() => setShowAssigneeMenu(false)}
                  anchor={{ x: 0, y: 0 }}
                  style={styles.menu}
                >
                  {assignees.map((assignee) => (
                    <Menu.Item
                      key={assignee.id}
                      title={assignee.name}
                      description={assignee.role}
                      onPress={() => {
                        setFinding({ ...finding, assignedTo: assignee.id });
                        setShowAssigneeMenu(false);
                      }}
                    />
                  ))}
                </Menu>
              </View>
              
              <TextInput
                label="Due Date"
                value={finding.dueDate}
                onChangeText={(text) => setFinding({ ...finding, dueDate: text })}
                placeholder="YYYY-MM-DD"
                style={styles.input}
                mode="outlined"
              />
              
              <TextInput
                label="Location"
                value={finding.location}
                onChangeText={(text) => setFinding({ ...finding, location: text })}
                style={styles.input}
                mode="outlined"
              />
              
              <TextInput
                label="Recommendations"
                value={finding.recommendations}
                onChangeText={(text) => setFinding({ ...finding, recommendations: text })}
                multiline
                numberOfLines={3}
                style={styles.input}
                mode="outlined"
              />
              
              <Text style={styles.sectionTitle}>Photos</Text>
              <View style={styles.photoButtons}>
                <Button 
                  mode="outlined" 
                  icon="camera" 
                  onPress={handleTakePhoto}
                  style={styles.photoButton}
                >
                  Take Photo
                </Button>
                <Button 
                  mode="outlined" 
                  icon="image" 
                  onPress={handleSelectPhoto}
                  style={styles.photoButton}
                >
                  Select Photo
                </Button>
              </View>
              
              {photos.length > 0 && (
                <ScrollView horizontal style={styles.photoList}>
                  {photos.map((photo, index) => (
                    <View key={index} style={styles.photoContainer}>
                      <Image 
                        source={{ uri: photo.uri }} 
                        style={styles.photo} 
                      />
                      <IconButton
                        icon="delete"
                        size={16}
                        style={styles.deletePhotoButton}
                        onPress={() => handleDeletePhoto(index)}
                      />
                    </View>
                  ))}
                </ScrollView>
              )}
            </Card.Content>
          </Card>
        </ScrollView>
        
        <View style={styles.footer}>
          <Button 
            mode="outlined" 
            onPress={() => navigation.goBack()}
            style={styles.footerButton}
          >
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={handleSaveFinding}
            style={styles.footerButton}
          >
            Save Finding
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: appTheme.colors.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  severityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  severityOption: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 4,
  },
  severityText: {
    fontWeight: '500',
    color: '#666',
  },
  selectedSeverityText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  menuContainer: {
    marginBottom: 16,
  },
  menuButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  menuButtonText: {
    color: '#666',
  },
  menu: {
    width: 250,
  },
  photoButtons: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  photoButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  photoList: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  photoContainer: {
    position: 'relative',
    marginRight: 8,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 4,
  },
  deletePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default AddFinding;`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed AddFinding.tsx');
};

// Run the function
console.log('Fixing AddFinding...');
fixAddFinding();
console.log('AddFinding fixed successfully!');
