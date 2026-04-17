import React, { useCallback, useState } from 'react';
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

import { CATEGORIES, Category, Meal } from '../data/meals';
import MealCard from '../components/MealCard';
import SuggestButton from '../components/SuggestButton';
import CategoryTabs from '../components/CategoryTabs';
import Toast from '../components/Toast';
import { useFavorites } from '../hooks/useFavorites';
import { useMealSuggestion } from '../hooks/useMealSuggestion';
import { colors, spacing, typography } from '../theme';
import AppButton from '../components/ui/AppButton';
import SkeletonLoader from '../components/ui/SkeletonLoader';

interface HomeScreenProps {
  isBrokeModeDefault: boolean;
  defaultCategory: Category;
  preloadedMeal?: Meal | null;
  onPreloadConsumed?: () => void;
}

export default function HomeScreen({
  isBrokeModeDefault,
  defaultCategory,
  preloadedMeal,
  onPreloadConsumed,
}: HomeScreenProps) {
  const [isBrokeMode, setIsBrokeMode] = useState(isBrokeModeDefault);
  const [selectedCategory, setSelectedCategory] = useState<Category>(defaultCategory);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [hasSystemError, setHasSystemError] = useState(false);

  const { toggleFavorite, isFavorite } = useFavorites();

  const handleNoMeals = useCallback(() => {
    setSelectedCategory(CATEGORIES.ALL);
    setToastMessage(`No ${isBrokeMode ? 'budget ' : ''}meals in that category. Showing All instead.`);
    setToastVisible(true);
  }, [isBrokeMode]);

  const { currentMeal, setCurrentMeal, suggestMeal } =
    useMealSuggestion(isBrokeMode, selectedCategory, handleNoMeals);

  // Accept a pre-loaded meal from Favourites tab (e.g. "Use meal" or "Suggest from favourites")
  React.useEffect(() => {
    if (preloadedMeal) {
      setCurrentMeal(preloadedMeal);
      onPreloadConsumed?.();
    }
  }, [preloadedMeal, setCurrentMeal, onPreloadConsumed]);

  const runSuggestion = useCallback(async () => {
    setHasSystemError(false);
    setIsLoadingSuggestion(true);

    await new Promise((resolve) => setTimeout(resolve, 280));

    const shouldFail = Math.random() < 0.07;
    if (shouldFail) {
      setHasSystemError(true);
      setIsLoadingSuggestion(false);
      return;
    }

    suggestMeal();
    setIsLoadingSuggestion(false);
  }, [suggestMeal]);

  const handleSuggest = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await runSuggestion();
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={styles.appName}>hungr</Text>
              <Text style={styles.headerSubtitle}>Fast, low-friction meal decisions</Text>
            </View>
          </View>

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
                    onRetry={runSuggestion}
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
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  },
  appName: {
    ...typography.scale.h1,
    color: colors.ctaBackground,
  },
  headerSubtitle: {
    ...typography.scale.body,
    color: colors.textSecondary,
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
});
