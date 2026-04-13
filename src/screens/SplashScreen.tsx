import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { colors, spacing, typography } from '../theme';

interface SplashScreenProps {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: SplashScreenProps) {
  const containerOpacity = useSharedValue(1);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    contentOpacity.value = withTiming(1, { duration: 260 });
    containerOpacity.value = withDelay(
      1600,
      withTiming(0, { duration: 260 }, () => {
        runOnJS(onDone)();
      }),
    );
  }, [containerOpacity, contentOpacity, onDone]);

  const containerStyle = useAnimatedStyle(() => ({ opacity: containerOpacity.value }));
  const contentStyle = useAnimatedStyle(() => ({ opacity: contentOpacity.value }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.content, contentStyle]}>
        <Text style={styles.emoji}>🍽️</Text>
        <Text style={styles.brandText}>hungr</Text>
        <Text style={styles.tagline}>Decide your next meal in seconds</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.ctaBackground,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  content: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  emoji: {
    fontSize: 56,
  },
  brandText: {
    ...typography.scale.display,
    color: colors.textInverse,
  },
  tagline: {
    ...typography.scale.bodyLarge,
    color: 'rgba(255,255,255,0.88)',
    textAlign: 'center',
  },
});
