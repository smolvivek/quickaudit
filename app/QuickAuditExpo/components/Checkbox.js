import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const Checkbox = ({ 
  checked, 
  onPress, 
  disabled = false,
  style 
}) => {
  const { themeStyles } = useTheme();
  const { colors, spacing } = themeStyles;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          borderColor: checked ? colors.primary : colors.border,
          backgroundColor: checked ? colors.primary : colors.surface,
          borderRadius: spacing.borderRadius.small,
          opacity: disabled ? 0.5 : 1,
        },
        style
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {checked && (
        <Ionicons 
          name="checkmark" 
          size={16} 
          color={colors.white} 
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Checkbox;
