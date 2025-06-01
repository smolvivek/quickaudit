/**
 * Admin Dashboard Screen
 * Main dashboard for admin users
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  Avatar,
  Divider,
  Badge,
  Searchbar,
  IconButton
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appTheme } from '../theme/webAppTheme';
import QuickAuditCard from '../components/QuickAuditCard';

// Mock data for the admin dashboard
const dashboardData = {
  users: {
    total: 124,
    active: 98,
    pending: 8,
    inactive: 18
  },
  audits: {
    total: 1256,
    completed: 987,
    inProgress: 189,
    notStarted: 80
  },
  templates: {
    total: 42,
    published: 36,
    draft: 6
  },
  recentActivity: [
    {
      id: 'A1',
      type: 'user_added',
      user: 'Sarah Johnson',
      timestamp: '2023-05-20 14:30',
      details: 'New user account created'
    },
    {
      id: 'A2',
      type: 'template_published',
      user: 'Admin',
      timestamp: '2023-05-19 10:15',
      details: 'Restaurant Health Inspection template published'
    },
    {
      id: 'A3',
      type: 'audit_completed',
      user: 'John Smith',
      timestamp: '2023-05-18 16:45',
      details: 'Monthly Fire Safety Inspection completed'
    },
    {
      id: 'A4',
      type: 'finding_resolved',
      user: 'Mike Williams',
      timestamp: '2023-05-18 11:20',
      details: 'High severity finding resolved: Emergency exit blocked'
    }
  ]
};

const AdminDashboardScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, this would fetch fresh data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  
  const onChangeSearch = (query) => {
    setSearchQuery(query);
  };
  
  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_added':
        return 'account-plus';
      case 'template_published':
        return 'file-document-edit';
      case 'audit_completed':
        return 'clipboard-check';
      case 'finding_resolved':
        return 'alert-circle-check';
      default:
        return 'information';
    }
  };
  
  const getActivityColor = (type) => {
    switch (type) {
      case 'user_added':
        return '#4caf50';
      case 'template_published':
        return '#2196f3';
      case 'audit_completed':
        return '#9c27b0';
      case 'finding_resolved':
        return '#ff9800';
      default:
        return '#757575';
    }
  };
  
  const navigateToUserManagement = () => {
    navigation.navigate('UserManagement');
  };
  
  const navigateToTemplateManagement = () => {
    navigation.navigate('TemplateManagement');
  };
  
  const navigateToAuditManagement = () => {
    navigation.navigate('AuditManagement');
  };
  
  const navigateToSettings = () => {
    navigation.navigate('AdminSettings');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Admin Dashboard</Title>
        <IconButton
          icon="cog"
          size={24}
          color={appTheme.colors.primary}
          onPress={navigateToSettings}
        />
      </View>
      
      <Searchbar
        placeholder="Search..."
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[appTheme.colors.primary]}
          />
        }
      >
        <View style={styles.cardRow}>
          <QuickAuditCard
            title="Users"
            value={dashboardData.users.total}
            icon="account-group"
            color="#4caf50"
            onPress={navigateToUserManagement}
            style={styles.card}
          >
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{dashboardData.users.active}</Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{dashboardData.users.pending}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{dashboardData.users.inactive}</Text>
                <Text style={styles.statLabel}>Inactive</Text>
              </View>
            </View>
          </QuickAuditCard>
          
          <QuickAuditCard
            title="Audits"
            value={dashboardData.audits.total}
            icon="clipboard-list"
            color="#2196f3"
            onPress={navigateToAuditManagement}
            style={styles.card}
          >
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{dashboardData.audits.completed}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{dashboardData.audits.inProgress}</Text>
                <Text style={styles.statLabel}>In Progress</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{dashboardData.audits.notStarted}</Text>
                <Text style={styles.statLabel}>Not Started</Text>
              </View>
            </View>
          </QuickAuditCard>
        </View>
        
        <View style={styles.cardRow}>
          <QuickAuditCard
            title="Templates"
            value={dashboardData.templates.total}
            icon="file-document-multiple"
            color="#9c27b0"
            onPress={navigateToTemplateManagement}
            style={styles.card}
          >
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{dashboardData.templates.published}</Text>
                <Text style={styles.statLabel}>Published</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{dashboardData.templates.draft}</Text>
                <Text style={styles.statLabel}>Draft</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>-</Text>
                <Text style={styles.statLabel}></Text>
              </View>
            </View>
          </QuickAuditCard>
          
          <QuickAuditCard
            title="Analytics"
            value="View"
            icon="chart-bar"
            color="#ff9800"
            onPress={() => navigation.navigate('Analytics')}
            style={styles.card}
          >
            <Text style={styles.analyticsText}>
              View detailed reports and analytics for your organization
            </Text>
          </QuickAuditCard>
        </View>
        
        <Card style={styles.activityCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Recent Activity</Title>
            <Divider style={styles.divider} />
            
            {dashboardData.recentActivity.map(activity => (
              <View key={activity.id} style={styles.activityItem}>
                <Avatar.Icon 
                  size={40} 
                  icon={getActivityIcon(activity.type)} 
                  style={[styles.activityIcon, { backgroundColor: getActivityColor(activity.type) }]} 
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
            
            <Button 
              mode="text" 
              onPress={() => navigation.navigate('ActivityLog')}
              style={styles.viewAllButton}
            >
              View All Activity
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    marginHorizontal: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  analyticsText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  activityCard: {
    marginHorizontal: 16,
    marginBottom: 16,
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
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityIcon: {
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityDetails: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  activityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activityUser: {
    fontSize: 12,
    color: '#666',
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
  viewAllButton: {
    alignSelf: 'center',
    marginTop: 8,
  },
});

export default AdminDashboardScreen;