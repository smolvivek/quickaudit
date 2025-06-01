import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Switch, Divider, useTheme } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing } from '../theme/designSystem';

export const SettingsScreen = () => {
  const theme = useTheme();
  const { logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  return (
    <ScrollView style={styles.container}>
      <List.Section>
        <List.Subheader>Preferences</List.Subheader>
        <List.Item
          title="Notifications"
          description="Enable push notifications"
          left={props => <List.Icon {...props} icon="bell" />}
          right={() => (
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          )}
        />
        <List.Item
          title="Dark Mode"
          description="Enable dark theme"
          left={props => <List.Icon {...props} icon="theme-light-dark" />}
          right={() => (
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
            />
          )}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Legal</List.Subheader>
        <List.Item
          title="About Us"
          left={props => <List.Icon {...props} icon="information" />}
          onPress={() => {/* Navigate to About Us */}}
        />
        <List.Item
          title="Contact Us"
          left={props => <List.Icon {...props} icon="email" />}
          onPress={() => {/* Navigate to Contact Us */}}
        />
        <List.Item
          title="Privacy Policy"
          left={props => <List.Icon {...props} icon="shield-account" />}
          onPress={() => {/* Navigate to Privacy Policy */}}
        />
        <List.Item
          title="Terms & Conditions"
          left={props => <List.Icon {...props} icon="file-document" />}
          onPress={() => {/* Navigate to Terms */}}
        />
        <List.Item
          title="Refund Policy"
          left={props => <List.Icon {...props} icon="cash-refund" />}
          onPress={() => {/* Navigate to Refund Policy */}}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Account</List.Subheader>
        <List.Item
          title="Subscription"
          description="Manage your subscription"
          left={props => <List.Icon {...props} icon="star" />}
          onPress={() => {/* Navigate to Subscription */}}
        />
        <List.Item
          title="Logout"
          left={props => <List.Icon {...props} icon="logout" color={colors.error.main} />}
          onPress={handleLogout}
        />
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
}); 