import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Recipe } from '@/types';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.md * 3) / 2;

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onPress,
  onFavoritePress,
  isFavorite = false,
}) => {
  const { t } = useTranslation();
  const scale = useSharedValue(1);
  const heartScale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const difficultyColor = {
    easy: COLORS.tagEasy,
    medium: COLORS.tagMedium,
    hard: COLORS.tagHard,
  }[recipe.difficulty];

  const animatedCardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      rotation.value,
      [0, 1],
      [0, 2],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotate}deg` }
      ],
    };
  });

  const animatedHeartStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: heartScale.value },
        { rotate: `${interpolate(heartScale.value, [1, 1.5], [0, 360])}deg` }
      ],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    rotation.value = withTiming(1, { duration: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    rotation.value = withTiming(0, { duration: 200 });
  };

  const handleFavorite = () => {
    heartScale.value = withSpring(1.5, {}, () => {
      heartScale.value = withSpring(1);
    });
    onFavoritePress?.();
  };

  return (
    <Animated.View style={[animatedCardStyle]}>
      <TouchableOpacity 
        style={styles.card} 
        onPress={onPress} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
          
          {/* Gradient Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.gradient}
          />
          
          {onFavoritePress && (
            <Animated.View style={[styles.favoriteButton, animatedHeartStyle]}>
              <TouchableOpacity
                onPress={handleFavorite}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={28}
                  color={isFavorite ? COLORS.error : COLORS.textInverse}
                />
              </TouchableOpacity>
            </Animated.View>
          )}
          
          <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
            <Text style={styles.difficultyText}>{t(`common.${recipe.difficulty}`)}</Text>
          </View>
          
          {/* Cooking Time Badge */}
          <View style={styles.timeBadge}>
            <Ionicons name="time-outline" size={14} color={COLORS.textInverse} />
            <Text style={styles.timeText}>
              {t('common.minutes', { count: recipe.prepTime + recipe.cookTime })}
            </Text>
          </View>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {recipe.title}
          </Text>
          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Ionicons name="restaurant-outline" size={16} color={COLORS.primary} />
              <Text style={styles.metaText}>{recipe.servings} servings</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={COLORS.warning} />
              <Text style={styles.ratingText}>4.8</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.lg,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.backgroundDark,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: BORDER_RADIUS.round,
    padding: SPACING.xs,
  },
  difficultyBadge: {
    position: 'absolute',
    bottom: SPACING.sm,
    left: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  difficultyText: {
    color: COLORS.textInverse,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  timeBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    color: COLORS.textInverse,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
  },
  content: {
    padding: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    lineHeight: TYPOGRAPHY.fontSize.lg * 1.3,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text,
    fontWeight: '600',
  },
  metaText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});