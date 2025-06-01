/**
 * Script to fix card.tsx component TypeScript errors
 */

const fs = require('fs');
const path = require('path');

// Fix card.tsx
const fixCardComponent = () => {
  const filePath = path.join(process.cwd(), 'src/components/ui/card.tsx');
  
  const content = `/**
 * Card Component
 * Reusable card UI component
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { appTheme } from '../../theme';

// Card props interface
interface CardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  contentStyle?: ViewStyle;
  elevation?: number;
  disabled?: boolean;
}

// Card component
const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  onPress,
  style,
  titleStyle,
  subtitleStyle,
  contentStyle,
  elevation = 2,
  disabled = false
}) => {
  // Wrapper component based on whether card is pressable
  const Wrapper = onPress ? TouchableOpacity : View;
  
  return (
    <Wrapper
      style={[
        styles.container,
        { elevation },
        style
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && (
            <Text style={[styles.title, titleStyle]} numberOfLines={2}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text style={[styles.subtitle, subtitleStyle]} numberOfLines={3}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </Wrapper>
  );
};

// Card.Content component
interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const CardContent: React.FC<CardContentProps> = ({ children, style }) => (
  <View style={[styles.contentInner, style]}>{children}</View>
);

// Card.Actions component
interface CardActionsProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const CardActions: React.FC<CardActionsProps> = ({ children, style }) => (
  <View style={[styles.actions, style]}>{children}</View>
);

// Attach subcomponents
Card.Content = CardContent;
Card.Actions = CardActions;

const styles = StyleSheet.create({
  container: {
    backgroundColor: appTheme.colors.surface,
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: appTheme.colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: appTheme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: appTheme.colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: 16,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: appTheme.colors.border,
  },
});

export default Card;`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed card.tsx');
};

// Run the function
console.log('Fixing Card component...');
fixCardComponent();
console.log('Card component fixed successfully!');
