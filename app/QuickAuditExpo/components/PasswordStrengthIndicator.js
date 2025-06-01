import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const PasswordStrengthIndicator = ({ strength }) => {
  const { themeStyles } = useTheme();
  const { colors, typography, spacing } = themeStyles;

  // Determine the color and label based on strength
  const getStrengthInfo = () => {
    if (strength <= 20) {
      return { color: colors.error, label: 'Very Weak' };
    } else if (strength <= 40) {
      return { color: colors.warning, label: 'Weak' };
    } else if (strength <= 60) {
      return { color: colors.warning, label: 'Fair' };
    } else if (strength <= 80) {
      return { color: colors.info, label: 'Good' };
    } else {
      return { color: colors.success, label: 'Strong' };
    }
  };

  const { color, label } = getStrengthInfo();

  // Calculate how many segments to fill based on strength
  const getSegmentFill = (index) => {
    const segmentThreshold = index * 20; // 5 segments, each representing 20% strength
    return strength >= segmentThreshold ? color : colors.border;
  };

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        {[0, 1, 2, 3, 4].map((index) => (
          <View
            key={index}
            style={[
              styles.segment,
              { 
                backgroundColor: getSegmentFill(index + 1),
                marginRight: index < 4 ? spacing.xs : 0,
                borderRadius: spacing.borderRadius.small,
              }
            ]}
          />
        ))}
      </View>
      <Text style={[styles.label, { color, ...typography.caption }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  barContainer: {
    flexDirection: 'row',
    height: 4,
    marginBottom: 4,
  },
  segment: {
    flex: 1,
    height: '100%',
  },
  label: {
    textAlign: 'right',
    fontWeight: '500',
  }
});

export default PasswordStrengthIndicator;
