/**
 * Admin Dashboard Screen
 * Main dashboard for administrators to view system statistics and manage the application
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  Divider,
  Avatar,
  IconButton,
  DataTable,
  Paragraph,
  ProgressBar,
  Badge,
  Chip,
  FAB
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appTheme } from '../../theme/webAppTheme';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

// Mock data for dashboard
const mockStats = {
  totalUsers: 126,
  activeUsers: 98,
  totalAudits: 342,
  completedAudits: 287,
  inProgressAudits: 42,
  draftAudits: 13,
  totalFindings: 876,
  criticalFindings: 54,
  highFindings: 183,
  mediumFindings: 412,
  lowFindings: 227,
  recentActivity: [
    { id: 'A1', type: 'audit_created', user: 'John Smith', timestamp: '2023-05-20 14:30', details: 'Created new audit: "Annual Security Review"' },
    { id: 'A2', type: 'user_added', user: 'Admin', timestamp: '2023-05-19 11:45', details: 'Added new user: "Sarah Johnson"' },
    { id: 'A3', type: 'audit_completed', user: 'Mike Williams', timestamp: '2023-05-18 16:20', details: 'Completed audit: "Quarterly Compliance Check"' },
    { id: 'A4', type: 'finding_added', user: 'Emily Davis', timestamp: '2023-05-18 10:15', details: 'Added new critical finding to "Network Security Audit"' },
    { id: 'A5', type: 'report_generated', user: 'Robert Brown', timestamp: '2023-05-17 15:30', details: 'Generated report for "Data Center Inspection"' }
  ],
  recentUsers: [
    { id: 'U1', name: 'John Smith', email: 'john.smith@example.com', role: 'Admin', lastLogin: '2023-05-20 14:30' },
    { id: 'U2', name: 'Sarah Johnson', email: 'sarah.johnson@example.com', role: 'Auditor', lastLogin: '2023-05-19 10:15' },
    { id: 'U3', name: 'Mike Williams', email: 'mike.williams@example.com', role: 'Auditor', lastLogin: '2023-05-18 16:45' },
    { id: 'U4', name: 'Emily Davis', email: 'emily.davis@example.com', role: 'Client', lastLogin: '2023-05-18 09:20' },
    { id: 'U5', name: 'Robert Brown', email: 'robert.brown@example.com', role: 'Client', lastLogin: '2023-05-17 11:10' }
  ],
  auditsByMonth: [
    { month: 'Jan', count: 24 },
    { month: 'Feb', count: 28 },
    { month: 'Mar', count: 32 },
    { month: 'Apr', count: 38 },
    { month: 'May', count: 42 }
  ],
  findingsByCategory: [
    { category: 'Security', count: 345 },
    { category: 'Compliance', count: 210 },
    { category: 'Operational', count: 178 },
    { category: 'Financial', count: 143 }
  ],
  findingsBySeverity: [
    { severity: 'Critical', count: 54, color: '#f44336' },
    { severity: 'High', count: 183, color: '#ff9800' },
    { severity: 'Medium', count: 412, color: '#ffeb3b' },
    { severity: 'Low', count: 227, color: '#4caf50' }
  ]
};

const AdminDashboardScreen = ({ navigation }) => {
  const [stats, setStats] = useState(mockStats);
  const [refreshing, setRefreshing] = useState(false);
  const screenWidth = Dimensions.get('window').width - 40;
  
  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, this would fetch fresh data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  
  const getActivityIcon = (type) => {
    switch (type) {
      case 'audit_created':
        return 'file-plus-outline';
      case 'user_added':
        return 'account-plus-outline';
      case 'audit_completed':
        return 'check-circle-outline';
      case 'finding_added':
        return 'alert-circle-outline';
      case 'report_generated':
        return 'file-chart-outline';
      default:
        return 'information-outline';
    }
  };
  
  const getActivityColor = (type) => {
    switch (type) {
      case 'audit_created':
        return '#2196f3';
      case 'user_added':
        return '#9c27b0';
      case 'audit_completed':
        return '#4caf50';
      case 'finding_added':
        return '#f44336';
      case 'report_generated':
        return '#ff9800';
      default:
        return '#757575';
    }
  };
  
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0
  };
  
  const pieChartData = stats.findingsBySeverity.map(item => ({
    name: item.severity,
    population: item.count,
    color: item.color,
    legendFontColor: '#7F7F7F',
    legendFontSize: 12
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Admin Dashboard</Title>
        <Text style={styles.headerSubtitle}>Welcome back, Admin</Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[appTheme.colors.primary]}
          />
        }
      >
        {/* Summary Cards */}
        <View style={styles.statsRow}>
          <Card style={[styles.statsCard, { backgroundColor: '#e3f2fd' }]}>
            <Card.Content>
              <View style={styles.statsCardContent}>
                <Avatar.Icon size={40} icon="account-group" style={{ backgroundColor: '#2196f3' }} />
                <View style={styles.statsTextContainer}>
                  <Title style={styles.statsNumber}>{stats.totalUsers}</Title>
                  <Text style={styles.statsLabel}>Total Users</Text>
                </View>
              </View>
              <Text style={styles.statsSubtext}>{stats.activeUsers} active users</Text>
            </Card.Content>
          </Card>
          
          <Card style={[styles.statsCard, { backgroundColor: '#e8f5e9' }]}>
            <Card.Content>
              <View style={styles.statsCardContent}>
                <Avatar.Icon size={40} icon="clipboard-check" style={{ backgroundColor: '#4caf50' }} />
                <View style={styles.statsTextContainer}>
                  <Title style={styles.statsNumber}>{stats.totalAudits}</Title>
                  <Text style={styles.statsLabel}>Total Audits</Text>
                </View>
              </View>
              <Text style={styles.statsSubtext}>{stats.completedAudits} completed</Text>
            </Card.Content>
          </Card>
        </View>
        
        <View style={styles.statsRow}>
          <Card style={[styles.statsCard, { backgroundColor: '#fff3e0' }]}>
            <Card.Content>
              <View style={styles.statsCardContent}>
                <Avatar.Icon size={40} icon="alert-circle" style={{ backgroundColor: '#ff9800' }} />
                <View style={styles.statsTextContainer}>
                  <Title style={styles.statsNumber}>{stats.totalFindings}</Title>
                  <Text style={styles.statsLabel}>Total Findings</Text>
                </View>
              </View>
              <Text style={styles.statsSubtext}>{stats.criticalFindings} critical findings</Text>
            </Card.Content>
          </Card>
          
          <Card style={[styles.statsCard, { backgroundColor: '#f3e5f5' }]}>
            <Card.Content>
              <View style={styles.statsCardContent}>
                <Avatar.Icon size={40} icon="chart-bar" style={{ backgroundColor: '#9c27b0' }} />
                <View style={styles.statsTextContainer}>
                  <Title style={styles.statsNumber}>{stats.inProgressAudits}</Title>
                  <Text style={styles.statsLabel}>In Progress</Text>
                </View>
              </View>
              <Text style={styles.statsSubtext}>{stats.draftAudits} drafts</Text>
            </Card.Content>
          </Card>
        </View>
        
        {/* Charts */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Audits by Month</Title>
            <Divider style={styles.divider} />
            <BarChart
              data={{
                labels: stats.auditsByMonth.map(item => item.month),
                datasets: [
                  {
                    data: stats.auditsByMonth.map(item => item.count)
                  }
                ]
              }}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              verticalLabelRotation={0}
              fromZero
            />
          </Card.Content>
        </Card>
        
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Findings by Severity</Title>
            <Divider style={styles.divider} />
            <PieChart
              data={pieChartData}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </Card.Content>
        </Card>
        
        {/* Recent Activity */}
        <Card style={styles.activityCard}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Title style={styles.cardTitle}>Recent Activity</Title>
              <Button 
                mode="text" 
                onPress={() => navigation.navigate('ActivityLog')}
              >
                View All
              </Button>
            </View>
            <Divider style={styles.divider} />
            
            {stats.recentActivity.map(activity => (
              <View key={activity.id} style={styles.activityItem}>
                <Avatar.Icon 
                  size={36} 
                  icon={getActivityIcon(activity.type)} 
                  style={{ backgroundColor: getActivityColor(activity.type) }}
                />
                <View style={styles.activityContent}>
                  <Text style={styles.activityDetails}>{activity.details}</Text>
                  <View style={styles.activityMeta}>
                    <Text style={styles.activityUser}>{activity.user}</Text>
                    <Text style={styles.activityTime}>{activity.timestamp}</Text>
                  </View>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
        
        {/* Recent Users */}
        <Card style={styles.usersCard}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Title style={styles.cardTitle}>Recent Users</Title>
              <Button 
                mode="text" 
                onPress={() => navigation.navigate('UserManagement')}
              >
                Manage Users
              </Button>
            </View>
            <Divider style={styles.divider} />
            
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Name</DataTable.Title>
                <DataTable.Title>Role</DataTable.Title>
                <DataTable.Title>Last Login</DataTable.Title>
              </DataTable.Header>
              
              {stats.recentUsers.map(user => (
                <DataTable.Row key={user.id}>
                  <DataTable.Cell>{user.name}</DataTable.Cell>
                  <DataTable.Cell>{user.role}</DataTable.Cell>
                  <DataTable.Cell>{user.lastLogin}</DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
            
            <Button 
              mode="outlined" 
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('UserManagement')}
            >
              View All Users
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AdminActions')}
        color="#fff"
      />
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
    backgroundColor: appTheme.colors.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollView: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
  },
  statsCard: {
    width: '48%',
    borderRadius: 8,
    elevation: 2,
  },
  statsCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsTextContainer: {
    marginLeft: 12,
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  statsLabel: {
    fontSize: 12,
    color: '#666',
  },
  statsSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  chartCard: {
    margin: 16,
    borderRadius: 8,
  },
  chart: {
    marginVertical: 8,
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
  activityCard: {
    margin: 16,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  activityContent: {
    marginLeft: 12,
    flex: 1,
  },
  activityDetails: {
    fontSize: 14,
    fontWeight: '500',
  },
  activityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  activityUser: {
    fontSize: 12,
    color: '#666',
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
  usersCard: {
    margin: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  viewAllButton: {
    marginTop: 12,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: appTheme.colors.primary,
  },
});

export default AdminDashboardScreen;