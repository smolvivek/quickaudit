/**
 * Dashboard Screen for supervisors
 * Shows audit statistics and recent activities
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, DataTable, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { appTheme } from '../../theme/webAppTheme';
import { auditApi } from '../../services/api';

// Dashboard component for supervisors
const DashboardScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAudits: 0,
    completedAudits: 0,
    pendingAudits: 0,
    averageScore: 0,
  });
  const [recentAudits, setRecentAudits] = useState([]);
  const [topIssues, setTopIssues] = useState([]);

  // Screen width for responsive charts
  const screenWidth = Dimensions.get('window').width - 40;

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In a real app, these would be separate API calls
        // For now, we'll simulate the data
        
        // Simulate API call for stats
        const statsData = {
          totalAudits: 124,
          completedAudits: 98,
          pendingAudits: 26,
          averageScore: 87.5,
        };
        
        // Simulate API call for recent audits
        const recentAuditsData = [
          { id: '1', name: 'Store #1234', date: '2023-05-28', score: 92, status: 'Completed' },
          { id: '2', name: 'Store #5678', date: '2023-05-27', score: 78, status: 'Completed' },
          { id: '3', name: 'Store #9012', date: '2023-05-26', score: 85, status: 'Completed' },
          { id: '4', name: 'Store #3456', date: '2023-05-25', score: 91, status: 'Completed' },
        ];
        
        // Simulate API call for top issues
        const topIssuesData = [
          { id: '1', issue: 'Safety equipment missing', count: 15 },
          { id: '2', issue: 'Expired products', count: 12 },
          { id: '3', issue: 'Cleanliness issues', count: 10 },
          { id: '4', issue: 'Improper storage', count: 8 },
        ];
        
        setStats(statsData);
        setRecentAudits(recentAuditsData);
        setTopIssues(topIssuesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Chart data for audit scores
  const scoreData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [80, 82, 85, 83, 87, 89],
        color: () => appTheme.colors.primary,
        strokeWidth: 2,
      },
    ],
  };

  // Chart data for audit completion
  const completionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [15, 18, 22, 20, 25, 24],
      },
    ],
  };

  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: () => appTheme.colors.primary,
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 0,
  };

  return (
    <ScrollView style={styles.container}>
      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title>Total Audits</Title>
            <Paragraph style={styles.statValue}>{stats.totalAudits}</Paragraph>
          </Card.Content>
        </Card>
        
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title>Completed</Title>
            <Paragraph style={styles.statValue}>{stats.completedAudits}</Paragraph>
          </Card.Content>
        </Card>
        
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title>Pending</Title>
            <Paragraph style={styles.statValue}>{stats.pendingAudits}</Paragraph>
          </Card.Content>
        </Card>
        
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title>Avg. Score</Title>
            <Paragraph style={styles.statValue}>{stats.averageScore}%</Paragraph>
          </Card.Content>
        </Card>
      </View>
      
      {/* Charts */}
      <View style={styles.chartsContainer}>
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title>Audit Scores Over Time</Title>
            <LineChart
              data={scoreData}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>
        
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title>Audits Completed Per Month</Title>
            <BarChart
              data={completionData}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
            />
          </Card.Content>
        </Card>
      </View>
      
      {/* Recent Audits */}
      <Card style={styles.tableCard}>
        <Card.Content>
          <Title>Recent Audits</Title>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Store</DataTable.Title>
              <DataTable.Title>Date</DataTable.Title>
              <DataTable.Title numeric>Score</DataTable.Title>
              <DataTable.Title>Status</DataTable.Title>
            </DataTable.Header>
            
            {recentAudits.map((audit) => (
              <DataTable.Row key={audit.id}>
                <DataTable.Cell>{audit.name}</DataTable.Cell>
                <DataTable.Cell>{audit.date}</DataTable.Cell>
                <DataTable.Cell numeric>{audit.score}%</DataTable.Cell>
                <DataTable.Cell>{audit.status}</DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
          
          <Button 
            mode="text" 
            onPress={() => navigation.navigate('AuditList')}
            style={styles.viewAllButton}
          >
            View All Audits
          </Button>
        </Card.Content>
      </Card>
      
      {/* Top Issues */}
      <Card style={styles.tableCard}>
        <Card.Content>
          <Title>Top Issues</Title>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Issue</DataTable.Title>
              <DataTable.Title numeric>Count</DataTable.Title>
            </DataTable.Header>
            
            {topIssues.map((issue) => (
              <DataTable.Row key={issue.id}>
                <DataTable.Cell>{issue.issue}</DataTable.Cell>
                <DataTable.Cell numeric>{issue.count}</DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsCard: {
    width: '48%',
    marginBottom: 16,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
  },
  chartsContainer: {
    marginBottom: 16,
  },
  chartCard: {
    marginBottom: 16,
    elevation: 2,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  tableCard: {
    marginBottom: 16,
    elevation: 2,
  },
  viewAllButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
});

export default DashboardScreen;