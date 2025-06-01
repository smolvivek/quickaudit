import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
  Platform,
  SafeAreaView,
  Image,
  ShareContent,
} from 'react-native';
import { useAudits } from '../hooks/useAudits';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as FileSystem from 'expo-file-system';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../navigation/types';
import { Audit, AuditStatus, Finding } from '../types/audit';
import { auditApi } from '../services/api';

const STATUS_COLORS: Record<AuditStatus, string> = {
  draft: '#8E8E93',
  in_progress: '#007AFF',
  completed: '#34C759',
  approved: '#34C759',
  rejected: '#FF3B30',
};

type AuditDetailsScreenNavigationProp = StackNavigationProp<MainStackParamList, 'AuditDetails'>;
type AuditDetailsScreenRouteProp = RouteProp<MainStackParamList, 'AuditDetails'>;

interface Props {
  navigation: AuditDetailsScreenNavigationProp;
  route: AuditDetailsScreenRouteProp;
}

const AuditDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id: auditId } = route.params;
  const {
    audits,
    loading,
    error,
    refresh,
  } = useAudits();

  const [actionLoading, setActionLoading] = React.useState(false);
  const audit = React.useMemo(() => {
    return audits.find(a => a.id === auditId);
  }, [audits, auditId]);

  // Handle delete audit
  const handleDelete = async (): Promise<void> => {
    Alert.alert(
      'Delete Audit',
      'Are you sure you want to delete this audit? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setActionLoading(true);
            try {
              await auditApi.delete(auditId);
              await refresh();
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', error instanceof Error ? error.message : 'Failed to delete audit');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  // Handle share audit
  const handleShare = async (): Promise<void> => {
    try {
      setActionLoading(true);
      const shareContent: ShareContent = {
        message: `Audit: ${audit?.title}\nLocation: ${audit?.location}\nStatus: ${audit?.status}\nScore: ${audit?.score}%`,
      };
      const result = await Share.share(shareContent);
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share audit');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle export PDF
  const handleExport = async (): Promise<void> => {
    try {
      setActionLoading(true);
      // TODO: Implement PDF generation
      Alert.alert('Info', 'PDF export will be available soon');
    } catch (error) {
      Alert.alert('Error', 'Failed to export audit');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle status change
  const handleStatusChange = async (newStatus: AuditStatus): Promise<void> => {
    try {
      setActionLoading(true);
      await auditApi.updateStatus(auditId, newStatus);
      await refresh();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle finding actions
  const handleFindingAction = async (
    action: 'add' | 'update' | 'delete',
    findingId: string,
    data: Partial<Finding>
  ): Promise<void> => {
    try {
      setActionLoading(true);
      switch (action) {
        case 'add':
          await auditApi.addFinding(auditId, data as Omit<Finding, 'id' | 'createdAt' | 'photos'>);
          break;
        case 'update':
          await auditApi.updateFinding(auditId, findingId, data);
          break;
        case 'delete':
          await auditApi.deleteFinding(auditId, findingId);
          break;
      }
      await refresh();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to perform action');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={48} color="#FF3B30" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!audit) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="assignment" size={48} color="#8E8E93" />
        <Text style={styles.errorText}>Audit not found</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>{audit.title}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: STATUS_COLORS[audit.status as AuditStatus] },
              ]}
            >
              <Text style={styles.statusText}>
                {audit.status.replace('_', ' ')}
              </Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Home')}
              disabled={actionLoading}
            >
              <Icon name="edit" size={24} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShare}
              disabled={actionLoading}
            >
              <Icon name="share" size={24} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleExport}
              disabled={actionLoading}
            >
              <Icon name="file-download" size={24} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDelete}
              disabled={actionLoading}
            >
              <Icon name="delete" size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Icon name="location-on" size={20} color="#666" />
              <Text style={styles.detailText}>{audit.location}</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="event" size={20} color="#666" />
              <Text style={styles.detailText}>
                {new Date(audit.createdAt).toLocaleDateString()}
              </Text>
            </View>
            {audit.score !== undefined && (
              <View style={styles.detailItem}>
                <Icon name="assessment" size={20} color="#666" />
                <Text style={styles.detailText}>Score: {audit.score}%</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Findings</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddFinding', { auditId })}
              disabled={actionLoading}
            >
              <Icon name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {audit.findings.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="assignment" size={48} color="#8E8E93" />
              <Text style={styles.emptyStateText}>No findings yet</Text>
            </View>
          ) : (
            audit.findings.map((finding: Finding) => (
              <TouchableOpacity
                key={finding.id}
                style={styles.findingCard}
                onPress={() => navigation.navigate('Home')}
              >
                <View style={styles.findingHeader}>
                  <Text style={styles.findingTitle}>{finding.title}</Text>
                  <View
                    style={[
                      styles.severityBadge,
                      { backgroundColor: getSeverityColor(finding.severity) },
                    ]}
                  >
                    <Text style={styles.severityText}>
                      {finding.severity.charAt(0).toUpperCase() + finding.severity.slice(1)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.findingDescription} numberOfLines={2}>
                  {finding.description}
                </Text>
                <View style={styles.findingFooter}>
                  <Text style={styles.findingDate}>
                    {new Date(finding.createdAt).toLocaleDateString()}
                  </Text>
                  <Text style={styles.findingStatus}>
                    {finding.status.replace('_', ' ')}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getSeverityColor = (severity: Finding['severity']): string => {
  switch (severity) {
    case 'critical':
      return '#FF3B30';
    case 'high':
      return '#FF9500';
    case 'medium':
      return '#FFCC00';
    case 'low':
      return '#34C759';
    default:
      return '#8E8E93';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
  },
  retryButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 12,
  },
  deleteButton: {
    marginLeft: 16,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 12,
  },
  findingCard: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  findingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  findingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  findingDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  findingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  findingDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  findingStatus: {
    fontSize: 12,
    color: '#8E8E93',
    textTransform: 'capitalize',
  },
});

export default AuditDetailsScreen; 