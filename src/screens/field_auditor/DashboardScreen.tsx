import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, FAB, useTheme, Surface, Chip, Avatar, Divider, IconButton, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  FadeInDown, 
  FadeInRight, 
  Layout, 
  SlideInRight,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import { useOfflineSync } from '../../hooks/useOfflineSync';
import { formatDistanceToNow } from 'date-fns';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography } from '../../theme/designSystem';
import { useAuth } from '../../contexts/AuthContext';

type RootStackParamList = {
  AuditExecution: { auditId: number };
  ReportSummary: { auditId: number };
  AuditCreation: undefined;
  AuditList: undefined;
  AuditDetail: { auditId: string };
  AuditEdit: { auditId: string };
};

type DashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

type DashboardStats = {
  totalAudits: number;
  completedAudits: number;
  pendingAudits: number;
  recentActivity: {
    id: string;
    type: string;
    title: string;
    timestamp: string;
  }[];
};

const mockStats: DashboardStats = {
  totalAudits: 156,
  completedAudits: 142,
  pendingAudits: 14,
  recentActivity: [
    {
      id: '1',
      type: 'completed',
      title: 'Safety Inspection - Building A',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      type: 'created',
      title: 'Quality Control - Production Line',
      timestamp: '5 hours ago',
    },
    {
      id: '3',
      type: 'updated',
      title: 'Compliance Check - Warehouse',
      timestamp: '1 day ago',
    },
  ],
};

