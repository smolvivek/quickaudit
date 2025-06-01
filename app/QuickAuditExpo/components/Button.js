import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  View 
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../constants/Theme';

const Button = ({ 
  title, 
  onPress, 
  type = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
  animationDelay = 0,
}) => {
  // Get theme from context
  const { themeStyles } = useTheme();
  const { colors } = themeStyles;
  // Determine button styles based on type
  const getButtonStyles = () => {
    switch (type) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          borderWidth: 1,
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          borderColor: colors.border,
          borderWidth: 1,
        };
      case 'accent':
        return {
          backgroundColor: colors.accent,
          borderColor: colors.accent,
          borderWidth: 1,
        };
      case 'danger':
        return {
          backgroundColor: colors.error,
          borderColor: colors.error,
          borderWidth: 1,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: colors.primary,
          borderWidth: 1,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          borderWidth: 1,
        };
    }
  };

  // Determine text color based on button type
  const getTextColor = () => {
    switch (type) {
      case 'primary':
      case 'accent':
      case 'danger':
        return colors.secondary;
      case 'secondary':
        return colors.text;
      case 'outline':
      case 'text':
        return colors.primary;
      default:
        return colors.secondary;
    }
  };

  // Determine button size styles
  const getSizeStyles = () => {
    const { spacing } = themeStyles;
    
    switch (size) {
      case 'small':
        return {
          paddingVertical: spacing.xs / 2, // 4
          paddingHorizontal: spacing.xs * 1.5, // 12
          borderRadius: spacing.borderRadius.small,
        };
      case 'medium':
        return {
          paddingVertical: spacing.buttonPaddingVertical, // 12
          paddingHorizontal: spacing.buttonPaddingHorizontal, // 24
          borderRadius: spacing.borderRadius.medium,
        };
      case 'large':
        return {
          paddingVertical: spacing.md / 2, // 12
          paddingHorizontal: spacing.md, // 24
          borderRadius: spacing.borderRadius.large,
        };
      default:
        return {
          paddingVertical: spacing.buttonPaddingVertical,
          paddingHorizontal: spacing.buttonPaddingHorizontal,
          borderRadius: spacing.borderRadius.medium,
        };
    }
  };

  // Determine text size styles
  const getTextSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          fontSize: 12,
        };
      case 'medium':
        return {
          fontSize: 14,
        };
      case 'large':
        return {
          fontSize: 16,
        };
      default:
        return {
          fontSize: 14,
        };
    }
  };

  // Combine all styles
  const buttonStyles = [
    styles.button,
    getButtonStyles(),
    getSizeStyles(),
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const buttonTextStyles = [
    styles.buttonText,
    getTextStyles(),
    getTextSizeStyles(),
    textStyle,
  ];

  // Render the button with animation
  return (
    <Animatable.View
      animation="fadeIn"
      duration={600}
      delay={animationDelay}
      style={fullWidth && styles.fullWidth}
    >
      <TouchableOpacity
        style={buttonStyles}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={type === 'outline' || type === 'text' || type === 'secondary' ? COLORS.primary : COLORS.secondary} 
          />
        ) : (
          <View style={styles.contentContainer}>
            {icon && iconPosition === 'left' && (
              <View style={styles.iconLeft}>{icon}</View>
            )}
            <Text style={buttonTextStyles}>{title}</Text>
            {icon && iconPosition === 'right' && (
              <View style={styles.iconRight}>{icon}</View>
            )}
          </View>
        )}
      </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;
