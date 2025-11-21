import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Recipe } from '@/types';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@/constants/theme';

interface ModernRecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
}

export const ModernRecipeCard: React.FC<ModernRecipeCardProps> = ({
  recipe,
  onPress,
  onFavoritePress,
  isFavorite = false,
}) => {
  const { t } = useTranslation();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const difficultyColor = {
    easy: COLORS.tagEasy,
    medium: COLORS.tagMedium,
    hard: COLORS.tagHard,
  }[recipe.difficulty];

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
          
          {/* Gradient Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
          
          {/* Difficulty Badge */}
          <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
            <Text style={styles.difficultyText}>{t(`common.${recipe.difficulty}`)}</Text>
          </View>
          
          {/* Time Badge */}
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={14} color={COLORS.textInverse} />
            <Text style={styles.timeText}>
              {t('common.minutes', { count: recipe.prepTime + recipe.cookTime })}
            </Text>
          </View>
          
          {/* Favorite Button */}
          {onFavoritePress && (
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={(e) => {
                e.stopPropagation();
                onFavoritePress();
              }}
            >
              <Ionicons 
                name={isFavorite ? 'heart' : 'heart-outline'} 
                size={20} 
                color={isFavorite ? COLORS.error : COLORS.textInverse} 
              />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {recipe.title}
          </Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Ionicons name="restaurant-outline" size={14} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{recipe.servings} servings</Text>
            </View>
            
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color={COLORS.warning} />
              <Text style={styles.ratingText}>4.8</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    margin: SPACING.sm,
    width: 160,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    height: 120,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  difficultyBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  difficultyText: {
    color: COLORS.textInverse,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  timeContainer: {
    position: 'absolute',
    bottom: SPACING.sm,
    left: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  timeText: {
    color: COLORS.textInverse,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '500',
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BORDER_RADIUS.round,
    padding: SPACING.xs,
  },
  content: {
    padding: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  metaText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  ratingText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text,
    fontWeight: '600',
  },
});