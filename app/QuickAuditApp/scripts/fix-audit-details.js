/**
 * Script to fix TypeScript errors in AuditDetails
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

// Fix AuditDetails.tsx
const fixAuditDetails = () => {
  const dirPath = path.join(process.cwd(), 'src/screens');
  ensureDirectoryExists(dirPath);
  
  const content = `/**
 * Audit Details Screen
 * Shows detailed information about an audit
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  Divider,
  Chip,
  ProgressBar,
  List,
  IconButton,
  Menu,
  Dialog,
  Paragraph
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appTheme } from '../theme/webAppTheme';

// Mock data for the audit
const auditData = {
  id: 'A1001',
  title: 'Monthly Fire Safety Inspection',
  location: 'Main Building, Floor 3',
  date: '2023-05-15',
  dueDate: '2023-05-25',
  status: 'In Progress',
  progress: 0.65,
  assignedTo: 'John Smith',
  template: 'Fire Safety Inspection',
  sections: [
    {
      id: 'S1',
      title: 'Fire Extinguishers',
      progress: 1.0,
      items: 3,
      completedItems: 3
    },
    {
      id: 'S2',
      title: 'Emergency Exits',
      progress: 0.67,
      items: 3,
      completedItems: 2
    },
    {
      id: 'S3',
      title: 'Fire Alarms',
      progress: 0.5,
      items: 2,
      completedItems: 1
    },
    {
      id: 'S4',
      title: 'Evacuation Plans',
      progress: 0.5,
      items: 4,
      completedItems: 2
    }
  ],
  findings: [
    {
      id: 'F1',
      title: 'Emergency exit sign not illuminated',
      severity: 'High',
      status: 'Open',
      location: 'East Corridor',
      dateIdentified: '2023-05-15'
    },
    {
      id: 'F2',
      title: 'Fire extinguisher past inspection date',
      severity: 'Medium',
      status: 'In Progress',
      location: 'Break Room',
      dateIdentified: '2023-05-15'
    }
  ]
};

const AuditDetails = ({ navigation, route }) => {
  // In a real app, we would get the audit ID from route params and fetch the data
  const [audit, setAudit] = useState(auditData);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return '#4caf50';
      case 'In Progress':
        return '#2196f3';
      case 'Not Started':
        return '#757575';
      case 'Overdue':
        return '#f44336';
      default:
        return '#757575';
    }
  };
  
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High':
        return '#f44336';
      case 'Medium':
        return '#ff9800';
      case 'Low':
        return '#4caf50';
      default:
        return '#757575';
    }
  };
  
  const getFindingStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return '#f44336';
      case 'In Progress':
        return '#2196f3';
      case 'Resolved':
        return '#4caf50';
      default:
        return '#757575';
    }
  };
  
  const handleContinueAudit = () => {
    navigation.navigate('AuditExecution', { auditId: audit.id });
  };
  
  const handleEditAudit = () => {
    setMenuVisible(false);
    navigation.navigate('EditAudit', { auditId: audit.id });
  };
  
  const handleDuplicateAudit = () => {
    setMenuVisible(false);
    navigation.navigate('CreateAudit', { 
      duplicateFrom: audit.id,
      template: audit.template,
      location: audit.location
    });
  };
  
  const handleDeleteAudit = () => {
    // Delete audit logic would go here
    setShowDeleteDialog(false);
    Alert.alert('Success', 'Audit deleted successfully');
    navigation.goBack();
  };
  
  const handleViewFinding = (findingId) => {
    navigation.navigate('FindingDetails', { findingId });
  };
  
  const handleAddFinding = () => {
    navigation.navigate('AddFinding', { auditId: audit.id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Title style={styles.headerTitle}>{audit.title}</Title>
          <Text style={styles.headerSubtitle}>{audit.location}</Text>
          <View style={styles.statusContainer}>
            <Chip 
              style={[styles.statusChip, { backgroundColor: getStatusColor(audit.status) }]}
              textStyle={styles.statusChipText}
            >
              {audit.status}
            </Chip>
            <Text style={styles.dateText}>Due: {audit.dueDate}</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <IconButton
            icon="dots-vertical"
            size={24}
            color={appTheme.colors.primary}
            onPress={() => setMenuVisible(true)}
          />
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={{ x: 0, y: 0 }}
            style={styles.menu}
          >
            <Menu.Item
              icon="pencil"
              onPress={handleEditAudit}
              title="Edit Audit"
            />
            <Menu.Item
              icon="content-copy"
              onPress={handleDuplicateAudit}
              title="Duplicate"
            />
            <Divider />
            <Menu.Item
              icon="delete"
              onPress={() => {
                setMenuVisible(false);
                setShowDeleteDialog(true);
              }}
              title="Delete"
              titleStyle={{ color: '#f44336' }}
            />
          </Menu>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        <Card style={styles.progressCard}>
          <Card.Content>
            <View style={styles.progressHeader}>
              <Title style={styles.sectionTitle}>Progress</Title>
              <Text style={styles.progressText}>{Math.round(audit.progress * 100)}%</Text>
            </View>
            <ProgressBar 
              progress={audit.progress} 
              color={appTheme.colors.primary} 
              style={styles.progressBar} 
            />
            <View style={styles.assignedContainer}>
              <Text style={styles.assignedLabel}>Assigned to:</Text>
              <Text style={styles.assignedUser}>{audit.assignedTo}</Text>
            </View>
            <Button 
              mode="contained" 
              icon="clipboard-check-outline" 
              onPress={handleContinueAudit}
              style={styles.continueButton}
            >
              Continue Audit
            </Button>
          </Card.Content>
        </Card>
        
        <Card style={styles.sectionsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Sections</Title>
            <Divider style={styles.divider} />
            
            {audit.sections.map(section => (
              <TouchableOpacity 
                key={section.id} 
                style={styles.sectionItem}
                onPress={() => navigation.navigate('SectionDetails', { sectionId: section.id, auditId: audit.id })}
              >
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionName}>{section.title}</Text>
                  <Text style={styles.sectionProgress}>
                    {section.completedItems}/{section.items} items
                  </Text>
                </View>
                <ProgressBar 
                  progress={section.progress} 
                  color={appTheme.colors.primary} 
                  style={styles.sectionProgressBar} 
                />
              </TouchableOpacity>
            ))}
          </Card.Content>
        </Card>
        
        <Card style={styles.findingsCard}>
          <Card.Content>
            <View style={styles.findingsHeader}>
              <Title style={styles.sectionTitle}>Findings</Title>
              <Button 
                mode="outlined" 
                icon="plus" 
                onPress={handleAddFinding}
                style={styles.addButton}
              >
                Add Finding
              </Button>
            </View>
            <Divider style={styles.divider} />
            
            {audit.findings.length > 0 ? (
              audit.findings.map(finding => (
                <TouchableOpacity 
                  key={finding.id} 
                  style={styles.findingItem}
                  onPress={() => handleViewFinding(finding.id)}
                >
                  <View style={styles.findingHeader}>
                    <Text style={styles.findingTitle}>{finding.title}</Text>
                    <Chip 
                      style={[
                        styles.severityChip, 
                        { backgroundColor: getSeverityColor(finding.severity) }
                      ]}
                      textStyle={styles.chipText}
                    >
                      {finding.severity}
                    </Chip>
                  </View>
                  <View style={styles.findingDetails}>
                    <Text style={styles.findingLocation}>{finding.location}</Text>
                    <Chip 
                      style={[
                        styles.statusChip, 
                        { backgroundColor: getFindingStatusColor(finding.status) }
                      ]}
                      textStyle={styles.chipText}
                    >
                      {finding.status}
                    </Chip>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>No findings recorded</Text>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
      
      <Dialog
        visible={showDeleteDialog}
        onDismiss={() => setShowDeleteDialog(false)}
      >
        <Dialog.Title>Delete Audit</Dialog.Title>
        <Dialog.Content>
          <Paragraph>Are you sure you want to delete this audit? This action cannot be undone.</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onPress={handleDeleteAudit} color="#f44336">Delete</Button>
        </Dialog.Actions>
      </Dialog>
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
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusChip: {
    height: 24,
    marginRight: 8,
  },
  statusChipText: {
    fontSize: 10,
    color: '#fff',
  },
  dateText: {
    color: '#666',
    fontSize: 12,
  },
  headerActions: {
    alignItems: 'flex-end',
  },
  menu: {
    width: 200,
  },
  content: {
    flex: 1,
  },
  progressCard: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  assignedContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  assignedLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  assignedUser: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  continueButton: {
    marginTop: 16,
    backgroundColor: appTheme.colors.primary,
  },
  sectionsCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  divider: {
    marginVertical: 12,
  },
  sectionItem: {
    marginBottom: 16,
    paddingBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionProgress: {
    fontSize: 14,
    color: '#666',
  },
  sectionProgressBar: {
    height: 6,
    borderRadius: 3,
  },
  findingsCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 8,
  },
  findingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    borderColor: appTheme.colors.primary,
  },
  findingItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  findingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  findingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  severityChip: {
    height: 24,
  },
  chipText: {
    fontSize: 10,
    color: '#fff',
  },
  findingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  findingLocation: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
});

export default AuditDetails;`;

  fs.writeFileSync(path.join(dirPath, 'AuditDetails.tsx'), content, 'utf8');
  console.log('Fixed AuditDetails.tsx');
};

// Run the function
console.log('Fixing AuditDetails...');
fixAuditDetails();
console.log('AuditDetails fixed successfully!');
