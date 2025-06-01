import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const NewTemplateScreen = ({ navigation, route }) => {
  const { colors, typography, spacing } = useTheme();
  
  // Form state
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Safety');
  const [isPublic, setIsPublic] = useState(false);
  const [questions, setQuestions] = useState([
    { id: '1', text: '', type: 'yesNo', required: true },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set up header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'New Template',
      headerLeft: () => (
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 8 }}
        >
          <Ionicons 
            name="close" 
            size={24} 
            color={colors.primary} 
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity 
          onPress={handleSave}
          style={[styles.headerButton, { backgroundColor: colors.primary }]}
          disabled={isSubmitting}
        >
          <Text style={[styles.headerButtonText, { color: colors.white }]}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors, isSubmitting, templateName]);

  // Handle saving the template
  const handleSave = async () => {
    if (!templateName.trim()) {
      Alert.alert('Error', 'Please enter a template name');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back with success
      navigation.goBack();
      // You might want to add a success message or refresh the templates list
    } catch (error) {
      console.error('Error saving template:', error);
      Alert.alert('Error', 'Failed to save template. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a new question
  const addQuestion = () => {
    const newId = (questions.length + 1).toString();
    setQuestions([...questions, { id: newId, text: '', type: 'yesNo', required: true }]);
  };

  // Update a question
  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  // Remove a question
  const removeQuestion = (id) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    } else {
      Alert.alert('Cannot remove', 'A template must have at least one question');
    }
  };

  // Render a question input
  const renderQuestion = (question, index) => (
    <Animatable.View 
      key={question.id}
      animation="fadeIn"
      duration={300}
      style={[styles.questionCard, { backgroundColor: colors.surface }]}
    >
      <View style={styles.questionHeader}>
        <Text style={[styles.questionNumber, { color: colors.primary }]}>
          Question {index + 1}
        </Text>
        {questions.length > 1 && (
          <TouchableOpacity 
            onPress={() => removeQuestion(question.id)}
            style={styles.removeButton}
          >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>
      
      <TextInput
        style={[styles.input, { 
          borderColor: colors.border, 
          color: colors.textPrimary,
          backgroundColor: colors.background 
        }]}
        placeholder="Enter question text"
        placeholderTextColor={colors.textTertiary}
        value={question.text}
        onChangeText={(text) => updateQuestion(question.id, 'text', text)}
      />
      
      <View style={styles.questionSettings}>
        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>
            Response Type:
          </Text>
          <View style={styles.pickerContainer}>
            <Text style={{ color: colors.textPrimary }}>Yes/No</Text>
            <Ionicons name="chevron-down" size={16} color={colors.textTertiary} />
          </View>
        </View>
        
        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>
            Required
          </Text>
          <Switch
            value={question.required}
            onValueChange={(value) => updateQuestion(question.id, 'required', value)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>
      </View>
    </Animatable.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Template Info */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Template Information
          </Text>
          
          <TextInput
            style={[styles.input, { 
              borderColor: colors.border, 
              color: colors.textPrimary,
              backgroundColor: colors.background 
            }]}
            placeholder="Template Name"
            placeholderTextColor={colors.textTertiary}
            value={templateName}
            onChangeText={setTemplateName}
          />
          
          <TextInput
            style={[styles.input, styles.textArea, { 
              borderColor: colors.border, 
              color: colors.textPrimary,
              backgroundColor: colors.background,
              height: 100,
              textAlignVertical: 'top',
            }]}
            placeholder="Description (Optional)"
            placeholderTextColor={colors.textTertiary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
          
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>
              Category:
            </Text>
            <View style={[styles.pickerContainer, { borderColor: colors.border }]}>
              <Text style={{ color: colors.textPrimary }}>{category}</Text>
              <Ionicons name="chevron-down" size={16} color={colors.textTertiary} />
            </View>
          </View>
          
          <View style={[styles.settingRow, { justifyContent: 'space-between' }]}>
            <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>
              Make this template public
            </Text>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>
        
        {/* Questions Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Questions
            </Text>
            <TouchableOpacity 
              onPress={addQuestion}
              style={[styles.addButton, { backgroundColor: colors.primary }]}
            >
              <Ionicons name="add" size={20} color={colors.white} />
              <Text style={[styles.addButtonText, { color: colors.white }]}>
                Add Question
              </Text>
            </TouchableOpacity>
          </View>
          
          {questions.map((question, index) => renderQuestion(question, index))}
        </View>
      </ScrollView>
      
      {/* Bottom Action Bar */}
      <View style={[styles.actionBar, { 
        borderTopColor: colors.border,
        backgroundColor: colors.surface 
      }]}>
        <TouchableOpacity 
          style={[styles.cancelButton, { borderColor: colors.border }]}
          onPress={() => navigation.goBack()}
          disabled={isSubmitting}
        >
          <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>
            Cancel
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.saveButton, { 
            backgroundColor: colors.primary,
            opacity: !templateName.trim() || isSubmitting ? 0.6 : 1 
          }]}
          onPress={handleSave}
          disabled={!templateName.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={[styles.saveButtonText, { color: colors.white }]}>
              Save Template
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Space for the action bar
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingLabel: {
    marginRight: 12,
    fontSize: 14,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  questionCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionNumber: {
    fontWeight: '600',
    fontSize: 14,
  },
  removeButton: {
    padding: 4,
  },
  questionSettings: {
    marginTop: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addButtonText: {
    marginLeft: 4,
    fontWeight: '500',
    fontSize: 14,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    ...Platform.select({
      ios: {
        paddingBottom: 30,
      },
    }),
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 12,
  },
  cancelButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    flex: 2,
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
  },
  saveButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  headerButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});

export default NewTemplateScreen;
