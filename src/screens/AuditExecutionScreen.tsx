import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { QuickAuditCard } from '../../components/ui/card';
import { QuickAuditButton } from '../../components/ui/button';
import { Text } from 'react-native-paper';
import { theme } from '../../theme/theme';

const AuditExecutionScreen = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [mediaItems, setMediaItems] = useState([]);

  const handleAddMedia = () => {
    // TODO: Implement media picker
  };

  const handleSaveAudit = () => {
    // TODO: Implement audit saving logic
  };

  return (
    <View style={styles.container}>
      <QuickAuditCard>
        <Text variant="titleLarge" style={styles.title}>
          Audit Execution
        </Text>
        
        <View style={styles.formSection}>
          <Text variant="bodyLarge" style={styles.sectionTitle}>
            Basic Information
          </Text>
          {/* TODO: Add form fields */}
        </View>

        <View style={styles.mediaSection}>
          <Text variant="bodyLarge" style={styles.sectionTitle}>
            Evidence
          </Text>
          <QuickAuditButton
            mode="outlined"
            onPress={handleAddMedia}
            style={styles.addButton}
          >
            Add Media
          </QuickAuditButton>
          {/* TODO: Display media items */}
        </View>

        <View style={styles.gpsSection}>
          <Text variant="bodyLarge" style={styles.sectionTitle}>
            Location
          </Text>
          {/* TODO: Add GPS tracking */}
        </View>

        <View style={styles.controls}>
          <QuickAuditButton
            mode="outlined"
            onPress={() => setIsOffline(!isOffline)}
          >
            {isOffline ? 'Online Mode' : 'Offline Mode'}
          </QuickAuditButton>
          <QuickAuditButton
            mode="contained"
            onPress={handleSaveAudit}
            style={styles.saveButton}
          >
            Save Audit
          </QuickAuditButton>
        </View>
      </QuickAuditCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  formSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  mediaSection: {
    marginBottom: 16,
  },
  gpsSection: {
    marginBottom: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  addButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
  },
});

export default AuditExecutionScreen;
