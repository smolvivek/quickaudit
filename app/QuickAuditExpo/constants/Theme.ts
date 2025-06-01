/**
 * QuickAudit Theme based on the UI Style Guide
 * Combines Colors, Typography, and Spacing into a comprehensive theme system
 */

import { Colors } from './Colors';
import { Typography } from './Typography';
import { Spacing } from './Spacing';

// Shadow styles for different elevations
const Shadows = {
  light: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      elevation: 2,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 4,
    },
  },
  dark: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
      elevation: 2,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 4,
    },
  },
};

// Component-specific styles
const Components = {
  light: {
    // Card component
    card: {
      backgroundColor: Colors.light.surface,
      borderRadius: Spacing.borderRadius.medium,
      padding: Spacing.cardPadding,
      marginVertical: Spacing.cardMargin,
      ...Shadows.light.small,
    },
    // Button component
    button: {
      primary: {
        backgroundColor: Colors.light.primary,
        borderRadius: Spacing.borderRadius.medium,
        paddingVertical: Spacing.buttonPaddingVertical,
        paddingHorizontal: Spacing.buttonPaddingHorizontal,
      },
      secondary: {
        backgroundColor: 'transparent',
        borderColor: Colors.light.primary,
        borderWidth: 1,
        borderRadius: Spacing.borderRadius.medium,
        paddingVertical: Spacing.buttonPaddingVertical,
        paddingHorizontal: Spacing.buttonPaddingHorizontal,
      },
      text: {
        color: Colors.light.primary,
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.sm,
      },
    },
    // Input component
    input: {
      backgroundColor: Colors.light.surface,
      borderColor: Colors.light.border,
      borderWidth: 1,
      borderRadius: Spacing.borderRadius.medium,
      paddingVertical: Spacing.inputPaddingVertical,
      paddingHorizontal: Spacing.inputPaddingHorizontal,
      color: Colors.light.text,
    },
    // List item component
    listItem: {
      backgroundColor: Colors.light.surface,
      paddingVertical: Spacing.listItemPadding,
      paddingHorizontal: Spacing.listItemPadding,
      marginBottom: Spacing.listItemSpacing,
      borderRadius: Spacing.borderRadius.small,
      borderColor: Colors.light.border,
      borderWidth: 1,
    },
    // Tab bar component
    tabBar: {
      backgroundColor: Colors.light.surface,
      borderTopColor: Colors.light.border,
      borderTopWidth: 1,
      height: 60,
      paddingBottom: Spacing.xs,
    },
    // Header component
    header: {
      backgroundColor: Colors.light.surface,
      borderBottomColor: Colors.light.border,
      borderBottomWidth: 1,
      height: 60,
      paddingHorizontal: Spacing.md,
    },
  },
  dark: {
    // Card component
    card: {
      backgroundColor: Colors.dark.surface,
      borderRadius: Spacing.borderRadius.medium,
      padding: Spacing.cardPadding,
      marginVertical: Spacing.cardMargin,
      ...Shadows.dark.small,
    },
    // Button component
    button: {
      primary: {
        backgroundColor: Colors.dark.primary,
        borderRadius: Spacing.borderRadius.medium,
        paddingVertical: Spacing.buttonPaddingVertical,
        paddingHorizontal: Spacing.buttonPaddingHorizontal,
      },
      secondary: {
        backgroundColor: 'transparent',
        borderColor: Colors.dark.primary,
        borderWidth: 1,
        borderRadius: Spacing.borderRadius.medium,
        paddingVertical: Spacing.buttonPaddingVertical,
        paddingHorizontal: Spacing.buttonPaddingHorizontal,
      },
      text: {
        color: Colors.dark.primary,
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.sm,
      },
    },
    // Input component
    input: {
      backgroundColor: Colors.dark.surface,
      borderColor: Colors.dark.border,
      borderWidth: 1,
      borderRadius: Spacing.borderRadius.medium,
      paddingVertical: Spacing.inputPaddingVertical,
      paddingHorizontal: Spacing.inputPaddingHorizontal,
      color: Colors.dark.text,
    },
    // List item component
    listItem: {
      backgroundColor: Colors.dark.surface,
      paddingVertical: Spacing.listItemPadding,
      paddingHorizontal: Spacing.listItemPadding,
      marginBottom: Spacing.listItemSpacing,
      borderRadius: Spacing.borderRadius.small,
      borderColor: Colors.dark.border,
      borderWidth: 1,
    },
    // Tab bar component
    tabBar: {
      backgroundColor: Colors.dark.surface,
      borderTopColor: Colors.dark.border,
      borderTopWidth: 1,
      height: 60,
      paddingBottom: Spacing.xs,
    },
    // Header component
    header: {
      backgroundColor: Colors.dark.surface,
      borderBottomColor: Colors.dark.border,
      borderBottomWidth: 1,
      height: 60,
      paddingHorizontal: Spacing.md,
    },
  },
};

// Export the complete theme
export const Theme = {
  light: {
    colors: Colors.light,
    typography: Typography,
    spacing: Spacing,
    shadows: Shadows.light,
    components: Components.light,
  },
  dark: {
    colors: Colors.dark,
    typography: Typography,
    spacing: Spacing,
    shadows: Shadows.dark,
    components: Components.dark,
  },
};

export default Theme;
