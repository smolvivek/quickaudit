/**
 * Audit Execution Screen
 * Screen for field auditors to execute an audit checklist
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Alert
} from 'react-native';
import { 
  Surface, 
  ProgressBar, 
  RadioButton, 
  Checkbox, 
  TextInput,
  Button,
  FAB,
  Divider,
  IconButton
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { appTheme } from '../../theme/webAppTheme';

// Mock data for the audit checklist
const mockAudit = {
  id: 'A1001',
  title: 'Monthly Fire Safety Inspection',
  location: 'Main Building, Floor 3',
  date: '2023-05-20',
  sections: [
    {
      id: 'S1',
      title: 'Fire Extinguishers',
      items: [
        {
          id: 'Q1',
          question: 'Are all fire extinguishers present at designated locations?',
          type: 'yes_no',
          answer: null,
          notes: '',
          photos: []
        },
        {
          id: 'Q2',
          question: 'Are all fire extinguishers fully charged? (Check pressure gauge)',
          type: 'yes_no',
          answer: null,
          notes: '',
          photos: []
        },
        {
          id: 'Q3',
          question: 'Are fire extinguisher inspection tags up to date?',
          type: 'yes_no',
          answer: null,
          notes: '',
          photos: []
        }
      ]
    },
    {
      id: 'S2',
      title: 'Emergency Exits',
      items: [
        {
          id: 'Q4',
          question: 'Are emergency exits clearly marked?',
          type: 'yes_no',
          answer: null,
          notes: '',
          photos: []
        },
        {
          id: 'Q5',
          question: 'Are emergency exit paths clear of obstructions?',
          type: 'yes_no',
          answer: null,
          notes: '',
          photos: []
        },
        {
          id: 'Q6',
          question: 'Are emergency exit lights functioning properly?',
          type: 'yes_no',
          answer: null,
          notes: '',
          photos: []
        }
      ]
    },
    {
      id: 'S3',
      title: 'Fire Alarms',
      items: [
        {
          id: 'Q7',
          question: 'Are fire alarm pull stations accessible?',
          type: 'yes_no',
          answer: null,
          notes: '',
          photos: []
        },
        {
          id: 'Q8',
          question: 'Are fire alarm sounders/strobes unobstructed?',
          type: 'yes_no',
          answer: null,
          notes: '',
          photos: []
        }
      ]
    }
  ]
};

const AuditExecutionScreen = ({ navigation, route }) => {
  // In a real app, we would get the audit data from the route params or API
  const [audit, setAudit] = useState(mockAudit);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [note, setNote] = useState('');
  
  const currentSection = audit.sections[currentSectionIndex];
  const currentItem = currentSection.items[currentItemIndex];
  
  const totalItems = audit.sections.reduce((total, section) => total + section.items.length, 0);
  const completedItems = audit.sections.reduce((total, section) => {
    return total + section.items.filter(item => item.answer !== null).length;
  }, 0);
  
  const progress = totalItems > 0 ? completedItems / totalItems : 0;
  
  const handleAnswer = (answer) => {
    const updatedAudit = { ...audit };
    updatedAudit.sections[currentSectionIndex].items[currentItemIndex].answer = answer;
    updatedAudit.sections[currentSectionIndex].items[currentItemIndex].notes = note;
    setAudit(updatedAudit);
    setNote('');
    
    // Move to next item or section
    moveToNextItem();
  };
  
  const handleSaveNote = () => {
    const updatedAudit = { ...audit };
    updatedAudit.sections[currentSectionIndex].items[currentItemIndex].notes = note;
    setAudit(updatedAudit);
    Alert.alert('Note Saved', 'Your note has been saved successfully.');
  };
  
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
        const updatedAudit = { ...audit };
        const photoUri = response.assets[0].uri;
        updatedAudit.sections[currentSectionIndex].items[currentItemIndex].photos.push(photoUri);
        setAudit(updatedAudit);
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
        const updatedAudit = { ...audit };
        const photoUri = response.assets[0].uri;
        updatedAudit.sections[currentSectionIndex].items[currentItemIndex].photos.push(photoUri);
        setAudit(updatedAudit);
      }
    });
  };
  
  const moveToNextItem = () => {
    if (currentItemIndex < currentSection.items.length - 1) {
      // Move to next item in current section
      setCurrentItemIndex(currentItemIndex + 1);
    } else if (currentSectionIndex < audit.sections.length - 1) {
      // Move to first item in next section
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentItemIndex(0);
    } else {
      // End of audit
      Alert.alert(
        'Audit Complete',
        'You have completed all items in this audit. Would you like to review your responses?',
        [
          {
            text: 'Review Later',
            onPress: () => navigation.goBack(),
            style: 'cancel',
          },
          {
            text: 'Review Now',
            onPress: () => navigation.navigate('AuditReview', { auditId: audit.id }),
          },
        ]
      );
    }
  };
  
  const moveToPreviousItem = () => {
    if (currentItemIndex > 0) {
      // Move to previous item in current section
      setCurrentItemIndex(currentItemIndex - 1);
    } else if (currentSectionIndex > 0) {
      // Move to last item in previous section
      setCurrentSectionIndex(currentSectionIndex - 1);
      const prevSection = audit.sections[currentSectionIndex - 1];
      setCurrentItemIndex(prevSection.items.length - 1);
    }
  };
  
  const handleFinishAudit = () => {
    const unansweredItems = totalItems - completedItems;
    
    if (unansweredItems > 0) {
      Alert.alert(
        'Incomplete Audit',
        `There are ${unansweredItems} unanswered items. Are you sure you want to finish this audit?`,
        [
          {
            text: 'Continue Editing',
            style: 'cancel',
          },
          {
            text: 'Finish Anyway',
            onPress: () => navigation.navigate('AuditReview', { auditId: audit.id }),
          },
        ]
      );
    } else {
      navigation.navigate('AuditReview', { auditId: audit.id });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{audit.title}</Text>
        <Text style={styles.headerLocation}>{audit.location}</Text>
        
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {completedItems} of {totalItems} items completed ({Math.round(progress * 100)}%)
          </Text>
          <ProgressBar 
            progress={progress} 
            color={appTheme.colors.primary} 
            style={styles.progressBar} 
          />
        </View>
      </View>
      
      <Surface style={styles.sectionHeader}>
        <View style={styles.sectionHeaderContent}>
          <Text style={styles.sectionTitle}>{currentSection.title}</Text>
          <Text style={styles.itemCounter}>
            Item {currentItemIndex + 1} of {currentSection.items.length}
          </Text>
        </View>
      </Surface>
      
      <ScrollView style={styles.content}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentItem.question}</Text>
          
          {currentItem.type === 'yes_no' && (
            <View style={styles.responseContainer}>
              <TouchableOpacity 
                style={[
                  styles.responseButton,
                  currentItem.answer === true && styles.responseButtonSelected,
                  currentItem.answer === true && styles.responseButtonYes
                ]}
                onPress={() => handleAnswer(true)}
              >
                <Icon name="check-circle" size={24} color={currentItem.answer === true ? '#fff' : '#4caf50'} />
                <Text style={[
                  styles.responseButtonText,
                  currentItem.answer === true && styles.responseButtonTextSelected
                ]}>Yes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.responseButton,
                  currentItem.answer === false && styles.responseButtonSelected,
                  currentItem.answer === false && styles.responseButtonNo
                ]}
                onPress={() => handleAnswer(false)}
              >
                <Icon name="close-circle" size={24} color={currentItem.answer === false ? '#fff' : '#f44336'} />
                <Text style={[
                  styles.responseButtonText,
                  currentItem.answer === false && styles.responseButtonTextSelected
                ]}>No</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Add notes here..."
              multiline
              numberOfLines={4}
              style={styles.notesInput}
            />
            <Button 
              mode="outlined" 
              onPress={handleSaveNote}
              style={styles.saveNoteButton}
            >
              Save Note
            </Button>
          </View>
          
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
            
            {currentItem.photos.length > 0 && (
              <View style={styles.photoGrid}>
                {currentItem.photos.map((photo, index) => (
                  <View key={index} style={styles.photoContainer}>
                    <Image source={{ uri: photo }} style={styles.photo} />
                    <IconButton
                      icon="delete"
                      size={20}
                      color="#f44336"
                      style={styles.deletePhotoButton}
                      onPress={() => {
                        const updatedAudit = { ...audit };
                        updatedAudit.sections[currentSectionIndex].items[currentItemIndex].photos.splice(index, 1);
                        setAudit(updatedAudit);
                      }}
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.navigationButtons}>
        <Button 
          mode="outlined" 
          icon="arrow-left" 
          onPress={moveToPreviousItem}
          style={styles.navButton}
          disabled={currentSectionIndex === 0 && currentItemIndex === 0}
        >
          Previous
        </Button>
        
        <Button 
          mode="outlined" 
          icon="arrow-right" 
          onPress={moveToNextItem}
          style={styles.navButton}
          contentStyle={{ flexDirection: 'row-reverse' }}
        >
          Next
        </Button>
      </View>
      
      <FAB
        style={styles.fab}
        icon="check"
        label="Finish Audit"
        onPress={handleFinishAudit}
      />
    </SafeAreaView>
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
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
    marginBottom: 4,
  },
  headerLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  sectionHeader: {
    elevation: 2,
    backgroundColor: appTheme.colors.primary,
  },
  sectionHeaderContent: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemCounter: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  content: {
    flex: 1,
  },
  questionContainer: {
    padding: 16,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    elevation: 2,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  responseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  responseButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 8,
  },
  responseButtonSelected: {
    borderWidth: 0,
  },
  responseButtonYes: {
    backgroundColor: '#4caf50',
  },
  responseButtonNo: {
    backgroundColor: '#f44336',
  },
  responseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  responseButtonTextSelected: {
    color: '#fff',
  },
  notesContainer: {
    marginBottom: 24,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    marginBottom: 8,
  },
  saveNoteButton: {
    alignSelf: 'flex-end',
  },
  photosContainer: {
    marginBottom: 16,
  },
  photosLabel: {
    fontSize: 16,
    fontWeight: 'bold',
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
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 4,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
    backgroundColor: appTheme.colors.accent,
  },
});

export default AuditExecutionScreen;