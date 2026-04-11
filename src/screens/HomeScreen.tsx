import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  cancelAnimation,
} from 'react-native-reanimated';

import { CATEGORIES, Category, Meal } from '../data/meals';
import MealCard from '../components/MealCard';
import SuggestButton from '../components/SuggestButton';
import CategoryTabs from '../components/CategoryTabs';
import Toast from '../components/Toast';
import { useFavorites } from '../hooks/useFavorites';
import { useMealSuggestion } from '../hooks/useMealSuggestion';

export default function HomeScreen() {
  const [isBrokeMode, setIsBrokeMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>(CATEGORIES.ALL);
  const [showFavorites, setShowFavorites] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const { favorites, toggleFavorite, removeFavorite, isFavorite } = useFavorites();

  const handleNoMeals = useCallback(() => {
    setSelectedCategory(CATEGORIES.ALL);
    setToastMessage(`No ${isBrokeMode ? 'broke ' : ''}meals in that category — showing All instead`);
    setToastVisible(true);
  }, [isBrokeMode]);

  const { currentMeal, setCurrentMeal, suggestMeal, suggestFromList } =
    useMealSuggestion(isBrokeMode, selectedCategory, handleNoMeals);

  const handleSuggest = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    suggestMeal();
  }, [suggestMeal]);

  const handleSuggestFromFavorites = useCallback(() => {
    suggestFromList(favorites);
    setShowFavorites(false);
  }, [suggestFromList, favorites]);

  const handleToggleFavorite = useCallback(async () => {
    if (!currentMeal) return;
    await toggleFavorite(currentMeal);
  }, [currentMeal, toggleFavorite]);

  const handleCopy = useCallback(async () => {
    if (!currentMeal) return;
    await Clipboard.setStringAsync(`${currentMeal.emoji} ${currentMeal.name}`);
    setToastMessage(`"${currentMeal.name}" copied to clipboard!`);
    setToastVisible(true);
  }, [currentMeal]);

  const handleShare = useCallback(async () => {
    if (!currentMeal) return;
    try {
      await Share.share({
        message: `I'm eating ${currentMeal.emoji} ${currentMeal.name} — decided with hungr!`,
      });
    } catch {
      // user dismissed share sheet
    }
  }, [currentMeal]);

  // Broke Mode border pulse animation
  const brokeBorderOpacity = useSharedValue(1);
  useEffect(() => {
    if (isBrokeMode) {
      brokeBorderOpacity.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 700 }),
          withTiming(1, { duration: 700 }),
        ),
        -1,
        false,
      );
    } else {
      cancelAnimation(brokeBorderOpacity);
      brokeBorderOpacity.value = withTiming(1, { duration: 200 });
    }
  }, [isBrokeMode]);

  const brokeBorderAnimStyle = useAnimatedStyle(() => ({
    borderColor: `rgba(255, 107, 53, ${brokeBorderOpacity.value})`,
  }));

  // Favorites badge pulse animation
  const prevFavCount = useRef(favorites.length);
  const badgeScale = useSharedValue(1);
  useEffect(() => {
    if (favorites.length > prevFavCount.current) {
      badgeScale.value = withSequence(
        withSpring(1.4, { damping: 6, stiffness: 300 }),
        withSpring(1, { damping: 8, stiffness: 200 }),
      );
    }
    prevFavCount.current = favorites.length;
  }, [favorites.length]);

  const badgeAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Background decorative circle */}
      <View style={styles.bgCircle} pointerEvents="none" />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>hungr</Text>
            <View style={styles.appNameUnderline} />
          </View>
          <Animated.View style={badgeAnimStyle}>
            <TouchableOpacity
              style={[styles.favoritesToggle, showFavorites && styles.favoritesToggleActive]}
              onPress={() => setShowFavorites((v) => !v)}
            >
              <Text style={[styles.favoritesToggleText, showFavorites && styles.favoritesToggleTextActive]}>
                {showFavorites ? '← Back' : `❤️ ${favorites.length}`}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {showFavorites ? (
          <>
            <FavoritesView
              favorites={favorites}
              onSelect={(meal) => {
                setCurrentMeal(meal);
                setShowFavorites(false);
              }}
              onRemove={removeFavorite}
            />
            {favorites.length > 0 && (
              <View style={styles.suggestFromFavWrapper}>
                <TouchableOpacity
                  style={styles.suggestFromFavButton}
                  onPress={handleSuggestFromFavorites}
                  activeOpacity={0.8}
                >
                  <Text style={styles.suggestFromFavText}>🎲 Suggest from Favorites</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <>
            {/* Title */}
            <Text style={styles.title}>What Should{'\n'}I Eat?</Text>

            {/* Broke Mode Toggle */}
            <Animated.View
              style={[
                styles.brokeToggle,
                isBrokeMode && styles.brokeToggleActive,
                isBrokeMode && brokeBorderAnimStyle,
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  setIsBrokeMode((v) => !v);
                  setCurrentMeal(null);
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.brokeToggleText, isBrokeMode && styles.brokeToggleTextActive]}>
                  {isBrokeMode ? '💀 Broke Mode ON' : "💀 I'm Broke Mode"}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Category Tabs */}
            <View style={styles.tabsWrapper}>
              <CategoryTabs
                selected={selectedCategory}
                onSelect={(cat) => {
                  setSelectedCategory(cat);
                  setCurrentMeal(null);
                }}
                isBrokeMode={isBrokeMode}
              />
            </View>

            {/* Toast */}
            <Toast
              message={toastMessage}
              visible={toastVisible}
              onHide={() => setToastVisible(false)}
            />

            {/* Meal Card */}
            <View style={styles.cardWrapper}>
              <MealCard
                key={currentMeal?.id ?? 'empty'}
                meal={currentMeal}
                isFavorite={isFavorite(currentMeal)}
                onToggleFavorite={handleToggleFavorite}
              />
            </View>

            {/* Action buttons (Copy / Share) */}
            {currentMeal && (
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionBtn} onPress={handleCopy}>
                  <Text style={styles.actionBtnText}>📋 Copy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
                  <Text style={styles.actionBtnText}>🔗 Share</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Suggest Button */}
            <View style={styles.buttonWrapper}>
              <SuggestButton onPress={handleSuggest} isBroke={isBrokeMode} />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

interface FavoritesViewProps {
  favorites: Meal[];
  onSelect: (meal: Meal) => void;
  onRemove: (meal: Meal) => void;
}

function FavoritesView({ favorites, onSelect, onRemove }: FavoritesViewProps) {
  if (favorites.length === 0) {
    return (
      <View style={styles.emptyFavorites}>
        <Text style={styles.emptyFavoritesEmoji}>🫙</Text>
        <Text style={styles.emptyFavoritesText}>Nothing here yet — {'\n'}tap ❤️ on a meal to save it</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.favoritesList} contentContainerStyle={styles.favoritesListContent}>
      <Text style={styles.favoritesTitle}>Your Favorites</Text>
      {favorites.map((meal) => (
        <Swipeable
          key={meal.id}
          renderRightActions={() => (
            <TouchableOpacity
              style={styles.swipeDeleteAction}
              onPress={() => onRemove(meal)}
            >
              <Text style={styles.swipeDeleteText}>🗑️ Remove</Text>
            </TouchableOpacity>
          )}
          overshootRight={false}
        >
          <View style={styles.favoriteItem}>
            <TouchableOpacity style={styles.favoriteItemInfo} onPress={() => onSelect(meal)}>
              <Text style={styles.favoriteItemEmoji}>{meal.emoji}</Text>
              <View>
                <Text style={styles.favoriteItemName}>{meal.name}</Text>
                <Text style={styles.favoriteItemCategory}>{meal.category}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onRemove(meal)} style={styles.favoriteRemove}>
              <Text style={styles.favoriteRemoveText}>✕</Text>
            </TouchableOpacity>
          </View>
        </Swipeable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8F5',
  },
  bgCircle: {
    position: 'absolute',
    top: -120,
    right: -120,
    width: 400,
    height: 400,
    borderRadius: 999,
    backgroundColor: '#FF6B35',
    opacity: 0.06,
  },
  container: {
    flex: 1,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FF6B35',
    letterSpacing: -1,
  },
  appNameUnderline: {
    height: 3,
    backgroundColor: '#FF6B35',
    borderRadius: 2,
    marginTop: 2,
    width: '60%',
  },
  favoritesToggle: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#FFE8DE',
  },
  favoritesToggleActive: {
    backgroundColor: '#FF6B35',
  },
  favoritesToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },
  favoritesToggleTextActive: {
    color: '#FFFFFF',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1A1A2E',
    paddingHorizontal: 24,
    lineHeight: 44,
    marginBottom: 16,
  },
  brokeToggle: {
    alignSelf: 'flex-start',
    marginHorizontal: 24,
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  brokeToggleActive: {
    backgroundColor: '#2D2D2D',
    borderColor: '#FF6B35',
  },
  brokeToggleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#444',
  },
  brokeToggleTextActive: {
    color: '#FFFFFF',
  },
  tabsWrapper: {
    marginBottom: 12,
  },
  cardWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 8,
  },
  actionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  buttonWrapper: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
  },
  // Favorites styles
  emptyFavorites: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyFavoritesEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyFavoritesText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    lineHeight: 28,
  },
  favoritesList: {
    flex: 1,
  },
  favoritesListContent: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  favoritesTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 16,
    marginTop: 8,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  favoriteItemInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  favoriteItemEmoji: {
    fontSize: 32,
  },
  favoriteItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  favoriteItemCategory: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  favoriteRemove: {
    padding: 8,
  },
  favoriteRemoveText: {
    fontSize: 16,
    color: '#CCC',
    fontWeight: '600',
  },
  swipeDeleteAction: {
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 16,
  },
  swipeDeleteText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  suggestFromFavWrapper: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 8,
  },
  suggestFromFavButton: {
    borderWidth: 2,
    borderColor: '#FF6B35',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  suggestFromFavText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B35',
  },
});
