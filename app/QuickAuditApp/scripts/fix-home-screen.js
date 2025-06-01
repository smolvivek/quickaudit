/**
 * Script to fix TypeScript errors in HomeScreen
 */

const fs = require('fs');
const path = require('path');

// Fix HomeScreen.tsx
const fixHomeScreen = () => {
  const filePath = path.join(process.cwd(), 'src/screens/HomeScreen.tsx');
  
  const content = `/**
 * Home Screen
 * Main dashboard for the QuickAudit app
 */

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { Card, Button, Title, Paragraph, Badge } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appTheme } from '../theme/webAppTheme';

const HomeScreen = ({ navigation }) => {
  // Mock data for the dashboard
  const stats = {
    openAudits: 5,
    pendingFindings: 12,
    completedAudits: 28,
    upcomingAudits: 3
  };
  
  const recentAudits = [
    {
      id: 'A1001',
      title: 'Monthly Fire Safety Inspection',
      date: '2023-05-15',
      status: 'In Progress',
      findings: 3
    },
    {
      id: 'A1002',
      title: 'Quarterly Health & Safety Audit',
      date: '2023-05-10',
      status: 'Completed',
      findings: 5
    },
    {
      id: 'A1003',
      title: 'Annual Compliance Review',
      date: '2023-05-01',
      status: 'Completed',
      findings: 8
    }
  ];
  
  const navigateToAudits = () => {
    // Navigate to audits screen
    navigation.navigate('Audits');
  };
  
  const navigateToNewAudit = () => {
    // Navigate to new audit screen
    navigation.navigate('NewAudit');
  };
  
  const navigateToFindings = () => {
    // Navigate to findings screen
    navigation.navigate('Findings');
  };
  
  const navigateToAuditDetails = (auditId) => {
    // Navigate to audit details screen
    navigation.navigate('AuditDetails', { auditId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="bell" size={24} color={appTheme.colors.primary} />
            <Badge style={styles.badge}>3</Badge>
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statCard} onPress={navigateToAudits}>
            <View style={styles.statIconContainer}>
              <Icon name="clipboard-list" size={24} color="#fff" />
            </View>
            <Text style={styles.statValue}>{stats.openAudits}</Text>
            <Text style={styles.statLabel}>Open Audits</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.statCard} onPress={navigateToFindings}>
            <View style={styles.statIconContainer}>
              <Icon name="alert-circle" size={24} color="#fff" />
            </View>
            <Text style={styles.statValue}>{stats.pendingFindings}</Text>
            <Text style={styles.statLabel}>Pending Findings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.statCard} onPress={navigateToAudits}>
            <View style={styles.statIconContainer}>
              <Icon name="check-circle" size={24} color="#fff" />
            </View>
            <Text style={styles.statValue}>{stats.completedAudits}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.statCard} onPress={navigateToAudits}>
            <View style={styles.statIconContainer}>
              <Icon name="calendar-clock" size={24} color="#fff" />
            </View>
            <Text style={styles.statValue}>{stats.upcomingAudits}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.actionsContainer}>
          <Button 
            mode="contained" 
            icon="plus" 
            style={styles.actionButton}
            onPress={navigateToNewAudit}
          >
            New Audit
          </Button>
          
          <Button 
            mode="outlined" 
            icon="file-document" 
            style={styles.actionButton}
            onPress={navigateToAudits}
          >
            View All Audits
          </Button>
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Audits</Text>
          <TouchableOpacity onPress={navigateToAudits}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {recentAudits.map((audit) => (
          <Card 
            key={audit.id} 
            style={styles.auditCard}
            onPress={() => navigateToAuditDetails(audit.id)}
          >
            <Card.Content>
              <View style={styles.auditHeader}>
                <Title style={styles.auditTitle}>{audit.title}</Title>
                <Badge 
                  style={[
                    styles.statusBadge,
                    audit.status === 'Completed' ? styles.completedBadge : 
                    audit.status === 'In Progress' ? styles.inProgressBadge : 
                    styles.pendingBadge
                  ]}
                >
                  {audit.status}
                </Badge>
              </View>
              
              <View style={styles.auditDetails}>
                <View style={styles.auditDetail}>
                  <Icon name="calendar" size={16} color="#666" style={styles.detailIcon} />
                  <Text style={styles.detailText}>{new Date(audit.date).toLocaleDateString()}</Text>
                </View>
                
                <View style={styles.auditDetail}>
                  <Icon name="alert-circle-outline" size={16} color="#666" style={styles.detailIcon} />
                  <Text style={styles.detailText}>{audit.findings} Findings</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 8,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: appTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 0,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    color: appTheme.colors.primary,
    fontWeight: 'bold',
  },
  auditCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  auditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  auditTitle: {
    fontSize: 16,
    flexShrink: 1,
    marginRight: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
  },
  completedBadge: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  inProgressBadge: {
    backgroundColor: '#e3f2fd',
    color: '#1565c0',
  },
  pendingBadge: {
    backgroundColor: '#fff3e0',
    color: '#e65100',
  },
  auditDetails: {
    flexDirection: 'row',
    marginTop: 8,
  },
  auditDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailIcon: {
    marginRight: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed HomeScreen.tsx');
};

// Run the function
console.log('Fixing HomeScreen...');
fixHomeScreen();
console.log('HomeScreen fixed successfully!');
