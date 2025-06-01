import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from 'react-native';
import {useTheme} from '../../theme/ThemeProvider';

type ButtonVariant = 'primary' | 'secondary' | 'text' | 'accent';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

/**
 * Button component that follows the web app design
 * Supports primary, secondary, text, and accent variants
 */
const Button = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}: ButtonProps) => {
  const {theme, styles} = useTheme();

  // Determine button style based on variant
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'text':
        return styles.textButton;
      case 'accent':
        return styles.accentButton;
      default:
        return styles.primaryButton;
    }
  };

  // Determine text style based on variant
  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryButtonText;
      case 'secondary':
        return styles.secondaryButtonText;
      case 'text':
        return styles.textButtonText;
      case 'accent':
        return styles.accentButtonText;
      default:
        return styles.primaryButtonText;
    }
  };

  // Get the color for the loading indicator
  const getLoaderColor = () => {
    switch (variant) {
      case 'primary':
      case 'accent':
        return '#FFFFFF';
      case 'secondary':
      case 'text':
        return theme.colors.primary;
      default:
        return '#FFFFFF';
    }
  };

  return (
    <TouchableOpacity
      style={[
        getButtonStyle(),
        disabled && {opacity: 0.6},
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator color={getLoaderColor()} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;
