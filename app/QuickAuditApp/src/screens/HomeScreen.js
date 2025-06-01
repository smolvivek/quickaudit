import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  SafeAreaView,
} from 'react-native';
import {useAudits} from '../hooks/useAudits';
import Icon from 'react-native-vector-icons/MaterialIcons';

const STATUS_COLORS = {
  draft: '#8E8E93',
  in_progress: '#007AFF',
  pending_review: '#FF9500',
  completed: '#34C759',
  archived: '#8E8E93',
};

const HomeScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState(null);
  const {
    audits,
    loading,
    error,
    refreshing,
    pagination,
    refresh,
    loadMore,
    updateFilters,
  } = useAudits();

  // Filter audits based on search query and status
  const filteredAudits = React.useMemo(() => {
    return audits.filter(audit => {
      const matchesSearch =
        audit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        audit.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || audit.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [audits, searchQuery, statusFilter]);

  // Handle search
  const handleSearch = text => {
    setSearchQuery(text);
  };

  // Handle status filter
  const handleStatusFilter = status => {
    setStatusFilter(status === statusFilter ? null : status);
  };

  // Render status filter buttons
  const renderStatusFilters = () => (
    <View style={styles.filterContainer}>
      {Object.entries(STATUS_COLORS).map(([status, color]) => (
        <TouchableOpacity
          key={status}
          style={[
            styles.filterButton,
            statusFilter === status && styles.filterButtonActive,
            {borderColor: color},
          ]}
          onPress={() => handleStatusFilter(status)}>
          <Text
            style={[
              styles.filterButtonText,
              statusFilter === status && styles.filterButtonTextActive,
            ]}>
            {status.replace('_', ' ')}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Render audit item
  const renderAuditItem = ({item}) => (
    <TouchableOpacity
      style={styles.auditItem}
      onPress={() => navigation.navigate('AuditDetails', {auditId: item.id})}>
      <View style={styles.auditHeader}>
        <Text style={styles.auditTitle}>{item.title}</Text>
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: STATUS_COLORS[item.status]},
          ]}>
          <Text style={styles.statusText}>{item.status.replace('_', ' ')}</Text>
        </View>
      </View>
      <Text style={styles.auditLocation}>{item.location}</Text>
      <View style={styles.auditFooter}>
        <Text style={styles.auditDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        {item.score !== undefined && (
          <Text style={styles.auditScore}>Score: {item.score}%</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  // Render loading state
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );

  // Render error state
  const renderError = () => (
    <View style={styles.errorContainer}>
      <Icon name="error-outline" size={48} color="#FF3B30" />
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={refresh}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  // Render empty state
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="assignment" size={48} color="#8E8E93" />
      <Text style={styles.emptyText}>No audits found</Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateAudit')}>
        <Text style={styles.createButtonText}>Create New Audit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Audits</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateAudit')}>
          <Icon name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#8E8E93" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search audits..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery ? (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}>
            <Icon name="close" size={20} color="#8E8E93" />
          </TouchableOpacity>
        ) : null}
      </View>

      {renderStatusFilters()}

      {loading && !refreshing ? (
        renderLoading()
      ) : error ? (
        renderError()
      ) : (
        <FlatList
          data={filteredAudits}
          renderItem={renderAuditItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F2F2F7',
    margin: 16,
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  auditItem: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  auditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  auditTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  auditLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  auditFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  auditDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  auditScore: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 8,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
  },
  createButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
