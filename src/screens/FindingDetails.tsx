import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { auditApi } from '../services/api';
import { Finding } from '../types/audit';
import { colors } from '../theme/designSystem';
import { Icon } from '../components/Icon';
import { formatDate } from '../utils/dateUtils';

export const FindingDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [finding, setFinding] = useState<Finding | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { auditId, findingId } = route.params as { auditId: string; findingId: string };

  useEffect(() => {
    loadFinding();
  }, [auditId, findingId]);

  const loadFinding = async () => {
    try {
      setLoading(true);
      const audit = await auditApi.getById(auditId);
      const foundFinding = audit.findings.find(f => f.id === findingId);
      if (foundFinding) {
        setFinding(foundFinding);
        setError(null);
      } else {
        setError('Finding not found');
      }
    } catch (err) {
      setError('Failed to load finding details');
      Alert.alert('Error', 'Failed to load finding details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Finding',
      'Are you sure you want to delete this finding?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await auditApi.deleteFinding(auditId, findingId);
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete finding');
            }
          },
        },
      ]
    );
  };

  const handleStatusChange = async (newStatus: Finding['status']) => {
    try {
      const updatedFinding = await auditApi.updateFinding(auditId, findingId, {
        status: newStatus,
      });
      setFinding(updatedFinding);
    } catch (err) {
      Alert.alert('Error', 'Failed to update finding status');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  if (error || !finding) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Finding not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadFinding}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{finding.title}</Text>
            <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(finding.severity) }]}>
              <Text style={styles.severityText}>{finding.severity}</Text>
            </View>
          </View>
          <Text style={styles.date}>Created: {formatDate(finding.createdAt)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{finding.description}</Text>
        </View>

        {finding.location && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationContainer}>
              <Icon name="location" size={20} color={colors.text.secondary} />
              <Text style={styles.locationText}>{finding.location}</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.statusContainer}>
            <TouchableOpacity
              style={[
                styles.statusButton,
                finding.status === 'open' && styles.statusButtonActive,
              ]}
              onPress={() => handleStatusChange('open')}
            >
              <Text style={styles.statusButtonText}>Open</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusButton,
                finding.status === 'in_progress' && styles.statusButtonActive,
              ]}
              onPress={() => handleStatusChange('in_progress')}
            >
              <Text style={styles.statusButtonText}>In Progress</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusButton,
                finding.status === 'resolved' && styles.statusButtonActive,
              ]}
              onPress={() => handleStatusChange('resolved')}
            >
              <Text style={styles.statusButtonText}>Resolved</Text>
            </TouchableOpacity>
          </View>
        </View>

        {finding.photos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {finding.photos.map((photo, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.photoContainer}
                  onPress={() => {
                    // TODO: Implement photo viewer
                  }}
                >
                  <Image source={{ uri: photo }} style={styles.photo} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('EditFinding', { auditId, findingId })}
          >
            <Icon name="edit" size={20} color={colors.primary.main} />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Icon name="delete" size={20} color={colors.error.main} />
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const getSeverityColor = (severity: Finding['severity']) => {
  switch (severity) {
    case 'critical':
      return colors.error.main;
    case 'high':
      return colors.warning.main;
    case 'medium':
      return colors.info.main;
    case 'low':
      return colors.success.main;
    default:
      return colors.gray.main;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 20,
    backgroundColor: colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    flex: 1,
  },
  date: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  section: {
    padding: 20,
    backgroundColor: colors.background.paper,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 24,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.background.default,
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: colors.primary.main,
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  photoContainer: {
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: colors.background.paper,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: colors.background.default,
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.primary.main,
  },
  deleteButton: {
    backgroundColor: colors.error.light,
  },
  deleteButtonText: {
    color: colors.error.main,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  severityText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  errorText: {
    color: colors.error.main,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
  },
}); 