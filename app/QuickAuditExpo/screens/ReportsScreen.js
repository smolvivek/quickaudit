import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import TabBar from '../components/TabBar';
import { LineChart, BarChart } from 'react-native-chart-kit';

const ReportsScreen = ({ navigation }) => {
  const { colors, typography, spacing, textStyles } = useTheme();
  const screenWidth = Dimensions.get('window').width;
  
  const [activeTimeframe, setActiveTimeframe] = useState('month');
  const [reportData, setReportData] = useState({
    overall: 85,
    trend: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          data: [78, 82, 79, 84, 88, 85],
          color: () => colors.primary,
        }
      ]
    },
    departments: {
      labels: ['Food Safety', 'Cleaning', 'Staff', 'Facilities', 'Compliance'],
      datasets: [
        {
          data: [90, 78, 86, 82, 88]
        }
      ]
    },
    insights: [
      'Overall performance has improved by 7% compared to last quarter',
      'Food Safety scores are consistently the highest across all departments',
      'Cleaning protocols need improvement with scores below target',
      'Staff compliance has shown steady improvement over the last 3 months'
    ],
    recommendations: [
      'Schedule additional training for cleaning staff',
      'Implement the new food safety checklist across all locations',
      'Recognize top-performing staff members to maintain motivation',
      'Update facility maintenance schedule based on audit findings'
    ]
  });

  const timeframeOptions = [
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'quarter', label: 'Quarter' },
    { id: 'year', label: 'Year' }
  ];

  const chartConfig = {
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    color: (opacity = 1) => colors.primary,
    labelColor: () => colors.textSecondary,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    propsForLabels: {
      fontSize: 12,
    },
  };

  const barChartConfig = {
    ...chartConfig,
    color: (opacity = 1) => `rgba(51, 51, 255, ${opacity})`,
  };

  const handleTimeframeChange = (timeframe) => {
    setActiveTimeframe(timeframe);
    // In a real app, we would fetch new data based on the timeframe
  };

  const handleExport = () => {
    console.log('Export report');
    // In a real app, we would handle exporting the report
  };

  const handleShare = () => {
    console.log('Share report');
    // In a real app, we would handle sharing the report
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text, ...typography.h1 }]}>Reports</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleExport}>
            <Ionicons name="download-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animatable.View 
          animation="fadeIn" 
          duration={600}
          style={[styles.card, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>Overall Performance</Text>
          <View style={styles.performanceContainer}>
            <View style={[styles.performanceCircle, { borderColor: colors.primary }]}>
              <Text style={[styles.performanceScore, { color: colors.primary }]}>{reportData.overall}%</Text>
            </View>
            <View style={styles.performanceDetails}>
              <View style={styles.performanceRow}>
                <Text style={[styles.performanceLabel, { color: colors.textSecondary }]}>Status</Text>
                <View style={[styles.statusBadge, { backgroundColor: colors.success }]}>
                  <Text style={[styles.statusText, { color: colors.white }]}>Good</Text>
                </View>
              </View>
              <View style={styles.performanceRow}>
                <Text style={[styles.performanceLabel, { color: colors.textSecondary }]}>Trend</Text>
                <Text style={[styles.trendText, { color: colors.success }]}>
                  <Ionicons name="arrow-up" size={14} /> 7%
                </Text>
              </View>
              <View style={styles.performanceRow}>
                <Text style={[styles.performanceLabel, { color: colors.textSecondary }]}>Target</Text>
                <Text style={[styles.targetText, { color: colors.text }]}>80%</Text>
              </View>
            </View>
          </View>
        </Animatable.View>
        
        <Animatable.View 
          animation="fadeIn" 
          duration={600}
          delay={200}
          style={[styles.card, { backgroundColor: colors.surface }]}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Trend Analysis</Text>
            <View style={styles.timeframeContainer}>
              {timeframeOptions.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.timeframeButton,
                    activeTimeframe === option.id && { backgroundColor: colors.primaryLight }
                  ]}
                  onPress={() => handleTimeframeChange(option.id)}
                >
                  <Text 
                    style={[
                      styles.timeframeText, 
                      { color: activeTimeframe === option.id ? colors.primary : colors.textSecondary }
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.chartContainer}>
            <Text style={[styles.chartTitle, { color: colors.textSecondary }]}>Score Over Time</Text>
            <LineChart
              data={reportData.trend}
              width={screenWidth - 64}
              height={180}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withInnerLines={false}
              withOuterLines={false}
              withDots={true}
              withShadow={false}
            />
          </View>
        </Animatable.View>
        
        <Animatable.View 
          animation="fadeIn" 
          duration={600}
          delay={400}
          style={[styles.card, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>Comparison</Text>
          <View style={styles.chartContainer}>
            <Text style={[styles.chartTitle, { color: colors.textSecondary }]}>Score by Department</Text>
            <BarChart
              data={reportData.departments}
              width={screenWidth - 64}
              height={220}
              chartConfig={barChartConfig}
              style={styles.chart}
              withInnerLines={false}
              showValuesOnTopOfBars={true}
              fromZero={true}
              segments={5}
            />
          </View>
        </Animatable.View>
        
        <Animatable.View 
          animation="fadeIn" 
          duration={600}
          delay={600}
          style={[styles.card, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>Key Insights</Text>
          {reportData.insights.map((insight, index) => (
            <View key={`insight-${index}`} style={styles.insightItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} style={styles.insightIcon} />
              <Text style={[styles.insightText, { color: colors.text }]}>{insight}</Text>
            </View>
          ))}
        </Animatable.View>
        
        <Animatable.View 
          animation="fadeIn" 
          duration={600}
          delay={800}
          style={[styles.card, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>Recommendations</Text>
          {reportData.recommendations.map((recommendation, index) => (
            <View key={`rec-${index}`} style={styles.recommendationItem}>
              <View style={[styles.recommendationBullet, { backgroundColor: colors.primary }]} />
              <Text style={[styles.recommendationText, { color: colors.text }]}>{recommendation}</Text>
            </View>
          ))}
        </Animatable.View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={handleShare}
          >
            <Ionicons name="share-social-outline" size={20} color={colors.white} />
            <Text style={[styles.actionButtonText, { color: colors.white }]}>Share Report</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}
            onPress={handleExport}
          >
            <Ionicons name="download-outline" size={20} color={colors.text} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Export PDF</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <TabBar activeTab="reports" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80, // Extra padding for TabBar
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  bullet: {
    marginRight: 8,
    marginTop: 4,
    color: colors.primary,
  },
  listText: {
    flex: 1,
    color: colors.text,
    lineHeight: 22,
  },
  performanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  performanceCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  performanceScore: {
    fontSize: 24,
    fontWeight: '700',
  },
  performanceDetails: {
    flex: 1,
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  performanceLabel: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  trendText: {
    fontSize: 14,
    fontWeight: '500',
  },
  targetText: {
    fontSize: 14,
    fontWeight: '500',
  },
  timeframeContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
  },
  timeframeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  timeframeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  chartContainer: {
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 14,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  chart: {
    borderRadius: 8,
    marginVertical: 8,
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  insightIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  recommendationBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
    marginTop: 6,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  }
});

export default ReportsScreen;
