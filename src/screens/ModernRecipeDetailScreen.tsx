import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { 
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedRecipeHeader } from '@/components/AnimatedRecipeHeader';
import { IngredientScaler } from '@/components/IngredientScaler';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCurrentRecipe, setLoading } from '@/store/slices/recipeSlice';
import { toggleFavorite } from '@/store/slices/authSlice';
import { firestoreService } from '@/services/firebase/firestore';
import { RootStackParamList } from '@/types';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SCREEN_PADDING } from '@/constants/theme';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.4;

type RecipeDetailScreenRouteProp = RouteProp<RootStackParamList, 'RecipeDetail'>;
type RecipeDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ModernRecipeDetailScreen() {
  const { t } = useTranslation();
  const route = useRoute<RecipeDetailScreenRouteProp>();
  const navigation = useNavigation<RecipeDetailScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { recipeId } = route.params;

  const { currentRecipe } = useAppSelector(state => state.recipe);
  const { user } = useAppSelector(state => state.auth);
  
  const scrollY = useSharedValue(0);
  const scrollViewRef = useRef<Animated.ScrollView>(null);

  const isFavorite = user?.favorites?.includes(recipeId) || false;

  useEffect(() => {
    loadRecipe();
  }, [recipeId]);

  const loadRecipe = async () => {
    dispatch(setLoading(true));
    try {
      const recipe = await firestoreService.recipes.getById(recipeId);
      dispatch(setCurrentRecipe(recipe));
    } catch (error) {
      console.error('Error loading recipe:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleFavorite = () => {
    if (user) {
      dispatch(toggleFavorite(recipeId));
      firestoreService.users.toggleFavorite(user.id, recipeId);
    }
  };

  const handleShare = async () => {
    if (!currentRecipe) return;
    
    try {
      await Share.share({
        message: t('common.shareRecipe', { title: currentRecipe.title }),
        url: `recipeapp://recipe/${recipeId}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(`recipeapp://recipe/${recipeId}`);
    // Show toast notification
    console.log(t('common.copiedToClipboard'));
  };

  if (!currentRecipe) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{t('common.loading')}</Text>
      </View>
    );
  }

  // Animated styles for content
  const contentAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [0, HEADER_HEIGHT * 0.5],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [{ translateY }],
    };
  });

  return (
    <View style={styles.container}>
      <AnimatedRecipeHeader
        recipe={currentRecipe}
        scrollY={scrollY}
        onBack={() => navigation.goBack()}
        onFavorite={handleFavorite}
        isFavorite={isFavorite}
      />

      <Animated.ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, contentAnimatedStyle]}>
          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.description}>{currentRecipe.description}</Text>
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('recipeDetail.ingredients')}</Text>
            <IngredientScaler
              ingredients={currentRecipe.ingredients}
              defaultServings={currentRecipe.servings}
            />
          </View>

          {/* Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('recipeDetail.instructions')}</Text>
            {currentRecipe.steps.map((step, index) => (
              <View key={step.id} style={styles.stepContainer}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepText}>{step.instruction}</Text>
                  {step.duration && (
                    <Text style={styles.stepDuration}>
                      {t('common.minutes', { count: step.duration })}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Tags */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('search.tags')}</Text>
            <View style={styles.tagsContainer}>
              {currentRecipe.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
      </Animated.ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.actionButton} onPress={handleFavorite}>
          <Ionicons 
            name={isFavorite ? 'heart' : 'heart-outline'} 
            size={24} 
            color={isFavorite ? COLORS.error : COLORS.text} 
          />
          <Text style={styles.actionText}>{t('recipeDetail.save')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleCopyLink}>
          <Ionicons name="copy-outline" size={24} color={COLORS.text} />
          <Text style={styles.actionText}>{t('common.copy')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color={COLORS.text} />
          <Text style={styles.actionText}>{t('recipeDetail.share')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: HEADER_HEIGHT,
  },
  content: {
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.surface,
    marginTop: -BORDER_RADIUS.xl,
    paddingTop: SPACING.lg,
    paddingHorizontal: SCREEN_PADDING,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  stepNumberText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '700',
    color: COLORS.textInverse,
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text,
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.md,
  },
  stepDuration: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  tag: {
    backgroundColor: COLORS.backgroundDark,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
  },
  tagText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  actionText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});