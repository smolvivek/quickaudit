import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, DataTable, useTheme, Surface, Searchbar, Chip, Avatar, IconButton, Divider } from 'react-native-paper';
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

  const criticalIssues = [
    { id: 1, title: 'Exposed wiring in break room', location: 'Main Office', category: 'Electrical Safety', date: 'May 20, 2025', status: 'Open', dueDate: 'May 27, 2025', severity: 'High' },
    { id: 2, title: 'Blocked fire exit in warehouse', location: 'Warehouse', category: 'Fire Safety', date: 'May 18, 2025', status: 'In Progress', dueDate: 'May 25, 2025', severity: 'High' },
    { id: 3, title: 'Inadequate lighting in stairwell', location: 'Building B', category: 'Workplace Hazards', date: 'May 15, 2025', status: 'Resolved', closedDate: 'May 19, 2025', severity: 'Medium' },
  ];

  const onChangeSearch = query => setSearchQuery(query);

  const getScoreColor = (score) => {
    if (score >= 90) return theme.colors.success;
    if (score >= 70) return theme.colors.warning;
    return theme.colors.error;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return theme.colors.error;
      case 'In Progress': return theme.colors.warning;
      case 'Resolved': return theme.colors.success;
      default: return theme.colors.lightText;
    }
  };

  const getStatusBgColor = (status) => {
    return `${getStatusColor(status)}20`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, Robert</Text>
          <Text style={styles.subGreeting}>Client</Text>
        </View>
        <Avatar.Text size={40} label="RB" style={{ backgroundColor: theme.colors.tertiary }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <Surface style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Total Audits</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>87%</Text>
            <Text style={styles.statLabel}>Average Score</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>7</Text>
            <Text style={styles.statLabel}>Open Issues</Text>
          </View>
        </Surface>

        <View style={styles.chartContainer}>
          <Surface style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Audit Performance Trend</Text>
              <View style={styles.chartActions}>
                <Chip mode="outlined" style={styles.chartAction}>Month</Chip>
                <Chip mode="flat" style={styles.chartActionActive}>Quarter</Chip>
                <Chip mode="outlined" style={styles.chartAction}>Year</Chip>
              </View>
            </View>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartPlaceholderText}>[Audit Performance Chart]</Text>
            </View>
          </Surface>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Audits</Text>
          <Button mode="text" onPress={() => {}}>View All</Button>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.auditCardsContainer}>
          {recentAudits.map((audit) => (
            <Card key={audit.id} style={styles.auditCard} onPress={() => navigation.navigate('AuditReport', { auditId: audit.id })}>
              <Card.Content>
                <Text style={styles.auditTitle}>{audit.title}</Text>
                <View style={styles.auditMeta}>
                  <Text style={styles.auditMetaItem}><IconButton icon="account" size={14} style={styles.inlineIcon} /> {audit.auditor}</Text>
                  <Text style={styles.auditMetaItem}><IconButton icon="map-marker" size={14} style={styles.inlineIcon} /> {audit.location}</Text>
                  <Text style={styles.auditMetaItem}><IconButton icon="calendar" size={14} style={styles.inlineIcon} /> {audit.date}</Text>
                </View>
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreLabel}>Score:</Text>
                  <Text style={[styles.scoreValue, { color: getScoreColor(audit.score) }]}>{audit.score}%</Text>
                  <View style={styles.scoreBar}>
                    <View 
                      style={[
                        styles.scoreFill, 
                        { 
                          width: `${audit.score}%`, 
                          backgroundColor: getScoreColor(audit.score) 
                        }
                      ]} 
                    />
                  </View>
                </View>
                <View style={styles.auditActions}>
                  <Button 
                    mode="outlined" 
                    onPress={() => navigation.navigate('AuditReport', { auditId: audit.id })}
                    style={styles.actionButton}
                  >
                    View Report
                  </Button>
                  <Button 
                    mode="outlined" 
                    onPress={() => {}}
                    style={styles.actionButton}
                  >
                    Download
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Critical Issues</Text>
          <Button mode="text" onPress={() => {}}>View All</Button>
        </View>

        {criticalIssues.map((issue) => (
          <Card key={issue.id} style={styles.issueCard}>
            <Card.Content>
              <View style={styles.issueHeader}>
                <View style={[styles.issueSeverity, { backgroundColor: issue.severity === 'High' ? theme.colors.error : theme.colors.warning }]} />
                <View style={styles.issueContent}>
                  <Text style={styles.issueTitle}>{issue.title}</Text>
                  <View style={styles.issueMeta}>
                    <Text style={styles.issueMetaItem}><IconButton icon="map-marker" size={14} style={styles.inlineIcon} /> {issue.location}</Text>
                    <Text style={styles.issueMetaItem}><IconButton icon="tag" size={14} style={styles.inlineIcon} /> {issue.category}</Text>
                    <Text style={styles.issueMetaItem}><IconButton icon="calendar" size={14} style={styles.inlineIcon} /> {issue.date}</Text>
                  </View>
                  <View style={styles.issueStatus}>
                    <Chip 
                      mode="flat" 
                      style={{ backgroundColor: getStatusBgColor(issue.status) }}
                      textStyle={{ color: getStatusColor(issue.status) }}
                    >
                      {issue.status}
                    </Chip>
                    <Text style={styles.issueDueDate}>
                      {issue.status === 'Resolved' 
                        ? `Closed: ${issue.closedDate}` 
                        : `Due: ${issue.dueDate}`}
                    </Text>
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
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
  chartContainer: {
    marginBottom: 24,
  },
  chartCard: {
    padding: 16,
    borderRadius: 12,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  chartActions: {
    flexDirection: 'row',
  },
  chartAction: {
    marginLeft: 8,
    height: 30,
  },
  chartActionActive: {
    marginLeft: 8,
    height: 30,
    backgroundColor: theme.colors.tertiary,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholderText: {
    color: '#64748b',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  auditCardsContainer: {
    marginBottom: 24,
  },
  auditCard: {
    width: 300,
    marginRight: 16,
    borderRadius: 12,
  },
  auditTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  auditMeta: {
    marginBottom: 12,
  },
  auditMetaItem: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inlineIcon: {
    margin: 0,
    padding: 0,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 8,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  scoreBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    borderRadius: 3,
  },
  auditActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  issueCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  issueHeader: {
    flexDirection: 'row',
  },
  issueSeverity: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  issueContent: {
    flex: 1,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  issueMeta: {
    marginBottom: 8,
  },
  issueMetaItem: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  issueStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  issueDueDate: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 12,
  },
});

export default DashboardScreen;
