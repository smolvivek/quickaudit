import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, ProgressBar, useTheme, Surface, Chip, Divider, List, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const ReportSummaryScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const { auditTitle, location, auditType, sections, responses, notes, photos } = route.params || {};
  
  const [score, setScore] = useState(0);
  const [compliantCount, setCompliantCount] = useState(0);
  const [nonCompliantCount, setNonCompliantCount] = useState(0);
  const [naCount, setNaCount] = useState(0);
  const [sectionScores, setSectionScores] = useState([]);
  
  useEffect(() => {
    // Calculate scores
    if (responses) {
      let totalItems = 0;
      let totalCompliant = 0;
      let totalNonCompliant = 0;
      let totalNA = 0;
      
      const sectionResults = sections.map(section => {
        let sectionCompliant = 0;
        let sectionNonCompliant = 0;
        let sectionNA = 0;
        
        section.items.forEach(item => {
          const response = responses[`${section.id}-${item.id}`];
          if (response === 'compliant') {
            sectionCompliant++;
            totalCompliant++;
          } else if (response === 'non-compliant') {
            sectionNonCompliant++;
            totalNonCompliant++;
          } else if (response === 'na') {
            sectionNA++;
            totalNA++;
          }
        });
        
        const sectionTotal = sectionCompliant + sectionNonCompliant;
        const sectionScore = sectionTotal > 0 ? Math.round((sectionCompliant / sectionTotal) * 100) : 0;
        
        return {
          id: section.id,
          title: section.title,
          score: sectionScore,
          compliant: sectionCompliant,
          nonCompliant: sectionNonCompliant,
          na: sectionNA
        };
      });
      
      setSectionScores(sectionResults);
      
      totalItems = totalCompliant + totalNonCompliant;
      const overallScore = totalItems > 0 ? Math.round((totalCompliant / totalItems) * 100) : 0;
      
      setScore(overallScore);
      setCompliantCount(totalCompliant);
      setNonCompliantCount(totalNonCompliant);
      setNaCount(totalNA);
    }
  }, [responses, sections]);
  
  const getScoreColor = (score) => {
    if (score >= 90) return theme.colors.success;
    if (score >= 70) return theme.colors.warning;
    return theme.colors.error;
  };
  
  const handleFinish = () => {
    navigation.navigate('Dashboard');
  };
  
  const handleViewDetails = () => {
    // In a real app, this would navigate to a detailed report view
  };
  
  const handleShare = () => {
    // In a real app, this would open sharing options
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Surface style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Audit Summary</Text>
          <Text style={styles.headerSubtitle}>{auditTitle}</Text>
          <Text style={styles.headerInfo}>Location: {location}</Text>
          <Text style={styles.headerInfo}>Type: {auditType?.charAt(0).toUpperCase() + auditType?.slice(1)}</Text>
          <Text style={styles.headerInfo}>Date: {new Date().toLocaleDateString()}</Text>
        </Surface>
        
        <Surface style={styles.scoreContainer}>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreTitle}>Overall Score</Text>
            <Chip 
              mode="flat" 
              style={{ 
                backgroundColor: `${getScoreColor(score)}20`
              }}
              textStyle={{ 
                color: getScoreColor(score)
              }}
            >
              {score}%
            </Chip>
          </View>
          
          <ProgressBar 
            progress={score / 100} 
            color={getScoreColor(score)} 
            style={styles.scoreBar} 
          />
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.success }]}>{compliantCount}</Text>
              <Text style={styles.statLabel}>Compliant</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.error }]}>{nonCompliantCount}</Text>
              <Text style={styles.statLabel}>Non-Compliant</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{naCount}</Text>
              <Text style={styles.statLabel}>N/A</Text>
            </View>
          </View>
        </Surface>
        
        <Text style={styles.sectionTitle}>Section Scores</Text>
        
        {sectionScores.map((section) => (
          <Card key={section.id} style={styles.sectionCard}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionName}>{section.title}</Text>
                <Chip 
                  mode="flat" 
                  style={{ 
                    backgroundColor: `${getScoreColor(section.score)}20`
                  }}
                  textStyle={{ 
                    color: getScoreColor(section.score)
                  }}
                >
                  {section.score}%
                </Chip>
              </View>
              
              <ProgressBar 
                progress={section.score / 100} 
                color={getScoreColor(section.score)} 
                style={styles.sectionBar} 
              />
              
              <View style={styles.sectionStats}>
                <Text style={styles.sectionStat}>
                  <Text style={{ color: theme.colors.success }}>{section.compliant}</Text> Compliant
                </Text>
                <Text style={styles.sectionStat}>
                  <Text style={{ color: theme.colors.error }}>{section.nonCompliant}</Text> Non-Compliant
                </Text>
                <Text style={styles.sectionStat}>
                  <Text>{section.na}</Text> N/A
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))}
        
        <Text style={styles.sectionTitle}>Non-Compliance Issues</Text>
        
        {nonCompliantCount > 0 ? (
          sections.map((section) => {
            // Find non-compliant items in this section
            const nonCompliantItems = section.items.filter(item => 
              responses[`${section.id}-${item.id}`] === 'non-compliant'
            );
            
            if (nonCompliantItems.length === 0) return null;
            
            return (
              <Card key={`nc-${section.id}`} style={styles.issuesCard}>
                <Card.Content>
                  <Text style={styles.issuesSectionName}>{section.title}</Text>
                  <Divider style={styles.divider} />
                  
                  {nonCompliantItems.map((item) => (
                    <List.Item
                      key={`nc-item-${item.id}`}
                      title={item.text}
                      description={notes[`${section.id}-${item.id}`] || 'No notes provided'}
                      left={props => <List.Icon {...props} icon="alert-circle" color={theme.colors.error} />}
                      right={props => (
                        photos[`${section.id}-${item.id}`]?.length > 0 && 
                        <IconButton icon="image" onPress={() => {}} />
                      )}
                      titleStyle={styles.issueTitle}
                      descriptionStyle={styles.issueDescription}
                      style={styles.issueItem}
                    />
                  ))}
                </Card.Content>
              </Card>
            );
          })
        ) : (
          <Card style={styles.issuesCard}>
            <Card.Content>
              <Text style={styles.noIssuesText}>No non-compliance issues found</Text>
            </Card.Content>
          </Card>
        )}
        
        <View style={styles.actionContainer}>
          <Button 
            mode="contained" 
            onPress={handleFinish}
            style={styles.finishButton}
          >
            Complete Audit
          </Button>
          
          <View style={styles.secondaryActions}>
            <Button 
              mode="outlined" 
              icon="file-document-outline" 
              onPress={handleViewDetails}
              style={styles.actionButton}
            >
              View Details
            </Button>
            
            <Button 
              mode="outlined" 
              icon="share-variant" 
              onPress={handleShare}
              style={styles.actionButton}
            >
              Share Report
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  headerInfo: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  scoreContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  scoreBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  sectionBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 12,
  },
  sectionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionStat: {
    fontSize: 12,
    color: '#64748b',
  },
  issuesCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  issuesSectionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 8,
  },
  issueItem: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  issueTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  issueDescription: {
    fontSize: 12,
  },
  noIssuesText: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
  actionContainer: {
    marginVertical: 24,
  },
  finishButton: {
    marginBottom: 12,
    paddingVertical: 6,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default ReportSummaryScreen;
