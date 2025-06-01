/**
 * QuickAudit color palette based on the UI Style Guide
 * Following Apple design principles and shadcn components
 */

// Base colors
const PRIMARY = '#3333FF';      // Dark blue for headers and primary buttons
const SECONDARY = '#FFFFFF';    // White for backgrounds and containers
const ACCENT = '#00C853';       // Green for highlights and action buttons
const BACKGROUND = '#F0F2F5';   // Light gray background
const SURFACE = '#FFFFFF';      // White for cards and content areas

// Text colors
const TEXT_PRIMARY = '#1A202C';  // Dark gray/black for primary text
const TEXT_SECONDARY = '#757575'; // Medium gray for secondary text

// Status colors
const STATUS_IN_PROGRESS = '#3498DB'; // Blue
const STATUS_COMPLETED = '#00C853';   // Green
const STATUS_DRAFT = '#9E9E9E';       // Gray
const STATUS_FAILED = '#FF3B30';      // Red

// UI colors
const BORDER = '#E0E0E0';      // Light gray for borders
const ERROR = '#FF3B30';       // Red for errors
const WARNING = '#FFC107';     // Amber for warnings
const INFO = '#2196F3';        // Info color
const SUCCESS = '#00C853';     // Success color

export const Colors = {
  light: {
    primary: PRIMARY,
    secondary: SECONDARY,
    accent: ACCENT,
    background: BACKGROUND,
    surface: SURFACE,
    text: TEXT_PRIMARY,
    textSecondary: TEXT_SECONDARY,
    border: BORDER,
    error: ERROR,
    warning: WARNING,
    info: INFO,
    success: SUCCESS,
    statusInProgress: STATUS_IN_PROGRESS,
    statusCompleted: STATUS_COMPLETED,
    statusDraft: STATUS_DRAFT,
    statusFailed: STATUS_FAILED,
    icon: TEXT_SECONDARY,
    tabIconDefault: TEXT_SECONDARY,
    tabIconSelected: PRIMARY,
  },
  dark: {
    primary: PRIMARY,
    secondary: '#1A1A1A',       // Dark surface for dark mode
    accent: ACCENT,
    background: '#121212',       // Dark background
    surface: '#1E1E1E',          // Dark surface
    text: '#FFFFFF',             // White text
    textSecondary: '#BBBBBB',    // Light gray text
    border: '#333333',           // Dark borders
    error: '#FF453A',            // Bright red for errors
    warning: '#FFD60A',          // Bright yellow for warnings
    info: '#64B5F6',             // Light blue for info
    success: '#4CAF50',          // Green for success
    statusInProgress: '#3498DB', // Same status colors
    statusCompleted: '#00C853',
    statusDraft: '#9E9E9E',
    statusFailed: '#FF3B30',
    icon: '#BBBBBB',
    tabIconDefault: '#BBBBBB',
    tabIconSelected: PRIMARY,
  },
};
