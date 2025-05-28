import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Card, Chip, Button, useTheme, IconButton, Divider, Menu, Portal, Dialog } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing } from '../../theme/designSystem';
import { format } from 'date-fns';
import { storage } from '../../utils/storage';

type RootStackParamList = {
  AuditList: undefined;
  AuditDetail: { auditId: string };
  AuditEdit: { auditId: string };
};

type AuditDetailRouteProp = RouteProp<RootStackParamList, 'AuditDetail'>;

type Finding = {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  photos: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
};

type Audit = {
  id: string;
  title: string;
  location: string;
  date: string;
  status: 'pending' | 'in_progress' | 'completed';
  score?: number;
  type: string;
  findings: Finding[];
  notes: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

const AuditDetailScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<AuditDetailRouteProp>();
  const [audit, setAudit] = useState<Audit | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  useEffect(() => {
    loadAudit();
  }, [route.params.auditId]);

  const loadAudit = async () => {
    const audits = await storage.getAudits();
    const foundAudit = audits.find((a: Audit) => a.id === route.params.auditId);
    if (foundAudit) {
      setAudit(foundAudit);
    }
  };

  const handleDelete = async () => {
    if (audit) {
      await storage.deleteAudit(audit.id);
      navigation.navigate('AuditList');
    }
  };

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

  const getSeverityColor = (severity: Finding['severity']) => {
    switch (severity) {
      case 'high':
        return (theme.colors as any).error;
      case 'medium':
        return (theme.colors as any).warning;
      case 'low':
        return (theme.colors as any).success;
      default:
        return theme.colors.outline;
    }
  };

  const getFindingStatusColor = (status: Finding['status']) => {
    switch (status) {
      case 'resolved':
        return (theme.colors as any).success;
      case 'in_progress':
        return (theme.colors as any).warning;
      case 'open':
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  const renderFinding = (finding: Finding) => (
    <Card key={finding.id} style={styles.findingCard}>
      <Card.Content>
        <View style={styles.findingHeader}>
          <Text variant="titleMedium" style={styles.findingTitle}>
            {finding.description}
          </Text>
          <View style={styles.findingChips}>
            <Chip
              mode="flat"
              style={[styles.severityChip, { backgroundColor: `${getSeverityColor(finding.severity)}20` }]}
              textStyle={{ color: getSeverityColor(finding.severity) }}
            >
              {finding.severity.toUpperCase()}
            </Chip>
            <Chip
              mode="flat"
              style={[styles.statusChip, { backgroundColor: `${getFindingStatusColor(finding.status)}20` }]}
              textStyle={{ color: getFindingStatusColor(finding.status) }}
            >
              {finding.status.toUpperCase()}
            </Chip>
          </View>
        </View>
        <Text variant="bodyMedium" style={styles.findingNotes}>
          {finding.notes}
        </Text>
        {finding.photos.length > 0 && (
          <ScrollView horizontal style={styles.photoScroll}>
            {finding.photos.map((photo, index) => (
              <Image
                key={index}
                source={{ uri: photo }}
                style={styles.photo}
              />
            ))}
          </ScrollView>
        )}
        <View style={styles.findingFooter}>
          <Text variant="bodySmall" style={styles.timestamp}>
            Created: {format(new Date(finding.createdAt), 'MMM d, yyyy h:mm a')}
          </Text>
          <Text variant="bodySmall" style={styles.timestamp}>
            Updated: {format(new Date(finding.updatedAt), 'MMM d, yyyy h:mm a')}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  if (!audit) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            onPress={() => navigation.goBack()}
          />
          <Text variant="headlineSmall" style={styles.headerTitle}>
            Audit Details
          </Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          onPress={() => navigation.goBack()}
        />
        <Text variant="headlineSmall" style={styles.headerTitle}>
          {audit.title}
        </Text>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('AuditEdit', { auditId: audit.id });
            }}
            title="Edit"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              setDeleteDialogVisible(true);
            }}
            title="Delete"
          />
        </Menu>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.mainCard}>
          <Card.Content>
            <View style={styles.auditHeader}>
              <Text variant="headlineMedium" style={styles.auditTitle}>
                {audit.title}
              </Text>
              <Chip
                mode="flat"
                style={[styles.statusChip, { backgroundColor: `${getStatusColor(audit.status)}20` }]}
                textStyle={{ color: getStatusColor(audit.status) }}
              >
                {audit.status.toUpperCase()}
              </Chip>
            </View>

            <View style={styles.auditDetails}>
              <View style={styles.detailRow}>
                <Text variant="bodyMedium" style={styles.detailLabel}>Location:</Text>
                <Text variant="bodyMedium">{audit.location}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text variant="bodyMedium" style={styles.detailLabel}>Date:</Text>
                <Text variant="bodyMedium">
                  {format(new Date(audit.date), 'MMM d, yyyy h:mm a')}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text variant="bodyMedium" style={styles.detailLabel}>Type:</Text>
                <Text variant="bodyMedium">{audit.type}</Text>
              </View>
              {audit.score !== undefined && (
                <View style={styles.detailRow}>
                  <Text variant="bodyMedium" style={styles.detailLabel}>Score:</Text>
                  <Text variant="bodyMedium">{audit.score}%</Text>
                </View>
              )}
            </View>

            <Divider style={styles.divider} />

            <Text variant="titleMedium" style={styles.sectionTitle}>
              Notes
            </Text>
            <Text variant="bodyMedium" style={styles.notes}>
              {audit.notes}
            </Text>

            <Divider style={styles.divider} />

            <Text variant="titleMedium" style={styles.sectionTitle}>
              Findings
            </Text>
            {audit.findings.map(renderFinding)}

            <Divider style={styles.divider} />

            <View style={styles.metadata}>
              <Text variant="bodySmall" style={styles.metadataText}>
                Created by: {audit.createdBy}
              </Text>
              <Text variant="bodySmall" style={styles.metadataText}>
                Created: {format(new Date(audit.createdAt), 'MMM d, yyyy h:mm a')}
              </Text>
              <Text variant="bodySmall" style={styles.metadataText}>
                Last updated: {format(new Date(audit.updatedAt), 'MMM d, yyyy h:mm a')}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Delete Audit</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete this audit? This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleDelete}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  mainCard: {
    marginBottom: spacing.md,
  },
  auditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  auditTitle: {
    flex: 1,
    marginRight: spacing.sm,
  },
  statusChip: {
    height: 24,
  },
  auditDetails: {
    gap: spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    color: colors.text.secondary,
    marginRight: spacing.xs,
  },
  divider: {
    marginVertical: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  notes: {
    color: colors.text.secondary,
  },
  findingCard: {
    marginBottom: spacing.md,
  },
  findingHeader: {
    marginBottom: spacing.sm,
  },
  findingTitle: {
    marginBottom: spacing.xs,
  },
  findingChips: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  severityChip: {
    height: 24,
  },
  findingNotes: {
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  photoScroll: {
    marginBottom: spacing.sm,
  },
  photo: {
    width: 200,
    height: 150,
    marginRight: spacing.sm,
    borderRadius: 8,
  },
  findingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timestamp: {
    color: colors.text.secondary,
  },
  metadata: {
    gap: spacing.xs,
  },
  metadataText: {
    color: colors.text.secondary,
  },
});

export default AuditDetailScreen; 