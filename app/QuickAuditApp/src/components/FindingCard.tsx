/**
 * FindingCard Component
 * Displays a finding card with details
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, TextStyle, ViewStyle } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appTheme } from '../theme';

// Finding severity type
export type FindingSeverity = 'critical' | 'high' | 'medium' | 'low';

// Finding status type
export type FindingStatus = 'open' | 'in_progress' | 'closed' | 'deferred';

// Finding interface
export interface Finding {
  id: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  status: FindingStatus;
  assignedTo?: string;
  dueDate?: string;
  closedDate?: string;
  images?: string[];
  createdAt: number;
  updatedAt: number;
}

// FindingCard props interface
interface FindingCardProps {
  finding: Finding;
  onPress?: (finding: Finding) => void;
  style?: ViewStyle;
}

// FindingCard component
const FindingCard: React.FC<FindingCardProps> = ({ finding, onPress, style }) => {
  // Get severity color
  const getSeverityColor = (severity: FindingSeverity): string => {
    switch (severity) {
      case 'critical':
        return appTheme.colors.error;
      case 'high':
        return '#ff9800'; // Orange
      case 'medium':
        return '#ffc107'; // Amber
      case 'low':
        return '#8bc34a'; // Light Green
      default:
        return appTheme.colors.neutral;
    }
  };
  
  // Get status color
  const getStatusColor = (status: FindingStatus): string => {
    switch (status) {
      case 'open':
        return appTheme.colors.error;
      case 'in_progress':
        return appTheme.colors.info;
      case 'closed':
        return appTheme.colors.success;
      case 'deferred':
        return appTheme.colors.warning;
      default:
        return appTheme.colors.neutral;
    }
  };
  
  // Format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={() => onPress && onPress(finding)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>{finding.title}</Text>
        <View style={styles.badges}>
          <Chip
            style={[styles.severityChip, { backgroundColor: getSeverityColor(finding.severity) }]}
            textStyle={styles.chipText}
          >
            {finding.severity.charAt(0).toUpperCase() + finding.severity.slice(1)}
          </Chip>
          <Chip
            style={[styles.statusChip, { backgroundColor: getStatusColor(finding.status) }]}
            textStyle={styles.chipText}
          >
            {finding.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Chip>
        </View>
      </View>
      
      <Text style={styles.description} numberOfLines={3}>{finding.description}</Text>
      
      <View style={styles.details}>
        {finding.assignedTo && (
          <View style={styles.detailItem}>
            <Icon name="account" size={16} color={appTheme.colors.text} />
            <Text style={styles.detailText}>Assigned to: {finding.assignedTo}</Text>
          </View>
        )}
        
        {finding.dueDate && (
          <View style={styles.detailItem}>
            <Icon name="calendar" size={16} color={appTheme.colors.text} />
            <Text style={styles.detailText}>Due: {formatDate(finding.dueDate)}</Text>
          </View>
        )}
        
        {finding.status === 'closed' && finding.closedDate && (
          <View style={styles.detailItem}>
            <Icon name="check-circle" size={16} color={appTheme.colors.success} />
            <Text style={styles.detailText}>Closed: {formatDate(finding.closedDate)}</Text>
          </View>
        )}
        
        {finding.images && finding.images.length > 0 && (
          <View style={styles.imagesContainer}>
            {finding.images.slice(0, 3).map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.thumbnail}
              />
            ))}
            {finding.images.length > 3 && (
              <View style={styles.moreImagesContainer}>
                <Text style={styles.moreImagesText}>+{finding.images.length - 3}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: appTheme.colors.surface,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
    color: appTheme.colors.text,
  } as TextStyle,
  badges: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  severityChip: {
    marginBottom: 4,
    height: 24,
  },
  statusChip: {
    height: 24,
  },
  chipText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  } as TextStyle,
  description: {
    fontSize: 14,
    color: appTheme.colors.textSecondary,
    marginBottom: 12,
  },
  details: {
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 12,
    color: appTheme.colors.textSecondary,
  },
  imagesContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 4,
    marginRight: 8,
  },
  moreImagesContainer: {
    width: 48,
    height: 48,
    borderRadius: 4,
    backgroundColor: appTheme.colors.backdrop,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImagesText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  } as TextStyle,
});

export default FindingCard;