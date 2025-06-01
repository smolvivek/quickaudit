/**
 * Audit Creation Screen
 * Screen for field auditors to create a new audit
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
  TextInput, 
  Button, 
  Card, 
  Title, 
  Divider,
  Portal,
  Dialog,
  Paragraph,
  List,
  RadioButton
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appTheme } from '../../theme/webAppTheme';

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

const AuditCreationScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  
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
            
            <TextInput
              label="Notes"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              style={styles.notesInput}
              mode="outlined"
            />
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
      <Portal>
        <Dialog
          visible={showTemplateDialog}
          onDismiss={() => setShowTemplateDialog(false)}
        >
          <Dialog.Title>Select Template</Dialog.Title>
          <Dialog.Content>
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
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowTemplateDialog(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* Location Selection Dialog */}
      <Portal>
        <Dialog
          visible={showLocationDialog}
          onDismiss={() => setShowLocationDialog(false)}
        >
          <Dialog.Title>Select Location</Dialog.Title>
          <Dialog.Content>
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
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowLocationDialog(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  notesInput: {
    marginBottom: 8,
    backgroundColor: '#fff',
    height: 100,
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
  dialogScrollView: {
    maxHeight: 300,
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default AuditCreationScreen;