import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@hungr_favorites';

export async function loadFavoritesFromStorage<T>(): Promise<T[]> {
  try {
    const stored = await AsyncStorage.getItem(FAVORITES_KEY);
    if (stored) {
      return JSON.parse(stored) as T[];
    }
  } catch {
    // silently ignore storage errors
  }
  return [];
}

export async function saveFavoritesToStorage<T>(items: T[]): Promise<void> {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
  } catch {
    // silently ignore storage errors
  }
}
