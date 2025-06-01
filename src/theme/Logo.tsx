import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';

interface QuickAuditLogoProps {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  q: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderRadius: 12,
    position: 'relative',
  },
  check: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 16,
    height: 16,
  },
  text: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    letterSpacing: -0.5,
    marginTop: 8,
  }
});

const QuickAuditLogo: React.FC<QuickAuditLogoProps> = ({ 
  size = 48, 
  color = '#2F80ED',
  style
}: QuickAuditLogoProps) => {
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <View style={[styles.q, { borderColor: color }]} />
      <View style={[styles.check, { backgroundColor: color, transform: [{ rotate: '45deg' }] }]} />
      <Text style={[styles.text, { color: color }]}>{'QuickAudit'}</Text>
    </View>
  );
};

export default QuickAuditLogo;
