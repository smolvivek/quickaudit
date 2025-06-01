// Spacing.js - QuickAudit App Spacing Theme
// Based on the 8pt grid system from the style guide

export const SPACING = {
  // Base spacing units
  UNIT: 8,
  
  // Predefined spacing values
  TINY: 4,
  SMALL: 8,
  MEDIUM: 16,
  LARGE: 24,
  XLARGE: 32,
  XXLARGE: 40,
  
  // Specific spacing use cases
  CONTAINER_PADDING: 16,
  CARD_PADDING: 16,
  BUTTON_PADDING: 16,
  INPUT_PADDING: 12,
  LIST_ITEM_PADDING: 16,
  SECTION_MARGIN: 24,
  
  // Grid helpers
  grid: (multiplier = 1) => 8 * multiplier,
};

export default SPACING;
