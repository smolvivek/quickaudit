import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, DataTable, useTheme, Surface, Searchbar, Chip, Avatar, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const DashboardScreen = ({ navigation }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const recentAudits = [
    { id: 1, title: 'Safety Inspection', location: 'Main Office', date: 'May 20, 2025', auditor: 'John Smith', score: 85, status: 'Completed' },
    { id: 2, title: 'Quality Assurance', location: 'Production Line A', date: 'May 19, 2025', auditor: 'Mike Williams', score: 92, status: 'Completed' },
    { id: 3, title: 'Facility Maintenance', location: 'Warehouse', date: 'May 18, 2025', auditor: 'Emily Davis', score: 78, status: 'Completed' },
    { id: 4, title: 'Compliance Check', location: 'Finance Department', date: 'May 16, 2025', auditor: 'Robert Brown', score: 95, status: 'Completed' },
  ];

  const pendingApprovals = [
    { id: 1, title: 'Safety Inspection', location: 'Branch Office', date: 'May 20, 2025', auditor: 'Sarah Johnson', status: 'Pending Approval' },
    { id: 2, title: 'Equipment Check', location: 'Workshop', date: 'May 19, 2025', auditor: 'David Lee', status: 'Pending Approval' },
  ];

  const teamPerformance = [
    { id: 1, name: 'John Smith', role: 'Field Auditor', audits: 12, avgScore: 87 },
    { id: 2, name: 'Sarah Johnson', role: 'Field Auditor', audits: 10, avgScore: 92 },
    { id: 3, name: 'David Lee', role: 'Field Auditor', audits: 8, avgScore: 85 },
    { id: 4, name: 'Emily Davis', role: 'Field Auditor', audits: 15, avgScore: 90 },
  ];

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
          <Text style={styles.greeting}>Hello, Michael</Text>
          <Text style={styles.subGreeting}>Supervisor</Text>
        </View>
        <Avatar.Text size={40} label="MS" style={{ backgroundColor: theme.colors.tertiary }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <Surface style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>45</Text>
            <Text style={styles.statLabel}>Total Audits</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>88%</Text>
            <Text style={styles.statLabel}>Avg. Score</Text>
          </View>
        </Surface>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pending Approvals</Text>
        </View>

        {pendingApprovals.length > 0 ? (
          pendingApprovals.map((audit) => (
            <Card key={audit.id} style={styles.card} onPress={() => navigation.navigate('AuditReview', { auditId: audit.id })}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{audit.title}</Text>
                  <Chip mode="outlined" style={{ backgroundColor: `${theme.colors.warning}20` }} textStyle={{ color: theme.colors.warning }}>
                    {audit.status}
                  </Chip>
                </View>
                <View style={styles.cardDetails}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Auditor:</Text>
                    <Text style={styles.detailValue}>{audit.auditor}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Location:</Text>
                    <Text style={styles.detailValue}>{audit.location}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Date:</Text>
                    <Text style={styles.detailValue}>{audit.date}</Text>
                  </View>
                </View>
              </Card.Content>
              <Card.Actions>
                <Button mode="contained" onPress={() => navigation.navigate('AuditReview', { auditId: audit.id })}>
                  Review
                </Button>
              </Card.Actions>
            </Card>
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No pending approvals</Text>
            </Card.Content>
          </Card>
        )}

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
              <DataTable.Title>Auditor</DataTable.Title>
              <DataTable.Title>Date</DataTable.Title>
              <DataTable.Title numeric>Score</DataTable.Title>
            </DataTable.Header>

            {recentAudits.map((audit) => (
              <DataTable.Row key={audit.id} onPress={() => navigation.navigate('AuditReview', { auditId: audit.id, readOnly: true })}>
                <DataTable.Cell>{audit.title}</DataTable.Cell>
                <DataTable.Cell>{audit.auditor}</DataTable.Cell>
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
          <Text style={styles.sectionTitle}>Team Performance</Text>
        </View>

        <Card style={styles.tableCard}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Auditor</DataTable.Title>
              <DataTable.Title numeric>Audits</DataTable.Title>
              <DataTable.Title numeric>Avg. Score</DataTable.Title>
            </DataTable.Header>

            {teamPerformance.map((member) => (
              <DataTable.Row key={member.id}>
                <DataTable.Cell>{member.name}</DataTable.Cell>
                <DataTable.Cell numeric>{member.audits}</DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={{ color: getScoreColor(member.avgScore) }}>{member.avgScore}%</Text>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card>
      </ScrollView>

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.tertiary }]}
        icon="chart-bar"
        onPress={() => {}}
        label="Analytics"
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
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  emptyCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    fontStyle: 'italic',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  cardDetails: {
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 8,
  },
  detailValue: {
    fontSize: 14,
    color: '#1e293b',
  },
  tableCard: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default DashboardScreen;
