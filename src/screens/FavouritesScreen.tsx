import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { Meal } from '../data/meals';
import { useFavorites } from '../hooks/useFavorites';
import { colors, radii, spacing, typography } from '../theme';
import AppButton from '../components/ui/AppButton';
import EmptyState from '../components/ui/EmptyState';
import InputField from '../components/ui/InputField';

interface FavouritesScreenProps {
  onNavigateToSuggest: (meal?: Meal) => void;
}

export default function FavouritesScreen({ onNavigateToSuggest }: FavouritesScreenProps) {
  const [search, setSearch] = useState('');
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);

  const { favorites, removeFavorite } = useFavorites();

  const searchError = search.length === 1 ? 'Enter at least 2 letters to search.' : undefined;

  const filtered = useMemo(() => {
    if (search.length < 2) return favorites;
    return favorites.filter((m) => m.name.toLowerCase().includes(search.trim().toLowerCase()));
  }, [search, favorites]);

  const handleSuggestFromFavourites = useCallback(async () => {
    if (favorites.length === 0) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoadingSuggestion(true);
    await new Promise((resolve) => setTimeout(resolve, 280));
    const picked = favorites[Math.floor(Math.random() * favorites.length)];
    setIsLoadingSuggestion(false);
    onNavigateToSuggest(picked);
  }, [favorites, onNavigateToSuggest]);

  const handleUse = useCallback(
    (meal: Meal) => {
      onNavigateToSuggest(meal);
    },
    [onNavigateToSuggest],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Favourites</Text>
          <Text style={styles.subtitle}>Your saved meal picks</Text>
        </View>

        <InputField
          label="Search favourites"
          value={search}
          onChangeText={setSearch}
          placeholder="Search by meal name"
          error={searchError}
          onClear={() => setSearch('')}
        />

        {favorites.length === 0 ? (
          <EmptyState
            icon="🫙"
            title="No favourites yet"
            description="Save meals from the suggestion card so you can pick from them faster next time."
            ctaLabel="Go suggest a meal"
            onCtaPress={() => onNavigateToSuggest()}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No matches found"
            description={`No saved meals match "${search}". Try a different search.`}
            ctaLabel="Clear search"
            onCtaPress={() => setSearch('')}
          />
        ) : (
          <ScrollView
            style={styles.listScroll}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {filtered.map((meal) => (
              <View key={meal.id} style={styles.item}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemEmoji}>{meal.emoji}</Text>
                  <View style={styles.itemText}>
                    <Text style={styles.itemName} numberOfLines={2}>{meal.name}</Text>
                    <Text style={styles.itemCategory}>{meal.category}</Text>
                  </View>
                </View>
                <View style={styles.itemActions}>
                  <AppButton
                    label="Use meal"
                    variant="primary"
                    onPress={() => handleUse(meal)}
                    style={styles.actionBtn}
                    accessibilityLabel={`Use ${meal.name}`}
                  />
                  <AppButton
                    label="Remove"
                    variant="secondary"
                    onPress={() => removeFavorite(meal)}
                    style={styles.actionBtn}
                    accessibilityLabel={`Remove ${meal.name} from favourites`}
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {favorites.length > 0 && (
          <View style={styles.ctaWrapper}>
            <AppButton
              label="Suggest from favourites"
              onPress={handleSuggestFromFavourites}
              loading={isLoadingSuggestion}
              accessibilityLabel="Suggest a random meal from favourites"
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.screenMargin,
    gap: spacing.md,
  },
  header: {
    gap: spacing.xxs,
    paddingBottom: spacing.xs,
  },
  title: {
    ...typography.scale.h1,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.scale.body,
    color: colors.textSecondary,
  },
  listScroll: {
    flex: 1,
  },
  listContent: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  item: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.sm,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  itemEmoji: {
    fontSize: 28,
  },
  itemText: {
    flex: 1,
  },
  itemName: {
    ...typography.scale.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  itemCategory: {
    ...typography.scale.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  itemActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
  },
  ctaWrapper: {
    paddingBottom: spacing.xs,
  },
});
