import { useState, useCallback } from 'react';
import meals, { Category, CATEGORIES, Meal } from '../data/meals';

function getRandomMeal(pool: Meal[]): Meal | null {
  if (!pool || pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function useMealSuggestion(
  isBrokeMode: boolean,
  selectedCategory: Category,
  onNoMeals?: () => void,
) {
  const [currentMeal, setCurrentMeal] = useState<Meal | null>(null);

  const getMealPool = useCallback(
    (category: Category = selectedCategory): Meal[] => {
      let pool = meals;
      if (isBrokeMode) {
        pool = pool.filter((m) => m.isBroke);
      }
      if (category !== CATEGORIES.ALL) {
        pool = pool.filter((m) => m.category === category);
      }
      return pool;
    },
    [isBrokeMode, selectedCategory],
  );

  const suggestMeal = useCallback(() => {
    const pool = getMealPool();
    if (pool.length === 0) {
      onNoMeals?.();
      return;
    }
    // avoid repeating the same meal if there are alternatives
    if (pool.length > 1 && currentMeal) {
      const filtered = pool.filter((m) => m.id !== currentMeal.id);
      setCurrentMeal(getRandomMeal(filtered));
    } else {
      setCurrentMeal(getRandomMeal(pool));
    }
  }, [getMealPool, currentMeal, onNoMeals]);

  const suggestFromList = useCallback(
    (list: Meal[]) => {
      if (list.length === 0) return;
      if (list.length > 1 && currentMeal) {
        const filtered = list.filter((m) => m.id !== currentMeal.id);
        setCurrentMeal(getRandomMeal(filtered.length > 0 ? filtered : list));
      } else {
        setCurrentMeal(getRandomMeal(list));
      }
    },
    [currentMeal],
  );

  return { currentMeal, setCurrentMeal, suggestMeal, suggestFromList, getMealPool };
}
