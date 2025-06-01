/**
 * Audit Report Screen for Clients
 * Displays detailed audit report with findings and statistics
 */

import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Share,
  Platform
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
  DataTable,
  List,
  Avatar
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { appTheme } from '../../theme/webAppTheme';

// Mock data for the audit report
const auditReport = {
  id: 'A1001',
  title: 'Monthly Fire Safety Inspection',
  location: 'Main Building, Floor 3',
  date: '2023-05-20',
  completedBy: {
    id: 'U1',
    name: 'John Smith',
    role: 'Safety Officer',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  status: 'Completed',
  score: 92,
  sections: [
    {
      id: 'S1',
      title: 'Fire Extinguishers',
      score: 100,
      items: 3,
      completedItems: 3,
      findings: 0
    },
    {
      id: 'S2',
      title: 'Emergency Exits',
      score: 83,
      items: 3,
      completedItems: 3,
      findings: 1
    },
    {
      id: 'S3',
      title: 'Fire Alarms',
      score: 100,
      items: 2,
      completedItems: 2,
      findings: 0
    },
    {
      id: 'S4',
      title: 'Evacuation Plans',
      score: 75,
      items: 4,
      completedItems: 4,
      findings: 1
    }
  ],
  findings: [
    {
      id: 'F1',
      title: 'Emergency exit sign not illuminated',
      section: 'Emergency Exits',
      severity: 'High',
      status: 'In Progress',
      assignedTo: 'Maintenance Team',
      dueDate: '2023-06-01',
      description: 'The emergency exit sign on the east corridor is not illuminated. This is a safety hazard that needs to be addressed promptly.'
    },
    {
      id: 'F2',
      title: 'Evacuation plan missing from break room',
      section: 'Evacuation Plans',
      severity: 'Medium',
      status: 'Open',
      assignedTo: 'Safety Officer',
      dueDate: '2023-06-05',
      description: 'The evacuation plan is missing from the break room wall where it should be displayed.'
    }
  ],
  findingsBySeverity: [
    {
      name: 'High',
      count: 1,
      color: '#f44336'
    },
    {
      name: 'Medium',
      count: 1,
      color: '#ff9800'
    },
    {
      name: 'Low',
      count: 0,
      color: '#4caf50'
    }
  ],
  findingsByStatus: [
    {
      name: 'Open',
      count: 1,
      color: '#f44336'
    },
    {
      name: 'In Progress',
      count: 1,
      color: '#2196f3'
    },
    {
      name: 'Resolved',
      count: 0,
      color: '#4caf50'
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

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#ffa726'
  }
};

const ClientAuditReportScreen = ({ navigation, route }) => {
  // In a real app, we would get the audit ID from route params and fetch the data
  const [report, setReport] = useState(auditReport);
  
  const getScoreColor = (score) => {
    if (score >= 90) return '#4caf50';
    if (score >= 70) return '#ff9800';
    return '#f44336';
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
  
  const handleShareReport = async () => {
    try {
      const result = await Share.share({
        message: `Audit Report: ${report.title} - Score: ${report.score}%
Location: ${report.location}
Date: ${report.date}
Findings: ${report.findings.length}`,
        title: `Audit Report: ${report.title}`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const handleExportPDF = () => {
    // In a real app, this would generate and download a PDF
    alert('PDF export functionality would be implemented here');
  };
  
  const handleViewFinding = (findingId) => {
    navigation.navigate('FindingDetails', { findingId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Title style={styles.headerTitle}>{report.title}</Title>
            <Text style={styles.headerSubtitle}>{report.location}</Text>
            <Text style={styles.headerDate}>{report.date}</Text>
          </View>
          <View style={styles.headerActions}>
            <Button 
              mode="contained" 
              icon="share-variant" 
              onPress={handleShareReport}
              style={styles.shareButton}
            >
              Share
            </Button>
            <Button 
              mode="outlined" 
              icon="file-pdf-box" 
              onPress={handleExportPDF}
              style={styles.exportButton}
            >
              Export PDF
            </Button>
          </View>
        </View>
      </Surface>
      
      <ScrollView style={styles.content}>
        <Card style={styles.scoreCard}>
          <Card.Content>
            <View style={styles.scoreHeader}>
              <Title style={styles.scoreTitle}>Overall Score</Title>
              <Text 
                style={[
                  styles.scoreValue, 
                  { color: getScoreColor(report.score) }
                ]}
              >
                {report.score}%
              </Text>
            </View>
            <ProgressBar 
              progress={report.score / 100} 
              color={getScoreColor(report.score)} 
              style={styles.scoreProgress} 
            />
            <View style={styles.completedBy}>
              <Text style={styles.completedByLabel}>Completed by:</Text>
              <View style={styles.auditorInfo}>
                <Avatar.Image 
                  size={24} 
                  source={{ uri: report.completedBy.avatar }} 
                  style={styles.auditorAvatar}
                />
                <Text style={styles.auditorName}>{report.completedBy.name}</Text>
                <Text style={styles.auditorRole}>({report.completedBy.role})</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Section Scores</Title>
            <Divider style={styles.divider} />
            
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Section</DataTable.Title>
                <DataTable.Title numeric>Items</DataTable.Title>
                <DataTable.Title numeric>Findings</DataTable.Title>
                <DataTable.Title numeric>Score</DataTable.Title>
              </DataTable.Header>
              
              {report.sections.map(section => (
                <DataTable.Row key={section.id}>
                  <DataTable.Cell>{section.title}</DataTable.Cell>
                  <DataTable.Cell numeric>{section.completedItems}/{section.items}</DataTable.Cell>
                  <DataTable.Cell numeric>{section.findings}</DataTable.Cell>
                  <DataTable.Cell 
                    numeric
                    textStyle={{ 
                      color: getScoreColor(section.score),
                      fontWeight: 'bold'
                    }}
                  >
                    {section.score}%
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </Card.Content>
        </Card>
        
        <Card style={styles.findingsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Findings ({report.findings.length})</Title>
            <Divider style={styles.divider} />
            
            {report.findings.length > 0 ? (
              report.findings.map(finding => (
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
                  <Text style={styles.findingSection}>{finding.section}</Text>
                  <Text style={styles.findingDescription}>{finding.description}</Text>
                  <View style={styles.findingFooter}>
                    <View style={styles.findingAssignee}>
                      <Text style={styles.findingLabel}>Assigned to:</Text>
                      <Text style={styles.findingValue}>{finding.assignedTo}</Text>
                    </View>
                    <View style={styles.findingDueDate}>
                      <Text style={styles.findingLabel}>Due:</Text>
                      <Text style={styles.findingValue}>{finding.dueDate}</Text>
                    </View>
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
        
        <View style={styles.chartsContainer}>
          <Card style={styles.chartCard}>
            <Card.Content>
              <Title style={styles.chartTitle}>Findings by Severity</Title>
              <Divider style={styles.divider} />
              
              <View style={styles.chartContainer}>
                <PieChart
                  data={report.findingsBySeverity.map(item => ({
                    name: item.name,
                    population: item.count,
                    color: item.color,
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 12
                  }))}
                  width={screenWidth - 64}
                  height={200}
                  chartConfig={chartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              </View>
            </Card.Content>
          </Card>
          
          <Card style={styles.chartCard}>
            <Card.Content>
              <Title style={styles.chartTitle}>Findings by Status</Title>
              <Divider style={styles.divider} />
              
              <View style={styles.chartContainer}>
                <PieChart
                  data={report.findingsByStatus.map(item => ({
                    name: item.name,
                    population: item.count,
                    color: item.color,
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 12
                  }))}
                  width={screenWidth - 64}
                  height={200}
                  chartConfig={chartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              </View>
            </Card.Content>
          </Card>
        </View>
        
        <Card style={styles.notesCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Notes</Title>
            <Divider style={styles.divider} />
            
            {report.notes.length > 0 ? (
              report.notes.map(note => (
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
  headerDate: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  headerActions: {
    alignItems: 'flex-end',
  },
  shareButton: {
    marginBottom: 8,
    backgroundColor: appTheme.colors.accent,
  },
  exportButton: {
    borderColor: '#fff',
  },
  content: {
    flex: 1,
  },
  scoreCard: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreProgress: {
    height: 8,
    borderRadius: 4,
  },
  completedBy: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedByLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  auditorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  auditorAvatar: {
    marginRight: 8,
  },
  auditorName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 4,
  },
  auditorRole: {
    fontSize: 14,
    color: '#666',
  },
  sectionCard: {
    margin: 16,
    marginTop: 8,
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
  findingsCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
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
  statusChip: {
    height: 24,
  },
  chipText: {
    fontSize: 10,
    color: '#fff',
  },
  findingSection: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  findingDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  findingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  findingAssignee: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  findingDueDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  findingLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 4,
  },
  findingValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  chartsContainer: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  chartCard: {
    marginBottom: 8,
    borderRadius: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  notesCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 8,
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

export default ClientAuditReportScreen;