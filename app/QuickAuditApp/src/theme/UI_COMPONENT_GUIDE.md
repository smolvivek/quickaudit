# QuickAudit Mobile UI Component Guide

This guide outlines the UI components and styling to ensure the mobile app perfectly matches the web app's design.

## Colors

### Primary Colors
- Primary Blue: `#3333FF` - Used for primary actions, headers, and key UI elements
- White: `#FFFFFF` - Used for backgrounds, cards, and text on dark backgrounds
- Green Accent: `#00C853` - Used for success states, confirmation actions, and accents

### Secondary Colors
- Light Gray Background: `#F5F5F5` - Used for app background
- Dark Text: `#333333` - Used for primary text
- Medium Gray: `#757575` - Used for secondary text and disabled states
- Light Gray: `#E0E0E0` - Used for borders and dividers

## Typography

### Font Family
- System font (San Francisco on iOS, Roboto on Android)

### Text Styles
- Header: 24px, Bold, `#333333`
- Subheader: 18px, Medium (500), `#555555`
- Title: 16px, Bold, `#333333`
- Subtitle: 14px, Medium (500), `#555555`
- Body: 14px, Regular, `#333333`
- Caption: 12px, Regular, `#757575`
- Button: 14px, Medium (500), varies by button type

## Components

### Buttons

#### Primary Button
- Background: `#3333FF` (Primary Blue)
- Text Color: `#FFFFFF` (White)
- Border Radius: 50px (fully rounded)
- Padding: 12px vertical, 24px horizontal
- Font: 14px, Medium (500)

#### Secondary Button
- Background: Transparent
- Border: 1px solid `#3333FF` (Primary Blue)
- Text Color: `#3333FF` (Primary Blue)
- Border Radius: 50px (fully rounded)
- Padding: 10px vertical, 20px horizontal
- Font: 14px, Medium (500)

#### Text Button
- Background: Transparent
- Text Color: `#3333FF` (Primary Blue)
- Padding: 8px vertical, 16px horizontal
- Font: 14px, Medium (500)

#### Accent Button
- Background: `#00C853` (Green Accent)
- Text Color: `#FFFFFF` (White)
- Border Radius: 50px (fully rounded)
- Padding: 12px vertical, 24px horizontal
- Font: 14px, Medium (500)

### Cards

- Background: `#FFFFFF` (White)
- Border Radius: 8px
- Shadow: 0px 2px 4px rgba(0, 0, 0, 0.1)
- Padding: 16px
- Margin: 8px vertical

#### Card Header
- Title: 16px, Bold, `#333333`
- Subtitle: 14px, Regular, `#757575`
- Layout: Row with space between

#### Card Content
- Body Text: 14px, Regular, `#333333`
- Margin: 12px bottom

#### Card Footer
- Layout: Row with flex-end alignment
- Buttons: Text or Secondary style

### Form Elements

#### Input Fields
- Background: `#FFFFFF` (White)
- Border: 1px solid `#E0E0E0`
- Border Radius: 8px
- Padding: 12px vertical, 16px horizontal
- Text: 14px, Regular, `#333333`
- Focus Border: `#3333FF` (Primary Blue)

#### Labels
- Text: 14px, Medium (500), `#555555`
- Margin: 8px bottom

#### Error Messages
- Text: 12px, Regular, `#EB5757` (Error Red)
- Margin: 4px top

### Lists

#### List Items
- Padding: 12px vertical, 16px horizontal
- Border Bottom: 1px solid `#F0F0F0`
- Title: 16px, Medium (500), `#333333`
- Description: 14px, Regular, `#757575`
- Icon Margin: 16px right

### Navigation

#### Header
- Background: `#3333FF` (Primary Blue)
- Title: 18px, Medium (500), `#FFFFFF` (White)
- Elevation: 0 (flat design)

#### Tab Bar
- Background: `#FFFFFF` (White)
- Active Tab: `#3333FF` (Primary Blue)
- Inactive Tab: `#757575` (Medium Gray)
- Height: 60px
- Label: 12px, Medium (500)

### Badges

#### Default Badge
- Background: `#3333FF` (Primary Blue)
- Text: 12px, Medium (500), `#FFFFFF` (White)
- Padding: 4px vertical, 8px horizontal
- Border Radius: 12px

#### Success Badge
- Background: `#00C853` (Green Accent)

#### Warning Badge
- Background: `#FFC107` (Warning Yellow)

#### Error Badge
- Background: `#EB5757` (Error Red)

## Layout

### Containers
- App Background: `#F5F5F5` (Light Gray)
- Content Padding: 16px

### Spacing
- XS: 4px
- Small: 8px
- Medium: 16px
- Large: 24px
- XL: 32px

## Implementation Guidelines

1. Use the `componentStyles` from `src/theme/componentStyles.ts` for consistent styling
2. Access theme colors and styles through the `useTheme()` hook
3. Ensure all UI elements match the web app's visual design
4. Maintain consistent spacing and layout across screens
5. Use the same iconography style as the web app
6. Follow platform-specific guidelines while maintaining visual consistency

## Example Usage

```jsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

const MyComponent = () => {
  const { theme, styles } = useTheme();
  
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Card Title</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={{ color: theme.colors.text }}>Card content goes here</Text>
        </View>
        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Primary Action</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MyComponent;
```
