/**
 * QuickAudit Typography based on the UI Style Guide
 * Following Apple design principles and shadcn components
 */

import { Platform } from 'react-native';

// Define the system font based on platform
const FONT_FAMILY = Platform.OS === 'ios' ? 'San Francisco' : 'Roboto';

// Font sizes
const SIZES = {
  h1: 28, // Main headings
  h2: 24, // Section headings
  h3: 20, // Subsection headings
  subheading: 18, // Subheadings
  body: 16, // Body text
  bodySmall: 14, // Small body text
  caption: 12, // Captions and hints
};

// Font weights
const WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

// Line heights (multiplier of font size)
const LINE_HEIGHT_MULTIPLIER = 1.5;

// Letter spacing
const LETTER_SPACING = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
};

// Text styles
export const Typography = {
  h1: {
    fontFamily: FONT_FAMILY,
    fontSize: SIZES.h1,
    fontWeight: WEIGHTS.semibold,
    lineHeight: SIZES.h1 * LINE_HEIGHT_MULTIPLIER,
    letterSpacing: LETTER_SPACING.tight,
  },
  h2: {
    fontFamily: FONT_FAMILY,
    fontSize: SIZES.h2,
    fontWeight: WEIGHTS.semibold,
    lineHeight: SIZES.h2 * LINE_HEIGHT_MULTIPLIER,
    letterSpacing: LETTER_SPACING.tight,
  },
  h3: {
    fontFamily: FONT_FAMILY,
    fontSize: SIZES.h3,
    fontWeight: WEIGHTS.semibold,
    lineHeight: SIZES.h3 * LINE_HEIGHT_MULTIPLIER,
    letterSpacing: LETTER_SPACING.normal,
  },
  subheading: {
    fontFamily: FONT_FAMILY,
    fontSize: SIZES.subheading,
    fontWeight: WEIGHTS.medium,
    lineHeight: SIZES.subheading * LINE_HEIGHT_MULTIPLIER,
    letterSpacing: LETTER_SPACING.normal,
  },
  body: {
    fontFamily: FONT_FAMILY,
    fontSize: SIZES.body,
    fontWeight: WEIGHTS.regular,
    lineHeight: SIZES.body * LINE_HEIGHT_MULTIPLIER,
    letterSpacing: LETTER_SPACING.normal,
  },
  bodyMedium: {
    fontFamily: FONT_FAMILY,
    fontSize: SIZES.body,
    fontWeight: WEIGHTS.medium,
    lineHeight: SIZES.body * LINE_HEIGHT_MULTIPLIER,
    letterSpacing: LETTER_SPACING.normal,
  },
  bodySmall: {
    fontFamily: FONT_FAMILY,
    fontSize: SIZES.bodySmall,
    fontWeight: WEIGHTS.regular,
    lineHeight: SIZES.bodySmall * LINE_HEIGHT_MULTIPLIER,
    letterSpacing: LETTER_SPACING.normal,
  },
  caption: {
    fontFamily: FONT_FAMILY,
    fontSize: SIZES.caption,
    fontWeight: WEIGHTS.regular,
    lineHeight: SIZES.caption * LINE_HEIGHT_MULTIPLIER,
    letterSpacing: LETTER_SPACING.normal,
  },
  button: {
    fontFamily: FONT_FAMILY,
    fontSize: SIZES.body,
    fontWeight: WEIGHTS.medium,
    letterSpacing: LETTER_SPACING.wide,
  },
  label: {
    fontFamily: FONT_FAMILY,
    fontSize: SIZES.bodySmall,
    fontWeight: WEIGHTS.medium,
    letterSpacing: LETTER_SPACING.normal,
  },
};

export default Typography;
