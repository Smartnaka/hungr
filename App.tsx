import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Updates from 'expo-updates';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './src/screens/HomeScreen';
import SplashScreen from './src/screens/SplashScreen';

const UPDATE_APPLIED_KEY = 'updateJustApplied';

/**
 * Silently download and apply any available OTA update.
 * Sets a flag in AsyncStorage before reloading so the next launch can show
 * a "just updated" confirmation to the user.
 */
async function onFetchUpdateAsync() {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      // Set a flag in AsyncStorage so the next launch can confirm the update
      // succeeded. This is done right before reloading so it only persists when
      // reloadAsync is actually invoked. (In the rare case where the device
      // loses power mid-reload the flag stays set, resulting in a one-time
      // false-positive banner — an acceptable trade-off for simplicity.)
      await AsyncStorage.setItem(UPDATE_APPLIED_KEY, 'true');
      await Updates.reloadAsync();
    }
  } catch (error) {
    // Silently ignore update errors (e.g. in development / no network)
    if (__DEV__) {
      console.warn('OTA update check failed:', error);
    }
  }
}

/**
 * Returns true (and clears the flag) if the app just restarted after applying
 * an OTA update, so we know to show the "updated" confirmation banner.
 */
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

  // Show the "updated" banner once the splash is gone and a new update is detected.
  useEffect(() => {
    if (splashDone && isNewUpdate) {
      setBannerVisible(true);
      const timer = setTimeout(() => setBannerVisible(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [splashDone, isNewUpdate]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor="transparent" translucent />
        {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
        <HomeScreen />
        {bannerVisible && (
          <View style={styles.updateBanner}>
            <Text style={styles.updateBannerText}>✓ App updated successfully!</Text>
          </View>
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  updateBanner: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#2D7D46',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  updateBannerText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
