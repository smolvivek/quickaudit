/**
 * QuickAudit App
 * Minimal version for testing
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  
  // Render different screens based on state
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return renderHomeScreen();
      case 'audits':
        return renderAuditsScreen();
      case 'profile':
        return renderProfileScreen();
      default:
        return renderHomeScreen();
    }
  };
  
  // Home screen
  const renderHomeScreen = () => (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>QuickAudit</Text>
      <Text style={styles.subtitle}>Streamline your audit process</Text>
      
      <View style={styles.cardContainer}>
        <TouchableOpacity 
          style={styles.card}
          onPress={() => setCurrentScreen('audits')}
        >
          <Text style={styles.cardTitle}>My Audits</Text>
          <Text style={styles.cardSubtitle}>View and manage your audits</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Create Audit</Text>
          <Text style={styles.cardSubtitle}>Start a new audit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Reports</Text>
          <Text style={styles.cardSubtitle}>View and share reports</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.card}
          onPress={() => setCurrentScreen('profile')}
        >
          <Text style={styles.cardTitle}>My Profile</Text>
          <Text style={styles.cardSubtitle}>View and edit your profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  // Audits screen
  const renderAuditsScreen = () => (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentScreen('home')}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Audits</Text>
      </View>
      
      <View style={styles.auditList}>
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.auditItem}>
            <Text style={styles.auditTitle}>Audit #{item}</Text>
            <Text style={styles.auditDate}>May 30, 2025</Text>
            <Text style={styles.auditStatus}>Status: Complete</Text>
            <View style={styles.auditScore}>
              <Text style={styles.scoreText}>Score: 85%</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
  
  // Profile screen
  const renderProfileScreen = () => (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentScreen('home')}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>
      
      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>VM</Text>
          </View>
        </View>
        
        <Text style={styles.profileName}>Vivek Mangipudi</Text>
        <Text style={styles.profileEmail}>vivek@example.com</Text>
        
        <View style={styles.profileStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Audits</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Avg. Score</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>Pro</Text>
            <Text style={styles.statLabel}>Plan</Text>
          </View>
        </View>
      </View>
    </View>
  );
  
  // Bottom navigation
  const renderBottomNav = () => (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={[styles.navItem, currentScreen === 'home' && styles.activeNavItem]} 
        onPress={() => setCurrentScreen('home')}
      >
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.navItem, currentScreen === 'audits' && styles.activeNavItem]} 
        onPress={() => setCurrentScreen('audits')}
      >
        <Text style={styles.navText}>Audits</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navText}>Reports</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.navItem, currentScreen === 'profile' && styles.activeNavItem]} 
        onPress={() => setCurrentScreen('profile')}
      >
        <Text style={styles.navText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#4CAF50" />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        {renderScreen()}
      </ScrollView>
      {renderBottomNav()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  screenContainer: {
    padding: 16,
    minHeight: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 30,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 18,
    color: '#4CAF50',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  auditList: {
    marginTop: 16,
  },
  auditItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  auditTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  auditDate: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  auditStatus: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 8,
  },
  auditScore: {
    backgroundColor: '#E8F5E9',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  scoreText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  profileEmail: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 24,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    height: 56,
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeNavItem: {
    borderTopWidth: 2,
    borderTopColor: '#4CAF50',
  },
  navText: {
    fontSize: 14,
    color: '#757575',
  },
});

export default App;