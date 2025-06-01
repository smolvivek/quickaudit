/**
 * Field Auditor Dashboard Screen
 * Main dashboard for field auditors to view their assigned audits and tasks
 */

import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Animated
} from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Button, 
  Surface, 
  Badge,
  Avatar
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appTheme } from '../../theme/webAppTheme';

// Mock data for the dashboard
const userData = {
  name: 'John Doe',
  role: 'Field Auditor',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  stats: {
    completedAudits: 28,
    pendingAudits: 5,
    findings: 12
  }
};

const upcomingAudits = [
  {
    id: 'A1001',
    title: 'Monthly Fire Safety Inspection',
    location: 'Main Building, Floor 3',
    date: '2023-05-20',
    time: '10:00 AM',
    priority: 'High'
  },
  {
    id: 'A1002',
    title: 'Quarterly Health & Safety Audit',
    location: 'East Wing, Floor 1',
    date: '2023-05-22',
    time: '2:00 PM',
    priority: 'Medium'
  },
  {
    id: 'A1003',
    title: 'Equipment Safety Check',
    location: 'Workshop Area',
    date: '2023-05-25',
    time: '9:00 AM',
    priority: 'Low'
  }
];

const recentFindings = [
  {
    id: 'F1001',
    title: 'Fire Extinguisher Missing',
    audit: 'Monthly Fire Safety Inspection',
    date: '2023-05-15',
    severity: 'High',
    status: 'Open'
  },
  {
    id: 'F1002',
    title: 'Emergency Exit Blocked',
    audit: 'Weekly Safety Walkthrough',
    date: '2023-05-12',
    severity: 'High',
    status: 'In Progress'
  },
  {
    id: 'F1003',
    title: 'First Aid Kit Incomplete',
    audit: 'Health & Safety Audit',
    date: '2023-05-10',
    severity: 'Medium',
    status: 'Closed'
  }
];

const DashboardScreen = ({ navigation }) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp'
  });
  
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [200, 120],
    extrapolate: 'clamp'
  });
  
  const getPriorityColor = (priority) => {
    switch (priority) {
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
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return '#f44336';
      case 'In Progress':
        return '#2196f3';
      case 'Closed':
        return '#4caf50';
      default:
        return '#757575';
    }
  };
  
  const navigateToAuditDetails = (auditId) => {
    navigation.navigate('AuditDetails', { auditId });
  };
  
  const navigateToFindingDetails = (findingId) => {
    navigation.navigate('FindingDetails', { findingId });
  };
  
  const navigateToNewAudit = () => {
    navigation.navigate('NewAudit');
  };
  
  const AnimatedSurface = Animated.createAnimatedComponent(Surface);
  const AnimatedCard = Animated.createAnimatedComponent(Card);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={[
          styles.header, 
          { 
            opacity: headerOpacity,
            height: headerHeight
          }
        ]}
      >
        <View style={styles.userInfo}>
          <Avatar.Image 
            size={60} 
            source={{ uri: userData.avatar }} 
            style={styles.avatar}
          />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userRole}>{userData.role}</Text>
          </View>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData.stats.completedAudits}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData.stats.pendingAudits}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData.stats.findings}</Text>
            <Text style={styles.statLabel}>Findings</Text>
          </View>
        </View>
      </Animated.View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'upcoming' && styles.activeTab
          ]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'upcoming' && styles.activeTabText
          ]}>Upcoming Audits</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'findings' && styles.activeTab
          ]}
          onPress={() => setActiveTab('findings')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'findings' && styles.activeTabText
          ]}>Recent Findings</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {activeTab === 'upcoming' && (
          <View style={styles.contentContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Audits</Text>
              <Button 
                mode="contained" 
                icon="plus" 
                style={styles.newButton}
                onPress={navigateToNewAudit}
              >
                New Audit
              </Button>
            </View>
            
            {upcomingAudits.map((audit) => (
              <AnimatedCard 
                key={audit.id} 
                style={styles.auditCard}
                onPress={() => navigateToAuditDetails(audit.id)}
              >
                <Card.Content>
                  <View style={styles.auditHeader}>
                    <Title style={styles.auditTitle}>{audit.title}</Title>
                    <Badge 
                      style={[
                        styles.priorityBadge,
                        { backgroundColor: getPriorityColor(audit.priority) }
                      ]}
                    >
                      {audit.priority}
                    </Badge>
                  </View>
                  
                  <View style={styles.auditDetails}>
                    <View style={styles.auditDetail}>
                      <Icon name="map-marker" size={16} color="#666" style={styles.detailIcon} />
                      <Text style={styles.detailText}>{audit.location}</Text>
                    </View>
                    
                    <View style={styles.auditDetail}>
                      <Icon name="calendar" size={16} color="#666" style={styles.detailIcon} />
                      <Text style={styles.detailText}>{audit.date}</Text>
                    </View>
                    
                    <View style={styles.auditDetail}>
                      <Icon name="clock-outline" size={16} color="#666" style={styles.detailIcon} />
                      <Text style={styles.detailText}>{audit.time}</Text>
                    </View>
                  </View>
                </Card.Content>
              </AnimatedCard>
            ))}
          </View>
        )}
        
        {activeTab === 'findings' && (
          <View style={styles.contentContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Findings</Text>
            </View>
            
            {recentFindings.map((finding) => (
              <AnimatedCard 
                key={finding.id} 
                style={styles.findingCard}
                onPress={() => navigateToFindingDetails(finding.id)}
              >
                <Card.Content>
                  <View style={styles.findingHeader}>
                    <View style={styles.findingTitleContainer}>
                      <Text style={styles.findingTitle}>{finding.title}</Text>
                      <Text style={styles.findingAudit}>{finding.audit}</Text>
                    </View>
                    <View style={[
                      styles.severityIndicator, 
                      { backgroundColor: getSeverityColor(finding.severity) }
                    ]}>
                      <Text style={styles.severityText}>{finding.severity}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.findingDetails}>
                    <View style={styles.findingDetail}>
                      <Icon name="calendar" size={16} color="#666" style={styles.detailIcon} />
                      <Text style={styles.detailText}>{finding.date}</Text>
                    </View>
                    
                    <View style={styles.findingDetail}>
                      <Icon 
                        name="alert-circle" 
                        size={16} 
                        color={getStatusColor(finding.status)} 
                        style={styles.detailIcon} 
                      />
                      <Text style={[
                        styles.detailText,
                        { color: getStatusColor(finding.status) }
                      ]}>
                        {finding.status}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </AnimatedCard>
            ))}
          </View>
        )}
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
    backgroundColor: appTheme.colors.primary,
    padding: 16,
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#fff',
  },
  userDetails: {
    marginLeft: 16,
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userRole: {
    color: '#fff',
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#fff',
    opacity: 0.8,
    fontSize: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: appTheme.colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: appTheme.colors.primary,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  newButton: {
    borderRadius: 20,
    height: 40,
    paddingHorizontal: 12,
  },
  auditCard: {
    marginBottom: 12,
    borderRadius: 8,
  },
  auditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  auditTitle: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
  },
  auditDetails: {
    marginTop: 8,
  },
  auditDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  findingCard: {
    marginBottom: 12,
    borderRadius: 8,
  },
  findingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  findingTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  findingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  findingAudit: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  severityIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  severityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  findingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  findingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default DashboardScreen;