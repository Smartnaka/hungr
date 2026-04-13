import { colors, palette } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { shadows } from './shadows';

export const radii = {
  // Section 7.2: consistent modern radius across controls.
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 24,
};

export const componentSizes = {
  // Section 7.2: mobile button height sweet spot 48-56.
  buttonHeight: 52,
  // Section 8.1 + 17.1: form fields sized for touch and readability.
  inputHeight: 52,
  // Section 11: card radius/style consistency.
  cardRadius: radii.lg,
  // Section 15.2: tab bar height token.
  tabBarHeight: 72,
  // Section 17.1: minimum touch target.
  minTouchTarget: 44,
};

export const theme = {
  colors,
  palette,
  spacing,
  typography,
  shadows,
  radii,
  componentSizes,
};

export type Theme = typeof theme;

export * from './colors';
export * from './spacing';
export * from './typography';
export * from './shadows';
