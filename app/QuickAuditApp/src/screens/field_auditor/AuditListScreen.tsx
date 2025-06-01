/**
 * Audit List Screen
 * Shows a list of audits for field auditors
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { 
  Searchbar, 
  Card, 
  Chip, 
  FAB, 
  Divider,
  Menu,
  Button
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appTheme } from '../../theme/webAppTheme';

// Mock data for audits
const mockAudits = [
  {
    id: 'A1001',
    title: 'Monthly Fire Safety Inspection',
    location: 'Main Building, Floor 3',
    date: '2023-05-20',
    time: '10:00 AM',
    status: 'Pending',
    priority: 'High',
    type: 'Fire Safety'
  },
  {
    id: 'A1002',
    title: 'Quarterly Health & Safety Audit',
    location: 'East Wing, Floor 1',
    date: '2023-05-22',
    time: '2:00 PM',
    status: 'Pending',
    priority: 'Medium',
    type: 'Health & Safety'
  },
  {
    id: 'A1003',
    title: 'Equipment Safety Check',
    location: 'Workshop Area',
    date: '2023-05-25',
    time: '9:00 AM',
    status: 'Pending',
    priority: 'Low',
    type: 'Equipment'
  },
  {
    id: 'A1004',
    title: 'Monthly Fire Safety Inspection',
    location: 'West Wing, Floor 2',
    date: '2023-05-15',
    time: '11:00 AM',
    status: 'Completed',
    priority: 'High',
    type: 'Fire Safety'
  },
  {
    id: 'A1005',
    title: 'Electrical Safety Audit',
    location: 'Utility Room',
    date: '2023-05-10',
    time: '3:00 PM',
    status: 'Completed',
    priority: 'High',
    type: 'Electrical'
  }
];

const AuditListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [menuVisible, setMenuVisible] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  
  const filteredAudits = mockAudits.filter(audit => {
    if (filter === 'all') return true;
    if (filter === 'pending') return audit.status === 'Pending';
    if (filter === 'completed') return audit.status === 'Completed';
    if (filter === 'high') return audit.priority === 'High';
    return true;
  }).filter(audit => {
    if (!searchQuery) return true;
    return audit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           audit.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
           audit.type.toLowerCase().includes(searchQuery.toLowerCase());
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date);
    }
    if (sortBy === 'priority') {
      const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });
  
  const onChangeSearch = query => setSearchQuery(query);
  
  const navigateToAuditDetails = (auditId) => {
    navigation.navigate('AuditDetails', { auditId });
  };
  
  const navigateToNewAudit = () => {
    navigation.navigate('NewAudit');
  };
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return '#f44336';
      case 'Medium':
        return '#ff9800';
      case 'Low':
        return '#4caf50';
      default:
        return '#757575';
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#2196f3';
      case 'In Progress':
        return '#ff9800';
      case 'Completed':
        return '#4caf50';
      default:
        return '#757575';
    }
  };
  
  const renderAuditItem = ({ item }) => (
    <Card 
      style={styles.auditCard}
      onPress={() => navigateToAuditDetails(item.id)}
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text style={styles.auditTitle}>{item.title}</Text>
          <Chip 
            style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) + '20' }]}
            textStyle={{ color: getStatusColor(item.status) }}
          >
            {item.status}
          </Chip>
        </View>
        
        <View style={styles.auditDetails}>
          <View style={styles.detailItem}>
            <Icon name="map-marker" size={16} color="#666" style={styles.detailIcon} />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Icon name="calendar" size={16} color="#666" style={styles.detailIcon} />
            <Text style={styles.detailText}>{item.date}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Icon name="clock-outline" size={16} color="#666" style={styles.detailIcon} />
            <Text style={styles.detailText}>{item.time}</Text>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <Chip 
            style={[styles.typeChip, { backgroundColor: '#e0e0e0' }]}
            textStyle={{ color: '#616161' }}
          >
            {item.type}
          </Chip>
          
          <Chip 
            style={[styles.priorityChip, { backgroundColor: getPriorityColor(item.priority) + '20' }]}
            textStyle={{ color: getPriorityColor(item.priority) }}
          >
            {item.priority} Priority
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search audits"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
        
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setMenuVisible(true)}
            >
              <Icon name="filter-variant" size={24} color={appTheme.colors.primary} />
            </TouchableOpacity>
          }
        >
          <Menu.Item 
            onPress={() => { setSortBy('date'); setMenuVisible(false); }} 
            title="Sort by Date" 
            icon={sortBy === 'date' ? 'check' : undefined}
          />
          <Menu.Item 
            onPress={() => { setSortBy('priority'); setMenuVisible(false); }} 
            title="Sort by Priority" 
            icon={sortBy === 'priority' ? 'check' : undefined}
          />
          <Menu.Item 
            onPress={() => { setSortBy('title'); setMenuVisible(false); }} 
            title="Sort by Title" 
            icon={sortBy === 'title' ? 'check' : undefined}
          />
          <Divider />
          <Menu.Item 
            onPress={() => { setFilter('all'); setMenuVisible(false); }} 
            title="All Audits" 
            icon={filter === 'all' ? 'check' : undefined}
          />
          <Menu.Item 
            onPress={() => { setFilter('pending'); setMenuVisible(false); }} 
            title="Pending Only" 
            icon={filter === 'pending' ? 'check' : undefined}
          />
          <Menu.Item 
            onPress={() => { setFilter('completed'); setMenuVisible(false); }} 
            title="Completed Only" 
            icon={filter === 'completed' ? 'check' : undefined}
          />
          <Menu.Item 
            onPress={() => { setFilter('high'); setMenuVisible(false); }} 
            title="High Priority Only" 
            icon={filter === 'high' ? 'check' : undefined}
          />
        </Menu>
      </View>
      
      <View style={styles.filterChips}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Button 
            mode={filter === 'all' ? 'contained' : 'outlined'} 
            onPress={() => setFilter('all')}
            style={styles.filterChip}
            compact
          >
            All
          </Button>
          <Button 
            mode={filter === 'pending' ? 'contained' : 'outlined'} 
            onPress={() => setFilter('pending')}
            style={styles.filterChip}
            compact
          >
            Pending
          </Button>
          <Button 
            mode={filter === 'completed' ? 'contained' : 'outlined'} 
            onPress={() => setFilter('completed')}
            style={styles.filterChip}
            compact
          >
            Completed
          </Button>
          <Button 
            mode={filter === 'high' ? 'contained' : 'outlined'} 
            onPress={() => setFilter('high')}
            style={styles.filterChip}
            compact
          >
            High Priority
          </Button>
        </ScrollView>
      </View>
      
      <FlatList
        data={filteredAudits}
        renderItem={renderAuditItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="clipboard-text-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No audits found</Text>
            <Text style={styles.emptySubtext}>Try changing your search or filters</Text>
          </View>
        }
      />
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={navigateToNewAudit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    marginRight: 8,
    elevation: 2,
  },
  filterButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    elevation: 2,
  },
  filterChips: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  auditCard: {
    marginBottom: 12,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  auditTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  statusChip: {
    height: 28,
  },
  auditDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeChip: {
    height: 28,
  },
  priorityChip: {
    height: 28,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: appTheme.colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});

export default AuditListScreen;