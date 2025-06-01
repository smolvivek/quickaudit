import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const FormInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  touched,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  icon,
  style,
  ...props
}) => {
  const { themeStyles } = useTheme();
  const { colors, typography, spacing } = themeStyles;
  
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: colors.text, ...typography.bodySmall }]}>
          {label}
        </Text>
      )}
      
      <View 
        style={[
          styles.inputContainer,
          { 
            borderColor: error && touched 
              ? colors.error 
              : isFocused 
                ? colors.primary 
                : colors.border,
            borderRadius: spacing.borderRadius.medium,
            backgroundColor: colors.surface
          }
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={error && touched ? colors.error : colors.textSecondary}
            style={styles.icon}
          />
        )}
        
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            { 
              color: colors.text,
              ...typography.body
            }
          ]}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.visibilityToggle}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && touched && (
        <Text style={[styles.errorText, { color: colors.error, ...typography.caption }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    height: 48,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
  },
  visibilityToggle: {
    padding: 4,
  },
  errorText: {
    marginTop: 4,
  }
});

export default FormInput;
