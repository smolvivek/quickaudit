import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  color = '#2196F3' 
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return 24;
      case 'large':
        return 48;
      default:
        return 36;
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.logoContainer, { backgroundColor: color }]}>
        <Text style={[styles.logoText, { fontSize: getSize() }]}>QA</Text>
      </View>
      <Text style={[styles.appName, { fontSize: getSize() * 0.8 }]}>
        QuickAudit
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoText: {
    color: 'white',
    fontWeight: 'bold',
  },
  appName: {
    fontWeight: 'bold',
    color: '#333',
  },
}); 