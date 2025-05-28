import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useAudits } from '../hooks/useAudits';
import { useNavigation } from '../hooks/useNavigation';
import { colors, spacing, typography } from '../theme/designSystem';
import { BaseScreen } from '../components/BaseScreen';
import { Audit, Filters } from '../services/api';

export const HomeScreen = () => {
  const {
    audits,
    loading,
    error,
    refreshing,
    pagination,
    filters,
    refresh,
    loadMore,
    updateFilters,
  } = useAudits();
  const { navigateToCreateAudit, navigateToAuditDetails } = useNavigation();

  const handleSearch = useCallback(
    (text: string) => {
      updateFilters({ search: text });
    },
    [updateFilters]
  );

  const handleStatusFilter = useCallback(
    (status: keyof typeof colors.status | '') => {
      updateFilters({ status });
    },
    [updateFilters]
  );

  const renderAuditItem = useCallback(
    ({ item }: { item: Audit }) => (
      <TouchableOpacity
        style={styles.auditItem}
        onPress={() => navigateToAuditDetails(item.id)}
      >
        <View style={styles.auditHeader}>
          <Text style={styles.auditTitle}>{item.title}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: colors.status[item.status] },
            ]}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.auditLocation}>{item.location}</Text>
        <Text style={styles.auditDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    ),
    [navigateToAuditDetails]
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No audits found</Text>
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary.main} />
      </View>
    );
  };

  return (
    <BaseScreen>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search audits..."
            value={filters.search}
            onChangeText={handleSearch}
          />
          <TouchableOpacity
            style={styles.createButton}
            onPress={navigateToCreateAudit}
          >
            <Text style={styles.createButtonText}>Create Audit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filters.status === '' && styles.filterButtonActive,
            ]}
            onPress={() => handleStatusFilter('')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filters.status === '' && styles.filterButtonTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {Object.keys(colors.status).map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                filters.status === status && styles.filterButtonActive,
              ]}
              onPress={() => handleStatusFilter(status as keyof typeof colors.status)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filters.status === status && styles.filterButtonTextActive,
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={audits}
          renderItem={renderAuditItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          onRefresh={refresh}
          refreshing={refreshing}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={renderEmptyList}
          ListFooterComponent={renderFooter}
        />
      </View>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background.paper,
    marginRight: spacing.md,
  },
  createButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    justifyContent: 'center',
  },
  createButtonText: {
    ...typography.button,
    color: colors.background.default,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.background.paper,
  },
  filterButtonActive: {
    backgroundColor: colors.primary.main,
  },
  filterButtonText: {
    ...typography.body2,
    color: colors.text.primary,
  },
  filterButtonTextActive: {
    color: colors.background.default,
  },
  listContainer: {
    padding: spacing.md,
  },
  auditItem: {
    backgroundColor: colors.background.paper,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  auditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  auditTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    ...typography.body2,
    color: colors.background.default,
    textTransform: 'capitalize',
  },
  auditLocation: {
    ...typography.body1,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  auditDate: {
    ...typography.body2,
    color: colors.text.disabled,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.body1,
    color: colors.text.secondary,
  },
  footer: {
    padding: spacing.md,
    alignItems: 'center',
  },
}); 