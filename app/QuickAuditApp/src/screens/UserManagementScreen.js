import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {withPermission} from '../components/withPermission';
import PermissionService from '../services/permissionService';
import User from '../models/User';
import Role from '../models/Role';

const UserManagementScreen = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector(state => state.auth.user);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersList, rolesList] = await Promise.all([
        User.list(),
        Role.list(),
      ]);
      setUsers(usersList);
      setRoles(rolesList);
    } catch (error) {
      console.error('Failed to load data:', error);
      Alert.alert('Error', 'Failed to load users and roles');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRoleId) => {
    try {
      await PermissionService.assignRole(userId, newRoleId);
      await loadData();
      Alert.alert('Success', 'User role updated successfully');
    } catch (error) {
      console.error('Failed to update role:', error);
      Alert.alert('Error', 'Failed to update user role');
    }
  };

  const renderUserItem = ({item}) => {
    const canEdit =
      currentUser &&
      (currentUser.id === item.id ||
        PermissionService.checkPermission(
          currentUser.id,
          PermissionService.PERMISSIONS.USER_UPDATE,
        ));

    return (
      <View style={styles.userItem}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {item.first_name} {item.last_name}
          </Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
        {canEdit && (
          <View style={styles.roleSelector}>
            <Text>Role:</Text>
            <TouchableOpacity
              style={styles.roleButton}
              onPress={() => {
                Alert.alert(
                  'Change Role',
                  'Select new role',
                  roles.map(role => ({
                    text: role.name,
                    onPress: () => handleRoleChange(item.id, role.id),
                  })),
                );
              }}>
              <Text>{item.role_name || 'No Role'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 16,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  roleSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
});

export default withPermission(
  UserManagementScreen,
  PermissionService.PERMISSIONS.USER_READ,
);
