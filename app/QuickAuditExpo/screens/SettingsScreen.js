import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import TabBar from '../components/TabBar';
import { AuthContext } from '../App';

const SettingsScreen = ({ navigation }) => {
  const { colors, typography, spacing, toggleTheme, theme } = useTheme();
  const { signOut } = useContext(AuthContext);
  const isDarkMode = theme === 'dark';

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: null, // Replace with actual avatar image if available
    company: 'Acme Corporation',
    role: 'Auditor',
  };

  // Settings sections
  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: 'business', label: 'Company', value: user.company, action: () => console.log('Company pressed') },
        { icon: 'shield-checkmark', label: 'Role & Permissions', value: user.role, action: () => console.log('Role pressed') },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: 'notifications', label: 'Notifications', toggle: true, action: () => console.log('Notifications toggled') },
        { icon: 'contrast', label: 'Theme', value: isDarkMode ? 'Dark' : 'Light', action: toggleTheme },
        { icon: 'language', label: 'Language', value: 'English', action: () => console.log('Language pressed') },
      ],
    },
    {
      title: 'Help & Support',
      items: [
        { icon: 'help-circle', label: 'Help Center', action: () => console.log('Help Center pressed') },
        { icon: 'mail', label: 'Contact Support', action: () => console.log('Contact Support pressed') },
      ],
    },
    {
      title: 'About',
      items: [
        { icon: 'information-circle', label: 'App Version', value: '1.0.0', action: () => console.log('App Version pressed') },
      ],
    },
  ];

  // Render a setting item
  const renderSettingItem = (item, index, isLast) => (
    <TouchableOpacity
      key={item.label}
      style={[
        styles.settingItem,
        { 
          borderBottomColor: colors.border,
          borderBottomWidth: isLast ? 0 : 1,
          paddingVertical: spacing.md,
        }
      ]}
      onPress={item.action}
    >
      <View style={styles.settingItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.backgroundSecondary }]}>
          <Ionicons name={item.icon} size={20} color={colors.primary} />
        </View>
        <Text style={[styles.settingLabel, { color: colors.text, ...typography.body }]}>
          {item.label}
        </Text>
      </View>

      <View style={styles.settingItemRight}>
        {item.value && (
          <Text style={[styles.settingValue, { color: colors.textSecondary, ...typography.bodySmall }]}>
            {item.value}
          </Text>
        )}
        {item.toggle ? (
          <View style={[
            styles.toggleSwitch, 
            { backgroundColor: isDarkMode ? colors.primary : colors.backgroundSecondary }
          ]}>
            <View style={[
              styles.toggleKnob, 
              { 
                backgroundColor: colors.surface,
                transform: [{ translateX: isDarkMode ? 20 : 0 }] 
              }
            ]} />
          </View>
        ) : (
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );

  // Render a settings section
  const renderSection = (section, sectionIndex) => (
    <View 
      key={section.title}
      style={[
        styles.section, 
        { 
          marginBottom: spacing.lg,
          backgroundColor: colors.surface,
          borderRadius: spacing.borderRadius.medium,
        }
      ]}
    >
      <Text style={[styles.sectionTitle, { color: colors.textSecondary, ...typography.subtitle, marginBottom: spacing.sm }]}>
        {section.title}
      </Text>
      <View style={[styles.sectionContent, { backgroundColor: colors.surface }]}>
        {section.items.map((item, index) => 
          renderSettingItem(item, index, index === section.items.length - 1)
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text, ...typography.h1 }]}>
          Settings
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileContainer}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.backgroundSecondary }]}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <Text style={[styles.avatarPlaceholder, { color: colors.primary, ...typography.h1 }]}>
                {user.name.charAt(0)}
              </Text>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text, ...typography.h3 }]}>
              {user.name}
            </Text>
            <Text style={[styles.profileEmail, { color: colors.textSecondary, ...typography.bodySmall }]}>
              {user.email}
            </Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="pencil" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {settingsSections.map(renderSection)}

        <TouchableOpacity 
          style={[
            styles.logoutButton, 
            { 
              backgroundColor: colors.error,
              marginBottom: 80, // Space for tab bar
            }
          ]}
          onPress={() => {
            // Show confirmation dialog before logging out
            Alert.alert(
              'Logout',
              'Are you sure you want to logout?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Logout',
                  style: 'destructive',
                  onPress: () => signOut(),
                },
              ],
              { cancelable: true }
            );
          }}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.white} style={styles.logoutIcon} />
          <Text style={[styles.logoutText, { color: colors.white, ...typography.buttonText }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <TabBar
        activeTab="settings"
        onTabPress={(tab) => {
          if (tab !== 'settings') {
            navigation.navigate(tab);
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    fontSize: 24,
    fontWeight: '600',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  editButton: {
    padding: 8,
  },
  section: {
    overflow: 'hidden',
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingTop: 16,
    fontWeight: '500',
  },
  sectionContent: {
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingLabel: {
    fontWeight: '500',
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    marginRight: 8,
  },
  toggleSwitch: {
    width: 40,
    height: 20,
    borderRadius: 10,
    padding: 2,
  },
  toggleKnob: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutIcon: {
    marginRight: 8,
  },
  section: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    fontWeight: '600',
  },
  sectionContent: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  logoutText: {
    fontWeight: '600',
  },
});

export default SettingsScreen;
