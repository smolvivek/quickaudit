import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, DataTable, useTheme, Surface, Searchbar, Chip, Avatar, FAB, IconButton, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const UserManagementScreen = ({ navigation }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const users = [
    { id: 1, name: 'John Smith', email: 'john.smith@example.com', role: 'field_auditor', status: 'active', lastActive: '2 hours ago' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah.johnson@example.com', role: 'field_auditor', status: 'active', lastActive: '1 day ago' },
    { id: 3, name: 'Michael Wilson', email: 'michael.wilson@example.com', role: 'supervisor', status: 'active', lastActive: '3 hours ago' },
    { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com', role: 'field_auditor', status: 'active', lastActive: '5 hours ago' },
    { id: 5, name: 'Robert Brown', email: 'robert.brown@example.com', role: 'client', status: 'active', lastActive: '1 week ago' },
    { id: 6, name: 'Jennifer Lee', email: 'jennifer.lee@example.com', role: 'client', status: 'inactive', lastActive: '2 weeks ago' },
  ];

  const onChangeSearch = query => setSearchQuery(query);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleLabel = (role) => {
    switch (role) {
      case 'field_auditor': return 'Field Auditor';
      case 'supervisor': return 'Supervisor';
      case 'client': return 'Client';
      case 'admin': return 'Admin';
      default: return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'field_auditor': return theme.colors.primary;
      case 'supervisor': return theme.colors.tertiary;
      case 'client': return theme.colors.secondary;
      case 'admin': return '#ef4444';
      default: return theme.colors.primary;
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? theme.colors.success : theme.colors.error;
  };

  const handleAddUser = () => {
    // In a real app, this would navigate to a user creation form
  };

  const handleEditUser = (userId) => {
    // In a real app, this would navigate to a user edit form
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>User Management</Text>
      </View>

      <View style={styles.filterContainer}>
        <Searchbar
          placeholder="Search users"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
        />
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roleFilters}>
          <Chip
            selected={selectedRole === 'all'}
            onPress={() => setSelectedRole('all')}
            style={styles.roleChip}
            mode={selectedRole === 'all' ? 'flat' : 'outlined'}
          >
            All
          </Chip>
          <Chip
            selected={selectedRole === 'field_auditor'}
            onPress={() => setSelectedRole('field_auditor')}
            style={styles.roleChip}
            mode={selectedRole === 'field_auditor' ? 'flat' : 'outlined'}
          >
            Field Auditor
          </Chip>
          <Chip
            selected={selectedRole === 'supervisor'}
            onPress={() => setSelectedRole('supervisor')}
            style={styles.roleChip}
            mode={selectedRole === 'supervisor' ? 'flat' : 'outlined'}
          >
            Supervisor
          </Chip>
          <Chip
            selected={selectedRole === 'client'}
            onPress={() => setSelectedRole('client')}
            style={styles.roleChip}
            mode={selectedRole === 'client' ? 'flat' : 'outlined'}
          >
            Client
          </Chip>
          <Chip
            selected={selectedRole === 'admin'}
            onPress={() => setSelectedRole('admin')}
            style={styles.roleChip}
            mode={selectedRole === 'admin' ? 'flat' : 'outlined'}
          >
            Admin
          </Chip>
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollView}>
        {filteredUsers.map((user) => (
          <Card key={user.id} style={styles.userCard}>
            <Card.Content>
              <View style={styles.userHeader}>
                <View style={styles.userInfo}>
                  <Avatar.Text 
                    size={40} 
                    label={user.name.split(' ').map(n => n[0]).join('')} 
                    style={{ backgroundColor: getRoleColor(user.role) }}
                  />
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                  </View>
                </View>
                <IconButton
                  icon="dots-vertical"
                  onPress={() => handleEditUser(user.id)}
                />
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.userMeta}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Role:</Text>
                  <Chip 
                    mode="outlined" 
                    style={{ backgroundColor: `${getRoleColor(user.role)}10` }}
                    textStyle={{ color: getRoleColor(user.role) }}
                  >
                    {getRoleLabel(user.role)}
                  </Chip>
                </View>
                
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Status:</Text>
                  <View style={styles.statusContainer}>
                    <View 
                      style={[
                        styles.statusDot, 
                        { backgroundColor: getStatusColor(user.status) }
                      ]} 
                    />
                    <Text style={styles.statusText}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Last Active:</Text>
                  <Text style={styles.metaValue}>{user.lastActive}</Text>
                </View>
              </View>
              
              <View style={styles.userActions}>
                <Button 
                  mode="outlined" 
                  onPress={() => handleEditUser(user.id)}
                  style={styles.actionButton}
                >
                  Edit
                </Button>
                
                <Button 
                  mode="outlined" 
                  onPress={() => {}}
                  style={styles.actionButton}
                  buttonColor={user.status === 'active' ? theme.colors.error : theme.colors.success}
                  textColor={user.status === 'active' ? theme.colors.error : theme.colors.success}
                >
                  {user.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={handleAddUser}
        label="Add User"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  filterContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchBar: {
    marginBottom: 12,
    backgroundColor: '#f1f5f9',
    elevation: 0,
    borderRadius: 8,
  },
  searchInput: {
    fontSize: 14,
  },
  roleFilters: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  roleChip: {
    marginRight: 8,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  userCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
  },
  divider: {
    marginVertical: 12,
  },
  userMeta: {
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 8,
    width: 80,
  },
  metaValue: {
    fontSize: 14,
    color: '#1e293b',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#1e293b',
  },
  userActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default UserManagementScreen;
