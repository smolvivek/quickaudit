/**
 * Edit Finding Screen
 * Screen for editing an existing finding or creating a new one
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Platform
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Title,
  Divider,
  RadioButton,
  Menu,
  IconButton
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { appTheme } from '../theme/webAppTheme';

// Mock data for sections
const auditSections = [
  'Fire Extinguishers',
  'Emergency Exits',
  'Fire Alarms',
  'Electrical Safety',
  'General Safety'
];

// Mock data for assignees
const assignees = [
  'John Smith',
  'Sarah Johnson',
  'Michael Brown',
  'Emily Davis',
  'Maintenance Team',
  'Safety Officer'
];

const EditFindingScreen = ({ navigation, route }) => {
  // Check if we're editing an existing finding or creating a new one
  const isEditing = route.params?.findingId !== undefined;
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [section, setSection] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [photos, setPhotos] = useState([]);
  const [showSectionMenu, setShowSectionMenu] = useState(false);
  const [showAssigneeMenu, setShowAssigneeMenu] = useState(false);
  
  useEffect(() => {
    if (isEditing) {
      // In a real app, we would fetch the finding data from the API
      // For now, we'll use mock data
      setTitle('Emergency exit sign not illuminated');
      setDescription('The emergency exit sign on the 3rd floor east corridor is not illuminated. This is a safety hazard that needs to be addressed promptly.');
      setSection('Emergency Exits');
      setSeverity('High');
      setAssignedTo('Maintenance Team');
      setDueDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // 7 days from now
      setPhotos([
        'https://example.com/photo1.jpg',
        'https://example.com/photo2.jpg'
      ]);
    }
  }, [isEditing]);
  
  const handleTakePhoto = () => {
    launchCamera({
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 1200,
      maxWidth: 1200,
    }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const photoUri = response.assets[0].uri;
        setPhotos([...photos, photoUri]);
      }
    });
  };
  
  const handleSelectPhoto = () => {
    launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 1200,
      maxWidth: 1200,
    }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const photoUri = response.assets[0].uri;
        setPhotos([...photos, photoUri]);
      }
    });
  };
  
  const handleDeletePhoto = (index) => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);
  };
  
  const handleSaveFinding = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for the finding');
      return;
    }
    
    if (!section) {
      Alert.alert('Error', 'Please select a section for the finding');
      return;
    }
    
    if (!assignedTo) {
      Alert.alert('Error', 'Please assign the finding to someone');
      return;
    }
    
    // In a real app, we would save the finding to the API
    Alert.alert(
      'Success',
      isEditing ? 'Finding updated successfully' : 'Finding created successfully',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>
          {isEditing ? 'Edit Finding' : 'New Finding'}
        </Title>
      </View>
      
      <View style={styles.formContainer}>
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          mode="outlined"
        />
        
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={styles.descriptionInput}
          mode="outlined"
        />
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Section:</Text>
          <Menu
            visible={showSectionMenu}
            onDismiss={() => setShowSectionMenu(false)}
            anchor={
              <TouchableOpacity 
                style={styles.sectionButton}
                onPress={() => setShowSectionMenu(true)}
              >
                <Text style={styles.sectionButtonText}>
                  {section || 'Select Section'}
                </Text>
                <Icon name="menu-down" size={24} color="#666" />
              </TouchableOpacity>
            }
          >
            {auditSections.map((sectionItem) => (
              <Menu.Item
                key={sectionItem}
                onPress={() => {
                  setSection(sectionItem);
                  setShowSectionMenu(false);
                }}
                title={sectionItem}
              />
            ))}
          </Menu>
        </View>
        
        <View style={styles.severityContainer}>
          <Text style={styles.severityLabel}>Severity:</Text>
          <RadioButton.Group onValueChange={setSeverity} value={severity}>
            <View style={styles.severityOptions}>
              <View style={styles.severityOption}>
                <RadioButton value="Low" color={appTheme.colors.primary} />
                <Text>Low</Text>
              </View>
              <View style={styles.severityOption}>
                <RadioButton value="Medium" color={appTheme.colors.primary} />
                <Text>Medium</Text>
              </View>
              <View style={styles.severityOption}>
                <RadioButton value="High" color={appTheme.colors.primary} />
                <Text>High</Text>
              </View>
            </View>
          </RadioButton.Group>
        </View>
        
        <View style={styles.assigneeContainer}>
          <Text style={styles.assigneeLabel}>Assigned To:</Text>
          <Menu
            visible={showAssigneeMenu}
            onDismiss={() => setShowAssigneeMenu(false)}
            anchor={
              <TouchableOpacity 
                style={styles.assigneeButton}
                onPress={() => setShowAssigneeMenu(true)}
              >
                <Text style={styles.assigneeButtonText}>
                  {assignedTo || 'Select Assignee'}
                </Text>
                <Icon name="menu-down" size={24} color="#666" />
              </TouchableOpacity>
            }
          >
            {assignees.map((assignee) => (
              <Menu.Item
                key={assignee}
                onPress={() => {
                  setAssignedTo(assignee);
                  setShowAssigneeMenu(false);
                }}
                title={assignee}
              />
            ))}
          </Menu>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.photosContainer}>
          <Text style={styles.photosLabel}>Photos:</Text>
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
            <View style={styles.photoGrid}>
              {photos.map((photo, index) => (
                <View key={index} style={styles.photoContainer}>
                  <Image source={{ uri: photo }} style={styles.photo} />
                  <IconButton
                    icon="delete"
                    size={20}
                    color="#f44336"
                    style={styles.deletePhotoButton}
                    onPress={() => handleDeletePhoto(index)}
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          onPress={handleSaveFinding}
          style={styles.saveButton}
        >
          {isEditing ? 'Update Finding' : 'Save Finding'}
        </Button>
        <Button 
          mode="outlined" 
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
        >
          Cancel
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
  },
  formContainer: {
    padding: 16,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  descriptionInput: {
    marginBottom: 16,
    backgroundColor: '#fff',
    height: 100,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  sectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  sectionButtonText: {
    fontSize: 16,
  },
  severityContainer: {
    marginBottom: 16,
  },
  severityLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  severityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severityOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assigneeContainer: {
    marginBottom: 16,
  },
  assigneeLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  assigneeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  assigneeButtonText: {
    fontSize: 16,
  },
  divider: {
    marginVertical: 16,
  },
  photosContainer: {
    marginBottom: 16,
  },
  photosLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  photoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  photoButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  photoContainer: {
    width: '33.33%',
    padding: 4,
    position: 'relative',
  },
  photo: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 4,
  },
  deletePhotoButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    margin: 0,
  },
  buttonContainer: {
    padding: 16,
  },
  saveButton: {
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: appTheme.colors.primary,
  },
  cancelButton: {
    paddingVertical: 8,
  },
});

export default EditFindingScreen;