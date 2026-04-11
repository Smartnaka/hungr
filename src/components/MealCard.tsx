import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  FadeIn,
  ZoomIn,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Meal } from '../data/meals';

interface MealCardProps {
  meal: Meal | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function MealCard({ meal, isFavorite, onToggleFavorite }: MealCardProps) {
  const emojiScale = useSharedValue(1);

  useEffect(() => {
    if (meal) {
      emojiScale.value = withSequence(
        withSpring(1.35, { damping: 8, stiffness: 300 }),
        withSpring(1, { damping: 10, stiffness: 200 }),
      );
    }
  }, [meal]);

  const emojiAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));

  if (!meal) {
    return (
      <LinearGradient
        colors={['#FFFFFF', '#FFF8F5']}
        style={[styles.card, styles.emptyCard]}
      >
        <Text style={styles.emptyEmoji}>🤔</Text>
        <Text style={styles.emptyText}>Tap the button{'\n'}to get a suggestion!</Text>
      </LinearGradient>
    );
  }

  return (
    <Animated.View entering={FadeIn.duration(220)} style={styles.cardWrapper}>
      <LinearGradient colors={['#FFFFFF', '#FFF8F5']} style={styles.card}>
        <Animated.Text style={[styles.emoji, emojiAnimStyle]}>{meal.emoji}</Animated.Text>
        <Text style={styles.mealName}>{meal.name}</Text>
        <Text style={styles.category}>{meal.category}</Text>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onToggleFavorite}
          activeOpacity={0.7}
        >
          <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
          <Text style={styles.favoriteText}>
            {isFavorite ? 'Saved to favorites' : 'Save to favorites'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    width: '100%',
  },
  card: {
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  emptyCard: {
    paddingVertical: 48,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  mealName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A2E',
    textAlign: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    lineHeight: 28,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFF5F5',
  },
  favoriteIcon: {
    fontSize: 16,
  },
  favoriteText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '500',
  },
});
