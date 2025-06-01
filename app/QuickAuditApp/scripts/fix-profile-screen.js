/**
 * Script to fix TypeScript errors in profile screen
 */

const fs = require('fs');
const path = require('path');

// Fix ProfileScreen.tsx
const fixProfileScreen = () => {
  const filePath = path.join(process.cwd(), 'src/screens/ProfileScreen.tsx');
  
  const content = `/**
 * Profile Screen
 * Allows users to view and edit their profile information
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { TextInput, Button, Card, Avatar, Title, Divider } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import { appTheme } from '../theme/webAppTheme';

const ProfileScreen = () => {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('(555) 123-4567');
  const [company, setCompany] = useState('Acme Corporation');
  const [position, setPosition] = useState('Quality Assurance Manager');
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
        const source = { uri: response.assets[0].uri };
        setProfileImage(source);
      }
    });
  };

  const handleSaveProfile = () => {
    // Save profile logic would go here
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.profileCard}>
          <Card.Content>
            <View style={styles.profileHeader}>
              {profileImage ? (
                <Image source={profileImage} style={styles.profileImage} />
              ) : (
                <Avatar.Text 
                  size={80} 
                  label={name.split(' ').map(n => n[0]).join('')} 
                  backgroundColor={appTheme.colors.primary} 
                />
              )}
              
              {isEditing && (
                <Button 
                  mode="outlined" 
                  onPress={handleSelectImage}
                  style={styles.imageButton}
                >
                  Change Photo
                </Button>
              )}
              
              <View style={styles.profileInfo}>
                <Title style={styles.name}>{name}</Title>
                <Text style={styles.position}>{position}</Text>
                <Text style={styles.company}>{company}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.detailsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Personal Information</Title>
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
                  label="Company"
                  value={company}
                  onChangeText={setCompany}
                  style={styles.input}
                />
                
                <TextInput
                  label="Position"
                  value={position}
                  onChangeText={setPosition}
                  style={styles.input}
                />
              </View>
            ) : (
              <View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email:</Text>
                  <Text style={styles.infoValue}>{email}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Phone:</Text>
                  <Text style={styles.infoValue}>{phone}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Company:</Text>
                  <Text style={styles.infoValue}>{company}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Position:</Text>
                  <Text style={styles.infoValue}>{position}</Text>
                </View>
              </View>
            )}
          </Card.Content>
        </Card>
        
        <Button
          mode="contained"
          onPress={isEditing ? handleSaveProfile : () => setIsEditing(true)}
          style={styles.button}
        >
          {isEditing ? 'Save Profile' : 'Edit Profile'}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  profileCard: {
    marginBottom: 16,
    borderRadius: 8,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  imageButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  position: {
    fontSize: 16,
    color: '#666',
  },
  company: {
    fontSize: 14,
    color: '#888',
  },
  detailsCard: {
    marginBottom: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    width: 80,
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    paddingVertical: 8,
  },
});

export default ProfileScreen;`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed ProfileScreen.tsx');
};

// Run the function
console.log('Fixing profile screen...');
fixProfileScreen();
console.log('Profile screen fixed successfully!');
