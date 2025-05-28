import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/designSystem';
import { AuditStatus } from '../types/audit';

interface StatusBadgeProps {
  status: AuditStatus;
}

const getStatusColor = (status: AuditStatus) => {
  switch (status) {
    case 'draft':
      return colors.gray;
    case 'in_progress':
      return colors.warning;
    case 'completed':
      return colors.success;
    case 'approved':
      return colors.success;
    case 'rejected':
      return colors.error;
    default:
      return colors.gray;
  }
};

const getStatusText = (status: AuditStatus) => {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const backgroundColor = getStatusColor(status);
  const text = getStatusText(status);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 100,
    alignItems: 'center',
  },
  text: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
}); 