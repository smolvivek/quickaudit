import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button, Card, HelperText } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFindings } from '../hooks/useFindings';
import { Finding, Audit } from '../services/api';

interface AddFindingScreenProps {
  route: {
    params: {
      audit: Audit;
    };
  };
}

const AddFindingScreen: React.FC<AddFindingScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { createFinding } = useFindings();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('low');
  const [evidence, setEvidence] = useState('');
  const [loading, setLoading] = useState(false);
  const audit = route.params.audit;

  const handleCreateFinding = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const finding: Finding = {
        auditId: audit.id,
        title,
        description,
        severity,
        evidence,
        status: 'open',
      };

      await createFinding(finding);
      Alert.alert('Success', 'Finding created successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating finding:', error);
      Alert.alert('Error', 'Failed to create finding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Add Finding</Text>
        <Text style={styles.subtitle}>Audit: {audit.title}</Text>

        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Title"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={styles.input}
              required
            />

            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={4}
              required
            />

            <View style={styles.severityContainer}>
              <Text style={styles.severityLabel}>Severity:</Text>
              <View style={styles.severityButtons}>
                {['low', 'medium', 'high'].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.severityButton,
                      severity === level && styles.severityButtonActive,
                    ]}
                    onPress={() => setSeverity(level)}
                  >
                    <Text style={severity === level ? styles.severityTextActive : styles.severityText}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TextInput
              label="Evidence"
              value={evidence}
              onChangeText={setEvidence}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={4}
            />

            <Button
              mode="contained"
              onPress={handleCreateFinding}
              loading={loading}
              style={styles.button}
            >
              Create Finding
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  card: {
    elevation: 2,
  },
  input: {
    marginBottom: 16,
  },
  severityContainer: {
    marginBottom: 16,
  },
  severityLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  severityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  severityButton: {
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  severityButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  severityText: {
    color: '#666',
  },
  severityTextActive: {
    color: '#fff',
  },
  button: {
    marginTop: 16,
  },
});

export default AddFindingScreen;
