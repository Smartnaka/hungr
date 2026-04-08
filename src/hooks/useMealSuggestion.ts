import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import meals, { Category, CATEGORIES, Meal } from '../data/meals';

function getRandomMeal(pool: Meal[]): Meal | null {
  if (!pool || pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function useMealSuggestion(isBrokeMode: boolean, selectedCategory: Category) {
  const [currentMeal, setCurrentMeal] = useState<Meal | null>(null);

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

  const suggestMeal = useCallback(() => {
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

  return { currentMeal, setCurrentMeal, suggestMeal };
}
