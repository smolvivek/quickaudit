// Typography.js - QuickAudit App Typography Theme
// Based on the style guide with system fonts (San Francisco on iOS, Roboto on Android)

import { Platform } from 'react-native';

// Default font family based on platform
const DEFAULT_FONT_FAMILY = Platform.OS === 'ios' ? 'System' : 'Roboto';

export const TYPOGRAPHY = {
  // Font families
  FONT_FAMILY: {
    REGULAR: DEFAULT_FONT_FAMILY,
    MEDIUM: DEFAULT_FONT_FAMILY,
    SEMIBOLD: DEFAULT_FONT_FAMILY,
    BOLD: DEFAULT_FONT_FAMILY,
  },
  
  // Font weights
  FONT_WEIGHT: {
    REGULAR: '400',
    MEDIUM: '500',
    SEMIBOLD: '600',
    BOLD: '700',
  },
  
  // Font sizes
  FONT_SIZE: {
    HEADING_1: 28,
    HEADING_2: 24,
    HEADING_3: 20,
    SUBHEADING_1: 18,
    SUBHEADING_2: 16,
    BODY_1: 16,
    BODY_2: 14,
    CAPTION: 12,
    BUTTON: 16,
  },
  
  // Line heights
  LINE_HEIGHT: {
    HEADING_1: 34,
    HEADING_2: 30,
    HEADING_3: 26,
    SUBHEADING_1: 24,
    SUBHEADING_2: 22,
    BODY_1: 22,
    BODY_2: 20,
    CAPTION: 18,
    BUTTON: 22,
  },
  
  // Letter spacing
  LETTER_SPACING: {
    TIGHT: -0.5,
    NORMAL: 0,
    WIDE: 0.5,
  },
};

// Predefined text styles for easy use
export const TEXT_STYLES = {
  heading1: {
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    fontSize: TYPOGRAPHY.FONT_SIZE.HEADING_1,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.HEADING_1,
  },
  heading2: {
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    fontSize: TYPOGRAPHY.FONT_SIZE.HEADING_2,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.HEADING_2,
  },
  heading3: {
    fontFamily: TYPOGRAPHY.FONT_FAMILY.SEMIBOLD,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    fontSize: TYPOGRAPHY.FONT_SIZE.HEADING_3,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.HEADING_3,
  },
  subheading1: {
    fontFamily: TYPOGRAPHY.FONT_FAMILY.SEMIBOLD,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    fontSize: TYPOGRAPHY.FONT_SIZE.SUBHEADING_1,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.SUBHEADING_1,
  },
  subheading2: {
    fontFamily: TYPOGRAPHY.FONT_FAMILY.MEDIUM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    fontSize: TYPOGRAPHY.FONT_SIZE.SUBHEADING_2,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.SUBHEADING_2,
  },
  body1: {
    fontFamily: TYPOGRAPHY.FONT_FAMILY.REGULAR,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.REGULAR,
    fontSize: TYPOGRAPHY.FONT_SIZE.BODY_1,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.BODY_1,
  },
  body2: {
    fontFamily: TYPOGRAPHY.FONT_FAMILY.REGULAR,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.REGULAR,
    fontSize: TYPOGRAPHY.FONT_SIZE.BODY_2,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.BODY_2,
  },
  caption: {
    fontFamily: TYPOGRAPHY.FONT_FAMILY.REGULAR,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.REGULAR,
    fontSize: TYPOGRAPHY.FONT_SIZE.CAPTION,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.CAPTION,
  },
  button: {
    fontFamily: TYPOGRAPHY.FONT_FAMILY.MEDIUM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    fontSize: TYPOGRAPHY.FONT_SIZE.BUTTON,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.BUTTON,
  },
};

export default { TYPOGRAPHY, TEXT_STYLES };
