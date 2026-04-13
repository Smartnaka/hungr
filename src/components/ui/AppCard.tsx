import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { colors, componentSizes, shadows, spacing } from '../../theme';

export default function AppCard({ style, ...props }: ViewProps) {
  return <View {...props} style={[styles.card, style]} />;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: componentSizes.cardRadius,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
});
