import { MD3LightTheme } from 'react-native-paper';

// Web app-inspired theme for QuickAudit mobile app
export const webAppTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4CAF50',
    primaryContainer: '#E8F5E9',
    secondary: '#FF5722',
    secondaryContainer: '#FBE9E7',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    error: '#F44336',
    success: '#4CAF50',
    warning: '#FFC107',
    info: '#2196F3',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: '#333333',
    onSurface: '#333333',
    elevation: {
      level0: 'transparent',
      level1: '#FFFFFF',
      level2: '#F5F5F5',
      level3: '#EEEEEE',
      level4: '#E0E0E0',
      level5: '#D6D6D6',
    },
  },
  fonts: {
    ...MD3LightTheme.fonts,
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
  },
  roundness: 8,
  animation: {
    scale: 1.0,
  },
};

// Typography styles from web app
export const typography = {
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  subheader: {
    fontSize: 18,
    fontWeight: '500',
    color: '#555555',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555555',
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    color: '#757575',
  },
  button: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
};

// Card styles from web app
export const cardStyles = {
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  content: {
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
};

// Button styles from web app
export const buttonStyles = {
  primary: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  secondaryText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '500',
  },
  textButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '500',
  },
};

// Form styles from web app
export const formStyles = {
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555555',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333333',
  },
  inputFocused: {
    borderColor: '#4CAF50',
  },
  error: {
    fontSize: 12,
    color: '#F44336',
    marginTop: 4,
  },
  helper: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
};

// Dashboard card styles from web app
export const dashboardCardStyles = {
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
};

// Export all styles
export default {
  webAppTheme,
  typography,
  cardStyles,
  buttonStyles,
  formStyles,
  dashboardCardStyles,
};
