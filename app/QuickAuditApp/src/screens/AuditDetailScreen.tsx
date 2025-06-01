/**
 * AuditDetailScreen Component
 * Displays detailed information about a specific audit
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Chip, Dialog, Portal, Paragraph, Divider, FAB, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appTheme } from '../theme';
import { useAuth } from '../contexts/AuthContext';

// Mock audit data
const mockAudits = [
  {
    id: '1',
    title: 'Annual Safety Inspection',
    description: 'Comprehensive safety inspection covering all departments and processes.',
    client: 'Acme Corporation',
    clientId: 'client123',
    auditor: 'John Smith',
    auditorId: 'auditor456',
    status: 'Completed',
    dueDate: '2025-05-15',
    completedDate: '2025-05-12',
    createdDate: '2025-04-01',
    template: 'Safety Inspection Template',
    templateId: 'template789',
    findings: [
      {
        id: 'finding1',
        title: 'Fire Extinguisher Expired',
        description: 'Fire extinguisher in Building A, Floor 2 has expired certification.',
        severity: 'High',
        status: 'Open',
        assignedTo: 'Maintenance Team',
        dueDate: '2025-05-30',
        images: ['image1.jpg'],
      },
      {
        id: 'finding2',
        title: 'Emergency Exit Blocked',
        description: 'Emergency exit in warehouse section B is partially blocked by inventory.',
        severity: 'Critical',
        status: 'Open',
        assignedTo: 'Warehouse Manager',
        dueDate: '2025-05-20',
        images: ['image2.jpg', 'image3.jpg'],
      },
      {
        id: 'finding3',
        title: 'Missing Safety Signage',
        description: 'Required safety signage missing in chemical storage area.',
        severity: 'Medium',
        status: 'Closed',
        assignedTo: 'Safety Officer',
        dueDate: '2025-05-25',
        closedDate: '2025-05-18',
        images: [],
      },
    ],
    sections: [
      {
        id: 'section1',
        title: 'General Safety',
        completionPercentage: 100,
        questions: 15,
        findings: 1,
      },
      {
        id: 'section2',
        title: 'Fire Safety',
        completionPercentage: 100,
        questions: 12,
        findings: 2,
      },
      {
        id: 'section3',
        title: 'Chemical Safety',
        completionPercentage: 100,
        questions: 8,
        findings: 0,
      },
    ],
  },
  {
    id: '2',
    title: 'Quarterly Compliance Review',
    description: 'Review of regulatory compliance across all business operations.',
    client: 'TechSolutions Inc.',
    clientId: 'client456',
    auditor: 'Jane Doe',
    auditorId: 'auditor789',
    status: 'In Progress',
    dueDate: '2025-06-10',
    completedDate: null,
    createdDate: '2025-05-01',
    template: 'Compliance Review Template',
    templateId: 'template123',
    findings: [
      {
        id: 'finding4',
        title: 'Outdated Privacy Policy',
        description: 'Website privacy policy does not reflect current data handling practices.',
        severity: 'Medium',
        status: 'Open',
        assignedTo: 'Legal Team',
        dueDate: '2025-06-15',
        images: [],
      },
      {
        id: 'finding5',
        title: 'Incomplete Employee Training Records',
        description: 'Several employees are missing required compliance training documentation.',
        severity: 'Medium',
        status: 'Open',
        assignedTo: 'HR Department',
        dueDate: '2025-06-20',
        images: ['image4.jpg'],
      },
    ],
    sections: [
      {
        id: 'section4',
        title: 'Data Protection',
        completionPercentage: 80,
        questions: 10,
        findings: 1,
      },
      {
        id: 'section5',
        title: 'HR Compliance',
        completionPercentage: 60,
        questions: 15,
        findings: 1,
      },
      {
        id: 'section6',
        title: 'Financial Controls',
        completionPercentage: 0,
        questions: 12,
        findings: 0,
      },
    ],
  },
];

const AuditDetailScreen: React.FC = () => {
  const [audit, setAudit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  
  const { auditId } = route.params || {};
  
  // Load audit data
  useEffect(() => {
    loadAuditDetails();
  }, [auditId]);
  
  // Load audit details from API (mock)
  const loadAuditDetails = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would fetch from an API
      // For now, use mock data
      const foundAudit = mockAudits.find(a => a.id === auditId);
      
      if (foundAudit) {
        setAudit(foundAudit);
      } else {
        Alert.alert('Error', 'Audit not found');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Failed to load audit details:', error);
      Alert.alert('Error', 'Failed to load audit details');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return appTheme.colors.success;
      case 'In Progress':
        return appTheme.colors.info;
      case 'Not Started':
        return appTheme.colors.neutral;
      case 'Overdue':
        return appTheme.colors.error;
      default:
        return appTheme.colors.neutral;
    }
  };
  
  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical':
        return appTheme.colors.error;
      case 'High':
        return '#ff9800'; // Orange
      case 'Medium':
        return '#ffc107'; // Amber
      case 'Low':
        return '#8bc34a'; // Light Green
      default:
        return appTheme.colors.neutral;
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Handle continue audit
  const handleContinueAudit = () => {
    navigation.navigate('AuditExecution', { auditId: audit.id });
  };
  
  // Handle view report
  const handleViewReport = () => {
    navigation.navigate('AuditReport', { auditId: audit.id });
  };
  
  // Handle edit audit
  const handleEditAudit = () => {
    navigation.navigate('CreateAudit', { auditId: audit.id, isEditing: true });
  };
  
  // Handle delete audit
  const handleDeleteAudit = () => {
    // Delete audit logic would go here
    setShowDeleteDialog(false);
    Alert.alert('Success', 'Audit deleted successfully');
    navigation.goBack();
  };
  
  // Handle add finding
  const handleAddFinding = () => {
    navigation.navigate('AddFinding', { auditId: audit.id });
  };
  
  // Handle edit finding
  const handleEditFinding = (findingId) => {
    navigation.navigate('EditFinding', { auditId: audit.id, findingId });
  };
  
  // Render finding item
  const renderFindingItem = (finding) => (
    <Card key={finding.id} style={styles.findingCard}>
      <Card.Content>
        <View style={styles.findingHeader}>
          <View style={styles.findingTitleContainer}>
            <Text style={styles.findingTitle}>{finding.title}</Text>
            <Chip
              style={[styles.severityChip, { backgroundColor: getSeverityColor(finding.severity) }]}
              textStyle={styles.chipText}
            >
              {finding.severity}
            </Chip>
            <Chip
              style={[
                styles.statusChip,
                { backgroundColor: finding.status === 'Closed' ? appTheme.colors.success : appTheme.colors.info },
              ]}
              textStyle={styles.chipText}
            >
              {finding.status}
            </Chip>
          </View>
          
          {user?.role !== 'client' && (
            <TouchableOpacity
              onPress={() => handleEditFinding(finding.id)}
              style={styles.editButton}
            >
              <Icon name="pencil" size={20} color={appTheme.colors.primary} />
            </TouchableOpacity>
          )}
        </View>
        
        <Paragraph style={styles.findingDescription}>{finding.description}</Paragraph>
        
        <View style={styles.findingDetails}>
          <View style={styles.detailItem}>
            <Icon name="account" size={16} color={appTheme.colors.text} />
            <Text style={styles.detailText}>Assigned to: {finding.assignedTo}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Icon name="calendar" size={16} color={appTheme.colors.text} />
            <Text style={styles.detailText}>Due: {formatDate(finding.dueDate)}</Text>
          </View>
          
          {finding.status === 'Closed' && finding.closedDate && (
            <View style={styles.detailItem}>
              <Icon name="check-circle" size={16} color={appTheme.colors.success} />
              <Text style={styles.detailText}>Closed: {formatDate(finding.closedDate)}</Text>
            </View>
          )}
          
          {finding.images && finding.images.length > 0 && (
            <View style={styles.detailItem}>
              <Icon name="image" size={16} color={appTheme.colors.text} />
              <Text style={styles.detailText}>{finding.images.length} {finding.images.length === 1 ? 'image' : 'images'}</Text>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );
  
  // Render section item
  const renderSectionItem = (section) => (
    <Card key={section.id} style={styles.sectionCard}>
      <Card.Content>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Chip style={styles.completionChip}>
            {section.completionPercentage}% Complete
          </Chip>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${section.completionPercentage}%` },
              section.completionPercentage === 100
                ? { backgroundColor: appTheme.colors.success }
                : section.completionPercentage > 0
                ? { backgroundColor: appTheme.colors.info }
                : { backgroundColor: appTheme.colors.disabled },
            ]}
          />
        </View>
        
        <View style={styles.sectionDetails}>
          <View style={styles.detailItem}>
            <Icon name="help-circle-outline" size={16} color={appTheme.colors.text} />
            <Text style={styles.detailText}>{section.questions} Questions</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Icon
              name="alert-circle-outline"
              size={16}
              color={section.findings > 0 ? appTheme.colors.warning : appTheme.colors.text}
            />
            <Text
              style={[
                styles.detailText,
                section.findings > 0 ? { color: appTheme.colors.warning } : {},
              ]}
            >
              {section.findings} {section.findings === 1 ? 'Finding' : 'Findings'}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appTheme.colors.primary} />
      </View>
    );
  }
  
  if (!audit) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={64} color={appTheme.colors.error} />
        <Text style={styles.errorText}>Audit not found</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{audit.title}</Text>
          <Chip
            style={[styles.statusChip, { backgroundColor: getStatusColor(audit.status) }]}
            textStyle={styles.chipText}
          >
            {audit.status}
          </Chip>
        </View>
        
        <Text style={styles.description}>{audit.description}</Text>
        
        <Card style={styles.infoCard}>
          <Card.Content>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Client</Text>
                <Text style={styles.infoValue}>{audit.client}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Auditor</Text>
                <Text style={styles.infoValue}>{audit.auditor}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Due Date</Text>
                <Text style={styles.infoValue}>{formatDate(audit.dueDate)}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Created</Text>
                <Text style={styles.infoValue}>{formatDate(audit.createdDate)}</Text>
              </View>
            </View>
            
            {audit.completedDate && (
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Completed</Text>
                  <Text style={styles.infoValue}>{formatDate(audit.completedDate)}</Text>
                </View>
              </View>
            )}
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Template</Text>
                <Text style={styles.infoValue}>{audit.template}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <View style={styles.actionButtons}>
          {audit.status === 'In Progress' && user?.role !== 'client' && (
            <Button
              mode="contained"
              icon="clipboard-check"
              onPress={handleContinueAudit}
              style={styles.actionButton}
            >
              Continue Audit
            </Button>
          )}
          
          {audit.status === 'Completed' && (
            <Button
              mode="contained"
              icon="file-document"
              onPress={handleViewReport}
              style={styles.actionButton}
            >
              View Report
            </Button>
          )}
          
          {user?.role !== 'client' && (
            <>
              <Button
                mode="outlined"
                icon="pencil"
                onPress={handleEditAudit}
                style={styles.actionButton}
              >
                Edit
              </Button>
              
              <Button
                mode="outlined"
                icon="delete"
                onPress={() => setShowDeleteDialog(true)}
                style={[styles.actionButton, styles.deleteButton]}
                textColor={appTheme.colors.error}
              >
                Delete
              </Button>
            </>
          )}
        </View>
        
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeading}>Sections</Text>
            {audit.status === 'In Progress' && (
              <Text style={styles.sectionSubheading}>
                {audit.sections.filter(s => s.completionPercentage === 100).length} of {audit.sections.length} Complete
              </Text>
            )}
          </View>
          
          {audit.sections.map(renderSectionItem)}
        </View>
        
        <View style={styles.findingsContainer}>
          <View style={styles.findingsHeader}>
            <Text style={styles.findingsHeading}>Findings</Text>
            <Text style={styles.findingsSubheading}>
              {audit.findings.length} {audit.findings.length === 1 ? 'Finding' : 'Findings'}
            </Text>
          </View>
          
          {audit.findings.length > 0 ? (
            audit.findings.map(renderFindingItem)
          ) : (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <Icon name="clipboard-check" size={48} color={appTheme.colors.disabled} />
                <Text style={styles.emptyText}>No findings recorded</Text>
              </Card.Content>
            </Card>
          )}
        </View>
      </ScrollView>
      
      {(audit.status === 'In Progress' || audit.status === 'Completed') && user?.role !== 'client' && (
        <FAB
          style={styles.fab}
          icon="plus"
          label="Add Finding"
          onPress={handleAddFinding}
        />
      )}
      
      <Portal>
        <Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)}>
          <Dialog.Title>Delete Audit</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Are you sure you want to delete this audit? This action cannot be undone.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button onPress={handleDeleteAudit} textColor={appTheme.colors.error}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appTheme.colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    color: appTheme.colors.error,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
    color: appTheme.colors.text,
  },
  statusChip: {
    height: 28,
  },
  chipText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    color: appTheme.colors.textSecondary,
  },
  infoCard: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: appTheme.colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: appTheme.colors.text,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  actionButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  deleteButton: {
    borderColor: appTheme.colors.error,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appTheme.colors.text,
  },
  sectionSubheading: {
    fontSize: 14,
    color: appTheme.colors.textSecondary,
  },
  sectionCard: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  completionChip: {
    backgroundColor: appTheme.colors.primaryLight,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: appTheme.colors.border,
    borderRadius: 4,
    marginVertical: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  sectionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  findingsContainer: {
    marginBottom: 24,
  },
  findingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  findingsHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appTheme.colors.text,
  },
  findingsSubheading: {
    fontSize: 14,
    color: appTheme.colors.textSecondary,
  },
  findingCard: {
    marginBottom: 12,
  },
  findingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  findingTitleContainer: {
    flex: 1,
  },
  findingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  severityChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  findingDescription: {
    marginBottom: 12,
    color: appTheme.colors.textSecondary,
  },
  findingDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: appTheme.colors.textSecondary,
  },
  editButton: {
    padding: 8,
  },
  emptyCard: {
    marginBottom: 12,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: appTheme.colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: appTheme.colors.primary,
  },
});

export default AuditDetailScreen;