import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const TabBar = ({ 
  activeTab = 'audits', 
  onTabPress 
}) => {
  const { colors, typography, spacing } = useTheme();

  const tabs = [
    { 
      key: 'audits', 
      label: 'Audits', 
      icon: 'document-text-outline',
      activeIcon: 'document-text'
    },
    { 
      key: 'templates', 
      label: 'Templates', 
      icon: 'copy-outline',
      activeIcon: 'copy'
    },
    { 
      key: 'reports', 
      label: 'Reports', 
      icon: 'bar-chart-outline',
      activeIcon: 'bar-chart'
    },
    { 
      key: 'settings', 
      label: 'Settings', 
      icon: 'settings-outline',
      activeIcon: 'settings'
    },
  ];
  
  const handleTabPress = useCallback((tabKey) => {
    if (onTabPress) {
      onTabPress(tabKey);
    }
  }, [onTabPress]);

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: spacing.xs,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 10,
        }
      ]}
    >
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.key}
          style={styles.tabButton}
          onPress={() => handleTabPress(tab.key)}
          activeOpacity={0.7}
        >
          <Animatable.View
            animation={activeTab === tab.key ? 'pulse' : undefined}
            duration={1000}
            iterationCount={activeTab === tab.key ? 'infinite' : 1}
            style={styles.iconContainer}
          >
            <Ionicons
              name={activeTab === tab.key ? tab.activeIcon : tab.icon}
              size={24}
              color={activeTab === tab.key ? colors.primary : colors.textSecondary}
            />
          </Animatable.View>
          <Text
            style={[
              styles.tabLabel,
              { 
                color: activeTab === tab.key ? colors.primary : colors.textSecondary,
                ...typography.caption,
                fontWeight: activeTab === tab.key ? '600' : '400'
              }
            ]}
          >
            {tab.label}
          </Text>
          {activeTab === tab.key && (
            <Animatable.View 
              animation="fadeIn"
              duration={300}
              style={[styles.activeIndicator, { backgroundColor: colors.primary }]}
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  iconContainer: {
    marginBottom: 4,
    position: 'relative',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 4,
    height: 4,
    borderRadius: 2,
  }
});

export default TabBar;
