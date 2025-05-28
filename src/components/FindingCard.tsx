import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Finding } from '../types/audit';
import { colors } from '../theme/designSystem';
import { Icon } from './Icon';
import { formatDate } from '../utils/dateUtils';

interface FindingCardProps {
  finding: Finding;
  onPress: () => void;
}

const getSeverityColor = (severity: Finding['severity']) => {
  switch (severity) {
    case 'critical':
      return colors.error;
    case 'high':
      return colors.warning;
    case 'medium':
      return colors.info;
    case 'low':
      return colors.success;
    default:
      return colors.gray;
  }
};

export const FindingCard: React.FC<FindingCardProps> = ({ finding, onPress }) => {
  const severityColor = getSeverityColor(finding.severity);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{finding.title}</Text>
        <View style={[styles.severityBadge, { backgroundColor: severityColor }]}>
          <Text style={styles.severityText}>{finding.severity}</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {finding.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Icon name="calendar" size={16} color={colors.textSecondary} />
          <Text style={styles.footerText}>
            {formatDate(finding.createdAt)}
          </Text>
        </View>

        {finding.location && (
          <View style={styles.footerItem}>
            <Icon name="location" size={16} color={colors.textSecondary} />
            <Text style={styles.footerText}>{finding.location}</Text>
          </View>
        )}

        {finding.photos.length > 0 && (
          <View style={styles.footerItem}>
            <Icon name="photo" size={16} color={colors.textSecondary} />
            <Text style={styles.footerText}>
              {finding.photos.length} photo(s)
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  severityText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
}); 