/**
 * Report Summary Screen
 * Shows a summary of the audit report with scores and findings
 */

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity 
} from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Button, 
  Surface, 
  ProgressBar 
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appTheme } from '../../theme/webAppTheme';

// Mock data for the report summary
const reportData = {
  id: 'R12345',
  title: 'Monthly Fire Safety Audit',
  date: '2023-05-15',
  location: 'Main Building, Floor 3',
  auditor: 'John Doe',
  overallScore: 85,
  sections: [
    {
      id: 'S1',
      name: 'Fire Extinguishers',
      score: 90,
      items: 10,
      findings: 1
    },
    {
      id: 'S2',
      name: 'Emergency Exits',
      score: 75,
      items: 8,
      findings: 2
    },
    {
      id: 'S3',
      name: 'Alarm Systems',
      score: 95,
      items: 12,
      findings: 0
    },
    {
      id: 'S4',
      name: 'Evacuation Plans',
      score: 80,
      items: 6,
      findings: 1
    }
  ],
  findings: [
    {
      id: 'F1',
      title: 'Fire Extinguisher Missing',
      section: 'Fire Extinguishers',
      severity: 'High',
      status: 'Open'
    },
    {
      id: 'F2',
      title: 'Emergency Exit Blocked',
      section: 'Emergency Exits',
      severity: 'High',
      status: 'Open'
    },
    {
      id: 'F3',
      title: 'Exit Sign Not Illuminated',
      section: 'Emergency Exits',
      severity: 'Medium',
      status: 'Open'
    },
    {
      id: 'F4',
      title: 'Evacuation Plan Outdated',
      section: 'Evacuation Plans',
      severity: 'Low',
      status: 'Open'
    }
  ]
};

const ReportSummaryScreen = ({ navigation, route }) => {
  // In a real app, we would get the report data from the route params or API
  const report = reportData;
  
  const getScoreColor = (score) => {
    if (score >= 90) return '#4caf50';
    if (score >= 70) return '#ff9800';
    return '#f44336';
  };
  
  const getSeverityColor = (severity) => {
    switch (severity) {
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
  
  const handleViewFindings = () => {
    // Navigate to findings screen
    navigation.navigate('Findings', { reportId: report.id });
  };
  
  const handleEditReport = () => {
    // Navigate to edit report screen
    navigation.navigate('EditReport', { reportId: report.id });
  };
  
  const handleSubmitReport = () => {
    // Submit report logic would go here
    navigation.navigate('ReportSubmitted', { reportId: report.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Surface style={styles.headerSurface}>
          <View style={styles.headerContent}>
            <Title style={styles.reportTitle}>{report.title}</Title>
            <Text style={styles.reportDate}>Date: {new Date(report.date).toLocaleDateString()}</Text>
            <Text style={styles.reportLocation}>Location: {report.location}</Text>
            <Text style={styles.reportAuditor}>Auditor: {report.auditor}</Text>
          </View>
        </Surface>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Overall Score</Text>
          <Text style={[styles.scoreValue, { color: getScoreColor(report.overallScore) }]}>
            {report.overallScore}%
          </Text>
          <ProgressBar 
            progress={report.overallScore / 100} 
            color={getScoreColor(report.overallScore)} 
            style={styles.progressBar} 
          />
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Section Scores</Text>
        </View>
        
        {report.sections.map((section) => (
          <Card key={section.id} style={styles.sectionCard}>
            <Card.Content>
              <View style={styles.sectionCardHeader}>
                <Title style={styles.sectionName}>{section.name}</Title>
                <Text style={[styles.sectionScore, { color: getScoreColor(section.score) }]}>
                  {section.score}%
                </Text>
              </View>
              
              <ProgressBar 
                progress={section.score / 100} 
                color={getScoreColor(section.score)} 
                style={styles.sectionProgressBar} 
              />
              
              <View style={styles.sectionStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Items</Text>
                  <Text style={styles.statValue}>{section.items}</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Findings</Text>
                  <Text style={[
                    styles.statValue, 
                    section.findings > 0 ? styles.findingsHighlight : {}
                  ]}>
                    {section.findings}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Findings ({report.findings.length})</Text>
          <TouchableOpacity onPress={handleViewFindings}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {report.findings.slice(0, 3).map((finding) => (
          <Card key={finding.id} style={styles.findingCard}>
            <Card.Content>
              <View style={styles.findingHeader}>
                <View style={styles.findingTitleContainer}>
                  <Text style={styles.findingTitle}>{finding.title}</Text>
                  <Text style={styles.findingSection}>{finding.section}</Text>
                </View>
                <View style={[
                  styles.severityIndicator, 
                  { backgroundColor: getSeverityColor(finding.severity) }
                ]}>
                  <Text style={styles.severityText}>{finding.severity}</Text>
                </View>
              </View>
              
              <View style={styles.findingStatus}>
                <Icon 
                  name="alert-circle" 
                  size={16} 
                  color={getSeverityColor(finding.severity)} 
                  style={styles.findingStatusIcon} 
                />
                <Text style={styles.findingStatusText}>{finding.status}</Text>
              </View>
            </Card.Content>
          </Card>
        ))}
        
        {report.findings.length > 3 && (
          <TouchableOpacity 
            style={styles.moreFindings} 
            onPress={handleViewFindings}
          >
            <Text style={styles.moreFindingsText}>
              +{report.findings.length - 3} more findings
            </Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.actionButtons}>
          <Button 
            mode="outlined" 
            icon="pencil" 
            style={styles.actionButton}
            onPress={handleEditReport}
          >
            Edit Report
          </Button>
          
          <Button 
            mode="contained" 
            icon="check" 
            style={styles.actionButton}
            onPress={handleSubmitReport}
          >
            Submit Report
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  headerSurface: {
    elevation: 4,
    borderRadius: 0,
    backgroundColor: appTheme.colors.primary,
  },
  headerContent: {
    padding: 16,
  },
  reportTitle: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 8,
  },
  reportDate: {
    color: '#fff',
    opacity: 0.8,
    marginBottom: 4,
  },
  reportLocation: {
    color: '#fff',
    opacity: 0.8,
    marginBottom: 4,
  },
  reportAuditor: {
    color: '#fff',
    opacity: 0.8,
  },
  scoreContainer: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 16,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
  },
  scoreLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    color: appTheme.colors.primary,
    fontWeight: 'bold',
  },
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  sectionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionName: {
    fontSize: 16,
    flex: 1,
  },
  sectionScore: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionProgressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  sectionStats: {
    flexDirection: 'row',
    marginTop: 8,
  },
  statItem: {
    marginRight: 24,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  findingsHighlight: {
    color: '#f44336',
  },
  findingCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  findingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  findingTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  findingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  findingSection: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  severityIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  severityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  findingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  findingStatusIcon: {
    marginRight: 4,
  },
  findingStatusText: {
    fontSize: 14,
    color: '#666',
  },
  moreFindings: {
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  moreFindingsText: {
    color: appTheme.colors.primary,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default ReportSummaryScreen;