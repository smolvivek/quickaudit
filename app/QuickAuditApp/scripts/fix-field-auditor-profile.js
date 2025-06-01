/**
 * Script to fix TypeScript errors in field_auditor/ProfileScreen
 */

const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const ensureDirectoryExists = (dirPath) => {
  if (!dirPath || dirPath === '') return;
  
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error);
  }
};

// Fix ProfileScreen.tsx
const fixProfileScreen = () => {
  const dirPath = path.join(process.cwd(), 'src/screens/field_auditor');
  ensureDirectoryExists(dirPath);
  
  const content = `/**
 * Field Auditor Profile Screen
 * Allows field auditors to view and edit their profile information
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { 
  Avatar, 
  Button, 
  Card, 
  TextInput, 
  Switch, 
  Divider,
  Title
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { appTheme } from '../../theme/webAppTheme';

// Mock user data
const userData = {
  id: 'U12345',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '(555) 123-4567',
  jobTitle: 'Senior Field Auditor',
  department: 'Quality Assurance',
  location: 'San Francisco, CA',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  notifications: {
    email: true,
    push: true,
    sms: false
  },
  preferences: {
    darkMode: false,
    autoSync: true,
    offlineMode: false
  }
};

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(userData);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [jobTitle, setJobTitle] = useState(user.jobTitle);
  const [department, setDepartment] = useState(user.department);
  const [location, setLocation] = useState(user.location);
  const [emailNotifications, setEmailNotifications] = useState(user.notifications.email);
  const [pushNotifications, setPushNotifications] = useState(user.notifications.push);
  const [smsNotifications, setSmsNotifications] = useState(user.notifications.sms);
  const [darkMode, setDarkMode] = useState(user.preferences.darkMode);
  const [autoSync, setAutoSync] = useState(user.preferences.autoSync);
  const [offlineMode, setOfflineMode] = useState(user.preferences.offlineMode);
  
  const handleSelectImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        // Update avatar logic would go here
        Alert.alert('Success', 'Profile picture updated successfully');
      }
    });
  };
  
  const handleSaveProfile = () => {
    // Save profile logic would go here
    
    // Update user state with edited values
    setUser({
      ...user,
      name,
      email,
      phone,
      jobTitle,
      department,
      location,
      notifications: {
        email: emailNotifications,
        push: pushNotifications,
        sms: smsNotifications
      },
      preferences: {
        darkMode,
        autoSync,
        offlineMode
      }
    });
    
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  };
  
  const handleLogout = () => {
    // Logout logic would go here
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.avatarContainer}
          onPress={handleSelectImage}
        >
          <Avatar.Image 
            size={100} 
            source={{ uri: user.avatar }} 
            style={styles.avatar}
          />
          <View style={styles.editAvatarButton}>
            <Icon name="camera" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
        
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userRole}>{user.jobTitle}</Text>
        <Text style={styles.userDepartment}>{user.department}</Text>
      </View>
      
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.cardTitle}>Personal Information</Title>
            <Button 
              mode="text" 
              onPress={() => setIsEditing(!isEditing)}
              style={styles.editButton}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </View>
          
          <Divider style={styles.divider} />
          
          {isEditing ? (
            <View>
              <TextInput
                label="Full Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
              
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
              />
              
              <TextInput
                label="Phone"
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
                keyboardType="phone-pad"
              />
              
              <TextInput
                label="Job Title"
                value={jobTitle}
                onChangeText={setJobTitle}
                style={styles.input}
              />
              
              <TextInput
                label="Department"
                value={department}
                onChangeText={setDepartment}
                style={styles.input}
              />
              
              <TextInput
                label="Location"
                value={location}
                onChangeText={setLocation}
                style={styles.input}
              />
              
              <Button 
                mode="contained" 
                onPress={handleSaveProfile}
                style={styles.saveButton}
              >
                Save Changes
              </Button>
            </View>
          ) : (
            <View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{user.name}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{user.phone}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Job Title</Text>
                <Text style={styles.infoValue}>{user.jobTitle}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Department</Text>
                <Text style={styles.infoValue}>{user.department}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{user.location}</Text>
              </View>
            </View>
          )}
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Notification Settings</Title>
          <Divider style={styles.divider} />
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Email Notifications</Text>
              <Text style={styles.settingDescription}>Receive audit assignments and updates via email</Text>
            </View>
            <Switch 
              value={emailNotifications} 
              onValueChange={setEmailNotifications}
              color={appTheme.colors.primary}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDescription}>Receive alerts and reminders on your device</Text>
            </View>
            <Switch 
              value={pushNotifications} 
              onValueChange={setPushNotifications}
              color={appTheme.colors.primary}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>SMS Notifications</Text>
              <Text style={styles.settingDescription}>Receive text message alerts for high priority items</Text>
            </View>
            <Switch 
              value={smsNotifications} 
              onValueChange={setSmsNotifications}
              color={appTheme.colors.primary}
            />
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>App Preferences</Title>
          <Divider style={styles.divider} />
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingDescription}>Use dark theme throughout the app</Text>
            </View>
            <Switch 
              value={darkMode} 
              onValueChange={setDarkMode}
              color={appTheme.colors.primary}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Auto Sync</Text>
              <Text style={styles.settingDescription}>Automatically sync data when connected to internet</Text>
            </View>
            <Switch 
              value={autoSync} 
              onValueChange={setAutoSync}
              color={appTheme.colors.primary}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Offline Mode</Text>
              <Text style={styles.settingDescription}>Enable working without internet connection</Text>
            </View>
            <Switch 
              value={offlineMode} 
              onValueChange={setOfflineMode}
              color={appTheme.colors.primary}
            />
          </View>
        </Card.Content>
      </Card>
      
      <Button 
        mode="outlined" 
        icon="logout" 
        onPress={handleLogout}
        style={styles.logoutButton}
        color="#f44336"
      >
        Logout
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: appTheme.colors.primary,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#fff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: appTheme.colors.accent,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 2,
  },
  userDepartment: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  card: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
  },
  editButton: {
    marginRight: -8,
  },
  divider: {
    marginVertical: 12,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  saveButton: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    margin: 16,
    marginTop: 8,
    marginBottom: 24,
    borderColor: '#f44336',
  },
});

export default ProfileScreen;`;

  fs.writeFileSync(path.join(dirPath, 'ProfileScreen.tsx'), content, 'utf8');
  console.log('Fixed field_auditor/ProfileScreen.tsx');
};

// Run the function
console.log('Fixing field_auditor/ProfileScreen...');
fixProfileScreen();
console.log('field_auditor/ProfileScreen fixed successfully!');
