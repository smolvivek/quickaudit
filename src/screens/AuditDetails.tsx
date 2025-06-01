import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { auditApi } from '../services/api';
import { Audit, Finding } from '../types/audit';
import { colors } from '../theme/designSystem';
import { StatusBadge } from '../components/StatusBadge';
import { FindingCard } from '../components/FindingCard';
import { Icon } from '../components/Icon';
import { formatDate } from '../utils/dateUtils';

export const AuditDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [audit, setAudit] = useState<Audit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const auditId = route.params?.auditId;

  useEffect(() => {
    loadAudit();
  }, [auditId]);

  const loadAudit = async () => {
    try {
      setLoading(true);
      const data = await auditApi.getById(auditId);
      setAudit(data);
      setError(null);
    } catch (err) {
      setError('Failed to load audit details');
      Alert.alert('Error', 'Failed to load audit details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const updatedAudit = await auditApi.updateStatus(auditId, newStatus);
      setAudit(updatedAudit);
    } catch (err) {
      Alert.alert('Error', 'Failed to update audit status');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Audit',
      'Are you sure you want to delete this audit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await auditApi.delete(auditId);
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete audit');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !audit) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Audit not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadAudit}>
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
            <Text style={styles.title}>{audit.title}</Text>
            <StatusBadge status={audit.status} />
          </View>
          <Text style={styles.location}>{audit.location}</Text>
          <Text style={styles.date}>Created: {formatDate(audit.createdAt)}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('EditAudit', { auditId })}
          >
            <Icon name="edit" size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Icon name="delete" size={20} color={colors.error} />
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Findings</Text>
          {audit.findings.length === 0 ? (
            <Text style={styles.emptyText}>No findings added yet</Text>
          ) : (
            audit.findings.map((finding) => (
              <FindingCard
                key={finding.id}
                finding={finding}
                onPress={() =>
                  navigation.navigate('FindingDetails', {
                    auditId,
                    findingId: finding.id,
                  })
                }
              />
            ))
          )}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              navigation.navigate('AddFinding', { auditId })
            }
          >
            <Icon name="add" size={24} color={colors.white} />
            <Text style={styles.addButtonText}>Add Finding</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 20,
    backgroundColor: colors.white,
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
    color: colors.text,
    flex: 1,
  },
  location: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: colors.textTertiary,
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.errorLight,
  },
  deleteButtonText: {
    color: colors.error,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginVertical: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
  },
}); 