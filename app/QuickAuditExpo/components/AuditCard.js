import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const AuditCard = ({ 
  title, 
  date, 
  status, 
  score, 
  onPress 
}) => {
  const { colors, typography, spacing, textStyles } = useTheme();
  
  // Determine status color and icon
  const getStatusInfo = () => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { 
          color: colors.statusCompleted,
          icon: 'checkmark-circle'
        };
      case 'in progress':
        return { 
          color: colors.statusInProgress,
          icon: 'time'
        };
      case 'draft':
        return { 
          color: colors.statusDraft,
          icon: 'document'
        };
      case 'archived':
        return { 
          color: colors.statusDraft,
          icon: 'archive'
        };
      default:
        return { 
          color: colors.statusFailed,
          icon: 'close-circle'
        };
    }
  };
  
  const statusInfo = getStatusInfo();

  return (
    <Animatable.View
      animation="fadeIn"
      duration={600}
      useNativeDriver
    >
      <TouchableOpacity 
        style={[
          styles.container, 
          { 
            backgroundColor: colors.surface,
            borderRadius: spacing.borderRadius.medium,
            marginBottom: spacing.sm,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
            borderLeftWidth: 4,
            borderLeftColor: statusInfo.color
          }
        ]} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.contentContainer}>
          <View style={styles.mainContent}>
            <Text style={[styles.title, { color: colors.text, ...typography.h3 }]}>
              {title}
            </Text>
            <View style={styles.metaContainer}>
              <Ionicons 
                name={statusInfo.icon} 
                size={14} 
                color={statusInfo.color} 
                style={styles.statusIcon} 
              />
              <Text style={[styles.statusText, { color: statusInfo.color, ...typography.caption, fontWeight: '500' }]}>
                {status}
              </Text>
              <Text style={[styles.dateText, { color: colors.textSecondary, ...typography.caption }]}>
                • {date}
              </Text>
            </View>
          </View>
          
          {score && (
            <Animatable.View 
              style={styles.scoreContainer}
              animation="pulse"
              iterationCount="infinite"
              duration={2000}
              useNativeDriver
            >
              <Text style={[
                styles.scoreText, 
                { 
                  color: statusInfo.color,
                  ...typography.h3
                }
              ]}>
                {score}
              </Text>
            </Animatable.View>
          )}
        </View>
        
        <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="eye-outline" size={18} color={colors.textSecondary} />
            <Text style={[styles.footerButtonText, { color: colors.textSecondary }]}>View</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="share-outline" size={18} color={colors.textSecondary} />
            <Text style={[styles.footerButtonText, { color: colors.textSecondary }]}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="ellipsis-horizontal" size={18} color={colors.textSecondary} />
            <Text style={[styles.footerButtonText, { color: colors.textSecondary }]}>More</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    overflow: 'hidden',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
  },
  title: {
    marginBottom: 8,
    fontWeight: '600',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    marginRight: 4,
  },
  dateText: {
    marginLeft: 4,
  },
  scoreContainer: {
    marginLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
  },
  scoreText: {
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  footerButtonText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  }
});

export default AuditCard;
