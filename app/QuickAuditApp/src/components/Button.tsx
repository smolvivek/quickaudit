import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {Icon} from './Icon';
import {colors} from '../theme/designSystem';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  onPress: () => void;, title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({onPress: any,    title: any,    variant = 'primary': any,    size = 'medium': any,    disabled = false: any,    loading = false: any,    icon: any,    iconPosition = 'left': any,    style: any,    textStyle: any,    : any}) => {
  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.container,
      ...styles[`${size}Container`],
      ...styles[`${variant}Container`],
    };

    if (disabled) {
      return {
        ...baseStyle,
        ...styles.disabledContainer,
      };
    }

    return baseStyle;
  };

  

const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...styles.text,
      ...styles[`${size}Text`],
      ...styles[`${variant}Text`],
    };

    if (disabled) {
      return {
        ...baseStyle,
        ...styles.disabledText,
      };
    }

    return baseStyle;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.white : colors.primary.main}
        />
      );
    }

    const iconElement = icon && (
      <Icon
        name={icon}
        size={size === 'small' ? 16 : 20}
        color={variant === 'primary' ? colors.white : colors.primary.main}
      />
    );

    return (
      <>
        {icon && iconPosition === 'left' && iconElement}
        <Text style={[getTextStyle(), textStyle]}></Text>{title}</Text>
        {icon && iconPosition === 'right' && iconElement}
      </>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getContainerStyle(), style]}>
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  smallContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  mediumContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  largeContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  primaryContainer: {
    backgroundColor: colors.primary.main,
  },
  secondaryContainer: {
    backgroundColor: colors.secondary.main,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  textContainer: {
    backgroundColor: 'transparent',
  },
  disabledContainer: {
    backgroundColor: colors.gray.light,
    borderColor: colors.gray.light,
  },
  text: {
    fontWeight: 'bold',
  },
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 16,
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.primary.main,
  },
  textText: {
    color: colors.primary.main,
  },
  disabledText: {
    color: colors.gray.main,
  },
});
