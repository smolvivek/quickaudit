/**
 * Script to fix TypeScript errors in client DashboardScreen
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

// Fix client DashboardScreen.tsx
const fixClientDashboardScreen = () => {
  const dirPath = path.join(process.cwd(), 'src/screens/client');
  ensureDirectoryExists(dirPath);
  
  const content = `/**
 * Client Dashboard Screen
 * Main dashboard for clients to view audit statistics and summaries
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions
} from 'react-native';
import { 
  Surface, 
  Text, 
  Title, 
  Subheading, 
  Card,
  Button,
  Avatar,
  ProgressBar,
  Chip,
  Divider,
  FAB
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import { appTheme } from '../../theme/webAppTheme';

// Mock data for dashboard
const dashboardData = {
  totalAudits: 48,
  completedAudits: 32,
  inProgressAudits: 12,
  notStartedAudits: 4,
  totalFindings: 86,
  openFindings: 24,
  inProgressFindings: 18,
  resolvedFindings: 44,
  complianceScore: 78,
  recentAudits: [
    {
      id: 'A1001',
      title: 'Monthly Fire Safety Inspection',
      date: '2023-05-20',
      location: 'Main Building, Floor 3',
      status: 'Completed',
      score: 92,
      findings: 2
    },
    {
      id: 'A1002',
      title: 'Quarterly Health & Safety Audit',
      date: '2023-05-15',
      location: 'Warehouse Facility',
      status: 'In Progress',
      score: 65,
      findings: 8
    },
    {
      id: 'A1003',
      title: 'Annual IT Security Assessment',
      date: '2023-05-10',
      location: 'Corporate Headquarters',
      status: 'Completed',
      score: 85,
      findings: 5
    }
  ],
  upcomingAudits: [
    {
      id: 'A1004',
      title: 'Monthly Fire Safety Inspection',
      dueDate: '2023-06-20',
      location: 'Main Building, Floor 3',
      assignedTo: 'John Smith'
    },
    {
      id: 'A1005',
      title: 'Food Safety Inspection',
      dueDate: '2023-06-15',
      location: 'Cafeteria',
      assignedTo: 'Sarah Johnson'
    }
  ],
  criticalFindings: [
    {
      id: 'F1001',
      title: 'Emergency exit blocked by storage',
      severity: 'High',
      audit: 'Quarterly Health & Safety Audit',
      location: 'Warehouse Facility',
      dateIdentified: '2023-05-15',
      status: 'Open'
    },
    {
      id: 'F1002',
      title: 'Fire extinguisher missing from designated location',
      severity: 'High',
      audit: 'Monthly Fire Safety Inspection',
      location: 'Main Building, Floor 3',
      dateIdentified: '2023-05-20',
      status: 'In Progress'
    }
  ],
  auditsByCategory: [
    {
      name: 'Safety',
      count: 24,
      color: '#FF6384'
    },
    {
      name: 'Quality',
      count: 12,
      color: '#36A2EB'
    },
    {
      name: 'Compliance',
      count: 8,
      color: '#FFCE56'
    },
    {
      name: 'Environmental',
      count: 4,
      color: '#4BC0C0'
    }
  ],
  monthlyAuditData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [4, 6, 8, 7, 9, 6],
        color: (opacity = 1) => \`rgba(54, 162, 235, \${opacity})\`,
        strokeWidth: 2
      }
    ]
  },
  complianceTrendData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [65, 68, 72, 75, 78, 80],
        color: (opacity = 1) => \`rgba(75, 192, 192, \${opacity})\`,
        strokeWidth: 2
      }
    ]
  },
  findingsBySeverity: [
    {
      name: 'High',
      count: 18,
      color: '#FF6384'
    },
    {
      name: 'Medium',
      count: 32,
      color: '#FFCE56'
    },
    {
      name: 'Low',
      count: 36,
      color: '#4BC0C0'
    }
  ]
};

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => \`rgba(0, 0, 0, \${opacity})\`,
  labelColor: (opacity = 1) => \`rgba(0, 0, 0, \${opacity})\`,
  style: {
    borderRadius: 16
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#ffa726'
  }
};

const ClientDashboardScreen = ({ navigation }) => {
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'quarter', 'year'
  
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
  
  const handleAuditPress = (auditId) => {
    navigation.navigate('AuditDetails', { auditId });
  };
  
  const handleFindingPress = (findingId) => {
    navigation.navigate('FindingDetails', { findingId });
  };
  
  const handleCreateAudit = () => {
    navigation.navigate('CreateAudit');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Surface style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Title style={styles.headerTitle}>Dashboard</Title>
              <Text style={styles.headerSubtitle}>
                Overview of your audit activities
              </Text>
            </View>
            <View style={styles.timeRangeContainer}>
              <Chip 
                selected={timeRange === 'week'} 
                onPress={() => setTimeRange('week')}
                style={styles.timeRangeChip}
              >
                Week
              </Chip>
              <Chip 
                selected={timeRange === 'month'} 
                onPress={() => setTimeRange('month')}
                style={styles.timeRangeChip}
              >
                Month
              </Chip>
              <Chip 
                selected={timeRange === 'quarter'} 
                onPress={() => setTimeRange('quarter')}
                style={styles.timeRangeChip}
              >
                Quarter
              </Chip>
              <Chip 
                selected={timeRange === 'year'} 
                onPress={() => setTimeRange('year')}
                style={styles.timeRangeChip}
              >
                Year
              </Chip>
            </View>
          </View>
        </Surface>
        
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content>
              <View style={styles.statHeader}>
                <Icon name="clipboard-check-outline" size={24} color={appTheme.colors.primary} />
                <Text style={styles.statTitle}>Total Audits</Text>
              </View>
              <Text style={styles.statValue}>{dashboardData.totalAudits}</Text>
              <View style={styles.statBreakdown}>
                <View style={styles.statBreakdownItem}>
                  <Text style={styles.statBreakdownLabel}>Completed</Text>
                  <Text style={styles.statBreakdownValue}>{dashboardData.completedAudits}</Text>
                </View>
                <View style={styles.statBreakdownItem}>
                  <Text style={styles.statBreakdownLabel}>In Progress</Text>
                  <Text style={styles.statBreakdownValue}>{dashboardData.inProgressAudits}</Text>
                </View>
                <View style={styles.statBreakdownItem}>
                  <Text style={styles.statBreakdownLabel}>Not Started</Text>
                  <Text style={styles.statBreakdownValue}>{dashboardData.notStartedAudits}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard}>
            <Card.Content>
              <View style={styles.statHeader}>
                <Icon name="alert-circle-outline" size={24} color={appTheme.colors.primary} />
                <Text style={styles.statTitle}>Total Findings</Text>
              </View>
              <Text style={styles.statValue}>{dashboardData.totalFindings}</Text>
              <View style={styles.statBreakdown}>
                <View style={styles.statBreakdownItem}>
                  <Text style={styles.statBreakdownLabel}>Open</Text>
                  <Text style={styles.statBreakdownValue}>{dashboardData.openFindings}</Text>
                </View>
                <View style={styles.statBreakdownItem}>
                  <Text style={styles.statBreakdownLabel}>In Progress</Text>
                  <Text style={styles.statBreakdownValue}>{dashboardData.inProgressFindings}</Text>
                </View>
                <View style={styles.statBreakdownItem}>
                  <Text style={styles.statBreakdownLabel}>Resolved</Text>
                  <Text style={styles.statBreakdownValue}>{dashboardData.resolvedFindings}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard}>
            <Card.Content>
              <View style={styles.statHeader}>
                <Icon name="check-circle-outline" size={24} color={appTheme.colors.primary} />
                <Text style={styles.statTitle}>Compliance Score</Text>
              </View>
              <Text style={styles.statValue}>{dashboardData.complianceScore}%</Text>
              <ProgressBar 
                progress={dashboardData.complianceScore / 100} 
                color={
                  dashboardData.complianceScore >= 80 ? '#4caf50' : 
                  dashboardData.complianceScore >= 60 ? '#ff9800' : '#f44336'
                }
                style={styles.complianceProgress}
              />
              <Text style={styles.complianceLabel}>
                {
                  dashboardData.complianceScore >= 80 ? 'Good' : 
                  dashboardData.complianceScore >= 60 ? 'Needs Improvement' : 'Critical'
                }
              </Text>
            </Card.Content>
          </Card>
        </View>
        
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Recent Audits</Title>
            <Divider style={styles.divider} />
            
            {dashboardData.recentAudits.map(audit => (
              <TouchableOpacity 
                key={audit.id} 
                style={styles.auditItem}
                onPress={() => handleAuditPress(audit.id)}
              >
                <View style={styles.auditHeader}>
                  <Text style={styles.auditTitle}>{audit.title}</Text>
                  <Chip 
                    style={[
                      styles.statusChip, 
                      { backgroundColor: getStatusColor(audit.status) }
                    ]}
                    textStyle={styles.statusChipText}
                  >
                    {audit.status}
                  </Chip>
                </View>
                <View style={styles.auditDetails}>
                  <Text style={styles.auditLocation}>{audit.location}</Text>
                  <Text style={styles.auditDate}>{audit.date}</Text>
                </View>
                <View style={styles.auditFooter}>
                  <View style={styles.auditScore}>
                    <Text style={styles.auditScoreLabel}>Score:</Text>
                    <Text 
                      style={[
                        styles.auditScoreValue,
                        { 
                          color: 
                            audit.score >= 80 ? '#4caf50' : 
                            audit.score >= 60 ? '#ff9800' : '#f44336' 
                        }
                      ]}
                    >
                      {audit.score}%
                    </Text>
                  </View>
                  <View style={styles.auditFindings}>
                    <Text style={styles.auditFindingsLabel}>Findings:</Text>
                    <Text style={styles.auditFindingsValue}>{audit.findings}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            
            <Button 
              mode="outlined" 
              onPress={() => navigation.navigate('AuditList')}
              style={styles.viewAllButton}
            >
              View All Audits
            </Button>
          </Card.Content>
        </Card>
        
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Upcoming Audits</Title>
            <Divider style={styles.divider} />
            
            {dashboardData.upcomingAudits.map(audit => (
              <TouchableOpacity 
                key={audit.id} 
                style={styles.auditItem}
                onPress={() => handleAuditPress(audit.id)}
              >
                <Text style={styles.auditTitle}>{audit.title}</Text>
                <View style={styles.auditDetails}>
                  <Text style={styles.auditLocation}>{audit.location}</Text>
                  <Text style={styles.auditDueDate}>Due: {audit.dueDate}</Text>
                </View>
                <View style={styles.auditAssignee}>
                  <Text style={styles.auditAssigneeLabel}>Assigned to:</Text>
                  <Text style={styles.auditAssigneeValue}>{audit.assignedTo}</Text>
                </View>
              </TouchableOpacity>
            ))}
            
            <Button 
              mode="outlined" 
              onPress={() => navigation.navigate('ScheduledAudits')}
              style={styles.viewAllButton}
            >
              View All Scheduled Audits
            </Button>
          </Card.Content>
        </Card>
        
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Critical Findings</Title>
            <Divider style={styles.divider} />
            
            {dashboardData.criticalFindings.map(finding => (
              <TouchableOpacity 
                key={finding.id} 
                style={styles.findingItem}
                onPress={() => handleFindingPress(finding.id)}
              >
                <View style={styles.findingHeader}>
                  <Text style={styles.findingTitle}>{finding.title}</Text>
                  <Chip 
                    style={[
                      styles.severityChip, 
                      { backgroundColor: getSeverityColor(finding.severity) }
                    ]}
                    textStyle={styles.severityChipText}
                  >
                    {finding.severity}
                  </Chip>
                </View>
                <View style={styles.findingDetails}>
                  <Text style={styles.findingAudit}>{finding.audit}</Text>
                  <Text style={styles.findingLocation}>{finding.location}</Text>
                </View>
                <View style={styles.findingFooter}>
                  <Text style={styles.findingDate}>{finding.dateIdentified}</Text>
                  <Chip 
                    style={[
                      styles.findingStatusChip, 
                      { backgroundColor: getFindingStatusColor(finding.status) }
                    ]}
                    textStyle={styles.findingStatusChipText}
                  >
                    {finding.status}
                  </Chip>
                </View>
              </TouchableOpacity>
            ))}
            
            <Button 
              mode="outlined" 
              onPress={() => navigation.navigate('FindingsList')}
              style={styles.viewAllButton}
            >
              View All Findings
            </Button>
          </Card.Content>
        </Card>
        
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Audits by Category</Title>
            <Divider style={styles.divider} />
            
            <View style={styles.chartContainer}>
              <PieChart
                data={dashboardData.auditsByCategory.map(item => ({
                  name: item.name,
                  population: item.count,
                  color: item.color,
                  legendFontColor: '#7F7F7F',
                  legendFontSize: 12
                }))}
                width={screenWidth - 64}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Monthly Audit Trend</Title>
            <Divider style={styles.divider} />
            
            <View style={styles.chartContainer}>
              <LineChart
                data={dashboardData.monthlyAuditData}
                width={screenWidth - 64}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Compliance Trend</Title>
            <Divider style={styles.divider} />
            
            <View style={styles.chartContainer}>
              <LineChart
                data={dashboardData.complianceTrendData}
                width={screenWidth - 64}
                height={220}
                chartConfig={{
                  ...chartConfig,
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#4BC0C0'
                  }
                }}
                bezier
                style={styles.chart}
              />
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Findings by Severity</Title>
            <Divider style={styles.divider} />
            
            <View style={styles.chartContainer}>
              <PieChart
                data={dashboardData.findingsBySeverity.map(item => ({
                  name: item.name,
                  population: item.count,
                  color: item.color,
                  legendFontColor: '#7F7F7F',
                  legendFontSize: 12
                }))}
                width={screenWidth - 64}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
      
      <FAB
        style={styles.fab}
        icon="plus"
        label="Create Audit"
        onPress={handleCreateAudit}
      />
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  timeRangeChip: {
    marginLeft: 8,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 8,
  },
  statCard: {
    width: '48%',
    marginHorizontal: '1%',
    marginVertical: 8,
    borderRadius: 8,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
    marginBottom: 8,
  },
  statBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBreakdownItem: {
    alignItems: 'center',
  },
  statBreakdownLabel: {
    fontSize: 12,
    color: '#666',
  },
  statBreakdownValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  complianceProgress: {
    height: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  complianceLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  sectionCard: {
    margin: 16,
    marginTop: 8,
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
  auditItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  auditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  auditTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  statusChip: {
    height: 24,
  },
  statusChipText: {
    fontSize: 10,
    color: '#fff',
  },
  auditDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  auditLocation: {
    fontSize: 14,
    color: '#666',
  },
  auditDate: {
    fontSize: 14,
    color: '#666',
  },
  auditDueDate: {
    fontSize: 14,
    color: '#666',
  },
  auditFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  auditScore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  auditScoreLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  auditScoreValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  auditFindings: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  auditFindingsLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  auditFindingsValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  auditAssignee: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  auditAssigneeLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  auditAssigneeValue: {
    fontSize: 14,
    fontWeight: 'bold',
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
  severityChipText: {
    fontSize: 10,
    color: '#fff',
  },
  findingDetails: {
    marginBottom: 8,
  },
  findingAudit: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  findingLocation: {
    fontSize: 14,
    color: '#666',
  },
  findingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  findingDate: {
    fontSize: 14,
    color: '#666',
  },
  findingStatusChip: {
    height: 24,
  },
  findingStatusChipText: {
    fontSize: 10,
    color: '#fff',
  },
  viewAllButton: {
    marginTop: 8,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  chart: {
    borderRadius: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: appTheme.colors.accent,
  },
});

export default ClientDashboardScreen;`;

  fs.writeFileSync(path.join(dirPath, 'DashboardScreen.tsx'), content, 'utf8');
  console.log('Fixed client DashboardScreen.tsx');
};

// Run the function
console.log('Fixing client DashboardScreen...');
fixClientDashboardScreen();
console.log('Client DashboardScreen fixed successfully!');
