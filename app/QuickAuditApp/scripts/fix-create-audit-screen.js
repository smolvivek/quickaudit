/**
 * Script to fix TypeScript errors in CreateAuditScreen
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

// Fix CreateAuditScreen.tsx
const fixCreateAuditScreen = () => {
  const dirPath = path.join(process.cwd(), 'src/screens');
  ensureDirectoryExists(dirPath);
  
  const content = `/**
 * Create Audit Screen
 * Screen for creating a new audit
 */

import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Alert
} from 'react-native';
import { 
  TextInput, 
  Button, 
  Card, 
  Title, 
  Divider,
  RadioButton,
  Menu,
  List,
  Text
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appTheme } from '../theme/webAppTheme';

// Mock data for templates
const auditTemplates = [
  {
    id: 'T1',
    title: 'Fire Safety Inspection',
    description: 'Comprehensive fire safety audit template with 25 checkpoints',
    category: 'Safety',
    lastUsed: '2023-04-15'
  },
  {
    id: 'T2',
    title: 'Health & Safety Audit',
    description: 'General workplace health and safety compliance check',
    category: 'Safety',
    lastUsed: '2023-05-02'
  },
  {
    id: 'T3',
    title: 'IT Security Audit',
    description: 'Information security and data protection assessment',
    category: 'IT',
    lastUsed: '2023-03-20'
  },
  {
    id: 'T4',
    title: 'Quality Control Inspection',
    description: 'Manufacturing quality control process verification',
    category: 'Quality',
    lastUsed: '2023-05-10'
  }
];

// Mock data for locations
const locations = [
  {
    id: 'L1',
    name: 'Main Building',
    address: '123 Corporate Park, Suite 100, San Francisco, CA 94107',
    lastAudit: '2023-04-20'
  },
  {
    id: 'L2',
    name: 'Warehouse Facility',
    address: '456 Industrial Blvd, Oakland, CA 94621',
    lastAudit: '2023-03-15'
  },
  {
    id: 'L3',
    name: 'Research Lab',
    address: '789 Innovation Way, Palo Alto, CA 94301',
    lastAudit: '2023-05-05'
  }
];

// Mock data for auditors
const auditors = [
  {
    id: 'U1',
    name: 'John Smith',
    role: 'Safety Officer',
    email: 'john.smith@example.com'
  },
  {
    id: 'U2',
    name: 'Sarah Johnson',
    role: 'Quality Inspector',
    email: 'sarah.johnson@example.com'
  },
  {
    id: 'U3',
    name: 'Michael Brown',
    role: 'Compliance Manager',
    email: 'michael.brown@example.com'
  }
];

const CreateAuditScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showAuditorDialog, setShowAuditorDialog] = useState(false);
  
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
  
  const selectTemplate = (template) => {
    setTitle(template.title);
    setShowTemplateDialog(false);
  };
  
  const selectLocation = (loc) => {
    setLocation(loc.name);
    setShowLocationDialog(false);
  };
  
  const selectAuditor = (auditor) => {
    setAssignedTo(auditor.name);
    setShowAuditorDialog(false);
  };
  
  const handleCreateAudit = () => {
    // Validate form
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an audit title');
      return;
    }
    
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return;
    }
    
    if (!assignedTo.trim()) {
      Alert.alert('Error', 'Please assign the audit to an auditor');
      return;
    }
    
    // In a real app, we would save the audit to the database
    // For now, just show a success message and navigate back
    Alert.alert(
      'Success',
      'Audit created successfully!',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Create New Audit</Title>
            <Divider style={styles.divider} />
            
            <TextInput
              label="Audit Title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              mode="outlined"
            />
            
            <View style={styles.templateButton}>
              <Button 
                mode="outlined" 
                icon="file-document-outline" 
                onPress={() => setShowTemplateDialog(true)}
              >
                Select from Templates
              </Button>
            </View>
            
            <TextInput
              label="Description (Optional)"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
            />
            
            <TextInput
              label="Location"
              value={location}
              onChangeText={setLocation}
              style={styles.input}
              mode="outlined"
            />
            
            <View style={styles.locationButton}>
              <Button 
                mode="outlined" 
                icon="map-marker" 
                onPress={() => setShowLocationDialog(true)}
              >
                Select from Locations
              </Button>
            </View>
            
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
            
            <TextInput
              label="Assigned To"
              value={assignedTo}
              onChangeText={setAssignedTo}
              style={styles.input}
              mode="outlined"
            />
            
            <View style={styles.auditorButton}>
              <Button 
                mode="outlined" 
                icon="account" 
                onPress={() => setShowAuditorDialog(true)}
              >
                Select Auditor
              </Button>
            </View>
            
            <View style={styles.priorityContainer}>
              <Text style={styles.priorityLabel}>Priority:</Text>
              <RadioButton.Group onValueChange={setPriority} value={priority}>
                <View style={styles.priorityOptions}>
                  <View style={styles.priorityOption}>
                    <RadioButton value="Low" color={appTheme.colors.primary} />
                    <Text>Low</Text>
                  </View>
                  <View style={styles.priorityOption}>
                    <RadioButton value="Medium" color={appTheme.colors.primary} />
                    <Text>Medium</Text>
                  </View>
                  <View style={styles.priorityOption}>
                    <RadioButton value="High" color={appTheme.colors.primary} />
                    <Text>High</Text>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
          </Card.Content>
        </Card>
        
        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            onPress={handleCreateAudit}
            style={styles.createButton}
          >
            Create Audit
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
      
      {/* Template Selection Dialog */}
      <Menu
        visible={showTemplateDialog}
        onDismiss={() => setShowTemplateDialog(false)}
        contentStyle={styles.menuContent}
        style={styles.menu}
      >
        <ScrollView style={styles.dialogScrollView}>
          {auditTemplates.map(template => (
            <List.Item
              key={template.id}
              title={template.title}
              description={template.description}
              left={props => <List.Icon {...props} icon="file-document-outline" />}
              onPress={() => selectTemplate(template)}
              style={styles.listItem}
            />
          ))}
        </ScrollView>
      </Menu>
      
      {/* Location Selection Dialog */}
      <Menu
        visible={showLocationDialog}
        onDismiss={() => setShowLocationDialog(false)}
        contentStyle={styles.menuContent}
        style={styles.menu}
      >
        <ScrollView style={styles.dialogScrollView}>
          {locations.map(loc => (
            <List.Item
              key={loc.id}
              title={loc.name}
              description={loc.address}
              left={props => <List.Icon {...props} icon="map-marker" />}
              onPress={() => selectLocation(loc)}
              style={styles.listItem}
            />
          ))}
        </ScrollView>
      </Menu>
      
      {/* Auditor Selection Dialog */}
      <Menu
        visible={showAuditorDialog}
        onDismiss={() => setShowAuditorDialog(false)}
        contentStyle={styles.menuContent}
        style={styles.menu}
      >
        <ScrollView style={styles.dialogScrollView}>
          {auditors.map(auditor => (
            <List.Item
              key={auditor.id}
              title={auditor.name}
              description={auditor.role}
              left={props => <List.Icon {...props} icon="account" />}
              onPress={() => selectAuditor(auditor)}
              style={styles.listItem}
            />
          ))}
        </ScrollView>
      </Menu>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
  },
  divider: {
    marginVertical: 12,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  templateButton: {
    marginBottom: 16,
  },
  locationButton: {
    marginBottom: 16,
  },
  auditorButton: {
    marginBottom: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
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
  priorityContainer: {
    marginBottom: 16,
  },
  priorityLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  priorityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 8,
  },
  createButton: {
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: appTheme.colors.primary,
  },
  cancelButton: {
    paddingVertical: 8,
  },
  menu: {
    width: '90%',
    alignSelf: 'center',
  },
  menuContent: {
    padding: 0,
  },
  dialogScrollView: {
    maxHeight: 300,
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default CreateAuditScreen;`;

  fs.writeFileSync(path.join(dirPath, 'CreateAuditScreen.tsx'), content, 'utf8');
  console.log('Fixed CreateAuditScreen.tsx');
};

// Run the function
console.log('Fixing CreateAuditScreen...');
fixCreateAuditScreen();
console.log('CreateAuditScreen fixed successfully!');
