import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@hungr_favorites';
const SETTINGS_KEY = '@hungr_settings';

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

export async function loadSettingsFromStorage<T extends object>(defaults: T): Promise<T> {
  try {
    const stored = await AsyncStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return { ...defaults, ...(JSON.parse(stored) as Partial<T>) };
    }
  } catch {
    // silently ignore storage errors
  }
  return defaults;
}

export async function saveSettingsToStorage<T extends object>(settings: T): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // silently ignore storage errors
  }
}
