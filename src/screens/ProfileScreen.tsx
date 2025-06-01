import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Avatar, Text, Button, List, Divider, useTheme } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing } from '../theme/designSystem';

export const ProfileScreen = () => {
  const theme = useTheme();
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text
          size={80}
          label={user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
        />
        <Text variant="headlineSmall" style={styles.name}>
          {user?.name}
        </Text>
        <Text variant="bodyLarge" style={styles.email}>
          {user?.email}
        </Text>
        {user?.company && (
          <Text variant="bodyMedium" style={styles.company}>
            {user.company}
          </Text>
        )}
      </View>

      <Divider />

      <List.Section>
        <List.Subheader>Account</List.Subheader>
        <List.Item
          title="Edit Profile"
          left={props => <List.Icon {...props} icon="account-edit" />}
          onPress={() => {/* Navigate to Edit Profile */}}
        />
        <List.Item
          title="Change Password"
          left={props => <List.Icon {...props} icon="lock" />}
          onPress={() => {/* Navigate to Change Password */}}
        />
        <List.Item
          title="Subscription"
          description="Manage your subscription"
          left={props => <List.Icon {...props} icon="star" />}
          onPress={() => {/* Navigate to Subscription */}}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Preferences</List.Subheader>
        <List.Item
          title="Notifications"
          description="Manage notification settings"
          left={props => <List.Icon {...props} icon="bell" />}
          onPress={() => {/* Navigate to Notifications */}}
        />
        <List.Item
          title="Language"
          description="English"
          left={props => <List.Icon {...props} icon="translate" />}
          onPress={() => {/* Navigate to Language */}}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Support</List.Subheader>
        <List.Item
          title="Help Center"
          left={props => <List.Icon {...props} icon="help-circle" />}
          onPress={() => {/* Navigate to Help Center */}}
        />
        <List.Item
          title="Contact Support"
          left={props => <List.Icon {...props} icon="email" />}
          onPress={() => {/* Navigate to Contact Support */}}
        />
      </List.Section>

      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={() => {/* Navigate to Settings */}}
          style={styles.settingsButton}
        >
          Settings
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  name: {
    marginTop: spacing.md,
  },
  email: {
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  company: {
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  footer: {
    padding: spacing.lg,
  },
  settingsButton: {
    marginTop: spacing.md,
  },
}); 