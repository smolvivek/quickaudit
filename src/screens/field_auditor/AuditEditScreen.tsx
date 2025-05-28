import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, TextInput, Button, useTheme, IconButton, Chip, Menu, Portal, Dialog } from 'react-native-paper';
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

type AuditEditRouteProp = RouteProp<RootStackParamList, 'AuditEdit'>;

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

const mockAudit: Audit = {
  id: '1',
  title: 'Safety Inspection - Building A',
  location: 'Main Office',
  date: '2024-03-20T10:00:00',
  status: 'completed',
  score: 92,
  type: 'Safety',
  findings: [
    {
      id: '1',
      description: 'Fire extinguisher needs maintenance',
      severity: 'high',
      status: 'resolved',
      photos: ['https://example.com/photo1.jpg'],
      notes: 'Fire extinguisher was serviced and is now operational',
      createdAt: '2024-03-20T10:30:00',
      updatedAt: '2024-03-20T11:00:00',
    },
    {
      id: '2',
      description: 'Emergency exit sign not illuminated',
      severity: 'medium',
      status: 'in_progress',
      photos: ['https://example.com/photo2.jpg'],
      notes: 'New bulb ordered, will be replaced within 24 hours',
      createdAt: '2024-03-20T10:45:00',
      updatedAt: '2024-03-20T10:45:00',
    },
  ],
  notes: 'Overall safety compliance is good. Two issues found and being addressed.',
  createdBy: 'John Doe',
  createdAt: '2024-03-20T10:00:00',
  updatedAt: '2024-03-20T11:00:00',
};

const AuditEditScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<AuditEditRouteProp>();
  const [audit, setAudit] = useState<Audit | null>(null);
  const [editingFinding, setEditingFinding] = useState<Finding | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [findingToDelete, setFindingToDelete] = useState<string | null>(null);

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

  const handleSave = async () => {
    if (audit) {
      const updatedAudit = {
        ...audit,
        updatedAt: new Date().toISOString(),
      };
      await storage.updateAudit(updatedAudit);
      navigation.navigate('AuditDetail', { auditId: audit.id });
    }
  };

  const handleDeleteFinding = (findingId: string) => {
    setFindingToDelete(findingId);
    setDeleteDialogVisible(true);
  };

  const confirmDeleteFinding = () => {
    if (findingToDelete && audit) {
      setAudit(prev => ({
        ...prev!,
        findings: prev!.findings.filter(f => f.id !== findingToDelete),
      }));
      setDeleteDialogVisible(false);
      setFindingToDelete(null);
    }
  };

  const renderFinding = (finding: Finding) => (
    <View key={finding.id} style={styles.findingCard}>
      <View style={styles.findingHeader}>
        <TextInput
          label="Description"
          value={finding.description}
          onChangeText={(text) => {
            setAudit(prev => ({
              ...prev!,
              findings: prev!.findings.map(f =>
                f.id === finding.id ? { ...f, description: text } : f
              ),
            }));
          }}
          style={styles.input}
        />
        <View style={styles.findingChips}>
          <Menu
            visible={false}
            anchor={
              <Button
                mode="outlined"
                style={[
                  styles.severityButton,
                  { borderColor: getSeverityColor(finding.severity) },
                ]}
                textColor={getSeverityColor(finding.severity)}
              >
                {finding.severity.toUpperCase()}
              </Button>
            }
          >
            <Menu.Item
              onPress={() => {
                setAudit(prev => ({
                  ...prev!,
                  findings: prev!.findings.map(f =>
                    f.id === finding.id ? { ...f, severity: 'low' } : f
                  ),
                }));
              }}
              title="Low"
            />
            <Menu.Item
              onPress={() => {
                setAudit(prev => ({
                  ...prev!,
                  findings: prev!.findings.map(f =>
                    f.id === finding.id ? { ...f, severity: 'medium' } : f
                  ),
                }));
              }}
              title="Medium"
            />
            <Menu.Item
              onPress={() => {
                setAudit(prev => ({
                  ...prev!,
                  findings: prev!.findings.map(f =>
                    f.id === finding.id ? { ...f, severity: 'high' } : f
                  ),
                }));
              }}
              title="High"
            />
          </Menu>
          <Menu
            visible={false}
            anchor={
              <Button
                mode="outlined"
                style={[
                  styles.statusButton,
                  { borderColor: getStatusColor(finding.status as any) },
                ]}
                textColor={getStatusColor(finding.status as any)}
              >
                {finding.status.toUpperCase()}
              </Button>
            }
          >
            <Menu.Item
              onPress={() => {
                setAudit(prev => ({
                  ...prev!,
                  findings: prev!.findings.map(f =>
                    f.id === finding.id ? { ...f, status: 'open' } : f
                  ),
                }));
              }}
              title="Open"
            />
            <Menu.Item
              onPress={() => {
                setAudit(prev => ({
                  ...prev!,
                  findings: prev!.findings.map(f =>
                    f.id === finding.id ? { ...f, status: 'in_progress' } : f
                  ),
                }));
              }}
              title="In Progress"
            />
            <Menu.Item
              onPress={() => {
                setAudit(prev => ({
                  ...prev!,
                  findings: prev!.findings.map(f =>
                    f.id === finding.id ? { ...f, status: 'resolved' } : f
                  ),
                }));
              }}
              title="Resolved"
            />
          </Menu>
        </View>
      </View>
      <TextInput
        label="Notes"
        value={finding.notes}
        onChangeText={(text) => {
          setAudit(prev => ({
            ...prev!,
            findings: prev!.findings.map(f =>
              f.id === finding.id ? { ...f, notes: text } : f
            ),
          }));
        }}
        multiline
        style={styles.input}
      />
      {finding.photos.length > 0 && (
        <ScrollView horizontal style={styles.photoScroll}>
          {finding.photos.map((photo, index) => (
            <View key={index} style={styles.photoContainer}>
              <Image source={{ uri: photo }} style={styles.photo} />
              <IconButton
                icon="close"
                size={20}
                style={styles.deletePhotoButton}
                onPress={() => {
                  setAudit(prev => ({
                    ...prev!,
                    findings: prev!.findings.map(f =>
                      f.id === finding.id
                        ? { ...f, photos: f.photos.filter((_, i) => i !== index) }
                        : f
                    ),
                  }));
                }}
              />
            </View>
          ))}
        </ScrollView>
      )}
      <View style={styles.findingActions}>
        <Button
          mode="outlined"
          onPress={() => handleDeleteFinding(finding.id)}
          style={[styles.deleteButton, { borderColor: theme.colors.error }]}
        >
          Delete Finding
        </Button>
      </View>
    </View>
  );

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

  if (!audit) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            onPress={() => navigation.goBack()}
          />
          <Text variant="headlineSmall" style={styles.headerTitle}>
            Edit Audit
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
          Edit Audit
        </Text>
        <IconButton
          icon="content-save"
          onPress={handleSave}
        />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <TextInput
            label="Title"
            value={audit.title}
            onChangeText={(text) => setAudit(prev => ({ ...prev!, title: text }))}
            style={styles.input}
          />
          <TextInput
            label="Location"
            value={audit.location}
            onChangeText={(text) => setAudit(prev => ({ ...prev!, location: text }))}
            style={styles.input}
          />
          <TextInput
            label="Type"
            value={audit.type}
            onChangeText={(text) => setAudit(prev => ({ ...prev!, type: text }))}
            style={styles.input}
          />
          <TextInput
            label="Notes"
            value={audit.notes}
            onChangeText={(text) => setAudit(prev => ({ ...prev!, notes: text }))}
            multiline
            style={styles.input}
          />

          <View style={styles.sectionHeader}>
            <Text variant="titleMedium">Findings</Text>
            <Button
              mode="contained"
              onPress={() => {
                const newFinding: Finding = {
                  id: Date.now().toString(),
                  description: '',
                  severity: 'medium',
                  status: 'open',
                  photos: [],
                  notes: '',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
                setAudit(prev => ({
                  ...prev!,
                  findings: [...prev!.findings, newFinding],
                }));
              }}
            >
              Add Finding
            </Button>
          </View>

          {audit.findings.map(renderFinding)}
        </View>
      </ScrollView>

      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Delete Finding</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete this finding? This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={confirmDeleteFinding}>Delete</Button>
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
  form: {
    gap: spacing.md,
  },
  input: {
    backgroundColor: colors.background.paper,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  findingCard: {
    backgroundColor: colors.background.paper,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  findingHeader: {
    marginBottom: spacing.sm,
  },
  findingChips: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  severityButton: {
    height: 36,
  },
  statusButton: {
    height: 36,
  },
  photoScroll: {
    marginVertical: spacing.sm,
  },
  photoContainer: {
    position: 'relative',
    marginRight: spacing.sm,
  },
  photo: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  deletePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.background.paper,
  },
  findingActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
  },
  deleteButton: {
    // Theme-dependent style moved to component
  },
});

export default AuditEditScreen; 