import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, withSequence, runOnJS } from 'react-native-reanimated';
import { colors, radii, spacing, typography } from '../theme';

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export default function Toast({ message, visible, onHide, duration = 2200 }: ToastProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);

  useEffect(() => {
    if (visible) {
      opacity.value = withSequence(
        withTiming(1, { duration: 180 }),
        withDelay(duration, withTiming(0, { duration: 220 }, () => runOnJS(onHide)())),
      );
      translateY.value = withTiming(0, { duration: 180 });
    } else {
      opacity.value = 0;
      translateY.value = 12;
    }
  }, [duration, message, onHide, opacity, translateY, visible]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animStyle]} accessibilityLiveRegion="polite">
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.screenMargin,
    marginBottom: spacing.xs,
    backgroundColor: colors.gray800,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  text: {
    ...typography.scale.body,
    color: colors.textInverse,
    textAlign: 'center',
  },
});
