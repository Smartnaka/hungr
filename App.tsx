import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Updates from 'expo-updates';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './src/screens/HomeScreen';
import SplashScreen from './src/screens/SplashScreen';
import { colors, radii, spacing, typography } from './src/theme';

const UPDATE_APPLIED_KEY = 'updateJustApplied';

async function onFetchUpdateAsync() {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await AsyncStorage.setItem(UPDATE_APPLIED_KEY, 'true');
      await Updates.reloadAsync();
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('OTA update check failed:', error);
    }
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

  useEffect(() => {
    void onFetchUpdateAsync();
    void detectAndClearUpdateFlag().then(setIsNewUpdate);
  }, []);

  useEffect(() => {
    if (splashDone && isNewUpdate) {
      setBannerVisible(true);
      const timer = setTimeout(() => setBannerVisible(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [splashDone, isNewUpdate]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor="transparent" translucent />
        {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
        <HomeScreen />
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
