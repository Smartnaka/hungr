import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';

import meals, { CATEGORIES, Category, Meal } from '../data/meals';
import MealCard from '../components/MealCard';
import SuggestButton from '../components/SuggestButton';
import CategoryTabs from '../components/CategoryTabs';

const FAVORITES_KEY = '@hungr_favorites';

function getRandomMeal(pool: Meal[]): Meal | null {
  if (!pool || pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function HomeScreen() {
  const [currentMeal, setCurrentMeal] = useState<Meal | null>(null);
  const [isBrokeMode, setIsBrokeMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>(CATEGORIES.ALL);
  const [favorites, setFavorites] = useState<Meal[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored) as Meal[]);
      }
    } catch {
      // silently ignore storage errors
    }
  };

  const saveFavorites = async (updated: Meal[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } catch {
      // silently ignore storage errors
    }
  };

  const getMealPool = useCallback((): Meal[] => {
    let pool = meals;
    if (isBrokeMode) {
      pool = pool.filter((m) => m.isBroke);
    }
    if (selectedCategory !== CATEGORIES.ALL) {
      pool = pool.filter((m) => m.category === selectedCategory);
    }
    return pool;
  }, [isBrokeMode, selectedCategory]);

  const handleSuggest = useCallback(() => {
    const pool = getMealPool();
    if (pool.length === 0) {
      Alert.alert('No meals found', 'Try changing the filters to see more options.');
      return;
    }
    // avoid repeating the same meal if there are alternatives
    if (pool.length > 1 && currentMeal) {
      const filtered = pool.filter((m) => m.id !== currentMeal.id);
      setCurrentMeal(getRandomMeal(filtered));
    } else {
      setCurrentMeal(getRandomMeal(pool));
    }
  }, [getMealPool, currentMeal]);

  const isFavorite = currentMeal
    ? favorites.some((f) => f.id === currentMeal.id)
    : false;

  const handleToggleFavorite = useCallback(async () => {
    if (!currentMeal) return;
    let updated: Meal[];
    if (isFavorite) {
      updated = favorites.filter((f) => f.id !== currentMeal.id);
    } else {
      updated = [...favorites, currentMeal];
    }
    setFavorites(updated);
    await saveFavorites(updated);
  }, [currentMeal, favorites, isFavorite]);

  const handleCopy = useCallback(async () => {
    if (!currentMeal) return;
    await Clipboard.setStringAsync(`${currentMeal.emoji} ${currentMeal.name}`);
    Alert.alert('Copied!', `"${currentMeal.name}" copied to clipboard.`);
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>hungr</Text>
          <TouchableOpacity
            style={[styles.favoritesToggle, showFavorites && styles.favoritesToggleActive]}
            onPress={() => setShowFavorites((v) => !v)}
          >
            <Text style={[styles.favoritesToggleText, showFavorites && styles.favoritesToggleTextActive]}>
              {showFavorites ? '← Back' : `❤️ ${favorites.length}`}
            </Text>
          </TouchableOpacity>
        </View>

        {showFavorites ? (
          <FavoritesView
            favorites={favorites}
            onSelect={(meal) => {
              setCurrentMeal(meal);
              setShowFavorites(false);
            }}
            onRemove={async (meal) => {
              const updated = favorites.filter((f) => f.id !== meal.id);
              setFavorites(updated);
              await saveFavorites(updated);
            }}
          />
        ) : (
          <>
            {/* Title */}
            <Text style={styles.title}>What Should{'\n'}I Eat?</Text>

            {/* Broke Mode Toggle */}
            <TouchableOpacity
              style={[styles.brokeToggle, isBrokeMode && styles.brokeToggleActive]}
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

            {/* Category Tabs */}
            <View style={styles.tabsWrapper}>
              <CategoryTabs
                selected={selectedCategory}
                onSelect={(cat) => {
                  setSelectedCategory(cat);
                  setCurrentMeal(null);
                }}
              />
            </View>

            {/* Meal Card */}
            <View style={styles.cardWrapper}>
              <MealCard
                meal={currentMeal}
                isFavorite={isFavorite}
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
        <Text style={styles.emptyFavoritesEmoji}>🤍</Text>
        <Text style={styles.emptyFavoritesText}>No favorites yet.{'\n'}Save a meal to see it here!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.favoritesList} contentContainerStyle={styles.favoritesListContent}>
      <Text style={styles.favoritesTitle}>Your Favorites</Text>
      {favorites.map((meal) => (
        <View key={meal.id} style={styles.favoriteItem}>
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
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8F5',
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
    fontSize: 22,
    fontWeight: '800',
    color: '#FF6B35',
    letterSpacing: -0.5,
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
    marginBottom: 20,
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
    paddingBottom: 24,
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
});
