import { useState, useEffect, useCallback } from 'react';
import { Meal } from '../data/meals';
import { loadFavoritesFromStorage, saveFavoritesToStorage } from '../utils/storage';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Meal[]>([]);

  useEffect(() => {
    loadFavoritesFromStorage<Meal>().then(setFavorites);
  }, []);

  const toggleFavorite = useCallback(
    async (meal: Meal) => {
      const isFav = favorites.some((f) => f.id === meal.id);
      const updated = isFav
        ? favorites.filter((f) => f.id !== meal.id)
        : [...favorites, meal];
      setFavorites(updated);
      await saveFavoritesToStorage(updated);
    },
    [favorites],
  );

  const removeFavorite = useCallback(
    async (meal: Meal) => {
      const updated = favorites.filter((f) => f.id !== meal.id);
      setFavorites(updated);
      await saveFavoritesToStorage(updated);
    },
    [favorites],
  );

  const isFavorite = useCallback(
    (meal: Meal | null): boolean => {
      if (!meal) return false;
      return favorites.some((f) => f.id === meal.id);
    },
    [favorites],
  );

  return { favorites, toggleFavorite, removeFavorite, isFavorite };
}
