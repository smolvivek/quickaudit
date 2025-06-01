import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const MetricAnalysisScreen = ({ navigation, route }) => {
  const { colors, typography, spacing, textStyles } = useTheme();

  // Mock data for charts
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [78, 82, 80, 84, 86, 85],
        color: () => colors.primary,
        strokeWidth: 2
      }
    ],
  };

  const barChartData = {
    labels: ['HR', 'Ops', 'Sales', 'IT', 'Mfg'],
    datasets: [
      {
        data: [92, 85, 78, 88, 82],
      }
    ]
  };

  const chartConfig = {
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: () => colors.primary,
    labelColor: () => colors.textSecondary,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary
    }
  };

  // Render a section with title and content
  const renderSection = (title, content) => (
    <View 
      style={[
        styles.section, 
        { 
          backgroundColor: colors.surface,
          borderRadius: spacing.borderRadius.medium,
          marginBottom: spacing.lg,
          ...themeStyles.shadows.small
        }
      ]}
    >
      <Text style={[styles.sectionTitle, { color: colors.text, ...typography.h3 }]}>
        {title}
      </Text>
      <View style={styles.sectionContent}>
        {content}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text, ...typography.h2 }]}>
          Metric Analysis
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall Performance Section */}
        {renderSection('Overall Performance', (
          <View style={styles.overallPerformance}>
            <View style={[styles.scoreCircle, { borderColor: colors.primary }]}>
              <Text style={[styles.scoreText, { color: colors.primary, ...typography.h1 }]}>
                85%
              </Text>
            </View>
            <Text style={[styles.scoreLabel, { color: colors.textSecondary, ...typography.body }]}>
              Average Score
            </Text>
          </View>
        ))}

        {/* Trend Analysis Section */}
        {renderSection('Trend Analysis', (
          <View>
            <Text style={[styles.chartTitle, { color: colors.textSecondary, ...typography.bodySmall }]}>
              Score Over Time
            </Text>
            <LineChart
              data={lineChartData}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        ))}

        {/* Comparison Section */}
        {renderSection('Comparison', (
          <View>
            <Text style={[styles.chartTitle, { color: colors.textSecondary, ...typography.bodySmall }]}>
              Score by Department
            </Text>
            <BarChart
              data={barChartData}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              verticalLabelRotation={0}
            />
          </View>
        ))}

        {/* Key Insights Section */}
        {renderSection('Key Insights', (
          <View>
            <Text style={[styles.insightText, { color: colors.text, ...typography.body }]}>
              • Safety compliance has improved by 12% over the last quarter
            </Text>
            <Text style={[styles.insightText, { color: colors.text, ...typography.body }]}>
              • HR department consistently scores highest in compliance audits
            </Text>
            <Text style={[styles.insightText, { color: colors.text, ...typography.body }]}>
              • Sales department shows the most improvement month-over-month
            </Text>
          </View>
        ))}

        {/* Recommendations Section */}
        {renderSection('Recommendations', (
          <View>
            <Text style={[styles.recommendationText, { color: colors.text, ...typography.body }]}>
              1. Focus on improving Sales department compliance through additional training
            </Text>
            <Text style={[styles.recommendationText, { color: colors.text, ...typography.body }]}>
              2. Implement HR department best practices across other departments
            </Text>
            <Text style={[styles.recommendationText, { color: colors.text, ...typography.body }]}>
              3. Schedule monthly follow-up audits to maintain improvement trajectory
            </Text>
          </View>
        ))}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              { 
                backgroundColor: colors.surface,
                borderColor: colors.border,
                marginRight: spacing.md,
                ...themeStyles.shadows.small
              }
            ]}
            onPress={() => console.log('Share pressed')}
          >
            <Ionicons name="share-outline" size={20} color={colors.primary} style={styles.actionIcon} />
            <Text style={[styles.actionText, { color: colors.text, ...typography.buttonText }]}>
              Share
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              { 
                backgroundColor: colors.surface,
                borderColor: colors.border,
                ...themeStyles.shadows.small
              }
            ]}
            onPress={() => console.log('Export pressed')}
          >
            <Ionicons name="download-outline" size={20} color={colors.primary} style={styles.actionIcon} />
            <Text style={[styles.actionText, { color: colors.text, ...typography.buttonText }]}>
              Export
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontWeight: '600',
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionContent: {
    alignItems: 'center',
  },
  overallPerformance: {
    alignItems: 'center',
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreText: {
    fontWeight: '700',
  },
  scoreLabel: {
    marginTop: 8,
  },
  chartTitle: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  insightText: {
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  recommendationText: {
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
  },
  actionIcon: {
    marginRight: 8,
  },
  actionText: {
    fontWeight: '600',
  },
});

export default MetricAnalysisScreen;
