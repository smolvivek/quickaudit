import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { QuickAuditCard } from '../../components/ui/card';
import { QuickAuditButton } from '../../components/ui/button';
import { Text } from 'react-native-paper';
import { theme } from '../../theme/theme';

const AdminDashboardScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineLarge" style={styles.title}>
          Admin Dashboard
        </Text>
        <QuickAuditButton
          mode="contained"
          style={styles.newButton}
        >
          Create New Template
        </QuickAuditButton>
      </View>

      <View style={styles.grid}>
        <QuickAuditCard style={styles.card}>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Audit Templates
          </Text>
          <Text variant="bodyLarge" style={styles.cardText}>
            Manage your audit templates
          </Text>
        </QuickAuditCard>

        <QuickAuditCard style={styles.card}>
          <Text variant="titleLarge" style={styles.cardTitle}>
            User Management
          </Text>
          <Text variant="bodyLarge" style={styles.cardText}>
            Manage team members and roles
          </Text>
        </QuickAuditCard>

        <QuickAuditCard style={styles.card}>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Organization Settings
          </Text>
          <Text variant="bodyLarge" style={styles.cardText}>
            Configure organization preferences
          </Text>
        </QuickAuditCard>

        <QuickAuditCard style={styles.card}>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Reports
          </Text>
          <Text variant="bodyLarge" style={styles.cardText}>
            View and export audit reports
          </Text>
        </QuickAuditCard>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  newButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  grid: {
    padding: 16,
    gap: 16,
  },
  card: {
    padding: 16,
    minHeight: 120,
  },
  cardTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  cardText: {
    color: theme.colors.onSurfaceVariant,
  },
});

export default AdminDashboardScreen;
