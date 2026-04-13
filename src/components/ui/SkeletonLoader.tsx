import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { colors, radii, spacing } from '../../theme';

export default function SkeletonLoader() {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 280 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={styles.container} accessibilityLabel="Loading content">
      <Animated.View style={[styles.emoji, animatedStyle]} />
      <Animated.View style={[styles.title, animatedStyle]} />
      <Animated.View style={[styles.subtitle, animatedStyle]} />
      <Animated.View style={[styles.action, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
    gap: spacing.md,
  },
  emoji: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.gray200,
    alignSelf: 'center',
  },
  title: {
    height: 26,
    borderRadius: radii.sm,
    backgroundColor: colors.gray200,
  },
  subtitle: {
    width: '60%',
    height: 18,
    borderRadius: radii.sm,
    backgroundColor: colors.gray200,
    alignSelf: 'center',
  },
  action: {
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.gray200,
    marginTop: spacing.xs,
  },
});
