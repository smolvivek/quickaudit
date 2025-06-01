/**
 * Script to fix Icon.tsx TypeScript errors
 */

const fs = require('fs');
const path = require('path');

// Fix Icon.tsx
const fixIcon = () => {
  const filePath = path.join(process.cwd(), 'src/components/Icon.tsx');
  
  const content = `/**
 * Icon Component
 * Wrapper for vector icons with additional functionality
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { appTheme } from '../theme';

// Icon type
export type IconType = 'material-community' | 'material' | 'font-awesome' | 'ionicons';

// Icon props interface
interface IconProps {
  name: string;
  type?: IconType;
  size?: number;
  color?: string;
  style?: ViewStyle;
  onPress?: () => void;
  disabled?: boolean;
  badge?: number;
  badgeColor?: string;
}

// Icon component
const Icon: React.FC<IconProps> = ({
  name,
  type = 'material-community',
  size = 24,
  color = appTheme.colors.text,
  style,
  onPress,
  disabled = false,
  badge,
  badgeColor = appTheme.colors.error
}) => {
  // Get icon component based on type
  const getIconComponent = () => {
    switch (type) {
      case 'material':
        return <MaterialIcons name={name} size={size} color={color} />;
      case 'font-awesome':
        return <FontAwesome name={name} size={size} color={color} />;
      case 'ionicons':
        return <Ionicons name={name} size={size} color={color} />;
      case 'material-community':
      default:
        return <MaterialCommunityIcons name={name} size={size} color={color} />;
    }
  };
  
  // Render icon with or without touchable wrapper
  const renderIcon = () => {
    const iconComponent = (
      <View style={[styles.container, style]}>
        {getIconComponent()}
        {badge !== undefined && badge > 0 && (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>
              {badge > 99 ? '99+' : badge}
            </Text>
          </View>
        )}
      </View>
    );
    
    if (onPress) {
      return (
        <TouchableOpacity
          onPress={onPress}
          disabled={disabled}
          activeOpacity={0.7}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          {iconComponent}
        </TouchableOpacity>
      );
    }
    
    return iconComponent;
  };
  
  return renderIcon();
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  } as TextStyle,
});

export default Icon;`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed Icon.tsx');
};

// Run the function
console.log('Fixing Icon component...');
fixIcon();
console.log('Icon component fixed successfully!');
