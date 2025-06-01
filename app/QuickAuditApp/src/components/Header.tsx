/**
 * Header Component
 * App header with navigation and action buttons
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar, TextStyle, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { appTheme } from '../theme';

// Header props interface
interface HeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: string;
  rightIcon?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  showBack?: boolean;
  transparent?: boolean;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
}

// Header component
const Header: React.FC<HeaderProps> = ({ 
  title, 
  subtitle, 
  leftIcon, 
  rightIcon, 
  onLeftPress, 
  onRightPress, 
  showBack = false, 
  transparent = false, 
  style, 
  titleStyle, 
  subtitleStyle 
}) => {
  const navigation = useNavigation();
  
  // Handle back button press
  const handleBackPress = () => {
    if (onLeftPress) {
      onLeftPress();
    } else {
      navigation.goBack();
    }
  };
  
  return (
    <View style={[
      styles.container, 
      transparent && styles.transparentContainer,
      style
    ]}>
      <StatusBar
        barStyle={transparent ? 'light-content' : 'dark-content'}
        backgroundColor={transparent ? 'transparent' : appTheme.colors.surface}
        translucent={transparent}
      />
      
      <View style={styles.leftContainer}>
        {(showBack || leftIcon) && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleBackPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon
              name={leftIcon || 'arrow-left'}
              size={24}
              color={transparent ? 'white' : appTheme.colors.text}
            />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.titleContainer}>
        <Text 
          style={[
            styles.title, 
            transparent && styles.whiteText,
            titleStyle
          ]} 
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text 
            style={[
              styles.subtitle, 
              transparent && styles.whiteText,
              subtitleStyle
            ]} 
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>
      
      <View style={styles.rightContainer}>
        {rightIcon && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onRightPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            disabled={!onRightPress}
          >
            <Icon
              name={rightIcon}
              size={24}
              color={transparent ? 'white' : appTheme.colors.text}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appTheme.colors.surface,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    zIndex: 10,
  },
  transparentContainer: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: appTheme.colors.text,
  } as TextStyle,
  subtitle: {
    fontSize: 14,
    color: appTheme.colors.textSecondary,
  } as TextStyle,
  whiteText: {
    color: 'white',
  },
  iconButton: {
    padding: 4,
  },
});

export default Header;