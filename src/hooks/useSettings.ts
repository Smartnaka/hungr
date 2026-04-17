import { useState, useEffect, useCallback } from 'react';
import { CATEGORIES, Category } from '../data/meals';
import { loadSettingsFromStorage, saveSettingsToStorage } from '../utils/storage';

export interface AppSettings {
  isBrokeModeDefault: boolean;
  defaultCategory: Category;
}

const DEFAULT_SETTINGS: AppSettings = {
  isBrokeModeDefault: false,
  defaultCategory: CATEGORIES.ALL,
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let settled = false;

    // 1500 ms is enough time for AsyncStorage to respond on any device, while still
    // being shorter than the 1.8 s splash animation — so users never see a blank screen.
    const timeout = setTimeout(() => {
      if (!settled) {
        // Fall back to defaults if storage takes too long
        settled = true;
        setIsLoaded(true);
      }
    }, 1500);

    loadSettingsFromStorage<AppSettings>(DEFAULT_SETTINGS).then((loaded) => {
      if (!settled) {
        settled = true;
        clearTimeout(timeout);
        setSettings(loaded);
        setIsLoaded(true);
      }
    });

    return () => clearTimeout(timeout);
  }, []);

  const updateSettings = useCallback(async (patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...patch };
      void saveSettingsToStorage(updated);
      return updated;
    });
  }, []);

  return { settings, updateSettings, isLoaded };
}
