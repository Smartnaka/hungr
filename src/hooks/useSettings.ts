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
    loadSettingsFromStorage<AppSettings>(DEFAULT_SETTINGS).then((loaded) => {
      setSettings(loaded);
      setIsLoaded(true);
    });
  }, []);

  const updateSettings = useCallback(async (patch: Partial<AppSettings>) => {
    const updated = { ...settings, ...patch };
    setSettings(updated);
    await saveSettingsToStorage(updated);
  }, [settings]);

  return { settings, updateSettings, isLoaded };
}
