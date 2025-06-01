import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';

const NewAuditScreen = ({ navigation }) => {
  const { colors, typography } = useTheme();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    template: null,
    dueDate: '',
    assignee: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a title for the audit');
      return;
    }

    try {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to audits screen after successful creation
      navigation.goBack();
    } catch (error) {
      console.error('Error creating audit:', error);
      alert('Failed to create audit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Title</Text>
          <View style={[styles.inputContainer, { borderColor: colors.border }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Enter audit title"
              placeholderTextColor={colors.textSecondary}
              value={formData.title}
              onChangeText={(text) => handleInputChange('title', text)}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Description (Optional)</Text>
          <View style={[styles.textAreaContainer, { borderColor: colors.border }]}>
            <TextInput
              style={[styles.textArea, { color: colors.text }]}
              placeholder="Add a description for this audit"
              placeholderTextColor={colors.textSecondary}
              value={formData.description}
              onChangeText={(text) => handleInputChange('description', text)}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Template</Text>
          <TouchableOpacity 
            style={[styles.selectButton, { borderColor: colors.border }]}
            onPress={() => navigation.navigate('TemplateSelect')}
          >
            <Text style={[styles.selectButtonText, { color: formData.template ? colors.text : colors.textSecondary }]}>
              {formData.template || 'Select a template'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Due Date (Optional)</Text>
          <TouchableOpacity 
            style={[styles.selectButton, { borderColor: colors.border }]}
            onPress={() => {}}
          >
            <Text style={[styles.selectButtonText, { color: formData.dueDate ? colors.text : colors.textSecondary }]}>
              {formData.dueDate || 'Select due date'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Assign To (Optional)</Text>
          <View style={[styles.inputContainer, { borderColor: colors.border }]}>
            <Ionicons 
              name="person-outline" 
              size={20} 
              color={colors.textSecondary} 
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Search team members"
              placeholderTextColor={colors.textSecondary}
              value={formData.assignee}
              onChangeText={(text) => handleInputChange('assignee', text)}
            />
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Button
          title="Create Audit"
          onPress={handleSubmit}
          loading={isSubmitting}
          fullWidth
          style={styles.submitButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Space for the footer button
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  textAreaContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
  },
  textArea: {
    flex: 1,
    textAlignVertical: 'top',
    fontSize: 16,
    lineHeight: 22,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    height: 48,
  },
  selectButtonText: {
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
  },
  submitButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default NewAuditScreen;
