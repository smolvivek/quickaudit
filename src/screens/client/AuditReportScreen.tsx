import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, useTheme, Surface, Chip, Avatar, Divider, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const AuditReportScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const { auditId } = route.params || {};
  
  // Mock data - in a real app, this would be fetched based on auditId
  const auditData = {
    id: auditId || 1,
    title: 'Safety Inspection',
    location: 'Main Office',
    date: 'May 20, 2025',
    auditor: 'John Smith',
    status: 'Completed',
    score: 85,
    sections: [
      {
        id: 1,
        title: 'General Safety',
        score: 100,
        items: [
          { id: 1, text: 'Emergency exits are clearly marked', response: 'compliant' },
          { id: 2, text: 'Fire extinguishers are accessible and in working order', response: 'compliant' },
          { id: 3, text: 'First aid kits are fully stocked and accessible', response: 'compliant' },
          { id: 4, text: 'Emergency procedures are posted and visible', response: 'compliant' },
        ]
      },
      {
        id: 2,
        title: 'Electrical Safety',
        score: 75,
        items: [
          { id: 5, text: 'No exposed wiring is present', response: 'non-compliant', notes: 'Exposed wiring found near the coffee machine in break room.' },
          { id: 6, text: 'Electrical panels are accessible and properly labeled', response: 'compliant' },
          { id: 7, text: 'Extension cords are used properly and not daisy-chained', response: 'compliant' },
        ]
      },
      {
        id: 3,
        title: 'Workplace Hazards',
        score: 60,
        items: [
          { id: 8, text: 'Walkways are clear of obstructions', response: 'non-compliant', notes: 'The emergency exit in the east side of the warehouse was blocked by storage boxes.' },
          { id: 9, text: 'Proper lighting is maintained in all areas', response: 'non-compliant', notes: 'Lighting in north stairwell is insufficient.' },
          { id: 10, text: 'Hazardous materials are properly stored and labeled', response: 'compliant' },
          { id: 11, text: 'PPE is available and in good condition', response: 'compliant' },
        ]
      },
    ],
    findings: [
      { 
        id: 1, 
        title: 'Exposed wiring in break room', 
        severity: 'High', 
        category: 'Electrical Safety',
        description: 'Exposed electrical wiring was found near the coffee machine in the break room. This poses a significant electrical hazard and risk of shock.',
        photos: ['photo1.jpg', 'photo2.jpg']
      },
      { 
        id: 2, 
        title: 'Blocked fire exit in warehouse', 
        severity: 'High', 
        category: 'General Safety',
        description: 'The emergency exit in the east side of the warehouse was blocked by storage boxes, preventing quick evacuation in case of emergency.',
        photos: ['photo3.jpg']
      },
      { 
        id: 3, 
        title: 'Inadequate lighting in stairwell', 
        severity: 'Medium', 
        category: 'Workplace Hazards',
        description: 'The lighting in the north stairwell is insufficient, creating a potential trip and fall hazard, especially during emergency evacuations.',
        photos: ['photo4.jpg', 'photo5.jpg']
      },
    ],
    actions: [
      {
        id: 1,
        title: 'Repair exposed wiring in break room',
        assignee: 'Maintenance Team',
        dueDate: 'May 27, 2025',
        status: 'Open',
        description: 'Contact electrician to properly secure all exposed wiring near the coffee machine. Install protective covering and ensure all electrical connections meet safety standards.',
        progress: 0
      },
      {
        id: 2,
        title: 'Clear blocked fire exit in warehouse',
        assignee: 'Warehouse Manager',
        dueDate: 'May 25, 2025',
        status: 'In Progress',
        description: 'Remove all storage boxes blocking the east emergency exit. Implement a policy to keep all emergency exits clear at all times and conduct regular checks.',
        progress: 50
      },
      {
        id: 3,
        title: 'Improve lighting in north stairwell',
        assignee: 'Facilities Team',
        completedDate: 'May 19, 2025',
        status: 'Completed',
        description: 'Install additional lighting fixtures in the north stairwell to ensure adequate illumination. Replace any burnt-out bulbs and consider motion-activated lighting for energy efficiency.',
        progress: 100
      }
    ],
    notes: 'Overall, the facility maintains good safety standards in most areas. The general safety protocols are well-implemented, with clear emergency procedures posted throughout the building. The main concerns are in the electrical safety area, particularly in the break room, and some workplace hazards that need immediate attention. The blocked fire exit in the warehouse is a critical issue that requires immediate resolution. I recommend scheduling a follow-up inspection within 30 days to ensure all corrective actions have been properly implemented, with special attention to the high-severity findings.'
  };
  
  const getScoreColor = (score) => {
    if (score >= 90) return theme.colors.success;
    if (score >= 70) return theme.colors.warning;
    return theme.colors.error;
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return theme.colors.error;
      case 'In Progress': return theme.colors.warning;
      case 'Completed': return theme.colors.success;
      default: return theme.colors.lightText;
    }
  };
  
  const getStatusBgColor = (status) => {
    return `${getStatusColor(status)}20`;
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Surface style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Audit Report</Text>
          <Text style={styles.auditTitle}>{auditData.title} - {auditData.location}</Text>
          
          <View style={styles.metaGrid}>
            <View style={styles.metaGroup}>
              <Text style={styles.metaLabel}>Auditor</Text>
              <Text style={styles.metaValue}>{auditData.auditor}</Text>
            </View>
            
            <View style={styles.metaGroup}>
              <Text style={styles.metaLabel}>Date</Text>
              <Text style={styles.metaValue}>{auditData.date}</Text>
            </View>
            
            <View style={styles.metaGroup}>
              <Text style={styles.metaLabel}>Location</Text>
              <Text style={styles.metaValue}>{auditData.location}</Text>
            </View>
            
            <View style={styles.metaGroup}>
              <Text style={styles.metaLabel}>Template</Text>
              <Text style={styles.metaValue}>Safety Inspection</Text>
            </View>
            
            <View style={styles.metaGroup}>
              <Text style={styles.metaLabel}>Duration</Text>
              <Text style={styles.metaValue}>45 minutes</Text>
            </View>
            
            <View style={styles.metaGroup}>
              <Text style={styles.metaLabel}>Status</Text>
              <Text style={styles.metaValue}>{auditData.status}</Text>
            </View>
          </View>
          
          <View style={styles.reportActions}>
            <Button mode="outlined" icon="download" onPress={() => {}}>
              Download PDF
            </Button>
            
            <Button mode="outlined" icon="share-variant" onPress={() => {}}>
              Share
            </Button>
            
            <Button mode="outlined" icon="printer" onPress={() => {}}>
              Print
            </Button>
          </View>
        </Surface>
        
        <Surface style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Audit Summary</Text>
          
          <View style={styles.scoreContainer}>
            <View style={styles.scoreGauge}>
              <View style={[styles.scoreCircle, { background: `conic-gradient(${getScoreColor(auditData.score)} 0% ${auditData.score}%, #e2e8f0 ${auditData.score}% 100%)` }]} />
              <View style={styles.scoreInner}>
                <Text style={[styles.scoreValue, { color: getScoreColor(auditData.score) }]}>{auditData.score}%</Text>
                <Text style={styles.scoreLabel}>SCORE</Text>
              </View>
            </View>
            
            <View style={styles.scoreStats}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Total Items</Text>
                <Text style={styles.statValue}>45</Text>
              </View>
              
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Compliant</Text>
                <Text style={[styles.statValue, styles.compliantValue]}>38</Text>
              </View>
              
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Non-Compliant</Text>
                <Text style={[styles.statValue, styles.nonCompliantValue]}>7</Text>
              </View>
              
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>N/A</Text>
                <Text style={styles.statValue}>0</Text>
              </View>
            </View>
          </View>
          
          {auditData.sections.map((section) => (
            <View key={section.id} style={styles.sectionSummary}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionName}>{section.title}</Text>
                <Text 
                  style={[
                    styles.sectionScore,
                    section.score >= 90 ? styles.goodScore : 
                    section.score >= 70 ? styles.warningScore : 
                    styles.badScore
                  ]}
                >
                  {section.score}%
                </Text>
              </View>
              
              <View style={styles.sectionBar}>
                <View 
                  style={[
                    styles.sectionBarFill,
                    section.score >= 90 ? styles.goodFill : 
                    section.score >= 70 ? styles.warningFill : 
                    styles.badFill,
                    { width: `${section.score}%` }
                  ]} 
                />
              </View>
            </View>
          ))}
        </Surface>
        
        <Card style={styles.findingsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Non-Compliance Findings</Text>
            
            {auditData.findings.map((finding) => (
              <View key={finding.id} style={styles.findingItem}>
                <View style={[styles.findingIcon, styles.nonCompliantIcon]}>
                  <Text style={styles.findingIconText}>!</Text>
                </View>
                
                <View style={styles.findingDetails}>
                  <Text style={styles.findingTitle}>{finding.title}</Text>
                  
                  <View style={styles.findingMeta}>
                    <Text style={styles.findingMetaItem}>
                      <Text style={styles.findingMetaIcon}>⚠️</Text> {finding.severity} Severity
                    </Text>
                    
                    <Text style={styles.findingMetaItem}>
                      <Text style={styles.findingMetaIcon}>🏷️</Text> {finding.category}
                    </Text>
                  </View>
                  
                  <Text style={styles.findingDescription}>{finding.description}</Text>
                  
                  <Button mode="text" icon="eye" onPress={() => {}}>
                    View Details
                  </Button>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
        
        <Text style={styles.sectionTitle}>Evidence Gallery</Text>
        
        <View style={styles.evidenceGrid}>
          <View style={styles.evidenceItem}>
            <Text style={styles.evidenceItemText}>📷</Text>
          </View>
          
          <View style={styles.evidenceItem}>
            <Text style={styles.evidenceItemText}>📷</Text>
          </View>
          
          <View style={styles.evidenceItem}>
            <Text style={styles.evidenceItemText}>📷</Text>
          </View>
          
          <View style={styles.evidenceItem}>
            <Text style={styles.evidenceItemText}>📷</Text>
          </View>
          
          <View style={styles.evidenceItem}>
            <Text style={styles.evidenceItemText}>📷</Text>
          </View>
          
          <View style={styles.evidenceItem}>
            <Text style={styles.evidenceItemText}>📷</Text>
          </View>
        </View>
        
        <Surface style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>Corrective Actions</Text>
          
          {auditData.actions.map((action) => (
            <View key={action.id} style={styles.actionItem}>
              <View style={styles.actionHeader}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Chip 
                  mode="flat" 
                  style={{ backgroundColor: getStatusBgColor(action.status) }}
                  textStyle={{ color: getStatusColor(action.status) }}
                >
                  {action.status}
                </Chip>
              </View>
              
              <View style={styles.actionMeta}>
                <Text style={styles.actionMetaItem}>
                  <Text style={styles.actionMetaIcon}>👤</Text> Assigned to: {action.assignee}
                </Text>
                
                <Text style={styles.actionMetaItem}>
                  <Text style={styles.actionMetaIcon}>📅</Text> {action.status === 'Completed' ? `Completed: ${action.completedDate}` : `Due: ${action.dueDate}`}
                </Text>
              </View>
              
              <Text style={styles.actionDescription}>{action.description}</Text>
              
              <View style={styles.actionProgress}>
                <Text style={styles.progressLabel}>Progress:</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${action.progress}%` }
                    ]} 
                  />
                </View>
              </View>
            </View>
          ))}
        </Surface>
        
        <Surface style={styles.notesCard}>
          <Text style={styles.sectionTitle}>Auditor Notes</Text>
          <Text style={styles.noteContent}>{auditData.notes}</Text>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 8,
  },
  auditTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  metaGroup: {
    width: '33.33%',
    marginBottom: 12,
  },
  metaLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  reportActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreGauge: {
    width: 120,
    height: 120,
    position: 'relative',
    marginRight: 24,
  },
  scoreCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    transform: [{ rotate: '-90deg' }],
  },
  scoreInner: {
    position: 'absolute',
    width: '80%',
    height: '80%',
    top: '10%',
    left: '10%',
    backgroundColor: '#ffffff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  scoreStats: {
    flex: 1,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  compliantValue: {
    color: '#10b981',
  },
  nonCompliantValue: {
    color: '#ef4444',
  },
  sectionSummary: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  sectionScore: {
    fontWeight: '600',
  },
  goodScore: {
    color: '#10b981',
  },
  warningScore: {
    color: '#f59e0b',
  },
  badScore: {
    color: '#ef4444',
  },
  sectionBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  sectionBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  goodFill: {
    backgroundColor: '#10b981',
  },
  warningFill: {
    backgroundColor: '#f59e0b',
  },
  badFill: {
    backgroundColor: '#ef4444',
  },
  findingsCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  findingItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  findingItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  findingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  nonCompliantIcon: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  findingIconText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  findingDetails: {
    flex: 1,
  },
  findingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 4,
  },
  findingMeta: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  findingMetaItem: {
    fontSize: 12,
    color: '#64748b',
    marginRight: 12,
  },
  findingMetaIcon: {
    marginRight: 4,
  },
  findingDescription: {
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 8,
  },
  evidenceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  evidenceItem: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 4,
  },
  evidenceItemText: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 24,
  },
  actionsCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  actionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    flex: 1,
    marginRight: 8,
  },
  actionMeta: {
    marginBottom: 8,
  },
  actionMetaItem: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  actionMetaIcon: {
    marginRight: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 12,
  },
  actionProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 14,
    color: '#64748b',
    width: 70,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 3,
  },
  notesCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  noteContent: {
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 20,
  },
});

export default AuditReportScreen;
