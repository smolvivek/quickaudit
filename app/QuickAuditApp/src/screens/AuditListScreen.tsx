/**
 * AuditListScreen Component
 * Displays a list of audits with filtering and sorting options
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Searchbar, Card, Text, Chip, FAB, Menu, Divider, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appTheme } from '../theme';
import { useAuth } from '../contexts/AuthContext';

// Mock audit data
const mockAudits = [
  {
    id: '1',
    title: 'Annual Safety Inspection',
    client: 'Acme Corporation',
    status: 'Completed',
    dueDate: '2025-05-15',
    completedDate: '2025-05-12',
    findings: 8,
    criticalFindings: 2,
  },
  {
    id: '2',
    title: 'Quarterly Compliance Review',
    client: 'TechSolutions Inc.',
    status: 'In Progress',
    dueDate: '2025-06-10',
    completedDate: null,
    findings: 3,
    criticalFindings: 0,
  },
  {
    id: '3',
    title: 'Environmental Assessment',
    client: 'GreenEnergy Ltd.',
    status: 'Not Started',
    dueDate: '2025-07-20',
    completedDate: null,
    findings: 0,
    criticalFindings: 0,
  },
  {
    id: '4',
    title: 'Fire Safety Audit',
    client: 'City Hospital',
    status: 'Overdue',
    dueDate: '2025-04-30',
    completedDate: null,
    findings: 0,
    criticalFindings: 0,
  },
  {
    id: '5',
    title: 'ISO 9001 Certification',
    client: 'Manufacturing Partners',
    status: 'Completed',
    dueDate: '2025-03-15',
    completedDate: '2025-03-10',
    findings: 12,
    criticalFindings: 3,
  },
];

const AuditListScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [audits, setAudits] = useState(mockAudits);
  const [filteredAudits, setFilteredAudits] = useState(mockAudits);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('dueDate');
  
  const navigation = useNavigation();
  const { user } = useAuth();
  
  // Filter options
  const filterOptions = [
    { label: 'Completed', value: 'Completed' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Not Started', value: 'Not Started' },
    { label: 'Overdue', value: 'Overdue' },
  ];
  
  // Sort options
  const sortOptions = [
    { label: 'Due Date', value: 'dueDate' },
    { label: 'Title', value: 'title' },
    { label: 'Client', value: 'client' },
    { label: 'Status', value: 'status' },
  ];
  
  // Load audits
  useEffect(() => {
    loadAudits();
  }, []);
  
  // Filter audits when search query or filters change
  useEffect(() => {
    filterAudits();
  }, [searchQuery, activeFilters, sortBy, audits]);
  
  // Load audits from API (mock)
  const loadAudits = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would fetch from an API
      // For now, use mock data
      setAudits(mockAudits);
    } catch (error) {
      console.error('Failed to load audits:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Refresh audits
  const onRefresh = async () => {
    setRefreshing(true);
    await loadAudits();
    setRefreshing(false);
  };
  
  // Filter and sort audits
  const filterAudits = () => {
    let filtered = [...audits];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        audit =>
          audit.title.toLowerCase().includes(query) ||
          audit.client.toLowerCase().includes(query)
      );
    }
    
    // Apply status filters
    if (activeFilters.length > 0) {
      filtered = filtered.filter(audit => activeFilters.includes(audit.status));
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === 'title' || sortBy === 'client' || sortBy === 'status') {
        return a[sortBy].localeCompare(b[sortBy]);
      }
      return 0;
    });
    
    setFilteredAudits(filtered);
  };
  
  // Toggle filter
  const toggleFilter = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return appTheme.colors.success;
      case 'In Progress':
        return appTheme.colors.info;
      case 'Not Started':
        return appTheme.colors.neutral;
      case 'Overdue':
        return appTheme.colors.error;
      default:
        return appTheme.colors.neutral;
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Navigate to audit details
  const navigateToAuditDetails = (auditId: string) => {
    navigation.navigate('AuditDetail', { auditId });
  };
  
  // Navigate to create audit
  const navigateToCreateAudit = () => {
    navigation.navigate('CreateAudit');
  };
  
  // Render audit item
  const renderAuditItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToAuditDetails(item.id)}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
            <Chip
              style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
              textStyle={styles.statusText}
            >
              {item.status}
            </Chip>
          </View>
          
          <Text style={styles.clientName}>{item.client}</Text>
          
          <View style={styles.cardDetails}>
            <View style={styles.detailItem}>
              <Icon name="calendar" size={16} color={appTheme.colors.text} />
              <Text style={styles.detailText}>Due: {formatDate(item.dueDate)}</Text>
            </View>
            
            {item.status === 'Completed' && (
              <View style={styles.detailItem}>
                <Icon name="check-circle" size={16} color={appTheme.colors.success} />
                <Text style={styles.detailText}>Completed: {formatDate(item.completedDate)}</Text>
              </View>
            )}
            
            {(item.status === 'Completed' || item.status === 'In Progress') && (
              <View style={styles.findingsContainer}>
                <View style={styles.detailItem}>
                  <Icon name="alert-circle-outline" size={16} color={appTheme.colors.text} />
                  <Text style={styles.detailText}>Findings: {item.findings}</Text>
                </View>
                
                {item.criticalFindings > 0 && (
                  <View style={styles.detailItem}>
                    <Icon name="alert-circle" size={16} color={appTheme.colors.error} />
                    <Text style={[styles.detailText, { color: appTheme.colors.error }]}>
                      Critical: {item.criticalFindings}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
  
  // Render empty list
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Icon name="clipboard-text-outline" size={64} color={appTheme.colors.disabled} />
      <Text style={styles.emptyText}>No audits found</Text>
      <Text style={styles.emptySubtext}>
        {searchQuery || activeFilters.length > 0
          ? 'Try adjusting your filters or search query'
          : 'Create your first audit by tapping the + button'}
      </Text>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search audits..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        
        <View style={styles.filterContainer}>
          <View style={styles.filterButtonContainer}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setFilterMenuVisible(true)}
            >
              <Icon name="filter-variant" size={20} color={appTheme.colors.primary} />
              <Text style={styles.filterButtonText}>Filter</Text>
              {activeFilters.length > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{activeFilters.length}</Text>
                </View>
              )}
            </TouchableOpacity>
            
            <Menu
              visible={filterMenuVisible}
              onDismiss={() => setFilterMenuVisible(false)}
              anchor={<View />}
              style={styles.menu}
            >
              {filterOptions.map(option => (
                <Menu.Item
                  key={option.value}
                  onPress={() => toggleFilter(option.value)}
                  title={option.label}
                  titleStyle={{
                    color: activeFilters.includes(option.value)
                      ? appTheme.colors.primary
                      : appTheme.colors.text,
                  }}
                  leadingIcon={() =>
                    activeFilters.includes(option.value) ? (
                      <Icon name="check" size={20} color={appTheme.colors.primary} />
                    ) : null
                  }
                />
              ))}
            </Menu>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.filterButtonContainer}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setSortMenuVisible(true)}
            >
              <Icon name="sort" size={20} color={appTheme.colors.primary} />
              <Text style={styles.filterButtonText}>Sort</Text>
            </TouchableOpacity>
            
            <Menu
              visible={sortMenuVisible}
              onDismiss={() => setSortMenuVisible(false)}
              anchor={<View />}
              style={styles.menu}
            >
              {sortOptions.map(option => (
                <Menu.Item
                  key={option.value}
                  onPress={() => {
                    setSortBy(option.value);
                    setSortMenuVisible(false);
                  }}
                  title={option.label}
                  titleStyle={{
                    color: sortBy === option.value
                      ? appTheme.colors.primary
                      : appTheme.colors.text,
                  }}
                  leadingIcon={() =>
                    sortBy === option.value ? (
                      <Icon name="check" size={20} color={appTheme.colors.primary} />
                    ) : null
                  }
                />
              ))}
            </Menu>
          </View>
        </View>
        
        {activeFilters.length > 0 && (
          <View style={styles.activeFiltersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {activeFilters.map(filter => (
                <Chip
                  key={filter}
                  style={styles.filterChip}
                  onClose={() => toggleFilter(filter)}
                  onPress={() => toggleFilter(filter)}
                >
                  {filter}
                </Chip>
              ))}
              {activeFilters.length > 0 && (
                <TouchableOpacity
                  style={styles.clearFiltersButton}
                  onPress={() => setActiveFilters([])}
                >
                  <Text style={styles.clearFiltersText}>Clear All</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        )}
      </View>
      
      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={appTheme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredAudits}
          renderItem={renderAuditItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      
      {user?.role !== 'client' && (
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={navigateToCreateAudit}
          label="New Audit"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appTheme.colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: appTheme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: appTheme.colors.border,
  },
  searchBar: {
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButtonContainer: {
    flex: 1,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  filterButtonText: {
    marginLeft: 8,
    color: appTheme.colors.primary,
    fontWeight: '500',
  },
  filterBadge: {
    backgroundColor: appTheme.colors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  filterBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: appTheme.colors.border,
  },
  menu: {
    marginTop: 40,
  },
  activeFiltersContainer: {
    marginTop: 12,
  },
  filterChip: {
    marginRight: 8,
    backgroundColor: appTheme.colors.primaryLight,
  },
  clearFiltersButton: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  clearFiltersText: {
    color: appTheme.colors.primary,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  statusChip: {
    height: 28,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  clientName: {
    fontSize: 16,
    color: appTheme.colors.secondary,
    marginBottom: 12,
  },
  cardDetails: {
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: appTheme.colors.text,
  },
  findingsContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: appTheme.colors.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: appTheme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: appTheme.colors.primary,
  },
});

export default AuditListScreen;