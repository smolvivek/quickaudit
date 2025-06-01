import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const FilterButton = ({ 
  label, 
  onPress, 
  isActive = false,
  style
}) => {
  const { themeStyles } = useTheme();
  const { colors, typography, spacing } = themeStyles;

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.background,
          borderRadius: spacing.borderRadius.medium,
        },
        style
      ]} 
      onPress={onPress}
    >
      <Text 
        style={[
          styles.label, 
          { 
            color: isActive ? colors.primary : colors.text,
            ...typography.bodySmall
          }
        ]}
      >
        {label}
      </Text>
      <Ionicons 
        name="chevron-down" 
        size={16} 
        color={isActive ? colors.primary : colors.textSecondary} 
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  label: {
    marginRight: 4,
  },
  icon: {
    marginTop: 1,
  }
});

export default FilterButton;
