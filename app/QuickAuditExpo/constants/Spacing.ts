/**
 * QuickAudit Spacing based on the UI Style Guide
 * Using an 8pt grid system for consistent spacing and alignment
 */

// Base unit for the 8pt grid system
const BASE = 8;

export const Spacing = {
  // Core spacing values
  xxs: BASE / 2, // 4
  xs: BASE,      // 8
  sm: BASE * 2,  // 16
  md: BASE * 3,  // 24
  lg: BASE * 4,  // 32
  xl: BASE * 6,  // 48
  xxl: BASE * 8, // 64
  
  // Specific spacing for components
  inputPaddingVertical: BASE * 1.5, // 12
  inputPaddingHorizontal: BASE * 2, // 16
  buttonPaddingVertical: BASE * 1.5, // 12
  buttonPaddingHorizontal: BASE * 3, // 24
  cardPadding: BASE * 2, // 16
  cardMargin: BASE, // 8
  sectionMargin: BASE * 3, // 24
  listItemPadding: BASE * 2, // 16
  listItemSpacing: BASE, // 8
  iconSize: {
    small: BASE * 2, // 16
    medium: BASE * 3, // 24
    large: BASE * 4, // 32
  },
  borderRadius: {
    small: BASE / 2, // 4
    medium: BASE, // 8
    large: BASE * 2, // 16
    pill: BASE * 4, // 32
  },
};

export default Spacing;
