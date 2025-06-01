import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

// Mock data - in a real app, this would come from an API
const MOCK_TEMPLATES = [
  { id: '1', name: 'Food Safety Inspection', description: 'Comprehensive food safety audit for restaurants', questions: 25 },
  { id: '2', name: 'Retail Store Audit', description: 'General retail store compliance audit', questions: 18 },
  { id: '3', name: 'Warehouse Safety', description: 'Safety and compliance audit for warehouses', questions: 32 },
  { id: '4', name: 'Office Safety', description: 'General office safety and compliance', questions: 15 },
  { id: '5', name: 'HACCP Compliance', description: 'Hazard Analysis and Critical Control Points audit', questions: 42 },
];

const TemplateSelectScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(route.params?.selectedTemplateId || null);

  // In a real app, this would be an API call
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setTemplates(MOCK_TEMPLATES);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleSelectTemplate = (template) => {
    // Pass the selected template back to the previous screen
    if (route.params?.onSelectTemplate) {
      route.params.onSelectTemplate(template);
    }
    navigation.goBack();
  };

  const renderTemplateItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.templateItem, 
        { 
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 12,
          marginBottom: 12,
          padding: 16,
        }
      ]}
      onPress={() => handleSelectTemplate(item)}
    >
      <View style={styles.templateHeader}>
        <Text 
          style={[
            styles.templateName, 
            { 
              color: colors.text,
              fontSize: 16,
              fontWeight: '600',
              marginBottom: 4,
            }
          ]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
        {selectedId === item.id && (
          <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
        )}
      </View>
      <Text 
        style={[
          styles.templateDescription, 
          { 
            color: colors.textSecondary,
            fontSize: 14,
            marginBottom: 8,
          }
        ]}
        numberOfLines={2}
      >
        {item.description}
      </Text>
      <View style={styles.templateMeta}>
        <Text style={[styles.metaText, { color: colors.textSecondary, fontSize: 12 }]}>
          {item.questions} questions
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Select Template
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={templates}
        renderItem={renderTemplateItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No templates available
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  listContent: {
    padding: 16,
  },
  templateItem: {
    overflow: 'hidden',
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  templateName: {
    flex: 1,
    marginRight: 8,
  },
  templateDescription: {
    marginBottom: 8,
  },
  templateMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    marginRight: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default TemplateSelectScreen;
