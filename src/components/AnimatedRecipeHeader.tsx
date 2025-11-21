import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  interpolate,
  Extrapolate,
  useDerivedValue
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Recipe } from '@/types';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@/constants/theme';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.4;

interface AnimatedRecipeHeaderProps {
  recipe: Recipe;
  scrollY: Animated.SharedValue<number>;
  onBack: () => void;
  onFavorite: () => void;
  isFavorite: boolean;
}

export const AnimatedRecipeHeader: React.FC<AnimatedRecipeHeaderProps> = ({
  recipe,
  scrollY,
  onBack,
  onFavorite,
  isFavorite,
}) => {
  const { t } = useTranslation();

  // Derived values for animations
  const headerTranslateY = useDerivedValue(() => {
    return interpolate(scrollY.value, [0, HEADER_HEIGHT], [0, -HEADER_HEIGHT], Extrapolate.CLAMP);
  });

  const imageOpacity = useDerivedValue(() => {
    return interpolate(scrollY.value, [0, HEADER_HEIGHT * 0.5], [1, 0], Extrapolate.CLAMP);
  });

  const titleOpacity = useDerivedValue(() => {
    return interpolate(scrollY.value, [0, HEADER_HEIGHT * 0.3, HEADER_HEIGHT * 0.5], [0, 0, 1], Extrapolate.CLAMP);
  });

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: headerTranslateY.value }],
    };
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: imageOpacity.value,
    };
  });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
    };
  });

  return (
    <Animated.View style={[styles.container, headerAnimatedStyle]}>
      {/* Background Image with Gradient */}
      <Animated.Image 
        source={{ uri: recipe.imageUrl }} 
        style={[styles.image, imageAnimatedStyle]} 
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />

      {/* Top Navigation */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textInverse} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onFavorite}>
          <Ionicons 
            name={isFavorite ? 'heart' : 'heart-outline'} 
            size={24} 
            color={isFavorite ? COLORS.error : COLORS.textInverse} 
          />
        </TouchableOpacity>
      </View>

      {/* Bottom Content */}
      <View style={styles.bottomContent}>
        <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
          <Text style={styles.smallTitle} numberOfLines={1}>
            {recipe.title}
          </Text>
        </Animated.View>

        <View style={styles.mainContent}>
          <Text style={styles.title} numberOfLines={2}>
            {recipe.title}
          </Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color={COLORS.textInverse} />
              <Text style={styles.metaText}>
                {t('common.minutes', { count: recipe.prepTime + recipe.cookTime })}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="restaurant-outline" size={16} color={COLORS.textInverse} />
              <Text style={styles.metaText}>{recipe.servings} servings</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="trending-up-outline" size={16} color={COLORS.textInverse} />
              <Text style={styles.metaText}>{t(`common.${recipe.difficulty}`)}</Text>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  iconButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: BORDER_RADIUS.round,
    padding: SPACING.sm,
  },
  bottomContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  titleContainer: {
    marginBottom: SPACING.md,
  },
  smallTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.textInverse,
  },
  mainContent: {
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: '700',
    color: COLORS.textInverse,
    marginBottom: SPACING.md,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  metaText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textInverse,
    fontWeight: '500',
  },
});