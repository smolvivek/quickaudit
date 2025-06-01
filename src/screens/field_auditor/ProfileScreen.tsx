import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Avatar, Button, List, Switch, Divider, useTheme } from 'react-native-paper';
import { colors, spacing, typography } from '../../theme/designSystem';
import { SettingsMenu } from '../../components/SettingsMenu';
import { useAuth } from '../../hooks/useAuth';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  avatar: string;
  stats: {
    totalAudits: number;
    completedAudits: number;
    pendingAudits: number;
  };
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    offlineMode: boolean;
  };
};

const mockProfile: UserProfile = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Field Auditor',
  organization: 'Safety First Inc.',
  avatar: 'https://example.com/avatar.jpg',
  stats: {
    totalAudits: 156,
    completedAudits: 142,
    pendingAudits: 14,
  },
  preferences: {
    notifications: true,
    darkMode: false,
    offlineMode: true,
  },
};

export const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const [preferences, setPreferences] = React.useState(mockProfile.preferences);

  const togglePreference = (key: keyof UserProfile['preferences']) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text 
          size={80} 
          label={user?.name?.substring(0, 2).toUpperCase() || 'U'} 
        />
        <Text variant="headlineSmall" style={styles.name}>
          {user?.name}
        </Text>
        <Text variant="bodyLarge" style={styles.email}>
          {user?.email}
        </Text>
      </View>

      <SettingsMenu />

      <View style={styles.logoutContainer}>
        <Button 
          mode="outlined" 
          onPress={logout}
          style={styles.logoutButton}
        >
          Logout
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  name: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  email: {
    marginTop: 5,
    color: '#666',
  },
  logoutContainer: {
    padding: 20,
  },
  logoutButton: {
    marginTop: 10,
  },
}); 