import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import AppButton from './AppButton';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  ctaLabel?: string;
  onCtaPress?: () => void;
}

export default function EmptyState({ icon, title, description, ctaLabel, onCtaPress }: EmptyStateProps) {
  return (
    <View style={styles.container} accessibilityRole="summary">
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {ctaLabel && onCtaPress ? <AppButton label={ctaLabel} onPress={onCtaPress} style={styles.cta} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['4xl'],
    gap: spacing.sm,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    ...typography.scale.h3,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    ...typography.scale.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  cta: {
    marginTop: spacing.md,
    width: '100%',
  },
});
