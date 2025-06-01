import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  StatusBar,
  Platform,
} from 'react-native';
import { Icon } from './Icon';
import { colors } from '../theme/designSystem';

interface HeaderProps {
  title: string;
  leftIcon?: string;
  rightIcon?: string;
  onLeftIconPress?: () => void;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  leftIcon,
  rightIcon,
  onLeftIconPress,
  onRightIconPress,
  containerStyle,
  titleStyle,
  showBackButton = false,
  onBackPress,
}) => {
  const renderLeftIcon = () => {
    if (showBackButton) {
      return (
        <TouchableOpacity
          onPress={onBackPress}
          style={styles.iconButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      );
    }

    if (leftIcon) {
      return (
        <TouchableOpacity
          onPress={onLeftIconPress}
          style={styles.iconButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name={leftIcon} size={24} color={colors.text.primary} />
        </TouchableOpacity>
      );
    }

    return <View style={styles.iconButton} />;
  };

  const renderRightIcon = () => {
    if (rightIcon) {
      return (
        <TouchableOpacity
          onPress={onRightIconPress}
          style={styles.iconButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name={rightIcon} size={24} color={colors.text.primary} />
        </TouchableOpacity>
      );
    }

    return <View style={styles.iconButton} />;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background.paper}
      />
      <View style={styles.content}>
        {renderLeftIcon()}
        <Text style={[styles.title, titleStyle]} numberOfLines={1}>
          {title}
        </Text>
        {renderRightIcon()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 