const AnimatedCard = Animated.createAnimatedComponent(Card);
const AnimatedSurface = Animated.createAnimatedComponent(Surface);

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { isOnline, isSyncing, syncQueueLength, lastSyncTime, syncNow } = useOfflineSync();
  const [refreshing, setRefreshing] = React.useState(false);
  const scale = useSharedValue(1);
  const { user } = useAuth();

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    scale.value = withSequence(
      withSpring(0.95),
      withSpring(1)
    );
    await syncNow();
    setRefreshing(false);
  }, [syncNow]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'completed':
        return 'check-circle';
      case 'created':
        return 'plus-circle';
      case 'updated':
        return 'pencil-circle';
      default:
        return 'circle';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'completed':
        return (theme.colors as any).success;
      case 'created':
        return theme.colors.primary;
      case 'updated':
        return (theme.colors as any).warning;
      default:
        return colors.grey[500];
    }
  };

  const upcomingAudits = [
    { id: 1, title: 'Safety Inspection', location: 'Main Office', date: 'Today, 2:00 PM', type: 'Safety' },
    { id: 2, title: 'Quality Assurance', location: 'Production Line A', date: 'Tomorrow, 10:00 AM', type: 'Quality' },
    { id: 3, title: 'Compliance Check', location: 'Finance Department', date: 'May 22, 9:30 AM', type: 'Compliance' },
  ];

  const recentAudits = [
    { id: 1, title: 'Facility Maintenance', location: 'Warehouse', date: 'May 18, 2023', score: 78, status: 'Completed' },
    { id: 2, title: 'Safety Protocols', location: 'R&D Lab', date: 'May 15, 2023', score: 92, status: 'Completed' },
  ];

  const renderUpcomingAudit = (audit: any, index: number) => (
    <AnimatedCard
      key={audit.id}
      style={styles.card}
      entering={FadeInDown.delay(index * 100).springify()}
      layout={Layout.springify()}
      onPress={() => navigation.navigate('AuditExecution', { auditId: audit.id })}
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{audit.title}</Text>
          <Chip mode="outlined" style={{ backgroundColor: theme.colors.surface }}>
            {audit.type}
          </Chip>
        </View>
        <View style={styles.cardDetails}>
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
        <Button mode="text" onPress={() => navigation.navigate('AuditExecution', { auditId: audit.id })}>
          Start Audit
        </Button>
        <Button mode="text" onPress={() => {}}>
          Reschedule
        </Button>
      </Card.Actions>
    </AnimatedCard>
  );

  const renderRecentAudit = (audit: any, index: number) => (
    <AnimatedCard
      key={audit.id}
      style={styles.card}
      entering={FadeInRight.delay(index * 100).springify()}
      layout={Layout.springify()}
      onPress={() => navigation.navigate('AuditDetail', { auditId: audit.id.toString() })}
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{audit.title}</Text>
          <Chip 
            mode="flat" 
            style={{ 
              backgroundColor: audit.score >= 90 
                ? `${(theme.colors as any).success}20` 
                : audit.score >= 70 
                  ? `${(theme.colors as any).warning}20` 
                  : `${theme.colors.error}20` 
            }}
            textStyle={{ 
              color: audit.score >= 90 
                ? (theme.colors as any).success 
                : audit.score >= 70 
                  ? (theme.colors as any).warning 
                  : theme.colors.error 
            }}
          >
            {audit.score}%
          </Chip>
        </View>
        <View style={styles.cardDetails}>
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
        <Button mode="text" onPress={() => navigation.navigate('AuditDetail', { auditId: audit.id.toString() })}>
          View Details
        </Button>
        <Button mode="text" onPress={() => navigation.navigate('AuditEdit', { auditId: audit.id.toString() })}>
          Edit
        </Button>
      </Card.Actions>
    </AnimatedCard>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={styles.header}
        entering={FadeInDown.springify()}
      >
        <View>
          <Text variant="headlineMedium" style={styles.welcome}>
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Here's your audit overview
          </Text>
        </View>
        <View style={styles.headerRight}>
          {!isOnline && (
            <Chip 
              mode="outlined" 
              style={[styles.offlineChip, { borderColor: theme.colors.error }]}
              textStyle={{ color: theme.colors.error }}
            >
              Offline
            </Chip>
          )}
          {syncQueueLength > 0 && (
            <Chip 
              mode="outlined" 
              style={[styles.syncChip, { borderColor: (theme.colors as any).warning }]}
              textStyle={{ color: (theme.colors as any).warning }}
            >
              {syncQueueLength} pending
            </Chip>
          )}
          <Avatar.Text size={40} label="JD" style={{ backgroundColor: theme.colors.primary }} />
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <AnimatedSurface 
          style={styles.statsContainer}
          entering={FadeInDown.delay(100).springify()}
        >
          <Card style={styles.statsCard}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.statsNumber}>
                {mockStats.totalAudits}
              </Text>
              <Text variant="bodyMedium" style={styles.statsLabel}>
                Total Audits
              </Text>
            </Card.Content>
          </Card>
          <Card style={[styles.statsCard, { backgroundColor: (theme.colors as any).warning }]}>
            <Card.Content>
              <Text variant="titleLarge" style={[styles.statsNumber, { color: (theme.colors as any).warning }]}>
                {mockStats.pendingAudits}
              </Text>
              <Text variant="bodyMedium" style={styles.statsLabel}>
                Pending
              </Text>
            </Card.Content>
          </Card>
          <Card style={[styles.statsCard, { backgroundColor: (theme.colors as any).success }]}>
            <Card.Content>
              <Text variant="titleLarge" style={[styles.statsNumber, { color: (theme.colors as any).success }]}>
                {mockStats.completedAudits}
              </Text>
              <Text variant="bodyMedium" style={styles.statsLabel}>
                Completed
              </Text>
            </Card.Content>
          </Card>
        </AnimatedSurface>

        {lastSyncTime && (
          <Animated.Text 
            style={styles.syncTime}
            entering={FadeInDown.delay(200)}
          >
            Last synced {formatDistanceToNow(new Date(parseInt(lastSyncTime)), { addSuffix: true })}
          </Animated.Text>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Audits</Text>
          <Button mode="text" onPress={() => {}}>View All</Button>
        </View>

        {upcomingAudits.map((audit, index) => renderUpcomingAudit(audit, index))}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Audits</Text>
          <Button mode="text" onPress={() => {}}>View All</Button>
        </View>

        {recentAudits.map((audit, index) => renderRecentAudit(audit, index))}

        <AnimatedCard 
          style={styles.recentActivityCard}
          entering={FadeInDown.delay(300).springify()}
        >
          <Card.Content>
            <Text style={styles.sectionTitle} variant="titleMedium">
              Recent Activity
            </Text>
            {mockStats.recentActivity.map((activity, index) => (
              <AnimatedSurface 
                key={activity.id} 
                style={styles.activityItem}
                entering={SlideInRight.delay(index * 100).springify()}
              >
                <IconButton
                  icon={getActivityIcon(activity.type)}
                  size={24}
                  iconColor={getActivityColor(activity.type)}
                />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle} variant="bodyMedium">
                    {activity.title}
                  </Text>
                  <Text style={styles.activityTimestamp} variant="bodySmall">
                    {activity.timestamp}
                  </Text>
                </View>
              </AnimatedSurface>
            ))}
          </Card.Content>
        </AnimatedCard>

        <AnimatedCard 
          style={styles.featuresCard}
          entering={FadeInDown.delay(400).springify()}
        >
          <Card.Content>
            <Text style={styles.sectionTitle} variant="titleMedium">
              Features
            </Text>
            <View style={styles.featuresGrid}>
              {[
                { icon: 'cloud-off', title: 'Offline Mode' },
                { icon: 'camera', title: 'Photo Capture' },
                { icon: 'map-marker', title: 'Location' },
                { icon: 'sync', title: 'Auto Sync' },
              ].map((feature, index) => (
                <AnimatedSurface 
                  key={feature.title}
                  style={styles.featureItem}
                  entering={FadeInDown.delay(500 + index * 100).springify()}
                >
                  <IconButton
                    icon={feature.icon}
                    size={24}
                    iconColor={colors.primary.main}
                  />
                  <Text style={styles.featureTitle} variant="bodyMedium">
                    {feature.title}
                  </Text>
                </AnimatedSurface>
              ))}
            </View>
          </Card.Content>
        </AnimatedCard>
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('AuditCreation')}
      />
      <FAB
        icon="format-list-bulleted"
        style={[styles.fab, { backgroundColor: theme.colors.secondary }]}
        onPress={() => navigation.navigate('AuditList')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  welcome: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.text.secondary,
  },
  scrollView: {
    flex: 1,
    padding: spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  statsCard: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary.main,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  statsLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  syncTime: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  offlineChip: {
    marginRight: spacing.md,
  },
  syncChip: {
    marginRight: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  card: {
    marginBottom: spacing.md,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  cardDetails: {
    marginBottom: spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginRight: spacing.xs,
  },
  detailValue: {
    fontSize: 14,
    color: colors.text.primary,
  },
  fab: {
    position: 'absolute',
    margin: spacing.md,
    right: 0,
    bottom: 0,
  },
  recentActivityCard: {
    margin: spacing.md,
    marginTop: 0,
    backgroundColor: colors.background.paper,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.background.default,
    borderRadius: 8,
  },
  activityContent: {
    flex: 1,
    marginLeft: spacing.xs,
  },
  activityTitle: {
    color: colors.text.primary,
  },
  activityTimestamp: {
    color: colors.text.secondary,
  },
  featuresCard: {
    margin: spacing.md,
    marginTop: 0,
    backgroundColor: colors.background.paper,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  featureItem: {
    width: '45%',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.default,
    borderRadius: 8,
  },
  featureTitle: {
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});

export default DashboardScreen;
