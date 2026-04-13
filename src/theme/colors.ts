export const palette = {
  // Section 5.2 (Step 1): primary brand color token.
  primary: '#E86A33',
  // Section 5.2 (Step 2): secondary hue kept subtle for supporting actions.
  secondary: '#2F6B8A',

  // Section 5.2 (Step 4): primary tints for backgrounds and low-emphasis surfaces.
  primaryTint90: '#FDF2ED',
  primaryTint80: '#FBE5DB',
  primaryTint70: '#F8D1C2',

  // Section 5.2 (Step 5): primary shades for pressed states and accents.
  primaryShade10: '#CC5C2C',
  primaryShade20: '#A84A24',

  // Section 5.2 (Step 6) + Section 5.3: grayscale, no pure black.
  gray900: '#1F1F1F',
  gray800: '#2E3440',
  gray700: '#4A5563',
  gray600: '#647183',
  gray500: '#8A95A6',
  gray400: '#B5BECA',
  gray300: '#D7DEE8',
  gray200: '#E8EDF3',
  gray100: '#F4F7FA',
  white: '#FFFFFF',

  // Section 5.2 (Step 3): semantic notification colors.
  success: '#2D7D46',
  warning: '#B9770E',
  error: '#C0392B',
  info: '#2F6B8A',
};

export const colors = {
  // Section 2.1 figure-ground + Section 12.2: soft background keeps focus on foreground UI.
  background: palette.gray100,
  surface: palette.white,
  surfaceSubtle: palette.primaryTint90,
  border: palette.gray300,
  borderFocus: palette.primary,

  // Section 5.3: hierarchy text tokens with strong contrast.
  textPrimary: palette.gray900,
  textSecondary: palette.gray700,
  textMuted: palette.gray500,
  textInverse: palette.white,

  // Section 7.1 + 7.2: primary CTA prominence.
  ctaBackground: palette.primary,
  ctaBackgroundPressed: palette.primaryShade10,
  ctaText: palette.white,

  // Section 8.2 + 17.2: explicit semantic state tokens.
  successBackground: '#EAF6EE',
  successText: palette.success,
  warningBackground: '#FDF3E2',
  warningText: palette.warning,
  errorBackground: '#FCEBE9',
  errorText: palette.error,
  infoBackground: '#EAF2F6',
  infoText: palette.info,

  gray200: palette.gray200,
  gray800: palette.gray800,
  overlay: 'rgba(31,31,31,0.64)',
};

export type Colors = typeof colors;
