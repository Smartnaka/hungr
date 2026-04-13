import { palette } from './colors';

export const shadows = {
  // Section 6.2: soft shadows with low opacity and non-black color.
  sm: {
    shadowColor: palette.gray700,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  md: {
    shadowColor: palette.gray700,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  lg: {
    shadowColor: palette.gray700,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.1,
    shadowRadius: 28,
    elevation: 8,
  },
};
