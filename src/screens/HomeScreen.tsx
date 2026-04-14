import React, { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { CATEGORIES, Category, Meal } from '../data/meals';
import MealCard from '../components/MealCard';
import SuggestButton from '../components/SuggestButton';
import CategoryTabs from '../components/CategoryTabs';
import Toast from '../components/Toast';
import { useFavorites } from '../hooks/useFavorites';
import { useMealSuggestion } from '../hooks/useMealSuggestion';
import { colors, radii, spacing, typography } from '../theme';
import AppButton from '../components/ui/AppButton';
import EmptyState from '../components/ui/EmptyState';
import InputField from '../components/ui/InputField';
import SkeletonLoader from '../components/ui/SkeletonLoader';

export default function HomeScreen() {
  const [isBrokeMode, setIsBrokeMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>(CATEGORIES.ALL);
  const [showFavorites, setShowFavorites] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [hasSystemError, setHasSystemError] = useState(false);
  const [favoriteSearch, setFavoriteSearch] = useState('');

  const { favorites, toggleFavorite, removeFavorite, isFavorite } = useFavorites();

  const handleNoMeals = useCallback(() => {
    setSelectedCategory(CATEGORIES.ALL);
    setToastMessage(`No ${isBrokeMode ? 'budget ' : ''}meals in that category. Showing All instead.`);
    setToastVisible(true);
  }, [isBrokeMode]);

  const { currentMeal, setCurrentMeal, suggestMeal, suggestFromList } =
    useMealSuggestion(isBrokeMode, selectedCategory, handleNoMeals);

  const runSuggestion = useCallback(async (source: 'all' | 'favorites') => {
    setHasSystemError(false);
    setIsLoadingSuggestion(true);

    await new Promise((resolve) => setTimeout(resolve, 280));

    const shouldFail = Math.random() < 0.07;
    if (shouldFail) {
      setHasSystemError(true);
      setIsLoadingSuggestion(false);
      return;
    }

    if (source === 'favorites') {
      suggestFromList(favorites);
      setShowFavorites(false);
    } else {
      suggestMeal();
    }

    setIsLoadingSuggestion(false);
  }, [favorites, suggestFromList, suggestMeal]);

  const handleSuggest = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await runSuggestion('all');
  }, [runSuggestion]);

  const handleToggleFavorite = useCallback(async () => {
    if (!currentMeal) return;
    await toggleFavorite(currentMeal);
  }, [currentMeal, toggleFavorite]);

  const handleCopy = useCallback(async () => {
    if (!currentMeal) return;
    await Clipboard.setStringAsync(`${currentMeal.emoji} ${currentMeal.name}`);
    setToastMessage(`Copied ${currentMeal.name}.`);
    setToastVisible(true);
  }, [currentMeal]);

  const handleShare = useCallback(async () => {
    if (!currentMeal) return;
    try {
      await Share.share({ message: `I'm eating ${currentMeal.emoji} ${currentMeal.name} — picked in hungr.` });
    } catch {
      // Share sheet dismissed
    }
  }, [currentMeal]);

  const favoriteSearchError = favoriteSearch.length === 1 ? 'Enter at least 2 letters to search.' : undefined;

  const filteredFavorites = useMemo(() => {
    if (favoriteSearch.length < 2) return favorites;
    return favorites.filter((meal) => meal.name.toLowerCase().includes(favoriteSearch.trim().toLowerCase()));
  }, [favoriteSearch, favorites]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={styles.appName}>hungr</Text>
              <Text style={styles.headerSubtitle}>Fast, low-friction meal decisions</Text>
            </View>
            <AppButton
              label={showFavorites ? 'Back to Suggest' : `Favorites (${favorites.length})`}
              variant="secondary"
              onPress={() => setShowFavorites((value) => !value)}
              style={styles.favoriteToggleBtn}
            />
          </View>

          {showFavorites ? (
            <FavoritesView
              favorites={filteredFavorites}
              searchValue={favoriteSearch}
              searchError={favoriteSearchError}
              onSearchChange={setFavoriteSearch}
              onClearSearch={() => setFavoriteSearch('')}
              onSelect={(meal) => {
                setCurrentMeal(meal);
                setShowFavorites(false);
              }}
              onRemove={removeFavorite}
              onSuggestFromFavorites={() => runSuggestion('favorites')}
              isLoadingSuggestion={isLoadingSuggestion}
              onExitFavorites={() => setShowFavorites(false)}
            />
          ) : (
            <View style={styles.contentArea}>
              <ScrollView
                contentContainerStyle={styles.mainScrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.title}>What should I eat today?</Text>

                <View style={styles.modeRow}>
                  <AppButton
                    label={isBrokeMode ? 'Budget mode on' : 'Turn on budget mode'}
                    variant={isBrokeMode ? 'primary' : 'secondary'}
                    onPress={() => {
                      setIsBrokeMode((value) => !value);
                      setCurrentMeal(null);
                    }}
                    style={styles.modeButton}
                  />
                </View>

                <CategoryTabs
                  selected={selectedCategory}
                  onSelect={(category) => {
                    setSelectedCategory(category);
                    setCurrentMeal(null);
                  }}
                  isBrokeMode={isBrokeMode}
                />

                <Toast message={toastMessage} visible={toastVisible} onHide={() => setToastVisible(false)} />

                <View style={styles.cardWrapper}>
                  {isLoadingSuggestion ? (
                    <SkeletonLoader />
                  ) : (
                    <MealCard
                      meal={currentMeal}
                      isFavorite={isFavorite(currentMeal)}
                      onToggleFavorite={handleToggleFavorite}
                      hasSystemError={hasSystemError}
                      onRetry={() => runSuggestion('all')}
                    />
                  )}
                </View>

                {currentMeal && (
                  <View style={styles.actionRow}>
                    <AppButton label="Copy meal" variant="secondary" onPress={handleCopy} style={styles.halfButton} />
                    <AppButton label="Share meal" variant="secondary" onPress={handleShare} style={styles.halfButton} />
                  </View>
                )}
              </ScrollView>

              <View style={styles.buttonWrapper}>
                <SuggestButton onPress={handleSuggest} isBroke={isBrokeMode} loading={isLoadingSuggestion} />
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface FavoritesViewProps {
  favorites: Meal[];
  searchValue: string;
  searchError?: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onSelect: (meal: Meal) => void;
  onRemove: (meal: Meal) => void;
  onSuggestFromFavorites: () => void;
  isLoadingSuggestion: boolean;
  onExitFavorites: () => void;
}

function FavoritesView({
  favorites,
  searchValue,
  searchError,
  onSearchChange,
  onClearSearch,
  onSelect,
  onRemove,
  onSuggestFromFavorites,
  isLoadingSuggestion,
  onExitFavorites,
}: FavoritesViewProps) {
  return (
    <View style={styles.favoritesWrapper}>
      <InputField
        label="Search favorites"
        value={searchValue}
        onChangeText={onSearchChange}
        placeholder="Search by meal name"
        error={searchError}
        onClear={onClearSearch}
      />

      {favorites.length === 0 ? (
        <EmptyState
          icon="🫙"
          title="No favorites yet"
          description="Save meals from the suggestion card so you can pick from them faster next time."
          ctaLabel="Go suggest a meal"
          onCtaPress={onExitFavorites}
        />
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.favoritesListContent} showsVerticalScrollIndicator={false}>
            {favorites.map((meal) => (
              <View key={meal.id} style={styles.favoriteItem}>
                <View style={styles.favoriteInfo}>
                  <Text style={styles.favoriteEmoji}>{meal.emoji}</Text>
                  <View style={styles.flex}>
                    <Text style={styles.favoriteName} numberOfLines={2}>{meal.name}</Text>
                    <Text style={styles.favoriteCategory}>{meal.category}</Text>
                  </View>
                </View>
                <View style={styles.favoriteActions}>
                  <AppButton label="Use meal" variant="primary" onPress={() => onSelect(meal)} style={styles.smallBtn} />
                  <AppButton label="Remove" variant="secondary" onPress={() => onRemove(meal)} style={styles.smallBtn} />
                </View>
              </View>
            ))}
          </ScrollView>
          <AppButton
            label="Suggest from favorites"
            onPress={onSuggestFromFavorites}
            loading={isLoadingSuggestion}
            accessibilityLabel="Suggest a random meal from favorites"
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingBottom: spacing.xs,
  },
  headerCopy: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  appName: {
    ...typography.scale.h1,
    color: colors.ctaBackground,
  },
  headerSubtitle: {
    ...typography.scale.body,
    color: colors.textSecondary,
  },
  favoriteToggleBtn: {
    minWidth: 148,
    maxWidth: 176,
    flexShrink: 0,
  },
  contentArea: {
    flex: 1,
  },
  mainScrollContent: {
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    ...typography.scale.display,
    color: colors.textPrimary,
  },
  modeRow: {
    flexDirection: 'row',
  },
  modeButton: {
    width: '100%',
  },
  cardWrapper: {
    marginTop: spacing.xs,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  halfButton: {
    flex: 1,
  },
  buttonWrapper: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  favoritesWrapper: {
    flex: 1,
    gap: spacing.md,
    paddingBottom: spacing.xs,
  },
  favoritesListContent: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  favoriteItem: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.sm,
  },
  favoriteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  favoriteEmoji: {
    fontSize: 28,
  },
  favoriteName: {
    ...typography.scale.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  favoriteCategory: {
    ...typography.scale.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  favoriteActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  smallBtn: {
    flex: 1,
  },
});
