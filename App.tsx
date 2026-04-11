import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Updates from 'expo-updates';
import HomeScreen from './src/screens/HomeScreen';

async function onFetchUpdateAsync() {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  } catch (error) {
    // Silently ignore update errors (e.g. in development / no network)
    if (__DEV__) {
      console.warn('OTA update check failed:', error);
    }
  }
}

export default function App() {
  useEffect(() => {
    void onFetchUpdateAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <HomeScreen />
    </SafeAreaProvider>
  );
}
