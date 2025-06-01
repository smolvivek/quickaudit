import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ 
  placeholder = 'Search', 
  value, 
  onChangeText, 
  onSubmit,
  style 
}) => {
  const { themeStyles } = useTheme();
  const { colors, typography, spacing } = themeStyles;

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.background,
          borderRadius: spacing.borderRadius.pill,
        },
        style
      ]}
    >
      <Ionicons 
        name="search-outline" 
        size={20} 
        color={colors.textSecondary} 
        style={styles.icon} 
      />
      <TextInput
        style={[
          styles.input,
          { 
            color: colors.text,
            ...typography.body 
          }
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value ? (
        <TouchableOpacity 
          onPress={() => onChangeText('')}
          style={styles.clearButton}
        >
          <Ionicons 
            name="close-circle" 
            size={18} 
            color={colors.textSecondary} 
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    width: '100%',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  }
});

export default SearchBar;
