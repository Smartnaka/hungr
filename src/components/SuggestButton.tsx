import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface SuggestButtonProps {
  onPress: () => void;
  isBroke: boolean;
}

export default function SuggestButton({ onPress, isBroke }: SuggestButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, isBroke && styles.brokeButton]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.inner}>
        <Text style={styles.icon}>{isBroke ? '💀' : '🍽️'}</Text>
        <Text style={styles.label}>Suggest Meal</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 40,
    width: '100%',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  brokeButton: {
    backgroundColor: '#2D2D2D',
    shadowColor: '#2D2D2D',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  icon: {
    fontSize: 18,
  },
  label: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
