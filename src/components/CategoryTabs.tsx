import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { CATEGORIES, Category, Meal } from '../data/meals';
import meals from '../data/meals';

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
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {TABS.map((tab) => {
        const isActive = tab === selected;
        const count = getMealCount(tab, isBrokeMode);
        return (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onSelect(tab)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab}
            </Text>
            <View style={[styles.badge, isActive && styles.activeBadge]}>
              <Text style={[styles.badgeText, isActive && styles.activeBadgeText]}>
                {count}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  activeTab: {
    backgroundColor: '#FF6B35',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  badge: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 20,
    alignItems: 'center',
  },
  activeBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
  },
  activeBadgeText: {
    color: '#FFFFFF',
  },
});
