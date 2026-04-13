import React from 'react';
import { ScrollView, Text, Pressable, StyleSheet, View } from 'react-native';
import { CATEGORIES, Category, Meal } from '../data/meals';
import meals from '../data/meals';
import { colors, radii, spacing, typography } from '../theme';

const TABS = Object.values(CATEGORIES) as Category[];

interface CategoryTabsProps {
  selected: Category;
  onSelect: (category: Category) => void;
  isBrokeMode: boolean;
}

function getMealCount(tab: Category, isBrokeMode: boolean): number {
  let pool: Meal[] = meals;
  if (isBrokeMode) {
    pool = pool.filter((m) => m.isBroke);
  }
  if (tab !== CATEGORIES.ALL) {
    pool = pool.filter((m) => m.category === tab);
  }
  return pool.length;
}

export default function CategoryTabs({ selected, onSelect, isBrokeMode }: CategoryTabsProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {TABS.map((tab) => {
        const isActive = tab === selected;
        const count = getMealCount(tab, isBrokeMode);
        return (
          <Pressable
            key={tab}
            accessibilityRole="button"
            accessibilityLabel={`Filter by ${tab}`}
            onPress={() => onSelect(tab)}
            android_ripple={{ color: 'rgba(31,31,31,0.08)' }}
            style={({ pressed }) => [styles.tab, isActive && styles.activeTab, pressed && styles.pressed]}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab}</Text>
            <View style={[styles.badge, isActive && styles.activeBadge]}>
              <Text style={[styles.badgeText, isActive && styles.activeBadgeText]}>{count}</Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.screenMargin,
    gap: spacing.xs,
  },
  tab: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  activeTab: {
    backgroundColor: colors.ctaBackground,
    borderColor: colors.ctaBackground,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  tabText: {
    ...typography.scale.body,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: colors.textInverse,
  },
  badge: {
    minWidth: 24,
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  activeBadge: {
    backgroundColor: 'rgba(255,255,255,0.24)',
  },
  badgeText: {
    ...typography.scale.caption,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  activeBadgeText: {
    color: colors.textInverse,
  },
});
