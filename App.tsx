import React, { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Updates from 'expo-updates';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './src/screens/HomeScreen';
import FavouritesScreen from './src/screens/FavouritesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SplashScreen from './src/screens/SplashScreen';
import TabBar, { TabName } from './src/components/TabBar';
import { useFavorites } from './src/hooks/useFavorites';
import { useSettings } from './src/hooks/useSettings';
import { colors, radii, spacing, typography } from './src/theme';
import { Meal } from './src/data/meals';

const UPDATE_APPLIED_KEY = 'updateJustApplied';
const APP_VERSION = '1.0.0';

async function checkForOtaUpdateOnLaunch() {
  if (__DEV__) {
    return;
  }

  try {
    const update = await Updates.checkForUpdateAsync();

    if (!update.isAvailable) {
      return;
    }

    Alert.alert('Update Available', 'A new app update is ready to install.', [
      {
        text: 'Later',
        style: 'cancel',
      },
      {
        text: 'Update Now',
        onPress: () => {
          void (async () => {
            try {
              await Updates.fetchUpdateAsync();
              await AsyncStorage.setItem(UPDATE_APPLIED_KEY, 'true');
              await Updates.reloadAsync();
            } catch (error) {
              console.log('OTA update fetch/reload failed:', error);
            }
          })();
        },
      },
    ]);
  } catch (error) {
    console.log('OTA update check failed:', error);
  }
}

async function detectAndClearUpdateFlag(): Promise<boolean> {
  try {
    const flag = await AsyncStorage.getItem(UPDATE_APPLIED_KEY);
    if (flag === 'true') {
      await AsyncStorage.removeItem(UPDATE_APPLIED_KEY);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [isNewUpdate, setIsNewUpdate] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<TabName>('suggest');
  const [preloadedMeal, setPreloadedMeal] = useState<Meal | null>(null);

  const { favorites } = useFavorites();
  const { settings, updateSettings, isLoaded } = useSettings();

  useEffect(() => {
    void checkForOtaUpdateOnLaunch();
    void detectAndClearUpdateFlag().then(setIsNewUpdate);
  }, []);

  useEffect(() => {
    if (splashDone && isNewUpdate) {
      setBannerVisible(true);
      const timer = setTimeout(() => setBannerVisible(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [splashDone, isNewUpdate]);

  const handleNavigateToSuggest = useCallback((meal?: Meal) => {
    if (meal) {
      setPreloadedMeal(meal);
    }
    setActiveTab('suggest');
  }, []);

  const handlePreloadConsumed = useCallback(() => {
    setPreloadedMeal(null);
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor="transparent" translucent />
        {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}

        {splashDone && isLoaded && (
          <View style={styles.appShell}>
            <View style={styles.screenArea}>
              {activeTab === 'suggest' && (
                <HomeScreen
                  isBrokeModeDefault={settings.isBrokeModeDefault}
                  defaultCategory={settings.defaultCategory}
                  preloadedMeal={preloadedMeal}
                  onPreloadConsumed={handlePreloadConsumed}
                />
              )}
              {activeTab === 'favourites' && (
                <FavouritesScreen onNavigateToSuggest={handleNavigateToSuggest} />
              )}
              {activeTab === 'settings' && (
                <SettingsScreen
                  settings={settings}
                  onUpdateSettings={updateSettings}
                  appVersion={APP_VERSION}
                />
              )}
            </View>

            <TabBar
              active={activeTab}
              onPress={setActiveTab}
              favouriteCount={favorites.length}
            />
          </View>
        )}

        {bannerVisible && (
          <View style={styles.updateBanner} accessibilityLiveRegion="polite">
            <Text style={styles.updateBannerText}>App updated successfully.</Text>
          </View>
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  appShell: {
    flex: 1,
  },
  screenArea: {
    flex: 1,
  },
  updateBanner: {
    position: 'absolute',
    bottom: spacing['4xl'],
    left: spacing.screenMargin,
    right: spacing.screenMargin,
    backgroundColor: colors.successText,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  updateBannerText: {
    ...typography.scale.body,
    color: colors.textInverse,
    fontWeight: '600',
  },
});
