/**
 * Script to fix TypeScript errors in UserManagementScreen
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

// Fix UserManagementScreen.tsx
const fixUserManagementScreen = () => {
  const dirPath = path.join(process.cwd(), 'src/screens/admin');
  ensureDirectoryExists(dirPath);
  
  const content = `/**
 * User Management Screen
 * Screen for administrators to manage users
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  Divider,
  Chip,
  DataTable,
  Searchbar,
  Menu,
  IconButton,
  Dialog,
  Paragraph,
  TextInput,
  HelperText,
  FAB
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appTheme } from '../../theme/webAppTheme';

// Mock data for users
const usersData = [
  {
    id: 'U1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2023-05-20 14:30',
    createdAt: '2023-01-15'
  },
  {
    id: 'U2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'Auditor',
    status: 'Active',
    lastLogin: '2023-05-19 10:15',
    createdAt: '2023-02-20'
  },
  {
    id: 'U3',
    name: 'Mike Williams',
    email: 'mike.williams@example.com',
    role: 'Auditor',
    status: 'Active',
    lastLogin: '2023-05-18 16:45',
    createdAt: '2023-03-10'
  },
  {
    id: 'U4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    role: 'Client',
    status: 'Pending',
    lastLogin: 'Never',
    createdAt: '2023-05-18'
  },
  {
    id: 'U5',
    name: 'Robert Brown',
    email: 'robert.brown@example.com',
    role: 'Client',
    status: 'Inactive',
    lastLogin: '2023-04-05 09:20',
    createdAt: '2023-02-28'
  }
];

const UserManagementScreen = ({ navigation }) => {
  const [users, setUsers] = useState(usersData);
  const [filteredUsers, setFilteredUsers] = useState(usersData);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('name');
  
  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Auditor',
    status: 'Active'
  });
  
  // Form validation errors
  const [errors, setErrors] = useState({});
  
  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, this would fetch fresh data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  
  const onChangeSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredUsers(users);
      return;
    }
    
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      user.role.toLowerCase().includes(query.toLowerCase()) ||
      user.status.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredUsers(filtered);
  };
  
  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle sort order if same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortBy(field);
      setSortOrder('asc');
    }
    
    // Sort the users
    const sorted = [...filteredUsers].sort((a, b) => {
      let comparison = 0;
      
      if (field === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (field === 'email') {
        comparison = a.email.localeCompare(b.email);
      } else if (field === 'role') {
        comparison = a.role.localeCompare(b.role);
      } else if (field === 'status') {
        comparison = a.status.localeCompare(b.status);
      } else if (field === 'lastLogin') {
        if (a.lastLogin === 'Never') return 1;
        if (b.lastLogin === 'Never') return -1;
        comparison = new Date(a.lastLogin) - new Date(b.lastLogin);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredUsers(sorted);
  };
  
  const handleUserAction = (user) => {
    setSelectedUser(user);
    setMenuVisible(true);
  };
  
  const handleViewUser = (user) => {
    setMenuVisible(false);
    navigation.navigate('UserDetails', { userId: user.id });
  };
  
  const handleEditUser = (user) => {
    setMenuVisible(false);
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setSelectedUser(user);
    setShowEditUserDialog(true);
  };
  
  const handleDeleteUser = () => {
    // In a real app, this would call an API to delete the user
    const updatedUsers = users.filter(user => user.id !== selectedUser.id);
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setShowDeleteDialog(false);
    Alert.alert('Success', \`User \${selectedUser.name} deleted successfully\`);
  };
  
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    if (!newUser.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    if (!newUser.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else {
      // Simple email validation
      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      if (!emailRegex.test(newUser.email)) {
        newErrors.email = 'Please enter a valid email address';
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleAddUser = () => {
    if (!validateForm()) {
      return;
    }
    
    // In a real app, this would call an API to add the user
    const newUserData = {
      id: \`U\${users.length + 1}\`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    const updatedUsers = [...users, newUserData];
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setShowAddUserDialog(false);
    setNewUser({
      name: '',
      email: '',
      role: 'Auditor',
      status: 'Active'
    });
    Alert.alert('Success', 'New user added successfully');
  };
  
  const handleUpdateUser = () => {
    if (!validateForm()) {
      return;
    }
    
    // In a real app, this would call an API to update the user
    const updatedUsers = users.map(user => {
      if (user.id === selectedUser.id) {
        return {
          ...user,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setShowEditUserDialog(false);
    Alert.alert('Success', \`User \${newUser.name} updated successfully\`);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return '#4caf50';
      case 'Pending':
        return '#ff9800';
      case 'Inactive':
        return '#f44336';
      default:
        return '#757575';
    }
  };
  
  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return '#9c27b0';
      case 'Auditor':
        return '#2196f3';
      case 'Client':
        return '#ff9800';
      default:
        return '#757575';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>User Management</Title>
      </View>
      
      <Searchbar
        placeholder="Search users..."
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[appTheme.colors.primary]}
          />
        }
      >
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.tableHeader}>
              <Title style={styles.cardTitle}>Users</Title>
              <Text style={styles.userCount}>{filteredUsers.length} users</Text>
            </View>
            <Divider style={styles.divider} />
            
            <ScrollView horizontal>
              <DataTable style={styles.dataTable}>
                <DataTable.Header>
                  <DataTable.Title 
                    sortDirection={sortBy === 'name' ? sortOrder : null}
                    onPress={() => handleSort('name')}
                  >
                    Name
                  </DataTable.Title>
                  <DataTable.Title 
                    sortDirection={sortBy === 'email' ? sortOrder : null}
                    onPress={() => handleSort('email')}
                  >
                    Email
                  </DataTable.Title>
                  <DataTable.Title 
                    sortDirection={sortBy === 'role' ? sortOrder : null}
                    onPress={() => handleSort('role')}
                  >
                    Role
                  </DataTable.Title>
                  <DataTable.Title 
                    sortDirection={sortBy === 'status' ? sortOrder : null}
                    onPress={() => handleSort('status')}
                  >
                    Status
                  </DataTable.Title>
                  <DataTable.Title 
                    sortDirection={sortBy === 'lastLogin' ? sortOrder : null}
                    onPress={() => handleSort('lastLogin')}
                  >
                    Last Login
                  </DataTable.Title>
                  <DataTable.Title>Actions</DataTable.Title>
                </DataTable.Header>
                
                {filteredUsers.map(user => (
                  <DataTable.Row key={user.id}>
                    <DataTable.Cell>{user.name}</DataTable.Cell>
                    <DataTable.Cell>{user.email}</DataTable.Cell>
                    <DataTable.Cell>
                      <Chip 
                        style={[styles.roleChip, { backgroundColor: getRoleColor(user.role) }]}
                        textStyle={styles.chipText}
                      >
                        {user.role}
                      </Chip>
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <Chip 
                        style={[styles.statusChip, { backgroundColor: getStatusColor(user.status) }]}
                        textStyle={styles.chipText}
                      >
                        {user.status}
                      </Chip>
                    </DataTable.Cell>
                    <DataTable.Cell>{user.lastLogin}</DataTable.Cell>
                    <DataTable.Cell>
                      <IconButton
                        icon="dots-vertical"
                        size={20}
                        onPress={() => handleUserAction(user)}
                      />
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </ScrollView>
            
            {filteredUsers.length === 0 && (
              <View style={styles.emptyContainer}>
                <Icon name="account-search-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No users found</Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
      
      <FAB
        style={styles.fab}
        icon="plus"
        label="Add User"
        onPress={() => {
          setNewUser({
            name: '',
            email: '',
            role: 'Auditor',
            status: 'Active'
          });
          setErrors({});
          setShowAddUserDialog(true);
        }}
        color="#fff"
      />
      
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={{ x: 0, y: 0 }}
        style={styles.menu}
      >
        <Menu.Item
          icon="account-details"
          onPress={() => handleViewUser(selectedUser)}
          title="View Details"
        />
        <Menu.Item
          icon="pencil"
          onPress={() => handleEditUser(selectedUser)}
          title="Edit User"
        />
        <Divider />
        <Menu.Item
          icon="delete"
          onPress={() => {
            setMenuVisible(false);
            setShowDeleteDialog(true);
          }}
          title="Delete User"
          titleStyle={{ color: '#f44336' }}
        />
      </Menu>
      
      <Dialog
        visible={showDeleteDialog}
        onDismiss={() => setShowDeleteDialog(false)}
      >
        <Dialog.Title>Delete User</Dialog.Title>
        <Dialog.Content>
          <Paragraph>
            Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onPress={handleDeleteUser} color="#f44336">Delete</Button>
        </Dialog.Actions>
      </Dialog>
      
      <Dialog
        visible={showAddUserDialog}
        onDismiss={() => setShowAddUserDialog(false)}
      >
        <Dialog.Title>Add New User</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Name"
            value={newUser.name}
            onChangeText={(text) => setNewUser({ ...newUser, name: text })}
            style={styles.input}
            error={!!errors.name}
            mode="outlined"
          />
          {!!errors.name && (
            <HelperText type="error" visible={!!errors.name}>
              {errors.name}
            </HelperText>
          )}
          
          <TextInput
            label="Email"
            value={newUser.email}
            onChangeText={(text) => setNewUser({ ...newUser, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            error={!!errors.email}
            mode="outlined"
          />
          {!!errors.email && (
            <HelperText type="error" visible={!!errors.email}>
              {errors.email}
            </HelperText>
          )}
          
          <Text style={styles.inputLabel}>Role</Text>
          <View style={styles.chipSelection}>
            <Chip 
              selected={newUser.role === 'Admin'}
              onPress={() => setNewUser({ ...newUser, role: 'Admin' })}
              style={styles.selectionChip}
            >
              Admin
            </Chip>
            <Chip 
              selected={newUser.role === 'Auditor'}
              onPress={() => setNewUser({ ...newUser, role: 'Auditor' })}
              style={styles.selectionChip}
            >
              Auditor
            </Chip>
            <Chip 
              selected={newUser.role === 'Client'}
              onPress={() => setNewUser({ ...newUser, role: 'Client' })}
              style={styles.selectionChip}
            >
              Client
            </Chip>
          </View>
          
          <Text style={styles.inputLabel}>Status</Text>
          <View style={styles.chipSelection}>
            <Chip 
              selected={newUser.status === 'Active'}
              onPress={() => setNewUser({ ...newUser, status: 'Active' })}
              style={styles.selectionChip}
            >
              Active
            </Chip>
            <Chip 
              selected={newUser.status === 'Pending'}
              onPress={() => setNewUser({ ...newUser, status: 'Pending' })}
              style={styles.selectionChip}
            >
              Pending
            </Chip>
            <Chip 
              selected={newUser.status === 'Inactive'}
              onPress={() => setNewUser({ ...newUser, status: 'Inactive' })}
              style={styles.selectionChip}
            >
              Inactive
            </Chip>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowAddUserDialog(false)}>Cancel</Button>
          <Button onPress={handleAddUser}>Add User</Button>
        </Dialog.Actions>
      </Dialog>
      
      <Dialog
        visible={showEditUserDialog}
        onDismiss={() => setShowEditUserDialog(false)}
      >
        <Dialog.Title>Edit User</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Name"
            value={newUser.name}
            onChangeText={(text) => setNewUser({ ...newUser, name: text })}
            style={styles.input}
            error={!!errors.name}
            mode="outlined"
          />
          {!!errors.name && (
            <HelperText type="error" visible={!!errors.name}>
              {errors.name}
            </HelperText>
          )}
          
          <TextInput
            label="Email"
            value={newUser.email}
            onChangeText={(text) => setNewUser({ ...newUser, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            error={!!errors.email}
            mode="outlined"
          />
          {!!errors.email && (
            <HelperText type="error" visible={!!errors.email}>
              {errors.email}
            </HelperText>
          )}
          
          <Text style={styles.inputLabel}>Role</Text>
          <View style={styles.chipSelection}>
            <Chip 
              selected={newUser.role === 'Admin'}
              onPress={() => setNewUser({ ...newUser, role: 'Admin' })}
              style={styles.selectionChip}
            >
              Admin
            </Chip>
            <Chip 
              selected={newUser.role === 'Auditor'}
              onPress={() => setNewUser({ ...newUser, role: 'Auditor' })}
              style={styles.selectionChip}
            >
              Auditor
            </Chip>
            <Chip 
              selected={newUser.role === 'Client'}
              onPress={() => setNewUser({ ...newUser, role: 'Client' })}
              style={styles.selectionChip}
            >
              Client
            </Chip>
          </View>
          
          <Text style={styles.inputLabel}>Status</Text>
          <View style={styles.chipSelection}>
            <Chip 
              selected={newUser.status === 'Active'}
              onPress={() => setNewUser({ ...newUser, status: 'Active' })}
              style={styles.selectionChip}
            >
              Active
            </Chip>
            <Chip 
              selected={newUser.status === 'Pending'}
              onPress={() => setNewUser({ ...newUser, status: 'Pending' })}
              style={styles.selectionChip}
            >
              Pending
            </Chip>
            <Chip 
              selected={newUser.status === 'Inactive'}
              onPress={() => setNewUser({ ...newUser, status: 'Inactive' })}
              style={styles.selectionChip}
            >
              Inactive
            </Chip>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowEditUserDialog(false)}>Cancel</Button>
          <Button onPress={handleUpdateUser}>Update User</Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  card: {
    margin: 16,
    borderRadius: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
  },
  userCount: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    marginVertical: 12,
  },
  dataTable: {
    minWidth: '100%',
  },
  roleChip: {
    height: 24,
  },
  statusChip: {
    height: 24,
  },
  chipText: {
    fontSize: 10,
    color: '#fff',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: appTheme.colors.primary,
  },
  menu: {
    width: 200,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 8,
  },
  chipSelection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  selectionChip: {
    marginRight: 8,
    marginBottom: 8,
  },
});

export default UserManagementScreen;`;

  fs.writeFileSync(path.join(dirPath, 'UserManagementScreen.tsx'), content, 'utf8');
  console.log('Fixed UserManagementScreen.tsx');
};

// Run the function
console.log('Fixing UserManagementScreen...');
fixUserManagementScreen();
console.log('UserManagementScreen fixed successfully!');
