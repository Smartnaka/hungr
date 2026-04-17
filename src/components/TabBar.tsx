import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, componentSizes, spacing, typography } from '../theme';

export type TabName = 'suggest' | 'favourites' | 'settings';

interface Tab {
  name: TabName;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconActive: React.ComponentProps<typeof Ionicons>['name'];
}

const TABS: Tab[] = [
  { name: 'suggest', label: 'Suggest', icon: 'restaurant-outline', iconActive: 'restaurant' },
  { name: 'favourites', label: 'Favourites', icon: 'heart-outline', iconActive: 'heart' },
  { name: 'settings', label: 'Settings', icon: 'settings-outline', iconActive: 'settings' },
];

interface TabBarProps {
  active: TabName;
  onPress: (tab: TabName) => void;
  favouriteCount: number;
}

export default function TabBar({ active, onPress, favouriteCount }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      {TABS.map((tab) => {
        const isActive = tab.name === active;
        return (
          <Pressable
            key={tab.name}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: isActive }}
            onPress={() => onPress(tab.name)}
            android_ripple={{ color: 'rgba(31,31,31,0.08)', borderless: true }}
            style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
          >
            <View style={styles.iconWrapper}>
              <Ionicons
                name={isActive ? tab.iconActive : tab.icon}
                size={22}
                color={isActive ? colors.ctaBackground : colors.textMuted}
              />
              {tab.name === 'favourites' && favouriteCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{favouriteCount > 99 ? '99+' : favouriteCount}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: componentSizes.tabBarHeight + spacing.sm,
    paddingTop: spacing.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
    minHeight: componentSizes.minTouchTarget,
  },
  pressed: {
    opacity: 0.7,
  },
  iconWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.ctaBackground,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    ...typography.scale.micro,
    color: colors.textInverse,
    fontWeight: '700',
  },
  label: {
    ...typography.scale.micro,
    color: colors.textMuted,
    fontWeight: '600',
  },
  labelActive: {
    color: colors.ctaBackground,
  },
});
