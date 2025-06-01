/**
 * Script to fix TypeScript errors in AuditEditScreen
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

// Fix AuditEditScreen.tsx
const fixAuditEditScreen = () => {
  const dirPath = path.join(process.cwd(), 'src/screens/field_auditor');
  ensureDirectoryExists(dirPath);
  
  const content = `/**
 * Audit Edit Screen
 * Screen for field auditors to create or edit an audit
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { 
  TextInput, 
  Button, 
  Card, 
  Title, 
  Divider,
  IconButton,
  Portal,
  Dialog,
  Paragraph,
  List
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appTheme } from '../../theme/webAppTheme';
import { v4 as uuidv4 } from 'uuid';

// Mock data for templates
const auditTemplates = [
  {
    id: 'T1',
    title: 'Fire Safety Inspection',
    sections: [
      {
        id: 'S1',
        title: 'Fire Extinguishers',
        items: [
          {
            id: 'Q1',
            question: 'Are all fire extinguishers present at designated locations?',
            type: 'yes_no'
          },
          {
            id: 'Q2',
            question: 'Are all fire extinguishers fully charged? (Check pressure gauge)',
            type: 'yes_no'
          },
          {
            id: 'Q3',
            question: 'Are fire extinguisher inspection tags up to date?',
            type: 'yes_no'
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
            type: 'yes_no'
          },
          {
            id: 'Q5',
            question: 'Are emergency exit paths clear of obstructions?',
            type: 'yes_no'
          },
          {
            id: 'Q6',
            question: 'Are emergency exit lights functioning properly?',
            type: 'yes_no'
          }
        ]
      }
    ]
  },
  {
    id: 'T2',
    title: 'Health & Safety Audit',
    sections: [
      {
        id: 'S1',
        title: 'General Safety',
        items: [
          {
            id: 'Q1',
            question: 'Is the workplace free from obvious hazards?',
            type: 'yes_no'
          },
          {
            id: 'Q2',
            question: 'Are all safety signs clearly visible and in good condition?',
            type: 'yes_no'
          }
        ]
      },
      {
        id: 'S2',
        title: 'First Aid',
        items: [
          {
            id: 'Q3',
            question: 'Are first aid kits available and fully stocked?',
            type: 'yes_no'
          },
          {
            id: 'Q4',
            question: 'Are emergency contact numbers clearly displayed?',
            type: 'yes_no'
          }
        ]
      }
    ]
  }
];

const AuditEditScreen = ({ navigation, route }) => {
  // Check if we're editing an existing audit or creating a new one
  const isEditing = route.params?.auditId !== undefined;
  
  const [title, setTitle] = useState(isEditing ? 'Edit Existing Audit' : 'New Audit');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [sections, setSections] = useState([]);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showAddSectionDialog, setShowAddSectionDialog] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [editingSectionIndex, setEditingSectionIndex] = useState(-1);
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [newItemQuestion, setNewItemQuestion] = useState('');
  const [editingSection, setEditingSection] = useState(null);
  const [editingItemIndex, setEditingItemIndex] = useState(-1);
  
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };
  
  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };
  
  const loadTemplate = (templateId) => {
    const template = auditTemplates.find(t => t.id === templateId);
    if (template) {
      setTitle(template.title);
      setSections(JSON.parse(JSON.stringify(template.sections))); // Deep copy
    }
    setShowTemplateDialog(false);
  };
  
  const handleAddSection = () => {
    if (!newSectionTitle.trim()) {
      Alert.alert('Error', 'Please enter a section title');
      return;
    }
    
    if (editingSectionIndex >= 0) {
      // Edit existing section
      const updatedSections = [...sections];
      updatedSections[editingSectionIndex].title = newSectionTitle;
      setSections(updatedSections);
      setEditingSectionIndex(-1);
    } else {
      // Add new section
      const newSection = {
        id: uuidv4(),
        title: newSectionTitle,
        items: []
      };
      setSections([...sections, newSection]);
    }
    
    setNewSectionTitle('');
    setShowAddSectionDialog(false);
  };
  
  const handleEditSection = (index) => {
    setNewSectionTitle(sections[index].title);
    setEditingSectionIndex(index);
    setShowAddSectionDialog(true);
  };
  
  const handleDeleteSection = (index) => {
    Alert.alert(
      'Delete Section',
      'Are you sure you want to delete this section and all its items?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            const updatedSections = [...sections];
            updatedSections.splice(index, 1);
            setSections(updatedSections);
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const handleAddItem = () => {
    if (!newItemQuestion.trim()) {
      Alert.alert('Error', 'Please enter a question');
      return;
    }
    
    if (editingItemIndex >= 0) {
      // Edit existing item
      const updatedSections = [...sections];
      updatedSections[editingSection].items[editingItemIndex].question = newItemQuestion;
      setSections(updatedSections);
      setEditingItemIndex(-1);
    } else {
      // Add new item
      const newItem = {
        id: uuidv4(),
        question: newItemQuestion,
        type: 'yes_no'
      };
      
      const updatedSections = [...sections];
      updatedSections[editingSection].items.push(newItem);
      setSections(updatedSections);
    }
    
    setNewItemQuestion('');
    setShowAddItemDialog(false);
  };
  
  const handleEditItem = (sectionIndex, itemIndex) => {
    setNewItemQuestion(sections[sectionIndex].items[itemIndex].question);
    setEditingSection(sectionIndex);
    setEditingItemIndex(itemIndex);
    setShowAddItemDialog(true);
  };
  
  const handleDeleteItem = (sectionIndex, itemIndex) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            const updatedSections = [...sections];
            updatedSections[sectionIndex].items.splice(itemIndex, 1);
            setSections(updatedSections);
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const handleSaveAudit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an audit title');
      return;
    }
    
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return;
    }
    
    if (sections.length === 0) {
      Alert.alert('Error', 'Please add at least one section');
      return;
    }
    
    // Check if all sections have at least one item
    const emptySections = sections.filter(section => section.items.length === 0);
    if (emptySections.length > 0) {
      Alert.alert('Error', 'All sections must have at least one item');
      return;
    }
    
    // Save audit logic would go here
    Alert.alert('Success', 'Audit saved successfully', [
      {
        text: 'OK',
        onPress: () => navigation.goBack()
      }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Audit Details</Title>
          <Divider style={styles.divider} />
          
          <TextInput
            label="Audit Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          
          <TextInput
            label="Location"
            value={location}
            onChangeText={setLocation}
            style={styles.input}
          />
          
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity 
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateTimeLabel}>Date:</Text>
              <Text style={styles.dateTimeValue}>
                {date.toLocaleDateString()}
              </Text>
              <Icon name="calendar" size={24} color={appTheme.colors.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.dateTimeLabel}>Time:</Text>
              <Text style={styles.dateTimeValue}>
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Icon name="clock-outline" size={24} color={appTheme.colors.primary} />
            </TouchableOpacity>
          </View>
          
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          
          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
          
          <Button 
            mode="outlined" 
            icon="file-document-outline" 
            onPress={() => setShowTemplateDialog(true)}
            style={styles.templateButton}
          >
            Load from Template
          </Button>
        </Card.Content>
      </Card>
      
      <View style={styles.sectionHeader}>
        <Title style={styles.sectionTitle}>Sections</Title>
        <Button 
          mode="contained" 
          icon="plus" 
          onPress={() => {
            setNewSectionTitle('');
            setEditingSectionIndex(-1);
            setShowAddSectionDialog(true);
          }}
          style={styles.addButton}
        >
          Add Section
        </Button>
      </View>
      
      {sections.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Card.Content style={styles.emptyContent}>
            <Icon name="clipboard-text-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No sections added yet</Text>
            <Text style={styles.emptySubtext}>Add sections and items to create your audit</Text>
          </Card.Content>
        </Card>
      ) : (
        sections.map((section, sectionIndex) => (
          <Card key={section.id} style={styles.sectionCard}>
            <Card.Content>
              <View style={styles.sectionCardHeader}>
                <Title style={styles.sectionCardTitle}>{section.title}</Title>
                <View style={styles.sectionActions}>
                  <IconButton 
                    icon="pencil" 
                    size={20} 
                    color={appTheme.colors.primary}
                    onPress={() => handleEditSection(sectionIndex)}
                  />
                  <IconButton 
                    icon="delete" 
                    size={20} 
                    color="#f44336"
                    onPress={() => handleDeleteSection(sectionIndex)}
                  />
                </View>
              </View>
              
              <Divider style={styles.divider} />
              
              {section.items.map((item, itemIndex) => (
                <View key={item.id} style={styles.itemContainer}>
                  <View style={styles.itemContent}>
                    <Text style={styles.itemNumber}>{itemIndex + 1}.</Text>
                    <Text style={styles.itemQuestion}>{item.question}</Text>
                  </View>
                  <View style={styles.itemActions}>
                    <IconButton 
                      icon="pencil" 
                      size={16} 
                      color={appTheme.colors.primary}
                      onPress={() => handleEditItem(sectionIndex, itemIndex)}
                    />
                    <IconButton 
                      icon="delete" 
                      size={16} 
                      color="#f44336"
                      onPress={() => handleDeleteItem(sectionIndex, itemIndex)}
                    />
                  </View>
                </View>
              ))}
              
              <Button 
                mode="outlined" 
                icon="plus" 
                onPress={() => {
                  setNewItemQuestion('');
                  setEditingSection(sectionIndex);
                  setEditingItemIndex(-1);
                  setShowAddItemDialog(true);
                }}
                style={styles.addItemButton}
              >
                Add Item
              </Button>
            </Card.Content>
          </Card>
        ))
      )}
      
      <Button 
        mode="contained" 
        icon="content-save" 
        onPress={handleSaveAudit}
        style={styles.saveButton}
      >
        Save Audit
      </Button>
      
      {/* Template Dialog */}
      <Portal>
        <Dialog
          visible={showTemplateDialog}
          onDismiss={() => setShowTemplateDialog(false)}
        >
          <Dialog.Title>Select Template</Dialog.Title>
          <Dialog.Content>
            {auditTemplates.map(template => (
              <List.Item
                key={template.id}
                title={template.title}
                description={`${template.sections.length} sections, ${template.sections.reduce((total, section) => total + section.items.length, 0)} items`}
                left={props => <List.Icon {...props} icon="file-document-outline" />}
                onPress={() => loadTemplate(template.id)}
              />
            ))}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowTemplateDialog(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* Add Section Dialog */}
      <Portal>
        <Dialog
          visible={showAddSectionDialog}
          onDismiss={() => setShowAddSectionDialog(false)}
        >
          <Dialog.Title>
            {editingSectionIndex >= 0 ? 'Edit Section' : 'Add New Section'}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Section Title"
              value={newSectionTitle}
              onChangeText={setNewSectionTitle}
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddSectionDialog(false)}>Cancel</Button>
            <Button onPress={handleAddSection}>
              {editingSectionIndex >= 0 ? 'Update' : 'Add'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* Add Item Dialog */}
      <Portal>
        <Dialog
          visible={showAddItemDialog}
          onDismiss={() => setShowAddItemDialog(false)}
        >
          <Dialog.Title>
            {editingItemIndex >= 0 ? 'Edit Item' : 'Add New Item'}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Question"
              value={newItemQuestion}
              onChangeText={setNewItemQuestion}
              style={styles.dialogInput}
              multiline
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddItemDialog(false)}>Cancel</Button>
            <Button onPress={handleAddItem}>
              {editingItemIndex >= 0 ? 'Update' : 'Add'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 12,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 4,
  },
  dateTimeLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  dateTimeValue: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  templateButton: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    borderRadius: 20,
    height: 40,
    paddingHorizontal: 12,
  },
  emptyCard: {
    margin: 16,
    borderRadius: 8,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  sectionCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  sectionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionCardTitle: {
    fontSize: 16,
  },
  sectionActions: {
    flexDirection: 'row',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemContent: {
    flexDirection: 'row',
    flex: 1,
  },
  itemNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
    color: '#666',
  },
  itemQuestion: {
    fontSize: 14,
    flex: 1,
  },
  itemActions: {
    flexDirection: 'row',
  },
  addItemButton: {
    marginTop: 16,
  },
  saveButton: {
    margin: 16,
    marginTop: 8,
    paddingVertical: 8,
  },
  dialogInput: {
    backgroundColor: '#fff',
  },
});

export default AuditEditScreen;`;

  fs.writeFileSync(path.join(dirPath, 'AuditEditScreen.tsx'), content, 'utf8');
  console.log('Fixed AuditEditScreen.tsx');
};

// Run the function
console.log('Fixing AuditEditScreen...');
fixAuditEditScreen();
console.log('AuditEditScreen fixed successfully!');
