import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Meal } from '../data/meals';
import { colors, spacing, typography } from '../theme';
import AppCard from './ui/AppCard';
import IconButton from './ui/IconButton';
import EmptyState from './ui/EmptyState';

interface MealCardProps {
  meal: Meal | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRetry?: () => void;
  hasSystemError?: boolean;
}

export default function MealCard({ meal, isFavorite, onToggleFavorite, onRetry, hasSystemError }: MealCardProps) {
  if (hasSystemError) {
    return (
      <AppCard>
        <EmptyState
          icon="📡"
          title="We couldn't load a suggestion"
          description="Something went wrong. Try again to reload your meal options."
          ctaLabel="Try again"
          onCtaPress={onRetry}
        />
      </AppCard>
    );
  }

  if (!meal) {
    return (
      <AppCard>
        <EmptyState
          icon="🍽️"
          title="No meal selected yet"
          description="Tap suggest meal to get a recommendation based on your filters."
        />
      </AppCard>
    );
  }

  return (
    <AppCard>
      <View style={styles.content}>
        <Text style={styles.emoji}>{meal.emoji}</Text>
        <Text style={styles.mealName} numberOfLines={2}>{meal.name}</Text>
        <Text style={styles.category}>{meal.category}</Text>
        <IconButton
          accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          onPress={onToggleFavorite}
          style={styles.favoriteButton}
          icon={
            <>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={isFavorite ? colors.errorText : colors.textSecondary}
              />
              <Text style={styles.favoriteLabel}>{isFavorite ? 'Saved' : 'Save'}</Text>
            </>
          }
        />
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  emoji: {
    fontSize: 72,
  },
  mealName: {
    ...typography.scale.h2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  category: {
    ...typography.scale.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  favoriteButton: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    gap: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: spacing.md,
  },
  favoriteLabel: {
    ...typography.scale.body,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
