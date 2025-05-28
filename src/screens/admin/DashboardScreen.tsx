import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, DataTable, useTheme, Surface, Searchbar, Chip, Avatar, FAB, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const DashboardScreen = ({ navigation }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('week');

  const recentAudits = [
    { id: 1, title: 'Safety Inspection', location: 'Main Office', date: 'May 20, 2025', score: 85, status: 'Completed' },
    { id: 2, title: 'Quality Assurance', location: 'Production Line A', date: 'May 19, 2025', score: 92, status: 'Completed' },
    { id: 3, title: 'Facility Maintenance', location: 'Warehouse', date: 'May 18, 2025', score: 78, status: 'Completed' },
    { id: 4, title: 'Compliance Check', location: 'Finance Department', date: 'May 16, 2025', score: 95, status: 'Completed' },
  ];

  const userStats = {
    totalUsers: 24,
    activeUsers: 18,
    newUsers: 3,
    userRoles: [
      { role: 'Field Auditor', count: 12 },
      { role: 'Supervisor', count: 5 },
      { role: 'Client', count: 6 },
      { role: 'Admin', count: 1 },
    ]
  };

  const templateStats = {
    totalTemplates: 15,
    recentlyUsed: [
      { id: 1, name: 'Safety Inspection', usageCount: 24 },
      { id: 2, name: 'Quality Assurance', usageCount: 18 },
      { id: 3, name: 'Compliance Check', usageCount: 12 },
    ]
  };

  const onChangeSearch = query => setSearchQuery(query);

  const getScoreColor = (score) => {
    if (score >= 90) return theme.colors.success;
    if (score >= 70) return theme.colors.warning;
    return theme.colors.error;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, Admin</Text>
          <Text style={styles.subGreeting}>System Administrator</Text>
        </View>
        <Avatar.Text size={40} label="AD" style={{ backgroundColor: theme.colors.primary }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <Surface style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userStats.totalUsers}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{templateStats.totalTemplates}</Text>
            <Text style={styles.statLabel}>Templates</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{recentAudits.length}</Text>
            <Text style={styles.statLabel}>Recent Audits</Text>
          </View>
        </Surface>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>System Overview</Text>
          <SegmentedButtons
            value={timeFilter}
            onValueChange={setTimeFilter}
            buttons={[
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
              { value: 'year', label: 'Year' },
            ]}
            style={styles.segmentedButtons}
          />
        </View>

        <View style={styles.cardsRow}>
          <Card style={[styles.overviewCard, styles.userCard]}>
            <Card.Content>
              <Text style={styles.cardTitle}>User Activity</Text>
              <View style={styles.userStatsRow}>
                <View style={styles.miniStat}>
                  <Text style={styles.miniStatValue}>{userStats.activeUsers}</Text>
                  <Text style={styles.miniStatLabel}>Active</Text>
                </View>
                <View style={styles.miniStat}>
                  <Text style={styles.miniStatValue}>{userStats.newUsers}</Text>
                  <Text style={styles.miniStatLabel}>New</Text>
                </View>
              </View>
              <View style={styles.chartPlaceholder}>
                <Text style={styles.chartPlaceholderText}>User Activity Chart</Text>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => navigation.navigate('UserManagement')}>Manage Users</Button>
            </Card.Actions>
          </Card>

          <Card style={[styles.overviewCard, styles.templateCard]}>
            <Card.Content>
              <Text style={styles.cardTitle}>Template Usage</Text>
              <View style={styles.chartPlaceholder}>
                <Text style={styles.chartPlaceholderText}>Template Usage Chart</Text>
              </View>
              <View style={styles.templateList}>
                {templateStats.recentlyUsed.map((template, index) => (
                  <View key={template.id} style={styles.templateItem}>
                    <Text style={styles.templateName} numberOfLines={1}>{template.name}</Text>
                    <Text style={styles.templateCount}>{template.usageCount}</Text>
                  </View>
                ))}
              </View>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => navigation.navigate('TemplateManagement')}>Manage Templates</Button>
            </Card.Actions>
          </Card>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Audits</Text>
          <Searchbar
            placeholder="Search audits"
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
          />
        </View>

        <Card style={styles.tableCard}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Audit</DataTable.Title>
              <DataTable.Title>Location</DataTable.Title>
              <DataTable.Title>Date</DataTable.Title>
              <DataTable.Title numeric>Score</DataTable.Title>
            </DataTable.Header>

            {recentAudits.map((audit) => (
              <DataTable.Row key={audit.id}>
                <DataTable.Cell>{audit.title}</DataTable.Cell>
                <DataTable.Cell>{audit.location}</DataTable.Cell>
                <DataTable.Cell>{audit.date}</DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={{ color: getScoreColor(audit.score) }}>{audit.score}%</Text>
                </DataTable.Cell>
              </DataTable.Row>
            ))}

            <DataTable.Pagination
              page={0}
              numberOfPages={1}
              onPageChange={() => {}}
              label="1-4 of 4"
            />
          </DataTable>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>User Distribution</Text>
        </View>

        <Card style={styles.tableCard}>
          <Card.Content>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartPlaceholderText}>User Role Distribution Chart</Text>
            </View>
            <View style={styles.roleList}>
              {userStats.userRoles.map((roleData, index) => (
                <View key={index} style={styles.roleItem}>
                  <View style={styles.roleDot} />
                  <Text style={styles.roleName}>{roleData.role}</Text>
                  <Text style={styles.roleCount}>{roleData.count}</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => navigation.navigate('UserManagement')}
        label="Add User"
        small
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subGreeting: {
    fontSize: 14,
    color: '#64748b',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#e2e8f0',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  segmentedButtons: {
    marginBottom: 12,
  },
  searchBar: {
    height: 40,
    backgroundColor: '#ffffff',
    elevation: 0,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
  },
  searchInput: {
    fontSize: 14,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  overviewCard: {
    flex: 1,
    borderRadius: 12,
  },
  userCard: {
    marginRight: 8,
  },
  templateCard: {
    marginLeft: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  userStatsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  miniStat: {
    marginRight: 16,
  },
  miniStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  miniStatLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  chartPlaceholder: {
    height: 120,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartPlaceholderText: {
    color: '#64748b',
    fontSize: 12,
  },
  templateList: {
    marginTop: 8,
  },
  templateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  templateName: {
    fontSize: 14,
    color: '#1e293b',
    flex: 1,
  },
  templateCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  tableCard: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  roleList: {
    marginTop: 16,
  },
  roleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  roleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563eb',
    marginRight: 8,
  },
  roleName: {
    fontSize: 14,
    color: '#1e293b',
    flex: 1,
  },
  roleCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default DashboardScreen;
