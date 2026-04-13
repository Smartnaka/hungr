import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { componentSizes } from '../../theme';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
  accessibilityLabel: string;
}

export default function IconButton({ icon, onPress, style, accessibilityLabel }: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={12}
      android_ripple={{ color: 'rgba(31,31,31,0.1)', borderless: true }}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: componentSizes.minTouchTarget,
    minWidth: componentSizes.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
});
