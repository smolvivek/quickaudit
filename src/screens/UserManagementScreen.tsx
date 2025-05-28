import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, List, Button, TextInput, Dialog, Portal } from 'react-native-paper';
import { useUsers } from '../hooks/useUsers';
import { User } from '../services/api';

interface UserManagementScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
}

interface NewUser {
  name: string;
  email: string;
  role: string;
  password: string;
}

const UserManagementScreen: React.FC<UserManagementScreenProps> = ({ navigation }) => {
  const { users, loading, error, createUser, updateUser, deleteUser } = useUsers();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newUser, setNewUser] = useState<NewUser>({
    name: '',
    email: '',
    role: 'field_auditor',
    password: '',
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await createUser(newUser);
      setShowAddDialog(false);
      setNewUser({
        name: '',
        email: '',
        role: 'field_auditor',
        password: '',
      });
    } catch (error) {
      alert('Failed to create user');
    }
  };

  const handleUpdateUser = async (user: User) => {
    try {
      await updateUser(user);
    } catch (error) {
      alert('Failed to update user');
    }
  };

  const handleDeleteUser = async (user: User) => {
    try {
      await deleteUser(user.id);
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const renderUser = (user: User) => (
    <Card key={user.id} style={styles.userCard}>
      <Card.Content>
        <List.Item
          title={user.name}
          description={user.email}
          right={() => (
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedUser(user);
                  navigation.navigate('EditUser', { user });
                }}
              >
                <Text style={styles.actionButton}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteUser(user)}
              >
                <Text style={[styles.actionButton, styles.deleteButton]}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <Text style={styles.roleText}>Role: {user.role}</Text>
      </Card.Content>
    </Card>
  );

  if (loading && !users.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>User Management</Text>

        {error && (
          <Text style={styles.error}>{error}</Text>
        )}

        <Button
          mode="contained"
          onPress={() => setShowAddDialog(true)}
          style={styles.addButton}
        >
          Add New User
        </Button>

        <Portal>
          <Dialog
            visible={showAddDialog}
            onDismiss={() => setShowAddDialog(false)}
          >
            <Dialog.Title>Add New User</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Name"
                value={newUser.name}
                onChangeText={(text) => setNewUser({ ...newUser, name: text })}
                style={styles.input}
              />
              <TextInput
                label="Email"
                value={newUser.email}
                onChangeText={(text) => setNewUser({ ...newUser, email: text })}
                style={styles.input}
              />
              <TextInput
                label="Password"
                value={newUser.password}
                onChangeText={(text) => setNewUser({ ...newUser, password: text })}
                secureTextEntry
                style={styles.input}
              />
              <TextInput
                label="Role"
                value={newUser.role}
                onChangeText={(text) => setNewUser({ ...newUser, role: text })}
                style={styles.input}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowAddDialog(false)}>Cancel</Button>
              <Button onPress={handleCreateUser}>Create</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Text style={styles.sectionTitle}>Users</Text>
        {users.map((user) => renderUser(user))}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  addButton: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
  },
  userCard: {
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    color: '#007AFF',
  },
  deleteButton: {
    color: '#FF3B30',
  },
  roleText: {
    color: '#666',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserManagementScreen;
