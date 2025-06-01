/**
 * User Management Screen
 * Allows administrators to manage users and their permissions
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Text, Searchbar, FAB, Dialog, Portal, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { appTheme } from '../theme/webAppTheme';
import { User } from '../types/auth';

// Sample user data
const sampleUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'Admin' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Supervisor' },
  { id: '3', name: 'Bob Johnson', email: 'bob.johnson@example.com', role: 'Auditor' },
  { id: '4', name: 'Alice Williams', email: 'alice.williams@example.com', role: 'Auditor' },
  { id: '5', name: 'Charlie Brown', email: 'charlie.brown@example.com', role: 'Supervisor' },
];

// User Management Screen Component
const UserManagementScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Auditor');
  const [isEditing, setIsEditing] = useState(false);

  // Load users on component mount
  useEffect(() => {
    // In a real app, this would be an API call
    setUsers(sampleUsers);
    setFilteredUsers(sampleUsers);
  }, []);

  // Handle search
  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = users.filter(
      user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.role.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  // Show add/edit user dialog
  const showDialog = (user: User | null = null) => {
    if (user) {
      setSelectedUser(user);
      setNewUserName(user.name);
      setNewUserEmail(user.email);
      setNewUserRole(user.role);
      setIsEditing(true);
    } else {
      setSelectedUser(null);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserRole('Auditor');
      setIsEditing(false);
    }
    setDialogVisible(true);
  };

  // Hide dialog
  const hideDialog = () => {
    setDialogVisible(false);
  };

  // Save user (add or update)
  const saveUser = () => {
    // Validate inputs
    if (!newUserName || !newUserEmail || !newUserRole) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (isEditing && selectedUser) {
      // Update existing user
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, name: newUserName, email: newUserEmail, role: newUserRole }
          : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      Alert.alert('Success', 'User updated successfully');
    } else {
      // Add new user
      const newUser: User = {
        id: Date.now().toString(),
        name: newUserName,
        email: newUserEmail,
        role: newUserRole
      };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      Alert.alert('Success', 'User added successfully');
    }
    
    hideDialog();
  };

  // Delete user
  const deleteUser = (userId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this user?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            const updatedUsers = users.filter(user => user.id !== userId);
            setUsers(updatedUsers);
            setFilteredUsers(updatedUsers);
            Alert.alert('Success', 'User deleted successfully');
          },
          style: 'destructive',
        },
      ]
    );
  };

  // Render user card
  const renderUserCard = ({ item }: { item: User }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>{item.email}</Paragraph>
        <View style={styles.roleContainer}>
          <Text style={styles.roleText}>{item.role}</Text>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => showDialog(item)}>Edit</Button>
        <Button onPress={() => deleteUser(item.id)}>Delete</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search users"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchbar}
      />
      
      <FlatList
        data={filteredUsers}
        renderItem={renderUserCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => showDialog()}
        color="#fff"
      />
      
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>{isEditing ? 'Edit User' : 'Add New User'}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Name"
              value={newUserName}
              onChangeText={setNewUserName}
              style={styles.input}
            />
            <TextInput
              label="Email"
              value={newUserEmail}
              onChangeText={setNewUserEmail}
              keyboardType="email-address"
              style={styles.input}
            />
            <TextInput
              label="Role"
              value={newUserRole}
              onChangeText={setNewUserRole}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={saveUser}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
  },
  roleContainer: {
    marginTop: 8,
    backgroundColor: appTheme.colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  roleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: appTheme.colors.primary,
  },
  input: {
    marginBottom: 12,
  },
});

export default UserManagementScreen;