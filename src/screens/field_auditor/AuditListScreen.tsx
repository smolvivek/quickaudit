import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Card, Button, useTheme, Searchbar, Chip, Menu, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing } from '../../theme/designSystem';
import { format } from 'date-fns';
import { storage } from '../../utils/storage';

type RootStackParamList = {
  AuditList: undefined;
  AuditDetail: { auditId: string };
  AuditEdit: { auditId: string };
};

type Audit = {
  id: string;
  title: string;
  location: string;
  date: string;
  status: 'pending' | 'in_progress' | 'completed';
  score?: number;
  type: string;
};

const AuditListScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [audits, setAudits] = useState<Audit[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'score'>('date');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);

  const loadAudits = useCallback(async () => {
    const storedAudits = await storage.getAudits();
    setAudits(storedAudits);
  }, []);

  useEffect(() => {
    loadAudits();
  }, [loadAudits]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAudits();
    setRefreshing(false);
  }, [loadAudits]);

  const getStatusColor = (status: Audit['status']) => {
    switch (status) {
      case 'pending':
        return (theme.colors as any).warning;
      case 'in_progress':
        return theme.colors.primary;
      case 'completed':
        return (theme.colors as any).success;
      default:
        return theme.colors.outline;
    }
  };

  const filteredAudits = audits
    .filter(audit => {
      const matchesSearch = audit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        audit.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || audit.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        case 'score':
          return (b.score || 0) - (a.score || 0);
        default:
          return 0;
      }
    });

  const renderAudit = ({ item }: { item: Audit }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text variant="titleMedium" style={styles.cardTitle}>
              {item.title}
            </Text>
            <Chip
              mode="flat"
              style={[styles.statusChip, { backgroundColor: `${getStatusColor(item.status)}20` }]}
              textStyle={{ color: getStatusColor(item.status) }}
            >
              {item.status.toUpperCase()}
            </Chip>
          </View>
          <Text variant="bodySmall" style={styles.date}>
            {format(new Date(item.date), 'MMM d, yyyy')}
          </Text>
        </View>
        <Text variant="bodyMedium" style={styles.location}>
          {item.location}
        </Text>
        {item.score !== undefined && (
          <Text variant="bodyMedium" style={styles.score}>
            Score: {item.score}%
          </Text>
        )}
      </Card.Content>
      <Card.Actions>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('AuditDetail', { auditId: item.id })}
        >
          View Details
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('AuditEdit', { auditId: item.id })}
        >
          Edit
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          onPress={() => navigation.goBack()}
        />
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Audits
        </Text>
        <View style={styles.headerActions}>
          <Menu
            visible={sortMenuVisible}
            onDismiss={() => setSortMenuVisible(false)}
            anchor={
              <IconButton
                icon="sort"
                onPress={() => setSortMenuVisible(true)}
              />
            }
          >
            <Menu.Item
              onPress={() => {
                setSortBy('date');
                setSortMenuVisible(false);
              }}
              title="Sort by Date"
            />
            <Menu.Item
              onPress={() => {
                setSortBy('status');
                setSortMenuVisible(false);
              }}
              title="Sort by Status"
            />
            <Menu.Item
              onPress={() => {
                setSortBy('score');
                setSortMenuVisible(false);
              }}
              title="Sort by Score"
            />
          </Menu>
          <Menu
            visible={filterMenuVisible}
            onDismiss={() => setFilterMenuVisible(false)}
            anchor={
              <IconButton
                icon="filter"
                onPress={() => setFilterMenuVisible(true)}
              />
            }
          >
            <Menu.Item
              onPress={() => {
                setFilterStatus('all');
                setFilterMenuVisible(false);
              }}
              title="All"
            />
            <Menu.Item
              onPress={() => {
                setFilterStatus('pending');
                setFilterMenuVisible(false);
              }}
              title="Pending"
            />
            <Menu.Item
              onPress={() => {
                setFilterStatus('in_progress');
                setFilterMenuVisible(false);
              }}
              title="In Progress"
            />
            <Menu.Item
              onPress={() => {
                setFilterStatus('completed');
                setFilterMenuVisible(false);
              }}
              title="Completed"
            />
          </Menu>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search audits..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      <FlatList
        data={filteredAudits}
        renderItem={renderAudit}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
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
    alignItems: 'center',
    padding: spacing.md,
  },
  headerTitle: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
  },
  searchContainer: {
    padding: spacing.md,
  },
  searchBar: {
    backgroundColor: colors.background.paper,
  },
  list: {
    padding: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
    backgroundColor: colors.background.paper,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  cardTitle: {
    marginBottom: spacing.xs,
  },
  date: {
    color: colors.text.secondary,
  },
  location: {
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  score: {
    color: colors.text.secondary,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
});

export default AuditListScreen; 