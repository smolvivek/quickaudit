import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme, IconButton, Chip, Menu, Portal, Dialog } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing } from '../../theme/designSystem';
import { format } from 'date-fns';

type RootStackParamList = {
  AuditList: undefined;
  AuditDetail: { auditId: string };
};

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

const auditTemplates = [
  { id: 'safety', name: 'Safety Inspection' },
  { id: 'quality', name: 'Quality Control' },
  { id: 'compliance', name: 'Compliance Check' },
  { id: 'maintenance', name: 'Maintenance Audit' },
];

const AuditCreationScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [audit, setAudit] = useState<Partial<Audit>>({
    title: '',
    location: '',
    type: '',
    notes: '',
    findings: [],
    status: 'pending',
    date: new Date().toISOString(),
  });
  const [templateMenuVisible, setTemplateMenuVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [findingToDelete, setFindingToDelete] = useState<string | null>(null);

  const handleSave = async () => {
    // TODO: Implement save functionality
    const newAudit: Audit = {
      id: Date.now().toString(),
      ...audit,
      createdBy: 'Current User', // TODO: Get from auth context
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Audit;

    // TODO: Save to backend
    navigation.navigate('AuditDetail', { auditId: newAudit.id });
  };

  const handleDeleteFinding = (findingId: string) => {
    setFindingToDelete(findingId);
    setDeleteDialogVisible(true);
  };

  const confirmDeleteFinding = () => {
    if (findingToDelete && audit.findings) {
      setAudit(prev => ({
        ...prev,
        findings: prev.findings?.filter(f => f.id !== findingToDelete),
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
              ...prev,
              findings: prev.findings?.map(f =>
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
              <Chip
                mode="flat"
                style={[styles.severityChip, { backgroundColor: `${theme.colors.error}20` }]}
                textStyle={{ color: theme.colors.error }}
                onPress={() => {}}
              >
                {finding.severity.toUpperCase()}
              </Chip>
            }
          >
            <Menu.Item
              onPress={() => {
                setAudit(prev => ({
                  ...prev,
                  findings: prev.findings?.map(f =>
                    f.id === finding.id ? { ...f, severity: 'low' } : f
                  ),
                }));
              }}
              title="Low"
            />
            <Menu.Item
              onPress={() => {
                setAudit(prev => ({
                  ...prev,
                  findings: prev.findings?.map(f =>
                    f.id === finding.id ? { ...f, severity: 'medium' } : f
                  ),
                }));
              }}
              title="Medium"
            />
            <Menu.Item
              onPress={() => {
                setAudit(prev => ({
                  ...prev,
                  findings: prev.findings?.map(f =>
                    f.id === finding.id ? { ...f, severity: 'high' } : f
                  ),
                }));
              }}
              title="High"
            />
          </Menu>
        </View>
      </View>
      <TextInput
        label="Notes"
        value={finding.notes}
        onChangeText={(text) => {
          setAudit(prev => ({
            ...prev,
            findings: prev.findings?.map(f =>
              f.id === finding.id ? { ...f, notes: text } : f
            ),
          }));
        }}
        multiline
        style={styles.input}
      />
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          onPress={() => navigation.goBack()}
        />
        <Text variant="headlineSmall" style={styles.title}>
          Create Audit
        </Text>
        <IconButton
          icon="content-save"
          onPress={handleSave}
        />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <Menu
            visible={templateMenuVisible}
            onDismiss={() => setTemplateMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setTemplateMenuVisible(true)}
                style={styles.templateButton}
              >
                Select Template
              </Button>
            }
          >
            {auditTemplates.map(template => (
              <Menu.Item
                key={template.id}
                onPress={() => {
                  setAudit(prev => ({
                    ...prev,
                    type: template.name,
                  }));
                  setTemplateMenuVisible(false);
                }}
                title={template.name}
              />
            ))}
          </Menu>

          <TextInput
            label="Title"
            value={audit.title}
            onChangeText={(text) => setAudit(prev => ({ ...prev, title: text }))}
            style={styles.input}
          />
          <TextInput
            label="Location"
            value={audit.location}
            onChangeText={(text) => setAudit(prev => ({ ...prev, location: text }))}
            style={styles.input}
          />
          <TextInput
            label="Type"
            value={audit.type}
            onChangeText={(text) => setAudit(prev => ({ ...prev, type: text }))}
            style={styles.input}
          />
          <TextInput
            label="Notes"
            value={audit.notes}
            onChangeText={(text) => setAudit(prev => ({ ...prev, notes: text }))}
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
                  ...prev,
                  findings: [...(prev.findings || []), newFinding],
                }));
              }}
            >
              Add Finding
            </Button>
          </View>

          {audit.findings?.map(renderFinding)}
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
  title: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  form: {
    gap: spacing.md,
  },
  templateButton: {
    marginBottom: spacing.md,
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
  severityChip: {
    height: 24,
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

export default AuditCreationScreen;
