/**
 * Audit Execution Screen
 * Screen for executing audits and recording findings
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  FlatList
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  Divider,
  Checkbox,
  TextInput,
  IconButton,
  ProgressBar,
  Chip,
  FAB,
  Portal,
  Dialog,
  RadioButton,
  Paragraph,
  List
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appTheme } from '../theme/webAppTheme';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// Custom components
const QuickAuditCard = ({ title, children }) => (
  <Card style={styles.card}>
    <Card.Content>
      <Title style={styles.cardTitle}>{title}</Title>
      <Divider style={styles.divider} />
      {children}
    </Card.Content>
  </Card>
);

// Mock data for audit questions
const mockAuditSections = [
  {
    id: 's1',
    title: 'Fire Safety',
    description: 'Check all fire safety equipment and procedures',
    questions: [
      {
        id: 'q1',
        text: 'Are fire extinguishers properly maintained and accessible?',
        type: 'yes_no',
        required: true
      },
      {
        id: 'q2',
        text: 'Are emergency exits clearly marked and unobstructed?',
        type: 'yes_no',
        required: true
      },
      {
        id: 'q3',
        text: 'When was the last fire drill conducted?',
        type: 'date',
        required: false
      },
      {
        id: 'q4',
        text: 'Rate the overall fire safety preparedness',
        type: 'rating',
        required: true
      }
    ]
  },
  {
    id: 's2',
    title: 'Electrical Safety',
    description: 'Inspect electrical systems and equipment',
    questions: [
      {
        id: 'q5',
        text: 'Are electrical panels properly labeled?',
        type: 'yes_no',
        required: true
      },
      {
        id: 'q6',
        text: 'Are extension cords used appropriately and not daisy-chained?',
        type: 'yes_no',
        required: true
      },
      {
        id: 'q7',
        text: 'When was the last electrical inspection?',
        type: 'date',
        required: false
      },
      {
        id: 'q8',
        text: 'Note any electrical hazards observed',
        type: 'text',
        required: false
      }
    ]
  },
  {
    id: 's3',
    title: 'General Safety',
    description: 'Assess general workplace safety conditions',
    questions: [
      {
        id: 'q9',
        text: 'Are first aid kits fully stocked and accessible?',
        type: 'yes_no',
        required: true
      },
      {
        id: 'q10',
        text: 'Are walkways clear of obstructions?',
        type: 'yes_no',
        required: true
      },
      {
        id: 'q11',
        text: 'Is appropriate PPE available and being used?',
        type: 'yes_no',
        required: true
      },
      {
        id: 'q12',
        text: 'Additional safety observations',
        type: 'text',
        required: false
      }
    ]
  }
];

const AuditExecutionScreen = ({ route, navigation }) => {
  // State for the audit data
  const [auditData, setAuditData] = useState({
    id: 'A123',
    title: 'Workplace Safety Audit',
    location: 'Main Office Building',
    date: new Date().toISOString().split('T')[0],
    auditor: 'John Smith',
    status: 'In Progress',
    progress: 0,
    sections: mockAuditSections
  });
  
  // State for responses
  const [responses, setResponses] = useState({});
  const [notes, setNotes] = useState({});
  const [photos, setPhotos] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [showAddFindingDialog, setShowAddFindingDialog] = useState(false);
  const [newFinding, setNewFinding] = useState({
    title: '',
    description: '',
    severity: 'medium',
    assignedTo: '',
    dueDate: ''
  });
  
  // Initialize responses
  useEffect(() => {
    const initialResponses = {};
    const initialNotes = {};
    const initialPhotos = {};
    
    auditData.sections.forEach(section => {
      section.questions.forEach(question => {
        initialResponses[question.id] = '';
        initialNotes[question.id] = '';
        initialPhotos[question.id] = [];
      });
    });
    
    setResponses(initialResponses);
    setNotes(initialNotes);
    setPhotos(initialPhotos);
  }, [auditData]);
  
  // Calculate progress
  useEffect(() => {
    const totalQuestions = auditData.sections.reduce(
      (total, section) => total + section.questions.length, 
      0
    );
    
    const answeredQuestions = Object.values(responses).filter(
      response => response !== ''
    ).length;
    
    const progress = totalQuestions > 0 ? answeredQuestions / totalQuestions : 0;
    setAuditData(prev => ({ ...prev, progress }));
  }, [responses]);
  
  const handleResponse = (questionId, value) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };
  
  const handleNote = (questionId, value) => {
    setNotes(prev => ({ ...prev, [questionId]: value }));
  };
  
  const handleTakePhoto = async (questionId) => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8
      });
      
      if (!result.didCancel && result.assets && result.assets.length > 0) {
        const newPhoto = result.assets[0];
        setPhotos(prev => ({
          ...prev,
          [questionId]: [...(prev[questionId] || []), newPhoto]
        }));
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };
  
  const handleSelectPhoto = async (questionId) => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1
      });
      
      if (!result.didCancel && result.assets && result.assets.length > 0) {
        const newPhoto = result.assets[0];
        setPhotos(prev => ({
          ...prev,
          [questionId]: [...(prev[questionId] || []), newPhoto]
        }));
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
      Alert.alert('Error', 'Failed to select photo');
    }
  };
  
  const handleDeletePhoto = (questionId, index) => {
    setPhotos(prev => {
      const updatedPhotos = [...prev[questionId]];
      updatedPhotos.splice(index, 1);
      return { ...prev, [questionId]: updatedPhotos };
    });
  };
  
  const handleAddFinding = () => {
    if (!newFinding.title.trim()) {
      Alert.alert('Error', 'Please enter a finding title');
      return;
    }
    
    // In a real app, this would save the finding to the database
    Alert.alert('Success', 'Finding added successfully');
    setShowAddFindingDialog(false);
    setNewFinding({
      title: '',
      description: '',
      severity: 'medium',
      assignedTo: '',
      dueDate: ''
    });
  };
  
  const handleSaveAudit = () => {
    // Validate required questions
    const unansweredRequired = [];
    
    auditData.sections.forEach(section => {
      section.questions.forEach(question => {
        if (question.required && !responses[question.id]) {
          unansweredRequired.push(question.text);
        }
      });
    });
    
    if (unansweredRequired.length > 0) {
      Alert.alert(
        'Incomplete Audit',
        `Please answer the following required questions:\n${unansweredRequired.join('\n')}`
      );
      return;
    }
    
    // In a real app, this would save the audit to the database
    Alert.alert(
      'Success',
      'Audit saved successfully',
      [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]
    );
  };
  
  const handleCompleteAudit = () => {
    // Validate required questions
    const unansweredRequired = [];
    
    auditData.sections.forEach(section => {
      section.questions.forEach(question => {
        if (question.required && !responses[question.id]) {
          unansweredRequired.push(question.text);
        }
      });
    });
    
    if (unansweredRequired.length > 0) {
      Alert.alert(
        'Incomplete Audit',
        `Please answer the following required questions:\n${unansweredRequired.join('\n')}`
      );
      return;
    }
    
    // In a real app, this would mark the audit as complete in the database
    Alert.alert(
      'Confirm Completion',
      'Are you sure you want to mark this audit as complete? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Complete', 
          onPress: () => {
            Alert.alert(
              'Success',
              'Audit completed successfully',
              [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]
            );
          }
        }
      ]
    );
  };
  
  const renderQuestion = (question) => {
    switch (question.type) {
      case 'yes_no':
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{question.text}</Text>
            {question.required && <Text style={styles.requiredIndicator}>*</Text>}
            <View style={styles.responseContainer}>
              <RadioButton.Group
                onValueChange={(value) => handleResponse(question.id, value)}
                value={responses[question.id]}
              >
                <View style={styles.radioRow}>
                  <RadioButton.Item label="Yes" value="yes" />
                  <RadioButton.Item label="No" value="no" />
                  <RadioButton.Item label="N/A" value="n/a" />
                </View>
              </RadioButton.Group>
            </View>
            
            <TextInput
              label="Notes"
              value={notes[question.id]}
              onChangeText={(text) => handleNote(question.id, text)}
              multiline
              style={styles.notesInput}
            />
            
            <View style={styles.photoSection}>
              <Text style={styles.photoSectionTitle}>Photos</Text>
              <View style={styles.photoButtons}>
                <Button 
                  mode="outlined" 
                  icon="camera" 
                  onPress={() => handleTakePhoto(question.id)}
                  style={styles.photoButton}
                >
                  Take Photo
                </Button>
                <Button 
                  mode="outlined" 
                  icon="image" 
                  onPress={() => handleSelectPhoto(question.id)}
                  style={styles.photoButton}
                >
                  Select Photo
                </Button>
              </View>
              
              {photos[question.id] && photos[question.id].length > 0 && (
                <ScrollView horizontal style={styles.photoList}>
                  {photos[question.id].map((photo, index) => (
                    <View key={index} style={styles.photoContainer}>
                      <Image 
                        source={{ uri: photo.uri }} 
                        style={styles.photo} 
                      />
                      <IconButton
                        icon="delete"
                        size={16}
                        style={styles.deletePhotoButton}
                        onPress={() => handleDeletePhoto(question.id, index)}
                      />
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        );
        
      case 'text':
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{question.text}</Text>
            {question.required && <Text style={styles.requiredIndicator}>*</Text>}
            <TextInput
              value={responses[question.id]}
              onChangeText={(text) => handleResponse(question.id, text)}
              multiline
              style={styles.textInput}
            />
            
            <View style={styles.photoSection}>
              <Text style={styles.photoSectionTitle}>Photos</Text>
              <View style={styles.photoButtons}>
                <Button 
                  mode="outlined" 
                  icon="camera" 
                  onPress={() => handleTakePhoto(question.id)}
                  style={styles.photoButton}
                >
                  Take Photo
                </Button>
                <Button 
                  mode="outlined" 
                  icon="image" 
                  onPress={() => handleSelectPhoto(question.id)}
                  style={styles.photoButton}
                >
                  Select Photo
                </Button>
              </View>
              
              {photos[question.id] && photos[question.id].length > 0 && (
                <ScrollView horizontal style={styles.photoList}>
                  {photos[question.id].map((photo, index) => (
                    <View key={index} style={styles.photoContainer}>
                      <Image 
                        source={{ uri: photo.uri }} 
                        style={styles.photo} 
                      />
                      <IconButton
                        icon="delete"
                        size={16}
                        style={styles.deletePhotoButton}
                        onPress={() => handleDeletePhoto(question.id, index)}
                      />
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        );
        
      case 'rating':
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{question.text}</Text>
            {question.required && <Text style={styles.requiredIndicator}>*</Text>}
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map(rating => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.ratingButton,
                    responses[question.id] === rating.toString() && styles.selectedRating
                  ]}
                  onPress={() => handleResponse(question.id, rating.toString())}
                >
                  <Text style={[
                    styles.ratingText,
                    responses[question.id] === rating.toString() && styles.selectedRatingText
                  ]}>
                    {rating}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.ratingLabels}>
              <Text style={styles.ratingLabelPoor}>Poor</Text>
              <Text style={styles.ratingLabelExcellent}>Excellent</Text>
            </Text>
            
            <TextInput
              label="Notes"
              value={notes[question.id]}
              onChangeText={(text) => handleNote(question.id, text)}
              multiline
              style={styles.notesInput}
            />
          </View>
        );
        
      case 'date':
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{question.text}</Text>
            {question.required && <Text style={styles.requiredIndicator}>*</Text>}
            <TextInput
              value={responses[question.id]}
              onChangeText={(text) => handleResponse(question.id, text)}
              placeholder="YYYY-MM-DD"
              style={styles.dateInput}
            />
          </View>
        );
        
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>{auditData.title}</Title>
        <Text style={styles.headerSubtitle}>{auditData.location} • {auditData.date}</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Progress: {Math.round(auditData.progress * 100)}%
        </Text>
        <ProgressBar 
          progress={auditData.progress} 
          color={appTheme.colors.primary}
          style={styles.progressBar}
        />
      </View>
      
      <View style={styles.sectionNavigation}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {auditData.sections.map((section, index) => (
            <TouchableOpacity
              key={section.id}
              style={[
                styles.sectionTab,
                currentSection === index && styles.activeSectionTab
              ]}
              onPress={() => setCurrentSection(index)}
            >
              <Text style={[
                styles.sectionTabText,
                currentSection === index && styles.activeSectionTabText
              ]}>
                {section.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <ScrollView style={styles.content}>
        {auditData.sections[currentSection] && (
          <QuickAuditCard title={auditData.sections[currentSection].title}>
            <Text style={styles.sectionDescription}>
              {auditData.sections[currentSection].description}
            </Text>
            
            {auditData.sections[currentSection].questions.map(question => (
              <View key={question.id}>
                {renderQuestion(question)}
                <Divider style={styles.questionDivider} />
              </View>
            ))}
          </QuickAuditCard>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <Button 
          mode="outlined" 
          onPress={handleSaveAudit}
          style={styles.footerButton}
        >
          Save Draft
        </Button>
        <Button 
          mode="contained" 
          onPress={handleCompleteAudit}
          style={styles.footerButton}
        >
          Complete Audit
        </Button>
      </View>
      
      <FAB
        style={styles.fab}
        icon="plus"
        label="Add Finding"
        onPress={() => setShowAddFindingDialog(true)}
        color="#fff"
      />
      
      <Portal>
        <Dialog
          visible={showAddFindingDialog}
          onDismiss={() => setShowAddFindingDialog(false)}
        >
          <Dialog.Title>Add New Finding</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Title"
              value={newFinding.title}
              onChangeText={(text) => setNewFinding({ ...newFinding, title: text })}
              style={styles.dialogInput}
            />
            <TextInput
              label="Description"
              value={newFinding.description}
              onChangeText={(text) => setNewFinding({ ...newFinding, description: text })}
              multiline
              numberOfLines={3}
              style={styles.dialogInput}
            />
            <Text style={styles.dialogLabel}>Severity</Text>
            <RadioButton.Group
              onValueChange={(value) => setNewFinding({ ...newFinding, severity: value })}
              value={newFinding.severity}
            >
              <View style={styles.severityOptions}>
                <RadioButton.Item label="Low" value="low" />
                <RadioButton.Item label="Medium" value="medium" />
                <RadioButton.Item label="High" value="high" />
                <RadioButton.Item label="Critical" value="critical" />
              </View>
            </RadioButton.Group>
            <TextInput
              label="Assigned To"
              value={newFinding.assignedTo}
              onChangeText={(text) => setNewFinding({ ...newFinding, assignedTo: text })}
              style={styles.dialogInput}
            />
            <TextInput
              label="Due Date"
              value={newFinding.dueDate}
              onChangeText={(text) => setNewFinding({ ...newFinding, dueDate: text })}
              placeholder="YYYY-MM-DD"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddFindingDialog(false)}>Cancel</Button>
            <Button onPress={handleAddFinding}>Add Finding</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: appTheme.colors.primary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  progressText: {
    fontSize: 14,
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  sectionNavigation: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeSectionTab: {
    backgroundColor: appTheme.colors.primary,
  },
  sectionTabText: {
    color: '#666',
  },
  activeSectionTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
  },
  divider: {
    marginVertical: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  questionContainer: {
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  requiredIndicator: {
    color: 'red',
    marginLeft: 4,
  },
  responseContainer: {
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: '#f9f9f9',
    marginTop: 8,
    marginBottom: 8,
  },
  dateInput: {
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  ratingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedRating: {
    backgroundColor: appTheme.colors.primary,
    borderColor: appTheme.colors.primary,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  selectedRatingText: {
    color: '#fff',
  },
  ratingLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ratingLabelPoor: {
    fontSize: 12,
    color: '#666',
  },
  ratingLabelExcellent: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  photoSection: {
    marginTop: 8,
  },
  photoSectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  photoButtons: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  photoButton: {
    marginRight: 8,
  },
  photoList: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  photoContainer: {
    position: 'relative',
    marginRight: 8,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  deletePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  questionDivider: {
    marginVertical: 16,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
    backgroundColor: appTheme.colors.primary,
  },
  dialogInput: {
    marginBottom: 12,
  },
  dialogLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  severityOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default AuditExecutionScreen;