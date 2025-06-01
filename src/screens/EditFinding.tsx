import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { auditApi } from '../services/api';
import { colors } from '../theme/designSystem';
import { Icon } from '../components/Icon';
import { Finding } from '../types/audit';

export const EditFinding = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState<Finding['severity']>('medium');
  const [status, setStatus] = useState<Finding['status']>('open');

  const { auditId, findingId } = route.params as { auditId: string; findingId: string };

  useEffect(() => {
    loadFinding();
  }, [auditId, findingId]);

  const loadFinding = async () => {
    try {
      setLoading(true);
      const audit = await auditApi.getById(auditId);
      const finding = audit.findings.find(f => f.id === findingId);
      
      if (finding) {
        setTitle(finding.title);
        setDescription(finding.description);
        setLocation(finding.location || '');
        setSeverity(finding.severity);
        setStatus(finding.status);
      } else {
        Alert.alert('Error', 'Finding not found');
        navigation.goBack();
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load finding details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    try {
      setSaving(true);
      await auditApi.updateFinding(auditId, findingId, {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        severity,
        status,
      });
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Failed to update finding');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter finding title"
            placeholderTextColor={colors.text.disabled}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter finding description"
            placeholderTextColor={colors.text.disabled}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Enter location (optional)"
            placeholderTextColor={colors.text.disabled}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Severity</Text>
          <View style={styles.severityContainer}>
            {(['low', 'medium', 'high', 'critical'] as const).map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.severityButton,
                  severity === level && styles.severityButtonActive,
                  { backgroundColor: getSeverityColor(level) },
                ]}
                onPress={() => setSeverity(level)}
              >
                <Text
                  style={[
                    styles.severityButtonText,
                    severity === level && styles.severityButtonTextActive,
                  ]}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusContainer}>
            {(['open', 'in_progress', 'resolved'] as const).map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.statusButton,
                  status === level && styles.statusButtonActive,
                ]}
                onPress={() => setStatus(level)}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    status === level && styles.statusButtonTextActive,
                  ]}
                >
                  {level.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
            disabled={saving}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.submitButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const getSeverityColor = (severity: Finding['severity']) => {
  switch (severity) {
    case 'critical':
      return colors.error.light;
    case 'high':
      return colors.warning.light;
    case 'medium':
      return colors.info.light;
    case 'low':
      return colors.success.light;
    default:
      return colors.gray.light;
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
  },
  section: {
    padding: 20,
    backgroundColor: colors.background.paper,
    marginTop: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background.default,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 120,
  },
  severityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  severityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  severityButtonActive: {
    borderWidth: 2,
    borderColor: colors.white,
  },
  severityButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  severityButtonTextActive: {
    color: colors.white,
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
  statusButtonTextActive: {
    color: colors.white,
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: colors.background.paper,
    marginTop: 8,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: colors.background.default,
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: colors.primary.main,
    marginLeft: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
}); 