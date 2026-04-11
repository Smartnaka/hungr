import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Updates from 'expo-updates';
import HomeScreen from './src/screens/HomeScreen';
import SplashScreen from './src/screens/SplashScreen';

async function onFetchUpdateAsync() {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      Alert.alert(
        'Update ready',
        'A new version of hungr has been downloaded. Restart now to apply it.',
        [
          { text: 'Later', style: 'cancel' },
          {
            text: 'Restart',
            onPress: () => Updates.reloadAsync(),
          },
        ],
      );
    }
  } catch (error) {
    // Silently ignore update errors (e.g. in development / no network)
    if (__DEV__) {
      console.warn('OTA update check failed:', error);
    }
  }
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    void onFetchUpdateAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor="#FFF8F5" />
        {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
        <HomeScreen />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
