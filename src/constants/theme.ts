export const COLORS = {
  // Primary Colors
  primary: '#FF6B6B',
  primaryDark: '#EE5A52',
  primaryLight: '#FF8787',
  
  // Secondary Colors
  secondary: '#4ECDC4',
  secondaryDark: '#45B7AF',
  secondaryLight: '#6DD5CD',
  
  // Neutral Colors
  background: '#FFFFFF',
  backgroundDark: '#F7F7F7',
  surface: '#FFFFFF',
  surfaceDark: '#F5F5F5',
  
  // Text Colors
  text: '#2D3436',
  textSecondary: '#636E72',
  textLight: '#B2BEC3',
  textInverse: '#FFFFFF',
  
  // Status Colors
  success: '#00B894',
  warning: '#FDCB6E',
  error: '#D63031',
  info: '#0984E3',
  
  // UI Colors
  border: '#DFE6E9',
  divider: '#ECF0F1',
  shadow: '#00000029',
  
  // Tag Colors
  tagEasy: '#00B894',
  tagMedium: '#FDCB6E',
  tagHard: '#D63031',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const TYPOGRAPHY = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    // Hindi and Kannada fonts will be loaded via expo-font
    devanagari: 'NotoSansDevanagari-Regular',
    kannada: 'NotoSansKannada-Regular',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

export const SCREEN_PADDING = SPACING.md;

export const UNITS = {
  metric: {
    volume: ['ml', 'l', 'cup', 'tbsp', 'tsp'],
    weight: ['g', 'kg'],
    length: ['cm', 'mm'],
  },
  imperial: {
    volume: ['fl oz', 'cup', 'tbsp', 'tsp', 'pint', 'quart', 'gallon'],
    weight: ['oz', 'lb'],
    length: ['inch'],
  },
};

export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'] as const;

export const SUPPORTED_LOCALES = ['en', 'hi', 'kn'] as const;
