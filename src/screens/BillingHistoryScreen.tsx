import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Card, List, Title, Paragraph } from 'react-native-paper';
import { useBillingHistory } from '../hooks/useBillingHistory';
import { BillingHistoryItem } from '../services/api';

interface BillingHistoryScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
}

const BillingHistoryScreen: React.FC<BillingHistoryScreenProps> = ({ navigation }) => {
  const { loading, error, history, loadMore, refreshing, refresh } = useBillingHistory();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    type: 'all',
  });

  const handleRefresh = () => {
    refresh();
  };

  const handleLoadMore = () => {
    loadMore();
  };

  const renderHistoryItem = (item: BillingHistoryItem) => (
    <Card key={item.id} style={styles.card}>
      <Card.Content>
        <Title>{item.description}</Title>
        <Paragraph>
          Amount: ${item.amount.toFixed(2)}
        </Paragraph>
        <Paragraph>
          Date: {new Date(item.date).toLocaleDateString()}
        </Paragraph>
        <Paragraph>
          Status: {item.status}
        </Paragraph>
        <Paragraph>
          Type: {item.type}
        </Paragraph>
      </Card.Content>
    </Card>
  );

  if (loading && !history.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title>Billing History</Title>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterButtonText}>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Text>
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <List.Item
            title="Date Range"
            description={filters.dateRange}
            onPress={() => {
              // Implement date range picker
            }}
          />
          <List.Item
            title="Transaction Type"
            description={filters.type}
            onPress={() => {
              // Implement type filter
            }}
          />
        </View>
      )}

      <View style={styles.historyContainer}>
        {history.map((item) => renderHistoryItem(item))}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.loadMoreButton}
        onPress={handleLoadMore}
        disabled={loading}
      >
        <Text style={styles.loadMoreButtonText}>
          {loading ? 'Loading...' : 'Load More'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  filterButtonText: {
    color: '#333',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginVertical: 8,
  },
  errorText: {
    color: '#dc3545',
  },
  loadMoreButton: {
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginVertical: 8,
  },
  loadMoreButtonText: {
    color: '#007bff',
  },
});

export default BillingHistoryScreen;
