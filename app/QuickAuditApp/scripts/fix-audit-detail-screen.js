/**
 * Script to fix TypeScript errors in AuditDetailScreen
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

// Fix AuditDetailScreen.tsx
const fixAuditDetailScreen = () => {
  const dirPath = path.join(process.cwd(), 'src/screens/field_auditor');
  ensureDirectoryExists(dirPath);
  
  const content = `/**
 * Audit Detail Screen
 * Screen for field auditors to view details of a specific audit
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
  Card, 
  Title, 
  Paragraph, 
  Button, 
  Divider,
  Badge,
  List,
  Avatar,
  Portal,
  Dialog,
  IconButton
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appTheme } from '../../theme/webAppTheme';

// Mock data for the audit details
const mockAuditDetails = {
  id: 'A1001',
  title: 'Monthly Fire Safety Inspection',
  location: 'Main Building, Floor 3',
  date: '2023-05-20',
  time: '10:30 AM',
  status: 'In Progress',
  completionPercentage: 65,
  assignedTo: {
    id: 'U1',
    name: 'John Smith',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  createdBy: {
    id: 'U2',
    name: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  sections: [
    {
      id: 'S1',
      title: 'Fire Extinguishers',
      completedItems: 3,
      totalItems: 3,
      score: 100
    },
    {
      id: 'S2',
      title: 'Emergency Exits',
      completedItems: 2,
      totalItems: 3,
      score: 67
    },
    {
      id: 'S3',
      title: 'Fire Alarms',
      completedItems: 0,
      totalItems: 2,
      score: 0
    }
  ],
  findings: [
    {
      id: 'F1',
      title: 'Emergency exit sign not illuminated',
      severity: 'High',
      status: 'Open',
      section: 'Emergency Exits',
      dateIdentified: '2023-05-20',
      assignedTo: 'Maintenance Team'
    },
    {
      id: 'F2',
      title: 'Fire extinguisher pressure gauge reading low',
      severity: 'Medium',
      status: 'In Progress',
      section: 'Fire Extinguishers',
      dateIdentified: '2023-05-20',
      assignedTo: 'Safety Officer'
    }
  ],
  notes: [
    {
      id: 'N1',
      text: 'Building manager was present during the inspection',
      author: 'John Smith',
      date: '2023-05-20 10:45 AM'
    },
    {
      id: 'N2',
      text: 'Maintenance team scheduled to fix emergency exit sign on May 25',
      author: 'John Smith',
      date: '2023-05-20 11:15 AM'
    }
  ]
};

const AuditDetailScreen = ({ navigation, route }) => {
  // In a real app, we would get the audit ID from route params and fetch the data
  const [auditDetails, setAuditDetails] = useState(mockAuditDetails);
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
      case 'Closed':
        return '#757575';
      default:
        return '#757575';
    }
  };
  
  const handleDeleteAudit = () => {
    // Delete audit logic would go here
    setShowDeleteDialog(false);
    Alert.alert('Success', 'Audit deleted successfully');
    navigation.goBack();
  };
  
  const handleEditAudit = () => {
    navigation.navigate('AuditEdit', { auditId: auditDetails.id });
  };
  
  const handleContinueAudit = () => {
    navigation.navigate('AuditExecution', { auditId: auditDetails.id });
  };
  
  const handleViewReport = () => {
    navigation.navigate('ReportSummary', { auditId: auditDetails.id });
  };
  
  const handleViewFinding = (findingId) => {
    navigation.navigate('FindingDetails', { findingId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.headerRow}>
              <View>
                <Title style={styles.title}>{auditDetails.title}</Title>
                <Paragraph style={styles.location}>{auditDetails.location}</Paragraph>
                <View style={styles.dateTimeRow}>
                  <Icon name="calendar" size={16} color="#666" style={styles.icon} />
                  <Text style={styles.dateTime}>{auditDetails.date}</Text>
                  <Icon name="clock-outline" size={16} color="#666" style={styles.icon} />
                  <Text style={styles.dateTime}>{auditDetails.time}</Text>
                </View>
              </View>
              <View style={styles.statusContainer}>
                <Badge 
                  style={[
                    styles.statusBadge, 
                    { backgroundColor: getStatusColor(auditDetails.status) }
                  ]}
                >
                  {auditDetails.status}
                </Badge>
                <Text style={styles.completionText}>
                  {auditDetails.completionPercentage}% Complete
                </Text>
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.assignmentRow}>
              <View style={styles.assignmentItem}>
                <Text style={styles.assignmentLabel}>Assigned to:</Text>
                <View style={styles.userRow}>
                  <Avatar.Image 
                    size={24} 
                    source={{ uri: auditDetails.assignedTo.avatar }} 
                    style={styles.avatar}
                  />
                  <Text style={styles.userName}>{auditDetails.assignedTo.name}</Text>
                </View>
              </View>
              <View style={styles.assignmentItem}>
                <Text style={styles.assignmentLabel}>Created by:</Text>
                <View style={styles.userRow}>
                  <Avatar.Image 
                    size={24} 
                    source={{ uri: auditDetails.createdBy.avatar }} 
                    style={styles.avatar}
                  />
                  <Text style={styles.userName}>{auditDetails.createdBy.name}</Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <View style={styles.actionButtonsContainer}>
          <Button 
            mode="contained" 
            icon="play" 
            onPress={handleContinueAudit}
            style={[styles.actionButton, styles.continueButton]}
          >
            Continue Audit
          </Button>
          <Button 
            mode="outlined" 
            icon="file-document-outline" 
            onPress={handleViewReport}
            style={styles.actionButton}
          >
            View Report
          </Button>
        </View>
        
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Sections</Title>
            <Divider style={styles.divider} />
            
            {auditDetails.sections.map(section => (
              <View key={section.id} style={styles.sectionItem}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionName}>{section.title}</Text>
                  <Badge style={[
                    styles.sectionScore,
                    { 
                      backgroundColor: 
                        section.score >= 80 ? '#4caf50' : 
                        section.score >= 60 ? '#ff9800' : '#f44336' 
                    }
                  ]}>
                    {section.score}%
                  </Badge>
                </View>
                <Text style={styles.sectionProgress}>
                  {section.completedItems} of {section.totalItems} items completed
                </Text>
              </View>
            ))}
          </Card.Content>
        </Card>
        
        <Card style={styles.findingsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Findings</Title>
            <Divider style={styles.divider} />
            
            {auditDetails.findings.length > 0 ? (
              auditDetails.findings.map(finding => (
                <TouchableOpacity 
                  key={finding.id} 
                  style={styles.findingItem}
                  onPress={() => handleViewFinding(finding.id)}
                >
                  <View style={styles.findingHeader}>
                    <Text style={styles.findingTitle}>{finding.title}</Text>
                    <Badge 
                      style={[
                        styles.severityBadge, 
                        { backgroundColor: getSeverityColor(finding.severity) }
                      ]}
                    >
                      {finding.severity}
                    </Badge>
                  </View>
                  <View style={styles.findingDetails}>
                    <Text style={styles.findingSection}>{finding.section}</Text>
                    <Badge 
                      style={[
                        styles.findingStatusBadge, 
                        { backgroundColor: getFindingStatusColor(finding.status) }
                      ]}
                    >
                      {finding.status}
                    </Badge>
                  </View>
                  <Text style={styles.findingAssigned}>
                    Assigned to: {finding.assignedTo}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>No findings recorded</Text>
            )}
          </Card.Content>
        </Card>
        
        <Card style={styles.notesCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Notes</Title>
            <Divider style={styles.divider} />
            
            {auditDetails.notes.length > 0 ? (
              auditDetails.notes.map(note => (
                <View key={note.id} style={styles.noteItem}>
                  <Text style={styles.noteText}>{note.text}</Text>
                  <View style={styles.noteFooter}>
                    <Text style={styles.noteAuthor}>{note.author}</Text>
                    <Text style={styles.noteDate}>{note.date}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No notes recorded</Text>
            )}
          </Card.Content>
        </Card>
        
        <View style={styles.managementButtonsContainer}>
          <Button 
            mode="outlined" 
            icon="pencil" 
            onPress={handleEditAudit}
            style={styles.managementButton}
          >
            Edit Audit
          </Button>
          <Button 
            mode="outlined" 
            icon="delete" 
            onPress={() => setShowDeleteDialog(true)}
            style={[styles.managementButton, styles.deleteButton]}
            color="#f44336"
          >
            Delete Audit
          </Button>
        </View>
      </ScrollView>
      
      <Portal>
        <Dialog
          visible={showDeleteDialog}
          onDismiss={() => setShowDeleteDialog(false)}
        >
          <Dialog.Title>Delete Audit</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Are you sure you want to delete this audit? This action cannot be undone.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button onPress={handleDeleteAudit} color="#f44336">Delete</Button>
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
  headerCard: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTime: {
    fontSize: 14,
    color: '#666',
    marginRight: 16,
  },
  icon: {
    marginRight: 4,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    marginBottom: 4,
  },
  completionText: {
    fontSize: 12,
    color: '#666',
  },
  divider: {
    marginVertical: 12,
  },
  assignmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  assignmentItem: {
    flex: 1,
  },
  assignmentLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 8,
  },
  userName: {
    fontSize: 14,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  continueButton: {
    backgroundColor: appTheme.colors.primary,
  },
  sectionCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionScore: {
    fontSize: 12,
  },
  sectionProgress: {
    fontSize: 12,
    color: '#666',
  },
  findingsCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  findingItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  findingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  findingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  severityBadge: {
    fontSize: 10,
  },
  findingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  findingSection: {
    fontSize: 12,
    color: '#666',
  },
  findingStatusBadge: {
    fontSize: 10,
  },
  findingAssigned: {
    fontSize: 12,
    color: '#666',
  },
  notesCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  noteItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  noteText: {
    fontSize: 14,
    marginBottom: 4,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noteAuthor: {
    fontSize: 12,
    color: '#666',
  },
  noteDate: {
    fontSize: 12,
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
  managementButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  managementButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  deleteButton: {
    borderColor: '#f44336',
  },
});

export default AuditDetailScreen;`;

  fs.writeFileSync(path.join(dirPath, 'AuditDetailScreen.tsx'), content, 'utf8');
  console.log('Fixed AuditDetailScreen.tsx');
};

// Run the function
console.log('Fixing AuditDetailScreen...');
fixAuditDetailScreen();
console.log('AuditDetailScreen fixed successfully!');
