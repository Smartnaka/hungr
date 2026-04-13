import { colors } from './colors';

const bodyLineHeight = (size: number) => Math.round(size * 1.6);
const headingLineHeight = (size: number) => Math.round(size * 1.25);

export const typography = {
  // Section 4.1: single sans-serif family for consistency.
  family: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  // Section 4.2: fixed type scale tokens.
  scale: {
    display: { fontSize: 32, lineHeight: headingLineHeight(32), fontWeight: '700' as const, letterSpacing: -0.6 },
    h1: { fontSize: 28, lineHeight: headingLineHeight(28), fontWeight: '700' as const, letterSpacing: -0.5 },
    h2: { fontSize: 24, lineHeight: headingLineHeight(24), fontWeight: '600' as const, letterSpacing: -0.3 },
    h3: { fontSize: 20, lineHeight: headingLineHeight(20), fontWeight: '600' as const },
    bodyLarge: { fontSize: 16, lineHeight: bodyLineHeight(16), fontWeight: '400' as const },
    body: { fontSize: 14, lineHeight: bodyLineHeight(14), fontWeight: '400' as const },
    caption: { fontSize: 12, lineHeight: bodyLineHeight(12), fontWeight: '400' as const },
    micro: { fontSize: 10, lineHeight: bodyLineHeight(10), fontWeight: '400' as const },
    button: { fontSize: 16, lineHeight: headingLineHeight(16), fontWeight: '600' as const },
  },
  // Section 4.3 + 17.2: default readable text color.
  defaults: {
    color: colors.textPrimary,
  },
};
