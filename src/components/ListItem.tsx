import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Icon } from './Icon';
import { colors } from '../theme/designSystem';

interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: string;
  rightIcon?: string;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  disabled?: boolean;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onPress,
  containerStyle,
  titleStyle,
  subtitleStyle,
  disabled = false,
}) => {
  const content = (
    <View style={[styles.container, containerStyle]}>
      {leftIcon && (
        <Icon
          name={leftIcon}
          size={24}
          color={disabled ? colors.text.disabled : colors.text.primary}
          style={styles.leftIcon}
        />
      )}
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            disabled && styles.disabledText,
            titleStyle,
          ]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[
              styles.subtitle,
              disabled && styles.disabledText,
              subtitleStyle,
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {rightIcon && (
        <Icon
          name={rightIcon}
          size={24}
          color={disabled ? colors.text.disabled : colors.text.secondary}
          style={styles.rightIcon}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={styles.touchable}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  touchable: {
    backgroundColor: colors.background.paper,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background.paper,
  },
  content: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  leftIcon: {
    marginRight: 16,
  },
  rightIcon: {
    marginLeft: 8,
  },
  disabledText: {
    color: colors.text.disabled,
  },
}); 