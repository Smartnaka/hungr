import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';

interface SplashScreenProps {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: SplashScreenProps) {
  // Circle animation values
  const circleScale = useSharedValue(0);
  const circleOpacity = useSharedValue(0);

  // Text animation values (text slides up from below the circle)
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(24);

  // Full-screen fade out at the end
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    // Phase 1 (0–600 ms): white circle pops in with a bouncy spring
    circleOpacity.value = withTiming(1, { duration: 250 });
    circleScale.value = withSpring(1, { damping: 10, stiffness: 120 });

    // Phase 2 (450–850 ms): "hungr" text fades in and slides up into place
    textOpacity.value = withDelay(450, withTiming(1, { duration: 400 }));
    textTranslateY.value = withDelay(
      450,
      withSpring(0, { damping: 14, stiffness: 180 }),
    );

    // Phase 3 (1600–2000 ms): fade everything out, then call onDone
    containerOpacity.value = withDelay(
      1600,
      withTiming(0, { duration: 400 }, () => {
        runOnJS(onDone)();
      }),
    );
  }, [circleOpacity, circleScale, textOpacity, textTranslateY, containerOpacity, onDone]);

  const circleStyle = useAnimatedStyle(() => ({
    opacity: circleOpacity.value,
    transform: [{ scale: circleScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.content}>
        {/* Animated white circle */}
        <Animated.View style={[styles.circle, circleStyle]}>
          <Text style={styles.circleEmoji}>🍽️</Text>
        </Animated.View>

        {/* "hungr" text slides up from below the circle */}
        <Animated.View style={[styles.textWrapper, textStyle]}>
          <Text style={styles.brandText}>hungr</Text>
          <Text style={styles.tagline}>What should I eat?</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  content: {
    alignItems: 'center',
  },
  circle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    // Soft drop shadow so the circle lifts off the background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  circleEmoji: {
    fontSize: 64,
  },
  textWrapper: {
    marginTop: 28,
    alignItems: 'center',
  },
  brandText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1.5,
  },
  tagline: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.3,
  },
});
