/**
 * Audit Details Screen
 * Displays detailed information about a specific audit
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Share
} from 'react-native';
import {
  Surface,
  Text,
  Title,
  Subheading,
  Card,
  Button,
  Divider,
  ProgressBar,
  Chip,
  Avatar,
  IconButton,
  Menu,
  Dialog,
  Paragraph
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appTheme } from '../theme/webAppTheme';

// Mock data for the audit details
const auditData = {
  id: 'A1001',
  title: 'Monthly Fire Safety Inspection',
  location: 'Main Building, Floor 3',
  date: '2023-05-20',
  dueDate: '2023-05-25',
  status: 'In Progress',
  progress: 0.65,
  assignedTo: {
    id: 'U1',
    name: 'John Smith',
    role: 'Safety Officer',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
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
      dateIdentified: '2023-05-20'
    },
    {
      id: 'F2',
      title: 'Fire extinguisher past inspection date',
      severity: 'Medium',
      status: 'In Progress',
      location: 'Break Room',
      dateIdentified: '2023-05-20'
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

const AuditDetailsScreen = ({ navigation, route }) => {
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
  
  const handleShareAudit = async () => {
    try {
      await Share.share({
        message: `Audit: ${audit.title}\nLocation: ${audit.location}\nStatus: ${audit.status}\nProgress: ${Math.round(audit.progress * 100)}%`,
        title: `Audit: ${audit.title}`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const handleViewFinding = (findingId) => {
    navigation.navigate('FindingDetails', { findingId });
  };
  
  const handleAddFinding = () => {
    navigation.navigate('AddFinding', { auditId: audit.id });
  };
  
  const handleAddNote = () => {
    // In a real app, this would open a dialog or navigate to a screen to add a note
    Alert.alert('Add Note', 'Note adding functionality would be implemented here');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.header}>
        <View style={styles.headerContent}>
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
              color="#fff"
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
              <Menu.Item
                icon="share-variant"
                onPress={handleShareAudit}
                title="Share"
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
      </Surface>
      
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
              <View style={styles.assignedUser}>
                <Avatar.Image 
                  size={24} 
                  source={{ uri: audit.assignedTo.avatar }} 
                  style={styles.assignedAvatar}
                />
                <Text style={styles.assignedName}>{audit.assignedTo.name}</Text>
                <Text style={styles.assignedRole}>({audit.assignedTo.role})</Text>
              </View>
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
        
        <Card style={styles.notesCard}>
          <Card.Content>
            <View style={styles.notesHeader}>
              <Title style={styles.sectionTitle}>Notes</Title>
              <Button 
                mode="outlined" 
                icon="plus" 
                onPress={handleAddNote}
                style={styles.addButton}
              >
                Add Note
              </Button>
            </View>
            <Divider style={styles.divider} />
            
            {audit.notes.length > 0 ? (
              audit.notes.map(note => (
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    color: 'rgba(255, 255, 255, 0.8)',
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  assignedAvatar: {
    marginRight: 8,
  },
  assignedName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 4,
  },
  assignedRole: {
    fontSize: 14,
    color: '#666',
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
    marginBottom: 8,
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
  notesCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 8,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  noteText: {
    fontSize: 14,
    marginBottom: 8,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noteAuthor: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  noteDate: {
    fontSize: 12,
    color: '#666',
  },
});

export default AuditDetailsScreen;