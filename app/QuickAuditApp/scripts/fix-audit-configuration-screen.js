/**
 * Script to fix TypeScript errors in AuditConfigurationScreen
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

// Fix AuditConfigurationScreen.tsx
const fixAuditConfigurationScreen = () => {
  const dirPath = path.join(process.cwd(), 'src/screens/field_auditor');
  ensureDirectoryExists(dirPath);
  
  const content = `/**
 * Audit Configuration Screen
 * Screen for configuring audit settings and preferences
 */

import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Alert,
  Switch
} from 'react-native';
import { 
  Surface, 
  Text, 
  Title, 
  Subheading, 
  Divider,
  Card,
  List,
  Button,
  Checkbox,
  RadioButton
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appTheme } from '../../theme/webAppTheme';

const AuditConfigurationScreen = ({ navigation }) => {
  // General settings
  const [autoSave, setAutoSave] = useState(true);
  const [autoSaveInterval, setAutoSaveInterval] = useState(5); // minutes
  const [offlineMode, setOfflineMode] = useState(true);
  const [requirePhotos, setRequirePhotos] = useState(false);
  const [requireNotes, setRequireNotes] = useState(false);
  
  // Notification settings
  const [notifyOnAssignment, setNotifyOnAssignment] = useState(true);
  const [notifyOnDueDate, setNotifyOnDueDate] = useState(true);
  const [notifyOnCompletion, setNotifyOnCompletion] = useState(true);
  const [notifyOnFinding, setNotifyOnFinding] = useState(true);
  
  // Display settings
  const [defaultView, setDefaultView] = useState('list');
  const [sortBy, setSortBy] = useState('dueDate');
  const [showCompletedAudits, setShowCompletedAudits] = useState(true);
  
  const handleSaveSettings = () => {
    // In a real app, we would save these settings to the user's profile
    Alert.alert('Success', 'Settings saved successfully');
    navigation.goBack();
  };
  
  const handleResetDefaults = () => {
    Alert.alert(
      'Reset to Defaults',
      'Are you sure you want to reset all settings to their default values?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          onPress: () => {
            // Reset all settings to defaults
            setAutoSave(true);
            setAutoSaveInterval(5);
            setOfflineMode(true);
            setRequirePhotos(false);
            setRequireNotes(false);
            setNotifyOnAssignment(true);
            setNotifyOnDueDate(true);
            setNotifyOnCompletion(true);
            setNotifyOnFinding(true);
            setDefaultView('list');
            setSortBy('dueDate');
            setShowCompletedAudits(true);
            
            Alert.alert('Success', 'Settings reset to defaults');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.header}>
        <Title style={styles.headerTitle}>Audit Configuration</Title>
        <Text style={styles.headerSubtitle}>
          Configure your audit settings and preferences
        </Text>
      </Surface>
      
      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>General Settings</Title>
            <Divider style={styles.divider} />
            
            <List.Item
              title="Auto-save"
              description="Automatically save audit progress"
              left={props => <List.Icon {...props} icon="content-save-outline" />}
              right={() => (
                <Switch
                  value={autoSave}
                  onValueChange={setAutoSave}
                  color={appTheme.colors.primary}
                />
              )}
            />
            
            {autoSave && (
              <View style={styles.subSetting}>
                <Text style={styles.subSettingLabel}>
                  Auto-save interval (minutes):
                </Text>
                <View style={styles.intervalButtons}>
                  {[1, 5, 10, 15, 30].map(interval => (
                    <TouchableOpacity
                      key={interval}
                      style={[
                        styles.intervalButton,
                        autoSaveInterval === interval && styles.intervalButtonSelected
                      ]}
                      onPress={() => setAutoSaveInterval(interval)}
                    >
                      <Text
                        style={[
                          styles.intervalButtonText,
                          autoSaveInterval === interval && styles.intervalButtonTextSelected
                        ]}
                      >
                        {interval}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            
            <List.Item
              title="Offline Mode"
              description="Enable working without internet connection"
              left={props => <List.Icon {...props} icon="wifi-off" />}
              right={() => (
                <Switch
                  value={offlineMode}
                  onValueChange={setOfflineMode}
                  color={appTheme.colors.primary}
                />
              )}
            />
            
            <List.Item
              title="Require Photos"
              description="Make photo evidence mandatory for findings"
              left={props => <List.Icon {...props} icon="camera" />}
              right={() => (
                <Switch
                  value={requirePhotos}
                  onValueChange={setRequirePhotos}
                  color={appTheme.colors.primary}
                />
              )}
            />
            
            <List.Item
              title="Require Notes"
              description="Make notes mandatory for findings"
              left={props => <List.Icon {...props} icon="note-text" />}
              right={() => (
                <Switch
                  value={requireNotes}
                  onValueChange={setRequireNotes}
                  color={appTheme.colors.primary}
                />
              )}
            />
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Notification Settings</Title>
            <Divider style={styles.divider} />
            
            <List.Item
              title="Audit Assignment"
              description="Notify when you're assigned to an audit"
              left={props => <List.Icon {...props} icon="account-check" />}
              right={() => (
                <Switch
                  value={notifyOnAssignment}
                  onValueChange={setNotifyOnAssignment}
                  color={appTheme.colors.primary}
                />
              )}
            />
            
            <List.Item
              title="Due Date Reminders"
              description="Notify when an audit is approaching its due date"
              left={props => <List.Icon {...props} icon="calendar-clock" />}
              right={() => (
                <Switch
                  value={notifyOnDueDate}
                  onValueChange={setNotifyOnDueDate}
                  color={appTheme.colors.primary}
                />
              )}
            />
            
            <List.Item
              title="Audit Completion"
              description="Notify when an audit is marked as complete"
              left={props => <List.Icon {...props} icon="check-circle" />}
              right={() => (
                <Switch
                  value={notifyOnCompletion}
                  onValueChange={setNotifyOnCompletion}
                  color={appTheme.colors.primary}
                />
              )}
            />
            
            <List.Item
              title="New Findings"
              description="Notify when new findings are added to your audits"
              left={props => <List.Icon {...props} icon="alert-circle" />}
              right={() => (
                <Switch
                  value={notifyOnFinding}
                  onValueChange={setNotifyOnFinding}
                  color={appTheme.colors.primary}
                />
              )}
            />
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Display Settings</Title>
            <Divider style={styles.divider} />
            
            <Subheading style={styles.subheading}>Default View</Subheading>
            <RadioButton.Group onValueChange={setDefaultView} value={defaultView}>
              <View style={styles.radioGroup}>
                <View style={styles.radioOption}>
                  <RadioButton value="list" color={appTheme.colors.primary} />
                  <Text>List View</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton value="calendar" color={appTheme.colors.primary} />
                  <Text>Calendar View</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton value="kanban" color={appTheme.colors.primary} />
                  <Text>Kanban View</Text>
                </View>
              </View>
            </RadioButton.Group>
            
            <Subheading style={styles.subheading}>Sort Audits By</Subheading>
            <RadioButton.Group onValueChange={setSortBy} value={sortBy}>
              <View style={styles.radioGroup}>
                <View style={styles.radioOption}>
                  <RadioButton value="dueDate" color={appTheme.colors.primary} />
                  <Text>Due Date</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton value="priority" color={appTheme.colors.primary} />
                  <Text>Priority</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton value="title" color={appTheme.colors.primary} />
                  <Text>Title</Text>
                </View>
              </View>
            </RadioButton.Group>
            
            <List.Item
              title="Show Completed Audits"
              description="Display completed audits in the list"
              left={props => <List.Icon {...props} icon="eye" />}
              right={() => (
                <Switch
                  value={showCompletedAudits}
                  onValueChange={setShowCompletedAudits}
                  color={appTheme.colors.primary}
                />
              )}
            />
          </Card.Content>
        </Card>
        
        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            onPress={handleSaveSettings}
            style={styles.saveButton}
          >
            Save Settings
          </Button>
          <Button 
            mode="outlined" 
            onPress={handleResetDefaults}
            style={styles.resetButton}
          >
            Reset to Defaults
          </Button>
        </View>
      </ScrollView>
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
    backgroundColor: appTheme.colors.primary,
    elevation: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
  },
  divider: {
    marginVertical: 12,
  },
  subSetting: {
    paddingLeft: 72,
    paddingRight: 16,
    marginBottom: 16,
  },
  subSettingLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  intervalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  intervalButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  intervalButtonSelected: {
    backgroundColor: appTheme.colors.primary,
    borderColor: appTheme.colors.primary,
  },
  intervalButtonText: {
    fontSize: 14,
    color: '#666',
  },
  intervalButtonTextSelected: {
    color: '#fff',
  },
  subheading: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '33%',
    marginBottom: 8,
  },
  buttonContainer: {
    padding: 16,
    paddingTop: 8,
  },
  saveButton: {
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: appTheme.colors.primary,
  },
  resetButton: {
    paddingVertical: 8,
  },
});

export default AuditConfigurationScreen;`;

  fs.writeFileSync(path.join(dirPath, 'AuditConfigurationScreen.tsx'), content, 'utf8');
  console.log('Fixed AuditConfigurationScreen.tsx');
};

// Run the function
console.log('Fixing AuditConfigurationScreen...');
fixAuditConfigurationScreen();
console.log('AuditConfigurationScreen fixed successfully!');
